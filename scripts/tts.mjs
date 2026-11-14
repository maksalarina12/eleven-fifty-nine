#!/usr/bin/env node
/**
 * ElevenLabs narration, straight from the terminal.
 *
 *   npm run tts -- --voices                     list the voices on your account
 *   npm run tts -- --models                     list the models you can call
 *   npm run tts -- --text "..." --voice Amara   synth to out/tts.mp3
 *   npm run tts -- --part 11 --file script.md   synth to BAHAN/pt11/pt11.mp3
 *                                              and copy into public/audio/
 *
 * The key lives in .env at the repository root:
 *   ELEVENLABS_API_KEY=sk_...
 *
 * Nothing here is installed: Node 24 has fetch, and ffmpeg (already required by
 * the pack scripts) joins the chunks.
 */
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {loadEnv, parseArgs} from '../publish/lib/util.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const API = 'https://api.elevenlabs.io/v1';

const DEFAULTS = {
  model: 'eleven_multilingual_v2',
  format: 'mp3_44100_128',
  stability: '0.5',
  similarity: '0.8',
  style: '0',
  speed: '1',
};

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */

const args = parseArgs();
const env = loadEnv(path.join(root, '.env'));
const KEY = process.env.ELEVENLABS_API_KEY || env.ELEVENLABS_API_KEY;

function die(message, hint) {
  console.error(`\n  ${message}`);
  if (hint) console.error(`  ${hint}`);
  console.error('');
  process.exit(1);
}

async function api(pathname, options = {}) {
  if (!KEY) {
    die(
      'ELEVENLABS_API_KEY is not set.',
      "Put it in .env at the repo root:  echo 'ELEVENLABS_API_KEY=sk_...' >> .env"
    );
  }
  const res = await fetch(`${API}${pathname}`, {
    ...options,
    headers: {
      'xi-api-key': KEY,
      ...(options.body ? {'content-type': 'application/json'} : {}),
      ...(options.headers || {}),
    },
    signal: AbortSignal.timeout(180000),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    let detail = body.slice(0, 400);
    try {
      const parsed = JSON.parse(body);
      detail = parsed.detail?.message || parsed.detail?.status || detail;
      if (parsed.detail?.code) detail += ` (${parsed.detail.code})`;
    } catch {
      /* leave the raw text */
    }
    die(`ElevenLabs ${res.status}: ${detail || res.statusText}`);
  }
  return res;
}

/** Markdown in, narration out: headings and emphasis markers would be read. */
function toSpeech(markdown) {
  return markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/^\s{0,3}#{1,6}\s+/gm, '')
    .replace(/^\s{0,3}>\s?/gm, '')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/\*\*|__|\*|_|`/g, '')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/** Split on paragraph, then sentence, so no request is over the model limit. */
function chunk(text, limit) {
  if (text.length <= limit) return [text];
  const out = [];
  let buffer = '';
  const push = (piece) => {
    if ((buffer + piece).length <= limit) {
      buffer += piece;
      return;
    }
    if (buffer.trim()) out.push(buffer.trim());
    buffer = piece;
    while (buffer.length > limit) {
      const cut = buffer.lastIndexOf(' ', limit);
      const at = cut > limit * 0.5 ? cut : limit;
      out.push(buffer.slice(0, at).trim());
      buffer = buffer.slice(at);
    }
  };
  for (const paragraph of text.split(/\n{2,}/)) {
    for (const sentence of paragraph.split(/(?<=[.!?])\s+/)) {
      push(`${sentence} `);
    }
    push('\n');
  }
  if (buffer.trim()) out.push(buffer.trim());
  return out;
}

function duration(file) {
  try {
    const value = execFileSync(
      'ffprobe',
      ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file],
      {encoding: 'utf8'}
    ).trim();
    return Number(value);
  } catch {
    return 0;
  }
}

function joinChunks(files, out) {
  if (files.length === 1) {
    fs.copyFileSync(files[0], out);
    return;
  }
  const list = `${out}.txt`;
  fs.writeFileSync(list, files.map((f) => `file '${f.replace(/'/g, "'\\''")}'`).join('\n'));
  try {
    execFileSync('ffmpeg', ['-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', out], {
      stdio: 'inherit',
    });
  } catch {
    // same codec, same rate: raw frame concat is fine as a fallback
    fs.writeFileSync(out, Buffer.concat(files.map((f) => fs.readFileSync(f))));
  } finally {
    fs.rmSync(list, {force: true});
  }
}

