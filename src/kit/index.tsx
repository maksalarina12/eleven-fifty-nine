import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Noah} from '../character/Noah';
import {DrElias} from '../character/DrElias';
import {Grain, Vignette} from '../Episode';

/* Shared production kit: helpers, chrome, monitor feeds, the surveillance
   control room, the phone. Imported by Part7..Part10 so every episode keeps
   the same room, the same screen grade and the same watermark.            */

export const FPS = 30;
export const T = (s: number) => Math.round(s * FPS);
export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
export const smooth = (v: number) => {
  const t = clamp01(v);
  return t * t * (3 - 2 * t);
};
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const rnd = (i: number) => {
  const x = Math.sin(i * 127.1 + 3.7) * 43758.5453;
  return x - Math.floor(x);
};
export const blinkLid = (f: number, at: number, len = 8) => {
  const d = f - at;
  if (d < 0 || d > len) return 0;
  return Math.sin((d / len) * Math.PI) * 0.94;
};
export const talk = (f: number, a: number, b: number, amp = 0.26, speed = 3.4) => {
  if (f < a || f > b) return 0;
  const env = Math.min(1, (f - a) / 2.4, (b - f) / 2.4);
  if (env <= 0) return 0;
  return env * amp * (0.4 + 0.6 * Math.abs(Math.sin((f - a) / speed)));
};
export const flick = (f: number, seed = 0) =>
  0.93 + Math.sin(f / 7 + seed) * 0.04 + Math.sin(f / 23 + seed * 2) * 0.03;

export const SANS = '"Helvetica Neue", Helvetica, Arial, sans-serif';
export const MONO = 'ui-monospace, SFMono-Regular, Menlo, monospace';

export {NoahBack} from './NoahBack';

/* ------------------------------------------------------------------ */
export const Watermark: React.FC = () => (
  <div
    style={{
      position: 'absolute',
      right: 32,
      top: 44,
      fontFamily: SANS,
      fontSize: 16,
      letterSpacing: '0.34em',
      color: 'rgba(210,226,238,0.32)',
      textShadow: '0 1px 8px rgba(0,0,0,0.8)',
      zIndex: 60,
    }}
  >
    EldraMyth
  </div>
);

export const Scanlines: React.FC<{opacity?: number}> = ({opacity = 0.3}) => (
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

export const ScreenGlass: React.FC<{strength?: number}> = ({strength = 1}) => (
  <>
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background:
          'linear-gradient(114deg, rgba(206,232,246,0.10) 0%, rgba(206,232,246,0.03) 16%, transparent 34%, transparent 74%, rgba(170,204,226,0.06) 100%)',
        opacity: strength,
        pointerEvents: 'none',
      }}
    />
    <div
      style={{
        position: 'absolute',
        inset: 0,
        boxShadow: 'inset 0 0 80px rgba(0,0,0,0.72)',
        pointerEvents: 'none',
      }}
    />
  </>
);

