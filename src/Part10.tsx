import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {Noah} from './character/Noah';
import {Amara, AmaraBack} from './character/Amara';
import {DrElias} from './character/DrElias';
import {Cam, Grain, Vignette} from './Episode';
import {
  SANS,
  MONO,
  Watermark,
  Scanlines,
  ScreenGlass,
  Monitor,
  ControlWall,
  ControlDesk,
  NoahBack,
  BodyFeed,
  PhoneSlab,
  PhoneStatus,
  Archival,
  clamp01,
  smooth,
  flick,
  blinkLid,
  talk,
} from './kit';

/* ------------------------------------------------------------------ */
/* Part 10 — THE ORIGINAL SIN                                          */
/* 124.4473 s of real audio -> 3733 frames. 22 shots.                  */
/* ------------------------------------------------------------------ */

const C = {
  s1: 0,
  s2: 168,
  s3: 322,
  s4: 502,
  s5: 596,
  s6: 717,
  s7: 836,
  s8: 1034,
  s9: 1311,
  s10: 1395,
  s11: 1487,
  s12: 1669,
  s13: 1777,
  s14: 1880,
  s15: 2051,
  s16: 2206,
  s17: 2287,
  s18: 2543,
  s19: 2731,
  s20: 2935,
  s21: 3161,
  s22: 3472,
  total: 3733,
};

const FADE = 3722; // last spoken word 3718; close to black over the final beats
const CARD = 3656; // after the room is fully black: the season-two card

const Ambient: React.FC<{f: number; glow?: number; red?: number}> = ({f, glow = 1, red = 0}) => (
  <>
    <AbsoluteFill style={{background: '#02050A'}} />
    <div
      style={{
        position: 'absolute',
        inset: -140,
        background: `radial-gradient(980px 1060px at 50% 30%, rgba(${44 + red * 90},${96 - red * 20},${128 - red * 30},0.3), rgba(3,7,11,0) 74%)`,
        opacity: 0.9 + Math.sin(f / 31) * 0.03,
      }}
    />
    <div
      style={{
        position: 'absolute',
        left: -140,
        top: 620,
        width: 640,
        height: 900,
        background: `radial-gradient(closest-side, rgba(226,170,74,${0.12 * glow}), transparent 74%)`,
        filter: 'blur(46px)',
        mixBlendMode: 'screen',
      }}
    />
  </>
);

/* ------------------------------------------------------------------ */
/* the sealed chamber — the same geometry all episode                  */
/* ------------------------------------------------------------------ */

const Chamber: React.FC<{
  f: number;
  open?: number;
  power?: number;
  dead?: number;
  dust?: number;
}> = ({f, open = 0, power = 1, dead = 0, dust = 0}) => {
  const fl = flick(f, 6.2);
  const lit = Math.max(0.06, power * fl * (1 - dead));
  return (
    <>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg,#060D13 0%,#0A1721 34%,#071019 66%,#03070B 100%)',
        }}
      />
      {/* ceiling light housings */}
      {[300, 780].map((x) => (
        <div key={x} style={{position: 'absolute', left: x, top: 150, width: 96, height: 22}}>
          <div style={{position: 'absolute', inset: 0, borderRadius: 4, background: 'linear-gradient(180deg,#1B2A34,#0A1219)'}} />
          <div
            style={{
              position: 'absolute',
              left: -80,
              top: 14,
              width: 260,
              height: 620,
              background: `linear-gradient(180deg, rgba(150,200,228,${0.1 * lit}), transparent 78%)`,
              filter: 'blur(28px)',
            }}
          />
        </div>
      ))}
      {/* back wall ribs */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 240,
          height: 1240,
          background: 'repeating-linear-gradient(90deg, rgba(126,172,202,0.04) 0 3px, transparent 3px 156px)',
        }}
      />
      {/* chamber housing */}
      <div
        style={{
          position: 'absolute',
          left: 92,
          top: 300,
          width: 896,
          height: 1180,
          borderRadius: 18,
          background: 'linear-gradient(170deg,#22333F 0%,#131F28 54%,#080F15 100%)',
          boxShadow: `inset 0 0 90px rgba(0,0,0,0.9), 0 0 0 2px rgba(132,176,204,${0.1 * lit})`,
        }}
      />
      {/* interior */}
      <div
        style={{
          position: 'absolute',
          left: 132,
          top: 344,
          width: 816,
          height: 1092,
          borderRadius: 10,
          overflow: 'hidden',
          background: 'linear-gradient(180deg,#0A1720 0%,#061019 60%,#030810 100%)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(60% 50% at 50% 34%, rgba(118,178,210,${0.3 * lit}), transparent 78%)`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: 420,
            background: 'linear-gradient(180deg, transparent, rgba(140,196,224,0.06))',
          }}
        />
        {/* condensation running down the inside of the glass */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 60 + i * 122,
              top: ((f * (0.7 + i * 0.18)) % 300) - 60,
              width: 2,
              height: 120 + i * 22,
              borderRadius: 2,
              background: 'linear-gradient(180deg, transparent, rgba(206,232,246,0.18), transparent)',
            }}
          />
        ))}
      </div>
      {/* hatch leaves */}
      {[-1, 1].map((side) => (
        <div
          key={side}
          style={{
            position: 'absolute',
            left: side < 0 ? 124 : 540,
            top: 336,
            width: 408,
            height: 1108,
            transformOrigin: side < 0 ? '0% 50%' : '100% 50%',
            transform: `perspective(2000px) rotateY(${open * (side < 0 ? -1 : 1) * 74}deg)`,
            background: 'linear-gradient(100deg,#22343F 0%,#152430 46%,#0A141C 100%)',
            boxShadow: 'inset 0 0 80px rgba(0,0,0,0.8), 0 10px 40px rgba(0,0,0,0.6)',
            borderRight: side < 0 ? '1px solid rgba(150,196,224,0.12)' : 'none',
            borderLeft: side > 0 ? '1px solid rgba(150,196,224,0.12)' : 'none',
            opacity: 1 - open * 0.06,
          }}
        >
          <div style={{position: 'absolute', inset: 30, border: '1px solid rgba(140,186,214,0.08)'}} />
          <div
            style={{
              position: 'absolute',
              left: side < 0 ? undefined : 26,
              right: side < 0 ? 26 : undefined,
              top: 500,
              width: 12,
              height: 96,
              borderRadius: 6,
              background: 'linear-gradient(180deg,#55636D,#232C34)',
            }}
          />
        </div>
      ))}
      {/* the seam light, only while the hatch is closed */}
      <div
        style={{
          position: 'absolute',
          left: 536,
          top: 336,
          width: 8,
          height: 1108,
          background: `linear-gradient(180deg, transparent, rgba(196,232,250,${0.6 * lit * (1 - open)}), transparent)`,
          filter: 'blur(4px)',
        }}
      />
      {/* side console with the lock ring */}
      <div style={{position: 'absolute', left: 24, top: 760, width: 96, height: 520}}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 10,
            background: 'linear-gradient(160deg,#1D2C36,#0A1219)',
            boxShadow: 'inset 0 0 40px rgba(0,0,0,0.8)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 16,
            top: 40,
            width: 64,
            height: 64,
            borderRadius: '50%',
            border: `4px solid rgba(72,92,106,${0.5 + 0.5 * lit})`,
            boxShadow: `inset 0 0 24px rgba(0,0,0,0.8), 0 0 ${26 * lit}px rgba(120,190,226,${0.3 * lit})`,
          }}
        />
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 26,
              top: 150 + i * 90,
              width: 44,
              height: 8,
              borderRadius: 4,
              background: `rgba(${140 + i * 20},${204 - i * 30},${230 - i * 20},${0.2 + 0.4 * lit})`,
            }}
          />
        ))}
      </div>
      {/* medical monitor on a stand */}
      <div style={{position: 'absolute', left: 812, top: 640, width: 240, height: 300}}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 8,
            background: '#070C11',
            boxShadow: `inset 0 0 0 1px rgba(132,176,204,${0.16 + 0.1 * lit}), 0 0 ${40 * lit}px rgba(80,150,190,${0.2 * lit})`,
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 8,
              overflow: 'hidden',
              background: `linear-gradient(180deg, rgba(60,124,158,${0.42 * lit}), rgba(8,20,28,0.9))`,
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 40,
                height: 2,
                background: `rgba(190,232,250,${0.5 * lit})`,
                transform: `translateY(${Math.sin(f / 5) * 6}px)`,
              }}
            />
            <Scanlines opacity={0.2} />
          </div>
        </div>
        <div style={{position: 'absolute', left: 108, top: 296, width: 24, height: 120, background: 'linear-gradient(180deg,#16232C,#080F15)'}} />
      </div>
      {/* floor + dust */}
      <div
        style={{
          position: 'absolute',
          left: -80,
          right: -80,
          top: 1470,
          height: 560,
          background: 'linear-gradient(180deg,#0A141B 0%,#050A0E 54%,#020406 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 120,
          top: 1472,
          width: 840,
          height: 340,
          background: `radial-gradient(ellipse at 50% 0%, rgba(96,158,196,${0.18 * lit}), transparent 74%)`,
          filter: 'blur(32px)',
        }}
      />
      {dust > 0
        ? Array.from({length: 26}).map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 40 + ((i * 173) % 1000),
                top: 240 + ((i * 307 + f * (0.5 + (i % 5) * 0.3)) % 1500),
                width: 2 + (i % 3),
                height: 2 + (i % 3),
                borderRadius: '50%',
                background: `rgba(214,236,248,${0.13 * dust})`,
              }}
            />
          ))
        : null}
      <Vignette strength={0.93} />
      <Grain f={f} opacity={0.07} />
    </>
  );
};

