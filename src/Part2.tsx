import React from 'react';
import {AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Noah} from './character/Noah';
import {Cam, Grain, Vignette, Room, blinkAt, FLOOR, NOAH_H, NOAH_W} from './Episode';

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/* ------------------------------------------------------------------ */
/* phone UI                                                            */
/* ------------------------------------------------------------------ */

const PhoneShell: React.FC<{f: number; push?: number; children: React.ReactNode; rotate?: number}> = ({
  f,
  push = 0,
  children,
  rotate = -2.2,
}) => {
  const glow = 0.55 + Math.sin(f / 9) * 0.05;
  return (
    <AbsoluteFill style={{background: '#04060A', overflow: 'hidden'}}>
      <AbsoluteFill style={{background: 'radial-gradient(760px 920px at 50% 46%, rgba(40,72,104,0.55), transparent 70%), radial-gradient(520px 620px at 20% 82%, rgba(196,124,72,0.10), transparent 70%), linear-gradient(180deg,#070A0F,#04060A)'}} />
      <div style={{position: 'absolute', left: '50%', top: '46%', width: 720, height: 1000, marginLeft: -360, marginTop: -500, borderRadius: '50%', background: `radial-gradient(circle, rgba(96,150,200,${0.28 * glow}), transparent 65%)`, filter: 'blur(42px)'}} />
      <div style={{position: 'absolute', left: '50%', top: '50%', width: 566, height: 1120, marginLeft: -283, marginTop: -560, transform: `scale(${1 + push * 0.05}) rotate(${rotate}deg)`}}>
        <div style={{position: 'absolute', inset: 0, borderRadius: 84, background: 'linear-gradient(150deg,#1A1E24,#07090C 42%,#040507)', boxShadow: '0 40px 120px rgba(0,0,0,0.9), 0 0 90px rgba(90,142,186,0.22)'}}>
          <div style={{position: 'absolute', inset: 10, borderRadius: 76, background: '#04060A', overflow: 'hidden'}}>
            <div style={{position: 'absolute', inset: 6, borderRadius: 70, background: 'linear-gradient(175deg,#0B1420 0%,#070C13 55%,#05080D 100%)', overflow: 'hidden'}}>
              <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 320, background: 'linear-gradient(180deg, rgba(70,118,158,0.22), transparent)'}} />
              <div style={{position: 'absolute', left: 46, top: 74, right: 46, display: 'flex', justifyContent: 'space-between', fontFamily: 'Helvetica, Arial, sans-serif', fontSize: 24, color: 'rgba(232,240,248,0.62)'}}>
                <span>12:04</span>
                <span>▮▮▮</span>
              </div>
              <div style={{position: 'absolute', left: 0, right: 0, top: 138, textAlign: 'center', fontFamily: 'Helvetica, Arial, sans-serif', fontSize: 26, letterSpacing: '0.18em', color: 'rgba(196,214,230,0.55)'}}>
                MESSAGES
              </div>
              <div style={{position: 'absolute', left: 46, right: 46, top: 196, height: 1, background: 'rgba(150,186,214,0.14)'}} />
              <div style={{position: 'absolute', left: 46, top: 232, fontFamily: 'Helvetica, Arial, sans-serif', fontSize: 23, letterSpacing: '0.16em', color: 'rgba(170,196,220,0.5)'}}>
                UNKNOWN NUMBER
              </div>
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

