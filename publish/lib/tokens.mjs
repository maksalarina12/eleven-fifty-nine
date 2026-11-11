/**
 * Keep short-lived access tokens alive.
 *
 * X tokens last 2 hours, TikTok about 24. Both platforms hand out refresh
 * tokens, so the release desk renews them in place and writes the new values
 * back to .env — no manual copying between posts.
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {writeEnvVars} from './envfile.mjs';
import {refreshToken} from './oauth.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..', '..');
export const ENV_FILE = path.join(root, '.env');

const SKEW_MS = 5 * 60 * 1000;

const needsRefresh = (expiryKey) => {
  const stamp = Date.parse(process.env[expiryKey] || '');
  if (!Number.isFinite(stamp)) return true;
  return stamp - Date.now() < SKEW_MS;
};

const appFor = (platform) => ({
  id: platform === 'x' ? process.env.X_CLIENT_ID : process.env.TIKTOK_CLIENT_KEY,
  secret: platform === 'x' ? process.env.X_CLIENT_SECRET : process.env.TIKTOK_CLIENT_SECRET,
});

/**
 * Refresh the platform's access token if it is missing or close to expiry.
 * Returns a short note, or null when nothing needed doing.
 */
export async function ensureFresh(platform) {
  if (platform === 'x') {
    if (!process.env.X_REFRESH_TOKEN) return null;
    if (process.env.X_ACCESS_TOKEN && !needsRefresh('X_EXPIRES_AT')) return null;
    const vars = await refreshToken('x', appFor('x'));
    writeEnvVars(ENV_FILE, vars);
    return 'refreshed X access token';
  }

  if (platform === 'tiktok') {
    if (!process.env.TIKTOK_REFRESH_TOKEN) return null;
    if (process.env.TIKTOK_ACCESS_TOKEN && !needsRefresh('TIKTOK_EXPIRES_AT')) return null;
    const vars = await refreshToken('tiktok', appFor('tiktok'));
    writeEnvVars(ENV_FILE, vars);
    return 'refreshed TikTok access token';
  }

  return null;
}

export function envExists() {
  return fs.existsSync(ENV_FILE);
}
