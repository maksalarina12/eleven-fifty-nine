import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Noah} from './character/Noah';
import type {Expression, Look} from './character/Noah';

const panels: {e: Expression; look: Look; label: string}[] = [
  {e: 'tired', look: 'camera', label: 'tired'},
  {e: 'neutral', look: 'camera', label: 'neutral'},
  {e: 'alert', look: 'right', label: 'alert'},
  {e: 'fear', look: 'door', label: 'fear'},
  {e: 'sad', look: 'down', label: 'sad'},
  {e: 'relief', look: 'camera', label: 'relief'},
];

export const SceneSheet: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#0A0C10'}}>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 30%, #1C2530 0%, #0A0C10 70%)'}} />
      <AbsoluteFill style={{display: 'flex', flexDirection: 'row', alignItems: 'center', padding: 30, gap: 10}}>
        {panels.map((p) => (
          <div key={p.label} style={{flex: 1, height: 900, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <div style={{flex: 1, width: '100%', position: 'relative'}}>
              <Noah expression={p.e} look={p.look} glasses={p.label === 'fear'} viewBox="150 60 300 500" />
            </div>
            <div style={{fontFamily: 'MesloX, monospace', fontSize: 18, color: '#7E8A96', letterSpacing: '0.2em', marginTop: 8}}>
              {p.label.toUpperCase()}
            </div>
          </div>
        ))}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