export const Monitor: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
  inset?: number;
  bezel?: string;
  radius?: number;
  glow?: string;
}> = ({children, style, inset = 10, bezel = '#080C11', radius = 6, glow}) => (
  <div
    style={{
      background: bezel,
      borderRadius: radius,
      boxShadow:
        glow ??
        '0 0 0 1px rgba(126,166,196,0.14), 0 18px 46px rgba(0,0,0,0.72)',
      overflow: 'hidden',
      ...style,
    }}
  >
    <div
      style={{
        position: 'absolute',
        left: inset,
        top: inset,
        right: inset,
        bottom: inset,
        overflow: 'hidden',
        borderRadius: Math.max(0, radius - 3),
      }}
    >
      {children}
      <ScreenGlass strength={0.7} />
      <Scanlines opacity={0.22} />
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/* monitor feeds                                                       */
/* ------------------------------------------------------------------ */

export const NoahFeed: React.FC<{
  f: number;
  time?: boolean;
  bright?: number;
  mode?: 'stand' | 'close' | 'medium';
  active?: number;
  numeral?: string;
}> = ({f, time, bright = 1, mode = 'close', active = 1, numeral}) => {
  const fl = 0.94 + Math.sin(f / 8) * 0.02 + Math.sin(f / 29) * 0.02;
  return (
    <div style={{position: 'absolute', inset: 0, background: '#04080C'}}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(70% 62% at 50% 36%, rgba(70,128,162,0.36), rgba(6,12,18,0.9) 74%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          filter: `grayscale(0.52) contrast(1.12) brightness(${0.68 * bright * fl}) saturate(0.82)`,
        }}
      >
        {mode === 'close' ? (
          <Noah
            expression="neutral"
            look="camera"
            rim={0.9}
            viewBox="188 66 238 356"
            preserve="xMidYMid slice"
          />
        ) : mode === 'medium' ? (
          <Noah
            expression="tired"
            look="camera"
            rim={1.0}
            viewBox="150 24 300 480"
            preserve="xMidYMax slice"
          />
        ) : (
          <Noah
            expression="tired"
            look="camera"
            rim={0.8}
            viewBox="0 0 600 1200"
            preserve="xMidYMax slice"
          />
        )}
      </div>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(24,58,82,0.20), transparent 44%, rgba(3,7,10,0.42))',
        }}
      />
      {/* the feed's horizon line and camera framing marks */}
      <div style={{position: 'absolute', left: 0, right: 0, top: '64%', height: 1, background: 'rgba(152,196,222,0.12)'}} />
      <div style={{position: 'absolute', left: '6%', top: '6%', width: 16, height: 16, borderLeft: '1px solid rgba(186,220,240,0.22)', borderTop: '1px solid rgba(186,220,240,0.22)'}} />
      <div style={{position: 'absolute', right: '6%', bottom: '8%', width: 16, height: 16, borderRight: '1px solid rgba(186,220,240,0.18)', borderBottom: '1px solid rgba(186,220,240,0.18)'}} />
      {time ? (
        <div
          style={{
            position: 'absolute',
            right: '6%',
            bottom: '5%',
            fontFamily: MONO,
            fontSize: 26,
            letterSpacing: '0.06em',
            color: `rgba(232,244,250,${0.82 * active})`,
            textShadow: '0 0 18px rgba(120,190,225,0.42)',
          }}
        >
          {numeral ?? '11:59'}
        </div>
      ) : null}
      <ScreenGlass strength={0.5} />
    </div>
  );
};

