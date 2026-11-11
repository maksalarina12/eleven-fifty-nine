import React from 'react';
import {AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Noah} from './character/Noah';
import {Amara, AmaraBack} from './character/Amara';
import {DrElias, DrEliasBack} from './character/DrElias';
import type {Expression, Look} from './character/Noah';
import type {AmaraExpression} from './character/Amara';
import {Cam, Grain, Vignette, Room, RainStreaks, blinkAt, NOAH_H, NOAH_W} from './Episode';
import {Hall} from './Part3';

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */

const FPS = 30;
const T = (s: number) => Math.round(s * FPS);
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const smooth = (v: number) => {
  const t = clamp01(v);
  return t * t * (3 - 2 * t);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const rnd = (i: number) => {
  const x = Math.sin(i * 127.1 + 3.7) * 43758.5453;
  return x - Math.floor(x);
};
const blink = (f: number, at: number, len = 7) => {
  const d = f - at;
  if (d < 0 || d > len) return 1;
  return 1 - Math.sin((d / len) * Math.PI) * 0.92;
};
const talk = (f: number, a: number, b: number, amp = 0.26, speed = 3.4) => {
  if (f < a || f > b) return 0;
  const env = Math.min(1, (f - a) / 2.4, (b - f) / 2.4);
  if (env <= 0) return 0;
  return env * amp * (0.4 + 0.6 * Math.abs(Math.sin((f - a) / speed)));
};
const flick = (f: number, seed = 0) =>
  0.93 + Math.sin(f / 7 + seed) * 0.04 + Math.sin(f / 23 + seed * 2) * 0.03;

const SANS = '"Helvetica Neue", Helvetica, Arial, sans-serif';
const MONO = 'ui-monospace, SFMono-Regular, Menlo, monospace';

/* exact audio landmarks (frames) */
const C = {
  city: 0,
  amaraWide: T(1.78),
  standing: T(5.7),
  falling: T(8.3),
  dying: T(10.88),
  numbers: T(13.14),
  n145: T(17.27),
  n146: T(19.34),
  n147: T(21.24),
  eliasEnter: T(22.66),
  eliasSpeak: T(26.87),
  eliasLine: T(28.35),
  amaraAnswer: T(30.2),
  amaraLine: T(32.9),
  file: T(35.47),
  subject: T(38.07),
  status: T(40.53),
  terminated: T(41.62),
  original: T(42.4),
  copy: T(46.47),
  apartment: T(53.65),
  phone: T(57.29),
  message: T(58.7),
  eliasFinal: T(61.52),
  whisper: T(64.01),
  whisper2: T(65.17),
  end: T(67.05),
  total: 2020,
};

/* ------------------------------------------------------------------ */
/* watermark + screen chrome                                           */
/* ------------------------------------------------------------------ */

const Watermark: React.FC = () => (
  <div
    style={{
      position: 'absolute',
      right: 32,
      top: 44,
      fontFamily: SANS,
      fontSize: 17,
      letterSpacing: '0.34em',
      color: 'rgba(210,226,238,0.34)',
      textShadow: '0 1px 8px rgba(0,0,0,0.8)',
      zIndex: 40,
    }}
  >
    EldraMyth
  </div>
);

const Scanlines: React.FC<{opacity?: number}> = ({opacity = 0.34}) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      background:
        'repeating-linear-gradient(0deg, rgba(0,0,0,0.55) 0 1px, transparent 1px 4px)',
      opacity,
      mixBlendMode: 'multiply',
      pointerEvents: 'none',
    }}
  />
);

const FeedChrome: React.FC<{
  numeral?: string;
  f: number;
  small?: boolean;
}> = ({numeral, f, small}) => (
  <>
    {numeral ? (
      <div
        style={{
          position: 'absolute',
          right: small ? 8 : 30,
          bottom: small ? 4 : 16,
          fontFamily: SANS,
          fontWeight: 200,
          fontSize: small ? 30 : 96,
          letterSpacing: '0.04em',
          color: 'rgba(226,240,248,0.9)',
          textShadow: '0 0 24px rgba(120,180,220,0.45)',
          lineHeight: 1,
        }}
      >
        {numeral}
      </div>
    ) : null}
    <Scanlines opacity={small ? 0.3 : 0.4} />
  </>
);

/* ------------------------------------------------------------------ */
/* the archived hallway feed                                           */
/* ------------------------------------------------------------------ */

const CCTVScene: React.FC<{
  f: number;
  mode?: 'stand' | 'fall' | 'dead';
  fall?: number;
  z?: number;
  dim?: number;
  numeral?: string;
  time?: string;
  grain?: number;
  chrome?: boolean;
  lid?: number;
}> = ({f, mode = 'stand', fall, z = 1.2, dim = 0, numeral, time, grain = 0.08, chrome = true, lid}) => {
  const fl = fall ?? (mode === 'stand' ? 0 : mode === 'dead' ? 1 : 0.5);
  return (
    <AbsoluteFill style={{background: '#03070A', overflow: 'hidden'}}>
      {fl >= 0.98 ? (
        <div style={{position: 'absolute', inset: 0, transform: 'scale(1.3)', transformOrigin: '50% 100%', filter: `brightness(${0.94 - dim * 0.34}) saturate(0.94)`}}>
          <Hall f={f} dim={0.18 + dim * 0.3} />
          <BodyOnFloor f={f} />
        </div>
      ) : (
        <div style={{position: 'absolute', inset: 0, filter: `brightness(${0.94 - dim * 0.34}) saturate(0.94)`}}>
          <Hall
            f={f}
            z={z}
            ox="50%"
            oy="58%"
            figure={{x: 186, h: 1010, feetY: 1452, fall: fl, look: 'down', expression: 'neutral'}}
          />
        </div>
      )}
      {/* extra security-camera degradation */}
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(18,44,58,0.16), transparent 30%, transparent 74%, rgba(0,0,0,0.32))'}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 62% 58% at 50% 46%, transparent 46%, rgba(0,0,0,0.6) 100%)'}} />
      {chrome ? <FeedChrome f={f} numeral={numeral} /> : null}
      {grain > 0 ? <Grain f={f} opacity={grain} /> : null}
      {lid && lid > 0.05 ? (
        <AbsoluteFill style={{background: `linear-gradient(180deg, rgba(0,0,0,${lid * 0.5}), transparent 22%)`}} />
      ) : null}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* the surveillance room                                               */
/* ------------------------------------------------------------------ */

const CCTVMini: React.FC<{
  f: number;
  numeral?: string;
  mode?: 'stand' | 'fall' | 'dead';
  fall?: number;
  z?: number;
  dim?: number;
}> = ({f, numeral, mode = 'stand', fall, z = 1.2, dim = 0}) => {
  const dead = mode === 'dead' || (fall ?? 0) >= 0.98;
  const s = 0.38;
  const cx = dead ? 540 : 450;
  const cy = dead ? 1620 : mode === 'fall' ? 1080 : 900;
  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden', background: '#03070A'}}>
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: 1080,
          height: 1920,
          transform: `translate(${-cx * s}px, ${-cy * s}px) scale(${s})`,
          transformOrigin: '0 0',
          filter: 'brightness(1.28) contrast(1.08)',
        }}
      >
        <CCTVScene f={f} mode={mode} fall={fall} z={z} dim={dim} numeral={undefined} grain={0} chrome={false} />
      </div>
      <Scanlines opacity={0.3} />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(closest-side at 50% 50%, transparent 56%, rgba(0,0,0,0.55) 100%)',
        }}
      />
    </div>
  );
};

/* Cold, textless instrument feeds: waveform, city map, radar. */
const AmbientFeed: React.FC<{f: number; kind: number}> = ({f, kind}) => {
  const flick = 0.92 + Math.sin(f / 7 + kind) * 0.05 + Math.sin(f / 23 + kind * 2) * 0.03;
  return (
    <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg,#081018,#05090E)', overflow: 'hidden', opacity: flick}}>
      {kind === 0 ? (
        <>
          <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(60% 50% at 30% 40%, rgba(60,110,146,0.3), transparent 74%)'}} />
          <div style={{position: 'absolute', left: '10%', right: '10%', top: '46%', height: '18%', display: 'flex', alignItems: 'center', gap: 3}}>
            {Array.from({length: 40}).map((_, i) => {
              const hh = 6 + Math.abs(Math.sin(f / 5 + i * 0.5)) * 46;
              return <div key={i} style={{flex: 1, height: hh, background: 'rgba(140,200,230,0.5)', borderRadius: 2}} />;
            })}
          </div>
          <div style={{position: 'absolute', left: '10%', top: '36%', width: '30%', height: 1, background: 'rgba(150,196,224,0.22)'}} />
        </>
      ) : null}
      {kind === 1 ? (
        <>
          <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg,#07101A,#04080D)'}} />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} style={{position: 'absolute', left: `${8 + (i % 3) * 30}%`, top: `${18 + Math.floor(i / 3) * 34}%`, width: `${14 + (i % 2) * 8}%`, height: `${7 + (i % 3) * 3}%`, background: 'rgba(10,18,26,0.9)', border: '1px solid rgba(120,164,192,0.16)'}} />
          ))}
          <div style={{position: 'absolute', left: '24%', top: '46%', width: '44%', height: '34%', border: '1px solid rgba(120,180,214,0.3)'}} />
          <div style={{position: 'absolute', left: '40%', top: '56%', width: 5, height: 5, borderRadius: '50%', background: 'rgba(210,236,248,0.7)'}} />
          <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: '100%', background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.25) 0 1px, transparent 1px 4px)', opacity: 0.5}} />
        </>
      ) : null}
      {kind === 2 ? (
        <>
          <svg viewBox="0 0 200 130" style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}}>
            {[26, 40, 54].map((r, i) => (
              <ellipse key={r} cx={100} cy={66} rx={r} ry={r * 0.62} fill="none" stroke={`rgba(120,185,220,${0.34 - i * 0.08})`} strokeWidth={1.2} strokeDasharray="4 5" />
            ))}
            <circle cx={100} cy={66} r={4} fill="rgba(160,215,240,0.8)" />
            <path d={`M 100 66 L ${128 + Math.sin(f / 22) * 26} ${46 + Math.cos(f / 30) * 12}`} stroke="rgba(220,170,130,0.55)" strokeWidth={1.2} />
            <circle cx={100 + Math.sin(f / 17) * 30} cy={66 + Math.cos(f / 21) * 18} r={2.6} fill="rgba(160,215,240,0.8)" />
          </svg>
          <div style={{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.22) 0 1px, transparent 1px 4px)', opacity: 0.5}} />
        </>
      ) : null}
    </div>
  );
};

const MonitorWall: React.FC<{f: number; bright?: number; numerals?: boolean}> = ({f, bright = 1, numerals}) => {
  const cells: Array<{cctv?: 'stand' | 'fall' | 'dead'; fall?: number; z?: number; kind?: number}> = [
    {cctv: 'stand', z: 1.24},
    {cctv: 'stand', z: 1.34},
    {cctv: 'dead', fall: 1, z: 1.3},
    {kind: 1},
    {kind: 0},
    {kind: 2},
  ];
  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: 30,
          top: 196,
          width: 1020,
          height: 812,
          background: 'radial-gradient(closest-side, rgba(88,152,196,0.3), transparent 78%)',
          filter: 'blur(34px)',
          opacity: bright,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 52,
          top: 182,
          width: 976,
          height: 792,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gridTemplateRows: '1fr 1fr',
          gap: 16,
          filter: `brightness(${1.18 * bright}) saturate(0.98)`,
        }}
      >
        {cells.map((c, k) => (
          <div
            key={k}
            style={{
              position: 'relative',
              borderRadius: 6,
              overflow: 'hidden',
              background: '#05090E',
              border: '6px solid #090D12',
              boxShadow: '0 0 0 1px rgba(120,160,190,0.1), 0 12px 30px rgba(0,0,0,0.7)',
            }}
          >
            {c.cctv ? (
              <CCTVMini f={f + k * 37} mode={c.cctv} fall={c.fall} z={c.z} />
            ) : (
              <AmbientFeed f={f + k * 23} kind={c.kind ?? 0} />
            )}
          </div>
        ))}
      </div>
      {/* monitor bezel top strip */}
      <div
        style={{
          position: 'absolute',
          left: 52,
          top: 158,
          width: 976,
          height: 14,
          borderRadius: 4,
          background: 'linear-gradient(180deg,#131A21,#080C11)',
          boxShadow: '0 1px 0 rgba(150,195,225,0.08)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 52,
          top: 168,
          width: 976,
          height: 2,
          background: 'rgba(150,195,225,0.16)',
          filter: 'blur(1px)',
        }}
      />
    </>
  );
};

