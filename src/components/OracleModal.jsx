import React, { useState } from 'react';
import { Sparkles, RefreshCw, X, Lightbulb } from 'lucide-react';
import { ABSURD_ACTIONS } from '../data/words';
import { playSound } from '../utils/sound';

export const OracleModal = ({ isOpen, onClose, itemA, itemB, soundEnabled }) => {
  if (!isOpen) return null;

  const generateIdea = () => {
    const action = ABSURD_ACTIONS[Math.floor(Math.random() * ABSURD_ACTIONS.length)];
    const word1 = itemA?.word || "Objeto 1";
    const word2 = itemB?.word || "Objeto 2";
    return `Imagina un ${word1} gigante que ${action} un ${word2} fluorescente que no para de gritar. Siente el ruido, la desmesura y el impacto visual.`;
  };

  const [idea, setIdea] = useState(generateIdea());

  const handleReroll = () => {
    if (soundEnabled) playSound('pop');
    setIdea(generateIdea());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border-2 border-indigo-500/40 rounded-3xl p-6 w-full max-w-sm shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-full hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2.5 mb-4 text-indigo-400">
          <div className="p-2 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
            <Lightbulb className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="font-black text-white text-base">Oráculo del Absurdo</h3>
            <p className="text-xs text-indigo-300/80">Inspiración mnemotécnica instantánea</p>
          </div>
        </div>

        {/* Association Display */}
        <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/80 my-3 text-center">
          <div className="flex items-center justify-center space-x-4 mb-3">
            <span className="text-3xl">{itemA?.emoji || "📦"}</span>
            <span className="text-indigo-400 font-black text-sm">⚡</span>
            <span className="text-3xl">{itemB?.emoji || "📦"}</span>
          </div>
          <p className="text-sm font-bold text-slate-200 leading-relaxed italic">
            "{idea}"
          </p>
        </div>

        <p className="text-[11px] text-slate-400 text-center mb-5 px-1">
          💡 <strong>Regla de oro:</strong> Cuanto más ridícula, activa y exagerada sea la imagen en tu mente, más imposible será olvidarla.
        </p>

        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={handleReroll}
            className="btn-duo btn-duo-slate py-2.5 px-3 rounded-2xl flex items-center justify-center space-x-1.5 text-xs font-black text-indigo-300"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Otra idea</span>
          </button>

          <button
            onClick={onClose}
            className="btn-duo btn-duo-indigo py-2.5 px-3 rounded-2xl flex items-center justify-center space-x-1.5 text-xs font-black"
          >
            <Sparkles className="w-4 h-4" />
            <span>¡Lo tengo!</span>
          </button>
        </div>
      </div>
    </div>
  );
};