const MsgLink: React.FC<{f: number; push?: number}> = ({f, push = 0}) => (
  <PhoneShell f={f} push={push}>
    <Bubble top={292}>
      <div style={{fontFamily: 'Helvetica, Arial, sans-serif', fontSize: 24, letterSpacing: '0.1em', color: 'rgba(196,216,232,0.55)'}}>
        LINK PREVIEW
      </div>
      <div style={{marginTop: 22, borderRadius: 18, border: '1px solid rgba(130,190,230,0.28)', background: 'linear-gradient(160deg,rgba(44,84,116,0.55),rgba(20,36,50,0.55))', padding: '26px 24px'}}>
        <div style={{fontFamily: 'Helvetica, Arial, sans-serif', fontSize: 34, letterSpacing: '0.02em', color: '#9FD0EE'}}>
          LIVE HALLWAY
          <br />
          CAMERA
        </div>
        <div style={{marginTop: 14, fontFamily: 'Helvetica, Arial, sans-serif', fontSize: 20, letterSpacing: '0.12em', color: 'rgba(170,200,222,0.45)'}}>
          hal.cam / n-01
        </div>
      </div>
    </Bubble>
    <div style={{position: 'absolute', left: 46, bottom: 90, fontFamily: 'Helvetica, Arial, sans-serif', fontSize: 21, letterSpacing: '0.14em', color: 'rgba(150,180,206,0.32)'}}>
      TAP TO OPEN
    </div>
  </PhoneShell>
);

const MsgFinal: React.FC<{f: number; push?: number}> = ({f, push = 0}) => (
  <PhoneShell f={f} push={push} rotate={-1.4}>
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
  </PhoneShell>
);

/* ------------------------------------------------------------------ */
/* phone held in hand (insert)                                         */
/* ------------------------------------------------------------------ */

