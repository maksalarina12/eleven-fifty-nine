import React from 'react';
import {AbsoluteFill, Composition, registerRoot} from 'remotion';
import {Noah} from './character/Noah';
const T: React.FC = () => (
  <AbsoluteFill style={{background: '#111'}}>
    <div style={{width: 600, height: 1200}}>
      <Noah expression="tired" look="camera" />
    </div>
  </AbsoluteFill>
);
const Root: React.FC = () => <Composition id="N1" component={T} durationInFrames={30} fps={30} width={600} height={1200} />;
registerRoot(Root);