export const BodyFeed: React.FC<{f: number; bright?: number}> = ({f, bright = 1}) => (
  <div style={{position: 'absolute', inset: 0, background: '#04080C', overflow: 'hidden'}}>
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background:
          'radial-gradient(66% 48% at 52% 58%, rgba(84,140,170,0.34), rgba(4,9,13,0.96) 78%)',
      }}
    />
    <svg
      viewBox="0 0 700 1060"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
      style={{filter: `brightness(${bright}) contrast(1.08) saturate(0.8)`}}
    >
      <defs>
        <linearGradient id="kbfWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#16242E" />
          <stop offset="100%" stopColor="#0A131A" />
        </linearGradient>
        <linearGradient id="kbfFloor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2B3B48" />
          <stop offset="52%" stopColor="#17252F" />
          <stop offset="100%" stopColor="#070D12" />
        </linearGradient>
        <linearGradient id="kbfCoat" x1="0.1" y1="0" x2="0.7" y2="1">
          <stop offset="0%" stopColor="#5D6B79" />
          <stop offset="46%" stopColor="#2C3743" />
          <stop offset="100%" stopColor="#0E151C" />
        </linearGradient>
        <linearGradient id="kbfTrouser" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#3B4854" />
          <stop offset="52%" stopColor="#212C36" />
          <stop offset="100%" stopColor="#0B1218" />
        </linearGradient>
        <radialGradient id="kbfLight" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(190,228,244,0.5)" />
          <stop offset="100%" stopColor="rgba(60,110,144,0)" />
        </radialGradient>
      </defs>

      {/* room */}
      <rect x="0" y="0" width="700" height="1060" fill="#0A1218" />
      <rect x="0" y="0" width="700" height="700" fill="url(#kbfWall)" />
      <ellipse cx="360" cy="830" rx="420" ry="260" fill="rgba(150,196,224,0.1)" />
      <polygon points="0,700 700,700 700,1060 0,1060" fill="url(#kbfFloor)" />
      <line x1="0" y1="700" x2="700" y2="700" stroke="rgba(150,194,220,0.16)" strokeWidth="2" />
      {/* ceiling tube */}
      <rect x="150" y="52" width="400" height="9" rx="4" fill="rgba(212,238,248,0.62)" style={{filter: `brightness(${bright})`}} />
      <rect x="130" y="40" width="440" height="70" fill="url(#kbfLight)" opacity="0.5" />
      {/* wall seams */}
      <line x1="230" y1="140" x2="230" y2="700" stroke="rgba(140,184,212,0.1)" strokeWidth="2" />
      <line x1="474" y1="140" x2="474" y2="700" stroke="rgba(140,184,212,0.08)" strokeWidth="2" />
      {/* floor perspective */}
      <polygon points="0,700 700,700 700,760 0,760" fill="rgba(120,170,200,0.05)" />
      <line x1="0" y1="820" x2="700" y2="820" stroke="rgba(140,186,214,0.05)" strokeWidth="2" />
      <line x1="0" y1="930" x2="700" y2="930" stroke="rgba(140,186,214,0.04)" strokeWidth="2" />
      {/* contact shadow */}
      <ellipse cx="380" cy="900" rx="290" ry="96" fill="rgba(0,0,0,0.66)" />
      {/* the body, face down, head to the left */}
      <g transform={`rotate(-6 360 860) translate(0 ${Math.sin(f / 30) * 1.4})`}>
        {/* legs, one bent */}
        <path d="M 408 862 C 470 872 528 900 566 938 L 626 1002 C 618 1020 596 1024 580 1010 C 536 968 486 942 430 928 Z" fill="url(#kbfTrouser)" />
        <path d="M 414 900 C 468 916 516 946 550 980 L 526 1006 C 492 972 448 946 402 930 Z" fill="#101820" />
        <path d="M 610 972 C 630 986 644 1000 646 1014 C 640 1024 624 1026 612 1018 C 600 1010 596 994 598 982 Z" fill="#222C36" />
        <path d="M 430 928 C 484 940 530 964 566 996" stroke="rgba(168,206,232,0.16)" strokeWidth="2.6" fill="none" />
        {/* hips and torso */}
        <path d="M 272 786 C 328 774 386 792 424 826 C 452 852 462 884 442 900 C 410 924 344 918 302 892 C 264 868 244 812 272 786 Z" fill="url(#kbfCoat)" />
        {/* coat back seam and shoulder blades */}
        <path d="M 320 800 C 344 816 360 838 370 864" stroke="rgba(0,0,0,0.5)" strokeWidth="3" fill="none" />
        <path d="M 276 812 C 300 804 326 806 348 814" stroke="rgba(198,230,246,0.22)" strokeWidth="2.4" fill="none" />
        {/* far arm tucked under the chest */}
        <path d="M 300 880 C 330 900 362 910 396 912 L 392 936 C 352 934 314 920 288 898 Z" fill="#18212A" />
        {/* near arm, splayed out with the hand open */}
        <path d="M 288 800 C 258 782 232 754 220 726 C 214 712 220 700 232 700 C 248 702 258 720 266 742 C 276 766 292 784 308 794 Z" fill="url(#kbfCoat)" />
        <path d="M 224 704 C 214 696 206 686 204 678 C 202 670 208 664 216 666 C 226 670 232 680 236 690 C 240 700 236 708 228 710 Z" fill="#3A2B20" />
        <path d="M 212 692 C 204 684 198 674 198 666 C 198 658 204 654 211 657 C 219 661 224 671 227 680" fill="none" stroke="rgba(0,0,0,0.5)" strokeWidth="6" />
        {/* neck and head, face turned away */}
        <path d="M 258 796 C 246 784 236 772 232 760 L 268 754 C 274 768 282 780 292 790 Z" fill="#2E2018" />
        <ellipse cx="196" cy="754" rx="62" ry="52" fill="#2E2019" />
        <path d="M 236 730 C 252 742 260 760 258 778 C 246 768 232 760 218 756 Z" fill="#1A222B" />
        {/* hair mass over the skull */}
        <path d="M 140 756 C 134 720 156 696 192 696 C 224 696 244 716 246 744 C 248 770 238 792 216 802 C 196 810 164 806 150 792 C 142 782 138 770 140 756 Z" fill="#131A21" />
        <path d="M 150 748 C 146 720 164 702 192 702 C 214 702 230 716 234 736 C 216 722 194 716 174 720 C 160 724 152 734 150 748 Z" fill="#1F2830" />
        <path d="M 160 700 C 176 692 200 692 216 700" stroke="rgba(188,222,240,0.28)" strokeWidth="2.6" fill="none" />
        {/* rim light along the top of the body */}
        <path d="M 276 790 C 330 778 386 796 422 828" stroke="rgba(198,232,248,0.54)" strokeWidth="3.4" fill="none" />
        <path d="M 290 800 C 262 782 236 756 224 730" stroke="rgba(198,232,248,0.36)" strokeWidth="2.6" fill="none" />
        <path d="M 430 852 C 458 876 462 890 444 902" stroke="rgba(176,214,236,0.24)" strokeWidth="2.4" fill="none" />
        <path d="M 414 872 C 470 882 526 906 566 944" stroke="rgba(168,206,232,0.2)" strokeWidth="2.4" fill="none" />
      </g>
      {/* a scatter of small debris on the floor */}
      <circle cx="120" cy="944" r="3" fill="rgba(150,190,214,0.16)" />
      <circle cx="612" cy="820" r="2.4" fill="rgba(150,190,214,0.14)" />
      <rect x="66" y="1016" width="42" height="3" rx="1.5" fill="rgba(150,190,214,0.1)" transform="rotate(-12 66 1016)" />
    </svg>
    <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(30,64,88,0.2), transparent 42%, rgba(2,6,9,0.5))'}} />
    <div style={{position: 'absolute', inset: 0, background: 'rgba(8,18,26,0.06)'}} />
    <ScreenGlass strength={0.4} />
    <Scanlines opacity={0.24} />
  </div>
);

