import React from 'react';

export type EliasExpression = 'calm' | 'cold' | 'stare' | 'speak' | 'concern' | 'whisper';
export type EliasLook = 'camera' | 'left' | 'right' | 'down' | 'monitor';

type Props = {
  expression?: EliasExpression;
  look?: EliasLook;
  mouth?: number;
  turn?: number;
  rim?: number;
  screen?: number;
  lidOverride?: number;
  preserve?: string;
  viewBox?: string;
  style?: React.CSSProperties;
};

const LID: Record<EliasExpression, number> = {
  calm: 0.2,
  cold: 0.32,
  stare: 0.08,
  speak: 0.14,
  concern: 0.1,
  whisper: 0.26,
};

const BROW: Record<EliasExpression, {y: number; inner: number; outer: number; w: number}> = {
  calm: {y: 0, inner: 0, outer: 0, w: 3.8},
  cold: {y: 1.8, inner: 2.6, outer: -1.4, w: 3.9},
  stare: {y: -1, inner: 0.6, outer: -1.6, w: 3.8},
  speak: {y: -1.2, inner: -0.6, outer: 0.4, w: 3.7},
  concern: {y: -2.8, inner: -5, outer: 1.4, w: 3.5},
  whisper: {y: -2.4, inner: -4.4, outer: 0.8, w: 3.5},
};

const MOUTH_DEFAULT: Record<EliasExpression, number> = {
  calm: 0,
  cold: 0,
  stare: 0,
  speak: 0.18,
  concern: 0.04,
  whisper: 0.1,
};

const LOOK: Record<EliasLook, {x: number; y: number; head: number}> = {
  camera: {x: 0, y: 0, head: 0},
  left: {x: -2.4, y: 0.2, head: -0.26},
  right: {x: 2.4, y: 0.2, head: 0.26},
  down: {x: 0.3, y: 1.9, head: 0.12},
  monitor: {x: 2.8, y: -0.3, head: 0.3},
};

const EYE_PATH =
  'M -19 0.6 C -16.2 -6.8 -7.6 -9.4 1 -9 C 9.6 -8.6 15.8 -5.2 18.4 -0.6 C 13.2 5.4 4.4 8 -3 7.4 C -10.4 6.8 -16.8 4.2 -19 0.6 Z';

const Eye: React.FC<{
  cx: number;
  cy: number;
  lid: number;
  lookX: number;
  lookY: number;
  cold?: boolean;
  screen?: number;
  flip?: boolean;
  clipId: string;
}> = ({cx, cy, lid, lookX, lookY, cold, screen = 0, flip, clipId}) => {
  const s = flip ? 1 : -1;
  const ix = lookX * 1.5 * s;
  const iy = 0.2 + lookY * 0.9;
  const d = 1.5 + lid * 6.2;
  const lidEdge = `M -18.6 ${0.6 + d} C -15.8 ${-7.4 + d} -7 ${-10.2 + d} 1.4 ${-9.8 + d} C 9.6 ${-9.4 + d} 15.8 ${-6 + d} 19.2 ${-0.2 + d}`;
  return (
    <g transform={`translate(${cx} ${cy}) scale(${s * 0.86} 0.72)`}>
      {/* deep socket */}
      <ellipse cx={0} cy={-3.6} rx={19} ry={11} fill="#33200F" opacity={0.26} filter="url(#eSoft2)" />
      <path d="M -18 -3 Q 0 -12 18 -3.4 Q 1 -7.6 -18 -3 Z" fill="#6E4A3B" opacity={0.2} filter="url(#eSoft2)" />
      {/* sclera */}
      <path d={EYE_PATH} fill="#746254" />
      <g clipPath={`url(#${clipId})`}>
        <circle cx={ix} cy={iy} r={7.4} fill="#4C585C" />
        <circle cx={ix} cy={iy} r={7.4} fill="url(#eIris)" opacity={0.95} />
        <circle cx={ix} cy={iy + 0.3} r={3.2} fill="#080A0B" />
        <circle cx={ix - 0.3 * s} cy={iy + 3.1} r={1.8} fill="#93A8AC" opacity={0.28} />
        <circle cx={ix - 2 * s} cy={iy - 2.2} r={1.2} fill="#F8F2E9" opacity={0.85} />
        <circle cx={ix + 1.9 * s} cy={iy + 2.2} r={0.7} fill="#E2D3C1" opacity={0.5} />
        {screen > 0.02 ? (
          <g opacity={Math.min(1, screen)}>
            <rect x={ix - 5.2} y={iy - 5} width={10.4} height={6.4} rx={0.8} fill="#BFE6F5" opacity={0.5} />
            <rect x={ix - 4.2} y={iy - 4.2} width={3} height={4.4} fill="#EAF7FC" opacity={0.5} />
            <rect x={ix + 0.2} y={iy - 3.9} width={2.5} height={3.7} fill="#9FCFE4" opacity={0.38} />
          </g>
        ) : null}
        {/* the lid itself, covering the top of the sclera */}
        <path
          d={`M -22 -14 L 22 -14 L 22 ${0.6 + d} C 15.8 ${-6 + d} 9.6 ${-9.4 + d} 1.4 ${-9.8 + d} C -7 ${-10.2 + d} -15.8 ${-7.4 + d} -18.6 ${0.6 + d} Z`}
          fill="#9C7A67"
        />
        <path d={`M -22 -14 L 22 -14 L 22 ${2.2 + d} Q 0 ${-3.4 + d} -22 ${2.2 + d} Z`} fill="#160C07" opacity={0.34 + lid * 0.3} filter="url(#eSoft1)" />
        <path d={`M -20 ${-0.6 + d} Q 0 ${-6 + d} 20 ${-0.8 + d} L 20 -12 L -20 -12 Z`} fill="#2A1A14" opacity={0.3 + lid * 0.26} />
      </g>
      {/* lash line, sitting on the lid edge */}
      <path d={lidEdge} fill="none" stroke="#1E1310" strokeWidth={cold ? 1.8 : 1.6} strokeLinecap="round" />
      <path
        d={`M -17.8 ${0.4 + d} C -14.6 ${-4.8 + d} -10.4 ${-7.8 + d} -5.2 ${-9.2 + d}`}
        fill="none"
        stroke="#241814"
        strokeWidth={1}
        strokeLinecap="round"
        opacity={0.6}
      />
      <path d={`M 13.6 3.2 C 7 5.8 -1.4 6 -8.4 4.2`} fill="none" stroke="#8A6552" strokeWidth={1} opacity={0.35} filter="url(#eSoft1)" />
      <path d={`M -14.6 1.4 C -9.4 3.6 -3.4 4.2 2 3.4`} fill="none" stroke="#E4BFA8" strokeWidth={0.9} opacity={0.16} filter="url(#eSoft1)" />
      <path
        d={`M 15 ${-4.2 + d} Q 19 ${-3.6 + d} 20.6 ${-1.2 + d}`}
        fill="none"
        stroke="#241814"
        strokeWidth={1}
        strokeLinecap="round"
        opacity={0.85}
      />
      {/* age lines */}
      <path d={`M -15 ${-7.6 + d * 0.6} Q 0 ${-13.4 + d * 0.6} 16 ${-8 + d * 0.6} L 16 ${-6.6 + d * 0.6} Q 0 ${-11.8 + d * 0.6} -15 ${-6.2 + d * 0.6} Z`} fill="#7A5142" opacity={0.16} filter="url(#eSoft1)" />
      <path d={`M -5 ${-11 + d * 0.8} Q 4 ${-12.6 + d * 0.8} 13 ${-9.4 + d * 0.8}`} fill="none" stroke="#956853" strokeWidth={0.7} opacity={0.26} />
      <path d="M -9.4 6.6 C -2.8 8.4 6 7.2 13.4 1.8" fill="none" stroke="#7C5647" strokeWidth={0.65} opacity={0.32} />
      <path d="M -8 8.4 C -1.4 10 5.8 9.2 12 4.6" fill="none" stroke="#6A4437" strokeWidth={0.5} opacity={0.14} filter="url(#eSoft1)" />
      <path d="M 18.6 -2 Q 22.6 -0.6 23.6 2.2" fill="none" stroke="#7C5647" strokeWidth={0.5} opacity={0.22} />
      <path d="M 18.4 0.4 Q 22 1.6 22.8 3.6" fill="none" stroke="#7C5647" strokeWidth={0.45} opacity={0.16} />
    </g>
  );
};

