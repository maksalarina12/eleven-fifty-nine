import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {Amara, AmaraBack} from './character/Amara';
import {Noah} from './character/Noah';
import {Cam} from './Episode';
import {Watermark, Scanlines, ScreenGlass, clamp01, smooth, blinkLid, talk, rnd} from './kit';
import {Night, Haze, Grade} from './kit2';
import {Chamber, Sleeper} from './kit3';

/* ------------------------------------------------------------------ */
/* S02E08 — THE AWAKENING                                              */
/* 39.280 s of real narration -> 1178 frames. 12 shots.                */
/* Cuts on measured word boundaries (Whisper base.en).                 */
/* ------------------------------------------------------------------ */

const C = {
  s1: 0, // The platform lowered Noah into a chamber of sleeping bodies.
  s2: 148, // Every face was familiar.
  s3: 223, // Every face was his.
  s4: 306, // Amara counted the beds until she could no longer bear to look.
  s5: 441, // One of the bodies opened its eyes.
  s6: 509, // "Which one of us got out?"
  s7: 563, // Noah backed away, the others began to wake.
  s8: 690, // Some whispered his name, some cried.
  s9: 785, // One reached for Amara and said something only she could know.
  s10: 900, // "You promised to stop making us." A red warning spread across the ceiling.
  s11: 1051, // Collective awakening detected.
  s12: 1120, // Every bed unlocked at once.
  total: 1178,
};

const FADE = 1160;

/* Noah asleep, seen from directly above the bed: the frame, the mattress,
   the pillow, his head, and the sheet pulled up to his jaw. */
const SleeperNoah: React.FC<{
  f: number;
  x: number;
  y: number;
  s?: number;
  lid?: number;
  rim?: number;
  tilt?: number;
  sheet?: number;
}> = ({f, x, y, s = 1, lid = 1, rim = 0.8, tilt = 0, sheet = 1}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: 560 * s,
      height: 780 * s,
      transform: `rotate(${tilt}deg)`,
      transformOrigin: '50% 26%',
    }}
  >
    {/* the bed, from above */}
    <div
      style={{
        position: 'absolute',
        inset: 0,
        borderRadius: 18 * s,
        background: 'linear-gradient(180deg,#16212B 0%,#0C151C 48%,#050A0F 100%)',
        boxShadow: 'inset 0 0 0 2px rgba(140,178,204,0.1), 0 26px 64px rgba(0,0,0,0.82)',
      }}
    />
    {/* mattress */}
    <div
      style={{
        position: 'absolute',
        left: 16 * s,
        top: 16 * s,
        right: 16 * s,
        bottom: 26 * s,
        borderRadius: 10 * s,
        background: 'linear-gradient(180deg,#1B2731 0%,#101B23 58%,#08111A 100%)',
      }}
    />
    {/* pillow */}
    <div
      style={{
        position: 'absolute',
        left: 66 * s,
        top: 54 * s,
        width: 428 * s,
        height: 188 * s,
        borderRadius: `${88 * s}px ${80 * s}px ${66 * s}px ${74 * s}px`,
        background: 'linear-gradient(168deg,#5C6D7A 0%,#3A4850 54%,#1D272E 100%)',
        boxShadow: 'inset 0 -14px 30px rgba(0,0,0,0.5), 0 14px 30px rgba(0,0,0,0.6)',
      }}
    />
    {/* the crease the jaw makes in the pillow */}
    <div style={{position: 'absolute', left: 120 * s, top: 196 * s, width: 320 * s, height: 10 * s, borderRadius: 5, background: 'rgba(12,20,26,0.55)', filter: 'blur(4px)'}} />

    {/* his head, on the pillow */}
    <div style={{position: 'absolute', left: 118 * s, top: 8 * s, width: 326 * s, height: 306 * s}}>
      <Noah
        expression="tired"
        look="camera"
        turn={0}
        rim={rim}
        lidOverride={lid}
        viewBox="198 98 204 206"
        preserve="xMidYMid slice"
      />
    </div>

    {/* the sheet, up to the jaw, then down the length of the bed */}
    <div
      style={{
        position: 'absolute',
        left: 44 * s,
        top: 288 * s,
        width: 472 * s,
        height: 460 * s,
        borderRadius: `${140 * s}px ${140 * s}px 10px 10px`,
        background: 'linear-gradient(180deg,#5C6C78 0%,#3A4750 38%,#1C242B 100%)',
        boxShadow: 'inset 0 12px 26px rgba(0,0,0,0.4), inset 0 -30px 50px rgba(0,0,0,0.5)',
        opacity: sheet,
      }}
    />
    {/* two folds, so it is cloth and not a slab */}
    <div style={{position: 'absolute', left: 74 * s, top: 356 * s, width: 400 * s, height: 9 * s, borderRadius: 5, background: 'rgba(10,18,24,0.42)', filter: 'blur(4px)', opacity: sheet}} />
    <div style={{position: 'absolute', left: 120 * s, top: 470 * s, width: 320 * s, height: 8 * s, borderRadius: 4, background: 'rgba(10,18,24,0.34)', filter: 'blur(4px)', opacity: sheet}} />
    {/* the body under the sheet: one soft ridge, not a lump */}
    <div style={{position: 'absolute', left: 108 * s, top: 300 * s, width: 340 * s, height: 120 * s, borderRadius: `${80 * s}px ${80 * s}px 40px 40px`, background: 'rgba(120,142,158,0.12)', filter: `blur(${10 * s}px)`, opacity: sheet}} />

    {/* the cold strip of ceiling light above the bed */}
    <div style={{position: 'absolute', left: 60 * s, top: 22 * s, width: 420 * s, height: 8 * s, borderRadius: 4, background: `rgba(196,226,244,${0.26 + Math.sin(f / 40) * 0.07})`, boxShadow: '0 0 40px rgba(180,220,242,0.4)'}} />
  </div>
);

