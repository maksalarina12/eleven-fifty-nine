/* Release desk client. Rendered once per server state; all actions are explicit. */
const S = JSON.parse(document.getElementById('state').textContent);

const $ = (sel, root = document) => root.querySelector(sel);
const esc = (value) =>
  String(value == null ? '' : value).replace(/[&<>"]/g, (c) => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]));

const params = new URLSearchParams(location.search);
let lang = params.get('lang') === 'id' ? 'id' : S.defaultLanguage === 'id' ? 'id' : 'en';
let selected =
  (params.get('ep') && S.episodes.some((e) => e.key === params.get('ep')) && params.get('ep')) ||
  (S.episodes.filter((e) => e.pack).pop() || S.episodes[S.episodes.length - 1] || {}).key;
let busy = false;
let logText = '';

const current = () => S.episodes.find((e) => e.key === selected) || S.episodes[0];
const platformKeys = Object.keys(S.platforms);

/* ------------------------------- helpers -------------------------------- */

function relTime(stamp) {
  if (!stamp) return '';
  const then = new Date(String(stamp).replace(' ', 'T'));
  if (Number.isNaN(then.getTime())) return String(stamp);
  const mins = Math.max(0, Math.round((Date.now() - then.getTime()) / 60000));
  if (mins < 1) return 'just now';
  if (mins < 60) return mins + 'm ago';
  const hours = Math.round(mins / 60);
  if (hours < 36) return hours + 'h ago';
  return Math.round(hours / 24) + 'd ago';
}

function mb(bytes) {
  return (bytes / 1e6).toFixed(1) + ' MB';
}

function firstLine(caption) {
  if (!caption) return '';
  const line = (caption.body || '').split('\n').find((l) => l.trim());
  return line || '';
}

function composed(key, caption) {
  if (!caption) return '';
  const tags = (caption.tags || []).join(' ');
  return (caption.title ? caption.title + '\n\n' : '') + (caption.body || '').trim() + (tags ? '\n\n' + tags : '');
}

function bundle(forLang) {
  return platformKeys
    .map((key) => {
      const cap = current().pack && current().pack.captions[forLang] && current().pack.captions[forLang][key];
      return '=== ' + S.platforms[key].label + ' ===\n' + composed(key, cap);
    })
    .join('\n\n');
}

let toastTimer = null;
function toast(message) {
  let node = $('#toast');
  if (!node) {
    node = document.createElement('div');
    node.id = 'toast';
    node.className = 'toast';
    document.body.appendChild(node);
  }
  node.textContent = message;
  node.classList.add('on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => node.classList.remove('on'), 1400);
}

async function copy(text) {
  if (!text) return;
  const fallback = () => {
    const area = document.createElement('textarea');
    area.value = text;
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    try {
      document.execCommand('copy');
      toast('copied');
    } catch (error) {
      toast('copy failed');
    }
    area.remove();
  };
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => toast('copied'), fallback);
  } else {
    fallback();
  }
}

/* ------------------------------- render --------------------------------- */

function renderStatus() {
  const total = S.episodes.length;
  const mode = S.mode === 'llm' ? 'llm' : 'template';
  $('#status').innerHTML =
    '<div><b>' + S.masters + '/' + total + '</b><span>masters</span></div>' +
    '<div class="' + (S.packs ? 'lit' : '') + '"><b>' + S.packs + '/' + total + '</b><span>packs</span></div>' +
    '<div class="' + (S.apiCount ? 'lit' : 'warm') + '"><b>' + S.apiCount + '/' + total + '</b><span>api links</span></div>' +
    '<div><b>' + mode + '</b><span>copy engine</span></div>';
}

function renderStrip() {
  $('#strip').innerHTML = S.episodes
    .map((ep) => {
      const state = ep.pack ? 'pack · ' + relTime(ep.pack.generatedAt) : ep.videoOk ? 'master only' : 'missing';
      const dot = ep.pack ? 'class="dot pack"' : ep.videoOk ? 'class="dot none"' : 'class="dot"';
      return (
        '<button class="ep" data-key="' + esc(ep.key) + '" aria-current="' + String(ep.key === selected) + '">' +
        '<span class="n">PART ' + String(ep.part).padStart(2, '0') + '</span>' +
        '<span class="t">' + esc(ep.title) + '</span>' +
        '<span class="s"><i ' + dot + '></i>' + esc(state) + '</span>' +
        '</button>'
      );
    })
    .join('');

  for (const node of document.querySelectorAll('.ep')) {
    node.addEventListener('click', () => {
      selected = node.dataset.key;
      renderAll();
    });
  }
}

function renderDetail() {
  const ep = current() || {};
  const pack = ep.pack;
  const brief = (ep.briefs && (ep.briefs[lang] || ep.briefs.en)) || {};
  const poster = ep.posterOk
    ? '<img class="poster" src="' + esc(ep.posterUrl) + '" alt="Poster Part ' + ep.part + '">'
    : '<div class="poster missing">NO POSTER</div>';
  const alias = ep.alias ? ' <span>/ ' + esc(ep.alias) + '</span>' : '';

  const review = pack && pack.reviewOk
    ? '<a class="btn" href="/files/' + esc(pack.dir) + '/review.html" target="_blank" rel="noopener">Open review <span class="arw">↗</span></a>'
    : '<span class="btn off">Open review <span class="arw">↗</span></span>';

  $('#detail').innerHTML =
    poster +
    '<div class="titleblock">' +
      '<p class="alias">S01 · PART ' + String(ep.part).padStart(2, '0') + (ep.alias ? ' · ' + esc(ep.alias) : '') + '</p>' +
      '<h2>' + esc(ep.title) + alias + '</h2>' +
      '<div class="meta">' +
        '<span class="chip solid">1080 × 1920</span>' +
        '<span class="chip">' + esc(ep.runtime || '—') + '</span>' +
        '<span class="chip">' + (ep.videoOk ? mb(ep.videoBytes) : 'no master') + '</span>' +
        '<span class="chip">' + esc(ep.file) + '</span>' +
        (pack ? '<span class="chip">pack ' + esc(relTime(pack.generatedAt)) + ' · ' + esc(pack.mode) + '</span>' : '<span class="chip">no pack yet</span>') +
      '</div>' +
      '<p class="logline">' + esc(brief.logline || 'No logline for this language.') + '</p>' +
      '<div class="readiness">' +
        '<div><span>master</span><b class="' + (ep.videoOk ? 'ok' : 'bad') + '">' + (ep.videoOk ? 'ready · ' + mb(ep.videoBytes) : 'missing') + '</b></div>' +
        '<div><span>pack</span><b class="' + (pack ? 'ok' : 'bad') + '">' + (pack ? pack.languages.length + ' lang · ' + platformKeys.length * pack.languages.length + ' files' : 'not generated') + '</b></div>' +
        '<div><span>handoff</span><b class="' + (S.apiCount ? 'ok' : 'warm') + '">' + S.apiCount + ' api · ' + (S.episodes.length - S.apiCount) + ' manual</b></div>' +
      '</div>' +
    '</div>' +
    '<div class="actions" id="detail-actions">' +
      '<button class="btn primary" id="gen">Generate pack <span class="arw">→</span></button>' +
      '<button class="btn" id="genTpl">Template only <span class="arw">→</span></button>' +
      review +
      '<button class="btn" id="post">Dry-run upload <span class="arw">→</span></button>' +
      '<button class="btn" id="copyAll"' + (pack ? '' : ' disabled') + '>Copy all · ' + lang.toUpperCase() + ' <span class="arw">→</span></button>' +
    '</div>';

  $('#gen').addEventListener('click', () => act('/api/generate', {episode: ep.key, template: false}));
  $('#genTpl').addEventListener('click', () => act('/api/generate', {episode: ep.key, template: true}));
  $('#post').addEventListener('click', () => act('/api/post', {episode: ep.key, lang: lang}));
  $('#copyAll').addEventListener('click', () => copy(bundle(lang)));
}

function renderTable() {
  const ep = current();
  const pack = ep.pack;
  const caps = (pack && pack.captions[lang]) || {};
  const stats = (pack && pack.stats[lang]) || {};

  const rows = platformKeys.map((key) => {
    const spec = S.platforms[key];
    const cap = caps[key];
    const stat = stats[key];
    const cred = S.credentials[key] || {ok: false, missing: []};
    const linked = (S.connections && S.connections[key]) || null;
    const account = linked && linked.status === 'linked' ? linked.account : '';
    const badge = linked && linked.status === 'failed' ? 'error' : cred.ok ? 'api' : 'manual';
    const pct = stat ? Math.min(100, (stat.length / stat.max) * 100) : 0;
    const tone = stat && stat.errors.length ? 'bad' : stat && pct > 86 ? 'warm' : '';
    const line = cap ? (cap.title || firstLine(cap)) : '';
    return (
      '<tr>' +
        '<td class="c-plat"><span class="plat"><i class="dot" style="background:' + esc(spec.accent) + '"></i>' + esc(spec.label) + '</span></td>' +
        '<td class="c-first">' + (cap ? '<div class="first">' + esc(line) + '</div>' : '<div class="first empty">NOT GENERATED</div>') + '</td>' +
        '<td class="c-len">' +
          (stat
            ? '<div class="num' + (tone === 'bad' ? ' bad' : '') + '">' + stat.length + ' / ' + stat.max + '</div>' +
              '<div class="meter"><i class="' + tone + '" style="width:' + Math.max(2, pct) + '%"></i></div>'
            : '<span class="num">—</span>') +
        '</td>' +
        '<td class="c-tags"><span class="tagn">' + (cap ? (cap.tags || []).length + ' / ' + spec.maxTags : '—') + '</span></td>' +
        '<td class="c-cred"><span class="cred' + (badge === 'api' ? ' api' : badge === 'error' ? ' bad' : '') + '" title="' + esc(linked && linked.status === 'failed' ? linked.error : cred.missing.length ? 'missing: ' + cred.missing.join(', ') : 'credentials present') + '"><i class="dot"></i>' + badge + '</span>' +
          (account ? '<span class="acct" title="' + esc(linked.detail || '') + '">' + esc(account) + '</span>' : '') +
          '</td>' +
        '<td class="c-act"><div class="rowacts">' +
          '<button class="mini" data-copy="' + esc(key) + '"' + (cap ? '' : ' disabled') + '>copy</button>' +
          '<a class="mini" href="' + esc(spec.uploadUrl) + '" target="_blank" rel="noopener">open</a>' +
        '</div></td>' +
      '</tr>'
    );
  });

  $('#tableWrap').innerHTML =
    '<table>' +
      '<thead><tr>' +
        '<th>Platform</th><th>Caption preview</th><th>Characters</th><th>Tags</th><th>Link</th><th style="text-align:right">Action</th>' +
      '</tr></thead><tbody>' + rows.join('') + '</tbody>' +
    '</table>';

  for (const node of document.querySelectorAll('[data-copy]')) {
    node.addEventListener('click', () => {
      const key = node.dataset.copy;
      copy(composed(key, caps[key]));
    });
  }
}

function renderConsole() {
  const ep = current();
  const command = 'node publish/generate.mjs --episode ' + (ep ? ep.part : '5');
  $('#logcmd').textContent = command;
  const fallback =
    'ready · ' + S.masters + ' master file(s) · ' + S.packs + ' pack(s) · ' + S.apiCount + ' api link(s)\n' +
    (S.packs === S.episodes.length
      ? 'every episode has a pack. pick one to review, copy or dry-run an upload. nothing is uploaded from this page.'
      : 'select an episode, then generate a pack. nothing is uploaded from this page.');
  $('#log').textContent = logText || (S.lastRun && S.lastRun.log) || fallback;
  $('#log').scrollTop = 0;
}

function renderAll() {
  renderStatus();
  renderStrip();
  renderDetail();
  renderTable();
  renderConsole();
  document.body.classList.toggle('busy', busy);
  for (const button of document.querySelectorAll('#langs button')) {
    button.setAttribute('aria-pressed', String(button.dataset.lang === lang));
  }
}

/* ------------------------------- actions -------------------------------- */

async function act(url, payload) {
  if (busy) return;
  busy = true;
  const ep = current();
  logText = 'running ' + url + ' for ' + (ep ? ep.key : '') + ' …\n';
  renderAll();
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(payload || {}),
    });
    const data = await res.json();
    if (data.state) S = data.state;
    logText = data.log || data.error || '(no output)';
    if (data.error) toast('failed — see terminal');
    else toast(data.state ? 'done' : 'ok');
  } catch (error) {
    logText = 'request failed: ' + error.message;
    toast('request failed');
  }
  busy = false;
  renderAll();
}

