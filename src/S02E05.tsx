import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {Cam} from './Episode';
import {
  Watermark,
  Scanlines,
  ScreenGlass,
  clamp01,
  smooth,
  rnd,
  MONO,
} from './kit';
import {Night, Haze, Rain, GlitchBars, Grade} from './kit2';
import {Corridor, Bracelet, Iris, Notebook} from './kit3';

/* ------------------------------------------------------------------ */
/* S02E05 — THE WITNESS                                               */
/* 40.960 s of real narration -> 1228 frames. 9 shots.                 */
/* Cuts on measured phrase boundaries (Whisper base.en).              */
/* Iris: silhouette / insert only.                                     */
/* ------------------------------------------------------------------ */

const C = {
  s1: 0, // A woman was waiting at the exit of the archive.
  s2: 109, // She wore an old hospital bracelet beneath her sleeve.
  s3: 233, // "My name is Iris. I remember the resets."
  s4: 402, // Iris looked toward the ceiling…
  s5: 575, // She showed Amara a notebook…
  s6: 700, // Every page ended at eleven fifty-nine.
  s7: 916, // Iris had crossed the minute that trapped Noah.
  s8: 1051, // "The clock is not the prison…"
  s9: 1130, // Footsteps echoed behind the archive wall.
  total: 1228,
};

const FADE = 1214;

/* ------------------------------------------------------------------ */
/* 01 — a woman waiting at the exit                                    */
/* ------------------------------------------------------------------ */

const ShotWaiting: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s1;
  return (
    <Night f={f} glow="radial-gradient(900px 900px at 72% 46%, rgba(30,66,96,0.36), rgba(2,5,10,0) 74)">
      <Cam z={1.02 + smooth(clamp01(k / 108)) * 0.05} ox="64%" oy="44%">
        <Corridor f={f} door={0.85} lamp={0.9} />
        {/* she stands just short of the door, not in the light */}
        <div style={{position: 'absolute', left: 402, top: 286, width: 660, height: 1660}}>
          <Iris rim={1.1} turn={-0.1} side="right" expression="calm" look="camera" />
        </div>
        {/* Amara's shoulder, near us, barely lit */}
        <div
          style={{
            position: 'absolute',
            left: -300,
            top: 700,
            width: 620,
            height: 1400,
            borderRadius: '0 60% 0 0',
            background: 'linear-gradient(100deg,#0A1016,#05090E 70%)',
            filter: 'blur(7px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 90,
            top: 640,
            width: 240,
            height: 900,
            background: 'linear-gradient(96deg, rgba(190,216,232,0.16), transparent 60%)',
            filter: 'blur(6px)',
          }}
        />
        <Rain f={f} density={22} opacity={0.14} />
      </Cam>
    </Night>
  );
};

/* ------------------------------------------------------------------ */
/* 02 — the hospital bracelet                                          */
/* ------------------------------------------------------------------ */

const ShotBracelet: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s2;
  return (
    <Night f={f} glow="radial-gradient(760px 760px at 60% 40%, rgba(34,70,96,0.4), rgba(2,5,10,0) 72)" grain={0.06}>
      <Cam z={1.04 + smooth(clamp01(k / 118)) * 0.06} ox="58%" oy="38%">
        <Bracelet f={f} show={smooth(clamp01(k / 20))} />
      </Cam>
    </Night>
  );
};

/* ------------------------------------------------------------------ */
/* 03-04 — Iris, in silhouette                                         */
/* ------------------------------------------------------------------ */