/* the original body: identical rig, colder room, slower breath */
const OriginalNoah: React.FC<{
  f: number;
  expression?: 'tired' | 'neutral' | 'sad' | 'fear' | 'unease';
  look?: 'camera' | 'down' | 'left' | 'right';
  lid?: number;
  bright?: number;
  viewBox?: string;
  preserve?: string;
}> = ({
  f,
  expression = 'tired',
  look = 'down',
  lid = 0.96,
  bright = 0.92,
  viewBox = '120 20 360 700',
  preserve = 'xMidYMax meet',
}) => {
  const breath = 1 + Math.sin(f / 26) * 0.006;
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        transform: `scale(${breath})`,
        transformOrigin: '50% 70%',
        filter: `brightness(${bright}) contrast(1.04) saturate(0.94)`,
      }}
    >
      <Noah
        expression={expression}
        look={look}
        turn={-0.04}
        rim={1.35}
        lidOverride={lid}
        viewBox={viewBox}
        preserve={preserve}
      />
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* shot 01 — the chamber opens                                         */
/* ------------------------------------------------------------------ */

const ShotOpen: React.FC<{f: number}> = ({f}) => {
  const p = smooth(clamp01((f - C.s1) / C.s2));
  const unlock = smooth(clamp01((f - 24) / 54));
  const open = smooth(clamp01((f - 66) / 84));
  return (
    <AbsoluteFill style={{background: '#02050A', overflow: 'hidden'}}>
      <Cam z={1.04 + p * 0.05} ox="50%" oy="38%">
        <Chamber f={f} open={open * 0.9} power={1.05 + unlock * 0.35} />
        <div
          style={{
            position: 'absolute',
            left: 120,
            top: 300,
            width: 840,
            height: 1180,
            background: `radial-gradient(closest-side, rgba(176,226,246,${0.26 * open}), transparent 76%)`,
            filter: 'blur(38px)',
            mixBlendMode: 'screen',
          }}
        />
      </Cam>
      <Vignette strength={0.94} />
      <Grain f={f} opacity={0.075} />
      <Watermark />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* shot 02 — inside was a man                                          */
/* ------------------------------------------------------------------ */

const ShotInside: React.FC<{f: number}> = ({f}) => {
  const p = smooth(clamp01((f - C.s2) / (C.s3 - C.s2)));
  const reveal = smooth(clamp01((f - C.s2 - 10) / 46));
  return (
    <AbsoluteFill style={{background: '#02050A', overflow: 'hidden'}}>
      <Cam z={1.12 + p * 0.07} ox="50%" oy="34%">
        <Chamber f={f} open={0.92} power={1} />
        <div
          style={{
            position: 'absolute',
            left: 260,
            top: 470,
            width: 560,
            height: 1000,
            opacity: 0.35 + reveal * 0.65,
            filter: `brightness(${0.72 + reveal * 0.3})`,
          }}
        >
          <OriginalNoah f={f} expression="tired" look="down" lid={0.99} viewBox="128 26 344 700" />
        </div>
        <div
          style={{
            position: 'absolute',
            left: 180,
            top: 420,
            width: 720,
            height: 1100,
            background: `radial-gradient(closest-side, rgba(150,208,236,${0.16 * reveal}), transparent 76%)`,
            filter: 'blur(30px)',
            mixBlendMode: 'screen',
          }}
        />
      </Cam>
      <Vignette strength={0.9} />
      <Grain f={f} opacity={0.075} />
      <Watermark />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* shot 03 — the scar above his left eye                               */
/* ------------------------------------------------------------------ */

const ShotScar: React.FC<{f: number}> = ({f}) => {
  const p = smooth(clamp01((f - C.s3) / (C.s4 - C.s3)));
  const openEyes = smooth(clamp01((f - C.s3 - 40) / 34));
  const lid = 1 - openEyes * 1.0;
  const twitch = f > C.s3 + 96 && f < C.s3 + 108 ? 0.14 : 0;
  return (
    <AbsoluteFill style={{background: '#02050A', overflow: 'hidden'}}>
      <Cam z={1.02 + p * 0.06} ox="48%" oy="36%">
        <div style={{position: 'absolute', inset: 0, background: '#060C12'}} />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(64% 54% at 46% 32%, rgba(104,164,196,0.34), rgba(4,9,14,0.94) 80%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: -260,
            top: 120,
            width: 1620,
            height: 1700,
            filter: `brightness(${0.96 + twitch}) contrast(1.05)`,
          }}
        >
          <Noah
            expression="neutral"
            look="camera"
            turn={0.02}
            rim={1.4}
            lidOverride={Math.min(1, lid + twitch)}
            viewBox="206 86 198 350"
            preserve="xMidYMid slice"
          />
        </div>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(70% 60% at 50% 40%, transparent 34%, rgba(2,5,9,0.86) 100%)',
          }}
        />
      </Cam>
      <Grain f={f} opacity={0.08} />
      <Watermark />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* shot 04 — three years asleep                                        */
/* ------------------------------------------------------------------ */

const Vitals: React.FC<{f: number; dead?: number; amp?: number}> = ({f, dead = 0, amp = 1}) => {
  const pts: string[] = [];
  for (let i = 0; i <= 70; i++) {
    const x = (i / 70) * 760;
    const beat = i % 14 === 0 ? 1 : 0;
    const y = 120 - beat * 46 * amp * (1 - dead) + Math.sin(i / 6 + f / 22) * 3;
    pts.push(`${x},${y}`);
  }
  return (
    <svg width="100%" height="100%" viewBox="0 0 760 240" preserveAspectRatio="none">
      <polyline points={pts.join(' ')} fill="none" stroke="rgba(168,222,244,0.82)" strokeWidth={2.6} />
    </svg>
  );
};

const ShotSleep: React.FC<{f: number}> = ({f}) => {
  const p = smooth(clamp01((f - C.s4) / (C.s5 - C.s4)));
  const drift = smooth(clamp01((f - C.s4 - 10) / 60));
  return (
    <AbsoluteFill style={{background: '#02050A', overflow: 'hidden'}}>
      <Cam z={1.16 + p * 0.05} ox="50%" oy="44%">
        <div style={{position: 'absolute', inset: 0, background: '#050A0F'}} />
        <div style={{position: 'absolute', left: 40, top: 300, width: 1000, height: 1320}}>
          <Monitor inset={14} radius={8} style={{position: 'absolute', inset: 0}}>
            <Archival f={f} bright={1.32}>
              <div style={{position: 'absolute', inset: 0, background: '#05090E'}} />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'radial-gradient(60% 52% at 46% 38%, rgba(76,136,168,0.34), rgba(4,9,14,0.94) 80%)',
                }}
              />
              {/* the sleeper, seen from the chamber camera */}
              <div style={{position: 'absolute', left: 150, top: 220, width: 700, height: 1100, filter: 'brightness(0.8)'}}>
                <OriginalNoah f={f} expression="tired" look="down" lid={1} viewBox="116 16 368 706" />
              </div>
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 880,
                  height: 300,
                  background: 'linear-gradient(180deg, transparent, rgba(116,178,212,0.16))',
                }}
              />
              <div style={{position: 'absolute', left: 40, right: 40, bottom: 54, height: 120, opacity: 0.9}}>
                <Vitals f={f} amp={0.7} />
              </div>
            </Archival>
          </Monitor>
        </div>
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: `${40 + drift * 6}%`,
            height: 160,
            background: 'linear-gradient(180deg, transparent, rgba(170,220,244,0.06), transparent)',
          }}
        />
      </Cam>
      <Vignette strength={0.9} />
      <Grain f={f} opacity={0.085} />
      <Watermark />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* shot 05 — Amara watches the chamber feed                            */
