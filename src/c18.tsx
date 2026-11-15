import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {S02E03} from './S02E03';

const Root: React.FC = () => (
  <Composition id="S02E03" component={S02E03} durationInFrames={1432} fps={30} width={1080} height={1920} />
);

registerRoot(Root);
