import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {Amara, AmaraBack} from './character/Amara';
import {Noah} from './character/Noah';
import {NoahBack} from './kit';
import {Cam} from './Episode';
import {
  Watermark,
  Scanlines,
  ScreenGlass,
  PhoneSlab,
  clamp01,
  smooth,
  blinkLid,
  talk,
} from './kit';
import {Night, Rain, Haze, Skyline, Street, RelayTower, ApartmentWindow, SignalDesk, WhiteRoom, Waveform, GlitchBars, TunnelMap, KeysOnTable, Grade} from './kit2';

/* ------------------------------------------------------------------ */
/* S02E01 — THE EDEN SIGNAL                                            */
/* 42.720 s of real narration -> 1281 frames. 17 shots.                */
/* Cuts sit on measured phrase boundaries (Whisper base.en).           */
/* ------------------------------------------------------------------ */

const C = {
  s1: 0, // Three days after Noah vanished,
  s2: 77, // Amara received a signal…
  s3: 220, // The city was quiet.
  s4: 275, // Her phone was not.
  s5: 327, // A heartbeat pulsed through the speaker.
  s6: 412, // At the edge of the city,
  s7: 464, // an abandoned relay tower came back to life.
  s8: 545, // Amara opened the transmission.
  s9: 605, // On the screen, Noah stood inside a white room.
  s10: 710, // He looked directly into the camera.
  s11: 785, // "Amara. Do not come here."
  s12: 858, // A second voice answered…
  s13: 976, // "He knows you are watching."
  s14: 1037, // The picture froze.
  s15: 1082, // A new set of coordinates…
  s16: 1173, // Amara grabbed her keys.
  s17: 1226, // "Then I am coming anyway."
  total: 1281,
};

const FADE = 1269;

/* ------------------------------------------------------------------ */
/* 01 — the city, three days later                                     */
/* ------------------------------------------------------------------ */

const ShotCity: React.FC<{f: number}> = ({f}) => (
  <Night
    f={f}
    glow="radial-gradient(1200px 1200px at 52% 26%, rgba(34,72,104,0.42), rgba(2,5,10,0) 76%)"
  >
    <Cam z={1.01 + smooth(clamp01(f / C.s2)) * 0.05} ox="54%" oy="50%">
      <div style={{position: 'absolute', inset: 0, transform: 'scale(1.46)', transformOrigin: '50% 96%'}}>
        <Skyline f={f} dim={0.92} />
      </div>
      <Haze x="54%" y="38%" size={980} color="rgba(70,128,168,0.24)" />
      {/* where the city ends: a dark ridge on the right, open sky above it */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(176deg, rgba(6,11,16,0) 0%, #060B11 100%)',
          clipPath: 'polygon(516px 1920px, 660px 1210px, 860px 1120px, 1080px 1074px, 1080px 1920px)',
        }}
      />
      {/* the tower stands on that ridge, outside the blocks */}
      <div style={{position: 'absolute', inset: 0, transform: 'translate(318px, -496px) scale(0.92)', transformOrigin: '50% 100%'}}>
        <RelayTower f={f} distance={0.72} alive={0} />
      </div>
      <Street f={f} wet={0.6} />
      {/* we are on a roof: parapet in the near foreground */}
      <div style={{position: 'absolute', left: -40, right: -40, bottom: -40, height: 360}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 360, background: 'linear-gradient(180deg,#0B131A 0%,#05090E 62%,#02050A 100%)'}} />
        <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 14, background: 'linear-gradient(180deg, rgba(140,178,204,0.22), transparent)'}} />
        {Array.from({length: 9}).map((_, i) => (
          <div key={i} style={{position: 'absolute', left: 40 + i * 130, top: 26, width: 6, height: 300, background: 'linear-gradient(180deg,#141C24,#05090E)'}} />
        ))}
        <div style={{position: 'absolute', left: 0, right: 0, top: 60, height: 5, background: 'rgba(120,158,186,0.14)'}} />
      </div>
      {/* a warm window two storeys down, catching the wet roof */}
      <div
        style={{
          position: 'absolute',
          left: 620,
          top: 1500,
          width: 460,
          height: 260,
          background: 'radial-gradient(closest-side, rgba(226,170,74,0.24), transparent 74%)',
          filter: 'blur(26px)',
          mixBlendMode: 'screen',
        }}
      />
      <Rain f={f} density={54} opacity={0.26} />
    </Cam>
  </Night>
);

/* ------------------------------------------------------------------ */
/* 02 — Amara at the window, phone in hand                             */
/* ------------------------------------------------------------------ */

