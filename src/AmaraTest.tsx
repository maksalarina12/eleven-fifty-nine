import React from 'react';
import {AbsoluteFill} from 'remotion';
import {AmaraBack} from './character/Amara';

const Box: React.FC<{x: number; y: number; w: number; h: number; viewBox: string; bright?: number}> = ({
  x,
  y,
  w,
  h,
  viewBox,
  bright = 1,
}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, height: h, filter: `brightness(${bright})`}}>
    <AmaraBack rim={1.5} viewBox={viewBox} preserve="xMidYMid meet" />
  </div>
);

export const AmaraTest: React.FC = () => (
  <AbsoluteFill style={{background: 'linear-gradient(180deg,#0C1219,#05080C)'}}>
    <Box x={0} y={180} w={540} h={1600} viewBox="0 0 300 700" bright={1.45} />
    <Box x={560} y={60} w={500} h={640} viewBox="58 30 186 240" bright={1.7} />
    <Box x={560} y={760} w={500} h={1040} viewBox="0 0 300 700" bright={1.4} />
  </AbsoluteFill>
);
