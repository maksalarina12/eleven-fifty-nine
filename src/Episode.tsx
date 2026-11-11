import React from 'react';
import {AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Noah} from './character/Noah';
import type {Expression, Look} from './character/Noah';

export const FLOOR = 1370;
export const NOAH_H = 700;
export const NOAH_W = NOAH_H * (600 / 1080);

export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */

export const Cam: React.FC<{
  z: number;
  ox?: string;
  oy?: string;
  x?: number;
  y?: number;
  children: React.ReactNode;
}> = ({z, ox = '50%', oy = '50%', x = 0, y = 0, children}) => (
  <AbsoluteFill
    style={{
      transform: `translate(${x}px, ${y}px) scale(${z})`,
      transformOrigin: `${ox} ${oy}`,
    }}
  >
    {children}
  </AbsoluteFill>
);

export const Grain: React.FC<{f: number; opacity?: number}> = ({f, opacity = 0.16}) => (
  <AbsoluteFill
    style={{
      backgroundImage: `url(${staticFile('grain.png')})`,
      backgroundSize: '540px 960px',
      backgroundPosition: `${(f * 41) % 540}px ${(f * 67) % 960}px`,
      opacity,
      mixBlendMode: 'overlay',
      pointerEvents: 'none',
    }}
  />
);