const ShotAmaraWindow: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s2;
  const push = smooth(clamp01(k / 150));
  return (
    <Night f={f} glow="radial-gradient(900px 1100px at 24% 34%, rgba(30,66,96,0.36), rgba(2,5,10,0) 74%)">
      <Cam z={1.03 + push * 0.06} ox="38%" oy="38%">
        <ApartmentWindow f={f} phone={1} light={0.9} />
        {/* she stands at the glass, right of centre, looking down at the glow */}
        <div style={{position: 'absolute', left: 296, top: 300, width: 860, height: 1740}}>
          <Amara
            expression="guarded"
            look="down"
            turn={-0.04}
            screen={0.6}
            rim={1.55}
            lidOverride={blinkLid(f, 122)}
            viewBox="168 52 264 470"
            preserve="xMidYMax slice"
          />
        </div>
        {/* the phone, just out of frame, lighting her jaw and collar */}
        <div
          style={{
            position: 'absolute',
            left: 150,
            top: 1360,
            width: 620,
            height: 520,
            borderRadius: '50%',
            background: 'radial-gradient(closest-side, rgba(126,190,222,0.34), transparent 72%)',
            filter: 'blur(32px)',
            mixBlendMode: 'screen',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: 380,
            background: 'linear-gradient(180deg, transparent, rgba(2,5,10,0.9))',
          }}
        />
      </Cam>
    </Night>
  );
};

/* ------------------------------------------------------------------ */
/* 03 — the street, the signal that is not a voice                     */
/* ------------------------------------------------------------------ */

const ShotStreet: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s3;
  const lamp = 0.9 + Math.sin(f / 33) * 0.08;
  return (
    <Night f={f} glow="radial-gradient(900px 900px at 40% 30%, rgba(30,68,98,0.36), rgba(2,5,10,0) 74%)">
      <Cam z={1.0 + smooth(clamp01(k / 60)) * 0.03} ox="50%" oy="60%">
        <Skyline f={f} dim={0.55} />
        <Street f={f} wet={1} />
        {/* traffic light, changing on its own */}
        <div style={{position: 'absolute', left: 748, bottom: 470, width: 26, height: 300}}>
          <div style={{position: 'absolute', left: -12, bottom: 0, width: 50, height: 150, borderRadius: 10, background: 'linear-gradient(180deg,#141C24,#070C12)'}} />
          {['#E2765C', '#E2AA4A', '#6E8E7A'].map((c, i) => (
            <div
              key={c}
              style={{
                position: 'absolute',
                left: 1,
                bottom: 116 - i * 42,
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: c,
                opacity: i === 1 ? lamp : 0.12,
                boxShadow: i === 1 ? `0 0 26px ${c}` : 'none',
              }}
            />
          ))}
        </div>
        <Rain f={f} density={64} opacity={0.34} />
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: 700,
            background: 'radial-gradient(60% 100% at 50% 0%, rgba(226,170,74,0.1), transparent 72%)',
            mixBlendMode: 'screen',
          }}
        />
      </Cam>
    </Night>
  );
};

/* ------------------------------------------------------------------ */
/* 04 — the phone on the table                                         */
/* ------------------------------------------------------------------ */

