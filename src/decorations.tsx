/* ─── Inline SVG decorative components ─── */

function Blossom({ cx, cy, r, color = '#f0b8c4' }: { cx: number; cy: number; r: number; color?: string }) {
  return (
    <g>
      {[0, 72, 144, 216, 288].map((angle) => {
        const rad = (angle - 90) * (Math.PI / 180);
        const px = cx + r * 0.82 * Math.cos(rad);
        const py = cy + r * 0.82 * Math.sin(rad);
        return (
          <ellipse key={angle} cx={px} cy={py} rx={r * 0.68} ry={r * 0.44}
            transform={`rotate(${angle}, ${px}, ${py})`}
            fill={color} opacity={0.88}
          />
        );
      })}
      <circle cx={cx} cy={cy} r={r * 0.36} fill="#f5d888" opacity={0.95} />
    </g>
  );
}

export function PlumBranch({ className = '', flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg width="200" height="340" viewBox="0 0 200 340" fill="none" aria-hidden="true"
      className={className} style={flip ? { transform: 'scaleX(-1)' } : undefined}>
      {/* 줄기 */}
      <path d="M18 340 C26 295 20 260 38 220 C54 182 78 165 92 132 C108 94 102 62 128 30 C136 18 145 9 158 4"
        stroke="#7d5535" strokeWidth="5.5" strokeLinecap="round" />
      {/* 가지 1 */}
      <path d="M62 235 C88 215 120 205 158 193"
        stroke="#7d5535" strokeWidth="3.2" strokeLinecap="round" />
      {/* 가지 2 */}
      <path d="M88 175 C115 158 146 146 178 137"
        stroke="#7d5535" strokeWidth="2.6" strokeLinecap="round" />
      {/* 가지 3 */}
      <path d="M106 128 C130 113 155 102 178 92"
        stroke="#7d5535" strokeWidth="2" strokeLinecap="round" />
      {/* 잔가지 */}
      <path d="M126 72 C142 58 158 50 170 44"
        stroke="#7d5535" strokeWidth="1.6" strokeLinecap="round" />

      {/* 매화꽃 */}
      <Blossom cx={158} cy={4} r={10} />
      <Blossom cx={144} cy={22} r={8} />
      <Blossom cx={168} cy={30} r={7} />
      <Blossom cx={178} cy={92} r={9} color="#f8c8d0" />
      <Blossom cx={165} cy={106} r={6} />
      <Blossom cx={170} cy={44} r={7} />
      <Blossom cx={158} cy={55} r={5} color="#f8c8d0" />
      <Blossom cx={178} cy={137} r={8} />
      <Blossom cx={162} cy={150} r={5} />
      <Blossom cx={158} cy={193} r={7} color="#f8c8d0" />
      <Blossom cx={145} cy={206} r={5} />

      {/* 낙화 */}
      <ellipse cx={35} cy={290} rx={5.5} ry={3.5} fill="#f0b8c4" opacity={0.42}
        transform="rotate(-28, 35, 290)" />
      <ellipse cx={20} cy={315} rx={4} ry={2.8} fill="#f0b8c4" opacity={0.32}
        transform="rotate(18, 20, 315)" />
      <ellipse cx={68} cy={275} rx={4} ry={3} fill="#f0b8c4" opacity={0.28}
        transform="rotate(-42, 68, 275)" />
      <ellipse cx={52} cy={308} rx={3.5} ry={2} fill="#f0b8c4" opacity={0.25}
        transform="rotate(5, 52, 308)" />
    </svg>
  );
}

export function HanokRoofDecor({ className = '' }: { className?: string }) {
  /* 한옥 처마 윤곽 */
  return (
    <svg width="240" height="130" viewBox="-12 0 264 130" fill="none" aria-hidden="true"
      className={className}>
      {/* 지붕 곡선 */}
      <path d="M0 100 Q60 48 120 36 Q180 22 240 72"
        stroke="#6b4820" strokeWidth="3.5" strokeLinecap="round" />
      {/* 서까래 선 */}
      <path d="M0 100 Q60 51 120 39 Q180 26 240 74"
        stroke="#8b6030" strokeWidth="1.2" opacity={0.45} strokeLinecap="round" />
      {/* 막새 기와 (ridge tiles) */}
      {[0, 24, 48, 72, 96, 120, 144, 168, 192, 216, 240].map((x) => {
        const t = x / 240;
        const y = 100 - 64 * Math.sin(t * Math.PI * 0.82 + 0.18);
        return (
          <g key={x}>
            <ellipse cx={x} cy={y} rx={5} ry={3.5} fill="#6b4820" opacity={0.55} />
            <ellipse cx={x} cy={y} rx={2.5} ry={1.8} fill="#9b6830" opacity={0.4} />
          </g>
        );
      })}
      {/* 처마 끝 장식 */}
      <path d="M0 100 C-6 92 -10 100 -4 106" stroke="#6b4820" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M240 72 C248 65 250 74 244 79" stroke="#6b4820" strokeWidth="2.5" strokeLinecap="round" />
      {/* 홍색 수술 장식 */}
      <line x1="240" y1="72" x2="240" y2="92" stroke="#ab1729" strokeWidth="2.5" />
      <line x1="240" y1="92" x2="233" y2="110" stroke="#ab1729" strokeWidth="1.8" />
      <line x1="240" y1="92" x2="240" y2="112" stroke="#ab1729" strokeWidth="1.8" />
      <line x1="240" y1="92" x2="247" y2="110" stroke="#ab1729" strokeWidth="1.8" />
      <circle cx="240" cy="72" r="5" fill="#ab1729" />
    </svg>
  );
}

