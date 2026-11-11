import React from 'react';

export type Expression =
  | 'tired'
  | 'neutral'
  | 'alert'
  | 'fear'
  | 'sad'
  | 'relief'
  | 'unease'
  | 'dread'
  | 'shock'
  | 'gasp';
export type Look = 'camera' | 'left' | 'right' | 'down' | 'door' | 'up';

type Props = {
  expression?: Expression;
  look?: Look;
  mouth?: number;
  turn?: number;
  glasses?: boolean;
  rim?: number;
  lidOverride?: number;
  sweat?: number;
  preserve?: string;
  viewBox?: string;
  style?: React.CSSProperties;
};

const EYE_LID: Record<Expression, number> = {
  tired: 0.34,
  neutral: 0.16,
  alert: 0.04,
  fear: 0.0,
  sad: 0.38,
  relief: 0.48,
  unease: 0.2,
  dread: 0.26,
  shock: 0.0,
  gasp: 0.0,
};

const BROW: Record<Expression, {y: number; inner: number; outer: number; w: number}> = {
  tired: {y: 1, inner: 2, outer: -2, w: 3.6},
  neutral: {y: 0, inner: 0, outer: 0, w: 3.8},
  alert: {y: -5, inner: -1, outer: -4, w: 3.2},
  fear: {y: -7, inner: -5, outer: -2, w: 3.2},
  sad: {y: -1, inner: -4, outer: 3, w: 3.4},
  relief: {y: 2, inner: 2, outer: 0, w: 3.6},
  unease: {y: -1, inner: -1, outer: 1, w: 3.4},
  dread: {y: -3, inner: -6, outer: 1, w: 3.3},
  shock: {y: -9, inner: -6, outer: -3, w: 3.1},
  gasp: {y: -11, inner: -8, outer: -4, w: 3.0},
};

// default mouth opening per expression (only used when `mouth` is omitted)
const MOUTH_DEFAULT: Record<Expression, number> = {
  tired: 0,
  neutral: 0,
  alert: 0,
  fear: 0.08,
  sad: 0,
  relief: 0,
  unease: 0,
  dread: 0.04,
  shock: 0.34,
  gasp: 0.62,
};

const LOOK: Record<Look, {x: number; y: number; head: number}> = {
  camera: {x: 0, y: 0, head: 0},
  left: {x: -2.6, y: 0.3, head: -0.3},
  right: {x: 2.6, y: 0.3, head: 0.3},
  down: {x: 0.3, y: 2.2, head: 0.14},
  up: {x: 0, y: -1.8, head: -0.2},
  door: {x: 3, y: -0.4, head: 0.62},
};

