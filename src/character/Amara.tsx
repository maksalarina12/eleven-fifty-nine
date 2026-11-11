import React from 'react';

export type AmaraExpression = 'calm' | 'cold' | 'focus' | 'soft' | 'guarded' | 'defiant';
export type AmaraLook = 'camera' | 'left' | 'right' | 'down';

type Props = {
  expression?: AmaraExpression;
  look?: AmaraLook;
  mouth?: number;
  turn?: number;
  rim?: number;
  screen?: number;
  preserve?: string;
  viewBox?: string;
  style?: React.CSSProperties;
};

const LID: Record<AmaraExpression, number> = {
  calm: 0.1,
  cold: 0.26,
  focus: 0.02,
  soft: 0.24,
  guarded: 0.18,
  defiant: 0.06,
};

const BROW: Record<AmaraExpression, {y: number; inner: number; outer: number}> = {
  calm: {y: 0, inner: 0, outer: 0},
  cold: {y: 1.6, inner: 1.2, outer: -1.2},
  focus: {y: -0.8, inner: 0.8, outer: -2.2},
  soft: {y: -0.8, inner: -2, outer: 0.2},
  guarded: {y: 0.6, inner: -1.2, outer: -0.4},
  defiant: {y: -1.4, inner: -2.8, outer: 0.8},
};

const LOOK: Record<AmaraLook, {x: number; y: number; head: number}> = {
  camera: {x: 0, y: 0, head: 0},
  left: {x: -2.2, y: 0.3, head: -0.3},
  right: {x: 2.2, y: 0.3, head: 0.3},
  down: {x: 0.2, y: 1.7, head: 0.14},
};

/* One eye, drawn in local coordinates and mirrored for the far side. */
const Eye: React.FC<{
  cx: number;
  cy: number;
  lid: number;
  lookX: number;
  lookY: number;
  flip?: boolean;
  screen: number;
  cold?: boolean;
  clipId: string;
}> = ({cx, cy, lid, lookX, lookY, flip, screen, cold, clipId}) => {
  const s = flip ? 1 : -1;
  const ix = lookX * 1.4 * s;
  const iy = 0.2 + lookY * 1.0;
  const lashY = lid * 5.6;
  return (
    <g transform={`translate(${cx} ${cy}) scale(${s * 0.86} 0.84)`}>
      {/* socket + lid shading */}
      <ellipse cx={0} cy={-3.6} rx={18} ry={10.6} fill="#3A241C" opacity={0.13} filter="url(#aSoft2)" />
      <path d="M -16 -4.2 Q 0 -11.6 16.4 -4.4 Q 2 -7.8 -16 -4.2 Z" fill="#6E4A3B" opacity={0.14} filter="url(#aSoft2)" />
      {/* sclera */}
      <path
        d="M -16.6 0.4
           C -14.2 -6.6 -6.4 -9.2 1.6 -8.9
           C 9.6 -8.6 15 -5.4 17 -0.7
           C 12 5.6 4 7.9 -2.8 7.4
           C -9.6 6.9 -14.8 4.2 -16.6 0.4 Z"
        fill="#CEB9A9"
      />
      <g clipPath={`url(#${clipId})`}>
        <circle cx={ix} cy={iy} r={7.9} fill="#4F656B" />
        <circle cx={ix} cy={iy} r={7.9} fill="url(#aIris)" opacity={0.92} />
        <circle cx={ix} cy={iy + 0.4} r={3.7} fill="#0A0B0C" />
        <circle cx={ix - 0.3 * s} cy={iy + 3.9} r={2.2} fill="#93B4BA" opacity={0.4} />
        <circle cx={ix - 2.3 * s} cy={iy - 2.6} r={1.7} fill="#F8F2E9" opacity={0.95} />
        <circle cx={ix + 2 * s} cy={iy + 2.5} r={0.75} fill="#E8D9C6" opacity={0.5} />
        <path d="M -18 -7.6 Q 0 -2.2 18 -7 L 18 -12 L -18 -12 Z" fill="#2A1A14" opacity={0.14 + lid * 0.12} />
        {screen > 0.02 ? <rect x={-18} y={-1.4} width={36} height={3.6} fill="#9BD6EE" opacity={screen * 0.13} /> : null}
      </g>
      {/* upper lash, softer at the inner corner */}
      <path
        d="M -16.4 0.5
           C -14 -6.9 -6 -9.6 1.8 -9.3
           C 9.6 -9 15.4 -5.8 18.4 -0.2"
        fill="none"
        stroke="#241814"
        strokeWidth={cold ? 2.5 : 2.1}
        strokeLinecap="round"
        transform={`translate(0 ${lashY})`}
      />
      <path
        d="M -16.4 0.5 C -13.6 -4.4 -10 -7.2 -5.6 -8.6"
        fill="none"
        stroke="#241814"
        strokeWidth={1}
        strokeLinecap="round"
        opacity={0.55}
        transform={`translate(0 ${lashY})`}
      />
      <path
        d="M 13.6 -4.4 Q 18.8 -3.6 21.4 -0.6"
        fill="none"
        stroke="#241814"
        strokeWidth={1.7}
        strokeLinecap="round"
        transform={`translate(0 ${lashY})`}
      />
      <path d="M 15.4 -5.6 L 19.8 -8.4" stroke="#241814" strokeWidth={0.9} strokeLinecap="round" opacity={0.7} transform={`translate(0 ${lashY})`} />
      <path d="M 17.2 -2.6 L 21.6 -4.2" stroke="#241814" strokeWidth={0.8} strokeLinecap="round" opacity={0.55} transform={`translate(0 ${lashY})`} />
      {/* eyeshadow + crease */}
      <path d="M -14 -7.4 Q 0 -13 15 -7.8 L 15 -6.2 Q 0 -11 -14 -5.8 Z" fill="#7A5142" opacity={0.18} filter="url(#aSoft1)" />
      <path d="M -16.6 -1.6 C -12.4 -9 0.4 -12.4 16.4 -2.4 L 17.6 -6.6 C 11.6 -15.6 -3.4 -18.4 -17.6 -8.2 Z" fill="#7A5343" opacity={0.14} filter="url(#aSoft1)" />
      <path
        d="M -4 -11.4 Q 5 -13 13.4 -9.8"
        fill="none"
        stroke="#956853"
        strokeWidth={0.8}
        opacity={0.34}
        transform={`translate(0 ${lashY * 0.7})`}
      />
      {/* lower lid + soft under-eye light */}
      <path d="M -9.6 6.6 C -3 8.4 6 7.2 13.6 1.6" fill="none" stroke="#7C5647" strokeWidth={0.7} opacity={0.36} />
      <path d="M -8.6 9.4 C -2 11.2 6.6 10.2 13 5.4" fill="none" stroke="#F6DCC9" strokeWidth={1.5} opacity={0.22} filter="url(#aSoft1)" />
      <path d="M -8 8.4 C -1.4 10 6 9.4 12.6 4.4" fill="none" stroke="#6A4437" strokeWidth={0.6} opacity={0.18} filter="url(#aSoft1)" />
    </g>
  );
};

