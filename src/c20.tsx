import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {S02E05} from './S02E05';

const Root: React.FC = () => (
  <Composition id="S02E05" component={S02E05} durationInFrames={1228} fps={30} width={1080} height={1920} />
);

registerRoot(Root);