const Eye: React.FC<{
  cx: number;
  cy: number;
  lid: number;
  lookX: number;
  lookY: number;
  fear?: boolean;
  wide?: boolean;
  strain?: boolean;
  flip?: boolean;
}> = ({cx, cy, lid, lookX, lookY, fear, wide, strain, flip}) => {
  const w = 21;
  const h = 9.5;
  const irisR = wide ? 3.55 : fear ? 4.1 : 4.9;
  const irisX = cx + lookX * 1.7;
  const irisY = cy + lookY * 1.2;
  return (
    <g transform={flip ? `translate(${cx * 2} 0) scale(-1 1)` : undefined}>
      {/* eye socket shadow */}
      <ellipse cx={cx + 1} cy={cy - 2} rx={w + 4} ry={h + 5} fill="#3A2A22" opacity={0.22} />
      <path
        d={`M ${cx - w} ${cy + 0.5} Q ${cx - w * 0.3} ${cy - h} ${cx + w * 0.5} ${cy - h * 0.45} Q ${cx + w * 0.85} ${cy - h * 0.2} ${cx + w} ${cy + 1} Q ${cx + w * 0.2} ${cy + h} ${cx - w * 0.6} ${cy + h * 0.5} Z`}
        fill="#C9BFB2"
        opacity={0.9}
      />
      <g clipPath="url(#eyeClip)">
        <circle cx={irisX} cy={irisY} r={irisR} fill="#2E2A26" />
        <circle cx={irisX} cy={irisY} r={irisR * 0.48} fill="#0E0C0B" />
        <circle cx={irisX - irisR * 0.4} cy={irisY - irisR * 0.45} r={1.1} fill="#F2EDE4" opacity={0.8} />
        <circle cx={irisX + irisR * 0.3} cy={irisY + irisR * 0.4} r={0.7} fill="#C9B49F" opacity={0.5} />
      </g>
      {/* upper lid */}
      <path
        d={`M ${cx - w} ${cy} Q ${cx - w * 0.25} ${cy - h - 0.5} ${cx + w * 0.5} ${cy - h * 0.4} Q ${cx + w * 0.85} ${cy - h * 0.15} ${cx + w} ${cy + 1}`}
        fill="none"
        stroke="#161210"
        strokeWidth={2.2}
        strokeLinecap="round"
        transform={`translate(0 ${lid * 8})`}
      />
      <path
        d={`M ${cx - w * 0.55} ${cy + h * 0.5} Q ${cx + w * 0.2} ${cy + h * 0.72} ${cx + w * 0.8} ${cy + 1.6}`}
        fill="none"
        stroke="#7E6656"
        strokeWidth={0.9}
        opacity={0.55}
      />
      {strain ? (
        <>
          {/* lower-lid tension + under-eye crease */}
          <path
            d={`M ${cx - w * 0.72} ${cy + h * 0.74} Q ${cx + w * 0.05} ${cy + h * 1.08} ${cx + w * 0.82} ${cy + 3.2}`}
            fill="none"
            stroke="#5B3D31"
            strokeWidth={1.1}
            opacity={0.42}
          />
          <path
            d={`M ${cx - w * 0.5} ${cy + h * 1.35} Q ${cx + w * 0.15} ${cy + h * 1.6} ${cx + w * 0.7} ${cy + h * 1.12}`}
            fill="none"
            stroke="#7A5344"
            strokeWidth={0.9}
            opacity={0.24}
          />
        </>
      ) : null}
      <path
        d={`M ${cx - w} ${cy} Q ${cx - w * 0.25} ${cy - h - 0.5} ${cx + w * 0.5} ${cy - h * 0.4} Q ${cx + w * 0.85} ${cy - h * 0.15} ${cx + w} ${cy + 1} L ${cx + w} ${cy - 5} L ${cx - w} ${cy - 5} Z`}
        fill="#241C18"
        opacity={0.12 + lid * 0.3}
      />
    </g>
  );
};

