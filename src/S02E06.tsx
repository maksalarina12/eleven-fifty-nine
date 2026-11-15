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
import {Night, Haze, GlitchBars, Grade} from './kit2';

/* ------------------------------------------------------------------ */
/* S02E06 — THE DIVIDE                                                 */
/* 40.720 s of real narration -> 1221 frames. 16 shots.                */
/* Cuts on measured word boundaries (Whisper base.en).                */
/* ------------------------------------------------------------------ */

const C = {
  s1: 0, // Noah appeared on the other side of a glass partition.
  s2: 118, // Amara ran toward him.
  s3: 184, // He raised one hand.
  s4: 238, // She raised hers.
  s5: 285, // For a moment, their reflections touched.
  s6: 378, // Then the glass displayed two different recordings…
  s7: 500, // In one, Noah begged her to open the door.
  s8: 598, // In the other, he warned her to run.
  s9: 676, // Amara watched his eyes.
  s10: 754, // The Noah she remembered had a scar through his left eyebrow.
  s11: 853, // Both men did.
  s12: 892, // She closed her eyes and asked one question.
  s13: 985, // "What did you choose when the clock stopped?"
  s14: 1060, // One Noah answered immediately.
  s15: 1123, // The other stayed silent.
  s16: 1176, // The glass began to crack.
  total: 1221,
};

const FADE = 1206;

/* ------------------------------------------------------------------ */
/* shared glass                                                        */
/* ------------------------------------------------------------------ */

const GlassPane: React.FC<{f: number; reflect?: number; mullions?: number}> = ({
  f,
  reflect = 1,
  mullions = 3,
}) => (
  <>
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background:
          'linear-gradient(116deg, rgba(178,214,234,0.09) 0%, rgba(84,126,152,0.03) 30%, rgba(4,10,16,0.24) 58%, rgba(170,208,230,0.08) 100%)',
      }}
    />
    {/* soft reflected corridor light, drifting very slowly */}
    <div
      style={{
        position: 'absolute',
        left: `${12 + Math.sin(f / 90) * 4}%`,
        top: '8%',
        width: '34%',
        height: '74%',
        background:
          'linear-gradient(96deg, rgba(198,226,242,0.07), transparent 68%)',
        filter: 'blur(18px)',
        opacity: reflect,
      }}
    />
    {Array.from({length: mullions}).map((_, i) => (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: `${18 + i * (64 / mullions)}%`,
          top: 0,
          bottom: 0,
          width: 9,
          background:
            'linear-gradient(90deg, rgba(8,14,20,0.9), rgba(96,124,144,0.34), rgba(5,9,14,0.92))',
        }}
      />
    ))}
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: '30%',
        height: 8,
        background:
          'linear-gradient(180deg, rgba(96,124,144,0.3), rgba(6,10,15,0.9))',
      }}
    />
    <div
      style={{
        position: 'absolute',
        inset: 0,
        boxShadow: 'inset 0 0 170px rgba(0,0,0,0.72)',
      }}
    />
  </>
);

/* a hand pressed flat on glass. a silhouette with a lit contour: the light is a
   stroke of the same shape, offset toward the key and laid under the body, so
   the edge reads without the shape turning into a drawing. the forearm leaves
   the frame, so the hand is never a thing floating in the dark. */
const HandOnGlass: React.FC<{
  f: number;
  side: 'near' | 'far';
  x: number;
  y: number;
  size?: number;
  opacity?: number;
  warm?: number;
  blur?: number;
}> = ({f, side, x, y, size = 1, opacity = 1, warm = 1, blur = 0}) => {
  const near = side === 'near';
  const body = near ? '#0B0C0E' : '#080A0C';
  const rim = near
    ? `rgba(${232 - warm * 24},${204 + warm * 20},${170 + warm * 40},0.44)`
    : 'rgba(196,226,244,0.58)';
  const rimGlow = near
    ? `rgba(${232 - warm * 24},${204 + warm * 20},${170 + warm * 40},0.16)`
    : 'rgba(196,226,244,0.15)';
  const ox = near ? 7 : -7;
  const oy = -6;

  const shapes = (
    <>
      {/* palm, wider at the knuckles than at the wrist */}
      <path d="M 208 336 C 258 322 404 322 456 338 C 486 352 492 400 486 448 C 480 504 458 548 402 566 L 268 566 C 216 546 188 500 184 442 C 180 388 180 352 208 336 Z" />
      {/* four fingers, separated: the panel glows through the gaps */}
      <rect x={226} y={186} width={62} height={210} rx={31} />
      <rect x={296} y={150} width={64} height={240} rx={32} />
      <rect x={366} y={172} width={62} height={220} rx={31} />
      <rect x={432} y={246} width={52} height={160} rx={26} />
      {/* thumb, away from the palm */}
      <rect x={112} y={444} width={72} height={150} rx={36} transform="rotate(-34 148 519)" />
      {/* forearm, out of the bottom of the artwork */}
      <path d="M 248 520 C 240 700 232 940 226 1200 L 468 1200 C 452 940 442 700 436 520 Z" />
    </>
  );

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 620 * size,
        height: 1200 * size,
        opacity,
        filter: `blur(${blur}px)`,
      }}
    >
      <svg viewBox="0 0 620 1200" width="100%" height="100%">
        <g
          transform={`translate(${ox} ${oy})`}
          fill="none"
          stroke={rimGlow}
          strokeWidth={9}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{filter: 'blur(4px)'}}
        >
          {shapes}
        </g>
        <g
          transform={`translate(${ox * 0.7} ${oy * 0.7})`}
          fill="none"
          stroke={rim}
          strokeWidth={3.4}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {shapes}
        </g>
        <g fill={body} stroke={body} strokeLinecap="round" strokeLinejoin="round">
          {shapes}
        </g>
      </svg>
    </div>
  );
};

