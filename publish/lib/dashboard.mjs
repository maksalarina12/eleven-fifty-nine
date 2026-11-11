import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const css = fs.readFileSync(path.join(here, 'dashboard.css'), 'utf8');
const client = fs.readFileSync(path.join(here, 'dashboard.client.js'), 'utf8');

function safeJson(value) {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

/**
 * One self-contained control desk page. Everything is rendered client-side from
 * the embedded state; the server owns generation, credentials and static files.
 */
export function renderDashboard(state) {
  const series = state.series?.name || 'Release desk';
  if (!state.episodes?.length) return emptyDashboard({state, series, css});
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="color-scheme" content="dark">
<title>Release desk — ${series}</title>
<style>${css}</style>
</head>
<body>
<main class="shell">
  <header class="top">
    <div class="brand">
      <div class="kicker">${state.series?.handle || 'local'} · ${state.series?.season || 'S01'} · release desk</div>
      <h1>${series} <em>— release desk</em></h1>
      <p class="tagline">master → pack → platform · local only · nothing posts by itself</p>
    </div>
    <div class="status" id="status" aria-live="polite"></div>
  </header>

  <div class="toolbar">
    <div class="crumb">
      <span>S01</span><i></i><span>${state.episodes.length} parts</span><i></i>
      <span>source: HASIL/</span><i></i><span>dry run default</span>
    </div>
    <div class="tools">
      <button class="mini" id="doctor">check links</button>
      <button class="mini" id="genAll">pack missing</button>
      <a class="mini accent" href="/connect">connect accounts →</a>
      ${state.screeningRoom ? '<a class="mini" href="/files/HASIL/index.html" target="_blank" rel="noopener">screening room ↗</a>' : ''}
    </div>
  </div>

  ${state.masters === 0 ? `<div class="notice">no video files found in <code>${String(state.videoDir || '').replace(/</g, '&lt;')}</code> — run <code>npm run setup -- --dir &lt;folder&gt;</code> to point the desk at your videos</div>` : ''}

  <div class="strip" id="strip" role="group" aria-label="Episodes"></div>

  <section class="detail" id="detail" aria-live="polite"></section>

  <div class="panel-head">
    <h2 class="h3">platform handoff</h2>
    <div class="seg" id="langs" role="group" aria-label="Caption language">
      <button data-lang="en" aria-pressed="true">EN</button>
      <button data-lang="id" aria-pressed="false">ID</button>
    </div>
  </div>

  <div id="tableWrap"></div>

  <div class="console">
    <div class="cbar"><b>terminal</b><code id="logcmd"></code></div>
    <pre id="log" tabindex="0"></pre>
  </div>

  <footer class="foot">
    <span>local · <kbd>1</kbd>–<kbd>5</kbd> switch · <kbd>G</kbd> generate · <kbd>T</kbd> template</span>
    <span>publish/README.md</span>
  </footer>
</main>

<script id="state" type="application/json">${safeJson(state)}</script>
<script>${client}</script>
</body>
</html>
`;
}

/**
 * Shown when no videos were found: the desk is useless until the user points it
 * at a folder, so replace the whole page with one instruction.
 */
function emptyDashboard({state, series, css}) {
  const dir = state.videoDir || 'videos';
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="dark">
<title>Release desk — ${series}</title>
<style>${css}</style>
</head>
<body>
<main class="shell">
  <header class="top">
    <div class="brand">
      <div class="kicker">${state.series?.handle || 'local'} · ${state.series?.season || 'S01'} · release desk</div>
      <h1>${series} <em>— release desk</em></h1>
      <p class="tagline">no videos found · point the desk at a folder</p>
    </div>
  </header>
  <section class="detail" style="display:block;padding:34px 0 10px">
    <h2 style="font-family:var(--serif);font-weight:400;font-size:26px;margin:0 0 10px">Nothing to publish yet</h2>
    <p style="max-width:64ch;color:var(--muted);line-height:1.6;margin:0 0 18px">
      The desk looked in <code style="font-family:var(--mono);color:var(--text)">${dir}/</code> for
      .mp4, .mov, .m4v or .webm files and found none. Put your videos there, or scan another folder:
    </p>
    <pre style="font-family:var(--mono);font-size:12px;line-height:1.9;color:var(--text);border:1px solid var(--line);background:rgba(0,0,0,.28);padding:14px 16px;margin:0 0 18px;overflow:auto">npm run setup -- --dir ~/my-videos</pre>
    <p style="max-width:64ch;color:var(--dim);line-height:1.6;margin:0 0 22px">
      The setup writes <code style="font-family:var(--mono)">publish/config.json</code> and
      <code style="font-family:var(--mono)">publish/episodes.json</code> for you, then reload this page.
    </p>
    <p style="font-family:var(--mono);font-size:10px;letter-spacing:.16em;text-transform:uppercase">
      <a href="/connect" style="color:var(--accent)">link accounts</a>
      &nbsp;·&nbsp;
      <a href="/" style="color:var(--accent)">reload</a>
    </p>
  </section>
</main>
</body></html>`;
}
