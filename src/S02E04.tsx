import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {Amara, AmaraBack} from './character/Amara';
import {Noah} from './character/Noah';
import {Cam} from './Episode';
import {
  Watermark,
  Scanlines,
  ScreenGlass,
  PhoneSlab,
  Monitor,
  clamp01,
  smooth,
  blinkLid,
  talk,
  rnd,
  MONO,
  SANS,
} from './kit';
import {Night, Haze, GlitchBars, Readout, Grade} from './kit2';

/* ------------------------------------------------------------------ */
/* S02E04 — THE FALSE MEMORY                                           */
/* 44.000 s of real narration -> 1320 frames. 15 shots.                 */
/* Cuts on measured word boundaries (Whisper base.en).                 */
/* ------------------------------------------------------------------ */

const C = {
  s1: 0, // The archive showed Amara a memory she had never lived.
  s2: 133, // She and Noah were laughing beside a sunlit lake.
  s3: 239, // There was no rain. No laboratory. No clock.
  s4: 367, // For one moment, she wanted to believe it.
  s5: 460, // Then the image skipped.
  s6: 506, // The same smile repeated three times.
  s7: 593, // Noah turned toward the camera and stopped moving.
  s8: 680, // A line of code appeared across the water.
  s9: 763, // "Emotional attachment trial: successful."
  s10: 862, // Amara stepped away from the screen.
  s11: 929, // Someone had built a memory of love…
  s12: 1043, // Her phone rang.
  s13: 1090, // Noah answered before she could speak.
  s14: 1150, // "Amara, whatever you saw…"
  s15: 1267, // The recording began to play again.
  total: 1320,
};

const FADE = 1302;

/* ------------------------------------------------------------------ */
/* the false memory: a lake, in daylight                               */
/* ------------------------------------------------------------------ */

/* the lake, built three times: far ridge, tree line, water. it has to look
   like a place someone would want to live in, because that is the lie. */
