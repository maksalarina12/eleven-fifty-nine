import React from 'react';
import {AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Noah} from './character/Noah';
import {Amara, AmaraBack} from './character/Amara';
import type {Expression, Look} from './character/Noah';
import {Cam, Grain, Vignette, Room, RainStreaks, blinkAt, FLOOR, NOAH_H, NOAH_W} from './Episode';

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const smooth = (v: number) => {
  const t = clamp01(v);
  return t * t * (3 - 2 * t);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// decaying hand-held jolt
const jolt = (f: number, at: number, amp = 7, len = 20) => {
  const d = f - at;
  if (d < 0 || d > len) return 0;
  return Math.sin(d * 1.85) * amp * Math.exp(-d / 6.5);
};
const shake = (f: number, amp = 1.1, speed = 13) => Math.sin(f / speed) * amp + Math.sin(f / (speed * 0.57)) * amp * 0.6;

/* ------------------------------------------------------------------ */
/* phone shells + screens                                              */
/* ------------------------------------------------------------------ */

const Phone: React.FC<{
  f: number;
  children: React.ReactNode;
  clock?: string;
  title?: string;
  sub?: string;
  rotate?: number;
  push?: number;
  glow?: number;
  dim?: number;
}> = ({f, children, clock = '11:59', title = 'MESSAGES', sub = 'UNKNOWN NUMBER', rotate = -2, push = 0, glow = 0.55, dim = 0}) => {
  const pulse = glow + Math.sin(f / 9) * 0.05;
  return (
    <AbsoluteFill style={{background: '#04060A', overflow: 'hidden'}}>
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(760px 920px at 50% 46%, rgba(40,72,104,0.55), transparent 70%), radial-gradient(520px 620px at 20% 82%, rgba(196,124,72,0.10), transparent 70%), linear-gradient(180deg,#070A0F,#04060A)',
          opacity: 1 - dim * 0.5,
        }}
      />
      <div style={{position: 'absolute', left: '50%', top: '46%', width: 720, height: 1000, marginLeft: -360, marginTop: -500, borderRadius: '50%', background: `radial-gradient(circle, rgba(96,150,200,${0.28 * pulse}), transparent 65%)`, filter: 'blur(42px)', opacity: 1 - dim}} />
      <div style={{position: 'absolute', left: '50%', top: '50%', width: 566, height: 1120, marginLeft: -283, marginTop: -560, transform: `scale(${1 + push * 0.05}) rotate(${rotate}deg)`}}>
        <div style={{position: 'absolute', inset: 0, borderRadius: 84, background: 'linear-gradient(150deg,#1A1E24,#07090C 42%,#040507)', boxShadow: '0 40px 120px rgba(0,0,0,0.9), 0 0 90px rgba(90,142,186,0.22)'}}>
          <div style={{position: 'absolute', inset: 10, borderRadius: 76, background: '#04060A', overflow: 'hidden'}}>
            <div style={{position: 'absolute', inset: 6, borderRadius: 70, background: 'linear-gradient(175deg,#0B1420 0%,#070C13 55%,#05080D 100%)', overflow: 'hidden', filter: dim ? `brightness(${1 - dim * 0.35})` : undefined}}>
              <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 320, background: 'linear-gradient(180deg, rgba(70,118,158,0.22), transparent)'}} />
              <div style={{position: 'absolute', left: 46, top: 74, right: 46, display: 'flex', justifyContent: 'space-between', fontFamily: 'Helvetica, Arial, sans-serif', fontSize: 24, color: 'rgba(232,240,248,0.62)'}}>
                <span>{clock}</span>
                <span>▮▮▮</span>
              </div>
              <div style={{position: 'absolute', left: 0, right: 0, top: 138, textAlign: 'center', fontFamily: 'Helvetica, Arial, sans-serif', fontSize: 26, letterSpacing: '0.18em', color: 'rgba(196,214,230,0.55)'}}>
                {title}
              </div>
              <div style={{position: 'absolute', left: 46, right: 46, top: 196, height: 1, background: 'rgba(150,186,214,0.14)'}} />
              {sub ? (
                <div style={{position: 'absolute', left: 46, top: 232, fontFamily: 'Helvetica, Arial, sans-serif', fontSize: 23, letterSpacing: '0.16em', color: 'rgba(170,196,220,0.5)'}}>
                  {sub}
                </div>
              ) : null}
              {children}
              <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(122deg, rgba(255,255,255,0.10) 0%, transparent 38%, transparent 62%, rgba(160,200,230,0.06) 100%)'}} />
            </div>
          </div>
          <div style={{position: 'absolute', left: '50%', top: 22, width: 150, height: 26, marginLeft: -75, borderRadius: 14, background: '#04060A'}} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Bubble: React.FC<{children: React.ReactNode; top?: number; tone?: string; left?: number; right?: number}> = ({
  children,
  top = 300,
  tone = 'linear-gradient(160deg,#1B2733,#111A24)',
  left = 46,
  right = 60,
}) => (
  <div style={{position: 'absolute', left, right, top, padding: '38px 34px', borderRadius: '8px 34px 34px 34px', background: tone, border: '1px solid rgba(150,190,220,0.12)', boxShadow: '0 12px 40px rgba(0,0,0,0.5)'}}>
    {children}
  </div>
);

const MsgScreen: React.FC<{f: number; push?: number}> = ({f, push = 0}) => (
  <Phone f={f} push={push} clock="11:59" rotate={-1.5}>
    <Bubble top={286} tone="linear-gradient(160deg,#241D22,#141117)">
      <div style={{fontFamily: 'Helvetica, Arial, sans-serif', fontSize: 19, letterSpacing: '0.18em', color: 'rgba(214,190,186,0.55)'}}>UNKNOWN NUMBER</div>
      <div style={{marginTop: 20, fontFamily: 'Helvetica, Arial, sans-serif', fontWeight: 500, fontSize: 48, lineHeight: 1.24, letterSpacing: '0.01em', color: '#F6F0E9'}}>
        YOU HAVE
        <br />
        ONE MINUTE
        <br />
        LEFT.
      </div>
      <div style={{marginTop: 24, fontFamily: 'Helvetica, Arial, sans-serif', fontSize: 18, letterSpacing: '0.16em', color: 'rgba(200,180,178,0.4)'}}>now</div>
    </Bubble>
  </Phone>
);

