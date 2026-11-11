/**
 * Platform specs: limits, hashtag budgets, upload destinations and the rules
 * each platform actually enforces at publish time.
 *
 * A caption object everywhere in this tool looks like:
 *   {title: string|null, body: string, tags: string[]}
 */

export const PLATFORMS = {
  youtube: {
    key: 'youtube',
    label: 'YouTube Shorts',
    accent: '#e2685f',
    short: 'YT',
    maxTags: 12,
    limits: {title: 100, body: 5000},
    tagsIn: 'body',
    uploadUrl: 'https://studio.youtube.com/',
    visible: 'Title + first ~100 characters of the description.',
    notes: [
      '#Shorts in the title or first line helps the Shorts classifier.',
      'Put the series name first so the title survives truncation.',
    ],
    checklist: ['9:16, under 60 s for Shorts feed (this one is longer — post as regular video too)', 'Custom thumbnail uploaded', 'Title under 100 characters', 'Hashtags in description'],
  },

  tiktok: {
    key: 'tiktok',
    label: 'TikTok',
    accent: '#5fd3d6',
    short: 'TT',
    maxTags: 6,
    limits: {title: null, body: 2200},
    tagsIn: 'body',
    uploadUrl: 'https://www.tiktok.com/tiktokstudio/upload',
    visible: 'About 150 characters before "more".',
    notes: [
      'Only the first line survives in the feed — make it the hook.',
      '3–5 tags is the useful range; more looks automated.',
    ],
    checklist: ['Cover frame chosen at 0.5 s', 'Sound on, no muted preview', 'First line is the hook', '3–5 hashtags'],
  },

  instagram: {
    key: 'instagram',
    label: 'Instagram Reels',
    accent: '#d98bb8',
    short: 'IG',
    maxTags: 12,
    limits: {title: null, body: 2200},
    tagsIn: 'body',
    uploadUrl: 'https://www.instagram.com/',
    visible: 'First ~125 characters, then "more".',
    notes: [
      'Line breaks matter: hook, blank line, context, blank line, tags.',
      'Share to Feed as well as Reels for reach.',
    ],
    checklist: ['Cover image picked', 'Share to Feed enabled', 'First 125 characters carry the hook', 'Tags in the caption (not the first comment)'],
  },

  facebook: {
    key: 'facebook',
    label: 'Facebook Reels',
    accent: '#7f9cf5',
    short: 'FB',
    maxTags: 4,
    limits: {title: null, body: 5000},
    tagsIn: 'body',
    uploadUrl: 'https://www.facebook.com/reels/create',
    visible: 'About 125 characters before "See more".',
    notes: [
      'Fewer tags than Instagram — this audience punishes tag walls.',
      'Post from the Page, not a personal profile, for Reels placement.',
    ],
    checklist: ['Posted as the Page', 'Reels placement selected', '2–3 tags only'],
  },

  x: {
    key: 'x',
    label: 'X',
    accent: '#cfd6dd',
    short: 'X',
    maxTags: 3,
    limits: {title: null, body: 280},
    tagsIn: 'body',
    uploadUrl: 'https://x.com/compose/post',
    visible: '280 characters, links count as 23.',
    notes: [
      'One sentence, one line break, one tag pair. Nothing else fits.',
      'Attach the video natively — link posts lose reach.',
    ],
    checklist: ['Under 280 characters', 'Video attached natively', '1–2 tags'],
  },
};

export const PLATFORM_KEYS = Object.keys(PLATFORMS);

/** Append hashtags the way that platform expects them. */
export function compose(platformKey, caption) {
  const spec = PLATFORMS[platformKey];
  if (!spec) throw new Error(`Unknown platform: ${platformKey}`);
  const tags = (caption.tags || []).slice(0, spec.maxTags);
  const body = (caption.body || '').trim();
  if (spec.tagsIn === 'body' && tags.length) {
    return `${body}\n\n${tags.join(' ')}`;
  }
  return body;
}

/** Total character count as the platform counts it. */
export function countFor(platformKey, caption) {
  const spec = PLATFORMS[platformKey];
  if (!spec) return 0;
  const text = compose(platformKey, caption);
  return (caption.title ? caption.title.length : 0) + text.length;
}

/**
 * Validate one caption. Returns hard errors (must fix) and soft notes.
 */
export function validate(platformKey, caption, config) {
  const spec = PLATFORMS[platformKey];
  const errors = [];
  const notes = [];
  const maxTags = Math.min(spec.maxTags, config?.platforms?.[platformKey]?.maxTags ?? spec.maxTags);
  const tags = caption.tags || [];

  if (tags.length > maxTags) errors.push(`${platformKey}: ${tags.length} hashtags, max ${maxTags}`);
  if (spec.limits.title && caption.title && caption.title.length > spec.limits.title) {
    errors.push(`${platformKey}: title is ${caption.title.length} characters, max ${spec.limits.title}`);
  }
  const text = compose(platformKey, caption);
  if (text.length > spec.limits.body) {
    errors.push(`${platformKey}: caption is ${text.length} characters, max ${spec.limits.body}`);
  }

  const allowed = new Set((config?.series?.baseTags || []).map((t) => t.toLowerCase()));
  for (const tag of tags) if (!allowed.has(tag.toLowerCase())) notes.push(`${platformKey}: tag ${tag} is not in the pool`);

  if (platformKey === 'x' && text.length > 240) notes.push('x: over 240 characters, verify the link preview does not push it over');
  return {errors, notes, length: text.length, max: spec.limits.body};
}