export const ELIAS_CROPS = [
  '196 74 208 318',
  '208 98 194 296',
  '180 64 228 348',
  '202 110 200 280',
];
export const ELIAS_TURNS = [0, -0.18, 0.15, -0.09];
export const ELIAS_LOOKS = ['camera', 'left', 'right', 'camera'] as const;
export const ELIAS_EXPR = ['cold', 'stare', 'cold', 'stare'] as const;

export const EliasFeed: React.FC<{f: number; mouth?: number; bright?: number; variant?: number}> = ({
  f,
  mouth = 0,
  bright = 1,
  variant = 0,
}) => {
  const v = ((variant % 4) + 4) % 4;
  const roll = ((f * (1.3 + v * 0.4) + v * 260) % 620) - 60;
  return (
    <div style={{position: 'absolute', inset: 0, background: '#04080C', overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(72% 64% at 50% 34%, rgba(66,124,158,0.36), rgba(4,9,13,0.96) 76%)'}} />
      <div style={{position: 'absolute', inset: 0, filter: `brightness(${0.74 * bright}) contrast(1.12) saturate(0.84)`}}>
        <DrElias
          expression={ELIAS_EXPR[v]}
          look={ELIAS_LOOKS[v]}
          mouth={mouth * (v === 1 ? 0.6 : 1)}
          turn={ELIAS_TURNS[v]}
          rim={1.05}
          screen={0.42}
          viewBox={ELIAS_CROPS[v]}
          preserve="xMidYMid slice"
        />
      </div>
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(20,50,70,0.2), transparent 38%, rgba(2,6,9,0.58))'}} />
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(88% 74% at 50% 44%, transparent 44%, rgba(1,4,7,0.62) 100%)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: roll, height: 58, background: 'linear-gradient(180deg,transparent,rgba(176,220,242,0.06),transparent)'}} />
      <ScreenGlass strength={0.45} />
      <Scanlines opacity={0.28} />
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* phone                                                               */
/* ------------------------------------------------------------------ */

export const PhoneSlab: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
  rotate?: number;
  glow?: number;
  body?: string;
}> = ({children, style, rotate = 0, glow = 1, body = 'linear-gradient(160deg,#1B2129,#070A0E 48%,#04060A)'}) => (
  <div
    style={{
      position: 'absolute',
      borderRadius: 64,
      background: body,
      boxShadow: `0 40px 110px rgba(0,0,0,0.88), 0 0 ${70 * glow}px rgba(92,158,202,${0.3 * glow}), inset 0 0 0 1px rgba(162,198,222,0.16)`,
      transform: `rotate(${rotate}deg)`,
      ...style,
    }}
  >
    <div
      style={{
        position: 'absolute',
        inset: 9,
        borderRadius: 56,
        background: '#04060A',
        overflow: 'hidden',
      }}
    >
      <div style={{position: 'absolute', inset: 5, borderRadius: 50, background: 'linear-gradient(178deg,#0D1722 0%,#070D14 46%,#04070B 100%)', overflow: 'hidden'}}>
        {children}
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(118deg, rgba(255,255,255,0.09) 0%, transparent 32%, transparent 70%, rgba(160,200,230,0.05) 100%)'}} />
      </div>
    </div>
    <div style={{position: 'absolute', left: '50%', top: 18, width: 118, height: 20, marginLeft: -59, borderRadius: 12, background: '#04060A'}} />
  </div>
);