/* ------------------------------------------------------------------ */

const DeskAmara: React.FC<{
  f: number;
  expression?: 'calm' | 'cold' | 'focus' | 'guarded' | 'soft' | 'defiant';
  look?: 'camera' | 'left' | 'right' | 'down';
  talk?: number;
  viewBox?: string;
  bright?: number;
}> = ({f, expression = 'focus', look = 'right', talk: mouth = 0, viewBox = '196 40 208 368', bright = 0.8}) => {
  const lid = blinkLid(f, 40, 7) + blinkLid(f, 140, 6);
  return (
    <div style={{position: 'absolute', inset: 0, filter: `brightness(${bright}) contrast(1.05)`}}>
      <div style={{position: 'absolute', left: 120, top: 120, width: 900, height: 1560}}>
        <Amara
          expression={expression}
          look={look}
          turn={0.24}
          rim={1.35}
          screen={0.85}
          mouth={mouth}
          lidOverride={Math.min(1, lid)}
          viewBox={viewBox}
          preserve="xMidYMid slice"
        />
      </div>
    </div>
  );
};

const ShotFeedWatch: React.FC<{f: number}> = ({f}) => {
  const p = smooth(clamp01((f - C.s5) / (C.s6 - C.s5)));
  const z = 1.03 + p * 0.06;
  const live = smooth(clamp01((f - C.s5 - 20) / 40));
  return (
    <AbsoluteFill style={{background: '#02050A', overflow: 'hidden'}}>
      <Cam z={z} ox="54%" oy="40%">
        <Ambient f={f} glow={0.5} />
        <div
          style={{
            position: 'absolute',
            left: -300,
            top: 60,
            width: 1000,
            height: 1400,
            background: 'radial-gradient(closest-side, rgba(120,188,222,0.4), transparent 78%)',
            filter: 'blur(48px)',
            mixBlendMode: 'screen',
          }}
        />
        {/* the chamber feed, left of frame, out of focus */}
        <div
          style={{
            position: 'absolute',
            left: -160,
            top: 300,
            width: 620,
            height: 900,
            filter: `blur(${7 - live * 3}px) brightness(0.72)`,
            opacity: 0.9,
          }}
        >
          <Monitor inset={10} radius={6} style={{position: 'absolute', inset: 0}}>
            <div style={{position: 'absolute', inset: 0, background: '#04090E'}}>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'radial-gradient(60% 50% at 50% 40%, rgba(96,158,190,0.4), rgba(4,9,14,0.94) 82%)',
                }}
              />
              <div style={{position: 'absolute', left: 60, top: 150, width: 500, height: 780, filter: 'brightness(0.86)'}}>
                <OriginalNoah f={f} expression="tired" look="down" lid={1} viewBox="140 30 320 680" />
              </div>
              <Scanlines opacity={0.24} />
            </div>
          </Monitor>
        </div>
        <DeskAmara f={f} expression="focus" look="left" viewBox="200 46 200 356" />
      </Cam>
      <Vignette strength={0.88} />
      <Grain f={f} opacity={0.075} />
      <Watermark />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* shot 06 — then she remembered                                       */
/* ------------------------------------------------------------------ */

const ShotRemember: React.FC<{f: number}> = ({f}) => {
  const p = smooth(clamp01((f - C.s6) / (C.s7 - C.s6)));
  const z = 1.01 + p * 0.1;
  const know = smooth(clamp01((f - C.s6 - 46) / 40));
  return (
    <AbsoluteFill style={{background: '#02050A', overflow: 'hidden'}}>
      <Cam z={z} ox="52%" oy="38%">
        <Ambient f={f} glow={0.4} />
        <div
          style={{
            position: 'absolute',
            right: -280,
            top: 80,
            width: 860,
            height: 1320,
            background: 'radial-gradient(closest-side, rgba(118,186,220,0.34), transparent 80%)',
            filter: 'blur(46px)',
            mixBlendMode: 'screen',
          }}
        />
        <DeskAmara
          f={f}
          expression={know > 0.5 ? 'guarded' : 'focus'}
          look="camera"
          viewBox="204 48 192 342"
          bright={0.92}
        />
      </Cam>
      <Vignette strength={0.86} />
      <Grain f={f} opacity={0.07} />
      <Watermark />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* shot 07 — the archive: immortality, then control                    */
/* ------------------------------------------------------------------ */

const ArchivePair: React.FC<{f: number; bright?: number}> = ({f, bright = 1}) => {
  const lid = blinkLid(f, 30, 8);
  return (
    <div style={{position: 'absolute', inset: 0, background: '#05090E'}}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(64% 54% at 46% 32%, rgba(78,138,170,0.4), rgba(4,9,14,0.94) 80%)',
        }}
      />
      <div style={{position: 'absolute', left: 10, top: 150, width: 420, height: 1100, filter: 'brightness(1.02)'}}>
        <DrElias
          expression="speak"
          look="right"
          turn={0.2}
          rim={1.05}
          screen={0.55}
          mouth={talk(f, 6, 60, 0.2, 3.1)}
          viewBox="110 24 340 660"
          preserve="xMidYMax slice"
        />
      </div>
      <div style={{position: 'absolute', right: 0, top: 220, width: 400, height: 1000, filter: 'brightness(0.92)'}}>
        <Amara
          expression="cold"
          look="left"
          turn={-0.34}
          rim={0.9}
          screen={0.5}
          lidOverride={lid}
          viewBox="120 30 360 660"
          preserve="xMidYMax slice"
        />
      </div>
      <div style={{position: 'absolute', inset: 0, filter: `brightness(${bright})`}} />
    </div>
  );
};

const ShotArchiveWall: React.FC<{f: number}> = ({f}) => {
  const p = smooth(clamp01((f - C.s7) / (C.s8 - C.s7)));
  const z = 1.14 + p * 0.05;
  return (
    <AbsoluteFill style={{background: '#02050A', overflow: 'hidden'}}>
      <Cam z={z} ox="44%" oy="32%">
        <Ambient f={f} glow={0.6} />
        <ControlWall f={f} on={0.42} boot={0.3} />
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
          }}
        >
          {Array.from({length: 6}).map((_, i) => (
            <Monitor key={i} inset={7} radius={5} style={{position: 'relative'}}>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  filter: `grayscale(0.28) contrast(1.04) brightness(${i === 2 ? 2.1 : 1.75}) saturate(0.94)`,
                }}
              >
                {i % 3 === 0 ? (
                  <ArchivePair f={f + i * 11} bright={1.5} />
                ) : i % 3 === 1 ? (
                  <BodyFeed f={f} bright={1.6} />
                ) : (
                  <div style={{position: 'absolute', inset: 0, background: '#05090E'}}>
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'radial-gradient(64% 54% at 50% 36%, rgba(70,130,162,0.36), rgba(4,9,14,0.94) 82%)',
                      }}
                    />
                    <div style={{position: 'absolute', left: -20, top: 60, width: 260, height: 460, filter: 'brightness(1.9)'}}>
                      <NoahBack rim={1.6} />
                    </div>
                    <Scanlines opacity={0.2} />
                  </div>
                )}
              </div>
              <Scanlines opacity={0.22} />
            </Monitor>
          ))}
        </div>
        <ControlDesk f={f} glow={0.4} />
      </Cam>
      <Vignette strength={0.92} />
      <Grain f={f} opacity={0.08} />
      <Watermark />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* shot 08 — every copied memory, every death                          */
/* ------------------------------------------------------------------ */

