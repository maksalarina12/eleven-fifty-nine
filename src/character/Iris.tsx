import React from 'react';

/* ------------------------------------------------------------------ */
/* IRIS — the witness.                                                 */
/*                                                                     */
/* She is not a silhouette any more: she is the third full rig of the  */
/* film, drawn in the same language as Amara (same artboard, same      */
/* head oval, same eye construction) so she can stand next to her in   */
/* one frame without looking like a different production.              */
/*                                                                     */
/* Locked design (do not change without the owner's word):             */
/*   • woman in her sixties, the only old face in the film             */
/*   • grey hair, centre part, low bun at the nape, loose temple wisps */
/*   • long dark coat with a turned-up collar and a muted scarf        */
/*   • a pale hospital bracelet on her wrist (drawn by `Bracelet`)     */
/*   • skin darker than Amara's, warm undertone, no makeup             */
/*   • age is in the lids, the folds and the hands — never in wrinkles */
/*     drawn as lines across the whole face                            */
/* ------------------------------------------------------------------ */

export type IrisExpression = 'calm' | 'stare' | 'whisper' | 'weary';
export type IrisLook = 'camera' | 'left' | 'right' | 'down' | 'up';

type Props = {
  expression?: IrisExpression;
  look?: IrisLook;
  mouth?: number;
  turn?: number;
  rim?: number;
  screen?: number;
  lidOverride?: number;
  /** kept for the older call sites: mirrors the whole figure */
  side?: 'left' | 'right';
  preserve?: string;
  viewBox?: string;
  style?: React.CSSProperties;
};

const LID: Record<IrisExpression, number> = {
  calm: 0.34,
  stare: 0.5,
  whisper: 0.4,
  weary: 0.62,
};

const BROW: Record<IrisExpression, {y: number; inner: number; outer: number}> = {
  calm: {y: 0.6, inner: 0, outer: 0},
  stare: {y: 1.2, inner: 0.8, outer: -0.8},
  whisper: {y: -0.4, inner: -0.8, outer: 0.4},
  weary: {y: 0.8, inner: -1.6, outer: 1.6},
};

const LOOK: Record<IrisLook, {x: number; y: number; head: number}> = {
  camera: {x: 0, y: 0, head: 0},
  left: {x: -2.1, y: 0.3, head: -0.3},
  right: {x: 2.1, y: 0.3, head: 0.3},
  down: {x: 0.2, y: 1.6, head: 0.14},
  up: {x: 0, y: -2.9, head: -0.22},
};

/* One eye. Same construction as Amara's, with the lid hood and the
   crow's feet that carry the age. */
