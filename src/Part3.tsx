import React from 'react';
import {AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Noah} from './character/Noah';
import {Cam, Grain, Vignette, Room, blinkAt, FLOOR, NOAH_H, NOAH_W} from './Episode';

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const smooth = (v: number) => {
  const t = clamp01(v);
  return t * t * (3 - 2 * t);
};

/* ------------------------------------------------------------------ */
/* phone shell + screens                                               */
/* ------------------------------------------------------------------ */

const Phone: React.FC<{
  f: number;
  children: React.ReactNode;
  clock?: string;
  title?: string;
  sub?: string;
  rotate?: number;
  push?: number;
  glow?: number;
}> = ({f, children, clock = '11:59', title = 'MESSAGES', sub = 'UNKNOWN NUMBER', rotate = -2.2, push = 0, glow = 0.55}) => {
  const pulse = glow + Math.sin(f / 9) * 0.05;
  return (
    <AbsoluteFill style={{background: '#04060A', overflow: 'hidden'}}>
      <AbsoluteFill style={{background: 'radial-gradient(760px 920px at 50% 46%, rgba(40,72,104,0.55), transparent 70%), radial-gradient(520px 620px at 20% 82%, rgba(196,124,72,0.10), transparent 70%), linear-gradient(180deg,#070A0F,#04060A)'}} />
      <div style={{position: 'absolute', left: '50%', top: '46%', width: 720, height: 1000, marginLeft: -360, marginTop: -500, borderRadius: '50%', background: `radial-gradient(circle, rgba(96,150,200,${0.28 * pulse}), transparent 65%)`, filter: 'blur(42px)'}} />
      <div style={{position: 'absolute', left: '50%', top: '50%', width: 566, height: 1120, marginLeft: -283, marginTop: -560, transform: `scale(${1 + push * 0.05}) rotate(${rotate}deg)`}}>
        <div style={{position: 'absolute', inset: 0, borderRadius: 84, background: 'linear-gradient(150deg,#1A1E24,#07090C 42%,#040507)', boxShadow: '0 40px 120px rgba(0,0,0,0.9), 0 0 90px rgba(90,142,186,0.22)'}}>
          <div style={{position: 'absolute', inset: 10, borderRadius: 76, background: '#04060A', overflow: 'hidden'}}>
            <div style={{position: 'absolute', inset: 6, borderRadius: 70, background: 'linear-gradient(175deg,#0B1420 0%,#070C13 55%,#05080D 100%)', overflow: 'hidden'}}>
              <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 320, background: 'linear-gradient(180deg, rgba(70,118,158,0.22), transparent)'}} />
              <div style={{position: 'absolute', left: 46, top: 74, right: 46, display: 'flex', justifyContent: 'space-between', fontFamily: 'Helvetica, Arial, sans-serif', fontSize: 24, color: 'rgba(232,240,248,0.62)'}}>
                <span>{clock}</span>
                <span>▮▮▮</span>
              </div>
              <div style={{position: 'absolute', left: 0, right: 0, top: 138, textAlign: 'center', fontFamily: 'Helvetica, Arial, sans-serif', fontSize: 26, letterSpacing: '0.18em', color: 'rgba(196,214,230,0.55)'}}>
                {title}
              </div>
              <div style={{position: 'absolute', left: 46, right: 46, top: 196, height: 1, background: 'rgba(150,186,214,0.14)'}} />
              {sub ? (
                <div style={{position: 'absolute', left: 46, top: 232, fontFamily: 'Helvetica, Arial, sans-serif', fontSize: 23, letterSpacing: '0.16em', color: 'rgba(170,196,220,0.5)'}}>
                  {sub}
                </div>
              ) : null}
              {children}
              <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(122deg, rgba(255,255,255,0.10) 0%, transparent 38%, transparent 62%, rgba(160,200,230,0.06) 100%)'}} />
            </div>
          </div>
          <div style={{position: 'absolute', left: '50%', top: 22, width: 150, height: 26, marginLeft: -75, borderRadius: 14, background: '#04060A'}} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Bubble: React.FC<{children: React.ReactNode; top?: number; tone?: string}> = ({
  children,
  top = 300,
  tone = 'linear-gradient(160deg,#1B2733,#111A24)',
}) => (
  <div style={{position: 'absolute', left: 46, right: 60, top, padding: '40px 36px', borderRadius: '8px 34px 34px 34px', background: tone, border: '1px solid rgba(150,190,220,0.12)', boxShadow: '0 12px 40px rgba(0,0,0,0.5)'}}>
    {children}
  </div>
);

const FinalMsg: React.FC<{f: number; push?: number}> = ({f, push = 0}) => (
  <Phone f={f} push={push} clock="11:59" rotate={-1.4}>
    <Bubble top={286} tone="linear-gradient(160deg,#221C22,#131118)">
      <div style={{fontFamily: 'Helvetica, Arial, sans-serif', fontWeight: 500, fontSize: 46, lineHeight: 1.26, letterSpacing: '0.02em', color: '#F3EEE6'}}>
        YOU&apos;RE NOT
        <br />
        THE FIRST
        <br />
        NOAH.
      </div>
    </Bubble>
    <div style={{position: 'absolute', left: 46, bottom: 90, fontFamily: 'Helvetica, Arial, sans-serif', fontSize: 21, letterSpacing: '0.14em', color: 'rgba(176,150,150,0.35)'}}>
      UNKNOWN NUMBER
    </div>
  </Phone>
);

