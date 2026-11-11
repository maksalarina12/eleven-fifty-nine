import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Noah} from './character/Noah';

export const HairTest: React.FC = () => (
  <AbsoluteFill style={{background: '#0A0E13'}}>
    <AbsoluteFill style={{background: 'radial-gradient(700px 900px at 30% 30%, rgba(96,140,178,0.35), transparent 70%)'}} />
    <div style={{position: 'absolute', left: 140, top: 260, width: 800, height: 1400}}>
      <Noah expression="tired" look="camera" viewBox="200 60 200 260" />
    </div>
  </AbsoluteFill>
);