/* ------------------------------------------------------------------ */
/* 01 — the platform descends                                          */
/* ------------------------------------------------------------------ */

const ShotLower: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s1;
  const drop = smooth(clamp01(k / 120));
  return (
    <Night f={f} glow="radial-gradient(800px 1200px at 50% 64%, rgba(26,62,88,0.44), rgba(2,5,10,0) 74)">
      <Cam z={1.01 + drop * 0.05} ox="50%" oy="62%">
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(76% 70% at 50% 60%, #081019 0%, #03070B 78%)'}} />
        {/* the shaft walls, sliding up as we descend */}
        <div style={{position: 'absolute', inset: 0, transform: `translateY(${drop * 180}px)`}}>
          {Array.from({length: 8}).map((_, i) => (
            <div key={i} style={{position: 'absolute', left: 0, right: 0, top: -200 + i * 300, height: 2, background: 'rgba(132,168,192,0.1)'}} />
          ))}
          {[0, 1, 2, 3].map((i) => (
            <div key={`v${i}`} style={{position: 'absolute', left: 70 + i * 300, top: 0, width: 4, height: 1920, background: 'linear-gradient(180deg, rgba(150,186,212,0.1), transparent 76%)'}} />
          ))}
        </div>
        {/* the platform, with Noah on it, from behind */}
        <div style={{position: 'absolute', left: 120, right: 120, top: 640 + drop * 120, height: 60, borderRadius: 8, background: 'linear-gradient(180deg,#1E2832,#080D13)', boxShadow: '0 20px 60px rgba(0,0,0,0.9), inset 0 2px 0 rgba(170,206,228,0.18)'}} />
        <div style={{position: 'absolute', left: 120, right: 120, top: 700 + drop * 120, height: 20, background: 'linear-gradient(180deg, rgba(150,196,224,0.14), transparent)'}} />
        <div style={{position: 'absolute', left: 372, top: 240 + drop * 120, width: 340, height: 440}}>
          <svg viewBox="0 0 340 440" width="100%" height="100%">
            <path d="M 96 440 L 100 250 C 102 200 126 176 170 168 C 214 176 238 200 240 250 L 244 440 Z" fill="#05090E" />
            <ellipse cx={170} cy={132} rx={66} ry={74} fill="#04080C" />
            <path d="M 100 250 C 102 200 126 176 170 168" stroke="rgba(196,226,244,0.5)" strokeWidth={4} fill="none" />
            <path d="M 104 132 C 106 62 134 44 170 44 C 206 44 234 62 236 132" stroke="rgba(196,226,244,0.3)" strokeWidth={3} fill="none" />
          </svg>
        </div>
        {/* the chamber floor, coming up to meet them */}
        <div style={{position: 'absolute', left: 0, right: 0, top: 1240, bottom: 0, background: 'linear-gradient(180deg,#0A141C 0%,#050A10 54%,#02060A 100%)'}} />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={`b${i}`} style={{position: 'absolute', left: 40 + i * 176, top: 1320 + rnd(i) * 60, width: 150, height: 8, borderRadius: 4, background: `rgba(150,196,224,${0.08 + rnd(i + 2) * 0.1})`}} />
        ))}
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(64% 58% at 50% 56%, transparent 34%, rgba(2,5,9,0.9) 100%)'}} />
      </Cam>
    </Night>
  );
};