export const ChatMessage: React.FC<{
  text: string;
  show: number;
  size?: number;
  left?: number;
  right?: number;
  top?: number;
}> = ({text, show, size = 44, left = 34, right = 42, top = 46}) => (
  <div
    style={{
      position: 'absolute',
      left,
      right,
      top: top + (1 - show) * 22,
      opacity: show,
      transform: `translateY(${(1 - show) * 10}px)`,
    }}
  >
    <div
      style={{
        padding: '34px 30px',
        borderRadius: '8px 30px 30px 30px',
        background: 'linear-gradient(160deg, rgba(38,54,70,0.98), rgba(15,23,31,0.99))',
        border: '1px solid rgba(158,198,224,0.2)',
        boxShadow: '0 18px 50px rgba(0,0,0,0.6)',
      }}
    >
      <div
        style={{
          fontFamily: SANS,
          fontWeight: 400,
          fontSize: size,
          lineHeight: 1.28,
          letterSpacing: '0.005em',
          color: '#F5F2EC',
        }}
      >
        {text}
      </div>
    </div>
  </div>
);

export const PhoneStatus: React.FC<{dim?: number}> = ({dim = 0.4}) => (
  <div
    style={{
      position: 'absolute',
      left: 42,
      right: 46,
      top: 46,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      opacity: dim,
    }}
  >
    <div style={{display: 'flex', gap: 5, alignItems: 'flex-end'}}>
      {[8, 12, 16, 20].map((h, i) => (
        <div key={i} style={{width: 4, height: h, background: '#E4EFF6'}} />
      ))}
    </div>
    <div style={{fontFamily: SANS, fontSize: 15, letterSpacing: '0.12em', color: '#E4EFF6'}}>▮▮▮</div>
  </div>
);

/* ------------------------------------------------------------------ */
/* control room                                                        */
/* ------------------------------------------------------------------ */