const ShotIrisName: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s3;
  return (
    <Night f={f} glow="radial-gradient(860px 1000px at 60% 34%, rgba(26,58,84,0.42), rgba(2,5,10,0) 74)">
      <Cam z={1.02 + smooth(clamp01(k / 160)) * 0.06} ox="56%" oy="30%">
        <Corridor f={f} door={0.5} lamp={0.55} />
        {/* the door light sits behind her head like a halo, but off-centre */}
        <div
          style={{
            position: 'absolute',
            left: 540,
            top: 300,
            width: 420,
            height: 620,
            background: 'radial-gradient(closest-side, rgba(170,214,236,0.3), transparent 74%)',
            filter: 'blur(38px)',
            mixBlendMode: 'screen',
          }}
        />
        <div style={{position: 'absolute', left: 30, top: 300, width: 1000, height: 1500}}>
          <Iris rim={1.55} turn={0.06} side="right" expression="stare" look="camera" preserve="xMidYMin slice" />
        </div>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(62% 56% at 52% 40%, transparent 32%, rgba(2,5,9,0.9) 100%)',
          }}
        />
      </Cam>
    </Night>
  );
};

const ShotCeiling: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s4;
  const glowIn = smooth(clamp01(k / 40));
  return (
    <Night f={f} glow="radial-gradient(900px 800px at 52% 20%, rgba(52,92,120,0.46), rgba(2,5,10,0) 72)">
      <Cam z={1.02 + smooth(clamp01(k / 168)) * 0.05} ox="50%" oy="24%">
        {/* the ceiling plane, seen from below */}
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg,#0E1820 0%,#0A121A 44%,#050A10 100%)'}} />
        {/* perspective seams */}
        {Array.from({length: 7}).map((_, i) => {
          const w = 200 + i * 170;
          const y = 120 + i * 190;
          return (
            <div key={`h${i}`} style={{position: 'absolute', left: 540 - w, top: y, width: w * 2, height: 2, background: 'rgba(132,168,192,0.11)'}} />
          );
        })}
        {[-2, -1, 0, 1, 2].map((i) => (
          <div
            key={`v${i}`}
            style={{
              position: 'absolute',
              left: 540 + i * 60,
              top: 0,
              width: 2,
              height: 1300,
              background: 'rgba(132,168,192,0.09)',
              transform: `rotate(${i * 2.4}deg)`,
              transformOrigin: '50% 0%',
            }}
          />
        ))}
        {/* three recessed fixtures; the middle one is the one she is looking at */}
        {[0, 1, 2].map((i) => {
          const on = i === 1;
          return (
            <div
              key={`l${i}`}
              style={{
                position: 'absolute',
                left: 118 + i * 300,
                top: 268,
                width: 250,
                height: 46,
                borderRadius: 10,
                background: on
                  ? `linear-gradient(180deg, rgba(240,248,252,${0.86 * glowIn}), rgba(176,214,236,${0.5 * glowIn}))`
                  : 'linear-gradient(180deg, rgba(66,90,108,0.42), rgba(14,22,30,0.6))',
                boxShadow: on ? `0 0 110px rgba(196,230,248,${0.55 * glowIn})` : 'none',
              }}
            >
              <div style={{position: 'absolute', left: 8, right: 8, top: 8, height: 30, borderRadius: 6, background: on ? 'rgba(255,255,255,0.5)' : 'rgba(120,150,170,0.1)'}} />
            </div>
          );
        })}
        {/* the light it throws down the wall */}
        <div
          style={{
            position: 'absolute',
            left: 260,
            top: 300,
            width: 620,
            height: 1300,
            background: `radial-gradient(60% 60% at 50% 0%, rgba(196,228,246,${0.22 * glowIn}), transparent 72%)`,
            filter: 'blur(26px)',
            mixBlendMode: 'screen',
          }}
        />
        {/* her head and shoulders from below, cropped by the bottom edge */}
        <div style={{position: 'absolute', left: -120, top: 660, width: 980, height: 1560}}>
          <Iris rim={1.2} turn={-0.02} side="left" expression="weary" look="up" viewBox="160 30 300 533" preserve="xMidYMin slice" />
        </div>
        {/* the fixture light catching her shoulders, so the head is not a float */}
        <div
          style={{
            position: 'absolute',
            left: 60,
            top: 1460,
            width: 780,
            height: 520,
            background: 'radial-gradient(closest-side, rgba(176,214,238,0.4), transparent 74%)',
            filter: 'blur(46px)',
            mixBlendMode: 'screen',
          }}
        />
        {/* the fixture light landing on the top of her head */}
        <div
          style={{
            position: 'absolute',
            left: 190,
            top: 780,
            width: 420,
            height: 300,
            background: 'radial-gradient(closest-side, rgba(214,238,250,0.2), transparent 74%)',
            filter: 'blur(22px)',
            mixBlendMode: 'screen',
          }}
        />
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(64% 58% at 46% 34%, transparent 34%, rgba(2,5,9,0.88) 100%)'}} />
      </Cam>
    </Night>
  );
};

