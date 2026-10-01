import React from 'react';

export const Mascot = ({ mood = 'happy', size = 110, speech = null, className = '' }) => {
  let imageSrc = '/characters/spark_idle.jpg';
  let glowColor = 'from-cyan-400/40 via-sky-300/30 to-amber-300/30';

  if (mood === 'celebrating' || mood === 'victory') {
    imageSrc = '/characters/spark_celebrate.jpg';
    glowColor = 'from-amber-400/50 via-yellow-300/40 to-cyan-300/30';
  } else if (mood === 'thinking' || mood === 'focus') {
    imageSrc = '/characters/spark_focus.jpg';
    glowColor = 'from-indigo-400/40 via-cyan-400/40 to-amber-200/30';
  }

  return (
    <div className={`flex items-center space-x-4 select-none ${className}`}>
      {/* Floating Luminous Neural Spark Entity (No Box / No Border) */}
      <div 
        style={{ width: size, height: size }}
        className="relative shrink-0 flex items-center justify-center animate-floatSpark group"
      >
        {/* Layered Pulsating Luminescence Halo */}
        <div 
          className={`absolute inset-0 bg-gradient-to-tr ${glowColor} rounded-full blur-2xl animate-pulseGlow pointer-events-none scale-125`} 
        />
        <div 
          className="absolute inset-2 bg-cyan-400/20 rounded-full blur-lg animate-ping opacity-25 pointer-events-none" 
          style={{ animationDuration: '4s' }}
        />

        {/* Ambient Orbiting Starlight Sparks */}
        <div className="absolute -top-1 right-2 w-2 h-2 rounded-full bg-amber-300 shadow-[0_0_8px_#fde047] animate-bounceShort pointer-events-none" />
        <div className="absolute bottom-2 -left-1 w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_6px_#67e8f9] animate-pulse pointer-events-none" />
        <div className="absolute top-1/2 -right-2 w-1.5 h-1.5 rounded-full bg-amber-200 shadow-[0_0_6px_#fef08a] animate-pulse pointer-events-none" />

        {/* Chispa Visual: Unboxed with Soft Radial Mask Blend & Pure Cutout */}
        <div 
          className="relative w-full h-full transition-transform duration-500 ease-out group-hover:scale-110"
          style={{
            maskImage: 'radial-gradient(circle at 50% 50%, black 60%, rgba(0,0,0,0.8) 75%, transparent 95%)',
            WebkitMaskImage: 'radial-gradient(circle at 50% 50%, black 60%, rgba(0,0,0,0.8) 75%, transparent 95%)',
          }}
        >
          <img
            src={imageSrc}
            alt="Chispa Mnemónica"
            className="w-full h-full object-contain filter drop-shadow-[0_4px_16px_rgba(56,189,248,0.2)] pointer-events-none mix-blend-multiply"
          />
        </div>
      </div>

      {/* Duolingo Style Tactile Speech Bubble */}
      {speech && (
        <div className="relative bg-white border-2 border-slate-100 px-4 py-2.5 rounded-2xl shadow-sm max-w-xs animate-pop">
          {/* Bubble Pointer */}
          <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-3.5 h-3.5 bg-white border-l-2 border-b-2 border-slate-100 rotate-45" />
          <p className="text-xs font-bold text-slate-700 leading-snug relative z-10">
            {speech}
          </p>
        </div>
      )}
    </div>
  );
};
