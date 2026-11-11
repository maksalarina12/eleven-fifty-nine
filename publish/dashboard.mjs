#!/usr/bin/env node
/**
 * Local release desk. Serves the dashboard, generates caption packs on demand
 * and previews uploads. Uploading still requires post.mjs --yes.
 *
 *   node publish/dashboard.mjs
 *   node publish/dashboard.mjs --port 4200 --no-open
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {loadEnv, readJson, parseArgs, openInBrowser, log} from './lib/util.mjs';
import {PLATFORMS, PLATFORM_KEYS, validate} from './lib/platforms.mjs';
import {ADAPTERS, missingCreds} from './lib/adapters.mjs';
import {renderDashboard} from './lib/dashboard.mjs';
import {handleConnect} from './lib/connector.mjs';
import {loadEpisodes} from './lib/episodes.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
loadEnv(path.join(root, '.env'));

const args = parseArgs();
const config = readJson(path.join(here, 'config.json'));
const catalog = loadEpisodes({root, publishDir: here, config, dir: args.dir});
const episodes = catalog.episodes;
const videoDirAbs = path.resolve(root, args.dir || config.videoDir || '.');

const MAX_BODY = 2 * 1024 * 1024;
let lastRun = {at: null, kind: null, episode: null, log: ''};

/* ------------------------------- helpers -------------------------------- */

const statSafe = (file) => {
  try {
    return fs.statSync(file);
  } catch {
    return null;
  }
};

function rel(file) {
  return path.relative(root, file).split(path.sep).join('/');
}

function packState(episode) {
  const dir = path.join(root, config.outputDir, episode.key);
  const captionsPath = path.join(dir, 'captions.json');
  if (!fs.existsSync(captionsPath)) return null;

  let pack;
  try {
    pack = readJson(captionsPath);
  } catch {
    return null;
  }

  // A pack belongs to one video in one series. Keys are positional, so switching
  // folders must not silently show another project's captions.
  const expected = path.relative(root, path.resolve(videoDirAbs, episode.file)).split(path.sep).join('/');
  const packedFile = String(pack.episode?.file || '').split(path.sep).join('/');
  if (packedFile && packedFile !== expected) return null;
  if (pack.series && pack.series !== config.series?.name) return null;

  const captions = {};
  const stats = {};
  for (const lang of Object.keys(pack.captions || {})) {
    captions[lang] = pack.captions[lang];
    stats[lang] = {};
    for (const key of PLATFORM_KEYS) {
      const caption = pack.captions[lang][key];
      if (!caption) continue;
      const result = validate(key, caption, config);
      stats[lang][key] = {
        length: result.length,
        max: result.max,
        tags: (caption.tags || []).length,
        errors: result.errors,
        notes: result.notes,
      };
    }
  }

  return {
    generatedAt: pack.generatedAt,
    mode: pack.mode,
    seed: pack.seed,
    languages: Object.keys(captions),
    captions,
    stats,
    reviewOk: fs.existsSync(path.join(dir, 'review.html')),
    dir: rel(dir),
  };
}

function buildState() {
  const credentials = {};
  let connections = {};
  let connectionsAt = null;
  try {
    const cached = readJson(path.join(root, 'publish', 'out', 'connections.json'));
    connections = cached.results || {};
    connectionsAt = cached.checkedAt || null;
  } catch {
    connections = {};
  }
  let apiCount = 0;
  for (const key of PLATFORM_KEYS) {
    const missing = missingCreds(ADAPTERS[key]);
    credentials[key] = {ok: missing.length === 0, missing};
    if (!missing.length) apiCount++;
  }

  const list = episodes.map((episode) => {
    const videoAbs = path.resolve(videoDirAbs, episode.file);
    const posterAbs = episode.poster ? path.resolve(videoDirAbs, episode.poster) : null;
    const video = statSafe(videoAbs);
    const poster = statSafe(posterAbs);
    return {
      key: episode.key,
      part: episode.part,
      title: episode.title,
      alias: episode.alias || null,
      runtime: episode.runtime,
      file: episode.file,
      videoOk: Boolean(video),
      videoBytes: video ? video.size : 0,
      posterOk: Boolean(poster),
      posterUrl: poster ? `/poster/${encodeURIComponent(episode.key)}` : null,
      briefs: {
        en: episode.en ? {logline: episode.en.logline} : null,
        id: episode.id ? {logline: episode.id.logline} : null,
      },
      pack: packState(episode),
    };
  });

  return {
    series: {
      name: config.series.name,
      season: config.series.season,
      handle: config.series.handle,
    },
    languages: config.languages,
    defaultLanguage: config.defaultLanguage,
    mode: process.env.LLM_API_KEY || process.env.OPENAI_API_KEY ? 'llm' : 'template',
    model: process.env.LLM_MODEL || config.llm.model,
    videoDir: args.dir || config.videoDir,
    screeningRoom: fs.existsSync(path.join(root, 'HASIL', 'index.html')) && videoDirAbs === path.join(root, 'HASIL'),
    episodesSource: catalog.source,
    masters: list.filter((episode) => episode.videoOk).length,
    packs: list.filter((episode) => episode.pack).length,
    apiCount,
    credentials,
    connections,
    connectionsAt,
    platforms: Object.fromEntries(
      PLATFORM_KEYS.map((key) => [
        key,
        {
          label: PLATFORMS[key].label,
          accent: PLATFORMS[key].accent,
          uploadUrl: PLATFORMS[key].uploadUrl,
          maxTags: Math.min(PLATFORMS[key].maxTags, config.platforms?.[key]?.maxTags ?? PLATFORMS[key].maxTags),
        },
      ])
    ),
    episodes: list,
    lastRun,
  };
}