/* a feed panel: always graded, always through glass */
const FeedPanel: React.FC<{
  children: React.ReactNode;
  x: number;
  y: number;
  w: number;
  h: number;
  bright?: number;
  tone?: number;
  style?: React.CSSProperties;
}> = ({children, x, y, w, h, bright = 1, tone = 0, style}) => (
  <Monitor style={{position: 'absolute', left: x, top: y, width: w, height: h, ...style}} inset={8} radius={8}>
    <div style={{position: 'absolute', inset: 0, background: '#04080C'}}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          filter: `grayscale(${0.5 + tone * 0.2}) contrast(1.12) brightness(${bright}) saturate(0.8)`,
        }}
      >
        {children}
      </div>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(22,54,76,0.18), transparent 46%, rgba(3,7,10,0.44))',
        }}
      />
    </div>
  </Monitor>
);

const NoahFace: React.FC<{
  f: number;
  expression: 'neutral' | 'alert' | 'fear' | 'dread' | 'grief' | 'shock';
  look?: 'camera' | 'left' | 'right' | 'down' | 'up' | 'door';
  mouth?: number;
  turn?: number;
  rim?: number;
  viewBox?: string;
  lid?: number;
}> = ({
  f,
  expression,
  look = 'camera',
  mouth = 0,
  turn = 0,
  rim = 1.1,
  viewBox = '188 66 238 356',
  lid,
}) => (
  <div style={{position: 'absolute', inset: 0}}>
    <Noah
      expression={expression as never}
      look={look}
      mouth={mouth}
      turn={turn}
      rim={rim}
      lidOverride={lid ?? blinkLid(f, 150)}
      viewBox={viewBox}
      preserve="xMidYMid slice"
    />
  </div>
);

/* ------------------------------------------------------------------ */
/* 01 — he is on the other side of the glass                           */
/* ------------------------------------------------------------------ */

const ShotAppear: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s1;
  return (
    <Night f={f} glow="radial-gradient(1000px 1100px at 56% 40%, rgba(26,60,88,0.4), rgba(2,5,10,0) 74)">
      <Cam z={1.02 + smooth(clamp01(k / 112)) * 0.05} ox="56%" oy="42%">
        {/* the corridor behind us */}
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(178deg,#080F16 0%,#05090F 60%,#02060A 100%)'}} />
        <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 300, background: 'linear-gradient(180deg,#0B141B,#060B11)'}} />
        {/* the room beyond the glass, flat and cold */}
        <div
          style={{
            position: 'absolute',
            left: 40,
            top: 250,
            width: 1000,
            height: 1500,
            background: 'linear-gradient(180deg,#0F2432 0%,#0B1C28 46%,#050C13 100%)',
            boxShadow: 'inset 0 0 200px rgba(28,78,108,0.44)',
          }}
        />
        {/* a lit strip in the far room, which is the only thing lighting him */}
        <div style={{position: 'absolute', left: 120, top: 470, width: 840, height: 12, background: 'rgba(206,234,248,0.7)', boxShadow: '0 0 120px rgba(170,214,238,0.55)'}} />
        <div style={{position: 'absolute', left: 40, top: 1100, width: 1000, height: 8, background: 'rgba(140,188,216,0.1)'}} />

        {/* Noah, beyond the glass, right of centre */}
        <div
          style={{
            position: 'absolute',
            left: 470,
            top: 430,
            width: 600,
            height: 1520,
            filter: 'brightness(0.8) saturate(0.86) blur(0.7px)',
          }}
        >
          <Noah
            expression="neutral"
            look="camera"
            turn={0.05}
            rim={1.35}
            lidOverride={blinkLid(f, 60)}
            viewBox="0 0 600 1200"
            preserve="xMidYMax slice"
          />
        </div>

        <GlassPane f={f} reflect={1} mullions={3} />

        {/* Amara's shoulder, near us, cropped by the left edge */}
        <div
          style={{
            position: 'absolute',
            left: -230,
            top: 1010,
            width: 620,
            height: 1100,
            borderRadius: '0 46% 0 0',
            background: 'linear-gradient(104deg,#0C131A,#060B10 62%)',
            filter: 'blur(7px)',
            boxShadow: 'inset -2px 2px 0 rgba(186,216,234,0.16)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 150,
            top: 900,
            width: 130,
            height: 900,
            background: 'linear-gradient(100deg, rgba(190,216,232,0.14), transparent 62%)',
            filter: 'blur(6px)',
          }}
        />
        <Haze x="58%" y="30%" size={760} color="rgba(110,170,204,0.12)" />
      </Cam>
    </Night>
  );
};

