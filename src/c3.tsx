import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {CharTest} from './CharTest';
const Root: React.FC = () => (
  <Composition id="NoahTest" component={CharTest} durationInFrames={180} fps={30} width={1080} height={1920} />
);
registerRoot(Root);