/* the desk the room is built around */
const Desk: React.FC<{f: number; glow?: number}> = ({f, glow = 1}) => (
  <>
    <div style={{position: 'absolute', left: 0, top: 1206, width: 1080, height: 714, background: 'linear-gradient(180deg,#0C131A 0%,#070C12 32%,#030507 100%)'}} />
    <div style={{position: 'absolute', left: 0, top: 1192, width: 1080, height: 16, background: 'linear-gradient(180deg,#16202A,#080D13)'}} />
    <div style={{position: 'absolute', left: 0, top: 1191, width: 1080, height: 3, background: 'rgba(160,205,235,0.32)'}} />
    <div style={{position: 'absolute', left: 80, top: 1216, width: 920, height: 200, background: `linear-gradient(180deg, rgba(110,175,215,${0.14 * glow}), transparent 82%)`, filter: 'blur(18px)'}} />
    <div style={{position: 'absolute', left: 70, top: 900, width: 940, height: 320, background: `radial-gradient(ellipse at 50% 0%, rgba(90,150,190,${0.2 * glow}), transparent 70%)`, filter: 'blur(26px)'}} />
    {/* keyboard */}
    <div style={{position: 'absolute', left: 110, top: 1268, width: 380, height: 74, borderRadius: 5, background: 'linear-gradient(180deg,rgba(17,23,30,0.95),rgba(7,10,14,0.98))', border: '1px solid rgba(120,165,195,0.08)'}}>
      <div style={{position: 'absolute', left: 12, right: 12, top: 12, height: 42, background: 'repeating-linear-gradient(90deg, rgba(150,190,215,0.06) 0 24px, transparent 24px 30px), repeating-linear-gradient(0deg, rgba(150,190,215,0.05) 0 11px, transparent 11px 19px)', borderRadius: 3}} />
    </div>
    {/* mouse */}
    <div style={{position: 'absolute', left: 560, top: 1258, width: 46, height: 66, borderRadius: '20px 20px 14px 14px', background: 'linear-gradient(180deg,#111821,#080C11)', border: '1px solid rgba(120,165,195,0.1)', transform: 'rotate(-5deg)'}} />
    {/* mug */}
    <div style={{position: 'absolute', left: 760, top: 1212, width: 78, height: 92, borderRadius: '6px 6px 10px 10px', background: 'linear-gradient(180deg,#131A22,#080C11)', border: '1px solid rgba(120,165,195,0.1)'}}>
      <div style={{position: 'absolute', left: 14, top: 22, width: 50, height: 34, borderRadius: '50%', background: 'rgba(120,170,205,0.08)'}} />
    </div>
    {/* lamp, warm practical */}
    <div style={{position: 'absolute', left: 286, top: 1010, width: 6, height: 200, background: '#0B0F14'}} />
    <div style={{position: 'absolute', left: 252, top: 986, width: 74, height: 30, borderRadius: '50% 50% 20% 20%', background: 'linear-gradient(180deg,#1A1712,#0A0907)'}} />
    <div style={{position: 'absolute', left: 254, top: 1012, width: 70, height: 26, borderRadius: '50%', background: 'rgba(240,178,116,0.58)', filter: 'blur(3px)'}} />
    <div style={{position: 'absolute', left: 168, top: 1030, width: 240, height: 300, background: 'radial-gradient(closest-side, rgba(238,176,116,0.14), transparent 72%)', filter: 'blur(16px)'}} />
    {/* cables */}
    <path d="M 520 1300 Q 640 1360 780 1320" stroke="rgba(120,160,190,0.1)" strokeWidth={3} fill="none" />
    <path d="M 900 1100 Q 920 1180 860 1230" stroke="rgba(120,160,190,0.08)" strokeWidth={2} fill="none" />
  </>
);

/* ------------------------------------------------------------------ */
/* scene 01 — across the city                                          */
/* ------------------------------------------------------------------ */

const CityShot: React.FC<{f: number}> = ({f}) => {
  const push = smooth(f / 54);
  const buildings = (layer: number, count: number, base: number, spread: number) =>
    Array.from({length: count}).map((_, i) => {
      const w = 90 + rnd(i * 3 + layer * 11) * 120;
      const h = base + rnd(i * 7 + layer * 5) * spread;
      const x = (i * 1080) / count - 40 + rnd(i + layer) * 30;
      return {x, w, h, i};
    });

  return (
    <AbsoluteFill style={{background: '#03060B', overflow: 'hidden'}}>
      <AbsoluteFill style={{background: 'linear-gradient(180deg,#0A1522 0%,#060C14 42%,#03060A 100%)'}} />
      {/* moon haze */}
      <div style={{position: 'absolute', left: 560, top: 180, width: 520, height: 520, background: 'radial-gradient(closest-side, rgba(120,166,204,0.16), transparent 72%)', filter: 'blur(30px)'}} />
      <Cam z={1 + push * 0.08} ox="62%" oy="54%">
        {/* far skyline */}
        {buildings(0, 9, 300, 260).map((b) => (
          <div key={`a${b.i}`} style={{position: 'absolute', left: b.x, top: 1000 - b.h, width: b.w, height: b.h + 400, background: 'linear-gradient(180deg,#081019,#050A10)'}}>
            {Array.from({length: Math.floor(b.h / 60)}).map((_, r) =>
              Array.from({length: Math.floor(b.w / 40)}).map((_, c2) =>
                rnd(r * 9 + c2 * 3 + b.i) > 0.72 ? (
                  <div key={`${r}-${c2}`} style={{position: 'absolute', left: 10 + c2 * 40, top: 16 + r * 60, width: 8, height: 12, background: `rgba(180,206,224,${0.05 + rnd(r + c2) * 0.1})`}} />
                ) : null,
              ),
            )}
          </div>
        ))}
        {/* mid skyline */}
        {buildings(1, 7, 380, 340).map((b) => (
          <div key={`b${b.i}`} style={{position: 'absolute', left: b.x, top: 1180 - b.h, width: b.w, height: b.h + 500, background: 'linear-gradient(180deg,#060C13,#03070B)'}}>
            {Array.from({length: Math.floor(b.h / 54)}).map((_, r) =>
              Array.from({length: Math.floor(b.w / 34)}).map((_, c2) => {
                const lit = rnd(r * 13 + c2 * 7 + b.i * 3) > 0.62;
                return lit ? (
                  <div key={`${r}-${c2}`} style={{position: 'absolute', left: 10 + c2 * 34, top: 14 + r * 54, width: 10, height: 16, background: rnd(r + c2 * 2) > 0.8 ? 'rgba(232,186,132,0.42)' : 'rgba(150,190,216,0.24)'}} />
                ) : null;
              }),
            )}
          </div>
        ))}
        {/* near buildings, framing the target */}
        <div style={{position: 'absolute', left: -40, top: 620, width: 300, height: 1300, background: '#020406'}} />
        <div style={{position: 'absolute', left: 880, top: 540, width: 260, height: 1400, background: '#020406'}} />
        {/* the building with the room */}
        <div style={{position: 'absolute', left: 560, top: 560, width: 330, height: 1360, background: 'linear-gradient(180deg,#0A121A,#04080D)'}}>
          <div style={{position: 'absolute', inset: 0, border: '1px solid rgba(130,170,200,0.1)'}} />
          {Array.from({length: 11}).map((_, r) =>
            Array.from({length: 5}).map((_, c2) => {
              const isRoom = r === 5 && c2 === 2;
              return (
                <div
                  key={`${r}-${c2}`}
                  style={{
                    position: 'absolute',
                    left: 22 + c2 * 60,
                    top: 30 + r * 116,
                    width: 34,
                    height: 46,
                    background: isRoom
                      ? `rgba(150,200,228,${0.34 + Math.sin(f / 9) * 0.06})`
                      : rnd(r * 5 + c2 * 11) > 0.68
                        ? 'rgba(160,196,220,0.12)'
                        : 'rgba(10,16,22,0.9)',
                    boxShadow: isRoom ? '0 0 26px rgba(140,195,230,0.5)' : 'none',
                  }}
                />
              );
            }),
          )}
        </div>
        {/* rooftop details */}
        <div style={{position: 'absolute', left: 590, top: 520, width: 6, height: 60, background: '#050A0F'}} />
        <div style={{position: 'absolute', left: 840, top: 500, width: 4, height: 80, background: '#050A0F'}} />
      </Cam>
      <RainStreaks f={f} speed={17} opacity={0.34} blur={1.2} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(6,14,22,0.5) 0%, transparent 30%, transparent 70%, rgba(2,4,7,0.7) 100%)'}} />
      <AbsoluteFill style={{background: 'radial-gradient(900px 900px at 62% 52%, transparent 40%, rgba(0,0,0,0.5) 100%)'}} />
      <Grain f={f} opacity={0.1} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* scene 02 — Amara watches Noah                                       */
/* ------------------------------------------------------------------ */

const blinkLid = (f: number, at: number, len = 9) => {
  const d = f - at;
  if (d < 0 || d > len) return 0;
  return Math.sin((d / len) * Math.PI) * 0.94;
};

const SeatedAmara: React.FC<{
  f: number;
  rim?: number;
  lean?: number;
  dim?: number;
  width?: number;
  top?: number;
  shift?: number;
}> = ({f, rim = 1, lean = 0, dim = 0, width = 500, top = 650, shift = 0}) => {
  const height = width * (700 / 300);
  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top,
        width,
        height,
        marginLeft: -width / 2 + shift,
        transform: `rotate(${lean}deg)`,
        transformOrigin: '50% 100%',
        filter: `brightness(${1 - dim * 0.55})`,
      }}
    >
      <AmaraBack rim={rim} />
    </div>
  );
};

const AmaraWide: React.FC<{f: number}> = ({f}) => {
  const p = smooth((f - C.amaraWide) / 150);
  const z = 1.02 + p * 0.07;
  return (
    <AbsoluteFill style={{background: '#03050A', overflow: 'hidden'}}>
      <AbsoluteFill style={{background: 'radial-gradient(900px 760px at 52% 28%, rgba(40,84,116,0.36), transparent 72%), linear-gradient(180deg,#04070C,#020407)'}} />
      <Cam z={z} ox="50%" oy="43%" x={-12 + p * 26}>
        <MonitorWall f={f} bright={1.02} />
        <Desk f={f} glow={1} />
        {/* Amara, back three-quarter, cropped by the right edge */}
        <div style={{position: 'absolute', right: 20, bottom: -200, width: 600, height: 1320, filter: 'brightness(0.84) saturate(1.05)'}}>
          <AmaraBack rim={1.55} />
        </div>
        {/* monitor spill on her shoulder */}
        <div style={{position: 'absolute', right: 36, bottom: 320, width: 330, height: 760, background: 'linear-gradient(90deg, rgba(110,180,215,0.18), transparent 70%)', filter: 'blur(18px)', mixBlendMode: 'screen'}} />
      </Cam>
      {/* foreground desk edge */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 1710, height: 260, background: 'linear-gradient(180deg, rgba(3,5,8,0), rgba(2,4,6,0.92) 46%, #010203 100%)'}} />
      <AbsoluteFill style={{background: 'radial-gradient(1200px 1100px at 50% 40%, transparent 42%, rgba(0,0,0,0.6) 100%)'}} />
      <Grain f={f} opacity={0.08} />
    </AbsoluteFill>
  );
};