export const DrElias: React.FC<Props> = ({
  expression = 'calm',
  look = 'camera',
  mouth,
  turn = 0,
  rim = 1,
  screen = 0,
  lidOverride,
  preserve = 'xMidYMax meet',
  viewBox = '0 0 600 1200',
  style,
}) => {
  const lid = Math.max(LID[expression], lidOverride ?? 0);
  const brow = BROW[expression];
  const lk = LOOK[look];
  const t = Math.max(-1, Math.min(1, turn + lk.head * 0.34));
  const faceShift = t * 5.5;
  const hairShift = t * 3.4;
  const mouthOpen = Math.max(0, Math.min(1, mouth ?? MOUTH_DEFAULT[expression]));
  const cold = expression === 'cold' || expression === 'stare' || expression === 'whisper';
  const mouthW = 15.8;
  const smile = expression === 'concern' ? -1.2 : expression === 'cold' ? -0.6 : expression === 'whisper' ? -0.3 : 0;

  return (
    <svg viewBox={viewBox} width="100%" height="100%" style={style} preserveAspectRatio={preserve}>
      <defs>
        <linearGradient id="eSkin" x1="0.16" y1="0" x2="0.95" y2="1">
          <stop offset="0%" stopColor="#D2AE98" />
          <stop offset="32%" stopColor="#BC907A" />
          <stop offset="64%" stopColor="#9A7160" />
          <stop offset="88%" stopColor="#7C5848" />
          <stop offset="100%" stopColor="#5F4335" />
        </linearGradient>
        <linearGradient id="eSkinArm" x1="0" y1="0" x2="0.2" y2="1">
          <stop offset="0%" stopColor="#C9A28C" />
          <stop offset="100%" stopColor="#7E5B4A" />
        </linearGradient>
        <linearGradient id="eHair" x1="0.1" y1="0" x2="0.95" y2="1">
          <stop offset="0%" stopColor="#868B8F" />
          <stop offset="26%" stopColor="#656A6E" />
          <stop offset="55%" stopColor="#494E53" />
          <stop offset="80%" stopColor="#2E3337" />
          <stop offset="100%" stopColor="#1C2023" />
        </linearGradient>
        <linearGradient id="eHairShade" x1="0.2" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7B8185" />
          <stop offset="48%" stopColor="#54595E" />
          <stop offset="80%" stopColor="#30353A" />
          <stop offset="100%" stopColor="#191D21" />
        </linearGradient>
        <linearGradient id="eCoat" x1="0.08" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor="#2C323B" />
          <stop offset="40%" stopColor="#1A1F26" />
          <stop offset="100%" stopColor="#07090D" />
        </linearGradient>
        <linearGradient id="eCoatArm" x1="0" y1="0" x2="1" y2="0.3">
          <stop offset="0%" stopColor="#1B2028" />
          <stop offset="55%" stopColor="#111620" />
          <stop offset="100%" stopColor="#090B0F" />
        </linearGradient>
        <linearGradient id="eShirt" x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor="#24282F" />
          <stop offset="55%" stopColor="#111418" />
          <stop offset="100%" stopColor="#07080B" />
        </linearGradient>
        <linearGradient id="eRimCool" x1="0" y1="0" x2="1" y2="0.4">
          <stop offset="0%" stopColor="#CFEAF8" stopOpacity="1" />
          <stop offset="44%" stopColor="#79AECB" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#6DA3C2" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="eRimWarm" x1="1" y1="0" x2="0" y2="0.5">
          <stop offset="0%" stopColor="#E8AE82" stopOpacity="0.85" />
          <stop offset="55%" stopColor="#A66B44" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#A66B44" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="eFaceLight" cx="0.27" cy="0.24" r="1">
          <stop offset="0%" stopColor="#FFEDDD" stopOpacity="0.34" />
          <stop offset="45%" stopColor="#E9C7B2" stopOpacity="0.02" />
          <stop offset="100%" stopColor="#160C07" stopOpacity="0.44" />
        </radialGradient>
        <linearGradient id="eKeyShade" x1="0.42" y1="0.1" x2="1" y2="0.62">
          <stop offset="0%" stopColor="#0A0F16" stopOpacity="0" />
          <stop offset="52%" stopColor="#0A0F16" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#050A10" stopOpacity="0.62" />
        </linearGradient>
        <radialGradient id="eIris" cx="0.38" cy="0.3" r="0.8">
          <stop offset="0%" stopColor="#9CAAAD" stopOpacity="0.42" />
          <stop offset="55%" stopColor="#4E5A5E" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#12171A" stopOpacity="0.82" />
        </radialGradient>
        <linearGradient id="eLip" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="#8E6C62" />
          <stop offset="55%" stopColor="#75534D" />
          <stop offset="100%" stopColor="#573D39" />
        </linearGradient>
        <linearGradient id="eBodyShade" x1="0" y1="0" x2="0.2" y2="1">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.42" />
          <stop offset="30%" stopColor="#000000" stopOpacity="0.02" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.8" />
        </linearGradient>
        <filter id="eGrain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="11" result="n" />
          <feColorMatrix in="n" type="saturate" values="0" result="g" />
          <feComponentTransfer in="g">
            <feFuncA type="linear" slope="0.55" intercept="0" />
          </feComponentTransfer>
        </filter>
        <clipPath id="eEyeClipL"><path d={EYE_PATH} /></clipPath>
        <clipPath id="eEyeClipR"><path d={EYE_PATH} /></clipPath>
        <clipPath id="eFaceClip">
          <path d="M 300 114 C 268 114 243 134 240 168 C 238 186 240 204 244 220 L 252 244 C 258 262 269 274 284 281 C 289 284 294 286 300 286 C 306 286 311 284 316 281 C 331 274 342 262 348 244 L 356 220 C 360 204 362 186 360 168 C 357 134 332 114 300 114 Z" />
        </clipPath>
        <filter id="eSoft1" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="1.2" />
        </filter>
        <filter id="eSoft2" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>

      {/* ---------- legs ---------- */}
      <g transform={`translate(${t * 2} 0)`}>
        <path d="M 248 676 L 240 1006 L 282 1006 L 296 682 Z" fill="#090B0F" />
        <path d="M 352 676 L 360 1006 L 318 1006 L 304 682 Z" fill="#0C0E12" />
        <path d="M 240 1006 L 226 1056 L 288 1056 L 282 1006 Z" fill="#05070A" />
        <path d="M 360 1006 L 374 1056 L 312 1056 L 318 1006 Z" fill="#07090C" />
        <path d="M 226 1056 Q 222 1070 232 1072 L 290 1072 Q 298 1066 288 1056 Z" fill="#12151A" />
        <path d="M 374 1056 Q 378 1070 368 1072 L 310 1072 Q 302 1066 312 1056 Z" fill="#14171C" />
        <path d="M 256 700 L 248 988" stroke="#252A32" strokeWidth={1.1} opacity={0.32} />
        <path d="M 346 708 L 354 988" stroke="#282D35" strokeWidth={1} opacity={0.26} />
      </g>

      {/* ---------- neck ---------- */}
      <path d="M 276 240 L 280 302 Q 300 318 320 302 L 324 240 Q 300 262 276 240 Z" fill="url(#eSkinArm)" />
      <path d="M 300 264 L 302 314 L 320 302 L 324 240 Q 306 258 300 264 Z" fill="#2A1710" opacity={0.44} filter="url(#eSoft1)" />
      <path d="M 276 246 L 280 304 L 286 303 L 282 246 Z" fill="#3A2418" opacity={0.3} filter="url(#eSoft1)" />
      <path d="M 281 286 L 280 304 L 292 310 L 292 292 Z" fill="#160C07" opacity={0.3} filter="url(#eSoft1)" />
      <path d="M 276 240 L 277 274 Q 300 292 323 274 L 324 240 Q 300 262 276 240 Z" fill="#3B261C" opacity={0.44} filter="url(#eSoft2)" />
      <path d="M 277 280 Q 300 298 323 280 L 321 300 Q 300 314 279 300 Z" fill="#3E271C" opacity={0.26} filter="url(#eSoft1)" />
      <path d="M 280 302 C 287 312 294 316 300 318 C 306 316 313 312 320 302 L 332 316 Q 300 334 268 316 Z" fill="#6E4C3C" opacity={0.26} filter="url(#eSoft2)" />
      {/* sternocleidomastoid + larynx */}
      <path d="M 282 258 C 286 274 292 288 300 296" stroke="#EDCAB2" strokeWidth={2} fill="none" opacity={0.12} filter="url(#eSoft1)" />
      <path d="M 318 258 C 314 274 308 288 300 296" stroke="#6E4B3A" strokeWidth={1.4} fill="none" opacity={0.22} filter="url(#eSoft1)" />
      <ellipse cx={300} cy={280} rx={4.2} ry={6} fill="#8A6552" opacity={0.22} filter="url(#eSoft1)" />

      {/* ---------- torso: long structured coat ---------- */}
      <g transform={`translate(${t * 2} 0)`}>
        <path
          d="M 300 300
             C 272 300 244 308 224 322
             C 206 336 195 358 191 384
             L 205 512
             L 199 700
             L 401 700
             L 395 512
             L 409 384
             C 405 358 394 336 376 322
             C 356 308 328 300 300 300 Z"
          fill="url(#eCoat)"
        />
        {/* separate sleeve volumes, hanging just outside the body */}
        <path d="M 232 316 C 210 328 194 352 190 382 L 174 570 L 212 576 L 222 452 L 240 372 Z" fill="url(#eCoatArm)" />
        <path d="M 368 316 C 390 328 406 352 410 382 L 426 570 L 388 576 L 378 452 L 360 372 Z" fill="url(#eCoatArm)" />
        {/* structured shoulder line */}
        <path d="M 232 316 C 214 326 201 342 195 364 L 218 372 C 224 350 237 335 250 327 Z" fill="#252B34" opacity={0.45} filter="url(#eSoft2)" />
        <path d="M 370 316 C 388 326 400 342 406 364 L 383 372 C 377 350 364 335 351 327 Z" fill="#191E26" opacity={0.4} filter="url(#eSoft2)" />
        <path d="M 193 364 L 220 374" stroke="#3D4550" strokeWidth={0.9} opacity={0.22} />
        <path d="M 407 364 L 380 374" stroke="#2F363F" strokeWidth={0.9} opacity={0.2} />
        {/* sleeve seams + cuffs, hands resting in pockets */}
        <path d="M 226 330 C 218 380 212 460 210 572" stroke="#0A0E13" strokeWidth={7} fill="none" opacity={0.3} filter="url(#eSoft2)" />
        <path d="M 220 372 C 209 428 202 498 200 570" stroke="#070A0E" strokeWidth={2.4} fill="none" opacity={0.4} filter="url(#eSoft1)" />
        <path d="M 380 372 C 391 428 398 498 400 570" stroke="#05080B" strokeWidth={2.6} fill="none" opacity={0.55} filter="url(#eSoft1)" />
        <path d="M 174 570 L 212 576 L 210 604 L 172 598 Z" fill="#0D1015" />
        <path d="M 426 570 L 388 576 L 390 604 L 428 598 Z" fill="#0A0C10" />
        <path d="M 174 570 L 212 576" stroke="#3C444F" strokeWidth={0.9} opacity={0.35} />
        <path d="M 426 570 L 388 576" stroke="#333A44" strokeWidth={0.9} opacity={0.3} />
        <path d="M 176 524 L 206 528 L 205 548 L 177 544 Z" stroke="#05070A" strokeWidth={1.2} fill="none" opacity={0.45} />
        <path d="M 424 524 L 394 528 L 395 548 L 423 544 Z" stroke="#05070A" strokeWidth={1.2} fill="none" opacity={0.4} />
        {/* high collar + open shirt V */}
        <path d="M 278 300 L 322 300 L 330 328 Q 300 348 270 328 Z" fill="url(#eShirt)" />
        <path d="M 280 295 Q 300 318 320 295" stroke="#3B424C" strokeWidth={1.2} fill="none" opacity={0.45} />
        <path d="M 274 320 L 300 406 L 326 320 Q 300 344 274 320 Z" fill="#0C1015" />
        <path d="M 274 320 L 300 406" stroke="#343B45" strokeWidth={0.9} fill="none" opacity={0.28} />
        <path d="M 326 320 L 300 406" stroke="#2C333C" strokeWidth={0.9} fill="none" opacity={0.26} />
        {/* lapels */}
        <path d="M 266 322 L 300 414 L 286 428 L 244 348 Z" fill="#222831" />
        <path d="M 334 322 L 300 414 L 314 428 L 356 348 Z" fill="#151A20" />
        <path d="M 266 322 L 300 414" stroke="#4B535E" strokeWidth={1.2} fill="none" opacity={0.4} />
        <path d="M 334 322 L 300 414" stroke="#3A424D" strokeWidth={1.1} fill="none" opacity={0.34} />
        <path d="M 244 348 L 286 428" stroke="#05070A" strokeWidth={1.5} fill="none" opacity={0.55} />
        <path d="M 356 348 L 314 428" stroke="#05070A" strokeWidth={1.6} fill="none" opacity={0.6} />
        <path d="M 244 348 L 262 340 L 266 328" stroke="#3E4651" strokeWidth={1} fill="none" opacity={0.3} />
        <path d="M 356 348 L 338 340 L 334 328" stroke="#333B45" strokeWidth={1} fill="none" opacity={0.26} />
        {/* closing seam + buttons */}
        <path d="M 300 430 L 300 688" stroke="#3C444F" strokeWidth={1.1} opacity={0.3} />
        <path d="M 300 430 L 300 688" stroke="#6A7480" strokeWidth={0.35} opacity={0.14} />
        {[474, 538, 602, 664].map((y) => (
          <g key={y}>
            <circle cx={300} cy={y} r={5} fill="#11151B" stroke="#4F5864" strokeWidth={0.9} opacity={0.9} />
            <circle cx={298.6} cy={y - 1.4} r={1.4} fill="#8A94A0" opacity={0.32} />
          </g>
        ))}
        {/* breast pocket + ID badge on his left chest */}
        <path d="M 338 436 L 372 440 L 370 468 L 336 464 Z" stroke="#05070A" strokeWidth={1.2} fill="#10141A" opacity={0.85} />
        <g transform="translate(342 420) rotate(1.4)">
          <rect x={0} y={0} width={32} height={40} rx={3} fill="#151A21" stroke="#5A6470" strokeWidth={0.8} />
          <rect x={4} y={4} width={12} height={15} rx={1} fill="#3C4A55" />
          <circle cx={10} cy={9} r={2.2} fill="#7B8B96" opacity={0.7} />
          <path d="M 5.4 16.4 Q 10 11.8 14.6 16.4" stroke="#7B8B96" strokeWidth={1.5} fill="none" opacity={0.5} />
          <rect x={19} y={5} width={10} height={1.5} fill="#707B87" opacity={0.45} />
          <rect x={19} y={8.6} width={7} height={1.3} fill="#5B6672" opacity={0.38} />
          <rect x={4} y={23} width={24} height={1.2} fill="#4E5864" opacity={0.34} />
          <rect x={4} y={26.6} width={18} height={1} fill="#3F4853" opacity={0.28} />
          <rect x={25} y={-6} width={4} height={8} rx={1.4} fill="#7C8794" opacity={0.45} />
        </g>
        {/* folds */}
        <path d="M 224 460 C 218 530 220 612 226 686" stroke="#2E3540" strokeWidth={1.1} fill="none" opacity={0.26} />
        <path d="M 376 460 C 382 530 380 612 374 686" stroke="#333A45" strokeWidth={1.1} fill="none" opacity={0.22} />
        <path d="M 300 470 C 292 540 293 620 300 690" stroke="#000000" strokeWidth={7} fill="none" opacity={0.1} filter="url(#eSoft2)" />
        <path d="M 190 330 L 410 330 L 410 704 L 190 704 Z" fill="url(#eBodyShade)" opacity={0.4} />
      </g>

      {/* ---------- head ---------- */}
      <g transform={`translate(${faceShift} 0)`}>
        <g transform={`rotate(${t * 1.3} 300 280) translate(300 292) scale(0.8) translate(-300 -292) scale(0.96 1)`}>
          {/* ears */}
          <path d="M 248 192 C 243 190 240 196 241 203 C 242 212 245 220 249 224 C 251 216 251 202 248 192 Z" fill="#B58D78" />
          <path d="M 352 192 C 357 190 360 196 359 203 C 358 212 355 220 351 224 C 349 216 349 202 352 192 Z" fill="#A47C67" />
          <path d="M 244 198 C 242 205 243 213 246 220" stroke="#8A6352" strokeWidth={0.9} fill="none" opacity={0.55} />
          <path d="M 247 201 C 246 207 247 214 248 220" stroke="#D8B49E" strokeWidth={0.8} fill="none" opacity={0.24} />
          <path d="M 356 198 C 358 205 357 213 354 220" stroke="#7B5847" strokeWidth={0.9} fill="none" opacity={0.5} />

          {/* face */}
          <path
            d="M 300 114
               C 268 114 243 134 240 168
               C 238 186 240 204 244 220
               L 252 244
               C 258 262 269 274 284 281
               C 289 284 294 286 300 286
               C 306 286 311 284 316 281
               C 331 274 342 262 348 244
               L 356 220
               C 360 204 362 186 360 168
               C 357 134 332 114 300 114 Z"
            fill="url(#eSkin)"
          />
          <g clipPath="url(#eFaceClip)">
            <rect x="232" y="102" width="136" height="200" fill="#808080" filter="url(#eGrain)" opacity={0.07} style={{mixBlendMode: 'overlay'}} />
            <rect x="234" y="104" width="132" height="196" fill="url(#eFaceLight)" />
            <rect x="234" y="104" width="132" height="196" fill="url(#eKeyShade)" />
            {/* cheek hollows + jaw planes */}
            <ellipse cx={340} cy={224} rx={16} ry={26} fill="#4B2E22" opacity={0.17} filter="url(#eSoft2)" />
            <ellipse cx={260} cy={226} rx={11} ry={22} fill="#5A382A" opacity={0.13} filter="url(#eSoft2)" />
            <path d="M 244 224 Q 262 252 288 270 L 288 290 L 240 290 Z" fill="#3B251B" opacity={0.18} filter="url(#eSoft2)" />
            <path d="M 356 224 Q 338 252 312 270 L 312 290 L 360 290 Z" fill="#2E1C14" opacity={0.3} filter="url(#eSoft2)" />
            <path d="M 300 250 Q 320 262 344 256" stroke="#6E4B3A" strokeWidth={1.2} fill="none" opacity={0.2} filter="url(#eSoft1)" />
            <path d="M 249 208 Q 246 232 258 250" stroke="#8A6352" strokeWidth={1.1} fill="none" opacity={0.24} filter="url(#eSoft1)" />
            {/* the far side falls away into the dark */}
            <path d="M 330 126 C 350 166 356 232 340 288 L 366 288 L 366 126 Z" fill="#150C07" opacity={0.3} filter="url(#eSoft2)" />
            <path d="M 344 150 C 352 190 352 244 342 282" stroke="#0E0805" strokeWidth={6} fill="none" opacity={0.16} filter="url(#eSoft2)" />
            {/* brow casts a shadow into the socket */}
            <path d="M 246 198 C 258 196 272 194 286 196 L 286 204 C 272 200 258 202 248 208 Z" fill="#2A1A12" opacity={0.24} filter="url(#eSoft2)" />
            <path d="M 354 198 C 342 196 328 194 314 196 L 314 204 C 328 200 342 202 352 208 Z" fill="#22150F" opacity={0.26} filter="url(#eSoft2)" />
            {/* nose casts to the right */}
            <path d="M 304 214 C 310 224 315 234 319 242 L 311 246 C 308 236 304 226 300 218 Z" fill="#3A2419" opacity={0.2} filter="url(#eSoft2)" />
            {/* lower lip shadow */}
            <path d="M 286 264 Q 300 270 314 264 L 313 272 Q 300 278 287 272 Z" fill="#2A1711" opacity={0.2} filter="url(#eSoft2)" />
            {/* cheekbone / temple light */}
            <ellipse cx={272} cy={184} rx={20} ry={7} fill="#FFF0E0" opacity={0.15} filter="url(#eSoft2)" />
            <path d="M 344 190 C 348 208 346 226 338 242" stroke="#E8B58A" strokeWidth={2.2} fill="none" opacity={0.12} filter="url(#eSoft1)" />
            {/* forehead lines */}
            <path d="M 270 156 Q 300 151 330 156" stroke="#8A6250" strokeWidth={0.85} fill="none" opacity={0.15} />
            <path d="M 276 165 Q 300 161 324 165" stroke="#8A6250" strokeWidth={0.7} fill="none" opacity={0.11} />
            {/* eye bags and creases — age, not makeup */}
            <path d="M 250 214 Q 264 221 281 213" stroke="#7E5342" strokeWidth={1.2} fill="none" opacity={0.24} filter="url(#eSoft1)" />
            <path d="M 350 214 Q 336 221 319 213" stroke="#6E4838" strokeWidth={1.2} fill="none" opacity={0.28} filter="url(#eSoft1)" />
            <path d="M 252 216 Q 264 226 280 217" stroke="#9A6C56" strokeWidth={0.9} fill="none" opacity={0.16} filter="url(#eSoft1)" />
            <path d="M 348 216 Q 336 226 320 217" stroke="#8A5F4B" strokeWidth={0.9} fill="none" opacity={0.16} filter="url(#eSoft1)" />
            {/* temple hollows */}
            <ellipse cx={250} cy={180} rx={13} ry={17} fill="#4B2E22" opacity={0.16} filter="url(#eSoft2)" />
            <ellipse cx={350} cy={180} rx={13} ry={17} fill="#3E2519" opacity={0.2} filter="url(#eSoft2)" />
            {/* under-nose shadow, chin light */}
            <path d="M 264 212 Q 300 234 336 212 L 336 250 L 264 250 Z" fill="#2A1711" opacity={0.13} filter="url(#eSoft2)" />
            <ellipse cx="300" cy="280" rx="9" ry="3.2" fill="#FFE8D5" opacity={0.12} filter="url(#eSoft1)" />
          </g>

          {/* faint stubble and age lines */}
          <path d="M 258 234 Q 300 274 342 232 L 344 258 Q 300 292 256 258 Z" fill="#2B3038" opacity={0.16} filter="url(#eSoft2)" />
          <path d="M 262 236 Q 300 266 338 234" stroke="#3A3F47" strokeWidth={1} fill="none" opacity={0.12} filter="url(#eSoft1)" />
          {/* jaw corners: a male skull, not an oval */}
          <path d="M 246 226 C 244 236 246 246 251 254" stroke="#9B6C57" strokeWidth={1} fill="none" opacity={0.22} filter="url(#eSoft1)" />
          <path d="M 354 224 C 356 236 354 248 348 256" stroke="#7E5342" strokeWidth={1.4} fill="none" opacity={0.3} filter="url(#eSoft1)" />
          <path d="M 322 268 Q 334 264 344 254" stroke="#A9765C" strokeWidth={1} fill="none" opacity={0.16} filter="url(#eSoft1)" />
          {/* jaw contour, heavier on the shadow side */}
          <path d="M 251 216 Q 258 234 270 238" stroke="#9B6C57" strokeWidth={0.9} fill="none" opacity={0.18} />
          <path d="M 350 214 Q 342 234 330 240" stroke="#865A48" strokeWidth={1.1} fill="none" opacity={0.26} />
          {/* nasolabial folds */}
          <path d="M 286 230 Q 281 246 287 254" stroke="#7E5342" strokeWidth={0.9} fill="none" opacity={0.28} />
          <path d="M 314 230 Q 319 246 313 254" stroke="#6E4838" strokeWidth={0.9} fill="none" opacity={0.24} />

          {/* brows: heavy, straight, grizzled */}
          <path
            d={`M 243 ${191 + brow.y + brow.outer}
                C 253 ${182 + brow.y + brow.outer} 270 ${177 + brow.y + brow.inner} 285 ${176 + brow.y + brow.inner}
                C 289 ${176 + brow.y + brow.inner} 291 ${178 + brow.y + brow.inner} 291 ${181 + brow.y + brow.inner}
                C 283 ${180 + brow.y + brow.inner} 266 ${185 + brow.y + brow.outer} 249 ${195 + brow.y + brow.outer}
                C 246 ${196 + brow.y + brow.outer} 243 ${194 + brow.y + brow.outer} 243 ${191 + brow.y + brow.outer} Z`}
            fill="#4A4239"
            opacity={0.82}
            filter="url(#eSoft1)"
          />
          <path
            d={`M 357 ${191 + brow.y + brow.outer}
                C 347 ${182 + brow.y + brow.outer} 330 ${177 + brow.y + brow.inner} 315 ${176 + brow.y + brow.inner}
                C 311 ${176 + brow.y + brow.inner} 309 ${178 + brow.y + brow.inner} 309 ${181 + brow.y + brow.inner}
                C 317 ${180 + brow.y + brow.inner} 334 ${185 + brow.y + brow.outer} 351 ${195 + brow.y + brow.outer}
                C 354 ${196 + brow.y + brow.outer} 357 ${194 + brow.y + brow.outer} 357 ${191 + brow.y + brow.outer} Z`}
            fill="#463E36"
            opacity={0.82}
            filter="url(#eSoft1)"
          />
          {/* grey hairs within the brow */}
          <path d={`M 252 ${190 + brow.y + brow.outer} C 258 ${186 + brow.y + brow.outer} 266 ${184 + brow.y + brow.inner} 272 ${183 + brow.y + brow.inner}`} stroke="#9AA0A3" strokeWidth={0.7} fill="none" opacity={0.16} strokeLinecap="round" />
          {/* brow shadow cast on the socket */}
          <path d={`M 245 ${196 + brow.y + brow.outer} C 260 ${189 + brow.y + brow.outer} 275 ${186 + brow.y + brow.inner} 289 ${186 + brow.y + brow.inner}`} stroke="#5E4030" strokeWidth={2.4} fill="none" opacity={0.2} filter="url(#eSoft1)" />
          <path d={`M 355 ${196 + brow.y + brow.outer} C 340 ${189 + brow.y + brow.outer} 325 ${186 + brow.y + brow.inner} 311 ${186 + brow.y + brow.inner}`} stroke="#5E4030" strokeWidth={2.2} fill="none" opacity={0.18} filter="url(#eSoft1)" />
          {/* broken hairs so the brow is not a decal */}
          <path d={`M 246 ${194 + brow.y + brow.outer} C 250 ${190 + brow.y + brow.outer} 255 ${187 + brow.y + brow.outer} 261 ${185 + brow.y + brow.inner}`} stroke="#6B6259" strokeWidth={0.8} fill="none" opacity={0.5} />
          <path d={`M 267 ${184 + brow.y + brow.inner} C 273 ${181 + brow.y + brow.inner} 280 ${179 + brow.y + brow.inner} 288 ${179 + brow.y + brow.inner}`} stroke="#6B6259" strokeWidth={0.7} fill="none" opacity={0.45} />
          <path d={`M 354 ${194 + brow.y + brow.outer} C 350 ${190 + brow.y + brow.outer} 345 ${187 + brow.y + brow.outer} 339 ${185 + brow.y + brow.inner}`} stroke="#6B6259" strokeWidth={0.8} fill="none" opacity={0.45} />
          <path d={`M 333 ${184 + brow.y + brow.inner} C 327 ${181 + brow.y + brow.inner} 320 ${179 + brow.y + brow.inner} 312 ${179 + brow.y + brow.inner}`} stroke="#6B6259" strokeWidth={0.7} fill="none" opacity={0.4} />

          <Eye cx={266} cy={199} lid={lid} lookX={lk.x} lookY={lk.y} cold={cold} screen={screen} clipId="eEyeClipL" />
          <Eye cx={334} cy={199} lid={lid} lookX={lk.x} lookY={lk.y} cold={cold} screen={screen} flip clipId="eEyeClipR" />

          {/* nose: long, straight, slightly aquiline */}
          <path d="M 301 199 L 302 228 Q 303 236 300 239" stroke="#FFE9D7" strokeWidth={1.1} opacity={0.16} />
          <path d="M 300 172 C 299 196 299 220 298 236" stroke="#7E5340" strokeWidth={3.4} fill="none" opacity={0.1} filter="url(#eSoft1)" />
          <path d="M 296 174 C 294 200 292 222 289 236" stroke="#6E4433" strokeWidth={2.2} fill="none" opacity={0.1} filter="url(#eSoft1)" />
          <path d="M 304 178 C 306 202 306 224 305 236" stroke="#6E4433" strokeWidth={2} fill="none" opacity={0.11} filter="url(#eSoft2)" />
          <path d="M 292 224 C 289 230 289 235 291 238 C 293 240 296 240 298 238" fill="#7A5040" opacity={0.14} filter="url(#eSoft1)" />
          <path d="M 308 224 C 311 230 311 235 309 238 C 307 240 304 240 302 238" fill="#6E4838" opacity={0.14} filter="url(#eSoft1)" />
          <path d="M 292 236 Q 296 240 301 239 Q 305 238 308 235" stroke="#7D5140" strokeWidth={1.4} fill="none" strokeLinecap="round" opacity={0.4} />
          <path d="M 292 240 Q 296 242 300 241" stroke="#4A2A1E" strokeWidth={0.75} fill="none" opacity={0.26} />
          <path d="M 308 240 Q 304 242 301 241" stroke="#4A2A1E" strokeWidth={0.75} fill="none" opacity={0.22} />
          <ellipse cx={293.6} cy={238.6} rx={1.4} ry={0.65} fill="#4A2A1E" opacity={0.22} filter="url(#eSoft1)" />
          <ellipse cx={306.4} cy={238.6} rx={1.2} ry={0.6} fill="#4A2A1E" opacity={0.18} filter="url(#eSoft1)" />

          {/* mouth: thin, controlled */}
          <g transform="translate(300 257)">
            {mouthOpen > 0.02 ? (
              <>
                <path
                  d={`M ${-mouthW} ${-0.3 + smile * 0.2} Q ${-mouthW * 0.5} ${-3.2} 0 ${-2.1} Q ${mouthW * 0.5} ${-3.2} ${mouthW} ${-0.3 + smile * 0.2} Q ${mouthW * 0.68} ${4.2 + mouthOpen * 6.6} 0 ${4.8 + mouthOpen * 6.6} Q ${-mouthW * 0.68} ${4.2 + mouthOpen * 6.6} ${-mouthW} ${-0.3 + smile * 0.2} Z`}
                  fill="#2E100D"
                />
                {mouthOpen > 0.34 ? (
                  <path d={`M ${-mouthW + 5} ${0.4} Q 0 ${-2.2} ${mouthW - 5} ${0.4} L ${mouthW - 5} ${1.9} Q 0 ${0.4} ${-mouthW + 5} ${1.9} Z`} fill="#BCA797" opacity={0.55} />
                ) : null}
                <path d={`M ${-mouthW * 0.5} ${3.3 + mouthOpen * 3.4} Q 0 ${4.4 + mouthOpen * 4.1} ${mouthW * 0.5} ${3.3 + mouthOpen * 3.4}`} stroke="#C58B7D" strokeWidth={0.85} fill="none" opacity={0.24} />
              </>
            ) : (
              <>
                <path
                  d={`M ${-mouthW} ${smile * 0.2} Q ${-mouthW * 0.55} ${-2.4 + smile * 0.3} 0 ${-2 + smile * 0.4} Q ${mouthW * 0.55} ${-2.4 + smile * 0.3} ${mouthW} ${smile * 0.2} Q ${mouthW * 0.6} ${2.6 + smile} 0 ${3.2 + smile} Q ${-mouthW * 0.6} ${2.6 + smile} ${-mouthW} ${smile * 0.2} Z`}
                  fill="url(#eLip)"
                  opacity={0.78}
                />
                <path
                  d={`M ${-mouthW} ${smile * 0.2} Q ${-mouthW * 0.5} ${-2.6 + smile * 0.3} 0 ${-2.1 + smile * 0.4} Q ${mouthW * 0.5} ${-2.6 + smile * 0.3} ${mouthW} ${smile * 0.2}`}
                  stroke="#5E332E"
                  strokeWidth={0.8}
                  fill="none"
                  opacity={0.65}
                />
                <path d={`M ${-mouthW * 0.5} ${1.5 + smile * 0.5} Q 0 ${2.6 + smile} ${mouthW * 0.5} ${1.5 + smile * 0.5}`} stroke="#E7B7A7" strokeWidth={0.7} fill="none" opacity={0.22} />
              </>
            )}
            <path d={`M ${-mouthW - 1.2} ${-0.5 + smile * 0.2} l -1.4 -1.1`} stroke="#5E332E" strokeWidth={0.65} opacity={0.36} />
            <path d={`M ${mouthW + 1.2} ${-0.5 + smile * 0.2} l 1.4 -1.1`} stroke="#5E332E" strokeWidth={0.65} opacity={0.3} />
          </g>

          {/* chin */}
          <path d="M 285 280 Q 300 287 315 280" stroke="#553629" strokeWidth={0.85} fill="none" opacity={0.13} />
          <path d="M 300 282 L 300 289" stroke="#6E4A3A" strokeWidth={0.75} opacity={0.12} />
          {/* the jaw throws a shadow down the neck */}
          <path d="M 270 286 Q 300 300 330 286 L 328 298 Q 300 312 272 298 Z" fill="#180D07" opacity={0.44} filter="url(#eSoft2)" />

          {/* ---------- hair: short silver, swept back ---------- */}
          <g transform={`translate(${hairShift * 0.4} 0)`}>
            {/* one solid mass with a mature arched hairline */}
            <path
              d="M 243 161
                 C 234 150 231 134 235 119
                 C 238 105 247 95 259 90
                 C 268 86 275 90 283 85
                 C 291 80 300 80 308 85
                 C 317 83 326 88 333 95
                 C 344 102 354 113 359 125
                 C 363 135 364 148 363 160
                 C 358 154 352 149 346 146
                 C 337 142 327 141 318 141
                 C 311 142 307 142 303 143
                 C 300 145 299 146 296 147
                 C 292 145 289 143 286 142
                 C 277 142 268 144 259 147
                 C 254 149 252 151 252 152
                 C 247 156 244 159 243 161 Z"
              fill="url(#eHair)"
            />
            {/* temples sink into shadow so it is not a cap */}
            <path d="M 232 136 C 230 152 234 166 241 174 C 244 160 243 144 243 132 Z" fill="#1A1E21" opacity={0.5} filter="url(#eSoft2)" />
            <path d="M 364 130 C 367 148 365 164 358 174 C 355 158 356 142 357 128 Z" fill="#14181B" opacity={0.55} filter="url(#eSoft2)" />
            <path d="M 248 96 C 258 90 272 86 286 86 L 286 96 C 272 96 258 100 250 106 Z" fill="#20252A" opacity={0.3} filter="url(#eSoft1)" />
            {/* clumps: break the smooth cap into masses */}
            <ellipse cx={262} cy={112} rx={16} ry={11} fill="#6E757B" opacity={0.22} filter="url(#eSoft2)" transform="rotate(-24 262 112)" />
            <ellipse cx={300} cy={96} rx={17} ry={10} fill="#7C8389" opacity={0.18} filter="url(#eSoft2)" />
            <ellipse cx={336} cy={110} rx={15} ry={10} fill="#5E656B" opacity={0.24} filter="url(#eSoft2)" transform="rotate(20 336 110)" />
            <path d="M 246 128 C 252 112 262 100 274 94" stroke="#232830" strokeWidth={1.4} fill="none" opacity={0.4} />
            <path d="M 300 88 C 312 92 322 100 330 110" stroke="#20252C" strokeWidth={1.3} fill="none" opacity={0.36} />
            {/* soft shadow along the right side and nape */}
            <path
              d="M 372 134
                 C 374 154 370 174 364 194
                 C 358 176 352 164 344 156
                 C 334 148 322 145 310 144
                 C 330 136 348 130 358 118
                 C 366 108 370 96 368 82
                 C 371 96 372 116 372 134 Z"
              fill="#6B7177"
              opacity={0.5}
              filter="url(#eSoft2)"
            />
            {/* light along the top-left plane */}
            <path
              d="M 232 152
                 C 232 118 248 94 272 84
                 C 258 104 248 126 245 150
                 C 243 162 243 172 244 184
                 C 240 174 236 164 232 152 Z"
              fill="#C4C9CD"
              opacity={0.2}
              filter="url(#eSoft1)"
            />
            {/* swept-back surface strands */}
            <path d="M 244 176 C 246 152 252 128 264 108" stroke="#5E656C" strokeWidth={1.1} fill="none" opacity={0.35} />
            <path d="M 258 158 C 266 134 278 114 294 100" stroke="#6C737A" strokeWidth={1} fill="none" opacity={0.3} />
            <path d="M 276 149 C 286 126 300 108 318 96" stroke="#797F85" strokeWidth={1} fill="none" opacity={0.26} />
            <path d="M 300 146 C 310 126 324 110 340 100" stroke="#8A9096" strokeWidth={0.9} fill="none" opacity={0.3} />
            <path d="M 322 148 C 332 132 344 118 356 110" stroke="#7E848A" strokeWidth={0.9} fill="none" opacity={0.28} />
            {/* side part, gives the sweep a direction */}
            <path d="M 264 152 C 274 134 286 118 300 104 C 310 94 318 88 326 84" stroke="#565C62" strokeWidth={1.8} fill="none" opacity={0.4} />
            <path d="M 266 150 C 276 132 288 116 302 102" stroke="#D6DADD" strokeWidth={1.1} fill="none" opacity={0.22} filter="url(#eSoft1)" />
            {/* soft crown clump */}
            <ellipse cx={330} cy={104} rx={20} ry={11} fill="#9DA2A6" opacity={0.1} filter="url(#eSoft2)" transform="rotate(-18 330 104)" />
            <path d="M 240 150 C 244 140 250 133 258 129" stroke="#8B9095" strokeWidth={1} fill="none" opacity={0.3} />
            <path d="M 356 146 C 353 137 348 131 342 127" stroke="#7C8186" strokeWidth={0.9} fill="none" opacity={0.26} />
            <path d="M 230 168 C 232 160 236 152 242 147" stroke="#2E3338" strokeWidth={1.4} fill="none" opacity={0.4} />
            <path d="M 368 164 C 366 156 362 149 356 144" stroke="#282C31" strokeWidth={1.3} fill="none" opacity={0.36} />
            {/* highlights */}
            <path d="M 250 120 C 264 98 286 84 310 82" stroke="#E7EAEC" strokeWidth={2} fill="none" opacity={0.16} filter="url(#eSoft1)" />
            <path d="M 254 138 C 268 116 288 100 310 92" stroke="#C9CED2" strokeWidth={1.1} fill="none" opacity={0.13} filter="url(#eSoft1)" />
            {/* thin, dark sideburns tucked against the jaw — not grey tabs */}
            <path d="M 236 184 C 234 194 234 202 236 210 C 238 201 238 192 238 184 Z" fill="#2A2F35" opacity={0.9} />
            <path d="M 364 184 C 366 194 366 202 364 210 C 362 201 362 192 362 184 Z" fill="#242930" opacity={0.9} />
            {/* flyaway strands breaking the cap silhouette */}
            <path d="M 258 100 C 256 95 252 92 248 92" stroke="#7C8288" strokeWidth={0.9} fill="none" opacity={0.24} strokeLinecap="round" />
            <path d="M 306 88 C 308 83 311 80 315 78" stroke="#8A9096" strokeWidth={0.8} fill="none" opacity={0.22} strokeLinecap="round" />
            <path d="M 338 106 C 342 102 347 100 352 101" stroke="#757B81" strokeWidth={0.9} fill="none" opacity={0.2} strokeLinecap="round" />
            {/* thin, sparse crown so it is not a helmet */}
            <path d="M 268 118 C 282 100 300 90 320 88" stroke="#20252A" strokeWidth={0.9} fill="none" opacity={0.3} />
            <path d="M 288 108 C 300 96 314 90 328 90" stroke="#1C2126" strokeWidth={0.8} fill="none" opacity={0.26} />
            {/* short hairs breaking the hairline */}
            <path d="M 258 152 C 260 144 263 140 267 138" stroke="#2A2F34" strokeWidth={1.6} fill="none" opacity={0.5} strokeLinecap="round" />
            <path d="M 274 150 C 276 143 279 139 283 137" stroke="#262B30" strokeWidth={1.4} fill="none" opacity={0.45} strokeLinecap="round" />
            <path d="M 320 148 C 318 141 315 137 311 135" stroke="#242930" strokeWidth={1.5} fill="none" opacity={0.45} strokeLinecap="round" />
            <path d="M 338 152 C 336 145 333 141 329 139" stroke="#20252A" strokeWidth={1.3} fill="none" opacity={0.4} strokeLinecap="round" />
            {/* shadow under the hairline */}
            <path d="M 254 158 Q 300 170 346 156 L 346 172 Q 300 186 254 174 Z" fill="#160D08" opacity={0.34} filter="url(#eSoft2)" />
          </g>
        </g>
      </g>

      {/* ---------- rim light ---------- */}
      {rim > 0 ? (
        <g opacity={rim} style={{mixBlendMode: 'screen'}}>
          <path d="M 239 148 C 232 128 238 108 254 96" stroke="url(#eRimCool)" strokeWidth={2} fill="none" filter="url(#eSoft1)" opacity={0.34} />
          <path d="M 362 144 C 364 126 357 110 348 102" stroke="url(#eRimCool)" strokeWidth={1.5} fill="none" filter="url(#eSoft1)" opacity={0.22} />
          <path d="M 362 190 C 369 218 363 242 348 258" stroke="url(#eRimWarm)" strokeWidth={2.2} fill="none" filter="url(#eSoft1)" opacity={0.4} />
          <path d="M 364 202 Q 362 244 336 266" stroke="#D08D65" strokeWidth={1.2} fill="none" opacity={0.16} filter="url(#eSoft1)" />
          <path d="M 384 350 C 394 392 398 490 396 600" stroke="url(#eRimWarm)" strokeWidth={2.4} fill="none" filter="url(#eSoft1)" opacity={0.4} />
          <path d="M 216 350 C 207 392 204 490 205 600" stroke="url(#eRimCool)" strokeWidth={2.2} fill="none" filter="url(#eSoft1)" opacity={0.42} />
        </g>
      ) : null}
    </svg>
  );
};

