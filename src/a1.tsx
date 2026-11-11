import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {AmaraTest} from './AmaraTest';
const Root: React.FC = () => (
  <Composition id="AmaraTest" component={AmaraTest} durationInFrames={2} fps={30} width={1080} height={1920} />
);
registerRoot(Root);