const ShotMontage: React.FC<{f: number}> = ({f}) => {
  const a = C.s8;
  const b = a + 92; // every repeated minute
  const c = a + 184; // every death
  const beat = f >= b ? (f >= c ? 2 : 1) : 0;
  const p = smooth(clamp01((f - C.s8) / (C.s9 - C.s8)));
  return (
    <AbsoluteFill style={{background: '#050A0F', overflow: 'hidden'}}>
      <Cam z={1.06 + p * 0.05} ox="50%" oy="38%">
        <div style={{position: 'absolute', left: 46, top: 210, width: 988, height: 1500}}>
          <Monitor inset={13} radius={7} style={{position: 'absolute', inset: 0}}>
            <Archival f={f} bright={1.08}>
              {beat === 0 ? (
                /* a copied memory: the room as it was */
                <div style={{position: 'absolute', inset: 0, background: '#05090E'}}>
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'radial-gradient(60% 50% at 46% 34%, rgba(84,146,178,0.38), rgba(4,9,14,0.94) 80%)',
                    }}
                  />
                  <div style={{position: 'absolute', left: 90, top: 240, width: 420, height: 1180}}>
                    <Amara
                      expression="focus"
                      look="down"
                      turn={-0.2}
                      rim={1}
                      screen={0.6}
                      viewBox="120 30 360 680"
                      preserve="xMidYMax slice"
                    />
                  </div>
                  <div style={{position: 'absolute', right: 60, top: 300, width: 400, height: 1100, filter: 'brightness(0.8)'}}>
                    <NoahBack rim={1.05} />
                  </div>
                </div>
              ) : beat === 1 ? (
                /* the same minute, recorded again */
                <div style={{position: 'absolute', inset: 0, background: '#05090E'}}>
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'radial-gradient(58% 48% at 50% 38%, rgba(96,156,188,0.32), rgba(4,9,14,0.94) 82%)',
                    }}
                  />
                  <div style={{position: 'absolute', left: 120, top: 260, width: 760, height: 1160, filter: 'brightness(0.92)'}}>
                    <Noah
                      expression="tired"
                      look="camera"
                      turn={0.04}
                      rim={1.15}
                      viewBox="170 40 260 560"
                      preserve="xMidYMax slice"
                    />
                  </div>
                  <div style={{position: 'absolute', inset: 0, background: 'rgba(150,204,232,0.04)'}} />
                </div>
              ) : (
                /* a death: the body on the floor of the chamber */
                <div style={{position: 'absolute', inset: 0, background: '#04080C'}}>
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'radial-gradient(62% 50% at 50% 46%, rgba(70,124,156,0.3), rgba(3,7,11,0.96) 82%)',
                    }}
                  />
                  <div style={{position: 'absolute', left: 40, right: 40, top: 700, height: 620, filter: 'brightness(0.82)'}}>
                    <BodyFeed f={f} bright={1.05} />
                  </div>
                  <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(60% 50% at 50% 50%, transparent 30%, rgba(2,5,9,0.8) 100%)'}} />
                </div>
              )}
            </Archival>
          </Monitor>
        </div>
        {f < b + 6 ? (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(200,236,252,0.12)',
              opacity: smooth(clamp01((f - b + 6) / 6)),
              mixBlendMode: 'screen',
            }}
          />
        ) : null}
      </Cam>
      <Vignette strength={0.9} />
      <Grain f={f} opacity={0.085} />
      <Watermark />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* shot 09 — Doctor Elias enters the chamber                           */
/* ------------------------------------------------------------------ */