const ClockScreen: React.FC<{f: number; push?: number; tap?: number; glitch?: number}> = ({f, push = 0, tap = 0, glitch = 0}) => {
  const sec = (14 + Math.floor(f / 30)) % 60;
  const secText = String(sec).padStart(2, '0');
  return (
    <Phone f={f} push={push} clock="11:59" title="CLOCK" sub="DEVICE TIME" rotate={-1.8} glow={0.5}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 300, textAlign: 'center', fontFamily: 'Helvetica, Arial, sans-serif', fontSize: 22, letterSpacing: '0.26em', color: 'rgba(190,214,232,0.5)'}}>
        MONDAY, NOVEMBER 10
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 388, display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 10}}>
        <span style={{fontFamily: 'Helvetica, Arial, sans-serif', fontSize: 196, fontWeight: 200, letterSpacing: '-0.03em', lineHeight: 0.9, color: '#F2F7FC', textShadow: '0 0 64px rgba(130,180,220,0.38)', opacity: glitch > 0.2 ? 0.72 : 1}}>
          11:59
        </span>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16}}>
        <span style={{fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 40, letterSpacing: '0.08em', color: 'rgba(196,222,240,0.72)'}}>:{secText}</span>
        <span style={{fontFamily: 'Helvetica, Arial, sans-serif', fontSize: 26, letterSpacing: '0.3em', color: 'rgba(196,218,236,0.5)'}}>PM</span>
      </div>
      <div style={{position: 'absolute', left: 54, right: 54, top: 700, padding: '24px 26px', borderRadius: 22, background: 'rgba(26,38,50,0.5)', border: '1px solid rgba(150,190,220,0.12)'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: 'Helvetica, Arial, sans-serif', fontSize: 18, letterSpacing: '0.16em', color: 'rgba(180,206,228,0.5)'}}>
          <span>MINUTE</span>
          <span style={{color: 'rgba(240,184,150,0.85)'}}>LOCKED</span>
        </div>
        <div style={{marginTop: 16, height: 4, borderRadius: 2, background: 'rgba(150,190,220,0.14)'}}>
          <div style={{width: '100%', height: '100%', borderRadius: 2, background: 'linear-gradient(90deg,#9FD0EE,#E0A87E)'}} />
        </div>
        <div style={{marginTop: 14, fontFamily: 'Helvetica, Arial, sans-serif', fontSize: 17, letterSpacing: '0.12em', color: 'rgba(170,196,220,0.35)'}}>SECONDS CONTINUE · MINUTE DOES NOT</div>
      </div>
      {tap > 0.02 ? (
        <div style={{position: 'absolute', left: 283 - 60 * (1 + tap * 2), top: 470 - 60 * (1 + tap * 2), width: 120 * (1 + tap * 2), height: 120 * (1 + tap * 2), borderRadius: '50%', border: `2px solid rgba(150,205,240,${0.5 * (1 - tap)})`, opacity: 1 - tap}} />
      ) : null}
      {glitch > 0.01 ? (
        <>
          <div style={{position: 'absolute', left: 0, right: 0, top: 380, height: 240, background: 'rgba(140,200,240,0.10)', mixBlendMode: 'screen', opacity: glitch}} />
          <div style={{position: 'absolute', left: 40, right: 40, top: 300 + ((f * 53) % 420), height: 3, background: 'rgba(220,240,255,0.4)', opacity: glitch}} />
        </>
      ) : null}
    </Phone>
  );
};

const CountScreen: React.FC<{f: number; count: number; push?: number}> = ({f, count, push = 0}) => {
  const rows = Math.min(7, Math.floor(count / 21));
  return (
    <Phone f={f} push={push} clock="11:59" title="MESSAGES" sub="UNKNOWN NUMBER" rotate={-1.2} glow={0.7}>
      {/* incoming stack */}
      {Array.from({length: rows}).map((_, i) => {
        const age = count - i * 16;
        const op = clamp01(age / 10);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 46,
              right: 64,
              top: 404 + i * 64,
              height: 54,
              borderRadius: 16,
              background: 'linear-gradient(160deg,rgba(34,52,68,0.85),rgba(18,28,38,0.85))',
              border: '1px solid rgba(150,190,220,0.14)',
              opacity: op * (1 - i * 0.07),
              transform: `translateY(${(1 - op) * -14}px) scale(${0.97 + op * 0.03})`,
            }}
          >
            <div style={{padding: '10px 18px', fontFamily: 'Helvetica, Arial, sans-serif', fontSize: 19, letterSpacing: '0.06em', color: 'rgba(214,232,246,0.75)', whiteSpace: 'nowrap', overflow: 'hidden'}}>Don&apos;t open the door.</div>
          </div>
        );
      })}
      {/* the list fades out under the counter */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 820, height: 200, background: 'linear-gradient(180deg, rgba(7,12,19,0), rgba(7,12,19,0.96) 72%)'}} />
      {/* counter */}
      <div style={{position: 'absolute', left: 54, right: 54, top: 900, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between'}}>
        <div>
          <div style={{fontFamily: 'Helvetica, Arial, sans-serif', fontSize: 18, letterSpacing: '0.2em', color: 'rgba(190,214,232,0.55)'}}>NEW MESSAGES</div>
          <div style={{marginTop: 6, fontFamily: 'Helvetica, Arial, sans-serif', fontSize: 92, fontWeight: 200, lineHeight: 1, color: '#F2F7FC', textShadow: '0 0 46px rgba(120,180,225,0.45)'}}>{count}</div>
        </div>
        <div style={{width: 10, height: 10, borderRadius: '50%', background: '#9FD0EE', boxShadow: '0 0 18px #9FD0EE', opacity: 0.6 + Math.sin(f / 4) * 0.4, marginBottom: 18}} />
      </div>
    </Phone>
  );
};

const WarnScreen: React.FC<{f: number; scroll: number; push?: number}> = ({f, scroll, push = 0}) => {
  const rows = 9;
  return (
    <Phone f={f} push={push} clock="11:59" title="MESSAGES" sub="UNKNOWN NUMBER" rotate={-1.4} glow={0.55}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 274, height: 900, overflow: 'hidden'}}>
        {Array.from({length: rows}).map((_, i) => {
          const top = 300 + i * 150 - scroll * 420;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 46,
                right: 70,
                top,
                padding: '26px 28px',
                borderRadius: '8px 30px 30px 30px',
                background: i === 1 ? 'linear-gradient(160deg,#28323C,#171F27)' : 'linear-gradient(160deg,rgba(31,44,56,0.9),rgba(19,27,35,0.9))',
                border: '1px solid rgba(150,190,220,0.12)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.45)',
              }}
            >
              <div style={{fontFamily: 'Helvetica, Arial, sans-serif', fontSize: i === 1 ? 40 : 30, lineHeight: 1.2, color: i === 1 ? '#F2F6FA' : 'rgba(222,236,246,0.75)'}}>Don&apos;t open the door.</div>
              <div style={{marginTop: 10, fontFamily: 'Helvetica, Arial, sans-serif', fontSize: 16, letterSpacing: '0.14em', color: 'rgba(180,204,224,0.35)'}}>now</div>
            </div>
          );
        })}
      </div>
    </Phone>
  );
};

const NewMsgScreen: React.FC<{f: number; glitch: number; appear: number}> = ({f, glitch, appear}) => (
  <Phone f={f} push={0.25} clock="11:59" title="MESSAGES" sub="UNKNOWN NUMBER" rotate={-1.7} glow={0.72}>
    {glitch > 0.02 ? (
      <>
        <div style={{position: 'absolute', left: 0, right: 0, top: 300 + ((f * 67) % 500), height: 26, background: 'rgba(150,205,240,0.22)', filter: 'blur(2px)', opacity: glitch}} />
        <div style={{position: 'absolute', left: 0, right: 0, top: 340 + ((f * 31) % 420), height: 6, background: 'rgba(240,180,150,0.25)', opacity: glitch}} />
      </>
    ) : null}
    <div style={{position: 'absolute', left: 46, right: 64, top: 286, opacity: appear, transform: `translateY(${(1 - appear) * 16}px)`}}>
      <div style={{padding: '38px 34px', borderRadius: '8px 34px 34px 34px', background: 'linear-gradient(160deg,#2A2029,#181118)', border: '1px solid rgba(220,180,180,0.16)', boxShadow: '0 16px 46px rgba(0,0,0,0.55)'}}>
        <div style={{fontFamily: 'Helvetica, Arial, sans-serif', fontSize: 18, letterSpacing: '0.18em', color: 'rgba(220,190,190,0.55)'}}>UNKNOWN NUMBER</div>
        <div style={{marginTop: 18, fontFamily: 'Helvetica, Arial, sans-serif', fontWeight: 500, fontSize: 44, lineHeight: 1.24, letterSpacing: '0.01em', color: '#F7F1EA', textShadow: glitch > 0.3 ? `${glitch * 5}px 0 rgba(220,120,110,0.6), ${-glitch * 5}px 0 rgba(110,180,225,0.6)` : undefined}}>
          You&apos;ve done
          <br />
          this before.
        </div>
        <div style={{marginTop: 22, fontFamily: 'Helvetica, Arial, sans-serif', fontSize: 17, letterSpacing: '0.16em', color: 'rgba(200,180,178,0.4)'}}>now</div>
      </div>
    </div>
  </Phone>
);

