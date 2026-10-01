import React from 'react';

/**
 * Clean, vibrant 3D icons designed according to the official Duolingo Design System
 * (bold rounded geometry, tactile 3D drop shadows, cheerful saturated colors).
 */

export const DuoWordsIcon = ({ className = "w-12 h-12" }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Base 3D Shadow */}
    <rect x="6" y="16" width="52" height="42" rx="14" fill="#46a302" />
    {/* Book Main Cover (Duolingo Green) */}
    <rect x="6" y="12" width="52" height="42" rx="14" fill="#58cc02" />
    
    {/* Open Book Pages (Cream 3D) */}
    <rect x="12" y="16" width="40" height="30" rx="8" fill="#e5e5e5" />
    <rect x="12" y="14" width="40" height="30" rx="8" fill="#ffffff" />
    
    {/* Spine divider */}
    <path d="M32 14V44" stroke="#d4d4d4" strokeWidth="2.5" strokeLinecap="round" />
    
    {/* Playful 3D Letter 'A' on Left Page */}
    <g transform="translate(18, 20)">
      <path d="M5 16L9 4L13 16" stroke="#46a302" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.5 12H11.5" stroke="#46a302" strokeWidth="3" strokeLinecap="round" />
      <path d="M5 15L9 3L13 15" stroke="#58cc02" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.5 11H11.5" stroke="#58cc02" strokeWidth="3" strokeLinecap="round" />
    </g>

    {/* Playful Floating Starlight Star */}
    <g transform="translate(37, 20)">
      <circle cx="8" cy="8" r="6" fill="#ffc800" />
      <circle cx="6" cy="6" r="2" fill="#ffffff" />
    </g>
    
    {/* Highlight shine */}
    <path d="M12 18C12 14.6863 14.6863 12 18 12H46" stroke="#79d724" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
  </svg>
);

export const DuoNumbersIcon = ({ className = "w-12 h-12" }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Base 3D Shadow (Duolingo Amber) */}
    <rect x="6" y="16" width="52" height="42" rx="14" fill="#e5a500" />
    {/* Block Main Body */}
    <rect x="6" y="12" width="52" height="42" rx="14" fill="#ffc800" />

    {/* 3D Number '1' Tile */}
    <rect x="12" y="18" width="16" height="26" rx="6" fill="#d97706" />
    <rect x="12" y="16" width="16" height="26" rx="6" fill="#ffffff" />
    <text x="20" y="34" fill="#ff9600" fontSize="16" fontWeight="900" textAnchor="middle" fontFamily="system-ui, sans-serif">1</text>

    {/* 3D Number '2' Tile */}
    <rect x="34" y="22" width="18" height="26" rx="6" fill="#0284c7" />
    <rect x="34" y="20" width="18" height="26" rx="6" fill="#1cb0f6" />
    <text x="43" y="38" fill="#ffffff" fontSize="16" fontWeight="900" textAnchor="middle" fontFamily="system-ui, sans-serif">2</text>

    {/* Shiny Sparkle on Top Corner */}
    <path d="M48 10L49.5 13.5L53 15L49.5 16.5L48 20L46.5 16.5L43 15L46.5 13.5L48 10Z" fill="#ffffff" />
  </svg>
);

export const DuoHybridIcon = ({ className = "w-12 h-12" }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Base 3D Shadow (Duolingo Violet) */}
    <rect x="6" y="16" width="52" height="42" rx="14" fill="#a559d9" />
    {/* Block Main Body */}
    <rect x="6" y="12" width="52" height="42" rx="14" fill="#ce82ff" />

    {/* Central 3D Lightning Energy Bolt */}
    {/* Shadow of Lightning */}
    <path
      d="M34 16L18 36H30L26 50L46 28H32L34 16Z"
      fill="#d97706"
    />
    {/* Main Lightning Bolt in Glowing Gold */}
    <path
      d="M34 14L18 34H30L26 48L46 26H32L34 14Z"
      fill="#ffc800"
    />
    {/* Inner Lightning Highlight */}
    <path
      d="M32 17L22 33H31L28 43L41 28H31L32 17Z"
      fill="#ffea79"
      opacity="0.8"
    />

    {/* Magic Energy Orbs */}
    <circle cx="15" cy="22" r="3.5" fill="#1cb0f6" />
    <circle cx="49" cy="40" r="4" fill="#58cc02" />
  </svg>
);

export const DuoGymIcon = ({ className = "w-12 h-12" }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* 3D Base Shadow */}
    <rect x="6" y="16" width="52" height="42" rx="14" fill="#1899d6" />
    {/* Main Body */}
    <rect x="6" y="12" width="52" height="42" rx="14" fill="#1cb0f6" />

    {/* Dumbbell / Brain Weight in 3D */}
    <rect x="18" y="28" width="28" height="6" rx="3" fill="#ffffff" />
    <rect x="14" y="23" width="8" height="16" rx="4" fill="#ff4b4b" />
    <rect x="42" y="23" width="8" height="16" rx="4" fill="#ff4b4b" />
    <circle cx="18" cy="31" r="2" fill="#ffffff" />
    <circle cx="46" cy="31" r="2" fill="#ffffff" />

    {/* Spark of energy */}
    <path d="M32 18L33.5 21.5L37 23L33.5 24.5L32 28L30.5 24.5L27 23L30.5 21.5L32 18Z" fill="#ffc800" />
  </svg>
);