export const Amara: React.FC<Props> = ({
  expression = 'calm',
  look = 'camera',
  mouth = 0,
  turn = 0,
  rim = 1,
  screen = 0.4,
  preserve = 'xMidYMax meet',
  viewBox = '0 0 600 1200',
  style,
}) => {
  const lid = LID[expression];
  const brow = BROW[expression];
  const lk = LOOK[look];
  const t = Math.max(-1, Math.min(1, turn + lk.head * 0.3));
  const faceShift = t * 7;
  const hairShift = t * 4;
  const mouthOpen = Math.max(0, Math.min(1, mouth));
  const smile = expression === 'soft' ? 2.1 : expression === 'cold' ? -0.2 : expression === 'guarded' ? 0.2 : expression === 'defiant' ? -0.6 : 1.3;

  return (
    <svg viewBox={viewBox} width="100%" height="100%" style={style} preserveAspectRatio={preserve}>
      <defs>
        <linearGradient id="aSkin" x1="0.18" y1="0.04" x2="0.94" y2="0.98">
          <stop offset="0%" stopColor="#F0D4BE" />
          <stop offset="30%" stopColor="#DFB9A1" />
          <stop offset="62%" stopColor="#C39780" />
          <stop offset="88%" stopColor="#A57A66" />
          <stop offset="100%" stopColor="#956E5D" />
        </linearGradient>
        <linearGradient id="aSkinArm" x1="0" y1="0" x2="0.2" y2="1">
          <stop offset="0%" stopColor="#E0BCA5" />
          <stop offset="100%" stopColor="#A47B67" />
        </linearGradient>
        <linearGradient id="aHair" x1="0.12" y1="0" x2="0.92" y2="1">
          <stop offset="0%" stopColor="#4C5A72" />
          <stop offset="28%" stopColor="#28313F" />
          <stop offset="64%" stopColor="#151A23" />
          <stop offset="100%" stopColor="#080B10" />
        </linearGradient>
        <linearGradient id="aHairSoft" x1="0.2" y1="0" x2="1" y2="0.9">
          <stop offset="0%" stopColor="#394253" />
          <stop offset="55%" stopColor="#161B23" />
          <stop offset="100%" stopColor="#090C11" />
        </linearGradient>
        <linearGradient id="aJacket" x1="0.1" y1="0" x2="0.85" y2="1">
          <stop offset="0%" stopColor="#1B2027" />
          <stop offset="40%" stopColor="#111520" />
          <stop offset="100%" stopColor="#07090D" />
        </linearGradient>
        <linearGradient id="aTurtle" x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor="#262B34" />
          <stop offset="52%" stopColor="#13161B" />
          <stop offset="100%" stopColor="#090A0E" />
        </linearGradient>
        <linearGradient id="aRimCool" x1="0" y1="0" x2="1" y2="0.4">
          <stop offset="0%" stopColor="#C8EAF8" stopOpacity="1" />
          <stop offset="44%" stopColor="#79AECB" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#6DA3C2" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="aRimWarm" x1="1" y1="0" x2="0" y2="0.5">
          <stop offset="0%" stopColor="#F2B587" stopOpacity="0.8" />
          <stop offset="55%" stopColor="#A66B44" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#A66B44" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="aFaceLight" cx="0.27" cy="0.22" r="1">
          <stop offset="0%" stopColor="#FFF0E2" stopOpacity="0.42" />
          <stop offset="42%" stopColor="#E9C7B2" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#1A0E08" stopOpacity="0.44" />
        </radialGradient>
        <linearGradient id="aFringe" x1="0.2" y1="0" x2="0.7" y2="1">
          <stop offset="0%" stopColor="#3A4759" />
          <stop offset="55%" stopColor="#232B39" />
          <stop offset="100%" stopColor="#161C26" />
        </linearGradient>
        <linearGradient id="aKeyShade" x1="0.34" y1="0.1" x2="1" y2="0.6">
          <stop offset="0%" stopColor="#0A0F16" stopOpacity="0" />
          <stop offset="58%" stopColor="#0A0F16" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#050A10" stopOpacity="0.5" />
        </linearGradient>
        <radialGradient id="aIris" cx="0.38" cy="0.3" r="0.8">
          <stop offset="0%" stopColor="#BBD9DE" stopOpacity="0.55" />
          <stop offset="55%" stopColor="#618086" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#1B2426" stopOpacity="0.72" />
        </radialGradient>
        <linearGradient id="aLip" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="#C08379" />
          <stop offset="55%" stopColor="#A96B65" />
          <stop offset="100%" stopColor="#8C534F" />
        </linearGradient>
        <linearGradient id="aBodyShade" x1="0" y1="0" x2="0.2" y2="1">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.55" />
          <stop offset="26%" stopColor="#000000" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.8" />
        </linearGradient>
        <clipPath id="aEyeClipL">
          <path d="M -16.6 0.4 C -14.2 -6.6 -6.4 -9.2 1.6 -8.9 C 9.6 -8.6 15 -5.4 17 -0.7 C 12 5.6 4 7.9 -2.8 7.4 C -9.6 6.9 -14.8 4.2 -16.6 0.4 Z" />
        </clipPath>
        <clipPath id="aEyeClipR">
          <path d="M -16.6 0.4 C -14.2 -6.6 -6.4 -9.2 1.6 -8.9 C 9.6 -8.6 15 -5.4 17 -0.7 C 12 5.6 4 7.9 -2.8 7.4 C -9.6 6.9 -14.8 4.2 -16.6 0.4 Z" />
        </clipPath>
        <clipPath id="aFaceClip">
          <path d="M 300 116 C 273 116 256 134 255 158 C 254 176 260 194 268 207 C 274 218 284 228 293 233 C 296 235 298 236 300 236 C 302 236 304 235 307 233 C 316 228 326 218 332 207 C 340 194 346 176 345 158 C 344 134 327 116 300 116 Z" />
        </clipPath>
        <filter id="aSoft1" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="1.3" />
        </filter>
        <filter id="aSoft2" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>

      {/* ---------- neck ---------- */}
      <path d="M 288 226 C 285 244 283 262 282 284 C 290 296 310 296 318 284 C 317 262 315 244 312 226 Z" fill="url(#aSkinArm)" />
      <path d="M 288 226 L 287 256 Q 300 275 313 256 L 312 226 Z" fill="#43291E" opacity={0.42} filter="url(#aSoft1)" />
      <path d="M 289 246 Q 300 266 311 247 L 314 288 Q 300 297 286 288 Z" fill="#4C3024" opacity={0.22} />
      <path d="M 295 236 Q 300 256 303 270" stroke="#EDCBB3" strokeWidth={2.2} fill="none" opacity={0.16} filter="url(#aSoft1)" />
      <path d="M 288 288 Q 300 296 312 288" stroke="#120A07" strokeWidth={3} opacity={0.22} filter="url(#aSoft1)" />
      <ellipse cx={309} cy={252} rx={8} ry={24} fill="#4C3024" opacity={0.24} filter="url(#aSoft2)" />
      <ellipse cx={300} cy={238} rx={13} ry={6} fill="#2A1711" opacity={0.3} filter="url(#aSoft2)" />

      {/* ---------- torso: turtleneck + open jacket ---------- */}
      <g transform={`translate(${t * 2.2} 0)`}>
        <path
          d="M 300 292
             C 286 292 274 296 262 304
             C 242 314 224 336 216 366
             C 210 388 208 420 208 452
             L 206 560 L 208 760 L 392 760 L 394 560 L 392 452
             C 392 420 390 388 384 366
             C 376 336 358 314 338 304
             C 326 296 314 292 300 292 Z"
          fill="url(#aJacket)"
        />
        {/* trapezius ridge: makes the shoulders read as shoulders */}
        <path d="M 284 300 C 258 314 234 338 219 370" stroke="#3C4553" strokeWidth={2.4} fill="none" opacity={0.45} />
        <path d="M 316 300 C 342 314 366 338 381 370" stroke="#2C3340" strokeWidth={1.9} fill="none" opacity={0.34} />
        <path d="M 220 372 C 212 392 209 418 209 448" stroke="#4A5464" strokeWidth={1.6} fill="none" opacity={0.24} filter="url(#aSoft1)" />
        {/* arm seams */}
        <path d="M 244 360 C 236 400 234 460 235 540" stroke="#05070A" strokeWidth={3.2} fill="none" opacity={0.45} filter="url(#aSoft1)" />
        <path d="M 356 360 C 364 400 366 460 365 540" stroke="#05070A" strokeWidth={3.4} fill="none" opacity={0.5} filter="url(#aSoft1)" />
        {/* turtleneck: rolled collar */}
        <path d="M 280 244 Q 300 256 320 243 L 324 300 Q 300 316 276 300 Z" fill="url(#aTurtle)" />
        <path d="M 280 244 Q 300 256 320 243 L 321 259 Q 300 274 279 261 Z" fill="#2B303A" opacity={0.9} />
        <path d="M 281 264 Q 300 276 319 263" stroke="#3E4551" strokeWidth={1} fill="none" opacity={0.35} />
        <path d="M 284 282 L 284 300 M 290 285 L 290 303 M 296 287 L 296 305 M 302 287 L 302 306 M 308 286 L 308 304 M 314 283 L 314 301" stroke="#2A2F37" strokeWidth={0.55} opacity={0.22} />
        {/* collar shadow on the chest */}
        <path d="M 264 312 C 280 332 292 340 300 342 C 308 340 320 332 336 312" stroke="#04060A" strokeWidth={6} fill="none" opacity={0.45} filter="url(#aSoft2)" />
        {/* open jacket lapels */}
        <path d="M 268 312 L 300 404 L 289 416 L 254 340 Z" fill="#1D222A" />
        <path d="M 332 312 L 300 404 L 311 416 L 346 340 Z" fill="#141920" />
        <path d="M 268 312 L 300 404" stroke="#454D5A" strokeWidth={1.2} fill="none" opacity={0.45} />
        <path d="M 332 312 L 300 404" stroke="#3A424E" strokeWidth={1.1} fill="none" opacity={0.38} />
        <path d="M 254 340 L 289 416" stroke="#05070A" strokeWidth={1.4} fill="none" opacity={0.5} />
        <path d="M 346 340 L 311 416" stroke="#05070A" strokeWidth={1.5} fill="none" opacity={0.55} />
        {/* zip */}
        <path d="M 300 404 L 300 732" stroke="#3D454F" strokeWidth={1.1} opacity={0.35} />
        <path d="M 300 404 L 300 732" stroke="#6A747F" strokeWidth={0.4} opacity={0.2} />
        <rect x={296.5} y={452} width={7} height={12} rx={2.2} fill="#5C646E" opacity={0.6} />
        {/* seams, pockets, folds */}
        <path d="M 224 460 C 216 512 214 576 216 652" stroke="#2D3540" strokeWidth={1.1} fill="none" opacity={0.32} />
        <path d="M 376 460 C 384 512 386 576 384 652" stroke="#343C47" strokeWidth={1.1} fill="none" opacity={0.28} />
        <path d="M 240 560 L 266 564 L 270 598 L 244 594 Z" stroke="#0B0D11" strokeWidth={1.3} fill="none" opacity={0.4} />
        <path d="M 360 560 L 334 564 L 330 598 L 356 594 Z" stroke="#0B0D11" strokeWidth={1.3} fill="none" opacity={0.36} />
        <path d="M 300 470 C 292 520 293 590 300 660" stroke="#000000" strokeWidth={6} fill="none" opacity={0.14} filter="url(#aSoft2)" />
        <path d="M 186 300 L 414 300 L 414 764 L 186 764 Z" fill="url(#aBodyShade)" opacity={0.45} />
      </g>

      {/* ---------- low bun ---------- */}
      <g transform={`translate(${hairShift * 0.35} 0) translate(339 231) scale(0.7) translate(-372 -236)`}>
        <path d="M 344 236 C 348 222 362 214 376 218 C 390 222 398 234 394 246 C 390 258 378 264 366 260 C 354 256 347 247 344 236 Z" fill="#07090D" />
        <path d="M 366 258 C 374 250 386 252 392 260 C 386 268 374 268 366 258 Z" fill="#05070A" />
        
        
        
        
        <path d="M 386 260 C 383 268 380 274 376 279" stroke="#090B0F" strokeWidth={2.2} fill="none" strokeLinecap="round" opacity={0.8} />
      </g>

      {/* ---------- head ---------- */}
      <g transform={`translate(${faceShift} 0)`}>
        <g transform={`rotate(${t * 1.5} 300 280) translate(300 0) scale(0.96 1) translate(-300 0)`}>
          {/* ears */}
          <path d="M 255.5 183 Q 251 180.5 249.5 187 Q 249 194 253.5 196.5 Q 255.5 191 255.7 187.5 Z" fill="#CDA58E" />
          <path d="M 344.5 183 Q 349 180.5 350.5 187 Q 351 194 346.5 196.5 Q 344.5 191 344.3 187.5 Z" fill="#BA907A" />
          <path d="M 247 186 Q 245 192 247 197" stroke="#916553" strokeWidth={0.9} fill="none" opacity={0.55} />
          <path d="M 353 186 Q 355 192 353 197" stroke="#805746" strokeWidth={0.9} fill="none" opacity={0.5} />

          {/* face */}
          <path
            d="M 300 116
               C 274 116 258 134 257 157
               C 256 175 262 194 269 207
               C 274 218 284 228 293 233
               C 296 235 298 236 300 236
               C 302 236 304 235 307 233
               C 316 228 326 218 332 207
               C 338 194 344 175 343 157
               C 342 134 326 116 300 116 Z"
            fill="url(#aSkin)"
          />
          <g clipPath="url(#aFaceClip)">
            <rect x="236" y="104" width="128" height="140" fill="url(#aFaceLight)" />
            {/* key light from the monitors on her left, falloff to the right */}
            <rect x="240" y="104" width="124" height="150" fill="url(#aKeyShade)" />
            <path d="M 344 168 C 348 194 343 216 333 231" stroke="#E8B58A" strokeWidth={2.6} fill="none" opacity={0.18} filter="url(#aSoft1)" />
            <ellipse cx="339" cy="198" rx="19" ry="34" fill="#4B2E22" opacity={0.13} filter="url(#aSoft2)" />
            <ellipse cx="262" cy="198" rx="11" ry="22" fill="#5A382A" opacity={0.1} filter="url(#aSoft2)" />
            <ellipse cx="274" cy="202" rx="14" ry="8" fill="#D2836E" opacity={0.18} filter="url(#aSoft2)" />
            <ellipse cx="327" cy="200" rx="11" ry="7" fill="#C87B68" opacity={0.14} filter="url(#aSoft2)" />
            <ellipse cx="293" cy="170" rx="21" ry="8" fill="#FFF0E0" opacity={0.2} filter="url(#aSoft2)" />
            <path d="M 262 216 Q 300 238 338 216 L 338 250 L 262 250 Z" fill="#2A1711" opacity={0.18} filter="url(#aSoft2)" />
            <ellipse cx="300" cy="229" rx="8" ry="3.6" fill="#FFE8D5" opacity={0.18} filter="url(#aSoft1)" />
            <ellipse cx="299.5" cy="210" rx="4.2" ry="2.2" fill="#FFE3CE" opacity={0.2} filter="url(#aSoft1)" />
            <ellipse cx="300" cy="221.5" rx="7" ry="2.4" fill="#FBD3C2" opacity={0.13} filter="url(#aSoft2)" />
            <path d="M 253 178 Q 300 190 347 176 L 347 152 Q 300 168 253 154 Z" fill="#2A1710" opacity={0.3} filter="url(#aSoft2)" />
          </g>

          {/* cheek contour */}
          <path d="M 260 200 Q 268 210 278 210" stroke="#9B6C57" strokeWidth={0.9} fill="none" opacity={0.16} />
          <path d="M 340 200 Q 332 210 322 210" stroke="#865A48" strokeWidth={0.9} fill="none" opacity={0.2} />

          {/* brows */}
          <path
            d={`M 255 ${169.8 + brow.y + brow.outer} Q 266 ${162.6 + brow.y + brow.inner} 284.5 ${169 + brow.y + brow.outer}`}
            stroke="#2A1F1A"
            strokeWidth={1.15}
            strokeLinecap="round"
            fill="none"
            opacity={0.88}
          />
          <path
            d={`M 345 ${169.8 + brow.y + brow.outer} Q 334 ${162.6 + brow.y + brow.inner} 315.5 ${169 + brow.y + brow.outer}`}
            stroke="#2A1F1A"
            strokeWidth={1.55}
            strokeLinecap="round"
            fill="none"
            opacity={0.88}
          />

          <Eye cx={272} cy={184} lid={lid} lookX={lk.x} lookY={lk.y} screen={screen} cold={expression === 'cold' || expression === 'guarded' || expression === 'defiant'} clipId="aEyeClipL" />
          <Eye cx={328} cy={184} lid={lid} lookX={lk.x} lookY={lk.y} screen={screen} cold={expression === 'cold' || expression === 'guarded' || expression === 'defiant'} flip clipId="aEyeClipR" />

          {/* nose */}
          <path d="M 299 199 L 297.8 206" stroke="#FFE9D7" strokeWidth={1.2} opacity={0.2} />
          <path d="M 303.4 197 C 306 203 305.6 208 303 211" stroke="#7E5340" strokeWidth={2.8} fill="none" opacity={0.14} filter="url(#aSoft1)" />
          <path d="M 300 214.6 L 300 217" stroke="#8A5C48" strokeWidth={1.4} fill="none" opacity={0.16} filter="url(#aSoft1)" />
          <path d="M 297 208.8 Q 299 211 302.4 210.6" stroke="#8A5F4C" strokeWidth={0.8} fill="none" strokeLinecap="round" opacity={0.28} />
          <path d="M 295.5 199 C 293.6 204 293.4 208 295.4 210.6" stroke="#6E4433" strokeWidth={2.4} fill="none" strokeLinecap="round" opacity={0.13} filter="url(#aSoft2)" />
          <ellipse cx={296.3} cy={210.8} rx={1.5} ry={0.68} fill="#4A2A1E" opacity={0.2} filter="url(#aSoft1)" />
          <ellipse cx={303.7} cy={210.8} rx={1.3} ry={0.62} fill="#4A2A1E" opacity={0.16} filter="url(#aSoft1)" />

          {/* lips */}
          <g transform="translate(300 218.5)">
            {mouthOpen > 0.02 ? (
              <>
                <path
                  d={`M -10.5 ${-0.5 + smile * 0.2} Q -5.2 -3.2 0 -2 Q 5.2 -3.2 10.5 ${-0.5 + smile * 0.2} Q 7 ${5 + mouthOpen * 6.5} 0 ${5.4 + mouthOpen * 6.5} Q -7 ${5 + mouthOpen * 6.5} -10.5 ${-0.5 + smile * 0.2} Z`}
                  fill="#38130F"
                />
                <path d={`M -8 ${1.8 + mouthOpen * 2.2} Q 0 ${3.6 + mouthOpen * 4} 8 ${1.8 + mouthOpen * 2.2}`} stroke="#D9A093" strokeWidth={1} fill="none" opacity={0.4} />
                <path d={`M -4.4 ${3.8 + mouthOpen * 4.4} Q 0 ${4.8 + mouthOpen * 4.8} 4.4 ${3.8 + mouthOpen * 4.4}`} stroke="#6B2A28" strokeWidth={1.5} fill="none" opacity={0.38} />
              </>
            ) : (
              <>
                <path
                  d={`M -12.6 ${smile * 0.3} Q -7.8 ${-3.2 + smile * 0.35} -0.4 ${-2.7 + smile * 0.45} Q 1.5 ${-3.6} 3.5 ${-2.6} Q 10 ${-2.5 + smile * 0.35} 12.6 ${smile * 0.3} Q 9 ${5 + smile} 0 ${5.7 + smile} Q -9 ${5 + smile} -11.4 ${smile * 0.3} Z`}
                  fill="url(#aLip)"
                />
                <path
                  d={`M -12.6 ${smile * 0.3} Q -6.4 ${-3.4 + smile * 0.35} 0 ${-2.6 + smile * 0.45} Q 6.4 ${-3.4 + smile * 0.35} 12.6 ${smile * 0.3}`}
                  stroke="#6B3A35"
                  strokeWidth={0.8}
                  fill="none"
                  opacity={0.65}
                />
                <path
                  d={`M -5.6 ${2.2 + smile * 0.7} Q 0 ${3.6 + smile} 5.6 ${2.2 + smile * 0.7}`}
                  stroke="#F5CCBC"
                  strokeWidth={0.85}
                  fill="none"
                  opacity={0.36}
                />
              </>
            )}
          </g>

          {/* beauty mark, under her left eye */}
          <ellipse cx={336} cy={204.5} rx={1.6} ry={1.3} fill="#3A211A" opacity={0.65} />

          {/* chin / jaw line */}
          <path d="M 284 228 Q 300 234 316 228" stroke="#553629" strokeWidth={0.9} fill="none" opacity={0.1} />

          {/* ---------- hair ---------- */}
          <g transform={`translate(${hairShift * 0.42} 0)`}>
            {/* crown */}
            <path
              d="M 300 88
                 C 260 88 240 112 242 146
                 C 243 158 247 166 253 172
                 C 266 162 280 156 300 154
                 C 322 156 336 162 348 172
                 C 355 166 359 157 360 144
                 C 362 110 340 88 300 88 Z"
              fill="url(#aHair)"
            />
            {/* short nape strands */}
            <path d="M 246 150 C 241 176 240 204 244 230 C 247 232 249 231 249 229 C 246 204 247 176 250 152 Z" fill="#0B0E14" />
            <path d="M 356 148 C 361 174 362 204 358 230 C 355 232 353 231 353 229 C 356 204 355 174 352 150 Z" fill="#090C12" />
            {/* fringe: soft side sweep hugging the left hairline */}
            <path
              d="M 298 96
                 C 276 102 259 118 253 138
                 C 249 150 250 162 255 170
                 C 261 172 267 172 271 168
                 C 273 152 277 134 283 118
                 C 287 108 292 101 298 96 Z"
              fill="url(#aFringe)"
            />
            {/* light along the sweep so it reads as hair, not a hood */}
            <path d="M 255 170 C 261 172 267 172 271 168" stroke="#7C93AC" strokeWidth={1.1} fill="none" opacity={0.26} filter="url(#aSoft2)" />
                        {/* hairline definition */}
                        <path d="M 271 178 C 273 164 278 150 284 136" stroke="#05070B" strokeWidth={1.4} fill="none" opacity={0.45} />
            <path d="M 360 164 C 353 154 346 149 339 146" stroke="#05070B" strokeWidth={1.2} fill="none" opacity={0.4} />
            <path d="M 251 171 C 247 157 248 143 253 131" stroke="#414D62" strokeWidth={1} fill="none" opacity={0.4} />
            <path d="M 357 126 C 360 140 360 153 358 163" stroke="#414D62" strokeWidth={0.9} fill="none" opacity={0.32} />
            {/* sheen + strand separation */}
            <path d="M 259 114 C 281 97 318 96 341 107" stroke="#6B7B94" strokeWidth={3.4} fill="none" opacity={0.42} filter="url(#aSoft1)" />
            <path d="M 266 106 C 286 94 314 93 335 102" stroke="#A8C2D8" strokeWidth={0.9} fill="none" opacity={0.2} filter="url(#aSoft1)" />
            
            
            {/* face-framing strands */}
            <path d="M 248 158 C 244 182 243 208 247 234 C 248 244 249 250 248 256 C 251 256 252 254 251 248 C 250 240 249 232 249 222 C 249 200 250 178 252 160 Z" fill="#0C0F15" opacity={0.95} />
            
            <path d="M 354 158 C 358 182 359 208 355 234 C 354 244 353 250 354 256 C 351 256 350 254 351 248 C 352 240 353 232 353 222 C 353 200 352 178 350 160 Z" fill="#090B10" opacity={0.95} />
            {/* earrings */}
            <g>
              <circle cx={250.5} cy={205.5} r={3.3} fill="none" stroke="#C4D2DC" strokeWidth={1.05} opacity={0.5} />
              <circle cx={250.5} cy={197.5} r={0.85} fill="#9FB0BC" opacity={0.42} />
              <circle cx={349.5} cy={206} r={3.6} fill="none" stroke="#C9D8E2" strokeWidth={1.15} opacity={0.54} />
              <circle cx={349.5} cy={198} r={0.95} fill="#A6B7C3" opacity={0.44} />
            </g>
          </g>
        </g>
      </g>

      {/* hair rim: keeps the silhouette from merging with the dark room */}
      <path d="M 246 150 C 250 116 272 92 302 90" stroke="#8FB6CE" strokeWidth={1.6} fill="none" opacity={0.26} filter="url(#aSoft1)" />
      <path d="M 354 148 C 356 122 344 98 322 91" stroke="#6E92AA" strokeWidth={1.2} fill="none" opacity={0.18} filter="url(#aSoft1)" />
      <path d="M 251 171 C 258 176 266 179 271 179" stroke="#9BC2D8" strokeWidth={1.2} fill="none" opacity={0.22} filter="url(#aSoft1)" />

      {/* ---------- rim light ---------- */}
      {rim > 0 ? (
        <g opacity={rim} style={{mixBlendMode: 'screen'}}>
          
          <path d="M 388 420 C 392 476 394 560 392 660" stroke="url(#aRimCool)" strokeWidth={2.4} fill="none" filter="url(#aSoft1)" opacity={0.34} />
          <path d="M 214 420 C 209 476 208 560 210 650" stroke="url(#aRimWarm)" strokeWidth={2.2} fill="none" filter="url(#aSoft1)" opacity={0.28} />
          
        </g>
      ) : null}
    </svg>
  );
};