const CallScreen: React.FC<{f: number; connected: number; push?: number}> = ({f, connected, push = 0}) => {
  const t = Math.floor(f / 30);
  return (
    <Phone f={f} push={push} clock="11:59" title={connected > 0.5 ? 'ON CALL' : 'INCOMING CALL'} sub="" rotate={-0.8} glow={0.62}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 300, textAlign: 'center'}}>
        <div style={{width: 150, height: 150, margin: '0 auto', borderRadius: '50%', background: 'radial-gradient(circle at 38% 32%, rgba(120,170,205,0.35), rgba(20,30,40,0.9))', border: '1px solid rgba(150,195,225,0.22)', boxShadow: `0 0 ${40 + Math.sin(f / 7) * 12}px rgba(110,170,215,0.28)`}} />
        <div style={{marginTop: 34, fontFamily: 'Helvetica, Arial, sans-serif', fontSize: 34, letterSpacing: '0.1em', color: '#EFF5FA'}}>UNKNOWN CALLER</div>
        <div style={{marginTop: 14, fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 20, letterSpacing: '0.22em', color: 'rgba(186,212,232,0.5)'}}>
          {connected > 0.5 ? `CONNECTED · 00:${String(Math.max(0, t)).padStart(2, '0')}` : 'MOBILE · 11:59 PM'}
        </div>
      </div>
      {connected > 0.5 ? (
        <div style={{position: 'absolute', left: 120, right: 120, top: 640, height: 90, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6}}>
          {Array.from({length: 22}).map((_, i) => {
            const h = 8 + Math.abs(Math.sin(f / 6 + i * 0.9)) * 54 * (0.35 + Math.sin(f / 11 + i) * 0.25);
            return <div key={i} style={{width: 4, height: Math.max(5, h), borderRadius: 2, background: 'rgba(150,205,235,0.55)'}} />;
          })}
        </div>
      ) : (
        <div style={{position: 'absolute', left: 0, right: 0, top: 700, display: 'flex', justifyContent: 'center', gap: 80}}>
          <div style={{width: 84, height: 84, borderRadius: '50%', background: 'rgba(180,70,60,0.85)', boxShadow: '0 0 30px rgba(190,80,70,0.35)'}} />
          <div style={{width: 84, height: 84, borderRadius: '50%', background: 'rgba(70,150,110,0.9)', boxShadow: '0 0 30px rgba(80,170,120,0.4)'}} />
        </div>
      )}
    </Phone>
  );
};

/* ------------------------------------------------------------------ */
/* apartment shots                                                     */
/* ------------------------------------------------------------------ */

const FACE = '120 12 360 622';
const BUST = '168 30 276 500';

const NoahInRoom: React.FC<{
  f: number;
  expression: Expression;
  look?: Look;
  turn?: number;
  viewBox?: string;
  push?: number;
  ox?: string;
  oy?: string;
  dark?: number;
  phoneGlow?: number;
  sweat?: number;
  joltAt?: number;
  joltAmp?: number;
  tilt?: number;
  lidAt?: number;
}> = ({
  f,
  expression,
  look = 'camera',
  turn = 0,
  viewBox = FACE,
  push = 0.05,
  ox = '52%',
  oy = '42%',
  dark = 0,
  phoneGlow = 0.6,
  sweat = 0,
  joltAt,
  joltAmp = 6,
  tilt = 0,
  lidAt,
}) => {
  const jx = joltAt !== undefined ? jolt(f, joltAt, joltAmp) : 0;
  const breath = Math.sin(f / 26) * 1.2;
  const vb = viewBox.split(/\s+/).map(Number);
  const [vx, vy, vw, vh] = vb.length === 4 ? vb : [0, 0, 600, 1080];
  const sc = Math.max(1080 / vw, 1920 / vh);
  const m = (x: number, y: number) => ({left: (x - vx) * sc + (1080 - vw * sc) / 2, top: (y - vy) * sc + (1920 - vh * sc) / 2});
  const key = m(120, 300);
  const neck = m(276, 268);
  const tight = vw < 420;
  return (
    <AbsoluteFill style={{background: '#04060A'}}>
      <Cam z={1.02 + push} ox={ox} oy={oy} x={jx * 0.6} y={breath * 0.5}>
        <AbsoluteFill style={{filter: `brightness(${1 - dark * 0.62}) saturate(${1 - dark * 0.25}) contrast(1.02)`}}>
          <Room f={f} phoneOn={phoneGlow} />
        </AbsoluteFill>
        {/* window key light, survives the blackout */}
        <AbsoluteFill style={{background: 'radial-gradient(760px 860px at 24% 36%, rgba(86,138,178,0.22), transparent 66%)', opacity: 0.5 + dark * 0.5}} />
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 1080,
            height: 1920,
            transform: `translate(${jx}px, ${jolt(f, (joltAt ?? 0) + 3, joltAmp * 0.4)}px) rotate(${tilt + jx * 0.04}deg)`,
            transformOrigin: '50% 42%',
            filter: `brightness(${(1 - dark * 0.42) * 1.05}) drop-shadow(0 30px 60px rgba(0,0,0,0.9))`,
          }}
        >
          <Noah
            expression={expression}
            look={look}
            turn={turn}
            sweat={sweat}
            lidOverride={lidAt !== undefined ? blinkAt(f, lidAt) : undefined}
            rim={1.1}
            viewBox={viewBox}
            preserve="xMidYMid slice"
          />
          {tight ? (
            <div
              style={{
                position: 'absolute',
                left: neck.left,
                top: neck.top,
                width: 48 * sc,
                height: 84 * sc,
                background: 'linear-gradient(180deg, rgba(8,5,4,0.62) 0%, rgba(10,7,6,0.42) 46%, transparent 100%)',
                filter: 'blur(6px)',
              }}
            />
          ) : null}
          {/* key light from the window rakes across his shoulder */}
          <div
            style={{
              position: 'absolute',
              left: -80,
              top: key.top - 40,
              width: 760,
              height: 1920 - key.top + 160,
              background: 'linear-gradient(118deg, rgba(130,182,220,0.30) 0%, rgba(96,146,184,0.10) 42%, transparent 70%)',
              filter: 'blur(34px)',
              mixBlendMode: 'screen',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 560,
              top: key.top + 40,
              width: 420,
              height: 1920 - key.top,
              background: 'linear-gradient(270deg, rgba(96,150,190,0.16), transparent 72%)',
              filter: 'blur(40px)',
              mixBlendMode: 'screen',
            }}
          />
        </div>
        {/* phone glow on the face */}
        <AbsoluteFill style={{background: `radial-gradient(560px 520px at 48% 84%, rgba(120,182,230,${0.13 * phoneGlow}), transparent 78%)`, mixBlendMode: 'screen'}} />
      </Cam>
      <Vignette strength={0.9} />
    </AbsoluteFill>
  );
};

