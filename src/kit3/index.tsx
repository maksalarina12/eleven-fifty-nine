import React from 'react';
import {clamp01, smooth, rnd, MONO} from '../kit';
import {Haze} from '../kit2';

/* ------------------------------------------------------------------ */
/* SEASON 02 — sets for E05…E10                                        */
/* Iris is silhouette / insert only (locked decision).                 */
/* ------------------------------------------------------------------ */

const SANS = '"Helvetica Neue", Helvetica, Arial, sans-serif';

/* ------------------------------------------------------------------ */
/* archive exit corridor                                              */
/* ------------------------------------------------------------------ */

export const Corridor: React.FC<{
  f: number;
  door?: number;
  lamp?: number;
  children?: React.ReactNode;
}> = ({f, door = 1, lamp = 1, children}) => (
  <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
    <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(176deg,#0A1218 0%,#070C12 58%,#03070B 100%)'}} />
    {/* ceiling + ducts */}
    <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 430, background: 'linear-gradient(180deg,#0C141B,#070C11)'}} />
    {[0, 1].map((i) => (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: -40,
          right: -40,
          top: 250 + i * 96,
          height: 46,
          borderRadius: 10,
          background: 'linear-gradient(180deg,#18222B,#080D13)',
          boxShadow: 'inset 0 1px 0 rgba(150,186,212,0.1)',
        }}
      />
    ))}
    {/* tiled lower wall */}
    {Array.from({length: 5}).map((_, r) =>
      Array.from({length: 7}).map((__, c) => (
        <div
          key={`${r}-${c}`}
          style={{
            position: 'absolute',
            left: -20 + c * 168,
            top: 900 + r * 150,
            width: 152,
            height: 136,
            background: 'rgba(58,84,102,0.1)',
            boxShadow: 'inset 0 0 0 1px rgba(130,168,196,0.05)',
          }}
        />
      ))
    )}
    {/* floor */}
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 560, background: 'linear-gradient(180deg,#0A1219,#04070B 72%)'}} />
    {[0, 1, 2, 3].map((i) => (
      <div
        key={`fl${i}`}
        style={{
          position: 'absolute',
          left: '50%',
          bottom: 0,
          width: 2,
          height: 560,
          marginLeft: (i - 1.5) * 210,
          background: 'linear-gradient(180deg, rgba(140,178,204,0.1), transparent)',
        }}
      />
    ))}
    {/* the exit door, bright beyond */}
    <div
      style={{
        position: 'absolute',
        left: 700,
        top: 380,
        width: 300,
        height: 1120,
        background: 'linear-gradient(180deg,#0B141B,#050A0F)',
        boxShadow: 'inset 0 0 80px rgba(0,0,0,0.9)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        left: 726,
        top: 420,
        width: 248,
        height: 1080,
        background: `linear-gradient(180deg, rgba(206,230,244,${0.1 + door * 0.28}), rgba(90,140,172,${0.04 + door * 0.14}))`,
        filter: 'blur(2px)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        left: 690,
        top: 1480,
        width: 760,
        height: 300,
        background: `radial-gradient(closest-side, rgba(196,226,244,${0.2 * door}), transparent 74%)`,
        filter: 'blur(22px)',
        mixBlendMode: 'screen',
      }}
    />
    {/* practical lamp over the door */}
    <div style={{position: 'absolute', left: 770, top: 330, width: 160, height: 16, borderRadius: 6, background: 'rgba(232,186,116,0.72)', opacity: lamp, boxShadow: '0 0 60px rgba(226,170,74,0.5)'}} />
    {/* near pillar, cropped */}
    <div style={{position: 'absolute', left: -70, top: -40, width: 190, height: 2000, background: 'linear-gradient(90deg,#0E161D,#05090E)'}} />
    <Haze x="70%" y="56%" size={760} color="rgba(150,200,228,0.12)" />
    {children}
  </div>
);

/* ------------------------------------------------------------------ */
/* hospital bracelet insert                                           */
/* ------------------------------------------------------------------ */

