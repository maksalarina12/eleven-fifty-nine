import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {Part2} from './Part2';
const Root: React.FC = () => (
  <Composition id="Part2" component={Part2} durationInFrames={1358} fps={30} width={1080} height={1920} />
);
registerRoot(Root);