/* A feed seen on a physical monitor: bezel + glass reflection. */
const MonitorFrame: React.FC<{children: React.ReactNode; inset?: number}> = ({children, inset = 16}) => (
  <AbsoluteFill style={{background: '#04070A', overflow: 'hidden'}}>
    <div style={{position: 'absolute', left: inset, top: inset, right: inset, bottom: inset, overflow: 'hidden'}}>
      {children}
    </div>
    <AbsoluteFill
      style={{
        boxShadow: `inset 0 0 0 ${inset}px #05080C, inset 0 0 90px rgba(0,0,0,0.72)`,
        pointerEvents: 'none',
      }}
    />
    <AbsoluteFill
      style={{
        background:
          'linear-gradient(116deg, rgba(196,224,240,0.09) 0%, rgba(196,224,240,0.02) 18%, transparent 36%, transparent 76%, rgba(160,198,220,0.05) 100%)',
        pointerEvents: 'none',
      }}
    />
  </AbsoluteFill>
);

const StandingShot: React.FC<{f: number}> = ({f}) => {
  const z = 1.02 + smooth((f - C.standing) / 80) * 0.05;
  const lid = blinkLid(f, C.standing + 26) + blinkLid(f, C.standing + 62) * 0.65;
  return (
    <MonitorFrame>
      <div style={{position: 'absolute', inset: 0, transform: `scale(${z})`, transformOrigin: '50% 62%'}}>
        <CCTVScene f={f} mode="stand" lid={lid} grain={0.07} numeral={undefined} />
      </div>
    </MonitorFrame>
  );
};

const FallingShot: React.FC<{f: number}> = ({f}) => {
  const p = smooth((f - (C.falling + 12)) / 30);
  const fall = Math.min(0.86, p * 0.92);
  const z = 1.02 + smooth((f - C.falling) / 78) * 0.05;
  return (
    <MonitorFrame>
      <div style={{position: 'absolute', inset: 0, transform: `scale(${z})`, transformOrigin: '42% 64%'}}>
        <CCTVScene f={f} fall={fall} z={1.12} grain={0.08} />
      </div>
      {/* compression smear at the moment of impact */}
      <AbsoluteFill
        style={{
          background: 'linear-gradient(180deg, rgba(120,170,200,0.08), transparent 40%)',
          opacity: Math.max(0, 0.5 - Math.abs(f - (C.falling + 44)) / 22),
        }}
      />
    </MonitorFrame>
  );
};

/* A body face-down on the floor: head left, feet right. */
const LyingBody: React.FC<{f: number}> = ({f}) => {
  const pulse = Math.sin(f / 40) * 0.004;
  return (
    <svg
      viewBox="0 0 760 320"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      style={{filter: `saturate(0.82) contrast(1.05) brightness(${1 + pulse})`}}
    >
      <defs>
        <linearGradient id="lbBack" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#333C47" />
          <stop offset="38%" stopColor="#1E252E" />
          <stop offset="100%" stopColor="#0B0F14" />
        </linearGradient>
        <linearGradient id="lbLeg" x1="0.2" y1="0" x2="0.7" y2="1">
          <stop offset="0%" stopColor="#2C343E" />
          <stop offset="45%" stopColor="#1A2129" />
          <stop offset="100%" stopColor="#080C10" />
        </linearGradient>
        <linearGradient id="lbHair" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#252C34" />
          <stop offset="50%" stopColor="#0E1217" />
          <stop offset="100%" stopColor="#05070A" />
        </linearGradient>
        <linearGradient id="lbSkin" x1="0.2" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor="#7A5646" />
          <stop offset="100%" stopColor="#2E1F18" />
        </linearGradient>
        <filter id="lbSh" x="-40%" y="-300%" width="180%" height="700%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
        <filter id="lbGlow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      {/* contact shadow */}
      <ellipse cx="400" cy="248" rx="286" ry="46" fill="rgba(0,0,0,0.68)" filter="url(#lbSh)" />

      {/* left leg, straight */}
      <path d="M 430 134 C 478 126 528 120 574 118 C 612 116 646 116 668 118 L 672 150 C 646 148 610 148 572 152 L 434 166 Z" fill="url(#lbLeg)" />
      {/* right leg, knee bent outward */}
      <path d="M 432 190 C 470 196 512 214 552 232 C 588 248 618 254 646 252 L 638 284 C 604 286 570 278 534 258 L 434 228 Z" fill="url(#lbLeg)" />
      {/* creases at the knees */}
      <path d="M 570 120 C 574 134 574 144 570 152" stroke="#0A0E12" strokeWidth="2.2" fill="none" opacity="0.75" />
      <path d="M 556 236 C 562 248 562 258 556 258" stroke="#090C11" strokeWidth="2" fill="none" opacity="0.7" />
      <path d="M 470 128 C 486 144 492 156 490 166" stroke="#3A434E" strokeWidth="1.5" fill="none" opacity="0.45" />
      <path d="M 480 202 C 498 218 508 228 506 234" stroke="#333B45" strokeWidth="1.5" fill="none" opacity="0.4" />
      {/* cuffs */}
      <path d="M 656 116 C 662 128 664 140 660 150" stroke="#05080C" strokeWidth="4" fill="none" opacity="0.8" />
      <path d="M 640 250 C 646 264 648 276 644 284" stroke="#05080C" strokeWidth="4" fill="none" opacity="0.8" />

      {/* shoes, angled out */}
      <g transform="rotate(6 690 134)">
        <path d="M 664 112 C 686 106 714 108 728 118 C 740 128 736 148 720 152 C 700 156 674 150 664 142 Z" fill="#1A2029" />
        <path d="M 668 122 C 686 114 710 114 724 122" stroke="rgba(176,212,236,0.3)" strokeWidth="1.8" fill="none" />
        <path d="M 670 138 C 688 146 710 146 726 140" stroke="rgba(166,200,224,0.26)" strokeWidth="1.6" fill="none" />
        <path d="M 676 116 C 694 112 712 114 724 120" stroke="rgba(166,200,224,0.18)" strokeWidth="1.4" fill="none" />
      </g>
      <g transform="rotate(-12 686 268)">
        <path d="M 660 246 C 682 240 712 244 726 254 C 738 264 732 284 716 288 C 696 292 670 284 660 276 Z" fill="#171D25" />
        <path d="M 664 256 C 682 248 708 250 722 258" stroke="rgba(176,212,236,0.26)" strokeWidth="1.8" fill="none" />
        <path d="M 666 272 C 684 280 706 280 722 274" stroke="rgba(158,192,216,0.22)" strokeWidth="1.6" fill="none" />
      </g>

      {/* hips / waistband */}
      <path d="M 420 138 C 442 146 452 164 452 184 C 452 202 442 216 420 224 L 414 196 Z" fill="#10151B" />

      {/* back of the overshirt */}
      <path
        d="M 194 132 C 218 110 246 100 276 98 C 320 96 372 104 404 116 C 426 124 436 140 438 160 L 440 196 C 440 214 428 224 408 226 L 232 232 C 210 232 198 220 196 202 L 188 164 C 186 150 188 140 194 132 Z"
        fill="url(#lbBack)"
      />
      {/* shirt hem, spread over the hips */}
      <path d="M 396 120 C 420 130 434 150 436 176 L 442 218 C 420 230 396 230 380 222 L 372 132 Z" fill="#151A21" opacity="0.9" />
      {/* collar, open at the neck */}
      <path d="M 196 134 C 210 152 232 162 254 162 L 246 184 C 222 182 202 168 190 150 Z" fill="#252C35" />
      {/* spine crease + folds */}
      <path d="M 250 106 C 268 142 272 186 264 228" stroke="#0A0E13" strokeWidth="2.4" fill="none" opacity="0.55" />
      <path d="M 300 102 C 318 140 322 184 316 230" stroke="#39424D" strokeWidth="1.6" fill="none" opacity="0.4" />
      <path d="M 356 106 C 374 144 378 186 372 226" stroke="#0E1319" strokeWidth="2.6" fill="none" opacity="0.5" />
      <path d="M 224 118 C 238 152 240 190 234 224" stroke="#2F3742" strokeWidth="1.4" fill="none" opacity="0.4" />
      {/* shoulder blades */}
      <path d="M 246 124 C 262 132 274 144 278 158" stroke="#3B4551" strokeWidth="1.6" fill="none" opacity="0.4" />
      <path d="M 330 126 C 348 134 360 148 364 162" stroke="#333D48" strokeWidth="1.5" fill="none" opacity="0.35" />

      {/* far arm, trapped under the body: only the elbow breaks the shoulder line */}
      <path d="M 214 118 C 202 134 200 156 206 174 L 224 170 C 218 152 220 134 230 120 Z" fill="#101620" opacity="0.9" />
      <path d="M 208 128 C 204 142 204 158 208 170" stroke="rgba(160,202,230,0.18)" strokeWidth="1.4" fill="none" />

      {/* near arm, along the body, hand by the hip */}
      <path d="M 208 208 C 244 224 288 236 330 240 C 352 242 366 250 366 258 C 366 268 352 272 334 268 C 288 258 240 246 202 232 Z" fill="#0F141B" />
      <path d="M 216 216 C 252 230 292 240 328 244" stroke="#333C46" strokeWidth="1.4" fill="none" opacity="0.42" />
      {/* hand, fingers curled on the floor */}
      <path d="M 348 250 C 360 242 380 242 390 250 C 400 258 398 272 386 276 C 372 280 354 274 346 266 Z" fill="#3B2A21" />
      <path d="M 352 256 C 362 252 374 252 384 256" stroke="#6E5040" strokeWidth="1.2" fill="none" opacity="0.55" />
      <path d="M 351 263 C 361 259 373 259 383 263" stroke="#33231B" strokeWidth="1.1" fill="none" opacity="0.6" />
      <path d="M 351 270 C 361 266 373 266 383 270" stroke="#33231B" strokeWidth="1.1" fill="none" opacity="0.55" />
      <path d="M 356 248 C 368 244 380 246 388 252" stroke="rgba(160,202,230,0.24)" strokeWidth="1.3" fill="none" />

      {/* neck + head, face turned to the floor */}
      <path d="M 168 152 C 182 158 188 170 186 182 C 184 194 176 200 166 196 Z" fill="#241A15" />
      <ellipse cx="128" cy="160" rx="46" ry="50" fill="url(#lbHair)" />
      {/* hair clumps */}
      <path d="M 84 158 C 80 130 96 106 122 100 C 108 118 100 138 102 160 Z" fill="#0C1015" />
      <path d="M 104 104 C 122 88 152 86 172 98 C 148 98 128 110 116 126 Z" fill="#0D1116" />
      <path d="M 168 100 C 190 108 202 128 200 150 C 188 130 178 114 164 106 Z" fill="#0B0F14" />
      <path d="M 90 188 C 84 208 92 226 108 232 C 100 214 102 198 110 184 Z" fill="#0A0E13" />
      <path d="M 160 190 C 168 206 168 222 158 234 C 156 218 152 204 146 192 Z" fill="#080B0F" />
      <path d="M 118 108 C 110 130 106 152 108 174" stroke="#2F3742" strokeWidth="1.8" fill="none" opacity="0.55" />
      <path d="M 146 104 C 140 128 138 152 140 174" stroke="#2A323C" strokeWidth="1.6" fill="none" opacity="0.5" />
      <path d="M 170 114 C 178 132 182 152 178 170" stroke="#232A33" strokeWidth="1.4" fill="none" opacity="0.45" />
      {/* the ear, just catching the edge of the light */}
      <path d="M 158 176 C 168 174 174 182 172 192 C 170 202 162 208 154 204" fill="#3D2A21" opacity="0.85" />
      <path d="M 160 182 C 166 182 168 188 165 194" stroke="#6A4A3A" strokeWidth="1.1" fill="none" opacity="0.5" />
      <path d="M 152 172 C 164 170 174 178 174 190" stroke="rgba(160,202,230,0.2)" strokeWidth="1.4" fill="none" />

      {/* cool rim from the ceiling tube */}
      <path d="M 200 134 C 224 112 248 102 276 100" stroke="rgba(170,212,238,0.5)" strokeWidth="2.2" fill="none" />
      <path d="M 330 100 C 372 104 404 114 428 130" stroke="rgba(160,202,230,0.4)" strokeWidth="2" fill="none" />
      <path d="M 208 208 C 244 224 288 236 330 240" stroke="rgba(160,202,230,0.3)" strokeWidth="1.8" fill="none" />
      <path d="M 434 132 C 476 126 526 120 570 118" stroke="rgba(160,202,230,0.34)" strokeWidth="1.8" fill="none" />
      <path d="M 438 192 C 476 200 512 216 550 232" stroke="rgba(160,202,230,0.26)" strokeWidth="1.8" fill="none" />
      <path d="M 96 136 C 88 154 88 176 96 192" stroke="rgba(160,202,230,0.28)" strokeWidth="1.8" fill="none" />
      <path d="M 104 106 C 122 90 150 88 170 98" stroke="rgba(160,202,230,0.22)" strokeWidth="1.6" fill="none" />

      {/* faint pooled light on the shirt */}
      <ellipse cx="320" cy="170" rx="120" ry="70" fill="rgba(150,196,226,0.1)" filter="url(#lbGlow)" style={{mixBlendMode: 'screen'}} />
      <ellipse cx="540" cy="180" rx="90" ry="60" fill="rgba(150,196,226,0.06)" filter="url(#lbGlow)" style={{mixBlendMode: 'screen'}} />
    </svg>
  );
};

