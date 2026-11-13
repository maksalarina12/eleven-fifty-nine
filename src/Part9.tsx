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
/* Part 9 — THE FIRST EXPERIMENT                                       */
/* 94.3543 s of real audio -> 2831 frames. 16 shots.                   */
/* ------------------------------------------------------------------ */

const C = {
  s1: 0,
  s2: 90,
  s3: 234,
  s4: 450,
  s5: 561,
  s6: 693,
  s7: 987,
  s8: 1137,
  s9: 1308,
  s10: 1440,
  s11: 1533,
  s12: 1686,
  s13: 1896,
  s14: 2136,
  s15: 2400,
  s16: 2598,
  total: 2831,
};

const FADE = 2822;

const Ambient: React.FC<{f: number; glow?: number; warm?: number}> = ({f, glow = 1, warm = 1}) => (
  <>
    <AbsoluteFill style={{background: '#02050A'}} />
    <div
      style={{
        position: 'absolute',
        inset: -140,
        background:
          'radial-gradient(960px 1040px at 50% 30%, rgba(44,96,128,0.3), rgba(3,7,11,0) 74%)',
        opacity: 0.9 + Math.sin(f / 31) * 0.03,
      }}
    />
    <div
      style={{
        position: 'absolute',
        left: -120,
        top: 520,
        width: 620,
        height: 900,
        background: `radial-gradient(closest-side, rgba(226,170,74,${0.15 * glow * warm}), transparent 74%)`,
        filter: 'blur(44px)',
        mixBlendMode: 'screen',
      }}
    />
  </>
);

/* ------------------------------------------------------------------ */
/* the flashback laboratory                                            */
/* ------------------------------------------------------------------ */

