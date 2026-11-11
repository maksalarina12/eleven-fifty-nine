/**
 * OAuth app definitions and token exchange for the four account families that
 * matter here: Google (YouTube), Meta (Instagram + Facebook Page), TikTok and X.
 *
 * Every platform requires the author's own developer app. This module removes
 * the copy-paste: one browser round trip per platform, tokens land in .env.
 */
import crypto from 'node:crypto';

const b64url = (buffer) => buffer.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

export const randomState = () => b64url(crypto.randomBytes(24));

export function makePkce() {
  const verifier = b64url(crypto.randomBytes(48));
  const challenge = b64url(crypto.createHash('sha256').update(verifier).digest());
  return {verifier, challenge};
}

export const redirectUri = (origin) => `${origin}/callback`;

/* ------------------------------ definitions ------------------------------ */

export const PROVIDERS = {
  youtube: {
    key: 'youtube',
    label: 'YouTube',
    covers: ['YouTube Shorts'],
    accent: '#e2685f',
    scopes: [
      'https://www.googleapis.com/auth/youtube.upload',
      'https://www.googleapis.com/auth/youtube.readonly',
    ],
    pkce: false,
    idKey: 'YT_CLIENT_ID',
    secretKey: 'YT_CLIENT_SECRET',
    where: 'console.cloud.google.com → Credentials → OAuth client ID → Desktop app',
    note: 'In Testing mode Google expires the refresh token after 7 days. Publish the app or use a Workspace account (Internal) for a permanent one.',
    fields: [
      {key: 'YT_CLIENT_ID', label: 'Client ID', placeholder: '…apps.googleusercontent.com'},
      {key: 'YT_CLIENT_SECRET', label: 'Client secret', placeholder: 'GOCSPX-…', secret: true},
    ],
    authorize(app, {redirect, state, challenge}) {
      const params = new URLSearchParams({
        client_id: app.id,
        redirect_uri: redirect,
        response_type: 'code',
        scope: this.scopes.join(' '),
        access_type: 'offline',
        prompt: 'consent',
        include_granted_scopes: 'true',
        state,
      });
      if (challenge) {
        params.set('code_challenge', challenge);
        params.set('code_challenge_method', 'S256');
      }
      return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
    },
    async exchange(app, {code, redirect, verifier}) {
      const body = new URLSearchParams({
        client_id: app.id,
        client_secret: app.secret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirect,
      });
      if (verifier) body.set('code_verifier', verifier);
      const token = await postForm('https://oauth2.googleapis.com/token', body);

      let account = {name: 'channel', detail: ''};
      try {
        const data = await getJson('https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true', {
          authorization: `Bearer ${token.access_token}`,
        });
        const channel = data.items?.[0];
        account = {name: channel?.snippet?.title || 'channel', detail: channel?.id || ''};
      } catch (error) {
        account = {name: 'channel', detail: `token valid · ${error.message}`};
      }

      if (!token.refresh_token) {
        throw new Error(
          'Google did not return a refresh token. Remove the app from myaccount.google.com → Security → Third-party access, then connect again.'
        );
      }

      return {
        vars: {
          YT_CLIENT_ID: app.id,
          YT_CLIENT_SECRET: app.secret,
          YT_REFRESH_TOKEN: token.refresh_token,
        },
        account,
        label: 'YouTube',
      };
    },
  },

  meta: {
    key: 'meta',
    label: 'Meta',
    covers: ['Instagram Reels', 'Facebook Reels'],
    accent: '#8fb6d6',
    scopes: [
      'pages_show_list',
      'pages_read_engagement',
      'pages_manage_posts',
      'instagram_basic',
      'instagram_content_publish',
      'business_management',
    ],
    pkce: false,
    idKey: 'META_APP_ID',
    secretKey: 'META_APP_SECRET',
    where: 'developers.facebook.com → Create app (Business) → App settings → Basic',
    note: 'Instagram must be a Professional account connected to the chosen Page. The Page token this writes does not expire while the user token stays valid.',
    fields: [
      {key: 'META_APP_ID', label: 'App ID', placeholder: '1234567890123456'},
      {key: 'META_APP_SECRET', label: 'App secret', placeholder: 'a1b2c3…', secret: true},
    ],
    authorize(app, {redirect, state}) {
      const params = new URLSearchParams({
        client_id: app.id,
        redirect_uri: redirect,
        response_type: 'code',
        state,
        scope: this.scopes.join(','),
      });
      return `https://www.facebook.com/v21.0/dialog/oauth?${params}`;
    },
    async exchange(app, {code, redirect}) {
      const short = await getJson(
        `https://graph.facebook.com/v21.0/oauth/access_token?${new URLSearchParams({
          client_id: app.id,
          client_secret: app.secret,
          redirect_uri: redirect,
          code,
        })}`
      );

      const long = await getJson(
        `https://graph.facebook.com/v21.0/oauth/access_token?${new URLSearchParams({
          grant_type: 'fb_exchange_token',
          client_id: app.id,
          client_secret: app.secret,
          fb_exchange_token: short.access_token,
        })}`
      );
      const userToken = long.access_token || short.access_token;

      const accounts = await getJson(
        `https://graph.facebook.com/v21.0/me/accounts?${new URLSearchParams({
          fields: 'id,name,access_token,instagram_business_account{id,username}',
          limit: '100',
          access_token: userToken,
        })}`
      );

      const pages = (accounts.data || [])
        .filter((page) => page.access_token)
        .map((page) => ({
          id: page.id,
          name: page.name,
          token: page.access_token,
          igId: page.instagram_business_account?.id || null,
          igUsername: page.instagram_business_account?.username || null,
        }));

      if (!pages.length) {
        throw new Error(
          'No Facebook Page returned. Make sure your account administers a Page, and that pages_show_list was approved when you clicked Allow.'
        );
      }

      return {app, pages, userToken, needsPage: true};
    },

    varsForPage(app, page) {
      return {
        META_APP_ID: app.id,
        META_APP_SECRET: app.secret,
        FB_PAGE_ID: page.id,
        FB_PAGE_TOKEN: page.token,
        FB_PAGE_NAME: page.name,
        IG_USER_ID: page.igId || '',
        IG_ACCESS_TOKEN: page.igId ? page.token : '',
      };
    },
  },

  tiktok: {
    key: 'tiktok',
    label: 'TikTok',
    covers: ['TikTok'],
    accent: '#c7b3d6',
    scopes: ['user.info.basic', 'video.publish'],
    pkce: true,
    idKey: 'TIKTOK_CLIENT_KEY',
    secretKey: 'TIKTOK_CLIENT_SECRET',
    where: 'developers.tiktok.com → Manage apps → Login Kit + Content Posting API',
    note: 'Unaudited apps can only post SELF_ONLY. Access tokens last about 24 hours; the release desk refreshes them automatically from now on.',
    fields: [
      {key: 'TIKTOK_CLIENT_KEY', label: 'Client key', placeholder: 'aw1234…'},
      {key: 'TIKTOK_CLIENT_SECRET', label: 'Client secret', placeholder: 'a1b2c3…', secret: true},
    ],
    authorize(app, {redirect, state, challenge}) {
      const params = new URLSearchParams({
        client_key: app.id,
        scope: this.scopes.join(','),
        response_type: 'code',
        redirect_uri: redirect,
        state,
      });
      if (challenge) {
        params.set('code_challenge', challenge);
        params.set('code_challenge_method', 'S256');
      }
      return `https://www.tiktok.com/v2/auth/authorize/?${params}`;
    },
    async exchange(app, {code, redirect, verifier}) {
      const body = new URLSearchParams({
        client_key: app.id,
        client_secret: app.secret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirect,
      });
      if (verifier) body.set('code_verifier', verifier);
      const token = await postForm('https://open.tiktokapis.com/v2/oauth/token/', body);
      if (token.error) throw new Error(token.error_description || token.error);

      const me = await getJson(
        'https://open.tiktokapis.com/v2/user/info/?fields=display_name,username,open_id',
        {authorization: `Bearer ${token.access_token}`}
      ).catch(() => null);
      const user = me?.data?.user;

      return {
        vars: {
          TIKTOK_CLIENT_KEY: app.id,
          TIKTOK_CLIENT_SECRET: app.secret,
          TIKTOK_ACCESS_TOKEN: token.access_token,
          TIKTOK_REFRESH_TOKEN: token.refresh_token || '',
          TIKTOK_OPEN_ID: token.open_id || user?.open_id || '',
          TIKTOK_EXPIRES_AT: new Date(Date.now() + (token.expires_in || 86400) * 1000).toISOString(),
        },
        account: {
          name: user?.username ? '@' + user.username : user?.display_name || 'account',
          detail: token.scope || '',
        },
        label: 'TikTok',
      };
    },
  },

  x: {
    key: 'x',
    label: 'X',
    covers: ['X'],
    accent: '#d8a273',
    scopes: ['tweet.read', 'tweet.write', 'users.read', 'media.write', 'offline.access'],
    pkce: true,
    idKey: 'X_CLIENT_ID',
    secretKey: 'X_CLIENT_SECRET',
    where: 'developer.x.com → app → User authentication settings → OAuth 2.0',
    note: 'Needs a plan with write access. Access tokens last 2 hours; they are refreshed automatically. App type “Native” means no client secret.',
    fields: [
      {key: 'X_CLIENT_ID', label: 'OAuth 2.0 client ID', placeholder: 'abc123…'},
      {key: 'X_CLIENT_SECRET', label: 'Client secret (optional)', placeholder: 'leave empty for Native apps', secret: true},
    ],
    authorize(app, {redirect, state, challenge}) {
      const params = new URLSearchParams({
        response_type: 'code',
        client_id: app.id,
        redirect_uri: redirect,
        scope: this.scopes.join(' '),
        state,
        code_challenge: challenge,
        code_challenge_method: 'S256',
      });
      return `https://x.com/i/oauth2/authorize?${params}`;
    },
    async exchange(app, {code, redirect, verifier}) {
      const body = new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirect,
        code_verifier: verifier,
      });
      if (!app.secret) body.set('client_id', app.id);
      const headers = {'content-type': 'application/x-www-form-urlencoded'};
      if (app.secret) {
        headers.authorization =
          'Basic ' + Buffer.from(`${app.id}:${app.secret}`).toString('base64');
      }
      const token = await postForm('https://api.x.com/2/oauth2/token', body, headers);
      if (token.error) throw new Error(token.error_description || token.error);

      const me = await getJson('https://api.x.com/2/users/me', {
        authorization: `Bearer ${token.access_token}`,
      }).catch(() => null);

      return {
        vars: {
          X_CLIENT_ID: app.id,
          X_CLIENT_SECRET: app.secret || '',
          X_ACCESS_TOKEN: token.access_token,
          X_REFRESH_TOKEN: token.refresh_token || '',
          X_EXPIRES_AT: new Date(Date.now() + (token.expires_in || 7200) * 1000).toISOString(),
        },
        account: {
          name: me?.data?.username ? '@' + me.data.username : 'account',
          detail: me?.data?.id ? 'user ' + me.data.id : '',
        },
        label: 'X',
      };
    },
  },
};