function findEpisode(id) {
  const wanted = String(id ?? '').toLowerCase();
  return episodes.find(
    (episode) =>
      episode.key === wanted ||
      String(episode.part) === wanted ||
      String(episode.part) === wanted.replace(/^ep0*/, '')
  );
}

function runNode(argv, timeoutMs = 300000) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, argv, {cwd: root, env: process.env});
    let output = '';
    const timer = setTimeout(() => {
      output += `\n! timed out after ${Math.round(timeoutMs / 1000)}s`;
      child.kill('SIGKILL');
    }, timeoutMs);

    child.stdout.on('data', (chunk) => {
      output += chunk;
    });
    child.stderr.on('data', (chunk) => {
      output += chunk;
    });
    child.on('error', (error) => {
      clearTimeout(timer);
      resolve({code: -1, output: `${output}\n${error.message}`});
    });
    child.on('close', (code) => {
      clearTimeout(timer);
      resolve({code, output});
    });
  });
}

const sendJson = (res, status, value) => {
  const body = JSON.stringify(value);
  res.writeHead(status, {'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store'});
  res.end(body);
};

const readBody = (req) =>
  new Promise((resolve, reject) => {
    let size = 0;
    let body = '';
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY) {
        reject(new Error('request body too large'));
        req.destroy();
        return;
      }
      body += chunk;
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error('invalid JSON body'));
      }
    });
    req.on('error', reject);
  });

/* -------------------------------- static -------------------------------- */

const ALLOWED = [path.join(root, 'HASIL'), path.join(root, config.outputDir), videoDirAbs];
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.woff2': 'font/woff2',
};