/* The body laid on the corridor floor, under the ceiling tube. */
const BodyOnFloor: React.FC<{f: number}> = ({f}) => (
  <>
    {/* the pool of light the ceiling tube throws on the floor */}
    <div
      style={{
        position: 'absolute',
        left: 130,
        top: 1500,
        width: 820,
        height: 460,
        background: 'radial-gradient(closest-side at 50% 42%, rgba(150,198,228,0.26), transparent 74%)',
        mixBlendMode: 'screen',
        filter: 'blur(22px)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        left: 230,
        top: 1596,
        width: 620,
        height: 300,
        transform: 'perspective(1500px) rotateX(52deg) rotate(-2deg)',
        transformOrigin: '50% 0%',
        filter: 'brightness(1.14) saturate(0.9)',
      }}
    >
      <LyingBody f={f} />
    </div>
  </>
);

const DyingShot: React.FC<{f: number}> = ({f}) => {
  const z = 1.01 + smooth((f - C.dying) / 70) * 0.04;
  const fl = 0.95 + Math.sin(f / 5.3) * 0.03;
  return (
    <MonitorFrame>
      <div style={{position: 'absolute', inset: 0, transform: `scale(${z})`, transformOrigin: '50% 66%', filter: `brightness(${fl})`}}>
        <AbsoluteFill style={{background: '#04070A'}}>
          <div style={{position: 'absolute', inset: 0, transform: 'scale(1.3)', transformOrigin: '50% 100%'}}>
            <Hall f={f} dim={0.22} />
            <BodyOnFloor f={f} />
          </div>
        </AbsoluteFill>
      </div>
      <AbsoluteFill style={{background: 'radial-gradient(1200px 1100px at 50% 62%, transparent 34%, rgba(0,0,0,0.72) 100%)'}} />
    </MonitorFrame>
  );
};

/* ------------------------------------------------------------------ */
/* scene 06 — the loop numbers                                         */
/* ------------------------------------------------------------------ */

const NUMERALS: Array<{num: string; mode: 'stand' | 'fall' | 'dead'; fall?: number; time: string; z: number}> = [
  {num: '145', mode: 'stand', z: 1.24, time: '02:14:07 AM'},
  {num: '146', mode: 'fall', fall: 0.55, z: 1.2, time: '02:38:52 AM'},
  {num: '147', mode: 'dead', fall: 1, z: 1.26, time: '02:47:19 AM'},
];

const ArchiveRow: React.FC<{f: number; i: number; active: boolean; appear: number}> = ({f, i, active, appear}) => {
  const item = NUMERALS[i];
  const op = smooth(appear);
  return (
    <div
      style={{
        position: 'absolute',
        left: 82,
        top: 150 + i * 566 + (1 - op) * 46,
        width: 916,
        height: 494,
        display: 'flex',
        gap: 34,
        opacity: op,
        filter: active ? 'brightness(1)' : 'brightness(0.52)',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: 278,
          height: 494,
          overflow: 'hidden',
          border: active ? '1px solid rgba(178,214,236,0.4)' : '1px solid rgba(150,190,220,0.12)',
          boxShadow: active ? '0 0 40px rgba(96,158,198,0.22)' : 'none',
        }}
      >
        <CCTVMini f={f} mode={item.mode} fall={item.fall} z={item.z} />
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(closest-side at 50% 50%, transparent 56%, rgba(0,0,0,0.5) 100%)'}} />
      </div>
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: 6}}>
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 200,
            fontSize: 126,
            lineHeight: 0.94,
            letterSpacing: '0.02em',
            color: active ? 'rgba(238,247,252,0.96)' : 'rgba(196,216,230,0.42)',
            textShadow: active ? '0 0 40px rgba(120,180,220,0.4)' : 'none',
          }}
        >
          {item.num}
        </div>
        <div
          style={{
            marginTop: 20,
            height: 1,
            width: active ? 300 : 150,
            background: active ? 'rgba(178,214,236,0.55)' : 'rgba(150,190,220,0.16)',
            transition: 'none',
          }}
        />
      </div>
      {active ? (
        <div style={{position: 'absolute', left: -16, top: 0, width: 3, height: 494, background: 'rgba(198,228,244,0.7)', boxShadow: '0 0 16px rgba(150,204,232,0.8)'}} />
      ) : null}
    </div>
  );
};

const NumbersScene: React.FC<{f: number}> = ({f}) => {
  const items = NUMERALS;
  if (f < C.n145) {
    const active = 0;
    return (
      <AbsoluteFill style={{background: '#04070A', overflow: 'hidden'}}>
        <AbsoluteFill style={{background: 'radial-gradient(900px 1200px at 40% 46%, rgba(40,86,118,0.26), transparent 72%)'}} />
        {items.map((_, i) => (
          <ArchiveRow
            key={i}
            f={f}
            i={i}
            active={i === active}
            appear={(f - (C.numbers + 12 + i * 18)) / 26}
          />
        ))}
        {/* header rule, no labels */}
        <div style={{position: 'absolute', left: 82, top: 108, width: 640, height: 1, background: 'rgba(160,200,228,0.24)'}} />
        <div style={{position: 'absolute', left: 82, top: 96, width: 4, height: 26, background: 'rgba(198,228,244,0.5)'}} />
        <Scanlines opacity={0.2} />
        <AbsoluteFill style={{background: 'radial-gradient(1100px 1200px at 50% 46%, transparent 44%, rgba(0,0,0,0.6) 100%)'}} />
        <Grain f={f} opacity={0.06} />
      </AbsoluteFill>
    );
  }
  const idx = f < C.n146 ? 0 : f < C.n147 ? 1 : 2;
  const item = items[idx];
  const z = 1.03 + smooth((f % 62) / 62) * 0.035;
  return (
    <MonitorFrame inset={12}>
      <div style={{position: 'absolute', inset: 0, transform: `scale(${z})`, transformOrigin: '50% 54%'}}>
        <CCTVScene f={f} mode={item.mode} fall={item.fall} z={item.z} numeral={item.num} time={item.time} grain={0.07} />
      </div>
    </MonitorFrame>
  );
};

/* ------------------------------------------------------------------ */
/* scene 07/08 — Dr. Elias                                             */
/* ------------------------------------------------------------------ */

