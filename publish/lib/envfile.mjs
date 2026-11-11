import fs from 'node:fs';
import path from 'node:path';

const KEY = /^([A-Za-z_][A-Za-z0-9_]*)\s*=/;

function format(value) {
  const text = String(value ?? '');
  if (!text) return '';
  if (/^[A-Za-z0-9._~+/=:@-]+$/.test(text)) return text;
  return `"${text.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

/**
 * Update keys in a .env file without destroying comments, ordering or unrelated
 * values. New keys are appended under a marker comment.
 */
export function writeEnvVars(file, updates, {section} = {}) {
  const exists = fs.existsSync(file);
  const lines = exists ? fs.readFileSync(file, 'utf8').split('\n') : [];
  const pending = new Map(Object.entries(updates));

  for (let i = 0; i < lines.length; i++) {
    const match = KEY.exec(lines[i]);
    if (!match) continue;
    if (!pending.has(match[1])) continue;
    lines[i] = `${match[1]}=${format(pending.get(match[1]))}`;
    pending.delete(match[1]);
  }

  if (pending.size) {
    while (lines.length && lines[lines.length - 1] === '') lines.pop();
    if (lines.length) lines.push('');
    if (section) lines.push(`# ---------- ${section} ----------`);
    for (const [key, value] of pending) lines.push(`${key}=${format(value)}`);
    lines.push('');
  }

  fs.mkdirSync(path.dirname(file), {recursive: true});
  fs.writeFileSync(file, lines.join('\n'), {mode: 0o600});
  try {
    fs.chmodSync(file, 0o600);
  } catch {
    /* best effort on exotic filesystems */
  }

  for (const [key, value] of Object.entries(updates)) process.env[key] = String(value);
  return file;
}

/** Show a secret as "abcd…wxyz" so the UI can prove it is stored. */
export function maskSecret(value) {
  const text = String(value || '');
  if (!text) return '';
  if (text.length <= 8) return '•'.repeat(text.length);
  return `${text.slice(0, 4)}…${text.slice(-4)}`;
}