/* ------------------------------------------------------------------ */
/* 02-03 — every face                                                  */
/* ------------------------------------------------------------------ */

const ShotFaces: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s2;
  return (
    <Night f={f} glow="radial-gradient(920px 1000px at 50% 44%, rgba(28,64,90,0.44), rgba(2,5,10,0) 74)">
      <Cam z={1.06 + smooth(clamp01(k / 70)) * 0.05} ox="50%" oy="44%">
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg,#071019,#04080D 68%)'}} />
        {/* the bed frames, under everything */}
        {[0, 1, 2].map((i) => (
          <div key={i} style={{position: 'absolute', left: -60 + i * 360, top: 180, width: 320, height: 1560, background: 'linear-gradient(180deg,#0C1822 0%,#071018 60%,#04090E 100%)', boxShadow: 'inset 0 0 0 2px rgba(140,178,204,0.08)'}} />
        ))}
        <SleeperNoah f={f} x={-100} y={210} s={0.72} lid={1} rim={0.7} tilt={-2} />
        <SleeperNoah f={f} x={280} y={120} s={0.8} lid={1} rim={0.95} tilt={1} />
        <SleeperNoah f={f} x={650} y={230} s={0.74} lid={1} rim={0.6} tilt={-1} />
        {/* the cold light strip above the row */}
        <div style={{position: 'absolute', left: 0, right: 0, top: 96, height: 10, background: 'rgba(196,226,244,0.32)', boxShadow: '0 0 90px rgba(180,220,242,0.4)'}} />
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(66% 58% at 50% 44%, transparent 32%, rgba(2,5,9,0.88) 100%)'}} />
      </Cam>
    </Night>
  );
};

const ShotAllHis: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s3;
  return (
    <Night f={f} glow="radial-gradient(900px 1000px at 48% 42%, rgba(24,58,84,0.46), rgba(2,5,10,0) 72)">
      <Cam z={1.04 + smooth(clamp01(k / 78)) * 0.06} ox="48%" oy="40%">
        <div style={{position: 'absolute', inset: 0, background: '#04080D'}} />
        <div style={{position: 'absolute', left: 150, top: 120, width: 780, height: 1140, opacity: 0.55, filter: 'blur(7px)'}}>
          <SleeperNoah f={f} x={0} y={0} s={0.86} lid={1} rim={0.6} tilt={-2} />
        </div>
        <div style={{position: 'absolute', left: -220, top: 420, width: 720, height: 1060, opacity: 0.42, filter: 'blur(6px)'}}>
          <SleeperNoah f={f} x={0} y={0} s={0.8} lid={1} rim={0.5} tilt={3} />
        </div>
        <div style={{position: 'absolute', left: 90, top: 660, width: 900, height: 1320}}>
          <SleeperNoah f={f} x={0} y={0} s={0.98} lid={1} rim={1} />
        </div>
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(64% 58% at 46% 42%, transparent 26%, rgba(2,5,9,0.94) 100%)'}} />
      </Cam>
    </Night>
  );
};

/* ------------------------------------------------------------------ */
/* 04 — she counts the beds                                            */
/* ------------------------------------------------------------------ */

const ShotCount: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s4;
  const walk = smooth(clamp01(k / 130));
  return (
    <Night f={f} glow="radial-gradient(1000px 1000px at 52% 44%, rgba(26,60,86,0.4), rgba(2,5,10,0) 74)">
      <Cam z={1.02 + walk * 0.05} ox="52%" oy="44%">
        <Chamber f={f} alert={0} awake={0} strip={0} />
        {/* her, from behind, walking between the rows */}
        <div style={{position: 'absolute', left: 300 - walk * 40, top: 1020, width: 480, height: 1000, filter: 'brightness(0.8)'}}>
          <AmaraBack rim={1.4} viewBox="0 0 300 700" preserve="xMidYMax slice" />
        </div>
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(70% 60% at 52% 46%, transparent 36%, rgba(2,5,9,0.84) 100%)'}} />
      </Cam>
    </Night>
  );
};