/* apartment wide - the blackout */
const BlackoutShot: React.FC<{f: number}> = ({f}) => {
  const killLamp = smooth((f - 370) / 22);
  const killAll = smooth((f - 392) / 26);
  const dark = clamp01(killLamp * 0.45 + killAll * 0.55);
  const fl = f > 366 && f < 378 ? (Math.sin(f * 3.2) > 0 ? 1 : 0) : 0;
  const fall = clamp01((f - 410) / 20);
  return (
    <AbsoluteFill style={{background: '#030507'}}>
      <Cam z={1.03 + clamp01((f - 330) / 122) * 0.05} ox="48%" oy="50%">
        <AbsoluteFill style={{filter: `brightness(${1 - dark * 0.5}) saturate(${1 - dark * 0.3})`}}>
          <Room f={f} phoneOn={0.5 + fall * 0.5} />
        </AbsoluteFill>
        {/* remaining window + city glow */}
        <div style={{position: 'absolute', left: 52, top: 282, width: 466, height: 684, background: 'radial-gradient(closest-side, rgba(96,150,190,0.30), rgba(40,70,100,0.08) 60%, transparent 78%)', filter: 'blur(18px)', opacity: 0.55 + dark * 0.45, mixBlendMode: 'screen'}} />
        <div style={{position: 'absolute', left: 120, top: 520, width: 330, height: 520, background: 'linear-gradient(90deg, rgba(80,130,170,0.14), transparent)', filter: 'blur(12px)', opacity: dark * 0.8}} />
        {/* Noah, silhouetted */}
        <div
          style={{
            position: 'absolute',
            left: 392,
            bottom: 1920 - FLOOR,
            width: NOAH_W,
            height: NOAH_H,
            transform: `translate(${jolt(f, 420, 5)}px, ${fall * 3}px)`,
            filter: `brightness(${0.52 - dark * 0.1}) contrast(1.06) drop-shadow(0 24px 50px rgba(0,0,0,0.9))`,
          }}
        >
          <Noah expression={f < 420 ? 'dread' : 'shock'} look={f < 420 ? 'down' : 'camera'} rim={1.35} viewBox="0 0 600 1080" />
        </div>
        {/* cold rim from the window */}
        <div style={{position: 'absolute', left: 360, bottom: 1920 - FLOOR, width: 230, height: 690, background: 'linear-gradient(90deg, rgba(150,200,235,0.24), transparent 62%)', filter: 'blur(10px)', mixBlendMode: 'screen', opacity: 0.7}} />
        {/* phone in hand glow */}
        <div style={{position: 'absolute', left: 470, bottom: 1920 - FLOOR + 250, width: 130, height: 180, background: 'radial-gradient(ellipse, rgba(120,182,230,0.30), transparent 70%)', filter: 'blur(16px)', opacity: clamp01((f - 424) / 16)}} />
        {/* electrical flicker at the cut */}
        {fl ? <AbsoluteFill style={{background: 'rgba(150,190,220,0.05)'}} /> : null}
        <AbsoluteFill style={{background: `rgba(0,0,0,${clamp01((f - 434) / 16) * 0.18})`}} />
      </Cam>
      <Vignette strength={0.94} />
      <Grain f={f} opacity={0.1} />
    </AbsoluteFill>
  );
};

/* he looks at the door */
const DoorShot: React.FC<{f: number}> = ({f}) => {
  const turn = smooth((f - 748) / 30);
  return (
    <AbsoluteFill style={{background: '#04060A'}}>
      <Cam z={1.16 + clamp01((f - 736) / 64) * 0.05} ox="60%" oy="48%">
        <AbsoluteFill style={{filter: 'brightness(0.8) saturate(0.9)'}}>
          <Room f={f} phoneOn={0.35} />
        </AbsoluteFill>
        <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, filter: 'brightness(0.86) drop-shadow(0 30px 60px rgba(0,0,0,0.9))'}}>
          <Noah expression={f < 770 ? 'dread' : 'fear'} look={f < 752 ? 'camera' : 'door'} turn={turn * 0.25} rim={1.05} viewBox="0 0 600 1080" />
        </div>
      </Cam>
      <AbsoluteFill style={{background: 'radial-gradient(620px 780px at 72% 42%, rgba(70,104,132,0.16), transparent 70%)'}} />
      <Vignette strength={0.92} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* the window: Noah-B outside in the rain                              */
/* ------------------------------------------------------------------ */

const NoahB: React.FC<{f: number; h?: number; x?: number; feet?: number}> = ({f, h = 720, x = 470, feet = 1300}) => (
  <div style={{position: 'absolute', left: x, bottom: 1920 - feet, width: h * (600 / 1080), height: h, filter: 'brightness(0.52) saturate(0.6) contrast(1.12) blur(0.4px)'}}>
    <Noah expression="neutral" look="camera" rim={1.6} viewBox="0 0 600 1080" />
    {/* wet sheen */}
    <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(104deg, rgba(150,200,235,0.10), transparent 46%)', mixBlendMode: 'screen'}} />
  </div>
);

const WindowShot: React.FC<{f: number; presence: number; lightning: number; push?: number}> = ({f, presence, lightning, push = 0}) => (
  <AbsoluteFill style={{background: '#03060A', overflow: 'hidden'}}>
    <Cam z={1.02 + push} ox="50%" oy="46%">
      {/* exterior */}
      <AbsoluteFill style={{background: 'linear-gradient(180deg,#0A1520 0%,#0B1622 42%,#060C12 100%)'}} />
      <div style={{position: 'absolute', inset: 0, opacity: 0.9}}>
        <AbsoluteFill style={{background: 'radial-gradient(560px 460px at 68% 26%, rgba(120,170,205,0.18), transparent 70%)'}} />
        {/* city blocks */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} style={{position: 'absolute', left: 40 + i * 170, top: 300 + (i % 3) * 60, width: 120 + (i % 2) * 40, height: 420 + (i % 3) * 90, background: 'rgba(6,11,17,0.8)'}}>
            {Array.from({length: 8}).map((_, j) => (
              <div key={j} style={{position: 'absolute', left: 14 + (j % 3) * 34, top: 20 + Math.floor(j / 3) * 52, width: 16, height: 22, background: (i + j) % 4 === 0 ? 'rgba(226,178,118,0.35)' : 'rgba(110,150,185,0.10)'}} />
            ))}
          </div>
        ))}
        {/* exterior walkway */}
        <div style={{position: 'absolute', left: 0, right: 0, top: 1240, height: 90, background: 'linear-gradient(180deg,#0B141C,#070D13)'}} />
        <div style={{position: 'absolute', left: 0, right: 0, top: 1200, height: 8, background: 'rgba(140,186,215,0.18)'}} />
        <div style={{position: 'absolute', left: 0, right: 0, top: 1186, height: 3, background: 'rgba(160,200,228,0.14)'}} />
        {/* Noah-B */}
        <div style={{opacity: presence}}>
          <NoahB f={f} x={430} feet={1258} h={735} />
          {/* reflection of him on the glass */}
          <div style={{position: 'absolute', left: 430, bottom: 1920 - 1258 - 160, width: 408, height: 220, background: 'linear-gradient(180deg, rgba(150,195,225,0.06), transparent)', filter: 'blur(8px)', opacity: 0.5}} />
        </div>
        <RainStreaks f={f} speed={22} opacity={0.55} />
        <RainStreaks f={f} speed={34} opacity={0.3} blur={1.6} />
      </div>

      {/* window frame */}
      <div style={{position: 'absolute', inset: 0, boxShadow: 'inset 0 0 220px 90px rgba(3,5,8,0.92)'}} />
      <div style={{position: 'absolute', left: 90, top: 150, width: 900, height: 1420, border: '28px solid #05080B', boxShadow: '0 0 0 2px rgba(150,190,220,0.22), 0 0 0 8px rgba(6,9,12,0.9), inset 0 0 160px rgba(0,0,0,0.62)'}} />
      <div style={{position: 'absolute', left: 500, top: 178, width: 20, height: 1364, background: '#05080B', boxShadow: '0 0 0 1px rgba(140,180,210,0.18)'}} />
      <div style={{position: 'absolute', left: 118, top: 700, width: 844, height: 18, background: '#05080B', boxShadow: '0 0 0 1px rgba(140,180,210,0.16)'}} />
      <div style={{position: 'absolute', left: 96, top: 156, width: 888, height: 1408, background: 'linear-gradient(112deg, rgba(170,210,235,0.10) 0%, transparent 32%, transparent 74%, rgba(150,195,225,0.05) 100%)'}} />

      {/* glass: beads, streaks, sheen */}
      <AbsoluteFill style={{backgroundImage: 'radial-gradient(circle at 24% 32%, rgba(220,240,250,0.18) 0 1.6px, transparent 2.6px), radial-gradient(circle at 62% 44%, rgba(220,240,250,0.14) 0 1.4px, transparent 2.4px), radial-gradient(circle at 44% 72%, rgba(220,240,250,0.12) 0 2px, transparent 3px)', backgroundSize: '150px 190px, 210px 240px, 260px 300px', opacity: 0.55}} />
      <AbsoluteFill style={{background: 'linear-gradient(118deg, rgba(180,215,240,0.10) 0%, transparent 34%, transparent 66%, rgba(160,200,232,0.06) 100%)'}} />
      <AbsoluteFill style={{background: `rgba(190,220,245,${lightning * 0.22})`}} />
      {/* his breath fog on the glass */}
      <div style={{position: 'absolute', left: 250, top: 780, width: 420, height: 320, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(210,230,242,0.10), transparent 68%)', filter: 'blur(22px)', opacity: presence * 0.8}} />
    </Cam>
    <Vignette strength={0.86} />
  </AbsoluteFill>
);

