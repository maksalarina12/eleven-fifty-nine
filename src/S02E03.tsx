import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {Amara, AmaraBack} from './character/Amara';
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
  talk,
  rnd,
  MONO,
  SANS,
} from './kit';
import {Night, Haze, Waveform, GlitchBars, TrainCar, Readout, Grade} from './kit2';

/* ------------------------------------------------------------------ */
/* S02E03 — THE ARCHIVE                                                */
/* 47.760 s of real narration -> 1432 frames. 14 shots.                 */
/* Cuts on measured phrase boundaries (Whisper base.en).               */
/* ------------------------------------------------------------------ */

const C = {
  s1: 0, // The train carried Amara beneath the city,
  s2: 97, // past stations erased from public maps.
  s3: 210, // At the final stop, a steel door recognized her face.
  s4: 338, // "Access granted. Architect privileges."
  s5: 435, // Amara had never seen the room before,
  s6: 511, // but her hands knew where the light switch was.
  s7: 613, // Shelves of memory drives stretched into the darkness,
  s8: 710, // each carried a name. A date. And a death.
  s9: 825, // She found Noah under Subject 001.
  s10: 937, // Beside it was another record. Subject 002.
  s11: 1069, // Her own photograph stared back at her,
  s12: 1140, // the file opened to a recording of her voice.
  s13: 1232, // "If I ever return here, do not let me remember…"
  s14: 1358, // Behind her, the archive door locked.
  total: 1432,
};

const FADE = 1414;

/* ------------------------------------------------------------------ */
/* 01 — under the city                                                 */
/* ------------------------------------------------------------------ */

const ShotTrain: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s1;
  return (
    <Night f={f} glow="radial-gradient(900px 800px at 50% 34%, rgba(26,58,84,0.34), rgba(2,5,10,0) 72)">
      <Cam z={1.02 + smooth(clamp01(k / 96)) * 0.04} ox="50%" oy="46%">
        <TrainCar f={f} light={0.75}>
          {/* tunnel lights streaking past the glass */}
          {Array.from({length: 5}).map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 470 + i * 62,
                height: 7,
                background: 'linear-gradient(90deg, transparent, rgba(190,224,244,0.34), transparent)',
                transform: `translateX(${((f * 14 + i * 220) % 1500) - 700}px)`,
                opacity: 0.5,
              }}
            />
          ))}
          {/* her reflection, first, so she stands in front of it */}
          <div style={{position: 'absolute', left: 150, top: 700, width: 460, height: 1180, opacity: 0.28, filter: 'blur(5px)', transform: 'scaleX(-1)'}}>
            <AmaraBack rim={0.8} viewBox="0 0 300 700" preserve="xMidYMax slice" />
          </div>
          {/* Amara, standing at the door, back to us */}
          <div style={{position: 'absolute', left: 96, top: 628, width: 500, height: 1340, filter: 'brightness(0.92)'}}>
            <AmaraBack rim={1.45} viewBox="0 0 300 700" preserve="xMidYMax slice" />
          </div>
          {/* the grab pole she is not holding */}
          <div style={{position: 'absolute', left: 640, top: 240, width: 12, height: 1450, background: 'linear-gradient(90deg,#2A3540,#9AB4C6 22%,#33404C 60%,#131A20)', opacity: 0.9}} />
          <div style={{position: 'absolute', left: 643, top: 240, width: 3, height: 1450, background: 'rgba(226,242,252,0.45)', filter: 'blur(1.5px)'}} />
        </TrainCar>
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: 700,
            background: 'radial-gradient(56% 100% at 50% 0%, rgba(140,196,228,0.12), transparent 72%)',
            mixBlendMode: 'screen',
          }}
        />
      </Cam>
    </Night>
  );
};

/* ------------------------------------------------------------------ */
/* 02 — the erased station                                             */
/* ------------------------------------------------------------------ */