export const Noah: React.FC<Props> = ({
  expression = 'tired',
  look = 'camera',
  mouth,
  turn = 0,
  glasses = false,
  rim = 1,
  lidOverride,
  sweat = 0,
  preserve = 'xMidYMax meet',
  viewBox = '0 0 600 1200',
  style,
}) => {
  const lid = Math.max(EYE_LID[expression], lidOverride ?? 0);
  const brow = BROW[expression];
  const lk = LOOK[look];
  const t = Math.max(-1, Math.min(1, turn + lk.head * 0.32));
  const faceShift = t * 8;
  const hairShift = t * 4.5;
  const mouthOpen = Math.max(0, Math.min(1, mouth ?? MOUTH_DEFAULT[expression]));
  const wide = expression === 'shock' || expression === 'gasp';
  const strain = expression === 'fear' || expression === 'shock' || expression === 'gasp' || expression === 'dread';
  const smile =
    expression === 'relief' ? 2.6 : expression === 'sad' ? -1.8 : expression === 'dread' ? -1.2 : expression === 'shock' ? -2.4 : 0;
  const mouthW = expression === 'gasp' ? 19 : 17;

  return (
    <svg viewBox={viewBox} width="100%" height="100%" style={style} preserveAspectRatio={preserve}>
      <defs>
        <linearGradient id="nSkin" x1="0.15" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#D2AF9A" />
          <stop offset="38%" stopColor="#B48C77" />
          <stop offset="72%" stopColor="#8A6655" />
          <stop offset="100%" stopColor="#5E4438" />
        </linearGradient>
        <linearGradient id="nHair" x1="0.2" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor="#2D3240" />
          <stop offset="30%" stopColor="#171A21" />
          <stop offset="70%" stopColor="#0B0C10" />
          <stop offset="100%" stopColor="#060709" />
        </linearGradient>
        <linearGradient id="nShirt" x1="0" y1="0" x2="0.7" y2="1">
          <stop offset="0%" stopColor="#23262C" />
          <stop offset="40%" stopColor="#14161A" />
          <stop offset="100%" stopColor="#08090B" />
        </linearGradient>
        <linearGradient id="nTee" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#33363C" />
          <stop offset="100%" stopColor="#15171B" />
        </linearGradient>
        <linearGradient id="nRimCool" x1="0" y1="0" x2="1" y2="0.4">
          <stop offset="0%" stopColor="#9FC6E8" stopOpacity="1" />
          <stop offset="50%" stopColor="#5F86A8" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#5F86A8" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="nRimWarm" x1="1" y1="0" x2="0" y2="0.5">
          <stop offset="0%" stopColor="#F0AC78" stopOpacity="1" />
          <stop offset="55%" stopColor="#B4703F" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#B4703F" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="nFaceLight" cx="0.28" cy="0.3" r="0.95">
          <stop offset="0%" stopColor="#F2D6BF" stopOpacity="0.3" />
          <stop offset="45%" stopColor="#8A6653" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#0C0806" stopOpacity="0.72" />
        </radialGradient>
        <linearGradient id="nBodyShade" x1="0" y1="0" x2="1" y2="0.2">
          <stop offset="0%" stopColor="#000000" stopOpacity="0" />
          <stop offset="55%" stopColor="#000000" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="nGlass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#C6DCEA" stopOpacity="0.15" />
          <stop offset="55%" stopColor="#7F97A8" stopOpacity="0.03" />
          <stop offset="100%" stopColor="#E29A72" stopOpacity="0.1" />
        </linearGradient>
        <clipPath id="eyeClip">
          <path d="M 246 197 Q 266 186 286 197 Q 266 206 246 197 Z" />
          <path d="M 314 197 Q 334 186 354 197 Q 334 206 314 197 Z" />
        </clipPath>
        <clipPath id="faceClip">
          <path d="M 244 138 Q 300 112 356 138 L 356 200 Q 354 250 300 274 Q 246 250 244 200 Z" />
        </clipPath>
        <filter id="soft1" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="1.6" />
        </filter>
        <filter id="soft2" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>

      {/* ---------- nape (thin, behind neck only) ---------- */}
      <g transform={`translate(${hairShift * 0.5} 0)`}>
        <path d="M 268 214 C 276 236 288 244 300 244 C 312 244 324 236 332 214 Z" fill="#0B0C10" opacity="0.85" />
      </g>

      {/* ---------- hips + legs ---------- */}
      <g transform={`translate(${t * 3} 0)`}>
        {/* pelvis: joins the trousers to the shirt hem so the waist reads as one body */}
        <path
          d="M 258 596 L 342 596 C 351 630 357 662 360 696 L 357 730 L 316 730 L 307 700 L 300 690 L 293 700 L 284 730 L 243 730 L 240 696 C 243 662 249 630 258 596 Z"
          fill="#0D1014"
        />
        <path d="M 258 640 Q 300 652 342 640 L 344 660 Q 300 672 256 660 Z" fill="#08090B" />
        <path d="M 262 664 Q 300 676 339 664" stroke="#1E2229" strokeWidth={1.2} fill="none" opacity={0.5} />
        <path d="M 300 666 L 300 690" stroke="#08090B" strokeWidth={2.4} opacity={0.75} />
        <path d="M 250 660 C 248 680 246 700 245 716" stroke="#20242B" strokeWidth={1.1} fill="none" opacity={0.4} />
        <path d="M 350 660 C 352 680 354 700 355 716" stroke="#23272F" strokeWidth={1.1} fill="none" opacity={0.4} />
        <path d="M 252 700 L 244 1016 L 276 1016 L 292 706 Z" fill="#0B0D10" />
        <path d="M 348 700 L 358 1016 L 326 1016 L 310 706 Z" fill="#0F1115" />
        <path d="M 244 1016 L 230 1064 L 290 1064 L 286 1016 Z" fill="#08090B" />
        <path d="M 358 1016 L 372 1064 L 312 1064 L 316 1016 Z" fill="#0A0B0E" />
        <path d="M 230 1064 Q 226 1078 236 1080 L 292 1080 Q 300 1074 290 1064 Z" fill="#15161A" />
        <path d="M 372 1064 Q 376 1078 366 1080 L 310 1080 Q 302 1074 312 1064 Z" fill="#17181C" />
        <path d="M 258 720 L 250 996" stroke="#262A32" strokeWidth="1.2" opacity="0.45" />
        <path d="M 344 730 L 352 996" stroke="#2A2E36" strokeWidth="1.1" opacity="0.35" />
      </g>

      {/* ---------- neck (under the collar) ---------- */}
      <path d="M 284 246 L 284 312 Q 300 324 316 312 L 316 246 Z" fill="url(#nSkin)" />
      <path d="M 285 258 Q 300 294 315 260 L 315 312 Q 300 322 285 312 Z" fill="#33231C" opacity="0.62" />
      <path d="M 284 252 L 284 292 Q 300 306 316 292 L 316 252 Z" fill="#1D120E" opacity="0.45" filter="url(#soft2)" />

      {/* ---------- torso ---------- */}
      <g transform={`translate(${t * 2.5} 0)`}>
        <path d="M 280 306 L 320 306 L 326 340 L 344 646 L 256 646 L 274 340 Z" fill="url(#nTee)" />
        <path
          d="M 300 300
             C 268 302 240 314 226 336
             C 210 360 204 404 202 452
             L 208 648 L 262 652 L 270 486 L 272 652 L 328 652 L 330 486 L 338 652 L 392 648
             L 398 452
             C 396 404 390 360 374 336
             C 360 314 332 302 300 300 Z"
          fill="url(#nShirt)"
        />
        <path
          d="M 228 334 C 208 346 196 382 192 428 L 186 552 L 214 558 L 220 474 L 232 404 Z"
          fill="#0F1115"
        />
        <path
          d="M 372 334 C 392 346 404 382 408 428 L 414 552 L 386 558 L 380 474 L 368 404 Z"
          fill="#0B0C0F"
        />
        <path d="M 200 408 L 192 540" stroke="#2B3038" strokeWidth="1.3" opacity="0.5" />
        <path d="M 402 412 L 410 540" stroke="#3A404A" strokeWidth="1.2" opacity="0.45" />
        {/* hands in pockets hint */}
        <path d="M 186 552 Q 196 566 214 558 L 212 574 Q 196 580 188 566 Z" fill="#1B1D22" />
        <path d="M 414 552 Q 404 566 386 558 L 388 574 Q 404 580 412 566 Z" fill="#1A1C21" />
        <path d="M 280 302 L 300 344 L 286 356 L 264 320 Z" fill="#1D1F24" />
        <path d="M 320 302 L 300 344 L 314 356 L 336 320 Z" fill="#16181C" />
        <path d="M 264 322 L 286 356 L 276 366 L 256 334 Z" fill="#25282F" opacity="0.85" />
        <path d="M 268 340 L 286 356" stroke="#4A505C" strokeWidth="1" opacity="0.55" />
        <path d="M 336 322 L 314 356 L 324 366 L 344 334 Z" fill="#1D2026" opacity="0.9" />
        <path d="M 332 340 L 314 356" stroke="#4F5562" strokeWidth="0.9" opacity="0.4" />
        <path d="M 264 566 Q 300 578 338 566" stroke="#2E323A" strokeWidth="1" fill="none" opacity="0.35" />
        <path d="M 270 612 Q 300 624 332 612" stroke="#282C34" strokeWidth="1" fill="none" opacity="0.28" />
        {/* torso shadow pass */}
        <path d="M 202 336 L 398 336 L 398 652 L 202 652 Z" fill="url(#nBodyShade)" opacity="0.55" />
        {/* crew collar over the neck base */}
        <path d="M 278 296 Q 300 320 322 296 L 330 312 Q 300 344 270 312 Z" fill="url(#nTee)" />
        <path d="M 278 296 Q 300 320 322 296" stroke="#3A3F48" strokeWidth="1.4" fill="none" opacity="0.55" />
        <path d="M 278 300 Q 300 324 322 300" stroke="#0A0B0E" strokeWidth="2.6" fill="none" opacity="0.5" filter="url(#soft1)" />
      </g>

      {/* ---------- head ---------- */}
      <g transform={`translate(${faceShift} 0)`}>
        <g transform={`rotate(${t * 1.8} 300 300) translate(300 0) scale(0.955 1) translate(-300 0)`}>
          <path d="M 246 184 Q 234 180 232 194 Q 231 210 244 212 Z" fill="#9E7A66" />
          <path d="M 354 184 Q 366 180 368 194 Q 369 210 356 212 Z" fill="#936F5C" />

          <path
            d="M 244 138
               Q 300 112 356 138
               L 356 200
               Q 354 250 300 274
               Q 246 250 244 200 Z"
            fill="url(#nSkin)"
          />
          <g clipPath="url(#faceClip)">
            <rect x="230" y="100" width="150" height="200" fill="url(#nFaceLight)" />
            <ellipse cx="348" cy="214" rx="30" ry="52" fill="#3E2A20" opacity="0.3" filter="url(#soft2)" />
            <ellipse cx="252" cy="220" rx="20" ry="36" fill="#4E3327" opacity="0.22" filter="url(#soft2)" />
            <path d="M 244 250 Q 300 282 356 250 L 356 280 L 244 280 Z" fill="#1A100C" opacity="0.25" filter="url(#soft2)" />
          </g>

          {/* cheekbone hint */}
          <path d="M 252 214 Q 262 226 274 224" stroke="#8B6553" strokeWidth="1" fill="none" opacity="0.35" />
          <path d="M 348 214 Q 338 226 326 224" stroke="#7A5646" strokeWidth="1" fill="none" opacity="0.4" />

          {/* brows */}
          <path
            d={`M 254 ${178 + brow.y + brow.outer} Q 268 ${168 + brow.y + brow.inner} 282 ${176 + brow.y + brow.outer}`}
            stroke="#151110"
            strokeWidth={brow.w}
            strokeLinecap="round"
            fill="none"
            opacity="0.95"
          />
          <path
            d={`M 346 ${178 + brow.y + brow.outer} Q 332 ${168 + brow.y + brow.inner} 318 ${176 + brow.y + brow.outer}`}
            stroke="#151110"
            strokeWidth={brow.w}
            strokeLinecap="round"
            fill="none"
            opacity="0.95"
          />

          {/* scar above / through his left eyebrow */}
          <g>
            <path d="M 333 162 C 336 170 339 179 341 189" stroke="#A2634F" strokeWidth="6" opacity="0.14" strokeLinecap="round" fill="none" filter="url(#soft1)" />
            <path d="M 333 162 C 336 170 339 179 341 189" stroke="#5E3226" strokeWidth="3.1" opacity="0.55" strokeLinecap="round" fill="none" />
            <path d="M 334 164 C 336 171 339 180 340 187" stroke="#FBE0CD" strokeWidth="2" opacity="0.9" strokeLinecap="round" fill="none" />
            {[
              [334.6, 168.5, 330.6, 167.2],
              [336.9, 176, 332.9, 174.7],
              [338.8, 183.2, 334.8, 181.9],
            ].map(([x1, y1, x2, y2], i) => (
              <path key={i} d={`M ${x1} ${y1} L ${x2} ${y2}`} stroke="#573026" strokeWidth="1.7" opacity="0.45" strokeLinecap="round" />
            ))}
          </g>

          <Eye cx={266} cy={197} lid={lid} lookX={lk.x} lookY={lk.y} fear={expression === 'fear'} wide={wide} strain={strain} />
          <Eye cx={334} cy={197} lid={lid} lookX={lk.x} lookY={lk.y} fear={expression === 'fear'} wide={wide} strain={strain} flip />

          {/* nose */}
          <path d="M 300 202 L 296 222 Q 292 230 288 232 Q 296 236 302 232" stroke="#6E4C3C" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.65" />
          <path d="M 304 204 L 305 224" stroke="#E8C9B2" strokeWidth="1" opacity="0.22" />
          <ellipse cx="291" cy="232" rx="3.4" ry="1.6" fill="#3A241B" opacity="0.45" filter="url(#soft1)" />

          {/* mouth */}
          <g transform="translate(300 250)">
            {mouthOpen > 0.02 ? (
              <>
                <path
                  d={`M ${-mouthW} ${-1 + smile * 0.2} Q 0 ${-5 + smile * 0.4} ${mouthW} ${-1 + smile * 0.2} Q 0 ${5 + mouthOpen * 12} ${-mouthW} ${-1 + smile * 0.2} Z`}
                  fill="#25100E"
                />
                {mouthOpen > 0.38 ? (
                  <>
                    {/* upper teeth + tongue, keeps the gasp from reading as a black hole */}
                    <path
                      d={`M ${-mouthW + 6} ${0.2 + smile * 0.2} Q 0 ${-3.2 + smile * 0.4} ${mouthW - 6} ${0.2 + smile * 0.2} L ${mouthW - 6} ${2.1 + mouthOpen * 0.9} Q 0 ${0.1 + mouthOpen * 0.6} ${-mouthW + 6} ${2.1 + mouthOpen * 0.9} Z`}
                      fill="#C2AC9B"
                      opacity={0.72}
                    />
                    <path
                      d={`M ${-mouthW + 7} ${5 + mouthOpen * 7} Q 0 ${2 + mouthOpen * 9} ${mouthW - 7} ${5 + mouthOpen * 7} Q 0 ${9 + mouthOpen * 12} ${-mouthW + 7} ${5 + mouthOpen * 7} Z`}
                      fill="#6E332C"
                      opacity={0.55}
                    />
                  </>
                ) : (
                  <path d={`M ${-mouthW + 4} ${2 + mouthOpen * 4} Q 0 ${6 + mouthOpen * 8} ${mouthW - 4} ${2 + mouthOpen * 4}`} fill="#6E332C" opacity={0.5} />
                )}
              </>
            ) : (
              <path
                d={`M ${-mouthW} ${smile * -0.5} Q 0 ${2.6 + smile} ${mouthW} ${smile * -0.5}`}
                stroke="#5E2F29"
                strokeWidth="1.9"
                strokeLinecap="round"
                fill="none"
                opacity="0.9"
              />
            )}
            <path
              d={`M ${-mouthW * 0.55} ${3.4 + mouthOpen * 10} Q 0 ${6.6 + mouthOpen * 12} ${mouthW * 0.55} ${3.4 + mouthOpen * 10}`}
              stroke="#CE9380"
              strokeWidth="0.9"
              fill="none"
              opacity="0.25"
            />
          </g>

          <path d="M 258 244 Q 300 268 342 244" stroke="#4E3327" strokeWidth="1.4" fill="none" opacity="0.2" />
        </g>

        {/* ---------- hair front (full cap, no scalp, eyes clear) ---------- */}
        <g transform={`translate(${hairShift * 0.4} 0)`}>
          {/* base cap - guarantees the scalp is never exposed */}
          <path
            d="M 300 94
               C 250 94 232 120 238 150
               C 240 156 244 160 250 163
               L 350 163
               C 356 160 360 156 362 150
               C 368 120 350 94 300 94 Z"
            fill="url(#nHair)"
          />
          {/* wide overlapping locks - solid fringe with soft points */}
          <path
            d="M 236 150
               C 234 118 252 100 280 96
               C 290 96 300 98 306 104
               C 292 118 282 134 276 152
               C 272 168 268 182 264 192
               C 254 178 244 164 236 150 Z"
            fill="#171A21"
          />
          <path
            d="M 268 100
               C 288 92 316 94 330 106
               C 316 122 306 140 300 158
               C 296 172 294 180 292 188
               C 282 172 274 156 268 140 Z"
            fill="url(#nHair)"
          />
          <path
            d="M 306 102
               C 328 96 352 104 366 120
               C 348 130 338 146 332 160
               C 328 172 322 182 316 190
               C 310 174 306 158 306 146 Z"
            fill="#14171D"
          />
          {/* short sideburns, tapered in front of the ears */}
          <path d="M 244 166 C 241 180 241 192 244 201 C 247 192 248 180 247 168 Z" fill="#15181F" />
          <path d="M 358 166 C 361 180 361 192 358 201 C 355 192 354 180 355 168 Z" fill="#12151B" />
          {/* sheen and strand lines, kept on the hair mass */}
          <path d="M 266 112 C 284 100 318 100 340 114" stroke="#39414F" strokeWidth="2.4" fill="none" opacity="0.45" filter="url(#soft1)" />
          <path d="M 272 106 C 266 128 262 150 256 172" stroke="#2A303C" strokeWidth="1.2" fill="none" opacity="0.3" />
          <path d="M 306 100 C 304 122 302 142 300 164" stroke="#242935" strokeWidth="1.3" fill="none" opacity="0.3" />
          <path d="M 336 110 C 340 128 342 146 340 166" stroke="#2B313D" strokeWidth="1.1" fill="none" opacity="0.28" />
          {/* hair shadow on the forehead, just under the fringe */}
          <path d="M 250 162 Q 300 176 350 160 L 350 172 Q 300 188 250 174 Z" fill="#1B0F0B" opacity="0.18" filter="url(#soft2)" />
        </g>

        {/* ---------- stress sheen (only when asked) ---------- */}
        {sweat > 0.01 ? (
          <g opacity={sweat}>
            <path d="M 350 202 C 352.6 206.4 353.4 209 349.6 211.6 C 346.2 209 347 206.4 350 202 Z" fill="#CFE4F2" opacity="0.38" />
            <ellipse cx={350.4} cy={208.6} rx={0.8} ry={1.2} fill="#FFFFFF" opacity="0.55" />
            <path d="M 252 212 C 254.4 216 255.2 218.4 251.6 220.8 C 248.4 218.4 249.2 216 252 212 Z" fill="#CFE4F2" opacity="0.26" />
            <ellipse cx={252.4} cy={218.2} rx={0.7} ry={1} fill="#FFFFFF" opacity="0.4" />
          </g>
        ) : null}
      </g>

      {/* ---------- glasses ---------- */}
      {glasses ? (
        <g transform={`translate(${faceShift} 0)`}>
          <rect x="246" y="182" width="42" height="30" rx="9" fill="url(#nGlass)" stroke="#8F8C84" strokeWidth="2" />
          <rect x="312" y="182" width="42" height="30" rx="9" fill="url(#nGlass)" stroke="#8F8C84" strokeWidth="2" />
          <path d="M 288 194 Q 300 190 312 194" stroke="#8F8C84" strokeWidth="1.8" fill="none" />
          <path d="M 246 193 L 234 191" stroke="#86837B" strokeWidth="1.6" />
          <path d="M 354 193 L 366 191" stroke="#86837B" strokeWidth="1.6" />
          <path d="M 252 201 L 272 188" stroke="#DCE8F0" strokeWidth="1.3" opacity="0.4" />
          <path d="M 318 201 L 338 188" stroke="#DCE8F0" strokeWidth="1.1" opacity="0.3" />
        </g>
      ) : null}

      {/* ---------- rim light ---------- */}
      {rim > 0 ? (
        <g opacity={rim} style={{mixBlendMode: 'screen'}}>
          <path
            d="M 242 190 C 232 166 236 112 258 98 C 300 80 348 96 372 124 C 378 146 376 172 368 190"
            stroke="url(#nRimCool)"
            strokeWidth="1.5"
            fill="none"
            filter="url(#soft1)"
            opacity="0.35"
          />
          <path d="M 351 192 C 358 214 353 240 337 258" stroke="url(#nRimWarm)" strokeWidth="2.2" fill="none" filter="url(#soft1)" opacity="0.6" />
          <path d="M 356 200 Q 354 244 322 268" stroke="#D08D65" strokeWidth="1.5" fill="none" opacity="0.28" filter="url(#soft1)" />
          <path d="M 396 344 C 406 384 410 470 408 548" stroke="url(#nRimWarm)" strokeWidth="2.6" fill="none" filter="url(#soft1)" opacity="0.5" />
          <path d="M 204 344 C 196 384 192 470 194 548" stroke="url(#nRimCool)" strokeWidth="2.2" fill="none" filter="url(#soft1)" opacity="0.55" />
        </g>
      ) : null}
    </svg>
  );
};
