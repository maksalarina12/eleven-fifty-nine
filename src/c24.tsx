import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {S02E09} from './S02E09';

const Root: React.FC = () => (
  <Composition id="S02E09" component={S02E09} durationInFrames={1315} fps={30} width={1080} height={1920} />
);

registerRoot(Root);
