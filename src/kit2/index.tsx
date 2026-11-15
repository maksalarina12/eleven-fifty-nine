import React from 'react';
import {AbsoluteFill} from 'remotion';
import {clamp01, smooth, rnd, MONO, SANS} from '../kit';
import {Grain, Vignette} from '../Episode';

/* ------------------------------------------------------------------ */
/* SEASON 02 KIT — PROJECT EDEN                                        */
/* Shared places. Everything here is 100% vector/gradient, no footage.  */
/* IDs are prefixed k2 so they never collide with the S01 kit.          */
/* ------------------------------------------------------------------ */

const INK = '#02050A';

/* ------------------------------------------------------------------ */
/* exposure.  every scene is lit for a dark room, but a dark room that   */
/* cannot be read is not lit at all: each episode sets one lift so the   */
/* mids carry the picture and the black point stays black.               */
/* ------------------------------------------------------------------ */

export const Grade: React.FC<{
  lift?: number;
  contrast?: number;
  saturate?: number;
  children: React.ReactNode;
}> = ({lift = 1, contrast = 1, saturate = 1, children}) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      filter: `brightness(${lift}) contrast(${contrast}) saturate(${saturate})`,
    }}
  >
    {children}
  </div>
);

/* ------------------------------------------------------------------ */
/* atmosphere                                                          */
/* ------------------------------------------------------------------ */

export const Night: React.FC<{
  f: number;
  children: React.ReactNode;
  glow?: string;
  grain?: number;
  vignette?: number;
}> = ({f, children, glow, grain = 0.075, vignette = 0.86}) => (
  <>
    <AbsoluteFill style={{background: INK}} />
    {glow ? (
      <AbsoluteFill
        style={{
          background: glow,
          opacity: 0.92 + Math.sin(f / 43) * 0.04,
        }}
      />
    ) : null}
    {children}
    <Vignette strength={vignette} />
    <Grain f={f} opacity={grain} />
  </>
);

export const Rain: React.FC<{f: number; density?: number; opacity?: number; slant?: number}> = ({
  f,
  density = 44,
  opacity = 0.3,
  slant = 14,
}) => (
  <div style={{position: 'absolute', inset: 0, overflow: 'hidden', opacity, pointerEvents: 'none'}}>
    {Array.from({length: density}).map((_, i) => {
      const speed = 12 + rnd(i) * 16;
      const x = (rnd(i + 90) * 1180 + f * 1.2) % 1180;
      const y = ((f * speed + rnd(i + 38) * 2100) % 2200) - 140;
      const len = 44 + rnd(i + 7) * 74;
      return (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: x,
            top: y,
            width: 1.6,
            height: len,
            transform: `rotate(${slant}deg)`,
            background:
              'linear-gradient(180deg, rgba(200,226,244,0) 0%, rgba(200,226,244,0.5) 40%, rgba(200,226,244,0) 100%)',
          }}
        />
      );
    })}
  </div>
);

export const Haze: React.FC<{x?: string; y?: string; size?: number; color?: string; opacity?: number}> = ({
  x = '50%',
  y = '60%',
  size = 620,
  color = 'rgba(96,150,188,0.22)',
  opacity = 1,
}) => (
  <div
    style={{
      position: 'absolute',
      left: `calc(${x} - ${size / 2}px)`,
      top: `calc(${y} - ${size / 2}px)`,
      width: size,
      height: size,
      borderRadius: '50%',
      background: `radial-gradient(closest-side, ${color}, transparent 76%)`,
      filter: 'blur(26px)',
      mixBlendMode: 'screen',
      opacity,
      pointerEvents: 'none',
    }}
  />
);

/* ------------------------------------------------------------------ */
/* city                                                                */
/* ------------------------------------------------------------------ */