const Eye: React.FC<{
  cx: number;
  cy: number;
  lid: number;
  lookX: number;
  lookY: number;
  screen: number;
  flip?: boolean;
  clipId: string;
}> = ({cx, cy, lid, lookX, lookY, screen, flip, clipId}) => {
  const s = flip ? 1 : -1;
  const ix = lookX * 1.3 * s;
  const iy = 1.4 + lookY * 1;
  const lashY = lid * 9;
  return (
    <g transform={`translate(${cx} ${cy}) scale(${s * 0.74} 0.74)`}>
      {/* socket, hollow and the bag under it */}
      <ellipse cx={0} cy={-3.8} rx={18.4} ry={11} fill="#3A241C" opacity={0.2} filter="url(#irSoft2)" />
      <ellipse cx={0} cy={9.6} rx={15} ry={4.4} fill="#3C2519" opacity={0.26} filter="url(#irSoft2)" />
      <path d="M -14.6 10.4 Q 0 13.6 14.6 9.6" stroke="#5B392B" strokeWidth={1.2} fill="none" opacity={0.22} />
      <path d="M -14 13.4 Q 0 16.6 14 12.6" stroke="#F0CDB8" strokeWidth={1.6} fill="none" opacity={0.12} filter="url(#irSoft1)" />

      {/* the lid hood sits above the lash, not on it */}
      <path d="M -17.6 -4.6 Q 0 -13.6 17.6 -4.8 Q 2 -9.2 -17.6 -4.6 Z" fill="#5E3E30" opacity={0.3} filter="url(#irSoft1)" />

      {/* sclera, a little drier and narrower than Amara's */}
      <path
        d="M -16.6 0.2 C -14.2 -5.2 -6.4 -7.6 1.6 -7.3 C 9.6 -7 15 -4.4 17 -0.7 C 12 4.4 4 6.4 -2.8 6 C -9.6 5.6 -14.8 3.4 -16.6 0.2 Z"
        fill="#C6B3A4"
      />
      <g clipPath={`url(#${clipId})`}>
        <circle cx={ix} cy={iy} r={6} fill="#5A4430" />
        <circle cx={ix} cy={iy} r={6} fill="url(#irIris)" opacity={0.95} />
        <circle cx={ix} cy={iy + 0.4} r={2.9} fill="#0A0906" />
        <circle cx={ix - 0.3 * s} cy={iy + 3.1} r={1.7} fill="#B08F6C" opacity={0.34} />
        <circle cx={ix - 1.9 * s} cy={iy - 2.1} r={1.05} fill="#E8DECE" opacity={0.62} />
        <circle cx={ix + 1.7 * s} cy={iy + 2} r={0.6} fill="#E4D3BE" opacity={0.34} />
        <path d="M -18 -7.4 Q 0 -2.2 18 -6.8 L 18 -12 L -18 -12 Z" fill="#2A1A14" opacity={0.2 + lid * 0.14} />
        {screen > 0.02 ? <rect x={-18} y={-1.4} width={36} height={3.4} fill="#9BD6EE" opacity={screen * 0.12} /> : null}
      </g>

      {/* upper lash: heavier at the outer corner, the way an older lid sits */}
      <path
        d="M -16.6 0.3 C -14.2 -5.4 -6.4 -7.9 1.6 -7.6 C 9.6 -7.3 15.2 -4.7 17.9 -0.4"
        fill="none"
        stroke="#221714"
        strokeWidth={3}
        strokeLinecap="round"
        transform={`translate(0 ${lashY})`}
      />
      <path
        d="M 13.5 -3.6 Q 18.4 -3 20.8 -0.5"
        fill="none"
        stroke="#241814"
        strokeWidth={1.5}
        strokeLinecap="round"
        opacity={0.75}
        transform={`translate(0 ${lashY})`}
      />
      {/* crow's feet: three short strokes, fainter as they run out */}
      {[0, 1, 2].map((i) => (
        <path
          key={i}
          d={`M 17.4 ${-2.4 + i * 2.6} Q ${21 + i * 1.2} ${-3.6 + i * 2.9} ${23.6 + i * 1.4} ${-2.4 + i * 2.6}`}
          stroke="#5A382A"
          strokeWidth={0.75}
          fill="none"
          opacity={0.3 - i * 0.07}
          strokeLinecap="round"
        />
      ))}
    </g>
  );
};

