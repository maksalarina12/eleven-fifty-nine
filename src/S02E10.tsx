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
} from './kit';
import {Night, Haze, Waveform, Grade} from './kit2';
import {MapWall} from './kit3';

/* ------------------------------------------------------------------ */
/* S02E10 — THE OTHER SIDE                                             */
/* 46.880 s of real narration -> 1406 frames. 15 shots.                */
/* Cuts on measured word boundaries (Whisper base.en).                 */
/* ------------------------------------------------------------------ */

const C = {
  s1: 0, // Amara entered Eden's central control room as the network map expanded.
  s2: 162, // Noah stood beside her, motionless.
  s3: 252, // His scar was in the right place.
  s4: 318, // His voice was the same,
  s5: 364, // but he had not blinked once.
  s6: 445, // Amara asked him about a memory only they shared.
  s7: 551, // "You told me the world outside was already gone," he answered.
  s8: 667, // She had never told this Noah that.
  s9: 750, // She had told it to a memory that was supposed to be erased.
  s10: 849, // Every monitor turned on.
  s11: 915, // The map spread beyond their city, beyond the coast,
  s12: 1008, // across hundreds of identical sites.
  s13: 1068, // A signal appeared far out at sea.
  s14: 1164, // A voice spoke from the speakers. Eden was never contained.
  s15: 1297, // The final screen displayed: Phase 3 is waiting.
  total: 1406,
};

const FADE = 1390;

/* ------------------------------------------------------------------ */
/* the room                                                            */
/* ------------------------------------------------------------------ */

/* a wall of monitors, most of them still dark */
const MonitorWall: React.FC<{f: number; on: number; rows?: number; cols?: number}> = ({
  f,
  on,
  rows = 4,
  cols = 3,
}) => (
  <div style={{position: 'absolute', inset: 0}}>
    {Array.from({length: rows * cols}).map((_, i) => {
      const k = i / (rows * cols);
      const lit = clamp01((on * 1.35 - k) / 0.28);
      const col = i % cols;
      const row = Math.floor(i / cols);
      return (
        <Monitor
          key={i}
          inset={7}
          radius={5}
          style={{
            position: 'absolute',
            left: 96 + col * 306,
            top: 300 + row * 300,
            width: 282,
            height: 270,
            filter: `brightness(${0.5 + lit * 0.7})`,
          }}
        >
          <div style={{position: 'absolute', inset: 0, background: '#040A0F'}}>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: `radial-gradient(90% 80% at 50% 42%, rgba(126,196,228,${0.06 + lit * 0.24}) 0%, rgba(4,10,16,0.9) 74%)`,
              }}
            />
            {/* a trace, but only on screens that are on */}
            <div style={{opacity: 0.25 + lit * 0.75}}>
              <Waveform f={f + i * 9} beat={0.4 + lit * 0.4} />
            </div>
            <div
              style={{
                position: 'absolute',
                left: 18,
                top: 22,
                width: 96,
                height: 5,
                background: `rgba(180,224,244,${0.05 + lit * 0.4})`,
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 18,
                top: 40,
                width: 140,
                height: 4,
                background: `rgba(150,196,224,${0.04 + lit * 0.22})`,
              }}
            />
          </div>
        </Monitor>
      );
    })}
  </div>
);

/* the desk that faces the wall; two people stand behind it */
const ConsoleDesk: React.FC<{f: number; glow?: number}> = ({f, glow = 0.4}) => (
  <>
    <div
      style={{
        position: 'absolute',
        left: -80,
        right: -80,
        top: 1420,
        height: 620,
        borderRadius: '40% 40% 0 0',
        background: 'linear-gradient(180deg,#16202A 0%,#0A1118 48%,#04080D 100%)',
        boxShadow: 'inset 0 3px 0 rgba(170,206,228,0.16), 0 -30px 90px rgba(0,0,0,0.9)',
      }}
    />
    {/* the lip of the desk, catching the wall light */}
    <div
      style={{
        position: 'absolute',
        left: -80,
        right: -80,
        top: 1420,
        height: 5,
        background: `rgba(190,224,242,${0.1 + glow * 0.2})`,
        filter: 'blur(1px)',
      }}
    />
    {/* recessed controls set into it */}
    {[0, 1, 2, 3, 4].map((i) => (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: 150 + i * 176,
          top: 1520 + rnd(i) * 40,
          width: 118,
          height: 66,
          borderRadius: 6,
          background: 'linear-gradient(180deg,#0B141C,#050A0F)',
          boxShadow: 'inset 0 0 0 1px rgba(150,196,224,0.1)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 14,
            top: 16,
            width: 74 + rnd(i + 3) * 20,
            height: 4,
            background: `rgba(150,214,240,${0.12 + Math.sin(f / 26 + i) * 0.06 + glow * 0.14})`,
          }}
        />
      </div>
    ))}
  </>
);