const RecList: React.FC<{f: number; tapped: number}> = ({f, tapped}) => {
  const rows = [
    {name: 'HALLWAY · CAM 01', dur: '00:43', stamp: '12:00 AM', on: true},
    {name: 'HALLWAY · CAM 01', dur: '00:12', stamp: '11:41 PM', on: false},
    {name: 'FRONT DOOR', dur: '00:04', stamp: '11:58 PM', on: false},
  ];
  return (
    <Phone f={f} clock="11:59" title="RECORDINGS" sub="ARCHIVE · 3 CLIPS">
      <div style={{position: 'absolute', left: 46, top: 274, display: 'flex', gap: 34, fontFamily: 'Helvetica, Arial, sans-serif', fontSize: 21, letterSpacing: '0.16em'}}>
        <span style={{color: 'rgba(150,178,204,0.35)'}}>LIVE</span>
        <span style={{color: '#9FD0EE', borderBottom: '2px solid #9FD0EE', paddingBottom: 8}}>RECORDINGS</span>
      </div>
      {rows.map((r, i) => {
        const top = 356 + i * 128;
        const active = r.on && tapped > 0.45;
        return (
          <div
            key={r.name + i}
            style={{
              position: 'absolute',
              left: 36,
              right: 36,
              top,
              height: 112,
              borderRadius: 22,
              background: active ? 'linear-gradient(160deg,rgba(48,86,118,0.62),rgba(20,34,48,0.62))' : 'rgba(24,36,48,0.42)',
              border: active ? '1px solid rgba(140,196,232,0.35)' : '1px solid rgba(150,190,220,0.10)',
              padding: '20px 24px',
            }}
          >
            <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: 'Helvetica, Arial, sans-serif', fontSize: 23, letterSpacing: '0.08em', color: active ? '#DCEBF7' : 'rgba(210,226,240,0.64)'}}>
              <span>{r.name}</span>
              <span style={{color: active ? '#9FD0EE' : 'rgba(180,204,224,0.4)'}}>{r.dur}</span>
            </div>
            <div style={{marginTop: 10, display: 'flex', alignItems: 'center', gap: 12, fontFamily: 'Helvetica, Arial, sans-serif', fontSize: 19, letterSpacing: '0.1em', color: active ? 'rgba(190,224,245,0.8)' : 'rgba(170,196,220,0.36)'}}>
              <span style={{width: 16, height: 16, borderRadius: 3, background: active ? '#9FD0EE' : 'rgba(150,180,204,0.4)', clipPath: 'polygon(0 0, 100% 50%, 0 100%)'}} />
              <span>{r.stamp}</span>
            </div>
          </div>
        );
      })}
      {tapped > 0.02 ? (
        <div style={{position: 'absolute', left: 267 - 70 * (1 + tapped * 2), top: 412 - 70 * (1 + tapped * 2), width: 140 * (1 + tapped * 2), height: 140 * (1 + tapped * 2), borderRadius: '50%', border: `2px solid rgba(150,205,240,${0.4 * (1 - tapped)})`, opacity: 1 - tapped}} />
      ) : null}
      {tapped > 0.35 ? (
        <div style={{position: 'absolute', left: 36, right: 36, top: 356, height: 112, borderRadius: 22, boxShadow: 'inset 0 0 0 1px rgba(150,205,240,0.35)'}} />
      ) : null}
    </Phone>
  );
};

const LockScreen: React.FC<{f: number; push?: number; bare?: boolean; x?: number; y?: number; scale?: number}> = ({f, push = 0, bare = false, x = 0, y = 0, scale = 1}) => {
  const body = (
    <div style={{position: 'absolute', left: '50%', top: '58%', width: 566, height: 1120, marginLeft: -283, marginTop: -560, transform: `translate(${x}px, ${y}px) scale(${(1 + push * 0.04) * scale}) rotate(-1.6deg)`}}>
      <div style={{position: 'absolute', inset: 0, borderRadius: 84, background: 'linear-gradient(150deg,#1A1E24,#07090C 42%,#040507)', boxShadow: '0 40px 120px rgba(0,0,0,0.92), 0 0 90px rgba(90,142,186,0.20)'}}>
        <div style={{position: 'absolute', inset: 10, borderRadius: 76, background: '#04060A', overflow: 'hidden'}}>
          <div style={{position: 'absolute', inset: 6, borderRadius: 70, background: 'linear-gradient(178deg,#0A1A2A 0%,#071120 48%,#04080D 100%)', overflow: 'hidden'}}>
            <div style={{position: 'absolute', left: 0, right: 0, top: 430, height: 260, background: 'linear-gradient(180deg, rgba(120,170,210,0.10), transparent)'}} />
            <div style={{position: 'absolute', left: 46, top: 74, right: 46, display: 'flex', justifyContent: 'space-between', fontFamily: 'Helvetica, Arial, sans-serif', fontSize: 24, color: 'rgba(232,240,248,0.6)'}}>
              <span>11:59</span>
              <span>▮▮▮</span>
            </div>
            <div style={{position: 'absolute', left: 0, right: 0, top: 300, textAlign: 'center', fontFamily: 'Helvetica, Arial, sans-serif', fontSize: 24, letterSpacing: '0.22em', color: 'rgba(190,214,232,0.5)'}}>
              MONDAY, NOVEMBER 10
            </div>
            <div style={{position: 'absolute', left: 0, right: 0, top: 372, textAlign: 'center', fontFamily: 'Helvetica, Arial, sans-serif', fontSize: 214, fontWeight: 200, letterSpacing: '-0.02em', color: '#F2F7FC', textShadow: '0 0 60px rgba(130,180,220,0.35)'}}>
              11:59
            </div>
            <div style={{position: 'absolute', left: 0, right: 0, top: 598, textAlign: 'center', fontFamily: 'Helvetica, Arial, sans-serif', fontSize: 30, letterSpacing: '0.3em', color: 'rgba(196,218,236,0.6)'}}>
              PM
            </div>
            <div style={{position: 'absolute', left: 54, right: 54, top: 760, borderRadius: 26, padding: '26px 28px', background: 'rgba(28,42,56,0.55)', border: '1px solid rgba(150,190,220,0.14)'}}>
              <div style={{fontFamily: 'Helvetica, Arial, sans-serif', fontSize: 18, letterSpacing: '0.18em', color: 'rgba(180,206,228,0.55)'}}>NOW PLAYING</div>
              <div style={{marginTop: 14, fontFamily: 'Helvetica, Arial, sans-serif', fontSize: 26, color: 'rgba(232,240,248,0.86)'}}>HALLWAY · CAM 01</div>
              <div style={{marginTop: 18, height: 6, borderRadius: 3, background: 'rgba(150,190,220,0.16)'}}>
                <div style={{width: '62%', height: '100%', borderRadius: 3, background: '#9FD0EE'}} />
              </div>
            </div>
            <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(118deg, rgba(255,255,255,0.07), transparent 42%)'}} />
          </div>
        </div>
        <div style={{position: 'absolute', left: '50%', top: 22, width: 150, height: 26, marginLeft: -75, borderRadius: 14, background: '#04060A'}} />
      </div>
    </div>
  );
  if (bare) return <AbsoluteFill>{body}</AbsoluteFill>;
  return (
    <AbsoluteFill style={{background: '#04060A', overflow: 'hidden'}}>
      <AbsoluteFill style={{background: 'radial-gradient(760px 900px at 50% 42%, rgba(52,86,116,0.42), transparent 72%), linear-gradient(180deg,#070A0F,#04060A)'}} />
      {body}
    </AbsoluteFill>
  );
};

