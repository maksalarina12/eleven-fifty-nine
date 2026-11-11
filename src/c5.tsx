import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {Episode} from './Episode';
const Root: React.FC = () => (
  <Composition id="Episode" component={Episode} durationInFrames={1800} fps={30} width={1080} height={1920} />
);
registerRoot(Root);
