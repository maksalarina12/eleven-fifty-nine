import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {Amara} from './character/Amara';
import {Noah} from './character/Noah';
import {Cam} from './Episode';
import {Watermark, Scanlines, ScreenGlass, clamp01, smooth, blinkLid, rnd, MONO} from './kit';
import {Night, Haze, Waveform, Grade} from './kit2';
import {Machine, Shaft, LogScreen, Console, Iris} from './kit3';

/* ------------------------------------------------------------------ */
/* S02E07 — THE SOURCE                                                 */
/* 40.960 s of real narration -> 1228 frames. 10 shots.                */
/* Cuts on measured word boundaries (Whisper base.en).                 */
/* ------------------------------------------------------------------ */

const C = {
  s1: 0, // Beyond the partition was the machine that fed the city's memories.
  s2: 141, // Its cables disappeared into a shaft deeper than the building itself.
  s3: 283, // Iris called it the source.
  s4: 346, // Every reset was copied here before the subjects could remember it.
  s5: 471, // Amara found a familiar signature in the access logs, Dr. Elias.
  s6: 617, // But beneath his name was another authorization, a government seal.
  s7: 774, // Elias did not build this alone, Iris said.
  s8: 879, // Noah placed his hand against the console.
  s9: 958, // The machine recognized him as a master key, a voice filled the chamber.
  s10: 1095, // "Welcome home, original subject." The floor began to descend.
  total: 1228,
};

const FADE = 1212;

/* ------------------------------------------------------------------ */
/* 01 — the machine                                                    */
/* ------------------------------------------------------------------ */

const ShotMachine: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s1;
  return (
    <Night f={f} glow="radial-gradient(1000px 1100px at 52% 44%, rgba(28,70,96,0.46), rgba(2,5,10,0) 74)">
      <Cam z={1.02 + smooth(clamp01(k / 136)) * 0.05} ox="52%" oy="44%">
        <Machine f={f} glow={0.8} cables={0.9} />
        {/* Amara at the left edge, small against it */}
        <div style={{position: 'absolute', left: -210, top: 760, width: 560, height: 1500, filter: 'brightness(0.55) blur(1px)'}}>
          <Amara
            expression="focus"
            look="right"
            turn={0.4}
            screen={0.8}
            rim={0.9}
            lidOverride={blinkLid(f, 90)}
            mouth={0.02}
            viewBox="150 40 300 620"
            preserve="xMidYMax slice"
          />
        </div>
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(72% 62% at 52% 44%, transparent 38%, rgba(2,5,9,0.82) 100%)'}} />
        <Haze x="52%" y="46%" size={880} color="rgba(120,180,214,0.12)" />
      </Cam>
    </Night>
  );
};

/* ------------------------------------------------------------------ */
/* 02 — the shaft                                                      */
/* ------------------------------------------------------------------ */

const ShotShaft: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s2;
  return (
    <Night f={f} glow="radial-gradient(700px 1000px at 50% 46%, rgba(22,54,76,0.5), rgba(2,5,10,0) 72)">
      <Cam z={1.0 + smooth(clamp01(k / 140)) * 0.07} ox="50%" oy="52%">
        <Shaft f={f} lamp={0.9} cables={1} />
        {/* a single cable runs past the lens, close and out of focus */}
        <div style={{position: 'absolute', left: 0, top: 0, width: 300, height: 1920, filter: 'blur(3px)', opacity: 0.7}}>
          <div style={{position: 'absolute', left: 90, top: -60, width: 16, height: 2100, background: 'linear-gradient(90deg,#101820,#05090E)', transform: 'rotate(2deg)'}} />
          <div style={{position: 'absolute', left: 196, top: -60, width: 9, height: 2100, background: 'linear-gradient(90deg,#1A242E,#05090E)', transform: 'rotate(-1.4deg)'}} />
        </div>
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(64% 58% at 50% 50%, transparent 34%, rgba(2,5,9,0.9) 100%)'}} />
      </Cam>
    </Night>
  );
};

/* ------------------------------------------------------------------ */
/* 03 — Iris names it                                                  */
/* ------------------------------------------------------------------ */

