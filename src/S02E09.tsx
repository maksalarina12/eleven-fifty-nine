import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {Amara, AmaraBack} from './character/Amara';
import {Noah} from './character/Noah';
import {Cam} from './Episode';
import {Watermark, Scanlines, ScreenGlass, clamp01, smooth, blinkLid, talk, rnd, MONO} from './kit';
import {Night, Haze, Skyline, GlitchBars, Grade} from './kit2';
import {Chamber, Console, MapWall} from './kit3';

/* ------------------------------------------------------------------ */
/* S02E09 — THE EDEN PROTOCOL                                          */
/* 43.840 s of real narration -> 1315 frames. 14 shots.                */
/* Cuts on measured word boundaries (Whisper base.en).                 */
/* ------------------------------------------------------------------ */

const C = {
  s1: 0, // The awakened subjects flooded the chamber…
  s2: 72, // …but none tried to attack.
  s3: 159, // They were searching for an exit.
  s4: 230, // Amara found the protocol that controlled their doors.
  s5: 322, // It was called Eden.
  s6: 377, // The system offered her two choices.
  s7: 452, // Seal the chamber and preserve the network.
  s8: 532, // Or release the subjects and expose every city connected to it.
  s9: 667, // Noah watched her hand hover over the controls.
  s10: 750, // "If we are real enough to suffer…"
  s11: 909, // Amara pressed release.
  s12: 967, // Across the city, lights flickered in perfect sequence.
  s13: 1077, // A map appeared. One city became ten…
  s14: 1230, // Someone outside the laboratory accepted control.
  total: 1315,
};

const FADE = 1298;

/* a figure walking through the chamber, awake. a rimmed silhouette: one lit copy
   behind, the body itself dark, so the crowd reads without faces. */
const Walker: React.FC<{
  x: number;
  y: number;
  s?: number;
  lean?: number;
  rim?: number;
  warm?: number;
  flip?: boolean;
  blur?: number;
  opacity?: number;
}> = ({x, y, s = 1, lean = 0, rim = 0.7, warm = 0, flip = false, blur = 0, opacity = 1}) => {
  const tint = `rgba(${188 + warm * 40},${216 - warm * 34},${236 - warm * 70},0.55)`;
  const Shape: React.FC<{fill: string}> = ({fill}) => (
    <g fill={fill}>
      {/* head: skull, jaw, and a hair mass over the crown */}
      <path d="M 110 98 C 142 98 162 124 162 158 C 162 188 150 214 134 228 C 124 236 96 236 86 228 C 70 214 58 188 58 158 C 58 124 78 98 110 98 Z" />
      <path d="M 58 162 C 56 118 80 90 110 90 C 140 90 164 118 162 162 C 156 136 142 122 110 122 C 78 122 64 136 58 162 Z" />
      {/* neck */}
      <path d="M 94 226 L 98 268 L 124 268 L 128 226 Z" />
      {/* coat: shoulders that slope, sides that fall straight, hem out of frame */}
      <path d="M 110 250 C 150 256 180 284 190 334 L 198 430 L 194 560 L 26 560 L 22 430 L 30 334 C 40 284 70 256 110 250 Z" />
      {/* sleeves, cut into the coat as a groove each side */}
      <path d="M 58 344 L 46 560 L 62 560 L 72 348 Z" />
      <path d="M 162 344 L 174 560 L 158 560 L 148 348 Z" />
    </g>
  );
  return (
    <div style={{position: 'absolute', left: x, top: y, width: 220 * s, height: 560 * s, transform: `rotate(${lean}deg) ${flip ? 'scaleX(-1)' : ''}`, transformOrigin: '50% 100%', filter: blur > 0 ? `blur(${blur}px)` : undefined, opacity}}>
      <svg viewBox="0 0 220 560" width="100%" height="100%">
        <g transform="translate(9 -6)" opacity={0.3 * rim} style={{filter: 'blur(4px)'}}>
          <Shape fill={tint} />
        </g>
        <g transform="translate(5 -3)" opacity={0.55 * rim}>
          <Shape fill={tint} />
        </g>
        <Shape fill="#04080C" />
      </svg>
    </div>
  );
};