const ShotPhone: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s4;
  const lift = smooth(clamp01(k / 40));
  const pulse = 0.55 + Math.abs(Math.sin(k / 11)) * 0.45;
  /* the phone is face up on the table, so the only things that move are the
     screen and the buzz running through the surface under it */
  const buzz = Math.sin(k * 3.1) * 1.4;
  return (
    <Night f={f} glow={`radial-gradient(820px 900px at 50% 48%, rgba(24,58,84,${0.28 + pulse * 0.12}), rgba(2,5,10,0) 70%)`}>
      <Cam z={1.03 + lift * 0.05} ox="50%" oy="50%">
        {/* the table she put it down on, filling the frame from above */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(166deg,#18232D 0%,#0E1720 38%,#091016 76%,#04080D 100%)',
          }}
        />
        {/* lamp light, well off to the upper left */}
        <div
          style={{
            position: 'absolute',
            left: -220,
            top: -260,
            width: 1180,
            height: 1100,
            background: 'radial-gradient(closest-side, rgba(178,204,220,0.16), rgba(8,16,22,0) 72%)',
            mixBlendMode: 'screen',
          }}
        />
        {/* veneer lines, shallow perspective */}
        {Array.from({length: 9}).map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: -80,
              right: -80,
              top: 120 + i * 210,
              height: 1.4,
              background: 'rgba(150,186,208,0.075)',
              transform: `rotate(${-1.2 + i * 0.32}deg)`,
            }}
          />
        ))}
        {/* the light the screen throws across the table */}
        <div
          style={{
            position: 'absolute',
            left: 120,
            top: 360,
            width: 840,
            height: 1240,
            background: `radial-gradient(closest-side, rgba(104,176,214,${0.2 + pulse * 0.1}), rgba(6,14,20,0) 76%)`,
            filter: 'blur(40px)',
            mixBlendMode: 'screen',
          }}
        />

        {/* the phone itself, lying flat */}
        <div
          style={{
            position: 'absolute',
            left: 262,
            top: 500,
            width: 560,
            height: 1010,
            transform: `translateX(${buzz}px) rotate(${-7 + lift * 2}deg) perspective(1700px) rotateX(9deg)`,
          }}
        >
          {/* contact shadow on the table: wide one for the ambient, a tight
              one where the body meets the veneer */}
          <div
            style={{
              position: 'absolute',
              left: 34,
              top: 44,
              width: 548,
              height: 1024,
              borderRadius: 46,
              background: 'rgba(0,0,0,0.8)',
              filter: 'blur(34px)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 10,
              top: 12,
              width: 552,
              height: 1014,
              borderRadius: 42,
              background: 'rgba(0,0,0,0.82)',
              filter: 'blur(9px)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 40,
              background: 'linear-gradient(158deg,#202B36,#05080D 68%)',
              boxShadow: `0 0 ${54 + pulse * 30}px rgba(120,184,216,${0.16 + pulse * 0.1}), inset 0 0 0 2px rgba(150,196,224,0.3), inset 0 0 22px rgba(0,0,0,0.6)`,
            }}
          >
            {/* bezel highlight, the edge that faces the lamp */}
            <div
              style={{
                position: 'absolute',
                left: 6,
                right: 6,
                top: 3,
                height: 3,
                borderRadius: 2,
                background: 'rgba(194,220,236,0.30)',
              }}
            />
            <div
              style={{position: 'absolute', inset: 16, borderRadius: 28, background: 'radial-gradient(120% 84% at 50% 26%, #143A54, #050C14 74%)', overflow: 'hidden'}}
            >
              <Waveform f={f} beat={0.7} />
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '42%',
                  width: 300,
                  height: 300,
                  marginLeft: -150,
                  marginTop: -150,
                  borderRadius: '50%',
                  border: '1.5px solid rgba(150,206,232,0.32)',
                  opacity: 0.35 + pulse * 0.5,
                }}
              />
              <Scanlines opacity={0.16} />
              <ScreenGlass strength={0.5} />
            </div>
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(70% 62% at 48% 46%, transparent 30%, rgba(2,5,9,0.86) 100%)',
          }}
        />
      </Cam>
    </Night>
  );
};

/* ------------------------------------------------------------------ */
/* 05 — the heartbeat inside the speaker                               */
/* ------------------------------------------------------------------ */

const ShotHeartbeat: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s5;
  const beat = 0.6 + Math.abs(Math.sin(k / 10)) * 0.85;
  const rings = [0, 1, 2, 3];
  return (
    <Night f={f} glow="radial-gradient(900px 1100px at 50% 48%, rgba(30,74,106,0.52), rgba(2,5,10,0) 72)" grain={0.06}>
      <Cam z={1.03 + smooth(clamp01(k / 85)) * 0.07} ox="50%" oy="46%">
        {/* the phone glass, close enough that its corners are off frame */}
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(82% 70% at 50% 44%, #103048 0%, #071523 52%, #03080D 100%)'}} />
        {/* pulse rings, big and low */}
        {rings.map((i) => {
          const p = ((k * 0.85 + i * 22) % 62) / 62;
          const size = 300 + p * 1100;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: '50%',
                top: '52%',
                width: size,
                height: size,
                marginLeft: -size / 2,
                marginTop: -size / 2,
                borderRadius: '50%',
                border: `${Math.max(1, 4 - p * 4)}px solid rgba(160,214,240,${0.34 * (1 - p)})`,
              }}
            />
          );
        })}
        {/* the trace itself, reading as a heart monitor */}
        <svg viewBox="0 0 1080 600" width="100%" height="100%" style={{position: 'absolute', inset: 0, opacity: 0.95}}>
          <path
            d={`M -40 300 L 120 300 L 168 300 L 196 152 L 236 448 L 268 300 L 452 ${300 - 10 * beat} L 566 300 L 596 210 L 626 300 L 820 300 L 856 ${300 - 6 * beat} L 1010 300`}
            fill="none"
            stroke="rgba(190,232,250,0.92)"
            strokeWidth={5}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{filter: 'drop-shadow(0 0 22px rgba(150,210,240,0.85))'}}
            strokeDasharray={2400}
            strokeDashoffset={2400 - clamp01(k / 26) * 2400}
          />
        </svg>
        <Scanlines opacity={0.24} />
        <ScreenGlass strength={0.55} />
      </Cam>
    </Night>
  );
};

