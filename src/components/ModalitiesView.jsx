import React, { useState } from 'react';
import { Zap, Mountain, Hash, Target, ChevronRight, Trophy, Flame } from 'lucide-react';
import { playSound } from '../utils/sound';
import { triggerHaptic } from '../utils/haptics';

export const ModalitiesView = ({ profile, onStartSession, soundEnabled }) => {
  const sprintLvl = profile.words?.cortaLevel || 1;
  const enduranceLvl = profile.words?.largaLevel || 1;
  const conqueredCount = profile.numbers?.conqueredCount || 0;

  // Sprint difficulty configurations
  const sprintTiers = [
    { level: 1, count: 6, cadence: 2.0, name: "Calentamiento Rápido" },
    { level: 2, count: 6, cadence: 1.5, name: "Aceleración Neuronal" },
    { level: 3, count: 7, cadence: 1.2, name: "Reflejo Instantáneo" },
    { level: 4, count: 8, cadence: 1.0, name: "Velocidad de Competición" },
    { level: 5, count: 8, cadence: 0.8, name: "Modo Ramón Campayo" },
    { level: 6, count: 10, cadence: 0.6, name: "Bestia del Reflejo" },
  ];

  // Endurance difficulty configurations
  const enduranceTiers = [
    { level: 1, count: 15, cadence: 3.0, name: "Primer Fondo (15 palabras)" },
    { level: 2, count: 25, cadence: 2.8, name: "Resistencia Media (25 palabras)" },
    { level: 3, count: 40, cadence: 2.5, name: "Gran Cadena (40 palabras)" },
    { level: 4, count: 60, cadence: 2.0, name: "Reto del Muro (60 palabras)" },
    { level: 5, count: 100, cadence: 1.8, name: "¡Centurión Épico (100 palabras)!" },
  ];

  const handleLaunchSprint = (tier) => {
    if (soundEnabled) playSound('pop');
    triggerHaptic('medium');
    onStartSession({
      model: 'words',
      type: 'words',
      style: 'corta',
      count: tier.count,
      cadence: tier.cadence,
      title: `Sprint Nivel ${tier.level}: ${tier.name}`,
      subtitle: `${tier.count} palabras a ${tier.cadence}s por ítem`,
      icon: "⚡"
    });
  };

  const handleLaunchEndurance = (tier) => {
    if (soundEnabled) playSound('pop');
    triggerHaptic('medium');
    onStartSession({
      model: 'words',
      type: 'words',
      style: 'larga',
      count: tier.count,
      cadence: tier.cadence,
      title: `Tirada Larga Nivel ${tier.level}: ${tier.name}`,
      subtitle: `${tier.count} palabras consecutivas`,
      icon: "🏔️"
    });
  };

  const handleLaunchCasilleroBlock = (start, end) => {
    if (soundEnabled) playSound('pop');
    triggerHaptic('medium');
    onStartSession({
      model: 'numbers',
      type: 'numbers',
      style: 'consolidacion',
      count: end - start + 1,
      cadence: 3.0,
      range: [start, end],
      title: `Casillero: Bloque ${start} al ${end}`,
      subtitle: `Afianza tus 10 imágenes fijas de este bloque`,
      icon: "🎯"
    });
  };

  return (
    <div className="max-w-md mx-auto p-4 pb-28 select-none space-y-6 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-3xl p-5 text-white shadow-xl shadow-indigo-500/15">
        <div className="flex items-center space-x-2 text-indigo-200 mb-1">
          <Zap className="w-5 h-5 text-amber-300" />
          <span className="text-xs font-black uppercase tracking-wider">Modalidades Específicas</span>
        </div>
        <h2 className="text-xl font-black">Elige tu Disciplina</h2>
        <p className="text-xs text-indigo-100 leading-relaxed mt-0.5">
          Cada modalidad tiene su propia escala de dificultad para que entrenes velocidad pura, fondo o casillero.
        </p>
      </div>

      {/* 1. SPRINT DE VELOCIDAD */}
      <div className="card-light p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200">
              <Zap className="w-5 h-5 fill-amber-500" />
            </div>
            <div>
              <h3 className="font-black text-sm text-slate-800">Sprint de Reflejos</h3>
              <p className="text-[11px] text-slate-500 font-bold">
                Tu Nivel Actual: <strong className="text-amber-600">Nivel {sprintLvl}</strong>
              </p>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Pocas palabras proyectadas a velocidades de vértigo para que tu mente dispare imágenes sin subvocalizar.
        </p>

        {/* Sprint Tiers List */}
        <div className="space-y-1.5 pt-1">
          {sprintTiers.map((tier) => {
            const isUnlocked = tier.level <= sprintLvl + 1;
            const isCurrent = tier.level === sprintLvl;
            return (
              <button
                key={tier.level}
                onClick={() => handleLaunchSprint(tier)}
                className={`w-full p-2.5 rounded-2xl border text-xs flex items-center justify-between transition-all ${
                  isCurrent
                    ? 'bg-amber-500 text-slate-900 border-amber-600 font-black shadow-sm'
                    : isUnlocked
                    ? 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 font-bold'
                    : 'bg-slate-50 text-slate-400 border-slate-200 opacity-60'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-black text-xs ${
                    isCurrent ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {tier.level}
                  </span>
                  <span>{tier.name}</span>
                </div>
                <span className="font-mono text-[11px] opacity-90">{tier.cadence}s / ítem</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. TIRADA LARGA DE RESISTENCIA */}
      <div className="card-light p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-200">
              <Mountain className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-sm text-slate-800">Tirada Larga de Resistencia</h3>
              <p className="text-[11px] text-slate-500 font-bold">
                Tu Nivel Actual: <strong className="text-indigo-600">Nivel {enduranceLvl}</strong>
              </p>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Cadenas largas de palabras para entrenar la capacidad de mantener el hilo sin romper ningún eslabón.
        </p>

        {/* Endurance Tiers List */}
        <div className="space-y-1.5 pt-1">
          {enduranceTiers.map((tier) => {
            const isUnlocked = tier.level <= enduranceLvl + 1;
            const isCurrent = tier.level === enduranceLvl;
            return (
              <button
                key={tier.level}
                onClick={() => handleLaunchEndurance(tier)}
                className={`w-full p-2.5 rounded-2xl border text-xs flex items-center justify-between transition-all ${
                  isCurrent
                    ? 'bg-indigo-600 text-white border-indigo-700 font-black shadow-sm'
                    : isUnlocked
                    ? 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 font-bold'
                    : 'bg-slate-50 text-slate-400 border-slate-200 opacity-60'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-black text-xs ${
                    isCurrent ? 'bg-indigo-700 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {tier.level}
                  </span>
                  <span>{tier.name}</span>
                </div>
                <span className="font-mono text-[11px] opacity-90">{tier.count} palabras</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. ASIMILACIÓN GRADUAL DEL CASILLERO (0-9, 10-19...) */}
      <div className="card-light p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-sm text-slate-800">Asimilación del Casillero</h3>
              <p className="text-[11px] text-slate-500 font-bold">
                Conquistados: <strong className="text-emerald-600">{conqueredCount} de 100 números</strong>
              </p>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Aprende y afianza tus imágenes fijas de 10 en 10, empezando por los dígitos base 0 al 9.
        </p>

        {/* Blocks Grid */}
        <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
          {[
            { start: 0, end: 9, label: "0 al 9 (Dígitos Base)" },
            { start: 10, end: 19, label: "10 al 19 (Toro a Topo)" },
            { start: 20, end: 29, label: "20 al 29 (Noria a Nube)" },
            { start: 30, end: 39, label: "30 al 39 (Muro a Mapa)" },
            { start: 40, end: 49, label: "40 al 49 (Carro a Copa)" },
            { start: 50, end: 59, label: "50 al 59 (Loro a Lupa)" },
            { start: 60, end: 69, label: "60 al 69 (Suero a Sapo)" },
            { start: 70, end: 79, label: "70 al 79 (Faro a FBI)" },
            { start: 80, end: 89, label: "80 al 89 (Churro a Chapa)" },
            { start: 90, end: 100, label: "90 al 100 (Puro a Torero)" },
          ].map((block, idx) => {
            const isCompleted = conqueredCount >= block.end;
            const isNext = conqueredCount >= block.start && conqueredCount < block.end;

            return (
              <button
                key={idx}
                onClick={() => handleLaunchCasilleroBlock(block.start, block.end)}
                className={`p-2.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                  isCompleted
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                    : isNext
                    ? 'bg-emerald-500 text-white border-emerald-600 font-black shadow-sm'
                    : 'bg-slate-50 text-slate-500 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-wider opacity-80">Bloque #{idx + 1}</span>
                  {isCompleted && <span className="text-emerald-600 text-xs">✓ Dominado</span>}
                  {isNext && <span className="text-amber-300 text-xs font-black animate-pulse">En curso</span>}
                </div>
                <span className="text-xs font-black mt-1">{block.label}</span>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};
