#!/usr/bin/env node
/**
 * ElevenLabs narration, straight from the terminal — with account rotation.
 *
 *   npm run voices                              every account, credits, voices
 *   npm run tts -- --models                     models (first healthy account)
 *   npm run tts -- --text "…" --voice Amara     synth to out/tts.mp3
 *   npm run tts -- --part 11 --file script.md   synth to BAHAN/pt11/pt11.mp3
 *                                              and copy into public/audio/
 *
 * Keys in .env at the repository root, as many as you have:
 *
 *   ELEVENLABS_API_KEY=sk_first
 *   ELEVENLABS_API_KEY_2=sk_second
 *   ELEVENLABS_API_KEY_3=sk_third
 *   # or one line:
 *   ELEVENLABS_API_KEYS=sk_first,sk_second,sk_third
 *   ELEVENLABS_LABEL_2=main channel        # optional, for the reports
 *
 * A key that is out of credits (401 quota_exceeded), invalid, or 402 is marked
 * dead in out/tts-state.json, skipped from then on, and the request moves to
 * the next account automatically. Nothing is installed: Node 24 has fetch.
 */
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {loadEnv, parseArgs} from '../publish/lib/util.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const API = process.env.ELEVENLABS_API_BASE || 'https://api.elevenlabs.io/v1';
const STATE = path.join(root, 'out', 'tts-state.json');

const DEFAULTS = {
  model: 'eleven_v4', // model 4: reads audio tags (SFX, music, emotion)
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

function die(message, hint) {
  console.error(`\n  ${message}`);
  if (hint) console.error(`  ${hint}`);
  console.error('');
  process.exit(1);
}

/* ------------------------------------------------------------------ */
/* accounts                                                            */
/* ------------------------------------------------------------------ */

function loadKeys() {
  const keys = [];
  const push = (value, label) => {
    if (!value) return;
    const key = String(value).trim();
    if (!key || keys.some((k) => k.key === key)) return;
    keys.push({key, label: label || `account ${keys.length + 1}`});
  };
  push(env.ELEVENLABS_API_KEY || process.env.ELEVENLABS_API_KEY, env.ELEVENLABS_LABEL_1 || env.ELEVENLABS_API_KEY_LABEL);
  for (const raw of String(env.ELEVENLABS_API_KEYS || process.env.ELEVENLABS_API_KEYS || '').split(',')) push(raw);
  for (let i = 2; i <= 9; i++) {
    push(env[`ELEVENLABS_API_KEY_${i}`] || process.env[`ELEVENLABS_API_KEY_${i}`], env[`ELEVENLABS_LABEL_${i}`]);
  }
  return keys;
}

function readState() {
  try {
    return JSON.parse(fs.readFileSync(STATE, 'utf8'));
  } catch {
    return {};
  }
}

function writeState(state) {
  fs.mkdirSync(path.dirname(STATE), {recursive: true});
  fs.writeFileSync(STATE, JSON.stringify(state, null, 1) + '\n');
}

const KEY_STATE = readState();
const KEYS = loadKeys();
KEYS.forEach((entry) => {
  const saved = KEY_STATE[entry.key];
  entry.dead = Boolean(saved?.dead);
  entry.remaining = saved?.remaining;
  entry.limit = saved?.limit;
  entry.used = saved?.used;
  entry.checkedAt = saved?.checkedAt || 0;
  entry.resetAt = saved?.resetAt;
});

function saveKey(entry) {
  KEY_STATE[entry.key] = {
    dead: entry.dead || false,
    remaining: entry.remaining,
    limit: entry.limit,
    used: entry.used,
    checkedAt: entry.checkedAt,
    resetAt: entry.resetAt,
  };
  writeState(KEY_STATE);
}

function requireKeys() {
  if (KEYS.length) return;
  die(
    'No ElevenLabs key found.',
    "Add one to .env:  ELEVENLABS_API_KEY=sk_...   (more: ELEVENLABS_API_KEY_2=sk_..., …)"
  );
}

function selectKey(explicit) {
  requireKeys();
  if (explicit) {
    const needle = String(explicit).toLowerCase();
    const hit =
      KEYS[Number(explicit) - 1] ||
      KEYS.find((k) => k.key === explicit) ||
      KEYS.find((k) => k.label.toLowerCase() === needle) ||
      KEYS.find((k) => k.label.toLowerCase().includes(needle));
    if (!hit) die(`No account matches "${explicit}".`, KEYS.map((k, i) => `${i + 1}. ${k.label}`).join('   '));
    return [hit, ...KEYS.filter((k) => k !== hit)];
  }
  const alive = KEYS.filter((k) => !k.dead);
  if (!alive.length) {
    die(
      'Every account in .env is marked out of credits or invalid.',
      `Check out/tts-state.json, add another ELEVENLABS_API_KEY_n, or delete that file to retry them.`
    );
  }
  return [...alive, ...KEYS.filter((k) => k.dead)];
}

class DeadKey extends Error {
  constructor(message) {
    super(message);
    this.name = 'DeadKey';
  }
}

/** The key works; the plan does not allow this voice/model. Not an exhausted key. */
class PlanError extends Error {
  constructor(message) {
    super(message);
    this.name = 'PlanError';
  }
}

/** The key works, it just was not granted this endpoint. Not an exhausted key. */
class ScopeError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ScopeError';
  }
}