/* ------------------------------------------------------------------ */
/* 01 — the room, the map                                             */
/* ------------------------------------------------------------------ */

const ShotRoom: React.FC<{f: number}> = ({f}) => {
  const enter = smooth(clamp01(f / 110));
  return (
    <Night f={f} glow="radial-gradient(1200px 1200px at 52% 40%, rgba(24,62,88,0.44), rgba(2,5,10,0) 76)">
      <Cam z={1.02 + smooth(clamp01(f / 160)) * 0.05} ox="52%" oy="42%">
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(178deg,#08121A 0%,#050B12 60%,#02060A 100%)'}} />
        {/* the map already spreading across the far wall */}
        <div style={{position: 'absolute', left: -40, top: 140, width: 1160, height: 1320, opacity: 1, filter: 'brightness(1.25)'}}>
          <MapWall f={f} reveal={smooth(clamp01(f / 60))} spread={0.15 + enter * 0.35} rings={0.4} />
        </div>
        {/* its light spilling into the room */}
        <div style={{position: 'absolute', left: 0, right: 0, top: 140, height: 1500, background: 'linear-gradient(180deg, rgba(120,186,222,0.2), rgba(40,80,104,0.06) 46%, transparent 76%)'}} />
        <div style={{position: 'absolute', left: 0, right: 0, top: 1200, height: 6, background: 'rgba(170,206,228,0.18)'}} />
        <ConsoleDesk f={f} glow={0.3 + enter * 0.3} />
        {/* Amara, entering from the left, from behind */}
        <div
          style={{
            position: 'absolute',
            left: -110 + enter * 60,
            top: 900,
            width: 560,
            height: 1200,
            filter: 'brightness(1.25)',
          }}
        >
          <AmaraBack rim={1.3} viewBox="0 0 300 700" preserve="xMidYMax slice" />
        </div>
        <Haze x="52%" y="38%" size={900} color="rgba(110,175,208,0.12)" />
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(74% 64% at 52% 42%, transparent 38%, rgba(2,5,9,0.86) 100%)'}} />
      </Cam>
    </Night>
  );
};

/* ------------------------------------------------------------------ */
/* 02 — he stands beside her, motionless                               */
/* ------------------------------------------------------------------ */

const ShotStanding: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s2;
  return (
    <Night f={f} glow="radial-gradient(1000px 1000px at 44% 40%, rgba(26,64,90,0.44), rgba(2,5,10,0) 74)">
      <Cam z={1.03 + smooth(clamp01(k / 88)) * 0.05} ox="44%" oy="38%">
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(178deg,#070F16 0%,#04090F 62%,#02060A 100%)'}} />
        {/* the room behind them, defocused */}
        <div style={{position: 'absolute', inset: -60, filter: 'blur(24px) brightness(0.5)', transform: 'scale(1.14)'}}>
          <div style={{position: 'absolute', left: 0, top: 260, right: 0, height: 900, background: 'linear-gradient(180deg,#0D2030,#050C12)'}} />
          {Array.from({length: 9}).map((_, i) => (
            <div key={i} style={{position: 'absolute', left: 40 + (i % 3) * 330, top: 320 + Math.floor(i / 3) * 280, width: 260, height: 220, background: 'rgba(120,190,224,0.14)'}} />
          ))}
        </div>

        {/* Noah, standing, facing us, not moving */}
        <div style={{position: 'absolute', left: 300, top: 300, width: 700, height: 1500}}>
          <Noah
            expression="neutral"
            look="camera"
            turn={0}
            rim={0.95}
            lidOverride={0}
            viewBox="152 18 296 560"
            preserve="xMidYMax slice"
          />
        </div>
        {/* her shoulder at the left edge, so he is not alone in the room */}
        <div style={{position: 'absolute', left: -170, top: 1180, width: 460, height: 900, borderRadius: '0 52% 0 0', background: 'linear-gradient(102deg,#0A1118,#04090E 68%)', filter: 'blur(4px)'}} />
        <div style={{position: 'absolute', left: 210, top: 1200, width: 14, height: 700, background: 'linear-gradient(180deg, rgba(190,222,240,0.2), transparent 76%)', filter: 'blur(3px)'}} />
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(62% 56% at 44% 38%, transparent 28%, rgba(2,5,9,0.92) 100%)'}} />
      </Cam>
    </Night>
  );
};

/* ------------------------------------------------------------------ */
/* 03-05 — the scar, the voice, the eyes                               */
/* ------------------------------------------------------------------ */

const ShotScar: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s3;
  return (
    <Night f={f} glow="radial-gradient(700px 740px at 48% 44%, rgba(42,78,102,0.5), rgba(2,5,10,0) 72)" grain={0.06}>
      <Cam z={1.03 + smooth(clamp01(k / 66)) * 0.07} ox="50%" oy="42%">
        <div style={{position: 'absolute', inset: 0}}>
          <Noah
            expression="neutral"
            look="camera"
            turn={0}
            rim={0.8}
            lidOverride={0}
            viewBox="232 96 196 348"
            preserve="xMidYMid slice"
          />
        </div>
        {/* the wall light behind him, well out of focus: the brow is lit by the room, not a lamp */}
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(52% 46% at 48% 40%, transparent 16%, rgba(2,5,9,0.95) 100%)'}} />
        <div style={{position: 'absolute', left: '62%', top: 0, right: 0, height: '100%', background: 'linear-gradient(90deg, rgba(2,5,9,0) 0%, rgba(2,5,9,0.34) 46%, rgba(2,5,9,0.62) 100%)'}} />
        <div style={{position: 'absolute', left: 0, top: 0, width: '34%', height: '100%', background: 'linear-gradient(270deg, rgba(2,5,9,0) 0%, rgba(2,5,9,0.4) 100%)'}} />
      </Cam>
    </Night>
  );
};