const ShotEliasEnters: React.FC<{f: number}> = ({f}) => {
  const p = smooth(clamp01((f - C.s9) / (C.s10 - C.s9)));
  const step = smooth(clamp01((f - C.s9 - 6) / 40));
  return (
    <AbsoluteFill style={{background: '#02050A', overflow: 'hidden'}}>
      <Cam z={1.02 + p * 0.05} ox="52%" oy="38%">
        <Chamber f={f} open={1} power={1} />
        {/* he comes in from the corridor, blocking the chamber light */}
        <div
          style={{
            position: 'absolute',
            left: 420 - step * 80,
            top: 430,
            width: 620,
            height: 1500,
            filter: `brightness(${0.5 + step * 0.34}) contrast(1.06) drop-shadow(0 30px 60px rgba(0,0,0,0.92))`,
          }}
        >
          <DrElias
            expression="cold"
            look="right"
            turn={0.3}
            rim={1.5}
            screen={0.4}
            viewBox="96 10 400 760"
            preserve="xMidYMax meet"
          />
        </div>
        <div
          style={{
            position: 'absolute',
            left: 520,
            top: 560,
            width: 520,
            height: 1280,
            background: 'radial-gradient(closest-side, rgba(150,196,224,0.14), transparent 74%)',
            filter: 'blur(30px)',
            mixBlendMode: 'screen',
          }}
        />
      </Cam>
      <Vignette strength={0.94} />
      <Grain f={f} opacity={0.075} />
      <Watermark />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* shot 10 — you were never supposed to find him                       */
/* ------------------------------------------------------------------ */

const ShotEliasThreat: React.FC<{f: number}> = ({f}) => {
  const p = smooth(clamp01((f - C.s10) / (C.s11 - C.s10)));
  const z = 1.02 + p * 0.09;
  const lid = blinkLid(f, 30, 8);
  return (
    <AbsoluteFill style={{background: '#02050A', overflow: 'hidden'}}>
      <Cam z={z} ox="48%" oy="34%">
        <Ambient f={f} glow={0.3} />
        <div style={{position: 'absolute', left: 150, top: 120, width: 900, height: 1640, filter: 'brightness(0.94) contrast(1.06)'}}>
          <DrElias
            expression="stare"
            look="camera"
            turn={0.04}
            rim={1.4}
            screen={0.3}
            lidOverride={lid}
            mouth={talk(f, C.s10 + 6, C.s11 - 10, 0.26, 3)}
            viewBox="140 40 300 534"
            preserve="xMidYMid slice"
          />
        </div>
      </Cam>
      <Vignette strength={0.9} />
      <Grain f={f} opacity={0.07} />
      <Watermark />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* shot 11 — Noah watches the original body                            */
/* ------------------------------------------------------------------ */

const ShotUnderstand: React.FC<{f: number}> = ({f}) => {
  const p = smooth(clamp01((f - C.s11) / (C.s12 - C.s11)));
  const z = 1.03 + p * 0.06;
  return (
    <AbsoluteFill style={{background: '#02050A', overflow: 'hidden'}}>
      <Cam z={z} ox="46%" oy="36%">
        <Ambient f={f} glow={0.4} />
        {/* the live feed of the chamber: his own face, asleep */}
        <div style={{position: 'absolute', left: 500, top: 200, width: 560, height: 1000, boxShadow: '0 0 110px rgba(70,138,174,0.34)'}}>
          <Monitor inset={11} radius={6} style={{position: 'absolute', inset: 0}}>
            <div style={{position: 'absolute', inset: 0, background: '#04090E'}}>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'radial-gradient(60% 50% at 50% 36%, rgba(96,158,190,0.42), rgba(4,9,14,0.94) 82%)',
                }}
              />
              <div style={{position: 'absolute', left: 30, top: 130, width: 500, height: 830, filter: 'brightness(0.94)'}}>
                <OriginalNoah f={f} expression="tired" look="down" lid={1} viewBox="150 40 300 640" />
              </div>
              <Scanlines opacity={0.24} />
              <ScreenGlass strength={0.7} />
            </div>
          </Monitor>
        </div>
        {/* present-day Noah, foreground left, watching it */}
        <div
          style={{
            position: 'absolute',
            left: -120,
            top: 420,
            width: 700,
            height: 1560,
            filter: 'brightness(0.78) contrast(1.05) blur(0.4px)',
          }}
        >
          <NoahBack rim={1.45} />
        </div>
        <div
          style={{
            position: 'absolute',
            left: 20,
            top: 380,
            width: 560,
            height: 1400,
            background: 'radial-gradient(closest-side, rgba(146,196,224,0.2), transparent 76%)',
            filter: 'blur(34px)',
            mixBlendMode: 'screen',
          }}
        />
      </Cam>
      <Vignette strength={0.9} />
      <Grain f={f} opacity={0.078} />
      <Watermark />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* shot 12 — the mind inside it was no longer his                      */
/* ------------------------------------------------------------------ */

const ShotNotHis: React.FC<{f: number}> = ({f}) => {
  const p = smooth(clamp01((f - C.s12) / (C.s13 - C.s12)));
  const ghost = smooth(clamp01((f - C.s12 - 24) / 46));
  return (
    <AbsoluteFill style={{background: '#02050A', overflow: 'hidden'}}>
      <Cam z={1.1 + p * 0.06} ox="50%" oy="36%">
        <div style={{position: 'absolute', left: 80, top: 300, width: 920, height: 1320}}>
          <Monitor inset={13} radius={7} style={{position: 'absolute', inset: 0}}>
            <Archival f={f} bright={1.02}>
              <div style={{position: 'absolute', inset: 0, background: '#05090E'}} />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'radial-gradient(58% 48% at 50% 34%, rgba(84,146,178,0.4), rgba(4,9,14,0.94) 80%)',
                }}
              />
              <div style={{position: 'absolute', left: 60, top: 160, width: 800, height: 1080}}>
                <OriginalNoah f={f} expression="neutral" look="camera" lid={0.82} viewBox="160 40 280 520" />
              </div>
              {/* a second, fainter face over the first: not his mind */}
              <div
                style={{
                  position: 'absolute',
                  left: 60,
                  top: 160,
                  width: 800,
                  height: 1080,
                  opacity: 0.34 * ghost,
                  filter: 'blur(6px) brightness(1.2)',
                  transform: 'translateX(16px) scale(1.03)',
                  mixBlendMode: 'screen',
                }}
              >
                <Noah expression="dread" look="camera" turn={0.08} rim={1.2} viewBox="176 46 248 460" preserve="xMidYMid slice" />
              </div>
              <div style={{position: 'absolute', left: 0, right: 0, bottom: 40, height: 2, background: 'rgba(150,206,232,0.2)'}} />
            </Archival>
          </Monitor>
        </div>
      </Cam>
      <Vignette strength={0.9} />
      <Grain f={f} opacity={0.085} />
      <Watermark />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* shot 13 — she activates the protocol                                */
/* ------------------------------------------------------------------ */

const ConsoleHand: React.FC<{f: number; reach?: number; flip?: number}> = ({f, reach = 1, flip = 1}) => (
  <div
    style={{
      position: 'absolute',
      left: flip > 0 ? 120 + reach * 60 : undefined,
      right: flip > 0 ? undefined : 120 + reach * 60,
      top: 900,
      width: 420,
      height: 900,
      transform: `rotate(${flip * (16 - reach * 10)}deg)`,
      filter: 'blur(0.6px)',
    }}
  >
    <div
      style={{
        position: 'absolute',
        left: 100,
        top: 260,
        width: 230,
        height: 720,
        borderRadius: '110px 110px 26px 26px',
        background: 'linear-gradient(200deg,#22303C 0%,#0E1820 56%,#05090E 100%)',
        boxShadow: 'inset 14px 0 36px rgba(0,0,0,0.78)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        left: 108,
        top: 224,
        width: 214,
        height: 58,
        borderRadius: 18,
        background: 'linear-gradient(200deg,#2A3946,#0B131A)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        left: 118,
        top: 96,
        width: 196,
        height: 176,
        borderRadius: '46% 46% 48% 48%',
        background: 'linear-gradient(150deg,#463225 0%,#281B12 62%,#130D09 100%)',
        boxShadow: 'inset -10px -8px 26px rgba(0,0,0,0.66)',
      }}
    />
    {[0, 1, 2, 3].map((i) => (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: 128 + i * 46,
          top: 58 + Math.abs(i - 1.5) * 12,
          width: 40,
          height: 108 - Math.abs(i - 1.5) * 14,
          borderRadius: 20,
          background: 'linear-gradient(160deg,#43311F,#1D140C)',
          transform: `rotate(${(i - 1.5) * 5}deg)`,
        }}
      />
    ))}
  </div>
);

const ShotShutdown: React.FC<{f: number}> = ({f}) => {
  const p = smooth(clamp01((f - C.s13) / (C.s14 - C.s13)));
  const reach = smooth(clamp01((f - C.s13 - 10) / 44));
  const armed = smooth(clamp01((f - C.s13 - 62) / 30));
  return (
    <AbsoluteFill style={{background: '#02050A', overflow: 'hidden'}}>
      <Cam z={1.05 + p * 0.05} ox="48%" oy="46%">
        <Ambient f={f} glow={0.4} />
        {/* the desk the protocol lives on */}
        <div
          style={{
            position: 'absolute',
            left: -60,
            right: -60,
            top: 1180,
            height: 900,
            background: 'linear-gradient(180deg,#0D161D,#060B10 52%,#020406)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 90,
            top: 1200,
            width: 900,
            height: 320,
            background: 'radial-gradient(ellipse at 50% 0%, rgba(104,168,206,0.24), transparent 74%)',
            filter: 'blur(34px)',
          }}
        />
        <div style={{position: 'absolute', left: 210, top: 420, width: 660, height: 700}}>
          <Monitor inset={12} radius={7} style={{position: 'absolute', inset: 0}}>
            <div style={{position: 'absolute', inset: 0, background: '#04090E'}} />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(66% 56% at 52% 42%, rgba(92,162,198,0.62), rgba(3,8,12,0.9) 82%)',
              }}
            />
            {/* a single arming bar, no invented codes */}
            <div
              style={{
                position: 'absolute',
                left: 60,
                right: 60,
                top: 400,
                height: 6,
                borderRadius: 3,
                background: 'rgba(140,196,226,0.18)',
              }}
            >
              <div
                style={{
                  width: `${armed * 100}%`,
                  height: '100%',
                  borderRadius: 3,
                  background: 'rgba(178,226,250,0.78)',
                  boxShadow: '0 0 22px rgba(150,214,244,0.6)',
                }}
              />
            </div>
            <div
              style={{
                position: 'absolute',
                left: 60,
                right: 60,
                top: 300,
                height: 2,
                background: 'rgba(160,210,238,0.34)',
              }}
            />
            {/* three dormant rows, arming top to bottom */}
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: 60,
                  right: 60 + 180 * (1 - clamp01(armed * 3 - i)),
                  top: 176 + i * 62,
                  height: 34,
                  borderRadius: 4,
                  background: `rgba(150,206,236,${0.1 + 0.28 * clamp01(armed * 3 - i)})`,
                  boxShadow: `inset 0 0 0 1px rgba(176,222,246,${0.12 + 0.2 * clamp01(armed * 3 - i)})`,
                }}
              />
            ))}
            <Scanlines opacity={0.22} />
            <ScreenGlass strength={0.7} />
          </Monitor>
        </div>
        <ConsoleHand f={f} reach={reach + armed * 0.1} flip={1} />
      </Cam>
      <Vignette strength={0.9} />
      <Grain f={f} opacity={0.075} />
      <Watermark />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* shot 14 — every screen, the same warning                            */
/* ------------------------------------------------------------------ */

const SyncMonitor: React.FC<{f: number; i: number}> = ({f, i}) => {
  const on = smooth(clamp01((f - C.s14 - i * 7) / 14));
  return (
    <div style={{position: 'absolute', inset: 0, background: '#050A0F'}}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(70% 60% at 50% 44%, rgba(104,170,204,${0.2 + 0.3 * on}), rgba(4,9,14,0.92) 82%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '6%',
          right: '6%',
          top: '38%',
          textAlign: 'center',
          fontFamily: MONO,
          fontSize: 26,
          lineHeight: 1.5,
          letterSpacing: '0.12em',
          color: `rgba(236,248,253,${0.18 + 0.78 * on})`,
          textShadow: '0 0 20px rgba(126,196,232,0.5)',
        }}
      >
        MEMORY
        <br />
        SYNCHRONIZATION
        <br />
        INITIATED
      </div>
      <div
        style={{
          position: 'absolute',
          left: '20%',
          right: '20%',
          top: '70%',
          height: 2,
          background: `rgba(160,214,242,${0.5 * on})`,
        }}
      />
      <Scanlines opacity={0.24} />
    </div>
  );
};

