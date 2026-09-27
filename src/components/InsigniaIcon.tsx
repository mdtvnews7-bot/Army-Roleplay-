import React from 'react';

interface InsigniaIconProps {
  type: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  glow?: boolean;
}

export const InsigniaIcon: React.FC<InsigniaIconProps> = ({
  type,
  size = 'md',
  className = '',
  glow = false
}) => {
  const sizeMap = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
    '2xl': 'w-28 h-28'
  };

  const currentSize = sizeMap[size] || sizeMap.md;
  const glowClass = glow ? 'drop-shadow-[0_0_12px_rgba(245,158,11,0.7)]' : '';

  // Return specific military SVG insignia
  return (
    <div className={`inline-flex items-center justify-center flex-shrink-0 ${currentSize} ${glowClass} ${className}`}>
      {renderInsigniaSvg(type)}
    </div>
  );
};

function renderInsigniaSvg(type: string) {
  const chevronFill = '#f59e0b'; // Gold / Brass
  const chevronStroke = '#b45309';
  const silverFill = '#e2e8f0';
  const silverStroke = '#94a3b8';

  switch (type) {
    case 'none':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="30" fill="none" stroke="#475569" strokeWidth="3" strokeDasharray="6 6" />
          <text x="50" y="55" textAnchor="middle" fill="#64748b" fontSize="18" fontWeight="bold" fontFamily="monospace">PV1</text>
        </svg>
      );

    case 'chevron-1': // PV2
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path d="M50 25 L85 55 L75 62 L50 40 L25 62 L15 55 Z" fill={chevronFill} stroke={chevronStroke} strokeWidth="2" />
        </svg>
      );

    case 'chevron-1-rocker-1': // PFC
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Chevron */}
          <path d="M50 20 L82 48 L73 54 L50 34 L27 54 L18 48 Z" fill={chevronFill} stroke={chevronStroke} strokeWidth="2" />
          {/* Rocker */}
          <path d="M22 60 Q50 78 78 60 L78 68 Q50 86 22 68 Z" fill={chevronFill} stroke={chevronStroke} strokeWidth="2" />
        </svg>
      );

    case 'specialist-shield': // SPC
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path d="M50 15 C75 15 85 28 85 50 C85 75 50 90 50 90 C50 90 15 75 15 50 C15 28 25 15 50 15 Z" fill="#1e293b" stroke="#eab308" strokeWidth="4" />
          {/* Eagle symbol inside shield */}
          <path d="M50 32 L58 45 L50 42 L42 45 Z" fill="#f59e0b" />
          <path d="M30 46 Q50 42 70 46 Q50 58 30 46" fill="#f59e0b" />
          <circle cx="50" cy="56" r="6" fill="#f59e0b" />
          <path d="M42 63 L50 78 L58 63 Z" fill="#f59e0b" />
        </svg>
      );

    case 'chevron-2': // CPL
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path d="M50 18 L82 44 L73 50 L50 31 L27 50 L18 44 Z" fill={chevronFill} stroke={chevronStroke} strokeWidth="2" />
          <path d="M50 36 L82 62 L73 68 L50 49 L27 68 L18 62 Z" fill={chevronFill} stroke={chevronStroke} strokeWidth="2" />
        </svg>
      );

    case 'chevron-3': // SGT
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path d="M50 14 L82 38 L73 44 L50 26 L27 44 L18 38 Z" fill={chevronFill} stroke={chevronStroke} strokeWidth="2" />
          <path d="M50 30 L82 54 L73 60 L50 42 L27 60 L18 54 Z" fill={chevronFill} stroke={chevronStroke} strokeWidth="2" />
          <path d="M50 46 L82 70 L73 76 L50 58 L27 76 L18 70 Z" fill={chevronFill} stroke={chevronStroke} strokeWidth="2" />
        </svg>
      );

    case 'chevron-3-rocker-1': // SSG
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path d="M50 10 L82 34 L73 40 L50 22 L27 40 L18 34 Z" fill={chevronFill} stroke={chevronStroke} strokeWidth="2" />
          <path d="M50 25 L82 49 L73 55 L50 37 L27 55 L18 49 Z" fill={chevronFill} stroke={chevronStroke} strokeWidth="2" />
          <path d="M50 40 L82 64 L73 70 L50 52 L27 70 L18 64 Z" fill={chevronFill} stroke={chevronStroke} strokeWidth="2" />
          <path d="M22 75 Q50 90 78 75 L78 82 Q50 97 22 82 Z" fill={chevronFill} stroke={chevronStroke} strokeWidth="2" />
        </svg>
      );

    case 'chevron-3-rocker-2': // SFC
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path d="M50 8 L82 30 L73 36 L50 19 L27 36 L18 30 Z" fill={chevronFill} stroke={chevronStroke} strokeWidth="2" />
          <path d="M50 21 L82 43 L73 49 L50 32 L27 49 L18 43 Z" fill={chevronFill} stroke={chevronStroke} strokeWidth="2" />
          <path d="M50 34 L82 56 L73 62 L50 45 L27 62 L18 56 Z" fill={chevronFill} stroke={chevronStroke} strokeWidth="2" />
          <path d="M22 66 Q50 80 78 66 L78 73 Q50 87 22 73 Z" fill={chevronFill} stroke={chevronStroke} strokeWidth="2" />
          <path d="M22 77 Q50 91 78 77 L78 84 Q50 98 22 84 Z" fill={chevronFill} stroke={chevronStroke} strokeWidth="2" />
        </svg>
      );

    case 'chevron-3-rocker-3': // MSG
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path d="M50 6 L82 26 L73 32 L50 16 L27 32 L18 26 Z" fill={chevronFill} stroke={chevronStroke} strokeWidth="2" />
          <path d="M50 18 L82 38 L73 44 L50 28 L27 44 L18 38 Z" fill={chevronFill} stroke={chevronStroke} strokeWidth="2" />
          <path d="M50 30 L82 50 L73 56 L50 40 L27 56 L18 50 Z" fill={chevronFill} stroke={chevronStroke} strokeWidth="2" />
          <path d="M22 59 Q50 72 78 59 L78 65 Q50 78 22 65 Z" fill={chevronFill} stroke={chevronStroke} strokeWidth="2" />
          <path d="M22 69 Q50 82 78 69 L78 75 Q50 88 22 75 Z" fill={chevronFill} stroke={chevronStroke} strokeWidth="2" />
          <path d="M22 79 Q50 92 78 79 L78 85 Q50 98 22 85 Z" fill={chevronFill} stroke={chevronStroke} strokeWidth="2" />
        </svg>
      );

    case 'chevron-3-rocker-3-diamond': // 1SG
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path d="M50 6 L82 26 L73 32 L50 16 L27 32 L18 26 Z" fill={chevronFill} stroke={chevronStroke} strokeWidth="2" />
          <path d="M50 18 L82 38 L73 44 L50 28 L27 44 L18 38 Z" fill={chevronFill} stroke={chevronStroke} strokeWidth="2" />
          <path d="M50 30 L82 50 L73 56 L50 40 L27 56 L18 50 Z" fill={chevronFill} stroke={chevronStroke} strokeWidth="2" />
          {/* Diamond Lozenge */}
          <polygon points="50,44 58,54 50,64 42,54" fill="#fbbf24" stroke="#78350f" strokeWidth="1.5" />
          <path d="M22 68 Q50 81 78 68 L78 74 Q50 87 22 74 Z" fill={chevronFill} stroke={chevronStroke} strokeWidth="2" />
          <path d="M22 78 Q50 91 78 78 L78 84 Q50 97 22 84 Z" fill={chevronFill} stroke={chevronStroke} strokeWidth="2" />
          <path d="M22 88 Q50 101 78 88 L78 94 Q50 107 22 94 Z" fill={chevronFill} stroke={chevronStroke} strokeWidth="2" />
        </svg>
      );

    case 'chevron-3-rocker-3-star': // SGM
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path d="M50 6 L82 26 L73 32 L50 16 L27 32 L18 26 Z" fill={chevronFill} stroke={chevronStroke} strokeWidth="2" />
          <path d="M50 18 L82 38 L73 44 L50 28 L27 44 L18 38 Z" fill={chevronFill} stroke={chevronStroke} strokeWidth="2" />
          <path d="M50 30 L82 50 L73 56 L50 40 L27 56 L18 50 Z" fill={chevronFill} stroke={chevronStroke} strokeWidth="2" />
          {/* 5-pointed Star in center */}
          <polygon points="50,42 53,50 62,50 55,56 58,65 50,60 42,65 45,56 38,50 47,50" fill="#fbbf24" stroke="#78350f" strokeWidth="1" />
          <path d="M22 68 Q50 81 78 68 L78 74 Q50 87 22 74 Z" fill={chevronFill} stroke={chevronStroke} strokeWidth="2" />
          <path d="M22 78 Q50 91 78 78 L78 84 Q50 97 22 84 Z" fill={chevronFill} stroke={chevronStroke} strokeWidth="2" />
          <path d="M22 88 Q50 101 78 88 L78 94 Q50 107 22 94 Z" fill={chevronFill} stroke={chevronStroke} strokeWidth="2" />
        </svg>
      );

    case 'chevron-3-rocker-3-wreath-star': // CSM
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path d="M50 6 L82 26 L73 32 L50 16 L27 32 L18 26 Z" fill={chevronFill} stroke={chevronStroke} strokeWidth="2" />
          <path d="M50 18 L82 38 L73 44 L50 28 L27 44 L18 38 Z" fill={chevronFill} stroke={chevronStroke} strokeWidth="2" />
          <path d="M50 30 L82 50 L73 56 L50 40 L27 56 L18 50 Z" fill={chevronFill} stroke={chevronStroke} strokeWidth="2" />
          {/* Wreath */}
          <circle cx="50" cy="54" r="11" fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeDasharray="4 2" />
          {/* Star in wreath */}
          <polygon points="50,46 52,52 58,52 53,56 55,62 50,58 45,62 47,56 42,52 48,52" fill="#fbbf24" />
          <path d="M22 68 Q50 81 78 68 L78 74 Q50 87 22 74 Z" fill={chevronFill} stroke={chevronStroke} strokeWidth="2" />
          <path d="M22 78 Q50 91 78 78 L78 84 Q50 97 22 84 Z" fill={chevronFill} stroke={chevronStroke} strokeWidth="2" />
          <path d="M22 88 Q50 101 78 88 L78 94 Q50 107 22 94 Z" fill={chevronFill} stroke={chevronStroke} strokeWidth="2" />
        </svg>
      );

    case 'warrant-bar-1': // WO1
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <rect x="25" y="15" width="50" height="70" rx="6" fill={silverFill} stroke={silverStroke} strokeWidth="3" />
          <rect x="35" y="42" width="30" height="16" fill="#0f172a" />
        </svg>
      );

    case 'warrant-bar-3': // CW3
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <rect x="25" y="15" width="50" height="70" rx="6" fill={silverFill} stroke={silverStroke} strokeWidth="3" />
          <rect x="35" y="28" width="30" height="11" fill="#0f172a" />
          <rect x="35" y="45" width="30" height="11" fill="#0f172a" />
          <rect x="35" y="62" width="30" height="11" fill="#0f172a" />
        </svg>
      );

    case 'gold-bar': // 2LT
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <rect x="32" y="15" width="36" height="70" rx="4" fill="#fbbf24" stroke="#b45309" strokeWidth="3" />
          <rect x="38" y="20" width="8" height="60" fill="#fef08a" opacity="0.6" />
        </svg>
      );

    case 'silver-bar': // 1LT
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <rect x="32" y="15" width="36" height="70" rx="4" fill={silverFill} stroke={silverStroke} strokeWidth="3" />
          <rect x="38" y="20" width="8" height="60" fill="#ffffff" opacity="0.8" />
        </svg>
      );

    case 'double-silver-bar': // CPT
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <rect x="20" y="15" width="24" height="70" rx="4" fill={silverFill} stroke={silverStroke} strokeWidth="3" />
          <rect x="56" y="15" width="24" height="70" rx="4" fill={silverFill} stroke={silverStroke} strokeWidth="3" />
          <rect x="44" y="32" width="12" height="12" fill={silverFill} stroke={silverStroke} strokeWidth="2" />
          <rect x="44" y="56" width="12" height="12" fill={silverFill} stroke={silverStroke} strokeWidth="2" />
        </svg>
      );

    case 'gold-oak-leaf': // MAJ
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path
            d="M50 15 C58 24 72 26 74 38 C76 48 68 54 75 66 C79 73 70 82 58 80 C54 86 46 86 42 80 C30 82 21 73 25 66 C32 54 24 48 26 38 C28 26 42 24 50 15 Z"
            fill="#fbbf24"
            stroke="#92400e"
            strokeWidth="3"
          />
          <path d="M50 25 L50 76 M50 38 L65 48 M50 48 L35 58 M50 60 L62 68" stroke="#92400e" strokeWidth="2.5" fill="none" />
        </svg>
      );

    case 'silver-oak-leaf': // LTC
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path
            d="M50 15 C58 24 72 26 74 38 C76 48 68 54 75 66 C79 73 70 82 58 80 C54 86 46 86 42 80 C30 82 21 73 25 66 C32 54 24 48 26 38 C28 26 42 24 50 15 Z"
            fill={silverFill}
            stroke={silverStroke}
            strokeWidth="3"
          />
          <path d="M50 25 L50 76 M50 38 L65 48 M50 48 L35 58 M50 60 L62 68" stroke={silverStroke} strokeWidth="2.5" fill="none" />
        </svg>
      );

    case 'silver-eagle': // COL
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path
            d="M50 20 C42 16 35 24 22 28 C15 30 14 38 20 44 C26 50 32 46 36 54 C38 60 30 68 36 74 C42 80 48 76 50 82 C52 76 58 80 64 74 C70 68 62 60 64 54 C68 46 74 50 80 44 C86 38 85 30 78 28 C65 24 58 16 50 20 Z"
            fill={silverFill}
            stroke={silverStroke}
            strokeWidth="2.5"
          />
          {/* Shield in center */}
          <path d="M44 46 L56 46 L56 56 C56 62 50 67 50 67 C50 67 44 62 44 56 Z" fill="#1e3a8a" stroke="#ffffff" strokeWidth="1.5" />
          {/* Olive branch & arrows */}
          <path d="M35 76 L44 72 M65 76 L56 72" stroke="#64748b" strokeWidth="2" />
        </svg>
      );

    case 'star-1': // BG (1 Star)
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <polygon points="50,15 60,38 85,38 65,54 73,78 50,63 27,78 35,54 15,38 40,38" fill={silverFill} stroke={silverStroke} strokeWidth="2" />
        </svg>
      );

    case 'star-2': // MG (2 Stars)
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <g transform="translate(-16, 0)">
            <polygon points="40,25 47,40 64,40 50,51 55,67 40,57 25,67 30,51 16,40 33,40" fill={silverFill} stroke={silverStroke} strokeWidth="1.5" />
          </g>
          <g transform="translate(36, 0)">
            <polygon points="40,25 47,40 64,40 50,51 55,67 40,57 25,67 30,51 16,40 33,40" fill={silverFill} stroke={silverStroke} strokeWidth="1.5" />
          </g>
        </svg>
      );

    case 'star-3': // LTG (3 Stars)
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <g transform="translate(-28, 5) scale(0.85)">
            <polygon points="50,22 57,37 74,37 60,48 65,64 50,54 35,64 40,48 26,37 43,37" fill={silverFill} stroke={silverStroke} strokeWidth="1.5" />
          </g>
          <g transform="translate(6, 5) scale(0.85)">
            <polygon points="50,22 57,37 74,37 60,48 65,64 50,54 35,64 40,48 26,37 43,37" fill={silverFill} stroke={silverStroke} strokeWidth="1.5" />
          </g>
          <g transform="translate(40, 5) scale(0.85)">
            <polygon points="50,22 57,37 74,37 60,48 65,64 50,54 35,64 40,48 26,37 43,37" fill={silverFill} stroke={silverStroke} strokeWidth="1.5" />
          </g>
        </svg>
      );

    case 'star-4': // GEN (4 Stars)
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <g transform="translate(-25, 12) scale(0.65)">
            <polygon points="50,20 58,38 78,38 62,50 68,68 50,57 32,68 38,50 22,38 42,38" fill={silverFill} stroke={silverStroke} strokeWidth="1.5" />
          </g>
          <g transform="translate(2, 12) scale(0.65)">
            <polygon points="50,20 58,38 78,38 62,50 68,68 50,57 32,68 38,50 22,38 42,38" fill={silverFill} stroke={silverStroke} strokeWidth="1.5" />
          </g>
          <g transform="translate(29, 12) scale(0.65)">
            <polygon points="50,20 58,38 78,38 62,50 68,68 50,57 32,68 38,50 22,38 42,38" fill={silverFill} stroke={silverStroke} strokeWidth="1.5" />
          </g>
          <g transform="translate(56, 12) scale(0.65)">
            <polygon points="50,20 58,38 78,38 62,50 68,68 50,57 32,68 38,50 22,38 42,38" fill={silverFill} stroke={silverStroke} strokeWidth="1.5" />
          </g>
        </svg>
      );

    default:
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="30" fill="#334155" />
        </svg>
      );
  }
}
