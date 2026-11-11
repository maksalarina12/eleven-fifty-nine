import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {DrElias, DrEliasBack} from './character/DrElias';
import {Vignette, Grain} from './Episode';

const Box: React.FC<{x: number; y: number; w: number; h: number; children: React.ReactNode; dim?: number}> = ({
  x,
  y,
  w,
  h,
  children,
  dim = 1,
}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: w,
      height: h,
      filter: `drop-shadow(0 24px 50px rgba(0,0,0,0.85)) brightness(${dim})`,
    }}
  >
    {children}
  </div>
);

export const EliasTest: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg,#0B1118,#05070A)'}}>
      <AbsoluteFill style={{background: 'radial-gradient(1000px 1000px at 46% 30%, rgba(64,112,145,0.22), transparent 72%)'}} />
      <Box x={10} y={240} w={420} h={1560}>
        <DrElias expression="calm" look="camera" rim={1.1} />
      </Box>
      <Box x={420} y={120} w={620} h={760}>
        <DrElias expression="cold" look="monitor" screen={0.6} rim={1.1} viewBox="200 80 220 250" preserve="xMidYMid slice" />
      </Box>
      <Box x={420} y={900} w={320} h={780}>
        <DrElias expression="speak" look="left" mouth={0.4} rim={1} />
      </Box>
      <Box x={730} y={940} w={330} h={720} dim={0.8}>
        <DrEliasBack rim={1.2} />
      </Box>
      <Vignette strength={0.8} />
      <Grain f={f} opacity={0.06} />
    </AbsoluteFill>
  );
};