const ShotErased: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s2;
  return (
    <Night f={f} glow="radial-gradient(900px 800px at 52% 40%, rgba(28,60,86,0.32), rgba(2,5,10,0) 72)" grain={0.06}>
      <Cam z={1.03 + smooth(clamp01(k / 112)) * 0.05} ox="56%" oy="46%">
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg,#070D13,#04070B)'}} />
        {/* the platform wall, tearing past at speed */}
        {Array.from({length: 7}).map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: -300 + ((f * 26 + i * 260) % 1500),
              top: 380 + (i % 3) * 240,
              width: 210,
              height: 190,
              background: 'rgba(62,88,106,0.16)',
              filter: 'blur(3px)',
              opacity: 0.8,
            }}
          />
        ))}
        {/* the sign plate, blank: the name was removed */}
        <div
          style={{
            position: 'absolute',
            left: 300,
            top: 700,
            width: 480,
            height: 120,
            borderRadius: 6,
            background: 'linear-gradient(180deg,#1F2B34,#0B1116)',
            boxShadow: 'inset 0 0 0 2px rgba(140,178,204,0.14)',
          }}
        >
          {/* paint scars where letters used to be */}
          {Array.from({length: 6}).map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 40 + i * 68,
                top: 34,
                width: 44,
                height: 52,
                background: 'rgba(160,180,196,0.05)',
                filter: 'blur(2px)',
              }}
            />
          ))}
        </div>
        {/* streaking lamps */}
        {Array.from({length: 4}).map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 300 + i * 300,
              height: 10,
              background: 'linear-gradient(90deg, transparent, rgba(196,226,244,0.22), transparent)',
              transform: `translateX(${((f * 30 + i * 300) % 1600) - 800}px)`,
            }}
          />
        ))}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(60% 54% at 50% 44%, transparent 38%, rgba(3,7,11,0.86) 100%)',
          }}
        />
      </Cam>
    </Night>
  );
};

/* ------------------------------------------------------------------ */
/* 03 — the door that knows her face                                   */
/* ------------------------------------------------------------------ */

const BlastDoor: React.FC<{f: number; open?: number; scan?: number; children?: React.ReactNode}> = ({
  f,
  open = 0,
  scan = 0,
  children,
}) => (
  <div style={{position: 'absolute', inset: 0}}>
    {/* wall */}
    <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg,#0A1017 0%,#070C12 54%,#04070B 100%)'}} />
    {Array.from({length: 6}).map((_, i) => (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 240 + i * 260,
          height: 2,
          background: 'rgba(130,168,196,0.07)',
        }}
      />
    ))}
    {/* the gap of light when it opens */}
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: 300,
        width: 34 + open * 300,
        height: 1240,
        marginLeft: -(17 + open * 150),
        background: `linear-gradient(180deg, rgba(176,214,234,${0.12 + open * 0.4}) 0%, rgba(120,168,196,${0.08 + open * 0.26}) 46%, rgba(40,74,96,${0.05 + open * 0.16}) 100%)`,
        filter: 'blur(7px)',
        boxShadow: `0 0 ${40 + open * 90}px rgba(150,200,226,${0.1 + open * 0.2})`,
      }}
    />
    {/* the corridor past it: two ceiling strips fading with distance */}
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: 380,
        width: Math.max(0, (34 + open * 300) * 0.7),
        height: 6,
        marginLeft: -((34 + open * 300) * 0.35),
        background: `rgba(226,242,252,${open * 0.7})`,
        filter: 'blur(2px)',
        opacity: open,
      }}
    />
    {/* two leaves */}
    {[0, 1].map((i) => (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: i === 0 ? -520 + open * -220 : 540 + open * 220,
          top: 280,
          width: 540,

          height: 1280,
          background:
            'linear-gradient(90deg, #212B35 0%, #141C24 46%, #080D13 100%)',
          boxShadow: 'inset 0 0 0 2px rgba(150,186,212,0.13), inset 0 0 90px rgba(0,0,0,0.8)',
          transform: i === 0 ? 'none' : 'scaleX(-1)',
        }}
      >
        {/* panel ribs */}
        {Array.from({length: 7}).map((_, j) => (
          <div
            key={j}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 90 + j * 170,
              height: 8,
              background: 'rgba(150,186,212,0.07)',
            }}
          />
        ))}
        {/* hazard stripe at the base */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 60,
            height: 26,
            background: 'repeating-linear-gradient(122deg, rgba(226,170,74,0.5) 0 18px, rgba(20,26,32,0.9) 18px 36px)',
            opacity: 0.7,
          }}
        />
      </div>
    ))}
    {/* scanner beside the door */}
    <div
      style={{
        position: 'absolute',
        left: 786,
        top: 620,
        width: 128,
        height: 210,
        borderRadius: 10,
        background: 'linear-gradient(160deg,#1B252F,#080D13)',
        boxShadow: 'inset 0 0 0 1px rgba(150,186,212,0.18), 0 0 40px rgba(120,190,222,0.14)',
      }}
    >
      <div style={{position: 'absolute', left: 14, top: 16, right: 14, height: 130, background: '#040A10', overflow: 'hidden', borderRadius: 4}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: `${(f * 2) % 100}%`, height: 26, background: 'linear-gradient(180deg, transparent, rgba(140,220,180,0.5), transparent)'}} />
        <div style={{position: 'absolute', inset: 0, background: `radial-gradient(closest-side, rgba(120,220,170,${0.2 * scan}), transparent 70%)`}} />
      </div>
      <div style={{position: 'absolute', left: 44, top: 168, width: 40, height: 10, borderRadius: 3, background: scan > 0.5 ? '#6FD0A0' : '#3A4752', boxShadow: scan > 0.5 ? '0 0 18px rgba(111,208,160,0.8)' : 'none'}} />
    </div>
    {children}
  </div>
);