/* ------------------------------------------------------------------ */
/* 05-06 — the notebook                                                */
/* ------------------------------------------------------------------ */

const ShotNotebook: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s5;
  return (
    <Night f={f} glow="radial-gradient(900px 900px at 50% 40%, rgba(60,50,34,0.4), rgba(2,5,10,0) 72)">
      <Cam z={1.04 + smooth(clamp01(k / 120)) * 0.06} ox="50%" oy="44%">
        <Notebook f={f} open={smooth(clamp01(k / 26))} page={0} tilt={-2.4} />
      </Cam>
    </Night>
  );
};

const ShotPages: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s6;
  const turnPage = smooth(clamp01((k - 120) / 40));
  return (
    <Night f={f} glow="radial-gradient(860px 860px at 52% 42%, rgba(64,52,36,0.42), rgba(2,5,10,0) 72)">
      <Cam z={1.08 + smooth(clamp01(k / 210)) * 0.08} ox="52%" oy="38%">
        <Notebook f={f} open={1} page={turnPage} highlight={smooth(clamp01((k - 150) / 40))} tilt={-1.6} />
      </Cam>
    </Night>
  );
};

/* ------------------------------------------------------------------ */
/* 07 — the page that says 12:01                                       */
/* ------------------------------------------------------------------ */

const ShotMinute: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s7;
  return (
    <Night f={f} glow="radial-gradient(820px 820px at 56% 40%, rgba(70,54,36,0.44), rgba(2,5,10,0) 72)">
      <Cam z={1.12 + smooth(clamp01(k / 130)) * 0.08} ox="60%" oy="34%">
        <Notebook f={f} open={1} page={1} highlight={1} tilt={-1} />
        {/* her finger, at the margin, holding the page down */}
        <div
          style={{
            position: 'absolute',
            right: -60,
            bottom: -40,
            width: 460,
            height: 420,
            transform: 'rotate(-18deg)',
            transformOrigin: '80% 80%',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 90,
              top: 120,
              width: 420,
              height: 190,
              borderRadius: 90,
              background: 'linear-gradient(180deg,#39454F 0%,#222C35 54%,#0D1319 100%)',
              boxShadow: 'inset 0 2px 0 rgba(190,216,232,0.16)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: -10,
              top: 96,
              width: 200,
              height: 220,
              borderRadius: '70px 60px 40px 40px',
              background: 'linear-gradient(160deg,#6E5744 0%,#4A382B 56%,#281E17 100%)',
            }}
          />
          <div style={{position: 'absolute', left: -60, top: 120, width: 130, height: 56, borderRadius: 28, background: 'linear-gradient(160deg,#755C48,#3C2C21)'}} />
        </div>
      </Cam>
    </Night>
  );
};

/* ------------------------------------------------------------------ */
/* 08 — what the prison is                                             */
/* ------------------------------------------------------------------ */

const ShotWhisper: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s8;
  return (
    <Night f={f} glow="radial-gradient(820px 1000px at 42% 34%, rgba(70,120,152,0.4), rgba(2,5,10,0) 74)">
      <Cam z={1.03 + smooth(clamp01(k / 76)) * 0.06} ox="42%" oy="30%">
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(178deg,#080F16,#04070B 70%)'}} />
        <div
          style={{
            position: 'absolute',
            right: 40,
            top: 260,
            width: 420,
            height: 1300,
            background: 'linear-gradient(180deg, rgba(150,200,228,0.16), rgba(40,70,96,0.04))',
            filter: 'blur(12px)',
          }}
        />
        <div style={{position: 'absolute', left: 20, top: 300, width: 1040, height: 1560}}>
          <Iris rim={1.7} turn={-0.12} side="right" expression="whisper" look="camera" mouth={0.18} viewBox="168 46 300 533" preserve="xMidYMin slice" />
        </div>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(58% 52% at 44% 34%, transparent 28%, rgba(2,5,9,0.92) 100%)',
          }}
        />
      </Cam>
    </Night>
  );
};