const EliasEntrance: React.FC<{f: number}> = ({f}) => {
  const p = smooth((f - (C.eliasEnter + 10)) / 52);
  const reveal = 0.2 + p * 0.66;
  const drift = (1 - p) * 26;
  const z = 1 + smooth((f - C.eliasEnter) / 126) * 0.05;
  return (
    <AbsoluteFill style={{background: '#02050A', overflow: 'hidden'}}>
      <Cam z={z} ox="74%" oy="62%">
        <AbsoluteFill style={{background: 'linear-gradient(180deg,#070D14,#03070B 62%,#010305 100%)'}} />
        <div style={{position: 'absolute', inset: 0, transform: 'translate(-70px,-30px) scale(1.05)', filter: 'brightness(1.05)', opacity: 0.9}}>
          <MonitorWall f={f} bright={0.9} />
        </div>
        {/* the darkness he steps out of */}
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(250deg, rgba(1,3,6,0.98) 0%, rgba(2,5,9,0.86) 34%, rgba(3,7,11,0.4) 62%, transparent 80%)'}} />

        {/* the floor he stands on */}
        <div style={{position: 'absolute', left: 0, top: 1556, width: 1080, height: 364, background: 'linear-gradient(180deg,#070C11 0%,#04080C 42%,#010304 100%)'}} />
        <div style={{position: 'absolute', left: 60, top: 1530, width: 1000, height: 230, background: 'radial-gradient(ellipse at 52% 8%, rgba(104,158,194,0.18), transparent 72%)', filter: 'blur(26px)'}} />
        <div style={{position: 'absolute', left: 636, top: 1738, width: 340, height: 54, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(0,0,0,0.85), transparent 72%)', filter: 'blur(10px)'}} />

        {/* Elias, full figure, stepping out of the dark */}
        <div
          style={{
            position: 'absolute',
            left: 540 + drift,
            top: 292,
            width: 520,
            height: 1512,
            filter: `brightness(${reveal}) contrast(1.06) saturate(0.9)`,
          }}
        >
          <DrElias expression="cold" look="monitor" turn={0.22} rim={1.9} screen={0.5} viewBox="128 92 344 1000" preserve="xMidYMid meet" />
        </div>
        {/* monitor light wrapping his leading edge */}
        <div style={{position: 'absolute', left: 600, top: 320, width: 260, height: 1380, background: 'linear-gradient(90deg, transparent 0%, rgba(140,196,226,0.24) 26%, rgba(140,196,226,0.06) 62%, transparent 86%)', mixBlendMode: 'screen', filter: 'blur(20px)'}} />
        {/* screen spill in the air between him and the wall */}
        <div style={{position: 'absolute', left: 300, top: 300, width: 780, height: 1200, background: 'radial-gradient(closest-side at 22% 34%, rgba(96,152,190,0.22), transparent 76%)', mixBlendMode: 'screen', filter: 'blur(24px)'}} />

        <div style={{position: 'absolute', inset: 0, transform: 'translateX(-170px)'}}>
          <SeatedAmara f={f} rim={1.2} dim={0.42} />
        </div>
      </Cam>
      <AbsoluteFill style={{background: 'radial-gradient(1100px 1100px at 55% 44%, transparent 34%, rgba(0,0,0,0.74) 100%)'}} />
      <Grain f={f} opacity={0.07} />
    </AbsoluteFill>
  );
};

const EliasShot: React.FC<{f: number; mouth: number; expression: 'cold' | 'speak' | 'stare'}> = ({
  f,
  mouth,
  expression,
}) => {
  const z = 1.01 + smooth((f - C.eliasSpeak) / 100) * 0.05;
  const flick = 0.96 + Math.sin(f / 9) * 0.015 + Math.sin(f / 27) * 0.012;
  return (
    <AbsoluteFill style={{background: '#04080C', overflow: 'hidden'}}>
      {/* the room, thrown far out of focus */}
      <div style={{position: 'absolute', inset: -80, filter: 'blur(48px) brightness(0.6) saturate(0.9)', transform: 'scale(1.18)'}}>
        <MonitorWall f={f} bright={0.95} />
      </div>
      <AbsoluteFill style={{background: 'linear-gradient(180deg,#071019 0%,#050B11 46%,#03060A 100%)'}} />
      <AbsoluteFill style={{background: 'radial-gradient(760px 820px at 20% 30%, rgba(66,124,162,0.3), transparent 76%)'}} />

      <div style={{position: 'absolute', inset: 0, transform: `scale(${z})`, transformOrigin: '44% 34%'}}>
        <div
          style={{
            position: 'absolute',
            left: 196,
            top: 74,
            width: 736,
            height: 1424,
            filter: `brightness(${0.82 * flick}) contrast(1.06) saturate(0.94)`,
          }}
        >
          <DrElias
            expression={expression}
            look="left"
            mouth={mouth}
            turn={0.52}
            rim={1.5}
            screen={0.62}
            viewBox="162 92 296 540"
            preserve="xMidYMid meet"
          />
        </div>
      </div>

      {/* the coat sinking into the dark at the bottom of frame */}
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 640, background: 'linear-gradient(180deg, rgba(4,8,12,0) 0%, rgba(4,8,12,0.66) 46%, #04080C 88%)'}} />
      {/* key light from the monitors, camera-left */}
      <div style={{position: 'absolute', left: -180, top: 60, width: 780, height: 1320, background: 'radial-gradient(closest-side at 42% 34%, rgba(112,172,208,0.32), transparent 74%)', mixBlendMode: 'screen'}} />
      {/* the far side of his face turns into shadow */}
      <div style={{position: 'absolute', left: -120, top: 40, width: 1400, height: 1240, background: 'linear-gradient(258deg, rgba(2,5,9,0.86) 6%, rgba(3,7,12,0.42) 30%, transparent 54%)'}} />
      {/* cool wash across the lit cheek and brow */}
      <div style={{position: 'absolute', left: 300, top: 190, width: 420, height: 540, background: 'radial-gradient(closest-side at 30% 34%, rgba(146,196,224,0.2), transparent 76%)', mixBlendMode: 'screen', filter: 'blur(14px)'}} />
      <AbsoluteFill style={{background: 'radial-gradient(1000px 1100px at 40% 36%, transparent 40%, rgba(0,0,0,0.6) 100%)'}} />
      <Grain f={f} opacity={0.06} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* scene 09 — Amara answers                                            */
/* ------------------------------------------------------------------ */

const AmaraAnswer: React.FC<{f: number}> = ({f}) => {
  const z = 1 + smooth((f - C.amaraAnswer) / 158) * 0.045;
  const lean = smooth((f - C.amaraLine) / 20) * 1.1;
  const breath = Math.sin(f / 24) * 1.4;
  return (
    <AbsoluteFill style={{background: '#03060A', overflow: 'hidden'}}>
      {/* the monitor wall ahead of her, out of focus */}
      <div
        style={{
          position: 'absolute',
          inset: -30,
          filter: 'blur(6px) brightness(1.06) saturate(0.96)',
          transform: `translate(${-40 + (z - 1) * 300}px, ${-56}px) scale(${1.1 + (z - 1) * 0.5})`,
        }}
      >
        <MonitorWall f={f} bright={1.12} />
      </div>
      {/* light pooling behind her head, to hold the silhouette */}
      <div style={{position: 'absolute', left: 40, top: 360, width: 460, height: 520, background: 'radial-gradient(closest-side, rgba(122,180,214,0.24), transparent 74%)', mixBlendMode: 'screen', filter: 'blur(38px)'}} />
      <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(2,4,6,0.6) 0%, rgba(2,4,6,0.12) 32%, transparent 56%)'}} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(2,4,6,0.5) 0%, transparent 22%, transparent 62%, rgba(2,4,6,0.7) 100%)'}} />

      {/* the chair back, behind her shoulders */}
      <div style={{position: 'absolute', left: -80, top: 1180, width: 680, height: 740, borderRadius: '170px 170px 20px 20px', background: 'linear-gradient(180deg,#090E14,#04070C 62%,#020407)'}} />

      <div style={{position: 'absolute', inset: 0, transform: `scale(${z}) translateY(${breath}px)`, transformOrigin: '34% 38%'}}>
        <div
          style={{
            position: 'absolute',
            left: 92,
            top: 300,
            width: 700,
            height: 1058,
            transform: `rotate(${lean}deg)`,
            transformOrigin: '58% 92%',
            filter: 'brightness(1.18) contrast(1.06)',
          }}
        >
          <AmaraBack rim={2.4} viewBox="60 40 172 260" preserve="xMidYMin meet" />
        </div>
      </div>

      {/* the chair back, close to camera */}
      <div style={{position: 'absolute', left: -320, top: 1300, width: 1760, height: 900, borderRadius: '48px 48px 0 0', background: 'linear-gradient(180deg,#0D151D 0%,#080D13 22%,#030508 66%,#010203 100%)', transform: 'rotate(-0.5deg)', boxShadow: 'inset 0 3px 0 rgba(126,178,208,0.1)'}} />
      <div style={{position: 'absolute', left: -200, top: 1280, width: 1520, height: 80, background: 'radial-gradient(closest-side, rgba(118,172,204,0.24), transparent 80%)', filter: 'blur(14px)', mixBlendMode: 'screen'}} />
      {/* rim of screen light down her silhouette */}
      <div style={{position: 'absolute', left: 330, top: 380, width: 300, height: 1000, background: 'radial-gradient(closest-side, rgba(120,180,214,0.2), transparent 74%)', mixBlendMode: 'screen', filter: 'blur(16px)'}} />
      {/* desk glow washing the bottom of frame */}
      <div style={{position: 'absolute', left: -100, top: 1500, width: 900, height: 600, background: 'radial-gradient(closest-side at 40% 40%, rgba(96,152,186,0.22), transparent 76%)', filter: 'blur(30px)', mixBlendMode: 'screen'}} />
      <AbsoluteFill style={{background: 'radial-gradient(1000px 1200px at 44% 42%, transparent 42%, rgba(0,0,0,0.7) 100%)'}} />
      <Grain f={f} opacity={0.07} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* scene 10 — her hand on the workstation                              */
/* ------------------------------------------------------------------ */

/* One hand entering from the right, the index finger pressing a key. */
const Hand: React.FC<{press?: number; opacity?: number}> = ({press = 0, opacity = 1}) => (
  <svg viewBox="0 0 620 470" width="100%" height="100%" preserveAspectRatio="xMidYMax meet" style={{opacity}}>
    <defs>
      <linearGradient id="hBody" x1="0.1" y1="0" x2="0.8" y2="1">
        <stop offset="0%" stopColor="#28303A" />
        <stop offset="38%" stopColor="#10151A" />
        <stop offset="100%" stopColor="#040608" />
      </linearGradient>
      <linearGradient id="hRim" x1="0" y1="0" x2="0.6" y2="1">
        <stop offset="0%" stopColor="#CDE5F2" stopOpacity="0.9" />
        <stop offset="40%" stopColor="#80A9C1" stopOpacity="0.26" />
        <stop offset="100%" stopColor="#6E9EBC" stopOpacity="0" />
      </linearGradient>
      <filter id="hSoft" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="9" />
      </filter>
    </defs>

    <ellipse cx="470" cy="382" rx="200" ry="58" fill="rgba(0,0,0,0.6)" filter="url(#hSoft)" />

    <g fill="url(#hBody)">
      {/* forearm and back of the hand, off the right edge */}
      <path d="M 372 176 C 440 154 520 150 620 168 L 620 470 L 356 470 C 340 410 338 330 348 264 C 354 220 362 194 372 176 Z" />
      {/* the extended index finger */}
      <path d="M 408 202 C 368 194 300 210 244 234 C 212 246 194 258 193 270 C 192 284 210 294 238 292 C 294 288 358 270 412 248 Z" />
      {/* two folded fingers, catching the light */}
      <path d="M 392 300 C 360 296 322 306 296 320 C 280 328 274 338 278 346 C 284 356 300 356 320 350 C 348 342 374 328 396 314 Z" />
      <path d="M 384 352 C 356 350 326 358 306 368 C 292 376 290 386 296 392 C 304 400 320 398 336 392 C 358 384 376 372 390 362 Z" />
      {/* thumb, tucked low */}
      <path d="M 420 372 C 388 372 356 382 336 396 C 322 406 320 418 330 424 C 342 430 360 424 376 414 C 396 402 412 388 424 378 Z" opacity="0.85" />
    </g>

    <g fill="none" stroke="url(#hRim)" strokeLinecap="round">
      <path d="M 402 212 C 340 208 268 224 216 248" strokeWidth={3.2} />
      <path d="M 372 178 C 442 156 520 152 618 168" strokeWidth={3} opacity={0.85} />
      <path d="M 410 300 C 372 298 336 308 308 324" strokeWidth={2.4} opacity={0.6} />
      <path d="M 404 344 C 374 342 344 352 322 364" strokeWidth={2} opacity={0.5} />
    </g>

    <path d="M 380 240 C 440 220 520 214 600 224" stroke="rgba(154,202,228,0.12)" strokeWidth={20} fill="none" filter="url(#hSoft)" />

    {/* the fingertip, and the glow it brings up out of the key */}
    <ellipse cx="196" cy="272" rx="34" ry="26" fill="#10161C" />
    <ellipse cx="196" cy="276" rx="30" ry="20" fill="rgba(140,196,228,0.3)" filter="url(#hSoft)" />
    <ellipse cx="196" cy="272" rx="16" ry="10" fill="rgba(206,232,246,0.5)" filter="url(#hSoft)" />
  </svg>
);

const Keyboard: React.FC<{f: number}> = ({f}) => (
  <div
    style={{
      position: 'absolute',
      left: -110,
      top: 1180,
      width: 1280,
      height: 820,
      transform: 'perspective(1500px) rotateX(48deg) rotateZ(-7deg)',
      transformOrigin: '50% 0%',
    }}
  >
    <div style={{position: 'absolute', inset: 0, borderRadius: 24, background: 'linear-gradient(180deg,#0E141A,#070A0E 60%,#04060A)'}} />
    <div style={{position: 'absolute', left: 46, top: 52, right: 46, bottom: 52, display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gridTemplateRows: 'repeat(4, 1fr)', gap: 10}}>
      {Array.from({length: 48}).map((_, i) => {
        const lit = Math.abs(i - 26) < 7;
        return (
          <div
            key={i}
            style={{
              borderRadius: 7,
              background: lit
                ? `linear-gradient(180deg, rgba(104,152,182,${0.26 + Math.sin(f / 8 + i) * 0.03}), rgba(20,28,36,0.96))`
                : 'linear-gradient(180deg, rgba(34,44,54,0.95), rgba(9,13,17,0.98))',
              boxShadow: 'inset 0 1px 0 rgba(180,210,230,0.1), 0 5px 9px rgba(0,0,0,0.62)',
            }}
          />
        );
      })}
    </div>
  </div>
);

