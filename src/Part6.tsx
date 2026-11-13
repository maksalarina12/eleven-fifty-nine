import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {Noah} from './character/Noah';
import {Amara, AmaraBack} from './character/Amara';
import {DrElias} from './character/DrElias';
import type {Expression, Look} from './character/Noah';
import type {AmaraExpression} from './character/Amara';
import {Cam, Grain, Vignette, Room, RainStreaks} from './Episode';

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
const blinkLid = (f: number, at: number, len = 8) => {
  const d = f - at;
  if (d < 0 || d > len) return 0;
  return Math.sin((d / len) * Math.PI) * 0.94;
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

/* ------------------------------------------------------------------ */
/* frame landmarks, cut against the delivered waveform                 */
/* ------------------------------------------------------------------ */

const C = {
  s1: 0,
  s2: 86,
  s3: 274,
  s4: 544,
  s5: 646,
  s6: 857,
  s7: 917,
  s8: 1069,
  s9: 1199,
  s10: 1272,
  s11: 1502,
  s12: 1610,
  s13: 1756,
  s14: 1892,
  s15: 1962,
  s16: 2143,
  s17: 2231,
  s18: 2356,
  s19: 2426,
  s20: 2489,
  total: 2497,
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

const Scanlines: React.FC<{opacity?: number}> = ({opacity = 0.3}) => (
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

const ScreenGlass: React.FC<{strength?: number}> = ({strength = 1}) => (
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

const Monitor: React.FC<{
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

const NoahFeed: React.FC<{
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

const BodyFeed: React.FC<{f: number; bright?: number}> = ({f, bright = 1}) => (
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
        <linearGradient id="p6bfWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#16242E" />
          <stop offset="100%" stopColor="#0A131A" />
        </linearGradient>
        <linearGradient id="p6bfFloor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2B3B48" />
          <stop offset="52%" stopColor="#17252F" />
          <stop offset="100%" stopColor="#070D12" />
        </linearGradient>
        <linearGradient id="p6bfCoat" x1="0.1" y1="0" x2="0.7" y2="1">
          <stop offset="0%" stopColor="#5D6B79" />
          <stop offset="46%" stopColor="#2C3743" />
          <stop offset="100%" stopColor="#0E151C" />
        </linearGradient>
        <linearGradient id="p6bfTrouser" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#3B4854" />
          <stop offset="52%" stopColor="#212C36" />
          <stop offset="100%" stopColor="#0B1218" />
        </linearGradient>
        <radialGradient id="p6bfLight" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(190,228,244,0.5)" />
          <stop offset="100%" stopColor="rgba(60,110,144,0)" />
        </radialGradient>
      </defs>

      {/* room */}
      <rect x="0" y="0" width="700" height="1060" fill="#0A1218" />
      <rect x="0" y="0" width="700" height="700" fill="url(#p6bfWall)" />
      <ellipse cx="360" cy="830" rx="420" ry="260" fill="rgba(150,196,224,0.1)" />
      <polygon points="0,700 700,700 700,1060 0,1060" fill="url(#p6bfFloor)" />
      <line x1="0" y1="700" x2="700" y2="700" stroke="rgba(150,194,220,0.16)" strokeWidth="2" />
      {/* ceiling tube */}
      <rect x="150" y="52" width="400" height="9" rx="4" fill="rgba(212,238,248,0.62)" style={{filter: `brightness(${bright})`}} />
      <rect x="130" y="40" width="440" height="70" fill="url(#p6bfLight)" opacity="0.5" />
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
        <path d="M 408 862 C 470 872 528 900 566 938 L 626 1002 C 618 1020 596 1024 580 1010 C 536 968 486 942 430 928 Z" fill="url(#p6bfTrouser)" />
        <path d="M 414 900 C 468 916 516 946 550 980 L 526 1006 C 492 972 448 946 402 930 Z" fill="#101820" />
        <path d="M 610 972 C 630 986 644 1000 646 1014 C 640 1024 624 1026 612 1018 C 600 1010 596 994 598 982 Z" fill="#222C36" />
        <path d="M 430 928 C 484 940 530 964 566 996" stroke="rgba(168,206,232,0.16)" strokeWidth="2.6" fill="none" />
        {/* hips and torso */}
        <path d="M 272 786 C 328 774 386 792 424 826 C 452 852 462 884 442 900 C 410 924 344 918 302 892 C 264 868 244 812 272 786 Z" fill="url(#p6bfCoat)" />
        {/* coat back seam and shoulder blades */}
        <path d="M 320 800 C 344 816 360 838 370 864" stroke="rgba(0,0,0,0.5)" strokeWidth="3" fill="none" />
        <path d="M 276 812 C 300 804 326 806 348 814" stroke="rgba(198,230,246,0.22)" strokeWidth="2.4" fill="none" />
        {/* far arm tucked under the chest */}
        <path d="M 300 880 C 330 900 362 910 396 912 L 392 936 C 352 934 314 920 288 898 Z" fill="#18212A" />
        {/* near arm, splayed out with the hand open */}
        <path d="M 288 800 C 258 782 232 754 220 726 C 214 712 220 700 232 700 C 248 702 258 720 266 742 C 276 766 292 784 308 794 Z" fill="url(#p6bfCoat)" />
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

const ELIAS_CROPS = [
  '196 74 208 318',
  '208 98 194 296',
  '180 64 228 348',
  '202 110 200 280',
];
const ELIAS_TURNS = [0, -0.18, 0.15, -0.09];
const ELIAS_LOOKS = ['camera', 'left', 'right', 'camera'] as const;
const ELIAS_EXPR = ['cold', 'stare', 'cold', 'stare'] as const;

const EliasFeed: React.FC<{f: number; mouth?: number; bright?: number; variant?: number}> = ({
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

const PhoneSlab: React.FC<{
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

const ChatMessage: React.FC<{
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

const PhoneStatus: React.FC<{dim?: number}> = ({dim = 0.4}) => (
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

const ControlWall: React.FC<{f: number; on?: number; boot?: number}> = ({f, on = 1, boot = 1}) => {
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

const ControlFeed: React.FC<{f: number; kind: number; on?: number}> = ({f, kind, on = 1}) => {
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

const ControlDesk: React.FC<{f: number; glow?: number; phone?: number}> = ({f, glow = 1, phone = 0}) => (
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
/* shot 01 — Elias, "He isn't supposed to remember."                   */
/* ------------------------------------------------------------------ */

const EliasWhisper: React.FC<{f: number}> = ({f}) => {
  const p = smooth(f / C.s2);
  const z = 1.01 + p * 0.07;
  const mouth = talk(f, 4, 76, 0.2, 4.6);
  const lid = Math.max(blinkLid(f, 34), blinkLid(f, 70) * 0.7);
  return (
    <AbsoluteFill style={{background: '#03060A', overflow: 'hidden'}}>
      <AbsoluteFill style={{background: 'radial-gradient(900px 1000px at 68% 34%, rgba(44,98,132,0.32), transparent 72%)'}} />
      {/* control wall, thrown far out of focus behind him */}
      <div style={{position: 'absolute', inset: -80, filter: 'blur(46px) brightness(0.56) saturate(0.9)', transform: 'scale(1.16)'}}>
        <ControlWall f={f} on={0.9} />
      </div>
      <AbsoluteFill style={{background: 'linear-gradient(250deg, rgba(1,3,6,0.96) 0%, rgba(2,5,9,0.7) 34%, transparent 66%)'}} />
      <div style={{position: 'absolute', inset: 0, transform: `scale(${z})`, transformOrigin: '42% 34%'}}>
        <div
          style={{
            position: 'absolute',
            left: 122,
            top: 44,
            width: 872,
            height: 1500,
            filter: 'brightness(0.94) contrast(1.07) saturate(0.9)',
          }}
        >
          <DrElias
            expression={f < 20 ? 'whisper' : 'stare'}
            look="left"
            mouth={mouth}
            turn={0.58}
            rim={1.5}
            screen={0.6}
            lidOverride={lid > 0.3 ? lid : undefined}
            viewBox="176 92 256 500"
            preserve="xMidYMid meet"
          />
        </div>
      </div>
      {/* key light from the monitor bank, camera-left */}
      <div style={{position: 'absolute', left: -220, top: 40, width: 820, height: 1400, background: 'radial-gradient(closest-side at 42% 32%, rgba(104,168,204,0.28), transparent 74%)', mixBlendMode: 'screen'}} />
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 660, background: 'linear-gradient(180deg, rgba(3,6,10,0) 0%, rgba(3,6,10,0.7) 44%, #03060A 86%)'}} />
      {/* a monitor edge in the near foreground */}
      <div style={{position: 'absolute', left: -170, top: 1250, width: 740, height: 760, opacity: 0.42, filter: 'blur(14px)'}}>
        <div style={{position: 'absolute', inset: 0, background: '#05080C', border: '10px solid #070B10', overflow: 'hidden'}}>
          <div style={{position: 'absolute', inset: 0, filter: 'brightness(1.1)'}}>
            <NoahFeed f={f} mode="close" bright={0.9} time />
          </div>
        </div>
      </div>
      <AbsoluteFill style={{background: 'radial-gradient(1000px 1100px at 42% 38%, transparent 36%, rgba(0,0,0,0.76) 100%)'}} />
      <Grain f={f} opacity={0.07} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* shot 02 — the message on Noah's phone                               */
/* ------------------------------------------------------------------ */

const NoahMessage: React.FC<{f: number}> = ({f}) => {
  const z = 1.01 + smooth((f - C.s2) / (C.s3 - C.s2)) * 0.05;
  const msg = smooth((f - (C.s2 + 28)) / 15);
  const lid = blinkLid(f, C.s2 + 34) + blinkLid(f, C.s2 + 84) * 0.7;
  return (
    <AbsoluteFill style={{background: '#04070A', overflow: 'hidden'}}>
      {/* the room, soft and far behind him */}
      <div style={{position: 'absolute', inset: -60, filter: 'blur(34px) brightness(0.6) saturate(0.86)', transform: `scale(${z + 0.12})`}}>
        <Room f={f} phoneOn={1} />
      </div>
      <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(3,6,9,0.68) 0%, rgba(3,6,9,0.18) 34%, transparent 62%)'}} />
      <div style={{position: 'absolute', inset: 0, transform: `scale(${z})`, transformOrigin: '46% 40%'}}>
        <div
          style={{
            position: 'absolute',
            left: -56,
            top: 82,
            width: 800,
            height: 1280,
            filter: 'brightness(1.12) contrast(1.06)',
          }}
        >
          <Noah
            expression={f < C.s2 + 90 ? 'tired' : f < C.s2 + 146 ? 'dread' : 'fear'}
            look="down"
            lidOverride={lid > 0.2 ? lid : undefined}
            rim={1.1}
            turn={0.3}
            viewBox="196 82 214 320"
            preserve="xMidYMid meet"
          />
        </div>
        {/* phone, held low in frame */}
        <div style={{position: 'absolute', right: 20, bottom: 150, width: 444, height: 880, transform: 'rotate(-7deg)'}}>
          <PhoneSlab style={{left: 0, top: 0, width: 444, height: 880}} rotate={0} glow={1.3}>
            <PhoneStatus dim={0.55} />
            <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(closest-side at 50% 46%, rgba(122,196,234,0.26), transparent 76%)'}} />
            <ChatMessage text="Find the room where you were born." show={msg} size={40} left={26} right={30} top={430} />
            <div style={{position: 'absolute', left: 28, top: 118, width: 150, height: 1, background: 'rgba(180,214,236,0.3)'}} />
            <div style={{position: 'absolute', left: 28, top: 140, width: 96, height: 1, background: 'rgba(180,214,236,0.2)'}} />
          </PhoneSlab>
          {/* his fingers on the near edge */}
          <div style={{position: 'absolute', right: -26, bottom: 84, width: 118, height: 360, borderRadius: 54, background: 'linear-gradient(120deg,#0B0F14,#05080C)', transform: 'rotate(4deg)'}} />
          <div style={{position: 'absolute', right: 34, bottom: 62, width: 190, height: 34, borderRadius: 18, background: '#070A0E', transform: 'rotate(-6deg)'}} />
        </div>
      </div>
      {/* phone spill on his jaw and chest */}
      <div style={{position: 'absolute', right: 40, top: 600, width: 780, height: 940, background: 'radial-gradient(closest-side at 58% 68%, rgba(126,196,230,0.3), transparent 72%)', mixBlendMode: 'screen'}} />
      <AbsoluteFill style={{background: 'radial-gradient(1000px 1100px at 52% 44%, transparent 40%, rgba(0,0,0,0.6) 100%)'}} />
      <Grain f={f} opacity={0.07} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* shot 03 — the door opens onto the laboratory                        */
/* ------------------------------------------------------------------ */

const LabDoorway: React.FC<{f: number; light: number}> = ({f, light}) => {
  const fl = 0.9 + Math.sin(f / 13) * 0.04 + Math.sin(f / 37) * 0.03;
  const scan = (f * 3.4) % 132;
  return (
    <div style={{position: 'absolute', inset: 0, background: '#02050A', overflow: 'hidden'}}>
      <svg viewBox="0 0 254 1012" width="100%" height="100%" preserveAspectRatio="none" style={{position: 'absolute', inset: 0}}>
        <defs>
          <linearGradient id="p6dwBack" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#12242F" />
            <stop offset="56%" stopColor="#0B1A24" />
            <stop offset="100%" stopColor="#061019" />
          </linearGradient>
          <linearGradient id="p6dwWallL" x1="1" y1="0" x2="0" y2="0.4">
            <stop offset="0%" stopColor="#13262F" />
            <stop offset="100%" stopColor="#050B10" />
          </linearGradient>
          <linearGradient id="p6dwWallR" x1="0" y1="0" x2="1" y2="0.4">
            <stop offset="0%" stopColor="#13262F" />
            <stop offset="100%" stopColor="#050B10" />
          </linearGradient>
          <linearGradient id="p6dwFloor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1A2C37" />
            <stop offset="34%" stopColor="#0E1B24" />
            <stop offset="100%" stopColor="#03080C" />
          </linearGradient>
          <linearGradient id="p6dwCeil" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#0D1A23" />
            <stop offset="100%" stopColor="#04090E" />
          </linearGradient>
          <radialGradient id="p6dwGlow" cx="50%" cy="42%" r="52%">
            <stop offset="0%" stopColor={`rgba(150,208,234,${0.3 + light * 0.3})`} />
            <stop offset="100%" stopColor="rgba(60,120,152,0)" />
          </radialGradient>
        </defs>

        {/* room shell in one-point perspective */}
        <rect x="0" y="0" width="254" height="1012" fill="#03080C" />
        <rect x="42" y="140" width="170" height="560" fill="url(#p6dwBack)" />
        <polygon points="0,0 254,0 212,140 42,140" fill="url(#p6dwCeil)" />
        <polygon points="0,0 42,140 42,700 0,1012" fill="url(#p6dwWallL)" />
        <polygon points="254,0 212,140 212,700 254,1012" fill="url(#p6dwWallR)" />
        <polygon points="0,1012 254,1012 212,700 42,700" fill="url(#p6dwFloor)" />

        {/* wall/floor/ceiling junctions */}
        <line x1="42" y1="140" x2="212" y2="140" stroke="rgba(150,198,224,0.14)" strokeWidth="1.2" />
        <line x1="42" y1="700" x2="212" y2="700" stroke="rgba(160,206,230,0.2)" strokeWidth="1.4" />
        <line x1="0" y1="0" x2="42" y2="140" stroke="rgba(150,198,224,0.12)" strokeWidth="1.2" />
        <line x1="254" y1="0" x2="212" y2="140" stroke="rgba(150,198,224,0.1)" strokeWidth="1.2" />
        <line x1="0" y1="1012" x2="42" y2="700" stroke="rgba(150,198,224,0.12)" strokeWidth="1.2" />
        <line x1="254" y1="1012" x2="212" y2="700" stroke="rgba(150,198,224,0.1)" strokeWidth="1.2" />

        {/* ceiling strip, receding */}
        <polygon points="72,34 182,34 172,104 82,104" fill="rgba(198,232,246,0.06)" />
        <rect x="76" y="40" width="102" height="4" rx="2" fill={`rgba(220,242,250,${0.44 + light * 0.4})`} />
        <rect x="66" y="26" width="122" height="36" fill="url(#p6dwGlow)" opacity="0.7" />

        {/* the monitor on the back wall */}
        <g>
          <rect x="62" y="196" width="130" height="96" rx="2" fill="#111A22" stroke="rgba(158,198,224,0.22)" strokeWidth="1.2" />
          <rect x="66" y="200" width="122" height="88" fill="#04101A" />
          <rect x="66" y="200" width="122" height="88" fill={`rgba(96,170,206,${0.2 + light * 0.24})`} />
          {/* screen content: abstract telemetry, no words */}
          <rect x="72" y="208" width="110" height="12" fill={`rgba(214,240,250,${0.16 + light * 0.3})`} />
          <rect x="72" y="228" width="74" height="5" fill={`rgba(196,232,246,${0.14 + light * 0.24})`} />
          <rect x="72" y="240" width="54" height="5" fill={`rgba(196,232,246,${0.11 + light * 0.2})`} />
          <rect x="72" y="256" width="96" height="26" fill={`rgba(140,200,228,${0.1 + light * 0.2})`} />
          <rect x="72" y={204 + scan * 0.55} width="110" height="16" fill="rgba(206,238,250,0.07)" />
          <polygon points="66,200 188,200 188,288 66,288" fill="url(#p6dwGlow)" opacity="0.5" />
          {/* stand and light spill */}
          <rect x="118" y="292" width="18" height="12" fill="#0A1218" />
          <ellipse cx="127" cy="306" rx="26" ry="4" fill="#0A1218" />
        </g>

        {/* console under the monitor */}
        <rect x="46" y="392" width="162" height="12" fill="linear-gradient" />
        <rect x="46" y="392" width="162" height="12" fill="#17242E" />
        <rect x="46" y="392" width="162" height="1.4" fill={`rgba(150,206,232,${0.16 + light * 0.22})`} />
        <rect x="52" y="404" width="150" height="7" fill="#0B141B" />
        <rect x="58" y="394.6" width="72" height="2.4" fill="rgba(160,202,224,0.2)" />
        <rect x="150" y="394" width="5" height="3.6" fill={`rgba(226,176,120,${0.4 + light * 0.3})`} />
        <rect x="162" y="394" width="5" height="3.6" fill={`rgba(150,206,232,${0.3 + light * 0.3})`} />
        <rect x="174" y="394" width="5" height="3.6" fill={`rgba(150,206,232,${0.24 + light * 0.24})`} />
        {/* cabinet */}
        <rect x="52" y="411" width="150" height="86" fill="#0A141B" />
        <line x1="58" y1="438" x2="196" y2="438" stroke="rgba(150,196,222,0.1)" strokeWidth="1" />
        <line x1="58" y1="470" x2="196" y2="470" stroke="rgba(150,196,222,0.08)" strokeWidth="1" />
        <rect x="118" y="424" width="18" height="3" rx="1.5" fill="rgba(178,214,236,0.16)" />
        <rect x="118" y="454" width="18" height="3" rx="1.5" fill="rgba(178,214,236,0.13)" />

        {/* floor light pool from the screen */}
        <polygon points="60,700 194,700 232,1012 22,1012" fill={`rgba(122,190,224,${0.1 + light * 0.14})`} />
        <ellipse cx="127" cy="880" rx="86" ry="150" fill="url(#p6dwGlow)" opacity="0.5" />
        <polygon points="70,700 184,700 196,760 58,760" fill="rgba(170,214,236,0.08)" />

        {/* a stool pushed aside, sitting on the floor in perspective */}
        <g>
          <ellipse cx="72" cy="756" rx="22" ry="7" fill="#081018" />
          <rect x="54" y="726" width="36" height="10" rx="2" fill="#0D1720" />
          <rect x="58" y="736" width="4" height="20" fill="#070E14" />
          <rect x="82" y="736" width="4" height="20" fill="#070E14" />
          <ellipse cx="72" cy="732" rx="18" ry="4" fill="rgba(140,190,216,0.14)" />
        </g>

        {/* haze in the doorway volume */}
        <polygon points="0,0 254,0 254,1012 0,1012" fill="url(#p6dwGlow)" opacity={`${0.16 + light * 0.12}`} />
      </svg>

      {/* cool light bleeding from the screen onto the reveal edges */}
      <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: '4%', background: 'linear-gradient(90deg, rgba(2,6,10,0.9), rgba(2,6,10,0.2))'}} />
      <div style={{position: 'absolute', right: 0, top: 0, bottom: 0, width: '4%', background: 'linear-gradient(270deg, rgba(2,6,10,0.9), rgba(2,6,10,0.2))'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: '9%', background: 'linear-gradient(180deg, rgba(2,6,10,0.92), rgba(2,6,10,0.1))'}} />
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: '10%', background: 'linear-gradient(0deg, rgba(2,6,10,0.94), rgba(2,6,10,0.08))'}} />
      <div style={{position: 'absolute', inset: 0, background: `rgba(120,190,224,${0.05 * fl * light})`, mixBlendMode: 'screen'}} />
    </div>
  );
};

const DoorReveal: React.FC<{f: number}> = ({f}) => {
  const open = smooth((f - (C.s3 + 40)) / 92);
  const light = smooth((f - (C.s3 + 64)) / 88);
  const z = 1.01 + smooth((f - C.s3) / (C.s4 - C.s3)) * 0.06;
  const lid = blinkLid(f, C.s3 + 52) + blinkLid(f, C.s3 + 158) * 0.7;
  const x = -18 + open * 34;
  return (
    <AbsoluteFill style={{background: '#04070A', overflow: 'hidden'}}>
      <Cam z={z} ox="58%" oy="46%" x={x}>
        <Room f={f} phoneOn={0.6} doorVibe={0} />
        {/* the apartment wall stays, but the doorway no longer holds a hallway */}
        <div style={{position: 'absolute', left: 776, top: 240, width: 248, height: 1006, overflow: 'hidden', boxShadow: 'inset 0 0 40px rgba(0,0,0,0.9)'}}>
          <LabDoorway f={f} light={light} />
        </div>
        {/* light spilling out across the floor and onto Noah */}
        <div
          style={{
            position: 'absolute',
            left: 560,
            top: 1240,
            width: 560,
            height: 680,
            background: `linear-gradient(176deg, rgba(134,190,220,${0.34 * light}), rgba(86,142,176,${0.12 * light}) 44%, transparent 78%)`,
            clipPath: 'polygon(210px 0px, 450px 0px, 680px 680px, 0px 680px)',
            filter: 'blur(6px)',
            mixBlendMode: 'screen',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 760,
            top: 240,
            width: 300,
            height: 1020,
            background: `linear-gradient(90deg, rgba(126,184,216,${0.22 * light}), transparent 70%)`,
            filter: 'blur(30px)',
            mixBlendMode: 'screen',
          }}
        />
        {/* Noah, grounded in the apartment */}
        <div
          style={{
            position: 'absolute',
            left: 214,
            top: 438,
            width: 512,
            height: 1000,
            transform: `translateX(${open * 6}px)`,
            filter: 'brightness(0.94) contrast(1.06) drop-shadow(0 30px 60px rgba(0,0,0,0.9))',
          }}
        >
          <Noah
            expression={f < C.s3 + 120 ? 'unease' : f < C.s3 + 200 ? 'shock' : 'fear'}
            look={f < C.s3 + 96 ? 'door' : 'camera'}
            turn={0.5}
            lidOverride={lid > 0.2 ? lid : undefined}
            rim={1.05 + light * 0.7}
            viewBox="0 0 600 1040"
            preserve="xMidYMax meet"
          />
        </div>
        {/* his feet on the floor */}
        <div style={{position: 'absolute', left: 300, top: 1396, width: 360, height: 64, background: 'radial-gradient(closest-side, rgba(0,0,0,0.72), transparent 72%)', filter: 'blur(9px)'}} />
        {/* rim of doorway light along his right side */}
        <div style={{position: 'absolute', left: 590, top: 560, width: 130, height: 830, background: `linear-gradient(90deg, transparent, rgba(156,206,232,${0.2 * light}), transparent)`, filter: 'blur(18px)', mixBlendMode: 'screen'}} />
        {/* the door leaf, swinging on its left hinge */}
        <div
          style={{
            position: 'absolute',
            left: 774,
            top: 236,
            width: 254,
            height: 1012,
            transformOrigin: 'left center',
            transform: `perspective(1500px) rotateY(${-open * 112}deg) translateX(${-open * 6}px)`,
            background: 'linear-gradient(100deg,#131920,#0C1015 58%,#080B0F)',
            border: '9px solid #090B0E',
            boxShadow: 'inset 0 0 70px rgba(0,0,0,0.85), 0 20px 50px rgba(0,0,0,0.6)',
            opacity: open > 0.97 ? 0 : 1,
          }}
        >
          <div style={{position: 'absolute', inset: 6, border: '1px solid rgba(160,190,215,0.06)'}} />
          <div style={{position: 'absolute', left: 22, top: 96, right: 22, height: 300, border: '1px solid rgba(176,206,232,0.1)'}} />
          <div style={{position: 'absolute', left: 22, top: 470, right: 22, height: 400, border: '1px solid rgba(176,206,232,0.08)'}} />
          <div style={{position: 'absolute', right: 20, top: 500, width: 12, height: 12, borderRadius: '50%', background: 'linear-gradient(140deg,#4A5058,#22262B)'}} />
          <div style={{position: 'absolute', left: 0, top: 0, width: 2, bottom: 0, background: 'rgba(150,186,214,0.16)'}} />
        </div>
        {/* the light crawling along the door edge */}
        <div style={{position: 'absolute', left: 772 + (1 - open) * 5, top: 240, width: 8, height: 1008, background: `rgba(150,206,234,${0.16 + light * 0.2})`, filter: 'blur(4px)', opacity: 1 - open * 0.6}} />
      </Cam>
      <RainStreaks f={f} speed={15} opacity={0.1} blur={2} />
      <AbsoluteFill style={{background: 'radial-gradient(1000px 1100px at 56% 44%, transparent 38%, rgba(0,0,0,0.68) 100%)'}} />
      <Grain f={f} opacity={0.07} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* shot 04 — inside, dozens of screens                                 */
/* ------------------------------------------------------------------ */

const NoahBack: React.FC<{rim?: number}> = ({rim = 1}) => (
  <svg viewBox="0 0 400 720" width="100%" height="100%" preserveAspectRatio="xMidYMax meet">
    <defs>
      <linearGradient id="p6nbCoat" x1="0.1" y1="0" x2="0.9" y2="1">
        <stop offset="0%" stopColor="#3B4855" />
        <stop offset="26%" stopColor="#212D38" />
        <stop offset="66%" stopColor="#101923" />
        <stop offset="100%" stopColor="#05090E" />
      </linearGradient>
      <linearGradient id="p6nbHair" x1="0.15" y1="0" x2="0.85" y2="1">
        <stop offset="0%" stopColor="#2E3945" />
        <stop offset="34%" stopColor="#161F28" />
        <stop offset="100%" stopColor="#060A0E" />
      </linearGradient>
      <linearGradient id="p6nbSkin" x1="0.2" y1="0" x2="0.8" y2="1">
        <stop offset="0%" stopColor="#241A13" />
        <stop offset="100%" stopColor="#0C0806" />
      </linearGradient>
      <linearGradient id="p6nbRimL" x1="0" y1="0" x2="1" y2="0.2">
        <stop offset="0%" stopColor="rgba(212,236,248,0.95)" />
        <stop offset="48%" stopColor="rgba(158,204,232,0.5)" />
        <stop offset="100%" stopColor="rgba(120,176,210,0)" />
      </linearGradient>
      <linearGradient id="p6nbNeckShade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="rgba(0,0,0,0.72)" />
        <stop offset="100%" stopColor="rgba(0,0,0,0)" />
      </linearGradient>
      <filter id="p6nbSoft" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="11" />
      </filter>
      <filter id="p6nbSoft2" x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur stdDeviation="5" />
      </filter>
      <filter id="p6nbSoft3" x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur stdDeviation="2.2" />
      </filter>
    </defs>

    {/* contact shadow */}
    <ellipse cx="200" cy="700" rx="150" ry="22" fill="rgba(0,0,0,0.8)" filter="url(#p6nbSoft)" />

    {/* coat: sloping shoulders, straight fall */}
    <path
      d="M 200 306
         C 176 306 154 312 134 322
         C 112 340 94 354 84 374
         C 76 390 72 412 71 438
         L 66 720 L 334 720 L 329 438
         C 328 412 324 390 316 374
         C 306 354 288 340 266 330
         C 246 322 224 318 200 318 Z"
      fill="url(#p6nbCoat)"
    />
    {/* trapezius ridge: neck into shoulder, the line that makes it read as a body */}
    <path d="M 200 300 C 172 302 146 312 124 328 C 106 341 92 358 84 380" stroke="rgba(168,208,232,0.08)" strokeWidth="7" fill="none" filter="url(#p6nbSoft2)" />
    <path d="M 200 300 C 228 302 254 312 276 328 C 294 341 308 358 316 380" stroke="rgba(150,192,218,0.05)" strokeWidth="7" fill="none" filter="url(#p6nbSoft2)" />

    {/* side shadow so the coat mass has form */}
    <path d="M 71 438 L 66 720 L 120 720 L 126 430 C 127 400 132 376 142 358 Z" fill="rgba(0,0,0,0.45)" filter="url(#p6nbSoft)" />
    <path d="M 329 438 L 334 720 L 288 720 L 280 430 C 279 400 274 376 264 358 Z" fill="rgba(0,0,0,0.55)" filter="url(#p6nbSoft)" />

    {/* centre back seam and folds: soft shadows, never crisp lines */}
    <path d="M 200 336 L 200 720" stroke="rgba(0,0,0,0.5)" strokeWidth="7" fill="none" filter="url(#p6nbSoft2)" />
    <path d="M 158 350 C 150 430 148 540 150 720" stroke="rgba(0,0,0,0.34)" strokeWidth="5" fill="none" filter="url(#p6nbSoft2)" />
    <path d="M 244 350 C 252 430 254 540 252 720" stroke="rgba(0,0,0,0.4)" strokeWidth="5" fill="none" filter="url(#p6nbSoft2)" />
    <path d="M 108 392 C 118 470 122 560 122 660" stroke="rgba(0,0,0,0.3)" strokeWidth="5" fill="none" filter="url(#p6nbSoft2)" />
    <path d="M 292 392 C 282 470 278 560 278 660" stroke="rgba(0,0,0,0.34)" strokeWidth="5" fill="none" filter="url(#p6nbSoft2)" />
    {/* shoulder blades catching the ceiling */}
    <path d="M 136 380 C 158 392 176 402 196 406" stroke="rgba(150,196,224,0.06)" strokeWidth="10" fill="none" filter="url(#p6nbSoft2)" />
    <path d="M 264 380 C 242 392 224 402 204 406" stroke="rgba(150,196,224,0.04)" strokeWidth="10" fill="none" filter="url(#p6nbSoft2)" />
    {/* waist crease */}
    <path d="M 84 500 C 130 516 170 522 200 522 C 230 522 270 516 316 500" stroke="rgba(0,0,0,0.28)" strokeWidth="13" fill="none" filter="url(#p6nbSoft)" />

    {/* collar standing behind the neck */}
    <path d="M 170 292 C 176 316 186 330 200 334 C 214 330 224 316 230 292 L 242 300 C 236 332 220 350 200 354 C 180 350 164 332 158 300 Z" fill="#0A1016" />
    <path d="M 171 294 C 177 317 188 331 200 335" stroke="rgba(168,206,230,0.14)" strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M 229 294 C 223 317 212 331 200 335" stroke="rgba(150,188,214,0.09)" strokeWidth="1.8" fill="none" strokeLinecap="round" />

    {/* neck, short and in shadow */}
    <path d="M 177 246 C 175 266 172 282 168 294 L 232 294 C 228 282 225 266 223 246 Z" fill="url(#p6nbSkin)" />
    <path d="M 177 246 C 175 266 172 282 168 294 L 200 294 L 200 246 Z" fill="rgba(0,0,0,0.3)" />
    <rect x="168" y="244" width="64" height="40" fill="url(#p6nbNeckShade)" />
    <path d="M 223 252 C 225 270 227 284 231 294" stroke="rgba(198,228,244,0.1)" strokeWidth="1.8" fill="none" strokeLinecap="round" />

    {/* head: skull mass, slightly flattened at the nape */}
    <path
      d="M 200 74 C 158 74 133 104 133 148 C 133 178 139 204 149 222 C 157 236 169 246 181 250 L 219 250 C 231 246 243 236 251 222 C 261 204 267 178 267 148 C 267 104 242 74 200 74 Z"
      fill="url(#p6nbHair)"
    />
    {/* crown light and short strand detail */}
    <path d="M 152 128 C 158 100 176 82 200 78" stroke="rgba(176,212,234,0.2)" strokeWidth="9" fill="none" filter="url(#p6nbSoft2)" />
    <path d="M 176 86 C 188 80 208 79 220 84" stroke="rgba(206,232,246,0.26)" strokeWidth="3" fill="none" />
    <path d="M 158 104 C 170 94 186 88 202 88" stroke="rgba(196,226,242,0.17)" strokeWidth="2.4" fill="none" />
    <path d="M 166 122 C 178 112 194 106 208 108" stroke="rgba(186,220,240,0.11)" strokeWidth="2" fill="none" />
    <path d="M 152 146 C 158 128 168 116 180 108" stroke="rgba(180,214,236,0.09)" strokeWidth="1.8" fill="none" />
    {/* hair tufts at the nape, so the hairline is not a shell edge */}
    <path d="M 181 250 C 186 260 194 266 200 268 C 206 266 214 260 219 250 L 212 246 L 206 254 L 200 247 L 194 254 L 188 246 Z" fill="#0A0F14" />
    <path d="M 178 240 C 182 254 190 264 200 268" stroke="rgba(0,0,0,0.6)" strokeWidth="5" fill="none" filter="url(#p6nbSoft3)" />
    <path d="M 222 240 C 218 254 210 264 200 268" stroke="rgba(0,0,0,0.55)" strokeWidth="5" fill="none" filter="url(#p6nbSoft3)" />
    {/* a shade of the ears at the sides */}
    <ellipse cx="134" cy="176" rx="7" ry="17" fill="rgba(38,26,20,0.75)" />
    <ellipse cx="266" cy="176" rx="7" ry="17" fill="rgba(28,19,15,0.85)" />

    {/* rim light: left contour only */}
    <path d="M 134 158 C 134 112 158 80 198 75" stroke="url(#p6nbRimL)" strokeWidth="3" fill="none" opacity={0.62 * rim} strokeLinecap="round" />
    <path d="M 139 198 C 145 216 155 229 168 238" stroke="rgba(180,216,236,0.24)" strokeWidth="2.4" fill="none" opacity={rim} strokeLinecap="round" />
    <path d="M 175 248 C 172 268 169 282 166 294" stroke="rgba(190,222,240,0.2)" strokeWidth="2.2" fill="none" opacity={rim} strokeLinecap="round" />
    <path d="M 168 298 C 146 305 122 318 104 336 C 90 350 80 370 75 396" stroke="rgba(200,230,246,0.34)" strokeWidth="3" fill="none" opacity={rim} strokeLinecap="round" />
    <path d="M 73 440 L 68 700" stroke="rgba(184,220,242,0.22)" strokeWidth="2.4" fill="none" opacity={rim} strokeLinecap="round" />
    {/* faint cool edge on the far side, much weaker */}
    <path d="M 266 158 C 266 114 244 80 206 75" stroke="rgba(138,180,206,0.16)" strokeWidth="2.2" fill="none" opacity={0.7 * rim} />
    <path d="M 314 410 C 310 384 300 364 288 348" stroke="rgba(138,180,206,0.12)" strokeWidth="2" fill="none" opacity={0.7 * rim} />
  </svg>
);


const LabWall: React.FC<{
  f: number;
  power?: number;
  elias?: number;
  mouth?: number;
  dead?: number;
  eliasAll?: boolean;
}> = ({f, power = 1, elias = 0, mouth = 0, dead = 0, eliasAll = false}) => {
  const cells = Array.from({length: 15});
  return (
    <AbsoluteFill style={{background: '#02050A', overflow: 'hidden'}}>
      <AbsoluteFill style={{background: 'linear-gradient(180deg,#070D14 0%,#04090E 54%,#020406 100%)'}} />
      <AbsoluteFill style={{background: `radial-gradient(900px 900px at 50% 38%, rgba(54,112,148,${0.3 * power}), transparent 74%)`}} />
      {/* ceiling strips */}
      <div style={{position: 'absolute', left: 120, top: 112, width: 840, height: 12, borderRadius: 6, background: `rgba(206,234,246,${0.4 * power})`, filter: 'blur(2px)', boxShadow: `0 0 60px 18px rgba(140,196,226,${0.2 * power})`}} />
      <div style={{position: 'absolute', left: 240, top: 160, width: 600, height: 4, background: `rgba(170,212,236,${0.18 * power})`, filter: 'blur(3px)'}} />
      {/* the monitor array */}
      <div
        style={{
          position: 'absolute',
          left: 60,
          top: 246,
          width: 960,
          height: 1108,
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gridTemplateRows: 'repeat(3, 1fr)',
          gap: 14,
          filter: `brightness(${0.5 + power * 0.72}) saturate(0.96)`,
        }}
      >
        {cells.map((_, i) => {
          const k = i % 5;
          const eliasHere = elias > 0 && (eliasAll || (k + i) % 4 !== 1);
          const d = clamp01(dead * 1.5 - (i % 5) * 0.05 - Math.floor(i / 5) * 0.045);
          return (
            <Monitor
              key={i}
              inset={6}
              radius={4}
              style={{position: 'relative'}}
              glow={
                dead > 0
                  ? `0 0 0 1px rgba(146,186,212,${0.06 + 0.16 * (1 - dead)}), 0 14px 34px rgba(0,0,0,0.85)`
                  : '0 0 0 1px rgba(126,166,196,0.16), 0 14px 34px rgba(0,0,0,0.8)'
              }
            >
              {eliasHere ? (
                <EliasFeed f={f} mouth={mouth} bright={0.86 + (i % 3) * 0.05} variant={i} />
              ) : (
                <NoahFeed f={f} time={i % 4 === 0} mode={i % 3 === 0 ? 'stand' : 'close'} bright={0.8 + (i % 4) * 0.07} />
              )}
              {d > 0 ? (
                <div style={{position: 'absolute', inset: 0, background: '#020509', opacity: d}}>
                  <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(46,76,98,0.28), rgba(8,16,22,0.42) 56%, rgba(3,8,12,0.5))'}} />
                  <div style={{position: 'absolute', inset: 0, boxShadow: 'inset 0 1px 0 rgba(164,204,228,0.22), inset 0 0 0 1px rgba(120,162,190,0.12), inset 0 -1px 0 rgba(90,132,160,0.1)'}} />
                  <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(112deg, rgba(210,236,248,0.07), transparent 46%)'}} />
                  <div style={{position: 'absolute', left: '50%', top: '50%', width: 3, height: 3, marginLeft: -1.5, marginTop: -1.5, borderRadius: '50%', background: `rgba(180,220,240,${0.5 * (1 - d)})`, boxShadow: '0 0 14px rgba(120,190,225,0.4)'}} />
                </div>
              ) : null}
            </Monitor>
          );
        })}
      </div>
      {/* side racks, partially out of frame */}
      <div style={{position: 'absolute', left: -76, top: 320, width: 128, height: 960, background: 'linear-gradient(90deg,#05090D,#0C141C)', borderRight: '1px solid rgba(140,184,212,0.12)'}}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{position: 'absolute', left: 20, right: 18, top: 60 + i * 200, height: 132, background: 'rgba(80,140,174,0.12)', border: '1px solid rgba(140,184,212,0.16)'}} />
        ))}
      </div>
      <div style={{position: 'absolute', right: -76, top: 320, width: 128, height: 960, background: 'linear-gradient(270deg,#05090D,#0C141C)', borderLeft: '1px solid rgba(140,184,212,0.12)'}}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{position: 'absolute', left: 18, right: 20, top: 60 + i * 200, height: 132, background: 'rgba(80,140,174,0.12)', border: '1px solid rgba(140,184,212,0.16)'}} />
        ))}
      </div>
      {/* the floor */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 1400, height: 520, background: 'linear-gradient(180deg,#0A1219 0%,#060C12 42%,#020406 100%)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 1398, height: 2, background: 'rgba(150,194,220,0.12)'}} />
      <div style={{position: 'absolute', left: 80, right: 80, top: 1432, height: 420, background: `linear-gradient(180deg, rgba(96,154,188,${0.16 * power}), transparent 82%)`, filter: 'blur(20px)'}} />
      {/* cable trays */}
      <div style={{position: 'absolute', left: 40, right: 40, top: 1364, height: 12, background: 'repeating-linear-gradient(90deg, rgba(30,44,56,0.9) 0 26px, transparent 26px 40px)'}} />
      <path d="M 90 1380 C 240 1430 420 1448 540 1416 C 700 1374 840 1392 996 1440" stroke="rgba(16,24,32,0.9)" strokeWidth={9} fill="none" />
      <path d="M 140 1374 C 320 1414 480 1424 620 1394" stroke="rgba(24,36,46,0.8)" strokeWidth={4} fill="none" />
      <AbsoluteFill style={{background: 'radial-gradient(1100px 1200px at 50% 42%, transparent 34%, rgba(0,0,0,0.72) 100%)'}} />
      <Grain f={f} opacity={0.07} />
    </AbsoluteFill>
  );
};

const LabEntrance: React.FC<{f: number}> = ({f}) => {
  const z = 1.04 - smooth((f - C.s4) / (C.s5 - C.s4)) * 0.05;
  const walk = smooth((f - C.s4) / 26);
  return (
    <AbsoluteFill style={{background: '#02050A', overflow: 'hidden'}}>
      <Cam z={z} ox="50%" oy="42%">
        <LabWall f={f} power={1} />
        {/* Noah walks in, back to camera */}
        <div style={{position: 'absolute', left: 22 + walk * 28, bottom: 168, width: 448, height: 806, filter: 'brightness(0.62) contrast(1.08) drop-shadow(0 26px 54px rgba(0,0,0,0.9))'}}>
          <NoahBack rim={1.1} />
        </div>
        {/* his shadow thrown toward camera */}
        <div style={{position: 'absolute', left: -40, bottom: 80, width: 620, height: 320, background: 'radial-gradient(closest-side, rgba(0,0,0,0.76), transparent 72%)', filter: 'blur(16px)', transform: 'rotate(-4deg)'}} />
        {/* light wrapping the silhouette */}
        <div style={{position: 'absolute', left: 300, bottom: 380, width: 260, height: 700, background: 'radial-gradient(closest-side, rgba(136,192,222,0.18), transparent 74%)', filter: 'blur(22px)', mixBlendMode: 'screen'}} />
      </Cam>
      <AbsoluteFill style={{background: 'radial-gradient(1000px 1100px at 50% 40%, transparent 40%, rgba(0,0,0,0.66) 100%)'}} />
      <Grain f={f} opacity={0.07} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* shot 05 — different recordings, different deaths, the same 11:59    */
/* ------------------------------------------------------------------ */

const ArchiveTriptych: React.FC<{f: number}> = ({f}) => {
  const second = smooth((f - (C.s5 + 62)) / 34);
  const third = smooth((f - (C.s5 + 124)) / 34);
  const tx = -second * 744 - third * 744;
  const z = 1.02 + smooth((f - C.s5) / (C.s6 - C.s5)) * 0.035;
  return (
    <AbsoluteFill style={{background: '#02050A', overflow: 'hidden'}}>
      <AbsoluteFill style={{background: 'linear-gradient(180deg,#060B11 0%,#03070B 58%,#010304 100%)'}} />
      <AbsoluteFill style={{background: 'radial-gradient(1000px 940px at 50% 42%, rgba(48,104,140,0.26), transparent 76%)'}} />
      <div style={{position: 'absolute', inset: 0, transform: `scale(${z})`, transformOrigin: '50% 46%'}}>
        <div style={{position: 'absolute', left: 46 + tx, top: 300, width: 2400, height: 1060, display: 'flex', gap: 44}}>
          {/* feed 01 — the same man, standing, alive */}
          <Monitor
            inset={14}
            radius={7}
            style={{position: 'relative', width: 700, height: 1060, flex: '0 0 auto'}}
            glow="0 0 0 1px rgba(128,170,198,0.22), 0 26px 80px rgba(0,0,0,0.86), 0 0 110px rgba(72,138,176,0.14)"
          >
            <div style={{position: 'absolute', inset: 0, filter: 'grayscale(0.52) contrast(1.1) brightness(1.06) saturate(0.78)'}}>
              <Noah expression="alert" look="camera" rim={1.1} viewBox="136 16 330 500" preserve="xMidYMid slice" />
            </div>
            <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(30,68,92,0.24), transparent 40%, rgba(2,6,9,0.36))'}} />
            <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 120, background: 'linear-gradient(180deg,transparent,rgba(2,6,9,0.56))'}} />
            <div style={{position: 'absolute', right: 30, bottom: 22, fontFamily: MONO, fontSize: 52, letterSpacing: '0.05em', color: 'rgba(238,248,252,0.92)', textShadow: '0 0 26px rgba(120,190,225,0.44)'}}>11:59</div>
          </Monitor>
          {/* feed 02 — down on the floor */}
          <Monitor
            inset={14}
            radius={7}
            style={{position: 'relative', width: 700, height: 1060, flex: '0 0 auto'}}
            glow="0 0 0 1px rgba(128,170,198,0.2), 0 26px 80px rgba(0,0,0,0.86), 0 0 100px rgba(72,138,176,0.12)"
          >
            <BodyFeed f={f} bright={1.28} />
            <div style={{position: 'absolute', right: 30, bottom: 22, fontFamily: MONO, fontSize: 52, letterSpacing: '0.05em', color: 'rgba(238,248,252,0.9)', textShadow: '0 0 26px rgba(120,190,225,0.44)'}}>11:59</div>
          </Monitor>
          {/* feed 03 — the same face, still waiting */}
          <Monitor
            inset={14}
            radius={7}
            style={{position: 'relative', width: 700, height: 1060, flex: '0 0 auto'}}
            glow="0 0 0 1px rgba(128,170,198,0.22), 0 26px 80px rgba(0,0,0,0.86), 0 0 120px rgba(72,138,176,0.16)"
          >
            <div style={{position: 'absolute', inset: 0, filter: 'grayscale(0.5) contrast(1.12) brightness(1.02) saturate(0.76)'}}>
              <Noah expression="alert" look="camera" rim={1.3} viewBox="150 34 300 456" preserve="xMidYMid slice" />
            </div>
            <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(28,64,86,0.24), transparent 38%, rgba(2,6,9,0.46))'}} />
            <div style={{position: 'absolute', right: 30, bottom: 22, fontFamily: MONO, fontSize: 52, letterSpacing: '0.05em', color: 'rgba(238,248,252,0.92)', textShadow: '0 0 26px rgba(120,190,225,0.46)'}}>11:59</div>
          </Monitor>
        </div>
        {/* the wall the monitors hang on */}
        <div style={{position: 'absolute', left: -80, right: -80, top: 120, height: 1500, background: 'linear-gradient(180deg, rgba(8,14,20,0), rgba(10,17,24,0.5) 30%, rgba(4,8,12,0.6))', zIndex: -1}} />
        {/* Noah's shoulder, close and out of focus, watching himself */}
        <div style={{position: 'absolute', left: -250, bottom: -420, width: 600, height: 980, filter: 'blur(13px) brightness(0.44)', opacity: 0.62}}>
          <NoahBack rim={0.7} />
        </div>
        {/* ceiling and floor of the lab around the monitors */}
        <div style={{position: 'absolute', left: 0, right: 0, top: 140, height: 110, background: 'linear-gradient(180deg,#04080D,rgba(7,13,18,0))'}} />
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 500, background: 'linear-gradient(180deg,rgba(3,7,10,0),#03070A 46%,#010203 100%)'}} />
        <div style={{position: 'absolute', left: 0, right: 0, top: 1428, height: 2, background: 'rgba(150,194,220,0.1)'}} />
        <div style={{position: 'absolute', left: 120, right: 120, top: 1436, height: 320, background: 'radial-gradient(closest-side, rgba(92,150,184,0.14), transparent 78%)', filter: 'blur(24px)'}} />
      </div>
      <AbsoluteFill style={{background: 'radial-gradient(1100px 1200px at 50% 44%, transparent 40%, rgba(0,0,0,0.7) 100%)'}} />
      <Grain f={f} opacity={0.08} />
    </AbsoluteFill>
  );
};

const RingGlyph: React.FC<{f: number}> = ({f}) => {
  const p = (f % 46) / 46;
  return (
    <div style={{position: 'absolute', left: '50%', top: '36%', width: 300, height: 300, marginLeft: -150, marginTop: -150}}>
      {[0, 1, 2].map((i) => {
        const q = (p + i / 3) % 1;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: 120 + q * 210,
              height: 120 + q * 210,
              marginLeft: -(60 + q * 105),
              marginTop: -(60 + q * 105),
              borderRadius: '50%',
              border: `2px solid rgba(150,214,240,${0.3 * (1 - q)})`,
              boxShadow: '0 0 40px rgba(106,184,220,0.16)',
            }}
          />
        );
      })}
      <div style={{position: 'absolute', left: '50%', top: '50%', width: 128, height: 128, marginLeft: -64, marginTop: -64, borderRadius: '50%', background: 'radial-gradient(circle, rgba(158,222,246,0.24), rgba(50,110,144,0.06) 70%)', border: '1px solid rgba(170,222,244,0.3)'}}>
        <svg viewBox="0 0 100 100" width="100%" height="100%" style={{transform: 'rotate(-24deg)'}}>
          <path d="M 32 22 C 26 24 22 32 24 42 C 27 60 40 76 58 82 C 68 85 76 81 79 75 L 82 66 L 64 58 L 57 66 C 48 62 40 54 36 45 L 44 38 L 36 20 Z" fill="rgba(222,242,250,0.82)" />
        </svg>
      </div>
    </div>
  );
};