export const Skyline: React.FC<{f: number; dim?: number; near?: number}> = ({f, dim = 1, near = 1}) => (
  <div style={{position: 'absolute', inset: 0, opacity: dim}}>
    {/* far band, low contrast */}
    {Array.from({length: 22}).map((_, i) => {
      const w = 70 + rnd(i + 3) * 90;
      const h = 140 + rnd(i + 11) * 300;
      return (
        <div
          key={`f${i}`}
          style={{
            position: 'absolute',
            left: -60 + i * 56 + rnd(i + 21) * 22,
            bottom: 500,
            width: w,
            height: h,
            background: 'linear-gradient(180deg, #08111B 0%, #050B12 100%)',
            opacity: 0.8,
          }}
        />
      );
    })}

    {/* near blocks with facades */}
    {Array.from({length: 11}).map((_, i) => {
      const w = 128 + rnd(i + 5) * 110;
      const h = 300 + rnd(i + 17) * 560;
      const x = -50 + i * 108 + rnd(i + 31) * 26;
      const cols = Math.max(3, Math.floor(w / 26));
      const rows = Math.max(3, Math.floor(h / 38));
      return (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: x,
            bottom: 470,
            width: w,
            height: h,
            background:
              i % 2 === 0
                ? 'linear-gradient(178deg, #0C1824 0%, #070E17 62%, #050A11 100%)'
                : 'linear-gradient(178deg, #0A151F 0%, #060C14 66%, #04080E 100%)',
            boxShadow: 'inset 1px 0 0 rgba(132,178,206,0.05), inset -1px 0 0 rgba(0,0,0,0.6)',
          }}
        >
          {/* windows */}
          {Array.from({length: rows}).map((__, r) =>
            Array.from({length: cols}).map((___, c) => {
              const seed = i * 97 + r * 13 + c * 7;
              const lit = rnd(seed) > 0.7;
              const warm = rnd(seed + 3) > 0.5;
              return (
                <div
                  key={`${r}-${c}`}
                  style={{
                    position: 'absolute',
                    left: 8 + c * (w / cols),
                    top: 14 + r * 36,
                    width: Math.max(7, w / cols - 12),
                    height: 18,
                    background: lit
                      ? warm
                        ? 'rgba(232,182,108,0.62)'
                        : 'rgba(150,204,232,0.5)'
                      : 'rgba(70,104,132,0.12)',
                    boxShadow: lit ? '0 0 16px rgba(226,180,110,0.22)' : 'none',
                    opacity: lit ? 0.55 + Math.sin(f / 83 + seed) * 0.16 : 1,
                  }}
                />
              );
            })
          )}
          {/* roof kit */}
          <div style={{position: 'absolute', left: w * 0.16, top: -18, width: 34, height: 20, background: '#0A121A'}} />
          <div style={{position: 'absolute', left: w * 0.6, top: -12, width: 4, height: 46, background: 'rgba(126,166,194,0.22)'}} />
          {i % 3 === 0 ? (
            <div style={{position: 'absolute', left: w * 0.72, top: -26, width: 26, height: 28, borderRadius: '50% 50% 0 0', background: '#0B141C'}} />
          ) : null}
        </div>
      );
    })}

    {/* foreground roof edge / parapet so the camera has a body */}
    {near > 0 ? (
      <div style={{position: 'absolute', left: -40, right: -40, bottom: 430, height: 90, opacity: near}}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, #0B141D 0%, #05090F 60%)',
            boxShadow: 'inset 0 1px 0 rgba(140,182,208,0.12), 0 -30px 60px rgba(0,0,0,0.7)',
          }}
        />
        {Array.from({length: 7}).map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${8 + i * 15}%`,
              top: -26,
              width: 28,
              height: 26,
              borderRadius: '46% 46% 0 0',
              background: '#080F16',
            }}
          />
        ))}
      </div>
    ) : null}
  </div>
);

export const Street: React.FC<{f: number; wet?: number; lamps?: number}> = ({f, wet = 1, lamps = 1}) => (
  <div style={{position: 'absolute', inset: 0}}>
    {/* asphalt */}
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 640,
        background: 'linear-gradient(180deg, #0B1219 0%, #080E14 30%, #04070B 100%)',
      }}
    />
    {/* curb + sidewalk */}
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 470, height: 30, background: 'linear-gradient(180deg,#16202A,#0A1017)'}} />
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 500, height: 6, background: 'rgba(130,172,200,0.1)'}} />

    {/* lane paint, foreshortened */}
    {[0, 1, 2, 3].map((i) => (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: 90 + i * 250,
          bottom: 120,
          width: 120,
          height: 12,
          background: 'rgba(186,206,220,0.16)',
          transform: 'perspective(300px) rotateX(56deg)',
        }}
      />
    ))}
    {/* puddles catching the sky */}
    {Array.from({length: 6}).map((_, i) => (
      <div
        key={`p${i}`}
        style={{
          position: 'absolute',
          left: 40 + rnd(i + 2) * 820,
          bottom: 60 + rnd(i + 9) * 260,
          width: 90 + rnd(i + 4) * 170,
          height: 8 + rnd(i + 6) * 12,
          borderRadius: '50%',
          background: `linear-gradient(180deg, rgba(150,196,224,${0.18 * wet}), rgba(60,96,124,0.04))`,
          filter: 'blur(2px)',
          opacity: 0.5 + Math.sin(f / 57 + i) * 0.12,
        }}
      />
    ))}

    {/* street lamps: pole, head, pool */}
    {Array.from({length: 2}).map((_, i) => {
      const x = i === 0 ? 148 : 902;
      return (
        <div key={`l${i}`} style={{position: 'absolute', left: x, bottom: 470, width: 12, height: 640}}>
          <div style={{position: 'absolute', left: 0, bottom: 0, width: 12, height: 600, background: 'linear-gradient(180deg,#131C25,#070C12)'}} />
          <div
            style={{
              position: 'absolute',
              left: -34,
              top: -6,
              width: 80,
              height: 18,
              borderRadius: 4,
              background: 'linear-gradient(180deg,#1B2530,#0A1119)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: -26,
              top: 6,
              width: 64,
              height: 10,
              borderRadius: 4,
              background: 'rgba(236,196,132,0.9)',
              boxShadow: '0 0 34px rgba(232,180,110,0.8)',
              opacity: lamps,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: -260,
              top: 0,
              width: 540,
              height: 540,
              background: `radial-gradient(closest-side, rgba(232,180,110,${0.16 * lamps}), transparent 72%)`,
              filter: 'blur(18px)',
              mixBlendMode: 'screen',
            }}
          />
        </div>
      );
    })}

    {/* wet band + amber reflection smears */}
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 500,
        opacity: 0.55 * wet,
        background:
          'linear-gradient(180deg, rgba(150,196,224,0.12) 0%, rgba(90,134,168,0.04) 30%, rgba(4,7,11,0) 80%)',
      }}
    />
    {Array.from({length: 12}).map((_, i) => (
      <div
        key={`s${i}`}
        style={{
          position: 'absolute',
          left: 20 + i * 92,
          bottom: 0,
          width: 26 + rnd(i) * 46,
          height: 180 + rnd(i + 4) * 280,
          background: 'linear-gradient(180deg, rgba(226,170,74,0.14), rgba(226,170,74,0.02) 58%, transparent)',
          filter: 'blur(7px)',
          opacity: 0.35 + Math.sin(f / 47 + i) * 0.12,
        }}
      />
    ))}
  </div>
);

export const RelayTower: React.FC<{
  f: number;
  alive?: number;
  distance?: number;
  children?: React.ReactNode;
}> = ({f, alive = 0, distance = 1, children}) => {
  const blink = alive * (Math.sin(f / 9) > 0.55 ? 1 : 0.16);
  const H = 1080 * distance;
  const segs = 8;
  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        bottom: 330,
        width: 360 * distance,
        height: H,
        marginLeft: -180 * distance,
      }}
    >
      {/* hill */}
      <div
        style={{
          position: 'absolute',
          left: -420,
          right: -420,
          bottom: -160,
          height: 330 * distance,
          borderRadius: '50% 50% 0 0 / 100% 100% 0 0',
          background: 'linear-gradient(180deg, #0C161F 0%, #060B11 66%, #04070B 100%)',
        }}
      />
      {/* fence */}
      <div style={{position: 'absolute', left: -190 * distance, right: -190 * distance, bottom: 70 * distance, height: 60 * distance, opacity: 0.7}}>
        {Array.from({length: 12}).map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${i * 9}%`,
              top: 0,
              width: 2,
              height: 60 * distance,
              background: 'rgba(120,158,186,0.16)',
            }}
          />
        ))}
        <div style={{position: 'absolute', left: 0, right: 0, top: 6, height: 2, background: 'rgba(120,158,186,0.14)'}} />
        <div style={{position: 'absolute', left: 0, right: 0, top: 40 * distance, height: 2, background: 'rgba(120,158,186,0.12)'}} />
      </div>

      {/* concrete shaft */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          bottom: 80 * distance,
          width: 118 * distance,
          marginLeft: -59 * distance,
          height: 660 * distance,
          background:
            'linear-gradient(90deg, rgba(70,92,110,0.5) 0%, #16222C 20%, #0B1319 58%, #04080D 100%)',
          clipPath: 'polygon(6% 0, 94% 0, 100% 100%, 0% 100%)',
          boxShadow: 'inset 0 0 60px rgba(0,0,0,0.7)',
        }}
      >
        {Array.from({length: segs}).map((_, i) => (
          <React.Fragment key={i}>
            <div style={{position: 'absolute', left: 0, right: 0, top: `${(i + 1) * 11}%`, height: 2, background: 'rgba(120,160,190,0.1)'}} />
            <div
              style={{
                position: 'absolute',
                left: `${16 + (i % 2) * 34}%`,
                top: `${8 + i * 11}%`,
                width: (18 + (i % 3) * 6) * distance,
                height: 14 * distance,
                background: `rgba(150,204,232,${alive * (0.14 + Math.max(0, Math.sin(f / 23 + i)) * 0.44)})`,
                boxShadow: alive > 0.1 ? `0 0 ${16 * distance}px rgba(150,204,232,${0.1 * alive})` : 'none',
              }}
            />
          </React.Fragment>
        ))}
        {/* service door with practical light */}
        <div style={{position: 'absolute', left: '46%', bottom: '4%', width: 26 * distance, height: 52 * distance, background: 'rgba(226,170,74,0.14)', boxShadow: '0 0 24px rgba(226,170,74,0.16)'}} />
      </div>

      {/* maintenance ladder */}
      <div style={{position: 'absolute', left: '50%', bottom: 84 * distance, width: 16 * distance, marginLeft: 24 * distance, height: 620 * distance}}>
        <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 2, background: 'rgba(132,172,200,0.26)'}} />
        <div style={{position: 'absolute', right: 0, top: 0, bottom: 0, width: 2, background: 'rgba(132,172,200,0.26)'}} />
        {Array.from({length: 16}).map((_, i) => (
          <div key={i} style={{position: 'absolute', left: 0, right: 0, top: `${i * 6.2}%`, height: 2, background: 'rgba(132,172,200,0.18)'}} />
        ))}
      </div>

      {/* lattice top */}
      <svg
        viewBox="0 0 200 300"
        width={150 * distance}
        height={300 * distance}
        style={{position: 'absolute', left: '50%', bottom: 726 * distance, marginLeft: -75 * distance}}
      >
        <g stroke="rgba(126,166,194,0.34)" strokeWidth={2.2} fill="none">
          <line x1={44} y1={300} x2={80} y2={4} />
          <line x1={156} y1={300} x2={120} y2={4} />
          {Array.from({length: 6}).map((_, i) => {
            const y1 = 300 - i * 48;
            const y2 = y1 - 48;
            const l1 = 44 + (36 / 296) * (300 - y1);
            const r1 = 156 - (36 / 296) * (300 - y1);
            const l2 = 44 + (36 / 296) * (300 - y2);
            const r2 = 156 - (36 / 296) * (300 - y2);
            return (
              <React.Fragment key={i}>
                <line x1={l1} y1={y1} x2={r1} y2={y1} />
                <line x1={l1} y1={y1} x2={r2} y2={y2} opacity={0.6} />
                <line x1={r1} y1={y1} x2={l2} y2={y2} opacity={0.6} />
              </React.Fragment>
            );
          })}
          <line x1={60} y1={192} x2={140} y2={192} strokeWidth={3} />
          <line x1={68} y1={120} x2={132} y2={120} strokeWidth={3} />
        </g>
        {/* dish */}
        <ellipse cx={132} cy={188} rx={30} ry={22} fill="none" stroke="rgba(140,180,208,0.4)" strokeWidth={2.4} transform="rotate(-24 132 188)" />
        {/* antenna */}
        <line x1={100} y1={4} x2={100} y2={-56} stroke="rgba(150,190,216,0.5)" strokeWidth={3} />
      </svg>

      {/* beacon + halo */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          bottom: 1000 * distance,
          width: 26 * distance,
          height: 26 * distance,
          marginLeft: -13 * distance,
          borderRadius: '50%',
          background: `rgba(226,96,72,${0.06 + blink * 0.86})`,
          boxShadow: `0 0 ${44 * distance}px rgba(226,96,72,${0.1 + blink * 0.6})`,
        }}
      />
      {alive > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            bottom: 986 * distance,
            width: 260 * distance,
            height: 260 * distance,
            marginLeft: -130 * distance,
            borderRadius: '50%',
            background: `radial-gradient(closest-side, rgba(226,96,72,${0.16 * blink}), transparent 72%)`,
            filter: 'blur(16px)',
            mixBlendMode: 'screen',
          }}
        />
      ) : null}
      {children}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* apartment                                                           */
/* ------------------------------------------------------------------ */

