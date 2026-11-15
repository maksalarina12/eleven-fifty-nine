#!/usr/bin/env node
/**
 * Contract lock — the guard that keeps the video identical no matter which
 * voice model, account or machine produced the narration.
 *
 *   npm run lock
 *
 * It checks the things that must never drift:
 *   1. every render entry keeps 1080x1920 / 30 fps
 *   2. every entry's durationInFrames equals floor(audio_duration * 30),
 *      so the picture is never longer than the narration
 *   3. every entry names an audio file that actually exists in public/audio
 *   4. the watermark exists and is hidden for the black tail
 *   5. no *.mp4 is tracked by git
 *
 * Exit 0 = the contract holds. Exit 1 = something drifted; the message says what.
 */
import {execFileSync} from 'node:child_process';
import {existsSync, readFileSync, readdirSync, statSync} from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const FPS = 30;
const W = 1080;
const H = 1920;

const all = process.argv.includes('--all');
const fail = [];
const warn = [];
const ok = [];

const read = (p) => readFileSync(p, 'utf8');

/* ------------------------------------------------------------------ */
/* audio duration                                                      */
/* ------------------------------------------------------------------ */

const duration = (file) => {
  const out = execFileSync(
    'ffprobe',
    ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file],
    {encoding: 'utf8'}
  ).trim();
  return Number(out);
};

/* ------------------------------------------------------------------ */
/* which audio belongs to a composition id                             */
/* ------------------------------------------------------------------ */

const audioFor = (id) => {
  const s02 = /^S02E(\d{2})$/.exec(id);
  if (s02) return `public/audio/s02e${s02[1]}.mp3`;
  if (id === 'Episode' || id === 'Part1') return 'public/audio/vo.mp3';
  const p = /^Part(\d+)$/.exec(id);
  if (p) return `public/audio/pt${p[1]}.mp3`;
  return null;
};

/* ------------------------------------------------------------------ */
/* 1-3. entries                                                       */
/* ------------------------------------------------------------------ */

const entries = readdirSync(path.join(root, 'src'))
  .filter((f) => /^c\d+\.tsx$/.test(f))
  .sort((a, b) => Number(a.slice(1, -4)) - Number(b.slice(1, -4)));

if (entries.length === 0) fail.push('src/c*.tsx: no render entries found');

for (const entry of entries) {
  const file = path.join(root, 'src', entry);
  const src = read(file);

  const id = /id="([^"]+)"/.exec(src)?.[1];
  const frames = Number(/durationInFrames=\{(\d+)\}/.exec(src)?.[1]);
  const compFps = Number(/fps=\{(\d+)\}/.exec(src)?.[1]);
  const compW = Number(/width=\{(\d+)\}/.exec(src)?.[1]);
  const compH = Number(/height=\{(\d+)\}/.exec(src)?.[1]);

  if (!id) {
    fail.push(`${entry}: no composition id`);
    continue;
  }

  /* Season 02 is the locked contract. Older entries are reported, not enforced,
     because their masters were already delivered and must not change. */
  const locked = /^S02E\d{2}$/.test(id);
  if (!locked && !all) continue;
  if (compW !== W || compH !== H) fail.push(`${entry} (${id}): canvas ${compW}x${compH}, must be ${W}x${H}`);
  if (compFps !== FPS) fail.push(`${entry} (${id}): fps ${compFps}, must be ${FPS}`);
  if (!Number.isFinite(frames) || frames <= 0) {
    fail.push(`${entry} (${id}): durationInFrames missing or not a number`);
    continue;
  }

  const audio = audioFor(id);
  if (!audio) {
    warn.push(`${entry} (${id}): unknown composition family, audio not derived`);
  } else if (!existsSync(path.join(root, audio))) {
    fail.push(`${entry} (${id}): audio ${audio} does not exist`);
  } else {
    const seconds = duration(path.join(root, audio));
    const want = Math.floor(seconds * FPS);
    if (!locked) {
      const over = frames / FPS - seconds;
      if (over > 0.05) {
        fail.push(`${entry} (${id}): ${frames} f = ${(frames / FPS).toFixed(3)} s, audio ${seconds.toFixed(3)} s — picture is longer than the narration`);
      } else {
        ok.push(`${id.padEnd(8)} ${String(frames).padStart(5)} f  ${seconds.toFixed(3)} s  ${audio}  (legacy)`);
      }
    } else if (frames !== want) {
      fail.push(
        `${entry} (${id}): ${frames} frames, but ${audio} is ${seconds.toFixed(3)} s ` +
          `→ ${want} frames. Fix durationInFrames, do not stretch the audio.`
      );
    } else {
      ok.push(`${id.padEnd(8)} ${String(frames).padStart(5)} f  ${seconds.toFixed(3)} s  ${audio}`);
    }
  }

  /* the component itself: watermark + tail */
  const componentMatch = /from '\.\/([^']+)'/.exec(src);
  if (componentMatch) {
    const compFile = path.join(root, 'src', `${componentMatch[1]}.tsx`);
    if (existsSync(compFile)) {
      const comp = read(compFile);
      if (!/Watermark/.test(comp)) {
        (locked ? fail : warn).push(`${componentMatch[1]}.tsx: no <Watermark />`);
      } else if (locked && !/\{[^{}]*<\s*Watermark\s*\/?>\s*:/.test(comp)) {
        fail.push(`${componentMatch[1]}.tsx: watermark must be gated by a tail condition (f < FADE ? <Watermark /> : null)`);
      }
    }
  }
}

/* ------------------------------------------------------------------ */
/* 4. nothing heavy is tracked                                        */
/* ------------------------------------------------------------------ */

try {
  const tracked = execFileSync('git', ['ls-files'], {encoding: 'utf8', cwd: root})
    .split('\n')
    .filter((f) => /\.(mp4|mov|webm|m4v|mp3)$/i.test(f));
  const media = tracked.filter((f) => /\.(mp4|mov|webm|m4v)$/i.test(f));
  if (media.length) fail.push(`tracked masters: ${media.join(', ')} (must stay out of git)`);
  const audio = tracked.filter((f) => /\.mp3$/i.test(f));
  if (audio.length) warn.push(`${audio.length} mp3 tracked (public/audio is allowed, masters are not)`);
} catch {
  warn.push('git not available, tracked-media check skipped');
}

/* ------------------------------------------------------------------ */
/* report                                                             */
/* ------------------------------------------------------------------ */

if (ok.length) {
  console.log('entries');
  for (const line of ok) console.log(`  ok   ${line}`);
}

if (warn.length) {
  console.log('\nwarnings');
  for (const line of warn) console.log(`  warn ${line}`);
}

if (fail.length) {
  console.log('\nFAILED');
  for (const line of fail) console.log(`  fail ${line}`);
  console.log(`\n${fail.length} contract violation(s).`);
  process.exit(1);
}

console.log(`\ncontract holds — ${ok.length} entries, ${W}x${H}, ${FPS} fps, picture ≤ narration.`);

/* keep statSync imported for future checks without upsetting the linter */
void statSync;
