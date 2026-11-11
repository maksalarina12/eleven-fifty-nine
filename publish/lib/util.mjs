import fs from 'node:fs';
import path from 'node:path';
import {execFile} from 'node:child_process';

export function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

export function writeFile(file, contents) {
  fs.mkdirSync(path.dirname(file), {recursive: true});
  fs.writeFileSync(file, contents);
}

export function parseArgs(argv = process.argv.slice(2)) {
  const args = {_: []};
  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];
    if (!token.startsWith('--')) {
      args._.push(token);
      continue;
    }
    const [flag, inline] = token.slice(2).split('=');
    if (inline !== undefined) {
      args[flag] = inline;
    } else if (argv[i + 1] && !argv[i + 1].startsWith('--')) {
      args[flag] = argv[++i];
    } else {
      args[flag] = true;
    }
  }
  return args;
}

/** Minimal .env loader: KEY=value, # comments, optional quotes. */
export function loadEnv(file = '.env') {
  if (!fs.existsSync(file)) return {};
  const out = {};
  for (const raw of fs.readFileSync(file, 'utf8').split('\n')) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq < 1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
    out[key] = value;
  }
  return out;
}

/** Clip at a word boundary, never mid-word, and add an ellipsis only if we cut. */
export function clip(text, max) {
  const clean = String(text || '').replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const at = cut.lastIndexOf(' ');
  return `${(at > max * 0.6 ? cut.slice(0, at) : cut).trimEnd()}…`;
}

export function slug(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function openInBrowser(url) {
  const cmd = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'explorer' : 'xdg-open';
  execFile(cmd, [url], () => {});
}

export function parseList(value) {
  return String(value || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export function log(step, message) {
  const stamp = new Date().toISOString().slice(11, 19);
  console.log(`[${stamp}] ${step.padEnd(8)} ${message}`);
}