const ShotIrisSource: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s3;
  return (
    <Night f={f} glow="radial-gradient(860px 1000px at 68% 40%, rgba(34,78,104,0.5), rgba(2,5,10,0) 74)">
      <Cam z={1.03 + smooth(clamp01(k / 60)) * 0.05} ox="62%" oy="36%">
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(176deg,#080F16 0%,#05090F 62%,#02060A 100%)'}} />
        {/* the machine glow, out of focus at the right */}
        <div style={{position: 'absolute', left: 640, top: 280, width: 620, height: 1400, background: 'radial-gradient(closest-side, rgba(120,190,224,0.34), transparent 74%)', filter: 'blur(50px)', mixBlendMode: 'screen'}} />
        <div style={{position: 'absolute', right: -40, top: 380, width: 260, height: 1180, background: 'linear-gradient(180deg, rgba(160,206,232,0.2), rgba(40,74,98,0.04))', filter: 'blur(18px)'}} />
        <div style={{position: 'absolute', left: 40, top: 226, width: 980, height: 1460}}>
          <Iris rim={1.6} turn={0.14} side="right" expression="stare" look="camera" viewBox="120 20 360 640" preserve="xMidYMin slice" />
        </div>
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(64% 58% at 44% 40%, transparent 30%, rgba(2,5,9,0.92) 100%)'}} />
      </Cam>
    </Night>
  );
};

/* ------------------------------------------------------------------ */
/* 04 — every reset was copied here                                    */
/* ------------------------------------------------------------------ */

const ShotCopy: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s4;
  const pulse = 0.6 + Math.sin(f / 9) * 0.4;
  return (
    <Night f={f} glow="radial-gradient(760px 860px at 46% 44%, rgba(30,80,110,0.5), rgba(2,5,10,0) 72)">
      <Cam z={1.04 + smooth(clamp01(k / 120)) * 0.07} ox="46%" oy="44%">
        <div style={{position: 'absolute', inset: 0, background: '#04070C'}} />
        {/* the housing, close up: ribs and copied light */}
        <div style={{position: 'absolute', left: -60, right: -60, top: 260, bottom: 240, background: 'linear-gradient(160deg,#1A242E 0%,#0C141C 54%,#050A10 100%)', boxShadow: 'inset 0 0 180px rgba(0,0,0,0.92)'}} />
        {Array.from({length: 5}).map((_, i) => (
          <div key={i} style={{position: 'absolute', left: 40 + i * 212, top: 260, bottom: 240, width: 14, background: 'linear-gradient(90deg, rgba(0,0,0,0.7), rgba(150,186,212,0.12), rgba(0,0,0,0.7))'}} />
        ))}
        {/* the core, seen from close */}
        <div style={{position: 'absolute', left: 240, top: 500, width: 600, height: 940, borderRadius: 22, background: 'linear-gradient(180deg,#0B1620,#050A10)', boxShadow: 'inset 0 0 90px rgba(0,0,0,0.9), 0 0 0 2px rgba(150,196,224,0.16)'}}>
          <div style={{position: 'absolute', left: 40, top: 40, right: 40, bottom: 40, borderRadius: 12, background: `linear-gradient(180deg, rgba(150,210,240,${0.24 + pulse * 0.18}), rgba(40,90,124,0.1))`, boxShadow: `0 0 ${90 + pulse * 40}px rgba(140,206,238,${0.3 + pulse * 0.2})`}} />
          {/* copied memories: thin strips falling through the light */}
          {Array.from({length: 9}).map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 66 + (i % 3) * 152,
                top: 90 + ((f * 1.6 + i * 96) % 700),
                width: 118,
                height: 6,
                background: `rgba(228,244,252,${0.14 + rnd(i) * 0.2})`,
                boxShadow: '0 0 12px rgba(180,222,244,0.3)',
              }}
            />
          ))}
          <Waveform f={f} beat={0.5} />
          <Scanlines opacity={0.16} />
          <ScreenGlass strength={0.4} />
        </div>
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(64% 58% at 48% 46%, transparent 34%, rgba(2,5,9,0.88) 100%)'}} />
      </Cam>
    </Night>
  );
};

/* ------------------------------------------------------------------ */
/* 05-06 — the logs, the signature, the seal                           */
/* ------------------------------------------------------------------ */