/* ------------------------------------------------------------------ */
/* 02 — she runs                                                       */
/* ------------------------------------------------------------------ */

const ShotRun: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s2;
  const step = Math.sin(k / 7) * 12;
  return (
    <Night f={f} glow="radial-gradient(900px 1000px at 62% 44%, rgba(28,62,90,0.4), rgba(2,5,10,0) 72)">
      <Cam z={1.03 + smooth(clamp01(k / 66)) * 0.05} ox="56%" oy="40%">
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(178deg,#070D14 0%,#04080D 62%,#02050A 100%)'}} />
        {/* the glass ahead, with him small behind it */}
        <div style={{position: 'absolute', left: 380, top: 300, right: -60, bottom: 240, background: 'linear-gradient(180deg,#0A1A26,#061019 70%)', boxShadow: 'inset 0 0 160px rgba(30,80,110,0.5)'}} />
        <div style={{position: 'absolute', left: 640, top: 700, width: 210, height: 640, filter: 'brightness(0.6) blur(1.6px)', opacity: 0.85}}>
          <Noah expression="neutral" look="camera" rim={1.4} viewBox="0 0 600 1200" preserve="xMidYMax slice" />
        </div>
        <GlassPane f={f} reflect={0.8} mullions={2} />

        {/* her, from behind and slightly left, running */}
        <div
          style={{
            position: 'absolute',
            left: 40,
            top: 760 + step,
            width: 760,
            height: 1500,
            filter: 'blur(0.6px)',
          }}
        >
          <AmaraBack rim={1.5} viewBox="0 0 300 700" preserve="xMidYMax slice" />
        </div>
        {/* motion streaks off her shoulder */}
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: -40,
              top: 1080 + i * 130 + step,
              width: 460 - i * 90,
              height: 5,
              background: `rgba(190,220,238,${0.14 - i * 0.03})`,
              filter: 'blur(3px)',
            }}
          />
        ))}
        <Haze x="50%" y="30%" size={700} color="rgba(110,170,204,0.12)" />
      </Cam>
    </Night>
  );
};

/* ------------------------------------------------------------------ */
/* 03-05 — hands, through the glass                                    */
/* ------------------------------------------------------------------ */

const ShotHisHand: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s3;
  const rise = smooth(clamp01(k / 26));
  return (
    <Night f={f} glow="radial-gradient(900px 900px at 50% 44%, rgba(34,76,104,0.46), rgba(2,5,10,0) 72)" grain={0.07}>
      <Cam z={1.04 + smooth(clamp01(k / 54)) * 0.05} ox="50%" oy="44%">
        {/* the far room: a wall with one lit panel, enough to silhouette against */}
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(170deg,#0A141D 0%,#060C12 64%,#02060A 100%)'}} />
        <div style={{position: 'absolute', left: 100, top: 210, width: 880, height: 1320, background: 'radial-gradient(70% 60% at 50% 34%, rgba(140,196,224,0.2), rgba(20,44,60,0.06) 72%)', filter: 'blur(26px)'}} />
        <div style={{position: 'absolute', left: 130, top: 236, width: 820, height: 8, background: 'rgba(214,238,250,0.34)', boxShadow: '0 0 80px rgba(180,220,242,0.32)', filter: 'blur(2px)'}} />
        <div style={{position: 'absolute', left: 120, top: 1470, width: 840, height: 4, background: 'rgba(160,200,224,0.16)'}} />

        {/* his hand, beyond the glass */}
        <HandOnGlass f={f} side="far" x={190} y={640 - (1 - rise) * 200} size={1.02} warm={0.2} blur={1.2} opacity={0.95} />

        <GlassPane f={f} reflect={1} mullions={1} />
        <Haze x="56%" y="34%" size={760} color="rgba(120,180,214,0.14)" />
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(68% 60% at 52% 44%, transparent 34%, rgba(2,5,9,0.9) 100%)'}} />
      </Cam>
    </Night>
  );
};