const HandPhone: React.FC<{
  f: number;
  buzz?: number;
  tap?: number;
  mode?: 'buzz' | 'tap';
}> = ({f, buzz = 0, tap = 0, mode = 'buzz'}) => {
  const jitter = Math.sin(f * 5.7) * buzz * 1.6;
  const phoneL = 300;
  const phoneT = 420;
  const phoneW = 480;
  const phoneH = 950;
  return (
    <AbsoluteFill style={{background: '#05070A', overflow: 'hidden'}}>
      <AbsoluteFill style={{background: 'radial-gradient(820px 880px at 52% 40%, rgba(46,82,114,0.5), transparent 72%), linear-gradient(180deg,#080C12,#04060A)'}} />
      <div style={{position: 'absolute', right: -80, top: 340, width: 480, height: 480, borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,164,104,0.22), transparent 68%)', filter: 'blur(30px)'}} />
      {/* soft surface shadow */}
      <div style={{position: 'absolute', left: 240, top: 1330, width: 620, height: 120, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(0,0,0,0.75), transparent 68%)', filter: 'blur(20px)'}} />
      {/* phone */}
      <div style={{position: 'absolute', left: phoneL, top: phoneT, width: phoneW, height: phoneH, transform: `translate(${jitter * 1.3}px, ${Math.abs(jitter) * 0.5}px) rotate(-7deg)`, borderRadius: 62, background: 'linear-gradient(150deg,#1B2027,#06080B 46%,#040507)', boxShadow: `0 34px 90px rgba(0,0,0,0.9), 0 0 ${40 + 40 * buzz}px ${8 + 10 * buzz}px rgba(96,150,200,0.30)`}}>
        <div style={{position: 'absolute', inset: 8, borderRadius: 54, background: '#04060A', overflow: 'hidden'}}>
          <div style={{position: 'absolute', inset: 4, borderRadius: 50, background: 'linear-gradient(175deg,#0E1822 0%,#080D14 60%,#05080D 100%)'}} />
          {/* status */}
          <div style={{position: 'absolute', left: 34, top: 40, right: 34, display: 'flex', justifyContent: 'space-between', fontFamily: 'Helvetica, Arial, sans-serif', fontSize: 19, color: 'rgba(210,228,242,0.5)'}}>
            <span>12:04</span>
            <span>▮▮▮</span>
          </div>
          {/* notification card */}
          <div style={{position: 'absolute', left: 30, top: mode === 'tap' ? 150 : 210, right: 30, borderRadius: 26, padding: '24px 26px', background: 'linear-gradient(160deg,rgba(52,82,108,0.55),rgba(18,28,38,0.7))', border: '1px solid rgba(150,190,220,0.18)', boxShadow: '0 10px 30px rgba(0,0,0,0.4)'}}>
            <div style={{fontFamily: 'Helvetica, Arial, sans-serif', fontSize: 17, letterSpacing: '0.16em', color: 'rgba(186,212,232,0.6)'}}>
              {mode === 'tap' ? 'LIVE HALLWAY CAMERA' : '1 NEW MESSAGE'}
            </div>
            <div style={{marginTop: 14, fontFamily: 'Helvetica, Arial, sans-serif', fontSize: mode === 'tap' ? 30 : 26, lineHeight: 1.25, color: 'rgba(238,246,252,0.9)'}}>
              {mode === 'tap' ? 'Open live feed' : 'Link received'}
            </div>
            {mode === 'tap' ? (
              <div style={{marginTop: 16, boxShadow: '0 0 0 1px rgba(150,200,235,0.14)', borderRadius: 14, padding: '12px 16px', fontFamily: 'Helvetica, Arial, sans-serif', fontSize: 18, letterSpacing: '0.1em', color: 'rgba(160,206,238,0.75)'}}>
                hal.cam / n-01
              </div>
            ) : null}
          </div>
          <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(120deg, rgba(255,255,255,0.10), transparent 46%)'}} />
        </div>
      </div>
      {tap > 0.02 ? (
        <div style={{position: 'absolute', left: 616, top: 726, width: 200 * (1 + tap), height: 200 * (1 + tap), marginLeft: -100 * (1 + tap), marginTop: -100 * (1 + tap), borderRadius: '50%', border: `2px solid rgba(170,215,245,${0.45 * (1 - tap)})`, opacity: 1 - tap}} />
      ) : null}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* CCTV corridor                                                       */
/* ------------------------------------------------------------------ */

const Figure: React.FC<{
  h: number;
  x: number;
  feetY: number;
  expression?: 'neutral' | 'relief' | 'tired';
  look?: 'camera' | 'down' | 'door';
  rim?: number;
}> = ({h, x, feetY, expression = 'neutral', look = 'camera', rim = 0.8}) => {
  const w = h * (600 / 1080);
  return (
    <div style={{position: 'absolute', left: x, bottom: 1920 - feetY, width: w, height: h, filter: 'brightness(1.1) drop-shadow(0 18px 40px rgba(0,0,0,0.85))'}}>
      <Noah expression={expression as never} look={look} rim={rim} viewBox="0 0 600 1080" />
    </div>
  );
};

const CCTV: React.FC<{
  f: number;
  z?: number;
  ox?: string;
  oy?: string;
  figureX?: number;
  figureH?: number;
  expression?: 'neutral' | 'relief';
  look?: 'camera' | 'down' | 'door';
  showFigure?: boolean;
  flicker?: number;
}> = ({f, z = 1, ox = '50%', oy = '50%', figureX = 348, figureH = 690, expression = 'neutral', look = 'camera', showFigure = true, flicker = 1}) => {
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: '#07090C'}}>
      <div style={{position: 'absolute', inset: 0, transform: `scale(${z})`, transformOrigin: `${ox} ${oy}`, filter: 'saturate(0.66) contrast(1.03) brightness(1.42)'}}>
        {/* back wall */}
        <div style={{position: 'absolute', left: 246, top: 636, width: 588, height: 812, background: 'linear-gradient(180deg,#121A22 0%,#0C131A 45%,#080D12 100%)'}} />
        {/* side walls */}
        <div style={{position: 'absolute', left: 0, top: 0, width: 250, height: 1920, background: 'linear-gradient(90deg,#0A0F14,#101820)', clipPath: 'polygon(0 0, 250 636, 250 1448, 0 1920)'}} />
        <div style={{position: 'absolute', right: 0, top: 0, width: 250, height: 1920, background: 'linear-gradient(270deg,#090E13,#0E161D)', clipPath: 'polygon(250 0, 0 636, 0 1448, 250 1920)'}} />
        {/* ceiling + floor */}
        <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 640, background: 'linear-gradient(180deg,#0B1015,#121A22)', clipPath: 'polygon(0 0, 1080 0, 834 636, 246 636)'}} />
        <div style={{position: 'absolute', left: 0, top: 1444, width: 1080, height: 476, background: 'linear-gradient(180deg,#0E151B,#070B0F)', clipPath: 'polygon(246 0, 834 0, 1080 476, 0 476)'}} />
        {/* ceiling light strip */}
        <div style={{position: 'absolute', left: 505, top: 0, width: 70, height: 610, background: 'linear-gradient(180deg, rgba(196,222,240,0.22), rgba(196,222,240,0.04))', clipPath: 'polygon(6% 0, 94% 0, 78% 100%, 22% 100%)', opacity: 0.55 + Math.sin(f / 13) * 0.06, filter: 'blur(2px)'}} />
        {/* ceiling tube */}
        <div style={{position: 'absolute', left: 372, top: 70, width: 336, height: 26, borderRadius: 13, background: 'linear-gradient(180deg,#DCEAF4,#9FC2DC)', boxShadow: '0 0 60px 18px rgba(170,206,232,0.30)', opacity: 0.85 + Math.sin(f / 17) * 0.05}} />
        {/* wall seams */}
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{position: 'absolute', left: 246 + i * 147, top: 636, width: 2, height: 808, background: 'rgba(150,180,205,0.06)'}} />
        ))}
        <div style={{position: 'absolute', left: 246, right: 246, top: 1000, height: 2, background: 'rgba(150,180,205,0.05)'}} />

        {/* apartment door */}
        <div style={{position: 'absolute', left: 418, top: 752, width: 244, height: 692, background: 'linear-gradient(100deg,#1D252F,#111922 58%,#0B1117)', border: '6px solid #0A0F14', boxShadow: '0 0 0 3px rgba(150,186,214,0.10), 0 0 50px rgba(150,190,220,0.10), inset 0 0 60px rgba(0,0,0,0.75)'}}>
          <div style={{position: 'absolute', left: 18, top: 70, right: 18, height: 220, border: '2px solid rgba(176,206,230,0.16)', boxShadow: 'inset 0 0 24px rgba(0,0,0,0.5)'}} />
          <div style={{position: 'absolute', left: 18, top: 340, right: 18, height: 280, border: '2px solid rgba(176,206,230,0.13)', boxShadow: 'inset 0 0 24px rgba(0,0,0,0.5)'}} />
          <div style={{position: 'absolute', right: 18, top: 350, width: 11, height: 11, borderRadius: '50%', background: '#4B525A'}} />
          <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 2, background: 'rgba(160,194,220,0.16)'}} />
        </div>
        <div style={{position: 'absolute', left: 424, top: 1442, width: 232, height: 3, background: 'rgba(170,206,232,0.16)', filter: 'blur(1px)'}} />
        {/* cool overhead cone */}
        <svg viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0, width: 1080, height: 1920}}>
          <defs>
            <linearGradient id="coneG" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#A6CBE4" stopOpacity="0.30" />
              <stop offset="55%" stopColor="#A6CBE4" stopOpacity="0.10" />
              <stop offset="100%" stopColor="#A6CBE4" stopOpacity="0.01" />
            </linearGradient>
            <filter id="coneBlur" x="-30%" y="-20%" width="160%" height="150%">
              <feGaussianBlur stdDeviation="22" />
            </filter>
          </defs>
          <polygon points="455,660 625,660 830,1460 250,1460" fill="url(#coneG)" filter="url(#coneBlur)" />
        </svg>
        {/* floor sheen so feet stay grounded */}
        <div style={{position: 'absolute', left: 0, top: 1440, width: 1080, height: 480, background: 'linear-gradient(180deg, rgba(150,190,220,0.10), rgba(150,190,220,0.02) 40%, transparent 80%)'}} />
        {/* hall practicals */}
        <div style={{position: 'absolute', left: 250, top: 560, width: 580, height: 420, background: 'radial-gradient(ellipse at 50% 20%, rgba(150,190,220,0.20), transparent 70%)', filter: 'blur(26px)'}} />
        <div style={{position: 'absolute', left: 330, top: 1452, width: 420, height: 170, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(160,198,228,0.16), transparent 70%)', filter: 'blur(18px)'}} />
        <div style={{position: 'absolute', left: 0, top: 1400, width: 246, height: 4, background: 'rgba(150,184,210,0.10)'}} />
        <div style={{position: 'absolute', right: 0, top: 1400, width: 246, height: 4, background: 'rgba(150,184,210,0.08)'}} />
        <div style={{position: 'absolute', left: 246, top: 630, width: 588, height: 30, background: 'linear-gradient(180deg,#1B242D,#101820)'}} />
        <div style={{position: 'absolute', left: 246, top: 660, width: 588, height: 90, background: 'linear-gradient(180deg,rgba(0,0,0,0.55),transparent)'}} />
        <div style={{position: 'absolute', left: 246, top: 1428, width: 588, height: 18, background: 'linear-gradient(180deg,#0D141A,#080C10)'}} />


        {/* figure */}
        {showFigure ? <Figure h={figureH} x={figureX} feetY={1444} expression={expression} look={look} /> : null}
      </div>

      {/* cctv look */}
      <AbsoluteFill style={{backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.22) 0px, rgba(0,0,0,0.22) 1px, transparent 2px, transparent 4px)', opacity: 0.35, mixBlendMode: 'multiply'}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 64% 60% at 50% 46%, transparent 50%, rgba(0,0,0,0.5) 100%)'}} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(120,160,190,0.05), transparent 30%, transparent 70%, rgba(0,0,0,0.4))'}} />
      <AbsoluteFill style={{opacity: 0.05 * flicker, background: '#9FC6E8'}} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Part 2                                                              */