function modelLimit(model) {
  if (model.startsWith('eleven_v3')) return 3000;
  if (model.startsWith('eleven_flash')) return 40000;
  if (model.startsWith('eleven_turbo')) return 30000;
  return 9000;
}

/* ------------------------------------------------------------------ */
/* commands                                                            */
/* ------------------------------------------------------------------ */

async function listVoices() {
  const res = await api('/voices?page_size=100');
  const data = await res.json();
  const voices = data.voices || [];
  console.log(`\n${voices.length} voice${voices.length === 1 ? '' : 's'} on this account\n`);
  const width = Math.max(6, ...voices.map((v) => v.name.length));
  for (const voice of voices) {
    const labels = Object.values(voice.labels || {}).filter(Boolean).join(' · ');
    console.log(
      `  ${voice.name.padEnd(width)}  ${voice.voice_id}  ${voice.category || ''}${labels ? `  — ${labels}` : ''}`
    );
  }
  try {
    const sub = await (await api('/user/subscription')).json();
    const used = sub.character_count ?? 0;
    const limit = sub.character_limit ?? 0;
    console.log(`\n  credits: ${used.toLocaleString()} / ${limit.toLocaleString()} used this period`);
  } catch {
    /* usage is a nice-to-have */
  }
  console.log('\n  use a name or an id:  npm run tts -- --voice "Amara" --text "..."\n');
}

async function listModels() {
  const data = await (await api('/models')).json();
  console.log('\n  model id                          chars   languages');
  for (const model of data) {
    const chars = model.max_characters_request_free ?? model.max_characters_request ?? '—';
    console.log(`  ${String(model.model_id).padEnd(32)}  ${String(chars).padEnd(6)}  ${model.languages?.length ?? '—'}`);
  }
  console.log('');
}

async function resolveVoice(nameOrId) {
  if (!nameOrId) {
    die(
      'No voice given.',
      'Run  npm run tts -- --voices  to see the voices on your account, then pass --voice <name|id>.'
    );
  }
  if (/^[A-Za-z0-9]{15,}$/.test(nameOrId) && !nameOrId.includes(' ')) return nameOrId;
  const data = await (await api('/voices?page_size=100')).json();
  const voices = data.voices || [];
  const needle = nameOrId.toLowerCase();
  const hit =
    voices.find((v) => v.name.toLowerCase() === needle) ||
    voices.find((v) => v.voice_id === nameOrId) ||
    voices.find((v) => v.name.toLowerCase().includes(needle));
  if (!hit) {
    die(
      `No voice matches "${nameOrId}".`,
      `Available: ${voices.map((v) => v.name).join(', ') || '(none)'}`
    );
  }
  return hit.voice_id;
}