const ShotVoice: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s4;
  return (
    <Night f={f} glow="radial-gradient(760px 800px at 58% 42%, rgba(34,70,94,0.46), rgba(2,5,10,0) 72)">
      <Cam z={1.03 + smooth(clamp01(k / 46)) * 0.05} ox="58%" oy="40%">
        <div style={{position: 'absolute', inset: 0}}>
          <Noah
            expression="neutral"
            look="camera"
            turn={-0.62}
            rim={1.4}
            lidOverride={0}
            viewBox="150 34 300 500"
            preserve="xMidYMid slice"
          />
        </div>
        {/* the light he is answering into, off to the right */}
        <div style={{position: 'absolute', right: -140, top: 320, width: 520, height: 1000, background: 'radial-gradient(closest-side, rgba(132,196,228,0.2), transparent 74%)', filter: 'blur(34px)', mixBlendMode: 'screen'}} />
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(60% 54% at 56% 40%, transparent 26%, rgba(2,5,9,0.92) 100%)'}} />
      </Cam>
    </Night>
  );
};

const ShotEyes: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s5;
  /* he never blinks: the lid stays open, and the only movement is the room */
  const strain = 0.02 + Math.sin(k / 9) * 0.02;
  return (
    <Night f={f} glow="radial-gradient(760px 700px at 50% 44%, rgba(38,76,100,0.46), rgba(2,5,10,0) 72)" grain={0.05}>
      <Cam z={1.04 + smooth(clamp01(k / 80)) * 0.08} ox="50%" oy="42%">
        <div style={{position: 'absolute', inset: 0}}>
          <Noah
            expression="neutral"
            look="camera"
            turn={0}
            rim={1}
            lidOverride={strain}
            viewBox="220 94 172 306"
            preserve="xMidYMid slice"
          />
        </div>
        {/* two small reflections in the eyes, from the wall */}
        <div style={{position: 'absolute', left: 280, top: 640, width: 190, height: 130, background: 'radial-gradient(closest-side, rgba(214,240,252,0.16), transparent 72%)', filter: 'blur(16px)', mixBlendMode: 'screen'}} />
        <div style={{position: 'absolute', left: 610, top: 640, width: 190, height: 130, background: 'radial-gradient(closest-side, rgba(214,240,252,0.16), transparent 72%)', filter: 'blur(16px)', mixBlendMode: 'screen'}} />
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(58% 50% at 50% 42%, transparent 22%, rgba(2,5,9,0.93) 100%)'}} />
        <div style={{position: 'absolute', left: '58%', top: 0, right: 0, height: '100%', background: 'linear-gradient(90deg, rgba(2,5,9,0) 0%, rgba(2,5,9,0.5) 100%)'}} />
        <div style={{position: 'absolute', left: 0, top: 0, width: '30%', height: '100%', background: 'linear-gradient(270deg, rgba(2,5,9,0) 0%, rgba(2,5,9,0.5) 100%)'}} />
      </Cam>
    </Night>
  );
};

