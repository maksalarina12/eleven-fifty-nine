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
  ControlFeed,
  NoahFeed,
  PhoneSlab,
  PhoneStatus,
  ChatMessage,
  NoahBack,
  clamp01,
  smooth,
  flick,
  blinkLid,
  talk,
} from './kit';

/* ------------------------------------------------------------------ */
/* Part 7 — SUBJECT 002                                                */
/* 73.7175 s of real audio -> 2212 frames. 15 shots, cut on the words. */
/* ------------------------------------------------------------------ */

const C = {
  s1: 0,
  s2: 63,
  s3: 343,
  s4: 535,
  s5: 711,
  s6: 794,
  s7: 890,
  s8: 1034,
  s9: 1255,
  s10: 1319,
  s11: 1463,
  s12: 1563,
  s13: 1735,
  s14: 1860,
  s15: 1975,
  total: 2212,
};

const TAIL = 2204; // last spoken word ends here; black to 2212

const hit = (f: number, at: number) => smooth(clamp01((f - at) / 7));

/* ------------------------------------------------------------------ */
/* shared room pieces                                                  */
/* ------------------------------------------------------------------ */

const Ambient: React.FC<{f: number; glow?: number}> = ({f, glow = 1}) => (
  <>
    <AbsoluteFill style={{background: '#02050A'}} />
    <div
      style={{
        position: 'absolute',
        inset: -120,
        background:
          'radial-gradient(900px 1000px at 52% 30%, rgba(46,96,128,0.32), rgba(3,7,11,0) 72%)',
        opacity: 0.9 + Math.sin(f / 31) * 0.03,
      }}
    />
    <div
      style={{
        position: 'absolute',
        left: -160,
        top: 620,
        width: 620,
        height: 900,
        background: `radial-gradient(closest-side, rgba(226,170,74,${0.13 * glow}), transparent 74%)`,
        filter: 'blur(42px)',
        mixBlendMode: 'screen',
      }}
    />
  </>
);

