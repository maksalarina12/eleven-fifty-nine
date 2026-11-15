import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {Amara} from './character/Amara';
import {Noah} from './character/Noah';
import {Cam} from './Episode';
import {
  Watermark,
  Scanlines,
  ScreenGlass,
  Monitor,
  clamp01,
  smooth,
  blinkLid,
  rnd,
  MONO,
  SANS,
} from './kit';
import {
  Night,
  Rain,
  Haze,
  Skyline,
  Street,
  TrafficSignal,
  SurveillancePole,
  CafeTable,
  Grade,
  ClockFace,
  ShoePlatform,
  TrainCar,
  PhotoFrame,
  Handwriting,
} from './kit2';

/* ------------------------------------------------------------------ */
/* S02E02 — THE EMPTY CITY                                             */
/* 42.080 s of real narration -> 1262 frames. 15 shots.                */
/* Cuts on measured phrase boundaries (Whisper base.en).               */
/* ------------------------------------------------------------------ */

const C = {
  s1: 0, // The coordinates led Amara to a city…
  s2: 148, // Traffic lights changed above empty roads.
  s3: 241, // Coffee steamed on a table.
  s4: 306, // No one was there to drink it.
  s5: 367, // And a voice came from every public speaker.
  s6: 456, // "Good morning, residents."
  s7: 508, // Every clock displayed the same minute.
  s8: 584, // Amara found hundreds of shoes…
  s9: 715, // On the platform, a train arrived…
  s10: 817, // Its doors opened.
  s11: 867, // Inside, every passenger seat held a photograph…
  s12: 986, // One photograph was different.
  s13: 1046, // It showed Amara asleep in the same train.
  s14: 1136, // On its reverse, someone had written:
  s15: 1215, // "You have already been here."
  total: 1262,
};

const FADE = 1246;

/* ------------------------------------------------------------------ */
/* 01 — the sealed district                                            */
/* ------------------------------------------------------------------ */

