#!/usr/bin/env node
/**
 * Generate a publish pack for one episode: captions + hashtags per platform,
 * a review page you can edit and copy from, and plain .txt files for each app.
 *
 *   node publish/generate.mjs --episode 5
 *   node publish/generate.mjs --episode 5 --lang id --open
 *   node publish/generate.mjs --episode 5 --no-llm
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {loadEnv, readJson, writeFile, parseArgs, parseList, openInBrowser, clip, log} from './lib/util.mjs';
import {PLATFORM_KEYS, PLATFORMS, compose, validate} from './lib/platforms.mjs';
import {buildPrompt} from './lib/prompts.mjs';
import {chatJSON, hasLLM, templateCaptions, normalizeCaptions} from './lib/llm.mjs';
import {buildReviewHtml} from './lib/review.mjs';
import {loadEpisodes} from './lib/episodes.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');

loadEnv(path.join(root, '.env'));

const args = parseArgs();
const config = readJson(path.join(here, 'config.json'));
const catalog = loadEpisodes({root, publishDir: here, config});
const episodes = catalog.episodes;

if (!episodes.length) {
  const where = path.resolve(root, args.dir || config.videoDir || '.');
  console.error(`No videos found in ${where}`);
  console.error('Put MP4s there, or point the desk at another folder: npm run setup -- --dir <folder>');
  process.exit(1);
}

const wanted = String(args.episode ?? args.e ?? episodes[0].part).toLowerCase();
const episode = episodes.find(
  (e) => e.key === wanted || String(e.part) === wanted || String(e.part) === wanted.replace(/^ep0*/, '')
);
if (!episode) {
  console.error(`Episode "${wanted}" not found. Known: ${episodes.map((e) => `${e.part} (${e.key})`).join(', ')}`);
  process.exit(1);
}

const languages = args.lang ? parseList(args.lang) : config.languages;
const missingBrief = languages.filter((l) => {
  const e = episode[l];
  return !(e && (e.logline || e.hook || (e.beats || []).length || e.cta));
});
if (missingBrief.length) {
  log('copy', `no written brief for ${missingBrief.join(', ')} — using generic copy`);
}

const videoDir = path.resolve(root, args.dir || config.videoDir || '.');
const videoAbs = path.resolve(root, args.video || path.join(videoDir, episode.file));
if (!fs.existsSync(videoAbs)) console.warn(`! video not found: ${videoAbs}`);

const outDir = path.join(path.resolve(root, args.out || config.outputDir), episode.key);
fs.mkdirSync(outDir, {recursive: true});

const seed = Number(args.seed || 0) || Math.floor(Math.random() * 9000) + 100;

log('episode', `Part ${episode.part} — ${episode.title}${episode.alias ? ` / ${episode.alias}` : ''} (${episode.key})`);

const fallback = templateCaptions({config, episode, languages});
let captions = fallback;
let mode = 'template';

if (!args['no-llm'] && hasLLM()) {
  const {system, user} = buildPrompt({config, episode, languages, seed});
  const modelLabel = process.env.LLM_MODEL || config.llm.model;
  const t0 = Date.now();
  log('llm', `asking ${modelLabel} (seed ${seed})`);
  try {
    const raw = await chatJSON({config, system, user});
    captions = normalizeCaptions(raw, {config, episode, languages, fallback});
    mode = `llm:${modelLabel}`;
    log('llm', `ok in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
  } catch (error) {
    console.warn(`! LLM failed (${error.message}). Falling back to template copy.`);
    mode = 'template (llm failed)';
  }
} else if (!args['no-llm']) {
  log('llm', 'no LLM_API_KEY — using built-in template copy');
}

// ---- validate and collect anything the author must fix -------------------
const warnings = [];
const report = {};
for (const lang of languages) {
  for (const key of PLATFORM_KEYS) {
    const result = validate(key, captions[lang][key], config);
    report[`${lang}/${key}`] = result;
    for (const error of result.errors) warnings.push(error);
    for (const note of result.notes) warnings.push(note);
  }
}

// ---- write the pack -------------------------------------------------------
const stampNow = new Date();
const p2 = (n) => String(n).padStart(2, '0');
const generatedAt = `${stampNow.getFullYear()}-${p2(stampNow.getMonth() + 1)}-${p2(stampNow.getDate())} ${p2(stampNow.getHours())}:${p2(stampNow.getMinutes())}`;
const pack = {
  series: config.series?.name || null,
  episode: {
    key: episode.key,
    part: episode.part,
    title: episode.title,
    alias: episode.alias,
    file: path.relative(root, videoAbs),
    languages,
  },
  generatedAt,
  mode,
  seed,
  captions,
};
writeFile(path.join(outDir, 'captions.json'), `${JSON.stringify(pack, null, 2)}\n`);

for (const lang of languages) {
  for (const key of PLATFORM_KEYS) {
    const caption = captions[lang][key];
    const spec = PLATFORMS[key];
    const lines = [];
    if (caption.title) lines.push(caption.title, '');
    lines.push(compose(key, caption), '');
    lines.push(`--- ${spec.label} · ${lang.toUpperCase()} · ${compose(key, caption).length}/${spec.limits.body} characters · ${caption.tags.length}/${spec.maxTags} tags`);
    writeFile(path.join(outDir, `${key}.${lang}.txt`), lines.join('\n'));
  }
}

const reviewPath = path.join(outDir, 'review.html');
writeFile(
  reviewPath,
  buildReviewHtml({
    config,
    episode,
    captions,
    videoPath: path.relative(outDir, videoAbs),
    posterSrc: episode.poster ? path.relative(outDir, path.join(videoDir, episode.poster)) : null,
    generatedAt,
    warnings,
    mode,
  })
);

// ---- console summary ------------------------------------------------------
console.log('');
for (const lang of languages) {
  console.log(`  ${lang.toUpperCase()}`);
  for (const key of PLATFORM_KEYS) {
    const caption = captions[lang][key];
    const r = report[`${lang}/${key}`];
    const first = (caption.title ? `${caption.title} · ` : '') + caption.body.split('\n')[0];
    console.log(`    ${PLATFORMS[key].label.padEnd(16)} ${String(r.length).padStart(5)}/${r.max}  ${clip(first, 62)}`);
  }
}
console.log('');
if (warnings.length) {
  console.log(`  ${warnings.length} note(s):`);
  for (const w of [...new Set(warnings)]) console.log(`   - ${w}`);
  console.log('');
}
log('done', `pack → ${path.relative(root, outDir)}`);
log('review', `file://${reviewPath}`);

if (args.open) openInBrowser(`file://${reviewPath}`);
