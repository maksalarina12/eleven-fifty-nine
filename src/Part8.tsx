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
  PhoneSlab,
  PhoneStatus,
  NoahBack,
  BackWall,
  Archival,
  clamp01,
  smooth,
  flick,
  blinkLid,
  talk,
} from './kit';

/* ------------------------------------------------------------------ */
/* Part 8 — THE SECOND AMARA                                           */
/* 77.6359 s of real audio -> 2329 frames. 15 shots.                   */
/* ------------------------------------------------------------------ */

const C = {
  s1: 0,
  s2: 104,
  s3: 185,
  s4: 397,
  s5: 467,
  s6: 707,
  s7: 840,
  s8: 948,
  s9: 1069,
  s10: 1397,
  s11: 1559,
  s12: 1644,
  s13: 1839,
  s14: 1977,
  s15: 2160,
  total: 2329,
};

const FADE = 2322; // the last six frames close to black

const Ambient: React.FC<{f: number; glow?: number}> = ({f, glow = 1}) => (
  <>
    <AbsoluteFill style={{background: '#02050A'}} />
    <div
      style={{
        position: 'absolute',
        inset: -120,
        background:
          'radial-gradient(920px 1020px at 50% 32%, rgba(46,98,130,0.3), rgba(3,7,11,0) 72%)',
        opacity: 0.9 + Math.sin(f / 29) * 0.03,
      }}
    />
    <div
      style={{
        position: 'absolute',
        left: -150,
        top: 700,
        width: 520,
        height: 820,
        background: `radial-gradient(closest-side, rgba(226,170,74,${0.12 * glow}), transparent 74%)`,
        filter: 'blur(44px)',
        mixBlendMode: 'screen',
      }}
    />
  </>
);

/* ------------------------------------------------------------------ */
/* shot 01 — she is standing in the doorway                            */
/* ------------------------------------------------------------------ */

const ShotDoubleDoor: React.FC<{f: number}> = ({f}) => {
  const p = smooth(clamp01((f - C.s1) / (C.s2 - C.s1)));
  const z = 1.08 - p * 0.05;
  const lid = blinkLid(f, 34, 7);
  return (
    <AbsoluteFill style={{background: '#02050A', overflow: 'hidden'}}>
      <Cam z={z} ox="50%" oy="34%">
        <div style={{position: 'absolute', inset: 0, background: '#04090E'}} />
        <div
          style={{
            position: 'absolute',
            left: 20,
            top: 120,
            width: 1040,
            height: 1700,
            background:
              'radial-gradient(58% 46% at 50% 26%, rgba(132,190,222,0.42), transparent 78%)',
            filter: 'blur(30px)',
          }}
        />
        {/* door frame, just outside focus */}
        <div
          style={{
            position: 'absolute',
            left: -10,
            top: 150,
            width: 110,
            height: 1580,
            background: 'linear-gradient(90deg,#0B151D,#060C11)',
            filter: 'blur(4px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: -10,
            top: 150,
            width: 110,
            height: 1580,
            background: 'linear-gradient(270deg,#0B151D,#060C11)',
            filter: 'blur(4px)',
          }}
        />
        {/* door jambs, so she is standing in a doorway and not in fog */}
        <div
          style={{
            position: 'absolute',
            left: 96,
            top: 210,
            width: 42,
            height: 1520,
            background: 'linear-gradient(90deg,#20323E,#0A131A)',
            boxShadow: '0 0 30px rgba(0,0,0,0.8)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: 96,
            top: 210,
            width: 42,
            height: 1520,
            background: 'linear-gradient(270deg,#20323E,#0A131A)',
            boxShadow: '0 0 30px rgba(0,0,0,0.8)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 96,
            top: 196,
            width: 888,
            height: 34,
            background: 'linear-gradient(180deg,#263845,#0B141B)',
          }}
        />
        <div style={{position: 'absolute', left: 170, top: 260, width: 760, height: 1660, filter: 'brightness(1.22)'}}>
          <Amara
            expression="calm"
            look="camera"
            turn={0}
            rim={1.55}
            screen={0.55}
            lidOverride={lid}
            mouth={talk(f, 8, 74, 0.2, 3.2)}
            viewBox="176 26 248 440"
            preserve="xMidYMax meet"
          />
        </div>
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 1600,
            height: 320,
            background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.94))',
          }}
        />
      </Cam>
      <Vignette strength={0.94} />
      <Grain f={f} opacity={0.078} />
      <Watermark />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* shot 02 — Amara stands frozen                                       */
/* ------------------------------------------------------------------ */