const LakeSet: React.FC<{f: number; warm?: number; children?: React.ReactNode}> = ({
  f,
  warm = 1,
  children,
}) => {
  const horizon = 998;
  /* one rounded canopy, used at three depths */
  const Canopy: React.FC<{x: number; y: number; w: number; h: number; fill: string; o?: number}> = ({
    x,
    y,
    w,
    h,
    fill,
    o = 1,
  }) => (
    <g opacity={o}>
      <rect x={x + w / 2 - 5} y={y + h * 0.55} width={10} height={h * 0.6} fill={fill} />
      <ellipse cx={x + w / 2} cy={y + h * 0.34} rx={w / 2} ry={h * 0.42} fill={fill} />
      <ellipse cx={x + w / 2 - w * 0.26} cy={y + h * 0.5} rx={w * 0.34} ry={h * 0.3} fill={fill} />
      <ellipse cx={x + w / 2 + w * 0.28} cy={y + h * 0.52} rx={w * 0.32} ry={h * 0.28} fill={fill} />
      <ellipse cx={x + w / 2} cy={y + h * 0.22} rx={w * 0.3} ry={h * 0.24} fill={fill} />
    </g>
  );

  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
      {/* sky, warm at the horizon */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: horizon,
          background: `linear-gradient(180deg, rgba(${138 + warm * 42},${176 + warm * 28},${202 + warm * 12},1) 0%, rgba(${186 + warm * 40},${200 + warm * 24},${198 + warm * 12},1) 54%, rgba(${240 + warm * 10},${228 + warm * 14},${192 + warm * 18},1) 100%)`,
        }}
      />
      {/* the sun, low over the far shore */}
      <div style={{position: 'absolute', left: 566, top: 300, width: 150, height: 150, borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(255,252,236,0.98), rgba(255,238,196,0.5) 62%, transparent 78%)', filter: 'blur(6px)'}} />
      <div style={{position: 'absolute', left: 360, top: 170, width: 760, height: 700, background: 'radial-gradient(closest-side, rgba(255,244,206,0.6), rgba(255,232,182,0.12) 58%, transparent 78%)', filter: 'blur(34px)', mixBlendMode: 'screen'}} />
      {/* two slow cloud bands */}
      {[
        {l: -120, t: 210, w: 620, h: 74, o: 0.3},
        {l: 520, t: 96, w: 720, h: 56, o: 0.22},
        {l: 40, t: 470, w: 520, h: 42, o: 0.16},
      ].map((c, i) => (
        <div key={i} style={{position: 'absolute', left: c.l + Math.sin(f / 220 + i) * 26, top: c.t, width: c.w, height: c.h, borderRadius: '50%', background: `rgba(255,250,236,${c.o})`, filter: 'blur(16px)'}} />
      ))}

      {/* the far ridge, softened by distance */}
      <div style={{position: 'absolute', left: -60, right: -60, top: horizon - 150, height: 160, borderRadius: '46% 54% 0 0 / 90% 100% 0 0', background: 'linear-gradient(180deg, rgba(148,166,166,0.85), rgba(120,140,142,0.95))', filter: 'blur(4px)'}} />

      {/* tree line: back rank pale and hazy, front rank near black-green */}
      <svg viewBox="0 0 1080 420" width="100%" style={{position: 'absolute', left: 0, top: horizon - 420, height: 420}} preserveAspectRatio="none">
        <g style={{filter: 'blur(3px)'}}>
          {Array.from({length: 14}).map((_, i) => (
            <Canopy key={`b${i}`} x={-60 + i * 92} y={120 + rnd(i + 2) * 60} w={150 + rnd(i + 5) * 90} h={210 + rnd(i + 9) * 110} fill="rgb(112,134,126)" o={0.72} />
          ))}
        </g>
        <g style={{filter: 'blur(1.2px)'}}>
          {Array.from({length: 17}).map((_, i) => (
            <Canopy key={`m${i}`} x={-40 + i * 74} y={196 + rnd(i + 13) * 70} w={120 + rnd(i + 3) * 80} h={190 + rnd(i + 7) * 120} fill="rgb(74,96,84)" o={0.95} />
          ))}
        </g>
        <g>
          {Array.from({length: 9}).map((_, i) => {
            const tall = i === 2 || i === 6;
            return (
              <Canopy
                key={`f${i}`}
                x={-80 + i * 150}
                y={tall ? 150 : 250 + rnd(i + 21) * 42}
                w={190 + rnd(i + 4) * 90}
                h={tall ? 330 : 220 + rnd(i + 6) * 90}
                fill="rgb(34,50,44)"
              />
            );
          })}
        </g>
        {/* the bank they stand on */}
        <rect x={0} y={402} width={1080} height={20} fill="rgba(196,196,168,0.9)" />
      </svg>

      {/* the water, with the tree line repeated in it, broken and dim */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: horizon + 14,
          bottom: 0,
          background: `linear-gradient(180deg, rgba(${206 + warm * 26},${214 + warm * 18},${198 + warm * 14},1) 0%, rgba(${150 + warm * 26},${176 + warm * 18},${172 + warm * 12},1) 26%, rgba(${52 + warm * 12},${80 + warm * 14},${92 + warm * 10},1) 78%, rgba(10,22,28,1) 100%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: horizon + 14,
          height: 150,
          background: 'linear-gradient(180deg, rgba(46,66,58,0.42), transparent 88%)',
          filter: 'blur(9px)',
        }}
      />
      {/* broken trunks in the reflection */}
      {Array.from({length: 12}).map((_, i) => (
        <div key={`rf${i}`} style={{position: 'absolute', left: 20 + i * 92, top: horizon + 18, width: 26, height: 60 + rnd(i + 3) * 90, background: 'linear-gradient(180deg, rgba(26,44,40,0.34), rgba(26,44,40,0))', filter: 'blur(8px)', transform: `skewY(${Math.sin(f / 90 + i) * 2.5}deg)`}} />
      ))}
      {/* glitter under the sun */}
      {Array.from({length: 30}).map((_, i) => (
        <div
          key={`g${i}`}
          style={{
            position: 'absolute',
            left: 420 + rnd(i + 11) * 420 - i * 3,
            top: horizon + 40 + i * 18,
            width: 26 + rnd(i + 4) * 86,
            height: 4 + rnd(i + 8) * 5,
            borderRadius: '50%',
            background: 'rgba(255,250,228,0.7)',
            filter: 'blur(2px)',
            opacity: 0.32 + Math.sin(f / 19 + i) * 0.24,
          }}
        />
      ))}
      {/* slow ripples */}
      {Array.from({length: 9}).map((_, i) => (
        <div
          key={`r${i}`}
          style={{
            position: 'absolute',
            left: 60 + rnd(i + 21) * 900,
            top: horizon + 120 + i * 70,
            width: 140 + rnd(i) * 260,
            height: 3,
            borderRadius: 2,
            background: 'rgba(226,238,236,0.24)',
            transform: `translateX(${Math.sin(f / 26 + i) * 10}px)`,
          }}
        />
      ))}
      {children}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* 01 — the memory opens                                               */
/* ------------------------------------------------------------------ */

const ShotOpen: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s1;
  const bloom = smooth(clamp01((k - 34) / 40));
  return (
    <Night f={f} glow="radial-gradient(900px 900px at 50% 44%, rgba(28,60,84,0.4), rgba(2,5,10,0) 74)">
      <Cam z={1.02 + smooth(clamp01(k / 130)) * 0.04} ox="50%" oy="46%">
        <div style={{position: 'absolute', inset: 0, background: '#04070B'}} />
        {/* the archive screen, seen from behind her */}
        <div
          style={{
            position: 'absolute',
            left: 100,
            top: 420,
            width: 880,
            height: 1080,
            borderRadius: 12,
            background: 'linear-gradient(160deg,#18212A,#070C11)',
            boxShadow: 'inset 0 0 0 2px rgba(150,186,212,0.14), 0 30px 80px rgba(0,0,0,0.9)',
            overflow: 'hidden',
            opacity: 0.4 + bloom * 0.6,
          }}
        >
          <div style={{position: 'absolute', inset: 16, overflow: 'hidden', borderRadius: 6, background: '#081019'}}>
            <div style={{position: 'absolute', inset: 0, background: `radial-gradient(80% 70% at 50% 44%, rgba(220,236,244,${0.14 + bloom * 0.5}), transparent 74%)`}} />
            <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(200,224,236,0.5), transparent 60%)', opacity: bloom * 0.5}} />
            <GlitchBars f={f} amount={0.14 * (1 - bloom)} seed={3} />
            <Scanlines opacity={0.2} />
            <ScreenGlass strength={0.6} />
          </div>
        </div>
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: 600,
            background: 'linear-gradient(180deg, transparent, rgba(2,5,10,0.9))',
          }}
        />
      </Cam>
    </Night>
  );
};

/* ------------------------------------------------------------------ */
/* 02-04 — inside the memory                                           */
/* ------------------------------------------------------------------ */

const ShotLake: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s2;
  return (
    <Night f={f} glow="radial-gradient(1000px 800px at 58% 24%, rgba(255,236,190,0.24), rgba(2,5,10,0) 72)" vignette={0.5} grain={0.05}>
      <Cam z={1.01 + smooth(clamp01(k / 105)) * 0.05} ox="52%" oy="52%">
        <LakeSet f={f}>
          {/* the near bank: the camera stands on it, so the water is always behind them */}
          <div style={{position: 'absolute', left: -60, right: -60, top: 1660, height: 320, background: 'linear-gradient(180deg, rgba(40,52,44,0.9) 0%, rgba(22,32,28,0.96) 42%, rgba(8,12,12,1) 100%)'}} />
          <div style={{position: 'absolute', left: -60, right: -60, top: 1660, height: 4, background: 'rgba(214,226,206,0.28)', filter: 'blur(2px)'}} />

          {/* two people, close, cut at the waist by the frame */}
          <div style={{position: 'absolute', left: 74, top: 640, width: 560, height: 1420}}>
            <Noah
              expression="relief"
              look="right"
              turn={-0.38}
              rim={1.55}
              lidOverride={0.04}
              mouth={0.1 + Math.sin(f / 11) * 0.08}
              viewBox="150 20 300 580"
              preserve="xMidYMax slice"
            />
          </div>
          <div style={{position: 'absolute', left: 556, top: 720, width: 540, height: 1380}}>
            <Amara
              expression="soft"
              look="left"
              turn={0.4}
              rim={1.6}
              screen={0.06}
              lidOverride={0.05}
              mouth={0.14 + Math.sin(f / 9) * 0.1}
              viewBox="150 20 300 580"
              preserve="xMidYMax slice"
            />
          </div>
          {/* their shadow on the bank, toward us */}
          <div style={{position: 'absolute', left: 40, right: 40, top: 1740, height: 180, background: 'radial-gradient(50% 60% at 46% 0%, rgba(0,0,0,0.55), transparent 74%)'}} />
        </LakeSet>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(66% 58% at 50% 44%, transparent 42%, rgba(24,34,38,0.62) 100%)',
          }}
        />
      </Cam>
    </Night>
  );
};

const ShotNoRain: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s3;
  return (
    <Night f={f} glow="radial-gradient(900px 800px at 62% 26%, rgba(255,238,196,0.2), rgba(2,5,10,0) 72)" vignette={0.5} grain={0.05}>
      <Cam z={1.02 + smooth(clamp01(k / 126)) * 0.05} ox="62%" oy="56%">
        <LakeSet f={f} />
        {/* nothing industrial anywhere in the frame */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(64% 58% at 56% 52%, transparent 40%, rgba(32,42,50,0.5) 100%)',
          }}
        />
      </Cam>
    </Night>
  );
};

const ShotBelieve: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s4;
  return (
    <Night f={f} glow="radial-gradient(900px 900px at 56% 32%, rgba(255,236,192,0.24), rgba(2,5,10,0) 72)" vignette={0.5} grain={0.05}>
      <Cam z={1.03 + smooth(clamp01(k / 90)) * 0.06} ox="54%" oy="36%">
        {/* the lake, thrown out of focus behind her: she is the only sharp thing */}
        <div style={{position: 'absolute', inset: -40, filter: 'blur(9px) brightness(1.04)', transform: 'scale(1.06)'}}>
          <LakeSet f={f} />
        </div>
        <div style={{position: 'absolute', left: 96, top: 190, width: 900, height: 1680}}>
          <Amara
            expression="soft"
            look="camera"
            turn={0.04}
            rim={1.1}
            screen={0.35}
            lidOverride={blinkLid(f, 404)}
            viewBox="182 60 232 402"
            preserve="xMidYMid slice"
          />
        </div>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(60% 54% at 50% 42%, transparent 40%, rgba(28,36,40,0.62) 100%)',
          }}
        />
      </Cam>
    </Night>
  );
};

/* ------------------------------------------------------------------ */
/* 05-06 — the skip                                                    */
/* ------------------------------------------------------------------ */

const ShotSkip: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s5;
  const jolt = Math.sin(k * 2.4) * (k < 26 ? 16 : 3);
  return (
    <Night f={f} glow="radial-gradient(900px 800px at 56% 46%, rgba(190,214,222,0.2), rgba(2,5,10,0) 72)" vignette={0.46} grain={0.07}>
      <div style={{position: 'absolute', inset: 0, transform: `translateX(${jolt}px)`}}>
        <LakeSet f={f}>
          <div style={{position: 'absolute', left: 372, top: 470, width: 400, height: 1080}}>
            <Amara
              expression="soft"
              look="right"
              turn={0.14}
              rim={0.9}
              lidOverride={blinkLid(f, 196)}
              viewBox="150 24 300 560"
              preserve="xMidYMax slice"
            />
          </div>
        </LakeSet>
      </div>
      <GlitchBars f={f} amount={0.8} seed={5} />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `repeating-linear-gradient(0deg, rgba(0,0,0,0.34) 0 3px, transparent 3px 9px)`,
          opacity: 0.5,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: '42%',
          height: 8,
          background: 'rgba(240,250,255,0.5)',
          opacity: 0.6,
        }}
      />
    </Night>
  );
};

const SmilePanel: React.FC<{f: number; x: number; y: number; w: number; h: number; seed: number}> = ({
  f,
  x,
  y,
  w,
  h,
  seed,
}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: w,
      height: h,
      overflow: 'hidden',
      background: 'linear-gradient(180deg,#B6C2BA,#5A6660)',
      boxShadow: 'inset 0 0 0 1px rgba(210,228,238,0.18)',
    }}
  >
    {/* the exact same face, three times */}
    <div style={{position: 'absolute', left: -w * 0.42, top: -h * 0.1, width: w * 2, height: h * 2.2}}>
      <Amara
        expression="soft"
        look="camera"
        turn={0.04}
        rim={0.8}
        screen={0.3}
        lidOverride={blinkLid(f, 404)}
        viewBox="196 84 200 316"
        preserve="xMidYMid slice"
      />
    </div>
    <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(60% 54% at 50% 46%, transparent 44%, rgba(26,34,38,0.5) 100%)'}} />
    <div style={{position: 'absolute', left: 0, right: 0, top: `${(f * 4 + seed * 20) % 100}%`, height: 22, background: 'linear-gradient(180deg, transparent, rgba(220,240,250,0.16), transparent)'}} />
  </div>
);

const ShotSmile: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s6;
  const hold = Math.floor(k / 24);
  return (
    <Night f={f} glow="radial-gradient(900px 900px at 50% 44%, rgba(150,186,196,0.2), rgba(2,5,10,0) 72)" vignette={0.5} grain={0.06}>
      <div style={{position: 'absolute', inset: 0, background: '#0A1116'}} />
      <SmilePanel f={f} x={40} y={300} w={1000} h={480} seed={0} />
      <SmilePanel f={f} x={40} y={800} w={1000} h={480} seed={1} />
      <SmilePanel f={f} x={40} y={1300} w={1000} h={480} seed={2} />
      {/* the repeat ticks, so the loop is visible */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: 24,
            top: 300 + i * 500 + 18,
            width: 6,
            height: 440,
            background: i === Math.min(2, hold) ? 'rgba(226,170,74,0.9)' : 'rgba(150,186,212,0.14)',
            boxShadow: i === Math.min(2, hold) ? '0 0 22px rgba(226,170,74,0.6)' : 'none',
          }}
        />
      ))}
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(64% 58% at 50% 48%, transparent 40%, rgba(3,7,11,0.7) 100%)'}} />
    </Night>
  );
};

/* ------------------------------------------------------------------ */
/* 07 — Noah stops moving                                              */
/* ------------------------------------------------------------------ */

const ShotTurn: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s7;
  const frozen = k > 46 ? 46 : k;
  const t = -0.24 + smooth(clamp01(frozen / 44)) * 0.34;
  const lock = smooth(clamp01((k - 46) / 14));
  return (
    <Night f={f} glow="radial-gradient(900px 900px at 56% 34%, rgba(255,236,196,0.2), rgba(2,5,10,0) 72)" vignette={0.48} grain={0.05}>
      <Cam z={1.03 + smooth(clamp01(k / 88)) * 0.06} ox="54%" oy="36%">
        {/* the same lake, now behind him and no longer moving */}
        <div style={{position: 'absolute', inset: -40, filter: 'blur(7px) brightness(1.02)', transform: 'scale(1.05)'}}>
          <LakeSet f={f} />
        </div>
        <div style={{position: 'absolute', left: 120, top: 150, width: 860, height: 1720}}>
          <Noah
            expression="relief"
            look="camera"
            turn={t}
            rim={0.9}
            lidOverride={blinkLid(frozen, 30)}
            viewBox="172 46 258 456"
            preserve="xMidYMid slice"
          />
        </div>
        {/* the freeze locks the frame: a hard scan band drops over it */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.22) 0 2px, transparent 2px 7px)',
            opacity: 0.2 + lock * 0.4,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: `${((frozen * 2.2) % 100)}%`,
            height: 40,
            background: 'linear-gradient(180deg, transparent, rgba(220,244,255,0.2), transparent)',
            opacity: lock,
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(60% 54% at 50% 42%, transparent 40%, rgba(26,34,36,0.6) 100%)',
          }}
        />
      </Cam>
    </Night>
  );
};

/* ------------------------------------------------------------------ */
/* 08-09 — the code, and the verdict                                   */
/* ------------------------------------------------------------------ */

const ShotCode: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s8;
  const draw = smooth(clamp01(k / 40));
  return (
    <Night f={f} glow="radial-gradient(900px 800px at 52% 50%, rgba(120,200,236,0.22), rgba(2,5,10,0) 72)" vignette={0.5} grain={0.05}>
      <Cam z={1.02 + smooth(clamp01(k / 88)) * 0.05} ox="50%" oy="52%">
        <LakeSet f={f} warm={0.7} />
        {/* a line of machine code laid across the water */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 900,
            height: 140,
            background: 'linear-gradient(180deg, rgba(6,14,20,0.72), rgba(6,14,20,0.2))',
            boxShadow: '0 0 80px rgba(120,200,236,0.2)',
            opacity: 0.4 + draw * 0.6,
            overflow: 'hidden',
          }}
        >
          {Array.from({length: 4}).map((_, r) => (
            <div key={r} style={{position: 'absolute', left: 30, right: 30, top: 22 + r * 26, display: 'flex', gap: 9}}>
              {Array.from({length: 26}).map((__, i) => (
                <div
                  key={i}
                  style={{
                    width: 6 + rnd(i + r * 13) * 30,
                    height: 9,
                    background: `rgba(150,214,240,${0.18 + rnd(i + r) * 0.5})`,
                    opacity: i / 26 < draw ? 1 : 0.12,
                  }}
                />
              ))}
            </div>
          ))}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: `${draw * 100}%`,
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(150,214,240,0.14))',
            }}
          />
        </div>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(64% 58% at 50% 48%, transparent 34%, rgba(6,12,16,0.8) 100%)',
          }}
        />
      </Cam>
    </Night>
  );
};

const ShotVerdict: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s9;
  const show = smooth(clamp01((k - 12) / 26));
  const caret = Math.sin(k / 4) > 0 ? 1 : 0;
  return (
    <Night f={f} glow="radial-gradient(900px 800px at 50% 46%, rgba(120,200,236,0.24), rgba(2,5,10,0) 72)" vignette={0.62} grain={0.055}>
      <Cam z={1.02 + smooth(clamp01(k / 96)) * 0.04} ox="50%" oy="46%">
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg,#0A141B 0%,#060C12 60%,#04070B 100%)'}} />
        {/* the frozen memory, dimmed behind the readout */}
        <div style={{position: 'absolute', inset: -30, filter: 'brightness(0.5) saturate(0.7)', opacity: 0.7}}>
          <LakeSet f={f} warm={0.6} />
        </div>
        <div
          style={{
            position: 'absolute',
            left: 60,
            top: 720,
            right: 60,
            padding: '38px 34px',
            background: 'linear-gradient(180deg, rgba(6,16,22,0.9), rgba(4,10,14,0.96))',
            boxShadow: '0 0 0 1px rgba(120,200,236,0.2), 0 20px 60px rgba(0,0,0,0.9)',
            opacity: show,
          }}
        >
          <div style={{display: 'flex', alignItems: 'baseline', gap: 10}}>
            <div style={{width: 12, height: 26, background: 'rgba(150,214,240,0.9)', opacity: caret}} />
            <div
              style={{
                fontFamily: MONO,
                fontSize: 44,
                lineHeight: 1.28,
                letterSpacing: '0.02em',
                color: 'rgba(228,244,252,0.94)',
                textShadow: '0 0 26px rgba(140,206,238,0.6)',
              }}
            >
              Emotional attachment trial: successful.
            </div>
          </div>
        </div>
        <Scanlines opacity={0.16} />
      </Cam>
    </Night>
  );
};

/* ------------------------------------------------------------------ */
/* 10-11 — she steps back                                              */
/* ------------------------------------------------------------------ */

const ShotStepBack: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s10;
  const back = smooth(clamp01(k / 60));
  return (
    <Night f={f} glow="radial-gradient(860px 900px at 62% 44%, rgba(90,170,204,0.32), rgba(2,5,10,0) 72)" vignette={0.86}>
      <Cam z={1.02 + back * 0.04} ox="62%" oy="44%">
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg,#070E14,#04070B)'}} />
        {/* the screen, light spilling past her */}
        <div
          style={{
            position: 'absolute',
            left: 560,
            top: 300,
            width: 620,
            height: 1080,
            background: 'linear-gradient(180deg, rgba(180,222,240,0.5), rgba(60,110,140,0.2))',
            filter: 'blur(4px)',
          }}
        />
        <div style={{position: 'absolute', left: 240 + back * 54, top: 260, width: 720, height: 1560}}>
          <AmaraBack rim={1.3} viewBox="20 60 260 640" preserve="xMidYMax meet" />
        </div>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(58% 52% at 56% 46%, transparent 36%, rgba(3,7,11,0.86) 100%)',
          }}
        />
      </Cam>
    </Night>
  );
};

const ShotBuilt: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s11;
  return (
    <Night f={f} glow="radial-gradient(900px 900px at 50% 40%, rgba(30,64,88,0.42), rgba(2,5,10,0) 74)" vignette={0.9}>
      <Cam z={1.02 + smooth(clamp01(k / 110)) * 0.05} ox="50%" oy="46%">
        <div style={{position: 'absolute', inset: 0, background: '#04070B'}} />
        {/* the memory on the archive screen, small now, in a big dark room */}
        <div
          style={{
            position: 'absolute',
            left: 150,
            top: 420,
            width: 780,
            height: 900,
            background: 'linear-gradient(160deg,#161F27,#060B10)',
            boxShadow: 'inset 0 0 0 2px rgba(150,186,212,0.12), 0 30px 80px rgba(0,0,0,0.9)',
            overflow: 'hidden',
          }}
        >
          <div style={{position: 'absolute', inset: 14, overflow: 'hidden', background: '#0A1418'}}>
            <div style={{position: 'absolute', inset: -20, filter: 'brightness(0.86) saturate(0.9)'}}>
              <LakeSet f={f} warm={0.8} />
            </div>
            <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(70% 62% at 50% 44%, transparent 40%, rgba(6,12,16,0.6) 100%)'}} />
            <Scanlines opacity={0.2} />
            <ScreenGlass strength={0.6} />
          </div>
        </div>
        {/* her, small, standing off to the side of it */}
        <div style={{position: 'absolute', left: 720, top: 1120, width: 460, height: 900}}>
          <AmaraBack rim={0.8} viewBox="30 40 260 620" preserve="xMidYMax meet" />
        </div>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(60% 54% at 50% 48%, transparent 30%, rgba(2,5,9,0.9) 100%)',
          }}
        />
      </Cam>
    </Night>
  );
};

/* ------------------------------------------------------------------ */
/* 12-14 — the phone call                                              */
/* ------------------------------------------------------------------ */

const ShotPhone: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s12;
  const buzz = Math.sin(k * 1.9) * 3;
  return (
    <Night f={f} glow="radial-gradient(720px 760px at 52% 54%, rgba(30,70,96,0.44), rgba(2,5,10,0) 70)" vignette={0.84}>
      <Cam z={1.05 + smooth(clamp01(k / 46)) * 0.05} ox="52%" oy="52%">
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(176deg,#090F16,#04070B 66%)'}} />
        <div style={{position: 'absolute', left: 0, right: 0, top: 1220, bottom: 0, background: 'linear-gradient(180deg, rgba(28,38,48,0.6), rgba(5,9,13,0.98))'}} />
        <PhoneSlab
          style={{left: 300, top: 620 + buzz, width: 480, height: 940, transform: 'rotate(-8deg)'}}
          glow={0.9}
        >
          <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(110% 80% at 50% 24%, #123248, #050C14 74%)'}} />
          {/* incoming call: pulsing rings, no words */}
          {[0, 1, 2].map((i) => {
            const p = ((k * 1.4 + i * 22) % 60) / 60;
            const s = 120 + p * 320;
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '36%',
                  width: s,
                  height: s,
                  marginLeft: -s / 2,
                  marginTop: -s / 2,
                  borderRadius: '50%',
                  border: '2px solid rgba(150,214,240,0.4)',
                  opacity: 1 - p,
                }}
              />
            );
          })}
          <div style={{position: 'absolute', left: '50%', top: '36%', width: 120, height: 120, marginLeft: -60, marginTop: -60, borderRadius: '50%', background: 'rgba(150,214,240,0.18)'}} />
          <Scanlines opacity={0.2} />
        </PhoneSlab>
        <div
          style={{
            position: 'absolute',
            left: 180,
            top: 1560,
            width: 720,
            height: 220,
            borderRadius: '50%',
            background: 'radial-gradient(closest-side, rgba(120,182,214,0.24), transparent 76%)',
            filter: 'blur(26px)',
            mixBlendMode: 'screen',
          }}
        />
      </Cam>
    </Night>
  );
};

const ShotNoahCall: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s13;
  const mouth = talk(f, C.s13 + 4, C.s14 - 6, 0.26, 3.3);
  return (
    <Night f={f} glow="radial-gradient(760px 800px at 52% 40%, rgba(30,70,98,0.44), rgba(2,5,10,0) 70)" vignette={0.8}>
      <Cam z={1.03 + smooth(clamp01(k / 58)) * 0.06} ox="52%" oy="38%">
        {/* inside the phone: a dark room, a face lit from below */}
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg,#0B141C,#05090E 70%)'}} />
        <div
          style={{
            position: 'absolute',
            left: -40,
            right: -40,
            top: 120,
            height: 900,
            background: 'radial-gradient(60% 80% at 50% 20%, rgba(120,190,222,0.2), transparent 72%)',
            filter: 'blur(30px)',
          }}
        />
        <div style={{position: 'absolute', left: 130, top: 190, width: 820, height: 1640}}>
          <Noah
            expression="unease"
            look="camera"
            mouth={mouth}
            rim={1.1}
            lidOverride={blinkLid(f, 1112)}
            viewBox="176 44 250 430"
            preserve="xMidYMid slice"
          />
        </div>
        <GlitchBars f={f} amount={0.1} seed={12} />
        <Scanlines opacity={0.24} />
        <ScreenGlass strength={0.5} />
      </Cam>
    </Night>
  );
};

const ShotHerLine: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s14;
  return (
    <Night f={f} glow="radial-gradient(760px 900px at 54% 36%, rgba(70,130,164,0.44), rgba(2,5,10,0) 72)" vignette={0.84}>
      <Cam z={1.03 + smooth(clamp01(k / 110)) * 0.06} ox="54%" oy="34%">
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(178deg,#0A121A,#04070B 72%)'}} />
        <div
          style={{
            position: 'absolute',
            left: 640,
            top: 940,
            width: 420,
            height: 520,
            borderRadius: 16,
            background: 'linear-gradient(160deg, rgba(140,200,230,0.3), rgba(20,50,70,0.1))',
            filter: 'blur(12px)',
          }}
        />
        <div style={{position: 'absolute', left: 130, top: 200, width: 800, height: 1600}}>
          <Amara
            expression="guarded"
            look="down"
            turn={-0.1}
            rim={1.15}
            screen={0.85}
            lidOverride={blinkLid(f, 1186)}
            viewBox="184 62 228 396"
            preserve="xMidYMid slice"
          />
        </div>
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: 520,
            background: 'linear-gradient(180deg, transparent, rgba(2,5,10,0.86))',
          }}
        />
      </Cam>
    </Night>
  );
};

/* ------------------------------------------------------------------ */
/* 15 — it starts again                                                */
/* ------------------------------------------------------------------ */

const ShotReplay: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s15;
  const fade = smooth(clamp01((f - FADE) / 16));
  const roll = smooth(clamp01(k / 18));
  return (
    <Night f={f} glow="radial-gradient(860px 800px at 50% 46%, rgba(40,80,104,0.4), rgba(2,5,10,0) 72)" vignette={0.84}>
      <Cam z={1.02 + smooth(clamp01(k / 50)) * 0.05} ox="50%" oy="46%">
        <div style={{position: 'absolute', inset: 0, background: '#04070B'}} />
        <div
          style={{
            position: 'absolute',
            left: 120,
            top: 460,
            width: 840,
            height: 1000,
            background: 'linear-gradient(160deg,#161F27,#060B10)',
            boxShadow: 'inset 0 0 0 2px rgba(150,186,212,0.12), 0 30px 80px rgba(0,0,0,0.9)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 14,
              right: 14,
              top: 14 + (1 - roll) * 60,
              bottom: 14,
              overflow: 'hidden',
              background: '#0A1418',
              opacity: 0.2 + roll * 0.8,
            }}
          >
            <LakeSet f={f} warm={0.9} />
            <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(70% 62% at 50% 44%, transparent 40%, rgba(6,12,16,0.55) 100%)'}} />
            <div style={{position: 'absolute', left: 0, right: 0, top: `${(f * 3) % 100}%`, height: 30, background: 'linear-gradient(180deg, transparent, rgba(220,244,255,0.12), transparent)'}} />
            <Scanlines opacity={0.22} />
            <ScreenGlass strength={0.6} />
          </div>
        </div>
        {fade > 0 ? <AbsoluteFill style={{background: '#000', opacity: fade}} /> : null}
      </Cam>
    </Night>
  );
};

/* ------------------------------------------------------------------ */

export const S02E04: React.FC = () => {
  const f = useCurrentFrame();
  const shot =
    f < C.s2 ? (
      <ShotOpen f={f} />
    ) : f < C.s3 ? (
      <ShotLake f={f} />
    ) : f < C.s4 ? (
      <ShotNoRain f={f} />
    ) : f < C.s5 ? (
      <ShotBelieve f={f} />
    ) : f < C.s6 ? (
      <ShotSkip f={f} />
    ) : f < C.s7 ? (
      <ShotSmile f={f} />
    ) : f < C.s8 ? (
      <ShotTurn f={f} />
    ) : f < C.s9 ? (
      <ShotCode f={f} />
    ) : f < C.s10 ? (
      <ShotVerdict f={f} />
    ) : f < C.s11 ? (
      <ShotStepBack f={f} />
    ) : f < C.s12 ? (
      <ShotBuilt f={f} />
    ) : f < C.s13 ? (
      <ShotPhone f={f} />
    ) : f < C.s14 ? (
      <ShotNoahCall f={f} />
    ) : f < C.s15 ? (
      <ShotHerLine f={f} />
    ) : (
      <ShotReplay f={f} />
    );

  return (
    <AbsoluteFill style={{background: '#02050A'}}>
      <Audio src={staticFile('audio/s02e04.mp3')} />
      <Grade lift={1.02} contrast={1.04}>{shot}</Grade>
      {/* black tail: the film ends in black, and it ends inside the audio */}
      <AbsoluteFill
        style={{background: '#000', opacity: smooth(clamp01((f - (C.total - 26)) / 13))}}
      />
      {f < C.total - 26 ? <Watermark /> : null}
    </AbsoluteFill>
  );
};