async function call(entry, pathname, options = {}) {
  const res = await fetch(`${API}${pathname}`, {
    ...options,
    headers: {
      'xi-api-key': entry.key,
      ...(options.body && typeof options.body === 'string' ? {'content-type': 'application/json'} : {}),
      ...(options.headers || {}),
    },
    signal: AbortSignal.timeout(180000),
  });
  if (res.ok) return res;

  const raw = await res.text().catch(() => '');
  let code = '';
  let detail = raw.slice(0, 300);
  try {
    const parsed = JSON.parse(raw);
    code = parsed.detail?.code || parsed.detail?.status || '';
    detail = parsed.detail?.message || detail;
  } catch {
    /* raw text it is */
  }
  const spent = ['quota_exceeded', 'insufficient_credits', 'invalid_api_key'].includes(code);
  const plan = ['paid_plan_required', 'subscription_required', 'plan_required', 'voice_not_allowed'].includes(code);
  if (spent) throw new DeadKey(`${res.status} ${code}${detail ? ` — ${detail}` : ''}`);
  if (res.status === 402 || plan) {
    throw new PlanError(`${res.status} ${code || res.statusText}${detail ? ` — ${detail}` : ''}`);
  }
  if (res.status === 401) {
    // the key exists but lacks a permission (models_read, voices_read, …)
    throw new ScopeError(`${res.status} ${code || res.statusText}${detail ? ` — ${detail}` : ''}`);
  }
  if (res.status === 429) {
    const err = new Error(`429 ${detail || 'rate limited'}`);
    err.retryable = true;
    throw err;
  }
  const err = new Error(`${res.status} ${detail || res.statusText}`);
  err.status = res.status;
  throw err;
}

/** Free call: how much of each account is left. Cached for five minutes. */
async function refreshUsage(entries, {maxAge = 300000, force = false} = {}) {
  await Promise.all(
    entries.map(async (entry) => {
      if (!force && Date.now() - entry.checkedAt < maxAge) return;
      try {
        const sub = await (await call(entry, '/user/subscription')).json();
        entry.used = sub.character_count ?? 0;
        entry.limit = sub.character_limit ?? 0;
        entry.remaining = Math.max(0, entry.limit - entry.used);
        entry.resetAt = sub.next_character_count_reset_unix;
        entry.checkedAt = Date.now();
        entry.dead = entry.remaining <= 0;
        saveKey(entry);
      } catch (error) {
        if (error instanceof DeadKey) {
          entry.dead = true;
          entry.remaining = 0;
          entry.checkedAt = Date.now();
          saveKey(entry);
        }
      }
    })
  );
  return entries;
}

function describe(entry) {
  const credits =
    entry.remaining === undefined ? '? credits' : `${entry.remaining.toLocaleString()} left`;
  const state = entry.dead ? 'OUT' : 'ok';
  return `${entry.label} (${state}, ${credits})`;
}

/* ------------------------------------------------------------------ */
/* text                                                                */
/* ------------------------------------------------------------------ */

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
    for (const sentence of paragraph.split(/(?<=[.!?])\s+/)) push(`${sentence} `);
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

