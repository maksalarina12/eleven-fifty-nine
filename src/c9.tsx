import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {Part4} from './Part4';
const Root: React.FC = () => (
  <Composition id="Part4" component={Part4} durationInFrames={1816} fps={30} width={1080} height={1920} />
);
registerRoot(Root);