function serveFile(req, res, urlPath) {
  const decoded = decodeURIComponent(urlPath.replace(/^\/files\//, ''));
  const abs = path.resolve(root, decoded);
  const inside = ALLOWED.some((base) => abs === base || abs.startsWith(base + path.sep));
  if (!inside) {
    res.writeHead(403, {'content-type': 'text/plain'});
    res.end('forbidden');
    return;
  }

  const info = statSafe(abs);
  if (!info || !info.isFile()) {
    res.writeHead(404, {'content-type': 'text/plain'});
    res.end('not found');
    return;
  }

  const type = TYPES[path.extname(abs).toLowerCase()] || 'application/octet-stream';
  const headers = {
    'content-type': type,
    'cache-control': type === 'text/html' ? 'no-store' : 'public, max-age=60',
    'accept-ranges': 'bytes',
  };

  const range = req.headers.range;
  if (range && type === 'video/mp4') {
    const match = /^bytes=(\d*)-(\d*)$/.exec(range);
    if (match) {
      const start = match[1] ? Number(match[1]) : 0;
      const end = match[2] ? Math.min(Number(match[2]), info.size - 1) : info.size - 1;
      if (start <= end && start < info.size) {
        res.writeHead(206, {
          ...headers,
          'content-range': `bytes ${start}-${end}/${info.size}`,
          'content-length': end - start + 1,
        });
        fs.createReadStream(abs, {start, end}).pipe(res);
        return;
      }
    }
  }

  res.writeHead(200, {...headers, 'content-length': info.size});
  fs.createReadStream(abs).pipe(res);
}

/* -------------------------------- routes -------------------------------- */

async function handle(req, res) {
  const url = new URL(req.url, 'http://localhost');
  const route = url.pathname;

  if (req.method === 'GET' && route === '/') {
    const html = renderDashboard(buildState());
    res.writeHead(200, {'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store'});
    res.end(html);
    return;
  }

  if (req.method === 'GET' && route === '/api/state') {
    sendJson(res, 200, buildState());
    return;
  }

  if (req.method === 'POST' && route === '/api/generate') {
    const body = await readBody(req);
    const episode = findEpisode(body.episode);
    if (!episode) return sendJson(res, 404, {error: `unknown episode: ${body.episode}`});

    const argv = ['publish/generate.mjs', '--episode', String(episode.part)];
    if (body.template) argv.push('--no-llm');
    const started = Date.now();
    const {code, output} = await runNode(argv);

    lastRun = {
      at: new Date().toISOString(),
      kind: 'generate',
      episode: episode.key,
      log: output + `\n[exit ${code} · ${((Date.now() - started) / 1000).toFixed(1)}s]`,
    };
    return sendJson(res, 200, {ok: code === 0, log: lastRun.log, state: buildState()});
  }

  if (req.method === 'POST' && route === '/api/generate-all') {
    await readBody(req).catch(() => {});
    const missing = episodes.filter((episode) => !packState(episode));
    if (!missing.length) {
      lastRun = {...lastRun, at: new Date().toISOString(), kind: 'generate-all', log: 'every episode already has a pack.'};
      return sendJson(res, 200, {ok: true, log: lastRun.log, state: buildState()});
    }

    let output = '';
    let failures = 0;
    for (const episode of missing) {
      output += `\n=== ${episode.key} · ${episode.title} ===\n`;
      const argv = ['publish/generate.mjs', '--episode', String(episode.part), '--no-llm'];
      const result = await runNode(argv);
      output += result.output;
      if (result.code !== 0) failures++;
    }

    lastRun = {at: new Date().toISOString(), kind: 'generate-all', episode: `${missing.length} episode(s)`, log: output};
    return sendJson(res, 200, {ok: failures === 0, log: output, state: buildState()});
  }

  if (req.method === 'POST' && route === '/api/doctor') {
    await readBody(req).catch(() => {});
    const {code, output} = await runNode(['publish/doctor.mjs'], 120000);
    lastRun = {at: new Date().toISOString(), kind: 'check links', episode: 'all', log: output + `\n[exit ${code}]`};
    return sendJson(res, 200, {ok: code === 0, log: lastRun.log, state: buildState()});
  }

  if (req.method === 'POST' && route === '/api/post') {
    const body = await readBody(req);
    const episode = findEpisode(body.episode);
    if (!episode) return sendJson(res, 404, {error: `unknown episode: ${body.episode}`});
    if (!packState(episode)) {
      return sendJson(res, 409, {error: 'no pack yet — generate one first', log: 'no pack yet for ' + episode.key});
    }

    const argv = ['publish/post.mjs', '--episode', String(episode.part)];
    if (body.lang) argv.push('--lang', body.lang);
    const {code, output} = await runNode(argv, 120000);
    lastRun = {at: new Date().toISOString(), kind: 'post (dry run)', episode: episode.key, log: output};
    return sendJson(res, 200, {ok: code === 0, log: output, state: buildState()});
  }

  if (req.method === 'GET' && route.startsWith('/poster/')) {
    const key = decodeURIComponent(route.slice('/poster/'.length));
    const episode = findEpisode(key);
    const posterAbs = episode?.poster ? path.resolve(videoDirAbs, episode.poster) : null;
    const inside = posterAbs && (posterAbs === videoDirAbs || posterAbs.startsWith(videoDirAbs + path.sep));
    const info = inside ? statSafe(posterAbs) : null;
    if (!info || !info.isFile()) {
      res.writeHead(404, {'content-type': 'text/plain'});
      res.end('no poster');
      return;
    }
    const type = TYPES[path.extname(posterAbs).toLowerCase()] || 'image/jpeg';
    res.writeHead(200, {'content-type': type, 'cache-control': 'public, max-age=60'});
    fs.createReadStream(posterAbs).pipe(res);
    return;
  }

  if (await handleConnect(req, res, {root})) return;

  if (req.method === 'GET' && route.startsWith('/files/')) {
    serveFile(req, res, route);
    return;
  }

  res.writeHead(404, {'content-type': 'text/plain'});
  res.end('not found');
}

/* -------------------------------- listen -------------------------------- */

const server = http.createServer((req, res) => {
  handle(req, res).catch((error) => {
    if (!res.headersSent) sendJson(res, 500, {error: error.message});
    else res.end();
  });
});

let port = Number(args.port || process.env.PORT || 4173);
let tries = 0;

function listen() {
  server.once('error', (error) => {
    if (error.code === 'EADDRINUSE' && tries < 10) {
      tries++;
      port++;
      log('port', `${port - 1} busy, trying ${port}`);
      listen();
      return;
    }
    console.error(error.message);
    process.exit(1);
  });
  server.listen(port, '127.0.0.1', () => {
    const url = `http://127.0.0.1:${port}/`;
    log('desk', `release dashboard → ${url}`);
    log('mode', `${process.env.LLM_API_KEY || process.env.OPENAI_API_KEY ? 'llm captions' : 'template captions'} · dry run · local only`);
    if (!args['no-open']) openInBrowser(url);
  });
}

listen();
