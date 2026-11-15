import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {S02E02} from './S02E02';

const Root: React.FC = () => (
  <Composition id="S02E02" component={S02E02} durationInFrames={1262} fps={30} width={1080} height={1920} />
);

registerRoot(Root);
