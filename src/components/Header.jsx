import React from 'react';
import { Flame, Zap, Volume2, VolumeX } from 'lucide-react';

export const Header = ({ streak, xp, soundEnabled, setSoundEnabled }) => {
  // Calculate level based on XP (every 250 XP is a level)
  const level = Math.floor(xp / 250) + 1;
  const currentLevelXp = xp % 250;
  const progressPercent = Math.min(100, Math.round((currentLevelXp / 250) * 100));

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 select-none shadow-sm">
      <div className="max-w-md mx-auto flex items-center justify-between">
        
        {/* Streak Counter */}
        <div className="flex items-center space-x-1.5 bg-amber-50 hover:bg-amber-100/80 border border-amber-200/80 px-3 py-1.5 rounded-2xl shadow-sm transition-transform active:scale-95">
          <Flame className="w-5 h-5 text-amber-500 fill-amber-500 animate-pulse" />
          <span className="font-black text-amber-700 text-sm tracking-wide">{streak} días</span>
        </div>

        {/* XP & Level Badge */}
        <div className="flex items-center space-x-2 bg-indigo-50 border border-indigo-200/80 px-3 py-1.5 rounded-2xl shadow-sm">
          <div className="flex items-center space-x-1">
            <Zap className="w-4 h-4 text-indigo-600 fill-indigo-600" />
            <span className="font-black text-indigo-700 text-xs uppercase tracking-wider">Nv.{level}</span>
          </div>
          <div className="w-16 h-2 bg-indigo-200/60 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-600 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-[11px] font-bold text-indigo-600">{xp}xp</span>
        </div>

        {/* Sound Toggle */}
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 active:scale-90 transition-all"
          title={soundEnabled ? "Silenciar" : "Activar sonido"}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
        </button>

      </div>
    </header>
  );
};