/* ------------------------------------------------------------------ */
/* 06 — she asks                                                      */
/* ------------------------------------------------------------------ */

const ShotAsk: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s6;
  const murmur = talk(f, C.s6 + 22, C.s7 - 6, 0.18, 2.4);
  return (
    <Night f={f} glow="radial-gradient(760px 880px at 44% 38%, rgba(44,80,106,0.46), rgba(2,5,10,0) 72)">
      <Cam z={1.04 + smooth(clamp01(k / 100)) * 0.05} ox="44%" oy="36%">
        <div style={{position: 'absolute', inset: 0}}>
          <Amara
            expression="guarded"
            look="right"
            turn={0.3}
            screen={0.62}
            rim={1.35}
            lidOverride={0.06}
            mouth={murmur}
            viewBox="168 44 256 430"
            preserve="xMidYMid slice"
          />
        </div>
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(26,62,86,0.14), transparent 44%, rgba(3,7,10,0.5))'}} />
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(58% 52% at 44% 36%, transparent 26%, rgba(2,5,9,0.92) 100%)'}} />
      </Cam>
    </Night>
  );
};

/* ------------------------------------------------------------------ */
/* 07-08 — the answer, and what it means                               */
/* ------------------------------------------------------------------ */

const ShotAnswer: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s7;
  const speak = talk(f, C.s7 + 14, C.s8 - 8, 0.2, 2.7);
  return (
    <Night f={f} glow="radial-gradient(820px 900px at 52% 40%, rgba(30,70,96,0.46), rgba(2,5,10,0) 72)">
      <Cam z={1.03 + smooth(clamp01(k / 112)) * 0.06} ox="52%" oy="38%">
        <div style={{position: 'absolute', inset: 0}}>
          <Noah
            expression="neutral"
            look="camera"
            mouth={speak}
            turn={-0.08}
            rim={1.1}
            lidOverride={0}
            viewBox="166 28 268 470"
            preserve="xMidYMid slice"
          />
        </div>
        {/* the wall light on the side of his face that is lying */}
        <div style={{position: 'absolute', right: -80, top: 340, width: 460, height: 900, background: 'radial-gradient(closest-side, rgba(126,190,224,0.16), transparent 74%)', filter: 'blur(30px)', mixBlendMode: 'screen'}} />
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(60% 54% at 52% 38%, transparent 26%, rgba(2,5,9,0.92) 100%)'}} />
      </Cam>
    </Night>
  );
};

const ShotNeverTold: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s8;
  const drift = smooth(clamp01(k / 80));
  return (
    <Night f={f} glow="radial-gradient(700px 820px at 42% 40%, rgba(40,72,96,0.42), rgba(2,5,10,0) 72)" grain={0.07}>
      <Cam z={1.05 + drift * 0.05} ox="42%" oy="36%">
        <div style={{position: 'absolute', inset: 0}}>
          <Amara
            expression="guarded"
            look="down"
            turn={-0.16}
            screen={0.44}
            rim={1.2}
            lidOverride={0.3}
            mouth={0.02}
            viewBox="186 60 232 390"
            preserve="xMidYMid slice"
          />
        </div>
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(14,34,48,0.24), transparent 44%, rgba(3,7,10,0.56))'}} />
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(56% 50% at 42% 38%, transparent 22%, rgba(2,5,9,0.94) 100%)'}} />
      </Cam>
    </Night>
  );
};

/* ------------------------------------------------------------------ */
/* 09 — a memory that was supposed to be erased                        */
/* ------------------------------------------------------------------ */

