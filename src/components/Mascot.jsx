import React from 'react';

export const Mascot = ({ mood = 'happy', size = 80, speech = null, className = '' }) => {
  return (
    <div className={`flex items-center space-x-3 select-none ${className}`}>
      {/* Brain Mascot SVG */}
      <div 
        style={{ width: size, height: size }}
        className="relative shrink-0 animate-bounceShort drop-shadow-md"
      >
        <svg viewBox="0 0 120 120" width="100%" height="100%">
          <defs>
            <linearGradient id="brainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#10b981" />
              <stop offset="100%" stop-color="#059669" />
            </linearGradient>
            <linearGradient id="cheekGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#fb7185" />
              <stop offset="100%" stop-color="#f43f5e" />
            </linearGradient>
            <linearGradient id="zapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#fbbf24" />
              <stop offset="100%" stop-color="#f59e0b" />
            </linearGradient>
          </defs>

          {/* Brain Base */}
          <path
            d="M 38 24 C 20 24 12 40 12 55 C 12 72 24 88 40 92 C 45 94 50 94 60 94 C 70 94 75 94 80 92 C 96 88 108 72 108 55 C 108 40 100 24 82 24 C 74 24 67 29 60 36 C 53 29 46 24 38 24 Z"
            fill="url(#brainGrad)"
            stroke="#047857"
            strokeWidth="4"
          />

          {/* Brain Sulci */}
          <path
            d="M 28 42 C 34 38 42 46 36 54 C 32 60 26 56 22 64 M 92 42 C 86 38 78 46 84 54 C 88 60 94 56 98 64 M 45 32 C 50 38 52 48 48 56 M 75 32 C 70 38 68 48 72 56"
            fill="none"
            stroke="#065f46"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Cheeks */}
          <ellipse cx="32" cy="72" rx="6" ry="3.5" fill="url(#cheekGrad)" opacity="0.6" />
          <ellipse cx="88" cy="72" rx="6" ry="3.5" fill="url(#cheekGrad)" opacity="0.6" />

          {/* Eyes */}
          {mood === 'happy' && (
            <>
              <ellipse cx="42" cy="62" rx="7" ry="8" fill="#0f172a" />
              <ellipse cx="78" cy="62" rx="7" ry="8" fill="#0f172a" />
              <circle cx="44" cy="59" r="2.5" fill="#ffffff" />
              <circle cx="80" cy="59" r="2.5" fill="#ffffff" />
            </>
          )}

          {mood === 'thinking' && (
            <>
              <ellipse cx="42" cy="58" rx="6" ry="7" fill="#0f172a" />
              <ellipse cx="78" cy="58" rx="6" ry="7" fill="#0f172a" />
              <circle cx="44" cy="55" r="2" fill="#ffffff" />
              <circle cx="80" cy="55" r="2" fill="#ffffff" />
              <path d="M 35 48 Q 42 44 48 48" fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
            </>
          )}

          {mood === 'celebrating' && (
            <>
              <path d="M 36 64 Q 42 56 48 64" fill="none" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
              <path d="M 72 64 Q 78 56 84 64" fill="none" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
              <polygon points="60,10 50,30 70,30" fill="url(#zapGrad)" stroke="#b45309" strokeWidth="2.5" />
            </>
          )}

          {/* Mouth */}
          {mood === 'happy' || mood === 'celebrating' ? (
            <path
              d="M 50 72 Q 60 84 70 72"
              fill="#0f172a"
              stroke="#0f172a"
              strokeWidth="2"
              strokeLinecap="round"
            />
          ) : (
            <path
              d="M 52 74 Q 60 77 68 74"
              fill="none"
              stroke="#0f172a"
              strokeWidth="3"
              strokeLinecap="round"
            />
          )}

          {/* Spark of intellect */}
          <polygon points="60,20 62,25 67,26 63,29 64,34 60,31 56,34 57,29 53,26 58,25" fill="url(#zapGrad)" />
        </svg>
      </div>

      {/* Speech Bubble (Light Theme) */}
      {speech && (
        <div className="relative bg-white border-2 border-slate-200 rounded-2xl px-3.5 py-2 text-xs font-bold text-slate-800 shadow-sm">
          <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-r-[8px] border-r-white border-b-[6px] border-b-transparent" />
          <p className="leading-snug">{speech}</p>
        </div>
      )}
    </div>
  );
};
