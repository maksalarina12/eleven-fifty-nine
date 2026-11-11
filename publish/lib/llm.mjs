import {clip} from './util.mjs';
import {PLATFORMS, PLATFORM_KEYS, compose} from './platforms.mjs';

export function hasLLM() {
  return Boolean(process.env.LLM_API_KEY || process.env.OPENAI_API_KEY);
}

function endpoint(baseUrl) {
  return `${baseUrl.replace(/\/+$/, '')}/chat/completions`;
}

/** One chat completion against any OpenAI-compatible endpoint. */
export async function chatJSON({config, system, user, signal}) {
  const baseUrl = process.env.LLM_BASE_URL || config.llm.baseUrl;
  const model = process.env.LLM_MODEL || config.llm.model;
  const key = process.env.LLM_API_KEY || process.env.OPENAI_API_KEY;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 120_000);
  const onAbort = () => controller.abort();
  signal?.addEventListener('abort', onAbort);

  try {
    const res = await fetch(endpoint(baseUrl), {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model,
        temperature: config.llm.temperature,
        max_tokens: config.llm.maxTokens,
        response_format: {type: 'json_object'},
        messages: [
          {role: 'system', content: system},
          {role: 'user', content: user},
        ],
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      throw new Error(`${res.status} ${res.statusText} — ${detail.slice(0, 400)}`);
    }
    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) throw new Error('empty completion');
    return JSON.parse(stripFences(content));
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener('abort', onAbort);
  }
}

function stripFences(text) {
  const trimmed = String(text).trim();
  if (!trimmed.startsWith('```')) return trimmed;
  return trimmed.replace(/^```[a-z]*\n?/i, '').replace(/```$/, '').trim();
}

/**
 * Deterministic copy used when no API key is configured, or as a repair path
 * when the model returns something unusable.
 */
/**
 * Copy used when the episode has no written brief for a language. A person
 * pointing the desk at their own folder still gets something clean on every
 * platform; a brief or an LLM key makes it sharper.
 */
function genericCaptions({config, episode, lang, pick}) {
  const series = config.series?.name || 'this series';
  const part = episode.part ?? 1;
  const title = episode.title || `Part ${part}`;
  const sameName = title.trim().toLowerCase() === series.trim().toLowerCase();
  const runtime = episode.runtime ? ` (${episode.runtime})` : '';
  const head = sameName ? `${series}${runtime}` : `${title}${runtime}`;
  const ytTitle = clip(sameName ? `${series} — Part ${part}` : `${title} · ${series} — Part ${part}`, PLATFORMS.youtube.limits.title);

  if (lang === 'id') {
    return {
      youtube: {title: ytTitle, body: `${head}.\n\nBagian ${part} dari ${series}.`, tags: pick([], 8)},
      tiktok: {body: `${head}.\n\nBagian ${part}.`, tags: pick([], 4)},
      instagram: {body: `${head}.\n\nBagian ${part} dari ${series}.`, tags: pick([], 10)},
      facebook: {body: `${head} — bagian ${part}.`, tags: pick([], 3)},
      x: {body: clip(`${head}. Bagian ${part}.`, PLATFORMS.x.limits.body), tags: pick([], 2)},
    };
  }

  return {
    youtube: {title: ytTitle, body: `${head}.\n\nPart ${part} of ${series}.`, tags: pick([], 8)},
    tiktok: {body: `${head}.\n\nPart ${part}.`, tags: pick([], 4)},
    instagram: {body: `${head}.\n\nPart ${part} of ${series}.`, tags: pick([], 10)},
    facebook: {body: `${head} — part ${part}.`, tags: pick([], 3)},
    x: {body: clip(`${head}. Part ${part}.`, PLATFORMS.x.limits.body), tags: pick([], 2)},
  };
}

function hasBrief(entry) {
  return Boolean(entry && (entry.logline || entry.hook || (entry.beats || []).length || entry.cta));
}

