import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {Part10} from './Part10';
const Root: React.FC = () => (
  <Composition id="Part10" component={Part10} durationInFrames={3733} fps={30} width={1080} height={1920} />
);
registerRoot(Root);