/** Render one request, walking the account list until one accepts it. */
async function speak(pool, pathname, body, need) {
  const tried = [];
  for (const entry of pool) {
    if (entry.dead) continue;
    if (need && entry.remaining !== undefined && entry.remaining < need) {
      entry.dead = true;
      entry.remaining = 0;
      saveKey(entry);
      continue;
    }
    try {
      const res = await call(entry, pathname, {method: 'POST', body: JSON.stringify(body)});
      const buffer = Buffer.from(await res.arrayBuffer());
      if (buffer.length < 2000) throw new Error(`response looked empty (${buffer.length} bytes)`);
      if (entry.remaining !== undefined) {
        entry.remaining = Math.max(0, entry.remaining - need);
        entry.used = (entry.used || 0) + need;
        entry.checkedAt = Date.now();
        saveKey(entry);
      }
      return {buffer, entry};
    } catch (error) {
      if (error instanceof DeadKey) {
        entry.dead = true;
        entry.remaining = 0;
        entry.checkedAt = Date.now();
        saveKey(entry);
        tried.push(`${entry.label}: out of credits (${error.message})`);
        console.log(`\n  ${entry.label} is done — switching account`);
        continue;
      }
      if (error.retryable) {
        tried.push(`${entry.label}: rate limited`);
        continue;
      }
      if (error instanceof PlanError) {
        tried.push(`${entry.label}: ${error.message}`);
        continue;
      }
      tried.push(`${entry.label}: ${error.message}`);
      if (error.status >= 500) continue;
      if (error.status === 404) {
        die(
          `Voice not found on ${entry.label}.`,
          `${error.message}\n  Copy the voice id from the ElevenLabs UI (Voices → the voice → id) and pass it with --voice.`
        );
      }
      if (error.status === 400 || error.status === 422) {
        die(
          `${entry.label} rejected the request.`,
          `${error.message}\n  If this mentions the model, run --models (needs the models_read permission) or pass a known id with --model.`
        );
      }
      throw error;
    }
  }
  die('No account could take this request.', tried.join('\n  ') || 'all accounts are marked out of credits');
}

/* ------------------------------------------------------------------ */
/* commands                                                            */
/* ------------------------------------------------------------------ */

async function listAccounts() {
  requireKeys();
  console.log(`\n${KEYS.length} account${KEYS.length === 1 ? '' : 's'} configured\n`);
  await refreshUsage(KEYS, {force: true});
  for (const entry of KEYS) {
    console.log(`  ${describe(entry)}`);
    if (entry.limit) console.log(`     ${entry.used?.toLocaleString()} / ${entry.limit.toLocaleString()} credits this period`);
    if (entry.dead && entry.resetAt) {
      console.log(`     resets ${new Date(entry.resetAt * 1000).toLocaleDateString()}`);
    }
    try {
      const data = await (await call(entry, '/voices?page_size=100')).json();
      const voices = data.voices || [];
      console.log(`     ${voices.length} voices: ${voices.slice(0, 6).map((v) => v.name).join(', ')}${voices.length > 6 ? ', …' : ''}`);
    } catch (error) {
      console.log(`     voices unavailable — ${error.message}`);
    }
  }
  const alive = KEYS.filter((k) => !k.dead);
  const known = alive.filter((k) => k.remaining !== undefined);
  const summary = known.length
    ? `${known.reduce((sum, k) => sum + k.remaining, 0).toLocaleString()} characters`
    : 'credits unknown (keys have no usage-read permission)';
  console.log(`\n  usable now: ${summary} across ${alive.length} account(s)\n`);
}

async function listModels() {
  const pool = selectKey(args.account);
  const entry = pool[0];
  let data;
  try {
    data = await (await call(entry, '/models')).json();
  } catch (error) {
    if (error instanceof ScopeError) {
      die(
        `This key cannot read the model list: ${error.message}`,
        'Enable the models_read permission on the key, or pass --model explicitly (npm run tts -- --text "…" --model eleven_v4).'
      );
    }
    if (error instanceof DeadKey) die(`First usable account is unusable: ${error.message}`);
    throw error;
  }
  console.log(`\n  models for ${entry.label}\n`);
  console.log('  model id                          chars   languages');
  for (const model of data) {
    const chars = model.max_characters_request_free ?? model.max_characters_request ?? '—';
    console.log(`  ${String(model.model_id).padEnd(32)}  ${String(chars).padEnd(6)}  ${model.languages?.length ?? '—'}`);
  }
  console.log('');
}