const PhoneRing: React.FC<{f: number}> = ({f}) => {
  const z = 1.03 + smooth((f - C.s6) / (C.s7 - C.s6)) * 0.05;
  const buzz = Math.sin(f * 2.2) * 2.2;
  return (
    <AbsoluteFill style={{background: '#03060A', overflow: 'hidden'}}>
      <AbsoluteFill style={{background: 'radial-gradient(900px 1000px at 50% 44%, rgba(44,96,130,0.5), transparent 72%)'}} />
      {/* lab bokeh behind the hand */}
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} style={{position: 'absolute', left: [40, 760, 120, 860, 380][i], top: [180, 260, 900, 1020, 140][i], width: [190, 240, 180, 160, 300][i], height: [130, 160, 120, 110, 200][i], borderRadius: 8, background: 'rgba(68,124,158,0.16)', border: '1px solid rgba(130,180,210,0.1)', filter: 'blur(8px)'}} />
      ))}
      <div style={{position: 'absolute', inset: 0, transform: `scale(${z}) translateX(${buzz}px)`, transformOrigin: '52% 40%'}}>
        {/* forearm entering low from the left, slim and out of the phone's way */}
        <div style={{position: 'absolute', left: 62, top: 1220, width: 196, height: 700, borderRadius: '98px 98px 70px 70px', background: 'linear-gradient(96deg,#2E211A 0%,#1B1310 44%,#0A0705 100%)', transform: 'rotate(-14deg)', boxShadow: '0 30px 70px rgba(0,0,0,0.85)'}} />
        <div style={{position: 'absolute', left: 82, top: 1268, width: 22, height: 600, borderRadius: 12, background: 'linear-gradient(180deg, rgba(214,168,134,0.2), transparent 72%)', transform: 'rotate(-14deg)', filter: 'blur(2px)'}} />
        {/* palm behind the phone, only its outer edge visible */}
        <div style={{position: 'absolute', left: 186, top: 986, width: 288, height: 376, borderRadius: '140px 104px 120px 120px', background: 'linear-gradient(150deg,#36281F,#1B1210 56%,#080605)', transform: 'rotate(-9deg)'}} />
        {/* fingers wrapping the right edge, tucked under the body */}
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 706 + i * 4,
              top: 686 + i * 92,
              width: 210 - i * 12,
              height: 74 - i * 2,
              borderRadius: '37px 30px 30px 37px',
              background: 'linear-gradient(168deg,#3A2B21,#1E1510 56%,#0A0705)',
              transform: `rotate(${5 + i * 1.6}deg)`,
              boxShadow: '0 12px 26px rgba(0,0,0,0.6)',
            }}
          >
            <div style={{position: 'absolute', left: 16, right: 18, top: 10, height: 8, borderRadius: 4, background: 'linear-gradient(180deg, rgba(222,178,142,0.22), transparent)'}} />
          </div>
        ))}
        {/* phone, tilted in his grip */}
        <div style={{position: 'absolute', left: '50%', top: 340, width: 600, height: 1080, marginLeft: -300, transform: 'rotate(-6deg)'}}>
          <PhoneSlab style={{left: 0, top: 0, width: 600, height: 1080}} rotate={0} glow={1}>
            <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(178deg, rgba(34,72,96,0.92) 0%, rgba(10,22,30,1) 42%, #05090D 100%)'}} />
            <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(closest-side at 50% 34%, rgba(126,196,228,0.28), transparent 68%)'}} />
            <PhoneStatus dim={0.46} />
            <RingGlyph f={f} />
            {/* accept / decline, abstract, no text */}
            <div style={{position: 'absolute', left: 150, bottom: 96, width: 112, height: 112, borderRadius: '50%', background: 'radial-gradient(circle, rgba(94,180,152,0.6), rgba(30,74,64,0.7))', border: '1px solid rgba(160,230,206,0.4)', boxShadow: `0 0 44px rgba(86,190,156,${0.24 + Math.sin(f / 5) * 0.06})`}}>
              <svg viewBox="0 0 100 100" width="100%" height="100%" style={{transform: 'rotate(-24deg)'}}>
                <path d="M 32 22 C 26 24 22 32 24 42 C 27 60 40 76 58 82 C 68 85 76 81 79 75 L 82 66 L 64 58 L 57 66 C 48 62 40 54 36 45 L 44 38 L 36 20 Z" fill="rgba(226,246,238,0.8)" />
              </svg>
            </div>
            <div style={{position: 'absolute', right: 150, bottom: 96, width: 112, height: 112, borderRadius: '50%', background: 'radial-gradient(circle, rgba(152,96,92,0.5), rgba(58,30,30,0.7))', border: '1px solid rgba(224,150,142,0.28)'}}>
              <div style={{position: 'absolute', left: 34, top: 52, width: 44, height: 5, borderRadius: 3, background: 'rgba(242,220,216,0.72)', transform: 'rotate(-45deg)'}} />
              <div style={{position: 'absolute', left: 34, top: 52, width: 44, height: 5, borderRadius: 3, background: 'rgba(242,220,216,0.72)', transform: 'rotate(45deg)'}} />
            </div>
            {/* vibration shimmer on the glass */}
            <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(100deg, transparent 30%, rgba(190,232,248,0.06) 46%, transparent 60%)', transform: `translateX(${(f * 9) % 700 - 350}px)`}} />
          </PhoneSlab>
        </div>
        {/* thumb rising from the palm along the near edge */}
        <div style={{position: 'absolute', left: 208, top: 792, width: 96, height: 300, borderRadius: '48px 44px 40px 30px', background: 'linear-gradient(118deg,#3C2C22,#211711 54%,#0B0806)', transform: 'rotate(-11deg)', boxShadow: '0 18px 40px rgba(0,0,0,0.72)'}} />
        <div style={{position: 'absolute', left: 224, top: 812, width: 16, height: 244, borderRadius: 8, background: 'linear-gradient(180deg, rgba(224,182,150,0.24), rgba(170,120,92,0.05))', transform: 'rotate(-11deg)', filter: 'blur(1.6px)'}} />
        <div style={{position: 'absolute', left: 234, top: 764, width: 62, height: 48, borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(240,198,166,0.2), transparent 72%)', transform: 'rotate(-11deg)'}} />
        <div style={{position: 'absolute', left: 226, top: 800, width: 62, height: 12, borderRadius: 6, background: 'rgba(14,9,7,0.5)', transform: 'rotate(-11deg)'}} />
      </div>
      <AbsoluteFill style={{background: 'radial-gradient(1000px 1100px at 50% 46%, transparent 42%, rgba(0,0,0,0.7) 100%)'}} />
      <Grain f={f} opacity={0.07} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* shot 07 — Amara on the line                                         */
/* ------------------------------------------------------------------ */

const PhoneAtEar: React.FC<{f: number}> = ({f}) => (
  <svg viewBox="0 0 320 520" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
    <defs>
      <linearGradient id="p6peBody" x1="0.15" y1="0" x2="0.85" y2="1">
        <stop offset="0%" stopColor="#2C3641" />
        <stop offset="40%" stopColor="#0E141B" />
        <stop offset="100%" stopColor="#03060A" />
      </linearGradient>
      <linearGradient id="p6peSkin" x1="0.05" y1="0" x2="0.95" y2="1">
        <stop offset="0%" stopColor="#37281F" />
        <stop offset="46%" stopColor="#1F1611" />
        <stop offset="100%" stopColor="#0A0706" />
      </linearGradient>
      <linearGradient id="p6peThumb" x1="0" y1="0" x2="1" y2="0.6">
        <stop offset="0%" stopColor="#3E2D22" />
        <stop offset="40%" stopColor="#241A13" />
        <stop offset="100%" stopColor="#0C0806" />
      </linearGradient>
      <linearGradient id="p6peRim" x1="0" y1="0" x2="0.8" y2="1">
        <stop offset="0%" stopColor="rgba(244,218,194,0.78)" />
        <stop offset="40%" stopColor="rgba(196,146,116,0.2)" />
        <stop offset="100%" stopColor="rgba(120,80,60,0)" />
      </linearGradient>
      <filter id="p6peSoft" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="12" />
      </filter>
    </defs>

    {/* ambient shadow behind the hand */}
    <ellipse cx="160" cy="300" rx="128" ry="182" fill="rgba(0,0,0,0.52)" filter="url(#p6peSoft)" />

    {/* wrist and palm rising from the lower left, gripping the bottom of the phone */}
    <path
      d="M 26 520 C 40 458 58 414 84 382 C 100 362 120 350 140 346 L 196 386 C 190 430 172 476 148 520 Z"
      fill="url(#p6peSkin)"
    />
    <path d="M 58 520 C 72 462 90 420 112 392" stroke="rgba(214,172,140,0.14)" strokeWidth="9" fill="none" filter="url(#p6peSoft)" />
    {/* knuckle mass gathering under the device */}
    <path d="M 120 348 C 148 332 176 332 198 346 C 212 358 214 380 204 394 C 186 414 148 410 128 390 C 116 376 114 360 120 348 Z" fill="url(#p6peSkin)" />

    {/* the back of the device, screen toward her ear */}
    <g transform="rotate(-8 196 214)">
      <rect x="108" y="18" width="176" height="398" rx="34" fill="url(#p6peBody)" stroke="rgba(158,196,222,0.24)" strokeWidth="2" />
      <rect x="119" y="29" width="154" height="376" rx="27" fill="#080D13" />
      <rect x="119" y="29" width="154" height="376" rx="27" fill="none" stroke="rgba(150,210,238,0.14)" strokeWidth="1.4" opacity={0.66 + Math.sin(f / 6) * 0.1} />
      {/* camera island */}
      <rect x="130" y="40" width="62" height="68" rx="14" fill="#0B1119" stroke="rgba(160,200,226,0.18)" strokeWidth="1" />
      <circle cx="147" cy="59" r="10" fill="#05090E" stroke="rgba(150,196,224,0.36)" strokeWidth="1.8" />
      <circle cx="173" cy="75" r="8" fill="#05090E" stroke="rgba(150,196,224,0.24)" strokeWidth="1.3" />
      <circle cx="147" cy="59" r="3.2" fill="rgba(140,190,218,0.34)" />
      <circle cx="173" cy="75" r="2.4" fill="rgba(140,190,218,0.22)" />
      <rect x="140" y="94" width="42" height="7" rx="3.5" fill="rgba(200,226,240,0.1)" />
      {/* side buttons and seam */}
      <rect x="280" y="112" width="4" height="56" rx="2" fill="#1D2630" />
      <rect x="280" y="184" width="4" height="36" rx="2" fill="#1D2630" />
      <line x1="123" y1="352" x2="269" y2="352" stroke="rgba(150,196,222,0.08)" strokeWidth="1" />
      {/* sheen down the back glass */}
      <path d="M 128 60 C 122 160 122 300 130 392" stroke="rgba(206,234,248,0.14)" strokeWidth="10" fill="none" filter="url(#p6peSoft)" />
    </g>

    {/* the thumb laid along the near edge, gripping it */}
    <g transform="rotate(-6 150 300)">
      <path
        d="M 104 470 C 96 424 98 372 110 330 C 118 302 132 286 148 284 C 166 282 180 296 182 318 C 186 356 178 408 164 456 C 158 476 148 486 134 486 C 120 486 108 482 104 470 Z"
        fill="url(#p6peThumb)"
      />
      {/* knuckle crease and nail */}
      <path d="M 116 352 C 130 344 152 344 168 352" stroke="rgba(16,10,8,0.7)" strokeWidth="3.4" fill="none" />
      <path d="M 124 300 C 136 292 156 292 168 300" stroke="rgba(16,10,8,0.5)" strokeWidth="2.6" fill="none" />
      <path d="M 122 386 C 136 378 156 378 172 386" stroke="rgba(16,10,8,0.45)" strokeWidth="2.4" fill="none" />
      <ellipse cx="144" cy="310" rx="15" ry="20" fill="rgba(240,206,182,0.16)" transform="rotate(-12 144 310)" />
      <path d="M 112 336 C 106 386 108 430 116 466" stroke="url(#p6peRim)" strokeWidth="4.6" fill="none" strokeLinecap="round" />
      <path d="M 178 316 C 182 358 176 416 162 460" stroke="rgba(228,186,154,0.18)" strokeWidth="3" fill="none" />
    </g>

    {/* the index finger's tip just visible past the top-left corner */}
    <path d="M 104 132 C 96 116 100 100 112 94 C 124 88 136 94 140 108 C 144 122 138 136 126 140 C 114 144 108 140 104 132 Z" fill="url(#p6peSkin)" opacity="0.9" />
    <path d="M 106 118 C 112 106 124 100 134 104" stroke="rgba(236,200,172,0.22)" strokeWidth="2.6" fill="none" />

    {/* cool rim from the screen on the phone's near edge */}
    <path d="M 112 40 C 104 132 104 300 114 408" stroke="rgba(190,224,240,0.24)" strokeWidth="2.6" fill="none" />
    <path d="M 278 26 C 286 130 286 316 276 410" stroke="rgba(170,208,232,0.12)" strokeWidth="2" fill="none" />
  </svg>
);

const AmaraCall: React.FC<{f: number}> = ({f}) => {
  const z = 1.13 + smooth((f - C.s7) / (C.s8 - C.s7)) * 0.07;
  const lean = smooth((f - (C.s7 + 40)) / 40) * 0.8;
  const mouth = talk(f, C.s7 + 39, C.s7 + 150, 0.27, 3.1);
  const lid = Math.max(blinkLid(f, C.s7 + 22), blinkLid(f, C.s7 + 112) * 0.7);
  const expr: AmaraExpression = f < C.s7 + 96 ? 'focus' : f < C.s7 + 142 ? 'guarded' : 'soft';
  return (
    <AbsoluteFill style={{background: '#03060A', overflow: 'hidden'}}>
      {/* her control room, out of focus behind her */}
      <div style={{position: 'absolute', inset: -50, filter: 'blur(14px) brightness(0.78) saturate(0.96)', transform: 'translate(-36px, -48px) scale(1.12)'}}>
        <ControlWall f={f} on={0.92} />
        <ControlDesk f={f} glow={0.9} />
      </div>
      <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(2,4,6,0.7) 0%, rgba(2,4,6,0.14) 34%, transparent 58%)'}} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(2,4,6,0.52) 0%, transparent 20%, transparent 58%, rgba(2,4,6,0.62) 100%)'}} />
      <div style={{position: 'absolute', left: 40, top: 300, width: 480, height: 620, background: 'radial-gradient(closest-side, rgba(112,174,210,0.22), transparent 74%)', mixBlendMode: 'screen', filter: 'blur(42px)'}} />
      <div style={{position: 'absolute', inset: 0, transform: `scale(${z})`, transformOrigin: '58% 40%'}}>
        <div
          style={{
            position: 'absolute',
            left: 286,
            top: 160,
            width: 800,
            height: 1440,
            transform: `rotate(${lean}deg)`,
            transformOrigin: '52% 92%',
            filter: 'brightness(1.02) contrast(1.05) saturate(1.02)',
          }}
        >
          <Amara
            expression={expr}
            look="left"
            mouth={mouth}
            turn={-0.24}
            screen={0.72}
            rim={1.36}
            viewBox="188 92 208 300"
            preserve="xMidYMid meet"
          />
        </div>
        {/* her left forearm rising to the phone */}
        <div style={{position: 'absolute', left: 272, top: 916, width: 122, height: 980, borderRadius: '61px 56px 44px 44px', background: 'linear-gradient(98deg,#33261B,#1B1210 50%,#070505)', transform: 'rotate(-7deg)', boxShadow: '0 26px 60px rgba(0,0,0,0.82)'}} />
        <div style={{position: 'absolute', left: 284, top: 948, width: 14, height: 940, borderRadius: 7, background: 'linear-gradient(180deg, rgba(214,170,138,0.16), transparent 78%)', transform: 'rotate(-7deg)', filter: 'blur(2px)'}} />
        {/* the phone at her ear, left of the face, clear of her eyes */}
        <div
          style={{
            position: 'absolute',
            left: 250,
            top: 508,
            width: 300,
            height: 500,
            transform: 'rotate(1.5deg)',
            filter: 'drop-shadow(0 22px 44px rgba(0,0,0,0.84))',
          }}
        >
          <PhoneAtEar f={f} />
        </div>
        {/* phone glass spill on her cheek */}
        <div style={{position: 'absolute', left: 392, top: 512, width: 300, height: 440, background: 'radial-gradient(closest-side, rgba(128,192,224,0.18), transparent 72%)', mixBlendMode: 'screen', filter: 'blur(16px)'}} />
      </div>
      {/* foreground desk, filling the bottom of the frame */}
      <div style={{position: 'absolute', left: -120, top: 1406, width: 1320, height: 640, background: 'linear-gradient(180deg,#111C24 0%,#0A1218 22%,#050A0E 70%,#020406 100%)'}} />
      <div style={{position: 'absolute', left: -120, top: 1402, width: 1320, height: 2, background: 'rgba(172,214,238,0.15)', boxShadow: '0 0 26px rgba(110,174,206,0.16)'}} />
      <div style={{position: 'absolute', left: -120, top: 1412, width: 1320, height: 250, background: 'linear-gradient(180deg, rgba(112,176,208,0.12), transparent 88%)', filter: 'blur(16px)'}} />
      {/* keyboard edge, near left */}
      <div style={{position: 'absolute', left: -70, top: 1660, width: 480, height: 160, borderRadius: 8, background: 'linear-gradient(180deg,#131B24,#080D12)', border: '1px solid rgba(130,172,200,0.1)', transform: 'rotate(-3deg)'}}>
        <div style={{position: 'absolute', left: 16, right: 16, top: 16, bottom: 20, background: 'repeating-linear-gradient(90deg, rgba(150,190,215,0.07) 0 32px, transparent 32px 40px), repeating-linear-gradient(0deg, rgba(150,190,215,0.05) 0 18px, transparent 18px 28px)', borderRadius: 4}} />
      </div>
      {/* mug on the desk, right of frame */}
      <div style={{position: 'absolute', left: 884, top: 1450, width: 104, height: 118, borderRadius: '12px 12px 20px 20px', background: 'linear-gradient(160deg,#2A323A,#0D1217 62%,#05080C)', boxShadow: '0 20px 40px rgba(0,0,0,0.7)'}}>
        <div style={{position: 'absolute', left: -24, top: 30, width: 34, height: 50, borderRadius: '50%', border: '8px solid #182028', borderRightColor: 'transparent'}} />
        <div style={{position: 'absolute', left: 10, top: 8, right: 10, height: 12, borderRadius: '50%', background: 'rgba(168,210,234,0.14)'}} />
        <div style={{position: 'absolute', left: 17, top: 18, width: 10, height: 62, borderRadius: 6, background: 'rgba(196,228,244,0.09)'}} />
        <div style={{position: 'absolute', left: 14, top: -26, width: 64, height: 40, background: 'radial-gradient(closest-side, rgba(200,232,246,0.16), transparent 74%)', filter: 'blur(7px)'}} />
      </div>
      {/* a second screen edge, cropped at the right of the desk */}
      <div style={{position: 'absolute', left: 862, top: 1662, width: 320, height: 220, borderRadius: 10, background: 'linear-gradient(180deg,#0E1620,#070C11 60%,#04080C)', border: '1px solid rgba(130,172,200,0.09)', transform: 'rotate(-6deg)'}}>
        <div style={{position: 'absolute', inset: 12, background: 'linear-gradient(184deg, rgba(44,86,112,0.24), rgba(10,20,28,0.5) 60%, rgba(4,8,12,0.6))', borderRadius: 4}} />
      </div>
      <AbsoluteFill style={{background: 'radial-gradient(1000px 1200px at 48% 38%, transparent 44%, rgba(0,0,0,0.64) 100%)'}} />
      <Grain f={f} opacity={0.07} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* shot 08 — the single monitor at the end of the laboratory           */
/* ------------------------------------------------------------------ */

const LabCorridor: React.FC<{f: number; power?: number; push?: number; terminal?: React.ReactNode}> = ({
  f,
  power = 1,
  push = 0,
  terminal,
}) => (
  <div style={{position: 'absolute', inset: 0, overflow: 'hidden', background: '#02050A'}}>
    <svg viewBox="0 0 1080 1920" width="100%" height="100%" preserveAspectRatio="none" style={{position: 'absolute', inset: 0}}>
      <defs>
        <linearGradient id="p6cFloor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0B1720" />
          <stop offset="46%" stopColor="#071018" />
          <stop offset="100%" stopColor="#020508" />
        </linearGradient>
        <linearGradient id="p6cWallL" x1="1" y1="0" x2="0" y2="0.3">
          <stop offset="0%" stopColor="#1B2E3A" />
          <stop offset="46%" stopColor="#101F29" />
          <stop offset="100%" stopColor="#060D13" />
        </linearGradient>
        <linearGradient id="p6cWallR" x1="0" y1="0" x2="1" y2="0.3">
          <stop offset="0%" stopColor="#1B2E3A" />
          <stop offset="46%" stopColor="#101F29" />
          <stop offset="100%" stopColor="#060D13" />
        </linearGradient>
        <radialGradient id="p6cFar" cx="50%" cy="46%" r="50%">
          <stop offset="0%" stopColor={`rgba(184,224,242,${0.42 * power})`} />
          <stop offset="100%" stopColor="rgba(60,112,146,0)" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="1080" height="1920" fill="#04080C" />
      <polygon points="0,0 1080,0 600,900 480,900" fill="#050A0F" />
      <polygon points="0,0 480,900 480,900 0,1920" fill="url(#p6cWallL)" />
      <polygon points="1080,0 600,900 600,900 1080,1920" fill="url(#p6cWallR)" />
      <polygon points="0,1920 1080,1920 600,900 480,900" fill="url(#p6cFloor)" />
      <rect x="440" y="600" width="200" height="320" fill="#0B1A24" />
      <rect x="440" y="600" width="200" height="320" fill="none" stroke="rgba(150,198,224,0.14)" strokeWidth="2" />
      <line x1="440" y1="760" x2="640" y2="760" stroke="rgba(150,198,224,0.07)" strokeWidth="2" />
      <ellipse cx="540" cy="840" rx="250" ry="392" fill="url(#p6cFar)" />
      {/* structural ribs */}
      {[0.08, 0.18, 0.29, 0.41, 0.54, 0.68, 0.83].map((t, i) => {
        const xL = 480 * (1 - t);
        const xR = 1080 - 480 * (1 - t);
        const yT = 900 - 900 * t;
        const yB = 900 + 1020 * t;
        return (
          <g key={i} opacity={0.55 + t * 0.35}>
            <line x1={xL} y1={yT} x2={xL} y2={yB} stroke="rgba(124,168,196,0.18)" strokeWidth={1 + t * 2} />
            <line x1={xR} y1={yT} x2={xR} y2={yB} stroke="rgba(124,168,196,0.16)" strokeWidth={1 + t * 2} />
            <line x1={xL} y1={yT} x2={xR} y2={yT} stroke="rgba(124,168,196,0.1)" strokeWidth={1 + t * 1.4} />
          </g>
        );
      })}
      {/* flush wall panels and conduit runs, seated in the wall */}
      {[0.08, 0.24, 0.44, 0.66].map((t, i) => {
        const t2 = t + 0.125;
        const x1 = 480 * (1 - t);
        const x2 = 480 * (1 - t2);
        const yT1 = 900 - 900 * t;
        const yT2 = 900 - 900 * t2;
        const yB1 = 900 + 1020 * t;
        const yB2 = 900 + 1020 * t2;
        const top1 = yT1 + (yB1 - yT1) * 0.33;
        const top2 = yT2 + (yB2 - yT2) * 0.33;
        const bot1 = yT1 + (yB1 - yT1) * 0.57;
        const bot2 = yT2 + (yB2 - yT2) * 0.57;
        return (
          <g key={i}>
            <polygon
              points={`${x1},${top1} ${x2},${top2} ${x2},${bot2} ${x1},${bot1}`}
              fill="rgba(34,58,74,0.42)"
              stroke="rgba(158,204,230,0.2)"
              strokeWidth="1.2"
            />
            <polygon
              points={`${x1 - 2},${top1 + 3} ${x2},${top2 + 3} ${x2},${top2 + 9} ${x1 - 2},${top1 + 9}`}
              fill="rgba(140,192,222,0.1)"
            />
            <polygon
              points={`${1080 - x1},${top1} ${1080 - x2},${top2} ${1080 - x2},${bot2} ${1080 - x1},${bot1}`}
              fill="rgba(30,52,68,0.38)"
              stroke="rgba(158,204,230,0.17)"
              strokeWidth="1.2"
            />
            <polygon
              points={`${1080 - x1 + 2},${top1 + 3} ${1080 - x2},${top2 + 3} ${1080 - x2},${top2 + 9} ${1080 - x1 + 2},${top1 + 9}`}
              fill="rgba(140,192,222,0.08)"
            />
            <circle cx={x1 - 10} cy={bot1 + 16} r={1.6 + t} fill={`rgba(212,150,106,${0.35 - t * 0.24})`} />
            <circle cx={1080 - x1 + 10} cy={bot1 + 16} r={1.6 + t} fill={`rgba(150,206,232,${0.3 - t * 0.2})`} />
          </g>
        );
      })}
      {/* wall conduit, running the length of both walls */}
      {[0, 1].map((side) => (
        <g key={`c${side}`}>
          <line
            x1={side === 0 ? 478 : 602}
            y1={1310}
            x2={side === 0 ? 26 : 1054}
            y2={1880}
            stroke="rgba(10,18,26,0.85)"
            strokeWidth={7}
          />
          <line
            x1={side === 0 ? 478 : 602}
            y1={1310}
            x2={side === 0 ? 26 : 1054}
            y2={1880}
            stroke="rgba(150,196,224,0.1)"
            strokeWidth={1.4}
          />
        </g>
      ))}
      {/* ceiling practicals */}
      {[0.14, 0.32, 0.52, 0.74].map((t, i) => {
        const xL = 480 * (1 - t);
        const xR = 1080 - 480 * (1 - t);
        const yT = 900 - 900 * t;
        return (
          <g key={i} opacity={0.5 + t * 0.4}>
            <line x1={xL + (xR - xL) * 0.36} y1={yT + 10} x2={xL + (xR - xL) * 0.64} y2={yT + 10} stroke="rgba(202,232,246,0.5)" strokeWidth={2 + t * 5} />
            <line x1={xL + (xR - xL) * 0.36} y1={yT + 10} x2={xL + (xR - xL) * 0.64} y2={yT + 10} stroke="rgba(150,204,232,0.16)" strokeWidth={12 + t * 26} filter="blur(4px)" />
          </g>
        );
      })}
      {/* floor centre reflection */}
      <polygon points="480,900 600,900 700,1920 380,1920" fill="rgba(110,170,202,0.06)" />
      {[0.1, 0.24, 0.4, 0.58, 0.78].map((t, i) => (
        <line key={i} x1={540} y1={900 + 1020 * t} x2={540 - 480 * t} y2={900 + 1020 * t} stroke="rgba(140,186,214,0.1)" strokeWidth="1.2" />
      ))}
      {/* cables at the base of the near walls */}
      <path d="M 0 1760 C 120 1740 220 1782 300 1830" stroke="rgba(12,20,28,0.92)" strokeWidth={12} fill="none" />
      <path d="M 1080 1740 C 960 1724 860 1770 786 1822" stroke="rgba(12,20,28,0.9)" strokeWidth={10} fill="none" />
    </svg>
    {/* the terminal, growing as the camera closes the distance */}
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: 596,
        width: 232,
        height: 318,
        marginLeft: -116,
        transform: `scale(${1 + push * 2.1})`,
        transformOrigin: '50% 100%',
      }}
    >
      {terminal}
    </div>
    <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(760px 1080px at 50% 46%, rgba(120,180,212,0.1), transparent 74%)', mixBlendMode: 'screen'}} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 240, background: 'linear-gradient(180deg,#020508,transparent)'}} />
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 300, background: 'linear-gradient(180deg,transparent,#020508)'}} />
  </div>
);

