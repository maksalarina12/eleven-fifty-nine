import React from 'react';
import {Composition} from 'remotion';
import {CharTest} from './CharTest';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="NoahTest" component={CharTest} durationInFrames={30} fps={30} width={1080} height={1350} />
  </>
);
