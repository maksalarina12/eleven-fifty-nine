import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {Part3} from './Part3';
const Root: React.FC = () => (
  <Composition id="Part3" component={Part3} durationInFrames={1304} fps={30} width={1080} height={1920} />
);
registerRoot(Root);
