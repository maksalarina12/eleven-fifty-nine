import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {Part7} from './Part7';
const Root: React.FC = () => (
  <Composition id="Part7" component={Part7} durationInFrames={2212} fps={30} width={1080} height={1920} />
);
registerRoot(Root);