const ShotHerHand: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s4;
  const rise = smooth(clamp01(k / 24));
  return (
    <Night f={f} glow="radial-gradient(860px 880px at 48% 44%, rgba(58,52,42,0.42), rgba(2,5,10,0) 72)" grain={0.07}>
      <Cam z={1.04 + smooth(clamp01(k / 47)) * 0.05} ox="48%" oy="46%">
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(170deg,#0A1119 0%,#070C12 62%,#02060A 100%)'}} />
        {/* the same lit panel, now out of focus on the other side */}
        <div style={{position: 'absolute', left: 160, top: 260, width: 800, height: 1200, background: 'linear-gradient(180deg, rgba(150,198,222,0.2) 0%, rgba(70,118,148,0.08) 56%, rgba(6,14,20,0.08) 100%)', filter: 'blur(3px)'}} />

        {/* her hand, on our side, warm edge */}
        <HandOnGlass f={f} side="near" x={214} y={660 - (1 - rise) * 150} size={1.0} warm={1} />
        {/* the glow of her hand pressing the glass */}
        <div style={{position: 'absolute', left: 300, top: 720, width: 520, height: 480, background: 'radial-gradient(closest-side, rgba(226,196,158,0.1), transparent 74%)', filter: 'blur(26px)'}} />
        <GlassPane f={f} reflect={0.7} mullions={1} />
        <Haze x="44%" y="40%" size={620} color="rgba(226,170,74,0.1)" />
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(64% 56% at 50% 46%, transparent 30%, rgba(2,5,9,0.92) 100%)'}} />
      </Cam>
    </Night>
  );
};

const ShotTouch: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s5;
  const touch = smooth(clamp01(k / 40));
  const drift = Math.sin(f / 40) * 5;
  return (
    <Night f={f} glow="radial-gradient(940px 900px at 50% 44%, rgba(56,86,110,0.46), rgba(2,5,10,0) 72)" grain={0.06}>
      <Cam z={1.06 + smooth(clamp01(k / 92)) * 0.05} ox="50%" oy="44%">
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(172deg,#08111A 0%,#050A10 66%,#02060A 100%)'}} />
        <div style={{position: 'absolute', left: 80, top: 200, width: 920, height: 1360, background: 'linear-gradient(180deg, rgba(146,196,224,0.22) 0%, rgba(66,112,144,0.09) 54%, rgba(6,14,20,0.08) 100%)'}} />
        {/* his hand, cold, behind the glass */}
        <HandOnGlass f={f} side="far" x={216} y={610} size={0.86} warm={0.1} blur={2.2} opacity={0.72} />
        <GlassPane f={f} reflect={1} mullions={1} />
        {/* her hand, warm, on our side, arriving a little lower */}
        <HandOnGlass f={f} side="near" x={250 + drift} y={700 - touch * 36} size={0.9} warm={1} />
        {/* the place where they meet */}
        <div
          style={{
            position: 'absolute',
            left: 300,
            top: 640,
            width: 460,
            height: 420,
            background: `radial-gradient(closest-side, rgba(236,244,250,${0.1 + touch * 0.22}), transparent 72%)`,
            filter: 'blur(26px)',
            mixBlendMode: 'screen',
          }}
        />
        <Haze x="30%" y="34%" size={600} color="rgba(226,170,74,0.1)" />
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(62% 54% at 52% 46%, transparent 28%, rgba(2,5,9,0.9) 100%)'}} />
      </Cam>
    </Night>
  );
};

/* ------------------------------------------------------------------ */
/* 06 — the glass turns into two recordings                            */
/* ------------------------------------------------------------------ */

const ShotTwoScreens: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s6;
  const on = smooth(clamp01((k - 8) / 34));
  return (
    <Night f={f} glow="radial-gradient(1100px 1000px at 50% 40%, rgba(30,68,96,0.42), rgba(2,5,10,0) 74)">
      <Cam z={1.02 + smooth(clamp01(k / 120)) * 0.05} ox="50%" oy="42%">
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(178deg,#080F16 0%,#05090F 60%,#02060A 100%)'}} />
        <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 260, background: 'linear-gradient(180deg,#0B141B,#060B11)'}} />

        {/* two panels, mounted in the glass */}
        <div style={{opacity: on}}>
          <FeedPanel x={64} y={352} w={452} h={880} bright={0.9} tone={0.2}>
            <div style={{position: 'absolute', inset: 0}}>
              <NoahFace f={f} expression="alert" look="camera" mouth={talk(f, C.s7, C.s8, 0.2, 3)} turn={0.1} rim={1.2} viewBox="170 40 260 420" />
            </div>
          </FeedPanel>
          <FeedPanel x={566} y={352} w={452} h={880} bright={0.86} tone={0.4}>
            <div style={{position: 'absolute', inset: 0}}>
              <NoahFace f={f} expression="fear" look="camera" mouth={talk(f, C.s8, C.s9, 0.22, 3.2)} turn={-0.12} rim={1.3} viewBox="176 34 260 420" />
            </div>
          </FeedPanel>
        </div>

        {/* their light falling on the corridor floor */}
        <div style={{position: 'absolute', left: 0, right: 0, top: 1232, height: 420, background: 'linear-gradient(180deg, rgba(60,124,160,0.14), transparent 74%)'}} />

        {/* Amara, bottom left, watching them */}
        <div style={{position: 'absolute', left: -160, top: 1080, width: 640, height: 1060, filter: 'blur(1px)'}}>
          <AmaraBack rim={1.2} viewBox="0 0 300 700" preserve="xMidYMax slice" />
        </div>

        <GlassPane f={f} reflect={0.5} mullions={2} />
        <Haze x="50%" y="30%" size={880} color="rgba(110,170,204,0.14)" />
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(70% 60% at 50% 42%, transparent 36%, rgba(2,5,9,0.8) 100%)'}} />
      </Cam>
    </Night>
  );
};