export const Bracelet: React.FC<{f: number; show?: number}> = ({f, show = 1}) => (
  <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(168deg,#0B1219 0%,#060B11 60%,#03070B 100%)'}}>
    {/* the arm, laid across the frame, sleeve first */}
    <div style={{position: 'absolute', left: -220, top: 520, width: 1560, height: 760, transform: 'rotate(-13deg)', transformOrigin: '30% 50%'}}>
      {/* sleeve */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 190,
          width: 900,
          height: 330,
          borderRadius: '20px 150px 150px 20px',
          background: 'linear-gradient(178deg,#3A4650 0%,#232D36 48%,#0C1218 100%)',
          boxShadow: 'inset 0 3px 0 rgba(190,216,232,0.18)',
        }}
      />
      {/* a fold in the fabric */}
      <div style={{position: 'absolute', left: 300, top: 230, width: 520, height: 16, borderRadius: 8, background: 'rgba(8,13,18,0.5)', transform: 'rotate(-2deg)'}} />
      <div style={{position: 'absolute', left: 120, top: 400, width: 640, height: 14, borderRadius: 7, background: 'rgba(190,216,232,0.08)'}} />
      {/* cuff */}
      <div style={{position: 'absolute', left: 790, top: 176, width: 130, height: 358, borderRadius: 26, background: 'linear-gradient(180deg,#2A353F,#0D141A)'}} />
      {/* forearm */}
      <div
        style={{
          position: 'absolute',
          left: 860,
          top: 224,
          width: 460,
          height: 262,
          borderRadius: '40px 120px 120px 40px',
          background: 'linear-gradient(172deg,#7A5F49 0%,#57402F 52%,#2C211A 100%)',
        }}
      />
      {/* wrist, leaving the frame at the right */}
      <div
        style={{
          position: 'absolute',
          left: 1240,
          top: 214,
          width: 320,
          height: 280,
          borderRadius: '30px 70px 70px 30px',
          background: 'linear-gradient(176deg,#82664D 0%,#5B4433 54%,#2E2219 100%)',
        }}
      />
      {/* the hospital band, wrapped round the wrist */}
      <div
        style={{
          position: 'absolute',
          left: 1120,
          top: 196,
          width: 118,
          height: 316,
          borderRadius: 16,
          transform: 'rotate(-2deg)',
          background: 'linear-gradient(160deg,#EDF2F5 0%,#CBD7DE 46%,#96A5AF 100%)',
          boxShadow: '0 14px 30px rgba(0,0,0,0.72), inset 0 0 0 1px rgba(255,255,255,0.55)',
          opacity: show,
        }}
      >
        {Array.from({length: 7}).map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 16,
              top: 42 + i * 34,
              width: 22 + rnd(i + 3) * 52,
              height: 6,
              background: 'rgba(40,58,70,0.5)',
            }}
          />
        ))}
        <div style={{position: 'absolute', left: 16, top: 20, width: 74, height: 4, background: 'rgba(186,74,60,0.6)'}} />
        {/* the band's soft edge, catching the door light */}
        <div style={{position: 'absolute', right: 0, top: 12, bottom: 12, width: 8, borderRadius: 6, background: 'rgba(255,255,255,0.5)'}} />
      </div>
      {/* shadow the band casts on the skin */}
      <div style={{position: 'absolute', left: 1226, top: 288, width: 46, height: 300, background: 'rgba(12,8,6,0.45)', filter: 'blur(6px)'}} />
      {/* rim light along the top of the arm */}
      <div style={{position: 'absolute', left: 60, top: 186, width: 840, height: 6, background: 'linear-gradient(90deg, transparent, rgba(198,224,240,0.4), transparent)'}} />
      <div style={{position: 'absolute', left: 900, top: 216, width: 480, height: 5, background: 'linear-gradient(90deg, transparent, rgba(238,206,160,0.34), transparent)'}} />
    </div>
    {/* cold key from the left, warmth from the door beyond */}
    <Haze x="16%" y="30%" size={760} color="rgba(150,200,228,0.18)" />
    <Haze x="84%" y="66%" size={620} color="rgba(226,170,74,0.2)" />
    <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(66% 58% at 58% 44%, transparent 30%, rgba(2,5,9,0.92) 100%)'}} />
  </div>
);

/* ------------------------------------------------------------------ */
/* Iris — the full rig lives in src/character/Iris.tsx               */
/* ------------------------------------------------------------------ */

export {Iris} from '../character/Iris';

/* ------------------------------------------------------------------ */
/* notebook                                                            */
/* ------------------------------------------------------------------ */