export const ControlWall: React.FC<{f: number; on?: number; boot?: number}> = ({f, on = 1, boot = 1}) => {
  const fl = flick(f, 2.1);
  return (
    <>
      <div style={{position: 'absolute', left: 34, top: 198, width: 1012, height: 772, background: `radial-gradient(closest-side, rgba(88,152,196,${0.28 * on}), transparent 78%)`, filter: 'blur(34px)'}} />
      <div
        style={{
          position: 'absolute',
          left: 58,
          top: 186,
          width: 964,
          height: 744,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gridTemplateRows: '1fr 1fr',
          gap: 14,
          filter: `brightness(${0.5 + 0.8 * on * fl}) saturate(0.96)`,
        }}
      >
        {Array.from({length: 6}).map((_, i) => {
          const k = (i * 3 + 1) % 6;
          const b = clamp01(boot * 1.35 - (i % 3) * 0.07 - Math.floor(i / 3) * 0.04);
          return (
            <Monitor key={i} inset={7} radius={5} style={{position: 'relative'}}>
              {b < 0.5 ? (
                <div style={{position: 'absolute', inset: 0, background: '#04080C'}}>
                  <div style={{position: 'absolute', left: '50%', top: '46%', width: 2, height: 2, marginLeft: -1, background: 'rgba(170,220,244,0.8)', boxShadow: '0 0 22px 8px rgba(120,190,225,0.3)', opacity: b * 2}} />
                </div>
              ) : (
                <ControlFeed f={f} kind={k} on={on * clamp01((b - 0.5) * 2)} />
              )}
            </Monitor>
          );
        })}
      </div>
    </>
  );
};

export const ControlFeed: React.FC<{f: number; kind: number; on?: number}> = ({f, kind, on = 1}) => {
  const wave = (n: number) => Array.from({length: n}).map((_, i) => 0.2 + 0.8 * Math.abs(Math.sin(f / 6 + i * 0.7 + kind)));
  return (
    <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg,#061019,#03070B)', opacity: on}}>
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(70% 60% at 46% 40%, rgba(56,112,150,0.36), transparent 76%)'}} />
      {kind % 3 === 0 ? (
        <>
          <div style={{position: 'absolute', left: '8%', right: '8%', bottom: '26%', height: '22%', display: 'flex', alignItems: 'center', gap: 2}}>
            {wave(42).map((h, i) => (
              <div key={i} style={{flex: 1, height: `${18 + h * 72}%`, background: `rgba(128,190,224,${0.2 + h * 0.38})`, borderRadius: 1}} />
            ))}
          </div>
          <div style={{position: 'absolute', left: '8%', top: '20%', width: '44%', height: 1, background: 'rgba(146,192,220,0.18)'}} />
          <div style={{position: 'absolute', left: '8%', top: '27%', width: '28%', height: 1, background: 'rgba(146,192,220,0.12)'}} />
        </>
      ) : kind % 3 === 1 ? (
        <>
          <div style={{position: 'absolute', left: '50%', top: '50%', width: '62%', height: '62%', marginLeft: '-31%', marginTop: '-31%', borderRadius: '50%', border: '1px solid rgba(150,200,228,0.22)'}} />
          <div style={{position: 'absolute', left: '50%', top: '50%', width: '34%', height: '34%', marginLeft: '-17%', marginTop: '-17%', borderRadius: '50%', border: '1px solid rgba(150,200,228,0.16)'}} />
          <div style={{position: 'absolute', left: '50%', top: '50%', width: '8%', height: '8%', marginLeft: '-4%', marginTop: '-4%', borderRadius: '50%', background: 'rgba(180,224,244,0.34)', filter: 'blur(2px)'}} />
          {[0, 1, 2, 3].map((i) => (
            <div key={i} style={{position: 'absolute', left: '10%', top: `${26 + i * 15}%`, width: `${18 + i * 6}%`, height: 1, background: 'rgba(146,192,220,0.14)'}} />
          ))}
        </>
      ) : (
        <>
          <div style={{position: 'absolute', left: '12%', top: '18%', width: '76%', height: '64%', border: '1px solid rgba(150,200,228,0.14)'}} />
          {Array.from({length: 9}).map((_, i) => (
            <div key={i} style={{position: 'absolute', left: '16%', top: `${24 + i * 6.4}%`, width: `${20 + ((i * 37) % 54)}%`, height: 2, background: `rgba(132,186,216,${0.08 + (i % 3) * 0.05})`}} />
          ))}
          <div style={{position: 'absolute', left: '12%', bottom: '18%', width: 8, height: 8, borderRadius: '50%', background: 'rgba(220,150,110,0.5)', boxShadow: '0 0 18px rgba(220,150,110,0.4)'}} />
        </>
      )}
    </div>
  );
};