/* Rear three-quarter silhouette for the entrance shot. */
export const DrEliasBack: React.FC<{rim?: number; style?: React.CSSProperties}> = ({rim = 1, style}) => (
  <svg viewBox="0 0 320 760" width="100%" height="100%" preserveAspectRatio="xMidYMax meet" style={style}>
    <defs>
      <linearGradient id="ebCoat" x1="0.1" y1="0" x2="0.9" y2="1">
        <stop offset="0%" stopColor="#232932" />
        <stop offset="46%" stopColor="#12161C" />
        <stop offset="100%" stopColor="#05070A" />
      </linearGradient>
      <linearGradient id="ebHair" x1="0.15" y1="0" x2="0.9" y2="1">
        <stop offset="0%" stopColor="#AAB2BC" />
        <stop offset="36%" stopColor="#69727E" />
        <stop offset="74%" stopColor="#3E4650" />
        <stop offset="100%" stopColor="#20252D" />
      </linearGradient>
      <linearGradient id="ebSkin" x1="0.2" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#C39C85" />
        <stop offset="100%" stopColor="#7E5C4B" />
      </linearGradient>
      <linearGradient id="ebRim" x1="0" y1="0" x2="1" y2="0.25">
        <stop offset="0%" stopColor="#CFEAF8" stopOpacity="0.95" />
        <stop offset="45%" stopColor="#6D9DBA" stopOpacity="0.24" />
        <stop offset="100%" stopColor="#6D9DBA" stopOpacity="0" />
      </linearGradient>
      <filter id="ebSoft" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="2.2" />
      </filter>
    </defs>

    {/* coat back, broad shoulders */}
    <path
      d="M 160 204
         C 128 206 102 220 86 242
         C 68 266 60 298 57 336
         L 50 520 L 46 760 L 274 760 L 270 520 L 263 336
         C 260 298 252 266 234 242
         C 218 220 192 206 160 204 Z"
      fill="url(#ebCoat)"
    />
    <path d="M 98 248 C 82 282 74 334 74 390" stroke="#1C222A" strokeWidth={1.6} fill="none" opacity={0.5} />
    <path d="M 222 248 C 238 282 246 334 246 390" stroke="#141920" strokeWidth={1.5} fill="none" opacity={0.42} />
    <path d="M 138 220 C 126 262 124 334 126 406" stroke="#000000" strokeWidth={7} fill="none" opacity={0.3} filter="url(#ebSoft)" />
    <path d="M 184 220 C 196 262 198 334 196 406" stroke="#000000" strokeWidth={6} fill="none" opacity={0.26} filter="url(#ebSoft)" />
    <path d="M 160 300 L 160 470" stroke="#000000" strokeWidth={5} fill="none" opacity={0.18} filter="url(#ebSoft)" />
    <path d="M 160 520 L 160 700" stroke="#05070A" strokeWidth={2.2} fill="none" opacity={0.5} />

    {/* neck + raised coat collar */}
    <path d="M 136 186 L 134 238 L 188 238 L 186 186 Z" fill="#0C1014" />
    <path d="M 130 204 Q 160 224 192 202 L 208 236 L 122 236 Z" fill="#171C23" />
    <path d="M 128 200 Q 158 220 194 198" stroke="#333B45" strokeWidth={1.4} fill="none" opacity={0.35} />
    <path d="M 136 216 C 150 228 172 230 190 220" stroke="#070A0E" strokeWidth={10} fill="none" strokeLinecap="round" />

    {/* head from behind, 3/4 to the right */}
    <path
      d="M 160 56
         C 122 56 100 84 100 122
         C 100 156 112 184 134 200
         C 146 209 168 212 186 204
         C 208 195 220 176 220 152
         C 220 98 196 56 160 56 Z"
      fill="url(#ebHair)"
    />
    {/* right ear + cheek sliver */}
    <path d="M 218 148 C 226 146 231 154 230 164 C 229 175 225 183 219 188 C 217 178 216 158 218 148 Z" fill="url(#ebSkin)" />
    <path d="M 220 153 C 217 161 217 173 219 182" stroke="#5E4538" strokeWidth={1.1} fill="none" opacity={0.55} />
    <path d="M 218 190 C 214 200 206 207 196 211" stroke="#8E6A58" strokeWidth={2.4} fill="none" opacity={0.5} filter="url(#ebSoft)" />
    <path d="M 216 192 C 212 199 206 204 199 208" stroke="#B58D78" strokeWidth={0.9} fill="none" opacity={0.35} />

    {/* layered hair clumps swept back */}
    <path d="M 160 60 C 134 60 114 78 106 104 C 128 88 152 82 174 84 C 196 86 212 96 220 112 C 214 78 192 60 160 60 Z" fill="#8B949F" opacity={0.55} />
    <path d="M 110 114 C 108 136 112 160 124 178 C 132 164 138 146 142 128 C 132 122 120 118 110 114 Z" fill="#5A626D" opacity={0.5} />
    <path d="M 208 114 C 214 134 214 160 204 182 C 196 166 192 148 190 130 C 196 124 204 118 208 114 Z" fill="#4A525C" opacity={0.45} />
    <path d="M 144 66 C 136 98 134 134 142 166 C 146 184 150 196 154 204 C 146 198 138 188 132 176 C 126 152 126 118 134 90 Z" fill="#4E5660" opacity={0.4} />
    <path d="M 182 66 C 192 98 194 134 186 166 C 182 184 178 196 174 204 C 184 198 192 188 198 176 C 204 152 204 118 196 90 Z" fill="#3A414A" opacity={0.36} />
    <path d="M 118 92 C 110 128 112 168 126 194" stroke="#7A838F" strokeWidth={1.3} fill="none" opacity={0.45} />
    <path d="M 134 78 C 124 114 124 158 136 190" stroke="#555D68" strokeWidth={1.1} fill="none" opacity={0.4} />
    <path d="M 204 98 C 212 134 211 172 200 196" stroke="#3E454F" strokeWidth={1.1} fill="none" opacity={0.38} />
    <path d="M 112 112 C 130 80 166 68 198 84" stroke="#D0D6DD" strokeWidth={2.6} fill="none" opacity={0.28} filter="url(#ebSoft)" />
    <path d="M 150 70 C 144 104 144 146 152 180" stroke="#8E97A3" strokeWidth={1} fill="none" opacity={0.3} />
    <path d="M 176 68 C 182 102 182 144 176 178" stroke="#6E7783" strokeWidth={0.9} fill="none" opacity={0.28} />
    <path d="M 140 196 C 152 208 172 211 188 204" stroke="#20262F" strokeWidth={2} fill="none" opacity={0.72} />
    <path d="M 146 198 C 156 206 170 208 182 203" stroke="#8E97A3" strokeWidth={0.8} fill="none" opacity={0.28} />

    {rim > 0 ? (
      <g opacity={rim}>
        <path d="M 103 116 C 102 148 110 176 128 196" stroke="url(#ebRim)" strokeWidth={2.3} fill="none" filter="url(#ebSoft)" opacity={0.55} />
        <path d="M 88 244 C 72 268 64 300 61 332" stroke="url(#ebRim)" strokeWidth={2.5} fill="none" filter="url(#ebSoft)" opacity={0.44} />
        <path d="M 52 374 C 50 454 48 564 48 664" stroke="url(#ebRim)" strokeWidth={1.6} fill="none" filter="url(#ebSoft)" opacity={0.24} />
        <path d="M 209 184 C 217 190 221 198 218 206" stroke="#9BC2D8" strokeWidth={1.3} fill="none" opacity={0.24} filter="url(#ebSoft)" />
      </g>
    ) : null}
  </svg>
);