const LabSet: React.FC<{f: number; power?: number; alarm?: number; warm?: number}> = ({
  f,
  power = 1,
  alarm = 0,
  warm = 1,
}) => {
  const fl = flick(f, 5.5);
  return (
    <>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg,#080F15 0%,#0B1822 34%,#071017 64%,#03070B 100%)',
        }}
      />
      {/* ceiling trusses */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: 250,
          background:
            'repeating-linear-gradient(96deg, rgba(24,38,48,0.9) 0 26px, rgba(10,18,24,0.9) 26px 96px)',
          opacity: 0.9,
        }}
      />
      <div style={{position: 'absolute', left: 0, right: 0, top: 246, height: 10, background: 'rgba(20,34,44,0.95)'}} />
      {/* practical lamps */}
      {[220, 860].map((x, i) => (
        <div key={x} style={{position: 'absolute', left: x, top: 170, width: 60, height: 26}}>
          <div style={{position: 'absolute', inset: 0, borderRadius: 8, background: 'linear-gradient(180deg,#3A2C18,#1A1409)'}} />
          <div
            style={{
              position: 'absolute',
              left: -60,
              top: 16,
              width: 180,
              height: 300,
              background: `radial-gradient(closest-side, rgba(226,168,74,${0.24 * warm * (0.9 + i * 0.06)}), transparent 74%)`,
              filter: 'blur(26px)',
              mixBlendMode: 'screen',
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
          top: 260,
          height: 1120,
          background:
            'repeating-linear-gradient(90deg, rgba(120,166,196,0.035) 0 3px, transparent 3px 148px)',
        }}
      />
      {/* the apparatus: arch + pod */}
      <div style={{position: 'absolute', left: 330, top: 300, width: 420, height: 1120}}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '210px 210px 24px 24px',
            border: '14px solid rgba(38,54,66,0.92)',
            boxShadow: 'inset 0 0 90px rgba(0,0,0,0.85), 0 0 60px rgba(70,140,180,0.1)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 26,
            top: 40,
            right: 26,
            bottom: 20,
            borderRadius: '180px 180px 12px 12px',
            background: `linear-gradient(180deg, rgba(96,168,204,${0.1 * power}) 0%, rgba(16,40,54,0.5) 60%, rgba(4,10,14,0.9) 100%)`,
            boxShadow: `inset 0 0 ${80 * power}px rgba(110,182,220,${0.16 * power})`,
          }}
        />
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 24,
              right: 24,
              top: 150 + i * 190,
              height: 2,
              background: `rgba(150,208,236,${0.1 * power})`,
            }}
          />
        ))}
      </div>
      {/* cable bundles from the arch to the floor */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: 300 + i * 12,
            top: 900,
            width: 8,
            height: 520,
            borderRadius: 4,
            background: 'linear-gradient(180deg,#1B2833,#070C11)',
            transform: `rotate(${-4 - i * 3}deg)`,
          }}
        />
      ))}
      {/* console with three monitors, right side */}
      <div style={{position: 'absolute', left: 790, top: 700, width: 300, height: 560}}>
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 300,
            width: 300,
            height: 26,
            background: 'linear-gradient(180deg,#1B2A34,#080F15)',
          }}
        />
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: i * 98,
              top: 130 - i * 10,
              width: 92,
              height: 170,
              borderRadius: 4,
              background: '#070C11',
              boxShadow: `inset 0 0 0 1px rgba(130,172,200,0.16), 0 0 ${34 * power}px rgba(80,150,190,${0.2 * power})`,
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 5,
                background: `linear-gradient(180deg, rgba(72,140,178,${0.5 * power * fl}) 0%, rgba(14,38,52,0.8) 100%)`,
                boxShadow: `inset 0 0 20px rgba(0,0,0,0.6)`,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: 8,
                  top: 14 + i * 6,
                  width: 56,
                  height: 2,
                  background: `rgba(176,220,244,${0.5 * power})`,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: 8,
                  top: 30 + i * 6,
                  width: 36,
                  height: 2,
                  background: `rgba(176,220,244,${0.3 * power})`,
                }}
              />
              <Scanlines opacity={0.2} />
            </div>
          </div>
        ))}
      </div>
      {/* floor */}
      <div
        style={{
          position: 'absolute',
          left: -60,
          right: -60,
          top: 1380,
          height: 620,
          background: 'linear-gradient(180deg,#0A141B 0%,#050A0E 52%,#020406 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 300,
          top: 1382,
          width: 500,
          height: 380,
          background: `radial-gradient(ellipse at 50% 0%, rgba(90,156,192,${0.2 * power}), transparent 72%)`,
          filter: 'blur(30px)',
        }}
      />
      {alarm > 0 ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(700px 800px at 50% 22%, rgba(226,118,92,${0.22 * alarm}), transparent 74%)`,
            mixBlendMode: 'screen',
          }}
        />
      ) : null}
      <Vignette strength={0.92} />
      <Grain f={f} opacity={0.07} />
    </>
  );
};

/* ------------------------------------------------------------------ */
/* shot 01 — the message that ends Part 8                              */
/* ------------------------------------------------------------------ */

const ShotLastMessage: React.FC<{f: number}> = ({f}) => {
  const p = smooth(clamp01((f - C.s1) / C.s2));
  return (
    <AbsoluteFill style={{background: '#02050A', overflow: 'hidden'}}>
      <Cam z={1.0 + p * 0.06} ox="50%" oy="47%">
        <Ambient f={f} glow={0.3} />
        <div style={{position: 'absolute', left: 176, top: 330, width: 730, height: 1270}}>
          <PhoneSlab style={{left: 0, top: 0, width: 730, height: 1270}} rotate={-1.2} glow={1}>
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
                    'radial-gradient(ellipse at 50% 30%, rgba(104,172,212,0.4), transparent 70%)',
                  filter: 'blur(18px)',
                }}
              />
              <PhoneStatus dim={0.3} />
              <div
                style={{
                  position: 'absolute',
                  left: 36,
                  top: 240,
                  fontFamily: SANS,
                  fontSize: 40,
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
                  top: 320,
                  fontFamily: SANS,
                  fontSize: 58,
                  lineHeight: 1.22,
                  color: 'rgba(246,251,254,0.97)',
                  textShadow: '0 0 34px rgba(126,196,232,0.4)',
                }}
              >
                You were the one who created it.
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
/* shot 02 — her hands, her eyes                                       */
/* ------------------------------------------------------------------ */

const ShotTremble: React.FC<{f: number}> = ({f}) => {
  const eyes = f >= 168;
  const p = smooth(clamp01((f - C.s2) / (C.s3 - C.s2)));
  const tremble = Math.sin(f / 1.9) * 2.1 + Math.sin(f / 3.3) * 1.3;
  const lid = blinkLid(f, 190, 8) + blinkLid(f, 220, 7);
  return (
    <AbsoluteFill style={{background: '#02050A', overflow: 'hidden'}}>
      {!eyes ? (
        <Cam z={1.06 - p * 0.04} ox="50%" oy="56%">
          <Ambient f={f} glow={0.4} />
          <div
            style={{
              position: 'absolute',
              left: -60,
              right: -60,
              top: 560,
              height: 1400,
              background: 'linear-gradient(180deg,#101B23 0%,#0A1218 32%,#03060A 100%)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 120,
              top: 640,
              width: 840,
              height: 460,
              background: 'radial-gradient(ellipse at 50% 20%, rgba(110,176,214,0.22), transparent 74%)',
              filter: 'blur(40px)',
            }}
          />
          {/* both forearms resting on the desk, hands meeting at the centre */}
          {[0, 1].map((i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: i === 0 ? 40 : 560,
                top: 760,
                width: 480,
                height: 700,
                transform: `translate(${(i === 0 ? 1 : -1) * tremble}px, 0) rotate(${i === 0 ? 14 : -14}deg)`,
                filter: 'blur(3.2px) brightness(0.62)',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: 120,
                  top: 260,
                  width: 340,
                  height: 620,
                  borderRadius: '150px 150px 30px 30px',
                  background: 'linear-gradient(200deg,#22303C 0%,#0E1820 54%,#05090E 100%)',
                  boxShadow: 'inset 12px 0 34px rgba(0,0,0,0.78)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: 132,
                  top: 228,
                  width: 316,
                  height: 62,
                  borderRadius: 20,
                  background: 'linear-gradient(200deg,#2A3946,#0B131A)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: 150,
                  top: 96,
                  width: 270,
                  height: 200,
                  borderRadius: '48% 48% 46% 46%',
                  background: 'linear-gradient(150deg,#463225 0%,#281B12 60%,#130D09 100%)',
                  boxShadow: 'inset -10px -8px 26px rgba(0,0,0,0.66)',
                }}
              />
              {[0, 1, 2, 3].map((k) => (
                <div
                  key={k}
                  style={{
                    position: 'absolute',
                    left: 164 + k * 62,
                    top: 52 + Math.abs(k - 1.5) * 12,
                    width: 56,
                    height: 140 - Math.abs(k - 1.5) * 18,
                    borderRadius: 26,
                    background: 'linear-gradient(160deg,#43311F,#1D140C)',
                    transform: `rotate(${(k - 1.5) * 5}deg)`,
                  }}
                />
              ))}
            </div>
          ))}
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 1500,
              height: 420,
              background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.9))',
            }}
          />
        </Cam>
      ) : (
        <Cam z={1.0 + p * 0.1} ox="52%" oy="40%">
          <Ambient f={f} glow={0.35} />
          <div
            style={{
              position: 'absolute',
              left: 190,
              top: 90,
              width: 860,
              height: 1600,
              filter: 'brightness(0.92)',
            }}
          >
            <Amara
              expression="guarded"
              look="down"
              turn={0.06}
              rim={1.25}
              screen={0.72}
              lidOverride={Math.min(1, lid)}
              viewBox="206 48 188 344"
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
/* shot 03 — the hidden file                                           */
/* ------------------------------------------------------------------ */

const ShotHiddenFile: React.FC<{f: number}> = ({f}) => {
  const p = smooth(clamp01((f - C.s3) / (C.s4 - C.s3)));
  const row = smooth(clamp01((f - C.s3 - 20) / 24));
  const big = smooth(clamp01((f - C.s3 - 96) / 26));
  return (
    <AbsoluteFill style={{background: '#02050A', overflow: 'hidden'}}>
      <Cam z={1.02 + p * 0.07} ox="50%" oy="44%">
        <Ambient f={f} glow={0.4} />
        <div style={{position: 'absolute', left: 60, top: 340, width: 960, height: 1180}}>
          <Monitor inset={14} radius={8} style={{position: 'absolute', inset: 0}}>
            <div style={{position: 'absolute', inset: 0, background: '#04090E'}} />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'radial-gradient(70% 60% at 50% 44%, rgba(66,132,168,0.4), rgba(3,8,12,0.92) 80%)',
              }}
            />
            {/* a filesystem row, then the title takes the frame */}
            <div
              style={{
                position: 'absolute',
                left: 62,
                top: 190,
                right: 62,
                height: 96,
                borderRadius: 6,
                background: 'rgba(126,186,218,0.06)',
                border: '1px solid rgba(150,200,228,0.18)',
                opacity: row * (1 - big * 0.85),
              }}
            >
              <div style={{position: 'absolute', left: 24, top: 34, width: 34, height: 26, background: 'rgba(160,208,234,0.4)', borderRadius: 3}} />
              <div style={{position: 'absolute', left: 76, top: 38, width: 320, height: 4, background: 'rgba(180,220,242,0.32)'}} />
              <div style={{position: 'absolute', left: 76, top: 52, width: 190, height: 3, background: 'rgba(180,220,242,0.18)'}} />
            </div>
            <div
              style={{
                position: 'absolute',
                left: 30,
                right: 30,
                top: 430,
                textAlign: 'center',
                fontFamily: MONO,
                fontSize: 88,
                letterSpacing: '0.08em',
                lineHeight: 1.3,
                color: `rgba(236,248,253,${0.3 + big * 0.7})`,
                textShadow: '0 0 46px rgba(126,196,232,0.44)',
                opacity: big,
                transform: `translateY(${(1 - big) * 12}px)`,
              }}
            >
              THE FIRST
              <br />
              EXPERIMENT
            </div>
            <div
              style={{
                position: 'absolute',
                left: 300,
                right: 300,
                top: 690,
                height: 2,
                background: `rgba(160,212,240,${0.5 * big})`,
              }}
            />
            <Scanlines opacity={0.24} />
            <ScreenGlass strength={0.7} />
          </Monitor>
        </div>
      </Cam>
      <Vignette strength={0.9} />
      <Grain f={f} opacity={0.075} />
      <Watermark />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* shot 04 — everything begins to return                               */
/* ------------------------------------------------------------------ */

const ShotReturn: React.FC<{f: number}> = ({f}) => {
  const p = smooth(clamp01((f - C.s4) / (C.s5 - C.s4)));
  const bleed = smooth(clamp01((f - C.s4 - 6) / 40));
  return (
    <AbsoluteFill style={{background: '#02050A', overflow: 'hidden'}}>
      <Cam z={1.04 + p * 0.05} ox="50%" oy="40%">
        <div style={{position: 'absolute', inset: 0, filter: `brightness(${0.62 + bleed * 0.62})`, opacity: clamp01(bleed * 1.6)}}>
          <LabSet f={f} power={0.9} warm={1.15} />
        </div>
        <div
          style={{
            position: 'absolute',
            left: 60,
            top: 340,
            width: 960,
            height: 1180,
            opacity: 1 - bleed * 0.92,
            filter: `blur(${bleed * 12}px)`,
            boxShadow: `0 0 ${120 * (1 - bleed)}px rgba(70,140,180,0.3)`,
          }}
        >
          <Monitor inset={14} radius={8} style={{position: 'absolute', inset: 0}}>
            <div style={{position: 'absolute', inset: 0, background: '#04090E'}} />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'radial-gradient(64% 54% at 50% 44%, rgba(86,158,196,0.44), rgba(3,8,12,0.92) 78%)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 120,
                top: 300,
                width: 720,
                height: 3,
                background: 'rgba(180,224,246,0.34)',
              }}
            />
          </Monitor>
        </div>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(700px 700px at 50% 40%, rgba(190,232,250,${0.28 * bleed}), transparent 70%)`,
            mixBlendMode: 'screen',
          }}
        />
      </Cam>
      <Vignette strength={0.86} />
      <Grain f={f} opacity={0.08} />
      <Watermark />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* shot 05 — Amara and Doctor Elias, three years earlier               */