const ShotFrozen: React.FC<{f: number}> = ({f}) => {
  const p = smooth(clamp01((f - C.s2) / (C.s3 - C.s2)));
  const z = 1.03 + p * 0.07;
  const widen = smooth(clamp01((f - C.s2 - 12) / 40));
  const lid = blinkLid(f, C.s2 + 26, 6);
  return (
    <AbsoluteFill style={{background: '#02050A', overflow: 'hidden'}}>
      <Cam z={z} ox="56%" oy="40%">
        <Ambient f={f} glow={0.6} />
        <div
          style={{
            position: 'absolute',
            right: -300,
            top: 100,
            width: 900,
            height: 1300,
            background:
              'radial-gradient(closest-side, rgba(122,190,224,0.42), rgba(36,86,118,0.14) 62%, transparent 84%)',
            filter: 'blur(48px)',
            mixBlendMode: 'screen',
          }}
        />
        <div style={{position: 'absolute', left: 200, top: 110, width: 840, height: 1560}}>
          <Amara
            expression={widen > 0.5 ? 'calm' : 'focus'}
            look="left"
            turn={0.26}
            rim={1.4}
            screen={0.92}
            lidOverride={Math.min(1, lid - widen * 0.1)}
            viewBox="200 46 200 356"
            preserve="xMidYMid slice"
          />
        </div>
      </Cam>
      <Vignette strength={0.86} />
      <Grain f={f} opacity={0.07} />
      <Watermark />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* shot 03 — her face, her eyes, the same earrings                      */
/* ------------------------------------------------------------------ */

const ShotMatch: React.FC<{f: number}> = ({f}) => {
  const p = smooth(clamp01((f - C.s3) / (C.s4 - C.s3)));
  const drift = p * 26;
  const lidL = blinkLid(f, C.s3 + 44, 7) + blinkLid(f, C.s3 + 140, 6);
  const lidR = blinkLid(f, C.s3 + 44, 7) + blinkLid(f, C.s3 + 140, 6);
  const panel: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    width: 540,
    height: 1920,
    overflow: 'hidden',
    background: '#04080C',
  };
  return (
    <AbsoluteFill style={{background: '#02050A', overflow: 'hidden'}}>
      <div style={{...panel, left: 0}}>
        <div
          style={{
            position: 'absolute',
            left: -40 - drift * 0.4,
            top: 200,
            width: 640,
            height: 1500,
            filter: 'brightness(0.92) contrast(1.05)',
          }}
        >
          <Amara
            expression="calm"
            look="camera"
            turn={-0.04}
            rim={1.35}
            screen={0.8}
            lidOverride={lidL}
            viewBox="214 60 168 300"
            preserve="xMidYMid slice"
          />
        </div>
      </div>
      <div style={{...panel, left: 540}}>
        <div
          style={{
            position: 'absolute',
            left: -60 + drift * 0.4,
            top: 230,
            width: 640,
            height: 1500,
            filter: 'brightness(0.7) contrast(1.06)',
          }}
        >
          <Amara
            expression="calm"
            look="camera"
            turn={0.04}
            rim={1.2}
            screen={0.45}
            lidOverride={lidR}
            viewBox="214 60 168 300"
            preserve="xMidYMid slice"
          />
        </div>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(4,8,12,0.5), transparent 40%, rgba(2,6,9,0.7))',
          }}
        />
      </div>
      {/* the seam */}
      <div
        style={{
          position: 'absolute',
          left: 537,
          top: 0,
          width: 6,
          height: 1920,
          background: 'linear-gradient(180deg, transparent, rgba(150,200,228,0.32) 30%, rgba(150,200,228,0.32) 70%, transparent)',
          boxShadow: '0 0 26px rgba(126,196,232,0.3)',
        }}
      />
      <Vignette strength={0.9} />
      <Grain f={f} opacity={0.075} />
      <Watermark />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* shot 04 — the thin scar on the wrist                                */
/* ------------------------------------------------------------------ */