const HandShot: React.FC<{f: number}> = ({f}) => {
  const push = 1 + smooth((f - C.file) / 78) * 0.09;
  const press = Math.max(0, Math.sin((f - C.file) / 9)) * (f > C.file + 8 ? 1 : 0);
  const glow = smooth((f - (C.file + 30)) / 40);
  return (
    <AbsoluteFill style={{background: '#020406', overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, transform: `scale(${push})`, transformOrigin: '62% 58%'}}>
        <AbsoluteFill style={{background: 'radial-gradient(1000px 900px at 18% 30%, rgba(40,88,120,0.3), transparent 70%)'}} />
        <AbsoluteFill style={{background: 'linear-gradient(180deg,#060B10,#03060A 62%,#020405 100%)'}} />
        {/* the monitor edge, camera-left */}
        <div style={{position: 'absolute', left: -60, top: 120, width: 300, height: 900, background: `radial-gradient(closest-side at 30% 46%, rgba(122,182,216,${0.26 + glow * 0.26}), transparent 74%)`, filter: 'blur(26px)'}} />
        <div style={{position: 'absolute', left: 0, top: 0, width: 96, height: 1920, background: `linear-gradient(90deg, rgba(150,204,232,${0.16 + glow * 0.2}), transparent)`}} />
        <Keyboard f={f} />
        {/* the workstation screen, angled above her hand */}
        <div
          style={{
            position: 'absolute',
            left: -40,
            top: 120,
            width: 720,
            height: 900,
            transform: 'perspective(1400px) rotateY(24deg) rotateX(4deg)',
            transformOrigin: '0% 50%',
            background: 'linear-gradient(160deg, rgba(18,34,46,0.94), rgba(6,12,17,0.98))',
            boxShadow: `0 40px 120px rgba(0,0,0,0.8), inset 0 0 90px rgba(96,164,200,${0.1 + glow * 0.14})`,
            border: '1px solid rgba(126,176,206,0.16)',
            overflow: 'hidden',
          }}
        >
          {/* rows of archive entries, no legible text */}
          {Array.from({length: 11}).map((_, i) => (
            <div key={i} style={{position: 'absolute', left: 54, right: 54, top: 76 + i * 70, height: 34, display: 'flex', gap: 14, opacity: 0.34 + (i === 6 ? 0.4 : 0)}}>
              <div style={{width: 26, height: 26, background: 'rgba(140,196,226,0.24)'}} />
              <div style={{width: `${34 + (i % 3) * 12}%`, height: 12, marginTop: 8, background: 'rgba(150,196,224,0.3)'}} />
              <div style={{width: `${16 + (i % 2) * 10}%`, height: 12, marginTop: 8, background: 'rgba(150,196,224,0.18)'}} />
            </div>
          ))}
          <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(200deg, rgba(140,200,232,0.14), transparent 46%)'}} />
        </div>
        {/* hand, foreground */}
        <div style={{position: 'absolute', left: 340, top: 900, width: 740, height: 561, filter: 'brightness(1.3)'}}>
          <Hand press={press} />
        </div>
        {/* screen rows reflected on the desk */}
        <div style={{position: 'absolute', left: 40, top: 900, width: 460, height: 620, background: 'repeating-linear-gradient(0deg, rgba(140,192,220,0.05) 0 2px, transparent 2px 26px)', transform: 'skewY(-8deg)', filter: 'blur(2px)', opacity: 0.7}} />
      </div>
      <AbsoluteFill style={{background: 'radial-gradient(900px 1000px at 46% 52%, transparent 38%, rgba(0,0,0,0.7) 100%)'}} />
      <Grain f={f} opacity={0.07} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* scene 11 — SUBJECT 001                                              */
/* ------------------------------------------------------------------ */

const FilePortrait: React.FC<{f: number}> = ({f}) => (
  <div style={{position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', overflow: 'hidden', background: '#0A1117'}}>
    <div style={{position: 'absolute', inset: 0, filter: 'grayscale(0.72) contrast(1.1) brightness(0.92) saturate(0.7)'}}>
      <Noah expression="neutral" look="camera" rim={1.1} viewBox="182 62 248 372" preserve="xMidYMid slice" />
    </div>
    <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(46,84,110,0.18), rgba(4,8,12,0.36))'}} />
    <Scanlines opacity={0.3} />
    <AbsoluteFill style={{background: 'radial-gradient(closest-side at 50% 44%, transparent 42%, rgba(0,0,0,0.6) 100%)'}} />
    <div style={{position: 'absolute', inset: 0, border: '1px solid rgba(160,198,222,0.22)'}} />
    <div style={{position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: 'rgba(180,214,236,0.08)'}} />
  </div>
);

const SubjectFile: React.FC<{f: number}> = ({f}) => {
  const t1 = smooth((f - C.subject) / 12);
  const t2 = smooth((f - C.status) / 10);
  const t3 = smooth((f - C.terminated) / 12);
  const scan = ((f - C.subject) * 5) % 2200;
  return (
    <AbsoluteFill style={{background: '#03060A', overflow: 'hidden'}}>
      <AbsoluteFill style={{background: 'radial-gradient(1100px 1000px at 42% 34%, rgba(38,80,108,0.28), transparent 72%)'}} />
      {/* faint interface grid */}
      <div style={{position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(120,164,192,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(120,164,192,0.045) 1px, transparent 1px)', backgroundSize: '120px 120px', opacity: 0.7}} />
      {/* portrait */}
      <div style={{position: 'absolute', left: 96, top: 250, width: 466, height: 640, opacity: 0.4 + t1 * 0.6, transform: `translateY(${(1 - t1) * 14}px)`}}>
        <FilePortrait f={f} />
      </div>
      {/* text block */}
      <div style={{position: 'absolute', left: 96, top: 986}}>
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 300,
            fontSize: 66,
            letterSpacing: '0.14em',
            color: '#EAF2F8',
            whiteSpace: 'nowrap',
            clipPath: `inset(0 ${100 - t1 * 100}% 0 0)`,
            textShadow: '0 0 30px rgba(120,180,220,0.25)',
          }}
        >
          SUBJECT 001
        </div>
        <div style={{marginTop: 22, width: 566, height: 1, background: 'rgba(170,206,230,0.34)'}} />
        <div style={{marginTop: 44, fontFamily: MONO, fontSize: 34, letterSpacing: '0.18em', color: 'rgba(196,216,230,0.62)', opacity: t2, whiteSpace: 'nowrap'}}>
          STATUS:
        </div>
        <div
          style={{
            marginTop: 20,
            fontFamily: MONO,
            fontSize: 62,
            letterSpacing: '0.14em',
            color: '#D96A56',
            opacity: t3,
            whiteSpace: 'nowrap',
            textShadow: '0 0 34px rgba(212,86,66,0.4)',
            clipPath: `inset(0 ${100 - t3 * 100}% 0 0)`,
          }}
        >
          TERMINATED
        </div>
      </div>
      {/* scan bar */}
      <div style={{position: 'absolute', left: 0, right: 0, top: scan - 200, height: 200, background: 'linear-gradient(180deg, transparent, rgba(140,196,226,0.055), transparent)'}} />
      <Scanlines opacity={0.18} />
      <AbsoluteFill style={{background: 'radial-gradient(1000px 1200px at 46% 44%, transparent 40%, rgba(0,0,0,0.7) 100%)'}} />
      <Grain f={f} opacity={0.07} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* scene 12 — the original Noah                                        */
/* ------------------------------------------------------------------ */

const OriginalNoah: React.FC<{f: number}> = ({f}) => {
  const z = 1 + smooth((f - C.original) / 122) * 0.1;
  const flick = 0.94 + Math.sin(f / 7) * 0.02 + Math.sin(f / 21) * 0.02;
  const lb = (f - C.original) * 2.6 % 1900;
  return (
    <AbsoluteFill style={{background: '#05080C', overflow: 'hidden'}}>
      <AbsoluteFill style={{background: 'radial-gradient(1000px 1100px at 50% 40%, rgba(34,62,84,0.34), transparent 74%)'}} />
      <div style={{position: 'absolute', left: 76, top: 250, width: 928, height: 1300, overflow: 'hidden', boxShadow: '0 40px 120px rgba(0,0,0,0.86)', filter: `brightness(${flick})`}}>
        <div style={{position: 'absolute', inset: 0, transform: `scale(${z})`, transformOrigin: '50% 42%'}}>
          <div style={{position: 'absolute', inset: 0, filter: 'grayscale(0.8) contrast(1.14) brightness(0.88) saturate(0.6)'}}>
            <Noah expression="tired" look="camera" rim={1.25} viewBox="176 18 262 466" preserve="xMidYMid slice" />
          </div>
        </div>
        <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(40,74,98,0.16), rgba(4,8,12,0.42))'}} />
        <Scanlines opacity={0.28} />
        <AbsoluteFill style={{background: 'radial-gradient(closest-side at 50% 42%, transparent 40%, rgba(0,0,0,0.66) 100%)'}} />
        {/* light band drifting across the print */}
        <div style={{position: 'absolute', left: 0, right: 0, top: lb - 260, height: 260, background: 'linear-gradient(180deg, transparent, rgba(180,216,236,0.06), transparent)'}} />
        <div style={{position: 'absolute', inset: 0, border: '1px solid rgba(170,206,230,0.24)'}} />
      </div>
      {/* corner tabs, like a print on a file */}
      {[[60, 236], [950, 236], [60, 1540], [950, 1540]].map(([x, y], i) => (
        <div key={i} style={{position: 'absolute', left: x, top: y, width: 58, height: 16, background: 'linear-gradient(180deg, rgba(170,200,218,0.18), rgba(120,150,170,0.06))', transform: `rotate(${i % 2 ? 12 : -12}deg)`}} />
      ))}
      <AbsoluteFill style={{background: 'radial-gradient(1100px 1200px at 50% 46%, transparent 42%, rgba(0,0,0,0.72) 100%)'}} />
      <Grain f={f} opacity={0.09} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* scene 13 — the copy                                                 */
/* ------------------------------------------------------------------ */

const LabVat: React.FC<{f: number}> = ({f}) => {
  const drift = Math.sin(f / 42) * 6;
  return (
    <AbsoluteFill style={{background: '#03060A', overflow: 'hidden'}}>
      <AbsoluteFill style={{background: 'linear-gradient(180deg,#060B10 0%,#04080C 54%,#020406 100%)'}} />
      <AbsoluteFill style={{background: 'radial-gradient(700px 900px at 50% 44%, rgba(46,104,136,0.26), transparent 72%)'}} />
      {/* lab racks */}
      {[0, 1, 2, 3].map((i) => (
        <div key={i} style={{position: 'absolute', left: 40 + i * 268, top: 380 + (i % 2) * 40, width: 196, height: 620, background: 'linear-gradient(180deg, rgba(10,16,22,0.96), rgba(4,7,10,0.98))', border: '1px solid rgba(130,170,196,0.09)'}}>
          {Array.from({length: 5}).map((_, r) => (
            <div key={r} style={{position: 'absolute', left: 16, right: 16, top: 24 + r * 118, height: 3, background: 'rgba(140,186,214,0.1)'}} />
          ))}
          <div style={{position: 'absolute', left: 18, top: 40, width: 6, height: 6, borderRadius: '50%', background: (i + Math.floor(f / 40)) % 3 === 0 ? 'rgba(120,200,220,0.7)' : 'rgba(90,130,150,0.3)'}} />
        </div>
      ))}
      {/* the vat */}
      <div style={{position: 'absolute', left: 372 + drift, top: 300, width: 336, height: 1200}}>
        <div style={{position: 'absolute', inset: 0, borderRadius: '170px 170px 24px 24px', background: 'linear-gradient(180deg, rgba(28,52,68,0.6), rgba(10,22,30,0.86) 40%, rgba(4,10,14,0.96))', border: '2px solid rgba(160,206,232,0.2)', boxShadow: '0 0 80px rgba(76,148,182,0.24), inset 0 0 90px rgba(70,140,176,0.16)'}} />
        <div style={{position: 'absolute', inset: 8, borderRadius: '164px 164px 20px 20px', background: 'radial-gradient(closest-side at 50% 42%, rgba(112,184,214,0.22), transparent 74%)', filter: 'blur(6px)'}} />
        {/* suspended body silhouette */}
        <div style={{position: 'absolute', left: 44, top: 196, width: 248, height: 940, opacity: 0.4}}>
          <div style={{position: 'absolute', inset: 0, filter: 'grayscale(1) brightness(0.5) contrast(1.1)'}}>
            <Noah expression="neutral" look="down" rim={0} viewBox="0 0 600 1200" preserve="xMidYMax meet" />
          </div>
        </div>
        {/* fluid caustics */}
        {Array.from({length: 16}).map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 30 + rnd(i) * 260,
              top: 1080 - ((f * (0.7 + rnd(i) * 1.4) + i * 90) % 1000),
              width: 4 + rnd(i) * 7,
              height: 4 + rnd(i) * 7,
              borderRadius: '50%',
              background: 'rgba(190,228,242,0.3)',
              filter: 'blur(1px)',
            }}
          />
        ))}
        <div style={{position: 'absolute', left: 24, top: 60, width: 8, height: 620, borderRadius: 6, background: 'linear-gradient(180deg, rgba(210,238,248,0.32), transparent)'}} />
      </div>
      {/* cables */}
      <path d="M 372 620 C 300 700 270 900 300 1180" stroke="rgba(20,30,38,0.9)" strokeWidth={16} fill="none" />
      <path d="M 708 640 C 780 720 806 920 776 1200" stroke="rgba(18,26,34,0.9)" strokeWidth={14} fill="none" />
      <path d="M 420 300 C 420 220 500 200 540 220" stroke="rgba(24,36,46,0.9)" strokeWidth={10} fill="none" />
      {/* floor reflection */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 1500, height: 420, background: 'linear-gradient(180deg, rgba(70,138,170,0.12), transparent 80%)', filter: 'blur(18px)'}} />
      <AbsoluteFill style={{background: 'radial-gradient(1100px 1200px at 50% 44%, transparent 36%, rgba(0,0,0,0.78) 100%)'}} />
      <Grain f={f} opacity={0.08} />
    </AbsoluteFill>
  );
};

const NODES: Array<[number, number]> = [
  [520, 330], [566, 300], [616, 322], [500, 396], [560, 380], [628, 392],
  [540, 452], [604, 452], [574, 512], [512, 486], [648, 470], [686, 420],
];
const EDGES: Array<[number, number]> = [
  [0, 1], [1, 2], [0, 3], [1, 4], [2, 5], [3, 4], [4, 5], [3, 6], [5, 7],
  [6, 7], [6, 8], [7, 8], [3, 9], [9, 6], [5, 10], [10, 11], [2, 11],
];

const NeuralPanel: React.FC<{f: number; x: number; y: number; scale: number; dim?: number; da?: number}> = ({
  f,
  x,
  y,
  scale,
  dim = 1,
  da = 0,
}) => (
  <svg
    viewBox="380 250 360 320"
    width={420 * scale}
    height={380 * scale}
    style={{position: 'absolute', left: x, top: y, opacity: dim}}
  >
    {/* skull outline */}
    <path d="M 556 268 C 486 268 442 316 442 378 C 442 428 468 464 508 480 L 512 528 L 604 528 L 606 480 C 644 462 668 424 668 380 C 668 316 626 268 556 268 Z" fill="rgba(96,160,192,0.05)" stroke="rgba(158,204,230,0.32)" strokeWidth="1.6" />
    {/* edges */}
    {EDGES.map(([a, b], i) => {
      const [x1, y1] = NODES[a];
      const [x2, y2] = NODES[b];
      const active = Math.sin(f / 12 + i * 0.7 + da) > 0.55;
      return (
        <line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={active ? 'rgba(196,236,250,0.65)' : 'rgba(140,190,216,0.18)'}
          strokeWidth={active ? 1.8 : 1}
        />
      );
    })}
    {/* nodes */}
    {NODES.map(([cx, cy], i) => {
      const pulse = 0.5 + 0.5 * Math.sin(f / 9 + i * 1.3 + da);
      return (
        <g key={i}>
          <circle cx={cx} cy={cy} r={9 + pulse * 5} fill="rgba(150,210,238,0.1)" />
          <circle cx={cx} cy={cy} r={3.6} fill={`rgba(214,242,252,${0.4 + pulse * 0.55})`} />
        </g>
      );
    })}
  </svg>
);

const CopyLab: React.FC<{f: number}> = ({f}) => {
  const beat = f < 1452 ? 0 : f < 1520 ? 1 : 2;
  if (beat === 0) return <LabVat f={f} />;
  if (beat === 1) {
    const z = 1 + smooth((f - 1452) / 68) * 0.05;
    const link = smooth((f - 1462) / 26);
    return (
      <AbsoluteFill style={{background: '#02050A', overflow: 'hidden'}}>
        <AbsoluteFill style={{background: 'radial-gradient(900px 1000px at 50% 46%, rgba(34,82,112,0.3), transparent 74%)'}} />
        <div style={{position: 'absolute', inset: 0, transform: `scale(${z})`, transformOrigin: '50% 48%'}}>
          <NeuralPanel f={f} x={-104} y={430} scale={2.02} dim={0.95} />
          <NeuralPanel f={f} x={614} y={528} scale={1.62} dim={0.38 + link * 0.3} da={2.4} />
          {/* the copy link between them */}
          <div style={{position: 'absolute', left: 700, top: 1046, width: 190, height: 2, background: 'rgba(170,220,240,0.3)', opacity: link}} />
          <div style={{position: 'absolute', left: 880, top: 1040, width: 12, height: 12, borderRadius: '50%', background: 'rgba(214,242,252,0.75)', opacity: link, filter: 'blur(1px)'}} />
          <div style={{position: 'absolute', left: 0, right: 0, top: 300, height: 1, background: 'rgba(140,190,216,0.14)'}} />
          <div style={{position: 'absolute', left: 0, right: 0, top: 1600, height: 1, background: 'rgba(140,190,216,0.1)'}} />
        </div>
        <Scanlines opacity={0.22} />
        <AbsoluteFill style={{background: 'radial-gradient(1000px 1200px at 50% 46%, transparent 40%, rgba(0,0,0,0.74) 100%)'}} />
        <Grain f={f} opacity={0.07} />
      </AbsoluteFill>
    );
  }
  const z = 1 + smooth((f - 1520) / 90) * 0.07;
  const lit = smooth((f - 1534) / 34);
  return (
    <AbsoluteFill style={{background: '#03060A', overflow: 'hidden'}}>
      {/* lit alcove */}
      <div style={{position: 'absolute', left: 90, top: 300, width: 900, height: 1180, background: 'linear-gradient(180deg, rgba(70,126,158,0.28), rgba(8,16,22,0.9) 62%, rgba(3,6,9,0.98))', border: '1px solid rgba(160,200,226,0.16)'}} />
      <div style={{position: 'absolute', left: 90, top: 300, width: 900, height: 460, background: 'radial-gradient(closest-side at 50% 0%, rgba(170,216,238,0.34), transparent 76%)'}} />
      <div style={{position: 'absolute', inset: 0, transform: `scale(${z})`, transformOrigin: '50% 58%'}}>
        {/* two identical silhouettes */}
        {[0, 1].map((i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 214 + i * 356,
              top: 508,
              width: 300,
              height: 960,
              opacity: i === 0 ? 1 : 0.32 + lit * 0.5,
              filter: i === 0 ? 'brightness(0.9)' : `brightness(${0.4 + lit * 0.5})`,
            }}
          >
            <div style={{position: 'absolute', inset: 0, filter: 'grayscale(0.9) contrast(1.16) brightness(0.42)'}}>
              <Noah expression="neutral" look="camera" rim={i === 0 ? 0.5 : 0.8} viewBox="0 0 600 1200" preserve="xMidYMax meet" />
            </div>
          </div>
        ))}
        <div style={{position: 'absolute', left: 0, right: 0, top: 1440, height: 200, background: 'radial-gradient(closest-side at 50% 0%, rgba(120,180,210,0.2), transparent 76%)', filter: 'blur(20px)'}} />
      </div>
      {/* wireframe overlay on the copy */}
      <div style={{position: 'absolute', left: 556, top: 500, width: 320, height: 980, opacity: 0.5}}>
        <svg viewBox="0 0 300 900" width="100%" height="100%">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <line key={i} x1={60 + i * 24} y1={60} x2={40 + i * 30} y2={860} stroke="rgba(160,208,232,0.18)" strokeWidth="1" />
          ))}
          {[140, 320, 500, 680].map((y, i) => (
            <line key={i} x1={30} y1={y} x2={270} y2={y - 10} stroke="rgba(160,208,232,0.14)" strokeWidth="1" />
          ))}
        </svg>
      </div>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(2,4,6,0.5) 0%, transparent 22%, transparent 70%, rgba(2,4,6,0.72) 100%)'}} />
      <AbsoluteFill style={{background: 'radial-gradient(1100px 1200px at 50% 46%, transparent 38%, rgba(0,0,0,0.76) 100%)'}} />
      <Grain f={f} opacity={0.08} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* scene 14 — back in the apartment                                    */