export const Notebook: React.FC<{
  f: number;
  open?: number;
  page?: number;
  highlight?: number;
  tilt?: number;
}> = ({f, open = 1, page = 0, highlight = 0, tilt = -2}) => {
  const rows = (side: number) =>
    Array.from({length: 11}).map((_, i) => {
      const isOne = side === 1 && i === 6;
      return (
        <div
          key={`${side}-${i}`}
          style={{
            position: 'absolute',
            left: 44,
            right: 34,
            top: 126 + i * 74,
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            opacity: side === 1 && page < 0.5 ? 0.25 : 1,
          }}
        >
          {/* a date mark, illegible */}
          <div style={{display: 'flex', gap: 5}}>
            {Array.from({length: 3}).map((__, k) => (
              <div key={k} style={{width: 10 + rnd(side * 31 + i * 7 + k) * 26, height: 6, background: 'rgba(46,58,74,0.4)'}} />
            ))}
          </div>
          {/* the time, in ink */}
          <div
            style={{
              fontFamily: MONO,
              fontSize: isOne ? 44 : 34,
              letterSpacing: '0.04em',
              color: isOne ? 'rgba(150,54,44,0.92)' : 'rgba(34,44,60,0.78)',
              textShadow: isOne && highlight > 0 ? `0 0 ${24 * highlight}px rgba(206,96,74,0.55)` : 'none',
              transform: `rotate(${(rnd(i + side * 9) - 0.5) * 3}deg)`,
            }}
          >
            {isOne ? '12:01' : '11:59'}
          </div>
        </div>
      );
    });

  return (
    <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(172deg,#080D13 0%,#05090E 62%,#03060A 100%)'}}>
      {/* desk grain under the book */}
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 520, background: 'linear-gradient(180deg, rgba(26,36,46,0.5), rgba(5,9,13,0.98))'}} />
      <div
        style={{
          position: 'absolute',
          left: 46,
          right: 46,
          top: 300,
          height: 1330,
          transform: `perspective(1500px) rotateX(${(1 - open) * 12}deg) rotate(${tilt}deg)`,
          transformOrigin: '50% 100%',
        }}
      >
        {/* paper, two leaves */}
        {[0, 1].map((side) => (
          <div
            key={side}
            style={{
              position: 'absolute',
              left: side === 0 ? 0 : '50%',
              top: 0,
              width: '50%',
              height: '100%',
              background:
                side === 0
                  ? 'linear-gradient(96deg,#E8E4D6 0%,#DDD8C8 74%,#C9C3B1 100%)'
                  : 'linear-gradient(264deg,#EDE9DB 0%,#E0DBCB 70%,#CCC6B4 100%)',
              boxShadow: '0 30px 70px rgba(0,0,0,0.85)',
              overflow: 'hidden',
            }}
          >
            {/* ruled lines */}
            {Array.from({length: 15}).map((_, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: 30,
                  right: 26,
                  top: 108 + i * 74,
                  height: 2,
                  background: 'rgba(96,120,148,0.24)',
                }}
              />
            ))}
            {rows(side)}
            {/* margin rule */}
            <div style={{position: 'absolute', left: 34, top: 60, bottom: 40, width: 2, background: 'rgba(180,86,74,0.28)'}} />
          </div>
        ))}
        {/* gutter */}
        <div style={{position: 'absolute', left: '50%', top: 0, bottom: 0, width: 26, marginLeft: -13, background: 'linear-gradient(90deg, rgba(60,52,42,0.55), rgba(20,18,16,0.8), rgba(60,52,42,0.5))'}} />
        {/* page block edge */}
        <div style={{position: 'absolute', left: 0, right: 0, bottom: -14, height: 16, borderRadius: 3, background: 'linear-gradient(180deg,#B9B3A2,#6E6A5E)'}} />
      </div>
      {/* the lamp pool */}
      <div
        style={{
          position: 'absolute',
          left: 120,
          top: 240,
          width: 840,
          height: 900,
          background: 'radial-gradient(closest-side, rgba(236,190,126,0.26), rgba(226,170,74,0.06) 62%, transparent 82%)',
          filter: 'blur(26px)',
        }}
      />
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(68% 60% at 50% 46%, transparent 34%, rgba(2,5,9,0.9) 100%)'}} />
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* glass partition                                                     */
/* ------------------------------------------------------------------ */

export const Partition: React.FC<{
  f: number;
  crack?: number;
  left?: React.ReactNode;
  right?: React.ReactNode;
  children?: React.ReactNode;
}> = ({f, crack = 0, left, right, children}) => (
  <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
    <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(178deg,#0A1219 0%,#060C12 58%,#03070B 100%)'}} />
    {/* the room behind the glass: two halves, never quite matching */}
    <div style={{position: 'absolute', left: 0, top: 0, width: '50%', height: '100%', overflow: 'hidden'}}>{left}</div>
    <div style={{position: 'absolute', right: 0, top: 0, width: '50%', height: '100%', overflow: 'hidden'}}>{right}</div>
    {/* glass */}
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background:
          'linear-gradient(112deg, rgba(160,200,224,0.1) 0%, rgba(90,132,158,0.04) 34%, rgba(6,12,18,0.3) 62%, rgba(150,196,224,0.08) 100%)',
        boxShadow: 'inset 0 0 160px rgba(0,0,0,0.6)',
      }}
    />
    {/* seam down the middle */}
    <div style={{position: 'absolute', left: '50%', top: 0, bottom: 0, width: 14, marginLeft: -7, background: 'linear-gradient(90deg, rgba(10,16,22,0.9), rgba(120,158,186,0.18), rgba(10,16,22,0.9))'}} />
    {/* frame */}
    <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 26, background: 'linear-gradient(180deg,#141C24,#070C11)'}} />
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 34, background: 'linear-gradient(180deg,#0C141B,#04080D)'}} />
    {/* reflection of the room we are in */}
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundImage:
          'linear-gradient(102deg, rgba(210,232,244,0.05) 0%, transparent 22%, transparent 62%, rgba(210,232,244,0.045) 100%)',
        opacity: 0.9,
      }}
    />
    {/* cracks */}
    {crack > 0 ? (
      <svg viewBox="0 0 1080 1920" width="100%" height="100%" style={{position: 'absolute', inset: 0}}>
        {Array.from({length: 9}).map((_, i) => {
          const x = 540;
          const y = 980;
          const a = (i / 9) * Math.PI * 2 + 0.4;
          const len = (200 + rnd(i + 5) * 520) * crack;
          return (
            <path
              key={i}
              d={`M ${x} ${y} l ${Math.cos(a) * len * 0.5} ${Math.sin(a) * len * 0.5} l ${
                Math.cos(a + 0.3) * len * 0.3
              } ${Math.sin(a + 0.3) * len * 0.3} l ${Math.cos(a - 0.2) * len * 0.4} ${Math.sin(a - 0.2) * len * 0.4}`}
              stroke={`rgba(216,240,252,${0.3 + crack * 0.5})`}
              strokeWidth={2.4}
              fill="none"
            />
          );
        })}
        <circle cx={540} cy={980} r={26 * crack} fill="none" stroke={`rgba(216,240,252,${0.5 * crack})`} strokeWidth={2} />
      </svg>
    ) : null}
    {children}
  </div>
);

