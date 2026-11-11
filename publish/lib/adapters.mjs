/**
 * Upload adapters. Every one of them is inert until its credentials exist in
 * .env, and every one defaults to the most private setting the platform allows.
 *
 * None of these have been exercised against live accounts yet — treat the first
 * run of each as a supervised test with a small/private post.
 */
import fs from 'node:fs';
import path from 'node:path';

const GRAPH = 'https://graph.facebook.com/v21.0';

const need = (names) => names.filter((name) => !process.env[name]);

async function jsonOrThrow(res, label) {
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = {raw: text};
  }
  if (!res.ok) {
    const detail = data?.error?.message || data?.error_description || data?.message || text.slice(0, 400);
    throw new Error(`${label}: ${res.status} ${detail}`);
  }
  return data;
}

function fileBytes(file) {
  return fs.readFileSync(file);
}

/* ------------------------------- YouTube -------------------------------- */

const youtube = {
  key: 'youtube',
  label: 'YouTube Shorts',
  env: ['YT_CLIENT_ID', 'YT_CLIENT_SECRET', 'YT_REFRESH_TOKEN'],
  privacy: () => process.env.YT_PRIVACY || 'private',
  async token() {
    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {'content-type': 'application/x-www-form-urlencoded'},
      body: new URLSearchParams({
        client_id: process.env.YT_CLIENT_ID,
        client_secret: process.env.YT_CLIENT_SECRET,
        refresh_token: process.env.YT_REFRESH_TOKEN,
        grant_type: 'refresh_token',
      }),
    });
    const data = await jsonOrThrow(res, 'youtube token');
    return data.access_token;
  },
  plan({caption, video}) {
    return {
      endpoint: 'https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable',
      title: caption.title,
      descriptionChars: caption.body.length,
      tags: caption.tags,
      file: path.basename(video),
      privacy: process.env.YT_PRIVACY || 'private',
    };
  },
  async post({video, caption}) {
    const access = await youtube.token();
    const body = fileBytes(video);
    const description = `${caption.body}\n\n${caption.tags.join(' ')}`.trim();

    const init = await fetch(
      'https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status',
      {
        method: 'POST',
        headers: {
          authorization: `Bearer ${access}`,
          'content-type': 'application/json',
          'x-upload-content-type': 'video/mp4',
          'x-upload-content-length': String(body.length),
        },
        body: JSON.stringify({
          snippet: {
            title: caption.title,
            description,
            tags: caption.tags.map((t) => t.replace(/^#/, '')),
            categoryId: process.env.YT_CATEGORY || '24',
          },
          status: {
            privacyStatus: process.env.YT_PRIVACY || 'private',
            selfDeclaredMadeForKids: false,
          },
        }),
      }
    );
    if (!init.ok) throw new Error(`youtube init: ${init.status} ${await init.text()}`);
    const location = init.headers.get('location');
    if (!location) throw new Error('youtube init: no upload URL returned');

    const upload = await fetch(location, {
      method: 'PUT',
      headers: {'content-type': 'video/mp4', 'content-length': String(body.length)},
      body,
    });
    const data = await jsonOrThrow(upload, 'youtube upload');
    return {id: data.id, url: `https://youtube.com/watch?v=${data.id}`};
  },
};

/* ------------------------------ Instagram -------------------------------- */

const instagram = {
  key: 'instagram',
  label: 'Instagram Reels',
  env: ['IG_USER_ID', 'IG_ACCESS_TOKEN'],
  plan({caption, video}) {
    return {
      endpoint: `${GRAPH}/{IG_USER_ID}/media (REELS, resumable)`,
      captionChars: caption.body.length,
      tags: caption.tags,
      file: path.basename(video),
      warning: 'Reels publish immediately — there is no draft state.',
    };
  },
  async post({video, caption}) {
    const body = fileBytes(video);
    const text = `${caption.body}\n\n${caption.tags.join(' ')}`.trim();
    const user = process.env.IG_USER_ID;
    const token = process.env.IG_ACCESS_TOKEN;

    const create = await fetch(`${GRAPH}/${user}/media`, {
      method: 'POST',
      headers: {'content-type': 'application/x-www-form-urlencoded'},
      body: new URLSearchParams({
        media_type: 'REELS',
        upload_type: 'resumable',
        caption: text,
        share_to_feed: 'true',
        access_token: token,
      }),
    });
    const container = await jsonOrThrow(create, 'instagram container');

    const upload = await fetch(container.uri, {
      method: 'POST',
      headers: {
        authorization: `OAuth ${token}`,
        offset: '0',
        file_size: String(body.length),
        'content-type': 'video/mp4',
      },
      body,
    });
    await jsonOrThrow(upload, 'instagram upload');

    const publish = await fetch(
      `${GRAPH}/${user}/media_publish?${new URLSearchParams({creation_id: container.id, access_token: token})}`,
      {method: 'POST'}
    );
    const data = await jsonOrThrow(publish, 'instagram publish');
    return {id: data.id, url: 'https://www.instagram.com/reels/'};
  },
};

/* ------------------------------- Facebook -------------------------------- */

const facebook = {
  key: 'facebook',
  label: 'Facebook Reels',
  env: ['FB_PAGE_ID', 'FB_PAGE_TOKEN'],
  plan({caption, video}) {
    return {
      endpoint: `${GRAPH}/{FB_PAGE_ID}/video_reels`,
      captionChars: caption.body.length,
      tags: caption.tags,
      file: path.basename(video),
      warning: 'Reels publish immediately — there is no draft state.',
    };
  },
  async post({video, caption}) {
    const body = fileBytes(video);
    const page = process.env.FB_PAGE_ID;
    const token = process.env.FB_PAGE_TOKEN;

    const start = await fetch(
      `${GRAPH}/${page}/video_reels?${new URLSearchParams({upload_phase: 'start', access_token: token})}`,
      {method: 'POST'}
    );
    const session = await jsonOrThrow(start, 'facebook start');

    const upload = await fetch(session.upload_url, {
      method: 'POST',
      headers: {
        authorization: `OAuth ${token}`,
        offset: '0',
        file_size: String(body.length),
        'content-type': 'video/mp4',
      },
      body,
    });
    await jsonOrThrow(upload, 'facebook upload');

    const text = `${caption.body}\n\n${caption.tags.join(' ')}`.trim();
    const finish = await fetch(
      `${GRAPH}/${page}/video_reels?${new URLSearchParams({
        upload_phase: 'finish',
        video_id: session.video_id,
        video_state: 'PUBLISHED',
        description: text,
        access_token: token,
      })}`,
      {method: 'POST'}
    );
    const data = await jsonOrThrow(finish, 'facebook finish');
    return {id: session.video_id, url: `https://www.facebook.com/reel/${session.video_id}`, data};
  },
};

/* -------------------------------- TikTok --------------------------------- */

const tiktok = {
  key: 'tiktok',
  label: 'TikTok',
  env: ['TIKTOK_ACCESS_TOKEN'],
  plan({caption, video}) {
    return {
      endpoint: 'https://open.tiktokapis.com/v2/post/publish/video/init/',
      captionChars: caption.body.length,
      tags: caption.tags,
      file: path.basename(video),
      privacy: process.env.TIKTOK_PRIVACY || 'SELF_ONLY',
      warning: 'Unaudited apps are forced to SELF_ONLY by TikTok.',
    };
  },
  async post({video, caption}) {
    const body = fileBytes(video);
    const size = body.length;
    // TikTok requires chunks between 5 MB and 64 MB; one chunk is fine for a 17 MB reel.
    const chunkSize = size > 5 * 1024 * 1024 ? Math.min(size, 10 * 1024 * 1024) : size;

    const init = await fetch('https://open.tiktokapis.com/v2/post/publish/video/init/', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${process.env.TIKTOK_ACCESS_TOKEN}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        post_info: {
          title: `${caption.body}\n\n${caption.tags.join(' ')}`.slice(0, 2200),
          privacy_level: process.env.TIKTOK_PRIVACY || 'SELF_ONLY',
          disable_duet: false,
          disable_comment: false,
          disable_stitch: false,
          video_cover_timestamp_ms: 1000,
        },
        source_info: {
          source: 'FILE_UPLOAD',
          video_size: size,
          chunk_size: chunkSize,
          total_chunk_count: Math.ceil(size / chunkSize),
        },
      }),
    });
    const data = await jsonOrThrow(init, 'tiktok init');
    if (data?.error?.code && data.error.code !== 'ok') throw new Error(`tiktok init: ${data.error.message}`);

    const total = Math.ceil(size / chunkSize);
    for (let i = 0; i < total; i++) {
      const start = i * chunkSize;
      const end = Math.min(size, start + chunkSize) - 1;
      const put = await fetch(data.data.upload_url, {
        method: 'PUT',
        headers: {
          'content-type': 'video/mp4',
          'content-range': `bytes ${start}-${end}/${size}`,
        },
        body: body.subarray(start, end + 1),
      });
      if (![200, 201, 206].includes(put.status)) throw new Error(`tiktok chunk ${i}: ${put.status}`);
    }
    return {id: data.data.publish_id, url: 'https://www.tiktok.com/'};
  },
};

