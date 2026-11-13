import React from 'react';

/* Noah from behind — shared rig, artboard 0 0 400 720. */

export const NoahBack: React.FC<{rim?: number}> = ({rim = 1}) => (
  <svg viewBox="0 0 400 720" width="100%" height="100%" preserveAspectRatio="xMidYMax meet">
    <defs>
      <linearGradient id="knbCoat" x1="0.1" y1="0" x2="0.9" y2="1">
        <stop offset="0%" stopColor="#3B4855" />
        <stop offset="26%" stopColor="#212D38" />
        <stop offset="66%" stopColor="#101923" />
        <stop offset="100%" stopColor="#05090E" />
      </linearGradient>
      <linearGradient id="knbHair" x1="0.15" y1="0" x2="0.85" y2="1">
        <stop offset="0%" stopColor="#2E3945" />
        <stop offset="34%" stopColor="#161F28" />
        <stop offset="100%" stopColor="#060A0E" />
      </linearGradient>
      <linearGradient id="knbSkin" x1="0.2" y1="0" x2="0.8" y2="1">
        <stop offset="0%" stopColor="#241A13" />
        <stop offset="100%" stopColor="#0C0806" />
      </linearGradient>
      <linearGradient id="knbRimL" x1="0" y1="0" x2="1" y2="0.2">
        <stop offset="0%" stopColor="rgba(212,236,248,0.95)" />
        <stop offset="48%" stopColor="rgba(158,204,232,0.5)" />
        <stop offset="100%" stopColor="rgba(120,176,210,0)" />
      </linearGradient>
      <linearGradient id="knbNeckShade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="rgba(0,0,0,0.72)" />
        <stop offset="100%" stopColor="rgba(0,0,0,0)" />
      </linearGradient>
      <filter id="knbSoft" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="11" />
      </filter>
      <filter id="knbSoft2" x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur stdDeviation="5" />
      </filter>
      <filter id="knbSoft3" x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur stdDeviation="2.2" />
      </filter>
    </defs>

    {/* contact shadow */}
    <ellipse cx="200" cy="700" rx="150" ry="22" fill="rgba(0,0,0,0.8)" filter="url(#knbSoft)" />

    {/* coat: sloping shoulders, straight fall */}
    <path
      d="M 200 306
         C 176 306 154 312 134 322
         C 112 340 94 354 84 374
         C 76 390 72 412 71 438
         L 66 720 L 334 720 L 329 438
         C 328 412 324 390 316 374
         C 306 354 288 340 266 330
         C 246 322 224 318 200 318 Z"
      fill="url(#knbCoat)"
    />
    {/* trapezius ridge: neck into shoulder, the line that makes it read as a body */}
    <path d="M 200 300 C 172 302 146 312 124 328 C 106 341 92 358 84 380" stroke="rgba(168,208,232,0.08)" strokeWidth="7" fill="none" filter="url(#knbSoft2)" />
    <path d="M 200 300 C 228 302 254 312 276 328 C 294 341 308 358 316 380" stroke="rgba(150,192,218,0.05)" strokeWidth="7" fill="none" filter="url(#knbSoft2)" />

    {/* side shadow so the coat mass has form */}
    <path d="M 71 438 L 66 720 L 120 720 L 126 430 C 127 400 132 376 142 358 Z" fill="rgba(0,0,0,0.45)" filter="url(#knbSoft)" />
    <path d="M 329 438 L 334 720 L 288 720 L 280 430 C 279 400 274 376 264 358 Z" fill="rgba(0,0,0,0.55)" filter="url(#knbSoft)" />

    {/* centre back seam and folds: soft shadows, never crisp lines */}
    <path d="M 200 336 L 200 720" stroke="rgba(0,0,0,0.5)" strokeWidth="7" fill="none" filter="url(#knbSoft2)" />
    <path d="M 158 350 C 150 430 148 540 150 720" stroke="rgba(0,0,0,0.34)" strokeWidth="5" fill="none" filter="url(#knbSoft2)" />
    <path d="M 244 350 C 252 430 254 540 252 720" stroke="rgba(0,0,0,0.4)" strokeWidth="5" fill="none" filter="url(#knbSoft2)" />
    <path d="M 108 392 C 118 470 122 560 122 660" stroke="rgba(0,0,0,0.3)" strokeWidth="5" fill="none" filter="url(#knbSoft2)" />
    <path d="M 292 392 C 282 470 278 560 278 660" stroke="rgba(0,0,0,0.34)" strokeWidth="5" fill="none" filter="url(#knbSoft2)" />
    {/* shoulder blades catching the ceiling */}
    <path d="M 136 380 C 158 392 176 402 196 406" stroke="rgba(150,196,224,0.06)" strokeWidth="10" fill="none" filter="url(#knbSoft2)" />
    <path d="M 264 380 C 242 392 224 402 204 406" stroke="rgba(150,196,224,0.04)" strokeWidth="10" fill="none" filter="url(#knbSoft2)" />
    {/* waist crease */}
    <path d="M 84 500 C 130 516 170 522 200 522 C 230 522 270 516 316 500" stroke="rgba(0,0,0,0.28)" strokeWidth="13" fill="none" filter="url(#knbSoft)" />

    {/* collar standing behind the neck */}
    <path d="M 170 292 C 176 316 186 330 200 334 C 214 330 224 316 230 292 L 242 300 C 236 332 220 350 200 354 C 180 350 164 332 158 300 Z" fill="#0A1016" />
    <path d="M 171 294 C 177 317 188 331 200 335" stroke="rgba(168,206,230,0.14)" strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M 229 294 C 223 317 212 331 200 335" stroke="rgba(150,188,214,0.09)" strokeWidth="1.8" fill="none" strokeLinecap="round" />

    {/* neck, short and in shadow */}
    <path d="M 177 246 C 175 266 172 282 168 294 L 232 294 C 228 282 225 266 223 246 Z" fill="url(#knbSkin)" />
    <path d="M 177 246 C 175 266 172 282 168 294 L 200 294 L 200 246 Z" fill="rgba(0,0,0,0.3)" />
    <rect x="168" y="244" width="64" height="40" fill="url(#knbNeckShade)" />
    <path d="M 223 252 C 225 270 227 284 231 294" stroke="rgba(198,228,244,0.1)" strokeWidth="1.8" fill="none" strokeLinecap="round" />

    {/* head: skull mass, slightly flattened at the nape */}
    <path
      d="M 200 74 C 158 74 133 104 133 148 C 133 178 139 204 149 222 C 157 236 169 246 181 250 L 219 250 C 231 246 243 236 251 222 C 261 204 267 178 267 148 C 267 104 242 74 200 74 Z"
      fill="url(#knbHair)"
    />
    {/* crown light and short strand detail */}
    <path d="M 152 128 C 158 100 176 82 200 78" stroke="rgba(176,212,234,0.2)" strokeWidth="9" fill="none" filter="url(#knbSoft2)" />
    <path d="M 176 86 C 188 80 208 79 220 84" stroke="rgba(206,232,246,0.26)" strokeWidth="3" fill="none" />
    <path d="M 158 104 C 170 94 186 88 202 88" stroke="rgba(196,226,242,0.17)" strokeWidth="2.4" fill="none" />
    <path d="M 166 122 C 178 112 194 106 208 108" stroke="rgba(186,220,240,0.11)" strokeWidth="2" fill="none" />
    <path d="M 152 146 C 158 128 168 116 180 108" stroke="rgba(180,214,236,0.09)" strokeWidth="1.8" fill="none" />
    {/* hair tufts at the nape, so the hairline is not a shell edge */}
    <path d="M 181 250 C 186 260 194 266 200 268 C 206 266 214 260 219 250 L 212 246 L 206 254 L 200 247 L 194 254 L 188 246 Z" fill="#0A0F14" />
    <path d="M 178 240 C 182 254 190 264 200 268" stroke="rgba(0,0,0,0.6)" strokeWidth="5" fill="none" filter="url(#knbSoft3)" />
    <path d="M 222 240 C 218 254 210 264 200 268" stroke="rgba(0,0,0,0.55)" strokeWidth="5" fill="none" filter="url(#knbSoft3)" />
    {/* a shade of the ears at the sides */}
    <ellipse cx="134" cy="176" rx="7" ry="17" fill="rgba(38,26,20,0.75)" />
    <ellipse cx="266" cy="176" rx="7" ry="17" fill="rgba(28,19,15,0.85)" />

    {/* rim light: left contour only */}
    <path d="M 134 158 C 134 112 158 80 198 75" stroke="url(#knbRimL)" strokeWidth="3" fill="none" opacity={0.62 * rim} strokeLinecap="round" />
    <path d="M 139 198 C 145 216 155 229 168 238" stroke="rgba(180,216,236,0.24)" strokeWidth="2.4" fill="none" opacity={rim} strokeLinecap="round" />
    <path d="M 175 248 C 172 268 169 282 166 294" stroke="rgba(190,222,240,0.2)" strokeWidth="2.2" fill="none" opacity={rim} strokeLinecap="round" />
    <path d="M 168 298 C 146 305 122 318 104 336 C 90 350 80 370 75 396" stroke="rgba(200,230,246,0.34)" strokeWidth="3" fill="none" opacity={rim} strokeLinecap="round" />
    <path d="M 73 440 L 68 700" stroke="rgba(184,220,242,0.22)" strokeWidth="2.4" fill="none" opacity={rim} strokeLinecap="round" />
    {/* faint cool edge on the far side, much weaker */}
    <path d="M 266 158 C 266 114 244 80 206 75" stroke="rgba(138,180,206,0.16)" strokeWidth="2.2" fill="none" opacity={0.7 * rim} />
    <path d="M 314 410 C 310 384 300 364 288 348" stroke="rgba(138,180,206,0.12)" strokeWidth="2" fill="none" opacity={0.7 * rim} />
  </svg>
);
