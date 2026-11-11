#!/usr/bin/env node
/**
 * Point the release desk at anyone's videos.
 *
 *   npm run setup                      # interactive, scans HASIL/ or ./videos
 *   npm run setup -- --dir ~/clips     # point at another folder
 *   npm run setup -- --dir clips --series "My Show" --handle @me --langs en
 *
 * Writes publish/config.json (series block + video folder) and
 * publish/episodes.json (one entry per video, existing copy preserved), and
 * creates .env from the template when it is missing.
 */
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {parseArgs, readJson, writeFile, log} from './lib/util.mjs';
import {draftEpisodes, listVideos, formatRuntime} from './lib/episodes.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const args = parseArgs();

const configPath = path.resolve(here, 'config.json');
const readSafe = (file) => {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return null;
  }
};

const existing = readSafe(configPath) || {};
const episodesFile = path.resolve(here, existing.episodesFile || 'episodes.json');
const existingEpisodes = Array.isArray(readSafe(episodesFile)) ? readSafe(episodesFile) : [];

const DEFAULT_CONFIG = {
  series: {
    name: 'My Series',
    season: 'S01',
    handle: '@yourhandle',
    kind: 'short-form video series',
    watermark: '',
    baseTags: ['#shorts', '#video', '#story'],
  },
  languages: ['en'],
  defaultLanguage: 'en',
  videoDir: 'videos',
  episodesFile: 'episodes.json',
  outputDir: 'publish/out',
  llm: {
    provider: 'openai-compatible',
    baseUrl: 'https://api.openai.com/v1',
    model: 'gpt-4o-mini',
    temperature: 0.85,
    maxTokens: 2400,
  },
  style: {
    tone: 'cinematic, restrained, cold. No hype words, no emoji spam, no clickbait that the video cannot deliver.',
    emojiMax: 1,
    spoilerFree: true,
    instructions: [
      'Never reveal the ending or the central twist of the episode.',
      'Always keep the series name and part number findable in the copy.',
      'Hashtags must be chosen from the allowed pool only. Do not invent tags.',
      'Do not claim the video contains something it does not (no fake giveaways, no fake dates).',
      'Do not mention AI tools, rendering engines, or that the episode was made with code.',
    ],
  },
  platforms: {
    youtube: {enabled: true, maxTags: 12},
    tiktok: {enabled: true, maxTags: 6},
    instagram: {enabled: true, maxTags: 12},
    facebook: {enabled: true, maxTags: 4},
    x: {enabled: true, maxTags: 3},
  },
};

/* ------------------------------- prompts -------------------------------- */

const interactive = process.stdin.isTTY && !args.yes;

async function ask(question, fallback) {
  if (!interactive) return fallback;
  const {createInterface} = await import('node:readline/promises');
  const rl = createInterface({input: process.stdin, output: process.stdout});
  try {
    const answer = (await rl.question(`${question}${fallback ? ` [${fallback}]` : ''}: `)).trim();
    return answer || fallback;
  } finally {
    rl.close();
  }
}

/* -------------------------------- inputs -------------------------------- */

const hasFfmpeg = (() => {
  try {
    execFileSync('ffmpeg', ['-version'], {stdio: 'ignore', timeout: 8000});
    return true;
  } catch {
    return false;
  }
})();

const defaultSeries = existing.series || DEFAULT_CONFIG.series;
const seriesName = args.series || (await ask('Series name', defaultSeries.name));
const handle = args.handle || (await ask('Handle', defaultSeries.handle));

// Watermark and genre belong to a series, not to the machine: do not carry the
// previous series' branding over when the name changed.
const sameSeries = seriesName === defaultSeries.name;
const kind = args.kind || (sameSeries ? defaultSeries.kind : null) || DEFAULT_CONFIG.series.kind;
const watermark =
  args.watermark ?? (sameSeries ? defaultSeries.watermark ?? '' : seriesName.replace(/[^A-Za-z0-9]/g, ''));
const langs = (args.langs ? String(args.langs).split(',') : existing.languages || DEFAULT_CONFIG.languages)
  .map((lang) => lang.trim())
  .filter(Boolean);

const suggestedDir = args.dir || existing.videoDir || (fs.existsSync(path.join(root, 'videos')) ? 'videos' : 'HASIL');
const dirInput = await ask('Folder with your videos', suggestedDir);
const dirAbs = path.resolve(root, dirInput);
if (!fs.existsSync(dirAbs)) {
  console.error(`\n  Folder not found: ${dirAbs}`);
  console.error('  Create it, put your MP4s inside, then run this again.\n');
  process.exit(1);
}

const videos = listVideos(dirAbs);
if (!videos.length) {
  console.error(`\n  No videos in ${dirAbs}`);
  console.error('  Supported: .mp4 .mov .m4v .webm\n');
  process.exit(1);
}

const tagDefault = (existing.series?.baseTags || []).length
  ? existing.series.baseTags.join(',')
  : `#${seriesName.toLowerCase().replace(/[^a-z0-9]+/g, '')},${DEFAULT_CONFIG.series.baseTags.join(',')}`;
const tags = (args.tags ? String(args.tags) : await ask('Hashtag pool (comma separated)', tagDefault))
  .split(',')
  .map((tag) => tag.trim())
  .filter(Boolean)
  .map((tag) => (tag.startsWith('#') ? tag : `#${tag}`));