const ShotDistrict: React.FC<{f: number}> = ({f}) => (
  <Night f={f} glow="radial-gradient(1200px 1100px at 48% 30%, rgba(30,66,96,0.4), rgba(2,5,10,0) 76)">
    <Cam z={1.01 + smooth(clamp01(f / C.s2)) * 0.05} ox="52%" oy="48%">
      <div style={{position: 'absolute', inset: 0, transform: 'scale(1.34)', transformOrigin: '50% 92%'}}>
        <Skyline f={f} dim={0.8} />
      </div>
      <Street f={f} wet={1} />
      <SurveillancePole f={f} x={120} scale={0.92} />
      <SurveillancePole f={f} x={860} scale={0.8} />
      <TrafficSignal f={f} x={742} phase={1} scale={0.9} />
      {/* barricade across the road, weathered, not new */}
      <div style={{position: 'absolute', left: -40, right: -40, bottom: 470, height: 170}}>
        {[0, 1].map((i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: i * 74,
              height: 30,
              background:
                'repeating-linear-gradient(122deg, #7E6330 0 26px, #3A2F1C 26px 52px)',
              boxShadow: '0 8px 22px rgba(0,0,0,0.8), inset 0 2px 0 rgba(214,190,140,0.16)',
              opacity: 0.9,
            }}
          />
        ))}
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${i * 22 + 4}%`,
              top: 0,
              width: 16,
              height: 150,
              background: 'linear-gradient(180deg,#1A232C,#080D13)',
            }}
          />
        ))}
      </div>
      <div
        style={{
          position: 'absolute',
          left: 640,
          top: 900,
          width: 220,
          height: 220,
          borderRadius: '50%',
          background: 'radial-gradient(closest-side, rgba(226,170,74,0.3), transparent 72%)',
          filter: 'blur(22px)',
          mixBlendMode: 'screen',
          opacity: 0.5 + Math.sin(f / 17) * 0.4,
        }}
      />
      <Rain f={f} density={58} opacity={0.3} />
    </Cam>
  </Night>
);

/* ------------------------------------------------------------------ */
/* 02 — traffic lights above empty roads                               */
/* ------------------------------------------------------------------ */

const ShotLights: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s2;
  const phase = Math.floor(k / 14) % 3;
  return (
    <Night f={f} glow="radial-gradient(900px 900px at 62% 34%, rgba(28,64,92,0.36), rgba(2,5,10,0) 74)">
      <Cam z={1.02 + smooth(clamp01(k / 92)) * 0.04} ox="56%" oy="58%">
        <Skyline f={f} dim={0.42} />
        <Street f={f} wet={1} lamps={0.8} />
        <TrafficSignal f={f} x={258} phase={phase} scale={1.5} />
        {/* empty crossing, painted stripes on wet asphalt */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 60 + i * 170,
              bottom: 68,
              width: 110,
              height: 22,
              background: 'rgba(198,216,228,0.14)',
              transform: 'perspective(320px) rotateX(62deg)',
            }}
          />
        ))}
        <Rain f={f} density={44} opacity={0.24} />
      </Cam>
    </Night>
  );
};

/* ------------------------------------------------------------------ */
/* 03-04 — the coffee nobody drinks                                    */
/* ------------------------------------------------------------------ */

const ShotCoffee: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s3;
  return (
    <Night f={f} glow="radial-gradient(820px 820px at 52% 56%, rgba(60,74,86,0.36), rgba(2,5,10,0) 72)">
      <Cam z={1.06 + smooth(clamp01(k / 65)) * 0.05} ox="54%" oy="62%">
        <CafeTable f={f} k={k} />
      </Cam>
    </Night>
  );
};

const ShotEmptyChair: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s4;
  return (
    <Night f={f} glow="radial-gradient(980px 900px at 44% 40%, rgba(46,72,92,0.34), rgba(2,5,10,0) 74)">
      <Cam z={1.14 - smooth(clamp01(k / 60)) * 0.03} ox="42%" oy="52%">
        <CafeTable f={f} k={k} steam={0.6} />
      </Cam>
    </Night>
  );
};

/* ------------------------------------------------------------------ */
/* 05-06 — the voice from every speaker                                */
/* ------------------------------------------------------------------ */

const SpeakerHorn: React.FC<{f: number; x: number; y: number; scale?: number; ring?: number}> = ({
  f,
  x,
  y,
  scale = 1,
  ring = 1,
}) => (
  <div style={{position: 'absolute', left: x, top: y, width: 260 * scale, height: 260 * scale}}>
    {/* horn */}
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 60 * scale,
        width: 190 * scale,
        height: 140 * scale,
        borderRadius: '60% 12% 12% 60% / 50% 40% 40% 50%',
        background: 'linear-gradient(120deg,#39454F 0%,#1A232C 60%,#0B1116 100%)',
        boxShadow: 'inset 0 0 0 1px rgba(150,186,212,0.16), 0 12px 30px rgba(0,0,0,0.8)',
      }}
    />
    {/* grille */}
    <div
      style={{
        position: 'absolute',
        left: 176 * scale,
        top: 68 * scale,
        width: 26 * scale,
        height: 124 * scale,
        borderRadius: '40%',
        background: 'repeating-linear-gradient(0deg, rgba(180,206,224,0.34) 0 2px, rgba(10,16,22,0.9) 2px 6px)',
      }}
    />
    {/* ring bursts */}
    {[0, 1, 2].map((i) => {
      const p = ((f * 0.9 + i * 26) % 78) / 78;
      return (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: 150 * scale,
            top: 128 * scale,
            width: (140 + p * 520) * scale,
            height: (140 + p * 520) * scale,
            marginLeft: -((140 + p * 520) * scale) / 2,
            marginTop: -((140 + p * 520) * scale) / 2,
            borderRadius: '50%',
            border: '2px solid rgba(180,222,244,0.3)',
            opacity: (1 - p) * 0.5 * ring,
          }}
        />
      );
    })}
  </div>
);

const ShotSpeakers: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s5;
  return (
    <Night f={f} glow="radial-gradient(1000px 900px at 50% 28%, rgba(26,58,84,0.36), rgba(2,5,10,0) 74)">
      <Cam z={1.0 + smooth(clamp01(k / 88)) * 0.05} ox="50%" oy="46%">
        <Skyline f={f} dim={0.5} />
        {/* the poles the horns hang from */}
        {[0, 1].map((i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: i === 0 ? 92 : 900,
              top: 470,
              width: 12,
              height: 900,
              background: 'linear-gradient(180deg,#1A232C,#070C12)',
            }}
          />
        ))}
        <SpeakerHorn f={f} x={70} y={520} scale={1.1} />
        <SpeakerHorn f={f} x={880} y={560} scale={0.9} />
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 900}}>
          <Street f={f} wet={1} lamps={0.7} />
        </div>
        <Rain f={f} density={40} opacity={0.22} />
      </Cam>
    </Night>
  );
};

const ShotResidents: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s6;
  const grille = 1 + Math.abs(Math.sin(k / 2.6)) * 0.06;
  return (
    <Night f={f} glow="radial-gradient(760px 820px at 48% 44%, rgba(34,68,94,0.4), rgba(2,5,10,0) 70)" grain={0.06}>
      <Cam z={1.22 + smooth(clamp01(k / 50)) * 0.08} ox="50%" oy="40%">
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(176deg,#0A1118 0%,#05090E 70%)'}} />
        <div
          style={{
            position: 'absolute',
            left: 120,
            top: 420,
            width: 840,
            height: 1080,
            borderRadius: 40,
            background: 'linear-gradient(150deg,#2A343E 0%,#141C24 54%,#070C11 100%)',
            boxShadow: 'inset 0 0 0 2px rgba(150,186,212,0.14), 0 30px 80px rgba(0,0,0,0.9)',
            transform: `scale(${grille})`,
          }}
        />
        {/* the grille, vibrating with the voice */}
        <div
          style={{
            position: 'absolute',
            left: 220,
            top: 520,
            width: 640,
            height: 880,
            borderRadius: 26,
            background:
              'repeating-linear-gradient(0deg, rgba(6,10,14,0.95) 0 7px, rgba(120,158,186,0.2) 7px 9px)',
            boxShadow: 'inset 0 0 70px rgba(0,0,0,0.9)',
            transform: `scale(${grille})`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 300,
            height: 600,
            background: 'radial-gradient(60% 100% at 50% 60%, rgba(150,204,232,0.12), transparent 70%)',
            mixBlendMode: 'screen',
          }}
        />
      </Cam>
    </Night>
  );
};

/* ------------------------------------------------------------------ */
/* 07 — every clock the same minute                                    */
/* ------------------------------------------------------------------ */

const ShotClocks: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s7;
  return (
    <Night f={f} glow="radial-gradient(900px 900px at 50% 40%, rgba(30,60,84,0.4), rgba(2,5,10,0) 72)">
      <Cam z={1.03 + smooth(clamp01(k / 74)) * 0.06} ox="50%" oy="42%">
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(174deg,#0B141C 0%,#070D13 60%,#04070B 100%)'}} />
        {/* tiled wall */}
        {Array.from({length: 10}).map((_, r) =>
          Array.from({length: 6}).map((__, c) => (
            <div
              key={`${r}-${c}`}
              style={{
                position: 'absolute',
                left: c * 190 - 20,
                top: r * 190 - 40,
                width: 174,
                height: 176,
                background: 'rgba(58,84,102,0.1)',
                boxShadow: 'inset 0 0 0 1px rgba(130,168,196,0.05)',
              }}
            />
          ))
        )}
        {/* a grid of clocks, every hand in the same place */}
        {Array.from({length: 4}).map((_, r) =>
          Array.from({length: 3}).map((__, c) => (
            <ClockFace
              key={`${r}-${c}`}
              f={f + r * 7 + c * 11}
              size={172}
              angle={-8}
              style={{left: 130 + c * 300, top: 300 + r * 300}}
            />
          ))
        )}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(66% 58% at 50% 44%, transparent 42%, rgba(3,7,11,0.82) 100%)',
          }}
        />
      </Cam>
    </Night>
  );
};

/* ------------------------------------------------------------------ */
/* 08 — hundreds of shoes                                              */
/* ------------------------------------------------------------------ */

const ShotShoes: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s8;
  return (
    <Night f={f} glow="radial-gradient(900px 1000px at 52% 30%, rgba(28,62,88,0.34), rgba(2,5,10,0) 74)">
      <Cam z={1.02 + smooth(clamp01(k / 125)) * 0.05} ox="52%" oy="44%">
        <ShoePlatform f={f} show={smooth(clamp01(k / 16))} />
      </Cam>
    </Night>
  );
};

/* ------------------------------------------------------------------ */
/* 09 — the train with no driver                                       */
/* ------------------------------------------------------------------ */

const ShotTrainApproach: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s9;
  const approach = smooth(clamp01(k / 70));
  const sc = 0.5 + approach * 0.62;
  return (
    <Night f={f} glow="radial-gradient(900px 900px at 50% 46%, rgba(24,54,78,0.4), rgba(2,5,10,0) 72)">
      <Cam z={1.02 + approach * 0.05} ox="50%" oy="50%">
        {/* platform */}
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg,#080F16 0%,#05090E 100%)'}} />
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 760, background: 'linear-gradient(180deg,#0C141B,#05090E 70%)'}} />
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 700, height: 12, background: 'rgba(214,188,96,0.5)'}} />
        {/* ceiling lamps */}
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 90 + i * 340,
              top: 180,
              width: 220,
              height: 16,
              borderRadius: 6,
              background: 'rgba(206,230,244,0.7)',
              boxShadow: '0 0 70px rgba(170,214,238,0.45)',
            }}
          />
        ))}
        {/* the train, growing out of the tunnel */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 620,
            width: 660,
            height: 1000,
            marginLeft: -330,
            transform: `scale(${sc})`,
            transformOrigin: '50% 100%',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '90px 90px 16px 16px',
              background: 'linear-gradient(168deg,#28343E 0%,#141C24 46%,#070C11 100%)',
              boxShadow: 'inset 0 0 0 2px rgba(150,186,212,0.14), 0 40px 90px rgba(0,0,0,0.9)',
            }}
          />
          {/* windscreen, unlit cab inside */}
          <div
            style={{
              position: 'absolute',
              left: 70,
              top: 130,
              width: 520,
              height: 330,
              borderRadius: '60px 60px 18px 18px',
              background: 'linear-gradient(170deg,#0B1A24 0%,#05090E 70%)',
              boxShadow: 'inset 0 0 70px rgba(0,0,0,0.95)',
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                height: 140,
                background: 'linear-gradient(160deg, rgba(180,220,244,0.12), transparent 62%)',
              }}
            />
          </div>
          {/* headlights */}
          {[0, 1].map((i) => (
            <div key={i} style={{position: 'absolute', left: 96 + i * 380, top: 510, width: 88, height: 88}}>
              <div style={{position: 'absolute', inset: 0, borderRadius: '50%', background: '#F2FAFE', boxShadow: '0 0 90px rgba(210,240,255,0.9)'}} />
              <div style={{position: 'absolute', left: -260, top: -260, width: 600, height: 600, background: 'radial-gradient(closest-side, rgba(210,238,252,0.22), transparent 70%)', filter: 'blur(26px)', mixBlendMode: 'screen'}} />
            </div>
          ))}
        </div>
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: 700,
            background: 'radial-gradient(50% 100% at 50% 0%, rgba(150,204,232,0.1), transparent 72%)',
            mixBlendMode: 'screen',
          }}
        />
      </Cam>
    </Night>
  );
};

/* ------------------------------------------------------------------ */
/* 10 — the doors open                                                 */
/* ------------------------------------------------------------------ */

const ShotDoors: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s10;
  const open = smooth(clamp01((k - 6) / 30));
  return (
    <Night f={f} glow={`radial-gradient(900px 800px at 50% 48%, rgba(70,120,150,${0.2 + open * 0.24}), rgba(2,5,10,0) 72)`}>
      <Cam z={1.02 + open * 0.04} ox="50%" oy="50%">
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg,#070D13,#04070B)'}} />
        {/* train body */}
        <div style={{position: 'absolute', left: -60, right: -60, top: 300, height: 1300, background: 'linear-gradient(170deg,#242F39 0%,#131B23 52%,#070C11 100%)', boxShadow: 'inset 0 0 0 2px rgba(150,186,212,0.12)'}} />
        {/* doorway aperture */}
        <div style={{position: 'absolute', left: 300, right: 300, top: 400, height: 1120, background: 'linear-gradient(180deg,#A8C8DC 0%,#6E93AC 46%,#2A404F 100%)', overflow: 'hidden'}}>
          {/* the carriage interior beyond */}
          <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg,#B4D0E0 0%,#6C8CA4 54%,#243442 100%)'}} />
          {[0, 1].map((i) => (
            <div key={i} style={{position: 'absolute', left: 40 + i * 160, top: 420, width: 120, height: 300, borderRadius: '20px 20px 6px 6px', background: 'linear-gradient(180deg,#4E6878,#22323E)'}} />
          ))}
          <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 60, background: 'rgba(226,244,252,0.7)'}} />
        </div>
        {/* the two leaves, sliding apart */}
        {[0, 1].map((i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: i === 0 ? 300 - open * 210 : 780 + open * 210,
              top: 400,
              width: 210,
              height: 1120,
              background: 'linear-gradient(90deg,#1B252F 0%,#0D141B 60%,#060B10 100%)',
              boxShadow: 'inset 0 0 0 1px rgba(150,186,212,0.14)',
            }}
          >
            <div style={{position: 'absolute', left: 30, top: 300, width: 150, height: 460, background: 'rgba(120,180,214,0.1)', borderRadius: 8}} />
          </div>
        ))}
        {/* light spilling onto the platform floor */}
        <div
          style={{
            position: 'absolute',
            left: 120,
            right: 120,
            bottom: 0,
            height: 320,
            background: `radial-gradient(60% 100% at 50% 0%, rgba(196,228,244,${0.2 * open}), transparent 74%)`,
            mixBlendMode: 'screen',
          }}
        />
      </Cam>
    </Night>
  );
};

/* ------------------------------------------------------------------ */
/* 11-15 — the photographs                                             */
/* ------------------------------------------------------------------ */

const NoahPhoto: React.FC<{f: number; mode?: 'close' | 'medium'}> = ({f, mode = 'close'}) => (
  <div style={{position: 'absolute', inset: 0, background: '#8E9AA2', overflow: 'hidden'}}>
    <div style={{position: 'absolute', inset: 0, filter: 'grayscale(1) contrast(1.12) brightness(0.86)'}}>
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg,#B9C4CA 0%,#8B979F 62%,#6C767D 100%)'}} />
      <Noah
        expression="neutral"
        look="camera"
        rim={0.2}
        lidOverride={blinkLid(f, 900)}
        viewBox={mode === 'close' ? '190 70 190 330' : '160 40 280 470'}
        preserve="xMidYMid slice"
        style={{position: 'absolute', inset: 0}}
      />
    </div>
    <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(70% 60% at 50% 40%, transparent 44%, rgba(20,26,32,0.5) 100%)'}} />
    <div style={{position: 'absolute', inset: 0, backgroundImage: `url(${staticFile('grain.png')})`, backgroundSize: '200px 200px', opacity: 0.2, mixBlendMode: 'overlay'}} />
  </div>
);

/* a carriage, and the seats the photographs were left on */
const Carriage: React.FC<{f: number; light?: number}> = ({f, light = 1}) => (
  <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg,#0B131A 0%,#080E14 40%,#05090E 100%)'}}>
    {/* the shell of the car */}
    <div
      style={{
        position: 'absolute',
        left: 40,
        right: 40,
        top: 180,
        bottom: 120,
        background: 'linear-gradient(180deg,#17232D 0%,#0C151D 46%,#060B10 100%)',
        borderRadius: 14,
        boxShadow: 'inset 0 0 150px rgba(0,0,0,0.95)',
      }}
    />
    {/* windows: the tunnel going by */}
    {[0, 1, 2, 3].map((i) => (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: 70 + i * 250,
          top: 400,
          width: 210,
          height: 300,
          borderRadius: 12,
          background: 'linear-gradient(180deg,#0A151D 0%,#04080D 100%)',
          boxShadow: 'inset 0 0 44px rgba(0,0,0,0.92)',
          overflow: 'hidden',
        }}
      >
        {Array.from({length: 5}).map((__, j) => (
          <div
            key={j}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: `${((f * (2.4 + j * 0.6) + j * 60) % 130) - 14}%`,
              height: 10,
              background: 'rgba(150,196,224,0.09)',
            }}
          />
        ))}
      </div>
    ))}
    {/* two strip lights down the ceiling */}
    {[0, 1].map((i) => (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: 260 + i * 300,
          top: 216,
          width: 260,
          height: 22,
          borderRadius: 8,
          background: 'rgba(214,236,248,0.82)',
          boxShadow: '0 0 86px rgba(180,222,244,0.55)',
          filter: 'blur(1px)',
          opacity: light,
        }}
      />
    ))}
    {/* floor */}
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 460, background: 'linear-gradient(180deg,#0A1219,#04070B 82%)'}} />
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 460,
        background: 'radial-gradient(64% 100% at 50% 0%, rgba(130,176,204,0.10), rgba(0,0,0,0) 72%)',
        mixBlendMode: 'screen',
      }}
    />
    {/* grab pole, running floor to ceiling */}
    <div style={{position: 'absolute', left: 872, top: 200, width: 12, height: 1180, background: 'linear-gradient(90deg,#8E9CA6,#3A444D 62%,#161E25)'}} />
  </div>
);

/* one seat, with the photograph propped against its back */
const SeatWithPhoto: React.FC<{
  f: number;
  x: number;
  y: number;
  w: number;
  h: number;
  mode?: 'close' | 'medium';
  tilt?: number;
  pw?: number;
}> = ({f, x, y, w, h, mode = 'close', tilt = 0, pw = w * 0.56}) => {
  const ph = pw * 1.34;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h}}>
      {/* seat back */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: w,
          height: h * 0.82,
          borderRadius: `${w * 0.1}px ${w * 0.1}px ${w * 0.03}px ${w * 0.03}px`,
          background: 'linear-gradient(180deg,#25333F 0%,#111B24 74%)',
          boxShadow: 'inset 0 0 0 1px rgba(140,186,214,0.10), inset 0 18px 40px rgba(0,0,0,0.5)',
        }}
      />
      {/* headrest seam */}
      <div
        style={{
          position: 'absolute',
          left: w * 0.12,
          top: h * 0.2,
          width: w * 0.76,
          height: 2,
          background: 'rgba(150,196,224,0.10)',
        }}
      />
      {/* cushion */}
      <div
        style={{
          position: 'absolute',
          left: w * 0.03,
          top: h * 0.78,
          width: w * 0.94,
          height: h * 0.22,
          borderRadius: `${w * 0.06}px`,
          background: 'linear-gradient(180deg,#2A3A46 0%,#0D161E 86%)',
          boxShadow: 'inset 0 2px 0 rgba(176,208,228,0.12)',
        }}
      />
      {/* the print, leaning on the backrest and resting on the cushion */}
      <div style={{position: 'absolute', left: (w - pw) / 2, top: h * 0.78 - ph - 6}}>
        {/* its shadow, cast down onto the seat */}
        <div
          style={{
            position: 'absolute',
            left: -6,
            top: ph - 26,
            width: pw + 12,
            height: 34,
            borderRadius: '50%',
            background: 'rgba(0,0,0,0.66)',
            filter: 'blur(9px)',
          }}
        />
        <PhotoFrame w={pw} h={ph} rotate={tilt} glow={0.7}>
          <NoahPhoto f={f} mode={mode} />
        </PhotoFrame>
      </div>
    </div>
  );
};

const ShotSeats: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s11;
  return (
    <Night f={f} glow="radial-gradient(900px 800px at 50% 40%, rgba(56,94,120,0.34), rgba(2,5,10,0) 74)" vignette={0.7}>
      <Cam z={1.04 + smooth(clamp01(k / 118)) * 0.05} ox="50%" oy="46%">
        <Carriage f={f} light={0.9} />
        {/* near row: every seat holds one */}
        <SeatWithPhoto f={f} x={-40} y={930} w={340} h={600} mode="medium" tilt={-4} />
        <SeatWithPhoto f={f + 11} x={320} y={930} w={340} h={600} mode="close" tilt={3} />
        <SeatWithPhoto f={f + 22} x={680} y={930} w={340} h={600} mode="medium" tilt={-2} />
        <SeatWithPhoto f={f + 33} x={1040} y={930} w={340} h={600} mode="close" tilt={5} />
        {/* the next row back, smaller, same story */}
        <SeatWithPhoto f={f + 40} x={120} y={640} w={230} h={320} mode="medium" tilt={-5} />
        <SeatWithPhoto f={f + 47} x={560} y={640} w={230} h={320} mode="close" tilt={4} />
        <SeatWithPhoto f={f + 54} x={1000} y={640} w={230} h={320} mode="medium" tilt={-3} />
      </Cam>
    </Night>
  );
};

const ShotOnePhoto: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s12;
  return (
    <Night f={f} glow="radial-gradient(760px 760px at 52% 46%, rgba(60,100,128,0.4), rgba(2,5,10,0) 70)" vignette={0.66}>
      <Cam z={1.12 + smooth(clamp01(k / 60)) * 0.1} ox="52%" oy="46%">
        <Carriage f={f} light={0.6} />
        <SeatWithPhoto f={f} x={250} y={760} w={600} h={900} mode="medium" tilt={-4} pw={430} />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(58% 52% at 52% 46%, transparent 36%, rgba(3,7,11,0.86) 100%)',
          }}
        />
      </Cam>
    </Night>
  );
};

const ShotAmaraPhoto: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s13;
  return (
    <Night f={f} glow="radial-gradient(700px 700px at 50% 48%, rgba(56,96,124,0.42), rgba(2,5,10,0) 70)" vignette={0.42}>
      <Cam z={1.16 + smooth(clamp01(k / 85)) * 0.1} ox="50%" oy="46%">
        <div style={{position: 'absolute', inset: 0, background: '#060B10'}} />
        <div style={{position: 'absolute', left: 60, top: 400}}>
          <PhotoFrame w={960} h={1210} rotate={-2} glow={1.1}>
            {/* the photograph: Amara asleep on this train, shot in monochrome */}
            <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(178deg,#B6C2C9 0%,#8C98A0 46%,#5E6A72 100%)', overflow: 'hidden'}}>
              <div style={{position: 'absolute', inset: 0, filter: 'grayscale(1) contrast(1.14) brightness(0.9)'}}>
                <div style={{position: 'absolute', left: 40, right: 40, top: 120, height: 240, background: 'linear-gradient(180deg,#D2DBE0,#9AA6AE)', borderRadius: 16}} />
                <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 520, background: 'linear-gradient(180deg,#7C8890,#3E4A52)'}} />
                <div style={{position: 'absolute', left: 120, top: 250, width: 720, height: 820}}>
                  <Amara
                    expression="calm"
                    look="down"
                    turn={-0.22}
                    rim={0.3}
                    screen={0.2}
                    lidOverride={1}
                    viewBox="150 30 300 420"
                    preserve="xMidYMid slice"
                  />
                </div>
                <div style={{position: 'absolute', left: 60, top: 240, width: 840, height: 12, background: 'rgba(20,26,32,0.35)'}} />
              </div>
              <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(68% 58% at 50% 46%, transparent 40%, rgba(24,30,36,0.5) 100%)'}} />
              <div style={{position: 'absolute', inset: 0, backgroundImage: `url(${staticFile('grain.png')})`, backgroundSize: '160px 160px', opacity: 0.26, mixBlendMode: 'overlay'}} />
            </div>
          </PhotoFrame>
        </div>
        {/* the print sits in the darkness of the carriage */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(80% 72% at 46% 40%, rgba(255,252,244,0.08), rgba(2,5,9,0) 70%)',
            mixBlendMode: 'screen',
          }}
        />
      </Cam>
    </Night>
  );
};

const ShotReverse: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s14;
  const flip = smooth(clamp01(k / 12));
  const write = clamp01((k - 16) / 44);
  return (
    <Night f={f} glow="radial-gradient(720px 720px at 50% 46%, rgba(56,96,124,0.36), rgba(2,5,10,0) 70)" vignette={0.42}>
      <Cam z={1.1 + smooth(clamp01(k / 78)) * 0.06} ox="50%" oy="48%">
        <div style={{position: 'absolute', inset: 0, background: '#060B10'}} />
        <div
          style={{
            position: 'absolute',
            left: 60,
            top: 420,
            width: 960,
            height: 1120,
            transform: `perspective(1400px) rotateY(${flip * 22}deg) rotate(${-2 + flip * 3}deg)`,
            background: 'linear-gradient(158deg,#DCE4E9 0%,#BFC9D0 62%,#9DA9B2 100%)',
            boxShadow: `0 24px 60px rgba(0,0,0,0.9), 0 0 ${40 + write * 26}px rgba(180,222,244,0.18)`,
            padding: 26,
          }}
        >
          {/* paper grain and a faint stain */}
          <div style={{position: 'absolute', inset: 0, backgroundImage: `url(${staticFile('grain.png')})`, backgroundSize: '220px 220px', opacity: 0.14, mixBlendMode: 'multiply'}} />
          <div style={{position: 'absolute', left: 120, top: 160, width: 260, height: 190, borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(150,130,96,0.16), transparent 72%)'}} />
          <Handwriting text="You have already been here." size={78} x={70} y={330} write={write} rotate={-2.4} />
        </div>
        {/* one soft fall-off from the lamp, not a second vignette */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(78% 70% at 46% 40%, rgba(255,252,244,0.055), rgba(2,5,9,0) 70%)',
            mixBlendMode: 'screen',
          }}
        />
      </Cam>
    </Night>
  );
};

const ShotFinal: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s15;
  const fade = smooth(clamp01((f - FADE) / 14));
  return (
    <Night f={f} glow="radial-gradient(720px 760px at 50% 46%, rgba(56,96,124,0.34), rgba(2,5,10,0) 70)" vignette={0.44}>
      <Cam z={1.05 + smooth(clamp01(k / 44)) * 0.08} ox="50%" oy="44%">
        <div style={{position: 'absolute', inset: 0, background: '#060B10'}} />
        <div
          style={{
            position: 'absolute',
            left: 40,
            top: 460,
            width: 1000,
            height: 1020,
            transform: 'rotate(-2deg)',
            background: 'linear-gradient(158deg,#DCE4E9 0%,#BFC9D0 62%,#98A4AD 100%)',
            boxShadow: '0 24px 60px rgba(0,0,0,0.9)',
          }}
        >
          <div style={{position: 'absolute', inset: 0, backgroundImage: `url(${staticFile('grain.png')})`, backgroundSize: '220px 220px', opacity: 0.14, mixBlendMode: 'multiply'}} />
          <Handwriting text="You have already been here." size={86} x={70} y={340} write={1} rotate={-2.4} />
        </div>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(80% 72% at 46% 40%, rgba(255,252,244,0.10), rgba(2,5,9,0) 70%)',
            mixBlendMode: 'screen',
          }}
        />
        {fade > 0 ? <AbsoluteFill style={{background: '#000', opacity: fade}} /> : null}
      </Cam>
    </Night>
  );
};

/* ------------------------------------------------------------------ */

export const S02E02: React.FC = () => {
  const f = useCurrentFrame();
  const shot =
    f < C.s2 ? (
      <ShotDistrict f={f} />
    ) : f < C.s3 ? (
      <ShotLights f={f} />
    ) : f < C.s4 ? (
      <ShotCoffee f={f} />
    ) : f < C.s5 ? (
      <ShotEmptyChair f={f} />
    ) : f < C.s6 ? (
      <ShotSpeakers f={f} />
    ) : f < C.s7 ? (
      <ShotResidents f={f} />
    ) : f < C.s8 ? (
      <ShotClocks f={f} />
    ) : f < C.s9 ? (
      <ShotShoes f={f} />
    ) : f < C.s10 ? (
      <ShotTrainApproach f={f} />
    ) : f < C.s11 ? (
      <ShotDoors f={f} />
    ) : f < C.s12 ? (
      <ShotSeats f={f} />
    ) : f < C.s13 ? (
      <ShotOnePhoto f={f} />
    ) : f < C.s14 ? (
      <ShotAmaraPhoto f={f} />
    ) : f < C.s15 ? (
      <ShotReverse f={f} />
    ) : (
      <ShotFinal f={f} />
    );

  return (
    <AbsoluteFill style={{background: '#02050A'}}>
      <Audio src={staticFile('audio/s02e02.mp3')} />
      <Grade lift={1.55} contrast={1.06}>{shot}</Grade>
      {/* black tail: the film ends in black, and it ends inside the audio */}
      <AbsoluteFill
        style={{background: '#000', opacity: smooth(clamp01((f - (C.total - 26)) / 13))}}
      />
      {f < C.total - 26 ? <Watermark /> : null}
    </AbsoluteFill>
  );
};
