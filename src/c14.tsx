import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {Part9} from './Part9';
const Root: React.FC = () => (
  <Composition id="Part9" component={Part9} durationInFrames={2831} fps={30} width={1080} height={1920} />
);
registerRoot(Root);