/* ------------------------------------------------------------------ */
/* 07-08 — the two recordings                                          */
/* ------------------------------------------------------------------ */

const ShotBeg: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s7;
  const push = smooth(clamp01(k / 96));
  return (
    <Night f={f} glow="radial-gradient(860px 940px at 46% 40%, rgba(38,84,112,0.5), rgba(2,5,10,0) 72)">
      <Cam z={1.03 + push * 0.06} ox="46%" oy="38%">
        {/* the room this recording was made in: white wall, a sealed door */}
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(176deg,#0E1C26 0%,#0A141D 52%,#04090F 100%)'}} />
        <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 320, background: 'linear-gradient(180deg,#12222D,#0A131B)'}} />
        <div style={{position: 'absolute', left: 690, top: 360, width: 330, height: 1240, background: 'linear-gradient(180deg,#16242E,#080F16)', boxShadow: 'inset 0 0 70px rgba(0,0,0,0.8), 0 0 0 2px rgba(140,178,204,0.1)'}} />
        <div style={{position: 'absolute', left: 690, top: 1560, width: 330, height: 14, background: 'rgba(190,224,242,0.22)', filter: 'blur(6px)'}} />
        <div style={{position: 'absolute', left: 0, right: 0, top: 600, height: 2, background: 'rgba(150,186,212,0.1)'}} />

        {/* him, close, at the glass */}
        <div style={{position: 'absolute', left: 30, top: 210, width: 820, height: 1560}}>
          <NoahFace
            f={f}
            expression="alert"
            look="camera"
            mouth={talk(f, C.s7, C.s8, 0.24, 3.1)}
            turn={0.14}
            rim={1.35}
            viewBox="166 26 268 470"
          />
        </div>
        {/* his forearm coming up into the bottom of frame, palm out of shot */}
        <div style={{position: 'absolute', left: 60, bottom: -60, width: 520, height: 420, transform: 'rotate(-8deg)', transformOrigin: '50% 100%'}}>
          <div style={{position: 'absolute', left: 90, top: 120, width: 420, height: 400, borderRadius: '60px 60px 0 0', background: 'linear-gradient(178deg,#2B353F 0%,#161D25 54%,#080D12 100%)', boxShadow: 'inset 0 2px 0 rgba(190,216,232,0.14)'}} />
        </div>

        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(30,80,112,0.2), transparent 44%, rgba(3,7,10,0.5))'}} />
        <Scanlines opacity={0.18} />
        <ScreenGlass strength={0.36} />
        <GlitchBars f={f} amount={0.26} seed={3} />
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(66% 58% at 46% 38%, transparent 34%, rgba(2,5,9,0.86) 100%)'}} />
      </Cam>
    </Night>
  );
};

const ShotWarn: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s8;
  const push = smooth(clamp01(k / 72));
  return (
    <Night f={f} glow="radial-gradient(880px 940px at 54% 38%, rgba(56,74,96,0.5), rgba(2,5,10,0) 72)">
      <Cam z={1.05 + push * 0.06} ox="54%" oy="36%">
        {/* the other recording: a colder room, a narrower door */}
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(178deg,#0B141C 0%,#070C12 56%,#03070B 100%)'}} />
        <div style={{position: 'absolute', left: 60, top: 420, width: 300, height: 1180, background: 'linear-gradient(180deg,#101B24,#060B11)', boxShadow: 'inset 0 0 60px rgba(0,0,0,0.8)'}} />
        <div style={{position: 'absolute', left: 88, top: 460, width: 244, height: 1100, background: 'linear-gradient(180deg, rgba(186,216,234,0.2), rgba(60,100,128,0.05))', filter: 'blur(4px)'}} />
        <div style={{position: 'absolute', left: 0, right: 0, top: 360, height: 3, background: 'rgba(150,186,212,0.12)'}} />

        {/* him, turned slightly away, warning her */}
        <div style={{position: 'absolute', left: 190, top: 230, width: 800, height: 1520, filter: 'hue-rotate(-6deg)'}}>
          <NoahFace
            f={f}
            expression="fear"
            look="camera"
            mouth={talk(f, C.s8, C.s9, 0.28, 3.6)}
            turn={-0.2}
            rim={1.45}
            viewBox="170 22 268 470"
          />
        </div>
        {/* his shoulder, near us, so he has a body */}
        <div style={{position: 'absolute', left: 700, bottom: -80, width: 520, height: 560, borderRadius: '54% 0 0 0', background: 'linear-gradient(100deg,#121A22,#060B11 66%)', filter: 'blur(4px)'}} />

        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(40,54,74,0.22), transparent 42%, rgba(3,7,10,0.5))'}} />
        <Scanlines opacity={0.18} />
        <ScreenGlass strength={0.36} />
        <div style={{position: 'absolute', left: 0, right: 0, top: `${16 + ((f * 2.2) % 64)}%`, height: 54, background: 'linear-gradient(180deg, transparent, rgba(180,206,224,0.07), transparent)'}} />
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(64% 56% at 54% 38%, transparent 32%, rgba(2,5,9,0.88) 100%)'}} />
      </Cam>
    </Night>
  );
};