const ShotDoor: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s3;
  const scan = smooth(clamp01((k - 30) / 24));
  return (
    <Night f={f} glow="radial-gradient(860px 900px at 52% 44%, rgba(24,54,78,0.36), rgba(2,5,10,0) 72)">
      <Cam z={1.03 + smooth(clamp01(k / 120)) * 0.06} ox="52%" oy="46%">
        <BlastDoor f={f} scan={scan} />
        {/* her, small, facing the door */}
        <div style={{position: 'absolute', left: 168, top: 700, width: 560, height: 1220}}>
          <AmaraBack rim={1.2} viewBox="0 40 300 660" preserve="xMidYMax meet" />
        </div>
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: 520,
            background: 'linear-gradient(180deg, transparent, rgba(2,5,10,0.85))',
          }}
        />
        <Haze x="70%" y="52%" size={620} color="rgba(120,200,236,0.14)" />
      </Cam>
    </Night>
  );
};

/* ------------------------------------------------------------------ */
/* 04 — access granted                                                 */
/* ------------------------------------------------------------------ */

const ShotAccess: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s4;
  const scan = smooth(clamp01(k / 20));
  const open = smooth(clamp01((k - 34) / 46));
  return (
    <Night f={f} glow={`radial-gradient(820px 900px at 50% 40%, rgba(30,80,110,${0.3 + open * 0.2}), rgba(2,5,10,0) 72)`}>
      <Cam z={1.06 + smooth(clamp01(k / 96)) * 0.06} ox="50%" oy="40%">
        <BlastDoor f={f} open={open} scan={scan}>
          {/* the recognition panel, filling the frame */}
          <div
            style={{
              position: 'absolute',
              left: 250,
              top: 420,
              width: 580,
              height: 760,
              borderRadius: 14,
              background: 'linear-gradient(160deg,#111A22,#050A0F)',
              boxShadow: 'inset 0 0 0 2px rgba(150,186,212,0.16), 0 30px 70px rgba(0,0,0,0.9)',
            }}
          >
            <div style={{position: 'absolute', inset: 18, background: '#04090E', overflow: 'hidden', borderRadius: 8}}>
              {/* her face in the scanner, small and cold */}
              <div style={{position: 'absolute', inset: 0, filter: 'grayscale(0.6) brightness(0.9) contrast(1.1)'}}>
                <Amara
                  expression="cold"
                  look="camera"
                  rim={0.4}
                  screen={0.9}
                  lidOverride={blinkLid(f, 360)}
                  viewBox="196 78 208 330"
                  preserve="xMidYMid slice"
                  style={{position: 'absolute', inset: 0}}
                />
              </div>
              {/* recognition bracket */}
              <div
                style={{
                  position: 'absolute',
                  left: 150,
                  top: 96,
                  width: 280,
                  height: 420,
                  border: '3px solid rgba(120,220,170,0.75)',
                  opacity: 0.3 + scan * 0.7,
                  boxShadow: '0 0 26px rgba(120,220,170,0.4)',
                }}
              />
              {/* scan line */}
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: `${(k * 9) % 100}%`,
                  height: 40,
                  background: 'linear-gradient(180deg, transparent, rgba(140,240,190,0.4), transparent)',
                  opacity: scan,
                }}
              />
              <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 54, background: 'linear-gradient(180deg, transparent, rgba(6,20,16,0.55))'}} />
            </div>
            <Scanlines opacity={0.2} />
            <ScreenGlass strength={0.6} />
          </div>
        </BlastDoor>
      </Cam>
    </Night>
  );
};

/* ------------------------------------------------------------------ */
/* 05-06 — the room she has never seen                                 */
/* ------------------------------------------------------------------ */

