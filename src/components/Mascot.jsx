import React from 'react';

export const Mascot = ({ mood = 'happy', size = 80, speech = null, className = '' }) => {
  let imageSrc = '/characters/coach_idle.jpg';
  let badgeText = 'Entrenador';

  if (mood === 'celebrating' || mood === 'victory') {
    imageSrc = '/characters/coach_victory.jpg';
    badgeText = '¡Victoria!';
  } else if (mood === 'thinking' || mood === 'focus') {
    imageSrc = '/characters/coach_focus.jpg';
    badgeText = 'Enfoque';
  }

  return (
    <div className={`flex items-center space-x-3 select-none ${className}`}>
      {/* 3D Mental Athlete Coach */}
      <div 
        style={{ width: size, height: size }}
        className="relative shrink-0 rounded-2xl overflow-hidden shadow-md border-2 border-emerald-500/40 ring-2 ring-emerald-200 bg-white"
      >
        <img
          src={imageSrc}
          alt="Coach Mnemónico"
          className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-300"
        />
        <span className="absolute bottom-0 inset-x-0 bg-slate-900/80 text-[8px] font-black text-emerald-300 text-center uppercase tracking-wider py-0.5 backdrop-blur-xs">
          {badgeText}
        </span>
      </div>

      {/* Speech Bubble */}
      {speech && (
        <div className="relative bg-white border border-slate-200 px-3.5 py-2.5 rounded-2xl shadow-sm max-w-xs animate-pop">
          {/* Bubble Pointer */}
          <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 bg-white border-l border-b border-slate-200 rotate-45" />
          <p className="text-xs font-bold text-slate-700 leading-snug relative z-10">
            {speech}
          </p>
        </div>
      )}
    </div>
  );
};