/* the door grid: a system screen, no words */
const DoorGrid: React.FC<{f: number; mode?: 'idle' | 'seal' | 'release'; show?: number}> = ({f, mode = 'idle', show = 1}) => (
  <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(90% 80% at 50% 42%, #07202C 0%, #040C12 66%, #02060A 100%)', opacity: show}}>
    {Array.from({length: 12}).map((_, i) => {
      const col = i % 4;
      const row = Math.floor(i / 4);
      const open = mode === 'release' ? 1 : 0;
      const sealed = mode === 'seal' ? 1 : 0;
      return (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: 96 + col * 222,
            top: 420 + row * 300,
            width: 186,
            height: 240,
            borderRadius: 10,
            background: 'linear-gradient(180deg, rgba(26,54,72,0.36), rgba(6,14,20,0.9))',
            boxShadow: 'inset 0 0 0 1.5px rgba(150,196,224,0.22)',
            overflow: 'hidden',
          }}
        >
          {/* the door leaf */}
          <div
            style={{
              position: 'absolute',
              left: 22,
              top: 22,
              width: 142,
              height: 196,
              background: open ? 'transparent' : 'linear-gradient(180deg,#122430,#050C12)',
              boxShadow: 'inset 0 0 0 1px rgba(150,196,224,0.14)',
            }}
          >
            {open ? (
              <div style={{position: 'absolute', inset: 8, background: 'linear-gradient(180deg, rgba(190,226,244,0.3), rgba(60,110,140,0.06))'}} />
            ) : null}
          </div>
          {/* status bar */}
          <div
            style={{
              position: 'absolute',
              left: 22,
              bottom: 12,
              width: 100,
              height: 5,
              background: sealed
                ? 'rgba(214,178,108,0.8)'
                : open
                ? 'rgba(140,214,236,0.8)'
                : `rgba(140,196,224,${0.2 + Math.sin(f / 24 + i) * 0.06})`,
            }}
          />
        </div>
      );
    })}
    <div style={{position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.3) 0 1px, transparent 1px 4px)', opacity: 0.4}} />
  </div>
);

/* ------------------------------------------------------------------ */
/* 01-03 — the chamber, wide awake                                     */
/* ------------------------------------------------------------------ */

const ShotFlood: React.FC<{f: number}> = ({f}) => (
  <Night f={f} glow="radial-gradient(900px 1000px at 50% 42%, rgba(30,68,94,0.42), rgba(2,5,10,0) 74)">
    <Cam z={1.02 + smooth(clamp01(f / 84)) * 0.05} ox="50%" oy="42%">
      <Chamber f={f} alert={0.2} awake={1} strip={0.4} />
      {/* a crowd walking through the beds, toward the lens */}
      {[
        {x: 20, y: 560, s: 0.62, lean: -2, r: 0.5},
        {x: 250, y: 610, s: 0.7, lean: 1, r: 0.7},
        {x: 500, y: 540, s: 0.66, lean: 2, r: 0.6},
        {x: 760, y: 640, s: 0.78, lean: -1, r: 0.8},
        {x: -80, y: 880, s: 1.05, lean: 1, r: 0.9},
        {x: 380, y: 940, s: 1.15, lean: -2, r: 1},
        {x: 720, y: 990, s: 1.25, lean: 0, r: 0.8},
      ].map((w, i) => (
        <Walker key={i} x={w.x} y={w.y} s={w.s} lean={w.lean} rim={w.r} />
      ))}
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(68% 60% at 50% 44%, transparent 34%, rgba(2,5,9,0.86) 100%)'}} />
    </Cam>
  </Night>
);