/* ------------------------------------------------------------------ */
/* 09 — she watches his eyes                                           */
/* ------------------------------------------------------------------ */

const ShotWatch: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s9;
  const shift = smooth(clamp01((k - 20) / 30));
  return (
    <Night f={f} glow="radial-gradient(760px 900px at 40% 40%, rgba(52,88,116,0.42), rgba(2,5,10,0) 72)">
      <Cam z={1.05 + smooth(clamp01(k / 74)) * 0.05} ox="42%" oy="34%">
        <div style={{position: 'absolute', inset: 0}}>
          <Amara
            expression="guarded"
            look={shift > 0.5 ? 'right' : 'left'}
            turn={-0.16}
            screen={0.85}
            rim={1.35}
            lidOverride={blinkLid(f, 40, 7)}
            mouth={0.04}
            viewBox="170 44 250 404"
            preserve="xMidYMid slice"
          />
        </div>
        {/* panel light from the left, then from the right */}
        <div style={{position: 'absolute', left: -120, top: 320, width: 560, height: 900, background: `radial-gradient(closest-side, rgba(120,184,220,${0.2 - shift * 0.12}), transparent 74%)`, filter: 'blur(30px)', mixBlendMode: 'screen'}} />
        <div style={{position: 'absolute', right: -140, top: 380, width: 560, height: 880, background: `radial-gradient(closest-side, rgba(140,180,206,${0.06 + shift * 0.18}), transparent 74%)`, filter: 'blur(30px)', mixBlendMode: 'screen'}} />
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(62% 56% at 44% 36%, transparent 30%, rgba(2,5,9,0.9) 100%)'}} />
      </Cam>
    </Night>
  );
};

/* ------------------------------------------------------------------ */
/* 10-11 — the scar                                                    */
/* ------------------------------------------------------------------ */

const ShotScar: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s10;
  return (
    <Night f={f} glow="radial-gradient(700px 700px at 52% 46%, rgba(46,76,98,0.46), rgba(2,5,10,0) 72)" grain={0.06}>
      <Cam z={1.04 + smooth(clamp01(k / 96)) * 0.07} ox="54%" oy="44%">
        <NoahFace f={f} expression="neutral" look="camera" turn={0} rim={1.2} viewBox="286 100 110 196" />
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(26,62,86,0.18), transparent 52%, rgba(3,7,10,0.42))'}} />
        <Scanlines opacity={0.18} />
        <ScreenGlass strength={0.36} />
        {/* the truth of it, catching the one cold light */}
        <div
          style={{
            position: 'absolute',
            left: 470,
            top: 640,
            width: 260,
            height: 420,
            background: 'radial-gradient(closest-side, rgba(232,246,252,0.16), transparent 72%)',
            filter: 'blur(18px)',
            mixBlendMode: 'screen',
          }}
        />
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(58% 52% at 54% 44%, transparent 26%, rgba(2,5,9,0.9) 100%)'}} />
      </Cam>
    </Night>
  );
};

const ShotBothScars: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s11;
  const settle = smooth(clamp01(k / 20));
  return (
    <Night f={f} glow="radial-gradient(900px 800px at 50% 44%, rgba(36,68,92,0.4), rgba(2,5,10,0) 72)">
      <Cam z={1.01 + settle * 0.02} ox="50%" oy="44%">
        <div style={{position: 'absolute', inset: 0, background: '#03070B'}} />
        {[0, 1].map((side) => (
          <div
            key={side}
            style={{
              position: 'absolute',
              left: side === 0 ? 0 : 540,
              top: 140,
              width: 540,
              height: 1640,
              overflow: 'hidden',
              filter: side === 0 ? 'brightness(0.86) saturate(0.6)' : 'brightness(0.62) saturate(0.4) hue-rotate(-6deg)',
            }}
          >
            <NoahFace
              f={f}
              expression="neutral"
              look={side === 0 ? 'camera' : 'camera'}
              turn={side === 0 ? 0.02 : -0.03}
              rim={side === 0 ? 1.25 : 1.0}
              viewBox={side === 0 ? '286 100 110 196' : '288 104 110 196'}
            />
          </div>
        ))}
        {/* the seam between the two recordings */}
        <div style={{position: 'absolute', left: 533, top: 0, bottom: 0, width: 14, background: 'linear-gradient(90deg, rgba(6,10,15,0.95), rgba(120,158,186,0.22), rgba(6,10,15,0.95))'}} />
        <Scanlines opacity={0.16} />
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(70% 64% at 50% 44%, transparent 36%, rgba(2,5,9,0.86) 100%)'}} />
      </Cam>
    </Night>
  );
};

/* ------------------------------------------------------------------ */
/* 12-13 — she closes her eyes, and asks                               */
/* ------------------------------------------------------------------ */