const TerminalUnit: React.FC<{f: number; boot?: number; elias?: number; mouth?: number; dim?: number}> = ({
  f,
  boot = 0,
  elias = 0,
  mouth = 0,
  dim = 0,
}) => (
  <div style={{position: 'absolute', inset: 0}}>
    {/* the frame and the stand */}
    <div style={{position: 'absolute', left: -14, right: -14, top: -14, bottom: 76, borderRadius: 10, background: 'linear-gradient(160deg,#161D24,#080C11 52%,#04070A)', border: '1px solid rgba(150,190,216,0.16)', boxShadow: '0 24px 60px rgba(0,0,0,0.8)'}} />
    <div style={{position: 'absolute', left: -10, right: -10, top: -10, bottom: 82, borderRadius: 8, background: '#04080C', overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 5, background: '#020509', overflow: 'hidden'}}>
        <div style={{position: 'absolute', inset: 0, opacity: boot, filter: `brightness(${1 - dim * 0.7})`}}>
          {elias > 0.5 ? <EliasFeed f={f} mouth={mouth} bright={1} /> : <NoahFeed f={f} mode="medium" bright={1.55} time />}
        </div>
        {boot < 0.12 ? (
          <div style={{position: 'absolute', inset: 0, background: '#020509'}}>
            <div style={{position: 'absolute', left: '50%', top: '50%', width: 4, height: 4, marginLeft: -2, marginTop: -2, borderRadius: '50%', background: 'rgba(190,230,248,0.9)', boxShadow: '0 0 22px 9px rgba(120,190,225,0.4)'}} />
          </div>
        ) : null}
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(72% 58% at 50% 40%, rgba(150,206,236,0.14), transparent 76%)'}} />
        <div style={{position: 'absolute', inset: 0, background: `rgba(2,6,10,${0.06 + dim * 0.34})`}} />
        <Scanlines opacity={0.24} />
        <ScreenGlass strength={0.8} />
      </div>
    </div>
    <div style={{position: 'absolute', left: '50%', bottom: 26, width: 38, height: 58, marginLeft: -19, background: 'linear-gradient(180deg,#0D1218,#05080C)'}} />
    <div style={{position: 'absolute', left: '50%', bottom: 12, width: 128, height: 18, marginLeft: -64, borderRadius: '50%', background: 'linear-gradient(180deg,#10161D,#04070B)', boxShadow: '0 8px 24px rgba(0,0,0,0.8)'}} />
    <div style={{position: 'absolute', left: '50%', bottom: 0, width: 40, height: 4, marginLeft: -20, borderRadius: 2, background: 'rgba(166,206,230,0.4)', boxShadow: '0 0 18px rgba(120,190,225,0.5)'}} />
  </div>
);

