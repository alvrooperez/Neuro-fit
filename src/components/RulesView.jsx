import React, { useState } from 'react';
import { MNEMONIC_PILLARS } from '../data/words';
import { ABSTRACT_ANCHORS } from '../data/lessons';
import { Mascot } from './Mascot';
import { Sparkles, Lightbulb, Search } from 'lucide-react';

export const RulesView = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const anchorKeys = Object.keys(ABSTRACT_ANCHORS).filter(k => 
    k.toLowerCase().includes(searchTerm.toLowerCase()) || 
    ABSTRACT_ANCHORS[k].toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-md mx-auto p-4 pb-28 select-none space-y-5 animate-in fade-in duration-200">
      
      {/* Hero Banner with Mascot (Light Theme) */}
      <div className="bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-3xl p-5 shadow-xl shadow-indigo-500/15 text-white">
        <Mascot mood="thinking" size={55} className="mb-2" />
        <div className="flex items-center space-x-2 text-indigo-100 mb-1">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span className="text-xs font-black uppercase tracking-wider">Técnicas de los Campeones</span>
        </div>
        <h2 className="text-xl font-black">Las 4 Leyes del Absurdo</h2>
        <p className="text-xs text-indigo-50 leading-relaxed mt-1">
          El cerebro humano olvida lo ordinario y graba a fuego lo inverosímil, activo y desproporcionado.
        </p>
      </div>

      {/* 4 Pillars List */}
      <div className="space-y-3">
        {MNEMONIC_PILLARS.map((pillar, i) => (
          <div
            key={i}
            className="card-light p-3.5 flex items-start space-x-3.5 hover:border-slate-300 transition-colors"
          >
            <span className="text-2xl p-2 bg-slate-50 rounded-2xl border border-slate-200">
              {pillar.icon}
            </span>
            <div>
              <h3 className="font-black text-slate-800 text-xs mb-0.5">{pillar.title}</h3>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {pillar.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Abstract to Concrete Materializer Guide */}
      <div className="card-light p-5 space-y-3 border-emerald-200">
        <div className="flex items-center space-x-2 text-emerald-600">
          <Lightbulb className="w-5 h-5 text-amber-500" />
          <h3 className="font-black text-sm text-slate-900">¿Cómo memorizar palabras abstractas?</h3>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          Palabras como <em>"Libertad", "Peligro" o "Tiempo"</em> no tienen cuerpo físico. El secreto de los campeones es <strong>materializarlas en un objeto tangible</strong>:
        </p>

        {/* Filter Input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar concepto (ej. Libertad, Tiempo)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-emerald-500"
          />
        </div>

        {/* List of anchors */}
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {anchorKeys.map(k => (
            <div key={k} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <span className="font-black text-amber-700 uppercase tracking-wide block">{k}:</span>
              <span className="text-slate-600 text-[11px] italic">"{ABSTRACT_ANCHORS[k]}"</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