/* ------------------------------- posters -------------------------------- */

function extractPoster(video, part, index) {
  const target = path.join(dirAbs, `poster${part || index + 1}.jpg`);
  if (fs.existsSync(target)) return path.basename(target);
  if (!hasFfmpeg) return null;
  try {
    execFileSync(
      'ffmpeg',
      ['-y', '-ss', '1', '-i', video.abs, '-frames:v', '1', '-vf', 'scale=540:-2', '-q:v', '3', target],
      {stdio: 'ignore', timeout: 60000}
    );
    return fs.existsSync(target) ? path.basename(target) : null;
  } catch {
    return null;
  }
}

const wantPosters = args.poster !== false && args['no-poster'] !== true && !args['dry-run'];
const drafts = draftEpisodes({dir: dirAbs});
if (wantPosters && hasFfmpeg) {
  for (const [index, entry] of drafts.entries()) {
    if (entry.poster) continue;
    entry.poster = extractPoster({abs: path.join(dirAbs, entry.file)}, entry.part, index);
  }
}

/* -------------------------------- merge --------------------------------- */

const oldByFile = new Map(existingEpisodes.map((entry) => [entry.file, entry]));
const merged = drafts.map((draft) => {
  const old = oldByFile.get(draft.file);
  if (!old) return draft;
  return {
    ...old,
    part: old.part ?? draft.part,
    key: old.key || draft.key,
    title: old.title || draft.title,
    poster: old.poster || draft.poster,
    runtime: old.runtime || draft.runtime,
  };
});

const dropped = existingEpisodes.filter((entry) => !drafts.some((draft) => draft.file === entry.file));
merged.sort((a, b) => (a.part ?? 0) - (b.part ?? 0));

const relDir = path.relative(root, dirAbs) || '.';
const config = {
  ...DEFAULT_CONFIG,
  ...existing,
  series: {
    name: seriesName,
    season: existing.series?.season || DEFAULT_CONFIG.series.season,
    handle,
    kind,
    watermark,
    baseTags: tags,
  },
  languages: langs,
  defaultLanguage: langs[0] || 'en',
  videoDir: relDir.startsWith('..') ? dirAbs : relDir,
  episodesFile: existing.episodesFile || 'episodes.json',
  outputDir: existing.outputDir || DEFAULT_CONFIG.outputDir,
};

/* -------------------------------- report -------------------------------- */

console.log('');
console.log(`  ${videos.length} video(s) in ${dirAbs}`);
console.log('');
console.log('  PART  TITLE                          RUNTIME  FILE');
console.log('  ' + '-'.repeat(84));
for (const entry of merged) {
  const title = String(entry.title || '').slice(0, 30).padEnd(31);
  const runtime = String(entry.runtime || '—').slice(0, 12).padEnd(13);
  console.log(`  ${String(entry.part).padStart(4)}  ${title}${runtime}${entry.file}`);
}
console.log('');

if (dropped.length) {
  console.log(`  ${dropped.length} old entr${dropped.length === 1 ? 'y' : 'ies'} no longer match a file and will be dropped:`);
  for (const entry of dropped) console.log(`   - ${entry.file}`);
  console.log('');
}

if (args['dry-run']) {
  log('dry run', 'nothing written');
  console.log(JSON.stringify({config, episodes: merged}, null, 2));
  process.exit(0);
}

/* -------------------------------- write --------------------------------- */

if (fs.existsSync(configPath)) {
  fs.copyFileSync(configPath, `${configPath}.bak`);
}
writeFile(configPath, JSON.stringify(config, null, 2) + '\n');
log('config', `series "${seriesName}" · ${langs.join(', ')} · videos in ${config.videoDir}/`);

if (Array.isArray(readSafe(episodesFile)) && readSafe(episodesFile).length) {
  fs.copyFileSync(episodesFile, `${episodesFile}.bak`);
}
writeFile(episodesFile, JSON.stringify(merged, null, 2) + '\n');
log('episodes', `${merged.length} entr${merged.length === 1 ? 'y' : 'ies'} → ${path.relative(root, episodesFile)}`);

const envPath = path.join(root, '.env');
if (!fs.existsSync(envPath)) {
  const template = path.join(here, '.env.example');
  if (fs.existsSync(template)) {
    fs.copyFileSync(template, envPath);
    fs.chmodSync(envPath, 0o600);
    log('env', 'created .env from the template (chmod 600)');
  }
}

const longest = merged.reduce((max, entry) => Math.max(max, Number(entry.runtime?.split(':')[0] || 0)), 0);
if (!hasFfmpeg) {
  log('note', 'ffmpeg not found — runtimes and posters were skipped');
} else if (!wantPosters) {
  log('note', 'posters skipped (--no-poster)');
} else if (longest > 3) {
  log('note', 'videos are longer than 3 minutes — some platforms will reject them');
}

console.log('');
console.log('  next');
console.log('    npm run dashboard              # open the desk');
console.log('    npm run pack -- --episode 1    # captions for the first video');
console.log('    npm run doctor                 # which accounts are linked');
console.log('    npm run setup -- --dir <dir>   # add more videos later');
console.log('');
