import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {S02E04} from './S02E04';

const Root: React.FC = () => (
  <Composition id="S02E04" component={S02E04} durationInFrames={1320} fps={30} width={1080} height={1920} />
);

registerRoot(Root);