const ShotErased: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s9;
  const burn = smooth(clamp01((k - 18) / 60));
  return (
    <Night f={f} glow="radial-gradient(820px 900px at 48% 44%, rgba(26,58,80,0.4), rgba(2,5,10,0) 72)">
      <Cam z={1.02 + smooth(clamp01(k / 96)) * 0.05} ox="48%" oy="44%">
        {/* the dark glass of a monitor that has been wiped */}
        <div style={{position: 'absolute', left: 60, right: 60, top: 380, bottom: 420, borderRadius: 12, background: 'linear-gradient(168deg,#0A1620 0%,#050C12 58%,#02060A 100%)', boxShadow: 'inset 0 0 120px rgba(0,0,0,0.9), 0 0 0 2px rgba(140,182,208,0.14)'}}>
          {/* the last frame of the memory, almost gone */}
          <div style={{position: 'absolute', left: 120, top: 160, width: 720, height: 700, opacity: 0.4 - burn * 0.3, filter: `blur(${1 + burn * 5}px) grayscale(0.4)`}}>
            <div style={{position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, background: 'radial-gradient(70% 60% at 48% 40%, rgba(150,196,222,0.16), transparent 74%)'}} />
            <div style={{position: 'absolute', left: 250, top: 120, width: 220, height: 260, borderRadius: '48% 48% 44% 44%', background: 'rgba(160,196,216,0.14)'}} />
            <div style={{position: 'absolute', left: 180, top: 360, width: 360, height: 340, borderRadius: '40% 40% 0 0', background: 'rgba(120,158,180,0.1)'}} />
          </div>
          {/* the erase bar, sweeping down */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: `${8 + ((f * 1.8) % 96)}%`,
              height: 90,
              background: 'linear-gradient(180deg, transparent, rgba(210,238,250,0.12), transparent)',
            }}
          />
          {Array.from({length: 16}).map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: rnd(i) * 980,
                top: rnd(i + 5) * 1080,
                width: 40 + rnd(i + 2) * 180,
                height: 5,
                background: `rgba(180,216,236,${0.05 + rnd(i + 8) * 0.1})`,
              }}
            />
          ))}
          <Scanlines opacity={0.22} />
          <ScreenGlass strength={0.5} />
        </div>
        {/* her shoulder, near, rimmed by the wiped screen */}
        <div style={{position: 'absolute', left: -160, top: 1240, width: 900, height: 900, borderRadius: '0 54% 0 0', background: 'linear-gradient(100deg,#0A1118,#05090E 68%)', filter: 'blur(4px)'}} />
        <div style={{position: 'absolute', left: 640, top: 1260, width: 16, height: 700, background: 'linear-gradient(180deg, rgba(190,222,240,0.18), transparent 76%)', filter: 'blur(3px)'}} />
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(64% 58% at 48% 44%, transparent 32%, rgba(2,5,9,0.9) 100%)'}} />
      </Cam>
    </Night>
  );
};

/* ------------------------------------------------------------------ */
/* 10 — every monitor turned on                                        */
/* ------------------------------------------------------------------ */

const ShotOn: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s10;
  const on = smooth(clamp01(k / 52));
  return (
    <Night f={f} glow={`radial-gradient(1100px 1100px at 50% 40%, rgba(40,96,128,${0.3 + on * 0.22}), rgba(2,5,10,0) 76)`}>
      <Cam z={1.02 + smooth(clamp01(k / 66)) * 0.06} ox="50%" oy="40%">
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(178deg,#050B11 0%,#04080D 62%,#02060A 100%)'}} />
        <MonitorWall f={f} on={on} rows={4} cols={3} />
        {/* the light of them landing on the room */}
        <div style={{position: 'absolute', left: 0, right: 0, top: 300, height: 900, background: `radial-gradient(70% 60% at 50% 40%, rgba(120,190,224,${0.06 + on * 0.16}), transparent 78%)`, mixBlendMode: 'screen'}} />
        <ConsoleDesk f={f} glow={0.4 + on * 0.5} />
        {/* the backs of their heads, small, at the bottom of frame */}
        <div style={{position: 'absolute', left: 150, top: 1290, width: 300, height: 700, filter: 'brightness(0.4) blur(0.8px)'}}>
          <AmaraBack rim={0.9} viewBox="0 0 300 700" preserve="xMidYMax slice" />
        </div>
        <div style={{position: 'absolute', left: 470, top: 1330, width: 280, height: 660, filter: 'brightness(0.36) blur(0.8px)'}}>
          <svg viewBox="0 0 280 660" width="100%" height="100%">
            <path d="M 70 660 L 74 380 C 78 326 98 300 140 292 C 182 300 202 326 206 380 L 210 660 Z" fill="#050A0F" />
            <ellipse cx={140} cy={244} rx={66} ry={74} fill="#04080C" />
            <path d="M 74 380 C 78 326 98 300 140 292" stroke="rgba(180,214,234,0.4)" strokeWidth={3} fill="none" />
          </svg>
        </div>
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(70% 62% at 50% 42%, transparent 34%, rgba(2,5,9,0.86) 100%)'}} />
      </Cam>
    </Night>
  );
};

