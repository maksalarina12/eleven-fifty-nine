#!/usr/bin/env node
/**
 * Push a generated pack to the platforms whose credentials exist.
 * Dry run by default: nothing is uploaded until you pass --yes.
 *
 *   node publish/post.mjs --episode 5
 *   node publish/post.mjs --episode 5 --platforms youtube --yes
 *   node publish/post.mjs --episode 5 --platforms all --yes
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {loadEnv, readJson, writeFile, parseArgs, parseList, log} from './lib/util.mjs';
import {PLATFORMS, PLATFORM_KEYS, compose, validate} from './lib/platforms.mjs';
import {adapterFor, missingCreds} from './lib/adapters.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
loadEnv(path.join(root, '.env'));

const args = parseArgs();
const config = readJson(path.join(here, 'config.json'));
const episodes = readJson(path.join(here, 'episodes.json'));

const wanted = String(args.episode ?? args.e ?? '5').toLowerCase();
const episode = episodes.find(
  (e) => e.key === wanted || String(e.part) === wanted || String(e.part) === wanted.replace(/^ep0*/, '')
);
if (!episode) {
  console.error(`Episode "${wanted}" not found.`);
  process.exit(1);
}

const packPath = path.join(root, config.outputDir, episode.key, 'captions.json');
if (!fs.existsSync(packPath)) {
  console.error(`No pack at ${path.relative(root, packPath)}. Run: node publish/generate.mjs --episode ${episode.part}`);
  process.exit(1);
}
const pack = readJson(packPath);

const lang = args.lang || config.defaultLanguage;
if (!pack.captions[lang]) {
  console.error(`Pack has no ${lang} captions. Languages: ${Object.keys(pack.captions).join(', ')}`);
  process.exit(1);
}

const requested = args.platforms && args.platforms !== 'all' ? parseList(args.platforms) : PLATFORM_KEYS;
const invalid = requested.filter((k) => !PLATFORMS[k]);
if (invalid.length) {
  console.error(`Unknown platform(s): ${invalid.join(', ')}. Use: ${PLATFORM_KEYS.join(', ')}`);
  process.exit(1);
}

const videoAbs = path.resolve(root, pack.episode.file);
if (!fs.existsSync(videoAbs)) {
  console.error(`Video missing: ${videoAbs}`);
  process.exit(1);
}

const live = Boolean(args.yes);
log('pack', `${pack.episode.key} · ${lang.toUpperCase()} · ${path.basename(videoAbs)} · ${(fs.statSync(videoAbs).size / 1e6).toFixed(1)} MB`);
log('mode', live ? 'LIVE — uploading' : 'dry run — pass --yes to upload');

const results = {};
const manual = [];

for (const key of requested) {
  const adapter = adapterFor(key);
  const caption = pack.captions[lang][key];
  const check = validate(key, caption, config);
  if (check.errors.length) {
    log(key, `skipped — ${check.errors.join('; ')}`);
    results[key] = {skipped: true, reason: check.errors};
    continue;
  }

  const missing = missingCreds(adapter);
  if (missing.length) {
    log(key, `no credentials (${missing.join(', ')}) — prepared for manual upload`);
    manual.push({key, caption, file: path.relative(root, path.join(root, config.outputDir, episode.key, `${key}.${lang}.txt`))});
    results[key] = {manual: true, missing};
    continue;
  }

  if (!live) {
    const plan = adapter.plan({video: videoAbs, caption});
    console.log('');
    console.log(`  ${adapter.label}`);
    for (const [k, v] of Object.entries(plan)) console.log(`    ${k}: ${Array.isArray(v) ? v.join(' ') : v}`);
    console.log('');
    results[key] = {plan};
    continue;
  }

  try {
    log(key, 'uploading…');
    const out = await adapter.post({video: videoAbs, caption});
    log(key, `ok ${out.url}`);
    results[key] = out;
  } catch (error) {
    log(key, `FAILED ${error.message}`);
    results[key] = {error: error.message};
  }
}

if (manual.length) {
  console.log('\n  Manual packet — copy from these files:');
  for (const item of manual) console.log(`   ${PLATFORMS[item.key].label.padEnd(16)} ${item.file}`);
  console.log(`   review page: ${path.relative(root, path.join(root, config.outputDir, episode.key, 'review.html'))}`);
  console.log(`   upload here: ${manual.map((m) => PLATFORMS[m.key].uploadUrl).join('  ')}`);
  console.log('');
}

const logPath = path.join(root, config.outputDir, episode.key, `post-log-${new Date().toISOString().slice(0, 10)}.json`);
writeFile(logPath, `${JSON.stringify({at: new Date().toISOString(), live, lang, results}, null, 2)}\n`);
log('log', path.relative(root, logPath));