/* Rear three-quarter view used for the wide surveillance shot. */
export const AmaraBack: React.FC<{
  rim?: number;
  style?: React.CSSProperties;
  viewBox?: string;
  preserve?: string;
}> = ({rim = 1, style, viewBox = '0 0 300 700', preserve = 'xMidYMax meet'}) => (
  <svg viewBox={viewBox} width="100%" height="100%" preserveAspectRatio={preserve} style={style}>
    <defs>
      <linearGradient id="bJacket" x1="0.06" y1="0" x2="0.9" y2="1">
        <stop offset="0%" stopColor="#252D38" />
        <stop offset="45%" stopColor="#12161D" />
        <stop offset="100%" stopColor="#06080B" />
      </linearGradient>
      <linearGradient id="bArm" x1="0" y1="0" x2="1" y2="0.3">
        <stop offset="0%" stopColor="#1B222B" />
        <stop offset="52%" stopColor="#0E1218" />
        <stop offset="100%" stopColor="#05080B" />
      </linearGradient>
      <linearGradient id="bTurtle" x1="0.1" y1="0" x2="0.9" y2="1">
        <stop offset="0%" stopColor="#2E3540" />
        <stop offset="55%" stopColor="#181C24" />
        <stop offset="100%" stopColor="#080A0E" />
      </linearGradient>
      <linearGradient id="bSkin" x1="0.1" y1="0" x2="1" y2="0.9">
        <stop offset="0%" stopColor="#1F1410" />
        <stop offset="38%" stopColor="#38251C" />
        <stop offset="72%" stopColor="#553B2D" />
        <stop offset="100%" stopColor="#7A5742" />
      </linearGradient>
      <linearGradient id="bFaceShade" x1="0" y1="0" x2="1" y2="0.4">
        <stop offset="0%" stopColor="#1C110C" stopOpacity="0.7" />
        <stop offset="46%" stopColor="#1C110C" stopOpacity="0.1" />
        <stop offset="100%" stopColor="#1C110C" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="bHair" x1="0.1" y1="0.02" x2="0.95" y2="1">
        <stop offset="0%" stopColor="#3E4A5C" />
        <stop offset="26%" stopColor="#252C37" />
        <stop offset="62%" stopColor="#151A22" />
        <stop offset="100%" stopColor="#070A0E" />
      </linearGradient>
      <linearGradient id="bHairBack" x1="0.6" y1="0" x2="0.2" y2="1">
        <stop offset="0%" stopColor="#2A323E" />
        <stop offset="55%" stopColor="#14181F" />
        <stop offset="100%" stopColor="#06080B" />
      </linearGradient>
      <linearGradient id="bRim" x1="0" y1="0" x2="1" y2="0.3">
        <stop offset="0%" stopColor="#D6EFFB" stopOpacity="0.95" />
        <stop offset="40%" stopColor="#7FB0CC" stopOpacity="0.26" />
        <stop offset="100%" stopColor="#6D9DBA" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="bRimR" x1="1" y1="0" x2="0" y2="0.3">
        <stop offset="0%" stopColor="#A8CEE4" stopOpacity="0.7" />
        <stop offset="50%" stopColor="#6D9DBA" stopOpacity="0.16" />
        <stop offset="100%" stopColor="#6D9DBA" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="bCollar" x1="0.2" y1="0" x2="0.8" y2="1">
        <stop offset="0%" stopColor="#232A34" />
        <stop offset="45%" stopColor="#141A22" />
        <stop offset="100%" stopColor="#080B10" />
      </linearGradient>
      <linearGradient id="bFade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="rgba(2,4,6,0)" />
        <stop offset="52%" stopColor="rgba(2,4,6,0.5)" />
        <stop offset="100%" stopColor="#010203" />
      </linearGradient>
      <filter id="bSoft" x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur stdDeviation="3" />
      </filter>
      <filter id="bSoft1" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="1.1" />
      </filter>
      <clipPath id="bFaceClip">
        <path d="M 158 56 C 180 56 196 70 202 92 C 205 104 206 116 208 126 C 211 132 214 137 213 140 C 211 142 209 144 210 146 C 212 149 212 152 210 154 C 212 157 211 160 209 162 C 207 166 206 170 204 174 C 200 179 195 182 190 181 C 184 180 181 174 179 166 C 176 156 174 144 173 132 C 171 116 172 96 175 80 C 177 68 166 56 158 56 Z" />
      </clipPath>
    </defs>

    {/* ---------- back, shoulders and arms ---------- */}
    <path
      d="M 150 182
         C 130 182 113 188 100 200
         C 86 212 78 226 76 242
         C 73 262 73 314 76 370
         L 80 456 L 84 640 L 216 640 L 220 456
         L 224 370
         C 227 314 227 262 224 242
         C 222 226 214 212 200 200
         C 187 188 170 182 150 182 Z"
      fill="url(#bJacket)"
    />
    {/* upper arms, separated from the back by a seam and a tone change */}
    <path d="M 101 199 C 86 213 77 230 75 250 C 72 286 73 348 76 406 L 84 470 L 100 468 C 94 414 92 348 96 292 C 98 258 103 224 112 204 Z" fill="url(#bArm)" />
    <path d="M 199 199 C 214 213 223 230 225 250 C 228 286 227 348 224 406 L 216 470 L 200 468 C 206 414 208 348 204 292 C 202 258 197 224 188 204 Z" fill="#080B10" />
    <path d="M 101 199 C 88 212 80 228 77 248" stroke="#46505E" strokeWidth={1.4} fill="none" opacity={0.32} />
    <path d="M 199 199 C 212 212 220 228 223 248" stroke="#333B46" strokeWidth={1.2} fill="none" opacity={0.26} />
    <path d="M 88 300 C 86 352 86 402 88 452" stroke="#313945" strokeWidth={1.1} fill="none" opacity={0.26} />
    <path d="M 212 300 C 214 352 214 402 212 452" stroke="#242A33" strokeWidth={1} fill="none" opacity={0.22} />
    {/* yoke seam */}
    <path d="M 100 208 C 122 197 178 197 200 208" stroke="#3F4956" strokeWidth={1.1} fill="none" opacity={0.3} />
    <path d="M 102 214 C 124 203 176 203 198 214" stroke="#04060A" strokeWidth={1.8} fill="none" opacity={0.35} filter="url(#bSoft1)" />
    {/* shoulder blades */}
    <ellipse cx={122} cy={296} rx={21} ry={34} fill="#020407" opacity={0.18} filter="url(#bSoft)" transform="rotate(-10 122 296)" />
    <ellipse cx={178} cy={296} rx={21} ry={34} fill="#020407" opacity={0.22} filter="url(#bSoft)" transform="rotate(10 178 296)" />
    {/* centre back seam */}
    <path d="M 150 212 C 148 300 148 460 150 636" stroke="#04060A" strokeWidth={1.6} fill="none" opacity={0.4} />
    <path d="M 151 214 C 150 320 150 480 151 630" stroke="#3D4754" strokeWidth={0.6} fill="none" opacity={0.14} />
    {/* waist gathers */}
    <path d="M 98 432 C 120 444 180 444 202 432" stroke="#04060A" strokeWidth={4} fill="none" opacity={0.38} filter="url(#bSoft)" />
    <path d="M 101 418 C 122 426 178 426 199 418" stroke="#39424E" strokeWidth={1} fill="none" opacity={0.2} />
    <path d="M 106 456 C 116 468 124 476 130 486" stroke="#2E3641" strokeWidth={1} fill="none" opacity={0.18} />
    <path d="M 194 456 C 184 468 176 476 170 486" stroke="#262D37" strokeWidth={1} fill="none" opacity={0.16} />

    {/* ---------- neck, rising out of the collar ---------- */}
    <path d="M 158 168 L 154 198 Q 169 210 186 198 L 190 166 Z" fill="url(#bSkin)" />
    <path d="M 159 170 L 155 194 Q 169 204 185 194 L 188 168 Z" fill="#1E1109" opacity={0.55} filter="url(#bSoft)" />
    <path d="M 161 172 C 160 180 161 188 165 194" stroke="#8A5F45" strokeWidth={1.6} fill="none" opacity={0.2} filter="url(#bSoft1)" />
    <path d="M 158 174 C 158 184 161 192 166 198" stroke="#C79C82" strokeWidth={1.6} fill="none" opacity={0.14} filter="url(#bSoft1)" />

    {/* ---------- turtleneck collar ---------- */}
    <path d="M 136 182 Q 164 200 196 178 L 202 226 Q 164 248 128 228 Z" fill="url(#bTurtle)" />
    <path d="M 138 190 Q 166 208 194 187" stroke="#4C5563" strokeWidth={1.1} fill="none" opacity={0.3} />
    <path d="M 130 222 Q 164 242 200 220" stroke="#05070A" strokeWidth={2.2} fill="none" opacity={0.48} />
    <path d="M 144 202 L 142 222 M 152 206 L 151 226 M 160 208 L 160 228 M 168 207 L 169 227 M 178 204 L 179 223" stroke="#232932" strokeWidth={0.55} opacity={0.26} />
    {/* jacket collar over the turtleneck */}
    <path d="M 124 220 Q 164 244 206 218 L 214 244 Q 164 272 114 246 Z" fill="url(#bCollar)" />
    <path d="M 126 224 Q 164 248 204 222" stroke="#3B4551" strokeWidth={1} fill="none" opacity={0.28} />
    {/* the collar rolls over, so its lower edge is soft, not a cut line */}
    <path d="M 118 240 Q 164 264 210 240" stroke="#05070A" strokeWidth={5} fill="none" opacity={0.5} filter="url(#bSoft)" />
    <path d="M 128 228 C 138 238 152 244 166 246" stroke="#48525F" strokeWidth={1.1} fill="none" opacity={0.22} filter="url(#bSoft1)" />
    <path d="M 200 226 C 190 236 176 242 162 244" stroke="#333B46" strokeWidth={1} fill="none" opacity={0.18} filter="url(#bSoft1)" />

    {/* ---------- the head: face first, hair laid over the back of it ---------- */}
    <g transform="translate(152 178) scale(0.74) translate(-152 -178)">
    <path
      d="M 158 56
         C 180 56 196 70 202 92
         C 205 104 206 116 208 126
         C 211 132 214 137 213 140
         C 211 142 209 144 210 146
         C 212 149 212 152 210 154
         C 212 157 211 160 209 162
         C 207 166 206 170 204 174
         C 200 179 195 182 190 181
         C 184 180 181 174 179 166
         C 176 156 174 144 173 132
         C 171 116 172 96 175 80
         C 177 68 166 56 158 56 Z"
      fill="url(#bSkin)"
    />
    <g clipPath="url(#bFaceClip)">
      {/* the back of the head is in shadow; the profile catches the monitors */}
      <rect x="168" y="50" width="52" height="136" fill="url(#bFaceShade)" />
      <rect x="200" y="60" width="18" height="126" fill="#D6AE90" opacity={0.16} filter="url(#bSoft)" />
      {/* brow ridge and socket */}
      <path d="M 193 104 C 199 101 205 102 208 106 C 205 111 200 113 195 111 Z" fill="#2A1A12" opacity={0.34} filter="url(#bSoft)" />
      <path d="M 195 104 C 199 102 203 102 206 104" stroke="#3A2418" strokeWidth={1.5} fill="none" opacity={0.4} />
      <path d="M 207 106 L 209 104" stroke="#1C110C" strokeWidth={0.9} opacity={0.4} />
      {/* the brow and the lash line, just inside the profile */}
      <path d="M 190 106 C 195 103 201 102 206 104 C 203 108 197 110 192 109 Z" fill="#241611" opacity={0.6} />
      <path d="M 198 112 C 202 110 206 110 208 112" stroke="#1A0F0A" strokeWidth={1.8} fill="none" opacity={0.7} strokeLinecap="round" />
      <path d="M 207 112 L 209 111" stroke="#120A06" strokeWidth={1} opacity={0.5} />
      <path d="M 197 115 C 201 114 205 115 207 117" stroke="#6B4B3B" strokeWidth={0.9} fill="none" opacity={0.35} />
      {/* cheekbone and hollow */}
      <ellipse cx={197} cy={124} rx={6.5} ry={4} fill="#C89B7C" opacity={0.22} filter="url(#bSoft)" />
      <path d="M 191 132 C 194 138 196 145 195 152" stroke="#2A1A12" strokeWidth={2.4} fill="none" opacity={0.22} filter="url(#bSoft)" />
      <path d="M 195 160 C 193 168 190 174 186 178 L 186 186 L 202 186 Z" fill="#120A06" opacity={0.4} filter="url(#bSoft)" />
      <ellipse cx={196} cy={128} rx={9} ry={13} fill="#6E4B3B" opacity={0.2} filter="url(#bSoft)" />
      <path d="M 190 120 C 188 134 189 150 193 162" stroke="#4A3024" strokeWidth={1.2} fill="none" opacity={0.2} filter="url(#bSoft1)" />
      {/* nostril, philtrum, lips */}
      <ellipse cx={209} cy={145} rx={2} ry={0.9} fill="#33180F" opacity={0.55} />
      <path d="M 205 150 Q 209 151 210 148" stroke="#3E2117" strokeWidth={1} fill="none" opacity={0.5} />
      <path d="M 205 155 Q 208 157 210 154" stroke="#A8795F" strokeWidth={0.9} fill="none" opacity={0.22} />
      <path d="M 202 158 Q 206 161 208 160" stroke="#2E1710" strokeWidth={0.8} fill="none" opacity={0.45} />
      {/* jaw shadow under the chin */}
      <path d="M 196 172 C 191 175 186 175 181 173 L 181 184 L 197 184 Z" fill="#1A0F0A" opacity={0.5} filter="url(#bSoft)" />
      {/* the jaw line */}
      <path d="M 200 166 C 198 172 194 177 190 179" stroke="#8A6552" strokeWidth={1} fill="none" opacity={0.2} />
      {/* the lit edge of the profile */}
      <path d="M 190 92 C 200 100 205 114 207 126" stroke="#C09472" strokeWidth={2.2} fill="none" opacity={0.4} filter="url(#bSoft1)" />
      <path d="M 208 127 C 211 133 214 138 213 141" stroke="#D0A382" strokeWidth={1.6} fill="none" opacity={0.5} filter="url(#bSoft1)" />
      <path d="M 210 146 C 212 150 212 153 210 155" stroke="#C99A78" strokeWidth={1.4} fill="none" opacity={0.42} filter="url(#bSoft1)" />
      <path d="M 206 164 C 205 170 203 175 200 179" stroke="#BE9070" strokeWidth={1.4} fill="none" opacity={0.36} filter="url(#bSoft1)" />
    </g>

    {/* ---------- hair: sweeps back into the bun ---------- */}
    <path
      d="M 146 40
         C 118 42 98 62 96 92
         C 95 118 100 144 110 161
         C 118 174 130 181 143 181
         C 152 181 160 178 166 172
         C 172 166 176 158 178 150
         C 176 142 174 134 174 126
         C 174 112 177 100 182 90
         C 187 78 184 62 174 52
         C 166 44 156 40 146 40 Z"
      fill="url(#bHair)"
    />
    {/* crown planes */}
    <path d="M 146 44 C 124 46 108 60 102 84 C 114 68 130 60 148 60 C 170 60 180 74 183 90 C 180 64 166 46 146 44 Z" fill="#7C8FA5" opacity={0.16} filter="url(#bSoft)" />
    <path d="M 104 96 C 104 116 110 136 122 150 C 116 132 114 112 116 94 C 111 94 107 95 104 96 Z" fill="#4E5C70" opacity={0.26} filter="url(#bSoft)" />
    {/* strand flow, drawn from the crown back into the nape */}
    <path d="M 109 112 C 114 134 124 152 136 162" stroke="#333C4A" strokeWidth={1.2} fill="none" opacity={0.5} />
    <path d="M 118 92 C 123 118 131 142 143 156" stroke="#2A3240" strokeWidth={1.1} fill="none" opacity={0.46} />
    <path d="M 133 80 C 137 110 142 136 151 152" stroke="#232A35" strokeWidth={1} fill="none" opacity={0.42} />
    <path d="M 152 82 C 154 110 152 134 147 152" stroke="#1F252F" strokeWidth={1} fill="none" opacity={0.4} />
    <path d="M 168 96 C 170 116 167 136 160 150" stroke="#1A2029" strokeWidth={1} fill="none" opacity={0.4} />
    <path d="M 178 108 C 180 126 177 142 171 154" stroke="#181D25" strokeWidth={0.9} fill="none" opacity={0.36} />
    {/* sheen, broken so the crown is not a helmet */}
    <path d="M 110 80 C 122 60 144 52 166 60" stroke="#A9BDCE" strokeWidth={2} fill="none" opacity={0.15} filter="url(#bSoft)" />
    <path d="M 106 98 C 116 74 138 62 160 66" stroke="#93A8BC" strokeWidth={1} fill="none" opacity={0.12} filter="url(#bSoft1)" />
    <path d="M 124 64 C 134 56 148 54 160 58" stroke="#C2D2E0" strokeWidth={0.8} fill="none" opacity={0.12} filter="url(#bSoft1)" />
    {/* clumps on the crown so the dome is not a single surface */}
    <ellipse cx={124} cy={92} rx={20} ry={13} fill="#2A323D" opacity={0.3} filter="url(#bSoft)" transform="rotate(-18 124 92)" />
    <ellipse cx={154} cy={74} rx={18} ry={11} fill="#2E3742" opacity={0.26} filter="url(#bSoft)" />
    <path d="M 118 112 C 122 96 132 84 146 78" stroke="#0D1117" strokeWidth={1.3} fill="none" opacity={0.45} />
    <path d="M 150 82 C 158 90 164 102 166 114" stroke="#0B0F14" strokeWidth={1.2} fill="none" opacity={0.4} />
    {/* flyaways */}
    <path d="M 104 74 C 96 68 89 67 83 70" stroke="#1A2029" strokeWidth={1} fill="none" opacity={0.5} />
    <path d="M 172 68 C 180 62 188 62 193 66" stroke="#161C24" strokeWidth={0.9} fill="none" opacity={0.45} />
    <path d="M 110 148 C 104 164 104 182 108 196" stroke="#3D4655" strokeWidth={1} fill="none" opacity={0.26} />

    {/* ---------- low messy bun at the nape ---------- */}
    <path d="M 104 156 C 103 145 112 139 122 140 C 133 141 143 146 144 155 C 145 165 136 172 126 173 C 114 174 105 166 104 156 Z" fill="url(#bHairBack)" />
    <path d="M 107 164 C 114 169 122 170 130 165" stroke="#080B10" strokeWidth={2.2} fill="none" opacity={0.45} filter="url(#bSoft1)" />
    <path d="M 144 150 C 147 160 145 170 139 176" stroke="#0A0D12" strokeWidth={2.6} fill="none" opacity={0.4} filter="url(#bSoft1)" />
    <path d="M 102 166 C 112 178 134 180 145 166" stroke="#3B4552" strokeWidth={1.6} fill="none" opacity={0.44} />
    <path d="M 106 150 C 116 142 132 142 141 152" stroke="#515E6E" strokeWidth={1.1} fill="none" opacity={0.28} />
    <path d="M 99 158 C 104 172 112 179 122 181 C 133 179 141 171 146 160" stroke="#04060A" strokeWidth={2} fill="none" opacity={0.45} />
    <path d="M 110 152 C 116 160 126 164 136 160" stroke="#4E5A69" strokeWidth={0.8} fill="none" opacity={0.3} />
    {/* loose strands escaping the bun */}
    <path d="M 101 166 C 95 184 94 200 98 216 C 100 224 103 230 106 236" stroke="#171D25" strokeWidth={2.4} fill="none" strokeLinecap="round" opacity={0.8} />
    <path d="M 109 174 C 105 192 105 208 110 224" stroke="#2A323D" strokeWidth={1.1} fill="none" strokeLinecap="round" opacity={0.4} />
    <path d="M 140 158 C 148 172 150 186 147 200" stroke="#151B22" strokeWidth={1.8} fill="none" strokeLinecap="round" opacity={0.6} />
    <path d="M 172 146 C 178 158 178 170 174 180" stroke="#1D232C" strokeWidth={1.4} fill="none" strokeLinecap="round" opacity={0.45} />

    {/* ---------- the ear and the silver earring ---------- */}
    <path d="M 179 116 C 183 114 186 118 186 124 C 186 130 184 135 181 137 C 178 131 178 123 179 116 Z" fill="#5C4132" />
    <path d="M 180 120 C 182 121 183 126 182 130" stroke="#3A2519" strokeWidth={0.8} fill="none" opacity={0.55} />
    <path d="M 179 117 C 181 116 183 119 184 122" stroke="#B98F72" strokeWidth={0.6} fill="none" opacity={0.22} />
    <g>
      <circle cx={182} cy={140} r={2.3} fill="none" stroke="#C2D4DE" strokeWidth={1} opacity={0.55} />
      <circle cx={182} cy={137.8} r={0.6} fill="#E8F2F8" opacity={0.4} />
    </g>

    </g>

    {/* ---------- rim light ---------- */}
    {rim > 0 ? (
      <g opacity={rim}>
        <path d="M 118 114 C 117 132 121 150 130 162" stroke="url(#bRim)" strokeWidth={1.7} fill="none" filter="url(#bSoft1)" opacity={0.5} />
        <path d="M 173 110 C 176 118 177 126 176 133" stroke="url(#bRimR)" strokeWidth={1.2} fill="none" filter="url(#bSoft1)" opacity={0.36} />
        <path d="M 100 200 C 86 213 78 230 76 248" stroke="url(#bRim)" strokeWidth={2.4} fill="none" filter="url(#bSoft1)" opacity={0.44} />
        <path d="M 200 200 C 214 213 222 230 224 248" stroke="url(#bRimR)" strokeWidth={1.8} fill="none" filter="url(#bSoft1)" opacity={0.32} />
        <path d="M 75 290 C 72 348 72 444 75 550" stroke="url(#bRim)" strokeWidth={1.5} fill="none" filter="url(#bSoft1)" opacity={0.22} />
        <path d="M 225 300 C 227 380 227 480 224 566" stroke="url(#bRimR)" strokeWidth={1} fill="none" filter="url(#bSoft1)" opacity={0.16} />
      </g>
    ) : null}

    {/* her lap and the chair falling into darkness */}
    <rect x={0} y={520} width={300} height={180} fill="url(#bFade)" />
  </svg>
);
