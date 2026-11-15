import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {S02E06} from './S02E06';

const Root: React.FC = () => (
  <Composition id="S02E06" component={S02E06} durationInFrames={1221} fps={30} width={1080} height={1920} />
);

registerRoot(Root);