const shelfRack = (i: number, lit: number) => {
  const x = -60 + i * 192;
  const h = 900 + rnd(i + 4) * 420;
  return (
    <div key={i} style={{position: 'absolute', left: x, bottom: 0, width: 168, height: h}}>
      <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 10, background: 'linear-gradient(90deg,#1B242E,#080D13)'}} />
      <div style={{position: 'absolute', right: 0, top: 0, bottom: 0, width: 10, background: 'linear-gradient(90deg,#16202A,#060B10)'}} />
      {Array.from({length: Math.floor(h / 96)}).map((_, j) => (
        <React.Fragment key={j}>
          <div style={{position: 'absolute', left: 0, right: 0, top: j * 96, height: 7, background: 'rgba(120,158,186,0.1)'}} />
          {/* modules on the shelf */}
          {Array.from({length: 3}).map((__, m) => (
            <div
              key={m}
              style={{
                position: 'absolute',
                left: 16 + m * 48,
                top: j * 96 + 14,
                width: 38,
                height: 76,
                background: 'linear-gradient(180deg,#1A232D,#0A1017)',
                boxShadow: 'inset 0 0 0 1px rgba(140,178,204,0.1)',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: 14,
                  top: 10,
                  width: 5,
                  height: 5,
                  borderRadius: '50%',
                  background: `rgba(150,214,240,${0.2 + lit * (0.5 + Math.sin(j + m + i) * 0.4)})`,
                }}
              />
            </div>
          ))}
        </React.Fragment>
      ))}
    </div>
  );
};

const ShotRoom: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s5;
  const door = Math.max(0, 1 - k / 60);
  return (
    <Night f={f} glow="radial-gradient(1000px 900px at 50% 36%, rgba(18,44,62,0.5), rgba(2,5,10,0) 74)" vignette={0.95}>
      <Cam z={1.02 + smooth(clamp01(k / 75)) * 0.04} ox="50%" oy="50%">
        {Array.from({length: 7}).map((_, i) => shelfRack(i, 0.24))}
        {/* the only light: the door we came through */}
        <div
          style={{
            position: 'absolute',
            left: 380,
            top: 520,
            width: 320,
            height: 780,
            background: `linear-gradient(180deg, rgba(190,224,242,${0.3 * door}), rgba(90,140,172,${0.12 * door}))`,
            filter: 'blur(6px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(10% 30% at 50% 52%, rgba(170,212,234,0.1), transparent 70%)',
          }}
        />
      </Cam>
    </Night>
  );
};

const ShotSwitch: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s6;
  const on = smooth(clamp01((k - 34) / 22));
  return (
    <Night f={f} glow={`radial-gradient(900px 900px at 46% 40%, rgba(${20 + on * 30},${50 + on * 40},${70 + on * 40},0.34), rgba(2,5,10,0) 72)`}>
      <Cam z={1.04 + smooth(clamp01(k / 100)) * 0.05} ox="46%" oy="42%">
        <div style={{position: 'absolute', inset: 0, background: `linear-gradient(180deg, rgba(${8 + on * 18},${14 + on * 26},${20 + on * 30},1) 0%, #04070B 100%)`}} />
        {/* switch plate on the wall */}
        <div
          style={{
            position: 'absolute',
            left: 400,
            top: 640,
            width: 260,
            height: 360,
            borderRadius: 10,
            background: 'linear-gradient(160deg,#242E38,#0B1116)',
            boxShadow: 'inset 0 0 0 2px rgba(150,186,212,0.16), 0 24px 60px rgba(0,0,0,0.9)',
          }}
        >
          <div style={{position: 'absolute', left: 60, top: 56, width: 140, height: 110, borderRadius: 6, background: on > 0.5 ? 'linear-gradient(180deg,#F0F6FA,#B8CBD8)' : 'linear-gradient(180deg,#2C3842,#121A21)', boxShadow: on > 0.5 ? '0 0 60px rgba(220,240,252,0.6)' : 'none'}} />
          <div style={{position: 'absolute', left: 60, top: 206, width: 140, height: 70, borderRadius: 6, background: 'linear-gradient(180deg,#1A242D,#0A1017)', boxShadow: 'inset 0 0 0 1px rgba(150,186,212,0.14)'}} />
        </div>
        {/* her sleeve entering from the right, never a floating hand */}
        <div
          style={{
            position: 'absolute',
            right: -160 + on * 120,
            top: 700,
            width: 620,
            height: 190,
            borderRadius: 96,
            background: 'linear-gradient(180deg,#2B3743,#0C1319 76%)',
            transform: 'rotate(-8deg)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 660,
            top: 716,
            width: 190,
            height: 150,
            borderRadius: '64px 42px 42px 64px',
            background: 'linear-gradient(160deg,#5A4433,#2C1F17)',
            transform: 'rotate(-8deg)',
            opacity: 0.95,
          }}
        />
        {/* the room coming up */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(46% 40% at 52% 44%, rgba(180,220,240,0.24), transparent 72%)',
            opacity: on,
            mixBlendMode: 'screen',
          }}
        />
        {Array.from({length: 5}).map((_, i) => (
          <div key={i} style={{position: 'absolute', left: 60 + i * 210, top: 200, width: 120, height: 1400, background: 'rgba(60,86,104,0.14)', opacity: on * 0.6}} />
        ))}
      </Cam>
    </Night>
  );
};

