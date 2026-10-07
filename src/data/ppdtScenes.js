// ── PPDT Scene Stimuli ──
// High-fidelity SVG visual stimuli capturing realistic SSB PPDT ambiguous scenarios

export const PPDT_SCENES = [
  {
    id: 1,
    title: "The Workshop Incident",
    category: "Technical / Industrial",
    prompt: "An industrial mechanical bay where an assembly machine has stalled during an urgent export batch. Three individuals are visible.",
    characterHints: "One young engineer (22-25), one senior foreman, one machine technician.",
    sampleAction: "Diagnosing sensor failure, fabricating an emergency bypass, and delivering the dispatch on schedule.",
    svgContent: `
      <svg viewBox="0 0 800 500" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#141910" />
            <stop offset="100%" stop-color="#2a331a" />
          </linearGradient>
          <filter id="hazy">
            <feGaussianBlur stdDeviation="1.5" />
          </filter>
        </defs>
        <rect width="800" height="500" fill="url(#bg1)" />
        <!-- Structural beams -->
        <line x1="80" y1="0" x2="80" y2="500" stroke="#3d4928" stroke-width="8"/>
        <line x1="720" y1="0" x2="720" y2="500" stroke="#3d4928" stroke-width="8"/>
        <line x1="0" y1="120" x2="800" y2="120" stroke="#3d4928" stroke-width="6"/>
        <!-- Heavy Machinery -->
        <rect x="220" y="240" width="340" height="190" rx="8" fill="#1b2412" stroke="#526433" stroke-width="3"/>
        <circle cx="280" cy="300" r="32" fill="#2d3a1c" stroke="#c8a84b" stroke-width="2"/>
        <circle cx="480" cy="310" r="45" fill="#253018" stroke="#71864a" stroke-width="3"/>
        <!-- Steam / haze effect for SSB ambiguity -->
        <ellipse cx="400" cy="270" rx="120" ry="40" fill="#ffffff" opacity="0.07" filter="url(#hazy)"/>
        
        <!-- Silhouette 1: Central Young Engineer leaning forward inspecting gauge -->
        <g transform="translate(380, 180)">
          <circle cx="20" cy="20" r="18" fill="#a48c48" opacity="0.85"/>
          <path d="M5,42 Q20,38 35,42 L42,130 L-2,130 Z" fill="#887339"/>
          <path d="M35,55 L75,85 L65,95 L30,68 Z" fill="#75622e"/> <!-- Pointing hand -->
        </g>
        <!-- Silhouette 2: Senior supervisor with clipboard on right -->
        <g transform="translate(560, 200)">
          <circle cx="15" cy="18" r="16" fill="#889c62" opacity="0.8"/>
          <path d="M2,38 Q15,35 30,38 L36,140 L-6,140 Z" fill="#586c38"/>
          <rect x="-8" y="70" width="22" height="30" rx="2" fill="#c8a84b" opacity="0.8"/>
        </g>
        <!-- Silhouette 3: Worker holding wrench on left -->
        <g transform="translate(160, 210)">
          <circle cx="15" cy="18" r="16" fill="#697c48" opacity="0.8"/>
          <path d="M0,38 Q15,35 30,38 L34,140 L-4,140 Z" fill="#4d5c32"/>
          <line x1="28" y1="80" x2="48" y2="60" stroke="#a0b57a" stroke-width="4"/>
        </g>
      </svg>
    `
  },
  {
    id: 2,
    title: "The Flood Relief Outpost",
    category: "Crisis Management",
    prompt: "A low-lying coastal village under flash floods. An improvised rescue boat is docked near a half-submerged culvert. People are coordinating.",
    characterHints: "Young volunteer/cadet (21-24, male/female), distressed villager, junior assistant.",
    sampleAction: "Establishing high-ground shelter, triaging medical supplies, and safely evacuating vulnerable families.",
    svgContent: `
      <svg viewBox="0 0 800 500" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#121815" />
            <stop offset="60%" stop-color="#1c2720" />
            <stop offset="100%" stop-color="#24382e" />
          </linearGradient>
        </defs>
        <rect width="800" height="500" fill="url(#bg2)" />
        <!-- Water line -->
        <path d="M0,340 Q200,320 400,340 T800,335 L800,500 L0,500 Z" fill="#14261f" opacity="0.9" />
        <path d="M0,360 Q250,345 500,365 T800,355 L800,500 L0,500 Z" fill="#1b382c" opacity="0.6" />
        <!-- Submerged hut & tree -->
        <polygon points="120,310 180,240 240,310" fill="#2d3d2e"/>
        <rect x="140" y="310" width="80" height="50" fill="#202c21"/>
        <path d="M680,180 Q640,240 670,350 L690,350 Q720,240 680,180 Z" fill="#18271e"/>
        <!-- Inflatable/Wood rescue boat -->
        <path d="M300,380 C360,420 540,420 600,380 C570,360 330,360 300,380 Z" fill="#8f7a35" stroke="#c8a84b" stroke-width="2"/>
        <!-- Central Hero figure standing in water directing boat -->
        <g transform="translate(320, 260)">
          <circle cx="15" cy="18" r="16" fill="#d2be7d"/>
          <path d="M-2,36 Q15,32 32,36 L36,120 L-6,120 Z" fill="#a48c48"/>
          <!-- Outstretched hand -->
          <line x1="28" y1="50" x2="70" y2="40" stroke="#d2be7d" stroke-width="5" stroke-linecap="round"/>
        </g>
        <!-- Person being helped onto boat -->
        <g transform="translate(440, 290)">
          <circle cx="12" cy="14" r="14" fill="#879975"/>
          <path d="M0,30 Q12,28 24,30 L26,90 L-2,90 Z" fill="#586c4a"/>
        </g>
      </svg>
    `
  },
  {
    id: 3,
    title: "The Strategic Briefing",
    category: "Defence / Planning",
    prompt: "An operational field tent in a mountainous sector. Officers and junior leaders examine an illuminated map table at twilight.",
    characterHints: "Young Lieutenant/Flight Lieutenant (23-26), junior NCO, tactical intelligence officer.",
    sampleAction: "Planning an alternate logistics path avoiding washed-out passes before bad weather sets in.",
    svgContent: `
      <svg viewBox="0 0 800 500" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect width="800" height="500" fill="#161a10" />
        <!-- Tent Canvas slopes -->
        <polygon points="0,0 400,90 800,0 800,500 0,500" fill="#1f2516" stroke="#3d4928" stroke-width="2"/>
        <!-- Map table glow -->
        <ellipse cx="400" cy="330" rx="190" ry="70" fill="#2d3a1c" stroke="#c8a84b" stroke-width="2"/>
        <ellipse cx="400" cy="330" rx="160" ry="50" fill="#c8a84b" opacity="0.15"/>
        <line x1="310" y1="310" x2="490" y2="340" stroke="#c8a84b" stroke-dasharray="6,4" stroke-width="2"/>
        <!-- Central Young Officer pointing to map -->
        <g transform="translate(375, 180)">
          <circle cx="25" cy="22" r="18" fill="#d2be7d"/>
          <path d="M5,42 Q25,38 45,42 L52,145 L-2,145 Z" fill="#9e843a"/>
          <line x1="35" y1="70" x2="35" y2="125" stroke="#d2be7d" stroke-width="4"/>
        </g>
        <!-- Listening teammate 1 -->
        <g transform="translate(230, 200)">
          <circle cx="20" cy="20" r="16" fill="#889c62"/>
          <path d="M5,40 Q20,36 35,40 L40,140 L0,140 Z" fill="#586c38"/>
        </g>
        <!-- Listening teammate 2 -->
        <g transform="translate(520, 205)">
          <circle cx="20" cy="20" r="16" fill="#889c62"/>
          <path d="M5,40 Q20,36 35,40 L40,140 L0,140 Z" fill="#586c38"/>
        </g>
      </svg>
    `
  },
  {
    id: 4,
    title: "The Village Panchayat Literacy Drive",
    category: "Social Development",
    prompt: "Under a banyan tree, a group of villagers of mixed ages gather around a young college graduate presenting an agricultural self-help model.",
    characterHints: "Young youth leader / student (20-23), village elder (50+), women self-help group lead.",
    sampleAction: "Introducing micro-irrigation and adult education classes to increase village crop yield and financial literacy.",
    svgContent: `
      <svg viewBox="0 0 800 500" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect width="800" height="500" fill="#1b2112" />
        <!-- Tree trunk and canopy -->
        <path d="M220,120 Q180,260 210,500 L280,500 Q260,280 340,140 Z" fill="#2d371d"/>
        <ellipse cx="400" cy="80" rx="360" ry="120" fill="#3a4724" opacity="0.8"/>
        <ellipse cx="250" cy="60" rx="200" ry="90" fill="#4d5f2e" opacity="0.6"/>
        <!-- Central Young speaker on elevated platform -->
        <rect x="420" y="320" width="90" height="15" fill="#3f4e27"/>
        <g transform="translate(440, 180)">
          <circle cx="25" cy="22" r="17" fill="#d2be7d"/>
          <path d="M8,42 Q25,38 42,42 L48,140 L2,140 Z" fill="#a48c48"/>
          <!-- Holding chart/paper -->
          <rect x="40" y="60" width="30" height="40" rx="2" fill="#e8e4d0" opacity="0.9"/>
        </g>
        <!-- Listening audience seated on ground -->
        <ellipse cx="270" cy="380" rx="25" ry="35" fill="#677b47"/>
        <circle cx="270" cy="335" r="14" fill="#a0b57a"/>
        <ellipse cx="330" cy="400" rx="24" ry="32" fill="#586c38"/>
        <circle cx="330" cy="355" r="14" fill="#a0b57a"/>
        <ellipse cx="580" cy="385" rx="26" ry="36" fill="#71864a"/>
        <circle cx="580" cy="340" r="15" fill="#b6cc8e"/>
      </svg>
    `
  }
];