const ShotPass: React.FC<{f: number}> = ({f}) => (
  <Night f={f} glow="radial-gradient(820px 900px at 56% 40%, rgba(32,74,100,0.44), rgba(2,5,10,0) 72)">
    <Cam z={1.05 + smooth(clamp01((f - C.s2) / 76)) * 0.05} ox="56%" oy="38%">
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(178deg,#081019 0%,#05090F 60%,#02060A 100%)'}} />
      {/* Noah, standing still, as they pass him */}
      <div style={{position: 'absolute', left: 520, top: 560, width: 400, height: 1200, filter: 'brightness(0.86)'}}>
        <Noah expression="unease" look="left" turn={-0.1} rim={1.15} lidOverride={0.12} viewBox="150 20 300 560" preserve="xMidYMax slice" />
      </div>
      <Walker x={-60} y={660} s={1.15} lean={-2} rim={0.7} flip />
      <Walker x={210} y={780} s={1.35} lean={1} rim={0.9} />
      <Walker x={-150} y={1140} s={1.8} lean={0} rim={0.45} />
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(64% 58% at 54% 42%, transparent 28%, rgba(2,5,9,0.9) 100%)'}} />
    </Cam>
  </Night>
);

const ShotDoorway: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s3;
  return (
    <Night f={f} glow="radial-gradient(760px 900px at 62% 40%, rgba(44,86,112,0.48), rgba(2,5,10,0) 72)">
      <Cam z={1.03 + smooth(clamp01(k / 128)) * 0.06} ox="60%" oy="38%">
        {/* the exit they are looking for: a seam of light at the far end */}
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(178deg,#070E15,#03070B)'}} />
        <div style={{position: 'absolute', left: 660, top: 300, width: 340, height: 1440, background: 'linear-gradient(180deg, rgba(190,226,244,0.24), rgba(60,110,140,0.05))', filter: 'blur(10px)'}} />
        <div style={{position: 'absolute', left: 640, top: 280, width: 380, height: 1500, boxShadow: 'inset 0 0 100px rgba(0,0,0,0.7)'}} />
        {/* the crowd pressed against it */}
        {[
          {x: 300, y: 520, s: 0.5, lean: -1, r: 0.5, b: 3.4, o: 0.55, f: false},
          {x: 392, y: 470, s: 0.52, lean: 1, r: 0.55, b: 3.2, o: 0.6, f: true},
          {x: 470, y: 540, s: 0.56, lean: 0, r: 0.6, b: 2.8, o: 0.66, f: false},
          {x: 560, y: 480, s: 0.58, lean: -1, r: 0.62, b: 2.6, o: 0.7, f: true},
          {x: 646, y: 520, s: 0.6, lean: 1, r: 0.66, b: 2.4, o: 0.74, f: false},
          {x: 730, y: 486, s: 0.6, lean: -2, r: 0.6, b: 2.4, o: 0.7, f: true},
          {x: 806, y: 546, s: 0.56, lean: 1, r: 0.55, b: 2.8, o: 0.64, f: false},
          {x: 356, y: 660, s: 0.74, lean: 1, r: 0.7, b: 1.8, o: 0.82, f: true},
          {x: 470, y: 700, s: 0.8, lean: -1, r: 0.78, b: 1.4, o: 0.86, f: false},
          {x: 588, y: 664, s: 0.82, lean: 0, r: 0.85, b: 1.2, o: 0.9, f: true},
          {x: 700, y: 706, s: 0.8, lean: 2, r: 0.8, b: 1.4, o: 0.86, f: false},
          {x: 790, y: 650, s: 0.76, lean: -1, r: 0.7, b: 1.8, o: 0.8, f: true},
          {x: 288, y: 880, s: 1.02, lean: -1, r: 0.7, b: 1.0, o: 0.92, f: false},
          {x: 470, y: 900, s: 1.1, lean: 1, r: 0.9, b: 0.6, o: 0.96, f: true},
          {x: 660, y: 930, s: 1.14, lean: -1, r: 1.0, b: 0.4, o: 1, f: false},
          {x: 806, y: 1010, s: 1.28, lean: 1, r: 1.1, b: 0, o: 1, f: true},
          {x: 150, y: 1090, s: 1.34, lean: -2, r: 0.5, b: 0.8, o: 0.9, f: false},
        ].map((w, i) => (
          <Walker key={i} x={w.x} y={w.y} s={w.s} lean={w.lean} rim={w.r} blur={w.b} opacity={w.o} flip={w.f} />
        ))}
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(62% 56% at 58% 42%, transparent 26%, rgba(2,5,9,0.92) 100%)'}} />
      </Cam>
    </Night>
  );
};

/* ------------------------------------------------------------------ */
/* 04-08 — the protocol, the choices                                   */
/* ------------------------------------------------------------------ */

const ScreenFrame: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div style={{position: 'absolute', inset: 0, background: '#02060A'}}>
    <div style={{position: 'absolute', left: 60, right: 60, top: 220, bottom: 240, borderRadius: 16, overflow: 'hidden', background: '#040C12', boxShadow: '0 40px 100px rgba(0,0,0,0.9), inset 0 0 0 2px rgba(150,196,224,0.2)'}}>
      {children}
      <ScreenGlass strength={0.5} />
    </div>
    <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(70% 64% at 50% 46%, transparent 40%, rgba(2,5,9,0.86) 100%)'}} />
  </div>
);

