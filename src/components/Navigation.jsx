import React from 'react';
import { Home, Zap, BookOpen, Trophy, Sparkles } from 'lucide-react';

export const Navigation = ({ currentTab, setTab }) => {
  const tabs = [
    { id: 'dashboard', label: 'Inicio', icon: Home },
    { id: 'modalities', label: 'Modalidades', icon: Zap },
    { id: 'casillero', label: 'Casillero', icon: BookOpen },
    { id: 'records', label: 'Récords', icon: Trophy },
    { id: 'rules', label: 'Técnicas', icon: Sparkles },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-3 py-2 select-none shadow-sm">
      <div className="max-w-md mx-auto grid grid-cols-5 gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 rounded-2xl transition-all duration-150 ${
                isActive
                  ? 'text-emerald-600 font-black scale-105'
                  : 'text-slate-400 hover:text-slate-700 font-bold'
              }`}
            >
              <div className={`p-1 rounded-xl transition-all ${
                isActive ? 'bg-emerald-50 text-emerald-600' : ''
              }`}>
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