/* ------------------------------------------------------------------ */
/* 07-08 — shelves of lives                                            */
/* ------------------------------------------------------------------ */

const ShotShelves: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s7;
  const lit = smooth(clamp01(k / 30));
  return (
    <Night f={f} glow="radial-gradient(1000px 900px at 50% 40%, rgba(24,56,76,0.42), rgba(2,5,10,0) 74)" vignette={0.9}>
      <Cam z={1.02 + smooth(clamp01(k / 95)) * 0.06} ox="50%" oy="46%">
        {Array.from({length: 7}).map((_, i) => shelfRack(i, 0.7 * lit))}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            height: 400,
            background: 'radial-gradient(60% 100% at 50% 0%, rgba(150,196,224,0.14), transparent 72%)',
          }}
        />
        <Haze x="50%" y="52%" size={900} color="rgba(90,150,186,0.16)" />
      </Cam>
    </Night>
  );
};

const DriveCard: React.FC<{
  f: number;
  x: number;
  y: number;
  w?: number;
  label?: string;
  awake?: number;
  portrait?: React.ReactNode;
}> = ({f, x, y, w = 420, label, awake = 0, portrait}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: w,
      height: w * 0.62,
      borderRadius: 8,
      background: 'linear-gradient(168deg,#1E2832 0%,#111922 52%,#070C11 100%)',
      boxShadow: 'inset 0 0 0 1px rgba(150,186,212,0.16), 0 18px 44px rgba(0,0,0,0.85)',
    }}
  >
    {/* handle */}
    <div style={{position: 'absolute', left: 16, top: w * 0.2, width: 10, height: w * 0.24, borderRadius: 5, background: 'linear-gradient(180deg,#3D4A55,#141C24)'}} />
    {/* tiny display */}
    <div style={{position: 'absolute', left: 44, top: w * 0.1, width: w * 0.42, height: w * 0.4, borderRadius: 4, background: '#04090E', overflow: 'hidden', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.9)'}}>
      {portrait ? (
        <div style={{position: 'absolute', inset: 0, opacity: 0.3 + awake * 0.7}}>{portrait}</div>
      ) : (
        <div style={{position: 'absolute', inset: 0, background: `radial-gradient(closest-side, rgba(120,190,222,${0.16 * awake}), transparent 72%)`}} />
      )}
      <div style={{position: 'absolute', left: 0, right: 0, top: `${(f * 3) % 100}%`, height: 20, background: 'linear-gradient(180deg, transparent, rgba(160,214,240,0.14), transparent)'}} />
    </div>
    {/* LEDs */}
    <div style={{position: 'absolute', right: 18, top: 16, width: 8, height: 8, borderRadius: '50%', background: `rgba(120,214,172,${0.3 + awake * 0.7})`, boxShadow: `0 0 12px rgba(120,214,172,${0.4 * awake})`}} />
    {label ? (
      <div
        style={{
          position: 'absolute',
          left: 44,
          bottom: 16,
          fontFamily: MONO,
          fontSize: 20,
          letterSpacing: '0.2em',
          color: `rgba(200,226,240,${0.4 + awake * 0.5})`,
        }}
      >
        {label}
      </div>
    ) : (
      /* unreadable marks, no invented names */
      <div style={{position: 'absolute', left: 44, bottom: 18, display: 'flex', gap: 5, opacity: 0.3}}>
        {Array.from({length: 8}).map((_, i) => (
          <div key={i} style={{width: 8 + rnd(i + 2) * 22, height: 6, background: 'rgba(180,206,224,0.5)'}} />
        ))}
      </div>
    )}
    {/* slot + screws */}
    <div style={{position: 'absolute', right: 18, bottom: 20, width: 60, height: 6, borderRadius: 3, background: 'rgba(6,10,14,0.9)'}} />
  </div>
);