const Wrist: React.FC<{f: number; scar?: number}> = ({f, scar = 1}) => {
  const shake = Math.sin(f / 5.4) * 1.2;
  const skin = 'linear-gradient(178deg,#5A4132 0%,#3A2A20 42%,#1E1410 78%,#0D0906 100%)';
  return (
    <div
      style={{
        position: 'absolute',
        left: -110,
        top: 660,
        width: 1000,
        height: 1420,
        transform: `rotate(-24deg) scale(0.58) translateY(${shake}px)`,
        filter: 'blur(0.5px)',
      }}
    >
      {/* sleeve, leaving the frame at the bottom-left */}
      <div
        style={{
          position: 'absolute',
          left: -240,
          top: 300,
          width: 620,
          height: 520,
          borderRadius: '120px 30px 30px 120px',
          background: 'linear-gradient(178deg,#26343F 0%,#0E1820 54%,#05090E 100%)',
          boxShadow: 'inset 0 -20px 40px rgba(0,0,0,0.8)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 210,
          top: 344,
          width: 220,
          height: 430,
          background: 'linear-gradient(120deg,#2B3A46,#0A1219)',
          boxShadow: 'inset 0 -14px 26px rgba(0,0,0,0.7)',
        }}
      />
      {/* forearm */}
      <div
        style={{
          position: 'absolute',
          left: 380,
          top: 392,
          width: 700,
          height: 330,
          borderRadius: '150px 54px 54px 150px',
          background: skin,
          boxShadow: 'inset 0 -26px 48px rgba(0,0,0,0.6)',
        }}
      />
      {/* the light riding the top of the arm */}
      <div
        style={{
          position: 'absolute',
          left: 430,
          top: 400,
          width: 600,
          height: 54,
          borderRadius: 30,
          background: 'linear-gradient(90deg, rgba(190,214,228,0.02), rgba(206,228,240,0.16) 40%, rgba(190,214,228,0.02))',
          filter: 'blur(5px)',
        }}
      />
      {/* wrist: the taper */}
      <div
        style={{
          position: 'absolute',
          left: 1010,
          top: 424,
          width: 130,
          height: 266,
          borderRadius: '40px 30px 30px 40px',
          background: 'linear-gradient(178deg,#513829 0%,#33251C 54%,#170F0B 100%)',
          boxShadow: 'inset -10px 0 26px rgba(0,0,0,0.5)',
        }}
      />
      {/* palm */}
      <div
        style={{
          position: 'absolute',
          left: 1110,
          top: 392,
          width: 330,
          height: 350,
          borderRadius: '48% 44% 50% 46%',
          background: skin,
          boxShadow: 'inset -14px -10px 34px rgba(0,0,0,0.6)',
        }}
      />
      {/* fingers */}
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: 1392,
            top: 402 + i * 74,
            width: 210 - Math.abs(i - 1.4) * 26,
            height: 62,
            borderRadius: 31,
            background: 'linear-gradient(96deg,#4A3428 0%,#2A1D15 60%,#130D09 100%)',
            transform: `rotate(${(i - 1.5) * 5}deg)`,
            boxShadow: 'inset 0 -8px 16px rgba(0,0,0,0.55)',
          }}
        />
      ))}
      {/* thumb */}
      <div
        style={{
          position: 'absolute',
          left: 1150,
          top: 700,
          width: 180,
          height: 62,
          borderRadius: 31,
          background: 'linear-gradient(120deg,#4A3428,#241810)',
          transform: 'rotate(28deg)',
        }}
      />
      {/* the scar, always across this wrist */}
      <div
        style={{
          position: 'absolute',
          left: 1048,
          top: 468,
          width: 4,
          height: 148,
          borderRadius: 3,
          background: `linear-gradient(180deg, rgba(226,186,170,0), rgba(244,206,190,${0.98 * scar}), rgba(226,186,170,0))`,
          transform: 'rotate(26deg)',
          boxShadow: `0 0 16px rgba(236,186,164,${0.5 * scar})`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 1050,
          top: 470,
          width: 2,
          height: 150,
          background: `rgba(255,232,220,${0.5 * scar})`,
          transform: 'rotate(9deg)',
        }}
      />
    </div>
  );
};