/* ------------------------------------------------------------------ */

const ShotResearchers: React.FC<{f: number}> = ({f}) => {
  const p = smooth(clamp01((f - C.s5) / (C.s6 - C.s5)));
  const z = 1.03 + p * 0.05;
  const lid = blinkLid(f, C.s5 + 40, 7);
  return (
    <AbsoluteFill style={{background: '#02050A', overflow: 'hidden'}}>
      <Cam z={z} ox="46%" oy="38%">
        <LabSet f={f} power={1} warm={1.2} />
        <div style={{position: 'absolute', left: 120, top: 620, width: 460, height: 1020}}>
          <Amara
            expression="focus"
            look="right"
            turn={0.24}
            rim={1.1}
            screen={0.5}
            lidOverride={lid}
            viewBox="120 20 360 700"
            preserve="xMidYMax meet"
          />
        </div>
        <div style={{position: 'absolute', left: 540, top: 560, width: 470, height: 1080}}>
          <DrElias
            expression="calm"
            look="left"
            turn={-0.22}
            rim={1.05}
            screen={0.4}
            mouth={talk(f, C.s5 + 20, C.s5 + 90, 0.16, 3.4)}
            viewBox="100 16 380 720"
            preserve="xMidYMax meet"
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
/* shot 06 — the first volunteer                                       */
/* ------------------------------------------------------------------ */

const ShotVolunteer: React.FC<{f: number}> = ({f}) => {
  const close = f >= 840;
  const p = smooth(clamp01((f - C.s6) / (C.s7 - C.s6)));
  const z = 1.02 + p * 0.05;
  const lid = blinkLid(f, C.s6 + 60, 8);
  return (
    <AbsoluteFill style={{background: '#02050A', overflow: 'hidden'}}>
      {!close ? (
        <Cam z={z} ox="48%" oy="38%">
          <LabSet f={f} power={1.05} warm={1.1} />
          <div style={{position: 'absolute', left: 300, top: 640, width: 470, height: 1060}}>
            <Noah
              expression="tired"
              look="down"
              turn={-0.12}
              rim={1.15}
              lidOverride={lid}
              viewBox="110 16 380 700"
              preserve="xMidYMax meet"
            />
          </div>
        </Cam>
      ) : (
        <Cam z={1.08 + p * 0.06} ox="50%" oy="34%">
          <div
            style={{
              position: 'absolute',
              left: 120,
              top: 180,
              width: 840,
              height: 1600,
              filter: 'brightness(0.96) contrast(1.06)',
            }}
          >
            <Noah
              expression="sad"
              look="camera"
              turn={-0.04}
              rim={1.3}
              lidOverride={lid}
              viewBox="176 54 248 372"
              preserve="xMidYMid slice"
            />
          </div>
        </Cam>
      )}
      <Vignette strength={0.88} />
      <Grain f={f} opacity={0.07} />
      <Watermark />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* shot 07 — the experiment fails                                      */
/* ------------------------------------------------------------------ */

const ShotFailure: React.FC<{f: number}> = ({f}) => {
  const p = smooth(clamp01((f - C.s7) / (C.s8 - C.s7)));
  const alarm = 0.6 + Math.sin(f / 6) * 0.4;
  const z = 1.04 + p * 0.06;
  return (
    <AbsoluteFill style={{background: '#02050A', overflow: 'hidden'}}>
      <Cam z={z} ox="48%" oy="34%">
        <LabSet f={f} power={0.7} alarm={alarm} warm={0.7} />
        <div style={{position: 'absolute', left: 330, top: 380, width: 420, height: 1060, filter: 'brightness(0.9)'}}>
          <Noah
            expression="relief"
            look="down"
            turn={0}
            rim={1.1}
            lidOverride={0.9}
            viewBox="60 10 480 900"
            preserve="xMidYMax meet"
          />
        </div>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(180deg, rgba(226,118,92,${0.06 * alarm}), transparent 40%)`,
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
/* shot 08 — the signal that never stops                               */
/* ------------------------------------------------------------------ */

const Wave: React.FC<{f: number; amp?: number; color?: string}> = ({
  f,
  amp = 1,
  color = 'rgba(150,214,242,0.7)',
}) => {
  const pts: string[] = [];
  for (let i = 0; i <= 60; i++) {
    const x = (i / 60) * 800;
    const y =
      100 +
      Math.sin(i / 3 + f / 7) * 26 * amp +
      Math.sin(i / 1.4 + f / 3.1) * 8 * amp +
      Math.sin(i / 9 - f / 5) * 18 * amp;
    pts.push(`${x},${y}`);
  }
  return (
    <svg width="100%" height="100%" viewBox="0 0 800 200" preserveAspectRatio="none">
      <polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth={2.4} />
    </svg>
  );
};

const ShotSignal: React.FC<{f: number}> = ({f}) => {
  const p = smooth(clamp01((f - C.s8) / (C.s9 - C.s8)));
  const z = 1.02 + p * 0.06;
  return (
    <AbsoluteFill style={{background: '#02050A', overflow: 'hidden'}}>
      <Cam z={z} ox="50%" oy="44%">
        <Ambient f={f} glow={0.35} />
        <div style={{position: 'absolute', left: 60, top: 380, width: 960, height: 1100}}>
          <Monitor inset={14} radius={8} style={{position: 'absolute', inset: 0}}>
            <div style={{position: 'absolute', inset: 0, background: '#04090E'}} />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'radial-gradient(70% 60% at 50% 44%, rgba(60,126,162,0.4), rgba(3,8,12,0.94) 80%)',
              }}
            />
            <div style={{position: 'absolute', left: 40, right: 40, top: 150, height: 300}}>
              <Wave f={f} amp={1} />
            </div>
            <div style={{position: 'absolute', left: 40, right: 40, top: 470, height: 220, opacity: 0.5}}>
              <Wave f={f * 0.7} amp={0.7} color="rgba(150,214,242,0.4)" />
            </div>
            <div
              style={{
                position: 'absolute',
                left: 60,
                right: 60,
                top: 740,
                height: 1,
                background: 'rgba(150,206,232,0.16)',
              }}
            />
            <Scanlines opacity={0.24} />
            <ScreenGlass strength={0.7} />
          </Monitor>
        </div>
      </Cam>
      <Vignette strength={0.9} />
      <Grain f={f} opacity={0.075} />
      <Watermark />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* shot 09 — she tries to shut it down                                 */
/* ------------------------------------------------------------------ */

const ShotShutdown: React.FC<{f: number}> = ({f}) => {
  const p = smooth(clamp01((f - C.s9) / (C.s10 - C.s9)));
  const reach = smooth(clamp01((f - C.s9 - 22) / 40));
  return (
    <AbsoluteFill style={{background: '#02050A', overflow: 'hidden'}}>
      <Cam z={1.04 + p * 0.05} ox="46%" oy="46%">
        <LabSet f={f} power={1} warm={0.9} />
        <div
          style={{
            position: 'absolute',
            right: -140,
            top: 300,
            width: 620,
            height: 1600,
            filter: 'blur(12px) brightness(0.42)',
          }}
        >
          <AmaraBack rim={1.4} viewBox="50 6 210 640" preserve="xMidYMax slice" />
        </div>
        {/* her hand reaching for the console switch */}
        <div
          style={{
            position: 'absolute',
            left: 620 - reach * 60,
            top: 1080 - reach * 40,
            width: 380,
            height: 700,
            transform: `rotate(${18 - reach * 12}deg)`,
            filter: 'blur(0.8px)',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 90,
              top: 260,
              width: 220,
              height: 620,
              borderRadius: '110px 110px 24px 24px',
              background: 'linear-gradient(200deg,#22303C 0%,#0E1820 56%,#05090E 100%)',
              boxShadow: 'inset 14px 0 36px rgba(0,0,0,0.78)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 100,
              top: 228,
              width: 200,
              height: 54,
              borderRadius: 16,
              background: 'linear-gradient(200deg,#2A3946,#0B131A)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 112,
              top: 92,
              width: 190,
              height: 170,
              borderRadius: '46% 46% 48% 48%',
              background: 'linear-gradient(150deg,#463225 0%,#281B12 62%,#130D09 100%)',
              boxShadow: 'inset -10px -8px 26px rgba(0,0,0,0.66)',
            }}
          />
        </div>
        <div
          style={{
            position: 'absolute',
            left: 900,
            top: 1120,
            width: 90,
            height: 44,
            borderRadius: 6,
            background: `linear-gradient(180deg, rgba(226,118,92,${0.5 + reach * 0.4}), rgba(120,40,28,0.8))`,
            boxShadow: `0 0 ${30 * reach}px rgba(226,118,92,${0.5 * reach})`,
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
/* shot 10 — Elias refuses                                             */
/* ------------------------------------------------------------------ */

const ShotRefuse: React.FC<{f: number}> = ({f}) => {
  const p = smooth(clamp01((f - C.s10) / (C.s11 - C.s10)));
  const lid = blinkLid(f, C.s10 + 26, 7);
  return (
    <AbsoluteFill style={{background: '#02050A', overflow: 'hidden'}}>
      <Cam z={1.03 + p * 0.08} ox="48%" oy="34%">
        <Ambient f={f} glow={0.4} />
        <div
          style={{
            position: 'absolute',
            left: 160,
            top: 120,
            width: 880,
            height: 1620,
            filter: 'brightness(0.94) contrast(1.05)',
          }}
        >
          <DrElias
            expression="stare"
            look="camera"
            turn={0.06}
            rim={1.35}
            screen={0.5}
            lidOverride={lid}
            mouth={talk(f, C.s10 + 10, C.s11 - 8, 0.24, 3)}
            viewBox="132 40 300 534"
            preserve="xMidYMid slice"
          />
        </div>
      </Cam>
      <Vignette strength={0.88} />
      <Grain f={f} opacity={0.07} />
      <Watermark />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* shot 11 — she erases her own memories                               */
/* ------------------------------------------------------------------ */

const ShotErase: React.FC<{f: number}> = ({f}) => {
  const p = smooth(clamp01((f - C.s11) / (C.s12 - C.s11)));
  const pulse = 0.55 + Math.sin(f / 9) * 0.25;
  const lid = blinkLid(f, C.s11 + 70, 9);
  return (
    <AbsoluteFill style={{background: '#02050A', overflow: 'hidden'}}>
      <Cam z={1.03 + p * 0.06} ox="44%" oy="36%">
        <Ambient f={f} glow={0.3} />
        <div
          style={{
            position: 'absolute',
            left: 30,
            top: 140,
            width: 900,
            height: 1600,
            filter: 'brightness(0.9) contrast(1.06)',
          }}
        >
          <Amara
            expression="cold"
            look="left"
            turn={-0.46}
            rim={1.4}
            screen={0.6}
            lidOverride={lid}
            viewBox="120 40 360 640"
            preserve="xMidYMax slice"
          />
        </div>
        <div
          style={{
            position: 'absolute',
            right: -120,
            top: 200,
            width: 520,
            height: 1500,
            background: `radial-gradient(closest-side, rgba(190,226,246,${0.16 * pulse}), transparent 76%)`,
            filter: 'blur(40px)',
            mixBlendMode: 'screen',
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
/* shot 12 — the protocol, hidden inside Noah                          */
/* ------------------------------------------------------------------ */

const ShotProtocol: React.FC<{f: number}> = ({f}) => {
  const p = smooth(clamp01((f - C.s12) / (C.s13 - C.s12)));
  const z = 1.02 + p * 0.05;
  const link = smooth(clamp01((f - C.s12 - 60) / 50));
  return (
    <AbsoluteFill style={{background: '#02050A', overflow: 'hidden'}}>
      <Cam z={z} ox="50%" oy="42%">
        <Ambient f={f} glow={0.35} />
        <div style={{position: 'absolute', left: 60, top: 420, width: 960, height: 1080}}>
          <Monitor inset={14} radius={8} style={{position: 'absolute', inset: 0}}>
            <div style={{position: 'absolute', inset: 0, background: '#04090E'}} />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'radial-gradient(70% 60% at 50% 44%, rgba(86,158,196,0.56), rgba(3,8,12,0.88) 82%)',
              }}
            />
            {/* node graph: her, the system, and Noah */}
            <div
              style={{
                position: 'absolute',
                left: 120,
                top: 420,
                width: 260,
                height: 260,
                borderRadius: '50%',
                border: '1px solid rgba(178,226,250,0.55)',
                boxShadow: '0 0 54px rgba(120,196,232,0.34)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                right: 140,
                top: 420,
                width: 260,
                height: 260,
                borderRadius: '50%',
                border: '1px solid rgba(178,226,250,0.55)',
                boxShadow: '0 0 54px rgba(120,196,232,0.34)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 380,
                top: 546,
                width: 220 * link,
                height: 2,
                background: 'rgba(176,222,244,0.6)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 120,
                top: 400,
                width: 260,
                height: 300,
                filter: 'brightness(1.02)',
                opacity: 1,
              }}
            >
              <Amara
                expression="calm"
                look="camera"
                rim={0.8}
                screen={0.5}
                viewBox="200 60 200 380"
                preserve="xMidYMax slice"
              />
            </div>
            <div
              style={{
                position: 'absolute',
                right: 140,
                top: 400,
                width: 260,
                height: 300,
                filter: 'brightness(1.02)',
                opacity: 1,
              }}
            >
              <Noah
                expression="neutral"
                look="camera"
                rim={0.8}
                viewBox="200 60 200 380"
                preserve="xMidYMax slice"
              />
            </div>
            <Scanlines opacity={0.24} />
            <ScreenGlass strength={0.7} />
          </Monitor>
        </div>
      </Cam>
      <Vignette strength={0.9} />
      <Grain f={f} opacity={0.075} />
      <Watermark />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* shot 13 — across the city, Noah's phone                             */
/* ------------------------------------------------------------------ */

const ShotNoahPhone: React.FC<{f: number}> = ({f}) => {
  const cut = C.s13 + 120;
  const onPhone = f < cut;
  const p = smooth(clamp01((f - C.s13) / (C.s14 - C.s13)));
  const boot = smooth(clamp01((f - C.s13 - 40) / 26));
  const dl = smooth(clamp01((f - C.s13 - 88) / 50));
  return (
    <AbsoluteFill style={{background: '#02050A', overflow: 'hidden'}}>
      {onPhone ? (
        <Cam z={1.0 + p * 0.05} ox="50%" oy="50%">
          <Ambient f={f} glow={0.3} />
          {/* apartment desk */}
          <div
            style={{
              position: 'absolute',
              left: -60,
              right: -60,
              top: 980,
              height: 1000,
              background: 'linear-gradient(180deg,#0D161D,#060B10 52%,#020406)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 150,
              top: 1010,
              width: 800,
              height: 300,
              background: 'radial-gradient(ellipse at 50% 0%, rgba(96,160,200,0.24), transparent 74%)',
              filter: 'blur(34px)',
            }}
          />
          <div style={{position: 'absolute', left: 270, top: 460, width: 540, height: 1080, opacity: 0.25 + boot * 0.75}}>
            <PhoneSlab style={{left: 0, top: 0, width: 540, height: 1080}} rotate={-3} glow={0.8 + boot * 0.6}>
              <div
                style={{
                  position: 'absolute',
                  inset: 16,
                  borderRadius: 50,
                  background: 'linear-gradient(180deg,#070E14,#03070B)',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    left: -60,
                    right: -60,
                    top: -30,
                    height: 560,
                    background: 'radial-gradient(ellipse at 50% 30%, rgba(104,172,212,0.42), transparent 72%)',
                    filter: 'blur(16px)',
                    opacity: boot,
                  }}
                />
                <PhoneStatus dim={0.28} />
                <div
                  style={{
                    position: 'absolute',
                    left: 34,
                    top: 220,
                    fontFamily: MONO,
                    fontSize: 56,
                    letterSpacing: '0.1em',
                    color: `rgba(236,248,253,${0.35 + boot * 0.6})`,
                    textShadow: '0 0 40px rgba(126,196,232,0.44)',
                  }}
                >
                  PROJECT
                  <br />
                  ORIGIN
                </div>
                <div
                  style={{
                    position: 'absolute',
                    left: 34,
                    right: 34,
                    top: 430,
                    height: 4,
                    borderRadius: 2,
                    background: 'rgba(140,196,226,0.18)',
                  }}
                >
                  <div
                    style={{
                      width: `${dl * 100}%`,
                      height: '100%',
                      borderRadius: 2,
                      background: 'rgba(170,220,244,0.72)',
                      boxShadow: '0 0 18px rgba(150,210,240,0.5)',
                    }}
                  />
                </div>
              </div>
            </PhoneSlab>
          </div>
        </Cam>
      ) : (
        <Cam z={1.03 + p * 0.06} ox="52%" oy="38%">
          <Ambient f={f} glow={0.35} />
          <div
            style={{
              position: 'absolute',
              right: -280,
              top: 380,
              width: 700,
              height: 800,
              background: 'radial-gradient(closest-side, rgba(110,176,212,0.34), transparent 78%)',
              filter: 'blur(44px)',
              mixBlendMode: 'screen',
            }}
          />
          <div style={{position: 'absolute', left: 170, top: 130, width: 860, height: 1600}}>
            <Noah
              expression="unease"
              look="down"
              turn={0.1}
              rim={1.3}
              viewBox="188 60 238 360"
              preserve="xMidYMid slice"
            />
          </div>
        </Cam>
      )}
      <Vignette strength={0.9} />
      <Grain f={f} opacity={0.075} />
      <Watermark />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* shot 14 — Amara's voice, three years old                            */
/* ------------------------------------------------------------------ */

const ShotRecording: React.FC<{f: number}> = ({f}) => {
  const p = smooth(clamp01((f - C.s14) / (C.s15 - C.s14)));
  const z = 1.02 + p * 0.06;
  return (
    <AbsoluteFill style={{background: '#02050A', overflow: 'hidden'}}>
      <Cam z={z} ox="48%" oy="38%">
        <Ambient f={f} glow={0.4} />
        {/* the phone's screen light on him, the recording playing off frame */}
        <div
          style={{
            position: 'absolute',
            left: -220,
            top: 260,
            width: 760,
            height: 1400,
            background: 'radial-gradient(closest-side, rgba(118,186,220,0.34), transparent 78%)',
            filter: 'blur(44px)',
            mixBlendMode: 'screen',
          }}
        />
        <div style={{position: 'absolute', left: 220, top: 180, width: 840, height: 1580}}>
          <Noah
            expression="sad"
            look="left"
            turn={-0.18}
            rim={1.35}
            viewBox="182 54 250 372"
            preserve="xMidYMid slice"
          />
        </div>
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 1640,
            height: 300,
            background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.92))',
          }}
        />
      </Cam>
      <Vignette strength={0.88} />
      <Grain f={f} opacity={0.075} />
      <Watermark />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* shot 15 — don't let Elias reach the original body                   */
/* ------------------------------------------------------------------ */

const ShotWarningLine: React.FC<{f: number}> = ({f}) => {
  const p = smooth(clamp01((f - C.s15) / (C.s16 - C.s15)));
  const flicker = f > C.s15 + 24 && f < C.s15 + 34 ? 0.4 : 1;
  const show = smooth(clamp01((f - C.s15 - 40) / 22));
  return (
    <AbsoluteFill style={{background: '#02050A', overflow: 'hidden'}}>
      <Cam z={1.01 + p * 0.05} ox="50%" oy="46%">
        <Ambient f={f} glow={0.3} />
        <div
          style={{
            position: 'absolute',
            left: 180,
            top: 400,
            width: 720,
            height: 1180,
            opacity: flicker,
            transform: `translateX(${flicker < 1 ? 5 : 0}px)`,
          }}
        >
          <PhoneSlab style={{left: 0, top: 0, width: 720, height: 1180}} glow={1.1}>
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
                  height: 640,
                  background: 'radial-gradient(ellipse at 50% 30%, rgba(104,172,212,0.42), transparent 70%)',
                  filter: 'blur(18px)',
                }}
              />
              <PhoneStatus dim={0.28} />
              <div
                style={{
                  position: 'absolute',
                  left: 34,
                  top: 210,
                  fontFamily: MONO,
                  fontSize: 44,
                  letterSpacing: '0.1em',
                  color: 'rgba(220,238,248,0.6)',
                }}
              >
                PROJECT ORIGIN
              </div>
              <div
                style={{
                  position: 'absolute',
                  left: 34,
                  right: 34,
                  top: 300,
                  fontFamily: SANS,
                  fontSize: 54,
                  lineHeight: 1.24,
                  color: 'rgba(248,252,254,0.98)',
                  textShadow: '0 0 36px rgba(126,196,232,0.44)',
                  opacity: 0.15 + show * 0.85,
                  transform: `translateY(${(1 - show) * 12}px)`,
                }}
              >
                Don&apos;t let Elias reach the original body.
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
/* shot 16 — the chamber, and an eye                                   */
/* ------------------------------------------------------------------ */

const Eye: React.FC<{f: number; open?: number}> = ({f, open = 1}) => {
  const look = Math.sin(f / 40) * 5;
  return (
    <svg viewBox="0 0 600 300" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="p9EyeSclera" cx="0.5" cy="0.5" r="0.7">
          <stop offset="0%" stopColor="#D8DEE2" />
          <stop offset="70%" stopColor="#AFB8BE" />
          <stop offset="100%" stopColor="#6E767C" />
        </radialGradient>
        <radialGradient id="p9Iris" cx="0.45" cy="0.42" r="0.62">
          <stop offset="0%" stopColor="#7D98A6" />
          <stop offset="55%" stopColor="#41545F" />
          <stop offset="100%" stopColor="#161E24" />
        </radialGradient>
        <linearGradient id="p9Lid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2A1E18" />
          <stop offset="100%" stopColor="#0C0907" />
        </linearGradient>
      </defs>
      <ellipse cx="300" cy="150" rx="238" ry="118" fill="url(#p9EyeSclera)" opacity={0.92} />
      <circle cx={300 + look} cy="150" r="86" fill="url(#p9Iris)" />
      <circle cx={300 + look} cy="150" r="34" fill="#0A0D10" />
      <circle cx={300 + look} cy="150" r="92" fill="none" stroke="rgba(12,16,20,0.7)" strokeWidth="6" />
      <circle cx={272 + look} cy="120" r="20" fill="rgba(232,246,252,0.7)" />
      <circle cx={330 + look} cy="182" r="9" fill="rgba(232,246,252,0.3)" />
      {/* lids close over the sclera from above and below */}
      <path
        d={`M 40 150 C 150 ${30 + (1 - open) * 120} 460 ${30 + (1 - open) * 120} 560 150 L 560 0 L 40 0 Z`}
        fill="url(#p9Lid)"
      />
      <path
        d={`M 40 150 C 150 ${270 - (1 - open) * 120} 460 ${270 - (1 - open) * 120} 560 150 L 560 300 L 40 300 Z`}
        fill="url(#p9Lid)"
      />
      <path d="M 40 150 C 160 44 440 44 560 150" fill="none" stroke="rgba(10,8,6,0.9)" strokeWidth="7" />
      <path d="M 40 150 C 160 256 440 256 560 150" fill="none" stroke="rgba(10,8,6,0.7)" strokeWidth="4" />
    </svg>
  );
};

const ShotChamber: React.FC<{f: number}> = ({f}) => {
  const eyeAt = C.s16 + 92;
  const onEye = f >= eyeAt;
  const p = smooth(clamp01((f - C.s16) / (C.total - C.s16)));
  const unlock = smooth(clamp01((f - C.s16 - 10) / 70));
  const open = smooth(clamp01((f - eyeAt - 6) / 22));
  return (
    <AbsoluteFill style={{background: '#02050A', overflow: 'hidden'}}>
      {!onEye ? (
        <Cam z={1.06 - p * 0.05} ox="50%" oy="42%">
          <div style={{position: 'absolute', inset: 0, background: '#04090E'}} />
          <div
            style={{
              position: 'absolute',
              left: 60,
              top: 220,
              width: 960,
              height: 1480,
              background: 'linear-gradient(180deg,#0C1820,#070F15 60%,#03070B)',
              boxShadow: 'inset 0 0 120px rgba(0,0,0,0.9)',
            }}
          />
          {/* sealed industrial door */}
          <div
            style={{
              position: 'absolute',
              left: 200,
              top: 320,
              width: 680,
              height: 1240,
              borderRadius: 10,
              background: 'linear-gradient(170deg,#1B2A34 0%,#0E1A22 52%,#070E13 100%)',
              boxShadow: 'inset 0 0 70px rgba(0,0,0,0.85), 0 0 0 2px rgba(120,166,196,0.1)',
            }}
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: 40,
                  right: 40,
                  top: 120 + i * 300,
                  height: 2,
                  background: 'rgba(140,186,214,0.08)',
                }}
              />
            ))}
            {/* locking ring */}
            <div
              style={{
                position: 'absolute',
                left: 190,
                top: 470,
                width: 300,
                height: 300,
                borderRadius: '50%',
                border: '10px solid rgba(58,76,90,0.9)',
                boxShadow: 'inset 0 0 50px rgba(0,0,0,0.8)',
                transform: `rotate(${unlock * 120}deg)`,
              }}
            >
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    left: 132,
                    top: 0,
                    width: 16,
                    height: 44,
                    background: 'rgba(38,52,64,0.95)',
                    transformOrigin: '8px 140px',
                    transform: `rotate(${i * 60}deg)`,
                  }}
                />
              ))}
            </div>
            <div
              style={{
                position: 'absolute',
                left: 300,
                top: 580,
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: `radial-gradient(circle, rgba(226,118,92,${0.7 * unlock}), rgba(90,26,18,0.9))`,
                boxShadow: `0 0 ${60 * unlock}px rgba(226,118,92,${0.6 * unlock})`,
              }}
            />
          </div>
          {/* light leaking out of the seam as it unlocks */}
          <div
            style={{
              position: 'absolute',
              left: 196,
              top: 320,
              width: 8,
              height: 1240,
              background: `linear-gradient(180deg, transparent, rgba(190,236,252,${0.7 * unlock}), transparent)`,
              filter: 'blur(5px)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 100,
              top: 900,
              width: 900,
              height: 600,
              background: `radial-gradient(ellipse at 50% 30%, rgba(150,222,246,${0.24 * unlock}), transparent 74%)`,
              filter: 'blur(36px)',
              mixBlendMode: 'screen',
            }}
          />
        </Cam>
      ) : (
        <Cam z={1.18 - open * 0.06} ox="50%" oy="50%">
          <div style={{position: 'absolute', inset: 0, background: '#050A0E'}} />
          <div style={{position: 'absolute', inset: 0, filter: 'brightness(0.86) contrast(1.08)'}}>
            <div style={{position: 'absolute', left: -180, top: 620, width: 1440, height: 800}}>
              <Eye f={f} open={open} />
            </div>
          </div>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(70% 60% at 50% 46%, transparent 34%, rgba(0,0,0,0.9) 100%)',
            }}
          />
          <Scanlines opacity={0.14} />
        </Cam>
      )}
      <div style={{position: 'absolute', inset: 0, background: '#000', opacity: smooth(clamp01((f - FADE) / 8))}} />
      <Vignette strength={0.96} />
      <Grain f={f} opacity={0.08} />
      {f < FADE ? <Watermark /> : null}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* composition                                                         */
/* ------------------------------------------------------------------ */

export const Part9: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Audio src={staticFile('audio/pt9.mp3')} />
      {f < C.s2 ? (
        <ShotLastMessage f={f} />
      ) : f < C.s3 ? (
        <ShotTremble f={f} />
      ) : f < C.s4 ? (
        <ShotHiddenFile f={f} />
      ) : f < C.s5 ? (
        <ShotReturn f={f} />
      ) : f < C.s6 ? (
        <ShotResearchers f={f} />
      ) : f < C.s7 ? (
        <ShotVolunteer f={f} />
      ) : f < C.s8 ? (
        <ShotFailure f={f} />
      ) : f < C.s9 ? (
        <ShotSignal f={f} />
      ) : f < C.s10 ? (
        <ShotShutdown f={f} />
      ) : f < C.s11 ? (
        <ShotRefuse f={f} />
      ) : f < C.s12 ? (
        <ShotErase f={f} />
      ) : f < C.s13 ? (
        <ShotProtocol f={f} />
      ) : f < C.s14 ? (
        <ShotNoahPhone f={f} />
      ) : f < C.s15 ? (
        <ShotRecording f={f} />
      ) : f < C.s16 ? (
        <ShotWarningLine f={f} />
      ) : (
        <ShotChamber f={f} />
      )}
    </AbsoluteFill>
  );
};