const ShotProtocol: React.FC<{f: number}> = ({f}) => (
  <Night f={f} glow="radial-gradient(860px 900px at 50% 44%, rgba(30,76,104,0.44), rgba(2,5,10,0) 72)">
    <Cam z={1.02 + smooth(clamp01((f - C.s4) / 92)) * 0.05} ox="50%" oy="42%">
      <ScreenFrame>
        <DoorGrid f={f} mode="idle" />
      </ScreenFrame>
      {/* her hand at the edge of the panel, sleeve in frame */}
      <div style={{position: 'absolute', right: -130, bottom: 120, width: 520, height: 520, transform: 'rotate(-22deg)', transformOrigin: '100% 100%'}}>
        <div style={{position: 'absolute', left: 120, top: 170, width: 460, height: 220, borderRadius: 100, background: 'linear-gradient(180deg,#39454F,#222C35 56%,#0D1319)'}} />
        <div style={{position: 'absolute', left: 0, top: 190, width: 190, height: 190, borderRadius: '70px 50px 40px 60px', background: 'linear-gradient(160deg,#755C48,#4A382B 58%,#271E17)'}} />
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{position: 'absolute', left: -30 + i * 6, top: 130 + i * 52, width: 120, height: 46, borderRadius: 23, background: 'linear-gradient(160deg,#755C48,#392A20)'}} />
        ))}
      </div>
    </Cam>
  </Night>
);

const ShotEden: React.FC<{f: number}> = ({f}) => (
  <Night f={f} glow="radial-gradient(820px 900px at 50% 46%, rgba(34,80,108,0.46), rgba(2,5,10,0) 72)">
    <Cam z={1.04 + smooth(clamp01((f - C.s5) / 55)) * 0.05} ox="50%" oy="44%">
      <div style={{position: 'absolute', inset: 0, background: '#03080D'}} />
      {/* the protocol's mark: a ring of doors around a single point */}
      <div style={{position: 'absolute', left: 540, top: 900, width: 0, height: 0}}>
        {Array.from({length: 22}).map((_, i) => {
          const a = (i / 22) * Math.PI * 2;
          const r = 300 + Math.sin(f / 26 + i) * 8;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: Math.cos(a) * r - 7,
                top: Math.sin(a) * r - 7,
                width: 14,
                height: 14,
                borderRadius: '50%',
                background: `rgba(160,222,246,${0.3 + Math.sin(f / 20 + i * 2) * 0.2})`,
                boxShadow: '0 0 20px rgba(150,214,240,0.5)',
              }}
            />
          );
        })}
        {[0, 1, 2].map((i) => {
          const p = ((f * 0.9 + i * 24) % 66) / 66;
          const r = 40 + p * 330;
          return (
            <div key={i} style={{position: 'absolute', left: -r, top: -r, width: r * 2, height: r * 2, borderRadius: '50%', border: `1.5px solid rgba(150,214,240,${(1 - p) * 0.3})`}} />
          );
        })}
        <div style={{position: 'absolute', left: -34, top: -34, width: 68, height: 68, borderRadius: '50%', background: 'rgba(200,236,252,0.9)', boxShadow: '0 0 90px rgba(170,224,250,0.7)'}} />
        {/* the door icon inside the point */}
        <div style={{position: 'absolute', left: -11, top: -15, width: 22, height: 30, borderRadius: 3, background: '#061019', boxShadow: 'inset 0 0 0 1.5px rgba(10,30,42,0.9)'}} />
      </div>
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(62% 56% at 50% 46%, transparent 22%, rgba(2,5,9,0.94) 100%)'}} />
    </Cam>
  </Night>
);

