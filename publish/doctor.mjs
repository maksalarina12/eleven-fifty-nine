#!/usr/bin/env node
/**
 * Check which platform accounts are actually linked.
 *
 *   npm run doctor
 *   node publish/doctor.mjs --json
 *
 * Reads credentials from .env, asks each platform who the token belongs to,
 * writes publish/out/connections.json and prints a table.
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {loadEnv, parseArgs, writeFile} from './lib/util.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
loadEnv(path.join(root, '.env'));
const args = parseArgs();

const GRAPH = 'https://graph.facebook.com/v21.0';

async function call(url, options = {}) {
  const res = await fetch(url, {...options, signal: AbortSignal.timeout(15000)});
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = {raw: text.slice(0, 300)};
  }
  if (!res.ok) {
    const detail =
      data?.error?.message ||
      data?.error_description ||
      data?.message ||
      (typeof data?.raw === 'string' ? data.raw : '') ||
      res.statusText;
    throw new Error(`${res.status} ${detail}`);
  }
  return data;
}

const missing = (...names) => names.filter((name) => !process.env[name]);

/* ------------------------------- checks --------------------------------- */

const checks = {
  youtube: {
    label: 'YouTube',
    env: ['YT_CLIENT_ID', 'YT_CLIENT_SECRET', 'YT_REFRESH_TOKEN'],
    async run() {
      const body = new URLSearchParams({
        client_id: process.env.YT_CLIENT_ID,
        client_secret: process.env.YT_CLIENT_SECRET,
        refresh_token: process.env.YT_REFRESH_TOKEN,
        grant_type: 'refresh_token',
      });
      const token = await call('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {'content-type': 'application/x-www-form-urlencoded'},
        body,
      });

      try {
        const channels = await call('https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true', {
          headers: {authorization: `Bearer ${token.access_token}`},
        });
        const channel = channels.items?.[0];
        return {
          ok: true,
          account: channel?.snippet?.title || 'channel',
          detail: channel?.id ? `channel ${channel.id}` : 'token valid',
        };
      } catch (error) {
        // youtube.upload alone cannot read the channel; the token is still good.
        return {ok: true, account: 'channel', detail: `token valid · add youtube.readonly to see the name (${error.message})`};
      }
    },
  },

  instagram: {
    label: 'Instagram',
    env: ['IG_USER_ID', 'IG_ACCESS_TOKEN'],
    async run() {
      const data = await call(
        `${GRAPH}/${process.env.IG_USER_ID}?fields=username,account_type&access_token=${encodeURIComponent(process.env.IG_ACCESS_TOKEN)}`
      );
      return {ok: true, account: data.username ? '@' + data.username : data.id, detail: data.account_type || 'professional account'};
    },
  },

  facebook: {
    label: 'Facebook Page',
    env: ['FB_PAGE_ID', 'FB_PAGE_TOKEN'],
    async run() {
      const data = await call(
        `${GRAPH}/${process.env.FB_PAGE_ID}?fields=name,id&access_token=${encodeURIComponent(process.env.FB_PAGE_TOKEN)}`
      );
      return {ok: true, account: data.name || data.id, detail: 'page ' + data.id};
    },
  },

  tiktok: {
    label: 'TikTok',
    env: ['TIKTOK_ACCESS_TOKEN'],
    async run() {
      const data = await call('https://open.tiktokapis.com/v2/user/info/?fields=display_name,username,open_id', {
        headers: {authorization: `Bearer ${process.env.TIKTOK_ACCESS_TOKEN}`},
      });
      const user = data?.data?.user;
      if (!user) throw new Error(data?.error?.message || 'no user returned');
      return {ok: true, account: user.username ? '@' + user.username : user.display_name, detail: user.open_id || ''};
    },
  },

  x: {
    label: 'X',
    env: ['X_ACCESS_TOKEN'],
    async run() {
      const data = await call('https://api.x.com/2/users/me', {
        headers: {authorization: `Bearer ${process.env.X_ACCESS_TOKEN}`},
      });
      const user = data?.data;
      if (!user) throw new Error('no user returned');
      return {ok: true, account: '@' + user.username, detail: user.id ? 'user ' + user.id : 'token valid'};
    },
  },
};

/* -------------------------------- run ----------------------------------- */

const results = {};
for (const [key, check] of Object.entries(checks)) {
  const absent = missing(...check.env);
  if (absent.length) {
    results[key] = {status: 'unlinked', label: check.label, missing: absent};
    continue;
  }
  try {
    const found = await check.run();
    results[key] = {status: 'linked', label: check.label, ...found};
  } catch (error) {
    results[key] = {status: 'failed', label: check.label, error: error.message};
  }
}

const stamp = new Date().toISOString();
const outDir = path.join(root, 'publish', 'out');
writeFile(path.join(outDir, 'connections.json'), JSON.stringify({checkedAt: stamp, results}, null, 2) + '\n');

if (args.json) {
  console.log(JSON.stringify({checkedAt: stamp, results}, null, 2));
} else {
  const pad = (text, width) => String(text).padEnd(width);
  console.log('');
  console.log('  ' + pad('PLATFORM', 16) + pad('STATUS', 10) + pad('ACCOUNT', 26) + 'DETAIL');
  console.log('  ' + '-'.repeat(88));
  for (const result of Object.values(results)) {
    const status = result.status === 'linked' ? 'linked' : result.status === 'failed' ? 'FAILED' : '—';
    const account = result.account || (result.status === 'unlinked' ? 'not configured' : '');
    const detail =
      result.detail || result.error || (result.missing ? 'missing ' + result.missing.join(', ') : '');
    console.log('  ' + pad(result.label, 16) + pad(status, 10) + pad(account, 26) + detail);
  }
  console.log('');

  const linked = Object.values(results).filter((r) => r.status === 'linked').length;
  const failed = Object.values(results).filter((r) => r.status === 'failed').length;
  console.log(`  ${linked}/5 linked${failed ? ` · ${failed} failed` : ''} · see publish/CONNECT.md for the setup steps`);
  console.log('');
}

process.exit(Object.values(results).some((r) => r.status === 'failed') ? 1 : 0);
