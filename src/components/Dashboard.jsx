import React from 'react';
import { generateSmartSession } from '../utils/profileManager';
import { Play, Zap, Flame, Trophy, Sliders, ChevronRight, Hash, BookOpen, Target, Sparkles } from 'lucide-react';
import { Mascot } from './Mascot';
import { playSound } from '../utils/sound';
import { triggerHaptic } from '../utils/haptics';

export const Dashboard = ({ profile, onStartSession, onOpenCustomGym, onOpenModalities, soundEnabled }) => {
  const recommended = generateSmartSession(profile);

  const handleLaunch = (sessionConfig) => {
    if (soundEnabled) playSound('pop');
    triggerHaptic('medium');
    onStartSession(sessionConfig);
  };

  const wordsLevel = profile.words?.level || 1;
  const wordsNormal = profile.words?.normal || { itemsCount: 5, cadence: 3.5, masteryChecks: 0 };
  const numbersConquered = profile.numbers?.conqueredCount || 0;
  const numbersRange = profile.numbers?.conqueredRange || 9;
  const numbersNormal = profile.numbers?.normal || { itemsCount: 5, cadence: 3.5, masteryChecks: 0 };
  const hybridLevel = profile.hybrid?.level || 1;
  const hybridNormal = profile.hybrid?.normal || { itemsCount: 6, cadence: 3.5, masteryChecks: 0 };

  const numbersPercent = Math.min(100, Math.round((numbersConquered / 100) * 100));

  return (
    <div className="max-w-md mx-auto p-4 pb-28 select-none space-y-5 animate-in fade-in duration-200">
      
      {/* 1. Athletic Training Status Header with 3D Coach */}
      <div className="card-light p-4 flex items-center justify-between shadow-sm">
        <Mascot
          mood="happy"
          size={58}
          speech={
            numbersConquered === 0
              ? "¡Empezamos desde cero! Dominemos primero los dígitos base 0 al 9."
              : `¡Racha de ${profile.streak || 1} días! Tu mente está lista para memorizar hoy.`
          }
        />
        <div className="text-right shrink-0 ml-2">
          <span className="text-xs font-black text-indigo-600 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-xl">
            {profile.xp || 0} XP
          </span>
        </div>
      </div>

      {/* 2. Primary Recommended Session Card */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-6 text-white shadow-xl shadow-emerald-500/15 relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="bg-white/20 text-white text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full">
            {recommended.badge} • Recomendado
          </span>
          <span className="text-xs font-black text-amber-300 flex items-center">
            <Zap className="w-3.5 h-3.5 fill-amber-300 mr-1" />
            Adaptativo
          </span>
        </div>

        <div className="flex items-center space-x-3 my-3">
          <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white/40 shadow-md shrink-0 bg-white/10 backdrop-blur-xs">
            <img
              src={
                recommended.model === 'numbers'
                  ? '/badges/badge_numbers.jpg'
                  : recommended.model === 'hybrid'
                  ? '/badges/badge_hybrid.jpg'
                  : '/badges/badge_words.jpg'
              }
              alt="Insignia Sesión"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight">{recommended.title}</h2>
            <p className="text-xs text-emerald-50 mt-0.5">{recommended.subtitle}</p>
          </div>
        </div>

        {/* Specs Pill */}
        <div className="bg-emerald-900/30 border border-white/20 rounded-2xl p-2.5 flex justify-around text-center text-xs font-bold my-4">
          <div>
            <span className="text-[10px] text-emerald-200 uppercase block">Volumen</span>
            <span className="font-black text-white">{recommended.count} ítems</span>
          </div>
          <div className="w-px h-6 bg-white/20" />
          <div>
            <span className="text-[10px] text-emerald-200 uppercase block">Velocidad</span>
            <span className="font-black text-amber-300">{recommended.cadence}s / ítem</span>
          </div>
          {recommended.masteryChecks !== undefined && (
            <>
              <div className="w-px h-6 bg-white/20" />
              <div>
                <span className="text-[10px] text-emerald-200 uppercase block">Checks</span>
                <span className="font-black text-white">{recommended.masteryChecks}/3</span>
              </div>
            </>
          )}
        </div>

        {/* Giant 3D Play Button */}
        <button
          onClick={() => handleLaunch(recommended)}
          className="w-full btn-duo btn-duo-amber py-4 rounded-2xl flex items-center justify-center space-x-2 text-base font-black text-slate-900 shadow-lg"
        >
          <Play className="w-5 h-5 fill-slate-900" />
          <span>¡Continuar Entrenamiento!</span>
        </button>
      </div>

      {/* 3. The 3 Pillars Status Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">
            Tus 3 Pilares Mnemotécnicos
          </h3>
          <button
            onClick={onOpenModalities}
            className="text-xs font-black text-emerald-600 hover:text-emerald-700 flex items-center space-x-1"
          >
            <span>Ver Modalidades</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* PILAR 1: PALABRAS */}
        <div className="card-light p-4 flex items-center justify-between hover:border-slate-300 transition-colors">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl overflow-hidden border border-amber-300 shadow-sm shrink-0">
              <img src="/badges/badge_words.jpg" alt="Pilar Palabras" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="font-black text-sm text-slate-800">Pilar Palabras</h4>
                <span className="text-[10px] font-black text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded-md border border-indigo-200">
                  Nv. {wordsLevel}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-bold mt-0.5">
                {wordsNormal.itemsCount} palabras @ {wordsNormal.cadence}s • ({wordsNormal.masteryChecks || 0}/3 checks)
              </p>
            </div>
          </div>
          <button
            onClick={() => handleLaunch({
              model: 'words',
              type: 'words',
              style: 'normal',
              count: wordsNormal.itemsCount,
              cadence: wordsNormal.cadence,
              title: `Palabras: Normal (Nivel ${wordsLevel})`,
              subtitle: 'Adaptativa: sube o baja según tus aciertos',
              icon: '🧠'
            })}
            className="btn-duo btn-duo-slate py-2 px-3 rounded-xl text-xs font-black text-indigo-700"
          >
            Entrenar
          </button>
        </div>

        {/* PILAR 2: NÚMEROS Y CASILLERO */}
        <div className="card-light p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl overflow-hidden border border-amber-300 shadow-sm shrink-0">
                <img src="/badges/badge_numbers.jpg" alt="Pilar Números" className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-black text-sm text-slate-800">Pilar Números & Casillero</h4>
                <p className="text-[11px] text-slate-500 font-bold mt-0.5">
                  {numbersConquered} de 100 números conquistados ({profile.numbers?.masteryChecks || 0}/3 checks)
                </p>
              </div>
            </div>
            <button
              onClick={() => handleLaunch({
                model: 'numbers',
                type: 'numbers',
                style: 'consolidacion',
                count: 10,
                cadence: 3.0,
                range: [Math.max(0, numbersRange - 9), numbersRange],
                title: `Consolidación Casillero (${Math.max(0, numbersRange - 9)} al ${numbersRange})`,
                subtitle: 'Asimilación de imágenes fijas número ➔ palabra',
                icon: '🎯'
              })}
              className="btn-duo btn-duo-amber py-2 px-3 rounded-xl text-xs font-black text-slate-900"
            >
              Asimilar
            </button>
          </div>

          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.max(5, numbersPercent)}%` }}
            />
          </div>
        </div>

        {/* PILAR 3: EL RETO HÍBRIDO */}
        <div className="card-light p-4 flex items-center justify-between hover:border-slate-300 transition-colors">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl overflow-hidden border border-cyan-300 shadow-sm shrink-0">
              <img src="/badges/badge_hybrid.jpg" alt="El Duelo Híbrido" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="font-black text-sm text-slate-800">El Duelo Híbrido</h4>
                <span className="text-[10px] font-black text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded-md border border-purple-200">
                  Nv. {hybridLevel}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-bold mt-0.5">
                {hybridNormal.itemsCount} elementos @ {hybridNormal.cadence}s • ({hybridNormal.masteryChecks || 0}/3 checks)
              </p>
            </div>
          </div>
          <button
            onClick={() => handleLaunch({
              model: 'hybrid',
              type: 'hybrid',
              style: 'normal',
              count: hybridNormal.itemsCount,
              cadence: hybridNormal.cadence,
              range: [0, numbersRange],
              title: `Híbrido: Palabras + Números (Nivel ${hybridLevel})`,
              subtitle: 'Intercala palabras y números como en competición',
              icon: '🌪️'
            })}
            className="btn-duo btn-duo-slate py-2 px-3 rounded-xl text-xs font-black text-purple-700"
          >
            Entrenar
          </button>
        </div>

      </div>

      {/* Bottom Gym Shortcut */}
      <div className="text-center pt-2">
        <button
          onClick={onOpenCustomGym}
          className="inline-flex items-center space-x-2 text-xs font-bold text-slate-500 hover:text-slate-800 py-2.5 px-4 rounded-2xl bg-slate-200/60 hover:bg-slate-200 transition-colors"
        >
          <Sliders className="w-4 h-4" />
          <span>Configurar sesión libre en el Gimnasio</span>
        </button>
      </div>

    </div>
  );
};
