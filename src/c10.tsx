import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {Part5} from './Part5';
const Root: React.FC = () => (
  <Composition id="Part5" component={Part5} durationInFrames={2020} fps={30} width={1080} height={1920} />
);
registerRoot(Root);
