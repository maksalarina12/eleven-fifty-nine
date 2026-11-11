import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {CharTest} from './CharTest';
const Root: React.FC = () => <Composition id="NoahTest" component={CharTest} durationInFrames={30} fps={30} width={1080} height={1350} />;
registerRoot(Root);