async function synth() {
  const part = args.part ? String(args.part).replace(/[^0-9]/g, '') : null;
  let text = args.text || '';
  let source = 'text';

  if (args.file) {
    const file = path.resolve(root, String(args.file));
    if (!fs.existsSync(file)) die(`No such file: ${file}`);
    text = fs.readFileSync(file, 'utf8');
    source = path.relative(root, file);
  } else if (part) {
    // --part 11 picks up BAHAN/pt11/*.md or *.txt when there is exactly one
    const dir = ['BAHAN/pt' + part, 'BAHAN/pt ' + part].map((d) => path.join(root, d)).find((d) => fs.existsSync(d));
    if (dir) {
      const scripts = fs.readdirSync(dir).filter((f) => /\.(md|txt)$/i.test(f));
      if (scripts.length === 1) {
        text = fs.readFileSync(path.join(dir, scripts[0]), 'utf8');
        source = path.relative(root, path.join(dir, scripts[0]));
      } else if (scripts.length > 1) {
        die(`Several scripts in ${path.relative(root, dir)}.`, 'Pass one explicitly with --file.');
      }
    }
  }

  if (!text.trim()) {
    die(
      'Nothing to say.',
      'Pass --text "…", or --file <script.md>, or --part 11 to read BAHAN/pt11/*.md.'
    );
  }
  if (!args.raw) text = toSpeech(text);

  const wantedVoice = args.voice || process.env.ELEVENLABS_VOICE || env.ELEVENLABS_VOICE;
  const model = String(args.model || env.ELEVENLABS_MODEL || DEFAULTS.model);
  const format = String(args.format || DEFAULTS.format);
  const out = path.resolve(root, String(args.out || (part ? `BAHAN/pt${part}/pt${part}.mp3` : 'out/tts.mp3')));
  const settings = {
    stability: Number(args.stability ?? DEFAULTS.stability),
    similarity_boost: Number(args.similarity ?? DEFAULTS.similarity),
    style: Number(args.style ?? DEFAULTS.style),
    use_speaker_boost: !args['no-boost'],
    speed: Number(args.speed ?? DEFAULTS.speed),
  };

  const chunks = chunk(text, modelLimit(model));
  const total = text.length;
  console.log(`\n  voice    ${wantedVoice || '(none — run --voices)'}`);
  console.log(`  model    ${model}`);
  console.log(`  text     ${total.toLocaleString()} characters from ${source}${chunks.length > 1 ? ` (${chunks.length} requests)` : ''}`);
  console.log(`  out      ${path.relative(root, out)}`);
  if (args['dry-run']) {
    console.log(`\n  dry run — ${total.toLocaleString()} credits would be spent, nothing sent\n`);
    return;
  }

  const voiceId = await resolveVoice(wantedVoice);
  fs.mkdirSync(path.dirname(out), {recursive: true});
  const tmp = fs.mkdtempSync(path.join(root, 'out', 'tts-'));
  const files = [];
  try {
    for (let i = 0; i < chunks.length; i++) {
      const body = {
        text: chunks[i],
        model_id: model,
        voice_settings: settings,
      };
      if (args.language) body.language_code = String(args.language);
      if (i > 0) body.previous_text = chunks[i - 1].slice(-400);
      if (i < chunks.length - 1) body.next_text = chunks[i + 1].slice(0, 400);

      process.stdout.write(`  rendering ${i + 1}/${chunks.length}…\r`);
      const res = await api(`/text-to-speech/${voiceId}?output_format=${encodeURIComponent(format)}`, {
        method: 'POST',
        body: JSON.stringify(body),
      });
      const buffer = Buffer.from(await res.arrayBuffer());
      if (buffer.length < 2000) {
        die(`Response looks empty (${buffer.length} bytes).`, String(buffer).slice(0, 300));
      }
      const file = path.join(tmp, `chunk-${String(i).padStart(3, '0')}.mp3`);
      fs.writeFileSync(file, buffer);
      files.push(file);
    }
    joinChunks(files, out);
  } finally {
    fs.rmSync(tmp, {recursive: true, force: true});
  }

  const seconds = duration(out);
  const size = fs.statSync(out).size;
  console.log(`  done     ${path.relative(root, out)}`);
  console.log(`  length   ${seconds ? seconds.toFixed(3) + ' s' : 'unknown'}${seconds ? ` → ${Math.round(seconds * 30)} frames @30fps` : ''}, ${(size / 1024 / 1024).toFixed(1)} MB\n`);

  if (part) {
    const target = path.join(root, 'public', 'audio', `pt${part}.mp3`);
    fs.mkdirSync(path.dirname(target), {recursive: true});
    fs.copyFileSync(out, target);
    console.log(`  copied   ${path.relative(root, target)}`);
    console.log(`  wire it: src/c${Number(part) + 5}.tsx  durationInFrames={${seconds ? Math.round(seconds * 30) : '…'}}\n`);
  }
}

/* ------------------------------------------------------------------ */

if (args.voices || args._[0] === 'voices') await listVoices();
else if (args.models || args._[0] === 'models') await listModels();
else if (args.help || args._[0] === 'help') {
  console.log(`
  npm run tts -- --voices
  npm run tts -- --models
  npm run tts -- --text "Deep beneath the laboratory…" --voice Amara
  npm run tts -- --part 11 --voice Amara
  npm run tts -- --part 11 --file BAHAN/pt11/script.md --dry-run

  flags  --voice <name|id>   --model <id>   --out <file>   --file <script>
         --part <n>          --text "…"     --format mp3_44100_128
         --stability 0.5     --similarity 0.8   --style 0     --speed 1
         --language <code>   --raw (keep markdown)   --no-boost
         --dry-run (price only, no credits spent)
`);
} else await synth();