const ShotLogs: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s5;
  const reveal = smooth(clamp01((k + 10) / 60));
  return (
    <Night f={f} glow="radial-gradient(860px 900px at 50% 44%, rgba(30,76,104,0.44), rgba(2,5,10,0) 72)">
      <Cam z={1.02 + smooth(clamp01(k / 140)) * 0.05} ox="50%" oy="42%">
        <div style={{position: 'absolute', inset: 80, borderRadius: 18, overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.9), inset 0 0 0 2px rgba(150,196,224,0.2)'}}>
          <LogScreen f={f} reveal={reveal} seal={0} />
          <ScreenGlass strength={0.55} />
        </div>
        {/* her shoulder at the bottom left, rimmed by the screen */}
        <div style={{position: 'absolute', left: -180, top: 1180, width: 600, height: 900, borderRadius: '0 54% 0 0', background: 'linear-gradient(100deg,#0A1017,#05090E 68%)', filter: 'blur(4px)'}} />
        <div style={{position: 'absolute', left: 300, top: 1200, width: 16, height: 700, background: 'linear-gradient(180deg, rgba(196,226,242,0.26), transparent 76%)', filter: 'blur(3px)'}} />
      </Cam>
    </Night>
  );
};

const ShotSeal: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s6;
  const seal = smooth(clamp01((k - 18) / 40));
  return (
    <Night f={f} glow="radial-gradient(820px 880px at 56% 46%, rgba(34,74,96,0.44), rgba(2,5,10,0) 72)">
      <Cam z={1.04 + smooth(clamp01(k / 150)) * 0.06} ox="56%" oy="44%">
        <div style={{position: 'absolute', inset: 70, borderRadius: 18, overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.9), inset 0 0 0 2px rgba(150,196,224,0.2)'}}>
          <LogScreen f={f} reveal={1} seal={seal} />
          <ScreenGlass strength={0.5} />
        </div>
        {/* the seal's warm light on the desk below */}
        <div style={{position: 'absolute', left: 400, top: 1300, width: 620, height: 380, background: `radial-gradient(closest-side, rgba(214,180,110,${0.16 * seal}), transparent 74%)`, filter: 'blur(30px)'}} />
      </Cam>
    </Night>
  );
};

/* ------------------------------------------------------------------ */
/* 07 — Iris, in the glow                                              */
/* ------------------------------------------------------------------ */

const ShotIrisKnew: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s7;
  return (
    <Night f={f} glow="radial-gradient(900px 1000px at 34% 38%, rgba(40,86,114,0.46), rgba(2,5,10,0) 74)">
      <Cam z={1.03 + smooth(clamp01(k / 100)) * 0.05} ox="36%" oy="34%">
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(176deg,#08101A 0%,#05090F 64%,#02060A 100%)'}} />
        {/* a cold strip of machine light at the left, out of focus */}
        <div style={{position: 'absolute', left: -120, top: 240, width: 400, height: 1500, background: 'linear-gradient(90deg, rgba(150,204,232,0.28), rgba(30,66,90,0.04))', filter: 'blur(26px)'}} />
        <div style={{position: 'absolute', left: 120, top: 250, width: 940, height: 1440}}>
          <Iris rim={1.5} turn={-0.16} side="left" expression="calm" look="camera" viewBox="160 30 300 533" preserve="xMidYMin slice" />
        </div>
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(62% 56% at 44% 36%, transparent 30%, rgba(2,5,9,0.92) 100%)'}} />
      </Cam>
    </Night>
  );
};

/* ------------------------------------------------------------------ */
/* 08 — his hand on the console                                        */
/* ------------------------------------------------------------------ */

