import React from 'react';
import { Trophy, Zap, Flame, Award, Clock, Hash, BookOpen, ArrowUpRight, History } from 'lucide-react';

export const RecordsView = ({ profile }) => {
  const records = profile.records || {};
  const history = records.history || [];

  return (
    <div className="max-w-md mx-auto p-4 pb-28 select-none space-y-6 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-tr from-amber-500 to-orange-500 rounded-3xl p-5 text-white shadow-xl shadow-amber-500/15">
        <div className="flex items-center space-x-2 text-amber-100 mb-1">
          <Trophy className="w-5 h-5 text-amber-200 fill-amber-200" />
          <span className="text-xs font-black uppercase tracking-wider">Salón de Marcas</span>
        </div>
        <h2 className="text-xl font-black">Tus Récords Personales</h2>
        <p className="text-xs text-amber-50 mt-0.5">
          Cada sesión supera tus límites de concentración, volumen y velocidad.
        </p>
      </div>

      {/* Grid of Key Records */}
      <div className="grid grid-cols-2 gap-3">
        
        {/* Longest Word Chain */}
        <div className="card-light p-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Cadena Palabras</span>
            <BookOpen className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-slate-800">
            {records.longestWordChain || 0}
            <span className="text-xs font-normal text-slate-500 ml-1">palabras</span>
          </div>
          <p className="text-[10px] text-slate-400">Máximo número consecutivo</p>
        </div>

        {/* Fastest Word Speed */}
        <div className="card-light p-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Velocidad Palabras</span>
            <Clock className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-800">
            {records.fastestWordSpeed && records.fastestWordSpeed < 90 ? `${records.fastestWordSpeed}s` : "--"}
            <span className="text-xs font-normal text-slate-500 ml-1">/ ítem</span>
          </div>
          <p className="text-[10px] text-slate-400">Cadencia récord superada</p>
        </div>

        {/* Longest Number Chain */}
        <div className="card-light p-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Cadena Numérica</span>
            <Hash className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-800">
            {records.longestNumberChain || 0}
            <span className="text-xs font-normal text-slate-500 ml-1">números</span>
          </div>
          <p className="text-[10px] text-slate-400">Secuencia en memoria</p>
        </div>

        {/* Conquered Casillero */}
        <div className="card-light p-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Casillero Dominado</span>
            <Award className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-slate-800">
            {profile.numbers?.conqueredCount || 10}
            <span className="text-xs font-normal text-slate-500 ml-1">/ 100</span>
          </div>
          <p className="text-[10px] text-slate-400">Imágenes fijas automáticas</p>
        </div>

      </div>

      {/* Global Totals Summary */}
      <div className="bg-slate-100/80 rounded-2xl p-3.5 border border-slate-200 flex justify-around text-center text-xs">
        <div>
          <span className="text-[10px] text-slate-500 font-bold uppercase block">Racha Actual</span>
          <span className="font-black text-amber-600 flex items-center justify-center">
            <Flame className="w-3.5 h-3.5 fill-amber-500 mr-0.5" />
            {profile.streak} días
          </span>
        </div>
        <div className="w-px h-8 bg-slate-300" />
        <div>
          <span className="text-[10px] text-slate-500 font-bold uppercase block">Sesiones Totales</span>
          <span className="font-black text-slate-800">{records.totalSessionsCompleted || 0}</span>
        </div>
        <div className="w-px h-8 bg-slate-300" />
        <div>
          <span className="text-[10px] text-slate-500 font-bold uppercase block">XP Total</span>
          <span className="font-black text-indigo-600">{profile.xp || 0} XP</span>
        </div>
      </div>

      {/* Recent Sessions History */}
      <div className="space-y-3">
        <div className="flex items-center space-x-1.5 px-1">
          <History className="w-4 h-4 text-slate-500" />
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-600">
            Historial de Sesiones Recientes
          </h3>
        </div>

        {history.length === 0 ? (
          <div className="card-light p-6 text-center text-xs text-slate-400">
            Completa tu primera sesión para comenzar a registrar tu historial aquí.
          </div>
        ) : (
          <div className="space-y-2 max-h-[45vh] overflow-y-auto pr-1">
            {history.map((entry) => (
              <div
                key={entry.id}
                className="card-light p-3 flex items-center justify-between text-xs hover:border-slate-300 transition-colors"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-black text-slate-800 capitalize">
                      {entry.type === 'words' ? '📖 Palabras' : entry.type === 'numbers' ? '🔢 Números' : '🌪️ Mixto'}
                    </span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-bold uppercase">
                      {entry.style}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 mt-0.5 block">
                    {entry.count} ítems @ {entry.cadence}s • {entry.date}
                  </span>
                </div>

                <div className="text-right">
                  <span className={`font-black text-sm block ${
                    entry.accuracy >= 85 ? 'text-emerald-600' : entry.accuracy >= 60 ? 'text-amber-600' : 'text-rose-500'
                  }`}>
                    {entry.accuracy}%
                  </span>
                  <span className="text-[10px] font-bold text-indigo-600">+{entry.xp} XP</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