export const ControlDesk: React.FC<{f: number; glow?: number; phone?: number}> = ({f, glow = 1, phone = 0}) => (
  <>
    <div style={{position: 'absolute', left: 0, top: 1200, width: 1080, height: 720, background: 'linear-gradient(180deg,#0B1219 0%,#070C12 34%,#030507 100%)'}} />
    <div style={{position: 'absolute', left: 0, top: 1188, width: 1080, height: 16, background: 'linear-gradient(180deg,#16202A,#080D13)'}} />
    <div style={{position: 'absolute', left: 0, top: 1187, width: 1080, height: 3, background: 'rgba(160,205,235,0.3)'}} />
    <div style={{position: 'absolute', left: 86, top: 1210, width: 908, height: 210, background: `linear-gradient(180deg, rgba(110,175,215,${0.13 * glow}), transparent 82%)`, filter: 'blur(18px)'}} />
    <div style={{position: 'absolute', left: 70, top: 910, width: 940, height: 320, background: `radial-gradient(ellipse at 50% 0%, rgba(90,150,190,${0.18 * glow}), transparent 70%)`, filter: 'blur(26px)'}} />
    {/* keyboard */}
    <div style={{position: 'absolute', left: 126, top: 1264, width: 372, height: 72, borderRadius: 5, background: 'linear-gradient(180deg,rgba(17,23,30,0.95),rgba(7,10,14,0.98))', border: '1px solid rgba(120,165,195,0.08)'}}>
      <div style={{position: 'absolute', left: 12, right: 12, top: 12, height: 42, background: 'repeating-linear-gradient(90deg, rgba(150,190,215,0.06) 0 24px, transparent 24px 30px), repeating-linear-gradient(0deg, rgba(150,190,215,0.05) 0 11px, transparent 11px 19px)', borderRadius: 3}} />
    </div>
    {/* mouse */}
    <div style={{position: 'absolute', left: 564, top: 1256, width: 44, height: 62, borderRadius: '20px 20px 14px 14px', background: 'linear-gradient(180deg,#111821,#080C11)', border: '1px solid rgba(120,165,195,0.1)', transform: 'rotate(-5deg)'}} />
    {/* lamp */}
    <div style={{position: 'absolute', left: 834, top: 1006, width: 6, height: 204, background: '#0B0F14'}} />
    <div style={{position: 'absolute', left: 800, top: 982, width: 74, height: 30, borderRadius: '50% 50% 20% 20%', background: 'linear-gradient(180deg,#1A1712,#0A0907)'}} />
    <div style={{position: 'absolute', left: 802, top: 1008, width: 70, height: 26, borderRadius: '50%', background: 'rgba(240,178,116,0.56)', filter: 'blur(3px)'}} />
    <div style={{position: 'absolute', left: 716, top: 1026, width: 240, height: 300, background: 'radial-gradient(closest-side, rgba(238,176,116,0.13), transparent 72%)', filter: 'blur(16px)'}} />
    {/* her phone, face down on the desk until it wakes */}
    <div style={{position: 'absolute', left: 652, top: 1216, width: 92, height: 168, borderRadius: 14, background: 'linear-gradient(160deg,#12171D,#05070A)', border: '1px solid rgba(130,170,196,0.12)', transform: 'rotate(7deg)', boxShadow: `0 12px 30px rgba(0,0,0,0.7), 0 0 ${26 + phone * 40}px rgba(100,164,204,${0.1 + phone * 0.3})`}} />
  </>
);

/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* the wall behind the desk, and the archive grade                      */

/* ------------------------------------------------------------------ */
/* the wall behind the desk, and the archive grade                      */
/* ------------------------------------------------------------------ */