const CorridorWalk: React.FC<{f: number}> = ({f}) => {
  const push = smooth((f - C.s8) / (C.s9 - C.s8));
  const bob = Math.sin(f / 9) * 3;
  const sway = Math.sin(f / 17) * 4;
  return (
    <AbsoluteFill style={{background: '#02050A', overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, transform: `scale(${1 + push * 0.1})`, transformOrigin: '50% 48%'}}>
        <LabCorridor f={f} power={0.86} push={push} terminal={<TerminalUnit f={f} boot={1} dim={0.26} />} />
      </div>
      {/* backlight halo behind him, so the dark silhouette reads against the wall */}
      <div style={{position: 'absolute', left: '50%', top: 660, width: 760, height: 1180, marginLeft: -380, background: 'radial-gradient(closest-side, rgba(122,178,210,0.3), rgba(70,120,152,0.12) 56%, transparent 78%)', filter: 'blur(42px)', mixBlendMode: 'screen'}} />
      {/* Noah walks the corridor, back to camera */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          bottom: 128 - push * 26,
          width: 470,
          height: 806,
          marginLeft: -235 + sway,
          transform: `translateY(${bob}px)`,
          filter: 'brightness(0.98) contrast(1.12) drop-shadow(0 26px 54px rgba(0,0,0,0.9))',
        }}
      >
        <NoahBack rim={1.5} />
      </div>
      <div style={{position: 'absolute', left: '50%', bottom: 84, width: 460, height: 120, marginLeft: -230, background: 'radial-gradient(closest-side, rgba(0,0,0,0.8), transparent 74%)', filter: 'blur(12px)'}} />
      {/* rim light from the far terminal */}
      <div style={{position: 'absolute', left: '50%', top: 700, width: 500, height: 900, marginLeft: -250, background: 'radial-gradient(closest-side, rgba(136,194,224,0.18), transparent 76%)', filter: 'blur(28px)', mixBlendMode: 'screen'}} />
      <AbsoluteFill style={{background: 'radial-gradient(1000px 1200px at 50% 46%, transparent 34%, rgba(0,0,0,0.7) 100%)'}} />
      <Grain f={f} opacity={0.08} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* shot 09 — the archive monitor wakes                                 */
/* ------------------------------------------------------------------ */

const TerminalWake: React.FC<{f: number}> = ({f}) => {
  const boot = smooth((f - (C.s9 + 14)) / 26);
  const z = 1.02 + smooth((f - C.s9) / (C.s10 - C.s9)) * 0.05;
  const bar = ((f - C.s9) * 4.6) % 1500;
  return (
    <AbsoluteFill style={{background: '#02050A', overflow: 'hidden'}}>
      <AbsoluteFill style={{background: 'radial-gradient(900px 1000px at 50% 42%, rgba(38,88,118,0.3), transparent 74%)'}} />
      {/* the lab falls away around the single monitor */}
      <div style={{position: 'absolute', inset: -60, filter: 'blur(40px) brightness(0.5)', transform: 'scale(1.16)'}}>
        <LabCorridor f={f} power={0.5} push={0.6} terminal={null} />
      </div>
      <div style={{position: 'absolute', inset: 0, transform: `scale(${z})`, transformOrigin: '50% 44%'}}>
        <div style={{position: 'absolute', left: 92, top: 272, width: 896, height: 1272}}>
          <TerminalUnit f={f} boot={boot} dim={0.1} />
        </div>
        {/* the monitor's light on the air in front of it */}
        <div style={{position: 'absolute', left: 20, top: 280, width: 1040, height: 1260, background: 'radial-gradient(closest-side, rgba(126,196,232,0.28), transparent 76%)', mixBlendMode: 'screen', filter: 'blur(26px)'}} />
        {/* Noah's shoulder, close, out of focus, watching the recording */}
        <div style={{position: 'absolute', right: -130, bottom: -260, width: 640, height: 1040, filter: 'blur(12px) brightness(0.46) contrast(1.1)', opacity: 0.9}}>
          <NoahBack rim={1.2} />
        </div>
        {/* scan bar on the glass */}
        <div style={{position: 'absolute', left: 92, top: 272 + bar, width: 896, height: 180, background: 'linear-gradient(180deg,transparent,rgba(160,214,238,0.05),transparent)', opacity: boot}} />
      </div>
      <AbsoluteFill style={{background: 'radial-gradient(1000px 1100px at 50% 44%, transparent 40%, rgba(0,0,0,0.72) 100%)'}} />
      <Grain f={f} opacity={0.09} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* shot 10 — the original Noah, three years ago                        */
/* ------------------------------------------------------------------ */

const OriginalMessage: React.FC<{f: number}> = ({f}) => {
  const z = 1.01 + smooth((f - C.s10) / (C.s11 - C.s10)) * 0.12;
  const mouth = talk(f, 1398, 1499, 0.3, 3.0);
  const lid = Math.max(blinkLid(f, 1314), blinkLid(f, 1432) * 0.75);
  const weaveX = Math.sin(f / 5.2) * 1.4 + Math.sin(f / 17) * 1.1;
  const weaveY = Math.cos(f / 6.4) * 1.2;
  const bright = 0.92 + Math.sin(f / 11) * 0.02 + Math.sin(f / 31) * 0.02;
  return (
    <AbsoluteFill style={{background: '#04070A', overflow: 'hidden'}}>
      <AbsoluteFill style={{background: 'radial-gradient(1000px 1100px at 50% 40%, rgba(34,66,88,0.38), transparent 74%)'}} />
      {/* the monitor bezel, just at the edge of frame */}
      <div style={{position: 'absolute', left: 34, top: 178, width: 1012, height: 1460, borderRadius: 12, background: 'linear-gradient(160deg,#151C23,#070B10 54%,#04070A)', border: '1px solid rgba(150,190,216,0.18)', boxShadow: '0 40px 110px rgba(0,0,0,0.9)'}}>
        <div style={{position: 'absolute', inset: 16, background: '#03070B', overflow: 'hidden'}}>
          <div style={{position: 'absolute', inset: 0, transform: `scale(${z}) translate(${weaveX}px,${weaveY}px)`, transformOrigin: '50% 38%', filter: `grayscale(0.82) contrast(1.16) brightness(${bright}) saturate(0.58)`}}>
            <Noah
              expression={f < 1370 ? 'tired' : f < 1436 ? 'sad' : 'relief'}
              look="camera"
              mouth={mouth}
              lidOverride={lid > 0.2 ? lid : undefined}
              rim={1.22}
              viewBox="150 18 300 438"
              preserve="xMidYMid slice"
            />
          </div>
          {/* archive grade and glass */}
          <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(46,86,110,0.18), transparent 36%, rgba(2,6,10,0.44))'}} />
          <Scanlines opacity={0.34} />
          <div style={{position: 'absolute', left: 0, right: 0, height: 90, top: ((f * 2.4) % 1400) - 90, background: 'linear-gradient(180deg,transparent,rgba(190,224,240,0.055),transparent)'}} />
          <div style={{position: 'absolute', inset: 0, border: '1px solid rgba(160,204,230,0.18)'}} />
          <div style={{position: 'absolute', right: 36, bottom: 34, fontFamily: MONO, fontSize: 52, letterSpacing: '0.06em', color: 'rgba(232,244,250,0.78)', textShadow: '0 0 24px rgba(120,190,225,0.36)'}}>11:59</div>
          <div style={{position: 'absolute', left: 38, top: 34, width: 12, height: 12, borderRadius: '50%', background: `rgba(214,96,80,${0.5 + Math.sin(f / 8) * 0.14})`, boxShadow: '0 0 18px rgba(214,96,80,0.5)'}} />
          <ScreenGlass strength={0.9} />
        </div>
      </div>
      {/* the room's darkness creeping over the screen */}
      <AbsoluteFill style={{background: 'radial-gradient(1100px 1200px at 50% 44%, transparent 42%, rgba(0,0,0,0.76) 100%)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 260, background: 'linear-gradient(180deg,transparent,#020508 80%)'}} />
      <Grain f={f} opacity={0.1} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* shot 11 — Elias on every screen                                     */
/* ------------------------------------------------------------------ */

const EliasTakeover: React.FC<{f: number}> = ({f}) => {
  const z = 1.02 + smooth((f - C.s11) / (C.s12 - C.s11)) * 0.08;
  const blast = 1 - smooth((f - C.s11) / 12);
  const fl = flick(f, 1.6);
  const sway = Math.sin(f / 19) * 2;
  return (
    <AbsoluteFill style={{background: '#02050A', overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, transform: `scale(${z})`, transformOrigin: '50% 38%'}}>
        <LabWall f={f} power={0.6 * fl} elias={1} eliasAll mouth={0} />
        {/* Noah, small against the wall */}
        <div style={{position: 'absolute', left: 64 + sway, bottom: 96, width: 430, height: 742, filter: 'brightness(0.44) contrast(1.1) drop-shadow(0 26px 50px rgba(0,0,0,0.9))'}}>
          <NoahBack rim={1.5} />
        </div>
        <div style={{position: 'absolute', left: 36, bottom: 62, width: 500, height: 120, background: 'radial-gradient(closest-side, rgba(0,0,0,0.8), transparent 74%)', filter: 'blur(12px)'}} />
        {/* cool spill from the wall on his shoulders */}
        <div style={{position: 'absolute', left: 300, bottom: 420, width: 300, height: 620, background: 'radial-gradient(closest-side, rgba(128,188,220,0.16), transparent 76%)', filter: 'blur(24px)', mixBlendMode: 'screen'}} />
        {/* the instant of the takeover */}
        <div style={{position: 'absolute', inset: 0, background: 'rgba(206,238,250,0.42)', opacity: blast * 0.5, mixBlendMode: 'screen'}} />
        <div style={{position: 'absolute', left: 0, right: 0, height: 260, top: ((f * 13) % 1700) - 130, background: 'linear-gradient(180deg,transparent,rgba(180,224,244,0.12),transparent)', opacity: 0.2 + blast * 0.6, mixBlendMode: 'screen'}} />
        {/* two horizontal tears as the feeds lock */}
        <div style={{position: 'absolute', left: 0, right: 0, top: 620, height: 44, background: 'rgba(214,242,252,0.12)', transform: `translateX(${Math.sin(f / 2) * 30}px)`, opacity: blast * 0.8, mixBlendMode: 'screen'}} />
        <div style={{position: 'absolute', left: 0, right: 0, top: 1116, height: 18, background: 'rgba(214,242,252,0.1)', transform: `translateX(${Math.sin(f / 3) * 54}px)`, opacity: blast * 0.7, mixBlendMode: 'screen'}} />
      </div>
      <AbsoluteFill style={{background: 'radial-gradient(1100px 1200px at 50% 40%, transparent 34%, rgba(0,0,0,0.76) 100%)'}} />
      <Grain f={f} opacity={0.08} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* shot 12 — "End the experiment, Noah."                               */
/* ------------------------------------------------------------------ */

const EliasDemand: React.FC<{f: number}> = ({f}) => {
  const z = 1.01 + smooth((f - C.s12) / (C.s13 - C.s12)) * 0.06;
  const mouth = talk(f, 1619, 1723, 0.32, 3.0);
  const fl = flick(f, 2.6);
  const lid = Math.max(blinkLid(f, 1662), blinkLid(f, 1710) * 0.7);
  const turnAway = smooth((f - 1726) / 22);
  return (
    <AbsoluteFill style={{background: '#02050A', overflow: 'hidden'}}>
      {/* a bank of monitors, the centre one dominant */}
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(1000px 1100px at 38% 36%, rgba(48,104,138,0.34), transparent 74%)'}} />
      <div style={{position: 'absolute', right: 18, top: 320, width: 312, height: 636, opacity: 0.3, filter: 'blur(2px)'}}>
        <Monitor inset={8} radius={5} style={{position: 'relative', width: 312, height: 636}}>
          <EliasFeed f={f} mouth={mouth} bright={0.66} variant={2} />
        </Monitor>
      </div>
      <div style={{position: 'absolute', left: 14, top: 280, width: 272, height: 572, opacity: 0.34, filter: 'blur(1.5px)'}}>
        <Monitor inset={8} radius={5} style={{position: 'relative', width: 272, height: 572}}>
          <EliasFeed f={f} mouth={mouth} bright={0.68} variant={1} />
        </Monitor>
      </div>
      <div style={{position: 'absolute', left: 196, top: 330, width: 600, height: 980, transform: `scale(${z})`, transformOrigin: '48% 40%', filter: `brightness(${0.9 * fl})`}}>
        <Monitor inset={18} radius={8} style={{position: 'relative', width: 600, height: 980}} glow="0 0 0 1px rgba(132,176,204,0.24), 0 34px 100px rgba(0,0,0,0.92), 0 0 120px rgba(74,142,180,0.16)">
          <EliasFeed f={f} mouth={mouth} bright={0.94} />
        </Monitor>
      </div>
      {/* Noah in profile, foreground right, listening */}
      <div
        style={{
          position: 'absolute',
          right: -118 - turnAway * 16,
          bottom: -206,
          width: 620,
          height: 1100,
          filter: 'brightness(0.72) contrast(1.1)',
          transform: `rotate(${-0.6 + turnAway * 0.8}deg)`,
          transformOrigin: '50% 86%',
        }}
      >
        <Noah
          expression={f < 1726 ? 'dread' : 'alert'}
          look={f < 1726 ? 'left' : 'right'}
          turn={-0.42 + turnAway * 0.1}
          rim={1.4}
          lidOverride={lid > 0.2 ? lid : undefined}
          viewBox="158 54 300 600"
          preserve="xMidYMid slice"
        />
      </div>
      {/* screen rim on his jaw and cheek, and the edge of his shoulder */}
      <div style={{position: 'absolute', right: 60, bottom: 520, width: 500, height: 760, background: 'radial-gradient(closest-side, rgba(126,190,222,0.22), transparent 72%)', mixBlendMode: 'screen', filter: 'blur(20px)'}} />
      <div style={{position: 'absolute', right: 128, bottom: 210, width: 420, height: 420, background: 'radial-gradient(closest-side, rgba(96,150,182,0.16), transparent 74%)', mixBlendMode: 'screen', filter: 'blur(26px)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 380, background: 'linear-gradient(180deg,transparent,#020508 82%)'}} />
      <AbsoluteFill style={{background: 'radial-gradient(1100px 1200px at 42% 38%, transparent 36%, rgba(0,0,0,0.76) 100%)'}} />
      <Grain f={f} opacity={0.07} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* shot 13 — the emergency switch                                      */
/* ------------------------------------------------------------------ */

const PressHand: React.FC<{press: number; opacity?: number}> = ({press, opacity = 1}) => (
  <svg viewBox="0 0 620 470" width="100%" height="100%" preserveAspectRatio="xMidYMax meet" style={{opacity}}>
    <defs>
      <linearGradient id="p6phBody" x1="0.15" y1="0" x2="0.85" y2="1">
        <stop offset="0%" stopColor="#45342A" />
        <stop offset="34%" stopColor="#261A13" />
        <stop offset="100%" stopColor="#0A0705" />
      </linearGradient>
      <linearGradient id="p6phRim" x1="0" y1="0" x2="0.7" y2="1">
        <stop offset="0%" stopColor="rgba(232,206,180,0.9)" />
        <stop offset="44%" stopColor="rgba(160,116,88,0.26)" />
        <stop offset="100%" stopColor="rgba(94,62,46,0)" />
      </linearGradient>
      <filter id="p6phSoft" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="10" />
      </filter>
    </defs>
    <ellipse cx="440" cy="392" rx="210" ry="52" fill="rgba(0,0,0,0.62)" filter="url(#p6phSoft)" />

    <g transform={`translate(${-press * 3} ${press * 5})`}>
      {/* forearm, tapering into the wrist */}
      <path
        d="M 620 132 C 546 138 494 160 462 196 C 448 212 442 230 442 250 L 442 342 C 454 362 480 376 512 382 C 550 390 588 388 620 382 Z"
        fill="url(#p6phBody)"
      />
      {/* palm */}
      <path
        d="M 462 196 C 430 208 400 226 380 246 C 366 260 364 278 374 292 C 388 312 414 322 444 320 C 470 318 488 306 496 286 C 504 264 500 236 488 216 C 480 204 472 198 462 196 Z"
        fill="url(#p6phBody)"
      />
      {/* index finger, extended to the button */}
      <path
        d="M 430 258 C 386 250 330 248 282 252 C 248 254 220 258 206 264 C 196 268 194 276 200 282 C 208 290 232 294 268 294 C 322 294 384 288 434 280 C 444 278 446 264 430 258 Z"
        fill="url(#p6phBody)"
      />
      {/* knuckle bulges on the index */}
      <ellipse cx="404" cy="272" rx="24" ry="19" fill="url(#p6phBody)" />
      <ellipse cx="318" cy="272" rx="19" ry="16" fill="url(#p6phBody)" />
      {/* middle finger, curled under */}
      <path
        d="M 452 302 C 424 300 386 300 356 306 C 336 310 328 320 334 330 C 342 342 366 344 396 340 C 424 336 450 328 462 318 Z"
        fill="url(#p6phBody)"
      />
      {/* ring finger, curled under */}
      <path
        d="M 456 344 C 430 344 396 348 370 356 C 352 362 348 372 356 380 C 366 390 388 388 412 380 C 434 372 454 362 464 354 Z"
        fill="url(#p6phBody)"
        opacity="0.94"
      />
      {/* little finger */}
      <path
        d="M 452 380 C 428 382 402 388 384 396 C 372 402 370 410 378 416 C 388 424 404 420 420 412 C 436 404 450 394 458 388 Z"
        fill="url(#p6phBody)"
        opacity="0.86"
      />

      {/* rim light from the panel above, along the top contour */}
      <g fill="none" stroke="url(#p6phRim)" strokeLinecap="round">
        <path d="M 620 136 C 548 142 496 164 464 198" strokeWidth={4} />
        <path d="M 462 200 C 428 212 400 230 382 250" strokeWidth={3} opacity={0.8} />
        <path d="M 430 260 C 384 252 328 250 282 254" strokeWidth={3.4} />
        <path d="M 452 304 C 424 302 388 302 358 308" strokeWidth={2.2} opacity={0.55} />
        <path d="M 456 346 C 430 346 398 350 372 358" strokeWidth={1.8} opacity={0.4} />
      </g>
      {/* red bounce from the button on the fingertip */}
      <ellipse cx="212" cy="272" rx="26" ry="20" fill="rgba(226,110,84,0.3)" filter="url(#p6phSoft)" />
      {/* knuckle creases */}
      <g fill="none" stroke="rgba(12,7,5,0.62)" strokeLinecap="round">
        <path d="M 402 258 C 400 268 400 278 403 286" strokeWidth="3" />
        <path d="M 322 260 C 320 268 320 278 323 285" strokeWidth="2.6" />
        <path d="M 440 292 C 424 296 404 298 386 300" strokeWidth="2.4" />
      </g>
      {/* back of the hand catching the panel light */}
      <path d="M 470 208 C 442 220 416 238 396 258 C 404 240 424 222 452 210 Z" fill="rgba(198,164,132,0.18)" filter="url(#p6phSoft)" />
      <ellipse cx="452" cy="262" rx="46" ry="34" fill="rgba(186,150,118,0.1)" filter="url(#p6phSoft)" />
      {/* underside shadow, so the mass has volume */}
      <path d="M 442 330 C 470 348 520 360 570 362 L 620 358 L 620 392 C 570 396 500 388 452 366 Z" fill="rgba(0,0,0,0.5)" filter="url(#p6phSoft)" />
      {/* forearm top sheen */}
      <path d="M 610 150 C 540 158 494 180 466 214" stroke="rgba(198,158,124,0.14)" strokeWidth={24} fill="none" filter="url(#p6phSoft)" />
    </g>
  </svg>
);

const EmergencySwitch: React.FC<{press: number}> = ({press}) => (
  <div style={{position: 'absolute', inset: 0}}>
    {/* housing */}
    <div style={{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, borderRadius: 18, background: 'linear-gradient(158deg,#28323B,#111820 52%,#070C11)', border: '1px solid rgba(168,204,228,0.22)', boxShadow: 'inset 0 1px 0 rgba(196,226,244,0.14), inset 0 0 70px rgba(0,0,0,0.86), 0 40px 90px rgba(0,0,0,0.85)'}} />
    <div style={{position: 'absolute', left: 22, top: 22, right: 22, bottom: 22, borderRadius: 12, border: '1px solid rgba(168,204,228,0.14)'}} />
    <div style={{position: 'absolute', left: 22, top: 22, right: 22, bottom: 22, borderRadius: 12, background: 'radial-gradient(80% 62% at 50% 46%, rgba(72,96,116,0.22), transparent 76%)'}} />
    {/* corner screws */}
    {[[36, 36], [440, 36], [36, 684], [440, 684]].map(([x, y], i) => (
      <div key={i} style={{position: 'absolute', left: x, top: y, width: 16, height: 16, borderRadius: '50%', background: 'linear-gradient(150deg,#46535E,#141B22)', boxShadow: 'inset 0 1px 0 rgba(196,224,242,0.24)'}}>
        <div style={{position: 'absolute', left: 3, top: 7, width: 10, height: 2, borderRadius: 1, background: 'rgba(6,10,14,0.8)', transform: `rotate(${28 + i * 40}deg)`}} />
      </div>
    ))}
    {/* hazard ring */}
    <div style={{position: 'absolute', left: '50%', top: '50%', width: 320, height: 320, marginLeft: -160, marginTop: -160, borderRadius: '50%', background: 'repeating-conic-gradient(from 0deg, rgba(226,170,72,0.78) 0deg 15deg, rgba(22,20,15,0.6) 15deg 30deg)', opacity: 0.72, boxShadow: '0 0 70px rgba(224,168,74,0.22)'}} />
    <div style={{position: 'absolute', left: '50%', top: '50%', width: 268, height: 268, marginLeft: -134, marginTop: -134, borderRadius: '50%', background: 'linear-gradient(160deg,#2A2119,#120D09 62%,#070504)', border: '2px solid rgba(230,190,130,0.24)'}} />
    {/* button, with real travel */}
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: 196,
        height: 196,
        marginLeft: -98,
        marginTop: -98 + press * 9,
        borderRadius: '50%',
        background: `radial-gradient(circle at 38% 30%, rgba(226,118,92,${0.96 - press * 0.16}), rgba(122,36,28,0.98) 58%, rgba(58,14,12,1) 100%)`,
        border: `2px solid rgba(248,168,142,${0.4 + press * 0.2})`,
        boxShadow: `0 ${18 - press * 12}px ${34 - press * 14}px rgba(0,0,0,0.8), 0 0 ${60 + press * 40}px rgba(212,76,54,${0.22 + press * 0.24}), inset 0 ${-10 + press * 8}px 30px rgba(255,182,152,${0.16 + press * 0.12})`,
      }}
    />
    <div style={{position: 'absolute', left: '50%', top: '50%', width: 118, height: 118, marginLeft: -59, marginTop: -59 + press * 9, borderRadius: '50%', background: 'radial-gradient(circle at 38% 30%, rgba(255,190,164,0.24), transparent 68%)'}} />
    {/* indicator lamp */}
    <div style={{position: 'absolute', left: '50%', top: 74, width: 26, height: 26, marginLeft: -13, borderRadius: '50%', background: `rgba(${Math.round(120 + press * 110)},${Math.round(40 + press * 40)},34,1)`, boxShadow: `0 0 ${18 + press * 30}px rgba(220,84,60,${0.24 + press * 0.3})`}} />
    {/* cable leaving the bottom */}
    <path d="M 320 690 C 322 740 292 770 250 790" stroke="rgba(8,12,16,0.96)" strokeWidth={18} fill="none" />
    <path d="M 320 690 C 322 740 292 770 250 790" stroke="rgba(150,190,214,0.1)" strokeWidth={2} fill="none" />
  </div>
);

const SwitchPress: React.FC<{f: number}> = ({f}) => {
  const reach = smooth((f - (C.s13 + 10)) / 54);
  const pressT = smooth((f - 1848) / 12);
  const press = f < 1848 ? 0 : f < 1862 ? pressT : Math.max(0, 1 - smooth((f - 1866) / 18) * 0.45);
  const z = (1.02 + smooth((f - C.s13) / (C.s14 - C.s13)) * 0.06) * 1.2;
  const flash = f >= 1850 ? Math.max(0, 1 - (f - 1850) / 16) : 0;
  return (
    <AbsoluteFill style={{background: '#02050A', overflow: 'hidden'}}>
      <AbsoluteFill style={{background: 'radial-gradient(900px 1000px at 46% 44%, rgba(54,96,120,0.3), transparent 74%)'}} />
      {/* dead-ish lab wall behind, out of focus */}
      <div style={{position: 'absolute', inset: -70, filter: 'blur(26px) brightness(0.62)', transform: 'scale(1.14)'}}>
        <LabWall f={f} power={0.7} elias={1} eliasAll mouth={0} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 520, background: 'linear-gradient(180deg, rgba(6,14,20,0), rgba(6,14,20,0.6) 40%, #02060A 100%)'}} />
      <div style={{position: 'absolute', inset: 0, transform: `scale(${z})`, transformOrigin: '46% 48%'}}>
        {/* switch mounted on the wall */}
        <div style={{position: 'absolute', left: 302, top: 560, width: 476, height: 720, filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.8))'}}>
          <EmergencySwitch press={press} />
        </div>
        {/* Noah's arm and hand */}
        <div
          style={{
            position: 'absolute',
            left: 300 + (1 - reach) * 250,
            top: 583 + (1 - reach) * 76,
            width: 760,
            height: 580,
            filter: 'brightness(0.96) drop-shadow(0 24px 44px rgba(0,0,0,0.82))',
          }}
        >
          <PressHand press={press} />
        </div>
        {/* the press flash and its echo on the wall */}
        <div style={{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, background: `radial-gradient(closest-side at 50% 48%, rgba(255,184,146,${0.34 * flash}), transparent 62%)`, mixBlendMode: 'screen'}} />
        <div style={{position: 'absolute', left: 260, top: 640, width: 560, height: 560, borderRadius: '50%', border: `2px solid rgba(244,176,138,${0.18 * flash})`, transform: `scale(${1 + (1 - flash) * 0.28})`, opacity: flash}} />
        {/* indicator light on the floor */}
        <div style={{position: 'absolute', left: 160, top: 1470, width: 560, height: 250, background: `radial-gradient(closest-side, rgba(214,96,66,${0.14 + press * 0.16}), transparent 74%)`, filter: 'blur(22px)', mixBlendMode: 'screen'}} />
      </div>
      {/* the arm's shadow climbing the panel */}
      <div style={{position: 'absolute', left: 520, top: 980, width: 420, height: 520, background: 'radial-gradient(closest-side, rgba(0,0,0,0.5), transparent 72%)', filter: 'blur(20px)'}} />
      <AbsoluteFill style={{background: 'radial-gradient(1000px 1100px at 46% 46%, transparent 38%, rgba(0,0,0,0.75) 100%)'}} />
      <Grain f={f} opacity={0.07} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* shot 14 — every screen goes black                                   */
/* ------------------------------------------------------------------ */

const Blackout: React.FC<{f: number}> = ({f}) => {
  const dead = smooth((f - (C.s14 + 2)) / 26);
  const power = 1 - smooth((f - C.s14) / 34) * 0.94;
  const z = 1.02 + smooth((f - C.s14) / (C.s15 - C.s14)) * 0.04;
  return (
    <AbsoluteFill style={{background: '#010304', overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, transform: `scale(${z})`, transformOrigin: '50% 40%', filter: `brightness(${0.62 + power * 0.5})`}}>
        <LabWall f={f} power={power} dead={dead} />
        {/* emergency light washing the dead wall */}
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(760px 760px at 20% 24%, rgba(232,168,106,0.2), transparent 74%)', mixBlendMode: 'screen'}} />
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(900px 900px at 74% 68%, rgba(58,106,136,0.16), transparent 78%)', mixBlendMode: 'screen'}} />
        {/* Noah stays in frame, watching the light die */}
        <div style={{position: 'absolute', left: '50%', bottom: 92, width: 520, height: 900, marginLeft: -260, filter: 'brightness(0.46) contrast(1.12)'}}>
          <NoahBack rim={0.7 + power * 0.9} />
        </div>
        {/* warm rim from the surviving practical, cool edge from the glass */}
        <div style={{position: 'absolute', left: '50%', bottom: 400, width: 380, height: 700, marginLeft: -300, background: 'radial-gradient(closest-side at 34% 42%, rgba(238,172,112,0.24), transparent 74%)', mixBlendMode: 'screen', filter: 'blur(16px)'}} />
        <div style={{position: 'absolute', left: '50%', bottom: 460, width: 320, height: 600, marginLeft: 40, background: 'radial-gradient(closest-side at 62% 40%, rgba(120,182,214,0.16), transparent 76%)', mixBlendMode: 'screen', filter: 'blur(18px)'}} />
        <div style={{position: 'absolute', left: '50%', bottom: 54, width: 560, height: 130, marginLeft: -280, background: 'radial-gradient(closest-side, rgba(0,0,0,0.8), transparent 74%)', filter: 'blur(13px)'}} />
        {/* the last light draining from the glass */}
        <div style={{position: 'absolute', inset: 0, background: `radial-gradient(900px 900px at 50% 38%, rgba(84,146,180,${0.2 * power + 0.04}), transparent 72%)`, mixBlendMode: 'screen'}} />
        {/* one surviving amber practical, high left */}
        <div style={{position: 'absolute', left: 76, top: 210, width: 230, height: 230, background: 'radial-gradient(closest-side, rgba(236,170,108,0.32), transparent 72%)', filter: 'blur(28px)'}} />
        <div style={{position: 'absolute', left: 118, top: 246, width: 14, height: 14, borderRadius: '50%', background: 'rgba(248,214,168,0.66)', boxShadow: '0 0 34px 12px rgba(238,172,108,0.34)'}} />
        {/* amber reflection on the floor */}
        <div style={{position: 'absolute', left: 60, top: 1460, width: 420, height: 320, background: 'radial-gradient(closest-side, rgba(226,156,96,0.14), transparent 76%)', filter: 'blur(26px)', mixBlendMode: 'screen'}} />
      </div>
      <AbsoluteFill style={{background: 'radial-gradient(1000px 1100px at 50% 42%, transparent 30%, rgba(0,0,0,0.82) 100%)'}} />
      <Grain f={f} opacity={0.09} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* shot 15 — 11:59 becomes 12:00 AM                                    */
/* ------------------------------------------------------------------ */

const ClockChange: React.FC<{f: number}> = ({f}) => {
  const flipped = f >= 2050;
  const pop = flipped ? smooth((f - 2050) / 9) : 0;
  const z = 1.01 + smooth((f - C.s15) / (C.s16 - C.s15)) * 0.08;
  const fl = 0.95 + Math.sin(f / 7) * 0.03 + Math.sin(f / 23) * 0.02;
  const halo = flipped ? 0.74 : 0.5;
  const wipe = Math.max(0, 1 - Math.abs(f - 2050) / 6);
  return (
    <AbsoluteFill style={{background: '#02050A', overflow: 'hidden'}}>
      {/* the dead lab behind it */}
      <div style={{position: 'absolute', inset: -70, filter: 'blur(34px) brightness(0.34)', transform: 'scale(1.14)'}}>
        <LabWall f={f} power={0.18} dead={1} />
      </div>
      <AbsoluteFill style={{background: 'radial-gradient(900px 900px at 50% 42%, rgba(44,80,104,0.32), transparent 74%)'}} />
      <div style={{position: 'absolute', inset: 0, transform: `scale(${z})`, transformOrigin: '50% 44%'}}>
        {/* wall panelling behind the display */}
        <div style={{position: 'absolute', left: 62, top: 540, width: 956, height: 700, borderTop: '1px solid rgba(140,184,212,0.1)', background: 'linear-gradient(180deg, rgba(14,24,32,0.42), rgba(4,9,13,0.2) 58%, transparent)'}} />
        <div style={{position: 'absolute', left: 62, top: 700, width: 956, height: 1, background: 'rgba(140,184,212,0.06)'}} />
        <div style={{position: 'absolute', left: 62, top: 1032, width: 956, height: 1, background: 'rgba(140,184,212,0.06)'}} />

        {/* the wall display */}
        <div style={{position: 'absolute', left: 108, top: 610, width: 864, height: 520, borderRadius: 20, background: 'linear-gradient(160deg,#171F26,#080C10 54%,#03060A)', border: '1px solid rgba(160,196,220,0.18)', boxShadow: '0 40px 110px rgba(0,0,0,0.9), 0 0 120px rgba(74,136,170,0.14)'}}>
          <div style={{position: 'absolute', inset: 22, borderRadius: 12, background: 'linear-gradient(178deg,#04121A 0%,#020A0F 52%,#010508 100%)', overflow: 'hidden', boxShadow: 'inset 0 0 90px rgba(0,0,0,0.8)'}}>
            <div style={{position: 'absolute', left: -80, right: -80, top: -100, height: 380, background: `radial-gradient(closest-side, rgba(112,186,216,${0.24 * halo}), transparent 72%)`}} />
            {/* digits — one state at a time, hard cut */}
            <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', filter: `brightness(${fl})`}}>
              {flipped ? (
                <div style={{display: 'flex', alignItems: 'baseline', transform: `scale(${0.95 + pop * 0.05})`, opacity: 0.55 + pop * 0.45}}>
                  <span style={{fontFamily: MONO, fontWeight: 200, fontSize: 168, letterSpacing: '0.02em', color: 'rgba(240,249,253,0.98)', textShadow: `0 0 ${44 + pop * 18}px rgba(134,208,238,${0.44 + pop * 0.16})`, lineHeight: 1, whiteSpace: 'nowrap'}}>12:00</span>
                  <span style={{fontFamily: MONO, fontWeight: 300, fontSize: 62, letterSpacing: '0.1em', color: 'rgba(230,246,252,0.92)', marginLeft: 20, textShadow: '0 0 26px rgba(124,196,228,0.42)'}}>AM</span>
                </div>
              ) : (
                <span style={{fontFamily: MONO, fontWeight: 200, fontSize: 172, letterSpacing: '0.03em', color: 'rgba(226,244,250,0.96)', textShadow: '0 0 34px rgba(124,196,228,0.4)', lineHeight: 1, whiteSpace: 'nowrap'}}>11:59</span>
              )}
            </div>
            {/* the moment of change: a hard horizontal tear, no double exposure */}
            <div style={{position: 'absolute', left: 0, right: 0, top: '42%', height: 120, background: 'linear-gradient(180deg,transparent,rgba(224,246,252,0.46),transparent)', opacity: wipe, mixBlendMode: 'screen'}} />
            <div style={{position: 'absolute', inset: 0, background: `rgba(190,232,248,${0.14 * wipe})`, mixBlendMode: 'screen'}} />
            <div style={{position: 'absolute', left: 0, right: 0, top: ((f * 3.2) % 520) - 40, height: 70, background: 'linear-gradient(180deg,transparent,rgba(190,224,240,0.05),transparent)'}} />
            <Scanlines opacity={0.18} />
            <ScreenGlass strength={0.7} />
          </div>
          {/* mounting screws */}
          {[[16, 16], [838, 16], [16, 494], [838, 494]].map(([x, y], i) => (
            <div key={i} style={{position: 'absolute', left: x, top: y, width: 10, height: 10, borderRadius: '50%', background: 'linear-gradient(150deg,#3A444E,#12181E)', boxShadow: 'inset 0 1px 0 rgba(180,206,224,0.2)'}} />
          ))}
        </div>
        {/* the clock's light on the floor */}
        <div style={{position: 'absolute', left: 110, top: 1120, width: 860, height: 660, background: `linear-gradient(180deg, rgba(112,186,216,${0.16 * halo}), transparent 80%)`, filter: 'blur(30px)', mixBlendMode: 'screen'}} />
        {/* cables from the wall display */}
        <path d="M 150 1128 C 146 1240 190 1290 260 1320" stroke="rgba(6,10,14,0.96)" strokeWidth={14} fill="none" />
        <path d="M 930 1120 C 938 1230 900 1290 830 1326" stroke="rgba(6,10,14,0.96)" strokeWidth={12} fill="none" />

        {/* Noah in the foreground left, watching the change */}
        <div style={{position: 'absolute', left: -246, bottom: -428, width: 636, height: 1044, filter: 'blur(3px) brightness(0.44) contrast(1.06)'}}>
          <NoahBack rim={1.2} />
        </div>
        {/* rim from the display on his hair and shoulder */}
        <div style={{position: 'absolute', left: -30, bottom: 340, width: 360, height: 720, background: `radial-gradient(closest-side at 62% 40%, rgba(126,194,226,${0.1 + halo * 0.14}), transparent 76%)`, mixBlendMode: 'screen', filter: 'blur(18px)'}} />

        {/* foreground console: gives the lower frame weight */}
        <div style={{position: 'absolute', left: -80, top: 1574, width: 1240, height: 460, background: 'linear-gradient(180deg,#0D151C 0%,#080E14 40%,#020406 100%)'}} />
        <div style={{position: 'absolute', left: -80, top: 1572, width: 1240, height: 3, background: 'rgba(164,206,232,0.2)', boxShadow: '0 0 30px rgba(110,174,206,0.18)'}} />
        <div style={{position: 'absolute', left: -80, top: 1586, width: 1240, height: 220, background: 'linear-gradient(180deg, rgba(104,166,200,0.1), transparent 86%)', filter: 'blur(16px)'}} />
        <div style={{position: 'absolute', left: 420, top: 1740, width: 560, height: 130, borderRadius: 6, background: 'linear-gradient(180deg,#111821,#070B10)', border: '1px solid rgba(130,172,200,0.1)', transform: 'rotate(-1.6deg)'}}>
          <div style={{position: 'absolute', left: 16, right: 16, top: 12, bottom: 12, background: 'repeating-linear-gradient(90deg, rgba(150,190,215,0.06) 0 38px, transparent 38px 47px), repeating-linear-gradient(0deg, rgba(150,190,215,0.045) 0 14px, transparent 14px 24px)', borderRadius: 3}} />
        </div>
        <div style={{position: 'absolute', left: 96, top: 1640, width: 104, height: 118, borderRadius: '12px 12px 20px 20px', background: 'linear-gradient(160deg,#232A31,#0C1116 62%,#05080C)', boxShadow: '0 20px 40px rgba(0,0,0,0.7)'}}>
          <div style={{position: 'absolute', left: -24, top: 30, width: 36, height: 52, borderRadius: '50%', border: '8px solid #151C23', borderRightColor: 'transparent'}} />
          <div style={{position: 'absolute', left: 10, top: 8, right: 10, height: 12, borderRadius: '50%', background: 'rgba(160,204,230,0.1)'}} />
        </div>
      </div>
      <AbsoluteFill style={{background: 'radial-gradient(1000px 1200px at 50% 44%, transparent 42%, rgba(0,0,0,0.72) 100%)'}} />
      <Grain f={f} opacity={0.08} />
    </AbsoluteFill>
  );
};

const AmaraRestart: React.FC<{f: number}> = ({f}) => {
  const boot = smooth((f - (C.s16 + 6)) / 42);
  const z = 1.02 + smooth((f - C.s16) / (C.s17 - C.s16)) * 0.07;
  const shift = smooth((f - (C.s16 + 54)) / 26);
  const flick = boot * (0.86 + Math.sin(f / 3.2) * 0.06 + Math.sin(f / 8.4) * 0.04);
  return (
    <AbsoluteFill style={{background: '#02050A', overflow: 'hidden'}}>
      <AbsoluteFill style={{background: 'radial-gradient(900px 760px at 54% 26%, rgba(38,82,112,0.34), transparent 72%), linear-gradient(180deg,#04070C,#020407)'}} />
      <Cam z={z} ox="52%" oy="40%" x={-10 + shift * 22}>
        <ControlWall f={f} on={0.9} boot={boot} />
        <ControlDesk f={f} glow={0.5 + boot * 0.7} phone={0} />

        {/* the chair, read from behind: backrest, headrest, pedestal */}
        <div style={{position: 'absolute', left: 176, top: 1064, width: 728, height: 600}}>
          <div style={{position: 'absolute', left: 0, top: 62, right: 0, bottom: 92, borderRadius: '62px 62px 34px 34px', background: 'linear-gradient(172deg,#0D141B,#070C12 46%,#03060A)', boxShadow: '0 24px 60px rgba(0,0,0,0.85)'}} />
          <div style={{position: 'absolute', left: 0, top: 62, right: 0, height: 2, borderRadius: 1, background: 'rgba(130,172,198,0.14)'}} />
          <div style={{position: 'absolute', left: 22, top: 70, bottom: 100, width: 2, borderRadius: 1, background: 'rgba(120,164,192,0.07)'}} />
          <div style={{position: 'absolute', right: 22, top: 70, bottom: 100, width: 2, borderRadius: 1, background: 'rgba(120,164,192,0.06)'}} />
          <div style={{position: 'absolute', left: 160, top: 0, right: 160, height: 94, borderRadius: '40px 40px 8px 8px', background: 'linear-gradient(172deg,#131B23,#080D13 54%,#04080C)'}} />
          <div style={{position: 'absolute', left: 168, top: 0, right: 168, height: 2, borderRadius: 1, background: 'rgba(134,176,202,0.12)'}} />
          <div style={{position: 'absolute', left: 34, top: 288, width: 104, height: 18, borderRadius: 9, background: 'linear-gradient(180deg,#0F161D,#060B10)'}} />
          <div style={{position: 'absolute', right: 34, top: 288, width: 104, height: 18, borderRadius: 9, background: 'linear-gradient(180deg,#0F161D,#060B10)'}} />
          <div style={{position: 'absolute', left: '50%', bottom: 34, width: 124, height: 22, marginLeft: -62, borderRadius: 11, background: 'linear-gradient(180deg,#0C1219,#05090E)'}} />
          <div style={{position: 'absolute', left: '50%', bottom: 0, width: 320, height: 20, marginLeft: -160, borderRadius: '50%', background: 'rgba(0,0,0,0.72)', filter: 'blur(9px)'}} />
        </div>

        {/* Amara seated, back to us, in the same chair as Parts 4–5 */}
        <div style={{position: 'absolute', left: 356, bottom: -188, width: 512, height: 1280, filter: 'brightness(0.88) saturate(1.04)', transform: `rotate(${shift * 1.6}deg)`, transformOrigin: '50% 100%'}}>
          <AmaraBack rim={1.55} viewBox="20 20 260 660" preserve="xMidYMax slice" />
        </div>

        {/* the reboot's light climbing her shoulder and the chair edge */}
        <div style={{position: 'absolute', left: 300, bottom: 300, width: 520, height: 860, background: `linear-gradient(94deg, rgba(118,188,222,${0.1 + boot * 0.2}), transparent 74%)`, filter: 'blur(20px)', mixBlendMode: 'screen'}} />
        <div style={{position: 'absolute', left: 0, right: 0, top: 880, height: 420, background: `radial-gradient(ellipse at 50% 0%, rgba(96,156,190,${0.14 * flick}), transparent 72%)`, filter: 'blur(28px)'}} />
        {/* screen flicker raking the wall */}
        <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 620, background: `rgba(120,190,224,${0.03 * flick})`, mixBlendMode: 'screen'}} />
      </Cam>
      {/* desk edge, near */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 1664, height: 320, background: 'linear-gradient(180deg, rgba(4,8,12,0), rgba(2,4,6,0.92) 38%, #010203 100%)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 1666, height: 1, background: 'rgba(150,194,220,0.08)'}} />
      <AbsoluteFill style={{background: 'radial-gradient(1200px 1100px at 50% 40%, transparent 42%, rgba(0,0,0,0.62) 100%)'}} />
      <Grain f={f} opacity={0.08} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* shot 17 — SUBJECT 002                                               */
/* ------------------------------------------------------------------ */

const Subject002: React.FC<{f: number}> = ({f}) => {
  const boot = smooth((f - (C.s17 + 4)) / 20);
  const reveal = smooth((f - (C.s17 + 31)) / 14);
  const z = 1.01 + smooth((f - C.s17) / (C.s18 - C.s17)) * 0.05;
  const drift = Math.sin(f / 40) * 3;
  return (
    <AbsoluteFill style={{background: '#02050A', overflow: 'hidden'}}>
      <AbsoluteFill style={{background: 'radial-gradient(900px 900px at 50% 44%, rgba(34,80,110,0.36), transparent 74%)'}} />
      {/* the room falls away behind the screen */}
      <div style={{position: 'absolute', inset: -50, filter: 'blur(36px) brightness(0.4)', transform: 'scale(1.14)'}}>
        <ControlWall f={f} on={0.4} boot={1} />
      </div>
      <div style={{position: 'absolute', inset: 0, transform: `scale(${z})`, transformOrigin: '50% 44%'}}>
        <div style={{position: 'absolute', left: 62, top: 274, width: 956, height: 1352, borderRadius: 18, background: 'linear-gradient(160deg,#151C23,#070B10 54%,#03060A)', border: '1px solid rgba(156,194,218,0.18)', boxShadow: '0 44px 120px rgba(0,0,0,0.9), 0 0 130px rgba(74,140,176,0.16)'}}>
          <div style={{position: 'absolute', inset: 20, borderRadius: 10, background: 'linear-gradient(178deg,#04121A 0%,#020A0F 52%,#010508 100%)', overflow: 'hidden', opacity: 0.2 + boot * 0.8}}>
            <div style={{position: 'absolute', left: -120, right: -120, top: -160, height: 760, background: 'radial-gradient(closest-side, rgba(104,178,212,0.2), transparent 72%)'}} />
            {/* minimal interface: one thin rule, one message */}
            <div style={{position: 'absolute', left: 84, right: 84, top: 512, height: 1, background: 'rgba(158,204,230,0.22)', transform: `scaleX(${reveal})`, transformOrigin: '50% 50%'}} />
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 586 + drift,
                textAlign: 'center',
                fontFamily: MONO,
                fontWeight: 300,
                fontSize: 118,
                letterSpacing: '0.1em',
                color: 'rgba(234,246,250,0.96)',
                textShadow: '0 0 40px rgba(124,196,228,0.34)',
                clipPath: `inset(0 ${100 - reveal * 100}% 0 0)`,
                whiteSpace: 'nowrap',
              }}
            >
              SUBJECT 002
            </div>
            <div style={{position: 'absolute', left: 84, right: 84, top: 764, height: 1, background: 'rgba(158,204,230,0.16)', transform: `scaleX(${reveal})`, transformOrigin: '50% 50%'}} />
            {/* the cursor at the reveal edge, then gone */}
            <div style={{position: 'absolute', left: 76 + reveal * 762, top: 604, width: 10, height: 86, background: `rgba(214,240,250,${reveal < 0.99 ? 0.5 : 0})`, filter: 'blur(1px)'}} />
            {/* corner registration marks, no words */}
            {[[34, 34, 'left', 'top'], [922, 34, 'right', 'top'], [34, 1318, 'left', 'bottom'], [922, 1318, 'right', 'bottom']].map(([x, y], i) => (
              <div key={i} style={{position: 'absolute', left: x as number, top: y as number, width: 26, height: 26, borderLeft: i % 2 === 0 ? '1px solid rgba(170,212,236,0.24)' : 'none', borderRight: i % 2 === 1 ? '1px solid rgba(170,212,236,0.24)' : 'none', borderTop: i < 2 ? '1px solid rgba(170,212,236,0.24)' : 'none', borderBottom: i >= 2 ? '1px solid rgba(170,212,236,0.24)' : 'none'}} />
            ))}
            <div style={{position: 'absolute', left: 44, top: 560, width: 6, height: 6, borderRadius: '50%', background: `rgba(150,218,242,${0.4 + Math.sin(f / 9) * 0.16})`, boxShadow: '0 0 18px rgba(120,190,225,0.5)'}} />
            <Scanlines opacity={0.2} />
            <ScreenGlass strength={0.8} />
          </div>
        </div>
        {/* light spilling onto the desk in front */}
        <div style={{position: 'absolute', left: 20, top: 1480, width: 1040, height: 480, background: 'radial-gradient(closest-side, rgba(96,162,198,0.18), transparent 76%)', filter: 'blur(28px)', mixBlendMode: 'screen'}} />
      </div>
      <AbsoluteFill style={{background: 'radial-gradient(1100px 1200px at 50% 44%, transparent 38%, rgba(0,0,0,0.76) 100%)'}} />
      <Grain f={f} opacity={0.07} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* shot 18 — her phone vibrates on the desk                            */
/* ------------------------------------------------------------------ */

const PhoneVibrate: React.FC<{f: number}> = ({f}) => {
  const buzz = Math.sin(f * 2.6) * 3 + Math.sin(f * 5.1) * 1.2;
  const awake = smooth((f - (C.s18 + 26)) / 18);
  const z = 1.02 + smooth((f - C.s18) / (C.s19 - C.s18)) * 0.05;
  return (
    <AbsoluteFill style={{background: '#03060A', overflow: 'hidden'}}>
      <AbsoluteFill style={{background: 'radial-gradient(900px 900px at 46% 40%, rgba(44,96,126,0.54), transparent 74%)'}} />
      {/* monitor light raking across the desk */}
      <div style={{position: 'absolute', left: -200, top: 240, width: 760, height: 1240, background: 'linear-gradient(100deg, rgba(100,172,210,0.24), transparent 74%)', filter: 'blur(34px)', mixBlendMode: 'screen'}} />
      {/* desk surface */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 1080, height: 840, background: 'linear-gradient(180deg,#0B1219 0%,#070C12 46%,#030507 100%)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 1078, height: 2, background: 'rgba(150,194,220,0.12)'}} />
      <div style={{position: 'absolute', inset: 0, transform: `scale(${z})`, transformOrigin: '50% 46%'}}>
        {/* vibration rings in the desk finish */}
        {[0, 1, 2].map((i) => {
          const p = ((f - C.s18) / 24 + i / 3) % 1;
          return (
            <div key={i} style={{position: 'absolute', left: '50%', top: 1420, width: 380 + p * 520, height: 90 + p * 120, marginLeft: -(190 + p * 260), marginTop: -(45 + p * 60), borderRadius: '50%', border: `1px solid rgba(140,200,228,${0.16 * (1 - p)})`, filter: 'blur(1px)'}} />
          );
        })}
        <div style={{position: 'absolute', left: '50%', top: 520, width: 560, height: 1060, marginLeft: -280, transform: `perspective(1500px) rotateX(34deg) rotateZ(-9deg) translate(${buzz}px, ${Math.abs(buzz) * 0.2}px)`}}>
          <PhoneSlab style={{left: 0, top: 0, width: 520, height: 1000, borderRadius: 70}} rotate={0} glow={0.55 + awake * 0.9}>
            <div style={{position: 'absolute', inset: 0, background: `linear-gradient(178deg, rgba(30,60,80,${0.44 + awake * 0.5}) 0%, rgba(8,16,23,1) 46%, #04080C 100%)`}} />
            <div style={{position: 'absolute', inset: 0, background: `radial-gradient(closest-side at 50% 30%, rgba(130,198,232,${0.14 + awake * 0.2}), transparent 72%)`}} />
            <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 4, background: `rgba(180,226,246,${0.2 + awake * 0.5})`}} />
            {/* notification light, no words yet */}
            <div style={{position: 'absolute', left: 44, right: 44, top: 92, height: 190, borderRadius: 26, background: `linear-gradient(160deg, rgba(82,116,142,${0.34 + awake * 0.5}), rgba(24,38,52,${0.34 + awake * 0.4}))`, border: `1px solid rgba(180,218,240,${0.16 + awake * 0.2})`, opacity: 0.42 + awake * 0.58, boxShadow: `0 0 ${44 + awake * 34}px rgba(110,180,214,${0.14 + awake * 0.18})`}}>
              <div style={{position: 'absolute', left: 28, top: 34, width: 42, height: 42, borderRadius: '50%', background: 'rgba(150,206,234,0.26)'}} />
              <div style={{position: 'absolute', left: 92, top: 44, width: 220, height: 8, borderRadius: 4, background: 'rgba(206,232,246,0.24)'}} />
              <div style={{position: 'absolute', left: 92, top: 70, width: 160, height: 6, borderRadius: 3, background: 'rgba(206,232,246,0.14)'}} />
            </div>
            <div style={{position: 'absolute', left: 0, right: 0, bottom: 60, textAlign: 'center'}}>
              <div style={{width: 10, height: 10, borderRadius: '50%', margin: '0 auto', background: `rgba(180,222,244,${0.2 + awake * 0.4})`, boxShadow: '0 0 20px rgba(120,190,225,0.4)'}} />
            </div>
            <ScreenGlass strength={0.7} />
          </PhoneSlab>
          {/* screen bloom behind the handset */}
          <div style={{position: 'absolute', left: -90, top: -70, width: 700, height: 900, background: `radial-gradient(closest-side, rgba(126,196,232,${0.1 + awake * 0.16}), transparent 74%)`, mixBlendMode: 'screen', filter: 'blur(22px)'}} />
          {/* contact shadow */}
          <div style={{position: 'absolute', left: -20, top: 760, width: 560, height: 220, background: 'radial-gradient(closest-side, rgba(0,0,0,0.7), transparent 74%)', filter: 'blur(18px)'}} />
        </div>
      </div>
      <AbsoluteFill style={{background: 'radial-gradient(1000px 1100px at 50% 46%, transparent 40%, rgba(0,0,0,0.66) 100%)'}} />
      <Grain f={f} opacity={0.07} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* shot 19 — DON'T TRUST NOAH.                                         */
/* ------------------------------------------------------------------ */

const PhoneWarning: React.FC<{f: number}> = ({f}) => {
  const show = smooth((f - (C.s19 + 10)) / 12);
  const z = 1.01 + smooth((f - C.s19) / 40) * 0.04;
  return (
    <AbsoluteFill style={{background: '#03060A', overflow: 'hidden'}}>
      <AbsoluteFill style={{background: 'radial-gradient(800px 900px at 50% 46%, rgba(44,88,118,0.52), transparent 72%)'}} />
      <div style={{position: 'absolute', inset: 0, transform: `scale(${z})`, transformOrigin: '50% 50%'}}>
        {/* her fingers at the frame edge */}
        <div style={{position: 'absolute', left: -70, top: 1170, width: 300, height: 620, background: 'linear-gradient(120deg,#05070B,#0A0E13)', borderRadius: '90px 40px 40px 90px', transform: 'rotate(-8deg)'}} />
        <div style={{position: 'absolute', right: -90, top: 1240, width: 320, height: 640, background: 'linear-gradient(240deg,#05070B,#090D12)', borderRadius: '40px 90px 90px 40px', transform: 'rotate(7deg)'}} />
        <div style={{position: 'absolute', left: '50%', top: '50%', width: 684, height: 1350, marginLeft: -342, marginTop: -675, borderRadius: 92, background: 'linear-gradient(160deg,#1A2028,#06080C 46%,#04060A)', boxShadow: '0 50px 140px rgba(0,0,0,0.9), 0 0 110px rgba(86,146,190,0.24)', transform: 'rotate(-1.4deg)'}}>
          <div style={{position: 'absolute', inset: 12, borderRadius: 80, background: '#04060A', overflow: 'hidden'}}>
            <div style={{position: 'absolute', inset: 8, borderRadius: 72, background: 'linear-gradient(178deg,#152836 0%,#09131C 46%,#05080D 100%)', overflow: 'hidden'}}>
              <div style={{position: 'absolute', left: -100, top: -140, width: 900, height: 900, background: 'radial-gradient(closest-side, rgba(96,158,200,0.24), transparent 70%)'}} />
              <PhoneStatus dim={0.5} />
              {/* the message */}
              <div
                style={{
                  position: 'absolute',
                  left: 50,
                  right: 54,
                  top: 560,
                  padding: '52px 42px',
                  borderRadius: '10px 42px 42px 42px',
                  background: 'linear-gradient(160deg, rgba(42,58,74,0.98), rgba(16,24,32,0.99))',
                  border: '1px solid rgba(162,202,228,0.24)',
                  boxShadow: '0 22px 64px rgba(0,0,0,0.62)',
                  opacity: show,
                  transform: `translateY(${(1 - show) * 24}px)`,
                }}
              >
                <div style={{fontFamily: SANS, fontWeight: 500, fontSize: 68, lineHeight: 1.22, letterSpacing: '0.005em', color: '#F6F3ED'}}>
                  DON&apos;T TRUST
                  <br />
                  NOAH.
                </div>
              </div>
              <div style={{position: 'absolute', left: 50, bottom: 128, width: 120, height: 3, borderRadius: 2, background: `rgba(206,232,246,${0.16 * show})`}} />
              <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(118deg, rgba(255,255,255,0.09) 0%, transparent 34%, transparent 68%, rgba(160,200,230,0.06) 100%)'}} />
              <Scanlines opacity={0.1} />
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

const AmaraEye: React.FC<{f: number}> = ({f}) => {
  const z = 1.01 + smooth((f - 2462) / 27) * 0.05;
  const lid = Math.max(blinkLid(f, 2468), blinkLid(f, 2482) * 0.7);
  const band = 0.5 + Math.sin(f / 5) * 0.08;
  return (
    <AbsoluteFill style={{background: '#02050A', overflow: 'hidden'}}>
      <AbsoluteFill style={{background: 'radial-gradient(900px 900px at 50% 44%, rgba(52,104,134,0.34), transparent 74%)'}} />
      <div style={{position: 'absolute', inset: 0, transform: `scale(${z})`, transformOrigin: '50% 46%', filter: 'brightness(1.04) contrast(1.08)'}}>
        <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
          <Amara
            expression={lid > 0.35 ? 'guarded' : 'defiant'}
            look="camera"
            rim={1.2}
            screen={band}
            viewBox="248 110 104 185"
            preserve="xMidYMid slice"
          />
        </div>
        {/* the phone's light travelling across her eyes */}
        <div style={{position: 'absolute', left: 0, right: 0, top: 250, height: 220, background: 'linear-gradient(180deg, transparent, rgba(150,214,240,0.12), transparent)', mixBlendMode: 'screen', transform: `translateY(${Math.sin(f / 7) * 8}px)`}} />
      </div>
      {/* the rest of the room falls into darkness around the close-up */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 500, background: 'linear-gradient(180deg,#02050A,rgba(2,5,10,0.42) 62%, transparent)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 520, background: 'linear-gradient(180deg,transparent,rgba(2,5,10,0.78) 46%,#02050A 100%)'}} />
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(900px 900px at 50% 46%, transparent 34%, rgba(0,0,0,0.76) 100%)'}} />
      <Grain f={f} opacity={0.08} />
      {/* final fade, on the last word */}
      <div style={{position: 'absolute', inset: 0, background: '#000', opacity: smooth((f - 2482) / 7)}} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* the finale                                                          */
/* ------------------------------------------------------------------ */

export const Part6: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {f >= C.s1 && f < C.s2 ? <EliasWhisper f={f} /> : null}
      {f >= C.s2 && f < C.s3 ? <NoahMessage f={f} /> : null}
      {f >= C.s3 && f < C.s4 ? <DoorReveal f={f} /> : null}
      {f >= C.s4 && f < C.s5 ? <LabEntrance f={f} /> : null}
      {f >= C.s5 && f < C.s6 ? <ArchiveTriptych f={f} /> : null}
      {f >= C.s6 && f < C.s7 ? <PhoneRing f={f} /> : null}
      {f >= C.s7 && f < C.s8 ? <AmaraCall f={f} /> : null}
      {f >= C.s8 && f < C.s9 ? <CorridorWalk f={f} /> : null}
      {f >= C.s9 && f < C.s10 ? <TerminalWake f={f} /> : null}
      {f >= C.s10 && f < C.s11 ? <OriginalMessage f={f} /> : null}
      {f >= C.s11 && f < C.s12 ? <EliasTakeover f={f} /> : null}
      {f >= C.s12 && f < C.s13 ? <EliasDemand f={f} /> : null}
      {f >= C.s13 && f < C.s14 ? <SwitchPress f={f} /> : null}
      {f >= C.s14 && f < C.s15 ? <Blackout f={f} /> : null}
      {f >= C.s15 && f < C.s16 ? <ClockChange f={f} /> : null}
      {f >= C.s16 && f < C.s17 ? <AmaraRestart f={f} /> : null}
      {f >= C.s17 && f < C.s18 ? <Subject002 f={f} /> : null}
      {f >= C.s18 && f < C.s19 ? <PhoneVibrate f={f} /> : null}
      {f >= C.s19 && f < C.s20 ? (f < 2462 ? <PhoneWarning f={f} /> : <AmaraEye f={f} />) : null}
      {f < C.s20 ? <Watermark /> : null}
      <Audio src={staticFile('audio/pt6.mp3')} />
    </AbsoluteFill>
  );
};