const ShotTwoChoices: React.FC<{f: number}> = ({f}) => (
  <Night f={f} glow="radial-gradient(900px 900px at 50% 44%, rgba(32,70,96,0.42), rgba(2,5,10,0) 72)">
    <Cam z={1.01 + smooth(clamp01((f - C.s6) / 76)) * 0.04} ox="50%" oy="44%">
      <div style={{position: 'absolute', inset: 0, background: '#02060A'}} />
      {/* two panels, one warm and closed, one cold and open */}
      <div style={{position: 'absolute', left: 66, top: 420, width: 444, height: 980, borderRadius: 12, overflow: 'hidden', background: 'radial-gradient(90% 80% at 50% 40%, #1A1610 0%, #08090A 72%)', boxShadow: 'inset 0 0 0 2px rgba(214,178,108,0.3), 0 30px 80px rgba(0,0,0,0.8)'}}>
        {Array.from({length: 4}).map((_, i) => (
          <div key={i} style={{position: 'absolute', left: 46 + (i % 2) * 200, top: 120 + Math.floor(i / 2) * 260, width: 150, height: 200, borderRadius: 6, background: 'linear-gradient(180deg,#2A2418,#0B0A08)', boxShadow: 'inset 0 0 0 1px rgba(214,178,108,0.2)'}}>
            <div style={{position: 'absolute', left: 20, top: 60, width: 110, height: 5, background: 'rgba(222,190,128,0.5)'}} />
          </div>
        ))}
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 240, background: 'radial-gradient(closest-side, rgba(214,178,108,0.14), transparent 74%)'}} />
      </div>
      <div style={{position: 'absolute', left: 570, top: 420, width: 444, height: 980, borderRadius: 12, overflow: 'hidden', background: 'radial-gradient(90% 80% at 50% 40%, #082330 0%, #040B11 72%)', boxShadow: 'inset 0 0 0 2px rgba(150,214,240,0.34), 0 30px 80px rgba(0,0,0,0.8)'}}>
        {Array.from({length: 4}).map((_, i) => (
          <div key={i} style={{position: 'absolute', left: 46 + (i % 2) * 200, top: 120 + Math.floor(i / 2) * 260, width: 150, height: 200, borderRadius: 6, background: 'linear-gradient(180deg, rgba(180,222,244,0.22), rgba(6,16,24,0.6))', boxShadow: 'inset 0 0 0 1px rgba(150,214,240,0.24)'}}>
            <div style={{position: 'absolute', left: 20, top: 60, width: 110, height: 5, background: 'rgba(190,230,248,0.6)'}} />
          </div>
        ))}
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 240, background: 'radial-gradient(closest-side, rgba(150,214,240,0.18), transparent 74%)'}} />
      </div>
      {/* the two lights on the decision maker, bottom centre */}
      <div style={{position: 'absolute', left: 320, top: 1300, width: 440, height: 420, background: 'radial-gradient(closest-side, rgba(214,178,108,0.16), transparent 74%)', filter: 'blur(30px)'}} />
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(72% 64% at 50% 46%, transparent 42%, rgba(2,5,9,0.84) 100%)'}} />
    </Cam>
  </Night>
);

const ShotSeal: React.FC<{f: number}> = ({f}) => (
  <Night f={f} glow="radial-gradient(760px 860px at 50% 44%, rgba(60,50,36,0.44), rgba(2,5,10,0) 72)">
    <Cam z={1.03 + smooth(clamp01((f - C.s7) / 76)) * 0.05} ox="50%" oy="42%">
      <ScreenFrame>
        <DoorGrid f={f} mode="seal" />
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(214,178,108,0.1), transparent 40%)', mixBlendMode: 'screen'}} />
      </ScreenFrame>
    </Cam>
  </Night>
);

const ShotReleaseChoice: React.FC<{f: number}> = ({f}) => (
  <Night f={f} glow="radial-gradient(800px 880px at 50% 44%, rgba(34,80,108,0.46), rgba(2,5,10,0) 72)">
    <Cam z={1.03 + smooth(clamp01((f - C.s8) / 130)) * 0.06} ox="50%" oy="42%">
      <ScreenFrame>
        <DoorGrid f={f} mode="release" />
        {/* the city beyond the doors, lit by the same release */}
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 420, opacity: 0.6}}>
          <Skyline f={f} dim={0.5} near={0.8} />
        </div>
        <GlitchBars f={f} amount={0.12} seed={5} />
      </ScreenFrame>
    </Cam>
  </Night>
);

/* ------------------------------------------------------------------ */
/* 09-10 — her hand, his question                                      */
/* ------------------------------------------------------------------ */