/* ------------------------------------------------------------------ */
/* Amara's monitor room                                                */
/* ------------------------------------------------------------------ */

const ScreenFeed: React.FC<{kind: number; f: number; dim?: number}> = ({kind, f, dim = 0}) => {
  const flick = 0.92 + Math.sin(f / 7 + kind) * 0.05 + Math.sin(f / 23 + kind * 2) * 0.03;
  return (
    <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg,#081018,#05090E)', overflow: 'hidden', opacity: flick}}>
      {kind === 0 ? (
        <>
          {/* apartment wide */}
          <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(300px 240px at 24% 36%, rgba(84,134,176,0.30), transparent 70%)'}} />
          <div style={{position: 'absolute', left: '14%', top: '26%', width: '30%', height: '44%', background: 'linear-gradient(180deg,#13202C,#091018)', border: '2px solid rgba(140,180,210,0.16)'}} />
          <div style={{position: 'absolute', left: '55%', top: '24%', width: '22%', height: '58%', background: '#0C1218', border: '2px solid rgba(140,180,210,0.1)'}} />
          {/* figure */}
          <div style={{position: 'absolute', left: '44%', top: '40%', width: '12%', height: '36%', background: '#060A0E', borderRadius: '44% 44% 10% 10%'}} />
          <div style={{position: 'absolute', left: '46.5%', top: '36%', width: '7%', height: '7%', borderRadius: '50%', background: '#070B0F'}} />
        </>
      ) : null}
      {kind === 1 ? (
        <>
          {/* CCTV hallway */}
          <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg,#0A1118,#070C11)'}} />
          <div style={{position: 'absolute', left: '18%', top: '16%', width: '64%', height: '72%', background: 'linear-gradient(180deg,#101A23,#0A1016)'}} />
          <div style={{position: 'absolute', left: '56%', top: '36%', width: '22%', height: '56%', background: '#05080B', border: '2px solid rgba(140,180,210,0.12)'}} />
          <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: '100%', background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.3) 0 1px, transparent 1px 4px)', opacity: 0.5}} />
          <div style={{position: 'absolute', left: '10%', top: '8%', fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 13, letterSpacing: '0.22em', color: 'rgba(200,220,236,0.5)'}}>REC · 12:00:19 AM</div>
        </>
      ) : null}
      {kind === 2 ? (
        <>
          {/* waveform */}
          <div style={{position: 'absolute', left: '8%', right: '8%', top: '46%', height: '20%', display: 'flex', alignItems: 'center', gap: 3}}>
            {Array.from({length: 44}).map((_, i) => {
              const hh = 6 + Math.abs(Math.sin(f / 5 + i * 0.5)) * 52;
              return <div key={i} style={{flex: 1, height: hh, background: 'rgba(140,200,230,0.55)', borderRadius: 2}} />;
            })}
          </div>
          <div style={{position: 'absolute', left: '8%', top: '12%', fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 12, letterSpacing: '0.24em', color: 'rgba(180,210,232,0.5)'}}>AUDIO · LOOP 147</div>
        </>
      ) : null}
      {kind === 3 ? (
        <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{fontFamily: 'Helvetica, Arial, sans-serif', fontSize: 64, fontWeight: 200, color: '#E9F3FA', textShadow: '0 0 30px rgba(130,185,225,0.4)'}}>11:59</div>
          <div style={{marginTop: 8, fontFamily: 'Helvetica, Arial, sans-serif', fontSize: 16, letterSpacing: '0.3em', color: 'rgba(190,214,232,0.5)'}}>PM · LOCKED</div>
        </div>
      ) : null}
      {kind === 4 ? (
        <>
          <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg,#0B1724,#060C12)'}} />
          <RainStreaks f={f} speed={16} opacity={0.5} />
          {[0, 1, 2].map((i) => (
            <div key={i} style={{position: 'absolute', left: 20 + i * 74, bottom: 0, width: 46, height: 100 + i * 40, background: 'rgba(5,9,13,0.85)'}}>
              <div style={{position: 'absolute', left: 10, top: 14 + i * 10, width: 10, height: 12, background: 'rgba(226,178,118,0.35)'}} />
            </div>
          ))}
        </>
      ) : null}
      {kind === 5 ? (
        <>
          <svg viewBox="0 0 200 130" style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}}>
            {[26, 40, 54].map((r, i) => (
              <ellipse key={r} cx={100} cy={66} rx={r} ry={r * 0.62} fill="none" stroke={`rgba(120,185,220,${0.35 - i * 0.08})`} strokeWidth={1.2} strokeDasharray="4 5" />
            ))}
            <circle cx={100} cy={66} r={5} fill="rgba(160,215,240,0.8)" />
            <path d="M 100 66 L 148 44" stroke="rgba(220,170,130,0.6)" strokeWidth={1.2} />
            <circle cx={148} cy={44} r={3} fill="rgba(225,180,140,0.8)" />
          </svg>
          <div style={{position: 'absolute', left: '10%', top: '8%', fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 11, letterSpacing: '0.24em', color: 'rgba(180,210,232,0.45)'}}>LOOP · 147</div>
        </>
      ) : null}
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(115deg, rgba(255,255,255,0.06), transparent 40%)'}} />
      {dim ? <div style={{position: 'absolute', inset: 0, background: `rgba(0,0,0,${dim})`}} /> : null}
    </div>
  );
};