const ShotLabels: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s8;
  return (
    <Night f={f} glow="radial-gradient(900px 800px at 50% 44%, rgba(24,54,76,0.44), rgba(2,5,10,0) 72)" vignette={0.86}>
      <Cam z={1.05 + smooth(clamp01(k / 108)) * 0.06} ox="46%" oy="44%">
        {Array.from({length: 7}).map((_, i) => shelfRack(i, 0.5))}
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(4,8,12,0.5), transparent 40%)'}} />
        <DriveCard f={f} x={90} y={560} w={380} awake={0.4} />
        <DriveCard f={f} x={510} y={600} w={420} awake={0.6} />
        <DriveCard f={f} x={150} y={980} w={400} awake={0.3} />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(60% 54% at 48% 46%, transparent 36%, rgba(3,7,11,0.9) 100%)',
          }}
        />
      </Cam>
    </Night>
  );
};

/* ------------------------------------------------------------------ */
/* 09-13 — Subject 001, Subject 002, and her                       */
/* ------------------------------------------------------------------ */

const NoahPlate: React.FC<{f: number}> = ({f}) => (
  <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg,#93A0A8,#5E6A72)'}}>
    <div style={{position: 'absolute', inset: 0, filter: 'grayscale(1) contrast(1.14) brightness(0.86)'}}>
      <Noah
        expression="tired"
        look="camera"
        rim={0.2}
        lidOverride={blinkLid(f, 900)}
        viewBox="188 62 234 360"
        preserve="xMidYMid slice"
        style={{position: 'absolute', inset: 0}}
      />
    </div>
    <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(70% 60% at 50% 42%, transparent 40%, rgba(18,24,30,0.55) 100%)'}} />
  </div>
);

const ShotSubjectOne: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s9;
  const awake = smooth(clamp01(k / 26));
  return (
    <Night f={f} glow="radial-gradient(860px 820px at 52% 46%, rgba(34,70,96,0.44), rgba(2,5,10,0) 72)" vignette={0.84}>
      <Cam z={1.06 + smooth(clamp01(k / 108)) * 0.07} ox="52%" oy="46%">
        {Array.from({length: 6}).map((_, i) => shelfRack(i, 0.3))}
        <DriveCard f={f} x={250} y={520} w={580} label="SUBJECT 001" awake={awake} portrait={<NoahPlate f={f} />} />
        <div
          style={{
            position: 'absolute',
            left: 250,
            top: 992,
            width: 580,
            height: 8,
            background: 'linear-gradient(90deg, transparent, rgba(150,200,226,0.3), transparent)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(62% 56% at 52% 46%, transparent 34%, rgba(3,7,11,0.9) 100%)',
          }}
        />
      </Cam>
    </Night>
  );
};

const ShotSubjectTwo: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s10;
  const awake = smooth(clamp01((k - 58) / 34));
  return (
    <Night f={f} glow="radial-gradient(860px 820px at 46% 46%, rgba(34,70,96,0.44), rgba(2,5,10,0) 72)" vignette={0.84}>
      <Cam z={1.04 + smooth(clamp01(k / 130)) * 0.06} ox="42%" oy="46%">
        {Array.from({length: 6}).map((_, i) => shelfRack(i, 0.3))}
        {/* the two records side by side */}
        <DriveCard f={f} x={60} y={540} w={420} label="SUBJECT 001" awake={0.7} portrait={<NoahPlate f={f} />} />
        <DriveCard f={f} x={540} y={540} w={420} label="SUBJECT 002" awake={awake} />
        <div
          style={{
            position: 'absolute',
            left: 500,
            top: 560,
            width: 2,
            height: 300,
            background: 'linear-gradient(180deg, transparent, rgba(150,200,226,0.18), transparent)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(62% 56% at 50% 46%, transparent 34%, rgba(3,7,11,0.9) 100%)',
          }}
        />
      </Cam>
    </Night>
  );
};

const AmaraPlate: React.FC<{f: number; awake?: number}> = ({f, awake = 1}) => (
  <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg,#96A2AA,#5A666E)'}}>
    <div style={{position: 'absolute', inset: 0, filter: `grayscale(1) contrast(1.12) brightness(${0.7 + awake * 0.2})`}}>
      <Amara
        expression="cold"
        look="camera"
        rim={0.25}
        screen={0.4}
        lidOverride={blinkLid(f, 1120)}
        viewBox="196 78 208 330"
        preserve="xMidYMid slice"
        style={{position: 'absolute', inset: 0}}
      />
    </div>
    <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(70% 60% at 50% 44%, transparent 40%, rgba(18,24,30,0.6) 100%)'}} />
    <div style={{position: 'absolute', inset: 0, backgroundImage: `url(${staticFile('grain.png')})`, backgroundSize: '180px 180px', opacity: 0.22, mixBlendMode: 'overlay'}} />
  </div>
);