export const ApartmentWindow: React.FC<{
  f: number;
  phone?: number;
  light?: number;
  children?: React.ReactNode;
}> = ({f, phone = 0, light = 1, children}) => (
  <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
    {/* the glass fills the frame: we are standing at it */}
    <div style={{position: 'absolute', inset: -30, background: 'linear-gradient(180deg,#0C1E30 0%,#0A1626 46%,#050C14 100%)'}}>
      <div
        style={{
          position: 'absolute',
          inset: -80,
          transform: 'scale(1.18)',
          filter: 'blur(7px) brightness(1.15) saturate(1.1)',
        }}
      >
        <CityThumb f={f} />
      </div>
    </div>
    {/* city glow coming through the glass */}
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background:
          'linear-gradient(180deg, rgba(46,92,130,0.55) 0%, rgba(28,62,92,0.22) 44%, rgba(8,18,28,0.62) 100%)',
      }}
    />
    {/* the street's lamp pool, below */}
    <div
      style={{
        position: 'absolute',
        left: 160,
        bottom: 120,
        width: 760,
        height: 620,
        background: 'radial-gradient(closest-side, rgba(226,170,74,0.2), transparent 74%)',
        filter: 'blur(40px)',
      }}
    />
    {/* rain on the glass, in front of the city */}
    <Rain f={f} density={40} opacity={0.34} slant={8} />
    {/* one mullion, kept off the subject */}
    <div style={{position: 'absolute', left: 292, top: 0, bottom: 0, width: 13, background: 'linear-gradient(90deg, rgba(8,14,20,0.85), rgba(60,82,98,0.5), rgba(6,10,15,0.9))'}} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 604, height: 11, background: 'linear-gradient(180deg, rgba(70,92,108,0.45), rgba(6,10,15,0.9))'}} />
    {/* glass sheen + interior reflection in the lower third */}
    <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(122deg, rgba(190,220,238,0.1) 0%, transparent 46%, rgba(190,220,238,0.06) 100%)'}} />
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 620, background: 'linear-gradient(180deg, transparent, rgba(4,9,14,0.82))'}} />
    <Haze x="18%" y="24%" size={620} color={`rgba(110,174,206,${0.16 + 0.2 * phone})`} />
    {children}
  </div>
);

const CityThumb: React.FC<{f: number}> = ({f}) => (
  <>
    {Array.from({length: 9}).map((_, i) => (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: -30 + i * 118,
          bottom: 0,
          width: 90 + rnd(i) * 50,
          height: 300 + rnd(i + 5) * 420,
          background: 'linear-gradient(180deg,#0A1725,#061019)',
        }}
      >
        {Array.from({length: 6}).map((__, j) => (
          <div
            key={j}
            style={{
              position: 'absolute',
              left: 12 + (j % 2) * 26,
              top: 30 + j * 62,
              width: 12,
              height: 16,
              background:
                rnd(i * 9 + j) > 0.6
                  ? `rgba(232,180,104,${0.3 + Math.sin(f / 70 + i + j) * 0.1})`
                  : 'rgba(96,138,170,0.12)',
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
        bottom: 0,
        height: 260,
        background: 'linear-gradient(180deg, transparent, rgba(3,6,10,0.8))',
      }}
    />
  </>
);

/* ------------------------------------------------------------------ */
/* signal desk                                                         */
/* ------------------------------------------------------------------ */

export const SignalDesk: React.FC<{
  f: number;
  open?: number;
  children?: React.ReactNode;
}> = ({f, open = 1, children}) => (
  <div style={{position: 'absolute', inset: 0}}>
    <AbsoluteFill style={{background: 'linear-gradient(178deg,#080D14 0%,#05090F 62%,#03060A 100%)'}} />
    <Haze x="50%" y="52%" size={760} color={`rgba(106,168,202,${0.2 * open})`} />
    {/* desk slab */}
    <div
      style={{
        position: 'absolute',
        left: 40,
        right: 40,
        bottom: 300,
        height: 30,
        background: 'linear-gradient(180deg,#1B252F,#0B1119)',
        boxShadow: '0 24px 60px rgba(0,0,0,0.8)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        left: 40,
        right: 40,
        bottom: 0,
        height: 300,
        background: 'linear-gradient(180deg, rgba(10,16,23,0.9), rgba(4,7,11,0.98))',
      }}
    />
    {/* laptop */}
    <div
      style={{
        position: 'absolute',
        left: 226,
        bottom: 330,
        width: 620,
        height: 400,
        borderRadius: 12,
        background: 'linear-gradient(160deg,#1A232D,#080D13)',
        boxShadow: '0 20px 50px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(140,180,208,0.12)',
      }}
    >
      <div style={{position: 'absolute', inset: 14, background: '#04070B', overflow: 'hidden', borderRadius: 6}}>
        {children}
      </div>
    </div>
    {/* laptop base */}
    <div
      style={{
        position: 'absolute',
        left: 150,
        bottom: 296,
        width: 772,
        height: 46,
        borderRadius: 8,
        background: 'linear-gradient(180deg,#202B36,#0C1218)',
        transform: 'perspective(600px) rotateX(58deg)',
      }}
    />
    {/* cables */}
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: 120 + i * 330,
          bottom: 250 - i * 12,
          width: 280,
          height: 2,
          background: 'linear-gradient(90deg, rgba(140,174,200,0.16), transparent)',
          transform: `rotate(${-6 + i * 7}deg)`,
        }}
      />
    ))}
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 240,
        background: 'radial-gradient(60% 100% at 50% 0%, rgba(110,172,206,0.12), transparent 70%)',
        opacity: open,
      }}
    />
  </div>
);

/* ------------------------------------------------------------------ */
/* white room where Noah is held                                       */
/* ------------------------------------------------------------------ */

export const WhiteRoom: React.FC<{
  f: number;
  dim?: number;
  door?: number;
  figure?: React.ReactNode;
  children?: React.ReactNode;
}> = ({f, dim = 1, door = 0, figure, children}) => {
  const pulse = 0.94 + Math.sin(f / 37) * 0.02;
  return (
    <div style={{position: 'absolute', inset: 0, background: '#DDE6EA', overflow: 'hidden'}}>
      {/* back wall + floor */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: '68%',
          background: `linear-gradient(180deg, rgba(238,245,248,${pulse}) 0%, rgba(214,226,232,${pulse}) 100%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: '32%',
          background: 'linear-gradient(180deg, #C9D6DD 0%, #AEBEC8 100%)',
        }}
      />
      {/* panel seams */}
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${i * 25}%`,
            top: 0,
            width: 3,
            height: '68%',
            background: 'rgba(112,136,152,0.28)',
            boxShadow: '1px 0 0 rgba(255,255,255,0.5)',
          }}
        />
      ))}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: '67.6%',
          height: 3,
          background: 'rgba(120,144,160,0.3)',
        }}
      />
      {/* a ceiling seam, high enough never to cross a face */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: '9%',
          height: 8,
          background: 'linear-gradient(180deg, rgba(255,255,255,0.55), rgba(168,186,198,0.28))',
        }}
      />
      {/* ceiling light pool */}
      <div
        style={{
          position: 'absolute',
          left: '18%',
          top: '-10%',
          width: '64%',
          height: '70%',
          background: 'radial-gradient(closest-side, rgba(255,255,255,0.85), transparent 78%)',
          filter: 'blur(18px)',
        }}
      />
      {/* door: frame, dark interior, light spill */}
      {door > 0 ? (
        <>
          <div
            style={{
              position: 'absolute',
              left: '40.6%',
              top: '28%',
              width: '16.8%',
              height: '42%',
              border: '6px solid rgba(96,116,130,0.5)',
              background: `linear-gradient(180deg, rgba(26,34,42,${0.85 * door}), rgba(14,20,26,${0.95 * door}))`,
              opacity: door,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: '48.4%',
              top: '28%',
              width: '0.6%',
              height: '42%',
              background: 'rgba(214,232,240,0.5)',
              opacity: door * 0.8,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: '34%',
              top: '70%',
              width: '32%',
              height: '12%',
              background: `linear-gradient(180deg, rgba(226,232,236,${0.16 * door}), transparent)`,
              filter: 'blur(10px)',
            }}
          />
        </>
      ) : null}
      {figure}
      {/* the room is seen through a lens, so it is never clean white */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(66% 58% at 50% 44%, transparent 40%, rgba(10,18,24,${0.5 * dim}) 100%)`,
        }}
      />
      {children}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* screens                                                             */
/* ------------------------------------------------------------------ */

export const Waveform: React.FC<{f: number; beat?: number; color?: string}> = ({
  f,
  beat = 1,
  color = 'rgba(168,216,238,0.9)',
}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top: '46%', height: 120}}>
    {Array.from({length: 46}).map((_, i) => {
      const base = Math.sin(i * 0.7 + f / 5) * 0.5 + Math.sin(i * 0.27 - f / 11) * 0.5;
      const h = 6 + Math.abs(base) * 52 * beat;
      return (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: 8 + i * 11.2,
            top: 60 - h / 2,
            width: 3,
            height: h,
            borderRadius: 2,
            background: color,
            opacity: 0.5 + Math.abs(base) * 0.5,
          }}
        />
      );
    })}
  </div>
);

export const Readout: React.FC<{
  label: string;
  value: string;
  x: number;
  y: number;
  show?: number;
  size?: number;
  color?: string;
}> = ({label, value, x, y, show = 1, size = 22, color = 'rgba(186,222,242,0.8)'}) => (
  <div style={{position: 'absolute', left: x, top: y, opacity: show, color, fontFamily: MONO}}>
    <div style={{fontSize: size * 0.62, letterSpacing: '0.28em', opacity: 0.6}}>{label}</div>
    <div style={{fontSize: size, letterSpacing: '0.14em', marginTop: 4}}>{value}</div>
  </div>
);

export const GlitchBars: React.FC<{f: number; amount?: number; seed?: number}> = ({
  f,
  amount = 1,
  seed = 0,
}) => (
  <div style={{position: 'absolute', inset: 0, pointerEvents: 'none', opacity: amount}}>
    {Array.from({length: 7}).map((_, i) => {
      const y = ((f * (11 + i * 7) + rnd(i + seed) * 900) % 1000) + rnd(i + 4) * 400;
      return (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${rnd(i + 13) * 20 - 6}%`,
            top: y,
            width: `${60 + rnd(i + 2) * 60}%`,
            height: 2 + rnd(i + 9) * 8,
            background:
              i % 3 === 0 ? 'rgba(196,226,244,0.5)' : 'rgba(140,190,220,0.22)',
            mixBlendMode: 'screen',
          }}
        />
      );
    })}
  </div>
);