/* ------------------------------------------------------------------ */
/* 05-06 — one of them wakes                                           */
/* ------------------------------------------------------------------ */

const ShotEyes: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s5;
  const open = smooth(clamp01((k - 14) / 26));
  return (
    <Night f={f} glow="radial-gradient(820px 860px at 50% 46%, rgba(28,66,92,0.46), rgba(2,5,10,0) 72)">
      <Cam z={1.08 + smooth(clamp01(k / 66)) * 0.06} ox="50%" oy="44%">
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg,#071019,#04080D 66%)'}} />
        <SleeperNoah f={f} x={-40} y={420} s={1.7} lid={1 - open} rim={1.15} />
        {/* the eyes catch the cold strip as they open */}
        <div style={{position: 'absolute', left: 330, top: 640, width: 400, height: 180, background: `radial-gradient(closest-side, rgba(226,244,252,${0.06 + open * 0.2}), transparent 74%)`, filter: 'blur(16px)', mixBlendMode: 'screen'}} />
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(62% 56% at 52% 44%, transparent 28%, rgba(2,5,9,0.92) 100%)'}} />
      </Cam>
    </Night>
  );
};

const ShotWhichOne: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s6;
  const sit = smooth(clamp01(k / 30));
  return (
    <Night f={f} glow="radial-gradient(760px 1000px at 50% 44%, rgba(30,70,96,0.5), rgba(2,5,10,0) 72)">
      <Cam z={1.03 + smooth(clamp01(k / 56)) * 0.05} ox="50%" oy="40%">
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg,#08111A,#04080D 68%)'}} />
        {/* the bed, and the one sitting up in it */}
        <div style={{position: 'absolute', left: 90, top: 1180, width: 900, height: 240, borderRadius: 16, background: 'linear-gradient(180deg,#1E2C38,#0A1117)', boxShadow: 'inset 0 0 0 2px rgba(150,186,212,0.1)'}} />
        <div style={{position: 'absolute', left: 160, top: 700 + (1 - sit) * 380, width: 700, height: 800, opacity: sit}}>
          {/* viewBox aspect = container aspect (700x800), so the crop never
              slices the top of his head off */}
          <Noah expression="tired" look="camera" turn={0} rim={1.0} lidOverride={0.1} viewBox="150 18 300 343" preserve="xMidYMax slice" />
        </div>
        {/* the sheet, pooled at his waist: it belongs at his lap, never at
            his face, so it sits low and stays under the vignette */}
        <div
          style={{
            position: 'absolute',
            left: 130,
            top: 1272,
            width: 860,
            height: 300,
            borderRadius: '50px 50px 22px 22px',
            background: 'linear-gradient(180deg,#8B99A3 0%,#5A6771 54%,#333D45 100%)',
            boxShadow: 'inset 0 3px 0 rgba(206,226,240,0.14), inset 0 26px 40px rgba(0,0,0,0.42)',
            opacity: 0.95,
            transform: `translateY(${sit * 34}px)`,
          }}
        >
          {/* two creases, so it reads as cloth rather than a slab */}
          {[0, 1].map((i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 120 + i * 260,
                top: -6,
                width: 6,
                height: 250,
                borderRadius: 3,
                background: 'linear-gradient(180deg, rgba(0,0,0,0.42), rgba(0,0,0,0.04))',
                transform: `rotate(${i === 0 ? -7 : 6}deg)`,
              }}
            />
          ))}
        </div>
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(62% 56% at 50% 40%, transparent 28%, rgba(2,5,9,0.9) 100%)'}} />
      </Cam>
    </Night>
  );
};

/* ------------------------------------------------------------------ */
/* 07 — Noah backs away                                               */
/* ------------------------------------------------------------------ */