const ShotHerPhoto: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s11;
  return (
    <Night f={f} glow="radial-gradient(800px 800px at 50% 46%, rgba(34,70,96,0.42), rgba(2,5,10,0) 72)" vignette={0.8}>
      <Cam z={1.1 + smooth(clamp01(k / 70)) * 0.08} ox="50%" oy="46%">
        <div style={{position: 'absolute', inset: 0, background: '#05090E'}} />
        <div
          style={{
            position: 'absolute',
            left: 110,
            top: 520,
            width: 860,
            height: 900,
            borderRadius: 12,
            background: 'linear-gradient(160deg,#1A232C,#070C11)',
            boxShadow: 'inset 0 0 0 2px rgba(150,186,212,0.16), 0 24px 60px rgba(0,0,0,0.9)',
            padding: 34,
          }}
        >
          <div style={{position: 'absolute', inset: 34, overflow: 'hidden', borderRadius: 6}}>
            <AmaraPlate f={f} />
            <div style={{position: 'absolute', left: 0, right: 0, top: `${(f * 3.4) % 100}%`, height: 26, background: 'linear-gradient(180deg, transparent, rgba(180,226,244,0.16), transparent)'}} />
          </div>
          <div
            style={{
              position: 'absolute',
              left: 34,
              bottom: 8,
              fontFamily: MONO,
              fontSize: 19,
              letterSpacing: '0.2em',
              color: 'rgba(200,226,240,0.5)',
            }}
          >
            SUBJECT 002
          </div>
        </div>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(58% 52% at 50% 46%, transparent 34%, rgba(3,7,11,0.9) 100%)',
          }}
        />
      </Cam>
    </Night>
  );
};

const ShotRecording: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s12;
  return (
    <Night f={f} glow="radial-gradient(800px 760px at 52% 48%, rgba(34,72,98,0.44), rgba(2,5,10,0) 72)" vignette={0.8}>
      <Cam z={1.08 + smooth(clamp01(k / 86)) * 0.07} ox="52%" oy="48%">
        <div style={{position: 'absolute', inset: 0, background: '#05090E'}} />
        <div
          style={{
            position: 'absolute',
            left: 80,
            top: 460,
            width: 920,
            height: 980,
            borderRadius: 12,
            background: 'linear-gradient(160deg,#1A232C,#070C11)',
            boxShadow: 'inset 0 0 0 2px rgba(150,186,212,0.16), 0 24px 60px rgba(0,0,0,0.9)',
          }}
        >
          <div style={{position: 'absolute', inset: 22, background: '#04090E', borderRadius: 8, overflow: 'hidden'}}>
            {/* the photo, small, at the top of the readout */}
            <div style={{position: 'absolute', left: 40, top: 40, width: 260, height: 320, overflow: 'hidden', borderRadius: 4, boxShadow: '0 0 0 2px rgba(150,186,212,0.16)'}}>
              <AmaraPlate f={f} />
            </div>
            {/* the waveform of her own voice */}
            <div style={{position: 'absolute', left: 340, right: 40, top: 120, height: 260}}>
              {Array.from({length: 52}).map((_, i) => {
                const h = 12 + Math.abs(Math.sin(i * 0.42 + f / 9) + Math.sin(i * 0.13 - f / 15)) * 96;
                const played = i / 52 < clamp01(k / 80);
                return (
                  <div
                    key={i}
                    style={{
                      position: 'absolute',
                      left: i * 10.6,
                      top: 130 - h / 2,
                      width: 4,
                      height: h,
                      borderRadius: 2,
                      background: played ? 'rgba(190,230,248,0.9)' : 'rgba(120,164,192,0.32)',
                      boxShadow: played ? '0 0 12px rgba(160,214,240,0.5)' : 'none',
                    }}
                  />
                );
              })}
              <div
                style={{
                  position: 'absolute',
                  left: clamp01(k / 80) * 560,
                  top: 0,
                  width: 2,
                  height: 260,
                  background: 'rgba(226,170,74,0.8)',
                  boxShadow: '0 0 18px rgba(226,170,74,0.6)',
                }}
              />
            </div>
            <div style={{position: 'absolute', left: 40, bottom: 40, right: 40, height: 1, background: 'rgba(150,186,212,0.12)'}} />
            <div
              style={{
                position: 'absolute',
                left: 40,
                bottom: 60,
                fontFamily: MONO,
                fontSize: 19,
                letterSpacing: '0.2em',
                color: 'rgba(200,226,240,0.46)',
              }}
            >
              SUBJECT 002
            </div>
            <GlitchBars f={f} amount={0.08} seed={9} />
            <Scanlines opacity={0.22} />
            <ScreenGlass strength={0.5} />
          </div>
        </div>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(58% 52% at 50% 48%, transparent 34%, rgba(3,7,11,0.9) 100%)',
          }}
        />
      </Cam>
    </Night>
  );
};