/* ------------------------------------------------------------------ */
/* 06-07 — the relay tower                                             */
/* ------------------------------------------------------------------ */

const ShotTowerDark: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s6;
  return (
    <Night f={f} glow="radial-gradient(1100px 900px at 56% 24%, rgba(28,62,92,0.34), rgba(2,5,10,0) 74%)">
      <Cam z={1.0 + smooth(clamp01(k / 52)) * 0.05} ox="56%" oy="46%">
        <Skyline f={f} dim={0.3} />
        <Haze x="56%" y="30%" size={900} color="rgba(60,110,146,0.2)" />
        {/* the ridge the tower stands on, in front of the city */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(176deg, rgba(5,10,15,0) 0%, #050A0F 100%)',
            clipPath: 'polygon(0 1920px, 0 1460px, 320 1330px, 700 1246px, 1080 1218px, 1080 1920px)',
          }}
        />
        <div style={{position: 'absolute', inset: 0, transform: 'translate(246px, -120px) scale(0.86)', transformOrigin: '50% 100%'}}>
          <RelayTower f={f} distance={1.15} alive={0} />
        </div>
        <Rain f={f} density={50} opacity={0.3} />
      </Cam>
    </Night>
  );
};

const ShotTowerAlive: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s7;
  const wake = smooth(clamp01(k / 26));
  return (
    <Night f={f} glow={`radial-gradient(1000px 1000px at 58% 30%, rgba(40,88,124,${0.3 + wake * 0.16}), rgba(2,5,10,0) 74%)`}>
      <Cam z={1.02 + smooth(clamp01(k / 78)) * 0.06} ox="58%" oy="40%">
        <Skyline f={f} dim={0.26} />
        <Haze x="58%" y="34%" size={820} color={`rgba(86,156,196,${0.16 + wake * 0.2})`} />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(176deg, rgba(5,10,15,0) 0%, #050A0F 100%)',
            clipPath: 'polygon(0 1920px, 0 1560px, 340 1420px, 720 1330px, 1080 1300px, 1080 1920px)',
          }}
        />
        <div style={{position: 'absolute', inset: 0, transform: 'translate(232px, -50px) scale(0.9)', transformOrigin: '50% 100%'}}>
          <RelayTower f={f} distance={1.15} alive={wake} />
        </div>
        {/* the light it throws on the ridge */}
        <div
          style={{
            position: 'absolute',
            left: 380,
            top: 1120,
            width: 620,
            height: 420,
            background: `radial-gradient(closest-side, rgba(150,204,232,${0.18 * wake}), transparent 76%)`,
            filter: 'blur(40px)',
            mixBlendMode: 'screen',
          }}
        />
        <Rain f={f} density={46} opacity={0.24} />
      </Cam>
    </Night>
  );
};

/* ------------------------------------------------------------------ */
/* 08 — the transmission is opened                                     */
/* ------------------------------------------------------------------ */

const ShotDesk: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s8;
  const open = smooth(clamp01(k / 20));
  return (
    <Night f={f} glow={`radial-gradient(900px 900px at 46% 44%, rgba(52,118,158,${0.24 + open * 0.2}), rgba(2,5,10,0) 72)`}>
      <Cam z={1.02 + smooth(clamp01(k / 62)) * 0.05} ox="46%" oy="46%">
        {/* she is leaning over the desk; her shoulder is the only body in frame */}
        <div style={{position: 'absolute', left: -40, right: -40, top: 1240, bottom: -40, background: 'linear-gradient(180deg,#121A22,#05090E 62%)'}} />
        {/* laptop, seen slightly from above */}
        <div
          style={{
            position: 'absolute',
            left: 96,
            top: 300,
            width: 848,
            height: 940,
            borderRadius: 18,
            background: 'linear-gradient(160deg,#1B242E,#070C12)',
            boxShadow: '0 40px 90px rgba(0,0,0,0.9), inset 0 0 0 2px rgba(150,190,216,0.14)',
          }}
        >
          <div style={{position: 'absolute', inset: 16, background: '#03060A', borderRadius: 8, overflow: 'hidden'}}>
            <div style={{position: 'absolute', inset: 0, background: `radial-gradient(90% 80% at 50% 42%, rgba(24,72,104,${0.4 + open * 0.6}), #041019 78%)`}} />
            <Waveform f={f} beat={0.7 + open * 0.5} />
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: 300,
                height: 300,
                marginLeft: -150,
                marginTop: -150,
                borderRadius: '50%',
                border: '1px solid rgba(160,214,240,0.3)',
                opacity: open * (0.4 + Math.sin(f / 8) * 0.3),
              }}
            />
            <GlitchBars f={f} amount={0.22 * open} seed={2} />
            <Scanlines opacity={0.2} />
            <ScreenGlass strength={0.6} />
          </div>
          {/* keyboard deck catching the screen light */}
          <div
            style={{
              position: 'absolute',
              left: -8,
              right: -8,
              top: 940,
              height: 150,
              borderRadius: 10,
              background: 'linear-gradient(180deg,#243039,#0A1017 70%)',
              transform: 'perspective(700px) rotateX(56deg)',
              transformOrigin: '50% 0%',
              boxShadow: 'inset 0 2px 0 rgba(170,210,232,0.2)',
            }}
          />
        </div>
        {/* her forearm and shoulder entering from the bottom right, rimmed by the screen */}
        <div style={{position: 'absolute', left: 600, top: 1190, width: 700, height: 900, transform: 'rotate(-4deg)', transformOrigin: '60% 100%'}}>
          <AmaraBack rim={1.5} viewBox="0 330 300 370" preserve="xMidYMax slice" />
        </div>
        <div style={{position: 'absolute', left: 620, top: 1220, width: 26, height: 700, background: 'linear-gradient(180deg, rgba(198,226,242,0.3), transparent 78%)', filter: 'blur(4px)'}} />
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: 460,
            background: 'linear-gradient(180deg, transparent, rgba(2,5,10,0.8))',
          }}
        />
      </Cam>
    </Night>
  );
};

