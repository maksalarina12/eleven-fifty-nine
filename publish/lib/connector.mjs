/**
 * One-click account linking.
 *
 * Mounted on the same local server as the release desk so the OAuth callback
 * always lands somewhere that exists: http://127.0.0.1:<port>/callback
 *
 * The developer app still has to exist — Google, Meta, TikTok and X require it.
 * Everything after that (authorize, exchange, store, verify) is one click.
 */
import fs from 'node:fs';
import path from 'node:path';
import {PROVIDERS, PROVIDER_ORDER, redirectUri, randomState, makePkce} from './oauth.mjs';
import {writeEnvVars, maskSecret} from './envfile.mjs';
import {ENV_FILE, ensureFresh} from './tokens.mjs';

const sessions = new Map();
const pagePicks = new Map();
const SESSION_TTL = 15 * 60 * 1000;

const esc = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

function prune(map) {
  const now = Date.now();
  for (const [key, value] of map) {
    if (now - value.createdAt > SESSION_TTL) map.delete(key);
  }
}

/* -------------------------------- styles -------------------------------- */

const CSS = `
:root{
  --ink:#07090c;--line:rgba(196,214,232,.13);--line-soft:rgba(196,214,232,.065);
  --text:#e8e6e1;--muted:rgba(214,222,232,.54);--dim:rgba(214,222,232,.32);
  --accent:#8fb6d6;--amber:#d8a273;--ok:#8fc6a0;--bad:#e2685f;
  --mono:ui-monospace,"SFMono-Regular",Menlo,Consolas,monospace;
  --serif:"Iowan Old Style","Palatino Linotype",Palatino,Georgia,serif;
}
*{box-sizing:border-box}
body{margin:0;background:var(--ink);color:var(--text);font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;-webkit-font-smoothing:antialiased}
body::before{content:"";position:fixed;inset:0;z-index:0;pointer-events:none;
  background:radial-gradient(900px 620px at 16% -4%,rgba(58,96,132,.20),transparent 62%),
             radial-gradient(700px 520px at 92% 104%,rgba(150,96,58,.09),transparent 66%),
             linear-gradient(180deg,#080b10,#05070a 62%,#040507)}
.wrap{position:relative;z-index:1;max-width:1180px;margin:0 auto;padding:0 clamp(16px,3vw,38px) 64px}
a{color:var(--accent);text-decoration:none}
a:hover{text-decoration:underline}
.top{display:flex;align-items:flex-end;justify-content:space-between;gap:24px;padding:26px 0 18px;border-bottom:1px solid var(--line)}
.kicker{font-family:var(--mono);font-size:9px;letter-spacing:.32em;color:var(--dim);text-transform:uppercase}
h1{font-family:var(--serif);font-weight:400;font-size:clamp(24px,2.6vw,32px);line-height:1.02;letter-spacing:-.01em;margin:9px 0 0}
h1 em{font-style:italic;color:var(--muted)}
.sub{font-family:var(--mono);font-size:9.5px;letter-spacing:.16em;color:var(--dim);text-transform:uppercase;margin:8px 0 0}
.back{font-family:var(--mono);font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:var(--muted);white-space:nowrap}
.intro{display:grid;grid-template-columns:1fr auto;gap:28px;align-items:start;margin:26px 0 6px;padding-bottom:20px;border-bottom:1px solid var(--line-soft)}
.intro p{margin:0;max-width:62ch;font-size:14px;line-height:1.6;color:var(--muted)}
.intro p b{color:var(--text);font-weight:500}
.meter{display:flex;border:1px solid var(--line);background:rgba(5,7,10,.4);flex:none}
.meter div{padding:9px 15px;border-left:1px solid var(--line-soft);display:flex;flex-direction:column;gap:4px}
.meter div:first-child{border-left:0}
.meter b{font-family:var(--mono);font-size:15px;font-weight:400;line-height:1;letter-spacing:.04em}
.meter span{font-family:var(--mono);font-size:8px;letter-spacing:.2em;color:var(--dim);text-transform:uppercase}
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(430px,1fr));gap:1px;background:var(--line);border:1px solid var(--line);margin-top:26px}
.card{background:linear-gradient(180deg,rgba(12,16,22,.96),rgba(7,9,12,.96));padding:20px 20px 22px;display:flex;flex-direction:column;gap:14px}
.card-top{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}
.num{font-family:var(--mono);font-size:9px;letter-spacing:.22em;color:var(--dim)}
.name{font-family:var(--serif);font-size:21px;line-height:1.1;margin:5px 0 0}
.covers{display:flex;flex-wrap:wrap;gap:6px;margin-top:9px}
.pill{font-family:var(--mono);font-size:8px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);border:1px solid var(--line);padding:4px 7px}
.badge{font-family:var(--mono);font-size:8px;letter-spacing:.18em;text-transform:uppercase;border:1px solid var(--line);padding:5px 8px;color:var(--dim);white-space:nowrap}
.badge.live{color:var(--ok);border-color:rgba(143,198,160,.34)}
.badge.ready{color:var(--amber);border-color:rgba(216,162,115,.32)}
.badge.bad{color:var(--bad);border-color:rgba(226,104,95,.34)}
.acct{font-family:var(--mono);font-size:10px;letter-spacing:.08em;color:var(--ok)}
.where{font-family:var(--mono);font-size:9px;line-height:1.7;letter-spacing:.04em;color:var(--dim);margin:0}
.redirect{display:flex;align-items:center;gap:8px;border:1px solid var(--line-soft);background:rgba(0,0,0,.28);padding:7px 9px}
.redirect code{font-family:var(--mono);font-size:9.5px;color:var(--muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1}
.copy{font-family:var(--mono);font-size:8px;letter-spacing:.16em;text-transform:uppercase;background:none;border:1px solid var(--line);color:var(--dim);padding:4px 6px;cursor:pointer}
.copy:hover{color:var(--text);border-color:var(--muted)}
form{display:flex;flex-direction:column;gap:8px}
label{display:flex;flex-direction:column;gap:5px;font-family:var(--mono);font-size:8px;letter-spacing:.18em;text-transform:uppercase;color:var(--dim)}
input{font-family:var(--mono);font-size:11px;background:rgba(0,0,0,.3);border:1px solid var(--line);color:var(--text);padding:8px 9px;outline:none}
input:focus{border-color:rgba(143,182,214,.5)}
input::placeholder{color:rgba(214,222,232,.22)}
.actions{display:flex;gap:8px;margin-top:2px}
button.act{font-family:var(--mono);font-size:9px;letter-spacing:.18em;text-transform:uppercase;border:1px solid var(--line);background:none;color:var(--text);padding:8px 12px;cursor:pointer;flex:1}
button.act:hover{border-color:var(--muted);background:rgba(255,255,255,.03)}
button.act.primary{border-color:rgba(143,198,160,.4);color:var(--ok)}
button.act:disabled{opacity:.34;cursor:not-allowed}
.said{font-family:var(--mono);font-size:9px;letter-spacing:.06em;color:var(--dim);min-height:12px}
.note{font-size:11.5px;line-height:1.55;color:var(--dim);margin:0;padding-top:10px;border-top:1px solid var(--line-soft)}
.foot{margin-top:30px;padding-top:16px;border-top:1px solid var(--line);font-family:var(--mono);font-size:9px;letter-spacing:.14em;text-transform:uppercase;color:var(--dim);display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap}
.single{max-width:620px;margin:64px auto;border:1px solid var(--line);background:rgba(9,12,17,.9);padding:34px 32px}
.single h1{margin-top:10px}
.single p{color:var(--muted);font-size:14px;line-height:1.6}
.single .big{font-family:var(--mono);font-size:13px;color:var(--ok);letter-spacing:.06em}
.list{display:flex;flex-direction:column;gap:1px;background:var(--line);border:1px solid var(--line);margin:18px 0}
.pick{display:flex;align-items:center;justify-content:space-between;gap:14px;background:rgba(10,13,18,.96);padding:13px 14px;border:0;color:var(--text);cursor:pointer;text-align:left;font-family:inherit}
.pick:hover{background:rgba(18,24,32,.96)}
.pick b{font-family:var(--mono);font-size:11px;font-weight:400;letter-spacing:.05em}
.pick span{font-family:var(--mono);font-size:9px;color:var(--dim);letter-spacing:.08em}
.err{font-family:var(--mono);font-size:10.5px;line-height:1.7;color:var(--bad);border-left:2px solid var(--bad);padding:6px 0 6px 11px;margin:16px 0 0;word-break:break-word}
@media(max-width:760px){
  .intro{grid-template-columns:1fr}
  .top{flex-direction:column;align-items:flex-start;gap:12px}
  .cards{grid-template-columns:1fr}
  .meter{width:100%}
  .meter div{flex:1}
}
`;

