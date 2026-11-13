import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {Part6} from './Part6';

const Root: React.FC = () => (
  <Composition id="Part6" component={Part6} durationInFrames={2497} fps={30} width={1080} height={1920} />
);

registerRoot(Root);