/* ------------------------------------------------------------------ */
/* underground map                                                     */
/* ------------------------------------------------------------------ */

export const TunnelMap: React.FC<{f: number; reveal?: number; tint?: string}> = ({
  f,
  reveal = 1,
  tint = 'rgba(120,196,214,0.9)',
}) => {
  const draw = clamp01(reveal * 1.2);
  const routes = [
    'M120 620 L360 620 L470 760 L740 760 L880 900',
    'M470 760 L470 1100 L650 1240 L900 1240',
    'M250 980 L470 1100',
    'M880 900 L880 640 L1010 520',
    'M650 1240 L650 1520',
  ];
  return (
    <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(86% 74% at 50% 46%, #0B202D 0%, #061019 52%, #02060A 88%)'}}>
      <svg viewBox="0 0 1080 1920" width="100%" height="100%">
        {/* city blocks */}
        <g opacity={0.42 + Math.sin(f / 43) * 0.04}>
          {Array.from({length: 7}).map((_, r) =>
            Array.from({length: 5}).map((__, c) => {
              const seed = r * 11 + c * 7;
              const x = 90 + c * 186 + (r % 2) * 22;
              const y = 470 + r * 174;
              return (
                <rect
                  key={`${r}-${c}`}
                  x={x}
                  y={y}
                  width={132 + rnd(seed) * 18}
                  height={112}
                  fill="none"
                  stroke={tint}
                  strokeWidth={1.6}
                  opacity={0.4 + rnd(seed + 5) * 0.3}
                />
              );
            })
          )}
        </g>

        {/* routes: glow then core */}
        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
          {routes.map((d, i) => (
            <path key={`g${i}`} d={d} stroke={tint} strokeWidth={22} opacity={0.2 * draw} strokeDasharray={2200} strokeDashoffset={2200 * (1 - draw)} />
          ))}
          {routes.map((d, i) => (
            <path
              key={`c${i}`}
              d={d}
              stroke={tint}
              strokeWidth={i === 0 ? 6.5 : 4.4}
              opacity={0.86 + Math.sin(f / 29 + i) * 0.1}
              strokeDasharray={2200}
              strokeDashoffset={2200 * (1 - draw)}
            />
          ))}
        </g>

        {/* stations */}
        {[
          [360, 620],
          [470, 760],
          [740, 760],
          [470, 1100],
          [880, 900],
          [650, 1240],
        ].map(([x, y], i) => (
          <g key={i} opacity={clamp01((draw - i * 0.1) * 3)}>
            <circle cx={x} cy={y} r={13} fill="#08151E" stroke={tint} strokeWidth={3} />
            <circle cx={x} cy={y} r={5} fill={tint} opacity={0.9} />
          </g>
        ))}

        {/* the coordinate under the city */}
        <g opacity={clamp01((reveal - 0.4) / 0.35)}>
          <circle cx={880} cy={900} r={30} fill="none" stroke="#E2765C" strokeWidth={2} opacity={0.5} />
          <circle cx={880} cy={900} r={16 + Math.sin(f / 7) * 3} fill="none" stroke="#E2765C" strokeWidth={3} />
          <circle cx={880} cy={900} r={7} fill="#E2765C" opacity={0.8 + Math.sin(f / 5) * 0.2} />
          <line x1={880} y1={900} x2={880} y2={1130} stroke="#E2765C" strokeWidth={2} opacity={0.5} />
          <circle cx={880} cy={1130} r={5} fill="#E2765C" opacity={0.7} />
        </g>
      </svg>

      {/* scan sweep */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: `${((f * 1.6) % 120) - 10}%`,
          height: 200,
          background: 'linear-gradient(180deg, transparent, rgba(150,214,236,0.07), transparent)',
        }}
      />
      <GlitchBars f={f} amount={0.1} seed={4} />
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* inserts                                                             */
/* ------------------------------------------------------------------ */

export const KeysOnTable: React.FC<{f: number; grab?: number}> = ({f, grab = 0}) => {
  const lift = grab;
  return (
    <div style={{position: 'absolute', inset: 0, background: '#03060A'}}>
      {/* room behind, out of focus */}
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg,#0A121A 0%,#060C12 42%,#03060A 100%)'}} />
      {/* a doorway of cold light, out of focus, behind her */}
      <div
        style={{
          position: 'absolute',
          left: 40,
          top: 240,
          width: 300,
          height: 900,
          background: 'linear-gradient(180deg, rgba(126,170,200,0.16), rgba(56,92,120,0.05))',
          filter: 'blur(24px)',
        }}
      />
      {/* the pendant lamp this room is lit by */}
      <div
        style={{
          position: 'absolute',
          left: 742,
          top: 0,
          width: 3,
          height: 118,
          background: 'linear-gradient(180deg,rgba(190,206,218,0.16),rgba(190,206,218,0.34))',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 690,
          top: 112,
          width: 108,
          height: 40,
          borderRadius: '6px 6px 46px 46px',
          background: 'linear-gradient(180deg,#2A333C,#101820)',
          boxShadow: '0 10px 40px rgba(0,0,0,0.7)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 720,
          top: 148,
          width: 48,
          height: 16,
          borderRadius: '50%',
          background: 'rgba(255,224,168,0.85)',
          boxShadow: '0 0 60px rgba(255,206,132,0.55)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 520,
          top: 60,
          width: 640,
          height: 760,
          background: 'radial-gradient(closest-side, rgba(226,170,74,0.18), transparent 74%)',
          filter: 'blur(54px)',
        }}
      />

      {/* table top, seen from just above the surface */}
      <div
        style={{
          position: 'absolute',
          left: -60,
          right: -60,
          top: 860,
          bottom: -60,
          background: 'linear-gradient(180deg, #1A222B 0%, #121A22 34%, #080D13 100%)',
          boxShadow: 'inset 0 1px 0 rgba(170,204,226,0.16)',
        }}
      />
      {/* wood/veneer grain */}
      {Array.from({length: 7}).map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 900 + i * 58,
            height: 1,
            background: 'rgba(150,186,208,0.05)',
            transform: `rotate(${-0.6 + rnd(i) * 1.2}deg)`,
          }}
        />
      ))}
      {/* warm pool where the lamp lands */}
      <div
        style={{
          position: 'absolute',
          left: 180,
          top: 830,
          width: 720,
          height: 520,
          background: 'radial-gradient(closest-side, rgba(236,182,112,0.42), rgba(226,170,74,0.08) 58%, transparent 80%)',
          filter: 'blur(22px)',
          opacity: 1,
        }}
      />

      {/* ---- the bunch, and the hand that closes on it ----
          Everything in this block is one rigid group: the ring, the two
          blades and the fob hang off the split ring; the fingers wrap the
          ring's right arc; the wrist meets the cuff; the sleeve leaves the
          frame at the right edge. When `grab` rises the whole group lifts,
          so nothing separates. */}

      {/* what the table loses under the bunch */}
      <div
        style={{
          position: 'absolute',
          left: 300,
          top: 1150,
          width: 640,
          height: 180,
          borderRadius: '50%',
          background: 'rgba(0,0,0,0.62)',
          filter: 'blur(26px)',
          opacity: 0.92 - lift * 0.55,
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `translate(0px, ${-lift * 66}px) rotate(${lift * 2.2}deg)`,
          transformOrigin: '64% 62%',
        }}
      >
        {/* ---- split ring: 72 px across, the bunch hangs off its left wire
                and the fingers close on its right wire ---- */}
        <div
          style={{
            position: 'absolute',
            left: 612,
            top: 1152,
            width: 72,
            height: 72,
            boxSizing: 'border-box',
            borderRadius: '50%',
            border: '8px solid #75808A',
            background: 'transparent',
            boxShadow:
              'inset 0 0 12px rgba(0,0,0,0.7), 0 2px 4px rgba(0,0,0,0.8)',
          }}
        />

        {/* ---- key one: bow on the ring's left wire, shaft and bit left ---- */}
        <div style={{position: 'absolute', left: 592, top: 1170, width: 44, height: 36}}>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 7,
              background: 'linear-gradient(166deg,#9DA9B1 0%,#66717A 56%,#333D45 100%)',
              boxShadow: '0 3px 6px rgba(0,0,0,0.7)',
            }}
          />
          <div style={{position: 'absolute', right: 12, top: 10, width: 20, height: 16, borderRadius: '50%', background: 'rgba(0,0,0,0.72)'}} />
        </div>
        <div
          style={{
            position: 'absolute',
            left: 508,
            top: 1180,
            width: 90,
            height: 15,
            borderRadius: 2,
            background: 'linear-gradient(180deg,#97A3AB 0%,#68737B 50%,#39434A 100%)',
            boxShadow: '0 3px 6px rgba(0,0,0,0.65)',
          }}
        />
        {/* the bit, teeth up */}
        <div style={{position: 'absolute', left: 490, top: 1170, width: 30, height: 34}}>
          <div style={{position: 'absolute', left: 0, top: 10, width: 30, height: 15, borderRadius: 2, background: 'linear-gradient(180deg,#8E9AA2,#4A545C)'}} />
          {[0, 1, 2].map((i) => (
            <div key={i} style={{position: 'absolute', left: 2 + i * 10, top: 2, width: 6, height: 12, background: 'linear-gradient(180deg,#8E9AA2,#4A545C)'}} />
          ))}
        </div>

        {/* ---- key two: shorter, hanging a little lower ---- */}
        <div style={{position: 'absolute', left: 604, top: 1200, width: 38, height: 30}}>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 6,
              background: 'linear-gradient(166deg,#939FA7 0%,#5E6971 58%,#2E373E 100%)',
              boxShadow: '0 3px 6px rgba(0,0,0,0.7)',
            }}
          />
          <div style={{position: 'absolute', right: 10, top: 8, width: 17, height: 14, borderRadius: '50%', background: 'rgba(0,0,0,0.72)'}} />
        </div>
        <div
          style={{
            position: 'absolute',
            left: 532,
            top: 1207,
            width: 76,
            height: 12,
            borderRadius: 2,
            transform: 'rotate(1.6deg)',
            transformOrigin: '100% 50%',
            background: 'linear-gradient(180deg,#8C98A0 0%,#5E6971 52%,#323B42 100%)',
            boxShadow: '0 3px 6px rgba(0,0,0,0.6)',
          }}
        />
        <div style={{position: 'absolute', left: 516, top: 1198, width: 24, height: 28}}>
          <div style={{position: 'absolute', left: 0, top: 8, width: 24, height: 12, borderRadius: 2, background: 'linear-gradient(180deg,#87939B,#454E56)'}} />
          {[0, 1].map((i) => (
            <div key={i} style={{position: 'absolute', left: 1 + i * 10, top: 1, width: 6, height: 10, background: 'linear-gradient(180deg,#87939B,#454E56)'}} />
          ))}
        </div>

        {/* ---- fob, hanging from the same wire, turned a few degrees ---- */}
        <div
          style={{
            position: 'absolute',
            left: 552,
            top: 1094,
            width: 84,
            height: 50,
            borderRadius: 9,
            transform: 'rotate(-13deg)',
            background: 'linear-gradient(158deg,#2C3843 0%,#0F1720 78%)',
            boxShadow: 'inset 0 0 0 1px rgba(176,206,226,0.22), 0 8px 18px rgba(0,0,0,0.8)',
          }}
        >
          <div style={{position: 'absolute', left: 13, top: 15, width: 38, height: 3, background: 'rgba(150,196,224,0.38)'}} />
          <div style={{position: 'absolute', right: 11, top: 27, width: 7, height: 7, borderRadius: '50%', background: 'rgba(226,118,92,0.8)'}} />
        </div>
        {/* the small link between fob and ring */}
        <div
          style={{
            position: 'absolute',
            left: 596,
            top: 1128,
            width: 19,
            height: 26,
            borderRadius: '50%',
            border: '3px solid #77838C',
          }}
        />

        {/* cast shadow of the bunch on the veneer */}
        <div
          style={{
            position: 'absolute',
            left: 468,
            top: 1214,
            width: 220,
            height: 40,
            borderRadius: '50%',
            background: 'rgba(0,0,0,0.66)',
            filter: 'blur(11px)',
            opacity: 0.95 - lift * 0.5,
          }}
        />
        {/* ---- the hand that closes on the bunch ----
            One silhouette first: a slab of fingers on the near side of the
            ring, the mass of the back of the hand behind it, a thumb folded
            across the ring's lower arc, then the wrist and the sleeve running
            out of frame at the right edge. Detail is only creases and one rim
            light, so nothing reads as a loose object on the table. */}

        {/* what the table loses under the hand */}
        <div
          style={{
            position: 'absolute',
            left: 700,
            top: 1210,
            width: 330,
            height: 130,
            borderRadius: '50%',
            background: 'rgba(0,0,0,0.6)',
            filter: 'blur(24px)',
            opacity: 0.9 - lift * 0.5,
          }}
        />

        {/* slab of fingers: four bars seen edge-on, joined into one mass */}
        <div
          style={{
            position: 'absolute',
            left: 646,
            top: 1102,
            width: 186,
            height: 232,
            borderRadius: '46px 14px 14px 46px',
            background: 'linear-gradient(152deg,#161A1E 0%,#0A0D11 54%,#000305 100%)',
            boxShadow: 'inset -10px -16px 38px rgba(0,0,0,0.75)',
          }}
        />
        {/* back of the hand, merged under the fingers */}
        <div
          style={{
            position: 'absolute',
            left: 796,
            top: 1094,
            width: 208,
            height: 244,
            borderRadius: '56px 44px 46px 52px',
            background: 'linear-gradient(152deg,#161A1E 0%,#0A0D11 54%,#000305 100%)',
            boxShadow: 'inset -16px -20px 48px rgba(0,0,0,0.8)',
          }}
        />
        {/* thumb, folded across the ring's lower arc */}
        <div
          style={{
            position: 'absolute',
            left: 630,
            top: 1274,
            width: 168,
            height: 56,
            borderRadius: 28,
            transform: 'rotate(-7deg)',
            transformOrigin: '100% 50%',
            background: 'linear-gradient(152deg,#161A1E 0%,#0A0D11 54%,#000305 100%)',
            boxShadow: 'inset 0 -6px 12px rgba(0,0,0,0.6)',
          }}
        />

        {/* one rim light along the lamp-facing contour, never a full outline */}
        <div
          style={{
            position: 'absolute',
            left: 654,
            top: 1098,
            width: 356,
            height: 10,
            borderRadius: 5,
            background: 'linear-gradient(90deg, rgba(232,200,168,0.34), rgba(232,200,168,0.12) 62%, rgba(232,200,168,0))',
            filter: 'blur(3px)',
          }}
        />

        {/* wrist and sleeve as one piece, leaving the frame to the right */}
        <div
          style={{
            position: 'absolute',
            left: 940,
            top: 1120,
            width: 620,
            height: 238,
            borderRadius: '84px 40px 40px 84px',
            transform: 'rotate(20deg)',
            transformOrigin: '0% 46%',
            background: 'linear-gradient(94deg,#20282F 0%,#2C3740 44%,#141B21 78%,#080D12 100%)',
            boxShadow: 'inset 0 4px 0 rgba(190,216,232,0.10), 0 18px 46px rgba(0,0,0,0.85)',
          }}
        />
        {/* the cuff band, so the sleeve reads as clothing and not as a pipe */}
        <div
          style={{
            position: 'absolute',
            left: 952,
            top: 1112,
            width: 78,
            height: 254,
            borderRadius: 24,
            transform: 'rotate(20deg)',
            transformOrigin: '0% 46%',
            background: 'linear-gradient(96deg,#2E3841 0%,#1A232B 70%,#0C1319 100%)',
            boxShadow: 'inset 0 0 0 1px rgba(176,206,226,0.14)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 952,
            top: 1124,
            width: 76,
            height: 7,
            borderRadius: 4,
            transform: 'rotate(20deg)',
            transformOrigin: '0% 50%',
            background: 'rgba(190,216,232,0.18)',
          }}
        />
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* street furniture                                                    */
/* ------------------------------------------------------------------ */

