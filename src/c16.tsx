import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {S02E01} from './S02E01';

const Root: React.FC = () => (
  <Composition id="S02E01" component={S02E01} durationInFrames={1281} fps={30} width={1080} height={1920} />
);

registerRoot(Root);