const ShotBackAway: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s7;
  const back = smooth(clamp01(k / 110));
  return (
    <Night f={f} glow={`radial-gradient(900px 1000px at 54% 42%, rgba(30,70,96,${0.42 + back * 0.12}), rgba(2,5,10,0) 74)`}>
      <Cam z={1.03 + back * 0.04} ox="54%" oy="42%">
        <Chamber f={f} alert={0} awake={back * 0.8} strip={0.2 * back} />
        {/* cold light behind his head, so the black hair keeps a silhouette
            instead of dissolving into the black room */}
        <div
          style={{
            position: 'absolute',
            left: 150 - back * 60,
            top: 660,
            width: 560,
            height: 620,
            background: 'radial-gradient(closest-side, rgba(116,170,204,0.30), rgba(6,14,20,0) 74%)',
            filter: 'blur(22px)',
            mixBlendMode: 'screen',
          }}
        />
        <div style={{position: 'absolute', left: 120 - back * 60, top: 900, width: 620, height: 1100, filter: 'brightness(1.12)'}}>
          <Noah expression="unease" look="camera" turn={0.06} rim={1.2} lidOverride={0.1} viewBox="150 24 300 560" preserve="xMidYMax slice" />
        </div>
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(66% 58% at 50% 44%, transparent 32%, rgba(2,5,9,0.86) 100%)'}} />
      </Cam>
    </Night>
  );
};

/* ------------------------------------------------------------------ */
/* 08 — some whispered his name, some cried                            */
/* ------------------------------------------------------------------ */

const ShotWhisper: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s8;
  return (
    <Night f={f} glow="radial-gradient(900px 900px at 48% 46%, rgba(28,64,90,0.44), rgba(2,5,10,0) 72)">
      <Cam z={1.04 + smooth(clamp01(k / 94)) * 0.05} ox="48%" oy="44%">
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg,#081019,#04080D 66%)'}} />
        {/* three awake faces in the dark, talking */}
        {[
          {x: -40, y: 700, s: 1.15, r: 0.8, d: 0},
          {x: 360, y: 520, s: 1.0, r: 1.0, d: 20},
          {x: 720, y: 760, s: 1.2, r: 0.7, d: 40},
        ].map((b, i) => (
          <div key={i} style={{position: 'absolute', left: b.x, top: b.y, width: 420 * b.s, height: 600 * b.s, opacity: 0.9}}>
            <Noah
              expression={i === 1 ? 'sad' : 'unease'}
              look={i === 1 ? 'down' : 'camera'}
              mouth={talk(f, C.s8 + b.d, C.s9, 0.16, 2.4)}
              rim={b.r}
              lidOverride={0.14}
              viewBox="188 66 238 400"
              preserve="xMidYMid slice"
            />
          </div>
        ))}
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 460, background: 'linear-gradient(180deg, transparent, rgba(3,7,11,0.9))'}} />
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(64% 58% at 48% 44%, transparent 30%, rgba(2,5,9,0.9) 100%)'}} />
      </Cam>
    </Night>
  );
};

/* ------------------------------------------------------------------ */
/* 09 — one reaches for her                                            */
/* ------------------------------------------------------------------ */

const ShotReach: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s9;
  const reach = smooth(clamp01(k / 50));
  return (
    <Night f={f} glow="radial-gradient(820px 900px at 44% 44%, rgba(30,70,96,0.46), rgba(2,5,10,0) 72)">
      <Cam z={1.04 + smooth(clamp01(k / 112)) * 0.05} ox="44%" oy="42%">
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg,#081019,#04080D 66%)'}} />
        {/* her face, near, listening */}
        <div style={{position: 'absolute', left: -180, top: 480, width: 620, height: 1200, filter: 'brightness(0.8)'}}>
          <Amara expression="guarded" look="right" turn={0.34} screen={0.7} rim={1.3} lidOverride={blinkLid(f, 70)} mouth={0.05} viewBox="170 50 260 460" preserve="xMidYMid slice" />
        </div>
        {/* a hand entering from the right, attached to a forearm and sleeve */}
        <div style={{position: 'absolute', right: -120, top: 760 + (1 - reach) * 120, width: 760, height: 700, transform: `rotate(${-16 + reach * 6}deg)`, transformOrigin: '100% 40%'}}>
          <div style={{position: 'absolute', right: 0, top: 240, width: 640, height: 300, borderRadius: 120, background: 'linear-gradient(180deg,#2A333D 0%,#151C24 56%,#080D12 100%)', boxShadow: 'inset 0 2px 0 rgba(190,216,232,0.14)'}} />
          <div style={{position: 'absolute', left: 90, top: 236, width: 520, height: 240, borderRadius: 90, background: 'linear-gradient(166deg,#6E5543 0%,#4A3627 56%,#271E16 100%)'}} />
          <div style={{position: 'absolute', left: 30, top: 210, width: 130, height: 290, borderRadius: '60px 60px 46px 46px', background: 'linear-gradient(160deg,#755A46,#3A2A20)'}} />
          {[0, 1, 2, 3].map((i) => (
            <div key={i} style={{position: 'absolute', left: 0 + i * 9, top: 150 + i * 54, width: 80 + i * 5, height: 48, borderRadius: 24, background: 'linear-gradient(160deg,#77604B,#392A20)', transform: `rotate(${-4 + i * 3}deg)`}} />
          ))}
          {/* the light from the ceiling on the fingertips */}
          <div style={{position: 'absolute', left: 24, top: 138, width: 150, height: 240, background: 'radial-gradient(closest-side, rgba(214,236,248,0.18), transparent 72%)', filter: 'blur(14px)'}} />
        </div>
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(62% 56% at 46% 44%, transparent 30%, rgba(2,5,9,0.9) 100%)'}} />
      </Cam>
    </Night>
  );
};

