import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {Part8} from './Part8';
const Root: React.FC = () => (
  <Composition id="Part8" component={Part8} durationInFrames={2329} fps={30} width={1080} height={1920} />
);
registerRoot(Root);