/* ------------------------------------------------------------------ */
/* 09 — footsteps behind the wall                                      */
/* ------------------------------------------------------------------ */

const ShotFootsteps: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s9;
  const fade = smooth(clamp01((f - FADE) / 14));
  const pass = smooth(clamp01((k - 10) / 40));
  return (
    <Night f={f} glow="radial-gradient(760px 900px at 50% 40%, rgba(24,54,76,0.34), rgba(2,5,10,0) 72)">
      <Cam z={1.03 + smooth(clamp01(k / 84)) * 0.05} ox="50%" oy="42%">
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg,#070D13,#03070B)'}} />
        {/* the wall, panels, a seam of light at the floor */}
        {Array.from({length: 4}).map((_, i) => (
          <div key={i} style={{position: 'absolute', left: -20 + i * 300, top: 0, bottom: 0, width: 300, background: 'rgba(58,84,102,0.05)', boxShadow: 'inset -1px 0 0 rgba(130,168,196,0.07)'}} />
        ))}
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 420, height: 8, background: 'rgba(140,186,214,0.16)'}} />
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 300, height: 140, background: 'linear-gradient(180deg, transparent, rgba(140,186,214,0.1))', filter: 'blur(12px)'}} />
        {/* a shadow crossing behind the seam, in step */}
        <div
          style={{
            position: 'absolute',
            left: 1220 - pass * 1900,
            bottom: 380,
            width: 340,
            height: 1500,
            borderRadius: '50% 50% 0 0',
            background: 'radial-gradient(60% 60% at 50% 40%, rgba(2,5,8,0.7), rgba(2,5,8,0) 76%)',
            filter: 'blur(18px)',
          }}
        />
        {/* Iris's head and shoulder at the left edge, listening */}
        <div style={{position: 'absolute', left: -350, top: -210, width: 880, height: 2060}}>
          <Iris rim={0.9} turn={0.1} side="left" expression="calm" look="down" />
        </div>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(64% 58% at 54% 44%, transparent 30%, rgba(2,5,9,0.9) 100%)',
          }}
        />
        {fade > 0 ? <AbsoluteFill style={{background: '#000', opacity: fade}} /> : null}
      </Cam>
    </Night>
  );
};

/* ------------------------------------------------------------------ */

export const S02E05: React.FC = () => {
  const f = useCurrentFrame();
  const shot =
    f < C.s2 ? (
      <ShotWaiting f={f} />
    ) : f < C.s3 ? (
      <ShotBracelet f={f} />
    ) : f < C.s4 ? (
      <ShotIrisName f={f} />
    ) : f < C.s5 ? (
      <ShotCeiling f={f} />
    ) : f < C.s6 ? (
      <ShotNotebook f={f} />
    ) : f < C.s7 ? (
      <ShotPages f={f} />
    ) : f < C.s8 ? (
      <ShotMinute f={f} />
    ) : f < C.s9 ? (
      <ShotWhisper f={f} />
    ) : (
      <ShotFootsteps f={f} />
    );

  return (
    <AbsoluteFill style={{background: '#02050A'}}>
      <Audio src={staticFile('audio/s02e05.mp3')} />
      <Grade lift={1.18} contrast={1.04}>{shot}</Grade>
      {/* black tail: the film ends in black, and it ends inside the audio */}
      <AbsoluteFill
        style={{background: '#000', opacity: smooth(clamp01((f - (C.total - 26)) / 13))}}
      />
      {f < C.total - 26 ? <Watermark /> : null}
    </AbsoluteFill>
  );
};
