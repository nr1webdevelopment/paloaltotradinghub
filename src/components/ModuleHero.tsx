/**
 * Renders one of 7 distinct SVG hero illustrations based on the
 * module's position in the curriculum. Each has its own color family
 * and iconic shape so the modules grid scans visually instead of
 * as a wall of text.
 *
 * `index` is 0-based.
 */
export function ModuleHero({ index }: { index: number }) {
  const heroes = [Hero1, Hero2, Hero3, Hero4, Hero5, Hero6, Hero7];
  const Hero = heroes[index] ?? Hero1;
  return <Hero />;
}

const SVG_PROPS = {
  viewBox: '0 0 600 200',
  preserveAspectRatio: 'xMidYMid slice' as const,
  className: 'block w-full h-full transition-transform duration-500 ease-out group-hover:scale-[1.03]',
  xmlns: 'http://www.w3.org/2000/svg',
};

/* 1 — Foundations: rising candlesticks (red) */
function Hero1() {
  return (
    <svg {...SVG_PROPS}>
      <defs>
        <linearGradient id="m1g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3a0c1f" />
          <stop offset="1" stopColor="#0e0309" />
        </linearGradient>
      </defs>
      <rect width="600" height="200" fill="url(#m1g)" />
      <g stroke="rgba(255,255,255,.05)">
        <line x1="0" y1="60" x2="600" y2="60" />
        <line x1="0" y1="120" x2="600" y2="120" />
      </g>
      <g strokeWidth="2">
        <line x1="75" y1="80" x2="75" y2="170" stroke="#ff3b5c" />
        <rect x="68" y="100" width="14" height="50" fill="#ff3b5c" />
        <line x1="135" y1="60" x2="135" y2="150" stroke="#3b82f6" />
        <rect x="128" y="80" width="14" height="55" fill="#3b82f6" opacity=".85" />
        <line x1="195" y1="50" x2="195" y2="140" stroke="#3b82f6" />
        <rect x="188" y="70" width="14" height="50" fill="#3b82f6" opacity=".75" />
        <line x1="255" y1="65" x2="255" y2="130" stroke="#ff3b5c" />
        <rect x="248" y="85" width="14" height="35" fill="#ff3b5c" opacity=".85" />
        <line x1="315" y1="45" x2="315" y2="120" stroke="#3b82f6" />
        <rect x="308" y="60" width="14" height="50" fill="#3b82f6" />
        <line x1="375" y1="30" x2="375" y2="110" stroke="#3b82f6" />
        <rect x="368" y="50" width="14" height="50" fill="#3b82f6" />
        <line x1="435" y1="40" x2="435" y2="100" stroke="#ff3b5c" />
        <rect x="428" y="55" width="14" height="35" fill="#ff3b5c" opacity=".9" />
        <line x1="495" y1="25" x2="495" y2="90" stroke="#3b82f6" />
        <rect x="488" y="40" width="14" height="45" fill="#3b82f6" />
        <line x1="555" y1="20" x2="555" y2="85" stroke="#3b82f6" />
        <rect x="548" y="30" width="14" height="50" fill="#3b82f6" />
      </g>
      <polyline
        points="75,125 135,107 195,95 255,100 315,75 375,65 435,75 495,55 555,50"
        stroke="rgba(255,255,255,.45)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* 2 — Data: vertical bars (blue) */
function Hero2() {
  return (
    <svg {...SVG_PROPS}>
      <defs>
        <linearGradient id="m2g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0c2243" />
          <stop offset="1" stopColor="#050b18" />
        </linearGradient>
      </defs>
      <rect width="600" height="200" fill="url(#m2g)" />
      <g fill="#fff" opacity=".07">
        <circle cx="80" cy="40" r="2" /><circle cx="160" cy="35" r="2" /><circle cx="240" cy="50" r="2" /><circle cx="320" cy="30" r="2" /><circle cx="400" cy="45" r="2" /><circle cx="480" cy="38" r="2" /><circle cx="540" cy="32" r="2" />
        <circle cx="100" cy="172" r="2" /><circle cx="200" cy="167" r="2" /><circle cx="300" cy="174" r="2" /><circle cx="400" cy="170" r="2" /><circle cx="500" cy="176" r="2" />
      </g>
      <g>
        {[
          [50, 80, 80, 0.85], [90, 60, 100, 0.9], [130, 100, 60, 0.7], [170, 50, 110, 1],
          [210, 75, 85, 0.85], [250, 40, 120, 1], [290, 65, 95, 0.9], [330, 90, 70, 0.75],
          [370, 55, 105, 0.95], [410, 35, 125, 1], [450, 70, 90, 0.85], [490, 85, 75, 0.8], [530, 45, 115, 1],
        ].map(([x, y, h, op], i) => (
          <rect key={i} x={x} y={y} width="22" height={h} rx="2" fill={op === 1 ? '#60a5fa' : '#3b82f6'} opacity={op} />
        ))}
      </g>
    </svg>
  );
}

/* 3 — ML: neural network (violet) */
function Hero3() {
  return (
    <svg {...SVG_PROPS}>
      <defs>
        <linearGradient id="m3g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1a1140" />
          <stop offset="1" stopColor="#0a0420" />
        </linearGradient>
      </defs>
      <rect width="600" height="200" fill="url(#m3g)" />
      <g stroke="rgba(167,139,250,.25)" fill="none">
        {[45, 100, 155].flatMap(y1 => [30, 65, 100, 135, 170].map(y2 => (
          <line key={`l-${y1}-${y2}`} x1="120" y1={y1} x2="300" y2={y2} />
        )))}
        {[30, 65, 100, 135, 170].flatMap(y1 => [70, 130].map(y2 => (
          <line key={`r-${y1}-${y2}`} x1="300" y1={y1} x2="480" y2={y2} />
        )))}
      </g>
      <g fill="#a78bfa">
        <circle cx="120" cy="45" r="7" /><circle cx="120" cy="100" r="7" /><circle cx="120" cy="155" r="7" />
      </g>
      <g fill="#c084fc">
        <circle cx="300" cy="30" r="9" /><circle cx="300" cy="65" r="9" /><circle cx="300" cy="100" r="9" /><circle cx="300" cy="135" r="9" /><circle cx="300" cy="170" r="9" />
      </g>
      <g fill="#ff3b5c">
        <circle cx="480" cy="70" r="8" /><circle cx="480" cy="130" r="8" />
      </g>
    </svg>
  );
}

/* 4 — Backtesting: equity curve (teal) */
function Hero4() {
  return (
    <svg {...SVG_PROPS}>
      <defs>
        <linearGradient id="m4g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#073238" />
          <stop offset="1" stopColor="#020e10" />
        </linearGradient>
        <linearGradient id="m4f" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#06b6d4" stopOpacity=".5" />
          <stop offset="1" stopColor="#06b6d4" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="600" height="200" fill="url(#m4g)" />
      <g stroke="rgba(255,255,255,.05)">
        <line x1="0" y1="60" x2="600" y2="60" /><line x1="0" y1="120" x2="600" y2="120" />
      </g>
      <path
        d="M 0 160 L 50 150 L 100 135 L 150 145 L 200 100 L 250 90 L 300 110 L 350 70 L 400 60 L 450 80 L 500 50 L 550 40 L 600 35 L 600 200 L 0 200 Z"
        fill="url(#m4f)"
      />
      <polyline
        points="0,160 50,150 100,135 150,145 200,100 250,90 300,110 350,70 400,60 450,80 500,50 550,40 600,35"
        stroke="#06b6d4"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <g fill="#06b6d4"><circle cx="400" cy="60" r="4" /><circle cx="550" cy="40" r="4" /></g>
      <g fill="#ff3b5c"><circle cx="350" cy="70" r="3" opacity=".8" /></g>
    </svg>
  );
}

/* 5 — Risk: shield (amber) */
function Hero5() {
  return (
    <svg {...SVG_PROPS}>
      <defs>
        <linearGradient id="m5g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3d1a04" />
          <stop offset="1" stopColor="#1a0e02" />
        </linearGradient>
      </defs>
      <rect width="600" height="200" fill="url(#m5g)" />
      <g stroke="rgba(255,181,71,.15)" fill="none">
        <circle cx="300" cy="100" r="80" /><circle cx="300" cy="100" r="60" />
      </g>
      <path
        d="M 300 35 L 360 60 L 360 110 Q 360 145 300 170 Q 240 145 240 110 L 240 60 Z"
        fill="#1a0e02"
        stroke="#ffb547"
        strokeWidth="2.5"
      />
      <g>
        <rect x="262" y="120" width="12" height="32" fill="#ffb547" opacity=".7" />
        <rect x="280" y="100" width="12" height="52" fill="#ffb547" opacity=".9" />
        <rect x="298" y="85" width="12" height="67" fill="#ffb547" />
        <rect x="316" y="105" width="12" height="47" fill="#ffb547" opacity=".85" />
        <rect x="334" y="115" width="12" height="37" fill="#ffb547" opacity=".7" />
      </g>
      <g fill="#ffb547" opacity=".45">
        <circle cx="120" cy="80" r="2.5" /><circle cx="100" cy="120" r="2.5" /><circle cx="140" cy="140" r="2.5" />
        <circle cx="480" cy="80" r="2.5" /><circle cx="500" cy="120" r="2.5" /><circle cx="460" cy="140" r="2.5" />
      </g>
    </svg>
  );
}

/* 6 — Execution: order book (navy) */
function Hero6() {
  return (
    <svg {...SVG_PROPS}>
      <defs>
        <linearGradient id="m6g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0a1838" />
          <stop offset="1" stopColor="#03081a" />
        </linearGradient>
      </defs>
      <rect width="600" height="200" fill="url(#m6g)" />
      <line x1="0" y1="100" x2="600" y2="100" stroke="rgba(255,255,255,.15)" strokeDasharray="4 4" />
      <g>
        <rect x="100" y="20" width="380" height="14" rx="2" fill="#ff3b5c" opacity=".4" />
        <rect x="140" y="40" width="340" height="14" rx="2" fill="#ff3b5c" opacity=".55" />
        <rect x="200" y="60" width="280" height="14" rx="2" fill="#ff3b5c" opacity=".7" />
        <rect x="280" y="80" width="200" height="14" rx="2" fill="#ff3b5c" opacity=".85" />
      </g>
      <g>
        <rect x="280" y="108" width="200" height="14" rx="2" fill="#3b82f6" opacity=".85" />
        <rect x="200" y="128" width="280" height="14" rx="2" fill="#3b82f6" opacity=".7" />
        <rect x="140" y="148" width="340" height="14" rx="2" fill="#3b82f6" opacity=".55" />
        <rect x="100" y="168" width="380" height="14" rx="2" fill="#3b82f6" opacity=".4" />
      </g>
    </svg>
  );
}

/* 7 — Deployment: server rack (rose) */
function Hero7() {
  return (
    <svg {...SVG_PROPS}>
      <defs>
        <linearGradient id="m7g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3d0a25" />
          <stop offset="1" stopColor="#160410" />
        </linearGradient>
      </defs>
      <rect width="600" height="200" fill="url(#m7g)" />
      {[30, 65, 100, 135].map((y, i) => (
        <g key={i}>
          <rect x="190" y={y} width="220" height="28" rx="4" fill="#1a0612" stroke="#ff3b5c" strokeWidth="1.5" />
          <circle cx="380" cy={y + 14} r="3" fill={i === 3 ? '#ffb547' : '#3b82f6'} />
          <circle cx="392" cy={y + 14} r="3" fill={i === 0 ? '#ff3b5c' : '#3b82f6'} />
          <rect x="205" y={y + 10} width={80 + i * 13} height="3" rx="1" fill="rgba(255,255,255,.18)" />
          <rect x="205" y={y + 16} width={60 + i * 7} height="3" rx="1" fill="rgba(255,255,255,.12)" />
        </g>
      ))}
      <g stroke="rgba(255,59,92,.4)" strokeWidth="1.5" fill="none" strokeLinecap="round">
        <path d="M 100 100 L 190 100" /><path d="M 410 100 L 500 100" />
      </g>
      <g fill="#ff3b5c"><circle cx="100" cy="100" r="4" /><circle cx="500" cy="100" r="4" /></g>
    </svg>
  );
}