const VibeScreen: React.FC<{f: number; buzz: number}> = ({f, buzz}) => (
  <Phone f={f} clock="11:59" title="RECORDINGS" sub="PLAYBACK PAUSED" rotate={-2}>
    <div style={{position: 'absolute', left: 40, right: 40, top: 300, borderRadius: 24, padding: '24px 26px', background: 'linear-gradient(160deg,rgba(38,50,64,0.92),rgba(16,22,30,0.94))', border: '1px solid rgba(150,186,216,0.18)', boxShadow: '0 18px 44px rgba(0,0,0,0.6)'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: 'Helvetica, Arial, sans-serif', fontSize: 17, letterSpacing: '0.16em', color: 'rgba(196,218,238,0.66)'}}>
        <span>MESSAGES</span>
        <span>now</span>
      </div>
      <div style={{marginTop: 14, fontFamily: 'Helvetica, Arial, sans-serif', fontSize: 32, lineHeight: 1.22, color: '#F1F6FB'}}>
        UNKNOWN NUMBER
      </div>
      <div style={{marginTop: 10, fontFamily: 'Helvetica, Arial, sans-serif', fontSize: 24, color: 'rgba(214,232,246,0.7)'}}>
        1 new message
      </div>
    </div>
    <div style={{position: 'absolute', left: 40, right: 40, top: 520, height: 330, borderRadius: 20, background: 'linear-gradient(180deg,#0B141C,#070B10)', border: '1px solid rgba(150,190,220,0.10)', overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.3) 0 1px, transparent 1px 4px)', opacity: 0.35}} />
      <div style={{position: 'absolute', left: 110, top: 90, width: 200, height: 190, background: 'linear-gradient(180deg,#151E27,#0A1016)', border: '2px solid rgba(160,196,224,0.12)'}} />
      <div style={{position: 'absolute', left: 20, top: 16, fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 15, letterSpacing: '0.22em', color: 'rgba(180,206,228,0.45)'}}>
        HALLWAY · CAM 01
      </div>
      <div style={{position: 'absolute', left: 20, bottom: 14, fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 15, letterSpacing: '0.2em', color: 'rgba(180,206,228,0.38)'}}>
        PAUSED · 12:00:09 AM
      </div>
    </div>
  </Phone>
);

const NotifScreen: React.FC<{f: number; push?: number; full?: boolean}> = ({f, push = 0, full = false}) => (
  <Phone f={f} push={push} clock="11:59" rotate={-1.2} glow={0.6}>
    <Bubble top={270} tone="linear-gradient(160deg,#241D22,#141117)">
      <div style={{fontFamily: 'Helvetica, Arial, sans-serif', fontSize: 19, letterSpacing: '0.18em', color: 'rgba(214,190,186,0.55)'}}>
        UNKNOWN NUMBER
      </div>
      <div style={{marginTop: 20, fontFamily: 'Helvetica, Arial, sans-serif', fontWeight: 500, fontSize: full ? 46 : 38, lineHeight: 1.24, letterSpacing: '0.01em', color: '#F6F0E9'}}>
        YOU HAVE
        <br />
        ONE MINUTE
        <br />
        LEFT.
      </div>
      <div style={{marginTop: 24, fontFamily: 'Helvetica, Arial, sans-serif', fontSize: 18, letterSpacing: '0.16em', color: 'rgba(200,180,178,0.4)'}}>
        now
      </div>
    </Bubble>
    <div style={{position: 'absolute', left: 46, bottom: 90, fontFamily: 'Helvetica, Arial, sans-serif', fontSize: 21, letterSpacing: '0.14em', color: 'rgba(176,150,150,0.35)'}}>
      UNKNOWN NUMBER
    </div>
  </Phone>
);

/* ------------------------------------------------------------------ */
/* hallway set                                                         */
/* ------------------------------------------------------------------ */

type HallFigure = {
  x: number;
  h: number;
  feetY: number;
  fall?: number;
  look?: 'camera' | 'down' | 'door';
  expression?: 'neutral' | 'relief' | 'tired' | 'fear' | 'sad';
};

const HallFigure: React.FC<{fig: HallFigure}> = ({fig}) => {
  const fall = clamp01(fig.fall ?? 0);
  const w = fig.h * (600 / 1080);
  const scale = 1 - fall * 0.2;
  const lift = Math.pow(fall, 3) * 70;
  return (
    <div
      style={{
        position: 'absolute',
        left: fig.x,
        bottom: 1920 - fig.feetY,
        width: w,
        height: fig.h,
        transformOrigin: '50% 100%',
        transform: `translateY(${-lift}px) rotate(${-86 * fall}deg) scale(${scale})`,
        filter: `brightness(${1.08 - fall * 0.14}) drop-shadow(0 14px 34px rgba(0,0,0,0.9))`,
      }}
    >
      <Noah expression={(fig.expression ?? 'neutral') as never} look={fig.look ?? 'door'} rim={0.9} viewBox="0 0 600 1080" />
    </div>
  );
};

const Silhouette: React.FC<{opacity: number; x: number; feetY: number; h: number}> = ({opacity, x, feetY, h}) => {
  const w = h * 0.42;
  return (
    <div style={{position: 'absolute', left: x, bottom: 0, width: w, height: h, opacity, filter: 'blur(1.2px)'}}>
      <svg viewBox="0 0 100 240" width="100%" height="100%" preserveAspectRatio="xMidYMax meet">
        <ellipse cx="50" cy="34" rx="21" ry="25" fill="#04060A" />
        <path d="M 50 58 C 34 58 22 68 17 84 L 8 156 L 2 238 L 26 238 L 34 172 L 38 238 L 62 238 L 66 172 L 74 238 L 98 238 L 92 156 L 83 84 C 78 68 66 58 50 58 Z" fill="#04060A" />
        <path d="M 71 60 C 82 64 88 76 89 92 L 94 152 L 96 210" stroke="#C08A54" strokeWidth="2.2" fill="none" opacity="0.55" />
        <path d="M 50 9 C 62 9 71 17 72 30" stroke="#C8925C" strokeWidth="1.6" fill="none" opacity="0.4" />
        <path d="M 29 60 C 18 66 12 78 11 94 L 6 152" stroke="#7E5C3C" strokeWidth="1.2" fill="none" opacity="0.32" />
      </svg>
    </div>
  );
};