/* ------------------------------------------------------------------ */
/* 09-13 — Noah inside the white room, through the link                */
/* ------------------------------------------------------------------ */

const FeedFrame: React.FC<{f: number; children: React.ReactNode; grade?: number}> = ({f, children, grade = 1}) => (
  <AbsoluteFill style={{background: '#04070B'}}>
    <div style={{position: 'absolute', inset: -40, filter: `brightness(${0.82 * grade}) contrast(1.04) saturate(0.92)`}}>
      {children}
    </div>
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(70% 62% at 50% 44%, transparent 46%, rgba(4,10,16,0.6) 100%)',
      }}
    />
    <Scanlines opacity={0.2} />
    <ScreenGlass strength={0.55} />
    <div style={{position: 'absolute', inset: 0, background: 'rgba(120,180,214,0.04)', mixBlendMode: 'screen'}} />
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        height: 120,
        top: `${(f * 2.1) % 100}%`,
        background: 'linear-gradient(180deg, transparent, rgba(160,214,240,0.05), transparent)',
      }}
    />
  </AbsoluteFill>
);

const ShotWhiteRoomWide: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s9;
  return (
    <FeedFrame f={f} grade={1}>
      <Cam z={1.02 + smooth(clamp01(k / 95)) * 0.05} ox="50%" oy="44%">
        <WhiteRoom f={f} dim={0.7}>
          <div style={{position: 'absolute', left: 210, top: 300, width: 720, height: 1700}}>
            <Noah
              expression="neutral"
              look="camera"
              turn={-0.08}
              rim={0.55}
              lidOverride={blinkLid(f, 640)}
              viewBox="166 22 268 476"
              preserve="xMidYMax slice"
            />
            {/* his shadow on the white wall, low and soft */}
            <div style={{position: 'absolute', left: 40, top: 1180, width: 640, height: 180, background: 'radial-gradient(closest-side, rgba(140,158,170,0.3), transparent 74%)', filter: 'blur(26px)'}} />
          </div>
        </WhiteRoom>
      </Cam>
    </FeedFrame>
  );
};

const ShotNoahLook: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s10;
  return (
    <FeedFrame f={f} grade={1.05}>
      <Cam z={1.02 + smooth(clamp01(k / 72)) * 0.05} ox="50%" oy="38%">
        <WhiteRoom f={f} dim={0.5}>
          <div style={{position: 'absolute', left: 140, top: 230, width: 800, height: 1800}}>
            <Noah
              expression="unease"
              look="camera"
              rim={0.5}
              lidOverride={blinkLid(f, 736)}
              viewBox="160 26 280 498"
              preserve="xMidYMid slice"
            />
          </div>
        </WhiteRoom>
      </Cam>
    </FeedFrame>
  );
};

const ShotNoahSpeaks: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s11;
  const mouth = talk(f, C.s11 + 2, C.s13 - 4, 0.3, 3.1);
  return (
    <FeedFrame f={f} grade={1.02}>
      <Cam z={1.03 + smooth(clamp01(k / 66)) * 0.06} ox="50%" oy="34%">
        <WhiteRoom f={f} dim={0.46}>
          <div style={{position: 'absolute', left: 130, top: 210, width: 820, height: 1800}}>
            <Noah
              expression="sad"
              look="camera"
              mouth={mouth}
              rim={0.5}
              lidOverride={blinkLid(f, 800)}
              viewBox="170 30 260 462"
              preserve="xMidYMid slice"
            />
          </div>
        </WhiteRoom>
      </Cam>
    </FeedFrame>
  );
};