const ShotEveryScreen: React.FC<{f: number}> = ({f}) => {
  const p = smooth(clamp01((f - C.s14) / (C.s15 - C.s14)));
  const z = 1.06 - p * 0.05;
  return (
    <AbsoluteFill style={{background: '#02050A', overflow: 'hidden'}}>
      <Cam z={z} ox="44%" oy="30%">
        <Ambient f={f} glow={0.8} />
        <ControlWall f={f} on={0.2} boot={0.1} />
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
          }}
        >
          {Array.from({length: 6}).map((_, i) => (
            <Monitor key={i} inset={7} radius={5} style={{position: 'relative'}}>
              <SyncMonitor f={f} i={i} />
            </Monitor>
          ))}
        </div>
        <ControlDesk f={f} glow={0.7} />
      </Cam>
      <Vignette strength={0.92} />
      <Grain f={f} opacity={0.08} />
      <Watermark />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* shot 15 — the two of them, matched                                  */
/* ------------------------------------------------------------------ */

const ShotTwoNoahs: React.FC<{f: number}> = ({f}) => {
  const t = f - C.s15;
  const second = t >= 50 && t < 104;
  const p = smooth(clamp01((f - C.s15) / (C.s16 - C.s15)));
  const lidRate = blinkLid(f, C.s15 + (second ? 22 : 34), 7);
  return (
    <AbsoluteFill style={{background: '#02050A', overflow: 'hidden'}}>
      {!second ? (
        <Cam z={1.03 + p * 0.07} ox="50%" oy="36%">
          <Ambient f={f} glow={0.4} />
          {/* present Noah, lit by a screen off frame */}
          <div
            style={{
              position: 'absolute',
              right: -300,
              top: 100,
              width: 900,
              height: 1300,
              background: 'radial-gradient(closest-side, rgba(120,188,222,0.4), transparent 78%)',
              filter: 'blur(46px)',
              mixBlendMode: 'screen',
            }}
          />
          <div style={{position: 'absolute', left: 190, top: 110, width: 840, height: 1600, filter: 'brightness(0.94) contrast(1.05)'}}>
            <Noah
              expression="unease"
              look="camera"
              turn={0.02}
              rim={1.35}
              lidOverride={lidRate}
              viewBox="196 40 208 358"
              preserve="xMidYMid slice"
            />
          </div>
        </Cam>
      ) : (
        <Cam z={1.03 + p * 0.07} ox="50%" oy="36%">
          {/* original Noah, lit by the chamber */}
          <div
            style={{
              position: 'absolute',
              left: 60,
              top: 60,
              width: 960,
              height: 1500,
              background: 'radial-gradient(closest-side, rgba(132,196,226,0.26), transparent 82%)',
              filter: 'blur(44px)',
            }}
          />
          <div style={{position: 'absolute', left: 190, top: 130, width: 840, height: 1580, filter: 'brightness(0.88) contrast(1.06) saturate(0.94)'}}>
            <Noah
              expression="sad"
              look="camera"
              turn={-0.02}
              rim={1.5}
              lidOverride={Math.min(1, lidRate + 0.06)}
              viewBox="196 40 208 358"
              preserve="xMidYMid slice"
            />
          </div>
        </Cam>
      )}
      <Vignette strength={0.88} />
      <Grain f={f} opacity={0.075} />
      <Watermark />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* shot 16 — they remembered the same life                             */
/* ------------------------------------------------------------------ */

const ShotSameLife: React.FC<{f: number}> = ({f}) => {
  const p = smooth(clamp01((f - C.s16) / (C.s17 - C.s16)));
  const flash = Math.max(
    Math.sin(clamp01((f - C.s16) / 26) * Math.PI),
    Math.sin(clamp01((f - C.s16 - 34) / 22) * Math.PI) * 0.7
  );
  return (
    <AbsoluteFill style={{background: '#04080C', overflow: 'hidden'}}>
      <Cam z={1.03 + p * 0.06} ox="50%" oy="38%">
        <div style={{position: 'absolute', inset: 0, background: '#060C12'}} />
        {/* one memory: the two of them, three years ago, overexposed */}
        <div
          style={{
            position: 'absolute',
            left: -40,
            top: 200,
            width: 1160,
            height: 1600,
            filter: `brightness(${0.6 + flash * 0.7}) contrast(0.96) blur(${2 - flash * 1.6}px)`,
            opacity: 0.9,
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(64% 54% at 50% 36%, rgba(198,226,240,0.4), rgba(6,12,18,0.9) 78%)',
            }}
          />
          <div style={{position: 'absolute', left: 40, top: 380, width: 520, height: 1200}}>
            <Amara
              expression="soft"
              look="camera"
              turn={-0.12}
              rim={1.2}
              screen={0.4}
              viewBox="150 30 300 660"
              preserve="xMidYMax slice"
            />
          </div>
          <div style={{position: 'absolute', right: 20, top: 300, width: 520, height: 1240, filter: 'brightness(0.9)'}}>
            <Noah expression="relief" look="camera" turn={0.14} rim={1.2} viewBox="150 30 300 660" preserve="xMidYMax slice" />
          </div>
        </div>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(700px 800px at 50% 40%, rgba(214,240,252,${0.22 + flash * 0.4}), transparent 72%)`,
            mixBlendMode: 'screen',
          }}
        />
      </Cam>
      <Vignette strength={0.82} />
      <Grain f={f} opacity={0.09} />
      <Watermark />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* shot 17 — alarms, and Elias locked out                              */
/* ------------------------------------------------------------------ */

const ShotLockout: React.FC<{f: number}> = ({f}) => {
  const deny = f >= C.s17 + 118;
  const p = smooth(clamp01((f - C.s17) / (C.s18 - C.s17)));
  const alarm = 0.55 + Math.sin(f / 7) * 0.45;
  const denyOn = smooth(clamp01((f - C.s17 - 126) / 12));
  return (
    <AbsoluteFill style={{background: '#02050A', overflow: 'hidden'}}>
      {!deny ? (
        <Cam z={1.04 + p * 0.05} ox="50%" oy="36%">
          <Ambient f={f} glow={0.5} red={1} />
          <Chamber f={f} open={1} power={0.9} />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `radial-gradient(760px 860px at 50% 24%, rgba(226,118,92,${0.2 * alarm}), transparent 76%)`,
              mixBlendMode: 'screen',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 190,
              top: 520,
              width: 700,
              height: 1360,
              filter: `brightness(${0.34 + alarm * 0.12}) contrast(1.06)`,
            }}
          >
            <DrElias
              expression="concern"
              look="right"
              turn={0.42}
              rim={1.5}
              screen={0.3}
              viewBox="150 20 300 640"
              preserve="xMidYMax slice"
            />
          </div>
          {/* the console he is reaching for, and his arm coming in from the edge */}
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: 1180,
              width: 420,
              height: 300,
              background: 'linear-gradient(180deg,#16232C,#080F15)',
              boxShadow: 'inset 0 0 40px rgba(0,0,0,0.8), 0 -1px 0 rgba(160,204,232,0.18)',
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: 40,
                top: 60,
                width: 300,
                height: 10,
                borderRadius: 5,
                background: `rgba(226,118,92,${0.28 + alarm * 0.3})`,
                boxShadow: `0 0 ${24 + alarm * 10}px rgba(226,118,92,${0.3 + alarm * 0.2})`,
              }}
            />
          </div>
          <div
            style={{
              position: 'absolute',
              right: -40,
              top: 980,
              width: 300,
              height: 620,
              transform: `rotate(${-26 + alarm * 2}deg)`,
              filter: 'brightness(0.62) blur(1.4px)',
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: 40,
                top: 120,
                width: 210,
                height: 620,
                borderRadius: '100px 100px 24px 24px',
                background: 'linear-gradient(200deg,#1B2731 0%,#0C141A 56%,#05090E 100%)',
                boxShadow: 'inset 12px 0 30px rgba(0,0,0,0.8)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 44,
                top: 20,
                width: 200,
                height: 150,
                borderRadius: '44% 44% 50% 46%',
                background: 'linear-gradient(150deg,#5A4A40 0%,#33261E 60%,#170F0B 100%)',
                boxShadow: 'inset -10px -8px 24px rgba(0,0,0,0.6)',
              }}
            />
          </div>
        </Cam>
      ) : (
        <Cam z={1.16 - p * 0.04} ox="50%" oy="46%">
          <div style={{position: 'absolute', inset: 0, background: '#04080C'}} />
          <div style={{position: 'absolute', left: 60, top: 480, width: 960, height: 960}}>
            <Monitor inset={14} radius={8} style={{position: 'absolute', inset: 0}}>
              <div style={{position: 'absolute', inset: 0, background: '#0A0708'}} />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: `radial-gradient(64% 54% at 50% 46%, rgba(198,92,72,${0.26 * denyOn}), rgba(10,4,4,0.94) 82%)`,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: '42%',
                  textAlign: 'center',
                  fontFamily: MONO,
                  fontSize: 92,
                  letterSpacing: '0.14em',
                  color: `rgba(240,196,184,${0.2 + 0.76 * denyOn})`,
                  textShadow: '0 0 44px rgba(226,118,92,0.6)',
                  opacity: denyOn,
                }}
              >
                ACCESS DENIED
              </div>
              <Scanlines opacity={0.26} />
              <ScreenGlass strength={0.7} />
            </Monitor>
          </div>
        </Cam>
      )}
      <Vignette strength={0.92} />
      <Grain f={f} opacity={0.078} />
      <Watermark />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* shot 18 — he releases every consciousness                           */
/* ------------------------------------------------------------------ */

const ShotRelease: React.FC<{f: number}> = ({f}) => {
  const p = smooth(clamp01((f - C.s18) / (C.s19 - C.s18)));
  const act = smooth(clamp01((f - C.s18 - 60) / 56));
  const lid = blinkLid(f, C.s18 + 24, 9);
  return (
    <AbsoluteFill style={{background: '#02050A', overflow: 'hidden'}}>
      <Cam z={1.02 + p * 0.07} ox="48%" oy="36%">
        <Ambient f={f} glow={0.4} />
        <div
          style={{
            position: 'absolute',
            left: 40,
            top: 180,
            width: 1000,
            height: 1240,
            opacity: 0.92,
            filter: `brightness(${0.72 + act * 0.4})`,
          }}
        >
          <ControlWall f={f} on={0.75 + act * 0.25} boot={1} />
        </div>
        <div style={{position: 'absolute', left: 150, top: 640, width: 820, height: 1320}}>
          <Noah
            expression={act > 0.4 ? 'relief' : 'sad'}
            look="camera"
            turn={0.04}
            rim={1.4}
            lidOverride={Math.min(1, lid)}
            viewBox="186 30 240 470"
            preserve="xMidYMax slice"
          />
        </div>
        <div
          style={{
            position: 'absolute',
            left: 120,
            top: 560,
            width: 860,
            height: 1300,
            background: `radial-gradient(closest-side, rgba(184,226,246,${0.14 + act * 0.18}), transparent 74%)`,
            filter: 'blur(36px)',
            mixBlendMode: 'screen',
          }}
        />
      </Cam>
      <Vignette strength={0.9} />
      <Grain f={f} opacity={0.078} />
      <Watermark />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* shot 19 — the clocks move again                                     */
/* ------------------------------------------------------------------ */

const ShotClock: React.FC<{f: number}> = ({f}) => {
  const flip = C.s19 + 96;
  const late = f >= flip;
  const p = smooth(clamp01((f - C.s19) / (C.s20 - C.s19)));
  const tick = smooth(clamp01((f - flip) / 8));
  return (
    <AbsoluteFill style={{background: '#02050A', overflow: 'hidden'}}>
      <Cam z={1.02 + p * 0.05} ox="50%" oy="44%">
        <Ambient f={f} glow={0.3} />
        <div style={{position: 'absolute', left: 90, top: 640, width: 900, height: 620}}>
          <Monitor inset={14} radius={8} style={{position: 'absolute', inset: 0}}>
            <div style={{position: 'absolute', inset: 0, background: '#04090E'}} />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(72% 62% at 50% 46%, rgba(58,120,154,0.4), rgba(3,8,12,0.94) 84%)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 190,
                textAlign: 'center',
                fontFamily: MONO,
                fontWeight: late ? 300 : 200,
                fontSize: late ? 150 : 168,
                letterSpacing: '0.03em',
                color: `rgba(240,249,253,${late ? 0.98 : 0.94})`,
                textShadow: late ? '0 0 44px rgba(158,214,238,0.7)' : '0 0 38px rgba(126,188,222,0.5)',
                transform: `scale(${1 + tick * 0.02})`,
              }}
            >
              {late ? '12:00 AM' : '11:59 PM'}
            </div>
            <Scanlines opacity={0.2} />
            <ScreenGlass strength={0.66} />
          </Monitor>
        </div>
        {/* the room behind the clock, going dark */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 1380,
            height: 560,
            background: `linear-gradient(180deg, rgba(10,20,27,${0.9 - tick * 0.6}), rgba(2,5,8,1))`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            height: 640,
            background: `linear-gradient(180deg, rgba(2,5,8,1), rgba(10,20,27,${0.5 * (1 - tick)}))`,
          }}
        />
      </Cam>
      <Vignette strength={0.9} />
      <Grain f={f} opacity={0.078} />
      <Watermark />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* shot 20 — three days later                                          */
/* ------------------------------------------------------------------ */

const ShotAbandoned: React.FC<{f: number}> = ({f}) => {
  const p = smooth(clamp01((f - C.s20) / (C.s21 - C.s20)));
  const walk = smooth(clamp01((f - C.s20 - 120) / 90));
  return (
    <AbsoluteFill style={{background: '#02050A', overflow: 'hidden'}}>
      <Cam z={1.05 + p * 0.04} ox="50%" oy="42%">
        <Chamber f={f} open={1} power={0.66} dead={0.34} dust={1} />
        <div
          style={{
            position: 'absolute',
            left: 200,
            top: 500,
            width: 680,
            height: 1200,
            background: 'radial-gradient(closest-side, rgba(96,150,182,0.1), transparent 78%)',
            filter: 'blur(40px)',
          }}
        />
        {/* the chamber is empty */}
        <div
          style={{
            position: 'absolute',
            left: 132,
            top: 344,
            width: 816,
            height: 1092,
            background: 'linear-gradient(180deg, rgba(8,18,26,0.72), rgba(3,8,14,0.94))',
            boxShadow: 'inset 0 0 120px rgba(0,0,0,0.9)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 60,
            top: 1180,
            width: 940,
            height: 480,
            background: 'radial-gradient(ellipse at 46% 10%, rgba(120,178,210,0.16), transparent 74%)',
            filter: 'blur(34px)',
          }}
        />
        {/* Amara looking into it */}
        <div
          style={{
            position: 'absolute',
            left: 560,
            top: 760,
            width: 420,
            height: 1160,
            opacity: 0.6 + walk * 0.4,
            filter: 'brightness(0.72) contrast(1.06) drop-shadow(0 26px 54px rgba(0,0,0,0.92))',
          }}
        >
          <AmaraBack rim={1.3} />
        </div>
      </Cam>
      <Vignette strength={0.96} />
      <Grain f={f} opacity={0.08} />
      <Watermark />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* shot 21 — thank you for remembering me                              */
/* ------------------------------------------------------------------ */

const ShotFinalMessage: React.FC<{f: number}> = ({f}) => {
  const p = smooth(clamp01((f - C.s21) / (C.s22 - C.s21)));
  const buzz = f < C.s21 + 22 ? Math.sin((f - C.s21) * 3) * 3 : 0;
  const line1 = smooth(clamp01((f - C.s21 - 56) / 20)); // "Thank you..."
  const line2 = smooth(clamp01((f - C.s21 - 132) / 20)); // location + name
  return (
    <AbsoluteFill style={{background: '#02050A', overflow: 'hidden'}}>
      <Cam z={1.02 + p * 0.05} ox="50%" oy="46%">
        <Ambient f={f} glow={0.35} />
        <div
          style={{
            position: 'absolute',
            left: 176,
            top: 340,
            width: 730,
            height: 1250,
            transform: `translateX(${buzz}px) rotate(${buzz * 0.3}deg)`,
          }}
        >
          <PhoneSlab style={{left: 0, top: 0, width: 730, height: 1250}} glow={1.05}>
            <div
              style={{
                position: 'absolute',
                inset: 20,
                borderRadius: 56,
                background: 'linear-gradient(180deg,#060D13,#03070B)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: -80,
                  right: -80,
                  top: -40,
                  height: 700,
                  background: 'radial-gradient(ellipse at 50% 30%, rgba(104,172,212,0.4), transparent 70%)',
                  filter: 'blur(18px)',
                }}
              />
              <PhoneStatus dim={0.3} />
              <div
                style={{
                  position: 'absolute',
                  left: 36,
                  top: 250,
                  fontFamily: SANS,
                  fontSize: 38,
                  color: 'rgba(220,236,246,0.78)',
                }}
              >
                Amara
              </div>
              <div
                style={{
                  position: 'absolute',
                  left: 36,
                  right: 36,
                  top: 320,
                  fontFamily: SANS,
                  fontSize: 56,
                  lineHeight: 1.24,
                  color: 'rgba(246,251,254,0.97)',
                  textShadow: '0 0 34px rgba(126,196,232,0.42)',
                  opacity: 0.12 + line1 * 0.88,
                  transform: `translateY(${(1 - line1) * 14}px)`,
                }}
              >
                Thank you for remembering me.
              </div>
              <div
                style={{
                  position: 'absolute',
                  left: 36,
                  right: 36,
                  top: 560,
                  height: 1,
                  background: `rgba(150,206,232,${0.12 + line2 * 0.24})`,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: 36,
                  right: 36,
                  top: 600,
                  fontFamily: MONO,
                  fontSize: 34,
                  lineHeight: 1.5,
                  letterSpacing: '0.1em',
                  color: `rgba(206,230,244,${0.16 + line2 * 0.7})`,
                  opacity: line2,
                }}
              >
                35.6812° N
                <br />
                139.7671° E
              </div>
            </div>
          </PhoneSlab>
        </div>
      </Cam>
      <Vignette strength={0.9} />
      <Grain f={f} opacity={0.075} />
      <Watermark />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* shot 22 — PROJECT EDEN                                              */
/* ------------------------------------------------------------------ */

const EdenWall: React.FC<{f: number; boot?: number}> = ({f, boot = 1}) => {
  const cols = 6;
  const rows = 5;
  return (
    <div
      style={{
        position: 'absolute',
        left: 40,
        top: 300,
        width: 1000,
        height: 1180,
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gap: 9,
      }}
    >
      {Array.from({length: cols * rows}).map((_, i) => {
        const on = clamp01(boot * 1.6 - (i % cols) * 0.05 - Math.floor(i / cols) * 0.06);
        return (
          <div
            key={i}
            style={{
              position: 'relative',
              background: '#070C11',
              borderRadius: 3,
              boxShadow: on > 0.2 ? `0 0 ${34 * on}px rgba(96,172,214,${0.46 * on})` : 'none',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 3,
                background: on > 0.3 ? 'linear-gradient(180deg, rgba(150,206,232,0.92), rgba(22,58,82,0.95))' : '#04080C',
                opacity: 0.96,
              }}
            >
              <div style={{position: 'absolute', left: 6, top: 10, right: 6, height: 2, background: `rgba(200,236,252,${0.5 * on})`}} />
              <div style={{position: 'absolute', left: 6, top: 22, width: '46%', height: 2, background: `rgba(200,236,252,${0.3 * on})`}} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

const ShotEden: React.FC<{f: number}> = ({f}) => {
  const p = smooth(clamp01((f - C.s22) / (C.total - C.s22)));
  const boot = smooth(clamp01((f - C.s22 - 60) / 90));
  const drown = smooth(clamp01((f - C.s22 - 156) / 40));
  return (
    <AbsoluteFill style={{background: '#010307', overflow: 'hidden'}}>
      <Cam z={1.03 + p * 0.05} ox="50%" oy="38%">
        <div style={{position: 'absolute', inset: 0, background: '#02050A'}} />
        <div
          style={{
            position: 'absolute',
            inset: -140,
            background: 'radial-gradient(1000px 1100px at 50% 30%, rgba(30,74,102,0.34), rgba(2,5,9,0) 76%)',
          }}
        />
        {/* cavern scale: ribs receding into the dark */}
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 40 - i * 26,
              top: 250 + i * 60,
              width: 1000 + i * 52,
              height: 1300 - i * 80,
              border: `1px solid rgba(96,140,168,${0.06 - i * 0.01})`,
              borderRadius: 14,
            }}
          />
        ))}
        <EdenWall f={f} boot={boot} />
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 1420,
            height: 560,
            background: 'linear-gradient(180deg, rgba(6,14,20,0.9), #010306)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 180,
            top: 1440,
            width: 720,
            height: 460,
            background: `radial-gradient(ellipse at 50% 0%, rgba(108,178,214,${0.22 * boot}), transparent 74%)`,
            filter: 'blur(40px)',
          }}
        />
        {/* PROJECT EDEN, cut in over the wall */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 900,
            textAlign: 'center',
            fontFamily: MONO,
            fontSize: 96,
            letterSpacing: '0.16em',
            color: `rgba(248,253,255,${0.96 * smooth(clamp01((f - C.s22 - 20) / 26))})`,
            textShadow: '0 0 46px rgba(150,212,246,0.72)',
            opacity: smooth(clamp01((f - C.s22 - 20) / 26)) * (1 - drown * 0.2),
          }}
        >
          PROJECT EDEN
        </div>
      </Cam>
      <Vignette strength={0.94} />
      <Grain f={f} opacity={0.08} />
      <div style={{position: 'absolute', inset: 0, background: '#000', opacity: drown}} />
      {/* the last thing on screen: a card in the black, no watermark */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: smooth(clamp01((f - CARD) / 16)),
          transform: `translateY(${(1 - smooth(clamp01((f - CARD) / 16))) * 10}px)`,
        }}
      >
        <div
          style={{
            fontFamily: MONO,
            fontSize: 58,
            lineHeight: 1.42,
            letterSpacing: '0.16em',
            textAlign: 'center',
            color: 'rgba(233,245,251,0.93)',
            textShadow: '0 0 42px rgba(126,196,232,0.34)',
          }}
        >
          NOAH AND AMARA
          <br />
          WILL COME BACK
        </div>
        <div
          style={{
            width: 132,
            height: 1,
            margin: '46px 0 34px',
            background: 'rgba(156,198,218,0.34)',
          }}
        />
        <div
          style={{
            fontFamily: MONO,
            fontSize: 27,
            letterSpacing: '0.42em',
            color: 'rgba(168,204,222,0.72)',
          }}
        >
          — SEASON 2
        </div>
      </div>
      {f < CARD - 16 ? <Watermark /> : null}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* composition                                                         */
/* ------------------------------------------------------------------ */

export const Part10: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Audio src={staticFile('audio/pt10.mp3')} />
      {f < C.s2 ? (
        <ShotOpen f={f} />
      ) : f < C.s3 ? (
        <ShotInside f={f} />
      ) : f < C.s4 ? (
        <ShotScar f={f} />
      ) : f < C.s5 ? (
        <ShotSleep f={f} />
      ) : f < C.s6 ? (
        <ShotFeedWatch f={f} />
      ) : f < C.s7 ? (
        <ShotRemember f={f} />
      ) : f < C.s8 ? (
        <ShotArchiveWall f={f} />
      ) : f < C.s9 ? (
        <ShotMontage f={f} />
      ) : f < C.s10 ? (
        <ShotEliasEnters f={f} />
      ) : f < C.s11 ? (
        <ShotEliasThreat f={f} />
      ) : f < C.s12 ? (
        <ShotUnderstand f={f} />
      ) : f < C.s13 ? (
        <ShotNotHis f={f} />
      ) : f < C.s14 ? (
        <ShotShutdown f={f} />
      ) : f < C.s15 ? (
        <ShotEveryScreen f={f} />
      ) : f < C.s16 ? (
        <ShotTwoNoahs f={f} />
      ) : f < C.s17 ? (
        <ShotSameLife f={f} />
      ) : f < C.s18 ? (
        <ShotLockout f={f} />
      ) : f < C.s19 ? (
        <ShotRelease f={f} />
      ) : f < C.s20 ? (
        <ShotClock f={f} />
      ) : f < C.s21 ? (
        <ShotAbandoned f={f} />
      ) : f < C.s22 ? (
        <ShotFinalMessage f={f} />
      ) : (
        <ShotEden f={f} />
      )}
    </AbsoluteFill>
  );
};