/* ------------------------------- wiring --------------------------------- */

for (const node of document.querySelectorAll('#langs button')) {
  node.addEventListener('click', () => {
    lang = node.dataset.lang;
    renderAll();
  });
}

$('#doctor').addEventListener('click', () => act('/api/doctor', {}));
$('#genAll').addEventListener('click', () => act('/api/generate-all', {template: true}));

(function syncGenAll() {
  const missing = S.episodes.length - S.packs;
  const button = $('#genAll');
  button.disabled = missing === 0;
  button.textContent = missing ? 'pack missing · ' + missing : 'packs complete';
  $('#doctor').title = S.connectionsAt ? 'last checked ' + relTime(S.connectionsAt) : 'verify token → account';
})();

document.addEventListener('keydown', (event) => {
  if (event.metaKey || event.ctrlKey || event.altKey) return;
  const tag = (event.target.tagName || '').toLowerCase();
  if (tag === 'input' || tag === 'textarea') return;
  if (event.key >= '1' && event.key <= '5') {
    const ep = S.episodes[Number(event.key) - 1];
    if (ep) {
      selected = ep.key;
      renderAll();
    }
  } else if (event.key === 'g' || event.key === 'G') {
    act('/api/generate', {episode: selected, template: false});
  } else if (event.key === 't' || event.key === 'T') {
    act('/api/generate', {episode: selected, template: true});
  }
});

renderAll();
