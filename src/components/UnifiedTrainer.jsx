import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { ArrowLeft, Play, CheckCircle2, XCircle, Trophy, Zap, Star, Sparkles, TrendingUp, TrendingDown, ArrowRight, Keyboard, List, Eye, Flame, Award } from 'lucide-react';
import { VOCABULARY } from '../data/lessons';
import { CASILLERO_100 } from '../data/casillero';
import { Mascot } from './Mascot';
import { playSound } from '../utils/sound';
import { triggerHaptic } from '../utils/haptics';
import { generateSmartSession, generateNextInStreakSession } from '../utils/profileManager';

export const UnifiedTrainer = ({ config, profile, onBack, onComplete, onStartSession, soundEnabled }) => {
  // Phase: 'ready' | 'flashing' | 'recall' | 'results'
  const [phase, setPhase] = useState('ready');
  const [items, setItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Recall mode: 'typing' (direct text input) | 'options' (4 choices) | 'reveal' (self-check)
  const [recallMode, setRecallMode] = useState('typing');

  // Recall states
  const [recallIndex, setRecallIndex] = useState(0);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [typedAnswer, setTypedAnswer] = useState('');
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [answersHistory, setAnswersHistory] = useState([]);

  // Results outcome from evaluateSessionResult
  const [resultOutcome, setResultOutcome] = useState(null);

  const inputRef = useRef(null);

  // 1. Generate items based on sessionConfig
  useEffect(() => {
    const modelType = config.model || config.type || 'words';
    const sessionStyle = config.style || 'normal';
    const count = config.count || 5;
    const range = config.range;
    let generated = [];

    if (sessionStyle === 'drill' || sessionStyle === 'consolidacion') {
      const [min, max] = range || [0, 9];
      const available = CASILLERO_100.filter(c => c.num >= min && c.num <= max);
      const shuffled = [...available].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, Math.min(count, shuffled.length));

      generated = selected.map(item => {
        const askForNumber = Math.random() > 0.5;
        return {
          type: 'drill',
          prompt: askForNumber ? `${item.word} ${item.emoji}` : `${item.num}`,
          target: askForNumber ? `${item.num}` : item.word,
          num: item.num,
          word: item.word,
          emoji: item.emoji,
          askForNumber
        };
      });
    } else if (modelType === 'numbers') {
      const [min, max] = range || [0, 9];
      // Weighted sampling: if range spans multiple 10-blocks, bias 65% towards the newest block
      const newestBlockMin = Math.max(min, max - 9);
      const newestPool = CASILLERO_100.filter(c => c.num >= newestBlockMin && c.num <= max);
      const olderPool = CASILLERO_100.filter(c => c.num >= min && c.num < newestBlockMin);

      for (let i = 0; i < count; i++) {
        let chosen;
        if (olderPool.length > 0 && Math.random() > 0.65) {
          chosen = olderPool[Math.floor(Math.random() * olderPool.length)];
        } else {
          chosen = newestPool[Math.floor(Math.random() * newestPool.length)] || CASILLERO_100[i % CASILLERO_100.length];
        }

        generated.push({
          type: 'number',
          text: `${chosen.num}`,
          target: chosen.word,
          emoji: chosen.emoji,
          num: chosen.num
        });
      }
    } else if (modelType === 'mixed' || modelType === 'hybrid') {
      const wordsPool = [...VOCABULARY.concretos, ...VOCABULARY.abstractos].sort(() => 0.5 - Math.random());
      const maxNum = (range && range[1]) ? range[1] : 9;
      const numPool = CASILLERO_100.filter(c => c.num <= maxNum);

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
          const chosen = numPool[Math.floor(Math.random() * numPool.length)] || CASILLERO_100[0];
          generated.push({
            type: 'number',
            text: `${chosen.num}`,
            target: chosen.word,
            emoji: chosen.emoji,
            num: chosen.num
          });
        }
      }
    } else {
      // modelType === 'words' (natural vocabulary)
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

    setItems(generated);
    setCurrentIndex(0);
    setPhase('ready');
    setRecallIndex(0);
    setScore(0);
    setTypedAnswer('');
    setIsAnswerChecked(false);
    setResultOutcome(null);
    setAnswersHistory([]);
  }, [config]);

  // Keep input focused when typing recall index advances
  useEffect(() => {
    if (phase === 'recall' && recallMode === 'typing') {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [phase, recallIndex, recallMode]);

  // 2. FLASHING LOOP (Zero freeze, explicit clean interval)
  useEffect(() => {
    if (phase !== 'flashing' || items.length === 0 || config.style === 'drill') return;

    if (soundEnabled) playSound('tick');

    const durationMs = (config.cadence || 2.0) * 1000;
    const timer = setTimeout(() => {
      if (currentIndex < items.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        // Flashing complete -> Transition to recall
        if (soundEnabled) playSound('pop');
        triggerHaptic('medium');
        setPhase('recall');
        setRecallIndex(0);
        setupRecallStep(0, items);
      }
    }, durationMs);

    return () => clearTimeout(timer);
  }, [phase, currentIndex, items.length, config.cadence]);

  // 3. Setup recall options
  const setupRecallStep = (idx, allItems) => {
    const targetItem = allItems[idx];
    const correctTarget = targetItem.target;

    const others = allItems.filter((_, i) => i !== idx).map(it => it.target);
    const distractors = [...others].sort(() => 0.5 - Math.random()).slice(0, 3);
    const fallbacks = ["Reloj", "Tiburón", "Espada", "Fuego", "Cuna", "Té", "Luna", "Tiempo", "Aro", "Ñu"];
    while (distractors.length < 3) {
      const fb = fallbacks[Math.floor(Math.random() * fallbacks.length)];
      if (!distractors.includes(fb) && fb !== correctTarget) distractors.push(fb);
    }

    setOptions([correctTarget, ...distractors].sort(() => 0.5 - Math.random()));
    setSelectedOption(null);
    setTypedAnswer('');
    setIsAnswerChecked(false);
  };

  const normalize = (t) => {
    return t ? t.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim() : "";
  };

  // CHECK WITH DIRECT TYPING (Keyboard mode): Directly advances on submit
  const handleCheckTyped = (e) => {
    if (e) e.preventDefault();
    if (!typedAnswer.trim()) return;

    const targetItem = items[recallIndex];
    const normalizedInput = normalize(typedAnswer);
    const normalizedTarget = normalize(targetItem.target);
    const normalizedWord = normalize(targetItem.word);
    const normalizedNum = normalize(targetItem.num);

    const correct = normalizedInput === normalizedTarget ||
                    (targetItem.type === 'number' && (normalizedInput === normalizedWord || normalizedInput === normalizedNum));

    if (correct) {
      if (soundEnabled) playSound('success');
      triggerHaptic('success');
      setScore(prev => prev + 1);
    } else {
      if (soundEnabled) playSound('error');
      triggerHaptic('error');
    }

    setAnswersHistory(prev => [
      ...prev,
      {
        index: recallIndex + 1,
        userAnswer: typedAnswer.trim(),
        target: targetItem.target,
        word: targetItem.word,
        emoji: targetItem.emoji,
        correct
      }
    ]);

    // Directly move to next item without waiting or requiring "Continuar" click!
    if (recallIndex < items.length - 1) {
      const nextIdx = recallIndex + 1;
      setRecallIndex(nextIdx);
      setupRecallStep(nextIdx, items);
      setTypedAnswer('');
      setIsAnswerChecked(false);
    } else {
      finishSession(score + (correct ? 1 : 0));
    }
  };

  // CHECK WITH 4 OPTIONS
  const handleSelectOption = (opt) => {
    if (isAnswerChecked) return;
    if (soundEnabled) playSound('click');
    triggerHaptic('light');
    setSelectedOption(opt);
  };

  const handleCheckOption = () => {
    if (!selectedOption || isAnswerChecked) return;
    const targetItem = items[recallIndex];
    const correct = normalize(selectedOption) === normalize(targetItem.target);
    setIsAnswerChecked(true);
    setIsCorrect(correct);

    if (correct) {
      if (soundEnabled) playSound('success');
      triggerHaptic('success');
      setScore(prev => prev + 1);
    } else {
      if (soundEnabled) playSound('error');
      triggerHaptic('error');
    }
  };

  // CHECK WITH SELF-EVALUATION (Reveal mode)
  const handleRevealScore = (remembered) => {
    setIsAnswerChecked(true);
    setIsCorrect(remembered);

    if (remembered) {
      if (soundEnabled) playSound('success');
      triggerHaptic('success');
      setScore(prev => prev + 1);
    } else {
      if (soundEnabled) playSound('error');
      triggerHaptic('error');
    }
  };

  const handleNextRecall = () => {
    if (recallIndex < items.length - 1) {
      const nextIdx = recallIndex + 1;
      setRecallIndex(nextIdx);
      setupRecallStep(nextIdx, items);
    } else {
      finishSession(score + (isCorrect ? 0 : 0));
    }
  };

  const finishSession = (finalScore) => {
    setPhase('results');
    if (soundEnabled) playSound('fanfare');
    triggerHaptic('levelUp');
    confetti({ particleCount: 90, spread: 80 });

    const outcome = onComplete({
      model: config.model || config.type || 'words',
      type: config.model || config.type || 'words',
      style: config.style,
      count: items.length,
      cadence: config.cadence,
      score: finalScore,
      total: items.length
    });
    setResultOutcome(outcome);
  };

  if (items.length === 0) return null;

  return (
    <div className="max-w-md mx-auto min-h-[calc(100dvh-4rem)] flex flex-col justify-between p-4 pb-28 select-none">
      
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          className="p-2 rounded-2xl bg-white text-slate-500 hover:text-slate-800 border border-slate-200 shadow-sm active:scale-95"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex-1 mx-4">
          <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
            <span>{config.title}</span>
            <span>
              {phase === 'flashing'
                ? `${currentIndex + 1} / ${items.length}`
                : phase === 'recall'
                ? `${recallIndex + 1} / ${items.length}`
                : 'Inicio'}
            </span>
          </div>
          <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden p-0.5 border border-slate-300">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-300"
              style={{
                width: `${
                  phase === 'flashing'
                    ? ((currentIndex + 1) / items.length) * 100
                    : phase === 'recall'
                    ? ((recallIndex + 1) / items.length) * 100
                    : 100
                }%`
              }}
            />
          </div>
        </div>

        <span className="text-xs font-black text-amber-700 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200 font-mono">
          {config.cadence}s
        </span>
      </div>

      {/* 1. READY PHASE */}
      {phase === 'ready' && (
        <div className="my-auto space-y-4 text-center animate-in zoom-in-95 duration-200">
          <Mascot
            mood="focus"
            size={75}
            speech="¡Asocia cada elemento con una acción estrafalaria y viva!"
            className="justify-center mx-auto"
          />

          <div>
            <h2 className="text-2xl font-black text-slate-900">{config.title}</h2>
            <p className="text-xs text-slate-500 mt-0.5 max-w-xs mx-auto">{config.subtitle}</p>
          </div>

          <div className="card-light p-5 text-xs text-slate-700 text-left max-w-xs mx-auto space-y-3">
            <div className="flex items-center space-x-2 text-emerald-600 font-black">
              <Sparkles className="w-4 h-4" />
              <span>Instrucciones:</span>
            </div>
            <p className="leading-relaxed text-slate-600">
              {config.style === 'drill' || config.style === 'consolidacion'
                ? "Afianza la asociación instantánea entre el número y su palabra del casillero."
                : config.style === 'sprint' || config.style === 'corta'
                ? "Máxima velocidad: deja que la imagen absurda brote en un instante sin pensar."
                : "Conecta cada elemento con el siguiente formando una escena estrafalaria, viva y con movimiento."}
            </p>
            <div className="pt-2 border-t border-slate-100 flex justify-between text-[11px] font-bold text-slate-500">
              <span>Elementos: <strong className="text-slate-900">{items.length}</strong></span>
              <span>Velocidad: <strong className="text-amber-700">{config.cadence}s / ítem</strong></span>
            </div>
          </div>

          <button
            onClick={() => {
              if (config.style === 'drill' || config.style === 'consolidacion') {
                setPhase('recall');
                setupRecallStep(0, items);
              } else {
                setPhase('flashing');
              }
            }}
            className="w-full max-w-xs btn-duo btn-duo-green py-4 rounded-2xl flex items-center justify-center space-x-2 text-base font-black mx-auto text-white"
          >
            <Play className="w-5 h-5 fill-white" />
            <span>¡Comenzar Sesión!</span>
          </button>
        </div>
      )}

      {/* 2. FLASHING PHASE */}
      {phase === 'flashing' && (
        <div className="flex-1 flex flex-col justify-between my-auto text-center animate-in fade-in duration-150">
          <div className="flex items-center justify-center">
            <span className="bg-white border border-slate-200 px-3.5 py-1.5 rounded-xl text-xs font-black text-amber-700 shadow-sm font-mono">
              ⏱️ {config.cadence}s por elemento
            </span>
          </div>

          {/* Flash Card: Sleek, high-contrast, without tips or emoji crutches */}
          <div className="my-auto py-8">
            <div className="card-light border-2 border-emerald-500 p-8 shadow-md max-w-sm mx-auto animate-pop">
              {items[currentIndex]?.type === 'number' ? (
                <div className="py-2">
                  <div className="inline-block bg-slate-900 text-emerald-400 font-mono font-black text-6xl md:text-7xl px-8 py-5 rounded-3xl shadow-inner border-2 border-slate-700">
                    {items[currentIndex].text}
                  </div>
                </div>
              ) : (
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-wide">
                  {items[currentIndex]?.text}
                </h1>
              )}
            </div>
          </div>

          <p className="text-xs text-slate-500 italic">
            Visualiza la asociación inverosímil antes de que cambie...
          </p>
        </div>
      )}

      {/* 3. RECALL PHASE */}
      {phase === 'recall' && (
        <div className="flex-1 flex flex-col justify-between my-2 animate-in fade-in duration-200">
          
          <div>
            {/* Recall Mode Switcher Bar */}
            <div className="flex justify-center mb-3">
              <div className="bg-slate-200/80 p-1 rounded-xl flex space-x-1 text-[11px] font-black border border-slate-300">
                <button
                  onClick={() => setRecallMode('typing')}
                  className={`px-3 py-1 rounded-lg flex items-center space-x-1 transition-all ${
                    recallMode === 'typing' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Keyboard className="w-3.5 h-3.5" />
                  <span>Teclado</span>
                </button>
                <button
                  onClick={() => setRecallMode('options')}
                  className={`px-3 py-1 rounded-lg flex items-center space-x-1 transition-all ${
                    recallMode === 'options' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                  <span>4 Opciones</span>
                </button>
                <button
                  onClick={() => setRecallMode('reveal')}
                  className={`px-3 py-1 rounded-lg flex items-center space-x-1 transition-all ${
                    recallMode === 'reveal' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Revelar</span>
                </button>
              </div>
            </div>

            <div className="text-center">
              <span className="text-xs font-black text-emerald-600 uppercase tracking-widest block mb-0.5">
                Pregunta {recallIndex + 1} de {items.length}
              </span>
              <h2 className="text-lg font-black text-slate-900">
                {config.style === 'drill' || config.style === 'consolidacion' ? (
                  items[recallIndex]?.askForNumber
                    ? <>¿A qué número corresponde <strong>{items[recallIndex].prompt}</strong>?</>
                    : <>¿Qué palabra corresponde al número <strong>{items[recallIndex].prompt}</strong>?</>
                ) : (
                  <>¿Qué elemento venía en la posición <strong>#{recallIndex + 1}</strong>?</>
                )}
              </h2>
            </div>
          </div>

          {/* Spacing without distracting mascot */}
          <div className="my-auto py-2" />

          {/* MODE A: DIRECT TYPING (Keyboard) */}
          {recallMode === 'typing' && (
            <div className="space-y-3 mb-4">
              <form onSubmit={handleCheckTyped}>
                <input
                  ref={inputRef}
                  type={items[recallIndex]?.askForNumber ? 'number' : 'text'}
                  autoFocus
                  placeholder="Escribe y pulsa Enter..."
                  value={typedAnswer}
                  onChange={(e) => setTypedAnswer(e.target.value)}
                  className="w-full bg-white border-2 border-slate-300 focus:border-emerald-500 rounded-2xl py-4 px-4 text-center text-xl font-black text-slate-900 outline-none shadow-sm"
                />

                <button
                  type="submit"
                  disabled={!typedAnswer.trim()}
                  className={`w-full mt-3 btn-duo py-3.5 rounded-2xl text-sm font-black ${
                    typedAnswer.trim() ? 'btn-duo-green' : 'bg-slate-200 text-slate-400 border-b-4 border-slate-300 cursor-not-allowed'
                  }`}
                >
                  Siguiente (Enter)
                </button>
              </form>
            </div>
          )}

          {/* MODE B: 4 OPTIONS */}
          {recallMode === 'options' && (
            <div className="space-y-3 mb-4">
              <div className="grid grid-cols-2 gap-2.5">
                {options.map((opt) => {
                  const isSelected = selectedOption === opt;
                  let btnClass = 'btn-duo-white text-slate-800';

                  if (isAnswerChecked) {
                    if (normalize(opt) === normalize(items[recallIndex].target)) {
                      btnClass = 'btn-duo-green text-white border-emerald-600';
                    } else if (isSelected) {
                      btnClass = 'btn-duo-rose text-white border-rose-600';
                    }
                  } else if (isSelected) {
                    btnClass = 'btn-duo-indigo text-white';
                  }

                  return (
                    <button
                      key={opt}
                      disabled={isAnswerChecked}
                      onClick={() => handleSelectOption(opt)}
                      className={`btn-duo ${btnClass} p-3 rounded-2xl flex items-center justify-center text-xs font-black transition-all`}
                    >
                      <span className="truncate">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {!isAnswerChecked && (
                <button
                  disabled={!selectedOption}
                  onClick={handleCheckOption}
                  className={`w-full btn-duo py-3.5 rounded-2xl text-sm font-black ${
                    selectedOption ? 'btn-duo-green' : 'bg-slate-200 text-slate-400 border-b-4 border-slate-300 cursor-not-allowed'
                  }`}
                >
                  Comprobar
                </button>
              )}
            </div>
          )}

          {/* MODE C: REVEAL & SELF-CHECK */}
          {recallMode === 'reveal' && (
            <div className="space-y-3 mb-4 text-center">
              {!isAnswerChecked ? (
                <button
                  onClick={() => setIsAnswerChecked(true)}
                  className="w-full btn-duo btn-duo-indigo py-4 rounded-2xl text-sm font-black text-white"
                >
                  👁️ Mostrar Solución
                </button>
              ) : (
                <div className="space-y-3">
                  <div className="card-light p-4 text-center">
                    <span className="text-xs text-slate-500 uppercase font-bold block">Solución:</span>
                    <span className="text-xl font-black text-slate-900 mt-1 block">
                      {items[recallIndex].target} {items[recallIndex].emoji || ''}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        handleRevealScore(false);
                        handleNextRecall();
                      }}
                      className="btn-duo btn-duo-rose py-3 rounded-2xl text-xs font-black text-white"
                    >
                      ❌ No la recordé
                    </button>
                    <button
                      onClick={() => {
                        handleRevealScore(true);
                        handleNextRecall();
                      }}
                      className="btn-duo btn-duo-green py-3 rounded-2xl text-xs font-black text-white"
                    >
                      ✅ ¡La recordé!
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Feedback banner (when checked in options mode) */}
          {isAnswerChecked && recallMode === 'options' && (
            <div className={`p-4 rounded-2xl border flex items-center justify-between animate-in zoom-in-95 ${
              isCorrect ? 'bg-emerald-50 border-emerald-300' : 'bg-rose-50 border-rose-300'
            }`}>
              <div className="flex items-center space-x-2 text-left">
                {isCorrect ? <CheckCircle2 className="w-6 h-6 text-emerald-600" /> : <XCircle className="w-6 h-6 text-rose-600" />}
                <div>
                  <div className={`font-black text-xs ${isCorrect ? 'text-emerald-800' : 'text-rose-800'}`}>
                    {isCorrect ? '¡Excelente evocación!' : 'Solución:'}
                  </div>
                  {!isCorrect && (
                    <div className="text-xs font-bold text-slate-900">
                      Era: <strong>{items[recallIndex].target}</strong> {items[recallIndex].emoji || ''}
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={handleNextRecall}
                className={`btn-duo py-2 px-4 rounded-xl text-xs font-black ${isCorrect ? 'btn-duo-green' : 'btn-duo-rose'}`}
              >
                Continuar
              </button>
            </div>
          )}

        </div>
      )}

      {/* 4. RESULTS PHASE */}
      {phase === 'results' && (
        <div className="my-auto space-y-4 text-center animate-in zoom-in-95 duration-200">
          <Mascot
            mood="celebrating"
            size={80}
            speech={score >= items.length * 0.9 ? "¡Excelente evocación! La cadena se mantiene firme." : "¡Buen entrenamiento! Cada sesión refuerza tus conexiones."}
            className="justify-center mx-auto"
          />

          <div>
            <h2 className="text-2xl font-black text-slate-900">¡Sesión Evaluada!</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Has acertado <strong className="text-emerald-600 font-black">{score}</strong> de {items.length} ({Math.round((score / items.length) * 100)}%)
            </p>
          </div>

          {/* Missed elements review if any */}
          {answersHistory.some(a => !a.correct) && (
            <div className="card-light p-3 max-w-xs mx-auto text-left space-y-1.5 max-h-36 overflow-y-auto">
              <span className="text-[11px] font-black text-rose-700 uppercase tracking-wider block">
                Elementos a Repasar:
              </span>
              {answersHistory.filter(a => !a.correct).map((item, idx) => (
                <div key={idx} className="text-xs p-1.5 rounded-lg bg-rose-50 border border-rose-200 flex justify-between items-center">
                  <span className="text-slate-400 font-mono text-[10px]">#{item.index}</span>
                  <span className="text-rose-700 font-medium line-through truncate max-w-[90px]">{item.userAnswer || '(vacío)'}</span>
                  <span className="text-slate-900 font-black truncate max-w-[120px]">{item.target} {item.emoji || ''}</span>
                </div>
              ))}
            </div>
          )}

          {/* 3 Consolidation Checks Bar */}
          <div className="bg-white border-2 border-slate-200 rounded-2xl p-3.5 max-w-xs mx-auto shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs font-black text-slate-700">
              <span className="uppercase tracking-wider text-[11px] text-slate-500">Consolidación (≥90%)</span>
              <div className="flex items-center space-x-1.5">
                {[1, 2, 3].map((dot) => (
                  <span
                    key={dot}
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${
                      dot <= (resultOutcome?.masteryChecks || 0)
                        ? 'bg-emerald-500 text-white shadow-sm ring-2 ring-emerald-200'
                        : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    {dot <= (resultOutcome?.masteryChecks || 0) ? '✓' : ''}
                  </span>
                ))}
              </div>
            </div>
            <p className="text-[11px] text-slate-600 font-medium text-left">
              {resultOutcome?.masteryChecks >= 3
                ? "¡3 de 3 superadas! Nivel consolidado con éxito."
                : `${resultOutcome?.masteryChecks || 0} de 3 sesiones exitosas para ascender.`}
            </p>
          </div>

          {/* New Personal Records Alert (if any) */}
          {resultOutcome?.newRecords && resultOutcome.newRecords.length > 0 && (
            <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-3.5 text-center space-y-1 shadow-sm">
              <Trophy className="w-6 h-6 text-amber-500 mx-auto" />
              <h4 className="font-black text-xs text-amber-900">¡NUEVO RÉCORD PERSONAL!</h4>
              {resultOutcome.newRecords.map((rec, i) => (
                <p key={i} className="text-xs font-bold text-amber-800">{rec}</p>
              ))}
            </div>
          )}

          {/* Adaptive Progression / Regression Card */}
          <div className="card-light p-4 max-w-xs mx-auto text-left shadow-sm space-y-1.5">
            <div className="flex items-center space-x-2">
              {resultOutcome?.levelGraduated ? (
                <Award className="w-4 h-4 text-emerald-600" />
              ) : (
                <Sparkles className="w-4 h-4 text-indigo-600" />
              )}
              <span className="font-black text-xs text-slate-800 uppercase tracking-wider">
                Ajuste del Motor Adaptativo:
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              {resultOutcome?.feedbackMessage || "Sesión completada y registrada en tu historial."}
            </p>
            <div className="pt-2 border-t border-slate-100 flex justify-between text-xs font-bold text-slate-500">
              <span>Experiencia:</span>
              <span className="text-indigo-600 font-black flex items-center">
                <Zap className="w-3.5 h-3.5 mr-1 fill-indigo-600" />
                +{resultOutcome?.earnedXP || 40} XP
              </span>
            </div>
          </div>

          {/* ACTION BUTTONS: Seguir Practicando, Siguiente Lección, Reto de Ascenso */}
          <div className="space-y-2 max-w-xs mx-auto pt-2">
            {/* Button 1: Seguir Practicando (Modo Racha) */}
            <button
              onClick={() => {
                const nextStreakCfg = generateNextInStreakSession(config);
                if (onStartSession) {
                  onStartSession(nextStreakCfg);
                }
              }}
              className="w-full btn-duo btn-duo-amber py-3.5 rounded-2xl flex items-center justify-center space-x-2 text-xs font-black text-slate-900 shadow-md"
            >
              <Flame className="w-4 h-4 fill-amber-500 text-slate-900" />
              <span>⚡ Seguir Practicando (Modo Racha)</span>
            </button>

            {/* Button 2: Siguiente Lección (Rotate smart session) */}
            <button
              onClick={() => {
                const nextSmart = generateSmartSession(resultOutcome?.newProfile || profile);
                if (onStartSession) {
                  onStartSession(nextSmart);
                }
              }}
              className="w-full btn-duo btn-duo-green py-3.5 rounded-2xl flex items-center justify-center space-x-2 text-xs font-black text-white shadow-md"
            >
              <ArrowRight className="w-4 h-4" />
              <span>➡️ Siguiente Lección</span>
            </button>

            {/* Button 3: Reto de Ascenso (if graduated or available) */}
            {resultOutcome?.levelGraduated && (
              <button
                onClick={() => {
                  const challengeCfg = {
                    model: config.model || config.type || 'words',
                    type: config.model || config.type || 'words',
                    style: 'corta',
                    count: Math.min(12, (config.count || 5) + 3),
                    cadence: Math.max(1.0, (config.cadence || 2.5) - 0.5),
                    title: `🏆 Reto de Ascenso Oficial`,
                    subtitle: 'Demuestra tu nuevo nivel a máxima velocidad',
                    badge: 'Reto Oficial'
                  };
                  if (onStartSession) {
                    onStartSession(challengeCfg);
                  }
                }}
                className="w-full btn-duo btn-duo-indigo py-3.5 rounded-2xl flex items-center justify-center space-x-2 text-xs font-black text-white shadow-md"
              >
                <Trophy className="w-4 h-4 fill-white" />
                <span>🏆 ¡Hacer Reto de Ascenso!</span>
              </button>
            )}

            {/* Back to panel */}
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