const ShotHerFace: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s13;
  return (
    <Night f={f} glow="radial-gradient(820px 900px at 56% 40%, rgba(60,120,152,0.42), rgba(2,5,10,0) 72)" vignette={0.8}>
      <Cam z={1.04 + smooth(clamp01(k / 110)) * 0.06} ox="56%" oy="34%">
        <div style={{position: 'absolute', left: 620, top: 200, width: 460, height: 980, background: 'linear-gradient(180deg, rgba(150,210,236,0.18), rgba(40,80,104,0.06))', filter: 'blur(3px)'}} />
        <div style={{position: 'absolute', left: 110, top: 180, width: 760, height: 1640}}>
          <Amara
            expression="guarded"
            look="down"
            turn={-0.06}
            rim={1.2}
            screen={0.9}
            lidOverride={blinkLid(f, 1290)}
            viewBox="182 60 232 402"
            preserve="xMidYMid slice"
          />
        </div>
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: 520,
            background: 'linear-gradient(180deg, transparent, rgba(2,5,10,0.85))',
          }}
        />
      </Cam>
    </Night>
  );
};

/* ------------------------------------------------------------------ */
/* 14 — the door locks                                                 */
/* ------------------------------------------------------------------ */

const ShotLock: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s14;
  const slam = smooth(clamp01(k / 18));
  const red = smooth(clamp01((k - 12) / 16));
  const fade = smooth(clamp01((f - FADE) / 14));
  return (
    <Night f={f} glow={`radial-gradient(820px 900px at 50% 40%, rgba(${20 + red * 60},${40 + red * 8},${56 + red * 4},0.4), rgba(2,5,10,0) 72)`} vignette={0.9}>
      <Cam z={1.03 + smooth(clamp01(k / 60)) * 0.05} ox="50%" oy="44%">
        <BlastDoor f={f} open={1 - slam} scan={0} />
        {/* her back, small, facing the closing door */}
        <div style={{position: 'absolute', left: 250, top: 720, width: 600, height: 1200}}>
          <AmaraBack rim={0.9} viewBox="0 40 300 660" preserve="xMidYMax meet" />
        </div>
        {/* the lock indicator going red */}
        <div
          style={{
            position: 'absolute',
            left: 500,
            top: 560,
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: `rgba(226,86,66,${0.2 + red * 0.8})`,
            boxShadow: `0 0 ${60 * red}px rgba(226,86,66,${0.7 * red})`,
            filter: 'blur(1px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(60% 54% at 50% 46%, rgba(226,86,66,${0.1 * red}), transparent 70%)`,
            mixBlendMode: 'screen',
          }}
        />
        {fade > 0 ? <AbsoluteFill style={{background: '#000', opacity: fade}} /> : null}
      </Cam>
    </Night>
  );
};

/* ------------------------------------------------------------------ */

export const S02E03: React.FC = () => {
  const f = useCurrentFrame();
  const shot =
    f < C.s2 ? (
      <ShotTrain f={f} />
    ) : f < C.s3 ? (
      <ShotErased f={f} />
    ) : f < C.s4 ? (
      <ShotDoor f={f} />
    ) : f < C.s5 ? (
      <ShotAccess f={f} />
    ) : f < C.s6 ? (
      <ShotRoom f={f} />
    ) : f < C.s7 ? (
      <ShotSwitch f={f} />
    ) : f < C.s8 ? (
      <ShotShelves f={f} />
    ) : f < C.s9 ? (
      <ShotLabels f={f} />
    ) : f < C.s10 ? (
      <ShotSubjectOne f={f} />
    ) : f < C.s11 ? (
      <ShotSubjectTwo f={f} />
    ) : f < C.s12 ? (
      <ShotHerPhoto f={f} />
    ) : f < C.s13 ? (
      <ShotRecording f={f} />
    ) : f < C.s14 ? (
      <ShotHerFace f={f} />
    ) : (
      <ShotLock f={f} />
    );

  return (
    <AbsoluteFill style={{background: '#02050A'}}>
      <Audio src={staticFile('audio/s02e03.mp3')} />
      <Grade lift={1.3} contrast={1.04}>{shot}</Grade>
      {/* black tail: the film ends in black, and it ends inside the audio */}
      <AbsoluteFill
        style={{background: '#000', opacity: smooth(clamp01((f - (C.total - 26)) / 13))}}
      />
      {f < C.total - 26 ? <Watermark /> : null}
    </AbsoluteFill>
  );
};
