import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {S02E10} from './S02E10';

const Root: React.FC = () => (
  <Composition id="S02E10" component={S02E10} durationInFrames={1406} fps={30} width={1080} height={1920} />
);

registerRoot(Root);