/* ------------------------------------------------------------------ */

const PhoneInHand: React.FC<{f: number; glow?: number}> = ({f, glow = 1}) => (
  <div style={{position: 'absolute', left: 352, top: 1178, width: 392, height: 543}}>
    <svg viewBox="0 0 520 720" width="100%" height="100%" preserveAspectRatio="xMidYMax meet">
      <defs>
        <linearGradient id="phEdge" x1="0" y1="0" x2="1" y2="0.2">
          <stop offset="0%" stopColor="#D6EEF8" stopOpacity="0.9" />
          <stop offset="26%" stopColor="#7FB6D2" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#3E6C86" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="phBody" x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor="#20262E" />
          <stop offset="42%" stopColor="#0C1016" />
          <stop offset="100%" stopColor="#04060A" />
        </linearGradient>
        <filter id="phSoft" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
      </defs>
      {/* screen spill around the device */}
      <ellipse cx="180" cy="324" rx="230" ry="300" fill="rgba(126,188,220,0.28)" filter="url(#phSoft)" opacity={glow} />
      <g transform="rotate(-13 250 330)">
        {/* forearm rising from the bottom of frame */}
        <path d="M 250 720 L 250 560 C 250 512 286 486 326 486 L 372 486 L 372 720 Z" fill="#0A0C11" />
        <path d="M 250 560 C 250 512 286 486 326 486" stroke="rgba(150,196,222,0.24)" strokeWidth="2.4" fill="none" />
        {/* phone body */}
        <rect x="104" y="86" width="292" height="486" rx="42" fill="url(#phBody)" stroke="rgba(150,192,218,0.14)" strokeWidth="1.4" />
        {/* screen edge glow, facing him */}
        <rect x="98" y="82" width="292" height="486" rx="42" fill="none" stroke="url(#phEdge)" strokeWidth="3" opacity={0.72 * glow} />
        <rect x="112" y="100" width="12" height="454" rx="6" fill="rgba(176,222,242,0.5)" opacity={0.7 * glow} />
        {/* camera bump */}
        <rect x="316" y="118" width="56" height="88" rx="14" fill="#0B0F14" stroke="rgba(140,180,206,0.14)" strokeWidth="1" />
        <circle cx="344" cy="146" r="11" fill="#05080C" stroke="rgba(150,196,222,0.24)" strokeWidth="1.2" />
        <circle cx="344" cy="178" r="8" fill="#05080C" stroke="rgba(150,196,222,0.18)" strokeWidth="1" />
        {/* fingers wrapping the right edge */}
        <g fill="#0B0E13">
          <rect x="356" y="182" width="86" height="42" rx="21" />
          <rect x="362" y="234" width="86" height="42" rx="21" />
          <rect x="366" y="286" width="82" height="40" rx="20" />
          <rect x="370" y="336" width="74" height="36" rx="18" />
        </g>
        <g stroke="rgba(160,204,228,0.22)" strokeWidth="1.6" fill="none">
          <path d="M 368 188 C 402 184 428 192 436 204" />
          <path d="M 372 240 C 404 236 430 244 440 256" />
          <path d="M 374 292 C 404 288 428 296 438 306" />
        </g>
        {/* thumb on the near edge */}
        <path d="M 104 330 C 76 330 58 306 58 280 C 58 258 74 242 96 242 L 112 242 L 112 330 Z" fill="#0C1015" />
        <path d="M 68 268 C 80 252 96 246 110 250" stroke="rgba(160,204,228,0.22)" strokeWidth="1.8" fill="none" />
      </g>
    </svg>
  </div>
);