export const Hall: React.FC<{
  f: number;
  z?: number;
  ox?: string;
  oy?: string;
  doorOpen?: number;
  figure?: HallFigure | null;
  silhouette?: number;
  timecode?: string;
  chrome?: 'rec' | 'playback' | 'rewind' | null;
  scrub?: number;
  dim?: number;
  glass?: number;
}> = ({f, z = 1, ox = '50%', oy = '50%', doorOpen = 0, figure = null, silhouette = 0, timecode, chrome = null, scrub = 0.5, dim = 0, glass = 0}) => {
  const open = clamp01(doorOpen);
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: '#07090C'}}>
      <div style={{position: 'absolute', inset: 0, transform: `scale(${z})`, transformOrigin: `${ox} ${oy}`, filter: `saturate(0.66) contrast(1.03) brightness(${1.42 - dim * 0.35})`}}>
        {/* back wall */}
        <div style={{position: 'absolute', left: 246, top: 636, width: 588, height: 812, background: 'linear-gradient(180deg,#121A22 0%,#0C131A 45%,#080D12 100%)'}} />
        {/* side walls */}
        <div style={{position: 'absolute', left: 0, top: 0, width: 250, height: 1920, background: 'linear-gradient(90deg,#0A0F14,#101820)', clipPath: 'polygon(0 0, 250 636, 250 1448, 0 1920)'}} />
        <div style={{position: 'absolute', right: 0, top: 0, width: 250, height: 1920, background: 'linear-gradient(270deg,#090E13,#0E161D)', clipPath: 'polygon(250 0, 0 636, 0 1448, 250 1920)'}} />
        {/* ceiling + floor */}
        <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 640, background: 'linear-gradient(180deg,#0B1015,#121A22)', clipPath: 'polygon(0 0, 1080 0, 834 636, 246 636)'}} />
        <div style={{position: 'absolute', left: 0, top: 1444, width: 1080, height: 476, background: 'linear-gradient(180deg,#0E151B,#070B0F)', clipPath: 'polygon(246 0, 834 0, 1080 476, 0 476)'}} />
        {/* ceiling light strip + tube */}
        <div style={{position: 'absolute', left: 505, top: 0, width: 70, height: 610, background: 'linear-gradient(180deg, rgba(196,222,240,0.22), rgba(196,222,240,0.04))', clipPath: 'polygon(6% 0, 94% 0, 78% 100%, 22% 100%)', opacity: 0.55 + Math.sin(f / 13) * 0.06, filter: 'blur(2px)'}} />
        <div style={{position: 'absolute', left: 372, top: 70, width: 336, height: 26, borderRadius: 13, background: 'linear-gradient(180deg,#DCEAF4,#9FC2DC)', boxShadow: '0 0 60px 18px rgba(170,206,232,0.30)', opacity: 0.85 + Math.sin(f / 17) * 0.05}} />
        {/* wall seams */}
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{position: 'absolute', left: 246 + i * 147, top: 636, width: 2, height: 808, background: 'rgba(150,180,205,0.06)'}} />
        ))}
        <div style={{position: 'absolute', left: 246, right: 246, top: 1000, height: 2, background: 'rgba(150,180,205,0.05)'}} />

        {/* doorway void (visible as the door opens) */}
        <div style={{position: 'absolute', left: 418, top: 752, width: 244, height: 692, opacity: open, overflow: 'hidden', background: 'linear-gradient(180deg,#07080A 0%,#090807 55%,#0B0907 100%)', boxShadow: 'inset 0 0 90px rgba(0,0,0,0.94)'}}>
          {/* faint warm depth inside the apartment */}
          <div style={{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, background: 'radial-gradient(80% 54% at 48% 74%, rgba(198,152,104,0.11), transparent 76%)'}} />
          <div style={{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, background: 'radial-gradient(52% 34% at 20% 30%, rgba(214,168,118,0.07), transparent 72%)'}} />
          {/* interior floor line */}
          <div style={{position: 'absolute', left: 0, right: 0, bottom: 132, height: 2, background: 'rgba(206,164,118,0.10)'}} />
          <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 132, background: 'linear-gradient(180deg,#0C0A08,#070605)'}} />
          {/* light hugging the frame's left edge */}
          <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 40, background: 'linear-gradient(90deg, rgba(226,180,130,0.15), transparent)'}} />
        </div>
        {/* faint spill on the hall floor */}
        <div style={{position: 'absolute', left: 418, top: 752, width: 244, height: 692, background: 'linear-gradient(90deg, rgba(238,196,148,0.12), transparent 62%)', opacity: open}} />
        <div style={{position: 'absolute', left: 330, top: 1444, width: 450, height: 260, background: 'radial-gradient(ellipse at 50% 0%, rgba(238,198,150,0.24), transparent 70%)', opacity: open * 0.85, filter: 'blur(24px)'}} />
        <div style={{position: 'absolute', left: 470, top: 1444, width: 230, height: 120, background: 'linear-gradient(180deg, rgba(238,196,148,0.16), transparent)', opacity: open * 0.9, filter: 'blur(10px)'}} />

        {/* apartment door, hinge on the left edge */}
        <div style={{position: 'absolute', left: 418, top: 752, width: 244, height: 692, transformOrigin: 'left center', transform: `scaleX(${1 - open * 0.8})`, background: 'linear-gradient(100deg,#242C37,#161E28 58%,#0D131A)', border: '6px solid #0A0F14', boxShadow: '0 0 0 3px rgba(150,186,214,0.10), 0 0 50px rgba(150,190,220,0.10), inset 0 0 60px rgba(0,0,0,0.75)'}}>
          <div style={{position: 'absolute', left: 18, top: 70, right: 18, height: 220, border: '2px solid rgba(186,214,238,0.18)', boxShadow: 'inset 0 0 26px rgba(0,0,0,0.5)'}} />
          <div style={{position: 'absolute', left: 18, top: 340, right: 18, height: 280, border: '2px solid rgba(186,214,238,0.15)', boxShadow: 'inset 0 0 26px rgba(0,0,0,0.5)'}} />
          <div style={{position: 'absolute', right: 18, top: 350, width: 11, height: 11, borderRadius: '50%', background: '#5B636C'}} />
          <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 2, background: 'rgba(170,204,230,0.18)'}} />
        </div>
        <div style={{position: 'absolute', left: 408, top: 1432, width: 264, height: 30, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(0,0,0,0.7), transparent 72%)', filter: 'blur(7px)'}} />
        <div style={{position: 'absolute', left: 424, top: 1442, width: 232, height: 3, background: 'rgba(170,206,232,0.16)', filter: 'blur(1px)'}} />

        {/* cool overhead cone */}
        <svg viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0, width: 1080, height: 1920}}>
          <defs>
            <linearGradient id="p3cone" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#A6CBE4" stopOpacity="0.30" />
              <stop offset="55%" stopColor="#A6CBE4" stopOpacity="0.10" />
              <stop offset="100%" stopColor="#A6CBE4" stopOpacity="0.01" />
            </linearGradient>
            <filter id="p3coneBlur" x="-30%" y="-20%" width="160%" height="150%">
              <feGaussianBlur stdDeviation="22" />
            </filter>
          </defs>
          <polygon points="455,660 625,660 830,1460 250,1460" fill="url(#p3cone)" filter="url(#p3coneBlur)" />
        </svg>

        {/* the opening stays dark: overhead wash must not flatten it */}
        {open > 0.015 ? (
          <div style={{position: 'absolute', left: 442, top: 758, width: 220, height: 686, opacity: open, overflow: 'hidden', boxShadow: 'inset 0 0 70px rgba(0,0,0,0.95)'}}>
            <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(4,5,6,0.96) 0%, rgba(5,5,4,0.93) 56%, rgba(8,7,5,0.88) 100%)'}} />
            <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(64% 28% at 44% 94%, rgba(214,166,112,0.26), transparent 72%)'}} />
            <div style={{position: 'absolute', left: 66, top: 110, width: 88, bottom: 240, background: 'linear-gradient(180deg, rgba(198,152,104,0.05) 0%, rgba(216,168,116,0.15) 55%, rgba(206,156,104,0.04) 100%)', filter: 'blur(16px)'}} />
            <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 120, background: 'linear-gradient(180deg, rgba(0,0,0,0.55), transparent)'}} />
            <div style={{position: 'absolute', left: 0, right: 0, bottom: 118, height: 2, background: 'rgba(216,174,126,0.16)'}} />
            <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 118, background: 'linear-gradient(180deg, rgba(20,15,10,0.92), rgba(8,6,5,0.96))'}} />
            <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 50, background: 'linear-gradient(90deg, rgba(232,186,134,0.22), transparent)'}} />
            {silhouette > 0.01 ? (
              <div style={{position: 'absolute', left: 30, bottom: 112, width: 146, height: 432, opacity: silhouette, filter: 'blur(0.4px)'}}>
                <Silhouette opacity={1} x={0} feetY={432} h={432} />
              </div>
            ) : null}
          </div>
        ) : null}

        {/* floor sheen + practicals */}
        <div style={{position: 'absolute', left: 0, top: 1440, width: 1080, height: 480, background: 'linear-gradient(180deg, rgba(150,190,220,0.10), rgba(150,190,220,0.02) 40%, transparent 80%)'}} />
        <div style={{position: 'absolute', left: 250, top: 560, width: 580, height: 420, background: 'radial-gradient(ellipse at 50% 20%, rgba(150,190,220,0.20), transparent 70%)', filter: 'blur(26px)'}} />
        <div style={{position: 'absolute', left: 330, top: 1452, width: 420, height: 170, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(160,198,228,0.16), transparent 70%)', filter: 'blur(18px)'}} />
        <div style={{position: 'absolute', left: 0, top: 1400, width: 246, height: 4, background: 'rgba(150,184,210,0.10)'}} />
        <div style={{position: 'absolute', right: 0, top: 1400, width: 246, height: 4, background: 'rgba(150,184,210,0.08)'}} />
        <div style={{position: 'absolute', left: 246, top: 630, width: 588, height: 30, background: 'linear-gradient(180deg,#1B242D,#101820)'}} />
        <div style={{position: 'absolute', left: 246, top: 660, width: 588, height: 90, background: 'linear-gradient(180deg,rgba(0,0,0,0.55),transparent)'}} />
        <div style={{position: 'absolute', left: 246, top: 1428, width: 588, height: 18, background: 'linear-gradient(180deg,#0D141A,#080C10)'}} />

        {/* body contact shadow */}
        {figure && (figure.fall ?? 0) > 0.25 ? (
          <div style={{position: 'absolute', left: figure.x - 40, top: figure.feetY - 54, width: figure.h * 0.82, height: 100, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(0,0,0,0.68), transparent 72%)', filter: 'blur(15px)'}} />
        ) : null}

        {/* recorded Noah */}
        {figure ? <HallFigure fig={figure} /> : null}

      </div>

      {/* cctv look */}
      <AbsoluteFill style={{backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.22) 0px, rgba(0,0,0,0.22) 1px, transparent 2px, transparent 4px)', opacity: 0.35, mixBlendMode: 'multiply'}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 64% 60% at 50% 46%, transparent 50%, rgba(0,0,0,0.55) 100%)'}} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(120,160,190,0.05), transparent 30%, transparent 70%, rgba(0,0,0,0.4))'}} />

      {/* glass reflection sweep on the phone screen */}
      {glass > 0.01 ? (
        <AbsoluteFill style={{background: `linear-gradient(104deg, transparent ${34 + glass * 26}%, rgba(198,224,244,${0.10 * glass}) ${46 + glass * 26}%, transparent ${58 + glass * 26}%)`}} />
      ) : null}

      {/* playback chrome */}
      {chrome ? <PlaybackChrome f={f} mode={chrome} timecode={timecode} scrub={scrub} /> : null}
      {!chrome && timecode ? <Timecode label={timecode} small /> : null}
    </AbsoluteFill>
  );
};

