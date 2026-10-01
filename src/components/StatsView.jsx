import React from 'react';
import { Flame, Zap, Award, Target, Trophy, CheckCircle2 } from 'lucide-react';

export const StatsView = ({ xp, streak, maxStreak = 1, completedCount = 0 }) => {
  const getRank = (currentXp) => {
    if (currentXp < 100) return { title: "Novato Mental", icon: "🌱", color: "text-emerald-400" };
    if (currentXp < 300) return { title: "Aprendiz de Enlaces", icon: "⚡", color: "text-teal-400" };
    if (currentXp < 600) return { title: "Arquitecto del Absurdo", icon: "🎨", color: "text-indigo-400" };
    if (currentXp < 1200) return { title: "Maestro del Casillero", icon: "🧠", color: "text-purple-400" };
    if (currentXp < 2500) return { title: "Campayo Beast", icon: "👑", color: "text-amber-400" };
    return { title: "Gran Maestro Mnemotécnico", icon: "🌌", color: "text-rose-400" };
  };

  const rank = getRank(xp);

  return (
    <div className="max-w-md mx-auto p-4 pb-28 select-none space-y-5">
      
      {/* Current Rank Banner */}
      <div className="bg-slate-800/90 border-2 border-slate-700/80 rounded-3xl p-6 text-center shadow-xl">
        <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-700 mx-auto flex items-center justify-center text-4xl mb-3 shadow-inner">
          {rank.icon}
        </div>
        <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Rango Actual</span>
        <h2 className={`text-xl font-black mt-0.5 ${rank.color}`}>{rank.title}</h2>
        <p className="text-xs text-slate-400 mt-1">Sigue entrenando retos para ascender de liga</p>
      </div>

      {/* Grid of Key Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500">
            <Flame className="w-6 h-6 fill-amber-500" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Racha Actual</span>
            <span className="text-lg font-black text-white">{streak} días</span>
          </div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Zap className="w-6 h-6 fill-indigo-400" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total XP</span>
            <span className="text-lg font-black text-white">{xp} XP</span>
          </div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Retos Superados</span>
            <span className="text-lg font-black text-white">{completedCount}</span>
          </div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Mejor Racha</span>
            <span className="text-lg font-black text-white">{Math.max(streak, maxStreak)} días</span>
          </div>
        </div>
      </div>

      {/* Motivational Advice */}
      <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 rounded-2xl p-4 text-center">
        <p className="text-xs font-bold text-emerald-300">
          🔥 "La constancia de 5 minutos diarios crea conexiones sinápticas 10 veces más fuertes que 1 hora a la semana."
        </p>
      </div>

    </div>
  );
};