async function resolveVoice(entry, nameOrId) {
  if (!nameOrId) {
    die(
      'No voice given.',
      'Run  npm run voices  to see the voices on each account, then pass --voice <name|id>.'
    );
  }
  if (/^[A-Za-z0-9]{15,}$/.test(nameOrId) && !nameOrId.includes(' ')) return nameOrId;
  const data = await (await call(entry, '/voices?page_size=100')).json();
  const voices = data.voices || [];
  const needle = nameOrId.toLowerCase();
  const hit =
    voices.find((v) => v.name.toLowerCase() === needle) ||
    voices.find((v) => v.voice_id === nameOrId) ||
    voices.find((v) => v.name.toLowerCase().includes(needle));
  if (!hit) {
    die(`No voice matches "${nameOrId}" on ${entry.label}.`, `Available: ${voices.map((v) => v.name).join(', ') || '(none)'}`);
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
    die('Nothing to say.', 'Pass --text "…", or --file <script.md>, or --part 11 to read BAHAN/pt11/*.md.');
  }
  if (!args.raw) text = toSpeech(text);

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

  const pool = selectKey(args.account);
  const chunks = chunk(text, modelLimit(model));
  const total = text.length;
  console.log(`\n  voice    ${args.voice || '(none — run --voices)'}`);
  console.log(`  model    ${model}`);
  console.log(`  text     ${total.toLocaleString()} characters from ${source}${chunks.length > 1 ? ` (${chunks.length} requests)` : ''}`);
  console.log(`  out      ${path.relative(root, out)}`);
  if (args['dry-run']) {
    await refreshUsage(pool.filter((k) => !k.dead));
    console.log(`  accounts ${pool.filter((k) => !k.dead).map(describe).join(' → ') || '(none usable)'}`);
    console.log(`\n  dry run — ${total.toLocaleString()} credits would be spent, nothing sent\n`);
    return;
  }

  await refreshUsage(pool.filter((k) => !k.dead));
  const usable = pool.filter((k) => !k.dead);
  if (usable.length && usable.every((k) => k.remaining !== undefined)) {
    const sum = usable.reduce((s, k) => s + k.remaining, 0);
    if (sum < total) {
      die(
        `Not enough credits: the script needs ${total.toLocaleString()} and the accounts have ${sum.toLocaleString()}.`,
        'Add another ELEVENLABS_API_KEY_n, or split the script with --file.'
      );
    }
    const short = usable.find((k) => k.remaining < total);
    if (short) console.log(`  spread   ${total.toLocaleString()} characters over ${usable.length} accounts`);
  } else if (usable.length && !usable.some((k) => k.remaining !== undefined)) {
    console.log(`  credits  unknown — the key has no usage-read permission, trying anyway`);
  }

  if (!usable.length) {
    die(
      'Every account is out of credits or invalid.',
      'Add another key as ELEVENLABS_API_KEY_n, or delete out/tts-state.json once the accounts reset.'
    );
  }
  let voiceId;
  for (const candidate of usable) {
    try {
      voiceId = await resolveVoice(candidate, args.voice || env.ELEVENLABS_VOICE);
      break;
    } catch (error) {
      if (!(error instanceof DeadKey)) throw error;
      candidate.dead = true;
      candidate.remaining = 0;
      saveKey(candidate);
      console.log(`  ${candidate.label} is done — switching account`);
    }
  }
  if (!voiceId) die('No usable account could look up that voice.', 'Check the voice name with npm run voices.');
  fs.mkdirSync(path.dirname(out), {recursive: true});
  const tmp = fs.mkdtempSync(path.join(root, 'out', 'tts-'));
  const files = [];
  const used = [];
  try {
    for (let i = 0; i < chunks.length; i++) {
      const body = {text: chunks[i], model_id: model, voice_settings: settings};
      if (args.language) body.language_code = String(args.language);
      if (i > 0) body.previous_text = chunks[i - 1].slice(-400);
      if (i < chunks.length - 1) body.next_text = chunks[i + 1].slice(0, 400);

      process.stdout.write(`  rendering ${i + 1}/${chunks.length}…\r`);
      const {buffer, entry} = await speak(pool, `/text-to-speech/${voiceId}?output_format=${encodeURIComponent(format)}`, body, chunks[i].length);
      const file = path.join(tmp, `chunk-${String(i).padStart(3, '0')}.mp3`);
      fs.writeFileSync(file, buffer);
      files.push(file);
      if (!used.includes(entry.label)) used.push(entry.label);
    }
    joinChunks(files, out);
  } finally {
    fs.rmSync(tmp, {recursive: true, force: true});
  }

  const seconds = duration(out);
  const size = fs.statSync(out).size;
  console.log(`  done     ${path.relative(root, out)}`);
  console.log(`  via      ${used.join(', ')}`);
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

if (args.voices || args.accounts || args._[0] === 'voices') await listAccounts();
else if (args.models || args._[0] === 'models') await listModels();
else if (args.help || args._[0] === 'help') {
  console.log(`
  npm run voices
  npm run tts -- --models
  npm run tts -- --text "Deep beneath the laboratory…" --voice Amara
  npm run tts -- --part 11 --voice Amara
  npm run tts -- --part 11 --file BAHAN/pt11/script.md --dry-run
  npm run tts -- --part 11 --voice Amara --account 2

  flags  --voice <name|id>   --model <id>   --out <file>   --file <script>
         --part <n>          --text "…"     --format mp3_44100_128
         --account <n|label>  (force one account, no rotation)
         --stability 0.5     --similarity 0.8   --style 0     --speed 1
         --language <code>   --raw (keep markdown)   --no-boost
         --dry-run (credits only, nothing sent)

  accounts live in .env:  ELEVENLABS_API_KEY  ELEVENLABS_API_KEY_2 … _9
                          or ELEVENLABS_API_KEYS=sk_a,sk_b
  state is remembered in out/tts-state.json (delete it to retry dead keys)
`);
} else await synth();
