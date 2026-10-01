import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { ArrowLeft, Play, RotateCcw, CheckCircle2, XCircle, Trophy, Zap, Clock, Hash, BookOpen } from 'lucide-react';
import { MASSIVE_WORD_LIST } from '../data/words';
import { CASILLERO_100 } from '../data/casillero';
import { playSound } from '../utils/sound';
import { triggerHaptic } from '../utils/haptics';

export const SpeedMarathonTrainer = ({ onBack, onComplete, soundEnabled }) => {
  // Config
  const [stimulusType, setStimulusType] = useState('words'); // 'words' | 'numbers' | 'digits'
  const [itemCount, setItemCount] = useState(25); // 10, 25, 50, 100, 200
  const [cadence, setCadence] = useState(1.5); // seconds per item (0.6, 1.0, 1.5, 2.0, 3.0)
  
  // Game states: 'setup' | 'flashing' | 'recall' | 'results'
  const [phase, setPhase] = useState('setup');
  const [sequence, setSequence] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isItemVisible, setIsItemVisible] = useState(true);

  // Recall inputs
  const [userAnswers, setUserAnswers] = useState([]);
  const [currentRecallIdx, setCurrentRecallIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [resultsList, setResultsList] = useState([]);

  const flashTimerRef = useRef(null);
  const blinkTimerRef = useRef(null);

  // Start the Flash Sequence
  const handleStartFlashing = () => {
    if (soundEnabled) playSound('pop');
    triggerHaptic('medium');

    let generated = [];
    if (stimulusType === 'words') {
      const shuffled = [...MASSIVE_WORD_LIST].sort(() => 0.5 - Math.random());
      generated = shuffled.slice(0, itemCount).map(item => item.word);
    } else if (stimulusType === 'numbers') {
      // 2-digit numbers (1 to 100)
      for (let i = 0; i < itemCount; i++) {
        generated.push(Math.floor(Math.random() * 100) + 1);
      }
    } else {
      // Single digits 0-9
      for (let i = 0; i < itemCount; i++) {
        generated.push(Math.floor(Math.random() * 10));
      }
    }

    setSequence(generated);
    setUserAnswers(Array(generated.length).fill(''));
    setCurrentIndex(0);
    setIsItemVisible(true);
    setPhase('flashing');
  };

  // Flash Sequence Timer Loop
  useEffect(() => {
    if (phase !== 'flashing' || sequence.length === 0) return;

    if (soundEnabled) playSound('tick');

    const duration = cadence * 1000;
    const blankTime = Math.min(150, duration * 0.15); // brief blink to separate identical items

    flashTimerRef.current = setTimeout(() => {
      // Trigger brief blink
      setIsItemVisible(false);

      blinkTimerRef.current = setTimeout(() => {
        if (currentIndex < sequence.length - 1) {
          setCurrentIndex((prev) => prev + 1);
          setIsItemVisible(true);
        } else {
          // Finished all items -> Go to Recall Phase!
          if (soundEnabled) playSound('fanfare');
          triggerHaptic('levelUp');
          setPhase('recall');
          setCurrentRecallIdx(0);
        }
      }, blankTime);

    }, duration - blankTime);

    return () => {
      clearTimeout(flashTimerRef.current);
      clearTimeout(blinkTimerRef.current);
    };
  }, [phase, currentIndex, sequence.length, cadence]);

  // Handle Recall Input
  const handleInputChange = (idx, value) => {
    const updated = [...userAnswers];
    updated[idx] = value;
    setUserAnswers(updated);
  };

  const handleInputKeyDown = (e, idx) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (idx < sequence.length - 1) {
        setCurrentRecallIdx(idx + 1);
      } else {
        checkAllResults();
      }
    }
  };

  const normalize = (t) => {
    return t ? t.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim() : "";
  };

  const checkAllResults = () => {
    let correct = 0;
    const breakdown = sequence.map((original, idx) => {
      const user = userAnswers[idx] || "";
      const isMatch = normalize(original) === normalize(user);
      if (isMatch) correct++;
      return {
        index: idx + 1,
        original: original.toString(),
        user: user.trim(),
        isMatch
      };
    });

    const xpEarned = Math.round(correct * (stimulusType === 'words' ? 10 : 8) * (2 / cadence));
    setScore(correct);
    setResultsList(breakdown);
    setPhase('results');

    if (soundEnabled) playSound('fanfare');
    triggerHaptic('levelUp');
    confetti({ particleCount: 90, spread: 80 });
    onComplete(xpEarned);
  };

  return (
    <div className="max-w-md mx-auto min-h-[calc(100dvh-4rem)] flex flex-col justify-between p-4 pb-28 select-none">
      
      {/* 1. SETUP PHASE */}
      {phase === 'setup' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="p-2 rounded-2xl bg-slate-800 text-slate-400 hover:text-white border border-slate-700"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <span className="text-xs font-black uppercase tracking-wider text-emerald-400 bg-slate-800 px-3 py-1 rounded-xl border border-slate-700">
              Modo Competición / Maratón
            </span>
          </div>

          <div className="bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-3xl p-5 text-white shadow-xl">
            <h2 className="text-xl font-black mb-1">Maratón de Memoria Rápida</h2>
            <p className="text-xs text-purple-100 leading-relaxed">
              El entrenamiento de los campeones mundiales: proyecta decenas o cientos de elementos y encadénalos en tu mente sin dudar.
            </p>
          </div>

          {/* Stimulus Type Selector */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-3xl p-4 space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-slate-400 block">
              1. Tipo de Elementos
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setStimulusType('words')}
                className={`py-2.5 px-2 rounded-2xl text-xs font-black border transition-all ${
                  stimulusType === 'words'
                    ? 'bg-emerald-500 text-white border-emerald-400 shadow-md'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                📖 Palabras (+1,300)
              </button>
              <button
                onClick={() => setStimulusType('numbers')}
                className={`py-2.5 px-2 rounded-2xl text-xs font-black border transition-all ${
                  stimulusType === 'numbers'
                    ? 'bg-emerald-500 text-white border-emerald-400 shadow-md'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                🔢 Números (1-100)
              </button>
              <button
                onClick={() => setStimulusType('digits')}
                className={`py-2.5 px-2 rounded-2xl text-xs font-black border transition-all ${
                  stimulusType === 'digits'
                    ? 'bg-emerald-500 text-white border-emerald-400 shadow-md'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                🎲 Dígitos (0-9)
              </button>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-3xl p-4 space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-slate-400 block">
              2. Cantidad de una Sentada
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {[10, 25, 50, 100, 200].map((qty) => (
                <button
                  key={qty}
                  onClick={() => setItemCount(qty)}
                  className={`py-2 rounded-xl text-xs font-black border transition-all ${
                    itemCount === qty
                      ? 'bg-indigo-600 text-white border-indigo-400'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {qty}
                </button>
              ))}
            </div>
          </div>

          {/* Cadence Speed */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-3xl p-4 space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-black uppercase tracking-wider text-slate-400">
                3. Velocidad de Proyección
              </label>
              <span className="text-xs font-black text-amber-400 font-mono">{cadence}s / ítem</span>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {[3.0, 2.0, 1.5, 1.0, 0.6].map((spd) => (
                <button
                  key={spd}
                  onClick={() => setCadence(spd)}
                  className={`py-2 rounded-xl text-xs font-black border transition-all ${
                    cadence === spd
                      ? 'bg-amber-500 text-slate-900 border-amber-400'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {spd}s
                </button>
              ))}
            </div>
          </div>

          {/* Start CTA */}
          <button
            onClick={handleStartFlashing}
            className="w-full btn-duo btn-duo-green py-4 rounded-2xl flex items-center justify-center space-x-2 text-base font-black text-white"
          >
            <Play className="w-5 h-5 fill-white" />
            <span>¡Iniciar Secuencia Flash!</span>
          </button>

        </div>
      )}

      {/* 2. FLASHING SEQUENCE PHASE */}
      {phase === 'flashing' && (
        <div className="flex-1 flex flex-col justify-between my-auto text-center">
          
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">
              Elemento {currentIndex + 1} de {sequence.length}
            </span>
            <span className="text-xs font-mono text-amber-400 bg-slate-800 px-3 py-1 rounded-xl border border-slate-700">
              {cadence}s
            </span>
          </div>

          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden my-4 border border-slate-700">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-150"
              style={{ width: `${((currentIndex + 1) / sequence.length) * 100}%` }}
            />
          </div>

          {/* Main Flash Display Area */}
          <div className="my-auto py-16 flex items-center justify-center">
            <div
              className={`transition-opacity duration-75 transform ${
                isItemVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}
            >
              <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight drop-shadow-lg">
                {sequence[currentIndex]}
              </h1>
            </div>
          </div>

          <p className="text-xs text-slate-400 italic">
            Encadena cada imagen con la anterior sin detener el flujo mental...
          </p>
        </div>
      )}

      {/* 3. RECALL PHASE */}
      {phase === 'recall' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="text-center">
            <h2 className="text-lg font-black text-white">Reconstruye la Secuencia</h2>
            <p className="text-xs text-slate-400">
              Introduce los {sequence.length} elementos en orden. Pulsa Enter para avanzar a la siguiente casilla.
            </p>
          </div>

          {/* Grid of Inputs */}
          <div className="grid grid-cols-2 gap-2 max-h-[50vh] overflow-y-auto p-1 pr-2">
            {sequence.map((_, idx) => (
              <div
                key={idx}
                className={`flex items-center bg-slate-800/90 border rounded-2xl p-1.5 transition-all ${
                  currentRecallIdx === idx
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                    : 'border-slate-700'
                }`}
              >
                <span className="w-7 text-center font-mono text-xs font-bold text-slate-400">
                  {idx + 1}
                </span>
                <input
                  type={stimulusType === 'words' ? 'text' : 'number'}
                  autoFocus={currentRecallIdx === idx}
                  value={userAnswers[idx]}
                  onChange={(e) => handleInputChange(idx, e.target.value)}
                  onFocus={() => setCurrentRecallIdx(idx)}
                  onKeyDown={(e) => handleInputKeyDown(e, idx)}
                  placeholder="..."
                  className="w-full bg-transparent px-2 py-1.5 text-xs font-bold text-white outline-none"
                />
              </div>
            ))}
          </div>

          <button
            onClick={checkAllResults}
            className="w-full btn-duo btn-duo-green py-3.5 rounded-2xl text-sm font-black text-white mt-2"
          >
            Comprobar Secuencia Completa
          </button>
        </div>
      )}

      {/* 4. RESULTS BREAKDOWN */}
      {phase === 'results' && (
        <div className="space-y-4 animate-in zoom-in-95 duration-200 text-center">
          <Trophy className="w-14 h-14 text-amber-400 mx-auto animate-bounce mt-2" />
          <h2 className="text-xl font-black text-white">¡Desafío Evaluado!</h2>
          <p className="text-xs text-slate-400">
            Aciertos: <strong className="text-emerald-400 font-black">{score}</strong> de {sequence.length} ({Math.round((score / sequence.length) * 100)}%)
          </p>

          {/* Side by side comparison breakdown */}
          <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-3 text-left max-h-[45vh] overflow-y-auto pr-2 space-y-1.5">
            {resultsList.map((item) => (
              <div
                key={item.index}
                className={`flex items-center justify-between p-2 rounded-xl border text-xs ${
                  item.isMatch
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                    : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                }`}
              >
                <span className="font-mono text-slate-400 w-6">#{item.index}</span>
                <span className="font-bold flex-1 text-white">{item.original}</span>
                <span className={`font-semibold ${item.isMatch ? 'text-emerald-400' : 'text-rose-400 line-through'}`}>
                  {item.user || "(vacío)"}
                </span>
                {item.isMatch ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0 ml-2" />
                )}
              </div>
            ))}
          </div>

          <button
            onClick={() => setPhase('setup')}
            className="w-full btn-duo btn-duo-green py-3.5 rounded-2xl text-xs font-black text-white"
          >
            Nueva Sesión de Maratón
          </button>
        </div>
      )}

    </div>
  );
};