/* the wall behind the desk: door on the right, corridor beyond */
const BackWall: React.FC<{f: number; open?: number; light?: number}> = ({
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
const Archival: React.FC<{children: React.ReactNode; f: number; bright?: number}> = ({
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
/* shot 01 — the warning on the phone                                  */
/* ------------------------------------------------------------------ */

const ShotWarning: React.FC<{f: number}> = ({f}) => {
  const p = smooth(clamp01((f - C.s1) / 62));
  const z = 1.0 + p * 0.055;
  const show = smooth(clamp01((f - 12) / 14));
  return (
    <AbsoluteFill style={{background: '#02050A', overflow: 'hidden'}}>
      <Cam z={z} ox="50%" oy="52%">
        <Ambient f={f} glow={0.5} />
        {/* desk plane */}
        <div
          style={{
            position: 'absolute',
            left: -80,
            right: -80,
            top: 980,
            height: 1000,
            background: 'linear-gradient(180deg,#0D161D 0%,#070C11 46%,#020406 100%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 150,
            top: 1010,
            width: 780,
            height: 300,
            background: 'radial-gradient(ellipse at 50% 0%, rgba(96,160,200,0.26), transparent 74%)',
            filter: 'blur(34px)',
          }}
        />
        <PhoneSlab
          style={{left: 286, top: 402, width: 508, height: 1040}}
          rotate={-2.6}
          glow={1.2}
        >
          <div
            style={{
              position: 'absolute',
              inset: 18,
              borderRadius: 52,
              background: 'linear-gradient(180deg,#071019 0%,#04080D 60%,#02050A 100%)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: -40,
                right: -40,
                top: -30,
                height: 520,
                background: 'radial-gradient(ellipse at 50% 30%, rgba(74,132,170,0.34), transparent 70%)',
                filter: 'blur(20px)',
              }}
            />
            <PhoneStatus dim={0.34} />
            <div
              style={{
                position: 'absolute',
                left: 32,
                right: 32,
                top: 168,
                height: 300,
                borderRadius: 26,
                background: 'linear-gradient(165deg, rgba(28,44,58,0.94), rgba(9,15,21,0.96))',
                border: '1px solid rgba(148,190,216,0.13)',
                boxShadow: '0 18px 48px rgba(0,0,0,0.7)',
                opacity: 0.3 + show * 0.7,
                transform: `translateY(${(1 - show) * 16}px)`,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: 26,
                  top: 26,
                  fontFamily: SANS,
                  fontSize: 24,
                  letterSpacing: '0.16em',
                  color: 'rgba(186,214,232,0.72)',
                }}
              >
                MESSAGES
              </div>
              <div
                style={{
                  position: 'absolute',
                  left: 26,
                  top: 84,
                  fontFamily: SANS,
                  fontSize: 34,
                  letterSpacing: '0.02em',
                  color: 'rgba(232,244,250,0.94)',
                }}
              >
                Amara
              </div>
              <div
                style={{
                  position: 'absolute',
                  left: 26,
                  right: 26,
                  top: 150,
                  fontFamily: SANS,
                  fontSize: 52,
                  lineHeight: 1.18,
                  letterSpacing: '-0.01em',
                  color: 'rgba(244,250,253,0.97)',
                  textShadow: '0 0 28px rgba(126,196,232,0.4)',
                }}
              >
                Don&apos;t trust Noah.
              </div>
            </div>
          </div>
        </PhoneSlab>
        <div
          style={{
            position: 'absolute',
            left: 250,
            top: 1470,
            width: 600,
            height: 90,
            background: 'radial-gradient(ellipse, rgba(96,164,206,0.3), transparent 72%)',
            filter: 'blur(30px)',
          }}
        />
      </Cam>
      <Vignette strength={0.92} />
      <Grain f={f} opacity={0.075} />
      <Watermark />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* shot 02 — the sender's name is her own                              */
/* ------------------------------------------------------------------ */

const ShotSender: React.FC<{f: number}> = ({f}) => {
  const p = smooth(clamp01((f - C.s2) / (C.s3 - C.s2)));
  const z = 1.02 + p * 0.075;
  // rack focus: phone sharp first, face sharp by the last third
  const rack = smooth(clamp01((f - C.s2 - 90) / 120));
  const lid = blinkLid(f, C.s2 + 122, 9) + blinkLid(f, C.s2 + 236, 8);
  return (
    <AbsoluteFill style={{background: '#02050A', overflow: 'hidden'}}>
      <Cam z={z} ox="58%" oy="42%">
        <Ambient f={f} />
        {/* blown-out screen off frame right */}
        <div
          style={{
            position: 'absolute',
            right: -260,
            top: 120,
            width: 780,
            height: 1200,
            background:
              'radial-gradient(closest-side, rgba(126,192,226,0.5), rgba(40,90,120,0.16) 62%, transparent 82%)',
            filter: 'blur(46px)',
            mixBlendMode: 'screen',
            opacity: 0.85,
          }}
        />
        <div style={{position: 'absolute', left: 170, top: 130, width: 880, height: 1500}}>
          <Amara
            expression="guarded"
            look="down"
            turn={-0.16}
            rim={1.35}
            screen={0.85}
            lidOverride={Math.min(1, lid)}
            viewBox="212 52 192 342"
            preserve="xMidYMid slice"
          />
        </div>
        {/* phone in foreground, still visible while the focus travels */}
        <div
          style={{
            position: 'absolute',
            left: 20,
            bottom: 40,
            width: 520,
            height: 760,
            filter: `blur(${1.3 + rack * 7}px)`,
            opacity: 1,
          }}
        >
          <PhoneSlab style={{left: 0, top: 0, width: 480, height: 720}} rotate={7} glow={0.95}>
            <div
              style={{
                position: 'absolute',
                inset: 12,
                borderRadius: 40,
                background: '#05090D',
                overflow: 'hidden',
              }}
            >
              <PhoneStatus dim={0.2} />
              <div
                style={{
                  position: 'absolute',
                  left: 22,
                  top: 120,
                  fontFamily: SANS,
                  fontSize: 22,
                  letterSpacing: '0.14em',
                  color: 'rgba(180,210,230,0.6)',
                }}
              >
                MESSAGES
              </div>
              <div
                style={{
                  position: 'absolute',
                  left: 22,
                  top: 158,
                  fontFamily: SANS,
                  fontSize: 30,
                  color: 'rgba(232,244,250,0.9)',
                }}
              >
                Amara
              </div>
              <div
                style={{
                  position: 'absolute',
                  left: 22,
                  right: 22,
                  top: 206,
                  fontFamily: SANS,
                  fontSize: 36,
                  lineHeight: 1.2,
                  color: 'rgba(240,248,252,0.94)',
                }}
              >
                Don&apos;t trust Noah.
              </div>
            </div>
          </PhoneSlab>
        </div>
      </Cam>
      <Vignette strength={0.86} />
      <Grain f={f} opacity={0.07} />
      <Watermark />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* shot 03 — every monitor dark, except one                            */
/* ------------------------------------------------------------------ */

const ShotDarkWall: React.FC<{f: number}> = ({f}) => {
  const p = smooth(clamp01((f - C.s3) / (C.s4 - C.s3)));
  const z = 1.06 - p * 0.05;
  const boot = smooth(clamp01((f - C.s3 - 26) / 40));
  const fl = flick(f, 4);
  return (
    <AbsoluteFill style={{background: '#02050A', overflow: 'hidden'}}>
      <Cam z={z} ox="46%" oy="34%">
        <Ambient f={f} glow={0.6} />
        <div
          style={{
            position: 'absolute',
            left: 20,
            top: 140,
            width: 1040,
            height: 900,
            background:
              'linear-gradient(180deg, rgba(30,62,84,0.5) 0%, rgba(10,22,31,0.5) 52%, rgba(4,9,13,0.2) 100%)',
            boxShadow: 'inset 0 0 120px rgba(0,0,0,0.8)',
          }}
        />
        <ControlWall f={f} on={0.085} boot={0.02} />
        {/* the one surviving monitor: second column, top row of the grid */}
        <div style={{position: 'absolute', left: 384, top: 186, width: 312, height: 365}}>
          <div
            style={{
              position: 'absolute',
              inset: -60,
              background: `radial-gradient(closest-side, rgba(108,180,220,${0.3 * boot}), transparent 74%)`,
              filter: 'blur(24px)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 6,
              background: '#070C11',
              boxShadow: '0 0 0 1px rgba(126,166,196,0.22), 0 0 70px rgba(86,158,200,0.34)',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 7,
                overflow: 'hidden',
                borderRadius: 4,
                background: '#05090E',
                opacity: boot,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: '-26%',
                  top: '-8%',
                  width: '152%',
                  height: '148%',
                  filter: 'grayscale(0.46) contrast(1.12) brightness(0.95) saturate(0.8)',
                }}
              >
                <Noah
                  expression="tired"
                  look="camera"
                  rim={1.0}
                  viewBox="188 66 238 356"
                  preserve="xMidYMid slice"
                />
              </div>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'radial-gradient(80% 70% at 50% 40%, transparent 40%, rgba(3,7,10,0.6) 100%)',
                }}
              />
              <Scanlines opacity={0.24} />
            </div>
          </div>
        </div>
        <ControlDesk f={f} glow={0.35} />
        {/* empty chair, pushed back */}
        <div style={{position: 'absolute', left: 700, top: 1010, width: 300, height: 420, opacity: 0.85}}>
          <div
            style={{
              position: 'absolute',
              left: 30,
              top: 0,
              width: 250,
              height: 260,
              borderRadius: '26px 26px 12px 12px',
              background: 'linear-gradient(160deg,#16212B,#080E14 70%)',
              boxShadow: 'inset 0 0 40px rgba(0,0,0,0.8)',
            }}
          />
          <div style={{position: 'absolute', left: 118, top: 258, width: 76, height: 90, background: 'linear-gradient(180deg,#0E1720,#070C11)'}} />
          <div style={{position: 'absolute', left: 60, top: 344, width: 192, height: 16, borderRadius: 8, background: 'linear-gradient(180deg,#101A22,#060B10)'}} />
        </div>
      </Cam>
      <Vignette strength={0.92} />
      <Grain f={f} opacity={0.075} />
      <Watermark />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* shot 04 — a single recording, three years ago                       */
/* ------------------------------------------------------------------ */

const ArchiveAmara: React.FC<{f: number; variant?: number}> = ({f, variant = 0}) => {
  const lean = smooth(clamp01((f - C.s4) / 140));
  const lid = blinkLid(f, C.s4 + 30);
  return (
    <div style={{position: 'absolute', inset: 0, background: '#05090E'}}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(70% 64% at 40% 34%, rgba(74,132,166,0.34), rgba(5,10,15,0.92) 76%)',
        }}
      />
      {/* workstation behind her */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 470, height: 26, background: 'rgba(126,170,198,0.1)'}} />
      <div style={{position: 'absolute', left: 40, top: 496, width: 280, height: 16, background: 'rgba(150,196,222,0.06)'}} />
      <div
        style={{
          position: 'absolute',
          left: variant ? 60 : 120,
          top: 40,
          width: 620,
          height: 920,
          opacity: 0.95,
        }}
      >
        <Amara
          expression="focus"
          look="down"
          turn={-0.24 - lean * 0.1}
          rim={0.9}
          screen={0.7}
          lidOverride={lid}
          viewBox="110 24 380 676"
          preserve="xMidYMax slice"
        />
      </div>
    </div>
  );
};

const ShotArchiveWide: React.FC<{f: number}> = ({f}) => {
  const p = smooth(clamp01((f - C.s4) / (C.s5 - C.s4)));
  const z = 1.17 + p * 0.05;
  return (
    <AbsoluteFill style={{background: '#02050A', overflow: 'hidden'}}>
      <Cam z={z} ox="38%" oy="34%">
        <Ambient f={f} glow={0.4} />
        <ControlWall f={f} on={0.16} boot={0.1} />
        <div
          style={{
            position: 'absolute',
            left: 96,
            top: 300,
            width: 660,
            height: 940,
            boxShadow: '0 0 120px rgba(60,124,160,0.3)',
          }}
        >
          <Monitor inset={12} radius={6} style={{position: 'absolute', inset: 0}}>
            <Archival f={f} bright={1}>
              <ArchiveAmara f={f} />
            </Archival>
          </Monitor>
        </div>
        {/* Amara's shoulder, out of focus, right foreground */}
        <div
          style={{
            position: 'absolute',
            right: -330,
            top: 180,
            width: 640,
            height: 1500,
            filter: 'blur(17px) brightness(0.36)',
            opacity: 0.95,
          }}
        >
          <AmaraBack
            rim={1.6}
            viewBox="70 10 180 560"
            preserve="xMidYMax slice"
          />
        </div>
      </Cam>
      <Vignette strength={0.9} />
      <Grain f={f} opacity={0.08} />
      <Watermark />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* shot 05 — standing beside Doctor Elias                              */
/* ------------------------------------------------------------------ */

const ShotArchiveTwo: React.FC<{f: number}> = ({f}) => {
  const p = smooth(clamp01((f - C.s5) / (C.s6 - C.s5)));
  const z = 1.01 + p * 0.045;
  const lid = blinkLid(f, C.s5 + 22) + blinkLid(f, C.s5 + 66, 7);
  return (
    <AbsoluteFill style={{background: '#02050A', overflow: 'hidden'}}>
      <Cam z={z} ox="50%" oy="40%">
        <div
          style={{
            position: 'absolute',
            left: 40,
            top: 150,
            width: 1000,
            height: 1520,
          }}
        >
          <Monitor inset={14} radius={8} style={{position: 'absolute', inset: 0}}>
            <Archival f={f} bright={1.22}>
              <div style={{position: 'absolute', inset: 0, background: '#05090E'}} />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'radial-gradient(66% 56% at 52% 32%, rgba(86,146,178,0.4), rgba(5,10,15,0.94) 78%)',
                }}
              />
              {/* Elias, half turned, giving the order */}
              <div style={{position: 'absolute', left: -10, top: 150, width: 600, height: 1360}}>
                <DrElias
                  expression="cold"
                  look="right"
                  turn={0.22}
                  rim={1.0}
                  screen={0.6}
                  mouth={talk(f, C.s5 + 40, C.s6 - 6, 0.22, 3)}
                  viewBox="90 30 380 700"
                  preserve="xMidYMax slice"
                />
              </div>
              {/* archival Amara, in profile, listening */}
              <div style={{position: 'absolute', right: -90, top: 250, width: 600, height: 1260}}>
                <Amara
                  expression="focus"
                  look="left"
                  turn={-0.34}
                  rim={0.7}
                  screen={0.5}
                  lidOverride={lid}
                  viewBox="110 40 380 680"
                  preserve="xMidYMax slice"
                />
              </div>
            </Archival>
          </Monitor>
        </div>
      </Cam>
      <Vignette strength={0.9} />
      <Grain f={f} opacity={0.08} />
      <Watermark />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* shot 06 — SUBJECT 002 is ready                                      */
/* ------------------------------------------------------------------ */

const ShotDesignation: React.FC<{f: number}> = ({f}) => {
  const p = smooth(clamp01((f - C.s6) / (C.s7 - C.s6)));
  const z = 1.02 + p * 0.06;
  const reveal = smooth(clamp01((f - C.s6 - 8) / 20));
  return (
    <AbsoluteFill style={{background: '#02050A', overflow: 'hidden'}}>
      <Cam z={z} ox="50%" oy="46%">
        <div style={{position: 'absolute', left: 54, top: 260, width: 972, height: 1400}}>
          <Monitor inset={12} radius={6} style={{position: 'absolute', inset: 0}}>
            <Archival f={f} bright={0.92}>
              <div style={{position: 'absolute', inset: 0, background: '#04080C'}} />
              {/* Elias lower third, out of the way of the text */}
              <div
                style={{
                  position: 'absolute',
                  left: -40,
                  bottom: -120,
                  width: 720,
                  height: 980,
                  filter: 'brightness(0.95)',
                  opacity: 0.9,
                }}
              >
                <DrElias
                  expression="stare"
                  look="camera"
                  turn={0.1}
                  rim={1.1}
                  screen={0.7}
                  mouth={talk(f, C.s6 + 30, C.s7 - 10, 0.2, 3.2)}
                  viewBox="110 20 340 640"
                  preserve="xMidYMax slice"
                />
              </div>
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 470,
                  height: 220,
                  background: 'linear-gradient(90deg, rgba(4,8,12,0.92), rgba(4,8,12,0.4))',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: 78,
                  top: 512,
                  fontFamily: MONO,
                  fontSize: 104,
                  letterSpacing: '0.1em',
                  color: `rgba(232,246,252,${0.5 + reveal * 0.48})`,
                  textShadow: '0 0 40px rgba(126,196,230,0.44)',
                  opacity: reveal,
                  transform: `translateX(${(1 - reveal) * -14}px)`,
                  whiteSpace: 'nowrap',
                }}
              >
                SUBJECT 002
              </div>
              <div
                style={{
                  position: 'absolute',
                  left: 82,
                  top: 640,
                  width: 620 * reveal,
                  height: 2,
                  background: 'rgba(150,206,232,0.5)',
                }}
              />
            </Archival>
          </Monitor>
        </div>
      </Cam>
      <Vignette strength={0.88} />
      <Grain f={f} opacity={0.075} />
      <Watermark />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* shot 07 — she steps closer, and remembers nothing                   */
/* ------------------------------------------------------------------ */

const ShotLeanIn: React.FC<{f: number}> = ({f}) => {
  const p = smooth(clamp01((f - C.s7) / (C.s8 - C.s7)));
  const z = 1.0 + p * 0.09;
  const lid = blinkLid(f, C.s7 + 44) + blinkLid(f, C.s7 + 112, 6);
  return (
    <AbsoluteFill style={{background: '#02050A', overflow: 'hidden'}}>
      <Cam z={z} ox="52%" oy="40%">
        <Ambient f={f} glow={0.5} />
        {/* monitor spill from the left */}
        <div
          style={{
            position: 'absolute',
            left: -320,
            top: 60,
            width: 900,
            height: 1300,
            background:
              'radial-gradient(closest-side, rgba(122,190,224,0.42), rgba(36,86,118,0.14) 60%, transparent 84%)',
            filter: 'blur(48px)',
            mixBlendMode: 'screen',
          }}
        />
        <div style={{position: 'absolute', left: 210, top: 110, width: 840, height: 1560}}>
          <Amara
            expression={f > C.s7 + 90 ? 'guarded' : 'focus'}
            look="left"
            turn={0.3}
            rim={1.4}
            screen={0.95}
            lidOverride={Math.min(1, lid)}
            viewBox="200 46 200 356"
            preserve="xMidYMid slice"
          />
        </div>
      </Cam>
      <Vignette strength={0.84} />
      <Grain f={f} opacity={0.07} />
      <Watermark />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* shot 08 — Noah, behind her, in the recording                        */
/* ------------------------------------------------------------------ */

const ShotNoahBehind: React.FC<{f: number}> = ({f}) => {
  const p = smooth(clamp01((f - C.s8) / (C.s9 - C.s8)));
  const z = 1.03 + p * 0.06;
  const appear = smooth(clamp01((f - C.s8 - 60) / 46));
  const glitch = f > C.s8 + 34 && f < C.s8 + 42;
  const lid = blinkLid(f, C.s8 + 70) + blinkLid(f, C.s8 + 160);
  return (
    <AbsoluteFill style={{background: '#02050A', overflow: 'hidden'}}>
      <Cam z={z} ox="50%" oy="38%">
        <div style={{position: 'absolute', left: 44, top: 200, width: 992, height: 1460}}>
          <Monitor inset={12} radius={6} style={{position: 'absolute', inset: 0}}>
            <Archival f={f} bright={0.98}>
              <div style={{position: 'absolute', inset: 0, background: '#04080C'}} />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'radial-gradient(68% 58% at 44% 34%, rgba(74,136,170,0.36), rgba(4,9,14,0.94) 78%)',
                }}
              />
              {/* archival Amara, foreground left, facing away from him */}
              <div style={{position: 'absolute', left: 40, top: 330, width: 560, height: 1180}}>
                <Amara
                  expression="focus"
                  look="down"
                  turn={-0.2}
                  rim={0.85}
                  screen={0.6}
                  lidOverride={lid}
                  viewBox="110 40 380 680"
                  preserve="xMidYMax slice"
                />
              </div>
              {/* Noah behind her, out of her light */}
              <div
                style={{
                  position: 'absolute',
                  right: -20,
                  top: 210,
                  width: 560,
                  height: 1150,
                  opacity: appear,
                  filter: `brightness(${0.62 + appear * 0.28}) contrast(1.06)`,
                  transform: `translateY(${(1 - appear) * 16}px)`,
                }}
              >
                <NoahBack rim={1.25} />
              </div>
              {glitch ? (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'repeating-linear-gradient(0deg, rgba(190,230,248,0.16) 0 2px, transparent 2px 9px)',
                    mixBlendMode: 'screen',
                    opacity: 0.5,
                  }}
                />
              ) : null}
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
/* shot 09 — "You told me to forget."                                  */
/* ------------------------------------------------------------------ */

const ShotForget: React.FC<{f: number}> = ({f}) => {
  const p = smooth(clamp01((f - C.s9) / (C.s10 - C.s9)));
  const z = 1.02 + p * 0.07;
  const lid = blinkLid(f, C.s9 + 18, 6);
  return (
    <AbsoluteFill style={{background: '#02050A', overflow: 'hidden'}}>
      <Cam z={z} ox="46%" oy="40%">
        <div style={{position: 'absolute', left: 40, top: 150, width: 1000, height: 1540}}>
          <Monitor inset={11} radius={6} style={{position: 'absolute', inset: 0}}>
            <Archival f={f} bright={1.2}>
              <div style={{position: 'absolute', inset: 0, background: '#04080C'}} />
              <div style={{position: 'absolute', left: 40, top: 110, width: 900, height: 1420}}>
                <Noah
                  expression="sad"
                  look="camera"
                  turn={-0.1}
                  rim={1.05}
                  lidOverride={lid}
                  mouth={talk(f, C.s9 + 6, C.s10 - 8, 0.24, 3.1)}
                  viewBox="160 26 300 470"
                  preserve="xMidYMid slice"
                />
              </div>
            </Archival>
          </Monitor>
        </div>
        {/* present-day Amara's shoulder at the frame edge, watching */}
        <div
          style={{
            position: 'absolute',
            left: -180,
            bottom: -80,
            width: 520,
            height: 760,
            filter: 'blur(9px) brightness(0.42)',
          }}
        >
          <AmaraBack rim={1.2} viewBox="0 10 240 520" preserve="xMidYMax slice" />
        </div>
      </Cam>
      <Vignette strength={0.9} />
      <Grain f={f} opacity={0.08} />
      <Watermark />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* shot 10 — her hands, and the phone vibrating                        */
/* ------------------------------------------------------------------ */

const ShotHands: React.FC<{f: number}> = ({f}) => {
  const p = smooth(clamp01((f - C.s10) / (C.s11 - C.s10)));
  const z = 1.05 - p * 0.04;
  const buzz = f > C.s10 + 82 && f < C.s10 + 96 ? Math.sin((f - C.s10 - 82) * 3.2) : 0;
  const tremble = Math.sin(f / 2.1) * 1.6 + Math.sin(f / 3.7) * 1.1;
  return (
    <AbsoluteFill style={{background: '#02050A', overflow: 'hidden'}}>
      <Cam z={z} ox="50%" oy="58%">
        <Ambient f={f} glow={0.4} />
        <div
          style={{
            position: 'absolute',
            left: -60,
            right: -60,
            top: 520,
            height: 1500,
            background: 'linear-gradient(180deg,#101B23 0%,#0A1218 30%,#03060A 100%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 120,
            top: 600,
            width: 840,
            height: 500,
            background: 'radial-gradient(ellipse at 50% 20%, rgba(110,176,214,0.22), transparent 74%)',
            filter: 'blur(40px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 300,
            top: 690 + buzz * 2,
            width: 430,
            height: 720,
            transform: `translateX(${buzz * 3}px) rotate(-4deg)`,
          }}
        >
          <PhoneSlab style={{left: 0, top: 0, width: 430, height: 720}} glow={0.8}>
            <div
              style={{
                position: 'absolute',
                inset: 14,
                borderRadius: 48,
                background: 'linear-gradient(180deg,#060C12,#03060A)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: -60,
                  right: -60,
                  top: -20,
                  height: 420,
                  background:
                    'radial-gradient(ellipse at 50% 30%, rgba(96,164,206,0.42), transparent 72%)',
                  opacity: 0.5 + Math.abs(buzz) * 0.5,
                  filter: 'blur(14px)',
                }}
              />
              <PhoneStatus dim={0.22} />
              <div
                style={{
                  position: 'absolute',
                  left: 26,
                  top: 180,
                  fontFamily: SANS,
                  fontSize: 30,
                  color: 'rgba(226,240,248,0.9)',
                }}
              >
                Amara
              </div>
              <div
                style={{
                  position: 'absolute',
                  left: 26,
                  right: 26,
                  top: 232,
                  fontFamily: SANS,
                  fontSize: 40,
                  lineHeight: 1.2,
                  color: 'rgba(240,248,252,0.94)',
                }}
              >
                He remembers you.
              </div>
            </div>
          </PhoneSlab>
        </div>
        {/* one forearm entering from the bottom edge, hand reaching the phone.
            the sleeve carries the arm out of frame, so no hand ever floats.  */}
        <div
          style={{
            position: 'absolute',
            right: 20,
            bottom: -140,
            width: 440,
            height: 940,
            transform: `translate(${-tremble * 0.8}px, 0) rotate(-13deg)`,
            filter: 'blur(1.1px)',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 78,
              top: 330,
              width: 330,
              height: 760,
              borderRadius: '150px 150px 30px 30px',
              background: 'linear-gradient(200deg,#1E2B37 0%,#0E1820 44%,#05090E 100%)',
              boxShadow: 'inset 16px 0 44px rgba(0,0,0,0.8)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 92,
              top: 296,
              width: 306,
              height: 72,
              borderRadius: 22,
              background: 'linear-gradient(200deg,#27353F,#0B131A)',
              boxShadow: 'inset 0 -10px 20px rgba(0,0,0,0.72)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 118,
              top: 26,
              width: 268,
              height: 310,
              transform: 'rotate(-8deg)',
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: 18,
                top: 100,
                width: 214,
                height: 196,
                borderRadius: '52% 42% 46% 48%',
                background: 'linear-gradient(150deg,#4A3527 0%,#2A1C14 58%,#140D09 100%)',
                boxShadow:
                  'inset -10px -8px 26px rgba(0,0,0,0.72), 0 0 26px rgba(120,178,208,0.14)',
              }}
            />
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: 20 + i * 52,
                  top: 22 + Math.abs(i - 1.4) * 12,
                  width: 46,
                  height: 124 - Math.abs(i - 1.4) * 16,
                  borderRadius: 24,
                  background: 'linear-gradient(160deg,#43311F 0%,#241810 62%,#110B08 100%)',
                  transform: `rotate(${(i - 1.5) * 5}deg)`,
                  boxShadow: 'inset -4px -6px 14px rgba(0,0,0,0.62)',
                }}
              />
            ))}
          </div>
        </div>
      </Cam>
      <Vignette strength={0.88} />
      <Grain f={f} opacity={0.075} />
      <Watermark />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* shot 11 — "He remembers you."                                       */
/* ------------------------------------------------------------------ */

const ShotSecondMessage: React.FC<{f: number}> = ({f}) => {
  const cut = C.s11 + 42; // phone insert -> her face
  const onPhone = f < cut;
  const p = smooth(clamp01((f - C.s11) / (C.s12 - C.s11)));
  const show = smooth(clamp01((f - C.s11 - 6) / 16));
  const lid = blinkLid(f, cut + 22, 7);
  return (
    <AbsoluteFill style={{background: '#02050A', overflow: 'hidden'}}>
      {onPhone ? (
        <Cam z={1.0 + p * 0.06} ox="50%" oy="46%">
          <Ambient f={f} glow={0.4} />
          <div style={{position: 'absolute', left: 210, top: 420, width: 660, height: 1120}}>
            <PhoneSlab style={{left: 0, top: 0, width: 660, height: 1120}} rotate={-1.5} glow={1.1}>
              <div
                style={{
                  position: 'absolute',
                  inset: 20,
                  borderRadius: 54,
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
                    height: 600,
                    background:
                      'radial-gradient(ellipse at 50% 30%, rgba(104,172,212,0.44), transparent 70%)',
                    filter: 'blur(18px)',
                  }}
                />
                <PhoneStatus dim={0.3} />
                <div
                  style={{
                    position: 'absolute',
                    left: 34,
                    top: 250,
                    fontFamily: SANS,
                    fontSize: 44,
                    letterSpacing: '0.02em',
                    color: 'rgba(230,242,250,0.92)',
                  }}
                >
                  Amara
                </div>
                <div
                  style={{
                    position: 'absolute',
                    left: 34,
                    right: 34,
                    top: 330,
                    fontFamily: SANS,
                    fontSize: 64,
                    lineHeight: 1.16,
                    color: 'rgba(246,251,254,0.97)',
                    textShadow: '0 0 34px rgba(126,196,232,0.42)',
                    opacity: 0.25 + show * 0.75,
                    transform: `translateY(${(1 - show) * 14}px)`,
                  }}
                >
                  He remembers you.
                </div>
              </div>
            </PhoneSlab>
          </div>
        </Cam>
      ) : (
        <Cam z={1.03 + p * 0.07} ox="50%" oy="40%">
          <Ambient f={f} glow={0.45} />
          <div
            style={{
              position: 'absolute',
              right: -280,
              top: 60,
              width: 820,
              height: 1300,
              background:
                'radial-gradient(closest-side, rgba(120,188,222,0.38), transparent 78%)',
              filter: 'blur(46px)',
              mixBlendMode: 'screen',
            }}
          />
          <div style={{position: 'absolute', left: 190, top: 96, width: 850, height: 1580}}>
            <Amara
              expression="guarded"
              look="down"
              turn={0.12}
              rim={1.3}
              screen={0.8}
              lidOverride={Math.min(1, lid)}
              viewBox="198 40 204 362"
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
/* shot 12 — the lights, and the door behind her                       */
/* ------------------------------------------------------------------ */

const ShotDoorOpens: React.FC<{f: number}> = ({f}) => {
  const p = smooth(clamp01((f - C.s12) / (C.s13 - C.s12)));
  const open = smooth(clamp01((f - C.s12 - 46) / 88)) * 0.34;
  const stutter = f > C.s12 + 10 && f < C.s12 + 26 ? 0.55 : 1;
  return (
    <AbsoluteFill style={{background: '#02050A', overflow: 'hidden'}}>
      <Cam z={1.01 + p * 0.05} ox="52%" oy="44%">
        <BackWall f={f} open={open} light={0.86} />
        {/* desk edge + monitor glow from the front of the room */}
        <div
          style={{
            position: 'absolute',
            left: -40,
            right: -40,
            top: 1490,
            height: 460,
            background: 'linear-gradient(180deg,#0C151C,#04070B 60%,#020406)',
            opacity: stutter,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 90,
            top: 1330,
            width: 900,
            height: 320,
            background: 'radial-gradient(ellipse at 50% 0%, rgba(96,158,196,0.24), transparent 72%)',
            filter: 'blur(32px)',
            opacity: stutter,
          }}
        />
        {/* Amara, back to camera, facing the monitor wall */}
        <div
          style={{
            position: 'absolute',
            left: 262,
            top: 540,
            width: 560,
            height: 1060,
            filter: 'drop-shadow(0 26px 54px rgba(0,0,0,0.9))',
          }}
        >
          <AmaraBack rim={1.55} viewBox="38 6 224 630" preserve="xMidYMax meet" />
        </div>
      </Cam>
      <Vignette strength={0.92} />
      <Grain f={f} opacity={0.075} />
      <Watermark />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* shot 13 — once. twice.                                              */
/* ------------------------------------------------------------------ */

const ShotKnocks: React.FC<{f: number}> = ({f}) => {
  const k1 = 12;
  const k2 = 74;
  const reactive = f < C.s13 + 86;
  const jolt = (at: number) => {
    const d = f - at;
    if (d < 0 || d > 12) return 0;
    return Math.sin((d / 12) * Math.PI) * 9;
  };
  const shake = jolt(k1) + jolt(k2);
  const p = smooth(clamp01((f - C.s13) / (C.s14 - C.s13)));
  const turn = smooth(clamp01((f - C.s13 - 92) / 26));
  const lid = blinkLid(f, C.s13 + 132, 6);
  return (
    <AbsoluteFill style={{background: '#02050A', overflow: 'hidden'}}>
      {reactive ? (
        <Cam z={1.02 + p * 0.06} ox={`${54 + shake * 0.4}%`} oy="42%">
          <BackWall f={f} open={0.24} light={0.78} />
          <div
            style={{
              position: 'absolute',
              left: 640,
              top: 408,
              width: 270,
              height: 774,
              transform: `translateX(${shake}px)`,
              background:
                'linear-gradient(100deg, rgba(20,34,44,0.5), rgba(8,14,20,0.6) 60%, rgba(5,9,13,0.7))',
              boxShadow: `0 0 ${40 + shake * 6}px rgba(140,196,226,${0.06 + shake * 0.012})`,
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 520,
              top: 300,
              width: 520,
              height: 1000,
              background: `radial-gradient(closest-side, rgba(120,180,214,${0.06 + shake * 0.02}), transparent 76%)`,
              filter: 'blur(30px)',
            }}
          />
        </Cam>
      ) : (
        <Cam z={1.04 + p * 0.05} ox="50%" oy="38%">
          <Ambient f={f} glow={0.35} />
          <div style={{position: 'absolute', left: 190, top: 110, width: 860, height: 1580}}>
            <Amara
              expression="guarded"
              look={turn > 0.4 ? 'right' : 'down'}
              turn={0.1 + turn * 0.34}
              rim={1.2}
              screen={0.55}
              lidOverride={Math.min(1, lid)}
              viewBox="196 36 208 368"
              preserve="xMidYMid slice"
            />
          </div>
        </Cam>
      )}
      <Vignette strength={0.9} />
      <Grain f={f} opacity={0.078} />
      <Watermark />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* shot 14 — a familiar voice from the dark                            */
/* ------------------------------------------------------------------ */

const ShotThreshold: React.FC<{f: number}> = ({f}) => {
  const p = smooth(clamp01((f - C.s14) / (C.s15 - C.s14)));
  const z = 1.12 - p * 0.09;
  const reveal = smooth(clamp01((f - C.s14 - 40) / 62));
  return (
    <AbsoluteFill style={{background: '#02050A', overflow: 'hidden'}}>
      <Cam z={z} ox="50%" oy="36%">
        {/* corridor, seen through the doorway */}
        <div style={{position: 'absolute', inset: 0, background: '#03070B'}} />
        <div
          style={{
            position: 'absolute',
            left: 40,
            top: 260,
            width: 1000,
            height: 1560,
            background:
              'linear-gradient(180deg, rgba(22,40,52,0.7) 0%, rgba(9,18,25,0.85) 46%, rgba(3,6,9,1) 100%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 250,
            top: 300,
            width: 580,
            height: 1300,
            background:
              'radial-gradient(60% 46% at 50% 22%, rgba(120,176,208,0.26), transparent 76%)',
            filter: 'blur(36px)',
          }}
        />
        {/* the double, standing still, face lifted only at the end */}
        <div
          style={{
            position: 'absolute',
            left: 268,
            top: 620,
            width: 560,
            height: 1340,
            filter: `brightness(${0.34 + reveal * 0.52}) contrast(1.06) drop-shadow(0 30px 60px rgba(0,0,0,0.92))`,
            transform: `translateY(${(1 - smooth(clamp01((f - C.s14) / 70))) * 6}px)`,
          }}
        >
          <Amara
            expression="calm"
            look="camera"
            turn={0}
            rim={1.5}
            screen={0.25 + reveal * 0.35}
            viewBox="152 18 296 552"
            preserve="xMidYMax meet"
          />
        </div>
        {/* rim from the corridor behind her */}
        <div
          style={{
            position: 'absolute',
            left: 300,
            top: 640,
            width: 500,
            height: 1220,
            background: `radial-gradient(closest-side, rgba(158,206,232,${0.1 + reveal * 0.1}), transparent 70%)`,
            filter: 'blur(26px)',
            mixBlendMode: 'screen',
          }}
        />
        <Vignette strength={0.96} />
      </Cam>
      <Grain f={f} opacity={0.08} />
      <Watermark />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* shot 15 — two of her                                                */
/* ------------------------------------------------------------------ */

const ShotDouble: React.FC<{f: number}> = ({f}) => {
  const closeUp = f > C.s15 + 132;
  const p = smooth(clamp01((f - C.s15) / 236));
  const turn = smooth(clamp01((f - C.s15 - 12) / 34));
  const gap = smooth(clamp01((f - C.s15 - 90) / 70));
  const lidP = blinkLid(f, C.s15 + 30, 7);
  return (
    <AbsoluteFill style={{background: '#02050A', overflow: 'hidden'}}>
      {!closeUp ? (
        <Cam z={1.03 + p * 0.05} ox="50%" oy="42%">
          {/* room front: cold wall, doorway full of corridor light */}
          <div style={{position: 'absolute', inset: 0, background: '#050B11'}} />
          <div
            style={{
              position: 'absolute',
              left: 560,
              top: 200,
              width: 420,
              height: 1560,
              background: 'linear-gradient(180deg, rgba(26,46,60,0.9), rgba(8,14,20,0.96))',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 596,
              top: 236,
              width: 350,
              height: 1500,
              background:
                'radial-gradient(58% 42% at 50% 26%, rgba(126,182,212,0.3), transparent 78%)',
              filter: 'blur(30px)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: -160,
              top: 120,
              width: 620,
              height: 1200,
              background:
                'radial-gradient(closest-side, rgba(92,150,186,0.3), transparent 76%)',
              filter: 'blur(40px)',
              mixBlendMode: 'screen',
            }}
          />
          {/* the double, on the threshold */}
          <div
            style={{
              position: 'absolute',
              left: 566,
              top: 640,
              width: 470,
              height: 1240,
              filter: 'brightness(0.78) contrast(1.05) drop-shadow(0 26px 54px rgba(0,0,0,0.92))',
            }}
          >
            <Amara
              expression="calm"
              look="camera"
              turn={0}
              rim={1.5}
              screen={0.5}
              viewBox="140 20 320 660"
              preserve="xMidYMax meet"
            />
          </div>
          {/* present-day Amara, turned toward the door */}
          <div
            style={{
              position: 'absolute',
              left: -30,
              top: 620,
              width: 570,
              height: 1320,
              filter: 'brightness(0.62) contrast(1.06) drop-shadow(0 26px 54px rgba(0,0,0,0.9))',
              transform: `translateX(${-gap * 14}px)`,
            }}
          >
            <Amara
              expression={turn > 0.5 ? 'guarded' : 'cold'}
              look={turn > 0.5 ? 'right' : 'down'}
              turn={-0.2 + turn * 0.72}
              rim={1.1}
              screen={0.4}
              lidOverride={Math.min(1, lidP)}
              viewBox="120 20 360 720"
              preserve="xMidYMax meet"
            />
          </div>
        </Cam>
      ) : (
        <Cam z={1.02 + smooth(clamp01((f - C.s15 - 132) / 100)) * 0.09} ox="62%" oy="36%">
          <div style={{position: 'absolute', inset: 0, background: '#04090E'}} />
          <div
            style={{
              position: 'absolute',
              left: 440,
              top: 60,
              width: 720,
              height: 1400,
              background:
                'radial-gradient(closest-side, rgba(120,178,210,0.3), transparent 76%)',
              filter: 'blur(38px)',
            }}
          />
          <div style={{position: 'absolute', left: 300, top: 110, width: 760, height: 1700}}>
            <Amara
              expression="soft"
              look="camera"
              turn={-0.06}
              rim={1.55}
              screen={0.62}
              viewBox="196 36 208 368"
              preserve="xMidYMid slice"
            />
          </div>
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 1580,
              height: 340,
              background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.9))',
            }}
          />
        </Cam>
      )}
      <Vignette strength={0.92} />
      <Grain f={f} opacity={0.078} />
      <Watermark />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* composition                                                         */
/* ------------------------------------------------------------------ */

export const Part7: React.FC = () => {
  const f = useCurrentFrame();
  if (f >= TAIL) {
    return <AbsoluteFill style={{background: '#000'}} />;
  }
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Audio src={staticFile('audio/pt7.mp3')} />
      {f < C.s2 ? (
        <ShotWarning f={f} />
      ) : f < C.s3 ? (
        <ShotSender f={f} />
      ) : f < C.s4 ? (
        <ShotDarkWall f={f} />
      ) : f < C.s5 ? (
        <ShotArchiveWide f={f} />
      ) : f < C.s6 ? (
        <ShotArchiveTwo f={f} />
      ) : f < C.s7 ? (
        <ShotDesignation f={f} />
      ) : f < C.s8 ? (
        <ShotLeanIn f={f} />
      ) : f < C.s9 ? (
        <ShotNoahBehind f={f} />
      ) : f < C.s10 ? (
        <ShotForget f={f} />
      ) : f < C.s11 ? (
        <ShotHands f={f} />
      ) : f < C.s12 ? (
        <ShotSecondMessage f={f} />
      ) : f < C.s13 ? (
        <ShotDoorOpens f={f} />
      ) : f < C.s14 ? (
        <ShotKnocks f={f} />
      ) : f < C.s15 ? (
        <ShotThreshold f={f} />
      ) : (
        <ShotDouble f={f} />
      )}
    </AbsoluteFill>
  );
};