/* ------------------------------------------------------------------ */

export const Part2: React.FC = () => {
  const f = useCurrentFrame();
  const range = (s: number, e: number) => f >= s && f < e;
  const p = (s: number, e: number) => clamp01((f - s) / (e - s));

  // figure walks in during shot 11
  const walk = p(659, 735);
  const figureX = interpolate(walk, [0, 1], [1090, 470]);
  const step = Math.sin(walk * Math.PI * 6) * 6 * (walk > 0.02 && walk < 0.98 ? 1 : 0);

  return (
    <AbsoluteFill style={{backgroundColor: '#000', overflow: 'hidden'}}>
      <Audio src={staticFile('audio/pt2.mp3')} />
      <Audio src={staticFile('audio/rain.wav')} volume={0.1} />

      {/* 01 behind Noah, eye on the door */}
      {range(0, 70) ? (
        <AbsoluteFill style={{background: '#05070A'}}>
          <Cam z={1.24 + p(0, 70) * 0.03} ox="60%" oy="58%">
            <Room f={f} phoneOn={0.35} fg />
            <div style={{position: 'absolute', left: 470, bottom: 1920 - FLOOR, width: NOAH_W, height: NOAH_H, filter: 'drop-shadow(0 24px 50px rgba(0,0,0,0.85))'}}>
              <Noah expression="fear" look="door" rim={1.1} viewBox="0 0 600 1080" />
            </div>
          </Cam>
          <Vignette strength={0.9} />
        </AbsoluteFill>
      ) : null}

      {/* 02 he can't move */}
      {range(70, 142) ? (
        <AbsoluteFill style={{background: '#04060A'}}>
          <Cam z={1.02 + p(70, 142) * 0.05} ox="52%" oy="44%">
            <Room f={f} phoneOn={0.3} />
            <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.9))'}}>
              <Noah expression="fear" look="door" lidOverride={blinkAt(f, 118)} rim={1.15} viewBox="196 24 208 370" preserve="xMidYMid slice" />
            </div>
          </Cam>
          <Vignette strength={0.92} />
        </AbsoluteFill>
      ) : null}

      {/* 03 rain outside */}
      {range(142, 242) ? (
        <AbsoluteFill style={{background: '#05070A'}}>
          <Cam z={1.95 + p(142, 242) * 0.1} ox="26%" oy="32%">
            <Room f={f} />
          </Cam>
          <AbsoluteFill style={{background: 'radial-gradient(640px 720px at 40% 40%, transparent 30%, rgba(0,0,0,0.6) 100%)'}} />
        </AbsoluteFill>
      ) : null}

      {/* 04 phone vibrates in hand */}
      {range(242, 332) ? (
        <AbsoluteFill>
          <HandPhone f={f} buzz={range(262, 322) ? 1 : 0.15} mode="buzz" />
          <Vignette strength={0.82} />
        </AbsoluteFill>
      ) : null}

      {/* 05 another message - close, phone glow */}
      {range(332, 376) ? (
        <AbsoluteFill style={{background: '#04060A'}}>
          <Cam z={1.04 + p(332, 376) * 0.04} ox="52%" oy="44%">
            <Room f={f} phoneOn={1} />
            <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.9))'}}>
              <Noah expression="fear" look="down" rim={1.1} viewBox="196 24 208 370" preserve="xMidYMid slice" />
            </div>
          </Cam>
          <AbsoluteFill style={{background: 'radial-gradient(420px 340px at 40% 46%, rgba(120,180,230,0.16), transparent 70%)'}} />
          <Vignette strength={0.92} />
        </AbsoluteFill>
      ) : null}

      {/* 06 this time, a link */}
      {range(376, 435) ? (
        <AbsoluteFill>
          <MsgLink f={f} push={p(376, 435)} />
          <Grain f={f} opacity={0.09} />
        </AbsoluteFill>
      ) : null}

      {/* 07 live hallway camera */}
      {range(435, 498) ? (
        <AbsoluteFill>
          <MsgLink f={f} push={0.4 + p(435, 498) * 0.5} />
          <Grain f={f} opacity={0.09} />
        </AbsoluteFill>
      ) : null}

      {/* 08 tap */}
      {range(498, 561) ? (
        <AbsoluteFill>
          <HandPhone f={f} tap={clamp01((f - 528) / 14)} buzz={0.3} mode="tap" />
          <AbsoluteFill style={{background: `rgba(120,180,230,${f > 546 ? Math.sin((f - 546) * 1.4) * 0.05 + 0.05 : 0})`}} />
          <Vignette strength={0.8} />
        </AbsoluteFill>
      ) : null}

      {/* 09 corridor appears */}
      {range(561, 614) ? (
        <AbsoluteFill>
          <CCTV f={f} z={1.06} showFigure={false} flicker={0.7} />
          <AbsoluteFill style={{background: `rgba(160,200,230,${f < 570 ? (570 - f) * 0.02 : 0})`}} />
        </AbsoluteFill>
      ) : null}

      {/* 10 empty at first */}
      {range(614, 659) ? (
        <AbsoluteFill>
          <CCTV f={f} z={1.02} showFigure={false} flicker={1} />
        </AbsoluteFill>
      ) : null}

      {/* 11 someone steps into view */}
      {range(659, 735) ? (
        <AbsoluteFill>
          <CCTV f={f} z={1.0 + p(659, 735) * 0.05} figureX={figureX} figureH={690} look="door" showFigure />
          <AbsoluteFill style={{background: 'rgba(0,0,0,0.001)'}} />
        </AbsoluteFill>
      ) : null}

      {/* 12 gasp -> Noah reaction */}
      {range(735, 800) ? (
        <AbsoluteFill>
          {f < 752 ? (
            <CCTV f={f} z={1.7} ox="50%" oy="56%" figureX={348} figureH={690} look="door" />
          ) : (
            <>
              <AbsoluteFill style={{background: '#04060A'}} />
              <Cam z={1.03 + p(752, 800) * 0.05} ox="52%" oy="44%">
                <Room f={f} phoneOn={0.5} />
                <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.9))'}}>
                  <Noah expression="fear" look="camera" mouth={0.25} rim={1.15} viewBox="196 24 208 370" preserve="xMidYMid slice" />
                </div>
              </Cam>
              <Vignette strength={0.92} />
            </>
          )}
        </AbsoluteFill>
      ) : null}

      {/* 13 same clothes */}
      {range(800, 846) ? (
        <AbsoluteFill>
          <CCTV f={f} z={1.45} ox="50%" oy="54%" figureX={348} figureH={690} look="door" />
          <AbsoluteFill style={{background: 'rgba(0,0,0,0.002)'}} />
        </AbsoluteFill>
      ) : null}

      {/* 14 the scar */}
      {range(846, 920) ? (
        <AbsoluteFill>
          <CCTV f={f} z={2.0 + p(846, 920) * 0.7} ox="50%" oy="46%" figureX={348} figureH={690} look="door" />
        </AbsoluteFill>
      ) : null}

      {/* 15 it was Noah */}
      {range(920, 960) ? (
        <AbsoluteFill style={{background: '#04060A'}}>
          <Cam z={1.03 + p(920, 960) * 0.05} ox="52%" oy="44%">
            <Room f={f} phoneOn={0.4} />
            <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.9))'}}>
              <Noah expression="fear" look={f < 944 ? 'down' : 'camera'} rim={1.1} viewBox="196 24 208 370" preserve="xMidYMid slice" />
            </div>
          </Cam>
          <Vignette strength={0.93} />
        </AbsoluteFill>
      ) : null}

      {/* 16 standing outside his own door */}
      {range(960, 1037) ? (
        <AbsoluteFill>
          <CCTV f={f} z={1.05 + p(960, 1037) * 0.04} figureX={348} figureH={690} look="door" />
        </AbsoluteFill>
      ) : null}

      {/* 17 the figure turns toward the camera */}
      {range(1037, 1124) ? (
        <AbsoluteFill>
          <CCTV f={f} z={1.3 + p(1037, 1124) * 0.16} ox="50%" oy="52%" figureX={348} figureH={690} look={f < 1080 ? 'door' : 'camera'} expression={f < 1080 ? 'neutral' : 'relief'} />
        </AbsoluteFill>
      ) : null}

      {/* 18 and smiled */}
      {range(1124, 1172) ? (
        <AbsoluteFill>
          <CCTV f={f} z={2.3 + p(1124, 1172) * 0.3} ox="50%" oy="45%" figureX={348} figureH={690} look="camera" expression={f < 1140 ? 'relief' : 'relief'} />
        </AbsoluteFill>
      ) : null}

      {/* 19 inside, phone lights up one last time */}
      {range(1172, 1299) ? (
        <AbsoluteFill style={{background: '#04060A'}}>
          <Cam z={1.26 + p(1172, 1299) * 0.04} ox="56%" oy="52%">
            <Room f={f} phoneOn={f < 1190 ? 0.1 : 1} />
            <div style={{position: 'absolute', left: 470, bottom: 1920 - FLOOR, width: NOAH_W, height: NOAH_H, filter: 'drop-shadow(0 24px 50px rgba(0,0,0,0.85))', transform: `translateY(${f > 1188 ? -2 + Math.sin(f / 5) * 1.2 : 0}px)`}}>
              <Noah expression={f < 1190 ? 'fear' : 'sad'} look="down" rim={1.05} viewBox="0 0 600 1080" />
            </div>
          </Cam>
          <AbsoluteFill style={{background: `radial-gradient(420px 360px at 42% 52%, rgba(120,180,230,${f < 1190 ? 0.04 : 0.16}), transparent 70%)`}} />
          <Vignette strength={0.92} />
        </AbsoluteFill>
      ) : null}

      {/* 20 you're not the first Noah */}
      {range(1299, 1352) ? (
        <AbsoluteFill>
          <MsgFinal f={f} push={p(1299, 1352) * 0.7} />
          <Grain f={f} opacity={0.09} />
          <AbsoluteFill style={{background: `rgba(0,0,0,${clamp01((f - 1344) / 8)})`}} />
        </AbsoluteFill>
      ) : null}

      {f >= 1352 ? <AbsoluteFill style={{background: '#000'}} /> : null}

      {f < 1352 ? <Grain f={f} opacity={0.14} /> : null}
    </AbsoluteFill>
  );
};