const ShotScar: React.FC<{f: number}> = ({f}) => {
  const p = smooth(clamp01((f - C.s4) / (C.s5 - C.s4)));
  const z = 1.04 + p * 0.06;
  return (
    <AbsoluteFill style={{background: '#02050A', overflow: 'hidden'}}>
      <Cam z={z} ox="52%" oy="52%">
        <Ambient f={f} glow={0.4} />
        <div
          style={{
            position: 'absolute',
            left: -80,
            right: -80,
            top: 1100,
            height: 1000,
            background: 'linear-gradient(180deg,#0B151C,#05090E 60%,#020406)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 60,
            top: 1080,
            width: 900,
            height: 260,
            background: 'radial-gradient(ellipse at 46% 40%, rgba(0,0,0,0.72), transparent 70%)',
            filter: 'blur(26px)',
          }}
        />
        <Wrist f={f} />
        <div
          style={{
            position: 'absolute',
            left: 120,
            top: 500,
            width: 760,
            height: 620,
            background:
              'radial-gradient(closest-side, rgba(120,184,218,0.16), transparent 74%)',
            filter: 'blur(28px)',
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
/* shot 05 — she raises her hand                                       */
/* ------------------------------------------------------------------ */

const ShotRaise: React.FC<{f: number}> = ({f}) => {
  const p = smooth(clamp01((f - C.s5) / (C.s6 - C.s5)));
  const z = 1.02 + p * 0.08;
  const lift = smooth(clamp01((f - C.s5 - 46) / 52));
  const lid = blinkLid(f, C.s5 + 60, 7);
  return (
    <AbsoluteFill style={{background: '#02050A', overflow: 'hidden'}}>
      <Cam z={z} ox="48%" oy="40%">
        <Ambient f={f} glow={0.5} />
        <div
          style={{
            position: 'absolute',
            left: 40,
            top: 100,
            width: 1000,
            height: 1600,
            background:
              'radial-gradient(56% 42% at 46% 26%, rgba(104,166,198,0.24), transparent 76%)',
            filter: 'blur(30px)',
          }}
        />
        <div style={{position: 'absolute', left: 150, top: 250, width: 800, height: 1700}}>
          <Amara
            expression="calm"
            look="camera"
            turn={-0.05}
            rim={1.45}
            screen={0.5}
            lidOverride={lid}
            mouth={talk(f, C.s5 + 100, C.s6 - 22, 0.22, 3.1)}
            viewBox="168 30 264 700"
            preserve="xMidYMax meet"
          />
        </div>
        {/* the raised hand, sleeve attached, rising into frame */}
        <div
          style={{
            position: 'absolute',
            left: 856,
            top: 1140 - lift * 380,
            width: 300,
            height: 900,
            transform: `rotate(${-9 + lift * 5}deg)`,
            opacity: 0.45 + lift * 0.5,
            filter: 'brightness(0.78) contrast(1.08) blur(1.3px)',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 74,
              top: 250,
              width: 190,
              height: 760,
              borderRadius: '90px 90px 30px 30px',
              background: 'linear-gradient(200deg,#25333F 0%,#101A22 52%,#060A0F 100%)',
              boxShadow: 'inset 12px 0 30px rgba(0,0,0,0.7)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 48,
              top: 232,
              width: 210,
              height: 46,
              borderRadius: 16,
              background: 'linear-gradient(200deg,#2A3946,#0B131A)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 44,
              top: 60,
              width: 200,
              height: 210,
              borderRadius: '46% 46% 48% 48%',
              background: 'linear-gradient(150deg,#3F2D22 0%,#241810 60%,#120C08 100%)',
              boxShadow: 'inset -10px -8px 24px rgba(0,0,0,0.6)',
            }}
          />
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 58 + i * 46,
                top: 18 + Math.abs(i - 1) * 10,
                width: 40,
                height: 96 - Math.abs(i - 1) * 12,
                borderRadius: 20,
                background: 'linear-gradient(160deg,#3A2A1C,#1D130C)',
                transform: `rotate(${(i - 1) * 6}deg)`,
              }}
            />
          ))}
          {/* the same scar, always on this wrist */}
          <div
            style={{
              position: 'absolute',
              left: 96,
              top: 214,
              width: 86,
              height: 2,
              background: 'rgba(222,182,166,0.6)',
              transform: 'rotate(16deg)',
            }}
          />
        </div>
      </Cam>
      <Vignette strength={0.9} />
      <Grain f={f} opacity={0.075} />
      <Watermark />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* shot 06 — she steps backward                                        */
/* ------------------------------------------------------------------ */

const ShotStepBack: React.FC<{f: number}> = ({f}) => {
  const p = smooth(clamp01((f - C.s6) / (C.s7 - C.s6)));
  const z = 1.04 + p * 0.05;
  const step = smooth(clamp01((f - C.s6 - 8) / 40));
  return (
    <AbsoluteFill style={{background: '#02050A', overflow: 'hidden'}}>
      <Cam z={z} ox="42%" oy="40%">
        <div style={{position: 'absolute', inset: 0, background: '#04090E'}} />
        <div
          style={{
            position: 'absolute',
            left: -160,
            top: 80,
            width: 900,
            height: 1500,
            background:
              'radial-gradient(closest-side, rgba(112,176,210,0.28), transparent 78%)',
            filter: 'blur(36px)',
          }}
        />
        {/* Amara, retreating into the room, smaller */}
        <div
          style={{
            position: 'absolute',
            left: 470 + step * 46,
            top: 700 - step * 10,
            width: 430,
            height: 1120,
            filter: 'brightness(0.88) contrast(1.05) drop-shadow(0 26px 54px rgba(0,0,0,0.9))',
          }}
        >
          <Amara
            expression="guarded"
            look="camera"
            turn={-0.12}
            rim={1.15}
            screen={0.5}
            mouth={talk(f, C.s6 + 40, C.s6 + 92, 0.2, 3)}
            viewBox="150 24 300 660"
            preserve="xMidYMax meet"
          />
        </div>
        {/* the double's shoulder in the near foreground, right */}
        <div
          style={{
            position: 'absolute',
            right: -180,
            top: 380,
            width: 620,
            height: 1600,
            filter: 'blur(11px) brightness(0.46)',
          }}
        >
          <AmaraBack rim={1.3} viewBox="60 6 190 620" preserve="xMidYMax slice" />
        </div>
      </Cam>
      <Vignette strength={0.92} />
      <Grain f={f} opacity={0.075} />
      <Watermark />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* shot 07 — "I'm the one who stayed."                                 */
/* ------------------------------------------------------------------ */

const ShotStayed: React.FC<{f: number}> = ({f}) => {
  const p = smooth(clamp01((f - C.s7) / (C.s8 - C.s7)));
  const z = 1.02 + p * 0.075;
  const smile = smooth(clamp01((f - C.s7 - 44) / 40));
  const lid = blinkLid(f, C.s7 + 20, 7);
  return (
    <AbsoluteFill style={{background: '#02050A', overflow: 'hidden'}}>
      <Cam z={z} ox="52%" oy="38%">
        <Ambient f={f} glow={0.45} />
        <div
          style={{
            position: 'absolute',
            right: -260,
            top: 80,
            width: 840,
            height: 1300,
            background:
              'radial-gradient(closest-side, rgba(118,186,220,0.36), transparent 80%)',
            filter: 'blur(46px)',
            mixBlendMode: 'screen',
          }}
        />
        <div style={{position: 'absolute', left: 200, top: 100, width: 840, height: 1580}}>
          <Amara
            expression={smile > 0.4 ? 'soft' : 'calm'}
            look="camera"
            turn={0.04}
            rim={1.5}
            screen={0.52}
            lidOverride={Math.max(0, lid - smile * 0.06)}
            mouth={talk(f, C.s7 + 26, C.s8 - 8, 0.14, 2.9) + smile * 0.05}
            viewBox="202 44 196 350"
            preserve="xMidYMid slice"
          />
        </div>
      </Cam>
      <Vignette strength={0.86} />
      <Grain f={f} opacity={0.07} />
      <Watermark />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* shot 08 — the monitors begin to wake                                */
/* ------------------------------------------------------------------ */

const ShotPowerOn: React.FC<{f: number}> = ({f}) => {
  const p = smooth(clamp01((f - C.s8) / (C.s9 - C.s8)));
  const z = 1.07 - p * 0.06;
  const boot = clamp01((f - C.s8) / 62);
  const fl = flick(f, 3);
  return (
    <AbsoluteFill style={{background: '#02050A', overflow: 'hidden'}}>
      <Cam z={z} ox="46%" oy="32%">
        <Ambient f={f} glow={0.8} />
        <div
          style={{
            position: 'absolute',
            left: 20,
            top: 140,
            width: 1040,
            height: 900,
            background: `linear-gradient(180deg, rgba(28,58,80,${0.34 + boot * 0.3}) 0%, rgba(10,22,31,0.4) 54%, rgba(4,9,13,0.2) 100%)`,
            boxShadow: 'inset 0 0 120px rgba(0,0,0,0.8)',
          }}
        />
        <ControlWall f={f} on={0.14 + boot * 0.82} boot={boot} />
        <ControlDesk f={f} glow={0.5 + boot * 0.4} />
        {/* Amara and the double, small, both still */}
        <div style={{position: 'absolute', left: 210, top: 1120, width: 300, height: 700, filter: 'brightness(0.72)'}}>
          <AmaraBack rim={1.2} viewBox="40 10 220 620" preserve="xMidYMax meet" />
        </div>
        <div style={{position: 'absolute', left: 700, top: 1120, width: 280, height: 700, filter: 'brightness(0.64)'}}>
          <AmaraBack rim={1.1} viewBox="40 10 220 620" preserve="xMidYMax meet" />
        </div>
        <div style={{position: 'absolute', inset: 0, background: `rgba(120,190,226,${boot * 0.05 * fl})`, mixBlendMode: 'screen'}} />
      </Cam>
      <Vignette strength={0.94} />
      <Grain f={f} opacity={0.075} />
      <Watermark />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* shot 09 — every screen, a different Amara                           */
/* ------------------------------------------------------------------ */

const AMARA_FEEDS = [
  {expr: 'soft' as const, bright: 0.86},
  {expr: 'cold' as const, bright: 0.7},
  {expr: 'defiant' as const, bright: 0.78},
  {expr: 'guarded' as const, bright: 0.62},
  {expr: 'focus' as const, bright: 0.74},
  {expr: 'calm' as const, bright: 0.68},
];

const AmaraFeed: React.FC<{f: number; i: number}> = ({f, i}) => {
  const cfg = AMARA_FEEDS[i % AMARA_FEEDS.length];
  const lid = blinkLid(f, C.s9 + 30 + i * 17, 7);
  if (i === 5) {
    return (
      <div style={{position: 'absolute', inset: 0, background: '#05090E'}}>
        <div style={{position: 'absolute', left: 0, top: 90, width: '100%', height: '150%', filter: 'grayscale(0.4) brightness(1.12)'}}>
          <NoahBack rim={1.1} />
        </div>
        <div style={{position: 'absolute', left: -30, top: 210, width: '86%', height: '120%', filter: 'brightness(0.92)'}}>
          <Amara
            expression="calm"
            look="camera"
            rim={0.8}
            screen={0.4}
            viewBox="190 60 220 400"
            preserve="xMidYMax slice"
          />
        </div>
        <Scanlines opacity={0.22} />
      </div>
    );
  }
  return (
    <div style={{position: 'absolute', inset: 0, background: '#05090E'}}>
      <div
        style={{
          position: 'absolute',
          left: '-16%',
          top: '-4%',
          width: '132%',
          height: '140%',
          filter: `grayscale(0.4) contrast(1.08) brightness(${1.15 * cfg.bright}) saturate(0.86)`,
        }}
      >
        <Amara
          expression={cfg.expr}
          look={i % 2 ? 'right' : 'camera'}
          turn={(i - 2.5) * 0.08}
          rim={0.9}
          screen={0.5}
          lidOverride={lid}
          viewBox={i % 3 === 0 ? '196 54 208 370' : '150 20 300 640'}
          preserve="xMidYMax slice"
        />
      </div>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(80% 70% at 50% 40%, transparent 38%, rgba(3,7,10,0.6) 100%)',
        }}
      />
      <Scanlines opacity={0.22} />
    </div>
  );
};

const ShotFeedWall: React.FC<{f: number}> = ({f}) => {
  const p = smooth(clamp01((f - C.s9) / (C.s10 - C.s9)));
  const z = 1.06 - p * 0.06;
  return (
    <AbsoluteFill style={{background: '#02050A', overflow: 'hidden'}}>
      <Cam z={z} ox="42%" oy="30%">
        <Ambient f={f} glow={0.7} />
        <ControlWall f={f} on={0.95} boot={1} />
        {/* replace the generic feeds with Amaras, monitor by monitor */}
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
              <AmaraFeed f={f} i={i} />
            </Monitor>
          ))}
        </div>
        <ControlDesk f={f} glow={0.85} />
      </Cam>
      <Vignette strength={0.9} />
      <Grain f={f} opacity={0.08} />
      <Watermark />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* shot 10 — she turns to the last screen                              */
/* ------------------------------------------------------------------ */

const ShotFinalScreen: React.FC<{f: number}> = ({f}) => {
  const p = smooth(clamp01((f - C.s10) / (C.s11 - C.s10)));
  const z = 1.08 - p * 0.05;
  return (
    <AbsoluteFill style={{background: '#02050A', overflow: 'hidden'}}>
      <Cam z={z} ox="44%" oy="34%">
        <Ambient f={f} glow={0.4} />
        <div
          style={{
            position: 'absolute',
            left: 40,
            top: 240,
            width: 860,
            height: 1180,
            boxShadow: '0 0 120px rgba(60,124,160,0.34)',
          }}
        >
          <Monitor inset={12} radius={6} style={{position: 'absolute', inset: 0}}>
            <Archival f={f} bright={1.02}>
              <div style={{position: 'absolute', inset: 0, background: '#05090E'}} />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'radial-gradient(64% 54% at 46% 34%, rgba(78,140,172,0.36), rgba(4,9,14,0.94) 78%)',
                }}
              />
              <div style={{position: 'absolute', left: 210, top: 120, width: 560, height: 1000}}>
                <Amara
                  expression="focus"
                  look="down"
                  turn={-0.18}
                  rim={0.9}
                  screen={0.7}
                  viewBox="150 30 300 620"
                  preserve="xMidYMax slice"
                />
              </div>
            </Archival>
          </Monitor>
        </div>
        <div
          style={{
            position: 'absolute',
            right: -120,
            top: 620,
            width: 520,
            height: 1300,
            filter: 'blur(13px) brightness(0.42)',
          }}
        >
          <AmaraBack rim={1.5} viewBox="24 16 252 660" preserve="xMidYMax slice" />
        </div>
      </Cam>
      <Vignette strength={0.9} />
      <Grain f={f} opacity={0.08} />
      <Watermark />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* shot 11 — she is holding a small device                             */
/* ------------------------------------------------------------------ */

const ShotDevice: React.FC<{f: number}> = ({f}) => {
  const p = smooth(clamp01((f - C.s11) / (C.s12 - C.s11)));
  const z = 1.02 + p * 0.07;
  const pulse = 0.6 + Math.sin(f / 11) * 0.2;
  return (
    <AbsoluteFill style={{background: '#02050A', overflow: 'hidden'}}>
      <Cam z={z} ox="50%" oy="46%">
        <div style={{position: 'absolute', left: 48, top: 230, width: 984, height: 1440}}>
          <Monitor inset={12} radius={6} style={{position: 'absolute', inset: 0}}>
            <Archival f={f} bright={1}>
              <div style={{position: 'absolute', inset: 0, background: '#05090E'}} />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'radial-gradient(58% 48% at 48% 40%, rgba(82,146,178,0.42), rgba(4,9,14,0.94) 80%)',
                }}
              />
              <div style={{position: 'absolute', left: 140, top: 120, width: 700, height: 1200}}>
                <Amara
                  expression="focus"
                  look="down"
                  turn={-0.1}
                  rim={1.05}
                  screen={0.8}
                  viewBox="140 20 320 660"
                  preserve="xMidYMax slice"
                />
              </div>
              {/* the device, small, in her hands */}
              <div
                style={{
                  position: 'absolute',
                  left: 470,
                  top: 780,
                  width: 170,
                  height: 66,
                  borderRadius: 10,
                  background: 'linear-gradient(160deg,#26333D,#0A1219)',
                  boxShadow: `0 0 ${26 * pulse}px rgba(126,196,230,${0.5 * pulse}), inset 0 0 0 1px rgba(160,200,226,0.22)`,
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    left: 12,
                    top: 20,
                    width: 84,
                    height: 4,
                    borderRadius: 2,
                    background: `rgba(150,214,244,${0.5 + pulse * 0.4})`,
                  }}
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
/* shot 12 — "Erase her memory. Keep the original."                    */
/* ------------------------------------------------------------------ */

const ShotEliasArchive: React.FC<{f: number}> = ({f}) => {
  const p = smooth(clamp01((f - C.s12) / (C.s13 - C.s12)));
  const z = 1.02 + p * 0.07;
  const lid = blinkLid(f, C.s12 + 60, 7);
  return (
    <AbsoluteFill style={{background: '#02050A', overflow: 'hidden'}}>
      <Cam z={z} ox="48%" oy="34%">
        <div style={{position: 'absolute', left: 46, top: 200, width: 988, height: 1480}}>
          <Monitor inset={12} radius={6} style={{position: 'absolute', inset: 0}}>
            <Archival f={f} bright={1.1}>
              <div style={{position: 'absolute', inset: 0, background: '#05090E'}} />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'radial-gradient(62% 52% at 42% 30%, rgba(84,146,178,0.38), rgba(4,9,14,0.94) 78%)',
                }}
              />
              <div style={{position: 'absolute', left: 30, top: 150, width: 620, height: 1300}}>
                <DrElias
                  expression="speak"
                  look="camera"
                  turn={0.12}
                  rim={1.05}
                  screen={0.6}
                  mouth={talk(f, C.s12 + 10, C.s12 + 150, 0.26, 3)}
                  viewBox="110 26 340 660"
                  preserve="xMidYMax slice"
                />
              </div>
              <div style={{position: 'absolute', right: -60, top: 460, width: 480, height: 1000, opacity: 0.86}}>
                <Amara
                  expression="focus"
                  look="left"
                  turn={-0.34}
                  rim={0.7}
                  screen={0.5}
                  lidOverride={lid}
                  viewBox="120 30 360 660"
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
/* shot 13 — the doorway is empty                                      */
/* ------------------------------------------------------------------ */

const ShotEmptyDoor: React.FC<{f: number}> = ({f}) => {
  const p = smooth(clamp01((f - C.s13) / (C.s14 - C.s13)));
  const swing = smooth(clamp01((f - C.s13 - 60) / 70)) * 0.22;
  const lookBack = f < 1916;
  const lid = blinkLid(f, C.s13 + 34, 7);
  return (
    <AbsoluteFill style={{background: '#02050A', overflow: 'hidden'}}>
      {lookBack ? (
        <Cam z={1.04 + p * 0.05} ox="52%" oy="38%">
          <Ambient f={f} glow={0.4} />
          <div style={{position: 'absolute', left: 190, top: 110, width: 860, height: 1580}}>
            <Amara
              expression="guarded"
              look="right"
              turn={0.42}
              rim={1.25}
              screen={0.5}
              lidOverride={Math.min(1, lid)}
              viewBox="190 34 220 392"
              preserve="xMidYMid slice"
            />
          </div>
        </Cam>
      ) : (
        <Cam z={1.06 - p * 0.05} ox="50%" oy="36%">
          <BackWall f={f} open={0.34 + swing} light={0.95} />
          <div
            style={{
              position: 'absolute',
              left: 640,
              top: 408,
              width: 270,
              height: 774,
              background:
                'radial-gradient(52% 46% at 50% 34%, rgba(96,152,186,0.16), transparent 78%)',
            }}
          />
          <ControlDesk f={f} glow={0.3} />
        </Cam>
      )}
      <Vignette strength={0.93} />
      <Grain f={f} opacity={0.075} />
      <Watermark />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* shot 14 — a new message                                             */
/* ------------------------------------------------------------------ */

const ShotMessage: React.FC<{f: number}> = ({f}) => {
  const p = smooth(clamp01((f - C.s14) / (C.s15 - C.s14)));
  const z = 1.01 + p * 0.06;
  const buzz = f > C.s14 + 6 && f < C.s14 + 26 ? Math.sin((f - C.s14) * 2.8) : 0;
  const show = smooth(clamp01((f - C.s14 - 34) / 18));
  return (
    <AbsoluteFill style={{background: '#02050A', overflow: 'hidden'}}>
      <Cam z={z} ox="50%" oy="46%">
        <Ambient f={f} glow={0.4} />
        <div
          style={{
            position: 'absolute',
            left: 180,
            top: 360,
            width: 720,
            height: 1240,
            transform: `translateX(${buzz * 4}px) rotate(${buzz * 0.4}deg)`,
          }}
        >
          <PhoneSlab style={{left: 0, top: 0, width: 720, height: 1240}} glow={1.15}>
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
                  background:
                    'radial-gradient(ellipse at 50% 30%, rgba(104,172,212,0.44), transparent 70%)',
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
                  fontSize: 40,
                  letterSpacing: '0.02em',
                  color: 'rgba(226,240,248,0.9)',
                }}
              >
                Amara
              </div>
              <div
                style={{
                  position: 'absolute',
                  left: 36,
                  right: 36,
                  top: 330,
                  fontFamily: SANS,
                  fontSize: 56,
                  lineHeight: 1.2,
                  color: 'rgba(246,251,254,0.97)',
                  textShadow: '0 0 34px rgba(126,196,232,0.42)',
                  opacity: 0.15 + show * 0.85,
                  transform: `translateY(${(1 - show) * 14}px)`,
                }}
              >
                You were never Subject 002.
              </div>
            </div>
          </PhoneSlab>
        </div>
      </Cam>
      <Vignette strength={0.88} />
      <Grain f={f} opacity={0.075} />
      <Watermark />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* shot 15 — "You were the one who created it."                        */
/* ------------------------------------------------------------------ */

const ShotFinalLine: React.FC<{f: number}> = ({f}) => {
  const cut = C.s15 + 74;
  const onPhone = f < cut;
  const p = smooth(clamp01((f - C.s15) / (C.total - C.s15)));
  const line = smooth(clamp01((f - C.s15 - 16) / 18));
  const dialog = smooth(clamp01((f - C.s15 - 22) / 20));
  const lid = blinkLid(f, cut + 18, 7);
  const fade = smooth(clamp01((f - FADE) / 7));
  return (
    <AbsoluteFill style={{background: '#02050A', overflow: 'hidden'}}>
      {onPhone ? (
        <Cam z={1.02 + p * 0.05} ox="50%" oy="44%">
          <Ambient f={f} glow={0.35} />
          <div style={{position: 'absolute', left: 170, top: 300, width: 740, height: 1280}}>
            <PhoneSlab style={{left: 0, top: 0, width: 740, height: 1280}} glow={0.95}>
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
                    height: 720,
                    background:
                      'radial-gradient(ellipse at 50% 30%, rgba(104,172,212,0.38), transparent 70%)',
                    filter: 'blur(18px)',
                  }}
                />
                <PhoneStatus dim={0.26} />
                <div
                  style={{
                    position: 'absolute',
                    left: 36,
                    right: 36,
                    top: 210,
                    fontFamily: SANS,
                    fontSize: 48,
                    lineHeight: 1.24,
                    color: 'rgba(236,246,252,0.9)',
                  }}
                >
                  You were never Subject 002.
                </div>
                <div
                  style={{
                    position: 'absolute',
                    left: 36,
                    right: 36,
                    top: 420,
                    fontFamily: SANS,
                    fontSize: 56,
                    lineHeight: 1.22,
                    color: 'rgba(248,252,254,0.98)',
                    textShadow: '0 0 38px rgba(126,196,232,0.46)',
                    opacity: 0.2 + line * 0.8,
                    transform: `translateY(${(1 - line) * 12}px)`,
                  }}
                >
                  You were the one who created it.
                </div>
                <div
                  style={{
                    position: 'absolute',
                    left: 36,
                    right: 36,
                    top: 388,
                    height: 1,
                    background: `rgba(150,206,232,${0.16 + dialog * 0.24})`,
                  }}
                />
              </div>
            </PhoneSlab>
          </div>
        </Cam>
      ) : (
        <Cam z={1.05 + p * 0.06} ox="54%" oy="40%">
          <Ambient f={f} glow={0.3} />
          <div
            style={{
              position: 'absolute',
              right: -300,
              top: 60,
              width: 880,
              height: 1320,
              background:
                'radial-gradient(closest-side, rgba(118,186,220,0.34), transparent 80%)',
              filter: 'blur(46px)',
              mixBlendMode: 'screen',
            }}
          />
          <div style={{position: 'absolute', left: 190, top: 90, width: 850, height: 1600}}>
            <Amara
              expression="guarded"
              look="down"
              turn={0.08}
              rim={1.3}
              screen={0.7}
              lidOverride={Math.min(1, lid)}
              viewBox="200 46 200 356"
              preserve="xMidYMid slice"
            />
          </div>
        </Cam>
      )}
      <div style={{position: 'absolute', inset: 0, background: '#000', opacity: fade}} />
      <Vignette strength={0.88} />
      <Grain f={f} opacity={0.075} />
      {f < FADE ? <Watermark /> : null}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* composition                                                         */
/* ------------------------------------------------------------------ */

export const Part8: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Audio src={staticFile('audio/pt8.mp3')} />
      {f < C.s2 ? (
        <ShotDoubleDoor f={f} />
      ) : f < C.s3 ? (
        <ShotFrozen f={f} />
      ) : f < C.s4 ? (
        <ShotMatch f={f} />
      ) : f < C.s5 ? (
        <ShotScar f={f} />
      ) : f < C.s6 ? (
        <ShotRaise f={f} />
      ) : f < C.s7 ? (
        <ShotStepBack f={f} />
      ) : f < C.s8 ? (
        <ShotStayed f={f} />
      ) : f < C.s9 ? (
        <ShotPowerOn f={f} />
      ) : f < C.s10 ? (
        <ShotFeedWall f={f} />
      ) : f < C.s11 ? (
        <ShotFinalScreen f={f} />
      ) : f < C.s12 ? (
        <ShotDevice f={f} />
      ) : f < C.s13 ? (
        <ShotEliasArchive f={f} />
      ) : f < C.s14 ? (
        <ShotEmptyDoor f={f} />
      ) : f < C.s15 ? (
        <ShotMessage f={f} />
      ) : (
        <ShotFinalLine f={f} />
      )}
    </AbsoluteFill>
  );
};