const ShotEyesClosed: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s12;
  return (
    <Night f={f} glow="radial-gradient(720px 860px at 48% 40%, rgba(44,76,100,0.4), rgba(2,5,10,0) 72)">
      <Cam z={1.05 + smooth(clamp01(k / 86)) * 0.06} ox="48%" oy="34%">
        <div style={{position: 'absolute', inset: 0}}>
          <Amara
            expression="guarded"
            look="down"
            turn={0.04}
            screen={0.5}
            rim={1.25}
            lidOverride={1}
            mouth={0.06}
            viewBox="182 52 240 388"
            preserve="xMidYMid slice"
          />
        </div>
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(24,56,78,0.16), transparent 48%, rgba(3,7,10,0.46))'}} />
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(60% 54% at 48% 38%, transparent 30%, rgba(2,5,9,0.9) 100%)'}} />
      </Cam>
    </Night>
  );
};

const ShotQuestion: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s13;
  const murmur = talk(f, 0, 76, 0.2, 3.0);
  return (
    <Night f={f} glow="radial-gradient(700px 820px at 44% 42%, rgba(58,80,104,0.4), rgba(2,5,10,0) 72)">
      <Cam z={1.06 + smooth(clamp01(k / 68)) * 0.05} ox="46%" oy="38%">
        <div style={{position: 'absolute', inset: 0}}>
          <Amara
            expression="soft"
            look="camera"
            turn={-0.42}
            screen={0.42}
            rim={1.4}
            lidOverride={0.18}
            mouth={murmur}
            viewBox="176 66 232 372"
            preserve="xMidYMid slice"
          />
        </div>
        {/* her breath on the glass, between her and him */}
        <div style={{position: 'absolute', left: 240, top: 760, width: 560, height: 480, background: 'radial-gradient(closest-side, rgba(206,228,242,0.1), transparent 74%)', filter: 'blur(26px)'}} />
        <GlassPane f={f} reflect={0.6} mullions={1} />
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(58% 52% at 46% 38%, transparent 28%, rgba(2,5,9,0.92) 100%)'}} />
      </Cam>
    </Night>
  );
};

/* ------------------------------------------------------------------ */
/* 14-15 — the answer, and the silence                                 */
/* ------------------------------------------------------------------ */

const ShotAnswered: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s14;
  return (
    <Night f={f} glow="radial-gradient(820px 900px at 50% 40%, rgba(40,88,118,0.5), rgba(2,5,10,0) 74)">
      <Cam z={1.08 + smooth(clamp01(k / 56)) * 0.06} ox="50%" oy="36%">
        <NoahFace
          f={f}
          expression="alert"
          look="camera"
          mouth={talk(f, C.s14, C.s15, 0.3, 3.8)}
          turn={0.1}
          rim={1.4}
          viewBox="178 54 244 400"
          lid={0}
        />
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(44,100,132,0.2), transparent 44%, rgba(3,7,10,0.44))'}} />
        <Scanlines opacity={0.2} />
        <ScreenGlass strength={0.4} />
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(60% 54% at 52% 38%, transparent 30%, rgba(2,5,9,0.86) 100%)'}} />
      </Cam>
    </Night>
  );
};

const ShotSilent: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s15;
  const drift = (f * 1.1) % 100;
  return (
    <Night f={f} glow="radial-gradient(760px 880px at 50% 40%, rgba(18,40,58,0.4), rgba(2,5,10,0) 72)" grain={0.09}>
      <Cam z={1.08 + smooth(clamp01(k / 44)) * 0.03} ox="50%" oy="38%">
        {/* same framing, and nothing moving in it */}
        <div style={{position: 'absolute', inset: 0, filter: 'brightness(0.44) saturate(0.3)'}}>
          <NoahFace f={f} expression="neutral" look="camera" mouth={0} turn={0.1} rim={0.5} viewBox="178 54 244 400" lid={0.06} />
        </div>
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(8,20,30,0.36), rgba(3,7,10,0.7))'}} />
        {/* a single tracking tear in the recording */}
        <div style={{position: 'absolute', left: 0, right: 0, top: `${drift}%`, height: 26, background: 'linear-gradient(180deg, transparent, rgba(190,216,232,0.12), transparent)'}} />
        <Scanlines opacity={0.26} />
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(58% 52% at 50% 38%, transparent 26%, rgba(2,5,9,0.94) 100%)'}} />
      </Cam>
    </Night>
  );
};

/* ------------------------------------------------------------------ */
/* 16 — the glass begins to crack                                      */
/* ------------------------------------------------------------------ */