/* ------------------------------- rendering ------------------------------- */

const layout = (title, body) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)} · Release desk</title>
<style>${CSS}</style></head>
<body><div class="wrap">${body}</div></body></html>`;

function readConnections(root) {
  try {
    return JSON.parse(fs.readFileSync(path.join(root, 'publish', 'out', 'connections.json'), 'utf8'));
  } catch {
    return {results: {}, checkedAt: null};
  }
}

function card(provider, {origin, connections}) {
  const p = PROVIDERS[provider];
  const id = process.env[p.idKey] || '';
  const secret = process.env[p.secretKey] || '';
  const appReady = Boolean(id) && (provider === 'x' || Boolean(secret));

  const linkedKeys = provider === 'meta' ? ['instagram', 'facebook'] : [provider];
  const linked = linkedKeys.map((key) => connections[key]).find((entry) => entry && entry.status === 'linked');
  const failed = linkedKeys.map((key) => connections[key]).find((entry) => entry && entry.status === 'failed');

  const badge = linked ? 'live' : failed ? 'bad' : appReady ? 'ready' : '';
  const badgeText = linked ? 'linked' : failed ? 'token rejected' : appReady ? 'app saved' : 'needs app';

  const fields = p.fields
    .map((field) => {
      const current = process.env[field.key] || '';
      const shown = current ? (field.secret ? maskSecret(current) : current) : '';
      return `<label>${esc(field.label)}
        <input name="${esc(field.key)}" type="${field.secret ? 'password' : 'text'}" autocomplete="off" spellcheck="false"
          placeholder="${esc(shown || field.placeholder || '')}" data-empty="${current ? '0' : '1'}">
      </label>`;
    })
    .join('');

  const redirect = redirectUri(origin);

  return `<article class="card" data-provider="${provider}">
    <div class="card-top">
      <div>
        <div class="num">${String(PROVIDER_ORDER.indexOf(provider) + 1).padStart(2, '0')} / ${esc(p.label)}</div>
        <h2 class="name">${esc(p.label)}</h2>
        <div class="covers">${p.covers.map((cover) => `<span class="pill">${esc(cover)}</span>`).join('')}</div>
      </div>
      <span class="badge ${badge}">${esc(badgeText)}</span>
    </div>
    ${linked && linked.account ? `<div class="acct">${esc(linked.account)}${linked.detail ? ' · ' + esc(String(linked.detail).slice(0, 48)) : ''}</div>` : ''}
    ${failed && failed.error ? `<div class="acct" style="color:var(--bad)">${esc(String(failed.error).slice(0, 80))}</div>` : ''}
    <p class="where">${esc(p.where)}</p>
    <div class="redirect">
      <code>${esc(redirect)}</code>
      <button class="copy" data-copy="${esc(redirect)}">copy</button>
    </div>
    <form data-form="${provider}">
      ${fields}
      <div class="actions">
        <button class="act" type="submit">save app</button>
        <button class="act primary" type="button" data-start="${provider}" ${appReady ? '' : 'disabled'}>connect →</button>
      </div>
      <div class="said" data-said="${provider}"></div>
    </form>
    <p class="note">${esc(p.note)}</p>
  </article>`;
}

export function connectPage({root, origin}) {
  const {results, checkedAt} = readConnections(root);
  const linkedCount = PROVIDER_ORDER.filter((provider) => {
    const keys = provider === 'meta' ? ['instagram', 'facebook'] : [provider];
    return keys.some((key) => results[key] && results[key].status === 'linked');
  }).length;

  const body = `
    <header class="top">
      <div>
        <div class="kicker">Release desk / connections</div>
        <h1>Link the <em>accounts</em></h1>
        <p class="sub">One browser round trip per platform</p>
      </div>
      <a class="back" href="/">← back to desk</a>
    </header>

    <section class="intro">
      <p><b>You still need one developer app per platform.</b> Google, Meta, TikTok and X
      will not let any tool publish without it — that part cannot be automated. Everything
      after it can: save the app credentials once, press connect, approve in the browser,
      and the tokens are written to <code>.env</code> for you.
      Register the redirect URI below in each app exactly as shown, including the port.</p>
      <div class="meter">
        <div><b>${linkedCount}/4</b><span>linked</span></div>
        <div><b>${checkedAt ? new Date(checkedAt).toISOString().slice(0, 10) : '—'}</b><span>last check</span></div>
      </div>
    </section>

    <section class="cards">
      ${PROVIDER_ORDER.map((provider) => card(provider, {origin, connections: results})).join('')}
    </section>

    <footer class="foot">
      <span>Tokens stay on this machine · .env is chmod 600 and git-ignored</span>
      <span>X and TikTok refresh themselves</span>
    </footer>

    <script>
      const say = (provider, text, bad) => {
        const node = document.querySelector('[data-said="' + provider + '"]');
        if (!node) return;
        node.textContent = text;
        node.style.color = bad ? 'var(--bad)' : 'var(--dim)';
      };

      document.querySelectorAll('[data-copy]').forEach((button) => {
        button.addEventListener('click', async () => {
          try { await navigator.clipboard.writeText(button.dataset.copy); button.textContent = 'copied'; }
          catch { button.textContent = 'select'; }
          setTimeout(() => { button.textContent = 'copy'; }, 1400);
        });
      });

      document.querySelectorAll('[data-form]').forEach((form) => {
        form.addEventListener('submit', async (event) => {
          event.preventDefault();
          const provider = form.dataset.form;
          const values = {};
          for (const input of form.querySelectorAll('input')) {
            const value = input.value.trim();
            if (!value && input.dataset.empty === '1') continue;
            if (!value) continue;
            values[input.name] = value;
          }
          if (!Object.keys(values).length) return say(provider, 'fill at least one field', true);
          say(provider, 'saving…');
          try {
            const res = await fetch('/api/connect/save', {
              method: 'POST',
              headers: {'content-type': 'application/json'},
              body: JSON.stringify({provider, values}),
            });
            const data = await res.json();
            if (!data.ok) throw new Error(data.error || 'save failed');
            say(provider, 'saved · opening…');
            location.reload();
          } catch (error) {
            say(provider, error.message, true);
          }
        });
      });

      document.querySelectorAll('[data-start]').forEach((button) => {
        button.addEventListener('click', () => { location.href = '/start?p=' + encodeURIComponent(button.dataset.start); });
      });
    </script>`;

  return layout('Connections', body);
}

function messagePage({title, headline, text, tone = 'ok', detail, extra = ''}) {
  const color = tone === 'bad' ? 'var(--bad)' : 'var(--ok)';
  return layout(
    title,
    `<div class="single">
      <div class="kicker">Release desk / connections</div>
      <h1>${headline}</h1>
      <p style="color:${color};font-family:var(--mono);font-size:13px;letter-spacing:.06em">${esc(text)}</p>
      ${detail ? `<p class="err" style="${tone === 'ok' ? 'color:var(--dim);border-color:var(--line)' : ''}">${esc(detail)}</p>` : ''}
      ${extra}
      <p style="margin-top:24px"><a href="/connect">← connections</a> &nbsp;·&nbsp; <a href="/">release desk</a></p>
    </div>`
  );
}

/* -------------------------------- routes -------------------------------- */

async function readJsonBody(req) {
  let size = 0;
  let body = '';
  for await (const chunk of req) {
    size += chunk.length;
    if (size > 64 * 1024) throw new Error('body too large');
    body += chunk;
  }
  if (!body) return {};
  return JSON.parse(body);
}

const sendHtml = (res, status, html) => {
  res.writeHead(status, {'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store'});
  res.end(html);
};

const sendJson = (res, status, value) => {
  res.writeHead(status, {'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store'});
  res.end(JSON.stringify(value));
};

/**
 * Handle /connect, /start, /callback and /api/connect/*.
 * Returns true when the request was handled.
 */
export async function handleConnect(req, res, {root}) {
  const url = new URL(req.url, 'http://127.0.0.1');
  const route = url.pathname;
  const origin = `http://${req.headers.host || '127.0.0.1'}`;

  if (req.method === 'GET' && (route === '/connect' || route === '/connect/')) {
    sendHtml(res, 200, connectPage({root, origin}));
    return true;
  }

  if (req.method === 'POST' && route === '/api/connect/save') {
    let body;
    try {
      body = await readJsonBody(req);
    } catch (error) {
      return sendJson(res, 400, {ok: false, error: error.message}), true;
    }
    const provider = PROVIDERS[body.provider];
    if (!provider) return sendJson(res, 404, {ok: false, error: 'unknown provider'}), true;

    const allowed = new Set(provider.fields.map((field) => field.key));
    const values = Object.fromEntries(
      Object.entries(body.values || {}).filter(([key, value]) => allowed.has(key) && value !== '')
    );
    if (!Object.keys(values).length) return sendJson(res, 400, {ok: false, error: 'nothing to save'}), true;

    writeEnvVars(ENV_FILE, values, {section: provider.label});
    return sendJson(res, 200, {ok: true, saved: Object.keys(values)}), true;
  }

  if (req.method === 'GET' && route === '/start') {
    const provider = PROVIDERS[url.searchParams.get('p')];
    if (!provider) return sendHtml(res, 404, messagePage({title: 'Unknown', headline: 'Unknown platform', text: 'No such provider.', tone: 'bad'})), true;

    const id = process.env[provider.idKey];
    const secret = process.env[provider.secretKey];
    if (!id || (!secret && provider.key !== 'x')) {
      return sendHtml(
        res,
        400,
        messagePage({
          title: 'App missing',
          headline: 'Save the app first',
          text: `${provider.label} needs ${provider.idKey}${provider.key === 'x' ? '' : ' and ' + provider.secretKey} in .env.`,
          tone: 'bad',
          detail: provider.where,
        })
      ), true;
    }

    prune(sessions);
    const state = randomState();
    const pkce = provider.pkce ? makePkce() : {verifier: null, challenge: null};
    const redirect = redirectUri(origin);
    sessions.set(state, {provider: provider.key, verifier: pkce.verifier, redirect, createdAt: Date.now()});

    const target = provider.authorize({id, secret}, {redirect, state, challenge: pkce.challenge});
    res.writeHead(302, {location: target, 'cache-control': 'no-store'});
    res.end();
    return true;
  }

  if (req.method === 'GET' && route === '/callback') {
    const error = url.searchParams.get('error') || url.searchParams.get('error_description');
    const state = url.searchParams.get('state');
    const code = url.searchParams.get('code');
    const session = state ? sessions.get(state) : null;

    if (error) {
      return sendHtml(
        res,
        400,
        messagePage({title: 'Denied', headline: 'Authorization refused', text: decodeURIComponent(error).slice(0, 200), tone: 'bad'})
      ), true;
    }
    if (!code || !session) {
      return sendHtml(
        res,
        400,
        messagePage({
          title: 'Stale',
          headline: 'This link expired',
          text: 'Start the connection again from the connections page.',
          tone: 'bad',
        })
      ), true;
    }

    const provider = PROVIDERS[session.provider];
    const app = {id: process.env[provider.idKey], secret: process.env[provider.secretKey]};

    try {
      const result = await provider.exchange(app, {
        code,
        redirect: session.redirect,
        verifier: session.verifier,
      });
      sessions.delete(state);

      if (result.needsPage) {
        prune(pagePicks);
        pagePicks.set(state, {app: result.app, pages: result.pages, createdAt: Date.now()});
        const list = result.pages
          .map(
            (page) => `<button class="pick" data-page="${esc(page.id)}" data-state="${esc(state)}">
              <b>${esc(page.name)}</b>
              <span>${page.igUsername ? '@' + esc(page.igUsername) + ' · instagram' : 'no instagram linked'}</span>
            </button>`
          )
          .join('');

        return sendHtml(
          res,
          200,
          messagePage({
            title: 'Choose Page',
            headline: 'Which Page?',
            text: 'Instagram Reels publish through a Page. Pick the one this account should use.',
            detail: 'The Page token written from here does not expire while the app stays connected.',
            extra: `<div class="list">${list}</div>
              <script>
                document.querySelectorAll('[data-page]').forEach((button) => {
                  button.addEventListener('click', async () => {
                    button.disabled = true;
                    const res = await fetch('/api/connect/page', {
                      method: 'POST',
                      headers: {'content-type': 'application/json'},
                      body: JSON.stringify({state: button.dataset.state, pageId: button.dataset.page}),
                    });
                    const data = await res.json();
                    if (data.ok) {
                      document.querySelector('.list').innerHTML =
                        '<p style="color:var(--ok);font-family:var(--mono);font-size:12px;padding:14px">Linked ' +
                        data.account + '. You can close this page.</p>';
                    } else {
                      button.disabled = false;
                      alert(data.error || 'could not link this Page');
                    }
                  });
                });
              </script>`,
          })
        ), true;
      }

      writeEnvVars(ENV_FILE, result.vars, {section: result.label});
      await ensureFresh(session.provider).catch(() => null);

      const written = Object.entries(result.vars)
        .filter(([, value]) => value)
        .map(([key, value]) => `${key}=${/(SECRET|TOKEN|KEY)/.test(key) ? maskSecret(value) : value}`)
        .join(' · ');

      return sendHtml(
        res,
        200,
        messagePage({
          title: 'Linked',
          headline: `${result.label} is <em>linked</em>`,
          text: result.account.name + (result.account.detail ? ' · ' + result.account.detail : ''),
          detail: written,
          extra: `<p style="font-size:12.5px;color:var(--dim)">Next: run <b>check links</b> on the desk to confirm every platform,
            then generate a pack and try a dry run.</p>`,
        })
      ), true;
    } catch (exchangeError) {
      return sendHtml(
        res,
        400,
        messagePage({
          title: 'Failed',
          headline: 'Handshake failed',
          text: `${provider.label} rejected the exchange`,
          tone: 'bad',
          detail: exchangeError.message,
        })
      ), true;
    }
  }

  if (req.method === 'POST' && route === '/api/connect/page') {
    let body;
    try {
      body = await readJsonBody(req);
    } catch (error) {
      return sendJson(res, 400, {ok: false, error: error.message}), true;
    }
    const pick = pagePicks.get(body.state);
    if (!pick) return sendJson(res, 409, {ok: false, error: 'page choice expired — connect again'}), true;

    const page = pick.pages.find((entry) => entry.id === body.pageId);
    if (!page) return sendJson(res, 404, {ok: false, error: 'unknown page'}), true;

    const vars = PROVIDERS.meta.varsForPage(pick.app, page);
    writeEnvVars(ENV_FILE, vars, {section: 'Meta'});
    pagePicks.delete(body.state);

    return sendJson(res, 200, {
      ok: true,
      account: page.igUsername ? `${page.name} · @${page.igUsername}` : page.name,
      vars: Object.fromEntries(Object.entries(vars).map(([key, value]) => [key, /SECRET|TOKEN/.test(key) ? maskSecret(value) : value])),
    }), true;
  }

  return false;
}