const ShotBehind: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s12;
  const door = smooth(clamp01((k - 40) / 40));
  return (
    <FeedFrame f={f} grade={1.02}>
      <Cam z={1.02 + smooth(clamp01(k / 118)) * 0.05} ox="50%" oy="42%">
        <WhiteRoom f={f} dim={0.58} door={0.26}>
          {/* a door in the far wall, opening onto a lit corridor */}
          <div style={{position: 'absolute', left: 742, top: 300, width: 300, height: 1180, background: 'linear-gradient(180deg,#0B141B,#04080D)', boxShadow: 'inset 0 0 80px rgba(0,0,0,0.9)'}} />
          <div style={{position: 'absolute', left: 758, top: 330, width: 268, height: 1130, background: `linear-gradient(180deg, rgba(232,244,252,${0.3 + door * 0.5}) 0%, rgba(150,192,218,${0.22 + door * 0.34}) 42%, rgba(60,102,130,${0.14 + door * 0.2}) 100%)`, filter: 'blur(1.5px)'}} />
          <div style={{position: 'absolute', left: 758, top: 330, width: 268, height: 1130, boxShadow: 'inset 0 0 60px rgba(0,0,0,0.55)'}} />
          {/* the second voice: a man standing in it, backlit, out of focus */}
          <div style={{position: 'absolute', left: 758, top: 372, width: 268, height: 1090, filter: 'blur(4px)', opacity: 0.55 + door * 0.45}}>
            <svg viewBox="0 0 268 1090" width="100%" height="100%" preserveAspectRatio="none">
              <path d="M 74 1090 L 78 640 C 80 560 104 512 134 500 C 164 512 188 560 190 640 L 194 1090 Z" fill="#05080C" />
              <ellipse cx={134} cy={438} rx={62} ry={70} fill="#04070B" />
              <path d="M 78 640 C 80 560 104 512 134 500" stroke="rgba(236,248,254,0.8)" strokeWidth={5} fill="none" />
              <path d="M 84 380 C 88 344 108 330 134 330 C 160 330 180 344 184 380" stroke="rgba(226,242,250,0.4)" strokeWidth={4} fill="none" />
              <path d="M 190 640 L 194 1090" stroke="rgba(200,232,248,0.28)" strokeWidth={4} fill="none" />
            </svg>
          </div>

          {/* Noah in the room, facing us, cut at the waist by the frame */}
          <div style={{position: 'absolute', left: 140, top: 430, width: 700, height: 1600}}>
            <Noah
              expression="neutral"
              look="camera"
              turn={-0.06}
              rim={0.42}
              lidOverride={blinkLid(f, 905)}
              viewBox="158 30 284 452"
              preserve="xMidYMax slice"
            />
          </div>
          {/* the near doorframe: only a narrow, blurred edge */}
          <div style={{position: 'absolute', left: -60, top: -40, width: 210, height: 2000, background: 'linear-gradient(90deg,#05090E,#0B1218 62%,#05090E)', filter: 'blur(3px)'}} />
          <div style={{position: 'absolute', left: 138, top: 0, width: 10, height: 1920, background: 'linear-gradient(90deg, rgba(190,216,232,0.16), transparent)', filter: 'blur(3px)'}} />
        </WhiteRoom>
      </Cam>
    </FeedFrame>
  );
};

