# PROGRESS — Parts 7–10 overnight build

Updated: Part 7 + Part 8 masters delivered; Part 9 rendering; Part 10 next.
Read this first if you are resuming after a token reset.

## Ground truth
- Work is in `/home/laflame/Videos/ANIMATION/LAST MESSAGE` on branch `master`.
- `AGENTS.md` is the production bible (rules, palette, traps). Read it first.
- `src/kit/` is shared chrome for Parts 7–10: helpers (`SANS`, `MONO`, `smooth`,
  `clamp01`, `flick`, `blinkLid`, `talk`), `Watermark`, `Scanlines`,
  `ScreenGlass`, `Monitor`, `ControlWall`, `ControlDesk`, `ControlFeed`,
  `NoahFeed`, `BodyFeed`, `EliasFeed`, `PhoneSlab`, `PhoneStatus`,
  `ChatMessage`, `BackWall`, `Archival`, and `NoahBack` (`knb*` svg ids).
- `src/character/Amara.tsx` gained one optional prop: `lidOverride` (blink),
  same as Noah already had. No design change.
- Timelines come from real audio + Whisper `base.en`, never from the briefs.

## Delivered masters (in `HASIL/`)
| Part | Entry | Frames | Duration | Status |
|---|---|---|---|---|
| 07 | `src/c12.tsx` | 2212 | 73.73 s | ✅ QC passed, copied |
| 08 | `src/c13.tsx` | 2329 | 77.63 s | ✅ QC passed, copied |
| 09 | `src/c14.tsx` | 2831 | 94.37 s | ⏳ master rendering |
| 10 | `src/c15.tsx` | 3733 | 124.43 s | ⏳ master not rendered |

Part 7 QC: 1080×1920, 30/1, h264+aac, 2212 frames, audio 73.749 s ≥ video
73.733 s, mean −28.1 dB / max −5.3 dB, tail (0,0,0) `out/qc/tail7.png`.
Part 8 QC: 1080×1920, 30/1, h264+aac, 2329 frames, audio 77.653 s ≥ video
77.633 s, mean −28.0 dB / max −6.8 dB, last frame (0,0,0) `out/qc/tail8b.png`.

## Part 7 — SUBJECT 002 — 15 shots
landmarks: 0, 63, 343, 535, 711, 794, 890, 1034, 1255, 1319, 1463, 1563,
1735, 1860, 1975, total 2212, `TAIL = 2204`.
text: `MESSAGES`, `SUBJECT 002`, `He remembers you.` (phone/archive only).

## Part 8 — THE SECOND AMARA — 15 shots
landmarks: 0, 104, 185, 397, 467, 707, 840, 948, 1069, 1397, 1559, 1644, 1839,
1977, 2160, total 2329; internal hard cut at 1916 inside shot 13; `FADE = 2322`.
text: `You were never Subject 002.`, `You were the one who created it.`

## Part 9 — THE FIRST EXPERIMENT — 16 shots
landmarks: 0, 90, 234, 450, 561, 693, 987, 1137, 1308, 1440, 1533, 1686, 1896,
2136, 2400, 2598, total 2831, `FADE = 2822`.
text: `You were the one who created it.`, `THE FIRST EXPERIMENT`,
`PROJECT ORIGIN` (all inside monitors).
ASR: `out/asr/pt9.json`.

## Part 10 — THE ORIGINAL SIN — 22 shots
landmarks: 0, 168, 322, 502, 596, 717, 836, 1034, 1311, 1395, 1487, 1669, 1777,
1880, 2051, 2206, 2287, 2543, 2731, 2935, 3161, 3472, total 3733, `FADE = 3722`.
text: `MEMORY SYNCHRONIZATION INITIATED`, `ACCESS DENIED`, `11:59 PM` →
`12:00 AM`, `Thank you for remembering me.`, coordinates
`35.6812° N / 139.7671° E`, `PROJECT EDEN`.
ASR: `out/asr/pt10.json` (word timestamps).

## Still to do
1. Part 9 master → §10 QC → `cp` to `HASIL/THE_LAST_MESSAGE_Part9.mp4`.
2. Part 10 master (3733 frames, ~20 min at `--concurrency=3`) → QC → `cp`.
3. Posters `HASIL/poster7..10.jpg` — Part 7 frame 2060 (second Amara in the
   doorway), Part 8 frame ~300 (two Amaras), Part 9 frame ~2760 (eye open),
   Part 10 frame ~3650 (PROJECT EDEN wall). `npx remotion still` then PIL → JPG
   quality 92.
4. `git ls-files | grep -E "\.(mp4|mov|webm|m4v)$"` must be empty, then commit
   source/docs and `git push origin HEAD`.

Already done: `publish/episodes.json` (ep07–ep10, EN+ID), `HASIL/index.html`
(4 rows, 4 `PARTS`, `prog6..prog9`, `0` → Part 10, hint `1–9 · 0`),
`README.md`, `HASIL/README.md`.

## Commands
```bash
npx tsc --noEmit
npx remotion render src/c14.tsx Part9  out/part9.mp4  --timeout=300000 --concurrency=3 --crf=19
npx remotion render src/c15.tsx Part10 out/part10.mp4 --timeout=300000 --concurrency=3 --crf=19
npx remotion still  src/c15.tsx Part10 out/qc/poster10.png --frame=3650 --concurrency=2
```

## Traps hit in this build
- A background shell wrapper with a finite timeout kills the render *after*
  encoding and the file is lost ("Exiting normally, received signal 15"). Use
  `timeout: 0` for background renders.
- `filter` on a wrapper creates a containing block; `feTurbulence` on a full
  rect renders opaque grey; `mixBlendMode:'screen'` halos must sit under the
  character div; nested `Monitor` inside a filtered wrapper can render blank.