export const TrafficSignal: React.FC<{f: number; phase?: number; x: number; scale?: number}> = ({
  f,
  phase = 0,
  x,
  scale = 1,
}) => {
  const on = (i: number) => (Math.floor(phase) % 3 === i ? 1 : 0.08);
  const col = ['#E2765C', '#E2C04A', '#6FBF8E'];
  return (
    <div style={{position: 'absolute', left: x, bottom: 470 * scale, width: 74 * scale, height: 380 * scale}}>
      <div style={{position: 'absolute', left: 30 * scale, bottom: 0, width: 14 * scale, height: 300 * scale, background: 'linear-gradient(180deg,#151E27,#080D13)'}} />
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: 74 * scale,
          height: 210 * scale,
          borderRadius: 10 * scale,
          background: 'linear-gradient(180deg,#1B242E,#0A1017)',
          boxShadow: 'inset 0 0 0 1px rgba(140,178,204,0.14), 0 12px 30px rgba(0,0,0,0.7)',
        }}
      >
        {col.map((c, i) => (
          <div
            key={c}
            style={{
              position: 'absolute',
              left: 18 * scale,
              top: (16 + i * 62) * scale,
              width: 38 * scale,
              height: 38 * scale,
              borderRadius: '50%',
              background: c,
              opacity: on(i),
              boxShadow: on(i) > 0.5 ? `0 0 ${26 * scale}px ${c}` : 'none',
            }}
          />
        ))}
      </div>
      {/* the pool of light it throws */}
      <div
        style={{
          position: 'absolute',
          left: -140 * scale,
          top: 200 * scale,
          width: 340 * scale,
          height: 200 * scale,
          background: `radial-gradient(closest-side, ${col[Math.floor(phase) % 3]}44, transparent 74%)`,
          filter: 'blur(20px)',
          mixBlendMode: 'screen',
        }}
      />
    </div>
  );
};

