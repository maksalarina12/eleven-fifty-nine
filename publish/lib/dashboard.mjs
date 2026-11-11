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
  const series = state.series?.name || 'The Last Message';
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
      <div class="kicker">EldraMyth · ${state.series?.season || 'S01'} · release desk</div>
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
      <a class="mini" href="/files/HASIL/index.html" target="_blank" rel="noopener">screening room ↗</a>
    </div>
  </div>

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