export const PROVIDER_ORDER = ['youtube', 'meta', 'tiktok', 'x'];

/* -------------------------------- helpers -------------------------------- */

async function request(url, options) {
  const res = await fetch(url, {...options, signal: AbortSignal.timeout(25000)});
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = {raw: text.slice(0, 400)};
  }
  if (!res.ok) {
    const detail =
      data?.error_description ||
      data?.error?.message ||
      (typeof data?.error === 'string' ? data.error : '') ||
      data?.message ||
      data?.raw ||
      res.statusText;
    throw new Error(`${res.status} ${detail}`);
  }
  return data;
}

const postForm = (url, body, headers = {}) =>
  request(url, {
    method: 'POST',
    headers: {'content-type': 'application/x-www-form-urlencoded', ...headers},
    body,
  });

const getJson = (url, headers = {}) => request(url, {headers});

/** Refresh an access token that is dead or about to die. */
export async function refreshToken(providerKey, app) {
  if (providerKey === 'x') {
    const body = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: process.env.X_REFRESH_TOKEN,
    });
    const headers = {'content-type': 'application/x-www-form-urlencoded'};
    if (app.secret) headers.authorization = 'Basic ' + Buffer.from(`${app.id}:${app.secret}`).toString('base64');
    else body.set('client_id', app.id);
    const token = await postForm('https://api.x.com/2/oauth2/token', body, headers);
    if (token.error) throw new Error(token.error_description || token.error);
    return {
      X_ACCESS_TOKEN: token.access_token,
      X_REFRESH_TOKEN: token.refresh_token || process.env.X_REFRESH_TOKEN,
      X_EXPIRES_AT: new Date(Date.now() + (token.expires_in || 7200) * 1000).toISOString(),
    };
  }

  if (providerKey === 'tiktok') {
    const body = new URLSearchParams({
      client_key: app.id,
      client_secret: app.secret,
      grant_type: 'refresh_token',
      refresh_token: process.env.TIKTOK_REFRESH_TOKEN,
    });
    const token = await postForm('https://open.tiktokapis.com/v2/oauth/token/', body);
    if (token.error) throw new Error(token.error_description || token.error);
    return {
      TIKTOK_ACCESS_TOKEN: token.access_token,
      TIKTOK_REFRESH_TOKEN: token.refresh_token || process.env.TIKTOK_REFRESH_TOKEN,
      TIKTOK_EXPIRES_AT: new Date(Date.now() + (token.expires_in || 86400) * 1000).toISOString(),
    };
  }

  throw new Error(`no refresh flow for ${providerKey}`);
}