/* ------------------------------------------------------------------ */
/* 11-12 — the map, and the hundreds of sites                          */
/* ------------------------------------------------------------------ */

const ShotMapSpread: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s11;
  const spread = smooth(clamp01(k / 88));
  return (
    <Night f={f} glow="radial-gradient(1000px 1000px at 50% 46%, rgba(32,82,110,0.46), rgba(2,5,10,0) 74)">
      <Cam z={1.03 + spread * 0.07} ox="50%" oy="46%">
        <MapWall f={f} reveal={1} spread={0.5 + spread * 0.42} rings={spread} />
        {[0, 1, 2].map((i) => {
          const p = ((f * 1.1 + i * 30) % 92) / 92;
          const r = 60 + p * 780;
          return (
            <div key={i} style={{position: 'absolute', left: 540 - r, top: 960 - r, width: r * 2, height: r * 2, borderRadius: '50%', border: `1.5px solid rgba(150,214,240,${(1 - p) * 0.24})`}} />
          );
        })}
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(76% 66% at 50% 46%, transparent 38%, rgba(2,5,9,0.84) 100%)'}} />
      </Cam>
    </Night>
  );
};

const ShotSites: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s12;
  const spread = smooth(clamp01(k / 54));
  return (
    <Night f={f} glow="radial-gradient(900px 900px at 50% 48%, rgba(28,74,100,0.42), rgba(2,5,10,0) 72)">
      <Cam z={1.06 + spread * 0.08} ox="50%" oy="48%">
        <div style={{position: 'absolute', inset: 0, background: '#03080D'}} />
        {/* the same site, repeated across the hemisphere */}
        {Array.from({length: 30}).map((_, i) => {
          const col = i % 6;
          const row = Math.floor(i / 6);
          const on = clamp01((spread * 34 - i) / 3);
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 64 + col * 168,
                top: 420 + row * 210,
                width: 132,
                height: 132,
                borderRadius: 8,
                background: 'linear-gradient(180deg, rgba(20,44,60,0.5), rgba(4,10,16,0.9))',
                boxShadow: `inset 0 0 0 1px rgba(150,196,224,${0.1 + on * 0.2})`,
              }}
            >
              {/* the identical node inside every one */}
              <div style={{position: 'absolute', left: 46, top: 34, width: 40, height: 40, borderRadius: '50%', background: `rgba(196,232,248,${0.08 + on * 0.7})`, boxShadow: on > 0.3 ? '0 0 22px rgba(180,226,248,0.5)' : 'none'}} />
              <div style={{position: 'absolute', left: 24, top: 92, width: 84 - (1 - on) * 50, height: 4, background: `rgba(160,210,236,${0.12 + on * 0.4})`}} />
            </div>
          );
        })}
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(72% 64% at 50% 48%, transparent 34%, rgba(2,5,9,0.88) 100%)'}} />
      </Cam>
    </Night>
  );
};

/* ------------------------------------------------------------------ */
/* 13 — a signal, far out at sea                                       */
/* ------------------------------------------------------------------ */