const ShotHandConsole: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s8;
  const press = smooth(clamp01(k / 24));
  return (
    <Night f={f} glow="radial-gradient(860px 900px at 48% 48%, rgba(26,68,94,0.44), rgba(2,5,10,0) 72)">
      <Cam z={1.02 + press * 0.06} ox="46%" oy="48%">
        {/* the console room: a dark wall of cabinets above */}
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(178deg,#070D14 0%,#05090F 56%,#03060A 100%)'}} />
        {Array.from({length: 6}).map((_, i) => (
          <div key={i} style={{position: 'absolute', left: 40 + i * 172, top: 260, width: 132, height: 640, borderRadius: 8, background: 'linear-gradient(180deg,#101A22,#060B10)', boxShadow: 'inset 0 0 0 1px rgba(140,178,204,0.08)'}}>
            <div style={{position: 'absolute', left: 16, top: 30, right: 16, height: 4, background: `rgba(120,214,172,${0.2 + Math.sin(f / 30 + i) * 0.1})`}} />
            <div style={{position: 'absolute', left: 16, top: 56, right: 40, height: 3, background: 'rgba(150,196,224,0.1)'}} />
            <div style={{position: 'absolute', left: 16, top: 76, right: 64, height: 3, background: 'rgba(150,196,224,0.08)'}} />
          </div>
        ))}
        <Console f={f} hand={press} open={1} />
        {/* his shoulder and coat at the right, so the hand has a body */}
        <div style={{position: 'absolute', left: 760, top: 700, width: 500, height: 1400, borderRadius: '46% 0 0 0', background: 'linear-gradient(100deg,#0B1218,#05090E 68%)', filter: 'blur(3px)'}} />
        <div style={{position: 'absolute', left: 742, top: 900, width: 18, height: 900, background: 'linear-gradient(180deg, rgba(190,220,238,0.2), transparent 72%)', filter: 'blur(4px)'}} />
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(70% 60% at 48% 50%, transparent 36%, rgba(2,5,9,0.86) 100%)'}} />
      </Cam>
    </Night>
  );
};

/* ------------------------------------------------------------------ */
/* 09 — it knows him                                                   */
/* ------------------------------------------------------------------ */

const ShotKey: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s9;
  const accept = smooth(clamp01((k - 10) / 40));
  return (
    <Night f={f} glow={`radial-gradient(900px 1000px at 50% 46%, rgba(40,96,128,${0.4 + accept * 0.2}), rgba(2,5,10,0) 72)`}>
      <Cam z={1.03 + smooth(clamp01(k / 120)) * 0.06} ox="50%" oy="44%">
        <Machine f={f} glow={0.75 + accept * 0.35} cables={0.8} />
        {/* the light answering him: a ring climbing the core */}
        <div style={{position: 'absolute', left: 300, top: 420, width: 480, height: 480, borderRadius: '50%', border: `2px solid rgba(198,232,248,${0.24 * accept})`, boxShadow: `0 0 60px rgba(160,214,240,${0.3 * accept})`}} />
        <div style={{position: 'absolute', left: 380, top: 500, width: 320, height: 320, borderRadius: '50%', border: `1.5px solid rgba(198,232,248,${0.16 * accept})`}} />
        {/* the voice filling the chamber: waveforms in the housing light */}
        <div style={{position: 'absolute', left: 240, top: 1180, width: 600, height: 300, opacity: 0.85}}>
          <Waveform f={f} beat={0.9} />
        </div>
        {/* Noah's shoulder, near, watching it accept him */}
        <div style={{position: 'absolute', left: -120, top: 1240, width: 620, height: 900, borderRadius: '0 50% 0 0', background: 'linear-gradient(102deg,#0A1017,#05090E 66%)', filter: 'blur(4px)'}} />
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(66% 58% at 50% 46%, transparent 34%, rgba(2,5,9,0.86) 100%)'}} />
      </Cam>
    </Night>
  );
};

/* ------------------------------------------------------------------ */
/* 10 — the floor descends                                             */
/* ------------------------------------------------------------------ */