const ShotVoice: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s13;
  const push = smooth(clamp01(k / 62));
  const fade = smooth(clamp01((k - 18) / 34));
  return (
    <FeedFrame f={f} grade={0.96}>
      <Cam z={1.015 + push * 0.045} ox="46%" oy="42%">
        <WhiteRoom f={f} dim={0.56} />

        {/* the doorway, floor-true, running off the right edge */}
        <div
          style={{
            position: 'absolute',
            left: 772,
            top: 250,
            width: 460,
            height: 1060,
            background:
              'linear-gradient(180deg, #101A22 0%, #0A1219 34%, #05090E 74%, #0A1118 100%)',
            boxShadow: 'inset 0 0 90px rgba(0,0,0,0.9)',
          }}
        />
        {/* frame: slight reveal on the left jamb only */}
        <div style={{position: 'absolute', left: 772, top: 250, width: 11, height: 1060, background: 'linear-gradient(180deg,#9FB6C4,#5C7484 60%,#33454F)'}} />
        <div style={{position: 'absolute', left: 772, top: 250, width: 460, height: 9, background: 'rgba(150,172,186,0.5)'}} />

        {/* the one standing in it */}
        <div style={{position: 'absolute', left: 0, top: 0, opacity: 0.5 + fade * 0.5}}>
          {/* head */}
          <div style={{position: 'absolute', left: 892, top: 512, width: 70, height: 84, borderRadius: '50% 50% 44% 44%', background: '#05080C'}} />
          <div style={{position: 'absolute', left: 892, top: 512, width: 4, height: 84, background: 'rgba(186,206,218,0.16)'}} />
          {/* neck */}
          <div style={{position: 'absolute', left: 914, top: 588, width: 26, height: 34, background: '#05080C'}} />
          {/* torso */}
          <div
            style={{
              position: 'absolute',
              left: 852,
              top: 616,
              width: 152,
              height: 330,
              borderRadius: '52px 52px 12px 12px',
              background: 'linear-gradient(180deg,#070B10 0%,#04070A 100%)',
              boxShadow: 'inset 3px 0 0 rgba(186,206,218,0.1)',
            }}
          />
          {/* legs */}
          <div style={{position: 'absolute', left: 872, top: 936, width: 48, height: 372, background: '#04070A'}} />
          <div style={{position: 'absolute', left: 938, top: 936, width: 48, height: 372, background: '#04070A'}} />
          {/* feet */}
          <div style={{position: 'absolute', left: 862, top: 1298, width: 62, height: 22, borderRadius: 6, background: '#04070A'}} />
          <div style={{position: 'absolute', left: 930, top: 1298, width: 62, height: 22, borderRadius: 6, background: '#04070A'}} />
        </div>
        {/* contact shadow at those feet */}
        <div
          style={{
            position: 'absolute',
            left: 838,
            top: 1300,
            width: 210,
            height: 30,
            borderRadius: '50%',
            background: 'rgba(0,0,0,0.5)',
            filter: 'blur(11px)',
            opacity: 0.6 + fade * 0.3,
          }}
        />
        {/* the leak of light around the jamb, brightest at the threshold */}
        <div
          style={{
            position: 'absolute',
            left: 766,
            top: 250,
            width: 12,
            height: 1060,
            background: 'linear-gradient(180deg, rgba(226,240,248,0.2), rgba(226,240,248,0.55) 72%, rgba(226,240,248,0.16))',
            filter: 'blur(2px)',
            opacity: 0.5 + fade * 0.4,
          }}
        />

        {/* Noah's back, left of frame, head just under the top third */}
        <div style={{position: 'absolute', left: -210, top: 40, width: 830, height: 1880}}>
          <NoahBack rim={0.6} />
        </div>
      </Cam>
    </FeedFrame>
  );
};

/* ------------------------------------------------------------------ */
/* 14 — the picture freezes                                            */
/* ------------------------------------------------------------------ */

const ShotFreeze: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s14;
  const jolt = k > 30 ? Math.sin(k * 9) * 2 : 0;
  const bands = 0.35 + Math.sin(k / 4) * 0.2;
  return (
    <FeedFrame f={f} grade={0.98}>
      <div style={{position: 'absolute', inset: 0, transform: `translate(${jolt}px, ${jolt * 0.5}px)`}}>
        <WhiteRoom f={C.s11} dim={0.46}>
          <div style={{position: 'absolute', left: 120, top: 10, width: 840, height: 1890}}>
            <Noah
              expression="sad"
              look="camera"
              mouth={0.12}
              rim={0.5}
              viewBox="176 40 250 420"
              preserve="xMidYMid slice"
            />
          </div>
        </WhiteRoom>
      </div>
      <GlitchBars f={f} amount={bands} seed={11} />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: '38%',
          height: 4,
          background: 'rgba(210,238,252,0.6)',
          opacity: 0.5,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `repeating-linear-gradient(0deg, rgba(0,0,0,0.5) 0 2px, transparent 2px 6px)`,
          opacity: 0.16 + Math.sin(k / 3) * 0.06,
        }}
      />
    </FeedFrame>
  );
};

/* ------------------------------------------------------------------ */
/* 15 — the coordinates under the city                                 */
/* ------------------------------------------------------------------ */

const ShotMap: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s15;
  const reveal = smooth(clamp01(k / 52));
  return (
    <Night f={f} glow="radial-gradient(900px 1000px at 50% 46%, rgba(18,58,74,0.4), rgba(2,5,10,0) 74%)">
      <Cam z={1.02 + reveal * 0.05} ox="60%" oy="56%">
        <TunnelMap f={f} reveal={reveal} />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(64% 58% at 50% 46%, transparent 40%, rgba(2,6,10,0.8) 100%)',
          }}
        />
        <Scanlines opacity={0.16} />
      </Cam>
    </Night>
  );
};

/* ------------------------------------------------------------------ */
/* 16 — the keys                                                       */
/* ------------------------------------------------------------------ */

