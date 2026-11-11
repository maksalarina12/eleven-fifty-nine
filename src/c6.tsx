import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {HairTest} from './HairTest';
const Root: React.FC = () => <Composition id="HairTest" component={HairTest} durationInFrames={30} fps={30} width={1080} height={1920} />;
registerRoot(Root);