const AmaraWide: React.FC<{f: number}> = ({f}) => {
  const drift = clamp01((f - 1520) / 170);
  const glow = 0.9 + Math.sin(f / 9) * 0.06;
  return (
    <AbsoluteFill style={{background: '#03050A', overflow: 'hidden'}}>
      <AbsoluteFill style={{background: 'radial-gradient(900px 760px at 56% 30%, rgba(36,74,104,0.42), transparent 72%), linear-gradient(180deg,#04070C,#020407)'}} />
      <Cam z={1.1 + drift * 0.05} ox="50%" oy="43%" x={-14 + drift * 28}>
        {/* monitor wall */}
        <div style={{position: 'absolute', left: 40, top: 210, width: 1000, height: 800, background: 'radial-gradient(closest-side, rgba(90,155,200,0.28), transparent 78%)', filter: 'blur(30px)'}} />
        <div style={{position: 'absolute', left: 62, top: 196, width: 950, height: 780, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 18, filter: 'brightness(1.35) saturate(1.05)'}}>
          {[0, 1, 2, 3, 4, 5].map((k) => (
            <div key={k} style={{position: 'relative', borderRadius: 8, overflow: 'hidden', background: '#05090E', border: '6px solid #090D12', boxShadow: '0 0 0 1px rgba(120,160,190,0.10), 0 12px 34px rgba(0,0,0,0.7)'}}>
              <ScreenFeed kind={k} f={f} dim={k === 4 ? 0.15 : 0} />
            </div>
          ))}
        </div>
        {/* desk + glow */}
        <div style={{position: 'absolute', left: 0, top: 1210, width: 1080, height: 710, background: 'linear-gradient(180deg,#0D141C 0%,#070C12 34%,#030507 100%)'}} />
        <div style={{position: 'absolute', left: 0, top: 1196, width: 1080, height: 16, background: 'linear-gradient(180deg,#16202A,#080D13)'}} />
        <div style={{position: 'absolute', left: 0, top: 1195, width: 1080, height: 3, background: 'rgba(160,205,235,0.35)'}} />
        <div style={{position: 'absolute', left: 60, top: 1212, width: 980, height: 210, background: 'linear-gradient(180deg, rgba(110,175,215,0.16), transparent 82%)', filter: 'blur(18px)'}} />
        <div style={{position: 'absolute', left: 60, top: 900, width: 960, height: 320, background: 'radial-gradient(ellipse at 50% 0%, rgba(90,150,190,0.20), transparent 70%)', filter: 'blur(26px)', opacity: glow}} />
        {/* desk clutter, kept low-contrast so the wall stays the subject */}
        <div style={{position: 'absolute', left: 120, top: 1292, width: 360, height: 78, borderRadius: 6, background: 'linear-gradient(180deg,rgba(16,22,29,0.9),rgba(7,10,14,0.95))', border: '1px solid rgba(120,165,195,0.08)'}}>
          <div style={{position: 'absolute', left: 12, right: 12, top: 12, height: 44, background: 'repeating-linear-gradient(90deg, rgba(150,190,215,0.05) 0 26px, transparent 26px 32px), repeating-linear-gradient(0deg, rgba(150,190,215,0.05) 0 12px, transparent 12px 20px)', borderRadius: 3}} />
        </div>
        <div style={{position: 'absolute', left: 540, top: 1232, width: 118, height: 88, background: 'linear-gradient(160deg,#0F151C,#070A0E)', border: '1px solid rgba(120,165,195,0.07)', transform: 'rotate(-4deg)'}}>
          <div style={{position: 'absolute', left: 12, right: 12, top: 12, height: 2, background: 'rgba(150,190,215,0.14)'}} />
          <div style={{position: 'absolute', left: 12, right: 30, top: 24, height: 2, background: 'rgba(150,190,215,0.09)'}} />
        </div>
        <div style={{position: 'absolute', left: 300, top: 1214, width: 54, height: 70, borderRadius: '5px 5px 9px 9px', background: 'linear-gradient(180deg,#111821,#080C11)', border: '1px solid rgba(120,165,195,0.10)'}}>
          <div style={{position: 'absolute', left: 10, top: 20, width: 34, height: 26, borderRadius: '50%', background: 'rgba(120,170,205,0.10)'}} />
        </div>
        <div style={{position: 'absolute', left: 170, top: 1206, width: 280, height: 2, borderRadius: 1, background: 'rgba(140,180,210,0.10)'}} />
        <div style={{position: 'absolute', left: 700, top: 1216, width: 180, height: 14, borderRadius: 7, background: '#0A0E13', boxShadow: '0 0 22px rgba(120,180,220,0.10)'}} />
        {/* Amara, back 3/4, foreground right */}
        <div style={{position: 'absolute', right: 26, bottom: -200, width: 600, height: 1320, filter: 'brightness(0.8) saturate(1.05)'}}>
          <AmaraBack rim={1.1} />
        </div>
        {/* monitor glow on her shoulder */}
        <div style={{position: 'absolute', right: 40, bottom: 300, width: 300, height: 700, background: 'linear-gradient(90deg, rgba(110,180,215,0.16), transparent 70%)', filter: 'blur(18px)', mixBlendMode: 'screen'}} />
      </Cam>
      <Vignette strength={0.9} />
      <Grain f={f} opacity={0.1} />
    </AbsoluteFill>
  );
};

const AmaraClose: React.FC<{f: number}> = ({f}) => {
  const push = clamp01((f - 1690) / 118);
  const screenFlick = 0.35 + Math.sin(f / 8) * 0.08 + Math.sin(f / 19) * 0.05;
  return (
    <AbsoluteFill style={{background: '#03060A', overflow: 'hidden'}}>
      {/* bokeh of her monitor wall */}
      <AbsoluteFill style={{background: 'radial-gradient(900px 800px at 66% 26%, rgba(44,96,128,0.5), transparent 74%), linear-gradient(180deg,#04080D,#020406)'}} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div key={i} style={{position: 'absolute', left: [70, 320, 620, 130, 520, 800][i], top: [180, 90, 220, 520, 610, 420][i], width: [150, 190, 130, 210, 170, 120][i], height: [100, 120, 90, 130, 110, 80][i], borderRadius: 6, background: 'rgba(60,110,145,0.16)', border: '1px solid rgba(130,180,210,0.10)', filter: 'blur(3px)'}} />
      ))}
      <Cam z={0.98 + push * 0.07} ox="50%" oy="40%">
        <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, filter: 'brightness(1.08) saturate(1.04) drop-shadow(0 30px 70px rgba(0,0,0,0.9))'}}>
          <Amara
            expression={f > 1762 ? 'soft' : 'calm'}
            look={f < 1736 ? 'right' : 'camera'}
            turn={0.34}
            screen={screenFlick + 0.3}
            rim={1.15}
            viewBox="226 84 150 267"
            preserve="xMidYMid slice"
          />
        </div>
        {/* monitor light wash */}
        <AbsoluteFill style={{background: `linear-gradient(96deg, rgba(110,190,225,${0.10 + screenFlick * 0.10}) 0%, transparent 44%)`, mixBlendMode: 'screen'}} />
        <AbsoluteFill style={{background: 'radial-gradient(420px 520px at 30% 30%, rgba(120,190,225,0.10), transparent 70%)', mixBlendMode: 'screen'}} />
        {/* foreground desk edge, out of focus */}
        <div style={{position: 'absolute', left: -60, right: -60, top: 1700, height: 320, background: 'linear-gradient(180deg, rgba(14,20,27,0.96), rgba(4,6,9,0.98))', filter: 'blur(18px)'}} />
        <div style={{position: 'absolute', left: -60, right: -60, top: 1688, height: 5, background: 'rgba(150,198,228,0.22)', filter: 'blur(4px)'}} />
        <div style={{position: 'absolute', left: -120, top: 260, width: 220, height: 1250, background: 'linear-gradient(90deg, rgba(8,14,20,0.95), rgba(10,18,25,0.35) 70%, transparent)', filter: 'blur(24px)'}} />
        {/* faint reflection of a screen on the glass-less air in front of her */}
        <div style={{position: 'absolute', left: 620, top: 260, width: 300, height: 190, background: 'linear-gradient(160deg, rgba(90,150,185,0.10), transparent 60%)', transform: 'skewY(-8deg)', filter: 'blur(1px)'}} />
      </Cam>
      <Vignette strength={0.88} />
      <Grain f={f} opacity={0.09} />
    </AbsoluteFill>
  );
};