/* ---------------------------------- X ------------------------------------ */

const x = {
  key: 'x',
  label: 'X',
  env: ['X_ACCESS_TOKEN'],
  plan({caption, video}) {
    return {
      endpoint: 'https://api.x.com/2/tweets (video via /2/media/upload)',
      captionChars: caption.body.length,
      tags: caption.tags,
      file: path.basename(video),
      warning: 'X video upload needs media.write on an OAuth 2.0 user token.',
    };
  },
  async post({video, caption}) {
    const body = fileBytes(video);
    const token = process.env.X_ACCESS_TOKEN;
    const auth = {authorization: `Bearer ${token}`};

    const init = await fetch('https://api.x.com/2/media/upload?command=INIT', {
      method: 'POST',
      headers: {...auth, 'content-type': 'application/json'},
      body: JSON.stringify({media_type: 'video/mp4', total_bytes: body.length, media_category: 'tweet_video'}),
    });
    const started = await jsonOrThrow(init, 'x media init');
    const mediaId = started.data.id;

    const chunk = 4 * 1024 * 1024;
    let index = 0;
    for (let offset = 0; offset < body.length; offset += chunk, index++) {
      const form = new FormData();
      form.append('media', new Blob([body.subarray(offset, Math.min(body.length, offset + chunk))], {type: 'video/mp4'}), 'blob');
      form.append('segment_index', String(index));
      const append = await fetch(`https://api.x.com/2/media/upload?command=APPEND&media_id=${mediaId}`, {
        method: 'POST',
        headers: auth,
        body: form,
      });
      if (!append.ok) throw new Error(`x append ${index}: ${append.status} ${await append.text()}`);
    }

    const fin = await fetch(`https://api.x.com/2/media/upload?command=FINALIZE&media_id=${mediaId}`, {
      method: 'POST',
      headers: auth,
    });
    await jsonOrThrow(fin, 'x finalize');

    // Video processing is asynchronous; wait for it before tweeting.
    for (let i = 0; i < 40; i++) {
      const status = await fetch(`https://api.x.com/2/media/upload?command=STATUS&media_id=${mediaId}`, {headers: auth});
      const s = await jsonOrThrow(status, 'x status');
      const info = s.data?.processing_info;
      if (!info || info.state === 'succeeded') break;
      if (info.state === 'failed') throw new Error(`x processing failed: ${info.error?.message}`);
      await new Promise((r) => setTimeout(r, Math.max(1000, info.check_after_secs * 1000 || 2000)));
    }

    const text = `${caption.body}\n\n${caption.tags.join(' ')}`.trim().slice(0, 280);
    const tweet = await fetch('https://api.x.com/2/tweets', {
      method: 'POST',
      headers: {...auth, 'content-type': 'application/json'},
      body: JSON.stringify({text, media: {media_ids: [mediaId]}}),
    });
    const data = await jsonOrThrow(tweet, 'x tweet');
    return {id: data.data.id, url: `https://x.com/i/status/${data.data.id}`};
  },
};

export const ADAPTERS = {youtube, tiktok, instagram, facebook, x};

export function adapterFor(key) {
  return ADAPTERS[key] || null;
}

export function missingCreds(adapter) {
  return need(adapter.env);
}
