import {PLATFORMS, PLATFORM_KEYS, compose, validate} from './platforms.mjs';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function embed(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c').replace(/\u2028|\u2029/g, '');
}

/**
 * A single self-contained page: previews, editable copy, per-platform checklist
 * and a button that opens that platform's upload screen.
 */
export function buildReviewHtml({config, episode, captions, videoPath, posterSrc, generatedAt, warnings, mode}) {
  const series = config.series;
  const available = Object.keys(captions);
  const defaultLang = captions[config.defaultLanguage] ? config.defaultLanguage : available[0];
  const checks = {};
  for (const key of PLATFORM_KEYS) checks[key] = validate(key, captions[defaultLang][key], config);

  const data = {
    config: {series, languages: available, defaultLanguage: defaultLang},
    episode: {part: episode.part, title: episode.title, alias: episode.alias, key: episode.key},
    platformOrder: PLATFORM_KEYS,
    platforms: Object.fromEntries(
      PLATFORM_KEYS.map((k) => [
        k,
        {
          label: PLATFORMS[k].label,
          short: PLATFORMS[k].short,
          accent: PLATFORMS[k].accent,
          max: PLATFORMS[k].limits.body,
          titleMax: PLATFORMS[k].limits.title,
          maxTags: Math.min(PLATFORMS[k].maxTags, config.platforms?.[k]?.maxTags ?? PLATFORMS[k].maxTags),
          uploadUrl: PLATFORMS[k].uploadUrl,
          visible: PLATFORMS[k].visible,
          notes: PLATFORMS[k].notes,
          checklist: PLATFORMS[k].checklist,
          enabled: config.platforms?.[k]?.enabled !== false,
          validation: checks[k],
        },
      ])
    ),
    captions,
    posterSrc: posterSrc || '',
  };

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="color-scheme" content="dark">
<title>Publish pack — ${esc(series.name)} Part ${episode.part}</title>
<style>
  :root{
    --ink:#07090c; --ink-2:#0b0e13; --ink-3:#0e1218;
    --line:rgba(196,214,232,.13); --line-soft:rgba(196,214,232,.07);
    --text:#e8e6e1; --muted:rgba(214,222,232,.52); --dim:rgba(214,222,232,.3);
    --accent:#8fb6d6; --warn:#d8a273; --bad:#e2685f; --ok:#8fc6a0;
    --mono:ui-monospace,"SFMono-Regular",Menlo,Consolas,monospace;
    --sans:"Inter",system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
  }
  *{box-sizing:border-box}
  body{margin:0;background:var(--ink);color:var(--text);font-family:var(--sans);-webkit-font-smoothing:antialiased}
  .bg{position:fixed;inset:0;z-index:0;pointer-events:none;
    background:radial-gradient(900px 700px at 18% 4%, rgba(58,96,132,.2), transparent 62%),
      radial-gradient(700px 600px at 88% 88%, rgba(150,96,58,.1), transparent 66%),
      linear-gradient(180deg,#080b10,#05070a 60%,#040507)}
  main{position:relative;z-index:1;max-width:1280px;margin:0 auto;padding:clamp(20px,3.2vw,44px)}
  header.top{display:flex;gap:26px;align-items:flex-start;padding-bottom:22px;border-bottom:1px solid var(--line)}
  .poster{width:104px;aspect-ratio:9/16;object-fit:cover;background:#05070a;border:1px solid var(--line-soft);flex:none}
  .titles{min-width:0;flex:1}
  .kicker{font-family:var(--mono);font-size:11px;letter-spacing:.24em;text-transform:uppercase;color:var(--dim)}
  h1{margin:.35em 0 .2em;font-size:clamp(22px,3.4vw,34px);font-weight:600;letter-spacing:-.01em}
  .sub{color:var(--muted);font-size:14px;line-height:1.55;max-width:70ch}
  .meta{margin-top:12px;display:flex;flex-wrap:wrap;gap:8px}
  .chip{font-family:var(--mono);font-size:11px;color:var(--muted);border:1px solid var(--line-soft);padding:4px 9px;border-radius:2px}
  .bar{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin:22px 0 18px}
  .switch{display:inline-flex;border:1px solid var(--line);border-radius:2px;overflow:hidden}
  .switch button{background:transparent;color:var(--muted);border:0;padding:8px 16px;font-family:var(--mono);font-size:11px;letter-spacing:.2em;text-transform:uppercase;cursor:pointer}
  .switch button[aria-pressed="true"]{background:rgba(143,182,214,.12);color:var(--text)}
  .btn{background:transparent;color:var(--text);border:1px solid var(--line);padding:8px 14px;font-family:var(--mono);font-size:11px;letter-spacing:.16em;text-transform:uppercase;cursor:pointer;border-radius:2px}
  .btn:hover{border-color:rgba(196,214,232,.32);background:rgba(196,214,232,.04)}
  .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(360px,1fr));gap:16px}
  .card{border:1px solid var(--line);background:linear-gradient(180deg,rgba(255,255,255,.016),transparent);padding:16px;border-radius:3px;display:flex;flex-direction:column;gap:12px}
  .card.off{opacity:.42}
  .card h2{margin:0;font-size:14px;letter-spacing:.04em;display:flex;align-items:center;gap:10px;font-weight:600}
  .dot{width:9px;height:9px;border-radius:50%;flex:none}
  .count{margin-left:auto;font-family:var(--mono);font-size:11px;color:var(--dim)}
  .count.over{color:var(--bad)}
  label.f{font-family:var(--mono);font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:var(--dim);display:block;margin-bottom:5px}
  textarea,input.t{width:100%;background:#05070a;color:var(--text);border:1px solid var(--line-soft);border-radius:2px;padding:10px 11px;font-family:var(--sans);font-size:13.5px;line-height:1.6;resize:vertical}
  input.t{font-size:15px;font-weight:600}
  textarea:focus,input.t:focus{outline:none;border-color:rgba(143,182,214,.4)}
  .actions{display:flex;flex-wrap:wrap;gap:8px}
  ul.notes{margin:0;padding-left:16px;color:var(--muted);font-size:12.5px;line-height:1.6}
  ul.notes li{margin-bottom:2px}
  .checks{margin:0;padding:0;list-style:none;color:var(--muted);font-size:12.5px;line-height:1.7}
  .checks label{display:flex;gap:9px;align-items:flex-start;cursor:pointer}
  .checks input{margin-top:3px;accent-color:#8fb6d6}
  .alert{border-left:2px solid var(--warn);padding:9px 12px;background:rgba(216,162,115,.06);color:var(--muted);font-size:12.5px;border-radius:0 2px 2px 0}
  .alert.bad{border-color:var(--bad);background:rgba(226,104,95,.07);color:#f0c7c2}
  .toast{position:fixed;left:50%;bottom:28px;transform:translateX(-50%);background:#12161d;border:1px solid var(--line);color:var(--text);padding:10px 18px;font-family:var(--mono);font-size:11px;letter-spacing:.14em;text-transform:uppercase;border-radius:2px;opacity:0;transition:opacity .18s}
  .toast.on{opacity:1}
  footer{margin-top:34px;padding-top:18px;border-top:1px solid var(--line);color:var(--dim);font-size:12px;font-family:var(--mono)}
</style>
</head>
<body>
<div class="bg"></div>
<main>
  <header class="top">
    <img class="poster" alt="" id="poster">
    <div class="titles">
      <div class="kicker">Publish pack · ${esc(series.season)} · Part ${episode.part}</div>
      <h1>${esc(episode.title)}${episode.alias ? ` <span style="color:var(--dim);font-weight:400">/ ${esc(episode.alias)}</span>` : ''}</h1>
      <p class="sub">Captions, hashtags and a checklist per platform. Edit any field before copying — nothing here posts by itself.</p>
      <div class="meta">
        <span class="chip" id="chip-lang">lang: ${esc(defaultLang)}</span>
        <span class="chip">${esc(mode)}</span>
        <span class="chip">generated ${esc(generatedAt)}</span>
        <span class="chip" id="chip-video">${esc(videoPath)}</span>
      </div>
    </div>
  </header>

  <div class="bar">
    <div class="switch" id="langs"></div>
    <button class="btn" id="copyAll">Copy all captions</button>
    <button class="btn" id="dlAll">Download .txt bundle</button>
  </div>

  <div id="warnings"></div>
  <div class="grid" id="grid"></div>

  <footer>Generated by <code>publish/generate.mjs</code> · edit <code>publish/config.json</code> to change tone, tags or platform budgets.</footer>
</main>
<div class="toast" id="toast"></div>

<script>
const DATA = ${embed(data)};
const state = {lang: DATA.config.defaultLanguage};

const $ = (s, r = document) => r.querySelector(s);
const el = (tag, cls, txt) => { const n = document.createElement(tag); if (cls) n.className = cls; if (txt != null) n.textContent = txt; return n; };

function composed(platformKey, caption) {
  const spec = DATA.platforms[platformKey];
  const tags = (caption.tags || []).slice(0, spec.maxTags);
  const body = (caption.body || '').trim();
  return body + (tags.length ? '\\n\\n' + tags.join(' ') : '');
}

function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('on');
  clearTimeout(t._h);
  t._h = setTimeout(() => t.classList.remove('on'), 1500);
}

function copy(text) {
  const done = () => toast('copied');
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(done).catch(() => fallback(text, done));
  } else fallback(text, done);
}
function fallback(text, done) {
  const ta = el('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand('copy'); done(); } catch (e) { toast('copy failed'); }
  ta.remove();
}

function download(name, text) {
  const a = el('a');
  a.href = URL.createObjectURL(new Blob([text], {type: 'text/plain;charset=utf-8'}));
  a.download = name;
  a.click();
  URL.revokeObjectURL(a.href);
}

function renderLangs() {
  const box = $('#langs');
  box.innerHTML = '';
  for (const lang of DATA.config.languages) {
    const b = el('button', null, lang.toUpperCase());
    b.setAttribute('aria-pressed', String(lang === state.lang));
    b.onclick = () => { state.lang = lang; renderLangs(); renderGrid(); $('#chip-lang').textContent = 'lang: ' + lang; };
    box.appendChild(b);
  }
}

function renderGrid() {
  const grid = $('#grid');
  grid.innerHTML = '';
  const caps = DATA.captions[state.lang] || {};
  for (const key of DATA.platformOrder) {
    const spec = DATA.platforms[key];
    const cap = caps[key];
    if (!cap) continue;

    const card = el('section', 'card' + (spec.enabled ? '' : ' off'));
    const h = el('h2');
    const dot = el('span', 'dot');
    dot.style.background = spec.accent;
    h.appendChild(dot);
    h.appendChild(el('span', null, spec.label));
    const count = el('span', 'count');
    h.appendChild(count);
    card.appendChild(h);

    if (spec.titleMax) {
      const lt = el('label', 'f', 'Title · max ' + spec.titleMax + ' characters — series name and part number must survive');
      card.appendChild(lt);
      const input = el('input', 't');
      input.value = cap.title || '';
      card.appendChild(input);
      input.addEventListener('input', () => { cap.title = input.value; update(); });
    }

    const lb = el('label', 'f', 'Caption · max ' + spec.max + ' characters including hashtags');
    card.appendChild(lb);

    const ta = el('textarea');
    ta.rows = key === 'x' ? 4 : 8;
    ta.value = cap.body || '';
    card.appendChild(ta);
    ta.addEventListener('input', () => { cap.body = ta.value; autosize(ta); update(); });

    const lt2 = el('label', 'f', 'Hashtags · max ' + spec.maxTags + ' · pool only');
    card.appendChild(lt2);
    const tagInput = el('textarea');
    tagInput.rows = 2;
    tagInput.value = (cap.tags || []).join(' ');
    tagInput.style.fontSize = '13px';
    tagInput.style.fontFamily = 'var(--mono)';
    card.appendChild(tagInput);
    tagInput.addEventListener('input', () => {
      cap.tags = tagInput.value.split(/\\s+/).map((t) => t.trim()).filter(Boolean).map((t) => (t.startsWith('#') ? t : '#' + t));
      update();
    });

    const tips = el('ul', 'notes');
    for (const n of spec.notes) tips.appendChild(el('li', null, n));
    card.appendChild(tips);

    const checks = el('ul', 'checks');
    spec.checklist.forEach((text, i) => {
      const li = el('li');
      const lab = el('label');
      const cb = el('input');
      cb.type = 'checkbox';
      const storeKey = 'check:' + DATA.episode.key + ':' + key + ':' + i;
      cb.checked = localStorage.getItem(storeKey) === '1';
      cb.onchange = () => localStorage.setItem(storeKey, cb.checked ? '1' : '0');
      lab.appendChild(cb);
      lab.appendChild(el('span', null, text));
      li.appendChild(lab);
      checks.appendChild(li);
    });
    card.appendChild(checks);

    const actions = el('div', 'actions');
    const c1 = el('button', 'btn', 'Copy caption');
    c1.onclick = () => copy(composed(key, cap));
    const c2 = el('button', 'btn', 'Copy title + caption');
    c2.onclick = () => copy((cap.title ? cap.title + '\\n\\n' : '') + composed(key, cap));
    const c3 = el('button', 'btn', 'Upload page');
    c3.onclick = () => window.open(spec.uploadUrl, '_blank', 'noopener');
    const c4 = el('button', 'btn', 'Save .txt');
    c4.onclick = () => download(DATA.episode.key + '-' + key + '-' + state.lang + '.txt', (cap.title ? cap.title + '\\n\\n' : '') + composed(key, cap));
    actions.append(c1, c2, c3, c4);
    card.appendChild(actions);

    const alertBox = el('div');
    card.appendChild(alertBox);

    card._update = () => {
      const text = composed(key, cap);
      const total = (cap.title ? cap.title.length : 0) + text.length;
      count.textContent = text.length + ' / ' + spec.max + ' chars';
      count.classList.toggle('over', text.length > spec.max || (spec.titleMax && (cap.title || '').length > spec.titleMax));
      alertBox.innerHTML = '';
      const errs = [];
      if (text.length > spec.max) errs.push('Caption is ' + text.length + ' characters; ' + spec.label + ' allows ' + spec.max + '.');
      if (spec.titleMax && (cap.title || '').length > spec.titleMax) errs.push('Title is ' + (cap.title || '').length + ' characters; max ' + spec.titleMax + '.');
      if ((cap.tags || []).length > spec.maxTags) errs.push('Too many hashtags: ' + cap.tags.length + ' (max ' + spec.maxTags + ').');
      if (errs.length) {
        const bad = el('div', 'alert bad');
        bad.textContent = errs.join(' ');
        alertBox.appendChild(bad);
      }
    };

    grid.appendChild(card);
    card._update();
    for (const ta of card.querySelectorAll('textarea')) autosize(ta);
  }
}

function autosize(ta) {
  ta.style.height = 'auto';
  ta.style.height = Math.min(ta.scrollHeight + 4, 560) + 'px';
}

function autosizeAll() {
  for (const ta of document.querySelectorAll('textarea')) autosize(ta);
}

function update() { for (const card of document.querySelectorAll('.card')) card._update && card._update(); }

$('#copyAll').onclick = () => {
  const caps = DATA.captions[state.lang];
  const out = DATA.platformOrder.map((k) => {
    const c = caps[k];
    return '=== ' + DATA.platforms[k].label + ' ===\\n' + (c.title ? c.title + '\\n\\n' : '') + composed(k, c);
  }).join('\\n\\n');
  copy(out);
};

$('#dlAll').onclick = () => {
  const caps = DATA.captions[state.lang];
  const out = DATA.platformOrder.map((k) => {
    const c = caps[k];
    return '=== ' + DATA.platforms[k].label + ' ===\\n' + (c.title ? c.title + '\\n\\n' : '') + composed(k, c);
  }).join('\\n\\n');
  download(DATA.episode.key + '-captions-' + state.lang + '.txt', out);
};

const warnings = ${embed(warnings || [])};
if (warnings.length) {
  const box = el('div', 'alert');
  box.textContent = warnings.join(' ');
  $('#warnings').appendChild(box);
}

$('#poster').src = ${embed(data.posterSrc || '')};
renderLangs();
renderGrid();

// Textareas must be measured after webfonts settle, otherwise the last
// hashtag line gets clipped by the height computed with fallback metrics.
const settle = () => { autosizeAll(); autosizeAll(); };
requestAnimationFrame(settle);
if (document.fonts && document.fonts.ready) document.fonts.ready.then(settle);
window.addEventListener('load', settle);
window.addEventListener('resize', autosizeAll);
</script>
</body>
</html>
`;
}