const ShotHover: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s9;
  const hover = smooth(clamp01(k / 40));
  return (
    <Night f={f} glow="radial-gradient(860px 900px at 50% 50%, rgba(28,64,88,0.44), rgba(2,5,10,0) 72)">
      <Cam z={1.03 + smooth(clamp01(k / 76)) * 0.05} ox="48%" oy="52%">
        <Console f={f} hand={0.15 + hover * 0.2} open={1} />
        {/* Noah, behind her shoulder, watching */}
        <div style={{position: 'absolute', left: -300, top: 160, width: 720, height: 1400, filter: 'brightness(0.62) blur(1.5px)'}}>
          <Noah expression="dread" look="right" turn={0.3} rim={0.9} lidOverride={0.18} viewBox="150 30 300 560" preserve="xMidYMax slice" />
        </div>
        {/* the light of the controls under her hand */}
        <div style={{position: 'absolute', left: 360, top: 1180, width: 620, height: 520, background: `radial-gradient(closest-side, rgba(150,206,236,${0.14 + hover * 0.1}), transparent 74%)`, filter: 'blur(30px)', mixBlendMode: 'screen'}} />
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(70% 60% at 50% 52%, transparent 36%, rgba(2,5,9,0.84) 100%)'}} />
      </Cam>
    </Night>
  );
};

const ShotRealEnough: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s10;
  return (
    <Night f={f} glow="radial-gradient(760px 900px at 46% 40%, rgba(34,70,94,0.44), rgba(2,5,10,0) 72)">
      <Cam z={1.04 + smooth(clamp01(k / 150)) * 0.06} ox="46%" oy="36%">
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(178deg,#08111A,#04080D 68%)'}} />
        <div style={{position: 'absolute', left: 620, top: 300, width: 360, height: 1300, background: 'linear-gradient(180deg, rgba(150,200,228,0.14), rgba(40,70,96,0.03))', filter: 'blur(14px)'}} />
        <div style={{position: 'absolute', left: 80, top: 200, width: 800, height: 1660}}>
          <Noah
            expression="unease"
            look="camera"
            mouth={talk(f, C.s10 + 6, C.s11 - 8, 0.22, 2.6)}
            turn={-0.08}
            rim={1.2}
            lidOverride={blinkLid(f, 790)}
            viewBox="160 24 280 480"
            preserve="xMidYMax slice"
          />
        </div>
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(64% 58% at 46% 38%, transparent 28%, rgba(2,5,9,0.9) 100%)'}} />
      </Cam>
    </Night>
  );
};

/* ------------------------------------------------------------------ */
/* 11-14 — release                                                     */
/* ------------------------------------------------------------------ */

const ShotPress: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s11;
  const press = smooth(clamp01((k - 10) / 14));
  return (
    <Night f={f} glow="radial-gradient(820px 860px at 52% 52%, rgba(28,66,90,0.44), rgba(2,5,10,0) 72)">
      <Cam z={1.06 + smooth(clamp01(k / 58)) * 0.05} ox="52%" oy="52%">
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(178deg,#071018,#04080D 66%)'}} />
        {/* the desk and the one big switch */}
        <div style={{position: 'absolute', left: 0, right: 0, top: 1060, bottom: 0, background: 'linear-gradient(180deg,#1A242E,#0A1117 52%,#050A10)'}} />
        <div style={{position: 'absolute', left: 0, right: 0, top: 1060, height: 6, background: 'rgba(170,206,228,0.22)'}} />
        <div style={{position: 'absolute', left: 340, top: 1140, width: 400, height: 300, borderRadius: 16, background: 'linear-gradient(170deg,#212D37,#0A1017)', boxShadow: 'inset 0 0 0 2px rgba(150,186,212,0.14)'}}>
          <div style={{position: 'absolute', left: 90, top: 40, width: 220, height: 200, borderRadius: 10, background: 'linear-gradient(180deg,#0C1620,#050A0F)', boxShadow: 'inset 0 0 0 1px rgba(150,196,224,0.14)'}}>
            <div style={{position: 'absolute', left: 26, top: 24, width: 168, height: 10, borderRadius: 5, background: `rgba(226,118,92,${0.3 + press * 0.6})`, boxShadow: press > 0.2 ? `0 0 ${30 * press}px rgba(226,118,92,0.6)` : 'none'}} />
            <div style={{position: 'absolute', left: 26, top: 52, width: 120, height: 5, borderRadius: 3, background: 'rgba(150,196,224,0.16)'}} />
          </div>
          {/* the lever, thrown down */}
          <div style={{position: 'absolute', left: 176, top: -60, width: 46, height: 190, borderRadius: 12, background: 'linear-gradient(180deg,#46535E,#1A232B)', transform: `rotate(${press * 34}deg)`, transformOrigin: '50% 100%'}} />
        </div>
        {/* her arm and hand, pressing */}
        <div style={{position: 'absolute', right: -100, top: 780, width: 720, height: 800, transform: `rotate(${-10 + press * 4}deg)`, transformOrigin: '100% 100%'}}>
          <div style={{position: 'absolute', right: -40, top: 120, width: 620, height: 340, borderRadius: 120, background: 'linear-gradient(180deg,#3A4650,#222C35 54%,#0C1218)'}} />
          <div style={{position: 'absolute', left: 26, top: 150, width: 190, height: 260, borderRadius: '80px 60px 40px 60px', background: 'linear-gradient(160deg,#755C48,#4A382B 58%,#271E17)'}} />
          {[0, 1, 2, 3].map((i) => (
            <div key={i} style={{position: 'absolute', left: -40 + i * 8, top: 120 + i * 62, width: 130, height: 50, borderRadius: 25, background: 'linear-gradient(160deg,#755C48,#392A20)'}} />
          ))}
          {/* cuff */}
          <div style={{position: 'absolute', right: 90, top: 120, width: 90, height: 340, borderRadius: 20, background: 'linear-gradient(180deg,#2A353F,#0E151B)'}} />
        </div>
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(66% 58% at 54% 54%, transparent 30%, rgba(2,5,9,0.88) 100%)'}} />
      </Cam>
    </Night>
  );
};