const ShotSignal: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s13;
  const rise = smooth(clamp01((k - 10) / 70));
  return (
    <Night f={f} glow="radial-gradient(900px 700px at 52% 62%, rgba(14,34,50,0.5), rgba(2,5,10,0) 74)" grain={0.08}>
      <Cam z={1.0 + smooth(clamp01(k / 90)) * 0.06} ox="52%" oy="64%">
        {/* the sea, flat and almost black */}
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg,#02060A 0%,#03090F 46%,#040C12 62%,#02060A 100%)'}} />
        {/* where the sky meets the water */}
        <div style={{position: 'absolute', left: 0, right: 0, top: 900, height: 2, background: 'rgba(120,164,192,0.16)'}} />
        <div style={{position: 'absolute', left: 0, right: 0, top: 902, height: 300, background: 'linear-gradient(180deg, rgba(90,140,168,0.1), transparent 74%)'}} />
        {/* slow swells, one or two of them catching light */}
        {Array.from({length: 9}).map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: -40 + rnd(i) * 200,
              right: -40 + rnd(i + 3) * 200,
              top: 940 + i * 96,
              height: 3,
              background: `linear-gradient(90deg, transparent, rgba(140,184,210,${0.05 + rnd(i + 6) * 0.06}), transparent)`,
              transform: `translateX(${Math.sin(f / 60 + i) * 14}px)`,
            }}
          />
        ))}
        {/* the signal: one point, beyond the horizon line */}
        <div style={{position: 'absolute', left: 508, top: 700, width: 64, height: 64, borderRadius: '50%', background: `rgba(214,240,252,${0.1 + rise * 0.6})`, boxShadow: `0 0 ${40 + rise * 70}px rgba(190,230,248,${0.2 + rise * 0.5})`}} />
        <div style={{position: 'absolute', left: 480, top: 672, width: 120, height: 120, borderRadius: '50%', border: `1.5px solid rgba(200,236,252,${rise * 0.3})`}} />
        {/* its reflection, broken on the water */}
        <div style={{position: 'absolute', left: 516, top: 760, width: 48, height: 320, background: `linear-gradient(180deg, rgba(206,238,250,${0.18 * rise}), transparent 82%)`, filter: 'blur(6px)'}} />
        {/* the dark room we are watching it from, at the edges */}
        <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 240, background: 'linear-gradient(180deg,#02050A,rgba(2,5,10,0))'}} />
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 420, background: 'linear-gradient(180deg, transparent, #02050A)'}} />
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(66% 58% at 50% 56%, transparent 32%, rgba(2,5,9,0.9) 100%)'}} />
      </Cam>
    </Night>
  );
};

/* ------------------------------------------------------------------ */
/* 14 — a voice from the speakers                                      */
/* ------------------------------------------------------------------ */

const ShotSpeakers: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s14;
  const speak = smooth(clamp01((k - 20) / 40));
  return (
    <Night f={f} glow="radial-gradient(820px 800px at 50% 44%, rgba(26,58,78,0.44), rgba(2,5,10,0) 72)">
      <Cam z={1.02 + smooth(clamp01(k / 130)) * 0.06} ox="50%" oy="42%">
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg,#060D14,#03080D 68%)'}} />
        {/* the ceiling above: two speaker grilles, and the wall beyond */}
        <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 560, background: 'linear-gradient(180deg,#0A141C,#050B11)'}} />
        <div style={{position: 'absolute', left: 0, right: 0, top: 556, height: 3, background: 'rgba(140,178,204,0.14)'}} />
        {[
          {x: 150, y: 150, s: 1},
          {x: 700, y: 96, s: 0.86},
        ].map((sp, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: sp.x,
              top: sp.y,
              width: 250 * sp.s,
              height: 250 * sp.s,
              borderRadius: '50%',
              background: 'linear-gradient(168deg,#16222B 0%,#0A1217 62%,#04080C 100%)',
              boxShadow: 'inset 0 0 0 2px rgba(140,178,204,0.16), 0 22px 50px rgba(0,0,0,0.8)',
            }}
          >
            {Array.from({length: 7}).map((_, r) => (
              <div
                key={r}
                style={{
                  position: 'absolute',
                  left: 26,
                  right: 26,
                  top: 40 + r * 24,
                  height: 2,
                  background: `rgba(150,190,214,${0.06 + speak * 0.05 + Math.sin(f / 14 + r) * 0.03})`,
                }}
              />
            ))}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                background: `radial-gradient(closest-side, rgba(180,222,244,${0.04 + speak * 0.12}), transparent 74%)`,
              }}
            />
          </div>
        ))}
        {/* the sound itself: faint rings leaving the nearer grille */}
        {[0, 1, 2].map((i) => {
          const p = ((f * 1.5 + i * 26) % 70) / 70;
          const r = 130 + p * 420;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 275 - r,
                top: 275 - r,
                width: r * 2,
                height: r * 2,
                borderRadius: '50%',
                border: `1.5px solid rgba(170,214,238,${(1 - p) * 0.16 * (0.3 + speak)})`,
              }}
            />
          );
        })}
        {/* the room under it, and the edge of the desk */}
        <div style={{position: 'absolute', left: -60, right: -60, top: 1460, height: 560, borderRadius: '40% 40% 0 0', background: 'linear-gradient(180deg,#121C25,#060C12 60%,#03080D)', boxShadow: 'inset 0 3px 0 rgba(160,198,220,0.14)'}} />
        {/* a speaker waveform, small, in the dark beneath */}
        <div style={{position: 'absolute', left: 300, top: 1620, width: 480, height: 200, opacity: 0.5 + speak * 0.4}}>
          <Waveform f={f} beat={0.6 + speak * 0.4} />
        </div>
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(66% 60% at 50% 44%, transparent 30%, rgba(2,5,9,0.9) 100%)'}} />
      </Cam>
    </Night>
  );
};