const ApartmentShot: React.FC<{f: number}> = ({f}) => {
  const z = 1 + smooth((f - C.apartment) / 109) * 0.05;
  const lid = blinkLid(f, C.apartment + 34) + blinkLid(f, C.apartment + 78) * 0.7;
  const light = smooth((f - (C.apartment + 14)) / 26);
  return (
    <AbsoluteFill style={{background: '#04070A', overflow: 'hidden'}}>
      <Cam z={z} ox="52%" oy="46%">
        <Room f={f} phoneOn={light} />
        <div style={{position: 'absolute', left: 296, top: 336, width: 760, height: 1216}}>
          <Noah
            expression={f < C.apartment + 74 ? 'tired' : 'unease'}
            look={f < C.apartment + 88 ? 'down' : 'camera'}
            lidOverride={lid}
            rim={1.1}
            viewBox="150 30 300 480"
            preserve="xMidYMid meet"
          />
        </div>
        <PhoneInHand f={f} glow={0.35 + light * 0.65} />
        {/* screen light on his face and chest */}
        <div
          style={{
            position: 'absolute',
            left: 250,
            top: 620,
            width: 720,
            height: 900,
            background: `radial-gradient(closest-side at 46% 60%, rgba(128,190,224,${0.1 + light * 0.2}), transparent 68%)`,
            mixBlendMode: 'screen',
          }}
        />
      </Cam>
      <AbsoluteFill style={{background: 'radial-gradient(1000px 1100px at 50% 44%, transparent 40%, rgba(0,0,0,0.66) 100%)'}} />
      <Grain f={f} opacity={0.07} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* scene 15 — the new message                                          */
/* ------------------------------------------------------------------ */

const PhoneShot: React.FC<{f: number}> = ({f}) => {
  const z = 1 + smooth((f - C.phone) / 127) * 0.06;
  const on = smooth((f - (C.phone + 4)) / 16);
  const msg = smooth((f - C.message) / 14);
  return (
    <AbsoluteFill style={{background: '#03060A', overflow: 'hidden'}}>
      <AbsoluteFill style={{background: 'radial-gradient(800px 900px at 50% 46%, rgba(36,74,102,0.5), transparent 72%)'}} />
      <div style={{position: 'absolute', inset: 0, transform: `scale(${z})`, transformOrigin: '50% 50%'}}>
        {/* fingers at the frame edge */}
        <div style={{position: 'absolute', left: -70, top: 1100, width: 300, height: 620, background: 'linear-gradient(120deg,#05070B,#0A0E13)', borderRadius: '90px 40px 40px 90px', transform: 'rotate(-8deg)'}} />
        <div style={{position: 'absolute', right: -90, top: 1180, width: 320, height: 640, background: 'linear-gradient(240deg,#05070B,#090D12)', borderRadius: '40px 90px 90px 40px', transform: 'rotate(7deg)'}} />
        {/* phone */}
        <div style={{position: 'absolute', left: '50%', top: '50%', width: 664, height: 1324, marginLeft: -332, marginTop: -662, borderRadius: 88, background: 'linear-gradient(160deg,#181D24,#06080C 46%,#04060A)', boxShadow: '0 50px 140px rgba(0,0,0,0.9), 0 0 100px rgba(86,146,190,0.22)', transform: 'rotate(-1.6deg)'}}>
          <div style={{position: 'absolute', inset: 12, borderRadius: 78, background: '#04060A', overflow: 'hidden'}}>
            <div style={{position: 'absolute', inset: 8, borderRadius: 70, background: `linear-gradient(178deg, rgba(20,34,48,${0.5 + on * 0.5}) 0%, rgba(8,14,20,1) 46%, #05080D 100%)`, overflow: 'hidden', opacity: 0.35 + on * 0.65}}>
              {/* screen bloom */}
              <div style={{position: 'absolute', left: -100, top: -140, width: 900, height: 900, background: `radial-gradient(closest-side, rgba(96,158,200,${0.24 * on}), transparent 70%)`}} />
              <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 380, background: 'linear-gradient(180deg, rgba(72,120,158,0.2), transparent)'}} />
              {/* status glyphs, no words */}
              <div style={{position: 'absolute', left: 50, top: 72, right: 50, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div style={{display: 'flex', gap: 6, alignItems: 'flex-end'}}>
                  {[10, 14, 18, 22].map((h, i) => (
                    <div key={i} style={{width: 5, height: h, background: `rgba(226,240,248,${0.5 + on * 0.2})`}} />
                  ))}
                </div>
                <div style={{display: 'flex', gap: 8, alignItems: 'center', fontFamily: SANS, fontSize: 22, color: 'rgba(226,240,248,0.2)'}}>
                  <span style={{fontSize: 18}}>▮▮▮</span>
                </div>
              </div>
              {/* message */}
              <div
                style={{
                  position: 'absolute',
                  left: 54,
                  right: 62,
                  top: 640 + (1 - msg) * 26,
                  opacity: msg,
                }}
              >
                <div
                  style={{
                    padding: '48px 42px',
                    borderRadius: '10px 40px 40px 40px',
                    background: 'linear-gradient(160deg, rgba(38,52,66,0.96), rgba(18,26,34,0.98))',
                    border: '1px solid rgba(158,198,224,0.2)',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
                  }}
                >
                  <div style={{fontFamily: SANS, fontWeight: 400, fontSize: 54, lineHeight: 1.3, letterSpacing: '0.005em', color: '#F4F1EB'}}>
                    Find the room where you were born.
                  </div>
                </div>
              </div>
              <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(118deg, rgba(255,255,255,0.09) 0%, transparent 34%, transparent 68%, rgba(160,200,230,0.06) 100%)'}} />
            </div>
          </div>
          <div style={{position: 'absolute', left: '50%', top: 26, width: 168, height: 26, marginLeft: -84, borderRadius: 14, background: '#04060A'}} />
        </div>
      </div>
      <AbsoluteFill style={{background: 'radial-gradient(900px 1100px at 50% 48%, transparent 44%, rgba(0,0,0,0.72) 100%)'}} />
      <Grain f={f} opacity={0.06} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* scene 16 — the whisper                                              */
/* ------------------------------------------------------------------ */

const EliasFinal: React.FC<{f: number}> = ({f}) => {
  const z = 1.02 + smooth((f - C.eliasFinal) / 156) * 0.1;
  const expression = f < 1892 ? 'stare' : f < 1950 ? 'concern' : 'whisper';
  const mouth = talk(f, C.whisper2, 2006, 0.22, 4.6) + (f > 1944 && f < C.whisper2 ? talk(f, 1944, 1952, 0.1, 3) : 0);
  const lid = Math.max(blinkLid(f, 1888), blinkLid(f, 1932) * 0.8);
  const fade = 1 - smooth((f - 2002) / 12);
  return (
    <AbsoluteFill style={{background: '#03060A', overflow: 'hidden', opacity: fade}}>
      <AbsoluteFill style={{background: 'radial-gradient(900px 1000px at 34% 40%, rgba(48,102,136,0.34), transparent 72%)'}} />
      <div style={{position: 'absolute', inset: 0, transform: `scale(${z})`, transformOrigin: '52% 38%'}}>
        <div style={{position: 'absolute', left: 232, top: 176, width: 800, height: 1370}}>
          <DrElias
            expression={expression}
            look="monitor"
            mouth={mouth}
            turn={0.22}
            rim={1.3}
            screen={0.75}
            lidOverride={lid > 0.3 ? lid : undefined}
            viewBox="190 100 220 330"
            preserve="xMidYMid meet"
          />
        </div>
      </div>
      {/* he sinks into the dark at the bottom of frame */}
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 620, background: 'linear-gradient(180deg, rgba(3,6,10,0) 0%, rgba(3,6,10,0.7) 46%, #03060A 88%)'}} />
      {/* out-of-focus monitor in the near foreground, showing Noah */}
      <div style={{position: 'absolute', left: -180, top: 1130, width: 760, height: 1000, opacity: 0.5, filter: 'blur(16px)'}}>
        <div style={{position: 'absolute', inset: 0, background: '#05080C', border: '10px solid #080C11', overflow: 'hidden'}}>
          <div style={{position: 'absolute', inset: 0, filter: 'brightness(1.15)'}}>
            <CCTVScene f={f} mode="stand" grain={0} chrome={false} />
          </div>
        </div>
      </div>
      <div style={{position: 'absolute', left: -140, top: 700, width: 900, height: 900, background: 'radial-gradient(closest-side, rgba(118,182,216,0.2), transparent 72%)', mixBlendMode: 'screen'}} />
      <AbsoluteFill style={{background: 'radial-gradient(980px 1100px at 46% 40%, transparent 36%, rgba(0,0,0,0.74) 100%)'}} />
      <Grain f={f} opacity={0.06} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* the episode                                                         */
/* ------------------------------------------------------------------ */

export const Part5: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {f < C.amaraWide ? <CityShot f={f} /> : null}
      {f >= C.amaraWide && f < C.standing ? <AmaraWide f={f} /> : null}
      {f >= C.standing && f < C.falling ? <StandingShot f={f} /> : null}
      {f >= C.falling && f < C.dying ? <FallingShot f={f} /> : null}
      {f >= C.dying && f < C.numbers ? <DyingShot f={f} /> : null}
      {f >= C.numbers && f < C.eliasEnter ? <NumbersScene f={f} /> : null}
      {f >= C.eliasEnter && f < C.eliasSpeak ? <EliasEntrance f={f} /> : null}
      {f >= C.eliasSpeak && f < C.amaraAnswer ? (
        <EliasShot
          f={f}
          expression={f >= 846 && f < 906 ? 'speak' : 'cold'}
          mouth={talk(f, C.eliasLine, 906, 0.3, 3.1)}
        />
      ) : null}
      {f >= C.amaraAnswer && f < C.file ? <AmaraAnswer f={f} /> : null}
      {f >= C.file && f < C.subject ? <HandShot f={f} /> : null}
      {f >= C.subject && f < C.original ? <SubjectFile f={f} /> : null}
      {f >= C.original && f < C.copy ? <OriginalNoah f={f} /> : null}
      {f >= C.copy && f < C.apartment ? <CopyLab f={f} /> : null}
      {f >= C.apartment && f < C.phone ? <ApartmentShot f={f} /> : null}
      {f >= C.phone && f < C.eliasFinal ? <PhoneShot f={f} /> : null}
      {f >= C.eliasFinal ? <EliasFinal f={f} /> : null}
      <Watermark />
      <Audio src={staticFile('audio/pt5.mp3')} />
    </AbsoluteFill>
  );
};
