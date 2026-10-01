import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { ArrowLeft, Play, ArrowRight, CheckCircle2, XCircle, Star, RotateCcw, Zap, Sparkles } from 'lucide-react';
import { generateLessonItems } from '../data/lessons';
import { Mascot } from './Mascot';
import { playSound } from '../utils/sound';
import { triggerHaptic } from '../utils/haptics';

export const LessonTrainer = ({ lesson, onBack, onComplete, soundEnabled }) => {
  // Phase: 'ready' | 'flashing' | 'recall' | 'results'
  const [phase, setPhase] = useState('ready');
  const [items, setItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Recall states (Step-by-step question flow for smooth UX)
  const [recallIndex, setRecallIndex] = useState(0);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState([]);

  // Generate items on mount
  useEffect(() => {
    const generated = generateLessonItems(lesson);
    setItems(generated);
    setCurrentIndex(0);
  }, [lesson]);

  // FLASHING PHASE TIMER (Rock-solid interval)
  useEffect(() => {
    if (phase !== 'flashing' || items.length === 0) return;

    if (soundEnabled) playSound('tick');

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
    }, lesson.cadence * 1000);

    return () => clearTimeout(timer);
  }, [phase, currentIndex, items.length, lesson.cadence]);

  // Setup options for Recall
  const setupRecallStep = (index, allItems) => {
    const currentTarget = allItems[index];
    const correctText = currentTarget.target;

    // Distractors from other items or random pool
    const otherItems = allItems.filter((_, i) => i !== index).map(it => it.target);
    const distractors = [...otherItems].sort(() => 0.5 - Math.random()).slice(0, 3);

    // If not enough distractors from items, pad with sample words
    const fallbackWords = ["Manzana", "Coche", "Estrella", "Fuego", "Tiburón", "Reloj", "Nube", "Espada"];
    while (distractors.length < 3) {
      const fb = fallbackWords[Math.floor(Math.random() * fallbackWords.length)];
      if (!distractors.includes(fb) && fb !== correctText) {
        distractors.push(fb);
      }
    }

    const questionOptions = [correctText, ...distractors].sort(() => 0.5 - Math.random());
    setOptions(questionOptions);
    setSelectedOption(null);
    setIsAnswerChecked(false);
  };

  const handleSelectOption = (opt) => {
    if (isAnswerChecked) return;
    if (soundEnabled) playSound('click');
    triggerHaptic('light');
    setSelectedOption(opt);
  };

  const handleCheckAnswer = () => {
    if (!selectedOption || isAnswerChecked) return;

    const currentTarget = items[recallIndex];
    const correct = selectedOption.toLowerCase() === currentTarget.target.toLowerCase();
    setIsAnswerChecked(true);
    setIsCorrect(correct);

    if (correct) {
      if (soundEnabled) playSound('success');
      triggerHaptic('success');
      setScore(prev => prev + 1);
    } else {
      if (soundEnabled) playSound('error');
      triggerHaptic('error');
      setMistakes(prev => [
        ...prev,
        {
          index: recallIndex + 1,
          expected: currentTarget.target,
          answered: selectedOption
        }
      ]);
    }
  };

  const handleNextRecall = () => {
    if (recallIndex < items.length - 1) {
      const nextIdx = recallIndex + 1;
      setRecallIndex(nextIdx);
      setupRecallStep(nextIdx, items);
    } else {
      // Completed all questions
      finishLesson();
    }
  };

  const finishLesson = () => {
    setPhase('results');
    const accuracy = score / items.length;
    let stars = 1;
    if (accuracy >= 0.95) stars = 3;
    else if (accuracy >= 0.7) stars = 2;

    if (soundEnabled) playSound('fanfare');
    triggerHaptic('levelUp');
    confetti({ particleCount: 90, spread: 80 });

    onComplete(lesson.id, stars, lesson.xp);
  };

  if (items.length === 0) return null;

  return (
    <div className="max-w-md mx-auto min-h-[calc(100dvh-4rem)] flex flex-col justify-between p-4 pb-24 select-none">
      
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          className="p-2 rounded-2xl bg-slate-800 text-slate-400 hover:text-white border border-slate-700 active:scale-95"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex-1 mx-4">
          <div className="flex justify-between text-xs font-bold text-slate-400 mb-1">
            <span>{lesson.title}</span>
            <span>
              {phase === 'flashing'
                ? `${currentIndex + 1} / ${items.length}`
                : phase === 'recall'
                ? `${recallIndex + 1} / ${items.length}`
                : 'Preparación'}
            </span>
          </div>
          <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/60">
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

        <div className="px-2.5 py-1 rounded-xl bg-slate-800 border border-slate-700 text-xs font-black text-amber-400">
          +{lesson.xp}xp
        </div>
      </div>

      {/* 1. READY PHASE */}
      {phase === 'ready' && (
        <div className="my-auto space-y-6 text-center animate-in zoom-in-95 duration-200">
          
          <Mascot mood="happy" size={90} className="justify-center" />

          <div>
            <h2 className="text-2xl font-black text-white">{lesson.title}</h2>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">{lesson.subtitle}</p>
          </div>

          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 text-xs text-slate-200 text-left max-w-xs mx-auto space-y-2">
            <div className="flex items-center space-x-2 text-amber-400 font-black">
              <Sparkles className="w-4 h-4" />
              <span>Instrucciones de la Lección:</span>
            </div>
            <p className="leading-relaxed text-slate-300">
              {lesson.tip}
            </p>
            <div className="pt-2 border-t border-slate-700/60 flex justify-between text-[11px] font-bold text-slate-400">
              <span>Elementos: <strong className="text-white">{lesson.itemCount}</strong></span>
              <span>Velocidad: <strong className="text-amber-400">{lesson.cadence}s / ítem</strong></span>
            </div>
          </div>

          <button
            onClick={() => setPhase('flashing')}
            className="w-full max-w-xs btn-duo btn-duo-green py-4 rounded-2xl flex items-center justify-center space-x-2 text-base font-black mx-auto"
          >
            <Play className="w-5 h-5 fill-white" />
            <span>¡Estoy listo! Proyectar</span>
          </button>
        </div>
      )}

      {/* 2. FLASHING PHASE */}
      {phase === 'flashing' && (
        <div className="flex-1 flex flex-col justify-between my-auto text-center animate-in fade-in duration-150">
          
          <div className="flex items-center justify-center space-x-2">
            <span className="bg-slate-800 border border-slate-700 px-3 py-1 rounded-xl text-xs font-black text-amber-400 font-mono">
              ⏱️ {lesson.cadence}s por elemento
            </span>
          </div>

          {/* Flash Word Card */}
          <div className="my-auto py-12">
            <div className="bg-gradient-to-tr from-slate-900 to-slate-800 border-2 border-emerald-500/40 rounded-3xl p-8 shadow-2xl max-w-sm mx-auto animate-pop">
              {items[currentIndex]?.emoji && (
                <span className="text-6xl block mb-4">{items[currentIndex].emoji}</span>
              )}
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-wide">
                {items[currentIndex]?.text}
              </h1>
              {items[currentIndex]?.tip && (
                <p className="text-xs text-indigo-300 mt-3 italic font-semibold">
                  💡 Imagina: {items[currentIndex].tip}
                </p>
              )}
            </div>
          </div>

          <p className="text-xs text-slate-400 italic">
            Conecta la imagen actual con la anterior en una sola escena absurda...
          </p>
        </div>
      )}

      {/* 3. RECALL PHASE */}
      {phase === 'recall' && (
        <div className="flex-1 flex flex-col justify-between my-2 animate-in fade-in duration-200">
          
          <div className="text-center">
            <span className="text-xs font-black text-emerald-400 uppercase tracking-widest block mb-1">
              Pregunta {recallIndex + 1} de {items.length}
            </span>
            <h2 className="text-lg font-black text-white">
              {items[recallIndex]?.cue ? (
                <>¿Qué palabra corresponde a la casilla <strong>#{items[recallIndex].cue}</strong>?</>
              ) : (
                <>¿Cuál era el elemento <strong>#{recallIndex + 1}</strong> de la secuencia?</>
              )}
            </h2>
          </div>

          {/* Prompt Icon / Mascot */}
          <div className="my-auto flex justify-center py-4">
            <Mascot mood="thinking" size={70} />
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {options.map((opt) => {
              const isSelected = selectedOption === opt;
              let btnClass = 'btn-duo-white text-slate-800';

              if (isAnswerChecked) {
                if (opt.toLowerCase() === items[recallIndex].target.toLowerCase()) {
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
                  className={`btn-duo ${btnClass} p-3.5 rounded-2xl flex items-center justify-center text-sm font-black transition-all`}
                >
                  <span className="truncate">{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Bottom Check / Continue Bar */}
          {!isAnswerChecked ? (
            <button
              disabled={!selectedOption}
              onClick={handleCheckAnswer}
              className={`w-full btn-duo py-4 rounded-2xl flex items-center justify-center space-x-2 text-base font-black ${
                selectedOption
                  ? 'btn-duo-green cursor-pointer'
                  : 'bg-slate-800 text-slate-500 border-slate-900 cursor-not-allowed border-b-4'
              }`}
            >
              Comprobar
            </button>
          ) : (
            <div className={`p-4 rounded-2xl border flex items-center justify-between animate-in zoom-in-95 ${
              isCorrect ? 'bg-emerald-950/60 border-emerald-500/50' : 'bg-rose-950/60 border-rose-500/50'
            }`}>
              <div className="flex items-center space-x-3">
                {isCorrect ? (
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="w-8 h-8 text-rose-400 shrink-0" />
                )}
                <div>
                  <div className={`font-black text-sm ${isCorrect ? 'text-emerald-300' : 'text-rose-300'}`}>
                    {isCorrect ? '¡Excelente asociación!' : 'Solución:'}
                  </div>
                  {!isCorrect && (
                    <div className="text-xs font-bold text-white mt-0.5">
                      Era: <strong>{items[recallIndex].target}</strong>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={handleNextRecall}
                className={`btn-duo py-2.5 px-5 rounded-2xl text-xs font-black ${
                  isCorrect ? 'btn-duo-green' : 'btn-duo-rose'
                }`}
              >
                Continuar
              </button>
            </div>
          )}

        </div>
      )}

      {/* 4. RESULTS PHASE */}
      {phase === 'results' && (
        <div className="my-auto space-y-6 text-center animate-in zoom-in-95 duration-200">
          <Mascot mood="celebrating" size={90} className="justify-center" />

          <div>
            <h2 className="text-2xl font-black text-white">¡Lección Superada!</h2>
            <p className="text-xs text-slate-400 mt-1">
              Tu mente ha forjado conexiones más rápidas y resistentes.
            </p>
          </div>

          {/* Stars display */}
          <div className="flex justify-center space-x-2">
            {[1, 2, 3].map((star) => {
              const accuracy = score / items.length;
              const earned = star === 1 || (star === 2 && accuracy >= 0.7) || (star === 3 && accuracy >= 0.95);
              return (
                <Star
                  key={star}
                  className={`w-9 h-9 ${
                    earned ? 'text-amber-400 fill-amber-400 animate-bounce' : 'text-slate-700 fill-slate-700'
                  }`}
                />
              );
            })}
          </div>

          <div className="bg-slate-800/80 border border-slate-700 rounded-3xl p-5 max-w-xs mx-auto space-y-3">
            <div className="flex justify-between items-center text-xs font-bold text-slate-300">
              <span>Precisión:</span>
              <span className="text-emerald-400 font-black">{score} de {items.length} ({Math.round((score / items.length) * 100)}%)</span>
            </div>
            <div className="flex justify-between items-center text-xs font-bold text-slate-300">
              <span>Recompensa:</span>
              <span className="text-indigo-400 font-black flex items-center">
                <Zap className="w-4 h-4 mr-1 fill-indigo-400" />
                +{lesson.xp} XP
              </span>
            </div>
          </div>

          <button
            onClick={onBack}
            className="w-full max-w-xs btn-duo btn-duo-green py-3.5 rounded-2xl font-black text-sm mx-auto"
          >
            Avanzar en el Mapa
          </button>
        </div>
      )}

    </div>
  );
};
