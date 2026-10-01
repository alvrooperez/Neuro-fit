import React from 'react';

export const Mascot = ({ mood = 'happy', size = 80, speech = null, className = '' }) => {
  let imageSrc = '/characters/spark_idle.jpg';
  let badgeText = 'Chispa';

  if (mood === 'celebrating' || mood === 'victory') {
    imageSrc = '/characters/spark_celebrate.jpg';
    badgeText = '¡Victoria!';
  } else if (mood === 'thinking' || mood === 'focus') {
    imageSrc = '/characters/spark_focus.jpg';
    badgeText = 'Enfoque';
  }

  return (
    <div className={`flex items-center space-x-3 select-none ${className}`}>
      {/* Bioluminescent Neural Spark Companion */}
      <div 
        style={{ width: size, height: size }}
        className="relative shrink-0 rounded-2xl overflow-hidden shadow-lg shadow-cyan-500/15 border-2 border-cyan-400/50 ring-2 ring-amber-300/40 bg-slate-900 group"
      >
        <img
          src={imageSrc}
          alt="Chispa Mnemónica"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <span className="absolute bottom-0 inset-x-0 bg-slate-950/75 text-[8px] font-black text-amber-300 text-center uppercase tracking-wider py-0.5 backdrop-blur-xs border-t border-cyan-500/20">
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