const Timecode: React.FC<{label: string; small?: boolean; alert?: boolean}> = ({label, small = false, alert = false}) => (
  <div style={{position: 'absolute', left: small ? 40 : 56, top: small ? 44 : 72}}>
    <div style={{display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'ui-monospace, Menlo, monospace', fontSize: small ? 22 : 34, letterSpacing: '0.12em', color: alert ? '#F0B9A6' : 'rgba(236,244,252,0.88)', textShadow: '0 0 18px rgba(120,170,210,0.35)'}}>
      <span style={{width: small ? 8 : 11, height: small ? 8 : 11, borderRadius: '50%', background: alert ? '#E0604A' : '#D8E6F2', opacity: 0.9, boxShadow: `0 0 12px ${alert ? '#E0604A' : '#D8E6F2'}`}} />
      {label}
    </div>
    <div style={{marginTop: 6, fontFamily: 'ui-monospace, Menlo, monospace', fontSize: small ? 13 : 16, letterSpacing: '0.32em', color: 'rgba(190,212,232,0.45)'}}>
      HALLWAY · CAM 01
    </div>
  </div>
);

const PlaybackChrome: React.FC<{f: number; mode: 'rec' | 'playback' | 'rewind'; timecode?: string; scrub: number}> = ({f, mode, timecode, scrub}) => {
  const pulse = 0.55 + Math.sin(f / 7) * 0.35;
  return (
    <>
      <div style={{position: 'absolute', left: 56, top: 66}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12, fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 26, letterSpacing: '0.2em', color: 'rgba(226,238,248,0.86)'}}>
          <span style={{width: 12, height: 12, borderRadius: '50%', background: mode === 'rec' ? '#E0604A' : '#D8E6F2', opacity: mode === 'rec' ? pulse : 0.9, boxShadow: `0 0 14px ${mode === 'rec' ? '#E0604A' : '#D8E6F2'}`}} />
          {mode === 'rec' ? 'REC' : mode === 'rewind' ? 'REWIND' : 'PLAYBACK'}
        </div>
        <div style={{marginTop: 8, fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 15, letterSpacing: '0.28em', color: 'rgba(190,212,232,0.45)'}}>
          HALLWAY · CAM 01
        </div>
      </div>

      {timecode ? (
        <div style={{position: 'absolute', right: 56, top: 62, textAlign: 'right', fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 34, letterSpacing: '0.1em', color: 'rgba(238,246,252,0.9)', textShadow: '0 0 18px rgba(120,170,210,0.35)'}}>
          {timecode}
        </div>
      ) : null}

      {mode === 'rewind' ? (
        <div style={{position: 'absolute', left: '50%', top: 470, transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: 14, fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 24, letterSpacing: '0.34em', color: 'rgba(186,214,236,0.6)'}}>
          <span style={{letterSpacing: 0}}>◀◀</span> REWIND
        </div>
      ) : null}

      <div style={{position: 'absolute', left: 56, right: 56, bottom: 92}}>
        <div style={{position: 'relative', height: 4, borderRadius: 2, background: 'rgba(210,228,244,0.18)'}}>
          <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${scrub * 100}%`, borderRadius: 2, background: mode === 'rewind' ? '#C8B08C' : '#9FC6E8'}} />
          <div style={{position: 'absolute', left: `${scrub * 100}%`, top: '50%', width: 13, height: 13, marginLeft: -6, marginTop: -6, borderRadius: '50%', background: '#EAF3FA', boxShadow: '0 0 14px rgba(150,200,235,0.7)'}} />
        </div>
        <div style={{marginTop: 14, display: 'flex', justifyContent: 'space-between', fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 16, letterSpacing: '0.16em', color: 'rgba(188,210,230,0.5)'}}>
          <span>{mode === 'rewind' ? 'SCRUBBING BACK' : '00:43 / 00:43'}</span>
          <span>NO AUDIO</span>
        </div>
      </div>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */

const pad = (n: number, l = 2) => String(Math.floor(n)).padStart(l, '0');

const clockAt = (seconds: number, ampm: 'AM' | 'PM') => {
  const s = ((seconds % 43200) + 43200) % 43200;
  const h = Math.floor(s / 3600) || 12;
  const m = Math.floor((s % 3600) / 60);
  const sec = Math.floor(s % 60);
  return `${pad(h)}:${pad(m)}:${pad(sec)} ${ampm}`;
};

/* ------------------------------------------------------------------ */
/* Part 3                                                              */
/* ------------------------------------------------------------------ */

export const Part3: React.FC = () => {
  const f = useCurrentFrame();
  const range = (s: number, e: number) => f >= s && f < e;
  const p = (s: number, e: number) => clamp01((f - s) / (e - s));

  // recorded Noah: steps out, then collapses
  const walk = smooth(p(712, 792));
  const figX = interpolate(walk, [0, 1], [470, 508]);
  const figFeet = 1444;
  const figH = interpolate(walk, [0, 1], [690, 742]);

  const fallRaw = p(792, 842);
  const fall = Math.pow(clamp01(fallRaw), 1.45);
  const fallX = interpolate(fall, [0, 1], [508, 628]);

  // silhouette reveal
  const sil = smooth(p(968, 1024)) * 0.98;

  // playback scrub positions
  const rewindScrub = interpolate(p(240, 308), [0, 1], [0.92, 0.18]);
  const playScrub = interpolate(p(311, 371), [0, 1], [0.18, 0.22]);

  // timecodes
  const rewindTc = clockAt(43200 - 62 * p(240, 308) + 6, 'AM');
  const emptyTc = '11:59:58 PM';
  const swapTc = f < 392 ? `11:59:${pad(58 + Math.floor(p(371, 392) * 2))} PM` : '12:00:00 AM';
  const laterTc = f < 900 ? '12:00:04 AM' : '12:00:11 AM';

  return (
    <AbsoluteFill style={{backgroundColor: '#000', overflow: 'hidden'}}>
      <Audio src={staticFile('audio/pt3.mp3')} />
      <Audio src={staticFile('audio/rain.wav')} volume={0.07} />

      {/* 01 the message */}
      {range(0, 74) ? (
        <AbsoluteFill>
          <FinalMsg f={f} push={p(0, 74) * 0.35} />
          <Vignette strength={0.86} />
          <Grain f={f} opacity={0.09} />
        </AbsoluteFill>
      ) : null}

      {/* 02 he stares at it */}
      {range(74, 146) ? (
        <AbsoluteFill style={{background: '#04060A'}}>
          <Cam z={1.02 + p(74, 146) * 0.06} ox="52%" oy="44%">
            <Room f={f} phoneOn={0.6} />
            <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.9))'}}>
              <Noah expression="fear" look={f < 104 ? 'down' : 'camera'} lidOverride={blinkAt(f, 128)} rim={1.1} viewBox="176 18 262 466" preserve="xMidYMid slice" />
            </div>
          </Cam>
          <AbsoluteFill style={{background: 'radial-gradient(440px 360px at 42% 52%, rgba(120,180,230,0.16), transparent 70%)'}} />
          <Vignette strength={0.92} />
        </AbsoluteFill>
      ) : null}

      {/* 03a he opens the recording */}
      {range(146, 200) ? (
        <AbsoluteFill style={{background: '#05070A'}}>
          <Cam z={1.2 + p(146, 200) * 0.05} ox="54%" oy="54%">
            <Room f={f} phoneOn={0.9} fg />
            <div style={{position: 'absolute', left: 430, bottom: 1920 - FLOOR, width: NOAH_W, height: NOAH_H, filter: 'drop-shadow(0 24px 50px rgba(0,0,0,0.85))'}}>
              <Noah expression="fear" look="down" rim={1.05} viewBox="0 0 600 1080" />
            </div>
            <div style={{position: 'absolute', left: 534, bottom: 1920 - FLOOR + 268, width: 58, height: 120, borderRadius: 8, border: '3px solid #090D12', background: 'linear-gradient(168deg,#C9DFEF 0%,#7DA2BC 58%,#41637E 100%)', boxShadow: '0 0 40px 12px rgba(118,178,224,0.30), 0 0 10px rgba(190,222,244,0.35)', transform: 'rotate(-13deg)'}} />
            <div style={{position: 'absolute', left: 512, bottom: 1920 - FLOOR + 250, width: 104, height: 156, background: 'radial-gradient(ellipse at 50% 50%, rgba(130,190,235,0.20), transparent 70%)', filter: 'blur(14px)'}} />
          </Cam>
          <AbsoluteFill style={{background: 'radial-gradient(380px 320px at 52% 60%, rgba(130,190,235,0.16), transparent 70%)'}} />
          <Vignette strength={0.9} />
        </AbsoluteFill>
      ) : null}

      {/* 03b recordings list + tap */}
      {range(200, 233) ? (
        <AbsoluteFill>
          <RecList f={f} tapped={clamp01((f - 212) / 15)} />
          <Vignette strength={0.8} />
          <Grain f={f} opacity={0.08} />
        </AbsoluteFill>
      ) : null}

      {/* 04 rewind */}
      {range(233, 311) ? (
        <AbsoluteFill>
          <Hall
            f={f}
            z={1.04 + p(233, 311) * 0.03}
            chrome="rewind"
            timecode={rewindTc}
            scrub={rewindScrub}
            doorOpen={f > 300 ? p(300, 311) * 0.04 : 0}
          />
          <AbsoluteFill style={{background: `rgba(180,210,235,${(Math.sin(f * 1.7) * 0.5 + 0.5) * 0.05})`, mixBlendMode: 'screen'}} />
        </AbsoluteFill>
      ) : null}

      {/* 05 empty corridor */}
      {range(311, 371) ? (
        <AbsoluteFill>
          <Hall f={f} z={1.02 + p(311, 371) * 0.03} chrome="playback" timecode={emptyTc} scrub={playScrub} />
        </AbsoluteFill>
      ) : null}

      {/* 06 the timestamp changes */}
      {range(371, 440) ? (
        <AbsoluteFill>
          <Hall f={f} z={1.42 + p(371, 440) * 0.16} ox="46%" oy="50%" dim={0.28} />
          <AbsoluteFill style={{background: 'radial-gradient(760px 900px at 50% 50%, rgba(6,10,16,0.55), rgba(3,5,8,0.86))'}} />
          <div style={{position: 'absolute', left: 0, right: 0, top: 660, textAlign: 'center'}}>
            <div style={{fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 17, letterSpacing: '0.42em', color: 'rgba(180,206,228,0.5)'}}>
              RECORDED TIMESTAMP
            </div>
            <div
              style={{
                marginTop: 26,
                fontFamily: 'ui-monospace, Menlo, monospace',
                fontSize: 88,
                letterSpacing: '0.04em',
                color: f < 392 ? 'rgba(228,238,248,0.92)' : '#F4E6D6',
                textShadow: f < 392 ? '0 0 34px rgba(140,180,214,0.35)' : '0 0 40px rgba(238,196,150,0.45)',
                opacity: f > 392 && f < 396 ? 0.55 : 1,
              }}
            >
              {f < 392 ? '11:59:59 PM' : '12:00:00 AM'}
            </div>
            <div style={{marginTop: 26, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 14, fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 16, letterSpacing: '0.34em', color: f < 392 ? 'rgba(180,206,228,0.45)' : 'rgba(238,196,150,0.75)'}}>
              <span style={{width: 9, height: 9, borderRadius: '50%', background: f < 392 ? '#9FC6E8' : '#E8B27E', boxShadow: `0 0 14px ${f < 392 ? '#9FC6E8' : '#E8B27E'}`}} />
              {f < 392 ? 'PLAYING' : 'MIDNIGHT'}
            </div>
          </div>
          <AbsoluteFill style={{background: `rgba(210,230,246,${f > 392 && f < 399 ? 0.12 - (f - 392) * 0.015 : 0})`}} />
        </AbsoluteFill>
      ) : null}

      {/* 07 midnight hold */}
      {range(440, 509) ? (
        <AbsoluteFill>
          <Hall f={f} z={1.16 + p(440, 509) * 0.07} ox="50%" oy="42%" chrome="playback" timecode="12:00:00 AM" scrub={0.3} glass={0.8} />
          <AbsoluteFill style={{background: 'radial-gradient(680px 520px at 50% 34%, rgba(140,190,225,0.12), transparent 70%)'}} />
        </AbsoluteFill>
      ) : null}

      {/* 08 two clocks disagree */}
      {range(509, 614) ? (
        <AbsoluteFill style={{background: '#04060A', overflow: 'hidden'}}>
          <AbsoluteFill style={{background: 'radial-gradient(820px 900px at 34% 22%, rgba(46,80,110,0.34), transparent 70%), linear-gradient(180deg,#070A0F,#04060A)'}} />

          {/* recorded pane */}
          <div style={{position: 'absolute', left: 58, top: 168, width: 452, height: 322, borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(150,196,228,0.20)', boxShadow: '0 34px 80px rgba(0,0,0,0.75)'}}>
            <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg,#0C1219,#070B10)'}} />
            <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 250, background: 'radial-gradient(ellipse at 50% 20%, rgba(150,190,220,0.16), transparent 70%)'}} />
            <div style={{position: 'absolute', left: 128, right: 128, top: 96, height: 152, background: 'linear-gradient(180deg,#1B2530,#0D141B)', border: '2px solid rgba(170,204,232,0.16)'}}>
              <div style={{position: 'absolute', left: 12, top: 16, right: 12, height: 52, border: '1px solid rgba(170,200,225,0.13)'}} />
              <div style={{position: 'absolute', right: 12, top: 96, width: 7, height: 7, borderRadius: '50%', background: '#4B525A'}} />
            </div>
            <div style={{position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.28) 0 1px, transparent 1px 4px)', opacity: 0.4}} />
            <div style={{position: 'absolute', left: 18, top: 14, fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 14, letterSpacing: '0.22em', color: 'rgba(190,214,234,0.62)'}}>
              RECORDED
            </div>
            <div style={{position: 'absolute', right: 18, top: 12, fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 22, letterSpacing: '0.08em', color: '#F4E6D6'}}>
              12:00:00 AM
            </div>
            <div style={{position: 'absolute', left: 18, bottom: 14, fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 13, letterSpacing: '0.2em', color: 'rgba(190,214,234,0.42)'}}>
              HALLWAY · CAM 01
            </div>
          </div>

          {/* live phone clock */}
          <LockScreen f={f} push={p(509, 614) * 0.25} bare x={176} y={-64} scale={0.72} />

          <div style={{position: 'absolute', left: 0, right: 0, top: 512, textAlign: 'center', fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 15, letterSpacing: '0.4em', color: 'rgba(186,210,232,0.42)'}}>
            DEVICE CLOCK · STILL 11:59 PM
          </div>
          <Vignette strength={0.8} />
        </AbsoluteFill>
      ) : null}

      {/* 09 the recorded door opens */}
      {range(614, 710) ? (
        <AbsoluteFill>
          <Hall
            f={f}
            z={1.06 + p(614, 710) * 0.05}
            doorOpen={smooth(p(628, 690))}
            chrome="playback"
            timecode={f < 672 ? '12:00:01 AM' : '12:00:02 AM'}
            scrub={0.44}
          />
        </AbsoluteFill>
      ) : null}

      {/* 10 recorded Noah steps out */}
      {range(710, 786) ? (
        <AbsoluteFill>
          <Hall
            f={f}
            z={1.03 + p(710, 786) * 0.04}
            doorOpen={0.92}
            figure={{x: figX, h: figH, feetY: figFeet, look: 'door', expression: 'neutral', fall: 0}}
            timecode="12:00:05 AM"
          />
        </AbsoluteFill>
      ) : null}

      {/* 11 he collapses */}
      {range(786, 854) ? (
        <AbsoluteFill>
          <Hall
            f={f}
            z={1.06 + p(786, 854) * 0.05}
            doorOpen={0.9}
            figure={{x: fallX, h: 742, feetY: 1444, look: 'down', expression: 'fear', fall}}
            timecode="12:00:07 AM"
          />
          <AbsoluteFill style={{background: `rgba(0,0,0,${fall > 0.9 ? (fall - 0.9) * 1.4 : 0})`}} />
        </AbsoluteFill>
      ) : null}

      {/* 12 the body lies still */}
      {range(854, 957) ? (
        <AbsoluteFill>
          <Hall
            f={f}
            z={1.88 + p(854, 957) * 0.12}
            ox="50%"
            oy="62%"
            doorOpen={0.9}
            figure={{x: 628, h: 742, feetY: 1444, look: 'down', expression: 'sad', fall: 1}}
            timecode={laterTc}
            dim={0.15}
          />
        </AbsoluteFill>
      ) : null}

      {/* 13 someone behind him */}
      {range(957, 1065) ? (
        <AbsoluteFill>
          <Hall
            f={f}
            z={1.62 + p(957, 1065) * 0.1}
            ox="50%"
            oy="66%"
            doorOpen={0.9}
            figure={{x: 628, h: 742, feetY: 1444, look: 'down', expression: 'sad', fall: 1}}
            silhouette={sil}
            timecode="12:00:19 AM"
            dim={0.2}
          />
          <AbsoluteFill style={{background: `radial-gradient(ellipse 70% 60% at 50% 50%, transparent 40%, rgba(0,0,0,${0.2 + sil * 0.2}) 100%)`}} />
        </AbsoluteFill>
      ) : null}

      {/* 14 live Noah + 11:59 */}
      {range(1065, 1152) ? (
        <AbsoluteFill style={{background: '#04060A'}}>
          <Cam z={1.02 + p(1065, 1152) * 0.06} ox="52%" oy="44%">
            <Room f={f} phoneOn={0.7} />
            <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.9))'}}>
              <Noah expression="fear" look={f < 1100 ? 'down' : 'door'} rim={1.1} viewBox="176 18 262 466" preserve="xMidYMid slice" />
            </div>
          </Cam>
          <Vignette strength={0.92} />
        </AbsoluteFill>
      ) : null}

      {range(1152, 1191) ? (
        <AbsoluteFill style={{background: '#04060A'}}>
          <AbsoluteFill style={{background: 'radial-gradient(700px 760px at 50% 44%, rgba(52,86,116,0.45), transparent 72%)'}} />
          <div style={{position: 'absolute', left: 120, top: 700, width: 840, textAlign: 'center', fontFamily: 'Helvetica, Arial, sans-serif', fontSize: 200, fontWeight: 200, color: '#F2F7FC', letterSpacing: '-0.02em', textShadow: '0 0 70px rgba(130,180,220,0.4)'}}>
            11:59
          </div>
          <div style={{position: 'absolute', left: 0, right: 0, top: 930, textAlign: 'center', fontFamily: 'Helvetica, Arial, sans-serif', fontSize: 40, letterSpacing: '0.34em', color: 'rgba(196,218,236,0.62)'}}>
            PM · DEVICE CLOCK
          </div>
          <Vignette strength={0.85} />
        </AbsoluteFill>
      ) : null}

      {/* 15 the phone buzzes */}
      {range(1191, 1250) ? (
        <AbsoluteFill>
          <AbsoluteFill style={{transform: `translate(${Math.sin(f * 5.4) * 2.2}px, ${Math.cos(f * 4.1) * 1.4}px)`}}>
            <VibeScreen f={f} buzz={1} />
          </AbsoluteFill>
          <AbsoluteFill style={{background: 'radial-gradient(520px 420px at 50% 84%, rgba(150,190,225,0.10), transparent 70%)'}} />
          <Vignette strength={0.84} />
        </AbsoluteFill>
      ) : null}

      {/* 16 one minute left */}
      {range(1250, 1296) ? (
        <AbsoluteFill>
          <AbsoluteFill style={{background: 'radial-gradient(560px 640px at 50% 46%, rgba(70,116,158,0.26), transparent 70%)'}} />
          <NotifScreen f={f} push={p(1250, 1296) * 0.45} full />
          <AbsoluteFill style={{background: 'radial-gradient(300px 420px at 50% 44%, rgba(120,178,220,0.10), transparent 72%)'}} />
          <Vignette strength={0.86} />
          <Grain f={f} opacity={0.08} />
        </AbsoluteFill>
      ) : null}

      {range(1296, 1304) ? (
        <AbsoluteFill style={{background: '#04060A'}}>
          <Cam z={1.06} ox="52%" oy="44%">
            <Room f={f} phoneOn={0.5} />
            <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.9))'}}>
              <Noah expression="fear" look="camera" rim={1.05} viewBox="176 18 262 466" preserve="xMidYMid slice" />
            </div>
          </Cam>
          <AbsoluteFill style={{background: `rgba(0,0,0,${clamp01((f - 1296) / 6) * 0.85})`}} />
          <Vignette strength={0.9} />
        </AbsoluteFill>
      ) : null}

      {f >= 1303 ? <AbsoluteFill style={{background: '#000'}} /> : null}
      {f < 1302 ? <Grain f={f} opacity={0.13} /> : null}
    </AbsoluteFill>
  );
};
