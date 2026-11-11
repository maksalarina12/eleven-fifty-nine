import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {ShotTest} from './ShotTest';
const Root: React.FC = () => (
  <Composition id="ShotTest" component={ShotTest} durationInFrames={240} fps={30} width={1080} height={1920} />
);
registerRoot(Root);