export const SurveillancePole: React.FC<{f: number; x: number; scale?: number}> = ({f, x, scale = 1}) => (
  <div style={{position: 'absolute', left: x, bottom: 470 * scale, width: 40 * scale, height: 900 * scale}}>
    <div style={{position: 'absolute', left: 14 * scale, bottom: 0, width: 10 * scale, height: 900 * scale, background: 'linear-gradient(90deg,#1A232C,#080D13)'}} />
    <div
      style={{
        position: 'absolute',
        left: -18 * scale,
        top: 26 * scale,
        width: 76 * scale,
        height: 40 * scale,
        borderRadius: 6 * scale,
        background: 'linear-gradient(180deg,#1E2832,#0A1017)',
        transform: 'rotate(-12deg)',
        boxShadow: 'inset 0 0 0 1px rgba(140,178,204,0.14)',
      }}
    >
      <div style={{position: 'absolute', left: 54 * scale, top: 12 * scale, width: 14 * scale, height: 14 * scale, borderRadius: '50%', background: '#0B1A22', boxShadow: 'inset 0 0 0 2px rgba(150,200,226,0.4)'}} />
      <div style={{position: 'absolute', left: 60 * scale, top: 6 * scale, width: 5 * scale, height: 5 * scale, borderRadius: '50%', background: 'rgba(226,96,72,0.9)', opacity: 0.4 + Math.abs(Math.sin(f / 22)) * 0.6}} />
    </div>
  </div>
);

export const CafeTable: React.FC<{f: number; k?: number; steam?: number}> = ({f, k = 0, steam = 1}) => (
  <div style={{position: 'absolute', inset: 0}}>
    {/* cafe interior, soft and out of focus */}
    <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(178deg,#0A1017 0%,#080E14 48%,#04070B 100%)'}} />
    <div
      style={{
        position: 'absolute',
        left: 120,
        top: 240,
        width: 840,
        height: 700,
        background: 'linear-gradient(180deg, rgba(30,52,70,0.5), rgba(10,16,22,0.2))',
        filter: 'blur(30px)',
      }}
    />
    {/* window with grey daylight */}
    <div
      style={{
        position: 'absolute',
        left: 560,
        top: 200,
        width: 460,
        height: 720,
        background: 'linear-gradient(180deg,#20323F 0%,#16242E 60%,#0C151C 100%)',
        boxShadow: 'inset 0 0 0 2px rgba(140,178,204,0.1)',
        filter: 'blur(2px)',
        opacity: 0.85,
      }}
    >
      <div style={{position: 'absolute', left: 226, top: 0, width: 8, height: '100%', background: '#0A1119'}} />
    </div>
    {/* empty chair */}
    <div style={{position: 'absolute', left: 210, top: 900, width: 300, height: 620, opacity: 0.9}}>
      <div style={{position: 'absolute', left: 30, top: 0, width: 240, height: 250, borderRadius: '22px 22px 4px 4px', background: 'linear-gradient(180deg,#1B252F,#0C131A)'}} />
      <div style={{position: 'absolute', left: 0, top: 262, width: 300, height: 44, borderRadius: 8, background: 'linear-gradient(180deg,#212C36,#0E151C)'}} />
      {[18, 250].map((xx) => (
        <div key={xx} style={{position: 'absolute', left: xx, top: 300, width: 18, height: 300, background: 'linear-gradient(90deg,#141D25,#080D13)'}} />
      ))}
    </div>
    {/* table */}
    <div
      style={{
        position: 'absolute',
        left: -80,
        top: 1280,
        width: 1240,
        height: 300,
        borderRadius: '50%',
        background: 'radial-gradient(closest-side, #2B3946 0%, #1B2731 62%, #0C141B 100%)',
        boxShadow: '0 40px 90px rgba(0,0,0,0.9)',
      }}
    />
    <div style={{position: 'absolute', left: 0, right: 0, top: 1430, bottom: 0, background: 'linear-gradient(180deg,#080D13,#03060A)'}} />
    {/* warm lamp pool on the tabletop */}
    <div
      style={{
        position: 'absolute',
        left: 330,
        top: 1180,
        width: 620,
        height: 420,
        background: 'radial-gradient(closest-side, rgba(240,190,120,0.46), rgba(226,170,74,0.1) 62%, transparent 80%)',
        filter: 'blur(18px)',
      }}
    />

    {/* cup + saucer */}
    {/* the cup stays exactly where it was put: only the camera moves */}
    <div style={{position: 'absolute', left: 452, top: 1216, width: 300, height: 250}}>
      <div style={{position: 'absolute', left: -34, top: 122, width: 300, height: 54, borderRadius: '50%', background: 'linear-gradient(180deg,#2B3A46,#141C24)', boxShadow: '0 10px 26px rgba(0,0,0,0.8)'}} />
      <div style={{position: 'absolute', left: -60, top: 150, width: 360, height: 90, borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(0,0,0,0.72), transparent 76%)', filter: 'blur(8px)'}} />
      <div
        style={{
          position: 'absolute',
          left: 18,
          top: 26,
          width: 190,
          height: 120,
          borderRadius: '12px 12px 74px 74px',
          background: 'linear-gradient(100deg,#AEBAC2 0%,#84939D 42%,#4A565F 100%)',
          boxShadow: '0 14px 30px rgba(0,0,0,0.75)',
        }}
      />
      <div style={{position: 'absolute', left: 30, top: 34, width: 166, height: 30, borderRadius: '50%', background: 'radial-gradient(closest-side,#3A2216,#120B07)', boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.9)'}} />
      <div style={{position: 'absolute', left: 196, top: 66, width: 54, height: 46, borderRadius: '50%', border: '11px solid #C9D4DA', borderLeftColor: 'transparent'}} />
      {/* steam */}
      {Array.from({length: 4}).map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: 62 + i * 26 + Math.sin(f / 21 + i) * 8,
            top: -60 - ((f * 1.6 + i * 46) % 150),
            width: 26,
            height: 120,
            borderRadius: '50%',
            background: 'linear-gradient(180deg, rgba(230,238,244,0), rgba(230,238,244,0.3), rgba(230,238,244,0))',
            filter: 'blur(7px)',
            opacity: (0.5 + Math.sin(f / 13 + i) * 0.22) * steam,
          }}
        />
      ))}
    </div>
  </div>
);

export const ClockFace: React.FC<{f: number; size?: number; angle?: number; style?: React.CSSProperties}> = ({
  f,
  size = 120,
  angle = -8,
  style,
}) => (
  <div
    style={{
      position: 'absolute',
      width: size,
      height: size,
      borderRadius: '50%',
      background: 'radial-gradient(closest-side,#E8EEF2,#B7C4CC 78%,#8A99A3 100%)',
      boxShadow: '0 8px 22px rgba(0,0,0,0.8), inset 0 0 0 2px rgba(255,255,255,0.5)',
      ...style,
    }}
  >
    {Array.from({length: 12}).map((_, i) => (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: '50%',
          top: 4,
          width: i % 3 === 0 ? 3 : 2,
          height: i % 3 === 0 ? size * 0.1 : size * 0.06,
          marginLeft: -1,
          background: 'rgba(30,42,52,0.7)',
          transformOrigin: `50% ${size / 2 - 4}px`,
          transform: `rotate(${i * 30}deg)`,
        }}
      />
    ))}
    {/* hour hand */}
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: 5,
        height: size * 0.26,
        marginLeft: -2.5,
        marginTop: -size * 0.26,
        background: '#1B2731',
        borderRadius: 3,
        transformOrigin: '50% 100%',
        transform: `rotate(${angle}deg)`,
      }}
    />
    {/* minute hand */}
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: 3.5,
        height: size * 0.4,
        marginLeft: -1.75,
        marginTop: -size * 0.4,
        background: '#26333E',
        borderRadius: 3,
        transformOrigin: '50% 100%',
        transform: `rotate(${angle + 21}deg)`,
      }}
    />
    <div style={{position: 'absolute', left: '50%', top: '50%', width: 10, height: 10, marginLeft: -5, marginTop: -5, borderRadius: '50%', background: '#121B23'}} />
    {/* glass sheen */}
    <div
      style={{
        position: 'absolute',
        inset: 0,
        borderRadius: '50%',
        background: 'linear-gradient(146deg, rgba(255,255,255,0.5), transparent 46%)',
        opacity: 0.4 + Math.sin(f / 41) * 0.05,
      }}
    />
  </div>
);

