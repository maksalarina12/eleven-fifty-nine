import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {S02E07} from './S02E07';

const Root: React.FC = () => (
  <Composition id="S02E07" component={S02E07} durationInFrames={1228} fps={30} width={1080} height={1920} />
);

registerRoot(Root);
