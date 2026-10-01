import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Play, ArrowLeft, RotateCcw, CheckCircle2, XCircle, Trophy, Zap, Sliders, Hash, BookOpen, Shuffle, Award, Check } from 'lucide-react';
import { VOCABULARY } from '../data/lessons';
import { CASILLERO_100 } from '../data/casillero';
import { playSound } from '../utils/sound';
import { triggerHaptic } from '../utils/haptics';

export const CustomTrainer = ({ onBack, onComplete, soundEnabled }) => {
  // 1. Config state: Type, Count, Cadence
  const [modelType, setModelType] = useState('palabras'); // 'palabras' | 'numeros' | 'hibrido'
  const [itemCount, setItemCount] = useState(10);
  const [cadence, setCadence] = useState(2.0); // 0 means manual step

  // 2. Lifecycle: 'setup' | 'flashing' | 'recall_list' | 'evaluated'
  const [phase, setPhase] = useState('setup');
  const [sequence, setSequence] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 3. Recall list answers & evaluation
  const [userAnswers, setUserAnswers] = useState([]);
  const [evalResults, setEvalResults] = useState(null);

  const inputRefs = useRef([]);

  const normalize = (t) => {
    return t ? t.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim() : "";
  };

  // Launch the custom flash sequence
  const startSession = () => {
    const count = Math.max(1, parseInt(itemCount, 10) || 10);
    let generated = [];

    if (modelType === 'numeros') {
      const pool = [...CASILLERO_100];
      for (let i = 0; i < count; i++) {
        const item = pool[Math.floor(Math.random() * pool.length)];
        generated.push({
          type: 'number',
          text: `${item.num}`,
          target: `${item.num}`,
          word: item.word,
          emoji: item.emoji,
          num: item.num
        });
      }
    } else if (modelType === 'hibrido') {
      const wordsPool = [...VOCABULARY.concretos, ...VOCABULARY.abstractos].sort(() => 0.5 - Math.random());
      for (let i = 0; i < count; i++) {
        const isWord = Math.random() > 0.5;
        if (isWord) {
          const w = wordsPool[i % wordsPool.length];
          const cap = w.charAt(0).toUpperCase() + w.slice(1);
          generated.push({
            type: 'word',
            text: cap,
            target: cap
          });
        } else {
          const numItem = CASILLERO_100[Math.floor(Math.random() * CASILLERO_100.length)];
          generated.push({
            type: 'number',
            text: `${numItem.num}`,
            target: `${numItem.num}`,
            word: numItem.word,
            emoji: numItem.emoji,
            num: numItem.num
          });
        }
      }
    } else {
      // Palabras
      const allWords = [...VOCABULARY.concretos, ...VOCABULARY.abstractos].sort(() => 0.5 - Math.random());
      const selected = allWords.slice(0, count);
      generated = selected.map(w => {
        const cap = w.charAt(0).toUpperCase() + w.slice(1);
        return {
          type: 'word',
          text: cap,
          target: cap
        };
      });
    }

    if (soundEnabled) playSound('pop');
    triggerHaptic('medium');

    setSequence(generated);
    setCurrentIndex(0);
    setUserAnswers(new Array(generated.length).fill(''));
    setEvalResults(null);
    setPhase('flashing');
  };

  // Flashing interval timer
  useEffect(() => {
    if (phase !== 'flashing' || sequence.length === 0 || cadence <= 0) return;

    if (soundEnabled) playSound('tick');

    const durationMs = cadence * 1000;
    const timer = setTimeout(() => {
      if (currentIndex < sequence.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        finishFlashing();
      }
    }, durationMs);

    return () => clearTimeout(timer);
  }, [phase, currentIndex, sequence.length, cadence]);

  const handleManualNext = () => {
    if (soundEnabled) playSound('click');
    if (currentIndex < sequence.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      finishFlashing();
    }
  };

  const finishFlashing = () => {
    if (soundEnabled) playSound('pop');
    triggerHaptic('medium');
    setPhase('recall_list');
    // Focus first input
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 100);
  };

  // Handle slot input change
  const handleAnswerChange = (idx, value) => {
    setUserAnswers(prev => {
      const updated = [...prev];
      updated[idx] = value;
      return updated;
    });
  };

  // Jump to next input on Enter
  const handleKeyDown = (idx, e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (idx < sequence.length - 1) {
        inputRefs.current[idx + 1]?.focus();
      }
    }
  };

  // Evaluate all slots in the recall list
  const handleEvaluate = () => {
    let correctCount = 0;
    const details = sequence.map((item, idx) => {
      const answer = userAnswers[idx] || '';
      const normAnswer = normalize(answer);
      const normTarget = normalize(item.target);
      const normWord = normalize(item.word);
      const normNum = normalize(item.num);

      // If it's a number, accept both the numeric string and the casillero word!
      const isCorrect = normAnswer === normTarget ||
                        (item.type === 'number' && (normAnswer === normWord || normAnswer === normNum));

      if (isCorrect) correctCount++;

      return {
        index: idx + 1,
        item,
        answer,
        isCorrect
      };
    });

    const accuracy = Math.round((correctCount / sequence.length) * 100);
    const resultObj = {
      score: correctCount,
      total: sequence.length,
      accuracy,
      details
    };

    setEvalResults(resultObj);
    setPhase('evaluated');

    if (accuracy >= 90) {
      if (soundEnabled) playSound('fanfare');
      triggerHaptic('levelUp');
      confetti({ particleCount: 90, spread: 80 });
    } else {
      if (soundEnabled) playSound('success');
      triggerHaptic('success');
    }

    if (onComplete) {
      onComplete({
        model: modelType,
        type: modelType,
        style: sequence.length >= 25 ? 'larga' : cadence <= 1.0 ? 'corta' : 'normal',
        count: sequence.length,
        cadence,
        score: correctCount,
        total: sequence.length
      });
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-[calc(100dvh-4rem)] flex flex-col justify-between p-4 pb-28 select-none">
      
      {/* 1. SETUP PHASE */}
      {phase === 'setup' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="p-2 rounded-2xl bg-white text-slate-500 hover:text-slate-800 border border-slate-200 shadow-sm active:scale-95"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <span className="text-xs font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-xl border border-indigo-200 flex items-center space-x-1">
              <Sliders className="w-3.5 h-3.5 mr-1" />
              <span>Gimnasio Libre</span>
            </span>
          </div>

          <div className="bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-3xl p-5 text-white shadow-xl shadow-indigo-500/15">
            <h2 className="text-xl font-black mb-1">Entrenamiento a Medida</h2>
            <p className="text-xs text-indigo-100 leading-relaxed">
              Elige tipo de elementos, ajusta el tiempo y el volumen a voluntad, y pon a prueba tu evocación rellenando la lista de huecos.
            </p>
          </div>

          {/* 1. Tipo: Números, Palabras, Híbrido */}
          <div className="card-light p-4 space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-slate-500 block">
              1. Modalidad
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'palabras', label: 'Palabras', icon: '🧠' },
                { id: 'numeros', label: 'Números', icon: '🔢' },
                { id: 'hibrido', label: 'Híbrido', icon: '🌪️' }
              ].map(m => (
                <button
                  key={m.id}
                  onClick={() => setModelType(m.id)}
                  className={`py-3 px-2 rounded-2xl border text-center transition-all ${
                    modelType === m.id
                      ? 'bg-indigo-600 text-white border-indigo-700 shadow-md font-black ring-2 ring-indigo-200'
                      : 'bg-slate-50 text-slate-700 border-slate-200 font-bold hover:bg-slate-100'
                  }`}
                >
                  <span className="text-xl block mb-0.5">{m.icon}</span>
                  <span className="text-xs">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Palabras a voluntad (Input libre) */}
          <div className="card-light p-4 space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-black uppercase tracking-wider text-slate-500">
                2. Cantidad de Elementos
              </label>
              <span className="text-xs font-mono font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-200">
                {itemCount} elementos
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setItemCount(prev => Math.max(1, prev - 5))}
                className="btn-duo btn-duo-slate px-3 py-2 text-xs font-black"
              >
                -5
              </button>
              <button
                onClick={() => setItemCount(prev => Math.max(1, prev - 1))}
                className="btn-duo btn-duo-slate px-3 py-2 text-xs font-black"
              >
                -1
              </button>
              <input
                type="number"
                min="1"
                max="500"
                value={itemCount}
                onChange={(e) => setItemCount(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="flex-1 text-center font-black text-xl text-slate-900 bg-white border-2 border-slate-300 focus:border-indigo-500 rounded-xl py-2 outline-none shadow-sm"
              />
              <button
                onClick={() => setItemCount(prev => prev + 1)}
                className="btn-duo btn-duo-slate px-3 py-2 text-xs font-black"
              >
                +1
              </button>
              <button
                onClick={() => setItemCount(prev => prev + 5)}
                className="btn-duo btn-duo-slate px-3 py-2 text-xs font-black"
              >
                +5
              </button>
            </div>
          </div>

          {/* 3. Tiempo a voluntad (Input libre en segundos) */}
          <div className="card-light p-4 space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-black uppercase tracking-wider text-slate-500">
                3. Tiempo por Elemento
              </label>
              <span className="text-xs font-mono font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                {cadence === 0 ? "Paso Manual" : `${cadence}s / ítem`}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCadence(prev => parseFloat(Math.max(0.3, prev - 0.5).toFixed(1)))}
                className="btn-duo btn-duo-slate px-3 py-2 text-xs font-black"
              >
                -0.5s
              </button>
              <button
                onClick={() => setCadence(prev => parseFloat(Math.max(0.3, prev - 0.1).toFixed(1)))}
                className="btn-duo btn-duo-slate px-3 py-2 text-xs font-black"
              >
                -0.1s
              </button>
              <input
                type="number"
                step="0.1"
                min="0.3"
                max="60"
                value={cadence}
                onChange={(e) => setCadence(parseFloat(parseFloat(e.target.value).toFixed(1)) || 1.0)}
                className="flex-1 text-center font-black text-xl text-slate-900 bg-white border-2 border-slate-300 focus:border-amber-500 rounded-xl py-2 outline-none shadow-sm"
              />
              <button
                onClick={() => setCadence(prev => parseFloat((prev + 0.1).toFixed(1)))}
                className="btn-duo btn-duo-slate px-3 py-2 text-xs font-black"
              >
                +0.1s
              </button>
              <button
                onClick={() => setCadence(prev => parseFloat((prev + 0.5).toFixed(1)))}
                className="btn-duo btn-duo-slate px-3 py-2 text-xs font-black"
              >
                +0.5s
              </button>
            </div>

            <div className="flex justify-center pt-1">
              <button
                onClick={() => setCadence(cadence === 0 ? 2.0 : 0)}
                className={`text-[11px] font-black px-3 py-1 rounded-xl border transition-all ${
                  cadence === 0
                    ? 'bg-amber-500 text-slate-900 border-amber-600 shadow-sm'
                    : 'bg-slate-100 text-slate-600 border-slate-200 hover:text-slate-900'
                }`}
              >
                {cadence === 0 ? "✓ Modo Manual Activo" : "Cambiar a Paso Manual"}
              </button>
            </div>
          </div>

          {/* Launch Button */}
          <button
            onClick={startSession}
            className="w-full btn-duo btn-duo-green py-4 rounded-2xl flex items-center justify-center space-x-2 text-base font-black text-white shadow-lg"
          >
            <Play className="w-5 h-5 fill-white" />
            <span>¡Iniciar Sesión Libre!</span>
          </button>
        </div>
      )}

      {/* 2. FLASHING PHASE */}
      {phase === 'flashing' && (
        <div className="flex-1 flex flex-col justify-between my-auto text-center animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">
              Elemento {currentIndex + 1} de {sequence.length}
            </span>
            <span className="text-xs font-mono font-black text-amber-700 bg-amber-50 px-3 py-1 rounded-xl border border-amber-200">
              {cadence === 0 ? "Paso Manual" : `⏱️ ${cadence}s`}
            </span>
          </div>

          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden my-4 border border-slate-300">
            <div
              className="h-full bg-indigo-600 transition-all duration-150"
              style={{ width: `${((currentIndex + 1) / sequence.length) * 100}%` }}
            />
          </div>

          {/* Flash Card */}
          <div className="my-auto py-8">
            <div className="card-light border-2 border-indigo-400 rounded-3xl p-8 shadow-xl max-w-sm mx-auto animate-pop">
              {sequence[currentIndex]?.type === 'number' ? (
                <div className="space-y-3">
                  <div className="inline-block bg-slate-900 text-emerald-400 font-mono font-black text-6xl px-8 py-4 rounded-3xl shadow-inner border-2 border-slate-700">
                    {sequence[currentIndex].text}
                  </div>
                  {sequence[currentIndex]?.emoji && (
                    <div className="text-2xl pt-1 opacity-75">{sequence[currentIndex].emoji}</div>
                  )}
                </div>
              ) : (
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-wide">
                  {sequence[currentIndex]?.text}
                </h1>
              )}
            </div>
          </div>

          {cadence === 0 ? (
            <button
              onClick={handleManualNext}
              className="w-full btn-duo btn-duo-indigo py-4 rounded-2xl text-base font-black text-white"
            >
              <span>¡Asociado! Siguiente ({currentIndex + 1}/{sequence.length})</span>
            </button>
          ) : (
            <p className="text-xs text-slate-500 italic">
              Visualiza y conecta con el siguiente...
            </p>
          )}
        </div>
      )}

      {/* 3. RECALL LIST (LISTA CON HUECOS PARA RELLENAR) */}
      {phase === 'recall_list' && (
        <div className="flex-1 flex flex-col justify-between my-2 animate-in fade-in duration-200">
          <div className="text-center mb-3">
            <span className="text-xs font-black text-indigo-600 uppercase tracking-widest block mb-0.5">
              Hoja de Evocación
            </span>
            <h2 className="text-lg font-black text-slate-900">
              Rellena los {sequence.length} huecos
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Escribe cada elemento en orden. Pulsa <strong>Enter</strong> para saltar al siguiente hueco.
            </p>
          </div>

          {/* List with input slots */}
          <div className="card-light p-3 max-h-[58vh] overflow-y-auto space-y-2 pr-2 my-auto shadow-inner">
            {sequence.map((_, idx) => (
              <div key={idx} className="flex items-center space-x-2 bg-slate-50 p-2 rounded-xl border border-slate-200 focus-within:border-indigo-500 focus-within:bg-white transition-colors">
                <span className="font-mono text-xs font-black text-indigo-700 w-8 text-center bg-indigo-50 py-1 rounded-lg border border-indigo-200">
                  #{idx + 1}
                </span>
                <input
                  ref={el => inputRefs.current[idx] = el}
                  type="text"
                  placeholder={`Elemento #${idx + 1}...`}
                  value={userAnswers[idx] || ''}
                  onChange={(e) => handleAnswerChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className="flex-1 bg-transparent text-sm font-black text-slate-900 outline-none px-2 py-1 placeholder:text-slate-400 font-sans"
                />
              </div>
            ))}
          </div>

          <div className="pt-3">
            <button
              onClick={handleEvaluate}
              className="w-full btn-duo btn-duo-green py-4 rounded-2xl flex items-center justify-center space-x-2 text-base font-black text-white shadow-lg"
            >
              <Check className="w-5 h-5" />
              <span>Evaluar Respuestas</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. EVALUATED RESULTS (Corrección con lista de huecos) */}
      {phase === 'evaluated' && evalResults && (
        <div className="flex-1 flex flex-col justify-between my-2 animate-in fade-in duration-200">
          <div className="text-center mb-3">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-3xl bg-amber-100 text-amber-600 border border-amber-200 shadow-sm mx-auto mb-1">
              <Trophy className="w-7 h-7 fill-amber-500" />
            </div>
            <h2 className="text-xl font-black text-slate-900">Resultados del Gimnasio</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Has acertado <strong className="text-emerald-600 font-black">{evalResults.score}</strong> de {evalResults.total} ({evalResults.accuracy}%)
            </p>
          </div>

          {/* Detailed Slots Evaluation View */}
          <div className="card-light p-3 max-h-[50vh] overflow-y-auto space-y-2 pr-2 my-auto shadow-inner">
            {evalResults.details.map((row) => (
              <div
                key={row.index}
                className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                  row.isCorrect
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                    : 'bg-rose-50 border-rose-300 text-rose-950'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-black text-[11px] opacity-70 w-6">
                    #{row.index}
                  </span>
                  <div>
                    <div className="font-black text-xs flex items-center space-x-1.5">
                      <span>{row.answer || <span className="italic text-slate-400 font-normal">(Vacío)</span>}</span>
                      {row.isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 inline" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0 inline" />
                      )}
                    </div>
                    {!row.isCorrect && (
                      <div className="text-[11px] text-slate-600 font-bold mt-0.5">
                        Era: <strong className="text-slate-900 font-black">{row.item.target} {row.item.word ? `(${row.item.word})` : ''} {row.item.emoji || ''}</strong>
                      </div>
                    )}
                  </div>
                </div>

                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-lg border ${
                  row.isCorrect ? 'bg-emerald-100 border-emerald-300 text-emerald-800' : 'bg-rose-100 border-rose-300 text-rose-800'
                }`}>
                  {row.isCorrect ? "Correcto" : "Fallo"}
                </span>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="space-y-2 pt-3">
            <button
              onClick={() => setPhase('setup')}
              className="w-full btn-duo btn-duo-indigo py-3.5 rounded-2xl flex items-center justify-center space-x-2 text-xs font-black text-white shadow-md"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Configurar Otro Reto Libre</span>
            </button>
            <button
              onClick={onBack}
              className="w-full py-2.5 text-xs font-bold text-slate-400 hover:text-slate-700 transition-colors"
            >
              Volver al Panel
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