export const StationMouth: React.FC<{f: number; glow?: number}> = ({f, glow = 1}) => (
  <div style={{position: 'absolute', inset: 0}}>
    {/* tiled wall behind */}
    <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg,#0B141C 0%,#070D13 46%,#04070B 100%)'}} />
    {Array.from({length: 9}).map((_, r) =>
      Array.from({length: 7}).map((__, c) => (
        <div
          key={`${r}-${c}`}
          style={{
            position: 'absolute',
            left: -20 + c * 168,
            top: 120 + r * 128,
            width: 150,
            height: 112,
            background: 'rgba(60,86,104,0.12)',
            boxShadow: 'inset 0 0 0 1px rgba(130,168,196,0.06)',
          }}
        />
      ))
    )}
    {/* the stairs going down into black */}
    <div style={{position: 'absolute', left: 250, top: 760, width: 600, height: 780, overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg,#081018 0%,#04070B 40%,#010204 100%)'}} />
      {Array.from({length: 9}).map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: -40 + i * 6,
            right: -40 + i * 6,
            top: 40 + i * 74,
            height: 18,
            background: 'linear-gradient(180deg, rgba(120,158,186,0.16), rgba(20,30,40,0.9))',
          }}
        />
      ))}
    </div>
    {/* frame around the mouth */}
    <div style={{position: 'absolute', left: 236, top: 740, width: 628, height: 22, background: 'linear-gradient(180deg,#22303A,#0A1118)'}} />
    <div style={{position: 'absolute', left: 236, top: 740, width: 20, height: 820, background: 'linear-gradient(90deg,#1B262F,#080D13)'}} />
    <div style={{position: 'absolute', left: 844, top: 740, width: 20, height: 820, background: 'linear-gradient(90deg,#1B262F,#080D13)'}} />
    {/* illuminated band, unlit of letters — world detail only */}
    <div
      style={{
        position: 'absolute',
        left: 300,
        top: 660,
        width: 500,
        height: 56,
        borderRadius: 8,
        background: `linear-gradient(180deg, rgba(150,206,232,${0.3 * glow}), rgba(70,130,166,${0.14 * glow}))`,
        boxShadow: `0 0 ${40 * glow}px rgba(140,200,230,${0.24 * glow})`,
        filter: 'blur(0.6px)',
      }}
    />
    {/* railing light pool at the threshold */}
    <div
      style={{
        position: 'absolute',
        left: 180,
        top: 1480,
        width: 740,
        height: 240,
        background: `radial-gradient(closest-side, rgba(120,182,214,${0.14 * glow}), transparent 76%)`,
        filter: 'blur(24px)',
        mixBlendMode: 'screen',
      }}
    />
  </div>
);

/* ------------------------------------------------------------------ */
/* the platform, and what is standing on it                            */
/*                                                                     */
/* one perspective: a floor plane that runs away from the camera to the */
/* base of the far wall, a tactile strip along the drop, and rows of    */
/* shoes standing *on* that floor — soles on the row line, a contact    */
/* shadow under every sole, pairs reading as pairs. no shelf, no rack:  */
/* nothing is airborne.                                                */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* the platform, seen from above                                       */
/*                                                                     */
/* the camera looks down at the floor: the tactile strip is the edge   */
/* the shoes face, and the shoes stand on the same slab as the strip — */
/* soles on the floor, a contact shadow under each, pairs side by side */
/* because that is how a pair stands. nothing is shelved, nothing      */
/* floats, there is no rack in the shot to contradict.                 */
/* ------------------------------------------------------------------ */

const SHOE_TONES: Array<[string, string]> = [
  ['#3C2B22', '#120C09'],
  ['#2C3540', '#0A0F14'],
  ['#241A18', '#080505'],
  ['#3D2320', '#140908'],
  ['#33383B', '#0B0E10'],
  ['#2B2318', '#0C0906'],
];

/* one shoe from above: heel up, toe down, sole on the slab */
const ShoeTop: React.FC<{x: number; y: number; s: number; tone: number; dim?: number; jit?: number}> = ({
  x,
  y,
  s,
  tone,
  dim = 1,
  jit = 0,
}) => {
  const [hi, lo] = SHOE_TONES[tone % SHOE_TONES.length];
  const w = 44 * s;
  const h = 100 * s;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: h,
        opacity: dim,
        transform: `rotate(${jit}deg)`,
      }}
    >
      {/* contact shadow on the slab */}
      <div
        style={{
          position: 'absolute',
          left: 2.5 * s,
          top: 5 * s,
          width: w,
          height: h,
          borderRadius: `${18 * s}px ${18 * s}px ${26 * s}px ${26 * s}px`,
          background: 'rgba(0,0,0,0.62)',
          filter: `blur(${6 * s}px)`,
        }}
      />
      {/* sole */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: `${16 * s}px ${16 * s}px ${28 * s}px ${28 * s}px`,
          background: 'linear-gradient(180deg,#080B0F,#04070A)',
        }}
      />
      {/* upper */}
      <div
        style={{
          position: 'absolute',
          left: 3 * s,
          top: 2 * s,
          width: w - 6 * s,
          height: h - 7 * s,
          borderRadius: `${14 * s}px ${14 * s}px ${26 * s}px ${26 * s}px`,
          background: `linear-gradient(184deg, ${hi} 0%, ${lo} 82%)`,
        }}
      />
      {/* heel counter */}
      <div
        style={{
          position: 'absolute',
          left: 3.5 * s,
          top: 2 * s,
          width: w - 7 * s,
          height: 19 * s,
          borderRadius: `${14 * s}px ${14 * s}px ${5 * s}px ${5 * s}px`,
          background: `linear-gradient(180deg, ${hi} 0%, ${lo} 96%)`,
        }}
      />
      {/* the mouth of the shoe — empty */}
      <div
        style={{
          position: 'absolute',
          left: 8 * s,
          top: 21 * s,
          width: w - 16 * s,
          height: 30 * s,
          borderRadius: '50%',
          background: 'rgba(0,0,0,0.78)',
          boxShadow: `inset 0 ${1.5 * s}px ${4 * s}px rgba(0,0,0,0.9)`,
        }}
      />
      {/* tongue, just past the mouth */}
      <div
        style={{
          position: 'absolute',
          left: 12 * s,
          top: 48 * s,
          width: w - 24 * s,
          height: 9 * s,
          borderRadius: 2,
          background: 'rgba(150,186,212,0.10)',
        }}
      />
      {/* laces */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: 11 * s,
            top: (59 + i * 8) * s,
            width: w - 22 * s,
            height: Math.max(1, 1.4 * s),
            background: 'rgba(206,230,244,0.16)',
          }}
        />
      ))}
      {/* toe, catching the strip light */}
      <div
        style={{
          position: 'absolute',
          left: 8 * s,
          top: 78 * s,
          width: w - 16 * s,
          height: 15 * s,
          borderRadius: '50%',
          background: 'rgba(216,238,250,0.13)',
          filter: `blur(${3 * s}px)`,
        }}
      />
      {/* rim down the left edge */}
      <div
        style={{
          position: 'absolute',
          left: 1.5 * s,
          top: 14 * s,
          width: Math.max(1, 2.4 * s),
          height: h - 34 * s,
          borderRadius: 2,
          background: 'rgba(182,216,238,0.26)',
          filter: `blur(${1.1 * s}px)`,
        }}
      />
    </div>
  );
};