const ShotCrack: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s16;
  const crack = smooth(clamp01(k / 42));
  const jolt = Math.sin(k / 2.4) * crack * 3;
  return (
    <Night f={f} glow="radial-gradient(1000px 1100px at 50% 40%, rgba(30,64,90,0.44), rgba(2,5,10,0) 74)">
      <Cam z={1.03 + crack * 0.06} ox="50%" oy="42%">
        <div style={{position: 'absolute', inset: 0, transform: `translateX(${jolt}px)`}}>
          <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(178deg,#08111A 0%,#05090F 62%,#02060A 100%)'}} />
          <div style={{position: 'absolute', left: 40, top: 300, right: 40, bottom: 300, background: 'linear-gradient(180deg,#0A1A26,#061019 70%)'}} />
          {/* him, dim beyond */}
          <div style={{position: 'absolute', left: 620, top: 660, width: 380, height: 1000, filter: 'brightness(0.5) blur(1.6px)'}}>
            <Noah expression="alert" look="camera" turn={0.06} rim={1.2} viewBox="0 0 600 1200" preserve="xMidYMax slice" />
          </div>
          {/* her shoulder, near */}
          <div style={{position: 'absolute', left: -220, top: 1040, width: 600, height: 1000, borderRadius: '0 52% 0 0', background: 'linear-gradient(102deg,#0B1118,#050A0F 68%)', filter: 'blur(5px)'}} />
        </div>

        <GlassPane f={f} reflect={0.8} mullions={2} />

        {/* the crack, from the point between them */}
        <svg viewBox="0 0 1080 1920" width="100%" height="100%" style={{position: 'absolute', inset: 0}}>
          {Array.from({length: 11}).map((_, i) => {
            const a = (i / 11) * Math.PI * 2 + 0.3;
            const len = (140 + rnd(i + 12) * 640) * crack;
            const x0 = 528;
            const y0 = 960;
            return (
              <g key={i}>
                <path
                  d={`M ${x0} ${y0} l ${Math.cos(a) * len * 0.42} ${Math.sin(a) * len * 0.42} l ${Math.cos(a + 0.26) * len * 0.28} ${Math.sin(a + 0.26) * len * 0.28} l ${Math.cos(a - 0.18) * len * 0.34} ${Math.sin(a - 0.18) * len * 0.34}`}
                  stroke={`rgba(222,242,252,${0.28 + crack * 0.5})`}
                  strokeWidth={2.2 + crack * 1.4}
                  fill="none"
                />
                <path
                  d={`M ${x0} ${y0} l ${Math.cos(a) * len * 0.6} ${Math.sin(a) * len * 0.6}`}
                  stroke={`rgba(150,198,224,${0.16 + crack * 0.24})`}
                  strokeWidth={1.1}
                  fill="none"
                />
              </g>
            );
          })}
          <circle cx={528} cy={960} r={30 + crack * 26} fill="none" stroke={`rgba(228,246,254,${0.2 + crack * 0.5})`} strokeWidth={2} />
          <circle cx={528} cy={960} r={9 + crack * 10} fill={`rgba(236,250,255,${0.16 + crack * 0.4})`} />
        </svg>

        {/* light through the split */}
        <div style={{position: 'absolute', left: 440, top: 860, width: 180, height: 220, background: `radial-gradient(closest-side, rgba(226,244,252,${0.16 * crack}), transparent 74%)`, filter: 'blur(16px)', mixBlendMode: 'screen'}} />
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(64% 58% at 50% 44%, transparent 30%, rgba(2,5,9,0.86) 100%)'}} />
      </Cam>
    </Night>
  );
};

/* ------------------------------------------------------------------ */

export const S02E06: React.FC = () => {
  const f = useCurrentFrame();
  const shot =
    f < C.s2 ? (
      <ShotAppear f={f} />
    ) : f < C.s3 ? (
      <ShotRun f={f} />
    ) : f < C.s4 ? (
      <ShotHisHand f={f} />
    ) : f < C.s5 ? (
      <ShotHerHand f={f} />
    ) : f < C.s6 ? (
      <ShotTouch f={f} />
    ) : f < C.s7 ? (
      <ShotTwoScreens f={f} />
    ) : f < C.s8 ? (
      <ShotBeg f={f} />
    ) : f < C.s9 ? (
      <ShotWarn f={f} />
    ) : f < C.s10 ? (
      <ShotWatch f={f} />
    ) : f < C.s11 ? (
      <ShotScar f={f} />
    ) : f < C.s12 ? (
      <ShotBothScars f={f} />
    ) : f < C.s13 ? (
      <ShotEyesClosed f={f} />
    ) : f < C.s14 ? (
      <ShotQuestion f={f} />
    ) : f < C.s15 ? (
      <ShotAnswered f={f} />
    ) : f < C.s16 ? (
      <ShotSilent f={f} />
    ) : (
      <ShotCrack f={f} />
    );

  return (
    <AbsoluteFill style={{background: '#02050A'}}>
      <Audio src={staticFile('audio/s02e06.mp3')} />
      <Grade lift={1.5} contrast={1.04}>{shot}</Grade>
      {/* black tail: the film ends in black, and it ends inside the audio */}
      <AbsoluteFill
        style={{background: '#000', opacity: smooth(clamp01((f - (C.total - 26)) / 13))}}
      />
      {f < C.total - 26 ? <Watermark /> : null}
    </AbsoluteFill>
  );
};
