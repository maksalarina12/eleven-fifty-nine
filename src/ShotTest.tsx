import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';

const Bokeh: React.FC<{f: number}> = ({f}) => {
  const dots = [
    [110, 470, 9, '#7FA6C8'], [180, 560, 6, '#C8A278'], [250, 500, 12, '#8FB6D6'],
    [330, 610, 5, '#D9B08A'], [400, 540, 8, '#6E93B4'], [150, 680, 5, '#B78E68'],
    [300, 730, 10, '#7FA6C8'], [430, 760, 6, '#E0B48C'], [210, 800, 4, '#9FC2DE'],
    [360, 880, 7, '#B78E68'], [120, 620, 4, '#8FB6D6'], [450, 660, 4, '#D9B08A'],
  ];
  return (
    <>
      {dots.map(([x, y, r, c], i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: Number(x) - Number(r),
            top: Number(y) - Number(r) + Math.sin((f + i * 20) / 60) * 2,
            width: Number(r) * 2,
            height: Number(r) * 2,
            borderRadius: 99,
            background: String(c),
            filter: 'blur(2px)',
            opacity: 0.55,
          }}
        />
      ))}
    </>
  );
};

export const ShotTest: React.FC = () => {
  const f = useCurrentFrame();
  const push = interpolate(f, [0, 240], [1, 1.045]);
  const rainShift = (f * 2.6) % 300;
  const flicker = 0.96 + Math.sin(f / 7) * 0.02 + Math.sin(f / 23) * 0.02;

  return (
    <AbsoluteFill style={{backgroundColor: '#05070A', overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${push})`, transformOrigin: '46% 54%'}}>
        {/* wall */}
        <AbsoluteFill style={{background: 'linear-gradient(160deg,#0C1118 0%,#080B10 55%,#06080B 100%)'}} />
        <AbsoluteFill style={{background: 'radial-gradient(700px 900px at 24% 42%, rgba(90,140,180,0.30), transparent 68%), radial-gradient(500px 600px at 82% 66%, rgba(198,120,66,0.16), transparent 70%)'}} />

        {/* window */}
        <div style={{position: 'absolute', left: 60, top: 320, width: 420, height: 640, background: '#0A1219', border: '14px solid #0B0D10', boxShadow: 'inset 0 0 80px rgba(0,0,0,0.9)', overflow: 'hidden'}}>
          <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg,#16283A 0%,#0E1A26 55%,#0A1018 100%)'}} />
          <Bokeh f={f} />
          <div style={{position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(100deg, transparent 0 22px, rgba(170,205,232,0.22) 23px, rgba(170,205,232,0.02) 25px, transparent 27px)', transform: `translate(${rainShift * 0.3}px, ${rainShift}px)`, opacity: 0.7}} />
          <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(120deg, rgba(150,190,220,0.16), transparent 55%)'}} />
          <div style={{position: 'absolute', left: '50%', top: 0, bottom: 0, width: 10, marginLeft: -5, background: '#0B0D10'}} />
          <div style={{position: 'absolute', top: '48%', left: 0, right: 0, height: 10, background: '#0B0D10'}} />
        </div>
        {/* window sill */}
        <div style={{position: 'absolute', left: 40, top: 960, width: 470, height: 16, background: '#12161B', boxShadow: '0 8px 24px rgba(0,0,0,0.7)'}} />

        {/* desk + phone glow */}
        <div style={{position: 'absolute', left: 90, top: 976, width: 380, height: 180}}>
          <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg,#171B20,#0C0F13)'}} />
          <div style={{position: 'absolute', left: 170, top: 18, width: 46, height: 84, borderRadius: 8, background: '#0A0C0F', border: '1px solid #262C33', boxShadow: '0 0 34px 8px rgba(96,150,200,0.22)'}} />
          <div style={{position: 'absolute', left: 176, top: 26, width: 34, height: 68, borderRadius: 4, background: 'linear-gradient(180deg,#9FC6E8,#5E86A8)', opacity: 0.55}} />
        </div>
        {/* lamp glow */}
        <div style={{position: 'absolute', left: 380, top: 780, width: 220, height: 220, borderRadius: '50%', background: 'radial-gradient(circle, rgba(240,172,110,0.38), transparent 65%)', filter: 'blur(12px)', opacity: flicker}} />
        <div style={{position: 'absolute', left: 470, top: 900, width: 44, height: 60, background: '#1A1512', borderRadius: '4px 4px 2px 2px'}} />

        {/* door */}
        <div style={{position: 'absolute', left: 800, top: 250, width: 210, height: 990, background: 'linear-gradient(100deg,#0D1014,#090B0E 60%,#07090C)', border: '8px solid #0A0C0F', boxShadow: 'inset 0 0 60px rgba(0,0,0,0.85), 0 0 40px rgba(0,0,0,0.6)'}}>
          <div style={{position: 'absolute', left: 14, top: 0, bottom: 0, width: 1, background: 'rgba(150,180,205,0.14)'}} />
          <div style={{position: 'absolute', left: 26, top: 120, right: 26, height: 300, border: '1px solid rgba(180,200,220,0.05)'}} />
          <div style={{position: 'absolute', left: 26, top: 480, right: 26, height: 380, border: '1px solid rgba(180,200,220,0.04)'}} />
          <div style={{position: 'absolute', right: 22, top: 500, width: 10, height: 10, borderRadius: 99, background: '#3A3F45'}} />
        </div>

        {/* floor */}
        <div style={{position: 'absolute', left: 0, right: 0, top: 1240, height: 680, background: 'linear-gradient(180deg,#0A0C0F 0%,#06080A 60%,#040507 100%)'}} />
        <div style={{position: 'absolute', left: 0, right: 0, top: 1240, height: 1, background: 'rgba(160,190,215,0.10)'}} />

        {/* Noah */}
        <div style={{position: 'absolute', left: 560, bottom: 300, width: 420, height: 700}}>
          <div style={{position: 'absolute', left: 40, bottom: -10, width: 340, height: 60, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(0,0,0,0.85), transparent 70%)', filter: 'blur(8px)'}} />
          <Img
            src={staticFile('noah/body.png')}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              filter: 'brightness(0.82) contrast(1.06) saturate(0.82) drop-shadow(0 0 16px rgba(120,170,210,0.18))',
            }}
          />
        </div>

        {/* foreground haze */}
        <div style={{position: 'absolute', left: -100, top: 900, width: 700, height: 700, background: 'radial-gradient(circle, rgba(110,150,185,0.10), transparent 65%)', filter: 'blur(20px)'}} />
      </AbsoluteFill>

      <AbsoluteFill style={{background: 'radial-gradient(ellipse 62% 60% at 48% 46%, transparent 30%, rgba(0,0,0,0.88) 100%)'}} />
      <AbsoluteFill style={{backgroundImage: `url(${staticFile('grain.png')})`, backgroundSize: '540px 960px', backgroundPosition: `${(f * 41) % 540}px ${(f * 67) % 960}px`, opacity: 0.15, mixBlendMode: 'overlay'}} />

      {/* watermark */}
      <div style={{position: 'absolute', right: 44, top: 56, fontFamily: 'GeorgiaX, Georgia, serif', fontSize: 20, letterSpacing: '0.22em', color: 'rgba(236,231,220,0.35)'}}>
        EldraMyth
      </div>

      {/* subtitle */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 1430, textAlign: 'center', fontFamily: 'InterX, sans-serif', fontSize: 40, color: '#F2EEE6', textShadow: '0 2px 10px rgba(0,0,0,0.95), 0 0 3px rgba(0,0,0,1)'}}>
        The rain had been falling for hours.
      </div>
    </AbsoluteFill>
  );
};