export const ShoePlatform: React.FC<{f: number; show?: number}> = ({f, show = 1}) => {
  const rows = Array.from({length: 11}, (_, i) => 120 + i * 128);
  const pairs = Array.from({length: 9}, (_, i) => -34 + i * 134);
  return (
    <div style={{position: 'absolute', inset: 0, background: '#060C12'}}>
      {/* ---------------- the slab ---------------- */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(168deg,#0B151C 0%,#0A131A 42%,#081016 78%,#060B11 100%)',
        }}
      />
      {/* one lamp above, upper left */}
      <div
        style={{
          position: 'absolute',
          left: -200,
          top: -260,
          width: 1200,
          height: 1160,
          background: 'radial-gradient(closest-side, rgba(154,200,226,0.19), rgba(10,20,28,0) 72%)',
          mixBlendMode: 'screen',
          opacity: 0.9 + Math.sin(f / 61) * 0.05,
        }}
      />
      {/* tile seams */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'repeating-linear-gradient(90deg, rgba(150,196,224,0.08) 0 1.5px, rgba(10,18,24,0) 1.5px 240px), repeating-linear-gradient(0deg, rgba(150,196,224,0.07) 0 1.5px, rgba(10,18,24,0) 1.5px 240px)',
        }}
      />
      {/* a few tiles read lighter than their neighbours */}
      {Array.from({length: 18}).map((_, i) => {
        const c = i % 5;
        const r = Math.floor(i / 5);
        return (
          <div
            key={`t${i}`}
            style={{
              position: 'absolute',
              left: c * 240 + 2,
              top: r * 240 + 2 + (i % 3) * 190,
              width: 236,
              height: 236,
              background: 'rgba(150,196,224,0.013)',
              opacity: 0.6 + rnd(i * 13) * 0.4,
            }}
          />
        );
      })}

      {/* warm bounce from the strip reaching back across the shoes */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 1240,
          height: 400,
          background: 'linear-gradient(0deg, rgba(206,168,92,0.16), rgba(6,12,18,0) 90%)',
          mixBlendMode: 'screen',
        }}
      />

      {/* ---------------- the shoes ---------------- */}
      <div style={{position: 'absolute', inset: 0, opacity: show}}>
        {rows.map((y, r) =>
          pairs.map((x, p) => {
            const seed = r * 31 + p * 7;
            if (rnd(seed + 2) > 0.96) return null;
            const jx = (rnd(seed + 4) - 0.5) * 6;
            const jy = (rnd(seed + 6) - 0.5) * 7;
            const sc = 0.93 + rnd(seed + 8) * 0.15;
            const tone = Math.floor(rnd(seed + 10) * SHOE_TONES.length);
            const tone2 = (tone + 1 + Math.floor(rnd(seed + 12) * 4)) % SHOE_TONES.length;
            return (
              <React.Fragment key={`${r}-${p}`}>
                <ShoeTop
                  x={x + jx}
                  y={y + jy}
                  s={sc}
                  tone={tone}
                  jit={(rnd(seed + 14) - 0.5) * 4}
                  dim={0.88}
                />
                <ShoeTop
                  x={x + 52 * sc}
                  y={y + jy + (rnd(seed + 16) - 0.5) * 4}
                  s={sc}
                  tone={tone2}
                  jit={(rnd(seed + 18) - 0.5) * 4}
                  dim={0.84}
                />
              </React.Fragment>
            );
          })
        )}
      </div>

      {/* ---------------- the edge ---------------- */}
      {/* concrete lip, barely lit */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 1642,
          height: 16,
          background: 'linear-gradient(180deg,#243541 0%,#121C24 62%,#0A1218 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 1640,
          height: 3,
          background: 'rgba(196,226,242,0.26)',
          filter: 'blur(1.3px)',
        }}
      />
      {/* tactile strip: amber, dotted, the line every shoe points at */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 1560,
          height: 82,
          background: 'linear-gradient(180deg,#6A5522 0%,#7F6629 26%,#5A491D 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 1560,
          height: 82,
          backgroundImage:
            'radial-gradient(circle at 13px 14px, rgba(240,212,134,0.46) 0 4.5px, rgba(0,0,0,0) 4.5px 27px)',
          backgroundSize: '27px 27px',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 1552,
          height: 12,
          background: 'rgba(240,214,146,0.14)',
          filter: 'blur(5px)',
        }}
      />
      {/* the drop */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 1658,
          bottom: 0,
          background: 'linear-gradient(180deg,#02050A 0%,#010305 44%,#000 100%)',
        }}
      />
      {/* one rail down in the dark */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 1790,
          height: 5,
          background:
            'linear-gradient(90deg, rgba(140,178,200,0.05), rgba(170,206,228,0.24) 34%, rgba(170,206,228,0.28) 62%, rgba(140,178,200,0.04))',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 1808,
          height: 2,
          background: 'rgba(140,178,200,0.07)',
        }}
      />
    </div>
  );
};
/* ------------------------------------------------------------------ */
/* train                                                               */
/* ------------------------------------------------------------------ */

export const TrainCar: React.FC<{f: number; light?: number; children?: React.ReactNode}> = ({
  f,
  light = 1,
  children,
}) => (
  <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg,#0B131A 0%,#080E14 40%,#05090E 100%)'}}>
    {/* perspective shell */}
    <div
      style={{
        position: 'absolute',
        left: 60,
        right: 60,
        top: 210,
        bottom: 250,
        background: 'linear-gradient(180deg,#16212B 0%,#0C151D 46%,#070C12 100%)',
        borderRadius: 18,
        boxShadow: 'inset 0 0 140px rgba(0,0,0,0.95)',
      }}
    />
    {/* ceiling strip lights */}
    {[0, 1].map((i) => (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: 330 + i * 0,
          top: 250,
          width: 420,
          height: 26,
          borderRadius: 8,
          background: 'rgba(214,236,248,0.86)',
          boxShadow: '0 0 80px rgba(180,222,244,0.6)',
          filter: 'blur(1px)',
          opacity: light,
        }}
      />
    ))}
    {/* windows with tunnel streaks */}
    {[0, 1].map((side) =>
      [0, 1, 2].map((i) => (
        <div
          key={`${side}-${i}`}
          style={{
            position: 'absolute',
            left: side === 0 ? 96 + i * 300 : 96 + i * 300,
            top: side === 0 ? 470 : 470,
            width: 250,
            height: 300,
            borderRadius: 14,
            background: 'linear-gradient(180deg,#0A151D 0%,#05090E 100%)',
            boxShadow: 'inset 0 0 40px rgba(0,0,0,0.9)',
            overflow: 'hidden',
            opacity: 0.9,
          }}
        >
          {Array.from({length: 4}).map((__, j) => (
            <div
              key={j}
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: `${((f * (2.2 + j * 0.5) + j * 70) % 120) - 10}%`,
                height: 12,
                background: 'rgba(150,196,224,0.1)',
              }}
            />
          ))}
        </div>
      ))
    )}
    {/* seats */}
    {[0, 1].map((i) => (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: 96 + i * 300,
          top: 780,
          width: 250,
          height: 260,
          borderRadius: '26px 26px 8px 8px',
          background: 'linear-gradient(180deg,#243444 0%,#101A24 70%)',
          boxShadow: 'inset 0 0 0 1px rgba(140,186,214,0.12)',
        }}
      />
    ))}
    {/* floor */}
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 460, background: 'linear-gradient(180deg,#0A1219,#04070B 80%)'}} />
    {/* pole */}
    <div style={{position: 'absolute', left: 520, top: 300, width: 12, height: 1200, background: 'linear-gradient(90deg,#8E9CA6,#3A444D 60%,#1A2229)'}} />
    {children}
  </div>
);

export const PhotoFrame: React.FC<{
  w: number;
  h: number;
  rotate?: number;
  children?: React.ReactNode;
  glow?: number;
}> = ({w, h, rotate = 0, children, glow = 1}) => (
  <div
    style={{
      position: 'absolute',
      width: w,
      height: h,
      transform: `rotate(${rotate}deg)`,
      background: 'linear-gradient(160deg,#E9EEF1,#C4CDD3 70%,#98A5AD)',
      boxShadow: `0 10px 24px rgba(0,0,0,0.85), 0 0 ${34 * glow}px rgba(180,222,244,${0.16 * glow})`,
      padding: w * 0.06,
    }}
  >
    <div style={{position: 'absolute', inset: w * 0.06, overflow: 'hidden', background: '#0A1016'}}>{children}</div>
  </div>
);

/* ------------------------------------------------------------------ */
/* handwriting (only used where the narration names written words)     */
/* ------------------------------------------------------------------ */

export const Handwriting: React.FC<{
  text: string;
  size?: number;
  x?: number;
  y?: number;
  write?: number;
  rotate?: number;
  color?: string;
}> = ({text, size = 64, x = 0, y = 0, write = 1, rotate = -3, color = 'rgba(28,38,60,0.92)'}) => {
  const chars = text.split('');
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `rotate(${rotate}deg)`}}>
      <div
        style={{
          fontFamily: '"Comic Sans MS", "Segoe Script", cursive',
          fontSize: size,
          lineHeight: 1.35,
          color,
          letterSpacing: '0.01em',
          whiteSpace: 'pre-wrap',
          maxWidth: size * 12,
        }}
      >
        {chars.map((c, i) => (
          <span
            key={i}
            style={{
              display: 'inline-block',
              opacity: write * chars.length > i ? 1 : 0.08,
              transform: `rotate(${(rnd(i + 3) - 0.5) * 7}deg) translateY(${(rnd(i + 11) - 0.5) * 4}px)`,
            }}
          >
            {c}
          </span>
        ))}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* small text helpers (diegetic only)                                  */
/* ------------------------------------------------------------------ */

export const ScreenLabel: React.FC<{text: string; x?: number; y?: number; size?: number; show?: number}> = ({
  text,
  x = 40,
  y = 40,
  size = 20,
  show = 1,
}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      fontFamily: SANS,
      fontSize: size,
      letterSpacing: '0.22em',
      color: `rgba(198,226,240,${0.7 * show})`,
      textTransform: 'uppercase',
    }}
  >
    {text}
  </div>
);

export const pulseAt = (f: number, at: number, period = 26, len = 14) => {
  const d = (f - at) % period;
  if (f < at || d < 0) return 0;
  return d > len ? 0 : 1 - d / len;
};

export const fadeIn = (f: number, at: number, len = 14) => smooth(clamp01((f - at) / len));