/* ------------------------------------------------------------------ */
/* chamber of sleepers                                                 */
/* ------------------------------------------------------------------ */

export const Sleeper: React.FC<{
  f: number;
  x: number;
  y: number;
  s?: number;
  awake?: number;
  strip?: number;
}> = ({f, x, y, s = 1, awake = 0, strip = 0}) => (
  <div style={{position: 'absolute', left: x, top: y, width: 520 * s, height: 236 * s}}>
    {/* the bed frame */}
    <div
      style={{
        position: 'absolute',
        inset: 0,
        borderRadius: 10 * s,
        background: 'linear-gradient(180deg,#1D2A34 0%,#101A22 54%,#060C11 100%)',
        boxShadow: 'inset 0 0 0 2px rgba(150,186,212,0.1), 0 20px 40px rgba(0,0,0,0.85)',
      }}
    />
    {/* the mattress, and the shadow under it */}
    <div style={{position: 'absolute', left: 20 * s, top: 20 * s, right: 20 * s, bottom: 34 * s, borderRadius: 8 * s, background: 'linear-gradient(180deg,#22323D 0%,#0D171E 100%)'}} />
    {/* the pillow */}
    <div
      style={{
        position: 'absolute',
        left: 34 * s,
        top: 26 * s,
        width: 150 * s,
        height: 132 * s,
        borderRadius: `${70 * s}px ${58 * s}px ${48 * s}px ${62 * s}px`,
        background: 'linear-gradient(164deg,#93A1AB 0%,#6A7883 58%,#404D57 100%)',
        boxShadow: 'inset 0 -8px 16px rgba(0,0,0,0.4)',
      }}
    />
    {/* the sheet, pulled up, catching the ceiling light on its ridge */}
    <div
      style={{
        position: 'absolute',
        left: 128 * s,
        top: 22 * s,
        right: 22 * s,
        bottom: 40 * s,
        borderRadius: `${70 * s}px ${26 * s}px ${12 * s}px ${40 * s}px`,
        background: 'linear-gradient(168deg,#8C9AA4 0%,#63717C 44%,#38434C 100%)',
        boxShadow: 'inset 0 2px 0 rgba(214,232,242,0.24), inset 0 -10px 22px rgba(0,0,0,0.4)',
      }}
    />
    {/* the body under it */}
    <div style={{position: 'absolute', left: 210 * s, top: 44 * s, width: 250 * s, height: 92 * s, borderRadius: '70px 40px 40px 70px', background: 'linear-gradient(180deg, rgba(226,240,248,0.16), rgba(30,42,52,0.3))'}} />
    {/* two folds in the sheet */}
    <div style={{position: 'absolute', left: 176 * s, top: 96 * s, width: 300 * s, height: 6 * s, borderRadius: 3, background: 'rgba(30,42,52,0.4)', filter: 'blur(2px)', transform: 'rotate(-1.5deg)'}} />
    <div style={{position: 'absolute', left: 250 * s, top: 150 * s, width: 210 * s, height: 5 * s, borderRadius: 3, background: 'rgba(30,42,52,0.32)', filter: 'blur(2px)'}} />

    {/* his head, back on the pillow, face up */}
    <div style={{position: 'absolute', left: 52 * s, top: 30 * s, width: 122 * s, height: 130 * s}}>
      {/* hair mass */}
      <div style={{position: 'absolute', left: 8 * s, top: 0, width: 106 * s, height: 84 * s, borderRadius: `${52 * s}px ${52 * s}px ${34 * s}px ${34 * s}px`, background: 'linear-gradient(170deg,#1A2029,#080B0F)'}} />
      {/* face */}
      <div style={{position: 'absolute', left: 16 * s, top: 34 * s, width: 92 * s, height: 88 * s, borderRadius: `${46 * s}px ${46 * s}px ${40 * s}px ${40 * s}px`, background: 'linear-gradient(162deg,#8A6E5B 0%,#5E4838 62%,#37281E 100%)', boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.3)'}} />
      {/* closed lids */}
      {awake > 0 ? (
        <>
          <div style={{position: 'absolute', left: 30 * s, top: 66 * s, width: 22 * s, height: 7 * s, borderRadius: 4, background: `rgba(232,244,250,${0.2 + awake * 0.8})`, boxShadow: `0 0 ${12 * s}px rgba(210,238,252,${0.7 * awake})`}} />
          <div style={{position: 'absolute', left: 66 * s, top: 66 * s, width: 22 * s, height: 7 * s, borderRadius: 4, background: `rgba(232,244,250,${0.2 + awake * 0.8})`, boxShadow: `0 0 ${12 * s}px rgba(210,238,252,${0.7 * awake})`}} />
        </>
      ) : (
        <>
          <div style={{position: 'absolute', left: 30 * s, top: 70 * s, width: 24 * s, height: 2.4 * s, borderRadius: 2, background: 'rgba(24,16,12,0.7)'}} />
          <div style={{position: 'absolute', left: 66 * s, top: 70 * s, width: 24 * s, height: 2.4 * s, borderRadius: 2, background: 'rgba(24,16,12,0.7)'}} />
        </>
      )}
      {/* the strip light along the pillow, behind his head */}
      <div style={{position: 'absolute', left: -14 * s, top: -10 * s, width: 150 * s, height: 6 * s, borderRadius: 3, background: `rgba(196,226,244,${0.22 + strip * 0.2})`, boxShadow: '0 0 20px rgba(180,220,242,0.35)'}} />
      {strip > 0 ? (
        <div style={{position: 'absolute', left: -10 * s, top: -24 * s, width: 140 * s, height: 8 * s, borderRadius: 4, background: `rgba(214,104,86,${0.5 * strip})`, boxShadow: `0 0 ${20 * s}px rgba(200,110,94,${0.6 * strip})`}} />
      ) : null}
    </div>

    {/* the bed's status led */}
    <div style={{position: 'absolute', right: 12 * s, bottom: 12 * s, width: 8 * s, height: 8 * s, borderRadius: '50%', background: `rgba(120,214,172,${0.3 + Math.sin(f / 30 + x) * 0.1})`}} />
  </div>
);

export const Chamber: React.FC<{
  f: number;
  alert?: number;
  awake?: number;
  strip?: number;
  children?: React.ReactNode;
}> = ({f, alert = 0, awake = 0, strip = 0, children}) => (
  <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
    <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg,#0A1219 0%,#060C12 54%,#03070B 100%)'}} />
    {/* ceiling vault */}
    <div style={{position: 'absolute', left: -100, right: -100, top: -220, height: 620, borderRadius: '0 0 50% 50%', background: 'linear-gradient(180deg,#0D161D,#070C12)'}} />
    {Array.from({length: 5}).map((_, i) => (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: 40 + i * 208,
          top: 210,
          width: 150,
          height: 14,
          borderRadius: 6,
          background: 'rgba(206,230,244,0.6)',
          boxShadow: '0 0 60px rgba(180,222,244,0.35)',
          opacity: 0.7,
        }}
      />
    ))}
    {/* back wall */}
    <div style={{position: 'absolute', left: 0, right: 0, top: 320, height: 700, background: 'linear-gradient(180deg,#0B141C,#050A10)'}} />
    {Array.from({length: 6}).map((_, i) => (
      <div key={i} style={{position: 'absolute', left: i * 190, top: 320, width: 3, height: 700, background: 'rgba(130,168,196,0.06)'}} />
    ))}
    {/* beds, receding */}
    {[0, 1, 2].map((row) =>
      [0, 1].map((col) => (
        <Sleeper
          key={`${row}-${col}`}
          f={f}
          x={-60 + col * 560 + row * 40}
          y={640 + row * 300}
          s={1 + row * 0.22}
          awake={awake > 0 && row === 2 && col === 1 ? awake : 0}
          strip={strip}
        />
      ))
    )}
    {/* floor sheen */}
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 420, background: 'linear-gradient(180deg, rgba(10,18,26,0.6), rgba(3,6,10,0.98))'}} />
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(80% 60% at 50% 46%, rgba(206,96,78,${0.16 * alert}), transparent 74%)`,
        mixBlendMode: 'screen',
      }}
    />
    <Haze x="50%" y="40%" size={900} color="rgba(120,170,200,0.12)" />
    {children}
  </div>
);

/* ------------------------------------------------------------------ */
/* the source machine                                                  */
/* ------------------------------------------------------------------ */

export const Machine: React.FC<{
  f: number;
  glow?: number;
  cables?: number;
  children?: React.ReactNode;
}> = ({f, glow = 1, cables = 1, children}) => (
  <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
    <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(178deg,#080F15 0%,#050A10 60%,#02060A 100%)'}} />
    {/* housing */}
    <div
      style={{
        position: 'absolute',
        left: 90,
        right: 90,
        top: 300,
        bottom: 180,
        borderRadius: 22,
        background: 'linear-gradient(160deg,#1B252F 0%,#101922 48%,#060B11 100%)',
        boxShadow: 'inset 0 0 0 2px rgba(150,186,212,0.14), inset 0 0 140px rgba(0,0,0,0.9)',
      }}
    >
      {/* ribs */}
      {Array.from({length: 7}).map((_, i) => (
        <div key={i} style={{position: 'absolute', left: 34 + i * 122, top: 60, bottom: 60, width: 8, background: 'rgba(150,186,212,0.05)'}} />
      ))}
      {/* the core slit */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 210,
          width: 260,
          height: 700,
          marginLeft: -130,
          borderRadius: 16,
          background: `linear-gradient(180deg, rgba(190,230,248,${0.2 + glow * 0.6}), rgba(90,150,182,${0.08 + glow * 0.3}))`,
          boxShadow: `0 0 ${120 * glow}px rgba(150,210,242,${0.5 * glow})`,
        }}
      >
        {/* the thing inside it */}
        <div style={{position: 'absolute', left: 40, top: 120, right: 40, bottom: 120, borderRadius: 8, background: 'linear-gradient(180deg,#0A1620,#050A10)', opacity: 0.8}} />
        {Array.from({length: 4}).map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 20,
              right: 20,
              top: 40 + i * 20,
              height: 3,
              background: `rgba(220,242,252,${0.2 + Math.sin(f / 26 + i) * 0.12})`,
            }}
          />
        ))}
      </div>
      {/* base grille */}
      <div style={{position: 'absolute', left: 60, right: 60, bottom: 40, height: 90, borderRadius: 8, background: 'repeating-linear-gradient(90deg, rgba(10,16,22,0.9) 0 14px, rgba(150,186,212,0.08) 14px 18px)'}} />
    </div>
    {/* cables leaving frame */}
    {Array.from({length: 9}).map((_, i) => (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: 120 + i * 96,
          top: 300,
          width: 14,
          height: 320,
          borderRadius: 7,
          background: 'linear-gradient(180deg,#1A242D,#080D13)',
          transform: `rotate(${(rnd(i + 2) - 0.5) * 10}deg)`,
          opacity: cables,
        }}
      />
    ))}
    <Haze x="50%" y="46%" size={980} color={`rgba(120,190,224,${0.16 * glow})`} />
    {children}
  </div>
);

/* ------------------------------------------------------------------ */
/* shaft                                                               */
/* ------------------------------------------------------------------ */

export const Shaft: React.FC<{f: number; lamp?: number; cables?: number}> = ({f, lamp = 1, cables = 1}) => (
  <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(78% 66% at 50% 44%, #071019 0%, #03070B 76%)'}}>
    {/* receding rectangles: looking down a shaft */}
    {Array.from({length: 7}).map((_, i) => {
      const s = 1 - i * 0.11;
      const w = 820 * s;
      const h = 1240 * s;
      return (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: w,
            height: h,
            marginLeft: -w / 2,
            marginTop: -h / 2,
            borderRadius: 10,
            background: `linear-gradient(180deg, rgba(${10 + i * 2},${18 + i * 2},${26 + i * 2},1), rgba(4,8,12,1))`,
            boxShadow: `inset 0 0 ${40 + i * 10}px rgba(0,0,0,0.9), 0 0 0 1px rgba(120,158,186,${0.1 - i * 0.012})`,
          }}
        />
      );
    })}
    {/* cables running the full height */}
    {Array.from({length: 11}).map((_, i) => (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: 60 + i * 96,
          top: -40,
          width: 7,
          height: 2000,
          borderRadius: 4,
          background: 'linear-gradient(90deg, rgba(90,110,128,0.5), rgba(16,22,30,0.9))',
          opacity: cables * (0.5 + rnd(i) * 0.5),
          transform: `rotate(${(rnd(i + 3) - 0.5) * 1.6}deg)`,
        }}
      />
    ))}
    {/* work lamp down the shaft */}
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '62%',
        width: 420,
        height: 420,
        marginLeft: -210,
        background: `radial-gradient(closest-side, rgba(232,186,116,${0.22 * lamp}), transparent 72%)`,
        filter: 'blur(30px)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '58%',
        width: 26,
        height: 26,
        marginLeft: -13,
        borderRadius: '50%',
        background: `rgba(240,206,150,${0.7 * lamp})`,
        boxShadow: `0 0 ${60 * lamp}px rgba(240,200,140,${0.7 * lamp})`,
      }}
    />
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 260, background: 'linear-gradient(180deg, transparent, rgba(2,5,8,0.9))'}} />
  </div>
);

/* ------------------------------------------------------------------ */
/* access log screen (only DR. ELIAS is spelled, per narration)         */
/* ------------------------------------------------------------------ */

export const LogScreen: React.FC<{
  f: number;
  reveal?: number;
  seal?: number;
}> = ({f, reveal = 1, seal = 0}) => (
  <div style={{position: 'absolute', inset: 0, background: '#04090E'}}>
    <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(90% 80% at 50% 40%, #08202C 0%, #040C12 62%, #02060A 100%)'}} />
    {/* rows */}
    {Array.from({length: 14}).map((_, i) => {
      const isElias = i === 9;
      const show = i / 14 < reveal;
      return (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: 54,
            right: 54,
            top: 300 + i * 72,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            opacity: show ? 1 : 0.12,
            background: isElias ? `rgba(120,200,236,${0.1 + Math.sin(f / 26) * 0.03})` : 'transparent',
            boxShadow: isElias ? 'inset 0 0 0 1px rgba(150,214,240,0.3)' : 'none',
            paddingLeft: 12,
          }}
        >
          {/* timestamp */}
          <div style={{fontFamily: MONO, fontSize: 20, letterSpacing: '0.08em', color: 'rgba(150,196,220,0.5)'}}>
            {`0${(i % 9) + 1}:${10 + i}:0${(i * 7) % 9}`}
          </div>
          {/* redacted subject */}
          <div style={{display: 'flex', gap: 6, flex: 1}}>
            {Array.from({length: 4}).map((__, k) => (
              <div key={k} style={{width: 12 + rnd(i * 7 + k) * 40, height: 8, background: 'rgba(120,164,192,0.28)'}} />
            ))}
          </div>
          {/* the signature */}
          <div
            style={{
              fontFamily: MONO,
              fontSize: isElias ? 30 : 18,
              letterSpacing: '0.16em',
              color: isElias ? 'rgba(226,244,252,0.95)' : 'rgba(150,196,220,0.42)',
              textShadow: isElias ? '0 0 26px rgba(140,206,238,0.6)' : 'none',
            }}
          >
            {isElias ? 'DR. ELIAS' : ''}
          </div>
        </div>
      );
    })}
    {/* second authorisation: a seal, no words */}
    {seal > 0 ? (
      <div
        style={{
          position: 'absolute',
          right: 90,
          bottom: 300,
          width: 260,
          height: 260,
          borderRadius: '50%',
          border: '5px solid rgba(214,180,110,0.55)',
          opacity: seal,
          boxShadow: '0 0 50px rgba(214,180,110,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{position: 'absolute', inset: 18, borderRadius: '50%', border: '2px solid rgba(214,180,110,0.4)'}} />
        {Array.from({length: 12}).map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: '50%',
              top: 14,
              width: 3,
              height: 26,
              marginLeft: -1.5,
              background: 'rgba(214,180,110,0.5)',
              transformOrigin: '50% 116px',
              transform: `rotate(${i * 30}deg)`,
            }}
          />
        ))}
        <div style={{width: 62, height: 62, background: 'rgba(214,180,110,0.5)', clipPath: 'polygon(50% 0, 61% 35%, 98% 35%, 68% 57%, 79% 92%, 50% 70%, 21% 92%, 32% 57%, 2% 35%, 39% 35%)'}} />
      </div>
    ) : null}
    <div style={{position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.32) 0 1px, transparent 1px 4px)', opacity: 0.4}} />
  </div>
);

/* ------------------------------------------------------------------ */
/* network map wall                                                    */
/* ------------------------------------------------------------------ */

export const MapWall: React.FC<{
  f: number;
  reveal?: number;
  spread?: number;
  tint?: string;
  rings?: number;
}> = ({f, reveal = 1, spread = 1, tint = 'rgba(150,214,240,0.9)', rings = 0}) => {
  const nodes = Array.from({length: 46}).map((_, i) => ({
    x: 90 + rnd(i * 3 + 1) * 900,
    y: 300 + rnd(i * 7 + 4) * 1200,
    s: 0.7 + rnd(i + 9) * 0.6,
  }));
  return (
    <div style={{position: 'absolute', inset: 0, background: '#04090E'}}>
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(86% 74% at 50% 48%, #07161F 0%, #040C12 60%, #02060A 100%)'}} />
      {/* faint grid */}
      {Array.from({length: 12}).map((_, i) => (
        <div key={`h${i}`} style={{position: 'absolute', left: 0, right: 0, top: 160 + i * 140, height: 1, background: 'rgba(120,164,192,0.07)'}} />
      ))}
      {Array.from({length: 8}).map((_, i) => (
        <div key={`v${i}`} style={{position: 'absolute', top: 0, bottom: 0, left: 80 + i * 130, width: 1, background: 'rgba(120,164,192,0.07)'}} />
      ))}
      {/* the shape of the world: coastlines, drawn thin */}
      <svg viewBox="0 0 1080 1920" width="100%" height="100%" style={{position: 'absolute', inset: 0}}>
        <g fill="rgba(22,54,74,0.34)" stroke="rgba(130,186,216,0.22)" strokeWidth={1.4}>
          <path d="M 60 520 C 150 470 250 500 300 560 C 350 620 320 700 360 760 C 400 820 470 840 460 920 C 450 1000 370 1020 320 1080 C 270 1140 240 1220 160 1240 C 90 1258 40 1200 60 1120 C 78 1046 40 980 60 900 C 82 812 20 700 40 620 C 52 570 30 546 60 520 Z" />
          <path d="M 380 1120 C 450 1100 520 1140 540 1200 C 560 1262 520 1320 560 1380 C 600 1440 660 1460 640 1520 C 620 1580 540 1580 500 1540 C 460 1500 440 1440 420 1380 C 396 1308 340 1200 380 1120 Z" />
          <path d="M 620 360 C 720 320 830 360 860 440 C 890 520 840 580 880 650 C 920 720 1000 740 980 820 C 960 900 880 900 840 850 C 800 800 780 720 740 660 C 700 600 620 560 600 500 C 584 448 570 380 620 360 Z" />
          <path d="M 660 1060 C 740 1040 820 1080 830 1160 C 840 1240 780 1300 790 1380 C 800 1460 740 1500 690 1460 C 640 1420 630 1340 640 1260 C 648 1196 600 1090 660 1060 Z" />
          <path d="M 760 1520 C 840 1500 920 1540 930 1600 C 940 1660 880 1700 820 1690 C 760 1680 720 1610 760 1520 Z" />
        </g>
        {/* graticule inside the landmass, very faint */}
        <g stroke="rgba(150,214,240,0.08)" strokeWidth={1}>
          {Array.from({length: 10}).map((_, i) => (
            <line key={i} x1={40} y1={520 + i * 120} x2={1040} y2={470 + i * 120} />
          ))}
        </g>
      </svg>
      {/* link lines */}
      <svg viewBox="0 0 1080 1920" width="100%" height="100%" style={{position: 'absolute', inset: 0, opacity: 0.85}}>
        {nodes.map((n, i) => {
          if (i % 3) return null;
          const m = nodes[(i + 7) % nodes.length];
          const on = i / nodes.length < spread;
          return (
            <line
              key={i}
              x1={n.x}
              y1={n.y}
              x2={m.x}
              y2={m.y}
              stroke={on ? 'rgba(140,196,224,0.3)' : 'rgba(140,196,224,0.06)'}
              strokeWidth={1.4}
            />
          );
        })}
      </svg>
      {/* nodes */}
      {nodes.map((n, i) => {
        const on = i / nodes.length < spread;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: n.x,
              top: n.y,
              width: 10 * n.s,
              height: 10 * n.s,
              borderRadius: '50%',
              background: on ? tint : 'rgba(120,164,192,0.22)',
              boxShadow: on ? `0 0 ${26 * n.s}px ${tint}` : 'none',
              opacity: on ? 0.7 + Math.sin(f / 24 + i) * 0.24 : 0.4,
            }}
          />
        );
      })}
      {/* the ring around the origin */}
      {rings > 0 ? (
        <>
          {[0, 1, 2].map((i) => {
            const p = ((f * 1.1 + i * 26) % 70) / 70;
            const r = 40 + p * 460;
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: 540 - r,
                  top: 900 - r,
                  width: r * 2,
                  height: r * 2,
                  borderRadius: '50%',
                  border: `1.5px solid rgba(150,214,240,${(1 - p) * 0.36 * rings})`,
                }}
              />
            );
          })}
          <div style={{position: 'absolute', left: 528, top: 888, width: 24, height: 24, borderRadius: '50%', background: tint, boxShadow: `0 0 40px ${tint}`, opacity: rings}} />
        </>
      ) : null}
      {/* scan sweep */}
      <div style={{position: 'absolute', left: 0, right: 0, top: `${((f * 1.4) % 100)}%`, height: 80, background: 'linear-gradient(180deg, transparent, rgba(150,214,240,0.08), transparent)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 300, background: 'linear-gradient(180deg, transparent, rgba(2,5,8,0.9))'}} />
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* console                                                             */
/* ------------------------------------------------------------------ */

export const Console: React.FC<{
  f: number;
  hand?: number;
  open?: number;
  children?: React.ReactNode;
}> = ({f, hand = 0, open = 1, children}) => (
  <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
    <div style={{position: 'absolute', left: 0, right: 0, top: 1080, bottom: 0, background: 'linear-gradient(180deg,#18222B 0%,#0B1219 44%,#05090E 100%)'}} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 1080, height: 6, background: 'linear-gradient(180deg, rgba(170,206,228,0.28), transparent)'}} />
    {/* the big old switch bank */}
    <div
      style={{
        position: 'absolute',
        left: 120,
        right: 120,
        top: 1180,
        height: 300,
        borderRadius: 14,
        background: 'linear-gradient(170deg,#1E2A34,#0A1017)',
        boxShadow: 'inset 0 0 0 2px rgba(150,186,212,0.12)',
      }}
    >
      {Array.from({length: 6}).map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: 30 + i * 130,
            top: 60,
            width: 74,
            height: 120,
            borderRadius: 8,
            background: 'linear-gradient(180deg,#2A3742,#101820)',
            boxShadow: 'inset 0 0 0 1px rgba(150,186,212,0.14)',
          }}
        >
          <div style={{position: 'absolute', left: 12, top: 12, right: 12, height: 10, borderRadius: 5, background: `rgba(120,214,172,${0.3 + Math.sin(f / 30 + i) * 0.15 * open})`, boxShadow: `0 0 16px rgba(120,214,172,${0.3 * open})`}} />
        </div>
      ))}
    </div>
    {/* her hand, wrist-first, entering from the lower right (no floating hand) */}
    <div style={{position: 'absolute', left: 560, top: 1060 + hand * 90, width: 700, height: 320, transform: `rotate(${-14 + hand * 6}deg)`, transformOrigin: '0% 60%'}}>
      <div
        style={{
          position: 'absolute',
          left: 190,
          top: 96,
          width: 560,
          height: 190,
          borderRadius: 100,
          background: 'linear-gradient(180deg,#3A4650 0%,#222C35 54%,#0D131A 100%)',
          boxShadow: '0 -12px 40px rgba(0,0,0,0.8), inset 0 2px 0 rgba(190,216,232,0.16)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 40,
          top: 84,
          width: 220,
          height: 214,
          borderRadius: '80px 70px 50px 50px',
          background: 'linear-gradient(160deg,#6E5744 0%,#4A382B 56%,#281E17 100%)',
        }}
      />
      {/* one finger extended to the console */}
      <div style={{position: 'absolute', left: 24, top: 40, width: 130, height: 46, borderRadius: 24, background: 'linear-gradient(160deg,#6E5744,#3C2C21)'}} />
    </div>
    {children}
  </div>
);

/* ------------------------------------------------------------------ */
/* door / iris lines                                                   */
/* ------------------------------------------------------------------ */

export const NeonSign: React.FC<{text: string; x: number; y: number; size?: number; on?: number; color?: string}> = ({
  text,
  x,
  y,
  size = 40,
  on = 1,
  color = 'rgba(206,236,250,0.9)',
}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      fontFamily: SANS,
      fontSize: size,
      letterSpacing: '0.24em',
      color,
      opacity: on,
      textShadow: `0 0 ${size * 0.8}px ${color}`,
    }}
  >
    {text}
  </div>
);
