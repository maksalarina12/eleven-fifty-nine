import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {EliasTest} from './EliasTest';
const Root: React.FC = () => (
  <Composition id="EliasTest" component={EliasTest} durationInFrames={2} fps={30} width={1080} height={1920} />
);
registerRoot(Root);