export function CloudWaveDivider({ fill = '#ece0b8', className = '' }: { fill?: string; className?: string }) {
  return (
    <svg width="100%" height="68" viewBox="0 0 800 68" preserveAspectRatio="none"
      aria-hidden="true" className={className}>
      <path
        d="M0 40
           Q33 10 66 38 Q99 62 132 38
           Q165 10 198 40 Q231 66 264 40
           Q297 10 330 40 Q363 66 396 40
           Q429 10 462 40 Q495 66 528 40
           Q561 10 594 40 Q627 66 660 40
           Q693 10 726 40 Q759 64 800 38
           L800 68 L0 68 Z"
        fill={fill}
      />
    </svg>
  );
}

export function MountainSilhouette({ className = '', flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg width="130" height="560" viewBox="0 0 130 560" fill="none" aria-hidden="true"
      className={className} style={flip ? { transform: 'scaleX(-1)' } : undefined}>
      <defs>
        <linearGradient id={`mist${flip}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ece0b8" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#ece0b8" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#ece0b8" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* 원경 산 */}
      <path d="M-15 560 L20 320 L55 400 L88 200 L120 560 Z" fill="#9b7a50" opacity={0.07} />
      {/* 중경 산 */}
      <path d="M-25 560 L8 380 L38 440 L68 290 L98 360 L130 560 Z" fill="#8b6b3a" opacity={0.10} />
      {/* 근경 구릉 */}
      <path d="M-10 560 L5 445 L35 490 L62 400 L92 460 L130 560 Z" fill="#7a5a28" opacity={0.14} />
      {/* 소나무 */}
      <g fill="#5a3e20" opacity={0.22}>
        <polygon points="12,470 8,482 16,482" />
        <polygon points="12,461 6,476 18,476" />
        <polygon points="12,452 4,470 20,470" />
        <rect x="11" y="482" width="2.5" height="9" />
        <polygon points="30,458 26,470 34,470" />
        <polygon points="30,449 22,466 38,466" />
        <rect x="29" y="470" width="2.5" height="8" />
        <polygon points="50,475 46,486 54,486" />
        <polygon points="50,466 43,481 57,481" />
        <rect x="49" y="486" width="2.5" height="7" />
      </g>
      {/* 안개 오버레이 */}
      <rect width="130" height="240" fill={`url(#mist${flip})`} />
    </svg>
  );
}

export function SectionOrnamentDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 px-8 ${className}`}>
      <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(180,130,40,0.5))' }} />
      <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
        <path d="M11 1 L13.5 8.5 L21 11 L13.5 13.5 L11 21 L8.5 13.5 L1 11 L8.5 8.5 Z"
          fill="#c9a84c" opacity={0.85} />
      </svg>
      <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, rgba(180,130,40,0.5))' }} />
    </div>
  );
}

function GoldCorner({ rot }: { rot: string }) {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" aria-hidden="true"
      style={{ transform: rot }}>
      <path d="M4 4 L4 20 M4 4 L20 4" stroke="#c9a84c" strokeWidth="2.8" strokeLinecap="square" />
      <circle cx="4" cy="4" r="3.5" fill="#c9a84c" />
      <circle cx="4" cy="4" r="1.5" fill="#f5e0a0" />
    </svg>
  );
}

export function GoldCornerFrame({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      <div className="absolute top-3 left-3"><GoldCorner rot="rotate(0deg)" /></div>
      <div className="absolute top-3 right-3"><GoldCorner rot="rotate(90deg)" /></div>
      <div className="absolute bottom-3 left-3"><GoldCorner rot="rotate(-90deg)" /></div>
      <div className="absolute bottom-3 right-3"><GoldCorner rot="rotate(180deg)" /></div>
    </div>
  );
}

export function CloudCluster({ className = '' }: { className?: string }) {
  return (
    <svg width="160" height="60" viewBox="0 0 160 60" fill="none" aria-hidden="true"
      className={className}>
      <ellipse cx="50" cy="40" rx="40" ry="18" fill="white" opacity={0.55} />
      <ellipse cx="72" cy="32" rx="28" ry="16" fill="white" opacity={0.5} />
      <ellipse cx="38" cy="38" rx="22" ry="14" fill="white" opacity={0.45} />
      <ellipse cx="110" cy="42" rx="34" ry="16" fill="white" opacity={0.45} />
      <ellipse cx="128" cy="34" rx="22" ry="14" fill="white" opacity={0.4} />
    </svg>
  );
}

export function CraneDecor({ className = '' }: { className?: string }) {
  /* 두루미 — 전통 수묵화 스타일 비상 두루미 (왼쪽 방향) */
  return (
    <svg width="210" height="160" viewBox="0 0 210 160" fill="none" aria-hidden="true"
      className={className}>
      <defs>
        <filter id="crane-blur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.2" />
        </filter>
      </defs>

      {/* 그림자 후광 (은은한 흰 빛) */}
      <ellipse cx="105" cy="82" rx="72" ry="28" fill="white" opacity={0.18} filter="url(#crane-blur)" />

      {/* ── 날개 (오른쪽 위, 크고 넓게) ── */}
      {/* 오른쪽 날개 상단면 */}
      <path
        d="M108 72 C125 55 150 38 178 22 C190 15 202 12 205 18 C198 24 182 34 162 50 C142 64 122 74 108 76"
        fill="white" opacity={0.95}
      />
      {/* 오른쪽 날개 검은 끝 깃털 */}
      <path
        d="M178 22 C190 15 202 12 205 18 C196 22 186 28 174 36 C168 30 173 24 178 22"
        fill="#2a2020" opacity={0.82}
      />

      {/* ── 날개 (왼쪽 아래, 아름다운 곡선) ── */}
      {/* 왼쪽 날개 하단면 */}
      <path
        d="M102 80 C85 96 62 116 36 132 C22 140 8 145 5 138 C12 130 28 120 50 108 C70 95 90 84 102 82"
        fill="white" opacity={0.9}
      />
      {/* 왼쪽 날개 검은 끝 깃털 */}
      <path
        d="M36 132 C22 140 8 145 5 138 C14 134 24 126 36 118 C38 126 38 132 36 132"
        fill="#2a2020" opacity={0.78}
      />

      {/* ── 몸통 ── */}
      <ellipse cx="108" cy="80" rx="28" ry="14" fill="white" opacity={0.97}
        transform="rotate(-18, 108, 80)" />

      {/* ── 꼬리 깃털 ── */}
      <path
        d="M128 84 C138 88 148 92 155 98 C148 95 142 90 136 90 C140 95 145 102 148 110"
        stroke="#2a2020" strokeWidth="2.2" strokeLinecap="round" opacity={0.7} fill="none"
      />
      <path
        d="M128 84 C140 86 152 86 162 82 C154 86 147 90 140 93"
        stroke="#2a2020" strokeWidth="1.6" strokeLinecap="round" opacity={0.5} fill="none"
      />

      {/* ── 목 (검은색 긴 목) ── */}
      <path
        d="M96 72 C82 60 68 48 56 36 C62 42 70 52 80 64 C86 68 92 72 96 74"
        stroke="#1e1616" strokeWidth="9" strokeLinecap="round" fill="none"
      />
      {/* 목 흰 윤곽 */}
      <path
        d="M96 72 C82 60 68 48 56 36"
        stroke="white" strokeWidth="3.5" strokeLinecap="round" fill="none" opacity={0.25}
      />

      {/* ── 머리 ── */}
      <ellipse cx="52" cy="32" rx="11" ry="9" fill="white" opacity={0.97}
        transform="rotate(-20, 52, 32)" />

      {/* 빨간 왕관 (단정학 특징) */}
      <ellipse cx="56" cy="23" rx="7" ry="4.5" fill="#ab1729" opacity={0.92}
        transform="rotate(-20, 56, 23)" />
      <ellipse cx="56" cy="23" rx="4" ry="2.5" fill="#d42040" opacity={0.7}
        transform="rotate(-20, 56, 23)" />

      {/* 눈 */}
      <circle cx="47" cy="31" r="2.5" fill="#1a1414" />
      <circle cx="46.2" cy="30.2" r="0.9" fill="white" opacity={0.8} />

      {/* 부리 */}
      <path d="M44 33 L28 29 L44 36" fill="#c9a040" opacity={0.9} />
      <path d="M44 33 L28 29" stroke="#9b7820" strokeWidth="0.8" opacity={0.6} />

      {/* ── 다리 (뒤로 늘어짐) ── */}
      <path d="M118 88 L148 122 L143 130 M148 122 L153 131"
        stroke="#1e1616" strokeWidth="2.2" strokeLinecap="round" opacity={0.65} fill="none"
      />
      <path d="M122 90 L150 128 L145 136 M150 128 L155 137"
        stroke="#1e1616" strokeWidth="1.8" strokeLinecap="round" opacity={0.5} fill="none"
      />
    </svg>
  );
}