const ShotDescend: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s10;
  const drop = smooth(clamp01(k / 96));
  const slide = drop * 220;
  return (
    <Night f={f} glow="radial-gradient(900px 1000px at 50% 40%, rgba(30,72,98,0.5), rgba(2,5,10,0) 72)">
      <Cam z={1.04 + drop * 0.05} ox="50%" oy="46%">
        <div style={{position: 'absolute', inset: 0, background: '#03070B'}} />
        {/* the shaft wall sliding up past us */}
        <div style={{position: 'absolute', inset: 0, transform: `translateY(${slide}px)`}}>
          {Array.from({length: 5}).map((_, i) => (
            <div key={i} style={{position: 'absolute', left: 0, right: 0, top: 260 + i * 420, height: 2, background: 'rgba(132,168,192,0.1)'}} />
          ))}
          {Array.from({length: 7}).map((_, i) => (
            <div key={`p${i}`} style={{position: 'absolute', left: 60 + i * 150, top: 240, width: 6, height: 1500, background: 'linear-gradient(180deg, rgba(150,186,212,0.14), rgba(4,8,12,0.4))'}} />
          ))}
        </div>
        {/* the console platform and the two of them, from behind, dropping away from the light */}
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 760 + slide * 0.5, background: 'linear-gradient(180deg,#101A22 0%,#070C12 54%,#03070B 100%)', boxShadow: '0 -20px 80px rgba(0,0,0,0.9)'}} />
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 744 + slide * 0.5, height: 5, background: 'rgba(170,206,228,0.2)'}} />
        {/* Noah, from behind, at the console */}
        <div style={{position: 'absolute', left: 300, top: 1010, width: 320, height: 720, opacity: 0.95}}>
          <svg viewBox="0 0 320 720" width="100%" height="100%">
            <path d="M 84 720 L 88 400 C 90 330 118 296 160 286 C 202 296 230 330 232 400 L 236 720 Z" fill="#070C11" />
            <ellipse cx={160} cy={232} rx={78} ry={86} fill="#060A0F" />
            <path d="M 88 400 C 90 330 118 296 160 286" stroke="rgba(190,220,238,0.4)" strokeWidth={4} fill="none" />
            <path d="M 82 236 C 84 152 116 132 160 132 C 204 132 236 152 238 236" stroke="rgba(190,220,238,0.28)" strokeWidth={3} fill="none" />
          </svg>
        </div>
        {/* Amara at his shoulder, smaller, further in */}
        <div style={{position: 'absolute', left: 540, top: 1160, width: 250, height: 580, opacity: 0.8}}>
          <svg viewBox="0 0 250 580" width="100%" height="100%">
            <path d="M 60 580 L 64 330 C 66 282 86 258 125 250 C 164 258 184 282 186 330 L 190 580 Z" fill="#070C11" />
            <ellipse cx={125} cy={206} rx={62} ry={70} fill="#060A0F" />
            <path d="M 64 330 C 66 282 86 258 125 250" stroke="rgba(190,220,238,0.32)" strokeWidth={3} fill="none" />
          </svg>
        </div>
        {/* the last of the machine light, above, receding */}
        <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 520, background: `linear-gradient(180deg, rgba(120,186,220,${0.26 - drop * 0.16}), transparent 82%)`}} />
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(70% 62% at 50% 46%, transparent 34%, rgba(2,5,9,0.9) 100%)'}} />
      </Cam>
    </Night>
  );
};

/* ------------------------------------------------------------------ */

export const S02E07: React.FC = () => {
  const f = useCurrentFrame();
  const shot =
    f < C.s2 ? (
      <ShotMachine f={f} />
    ) : f < C.s3 ? (
      <ShotShaft f={f} />
    ) : f < C.s4 ? (
      <ShotIrisSource f={f} />
    ) : f < C.s5 ? (
      <ShotCopy f={f} />
    ) : f < C.s6 ? (
      <ShotLogs f={f} />
    ) : f < C.s7 ? (
      <ShotSeal f={f} />
    ) : f < C.s8 ? (
      <ShotIrisKnew f={f} />
    ) : f < C.s9 ? (
      <ShotHandConsole f={f} />
    ) : f < C.s10 ? (
      <ShotKey f={f} />
    ) : (
      <ShotDescend f={f} />
    );

  return (
    <AbsoluteFill style={{background: '#02050A'}}>
      <Audio src={staticFile('audio/s02e07.mp3')} />
      <Grade lift={1.3} contrast={1.04}>{shot}</Grade>
      {/* black tail: the film ends in black, and it ends inside the audio */}
      <AbsoluteFill
        style={{background: '#000', opacity: smooth(clamp01((f - (C.total - 26)) / 13))}}
      />
      {f < C.total - 26 ? <Watermark /> : null}
    </AbsoluteFill>
  );
};