/* ------------------------------------------------------------------ */
/* 10-12 — the warning, the awakening, the locks                       */
/* ------------------------------------------------------------------ */

const ShotWarning: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s10;
  const spread = smooth(clamp01((k - 40) / 80));
  return (
    <Night f={f} glow="radial-gradient(900px 900px at 50% 40%, rgba(50,44,44,0.5), rgba(2,5,10,0) 72)">
      <Cam z={1.02 + spread * 0.05} ox="50%" oy="38%">
        <Chamber f={f} alert={0.5 + spread * 0.6} awake={0.7} strip={0.5} />
        {/* the ceiling strip turning red, one panel at a time */}
        <div style={{position: 'absolute', inset: 0, background: `radial-gradient(80% 60% at 50% 8%, rgba(214,74,58,${0.26 * spread}), transparent 72%)`, mixBlendMode: 'screen'}} />
        {Array.from({length: 5}).map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 40 + i * 208,
              top: 210,
              width: 150,
              height: 14,
              borderRadius: 6,
              background: `rgba(${226},${110 - i * 8},${88 - i * 6},${(i / 5 < spread ? 0.9 : 0.1) * 1})`,
              boxShadow: i / 5 < spread ? '0 0 90px rgba(220,86,64,0.6)' : 'none',
            }}
          />
        ))}
        {/* a face lit only by the warning */}
        <div style={{position: 'absolute', left: 300, top: 1000, width: 560, height: 760, filter: 'brightness(0.72)'}}>
          <Noah expression="dread" look="up" turn={0} rim={0.6} lidOverride={0.06} mouth={0.16} viewBox="176 46 250 430" preserve="xMidYMid slice" />
        </div>
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(66% 58% at 50% 44%, transparent 30%, rgba(2,5,9,0.9) 100%)'}} />
      </Cam>
    </Night>
  );
};

const ShotCollective: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s11;
  const rise = smooth(clamp01(k / 50));
  return (
    <Night f={f} glow="radial-gradient(1000px 1000px at 50% 36%, rgba(56,44,44,0.5), rgba(2,5,10,0) 72)">
      <Cam z={1.02 + rise * 0.05} ox="50%" oy="34%">
        <Chamber f={f} alert={0.9} awake={1} strip={0.8} />
        <div style={{position: 'absolute', inset: 0, background: `radial-gradient(80% 56% at 50% 6%, rgba(220,84,62,${0.34 + rise * 0.1}), transparent 70%)`, mixBlendMode: 'screen'}} />
        {/* bodies sitting up in every bed */}
        {[
          {x: 120, y: 760, s: 0.7},
          {x: 640, y: 840, s: 0.6},
          {x: -40, y: 1140, s: 0.9},
          {x: 520, y: 1240, s: 0.85},
        ].map((b, i) => (
          <div key={i} style={{position: 'absolute', left: b.x, top: b.y, width: 300 * b.s, height: 400 * b.s, opacity: 0.85, filter: 'brightness(0.7)'}}>
            <svg viewBox="0 0 300 400" width="100%" height="100%">
              <path d="M 70 400 L 76 220 C 80 160 110 132 150 124 C 190 132 220 160 224 220 L 230 400 Z" fill="#060A0F" />
              <ellipse cx={150} cy={92} rx={58} ry={64} fill="#05080C" />
              <path d="M 76 220 C 80 160 110 132 150 124" stroke="rgba(236,150,126,0.5)" strokeWidth={4} fill="none" />
            </svg>
          </div>
        ))}
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(68% 60% at 50% 46%, transparent 32%, rgba(2,5,9,0.88) 100%)'}} />
      </Cam>
    </Night>
  );
};