const ShotCityLights: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s12;
  const seq = smooth(clamp01(k / 90));
  return (
    <Night f={f} glow="radial-gradient(1000px 900px at 50% 30%, rgba(30,66,94,0.44), rgba(2,5,10,0) 74)">
      <Cam z={1.01 + seq * 0.05} ox="50%" oy="30%">
        <Skyline f={f} dim={0.42} />
        {/* the sequence: a wave of light crossing the city */}
        <div
          style={{
            position: 'absolute',
            left: `${-30 + seq * 130}%`,
            top: 0,
            width: '48%',
            height: '100%',
            background: 'linear-gradient(100deg, transparent, rgba(190,226,246,0.16), transparent)',
            mixBlendMode: 'screen',
          }}
        />
        {Array.from({length: 14}).map((_, i) => {
          const on = clamp01((seq * 20 - i) / 2);
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 60 + rnd(i) * 940,
                top: 620 + rnd(i + 4) * 900,
                width: 10 + rnd(i + 2) * 22,
                height: 6,
                background: `rgba(226,244,252,${0.1 + on * 0.7})`,
                boxShadow: on > 0.4 ? '0 0 18px rgba(200,236,252,0.5)' : 'none',
              }}
            />
          );
        })}
        {/* the window frame we are looking through */}
        <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 120, background: 'linear-gradient(180deg,#05090E,rgba(5,9,14,0))'}} />
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 300, background: 'linear-gradient(180deg, transparent, #04080D)'}} />
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 210, height: 12, background: 'rgba(20,34,44,0.9)'}} />
      </Cam>
    </Night>
  );
};

const ShotMap: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s13;
  const spread = smooth(clamp01((k - 30) / 140));
  return (
    <Night f={f} glow="radial-gradient(900px 1000px at 50% 46%, rgba(30,76,104,0.46), rgba(2,5,10,0) 72)">
      <Cam z={1.02 + spread * 0.07} ox="50%" oy="46%">
        <MapWall f={f} reveal={1} spread={0.25 + spread * 0.75} tint="rgba(150,214,240,0.9)" rings={spread} />
        {/* waves leaving the origin */}
        {[0, 1, 2].map((i) => {
          const p = ((f * 1.2 + i * 32) % 90) / 90;
          const r = 60 + p * 720;
          return <div key={i} style={{position: 'absolute', left: 540 - r, top: 900 - r, width: r * 2, height: r * 2, borderRadius: '50%', border: `1.5px solid rgba(150,214,240,${(1 - p) * 0.26 * spread})`}} />;
        })}
        {/* Amara and Noah, small, in front of the wall */}
        <div style={{position: 'absolute', left: 120, top: 1300, width: 300, height: 660, filter: 'brightness(0.5) blur(1px)'}}>
          <AmaraBack rim={0.8} viewBox="0 0 300 700" preserve="xMidYMax slice" />
        </div>
        <div style={{position: 'absolute', left: 380, top: 1340, width: 250, height: 600, filter: 'brightness(0.45) blur(1px)'}}>
          <svg viewBox="0 0 250 600" width="100%" height="100%">
            <path d="M 62 600 L 66 340 C 70 292 88 268 125 260 C 162 268 180 292 184 340 L 188 600 Z" fill="#050A0F" />
            <ellipse cx={125} cy={214} rx={60} ry={68} fill="#04080C" />
            <path d="M 66 340 C 70 292 88 268 125 260" stroke="rgba(150,196,224,0.3)" strokeWidth={3} fill="none" />
          </svg>
        </div>
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(70% 62% at 50% 46%, transparent 34%, rgba(2,5,9,0.88) 100%)'}} />
      </Cam>
    </Night>
  );
};

