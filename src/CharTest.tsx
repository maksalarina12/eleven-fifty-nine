import React from 'react';
import {AbsoluteFill, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Noah} from './character/Noah';

const blinkAt = (f: number, start: number) => {
  const d = f - start;
  if (d < 0 || d > 7) return 0;
  return d < 3 ? d / 3 : 1 - (d - 3) / 4;
};

export const CharTest: React.FC = () => {
  const f = useCurrentFrame();
  const push = interpolate(f, [0, 180], [1, 1.075]);
  const sway = Math.sin(f / 42) * 2.2;
  const breath = 1 + Math.sin(f / 26) * 0.004;
  const blink = Math.max(blinkAt(f, 58), blinkAt(f, 132), blinkAt(f, 165) * 0.8);
  const rain = (offset: number) => ({
    position: 'absolute' as const,
    inset: 0,
    backgroundImage:
      'repeating-linear-gradient(101deg, transparent 0px, transparent 26px, rgba(178,211,236,0.20) 27px, rgba(178,211,236,0.02) 29px, transparent 31px)',
    transform: `translate(${offset}px, ${offset * 3.2}px)`,
    opacity: 0.5,
  });

  return (
    <AbsoluteFill style={{backgroundColor: '#05070A', overflow: 'hidden'}}>
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(820px 1100px at 20% 30%, rgba(86,132,172,0.45), transparent 66%), radial-gradient(620px 760px at 92% 66%, rgba(206,124,74,0.22), transparent 70%), linear-gradient(180deg,#090E14 0%,#05070A 100%)',
        }}
      />

      <div style={{position: 'absolute', inset: 0, transform: `scale(${push})`, transformOrigin: '50% 62%'}}>
        {/* window light shaft */}
        <div style={{position: 'absolute', left: -60, top: -100, width: 260, height: 2200, background: 'linear-gradient(180deg, rgba(150,196,230,0.22), rgba(150,196,230,0.02))', filter: 'blur(34px)', transform: 'rotate(7deg)'}} />
        <div style={{position: 'absolute', left: 96, top: 0, width: 2, height: 1920, background: 'rgba(186,220,244,0.4)', filter: 'blur(1.5px)'}} />

        <div
          style={{
            position: 'absolute',
            left: '50%',
            bottom: -180,
            width: 1160,
            height: 1600,
            transform: `translateX(calc(-50% + ${sway}px)) scaleY(${breath})`,
            transformOrigin: '50% 100%',
            filter: 'drop-shadow(0 30px 70px rgba(0,0,0,0.9))',
          }}
        >
          <Noah expression="tired" look="camera" lidOverride={blink} rim={0.55} viewBox="160 70 280 380" />
        </div>

        <div style={rain((f * 2.2) % 400)} />
        <div style={{...rain((f * 3.4) % 520), opacity: 0.22, filter: 'blur(1.2px)'}} />
      </div>

      <AbsoluteFill style={{background: 'radial-gradient(ellipse 62% 58% at 50% 44%, transparent 38%, rgba(0,0,0,0.9) 100%)'}} />
      <AbsoluteFill
        style={{
          backgroundImage: `url(${staticFile('grain.png')})`,
          backgroundSize: '540px 960px',
          backgroundPosition: `${(f * 41) % 540}px ${(f * 67) % 960}px`,
          opacity: 0.16,
          mixBlendMode: 'overlay',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 72,
          bottom: 96,
          fontFamily: 'MesloX, monospace',
          fontSize: 18,
          letterSpacing: '0.3em',
          color: 'rgba(236,231,220,0.35)',
        }}
      >
        NOAH · LOOK TEST 01
      </div>
    </AbsoluteFill>
  );
};