const ShotLocks: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s12;
  const unlock = smooth(clamp01(k / 34));
  return (
    <Night f={f} glow="radial-gradient(900px 860px at 50% 50%, rgba(40,64,80,0.44), rgba(2,5,10,0) 72)">
      <Cam z={1.05 + unlock * 0.04} ox="50%" oy="48%">
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg,#070F16,#04080D 66%)'}} />
        {/* a row of bed latches, all releasing together */}
        {[0, 1, 2].map((r) =>
          [0, 1, 2].map((c) => {
            const i = r * 3 + c;
            const on = clamp01((unlock * 12 - i) / 2);
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: 40 + c * 350,
                  top: 560 + r * 400,
                  width: 300,
                  height: 250,
                  borderRadius: 14,
                  background: 'linear-gradient(180deg,#1B2731,#090F15)',
                  boxShadow: 'inset 0 0 0 2px rgba(150,186,212,0.1)',
                }}
              >
                <div style={{position: 'absolute', left: 30, top: 40, width: 240, height: 90, borderRadius: 8, background: 'linear-gradient(180deg,#0E1820,#060B10)'}}>
                  <div style={{position: 'absolute', left: 24, top: 34, width: 190, height: 6, borderRadius: 3, background: `rgba(${120 + on * 90},${170 + on * 40},${180 + on * 50},${0.3 + on * 0.5})`}} />
                </div>
                {/* the latch itself, dropping open */}
                <div style={{position: 'absolute', left: 110, top: 150, width: 80, height: 60, borderRadius: 6, background: 'linear-gradient(180deg,#46535E,#1A232B)', transform: `rotate(${unlock * 46}deg)`, transformOrigin: '50% 10%'}} />
                <div style={{position: 'absolute', right: 24, top: 158, width: 12, height: 12, borderRadius: '50%', background: `rgba(${120 + on * 60},${200},${160},${0.3 + on * 0.6})`, boxShadow: `0 0 18px rgba(120,214,172,${0.4 * on})`}} />
              </div>
            );
          })
        )}
        {/* red still in the air above */}
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(80% 54% at 50% 0%, rgba(210,70,54,0.24), transparent 66%)', mixBlendMode: 'screen'}} />
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(66% 60% at 50% 48%, transparent 32%, rgba(2,5,9,0.9) 100%)'}} />
      </Cam>
    </Night>
  );
};

/* ------------------------------------------------------------------ */

export const S02E08: React.FC = () => {
  const f = useCurrentFrame();
  const shot =
    f < C.s2 ? (
      <ShotLower f={f} />
    ) : f < C.s3 ? (
      <ShotFaces f={f} />
    ) : f < C.s4 ? (
      <ShotAllHis f={f} />
    ) : f < C.s5 ? (
      <ShotCount f={f} />
    ) : f < C.s6 ? (
      <ShotEyes f={f} />
    ) : f < C.s7 ? (
      <ShotWhichOne f={f} />
    ) : f < C.s8 ? (
      <ShotBackAway f={f} />
    ) : f < C.s9 ? (
      <ShotWhisper f={f} />
    ) : f < C.s10 ? (
      <ShotReach f={f} />
    ) : f < C.s11 ? (
      <ShotWarning f={f} />
    ) : f < C.s12 ? (
      <ShotCollective f={f} />
    ) : (
      <ShotLocks f={f} />
    );

  return (
    <AbsoluteFill style={{background: '#02050A'}}>
      <Audio src={staticFile('audio/s02e08.mp3')} />
      <Grade lift={1.32} contrast={1.04}>{shot}</Grade>
      {/* black tail: the film ends in black, and it ends inside the audio */}
      <AbsoluteFill
        style={{background: '#000', opacity: smooth(clamp01((f - (C.total - 26)) / 13))}}
      />
      {f < C.total - 26 ? <Watermark /> : null}
    </AbsoluteFill>
  );
};