export const Iris: React.FC<Props> = ({
  expression = 'calm',
  look = 'camera',
  mouth = 0,
  turn = 0,
  rim = 1,
  screen = 0.3,
  lidOverride = 0,
  side,
  preserve = 'xMidYMax meet',
  viewBox = '0 0 600 1200',
  style,
}) => {
  const lid = Math.max(LID[expression], lidOverride);
  const brow = BROW[expression];
  const lk = LOOK[look];
  const t = Math.max(-1, Math.min(1, turn + lk.head * 0.3));
  const faceShift = t * 6;
  const hairShift = t * 3.5;
  const mouthOpen = Math.max(0, Math.min(1, mouth));
  const smile = expression === 'whisper' ? 0.6 : expression === 'weary' ? -1.6 : expression === 'stare' ? -0.4 : 0.2;
  const mirror = side === 'left' ? 'translate(600 0) scale(-1 1)' : undefined;

  return (
    <svg viewBox={viewBox} width="100%" height="100%" style={style} preserveAspectRatio={preserve}>
      <defs>
        <linearGradient id="irSkin" x1="0.18" y1="0.04" x2="0.94" y2="0.98">
          <stop offset="0%" stopColor="#C99F84" />
          <stop offset="30%" stopColor="#B08469" />
          <stop offset="62%" stopColor="#93674F" />
          <stop offset="88%" stopColor="#764E3B" />
          <stop offset="100%" stopColor="#63402F" />
        </linearGradient>
        <linearGradient id="irSkinNeck" x1="0" y1="0" x2="0.2" y2="1">
          <stop offset="0%" stopColor="#B98D71" />
          <stop offset="100%" stopColor="#6E4836" />
        </linearGradient>
        <linearGradient id="irHair" x1="0.12" y1="0" x2="0.92" y2="1">
          <stop offset="0%" stopColor="#666D75" />
          <stop offset="30%" stopColor="#454C53" />
          <stop offset="66%" stopColor="#282D33" />
          <stop offset="100%" stopColor="#13161A" />
        </linearGradient>
        <linearGradient id="irHairBack" x1="0.2" y1="0" x2="1" y2="0.9">
          <stop offset="0%" stopColor="#5C636A" />
          <stop offset="55%" stopColor="#2B3036" />
          <stop offset="100%" stopColor="#12161A" />
        </linearGradient>
        <linearGradient id="irCoat" x1="0.1" y1="0" x2="0.85" y2="1">
          <stop offset="0%" stopColor="#2E343D" />
          <stop offset="40%" stopColor="#1B2027" />
          <stop offset="100%" stopColor="#0B0E13" />
        </linearGradient>
        <linearGradient id="irCollar" x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor="#3A404A" />
          <stop offset="52%" stopColor="#22272E" />
          <stop offset="100%" stopColor="#0D1116" />
        </linearGradient>
        <linearGradient id="irScarf" x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor="#3B4046" />
          <stop offset="55%" stopColor="#272C31" />
          <stop offset="100%" stopColor="#14181C" />
        </linearGradient>
        <linearGradient id="irRimCool" x1="0.1" y1="0" x2="0.7" y2="1">
          <stop offset="0%" stopColor="#C8EAF8" stopOpacity="0" />
          <stop offset="38%" stopColor="#BBDCEF" stopOpacity="0.55" />
          <stop offset="74%" stopColor="#8FBED8" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#6DA3C2" stopOpacity="0.18" />
        </linearGradient>
        <radialGradient id="irFaceLight" cx="0.27" cy="0.22" r="1">
          <stop offset="0%" stopColor="#FFF0E2" stopOpacity="0.28" />
          <stop offset="42%" stopColor="#E9C7B2" stopOpacity="0.03" />
          <stop offset="100%" stopColor="#1A0E08" stopOpacity="0.5" />
        </radialGradient>
        <linearGradient id="irKeyShade" x1="0.34" y1="0.1" x2="1" y2="0.6">
          <stop offset="0%" stopColor="#0A0F16" stopOpacity="0" />
          <stop offset="58%" stopColor="#0A0F16" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#050A10" stopOpacity="0.46" />
        </linearGradient>
        <radialGradient id="irIris" cx="0.38" cy="0.3" r="0.8">
          <stop offset="0%" stopColor="#C9A277" stopOpacity="0.5" />
          <stop offset="55%" stopColor="#7B5B3C" stopOpacity="0.24" />
          <stop offset="100%" stopColor="#1F1610" stopOpacity="0.78" />
        </radialGradient>
        <linearGradient id="irLip" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="#8A5F58" />
          <stop offset="55%" stopColor="#744B47" />
          <stop offset="100%" stopColor="#573634" />
        </linearGradient>
        <linearGradient id="irBodyShade" x1="0" y1="0" x2="0.2" y2="1">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.55" />
          <stop offset="26%" stopColor="#000000" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.8" />
        </linearGradient>
        <clipPath id="irEyeClipL">
          <path d="M -16.6 0.2 C -14.2 -5.2 -6.4 -7.6 1.6 -7.3 C 9.6 -7 15 -4.4 17 -0.7 C 12 4.4 4 6.4 -2.8 6 C -9.6 5.6 -14.8 3.4 -16.6 0.2 Z" />
        </clipPath>
        <clipPath id="irEyeClipR">
          <path d="M -16.6 0.2 C -14.2 -5.2 -6.4 -7.6 1.6 -7.3 C 9.6 -7 15 -4.4 17 -0.7 C 12 4.4 4 6.4 -2.8 6 C -9.6 5.6 -14.8 3.4 -16.6 0.2 Z" />
        </clipPath>
        <clipPath id="irFaceClip">
          <path d="M 300 116 C 272 116 255 134 254 158 C 253 177 258 197 265 211 C 271 223 280 233 289 238 C 293 240 297 241 300 241 C 303 241 307 240 311 238 C 320 233 329 223 335 211 C 342 197 347 177 346 158 C 345 134 328 116 300 116 Z" />
        </clipPath>
        <clipPath id="irTorsoClip">
          <path d="M 300 284
             C 287 284 274 288 261 294
             C 237 305 216 325 207 348
             C 201 369 199 402 199 436
             L 197 560 L 199 768 L 401 768 L 403 560 L 401 436
             C 401 402 399 369 393 348
             C 384 325 363 305 339 294
             C 326 288 313 284 300 284 Z" />
        </clipPath>
        <clipPath id="irHairClip">
          <path d="M 300 103 C 266 103 248 123 249 150 C 250 162 252 173 255 184 C 257 186 260 185 260 183 C 261 171 263 163 267 158 C 276 152 287 149 300 148 C 313 149 324 152 333 158 C 337 163 339 171 340 183 C 340 185 343 186 345 184 C 348 173 350 162 351 150 C 352 123 334 103 300 103 Z" />
        </clipPath>
        <filter id="irSoft1" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="1.2" />
        </filter>
        <filter id="irSoft2" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3.8" />
        </filter>
      </defs>

      <g transform={mirror}>
        {/* ---------- neck: short, the cords just showing ---------- */}
        <path d="M 288 236 C 286 254 284 272 278 290 C 291 299 309 299 322 290 C 316 272 314 254 312 236 Z" fill="url(#irSkinNeck)" />
        {/* the jaw's shadow falls on the neck, not a line across it */}
        <path d="M 290 240 Q 300 260 310 240 L 310 258 Q 300 271 290 258 Z" fill="#3F271C" opacity={0.46} filter="url(#irSoft1)" />
        <path d="M 293 248 C 292 262 293 274 295 284" stroke="#E2BCA2" strokeWidth={1.7} fill="none" opacity={0.13} filter="url(#irSoft1)" />
        <path d="M 307 248 C 308 262 307 274 305 284" stroke="#6A4432" strokeWidth={1.5} fill="none" opacity={0.26} filter="url(#irSoft1)" />
        <path d="M 281 286 Q 300 297 319 286" stroke="#120A07" strokeWidth={4} opacity={0.3} filter="url(#irSoft1)" />

        {/* ---------- torso: long coat, turned-up collar, muted scarf ---------- */}
        <g transform={`translate(${t * 2} -14)`}>
          <path
            d="M 300 284
               C 287 284 274 288 261 294
               C 237 305 216 325 207 348
               C 201 369 199 402 199 436
               L 197 560 L 199 768 L 401 768 L 403 560 L 401 436
               C 401 402 399 369 393 348
               C 384 325 363 305 339 294
               C 326 288 313 284 300 284 Z"
            fill="url(#irCoat)"
          />
          {/* trapezius, so the shoulders carry weight */}
          <path d="M 283 292 C 257 305 234 327 214 354" stroke="#4A515B" strokeWidth={2.6} fill="none" opacity={0.4} />
          <path d="M 317 292 C 343 305 366 327 386 354" stroke="#343A43" strokeWidth={2} fill="none" opacity={0.3} />
          {/* the key catches the shoulder line — without it the coat is a hole */}
          {rim > 0 ? (
            <g opacity={Math.min(1, rim * 0.5)}>
              <path d="M 279 291 C 254 303 232 325 212 352" stroke="#8FB3C9" strokeWidth={2.4} fill="none" opacity={0.22} strokeLinecap="round" filter="url(#irSoft1)" />
              <path d="M 321 291 C 345 303 367 325 387 352" stroke="#6C90A6" strokeWidth={2} fill="none" opacity={0.15} strokeLinecap="round" filter="url(#irSoft1)" />
            </g>
          ) : null}
          <path d="M 219 350 C 212 372 209 400 209 430" stroke="#4A505A" strokeWidth={1.5} fill="none" opacity={0.22} filter="url(#irSoft1)" />
          {/* arm seams: the outer panels read a shade brighter, so the coat
              has arms instead of a bell */}
          <path d="M 216 344 C 208 380 206 424 206 470 L 208 706 L 238 706 L 236 470 C 236 424 238 380 243 350 Z" fill="#1B2027" opacity={0.55} />
          <path d="M 384 344 C 392 380 394 424 394 470 L 392 706 L 362 706 L 364 470 C 364 424 362 380 357 350 Z" fill="#191E25" opacity={0.4} />
          <path d="M 244 348 C 236 392 234 456 235 540" stroke="#05070A" strokeWidth={3.4} fill="none" opacity={0.5} filter="url(#irSoft1)" />
          <path d="M 356 348 C 364 392 366 456 365 540" stroke="#05070A" strokeWidth={3.6} fill="none" opacity={0.52} filter="url(#irSoft1)" />
          {/* elbow creases */}
          <path d="M 212 520 Q 224 528 236 522" stroke="#333941" strokeWidth={1.2} fill="none" opacity={0.3} />
          <path d="M 388 520 Q 376 528 364 522" stroke="#2B3138" strokeWidth={1.2} fill="none" opacity={0.26} />

          {/* stand collar: a dark band round the throat, lighter only at its edge */}
          <path d="M 285 264 C 292 268 308 268 315 264 L 319 292 L 281 292 Z" fill="#0B0F14" />
          <path d="M 285 264 C 292 268 308 268 315 264" stroke="#454D57" strokeWidth={1.1} fill="none" opacity={0.46} />
          <path d="M 285 264 L 281 292" stroke="#2C333B" strokeWidth={1} fill="none" opacity={0.32} />
          <path d="M 315 264 L 319 292" stroke="#272D34" strokeWidth={1} fill="none" opacity={0.28} />
          <path d="M 300 274 L 300 336" stroke="#04060A" strokeWidth={1.3} opacity={0.45} />
          {/* the collar's shadow on the throat */}
          <path d="M 283 270 C 290 288 310 288 317 270" stroke="#000000" strokeWidth={5} fill="none" opacity={0.3} filter="url(#irSoft2)" />

          {/* lapels and the seam down the front */}
          <path d="M 277 312 L 300 392 L 293 404 L 268 338 Z" fill="#232932" />
          <path d="M 323 312 L 300 392 L 307 404 L 332 338 Z" fill="#1D232B" />
          <path d="M 277 312 L 300 392" stroke="#414A54" strokeWidth={1.2} fill="none" opacity={0.38} />
          <path d="M 323 312 L 300 392" stroke="#374049" strokeWidth={1.1} fill="none" opacity={0.32} />
          <path d="M 300 416 L 300 732" stroke="#333B44" strokeWidth={1.1} opacity={0.24} />

          {/* buttons: one low, one gone — she has worn this coat a long time */}
          <circle cx={300} cy={520} r={4.4} fill="#3A4048" opacity={0.75} />
          <circle cx={299} cy={578} r={4.2} fill="#333941" opacity={0.55} />

          {/* pockets and folds */}
          <path d="M 240 566 L 268 570 L 271 606 L 243 602 Z" stroke="#0B0D11" strokeWidth={1.3} fill="none" opacity={0.38} />
          <path d="M 360 566 L 332 570 L 329 606 L 357 602 Z" stroke="#0B0D11" strokeWidth={1.3} fill="none" opacity={0.34} />
          <path d="M 232 440 C 226 500 226 580 230 664" stroke="#2A3038" strokeWidth={1.1} fill="none" opacity={0.3} />
          <path d="M 368 440 C 374 500 374 580 370 664" stroke="#31373F" strokeWidth={1.1} fill="none" opacity={0.26} />
          <path d="M 186 300 L 414 300 L 414 764 L 186 764 Z" fill="url(#irBodyShade)" opacity={0.34} clipPath="url(#irTorsoClip)" />
        </g>

        {/* ---------- head ---------- */}
        <g transform={`translate(${faceShift} 0)`}>
          <g transform={`rotate(${t * 1.5} 300 280) translate(300 0) scale(0.965 1) translate(-300 0)`}>
            {/* ears, a touch larger than a young face's */}
            <path d="M 257.4 181 Q 252.4 178 250.8 185.4 Q 250.2 193.4 255.2 196.6 Q 257.6 190.4 257.8 186 Z" fill="#9C6E54" />
            <path d="M 342.6 181 Q 347.6 178 349.2 185.4 Q 349.8 193.4 344.8 196.6 Q 342.4 190.4 342.2 186 Z" fill="#8E6349" />
            <path d="M 249.4 184 Q 247.4 190 249.8 196" stroke="#7A4F3B" strokeWidth={0.9} fill="none" opacity={0.55} />
            <path d="M 350.6 184 Q 352.6 190 350.2 196" stroke="#6C4532" strokeWidth={0.9} fill="none" opacity={0.5} />

            {/* face: same oval as Amara, jaw softened, chin heavier */}
            <path
              d="M 300 116
                 C 272 116 255 134 254 158
                 C 253 177 258 197 265 211
                 C 271 223 280 233 289 238
                 C 293 240 297 241 300 241
                 C 303 241 307 240 311 238
                 C 320 233 329 223 335 211
                 C 342 197 347 177 346 158
                 C 345 134 328 116 300 116 Z"
              fill="url(#irSkin)"
            />
            <g clipPath="url(#irFaceClip)">
              <rect x="236" y="104" width="128" height="146" fill="url(#irFaceLight)" />
              <rect x="240" y="104" width="124" height="152" fill="url(#irKeyShade)" />
              {/* cheekbones higher, hollows beneath them */}
              <ellipse cx="340" cy="196" rx="18" ry="30" fill="#4B2E22" opacity={0.16} filter="url(#irSoft2)" />
              <ellipse cx="260" cy="196" rx="10" ry="20" fill="#5A382A" opacity={0.12} filter="url(#irSoft2)" />
              <ellipse cx="279" cy="200" rx="13" ry="7" fill="#C08066" opacity={0.16} filter="url(#irSoft2)" />
              <ellipse cx="329" cy="198" rx="10" ry="6" fill="#B47458" opacity={0.12} filter="url(#irSoft2)" />
              <ellipse cx="294" cy="168" rx="20" ry="7" fill="#FFF0E0" opacity={0.16} filter="url(#irSoft2)" />

              {/* the age lives here: two forehead lines, the folds, the jaw */}
              <path d="M 274 136 Q 300 131 326 136" stroke="#6B4432" strokeWidth={1.5} fill="none" opacity={0.11} filter="url(#irSoft1)" />
              <path d="M 278 144 Q 300 140 322 144" stroke="#6B4432" strokeWidth={1.2} fill="none" opacity={0.09} filter="url(#irSoft1)" />
              <path d="M 295 206 C 289 214 288 222 290 230" stroke="#5C3626" strokeWidth={2.4} fill="none" opacity={0.24} filter="url(#irSoft1)" />
              <path d="M 305 206 C 311 214 312 222 310 230" stroke="#5C3626" strokeWidth={2.4} fill="none" opacity={0.22} filter="url(#irSoft1)" />
              <ellipse cx="287" cy="228" rx="9" ry="5" fill="#3A2318" opacity={0.18} filter="url(#irSoft2)" />
              <ellipse cx="313" cy="228" rx="9" ry="5" fill="#3A2318" opacity={0.16} filter="url(#irSoft2)" />
              {/* the lids have lost their line with age */}
              <path d="M 262 176 Q 274 172 286 176" stroke="#6B4634" strokeWidth={1.3} fill="none" opacity={0.2} filter="url(#irSoft1)" />
              <path d="M 314 176 Q 326 172 338 176" stroke="#6B4634" strokeWidth={1.3} fill="none" opacity={0.18} filter="url(#irSoft1)" />
              <path d="M 264 214 Q 300 236 336 214 L 336 252 L 264 252 Z" fill="#2A1711" opacity={0.2} filter="url(#irSoft2)" />
            </g>

            {/* brows: thin, grey, a little lower than they used to be */}
            <path
              d={`M 258 ${170.4 + brow.y + brow.outer} Q 269 ${164.2 + brow.y + brow.inner} 285 ${170 + brow.y + brow.outer}`}
              stroke="#4C4239"
              strokeWidth={1.5}
              strokeLinecap="round"
              fill="none"
              opacity={0.82}
            />
            <path
              d={`M 342 ${170.4 + brow.y + brow.outer} Q 331 ${164.2 + brow.y + brow.inner} 315 ${170 + brow.y + brow.outer}`}
              stroke="#423A34"
              strokeWidth={1.8}
              strokeLinecap="round"
              fill="none"
              opacity={0.82}
            />
            {[0, 1, 2].map((i) => (
              <path
                key={i}
                d={`M ${262 + i * 7} ${166.6 + brow.y} L ${261 + i * 7} ${162.4 + brow.y}`}
                stroke="#4A423C"
                strokeWidth={0.7}
                opacity={0.3}
                strokeLinecap="round"
              />
            ))}

            <Eye cx={274} cy={184} lid={lid} lookX={lk.x} lookY={lk.y} screen={screen} clipId="irEyeClipL" />
            <Eye cx={326} cy={184} lid={lid} lookX={lk.x} lookY={lk.y} screen={screen} flip clipId="irEyeClipR" />

            {/* nose: longer, the bridge a little sharper */}
            <path d="M 299.4 198.4 L 298 207.6" stroke="#FFE9D7" strokeWidth={1.3} opacity={0.2} />
            <path d="M 304 196.6 C 307.2 203.2 306.8 209.8 303.6 213" stroke="#6B4331" strokeWidth={3} fill="none" opacity={0.26} filter="url(#irSoft1)" />
            <path d="M 294.8 198.4 C 292.4 204.4 292.2 209.2 294.6 212.2" stroke="#5E3728" strokeWidth={2.6} fill="none" strokeLinecap="round" opacity={0.2} filter="url(#irSoft2)" />
            <ellipse cx={300} cy={204} rx={4.6} ry={8.4} fill="#7A4A36" opacity={0.1} filter="url(#irSoft2)" />
            <path d="M 296.4 210.6 Q 299.4 213.8 303.4 212.8" stroke="#7A4C39" strokeWidth={1.8} fill="none" strokeLinecap="round" opacity={0.5} />
            <ellipse cx={299.6} cy={208.6} rx={2.6} ry={1.6} fill="#FFE8D6" opacity={0.18} filter="url(#irSoft1)" />
            <ellipse cx={295.4} cy={212.8} rx={2} ry={0.95} fill="#40231A" opacity={0.44} filter="url(#irSoft1)" />
            <ellipse cx={304.6} cy={212.8} rx={1.8} ry={0.9} fill="#40231A" opacity={0.38} filter="url(#irSoft1)" />
            <ellipse cx={300} cy={215} rx={5.6} ry={2.2} fill="#4E2E20" opacity={0.2} filter="url(#irSoft2)" />

            {/* lips: thinner, the corners already turning down */}
            <g transform="translate(300 220.6)">
              {mouthOpen > 0.02 ? (
                <>
                  <path
                    d={`M -9.6 ${-0.4 + smile * 0.2} Q -4.6 -2.6 0 -1.6 Q 4.6 -2.6 9.6 ${-0.4 + smile * 0.2} Q 6.4 ${3.4 + mouthOpen * 5.4} 0 ${3.8 + mouthOpen * 5.4} Q -6.4 ${3.4 + mouthOpen * 5.4} -9.6 ${-0.4 + smile * 0.2} Z`}
                    fill="#2A1210"
                  />
                  <path d={`M -7 ${1.4 + mouthOpen * 1.8} Q 0 ${2.8 + mouthOpen * 3.2} 7 ${1.4 + mouthOpen * 1.8}`} stroke="#C99286" strokeWidth={0.9} fill="none" opacity={0.34} />
                </>
              ) : (
                <>
                  <path
                    d={`M -11 ${smile * 0.4} Q -6.6 ${-2.4 + smile * 0.3} -0.4 ${-2.1 + smile * 0.4} Q 1.5 ${-2.8} 3.4 ${-2 + smile * 0.4} Q 8.8 ${-1.9 + smile * 0.3} 11 ${smile * 0.4} Q 7.6 ${4 + smile} 0 ${4.5 + smile} Q -7.6 ${4 + smile} -11 ${smile * 0.4} Z`}
                    fill="url(#irLip)"
                  />
                  <path
                    d={`M -11 ${smile * 0.4} Q -5.6 ${-2.6 + smile * 0.3} 0 ${-2 + smile * 0.4} Q 5.6 ${-2.6 + smile * 0.3} 11 ${smile * 0.4}`}
                    stroke="#5C302C"
                    strokeWidth={0.8}
                    fill="none"
                    opacity={0.6}
                  />
                  <path d={`M -4.6 ${1.8 + smile * 0.6} Q 0 ${3 + smile} 4.6 ${1.8 + smile * 0.6}`} stroke="#C79E90" strokeWidth={0.7} fill="none" opacity={0.14} />
                </>
              )}
            </g>

            {/* chin crease and the soft jowl */}
            <path d="M 288 230 Q 300 235 312 230" stroke="#553629" strokeWidth={0.9} fill="none" opacity={0.12} />

            {/* ---------- hair: grey, centre part, combed back ---------- */}
            <g transform={`translate(${hairShift * 0.4} 0)`}>
              {/* crown: one grey mass, its lower edge IS the hairline. Same
                  construction as Amara's, so the two faces belong together. */}
              <path
                d="M 300 103
                   C 266 103 248 123 249 150
                   C 250 162 252 173 255 184
                   C 257 186 260 185 260 183
                   C 261 171 263 163 267 158
                   C 276 152 287 149 300 148
                   C 313 149 324 152 333 158
                   C 337 163 339 171 340 183
                   C 340 185 343 186 345 184
                   C 348 173 350 162 351 150
                   C 352 123 334 103 300 103 Z"
                fill="url(#irHair)"
              />
              {/* nape: the hair goes back and gathers low, behind the jaw */}

              {/* the centre part: a channel, darker at the front, opening back */}
              <path d="M 300 105 L 300 149" stroke="#191E23" strokeWidth={2} opacity={0.6} strokeLinecap="round" />
              <path d="M 300 111 L 300 146" stroke="#C4CBD1" strokeWidth={0.7} opacity={0.16} />
              {/* combed back from the part, kept inside the crown */}
              <g clipPath="url(#irHairClip)">
                <path d="M 292 96 C 278 114 266 134 259 158" stroke="#3E454C" strokeWidth={3} fill="none" opacity={0.4} strokeLinecap="round" />
                <path d="M 286 104 C 272 124 262 142 256 162" stroke="#565D65" strokeWidth={1.6} fill="none" opacity={0.26} strokeLinecap="round" />
                <path d="M 308 96 C 322 114 334 134 341 158" stroke="#373E45" strokeWidth={2.8} fill="none" opacity={0.36} strokeLinecap="round" />
                <path d="M 314 104 C 328 124 338 142 344 162" stroke="#4C535B" strokeWidth={1.5} fill="none" opacity={0.22} strokeLinecap="round" />
                <path d="M 300 92 C 296 108 294 120 294 132" stroke="#2E353C" strokeWidth={1.9} fill="none" opacity={0.34} strokeLinecap="round" />
              </g>
              {/* sheen across the crown, thin, so the mass is not a flat cap */}
              <path d="M 255 147 C 259 124 274 109 293 104" stroke="#B9C2CA" strokeWidth={2} fill="none" opacity={0.26} strokeLinecap="round" filter="url(#irSoft1)" />
              <path d="M 261 154 C 264 132 275 114 293 108" stroke="#8E979F" strokeWidth={1.2} fill="none" opacity={0.18} strokeLinecap="round" filter="url(#irSoft1)" />
              <path d="M 342 151 C 337 127 321 107 300 102" stroke="#7D858D" strokeWidth={1.2} fill="none" opacity={0.12} strokeLinecap="round" filter="url(#irSoft1)" />
              {/* light catching the hairline, so the edge is not a printed cut */}
              <path d="M 264 163 C 273 155 286 149 300 147" stroke="#767E86" strokeWidth={1.5} fill="none" opacity={0.34} strokeLinecap="round" filter="url(#irSoft1)" />
              {/* the hairline's own shadow on the forehead */}
              <path d="M 263 165 C 272 157 285 150 300 148 C 315 150 329 157 338 165" stroke="#3A2218" strokeWidth={3.2} fill="none" opacity={0.2} filter="url(#irSoft2)" />
              {/* temples: short grey wisps in front of the ears, tapering to a point */}
              {/* two wisps that came loose at the temple — the only messy thing about her */}
              {/* the ear is redrawn over the hair: the hair is combed behind it */}
              <path d="M 257.4 181 Q 252.4 178 250.8 185.4 Q 250.2 193.4 255.2 196.6 Q 257.6 190.4 257.8 186 Z" fill="#9C6E54" />
              <path d="M 342.6 181 Q 347.6 178 349.2 185.4 Q 349.8 193.4 344.8 196.6 Q 342.4 190.4 342.2 186 Z" fill="#8E6349" />
              <path d="M 249.4 184 Q 247.4 190 249.8 196" stroke="#7A4F3B" strokeWidth={0.9} fill="none" opacity={0.55} />
              <path d="M 350.6 184 Q 352.6 190 350.2 196" stroke="#6C4532" strokeWidth={0.9} fill="none" opacity={0.5} />
              <path d="M 255.6 183 Q 253 186 253.4 191" stroke="#5C3728" strokeWidth={1} fill="none" opacity={0.4} />
              <path d="M 344.4 183 Q 347 186 346.6 191" stroke="#532F22" strokeWidth={1} fill="none" opacity={0.4} />
            </g>

            {/* rim light along the cool side, same recipe as the other rigs */}
            {rim > 0 ? (
              <g opacity={Math.min(1, rim * 0.62)} clipPath="url(#irFaceClip)">
                <path
                  d="M 256 180 C 255 192 259 202 265 211 C 271 223 280 233 289 238"
                  stroke="url(#irRimCool)"
                  strokeWidth={2.8}
                  fill="none"
                  opacity={0.55}
                />
              </g>
            ) : null}
          </g>
        </g>
      </g>
    </svg>
  );
};

export default Iris;