/* full-body wide: the room breathes, he is small in it */
const RoomWide: React.FC<{
  f: number;
  expression: Expression;
  look?: Look;
  turn?: number;
  push?: number;
  dark?: number;
  phoneGlow?: number;
  joltAt?: number;
  tilt?: number;
  feet?: number;
}> = ({f, expression, look = 'camera', turn = 0, push = 0, dark = 0.2, phoneGlow = 0.5, joltAt, tilt = 0, feet = 1560}) => {
  const jx = joltAt !== undefined ? jolt(f, joltAt, 5) : 0;
  return (
    <AbsoluteFill style={{background: '#04060A'}}>
      <Cam z={1.02 + push} ox="50%" oy="46%" x={jx * 0.4}>
        <AbsoluteFill style={{filter: `brightness(${1 - dark * 0.55}) saturate(${1 - dark * 0.2})`}}>
          <Room f={f} phoneOn={phoneGlow} />
        </AbsoluteFill>
        {/* window key */}
        <AbsoluteFill style={{background: 'radial-gradient(700px 820px at 24% 34%, rgba(88,140,180,0.26), transparent 66%)'}} />
        <div
          style={{
            position: 'absolute',
            left: 540 - NOAH_W / 2,
            bottom: 1920 - feet,
            width: NOAH_W,
            height: NOAH_H,
            transform: `translate(${jx}px, ${Math.sin(f / 26) * 1.4}px) rotate(${tilt + jx * 0.03}deg)`,
            transformOrigin: '50% 88%',
            filter: `brightness(${1 - dark * 0.3}) drop-shadow(0 26px 52px rgba(0,0,0,0.9))`,
          }}
        >
          <Noah expression={expression} look={look} turn={turn} rim={1.15} viewBox="0 0 600 1080" preserve="xMidYMid slice" />
        </div>
        {/* floor contact */}
        <div style={{position: 'absolute', left: 300, bottom: 1920 - feet - 26, width: 480, height: 70, background: 'radial-gradient(closest-side, rgba(0,0,0,0.75), transparent 72%)', filter: 'blur(10px)'}} />
        <div style={{position: 'absolute', left: 250, top: 640, width: 300, height: 820, background: 'linear-gradient(90deg, rgba(140,190,225,0.16), transparent 70%)', filter: 'blur(30px)', mixBlendMode: 'screen'}} />
      </Cam>
      <Vignette strength={0.9} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Part 4                                                              */
/* ------------------------------------------------------------------ */

export const Part4: React.FC = () => {
  const f = useCurrentFrame();
  const range = (s: number, e: number) => f >= s && f < e;
  const p = (s: number, e: number) => clamp01((f - s) / (e - s));

  // message flood count
  const count = Math.min(147, Math.floor(interpolate(p(452, 566), [0, 1], [1, 147])));
  // ringing / connected
  const connected = smooth(p(1244, 1262));

  // lightning behind the window
  const lightning = f > 1082 && f < 1090 ? Math.max(0, 1 - Math.abs(f - 1086) / 4) : 0;

  return (
    <AbsoluteFill style={{backgroundColor: '#000', overflow: 'hidden'}}>
      <Audio src={staticFile('audio/pt4.mp3')} />
      <Audio src={staticFile('audio/rain.wav')} volume={0.06} />

      {/* 01 the last message */}
      {range(0, 66) ? (
        <AbsoluteFill>
          <MsgScreen f={f} push={p(0, 66) * 0.3} />
          <AbsoluteFill style={{background: 'radial-gradient(560px 700px at 50% 44%, rgba(120,178,220,0.10), transparent 72%)'}} />
          <Vignette strength={0.86} />
          <Grain f={f} opacity={0.09} />
        </AbsoluteFill>
      ) : null}

      {/* 02 he watches the clock */}
      {range(66, 138) ? (
        <AbsoluteFill>
          <NoahInRoom
            f={f}
            expression={f < 108 ? 'unease' : 'dread'}
            look={f < 100 ? 'down' : 'camera'}
            push={0.03 + p(66, 138) * 0.05}
            lidAt={122}
            phoneGlow={0.7}
            dark={0.1}
          />
          <AbsoluteFill style={{background: 'radial-gradient(420px 380px at 44% 66%, rgba(120,182,230,0.14), transparent 70%)'}} />
        </AbsoluteFill>
      ) : null}

      {/* 03 eleven fifty-nine */}
      {range(138, 200) ? (
        <AbsoluteFill>
          <ClockScreen f={f} push={p(138, 200) * 0.28} />
          <Vignette strength={0.84} />
          <Grain f={f} opacity={0.08} />
        </AbsoluteFill>
      ) : null}

      {/* 04 seconds move, minute does not */}
      {range(200, 266) ? (
        <AbsoluteFill>
          <ClockScreen f={f} push={0.3 + p(200, 266) * 0.16} tap={p(246, 264)} />
          <AbsoluteFill style={{background: 'radial-gradient(520px 420px at 50% 52%, rgba(110,180,225,0.10), transparent 70%)'}} />
          <Vignette strength={0.88} />
          <Grain f={f} opacity={0.08} />
        </AbsoluteFill>
      ) : null}

      {/* 05 minute never changed: his reaction */}
      {range(266, 330) ? (
        <AbsoluteFill>
          <NoahInRoom
            f={f}
            expression={f < 300 ? 'dread' : 'shock'}
            look={f < 296 ? 'down' : 'camera'}
            push={0.02 + p(266, 330) * 0.06}
            joltAt={300}
            joltAmp={3.5}
            lidAt={316}
            sweat={0.6}
            phoneGlow={0.85}
            dark={0.16}
          />
          <AbsoluteFill style={{background: `radial-gradient(520px 420px at 46% 68%, rgba(120,182,230,${0.14 + Math.sin(f / 5) * 0.03}), transparent 70%)`}} />
        </AbsoluteFill>
      ) : null}

      {/* 06 blackout */}
      {range(330, 452) ? <BlackoutShot f={f} /> : null}

      {/* 07 the phone fills with messages */}
      {range(452, 584) ? (
        <AbsoluteFill>
          <CountScreen f={f} count={count} push={p(452, 584) * 0.26} />
          <AbsoluteFill style={{background: `rgba(120,180,225,${Math.max(0, Math.sin(f / 4)) * 0.03})`, mixBlendMode: 'screen'}} />
          <Vignette strength={0.86} />
          <Grain f={f} opacity={0.09} />
        </AbsoluteFill>
      ) : null}

      {/* 08 his face in the blue light */}
      {range(584, 654) ? (
        <AbsoluteFill>
          <NoahInRoom
            f={f}
            expression={f < 616 ? 'shock' : 'dread'}
            look={f < 606 ? 'down' : 'camera'}
            push={0.03 + p(584, 654) * 0.05}
            joltAt={584}
            joltAmp={8}
            sweat={1}
            phoneGlow={1}
            dark={0.55}
          />
          <AbsoluteFill style={{background: `radial-gradient(560px 500px at 50% 64%, rgba(105,175,225,${0.2 + Math.sin(f / 4) * 0.05}), transparent 72%)`}} />
        </AbsoluteFill>
      ) : null}

      {/* 10 the warning, repeated */}
      {range(654, 736) ? (
        <AbsoluteFill>
          <WarnScreen f={f} scroll={smooth(p(654, 736))} push={p(654, 736) * 0.18} />
          <Vignette strength={0.86} />
          <Grain f={f} opacity={0.08} />
        </AbsoluteFill>
      ) : null}

      {/* 11 he looks at the closed door */}
      {range(736, 800) ? <DoorShot f={f} /> : null}

      {/* 12 the screen flickers */}
      {range(800, 854) ? (
        <AbsoluteFill>
          <NewMsgScreen f={f} glitch={1 - smooth(p(800, 852)) * 0.9} appear={Math.abs(Math.sin(f / 5)) > 0.55 ? 0.55 : 0.1} />
          <AbsoluteFill style={{background: `rgba(150,205,240,${f < 812 ? 0.06 : 0})`}} />
          <Vignette strength={0.88} />
          <Grain f={f} opacity={0.1} />
        </AbsoluteFill>
      ) : null}

      {/* 13 you've done this before */}
      {range(854, 900) ? (
        <AbsoluteFill>
          <NewMsgScreen f={f} glitch={0} appear={smooth(p(854, 866))} />
          <AbsoluteFill style={{background: `radial-gradient(560px 460px at 50% 42%, rgba(210,160,160,${0.10 * smooth(p(854, 880))}), transparent 70%)`}} />
          <Vignette strength={0.9} />
          <Grain f={f} opacity={0.09} />
        </AbsoluteFill>
      ) : null}

      {/* 14 his reaction */}
      {range(900, 968) ? (
        <AbsoluteFill>
          <NoahInRoom
            f={f}
            expression={f < 918 ? 'shock' : 'gasp'}
            look="camera"
            push={0.04 + p(900, 968) * 0.07}
            joltAt={902}
            joltAmp={11}
            sweat={1}
            phoneGlow={0.85}
            dark={0.4}
            tilt={-1.2}
          />
          <AbsoluteFill style={{background: `radial-gradient(460px 420px at 48% 58%, rgba(120,175,215,0.16), transparent 72%)`}} />
          <AbsoluteFill style={{background: `rgba(180,205,230,${f > 900 && f < 906 ? 0.08 - (f - 900) * 0.012 : 0})`}} />
        </AbsoluteFill>
      ) : null}

      {/* 15 toward the window */}
      {range(968, 1040) ? (
        <AbsoluteFill>
          <RoomWide
            f={f}
            expression={f < 992 ? 'gasp' : 'fear'}
            look={f < 984 ? 'camera' : 'left'}
            turn={-smooth(p(984, 1022)) * 0.42}
            push={0.01 + p(968, 1040) * 0.05}
            dark={0.3}
            phoneGlow={0.4}
            joltAt={970}
          />
          <AbsoluteFill style={{background: 'radial-gradient(620px 640px at 22% 40%, rgba(100,155,195,0.20), transparent 70%)'}} />
        </AbsoluteFill>
      ) : null}

      {/* 16 he sees himself in the rain */}
      {range(1040, 1112) ? (
        <WindowShot f={f} presence={smooth(p(1044, 1074))} lightning={lightning} push={p(1040, 1112) * 0.05} />
      ) : null}

      {/* 17 the gasp: extreme close, the face breaks */}
      {range(1112, 1175) ? (
        <AbsoluteFill>
          <NoahInRoom
            f={f}
            expression={f < 1138 ? 'fear' : 'gasp'}
            look="left"
            turn={-0.3}
            viewBox="182 62 248 372"
            push={0.04 + p(1112, 1175) * 0.05}
            joltAt={1144}
            joltAmp={7}
            sweat={1}
            phoneGlow={0.3}
            dark={0.46}
            tilt={0.8}
            ox="46%"
            oy="40%"
          />
          <AbsoluteFill style={{background: 'radial-gradient(560px 560px at 26% 34%, rgba(120,170,205,0.20), transparent 70%)'}} />
          <AbsoluteFill style={{background: `rgba(190,215,238,${f > 1144 && f < 1150 ? 0.1 - (f - 1144) * 0.016 : 0})`}} />
        </AbsoluteFill>
      ) : null}

      {/* 18 the phone rings */}
      {range(1175, 1254) ? (
        <AbsoluteFill>
          <CallScreen f={f} connected={connected} push={p(1175, 1254) * 0.2} />
          {f < 1232 ? <AbsoluteFill style={{transform: `translate(${Math.sin(f * 4.8) * 3}px, ${Math.cos(f * 3.7) * 2}px)`}} /> : null}
          <AbsoluteFill style={{background: `radial-gradient(460px 520px at 50% 44%, rgba(120,178,220,${0.10 + (1 - connected) * 0.06}), transparent 70%)`}} />
          <Vignette strength={0.86} />
          <Grain f={f} opacity={0.08} />
        </AbsoluteFill>
      ) : null}

      {/* 19 the call */}
      {range(1254, 1347) ? (
        <AbsoluteFill>
          <NoahInRoom
            f={f}
            expression={f < 1290 ? 'fear' : 'dread'}
            look={f < 1282 ? 'down' : 'camera'}
            viewBox="172 46 268 352"
            push={0.02 + p(1254, 1347) * 0.045}
            lidAt={1318}
            sweat={0.4}
            phoneGlow={0.55}
            dark={0.46}
            ox="62%"
            oy="36%"
          />
          <AbsoluteFill style={{background: `radial-gradient(400px 360px at 54% 74%, rgba(120,182,230,${0.13 + Math.sin(f / 9) * 0.02}), transparent 70%)`}} />
        </AbsoluteFill>
      ) : null}

      {/* 20 her voice was calm: pull out, he is alone in the room */}
      {range(1347, 1400) ? (
        <AbsoluteFill>
          <RoomWide
            f={f}
            expression="dread"
            look={f < 1366 ? 'down' : 'camera'}
            turn={-0.12}
            push={0.07 + p(1347, 1400) * 0.03}
            dark={0.42}
            phoneGlow={0.45}
            feet={1580}
          />
          <AbsoluteFill style={{background: 'radial-gradient(520px 520px at 46% 46%, rgba(110,165,200,0.12), transparent 72%)'}} />
        </AbsoluteFill>
      ) : null}

      {/* 21 listen carefully */}
      {range(1400, 1466) ? (
        <AbsoluteFill>
          <NoahInRoom
            f={f}
            expression={f < 1428 ? 'dread' : 'unease'}
            look="camera"
            push={0.06 + p(1400, 1466) * 0.07}
            lidAt={1446}
            phoneGlow={0.35}
            dark={0.55}
            tilt={-0.8}
          />
          <AbsoluteFill style={{background: 'radial-gradient(380px 400px at 52% 44%, rgba(110,165,200,0.12), transparent 70%)'}} />
        </AbsoluteFill>
      ) : null}

      {/* 22 you've been here before: eyes only */}
      {range(1466, 1520) ? (
        <AbsoluteFill>
          <NoahInRoom
            f={f}
            expression={f < 1478 ? 'gasp' : 'shock'}
            look={f < 1486 ? 'left' : 'camera'}
            viewBox="192 96 216 250"
            push={0.03 + p(1466, 1520) * 0.05}
            joltAt={1467}
            joltAmp={6}
            sweat={0.8}
            phoneGlow={0.28}
            dark={0.52}
            tilt={1}
            ox="50%"
            oy="38%"
          />
          <AbsoluteFill style={{background: `radial-gradient(520px 460px at 46% 40%, rgba(120,175,215,0.16), transparent 72%)`}} />
          <AbsoluteFill style={{background: `rgba(180,208,232,${f > 1467 && f < 1473 ? 0.09 - (f - 1467) * 0.015 : 0})`}} />
        </AbsoluteFill>
      ) : null}

      {/* 23 somewhere across the city */}
      {range(1520, 1690) ? <AmaraWide f={f} /> : null}

      {/* 24 her name was Amara */}
      {range(1690, 1816) ? (
        <AbsoluteFill>
          <AmaraClose f={f} />
          <AbsoluteFill style={{background: `rgba(0,0,0,${smooth(p(1798, 1814)) * 0.98})`}} />
        </AbsoluteFill>
      ) : null}

      {f >= 1813 ? <AbsoluteFill style={{background: '#000'}} /> : null}
      {f < 1810 ? <Grain f={f} opacity={0.12} /> : null}
    </AbsoluteFill>
  );
};