const ShotKeys: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s16;
  const grab = smooth(clamp01((k - 14) / 34));
  return (
    <Night f={f} glow="radial-gradient(820px 820px at 46% 52%, rgba(40,80,108,0.4), rgba(2,5,10,0) 72%)">
      <Cam z={1.03 + grab * 0.05} ox="48%" oy="54%">
        <KeysOnTable f={f} grab={grab} />
      </Cam>
    </Night>
  );
};

/* ------------------------------------------------------------------ */
/* 17 — "Then I am coming anyway."                                     */
/* ------------------------------------------------------------------ */

const ShotAmaraFinal: React.FC<{f: number}> = ({f}) => {
  const k = f - C.s17;
  const mouth = talk(f, C.s17 + 4, C.total - 20, 0.26, 3.2);
  const fade = smooth(clamp01((f - FADE) / 12));
  return (
    <Night f={f} glow="radial-gradient(900px 1000px at 54% 34%, rgba(40,84,116,0.42), rgba(2,5,10,0) 74%)">
      <Cam z={1.02 + smooth(clamp01(k / 52)) * 0.05} ox="54%" oy="32%">
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(178deg,#091019,#04070B 70%)'}} />
        <div
          style={{
            position: 'absolute',
            left: 560,
            top: 300,
            width: 520,
            height: 1200,
            background: 'radial-gradient(closest-side, rgba(86,146,182,0.36), transparent 76%)',
            filter: 'blur(30px)',
            mixBlendMode: 'screen',
          }}
        />
        {/* doorway behind her, street light coming in */}
        <div
          style={{
            position: 'absolute',
            left: 690,
            top: 260,
            width: 330,
            height: 1320,
            background: 'linear-gradient(180deg, rgba(120,176,210,0.16), rgba(30,58,80,0.06))',
            boxShadow: 'inset 0 0 80px rgba(6,12,18,0.9)',
          }}
        />
        <div style={{position: 'absolute', left: 660, top: 240, width: 30, height: 1360, background: 'rgba(18,26,34,0.9)'}} />
        <div style={{position: 'absolute', left: 1010, top: 240, width: 40, height: 1360, background: 'rgba(10,16,22,0.95)'}} />
        <div style={{position: 'absolute', left: 176, top: 236, width: 780, height: 1700}}>
          <Amara
            expression="defiant"
            look="camera"
            mouth={mouth}
            turn={0.06}
            rim={1.15}
            screen={0.5}
            lidOverride={blinkLid(f, 1256)}
            viewBox="196 78 208 370"
            preserve="xMidYMid slice"
          />
        </div>
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: 460,
            background: 'linear-gradient(180deg, transparent, rgba(2,5,10,0.8))',
          }}
        />
        {fade > 0 ? <AbsoluteFill style={{background: '#000', opacity: fade}} /> : null}
      </Cam>
    </Night>
  );
};

/* ------------------------------------------------------------------ */

export const S02E01: React.FC = () => {
  const f = useCurrentFrame();
  const shot =
    f < C.s2 ? (
      <ShotCity f={f} />
    ) : f < C.s3 ? (
      <ShotAmaraWindow f={f} />
    ) : f < C.s4 ? (
      <ShotStreet f={f} />
    ) : f < C.s5 ? (
      <ShotPhone f={f} />
    ) : f < C.s6 ? (
      <ShotHeartbeat f={f} />
    ) : f < C.s7 ? (
      <ShotTowerDark f={f} />
    ) : f < C.s8 ? (
      <ShotTowerAlive f={f} />
    ) : f < C.s9 ? (
      <ShotDesk f={f} />
    ) : f < C.s10 ? (
      <ShotWhiteRoomWide f={f} />
    ) : f < C.s11 ? (
      <ShotNoahLook f={f} />
    ) : f < C.s12 ? (
      <ShotNoahSpeaks f={f} />
    ) : f < C.s13 ? (
      <ShotBehind f={f} />
    ) : f < C.s14 ? (
      <ShotVoice f={f} />
    ) : f < C.s15 ? (
      <ShotFreeze f={f} />
    ) : f < C.s16 ? (
      <ShotMap f={f} />
    ) : f < C.s17 ? (
      <ShotKeys f={f} />
    ) : (
      <ShotAmaraFinal f={f} />
    );

  return (
    <AbsoluteFill style={{background: '#02050A'}}>
      <Audio src={staticFile('audio/s02e01.mp3')} />
      <Grade lift={1.04} contrast={1.04}>{shot}</Grade>
      {/* black tail: the film ends in black, and it ends inside the audio */}
      <AbsoluteFill
        style={{background: '#000', opacity: smooth(clamp01((f - (C.total - 26)) / 13))}}
      />
      {f < C.total - 26 ? <Watermark /> : null}
    </AbsoluteFill>
  );
};
