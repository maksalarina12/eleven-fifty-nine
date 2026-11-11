import {PLATFORMS, PLATFORM_KEYS} from './platforms.mjs';

/**
 * The model gets the episode bible, the platform rules and the allowed tag pool,
 * and must return one caption object per platform per language.
 */
export function buildPrompt({config, episode, languages, seed}) {
  const series = config.series;
  const style = config.style || {};
  const tagPool = series.baseTags || [];
  const kind = series.kind || 'short-form video series';

  const platformBrief = PLATFORM_KEYS.map((key) => {
    const p = PLATFORMS[key];
    const caps = [];
    if (p.limits.title) caps.push(`title <= ${p.limits.title} chars`);
    caps.push(`body <= ${p.limits.body} chars including hashtags`);
    caps.push(`${p.maxTags} hashtags max`);
    return `- ${key} (${p.label}): ${caps.join(', ')}. Visible before truncation: ${p.visible}`;
  }).join('\n');

  const system = [
    `You write social copy for a ${kind} called "${series.name}".`,
    `The voice is ${style.tone || 'cinematic and restrained'}. Short sentences. No hype, no exclamation marks, no emoji spam.`,
    'You never reveal the episode ending or its twist.',
    'You never invent facts, dates, numbers, or quotes that are not in the episode brief.',
    'You never mention AI, prompts, rendering, or that the show was made with code.',
    'You write like a person who watched the episode and is trying not to spoil it.',
    'You always return valid JSON and nothing else.',
  ].join(' ');

  const rules = [
    ...(style.instructions || []),
    `Tone: ${style.tone || 'cinematic and restrained'}.`,
    `Maximum ${style.emojiMax ?? 0} emoji in any single caption.`,
    'Hook lines must differ between platforms: do not paste the same first sentence onto all five.',
    'Do not put hashtags inside the body; return them in the tags array.',
    tagPool.length
      ? 'Use only these hashtags, copied exactly: ' + tagPool.join(' ')
      : 'Return an empty tags array: this series has no hashtag pool configured.',
    'Keep the exact wording of any line you quote from the show.',
  ];

  const blocks = [`SEED: ${seed} (use a different angle than the obvious one)`];
  blocks.push(`SERIES: ${series.name} (${series.season}). Handle: ${series.handle}.`);
  blocks.push(
    `EPISODE: Part ${episode.part} — ${episode.title}${episode.alias ? ` (also known as ${episode.alias})` : ''}. Runtime: ${episode.runtime}.`
  );

  for (const lang of languages) {
    const e = episode[lang];
    const hasBrief = e && (e.logline || e.hook || (e.beats || []).length || e.cta);
    if (!hasBrief) {
      blocks.push(
        `EPISODE BRIEF (${lang.toUpperCase()}): none supplied. Write only from the title, the runtime and the series name. Do not invent characters, plot points, dates, quotes or numbers.`
      );
      continue;
    }
    blocks.push(
      [
        `EPISODE BRIEF (${lang.toUpperCase()}):`,
        e.logline ? `Logline: ${e.logline}` : '',
        e.hook ? `Hook already used in production: ${e.hook}` : '',
        (e.beats || []).length ? `Beats: ${e.beats.join(' | ')}` : '',
        e.quote ? `Exact line from the episode: "${e.quote}"` : '',
        e.cta ? `Call to action: ${e.cta}` : '',
        (e.tags || []).length ? `Suggested tags: ${e.tags.join(' ')}` : '',
      ]
        .filter(Boolean)
        .join('\n')
    );
  }

  blocks.push(`PLATFORM LIMITS:\n${platformBrief}`);
  blocks.push(`RULES:\n- ${rules.join('\n- ')}`);

  const shape = {
    [languages[0]]: Object.fromEntries(
      PLATFORM_KEYS.map((k) => [k, PLATFORMS[k].limits.title ? {title: 'string', body: 'string', tags: ['string']} : {body: 'string', tags: ['string']}])
    ),
  };

  blocks.push(
    [
      'OUTPUT: a single JSON object keyed by language code, then by platform.',
      `Each value: ${JSON.stringify(shape[languages[0]])}`,
      'Rules for fields: youtube needs a title (series name + part number must survive truncation), everything else has body only.',
      'Write the body for the platform: TikTok and X start with the hook on line one. Instagram uses line breaks between hook, context and CTA. Facebook is slightly warmer and shorter. YouTube description: 2 short paragraphs, then the CTA.',
      'No markdown, no bullet lists, no emoji beyond the limit.',
    ].join('\n')
  );

  return {
    system,
    user: blocks.join('\n\n'),
    shape: Object.fromEntries(languages.map((l) => [l, shape[languages[0]]])),
  };
}