export function templateCaptions({config, episode, languages}) {
  const out = {};
  const series = config.series?.name || 'this series';
  const tagPool = config.series?.baseTags || [];

  for (const lang of languages) {
    const e = episode[lang] || {};
    const pick = (tags, n) => {
      const source = (tags || []).length ? tags : tagPool;
      const allowed = source.filter((t) => tagPool.some((p) => p.toLowerCase() === t.toLowerCase()));
      return (allowed.length ? allowed : tagPool).slice(0, n);
    };

    if (!hasBrief(e)) {
      out[lang] = genericCaptions({config, episode, lang, pick});
      continue;
    }

    const beats = e.beats || [];
    const sameName = (episode.title || '').trim().toLowerCase() === series.trim().toLowerCase();
    const prefix = sameName ? series : `${episode.title} · ${series}`;
    const ytTitle = clip(`${prefix} — Part ${episode.part}`, PLATFORMS.youtube.limits.title);
    const ytBody = [e.logline, beats[1] || beats[0], e.quote ? `"${e.quote}"` : '', e.cta].filter(Boolean).join('\n\n');

    const ttBody = [e.hook, beats[0], e.cta].filter(Boolean).join('\n\n');
    const igBody = [e.hook, e.logline, e.cta].filter(Boolean).join('\n\n');
    const fbBody = [e.hook, beats[beats.length - 1], e.cta].filter(Boolean).join('\n\n');

    const xTags = pick(e.tags, 2);
    const xTagText = xTags.join(' ');
    const xRoom = PLATFORMS.x.limits.body - xTagText.length - 2;
    const xBody = clip([e.hook, e.cta].filter(Boolean).join(' '), Math.max(60, xRoom));

    out[lang] = {
      youtube: {title: ytTitle, body: ytBody, tags: pick(e.tags, 8)},
      tiktok: {body: ttBody, tags: pick(e.tags, 4)},
      instagram: {body: igBody, tags: pick(e.tags, 10)},
      facebook: {body: fbBody, tags: pick(e.tags, 3)},
      x: {body: xBody, tags: xTags},
    };
  }
  return out;
}

/** Force whatever the model returned into the shape the rest of the tool expects. */
export function normalizeCaptions(raw, {config, episode, languages, fallback}) {
  const out = {};
  for (const lang of languages) {
    const fromModel = raw?.[lang] || {};
    const base = fallback?.[lang] || {};
    out[lang] = {};
    for (const key of PLATFORM_KEYS) {
      const spec = PLATFORMS[key];
      const model = fromModel[key] || {};
      const safe = base[key] || {title: null, body: '', tags: []};
      const body = typeof model.body === 'string' && model.body.trim() ? model.body.trim() : safe.body;
      const title = spec.limits.title
        ? clip(typeof model.title === 'string' && model.title.trim() ? model.title : safe.title || '', spec.limits.title)
        : null;

      const pool = new Set(config.series.baseTags.map((t) => t.toLowerCase()));
      let tags = Array.isArray(model.tags) ? model.tags.filter((t) => typeof t === 'string') : safe.tags;
      tags = tags.map((t) => (t.startsWith('#') ? t : `#${t}`)).filter((t) => pool.has(t.toLowerCase()));
      if (!tags.length) tags = safe.tags;
      tags = [...new Set(tags)].slice(0, Math.min(spec.maxTags, config.platforms?.[key]?.maxTags ?? spec.maxTags));

      const caption = {title, body, tags};
      // Hard fit: shrink the body until the composed text respects the limit.
      const tagText = tags.join(' ');
      const overhead = tagText ? tagText.length + 2 : 0;
      const titleLen = title ? title.length : 0;
      const room = spec.limits.body - overhead;
      if (compose(key, caption).length > spec.limits.body) {
        caption.body = clip(body, Math.max(40, room - Math.floor(titleLen / 2)));
      }
      out[lang][key] = caption;
    }
  }
  return out;
}
