import React, { useState } from 'react';
import { CHALLENGE_MODES } from '../data/challenges';
import { Play, Sparkles, ChevronRight, Zap, Clock, Target } from 'lucide-react';
import { playSound } from '../utils/sound';
import { triggerHaptic } from '../utils/haptics';

export const ChallengeSelect = ({ onStartChallenge, soundEnabled }) => {
  const [selectedChallenge, setSelectedChallenge] = useState(CHALLENGE_MODES[0]);
  const [selectedDifficulty, setSelectedDifficulty] = useState(CHALLENGE_MODES[0].difficulties[0]);

  const handleSelectMode = (mode) => {
    if (soundEnabled) playSound('click');
    triggerHaptic('light');
    setSelectedChallenge(mode);
    setSelectedDifficulty(mode.difficulties[0]);
  };

  const handleSelectDiff = (diff) => {
    if (soundEnabled) playSound('click');
    triggerHaptic('light');
    setSelectedDifficulty(diff);
  };

  const handleStart = () => {
    if (soundEnabled) playSound('pop');
    triggerHaptic('medium');
    onStartChallenge(selectedChallenge.id, selectedDifficulty);
  };

  return (
    <div className="max-w-md mx-auto p-4 pb-28 select-none space-y-5 animate-in fade-in duration-200">
      
      {/* Intro Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-5 text-white shadow-xl border border-emerald-400/30">
        <div className="flex items-center space-x-2 mb-1.5">
          <Sparkles className="w-5 h-5 text-amber-300" />
          <span className="text-xs font-black uppercase tracking-wider text-emerald-100">Gimnasio de Asociaciones</span>
        </div>
        <h1 className="text-xl font-black">Elige tu Reto Mental</h1>
        <p className="text-xs text-emerald-100/90 mt-1">
          Forja conexiones imposibles a máxima velocidad y convierte tu cerebro en una máquina.
        </p>
      </div>

      {/* Challenge Modes Cards */}
      <div className="space-y-3">
        <span className="text-xs font-black text-slate-400 uppercase tracking-wider block px-1">
          Modalidades de Entrenamiento
        </span>

        {CHALLENGE_MODES.map((mode) => {
          const isSelected = selectedChallenge.id === mode.id;
          return (
            <div
              key={mode.id}
              onClick={() => handleSelectMode(mode)}
              className={`rounded-3xl p-4 border-2 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-slate-800 border-emerald-500 shadow-lg shadow-emerald-500/10 scale-[1.01]'
                  : 'bg-slate-800/60 border-slate-700/70 hover:border-slate-600 opacity-80 hover:opacity-100'
              }`}
            >
              <div className="flex items-center space-x-3.5">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 bg-gradient-to-tr ${mode.bgGradient} shadow-md`}>
                  {mode.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-white text-base truncate">{mode.title}</h3>
                    {isSelected && (
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    )}
                  </div>
                  <p className="text-xs text-slate-300 font-medium truncate mt-0.5">{mode.subtitle}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Mode Configuration Drawer */}
      <div className="bg-slate-800/90 border-2 border-slate-700 rounded-3xl p-5 shadow-2xl space-y-4">
        
        <div>
          <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block mb-1">
            Nivel de Dificultad
          </span>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {selectedChallenge.difficulties.map((diff) => {
              const isDiffSelected = selectedDifficulty.id === diff.id;
              return (
                <button
                  key={diff.id}
                  onClick={() => handleSelectDiff(diff)}
                  className={`btn-duo py-2.5 px-3 rounded-2xl text-xs font-black transition-all ${
                    isDiffSelected
                      ? 'btn-duo-green'
                      : 'btn-duo-slate text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{diff.name}</span>
                    <span className="text-[10px] text-amber-300">+{diff.xp}xp</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Difficulty Spec Details */}
        <div className="bg-slate-900/80 rounded-2xl p-3.5 border border-slate-700/60 flex items-center justify-around text-center text-xs font-bold text-slate-300">
          <div className="flex flex-col items-center">
            <Target className="w-4 h-4 text-emerald-400 mb-1" />
            <span className="text-[11px] text-slate-400">Elementos</span>
            <span className="font-black text-white">
              {selectedDifficulty.pairs ? `${selectedDifficulty.pairs} parejas` : `${selectedDifficulty.count || 5} ítems`}
            </span>
          </div>

          <div className="w-px h-8 bg-slate-700" />

          <div className="flex flex-col items-center">
            <Clock className="w-4 h-4 text-amber-400 mb-1" />
            <span className="text-[11px] text-slate-400">Velocidad</span>
            <span className="font-black text-white">
              {selectedDifficulty.timePerPair || selectedDifficulty.timePerItem || 5}s / ítem
            </span>
          </div>

          <div className="w-px h-8 bg-slate-700" />

          <div className="flex flex-col items-center">
            <Zap className="w-4 h-4 text-indigo-400 mb-1" />
            <span className="text-[11px] text-slate-400">Recompensa</span>
            <span className="font-black text-indigo-300">+{selectedDifficulty.xp} XP</span>
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={handleStart}
          className="w-full btn-duo btn-duo-green py-4 rounded-2xl flex items-center justify-center space-x-2 text-base font-black text-white shadow-lg"
        >
          <Play className="w-5 h-5 fill-white" />
          <span>¡Empezar Entrenamiento!</span>
        </button>

      </div>

    </div>
  );
};