const ShotAccepted: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s14;
  const accept = smooth(clamp01(k / 40));
  return (
    <Night f={f} glow="radial-gradient(800px 900px at 62% 42%, rgba(44,72,96,0.46), rgba(2,5,10,0) 72)">
      <Cam z={1.04 + accept * 0.04} ox="60%" oy="40%">
        <MapWall f={f} reveal={1} spread={1} tint="rgba(226,180,110,0.9)" rings={0} />
        {/* the far node, accepting */}
        <div style={{position: 'absolute', left: 760, top: 780, width: 260, height: 260, borderRadius: '50%', border: `2px solid rgba(226,180,110,${0.2 + accept * 0.5})`, boxShadow: `0 0 ${70 * accept}px rgba(226,180,110,${0.3 * accept})`, transform: `scale(${0.6 + accept * 0.5})`}} />
        <div style={{position: 'absolute', left: 868, top: 888, width: 44, height: 44, borderRadius: '50%', background: `rgba(240,204,148,${0.3 + accept * 0.7})`, boxShadow: `0 0 60px rgba(230,190,130,${0.6 * accept})`}} />
        {/* somebody outside the lab, at their own desk, only a silhouette */}
        <div style={{position: 'absolute', right: -160, bottom: -60, width: 640, height: 900, filter: 'brightness(0.4) blur(2px)'}}>
          <svg viewBox="0 0 300 700" width="100%" height="100%">
            <path d="M 60 700 L 66 380 C 70 320 92 292 130 284 C 168 292 190 320 194 380 L 200 700 Z" fill="#04080C" />
            <ellipse cx={130} cy={214} rx={66} ry={74} fill="#03060A" />
            <path d="M 66 380 C 70 320 92 292 130 284" stroke="rgba(230,196,144,0.5)" strokeWidth={4} fill="none" />
            <path d="M 68 214 C 70 148 96 128 130 128 C 164 128 190 148 192 214" stroke="rgba(230,196,144,0.24)" strokeWidth={3} fill="none" />
          </svg>
        </div>
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(66% 58% at 54% 44%, transparent 30%, rgba(2,5,9,0.9) 100%)'}} />
      </Cam>
    </Night>
  );
};

/* ------------------------------------------------------------------ */

export const S02E09: React.FC = () => {
  const f = useCurrentFrame();
  const shot =
    f < C.s2 ? (
      <ShotFlood f={f} />
    ) : f < C.s3 ? (
      <ShotPass f={f} />
    ) : f < C.s4 ? (
      <ShotDoorway f={f} />
    ) : f < C.s5 ? (
      <ShotProtocol f={f} />
    ) : f < C.s6 ? (
      <ShotEden f={f} />
    ) : f < C.s7 ? (
      <ShotTwoChoices f={f} />
    ) : f < C.s8 ? (
      <ShotSeal f={f} />
    ) : f < C.s9 ? (
      <ShotReleaseChoice f={f} />
    ) : f < C.s10 ? (
      <ShotHover f={f} />
    ) : f < C.s11 ? (
      <ShotRealEnough f={f} />
    ) : f < C.s12 ? (
      <ShotPress f={f} />
    ) : f < C.s13 ? (
      <ShotCityLights f={f} />
    ) : f < C.s14 ? (
      <ShotMap f={f} />
    ) : (
      <ShotAccepted f={f} />
    );

  return (
    <AbsoluteFill style={{background: '#02050A'}}>
      <Audio src={staticFile('audio/s02e09.mp3')} />
      <Grade lift={1.45} contrast={1.04}>{shot}</Grade>
      {/* black tail: the film ends in black, and it ends inside the audio */}
      <AbsoluteFill
        style={{background: '#000', opacity: smooth(clamp01((f - (C.total - 26)) / 13))}}
      />
      {f < C.total - 26 ? <Watermark /> : null}
    </AbsoluteFill>
  );
};
