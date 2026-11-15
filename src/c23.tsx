import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {S02E08} from './S02E08';

const Root: React.FC = () => (
  <Composition id="S02E08" component={S02E08} durationInFrames={1178} fps={30} width={1080} height={1920} />
);

registerRoot(Root);
