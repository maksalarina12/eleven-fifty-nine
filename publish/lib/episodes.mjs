/**
 * Episode discovery.
 *
 * The desk works two ways:
 *   1. publish/episodes.json exists — that file is the episode bible (titles,
 *      posters, per-language briefs). Author-owned, never touched at runtime.
 *   2. it does not exist — the desk scans config.videoDir for videos and builds
 *      a draft list on the fly, so pointing it at any folder is enough.
 *
 * Nothing here knows about a particular series.
 */
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';

export const VIDEO_EXT = new Set(['.mp4', '.mov', '.m4v', '.webm']);
const POSTER_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp']);

export function listVideos(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((name) => VIDEO_EXT.has(path.extname(name).toLowerCase()))
    .map((name) => {
      const abs = path.join(dir, name);
      const info = fs.statSync(abs);
      return {file: name, abs, bytes: info.size, at: info.mtimeMs};
    })
    .filter((entry) => entry.bytes > 0)
    .sort((a, b) => a.file.localeCompare(b.file, undefined, {numeric: true}));
}

/** "the_room-final_1080x1920.mp4" → "The Room" */
export function titleFromFile(file) {
  const base = path.basename(file, path.extname(file));
  const words = base
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .split(/[-_.\s]+/)
    .filter(Boolean)
    .filter((word) => !/^(final|export|render|v\d+|master|\d{3,4}[px]|\d{3,4}x\d{3,4})$/i.test(word))
    .filter((word) => !/^(ep|eps|episode|part|pt|ch|chapter|vol)[_-]?\d*$/i.test(word));

  const title = words
    .map((word) => (word === word.toUpperCase() && word.length <= 3 ? word : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()))
    .join(' ');

  return title || base;
}

/** Returns the part number written in the name, or null when there is none. */
export function partFromFile(file) {
  const stem = path.basename(file, path.extname(file));

  // 1. an explicit marker wins: part 3, ep12, chapter_2, #4 …
  const explicit = /(?:part|ep|episode|chapter|chap|vol|#)[\s._-]*(\d{1,3})(?!\d)/i.exec(stem);
  if (explicit) return Number(explicit[1]);

  // 2. otherwise the last standalone 1–2 digit number, ignoring resolutions
  //    and years ("night_drive_final_1080x1920" has no part number).
  const cleaned = stem
    .replace(/\d{3,4}\s*[x×]\s*\d{3,4}/gi, ' ')
    .replace(/\d{3,4}p\b/gi, ' ')
    .replace(/\b(19|20)\d{2}\b/g, ' ');
  const numbers = [...cleaned.matchAll(/(?:^|[^0-9])(\d{1,2})(?!\d)/g)].map((match) => Number(match[1]));
  if (numbers.length) return numbers[numbers.length - 1];

  return null;
}

export function probeSeconds(abs) {
  try {
    const out = execFileSync(
      'ffprobe',
      ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', abs],
      {encoding: 'utf8', timeout: 15000}
    ).trim();
    const seconds = Number.parseFloat(out);
    return Number.isFinite(seconds) ? seconds : null;
  } catch {
    return null;
  }
}

export function formatRuntime(seconds) {
  if (!Number.isFinite(seconds)) return '';
  const total = Math.round(seconds);
  const mm = Math.floor(total / 60);
  const ss = String(total % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

function posterFor(dir, file, part) {
  if (!fs.existsSync(dir)) return null;
  const names = fs.readdirSync(dir);
  const stems = [
    `poster${part}`,
    `poster-${part}`,
    path.basename(file, path.extname(file)),
    'poster',
  ];

  for (const stem of stems) {
    const hit = names.find(
      (name) => path.basename(name, path.extname(name)).toLowerCase() === stem.toLowerCase() && POSTER_EXT.has(path.extname(name).toLowerCase())
    );
    if (hit) return hit;
  }
  return null;
}

/**
 * Build the minimal episode list the rest of the desk needs. Copy blocks
 * (`en`, `id`, …) are intentionally absent: templates and the LLM both have a
 * generic fallback, and the author can enrich episodes.json later.
 */
export function draftEpisodes({dir, withRuntime = true}) {
  const videos = listVideos(dir);

  // Explicit numbers win; files without one take the next free number instead
  // of their position, so "ep02-x.mp4" and "night-drive.mp4" cannot collide.
  const explicit = videos.map((video) => partFromFile(video.file));
  const used = new Set(explicit.filter(Boolean));
  let next = 1;
  const parts = explicit.map((part) => {
    if (part) return part;
    while (used.has(next)) next++;
    used.add(next);
    return next;
  });

  const entries = videos.map((video, index) => {
    const part = parts[index];
    const seconds = withRuntime ? probeSeconds(video.abs) : null;
    return {
      key: null,
      _sort: part,
      part,
      file: video.file,
      poster: posterFor(dir, video.file, part),
      title: titleFromFile(video.file),
      alias: null,
      runtime: formatRuntime(seconds),
    };
  });

  entries.sort((a, b) => a._sort - b._sort || a.file.localeCompare(b.file, undefined, {numeric: true}));
  for (const [index, entry] of entries.entries()) {
    delete entry._sort;
    entry.key = `ep${String(index + 1).padStart(2, '0')}`;
  }
  return entries;
}

export function episodesPathFor(config, publishDir) {
  return path.resolve(publishDir, config.episodesFile || 'episodes.json');
}

/**
 * Return {episodes, source, file}. `source` is "file" or "scan" so the UI can
 * say which one it is showing.
 */
export function loadEpisodes({root, publishDir, config}) {
  const file = episodesPathFor(config, publishDir);
  if (fs.existsSync(file)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(file, 'utf8'));
      if (Array.isArray(parsed) && parsed.length) {
        return {episodes: parsed, source: 'file', file};
      }
    } catch {
      /* fall through to scanning with a broken file */
    }
  }

  const dir = path.resolve(root, config.videoDir || '.');
  return {episodes: draftEpisodes({dir}), source: 'scan', file: null, dir};
}