export const Vignette: React.FC<{strength?: number}> = ({strength = 0.9}) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse 62% 58% at 50% 44%, transparent 34%, rgba(0,0,0,${strength}) 100%)`,
      pointerEvents: 'none',
    }}
  />
);

export const blinkAt = (f: number, at: number) => {
  const d = f - at;
  if (d < 0 || d > 7) return 0;
  return d < 3 ? d / 3 : 1 - (d - 3) / 4;
};

/* ------------------------------------------------------------------ */
/* environment                                                         */
/* ------------------------------------------------------------------ */

export const RainStreaks: React.FC<{f: number; speed?: number; opacity?: number; blur?: number}> = ({
  f,
  speed = 16,
  opacity = 0.5,
  blur = 0,
}) => {
  const y = (f * speed) % 300;
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <div
        style={{
          position: 'absolute',
          inset: '-300px 0 0 0',
          backgroundImage:
            'repeating-linear-gradient(101deg, transparent 0px, transparent 26px, rgba(186,216,240,0.30) 27px, rgba(186,216,240,0.02) 29px, transparent 32px)',
          transform: `translateY(${y}px)`,
          opacity,
          filter: blur ? `blur(${blur}px)` : undefined,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: '-300px 0 0 0',
          backgroundImage:
            'repeating-linear-gradient(96deg, transparent 0px, transparent 54px, rgba(160,198,228,0.20) 55px, rgba(160,198,228,0.01) 58px, transparent 62px)',
          transform: `translateY(${(f * speed * 1.7) % 500}px)`,
          opacity: opacity * 0.6,
          filter: 'blur(1px)',
        }}
      />
    </AbsoluteFill>
  );
};

export const WindowView: React.FC<{f: number}> = ({f}) => {
  const dots = [
    [58, 150, 7, '#8FB6D6', 0.5],
    [126, 220, 5, '#E0B48C', 0.45],
    [212, 128, 9, '#7FA6C8', 0.4],
    [292, 246, 6, '#D9B08A', 0.35],
    [356, 176, 5, '#9FC2DE', 0.4],
    [94, 320, 4, '#B78E68', 0.3],
    [268, 352, 8, '#7FA6C8', 0.3],
    [330, 300, 4, '#E0B48C', 0.35],
    [176, 386, 5, '#9FC2DE', 0.28],
    [38, 410, 6, '#C8A278', 0.25],
    [392, 390, 3, '#D9B08A', 0.3],
    [246, 430, 5, '#8FB6D6', 0.22],
  ] as const;
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: 'linear-gradient(180deg,#18293B 0%,#101D2A 48%,#0A1219 100%)'}}>
      {/* distant buildings */}
      <div style={{position: 'absolute', left: -30, right: -30, bottom: 0, height: 380, background: 'linear-gradient(180deg, rgba(12,22,32,0.2), rgba(7,12,18,0.9))'}} />
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: 20 + i * 88,
            bottom: 120 + (i % 3) * 26,
            width: 62,
            height: 130 + (i % 4) * 40,
            background: 'rgba(8,14,20,0.85)',
          }}
        >
          {Array.from({length: 6}).map((_, j) => (
            <div
              key={j}
              style={{
                position: 'absolute',
                left: 8 + (j % 2) * 26,
                top: 10 + Math.floor(j / 2) * 34,
                width: 14,
                height: 18,
                background: (i + j) % 3 === 0 ? 'rgba(226,178,118,0.5)' : 'rgba(126,166,200,0.14)',
              }}
            />
          ))}
        </div>
      ))}
      {/* bokeh lights */}
      {dots.map(([x, y, r, c, o], i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: x - r,
            top: y - r + Math.sin((f + i * 24) / 90) * 2,
            width: r * 2,
            height: r * 2,
            borderRadius: '50%',
            background: c,
            opacity: o,
            filter: 'blur(3px)',
          }}
        />
      ))}
      <RainStreaks f={f} speed={11} opacity={0.7} />
      <RainStreaks f={f} speed={26} opacity={0.3} blur={1.4} />
      {/* glass sheen + beading */}
      <AbsoluteFill style={{background: 'linear-gradient(125deg, rgba(170,206,232,0.14) 0%, transparent 42%, transparent 68%, rgba(150,186,214,0.08) 100%)'}} />
      <AbsoluteFill style={{backgroundImage: 'radial-gradient(circle at 30% 40%, rgba(255,255,255,0.10) 0 1px, transparent 2px), radial-gradient(circle at 68% 62%, rgba(255,255,255,0.08) 0 1px, transparent 2px)', backgroundSize: '120px 160px, 190px 220px'}} />
    </AbsoluteFill>
  );
};

export const Room: React.FC<{f: number; phoneOn?: number; doorVibe?: number; fg?: boolean}> = ({
  f,
  phoneOn = 0,
  doorVibe = 0,
  fg = false,
}) => {
  const flicker = 0.94 + Math.sin(f / 11) * 0.02 + Math.sin(f / 37) * 0.02;
  return (
    <>
      {/* wall */}
      <AbsoluteFill style={{background: 'linear-gradient(168deg,#0C1118 0%,#080C11 52%,#05080B 100%)'}} />
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(720px 940px at 23% 36%, rgba(84,134,176,0.30), transparent 70%), radial-gradient(520px 660px at 78% 70%, rgba(206,132,78,0.15), transparent 72%)',
        }}
      />
      {/* faint wall texture */}
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} style={{position: 'absolute', left: 0, right: 0, top: 220 + i * 210, height: 1, background: 'rgba(150,182,208,0.05)'}} />
      ))}

      {/* window */}
      <div style={{position: 'absolute', left: 70, top: 300, width: 430, height: 640, border: '14px solid #0A0C0F', boxShadow: '0 0 0 2px rgba(140,175,205,0.08), inset 0 0 90px rgba(0,0,0,0.9)', overflow: 'hidden'}}>
        <WindowView f={f} />
        <div style={{position: 'absolute', left: '50%', top: 0, bottom: 0, width: 10, marginLeft: -5, background: '#0A0C0F'}} />
        <div style={{position: 'absolute', top: '46%', left: 0, right: 0, height: 10, background: '#0A0C0F'}} />
      </div>
      {/* sill */}
      <div style={{position: 'absolute', left: 44, top: 940, width: 482, height: 16, background: '#12161B', boxShadow: '0 10px 28px rgba(0,0,0,0.75)'}} />

      {/* desk */}
      <div style={{position: 'absolute', left: 96, top: 1030, width: 400, height: 26, background: 'linear-gradient(180deg,#1A1E24,#0D1014)', boxShadow: '0 10px 30px rgba(0,0,0,0.7)'}} />
      <div style={{position: 'absolute', left: 116, top: 1056, width: 16, height: 300, background: '#0C0F13'}} />
      <div style={{position: 'absolute', left: 462, top: 1056, width: 16, height: 300, background: '#0A0D11'}} />
      {/* phone lying flat on the desk */}
      <div style={{position: 'absolute', left: 312, top: 992, width: 62, height: 38, borderRadius: 7, background: 'linear-gradient(160deg,#12161C,#05070A)', border: '1px solid #262C33', transform: 'rotate(-11deg) skewX(-8deg)', boxShadow: `0 0 ${18 + phoneOn * 26}px ${3 + phoneOn * 7}px rgba(96,150,200,${0.10 + phoneOn * 0.26})`}}>
        <div style={{position: 'absolute', inset: 3, borderRadius: 4, background: `linear-gradient(165deg, rgba(159,198,232,${0.16 + phoneOn * 0.55}), rgba(60,98,132,${0.12 + phoneOn * 0.34}))`}} />
        <div style={{position: 'absolute', inset: 3, borderRadius: 4, background: 'linear-gradient(120deg, rgba(255,255,255,0.26), transparent 58%)', opacity: phoneOn}} />
      </div>
      {/* desk lamp */}
      <div style={{position: 'absolute', left: 392, top: 812, width: 240, height: 240, borderRadius: '50%', background: 'radial-gradient(circle, rgba(240,172,110,0.34), transparent 66%)', filter: 'blur(16px)', opacity: flicker}} />
      <div style={{position: 'absolute', left: 486, top: 862, width: 7, height: 168, background: 'linear-gradient(180deg,#221C17,#0E0B09)', borderRadius: 3}} />
      <div style={{position: 'absolute', left: 448, top: 996, width: 78, height: 12, borderRadius: '50%', background: '#100D0B', boxShadow: '0 6px 18px rgba(0,0,0,0.8)'}} />
      <div style={{position: 'absolute', left: 448, top: 826, width: 84, height: 54, background: 'linear-gradient(180deg,#241C16,#120E0B)', clipPath: 'polygon(16% 0%, 84% 0%, 100% 100%, 0% 100%)', boxShadow: '0 10px 30px rgba(0,0,0,0.6)'}} />
      <div style={{position: 'absolute', left: 456, top: 872, width: 68, height: 7, borderRadius: 4, background: 'rgba(244,188,132,0.55)', filter: 'blur(1px)'}} />

      {/* door casing */}
      <div style={{position: 'absolute', left: 776, top: 218, width: 250, height: 1046, background: '#151A20', boxShadow: '0 0 40px rgba(0,0,0,0.7)'}} />
      <div style={{position: 'absolute', left: 778, top: 220, width: 4, height: 1042, background: 'rgba(176,206,232,0.20)'}} />
      {/* door */}
      <div
        style={{
          position: 'absolute',
          left: 792,
          top: 236,
          width: 218,
          height: 1014,
          background: 'linear-gradient(100deg,#131920,#0C1015 58%,#080B0F)',
          border: '9px solid #090B0E',
          boxShadow: 'inset 0 0 70px rgba(0,0,0,0.85), 0 0 42px rgba(0,0,0,0.6)',
          transform: `translateX(${doorVibe}px)`,
        }}
      >
        <div style={{position: 'absolute', inset: 6, border: '1px solid rgba(160,190,215,0.06)'}} />
        <div style={{position: 'absolute', left: 22, top: 96, right: 22, height: 300, border: '1px solid rgba(176,206,232,0.10)'}} />
        <div style={{position: 'absolute', left: 22, top: 470, right: 22, height: 400, border: '1px solid rgba(176,206,232,0.08)'}} />
        <div style={{position: 'absolute', right: 20, top: 500, width: 12, height: 12, borderRadius: '50%', background: 'linear-gradient(140deg,#4A5058,#22262B)'}} />
        <div style={{position: 'absolute', left: 0, top: 0, width: 2, bottom: 0, background: 'rgba(150,186,214,0.16)'}} />
      </div>
      {/* light under door */}
      <div style={{position: 'absolute', left: 800, top: 1246, width: 202, height: 3, background: 'rgba(150,190,220,0.18)', filter: 'blur(1px)'}} />

      {/* chair */}
      <div style={{position: 'absolute', left: 196, top: 946, width: 180, height: 224, borderRadius: '18px 18px 6px 6px', background: 'linear-gradient(160deg,#11151A,#080B0E)', boxShadow: 'inset 0 0 30px rgba(0,0,0,0.8), 0 10px 30px rgba(0,0,0,0.6)'}} />
      <div style={{position: 'absolute', left: 176, top: 1162, width: 220, height: 22, borderRadius: 8, background: '#0D1116'}} />
      <div style={{position: 'absolute', left: 196, top: 1184, width: 12, height: 150, background: '#0A0D11'}} />
      <div style={{position: 'absolute', left: 364, top: 1184, width: 12, height: 150, background: '#080B0E'}} />
      {/* wall frame */}
      <div style={{position: 'absolute', left: 584, top: 386, width: 168, height: 214, border: '7px solid #12161B', background: 'linear-gradient(160deg,#0B1017,#070A0E)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)'}}>
        <div style={{position: 'absolute', inset: 10, background: 'radial-gradient(120px 140px at 40% 36%, rgba(126,166,198,0.16), transparent 70%)'}} />
      </div>

      {/* floor */}
      <div style={{position: 'absolute', left: 0, right: 0, top: FLOOR, height: 1920 - FLOOR, background: 'linear-gradient(180deg,#0A0C10 0%,#06080B 55%,#030406 100%)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: FLOOR, height: 2, background: 'rgba(160,192,218,0.10)'}} />
      <div style={{position: 'absolute', left: 176, top: 1478, width: 700, height: 190, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(96,132,166,0.10), transparent 72%)'}} />
      <div style={{position: 'absolute', left: 196, top: 1492, width: 660, height: 160, borderRadius: '50%', border: '1px solid rgba(140,176,204,0.07)'}} />
      <div style={{position: 'absolute', left: 40, top: 1360, width: 620, height: 420, background: 'radial-gradient(ellipse at 20% 0%, rgba(96,142,184,0.16), transparent 68%)', filter: 'blur(18px)'}} />
      <div style={{position: 'absolute', left: 520, top: 1352, width: 260, height: 54, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(0,0,0,0.8), transparent 68%)', filter: 'blur(7px)'}} />
      {fg ? (
        <>
          <div style={{position: 'absolute', left: -80, bottom: -40, width: 780, height: 400, borderRadius: '60px 60px 0 0', background: 'linear-gradient(180deg,#0B0F14,#05080B)', boxShadow: 'inset 0 2px 0 rgba(150,186,214,0.10)', filter: 'blur(5px)'}} />
          <div style={{position: 'absolute', left: 60, bottom: 210, width: 560, height: 130, borderRadius: '40px 30px 0 0', background: 'linear-gradient(180deg,#0D1218,#070A0E)', filter: 'blur(3px)'}} />
        </>
      ) : null}
    </>
  );
};

/* ------------------------------------------------------------------ */
/* phone inserts                                                       */
/* ------------------------------------------------------------------ */

const PhoneInsert: React.FC<{f: number; message: string; lines: string[]; push?: number}> = ({
  f,
  message,
  lines,
  push = 0,
}) => {
  const glow = 0.55 + Math.sin(f / 9) * 0.05;
  return (
    <AbsoluteFill style={{background: '#05070A', overflow: 'hidden'}}>
      <AbsoluteFill style={{background: 'radial-gradient(760px 900px at 50% 46%, rgba(40,72,104,0.55), transparent 70%), radial-gradient(500px 600px at 22% 82%, rgba(196,124,72,0.12), transparent 70%), linear-gradient(180deg,#070A0F,#04060A)'}} />
      {/* out-of-focus room shapes */}
      <div style={{position: 'absolute', left: -60, top: 180, width: 420, height: 900, background: 'rgba(120,160,196,0.05)', filter: 'blur(60px)'}} />
      <div style={{position: 'absolute', right: -80, top: 700, width: 460, height: 700, background: 'rgba(214,140,84,0.06)', filter: 'blur(70px)'}} />
      <div style={{position: 'absolute', left: '50%', top: '46%', width: 700, height: 980, marginLeft: -350, marginTop: -490, borderRadius: '50%', background: `radial-gradient(circle, rgba(96,150,200,${0.30 * glow}), transparent 65%)`, filter: 'blur(40px)'}} />

      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: 566,
          height: 1120,
          marginLeft: -283,
          marginTop: -560,
          transform: `scale(${1 + push * 0.06}) rotate(-2.2deg)`,
        }}
      >
        <div style={{position: 'absolute', inset: 0, borderRadius: 84, background: 'linear-gradient(150deg,#1A1E24,#07090C 40%,#040507)', boxShadow: '0 40px 120px rgba(0,0,0,0.9), 0 0 90px rgba(90,142,186,0.22)'}}>
          <div style={{position: 'absolute', inset: 10, borderRadius: 76, background: '#04060A', overflow: 'hidden'}}>
            {/* screen */}
            <div style={{position: 'absolute', inset: 6, borderRadius: 70, background: 'linear-gradient(175deg,#0B1420 0%,#070C13 55%,#05080D 100%)', overflow: 'hidden'}}>
              <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 300, background: 'linear-gradient(180deg, rgba(70,118,158,0.22), transparent)'}} />
              {/* status row */}
              <div style={{position: 'absolute', left: 46, top: 74, right: 46, display: 'flex', justifyContent: 'space-between', fontFamily: 'Helvetica, Arial, sans-serif', fontSize: 24, color: 'rgba(232,240,248,0.62)', letterSpacing: '0.02em'}}>
                <span>11:59</span>
                <span>▮▮▮</span>
              </div>
              {/* header */}
              <div style={{position: 'absolute', left: 0, right: 0, top: 138, textAlign: 'center', fontFamily: 'Helvetica, Arial, sans-serif', fontSize: 26, letterSpacing: '0.18em', color: 'rgba(196,214,230,0.55)'}}>
                MESSAGES
              </div>
              <div style={{position: 'absolute', left: 46, right: 46, top: 196, height: 1, background: 'rgba(150,186,214,0.14)'}} />
              <div style={{position: 'absolute', left: 46, top: 236, fontFamily: 'Helvetica, Arial, sans-serif', fontSize: 24, letterSpacing: '0.16em', color: 'rgba(170,196,220,0.5)'}}>
                UNKNOWN NUMBER
              </div>
              {/* bubble */}
              <div style={{position: 'absolute', left: 46, right: 90, top: 306, padding: '46px 40px', borderRadius: '8px 34px 34px 34px', background: 'linear-gradient(160deg,#1B2733,#111A24)', border: '1px solid rgba(150,190,220,0.12)', boxShadow: '0 12px 40px rgba(0,0,0,0.5)'}}>
                <div style={{fontFamily: 'Helvetica, Arial, sans-serif', fontWeight: 500, fontSize: 58, lineHeight: 1.22, letterSpacing: '0.03em', color: '#F1EEE7'}}>
                  {lines.map((l) => (
                    <div key={l}>{l}</div>
                  ))}
                </div>
              </div>
              <div style={{position: 'absolute', left: 46, bottom: 84, fontFamily: 'Helvetica, Arial, sans-serif', fontSize: 22, letterSpacing: '0.14em', color: 'rgba(150,180,206,0.35)'}}>
                {message}
              </div>
              {/* screen reflection */}
              <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(122deg, rgba(255,255,255,0.10) 0%, transparent 38%, transparent 62%, rgba(160,200,230,0.06) 100%)'}} />
            </div>
          </div>
          <div style={{position: 'absolute', left: '50%', top: 22, width: 150, height: 26, marginLeft: -75, borderRadius: 14, background: '#04060A'}} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

const DeskInsert: React.FC<{f: number; on: number; buzz?: number}> = ({f, on, buzz = 0}) => (
  <AbsoluteFill style={{background: '#05070A', overflow: 'hidden'}}>
    <AbsoluteFill style={{background: 'radial-gradient(900px 760px at 46% 44%, rgba(44,78,110,0.5), transparent 72%), linear-gradient(180deg,#0A0F15,#05070B 60%,#030406)'}} />
    {/* desktop plane */}
    <div style={{position: 'absolute', left: -60, right: -60, top: 980, height: 940, background: 'linear-gradient(180deg,#12161C 0%,#0A0D11 30%,#05070A 100%)', transform: 'perspective(1200px) rotateX(6deg)', transformOrigin: '50% 0'}} />
    <div style={{position: 'absolute', left: -60, right: -60, top: 978, height: 3, background: 'rgba(150,186,214,0.10)'}} />
    {/* blurred lamp */}
    <div style={{position: 'absolute', right: -60, top: 420, width: 460, height: 460, borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,168,108,0.35), transparent 68%)', filter: 'blur(26px)'}} />
    {/* phone lying on desk */}
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: 300,
        height: 540,
        marginLeft: -150,
        marginTop: -260,
        borderRadius: 44,
        background: 'linear-gradient(150deg,#1D2229,#06080B 45%,#040507)',
        transform: `translateY(${Math.sin(f * 3.1) * buzz * 2}px) rotate(${-14 + buzz * 1.2}deg) scale(1.02)`,
        boxShadow: `0 34px 90px rgba(0,0,0,0.9), 0 0 ${30 + on * 90}px ${6 + on * 20}px rgba(96,150,200,${0.1 + on * 0.32})`,
      }}
    >
      <div style={{position: 'absolute', inset: 9, borderRadius: 36, background: '#04060A', overflow: 'hidden'}}>
        <div style={{position: 'absolute', inset: 4, borderRadius: 32, background: `linear-gradient(170deg, rgba(140,190,228,${0.12 + on * 0.55}), rgba(52,88,118,${0.10 + on * 0.3}) 60%, rgba(20,34,46,${0.15 + on * 0.2}))`}} />
        {on > 0.4 ? (
          <div style={{position: 'absolute', left: 30, right: 30, top: 150, opacity: clamp01((on - 0.4) * 2)}}>
            <div style={{fontFamily: 'Helvetica, Arial, sans-serif', fontSize: 18, letterSpacing: '0.16em', color: 'rgba(20,34,44,0.75)'}}>UNKNOWN NUMBER</div>
            <div style={{marginTop: 16, fontFamily: 'Helvetica, Arial, sans-serif', fontSize: 30, lineHeight: 1.2, fontWeight: 600, color: 'rgba(12,22,30,0.9)'}}>
              DON&apos;T OPEN
              <br />
              THE DOOR.
            </div>
          </div>
        ) : null}
      </div>
      <div style={{position: 'absolute', inset: 0, borderRadius: 44, background: 'linear-gradient(120deg, rgba(255,255,255,0.10), transparent 45%)'}} />
    </div>
    {/* phone glow pool */}
    <div style={{position: 'absolute', left: '50%', top: '52%', width: 620, height: 620, marginLeft: -310, marginTop: -310, borderRadius: '50%', background: `radial-gradient(circle, rgba(100,154,204,${0.20 + on * 0.22}), transparent 66%)`, filter: 'blur(24px)'}} />
  </AbsoluteFill>
);

/* ------------------------------------------------------------------ */
/* exterior opening                                                    */
/* ------------------------------------------------------------------ */

const Exterior: React.FC<{f: number; p: number}> = ({f, p}) => {
  const z = 1.02 + p * 0.07;
  const litWindows = new Set([3, 8, 14, 21, 27, 33, 39, 46, 52, 58, 63]);
  return (
    <AbsoluteFill style={{background: '#04060A', overflow: 'hidden'}}>
      <Cam z={z} ox="52%" oy="56%">
        <AbsoluteFill style={{background: 'linear-gradient(180deg,#070C14 0%,#0B1521 42%,#0A121B 68%,#05080C 100%)'}} />
        <AbsoluteFill style={{background: 'radial-gradient(900px 700px at 66% 26%, rgba(70,108,146,0.35), transparent 70%)'}} />
        {/* building blocks */}
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const w = 210 + (i % 3) * 40;
          const h = 780 + (i % 4) * 190;
          const left = i * 205 - 70;
          const top = 760 - h + (i % 2) * 40;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left,
                top,
                width: w,
                height: h,
                background: `linear-gradient(180deg, rgba(13,20,28,${0.96 - i * 0.06}), rgba(5,9,14,${0.98}))`,
                boxShadow: i === 2 ? '0 0 90px rgba(60,100,140,0.12)' : 'none',
              }}
            >
              {Array.from({length: Math.floor(h / 92)}).map((_, j) =>
                [0, 1, 2].map((k) => {
                  const key = i * 40 + j * 3 + k;
                  const lit = litWindows.has(key);
                  return (
                    <div
                      key={k}
                      style={{
                        position: 'absolute',
                        left: 28 + k * 58,
                        top: 40 + j * 92,
                        width: 30,
                        height: 44,
                        background: lit ? 'rgba(238,190,128,0.62)' : 'rgba(120,158,192,0.07)',
                        boxShadow: lit ? '0 0 18px rgba(238,190,128,0.35)' : 'none',
                      }}
                    />
                  );
                }),
              )}
            </div>
          );
        })}
        {/* hero window - Noah's apartment */}
        <div style={{position: 'absolute', left: 604, top: 902, width: 92, height: 116, background: 'rgba(240,198,140,0.16)', boxShadow: '0 0 60px 14px rgba(238,186,124,0.28)'}}>
          <div style={{position: 'absolute', inset: 6, background: 'linear-gradient(180deg, rgba(246,206,150,0.82), rgba(214,158,100,0.5))'}} />
          <div style={{position: 'absolute', left: '50%', top: 0, bottom: 0, width: 4, marginLeft: -2, background: 'rgba(10,14,18,0.85)'}} />
        </div>
        {/* rain */}
        <RainStreaks f={f} speed={22} opacity={0.42} />
        <RainStreaks f={f} speed={38} opacity={0.22} blur={1.8} />
        {/* street haze */}
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 620, background: 'linear-gradient(180deg, transparent, rgba(26,44,60,0.55))'}} />
      </Cam>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(4,7,11,0.55) 0%, transparent 26%, transparent 70%, rgba(3,5,8,0.85) 100%)'}} />
      <Vignette strength={0.75} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* shot 16 helper: over the shoulder                                   */
/* ------------------------------------------------------------------ */

const Shoulder: React.FC<{blur?: number}> = ({blur = 7}) => (
  <>
    <div style={{position: 'absolute', left: -140, bottom: -140, width: 520, height: 620, borderRadius: '48% 52% 0 0', background: 'linear-gradient(150deg,#0A0C10,#05070A)', filter: `blur(${blur}px)`}} />
    <div style={{position: 'absolute', left: 120, bottom: 250, width: 250, height: 400, borderRadius: '50%', background: 'linear-gradient(150deg,#0B0D12,#05070A)', filter: `blur(${blur + 3}px)`}} />
  </>
);

/* ------------------------------------------------------------------ */
/* episode                                                             */
/* ------------------------------------------------------------------ */

export const Episode: React.FC = () => {
  const f = useCurrentFrame();

  const range = (s: number, e: number) => f >= s && f < e;
  const p = (s: number, e: number) => clamp01((f - s) / (e - s));

  const knockTimes = [801, 837, 876, 906];
  const knock = knockTimes.reduce((m, t) => (f >= t ? Math.max(m, Math.exp(-(f - t) / 7)) : m), 0);

  const lookX = (look: Look) => look;

  return (
    <AbsoluteFill style={{backgroundColor: '#000', overflow: 'hidden'}}>
      <Audio src={staticFile('audio/vo.mp3')} />
      <Audio src={staticFile('audio/rain.wav')} volume={0.12} />

      {/* ---------------- 01 exterior ---------------- */}
      {range(0, 102) ? <Exterior f={f} p={p(0, 102)} /> : null}

      {/* ---------------- 02 wide interior ---------------- */}
      {range(102, 204) ? (
        <AbsoluteFill style={{background: '#05070A'}}>
          <Cam z={1.2 + p(102, 204) * 0.03} ox="52%" oy="62%">
            <Room f={f} phoneOn={0} fg />
            <div
              style={{
                position: 'absolute',
                left: 470,
                bottom: 1920 - FLOOR,
                width: NOAH_W,
                height: NOAH_H,
                filter: 'drop-shadow(0 24px 50px rgba(0,0,0,0.85))',
              }}
            >
              <Noah expression="tired" look="left" rim={1} viewBox="0 0 600 1080" />
            </div>
          </Cam>
          <Vignette strength={0.86} />
        </AbsoluteFill>
      ) : null}

      {/* ---------------- 03 window insert ---------------- */}
      {range(204, 348) ? (
        <AbsoluteFill style={{background: '#05070A'}}>
          <Cam z={1.9 + p(204, 348) * 0.12} ox="26%" oy="32%">
            <Room f={f}/>
          </Cam>
          <AbsoluteFill style={{background: 'radial-gradient(600px 700px at 40% 40%, transparent 30%, rgba(0,0,0,0.55) 100%)'}} />
        </AbsoluteFill>
      ) : null}

      {/* ---------------- 04 Noah medium ---------------- */}
      {range(348, 495) ? (
        <AbsoluteFill style={{background: '#05070A'}}>
          <Cam z={1.5 + p(348, 495) * 0.05} ox="58%" oy="46%">
            <Room f={f} phoneOn={0} fg />
            <div
              style={{
                position: 'absolute',
                left: 470,
                bottom: 1920 - FLOOR,
                width: NOAH_W,
                height: NOAH_H,
                transform: `translateY(${Math.sin(f / 34) * 1.6}px)`,
                filter: 'drop-shadow(0 24px 50px rgba(0,0,0,0.85))',
              }}
            >
              <Noah expression="tired" look={f < 400 ? 'left' : 'down'} lidOverride={Math.max(blinkAt(f, 380), blinkAt(f, 452))} rim={1} viewBox="0 0 600 1080" />
            </div>
          </Cam>
          <Vignette strength={0.9} />
        </AbsoluteFill>
      ) : null}

      {/* ---------------- 05 desk insert ---------------- */}
      {range(495, 594) ? (
        <AbsoluteFill>
          <DeskInsert f={f} on={clamp01((f - 512) / 22)} />
          <Vignette strength={0.8} />
        </AbsoluteFill>
      ) : null}

      {/* ---------------- 06 Noah looks down at phone ---------------- */}
      {range(594, 702) ? (
        <AbsoluteFill style={{background: '#05070A'}}>
          <Cam z={1.62 + p(594, 702) * 0.05} ox="58%" oy="44%">
            <Room f={f} phoneOn={1} />
            <div
              style={{
                position: 'absolute',
                left: 470,
                bottom: 1920 - FLOOR,
                width: NOAH_W,
                height: NOAH_H,
                filter: 'drop-shadow(0 24px 50px rgba(0,0,0,0.85))',
              }}
            >
              <Noah expression="tired" look="down" lidOverride={Math.max(blinkAt(f, 630), blinkAt(f, 676))} rim={1} viewBox="0 0 600 1080" />
            </div>
          </Cam>
          {/* cool phone bounce on face */}
          <AbsoluteFill style={{background: 'radial-gradient(420px 360px at 40% 40%, rgba(120,180,230,0.16), transparent 70%)'}} />
          <Vignette strength={0.9} />
        </AbsoluteFill>
      ) : null}

      {/* ---------------- 07 phone insert - message 1 ---------------- */}
      {range(702, 801) ? (
        <AbsoluteFill>
          <PhoneInsert f={f} message="UNKNOWN NUMBER" lines={["DON'T OPEN", 'THE DOOR.']} push={p(702, 801)} />
          <Grain f={f} opacity={0.1} />
        </AbsoluteFill>
      ) : null}

      {/* ---------------- 08 face close - knocks ---------------- */}
      {range(801, 918) ? (
        <AbsoluteFill style={{background: '#04060A'}}>
          <Cam z={1.0 + p(801, 918) * 0.05} ox="52%" oy="46%">
            <Room f={f} phoneOn={0.2} doorVibe={knock * 1.6} />
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: 1080,
                height: 1920,
                transform: `translate(${(f >= 801 ? 1 : 0) * knock * 2}px, ${-knock * 14}px)`,
                filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.9))',
              }}
            >
              <Noah
                expression={f < 876 ? 'alert' : 'fear'}
                look={f < 820 ? 'camera' : 'door'}
                mouth={knock * 0.35}
                rim={1.15}
                viewBox="196 24 208 370"
                preserve="xMidYMid slice"
              />
            </div>
          </Cam>
          <AbsoluteFill style={{background: 'radial-gradient(560px 620px at 50% 44%, transparent 40%, rgba(0,0,0,0.62) 100%)'}} />
          <Vignette strength={0.9} />
        </AbsoluteFill>
      ) : null}

      {/* ---------------- 09 wide frozen ---------------- */}
      {range(918, 1004) ? (
        <AbsoluteFill style={{background: '#04060A'}}>
          <Cam z={1.22 + p(918, 1004) * 0.03} ox="52%" oy="62%">
            <Room f={f} phoneOn={0.1} fg />
            <div
              style={{
                position: 'absolute',
                left: 470,
                bottom: 1920 - FLOOR,
                width: NOAH_W,
                height: NOAH_H,
                filter: 'drop-shadow(0 24px 50px rgba(0,0,0,0.85))',
              }}
            >
              <Noah expression="fear" look="door" rim={1} viewBox="0 0 600 1080" />
            </div>
          </Cam>
          <Vignette strength={0.92} />
        </AbsoluteFill>
      ) : null}

      {/* ---------------- 10 Noah turns to door ---------------- */}
      {range(1004, 1065) ? (
        <AbsoluteFill style={{background: '#04060A'}}>
          <Cam z={1.44 + p(1004, 1065) * 0.05} ox="60%" oy="46%">
            <Room f={f} phoneOn={0} fg />
            <div
              style={{
                position: 'absolute',
                left: 470,
                bottom: 1920 - FLOOR,
                width: NOAH_W,
                height: NOAH_H,
                filter: 'drop-shadow(0 24px 50px rgba(0,0,0,0.85))',
              }}
            >
              <Noah expression="fear" look="door" turn={0.55} rim={1.1} viewBox="0 0 600 1080" />
            </div>
          </Cam>
          <Vignette strength={0.9} />
        </AbsoluteFill>
      ) : null}

      {/* ---------------- 11 door insert ---------------- */}
      {range(1065, 1125) ? (
        <AbsoluteFill style={{background: '#04060A'}}>
          <Cam z={2.1 + p(1065, 1125) * 0.06} ox="84%" oy="38%">
            <Room f={f} phoneOn={0} doorVibe={Math.sin(f / 2.6) * 0.8} />
          </Cam>
          <AbsoluteFill style={{background: 'radial-gradient(700px 800px at 80% 40%, transparent 40%, rgba(0,0,0,0.55) 100%)'}} />
        </AbsoluteFill>
      ) : null}

      {/* ---------------- 12 phone buzz on desk, Noah glances ---------------- */}
      {range(1125, 1191) ? (
        <AbsoluteFill style={{background: '#05070A'}}>
          <Cam z={1.55 + p(1125, 1191) * 0.05} ox="56%" oy="46%">
            <Room f={f} phoneOn={f < 1155 ? 0.2 : 1} />
            <div
              style={{
                position: 'absolute',
                left: 470,
                bottom: 1920 - FLOOR,
                width: NOAH_W,
                height: NOAH_H,
                filter: 'drop-shadow(0 24px 50px rgba(0,0,0,0.85))',
              }}
            >
              <Noah expression="fear" look={f < 1155 ? 'door' : 'down'} rim={1} viewBox="0 0 600 1080" />
            </div>
          </Cam>
          <AbsoluteFill style={{background: 'radial-gradient(400px 340px at 42% 42%, rgba(120,180,230,0.14), transparent 70%)'}} />
          <Vignette strength={0.9} />
        </AbsoluteFill>
      ) : null}

      {/* ---------------- 13 phone insert - message 2 ---------------- */}
      {range(1191, 1338) ? (
        <AbsoluteFill>
          <PhoneInsert f={f} message="UNKNOWN NUMBER" lines={["THAT'S ME", 'OUTSIDE.']} push={p(1191, 1338)} />
          <Grain f={f} opacity={0.1} />
        </AbsoluteFill>
      ) : null}

      {/* ---------------- 14 face terror ---------------- */}
      {range(1338, 1428) ? (
        <AbsoluteFill style={{background: '#04060A'}}>
          <Cam z={1.06 + p(1338, 1428) * 0.06} ox="52%" oy="44%">
            <Room f={f} phoneOn={0.35} />
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: 1080,
                height: 1920,
                filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.9))',
              }}
            >
              <Noah expression="fear" look="down" mouth={0.12} lidOverride={Math.max(blinkAt(f, 1374), blinkAt(f, 1416) * 0.7)} rim={1.1} viewBox="196 24 208 370" preserve="xMidYMid slice" />
            </div>
          </Cam>
          <AbsoluteFill style={{background: 'radial-gradient(520px 600px at 48% 40%, rgba(110,170,220,0.10), transparent 70%)'}} />
          <Vignette strength={0.92} />
        </AbsoluteFill>
      ) : null}

      {/* ---------------- 15 over the shoulder to the door ---------------- */}
      {range(1428, 1542) ? (
        <AbsoluteFill style={{background: '#04060A'}}>
          <Cam z={1.2 + p(1428, 1542) * 0.04} ox="74%" oy="44%">
            <Room f={f} phoneOn={0.1} />
            <Shoulder blur={8} />
            <div
              style={{
                position: 'absolute',
                left: 150,
                bottom: 1920 - FLOOR,
                width: 700,
                height: 860,
                filter: 'blur(6px) brightness(0.55)',
              }}
            >
              <Noah expression="fear" look="door" turn={0.7} rim={0.5} viewBox="160 80 300 500" preserve="xMidYMid slice" />
            </div>
          </Cam>
          <AbsoluteFill style={{background: 'radial-gradient(560px 640px at 74% 42%, transparent 36%, rgba(0,0,0,0.72) 100%)'}} />
        </AbsoluteFill>
      ) : null}

      {/* ---------------- 16 final look + cut to black ---------------- */}
      {range(1542, 1662) ? (
        <AbsoluteFill style={{background: '#04060A'}}>
          <Cam z={1.02 + p(1542, 1662) * 0.07} ox="52%" oy="44%">
            <Room f={f} phoneOn={0.3} />
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: 1080,
                height: 1920,
                filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.9))',
              }}
            >
              <Noah
                expression={f < 1600 ? 'sad' : 'fear'}
                look={f < 1600 ? 'down' : 'door'}
                lidOverride={f < 1590 ? 0.35 : 0}
                rim={1.05}
                viewBox="196 24 208 370"
                preserve="xMidYMid slice"
              />
            </div>
          </Cam>
          <Vignette strength={0.94} />
        </AbsoluteFill>
      ) : null}

      {range(1662, 1755) ? (
        <AbsoluteFill style={{background: '#04060A'}}>
          <Cam z={1.16 + p(1662, 1755) * 0.05} ox="76%" oy="44%">
            <Room f={f} phoneOn={0} />
            <Shoulder blur={9} />
            <div style={{position: 'absolute', left: 120, bottom: 1920 - FLOOR, width: 720, height: 880, filter: 'blur(7px) brightness(0.5)'}}>
              <Noah expression="fear" look="door" turn={0.8} rim={0.4} viewBox="160 80 300 500" preserve="xMidYMid slice" />
            </div>
          </Cam>
          <AbsoluteFill style={{background: 'radial-gradient(520px 620px at 76% 44%, transparent 32%, rgba(0,0,0,0.8) 100%)'}} />
        </AbsoluteFill>
      ) : null}

      {/* global grade + grain, never over pure black tail */}
      {f < 1755 ? (
        <>
          <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(10,24,38,0.10), transparent 30%, transparent 70%, rgba(4,10,16,0.22))', mixBlendMode: 'screen', pointerEvents: 'none'}} />
          <Grain f={f} opacity={0.15} />
        </>
      ) : null}
    </AbsoluteFill>
  );
};