/* ------------------------------------------------------------------ */
/* 15 — the final screen                                              */
/* ------------------------------------------------------------------ */

const ShotFinal: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s15;
  const on = smooth(clamp01(k / 22));
  const line = smooth(clamp01((k - 12) / 26));
  return (
    <Night f={f} glow={`radial-gradient(900px 900px at 50% 46%, rgba(46,96,120,${0.24 + on * 0.2}), rgba(2,5,10,0) 74)`} grain={0.07}>
      <Cam z={1.01 + smooth(clamp01(k / 100)) * 0.045} ox="50%" oy="46%">
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(178deg,#050B11,#03080D 66%,#02060A)'}} />
        {/* the last monitor, facing us */}
        <div style={{position: 'absolute', left: 56, right: 56, top: 430, bottom: 500, borderRadius: 14, background: 'linear-gradient(168deg,#0A151D,#050C12 62%,#03080D)', boxShadow: 'inset 0 0 120px rgba(0,0,0,0.92), 0 0 0 2px rgba(140,182,208,0.16), 0 40px 100px rgba(0,0,0,0.9)'}}>
          <div style={{position: 'absolute', inset: 14, background: '#040A0F', borderRadius: 6, overflow: 'hidden'}}>
            <div style={{position: 'absolute', inset: 0, background: `radial-gradient(80% 70% at 50% 46%, rgba(126,196,228,${0.08 + on * 0.16}) 0%, rgba(4,10,16,0.94) 76%)`}} />
            {/* the only words on the screen */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: '44%',
                textAlign: 'center',
                fontFamily: MONO,
                fontSize: 74,
                letterSpacing: '0.06em',
                color: `rgba(238,250,254,${0.2 + line * 0.76})`,
                textShadow: `0 0 34px rgba(134,196,224,${0.3 + line * 0.4})`,
                opacity: 0.35 + line * 0.65,
              }}
            >
              Phase 3 is waiting.
            </div>
            <Scanlines opacity={0.2} />
            <ScreenGlass strength={0.46} />
          </div>
        </div>
        {/* its light on the desk, and the room going dark around it */}
        <div style={{position: 'absolute', left: 0, right: 0, top: 1400, height: 520, background: `radial-gradient(60% 70% at 50% 0%, rgba(120,190,224,${0.06 + on * 0.12}), transparent 78%)`}} />
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(66% 60% at 50% 46%, transparent 30%, rgba(2,5,9,0.92) 100%)'}} />
      </Cam>
    </Night>
  );
};

/* ------------------------------------------------------------------ */

export const S02E10: React.FC = () => {
  const f = useCurrentFrame();
  const shot =
    f < C.s2 ? (
      <ShotRoom f={f} />
    ) : f < C.s3 ? (
      <ShotStanding f={f} />
    ) : f < C.s4 ? (
      <ShotScar f={f} />
    ) : f < C.s5 ? (
      <ShotVoice f={f} />
    ) : f < C.s6 ? (
      <ShotEyes f={f} />
    ) : f < C.s7 ? (
      <ShotAsk f={f} />
    ) : f < C.s8 ? (
      <ShotAnswer f={f} />
    ) : f < C.s9 ? (
      <ShotNeverTold f={f} />
    ) : f < C.s10 ? (
      <ShotErased f={f} />
    ) : f < C.s11 ? (
      <ShotOn f={f} />
    ) : f < C.s12 ? (
      <ShotMapSpread f={f} />
    ) : f < C.s13 ? (
      <ShotSites f={f} />
    ) : f < C.s14 ? (
      <ShotSignal f={f} />
    ) : f < C.s15 ? (
      <ShotSpeakers f={f} />
    ) : (
      <ShotFinal f={f} />
    );

  return (
    <AbsoluteFill style={{background: '#02050A'}}>
      <Audio src={staticFile('audio/s02e10.mp3')} />
      <Grade lift={1.28} contrast={1.04}>{shot}</Grade>
      {/* black tail: the film ends in black, and it ends inside the audio */}
      <AbsoluteFill
        style={{background: '#000', opacity: smooth(clamp01((f - (C.total - 26)) / 13))}}
      />
      {f < C.total - 26 ? <Watermark /> : null}
    </AbsoluteFill>
  );
};