/* the wall behind the desk: door on the right, corridor beyond */
export const BackWall: React.FC<{f: number; open?: number; light?: number}> = ({
  f,
  open = 0,
  light = 1,
}) => (
  <>
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background:
          'linear-gradient(180deg,#050B11 0%,#0A1620 38%,#081018 68%,#03060A 100%)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        left: -60,
        right: -60,
        top: 240,
        height: 900,
        background:
          'repeating-linear-gradient(90deg, rgba(120,170,200,0.045) 0 2px, transparent 2px 210px)',
        opacity: 0.7,
      }}
    />
    {/* door casing */}
    <div
      style={{
        position: 'absolute',
        left: 622,
        top: 392,
        width: 306,
        height: 806,
        background: 'linear-gradient(180deg,#22384A,#132430 58%,#0A141C)',
        boxShadow: 'inset 0 0 40px rgba(0,0,0,0.7), 0 0 40px rgba(96,150,186,0.16)',
      }}
    />
    {/* corridor beyond, revealed as the leaf swings */}
    <div style={{position: 'absolute', left: 640, top: 408, width: 270, height: 774, overflow: 'hidden'}}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(180deg, rgba(24,44,58,${0.5 + 0.5 * light}) 0%, #060C12 62%, #02050A 100%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 96,
          top: 120,
          width: 92,
          height: 320,
          background: `linear-gradient(180deg, rgba(150,190,214,${0.1 * light}), transparent 88%)`,
          filter: 'blur(16px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 700,
          height: 120,
          background: `linear-gradient(180deg, transparent, rgba(0,0,0,${0.7 * (1 - open)}))`,
        }}
      />
    </div>
    {/* leaf */}
    <div
      style={{
        position: 'absolute',
        left: 640,
        top: 408,
        width: 270,
        height: 774,
        transformOrigin: '0% 50%',
        transform: `perspective(1400px) rotateY(${-open * 74}deg)`,
        background: 'linear-gradient(100deg,#1E2F3C 0%,#15242F 44%,#0B141C 100%)',
        boxShadow: 'inset 0 0 60px rgba(0,0,0,0.7), 8px 0 30px rgba(0,0,0,0.6)',
        borderRight: '1px solid rgba(160,204,232,0.14)',
      }}
    >
      <div style={{position: 'absolute', inset: 34, border: '1px solid rgba(146,192,220,0.1)'}} />
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 10,
          background: 'linear-gradient(90deg, rgba(150,200,230,0.16), transparent)',
        }}
      />
      <div style={{position: 'absolute', right: 26, top: 396, width: 12, height: 40, borderRadius: 6, background: 'linear-gradient(180deg,#57646E,#222B33)'}} />
    </div>
    <div
      style={{
        position: 'absolute',
        left: 570,
        top: 376,
        width: 410,
        height: 20,
        background: 'linear-gradient(180deg,#2A3E4E,#0A121A)',
        boxShadow: '0 6px 18px rgba(0,0,0,0.6)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        left: 60,
        top: 300,
        width: 960,
        height: 30,
        background: 'linear-gradient(90deg, transparent, rgba(150,196,224,0.14) 40%, rgba(150,196,224,0.14) 62%, transparent)',
        filter: 'blur(6px)',
      }}
    />
    <Vignette strength={0.94} />
    <Grain f={f} opacity={0.07} />
  </>
);

/* archival chrome: the recording is never clean */
export const Archival: React.FC<{children: React.ReactNode; f: number; bright?: number}> = ({
  children,
  f,
  bright = 1,
}) => (
  <div style={{position: 'absolute', inset: 0, background: '#04080C', overflow: 'hidden'}}>
    <div
      style={{
        position: 'absolute',
        inset: 0,
        filter: `grayscale(0.34) contrast(1.1) brightness(${0.82 * bright}) saturate(0.86)`,
      }}
    >
      {children}
    </div>
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background:
          'radial-gradient(70% 60% at 50% 40%, transparent 42%, rgba(2,6,10,0.62) 100%)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: `${(f * 2.4) % 100}%`,
        height: 120,
        background: 'linear-gradient(180deg, transparent, rgba(150,210,240,0.05), transparent)',
      }}
    />
    <Scanlines opacity={0.24} />
    <ScreenGlass strength={0.6} />
  </div>
);

/* ------------------------------------------------------------------ */
