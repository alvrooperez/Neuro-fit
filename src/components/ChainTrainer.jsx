import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { ArrowLeft, ArrowRight, CheckCircle2, XCircle, Trophy, Zap, Link as LinkIcon, Lightbulb } from 'lucide-react';
import { WORD_BANK } from '../data/words';
import { playSound } from '../utils/sound';
import { triggerHaptic } from '../utils/haptics';
import { OracleModal } from './OracleModal';

export const ChainTrainer = ({ difficulty, onBack, onComplete, onLoseLife, soundEnabled }) => {
  const [chain, setChain] = useState([]);
  const [phase, setPhase] = useState('memorize'); // 'memorize' | 'recall' | 'results'
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(difficulty.timePerItem);
  const [oracleOpen, setOracleOpen] = useState(false);

  // Recall states
  const [recallIndex, setRecallIndex] = useState(0);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);

  const timerRef = useRef(null);

  // Setup chain
  useEffect(() => {
    const shuffled = [...WORD_BANK].sort(() => 0.5 - Math.random());
    const items = shuffled.slice(0, difficulty.count);
    setChain(items);
    setCurrentIndex(0);
    setTimeLeft(difficulty.timePerItem);
  }, [difficulty]);

  // Timer in memorize
  useEffect(() => {
    if (phase !== 'memorize' || chain.length === 0) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleNextLink();
          return difficulty.timePerItem;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [phase, currentIndex, chain.length]);

  const handleNextLink = () => {
    if (soundEnabled) playSound('tick');
    if (currentIndex < chain.length - 2) {
      setCurrentIndex((prev) => prev + 1);
      setTimeLeft(difficulty.timePerItem);
    } else {
      // Transition to recall phase
      if (soundEnabled) playSound('pop');
      triggerHaptic('medium');
      setPhase('recall');
      setRecallIndex(0);
      setupRecallQuestion(0, chain);
    }
  };

  const setupRecallQuestion = (index, items) => {
    const fromItem = items[index];
    const correctTarget = items[index + 1];

    const distractors = WORD_BANK
      .filter((w) => w.word !== correctTarget.word && w.word !== fromItem.word)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    const questionOptions = [correctTarget, ...distractors].sort(() => 0.5 - Math.random());
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

    const correctTarget = chain[recallIndex + 1];
    const correct = selectedOption.word === correctTarget.word;
    setIsAnswerChecked(true);
    setIsCorrect(correct);

    if (correct) {
      if (soundEnabled) playSound('success');
      triggerHaptic('success');
      setScore((prev) => prev + 1);
    } else {
      if (soundEnabled) playSound('error');
      triggerHaptic('error');
      onLoseLife();
    }
  };

  const handleNextRecall = () => {
    const totalQuestions = chain.length - 1;
    if (recallIndex < totalQuestions - 1) {
      const nextIdx = recallIndex + 1;
      setRecallIndex(nextIdx);
      setupRecallQuestion(nextIdx, chain);
    } else {
      // Finished!
      setPhase('results');
      if (soundEnabled) playSound('fanfare');
      triggerHaptic('levelUp');
      confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
      onComplete(difficulty.xp);
    }
  };

  if (chain.length === 0) return null;

  const currentFrom = chain[currentIndex];
  const currentTo = chain[currentIndex + 1];
  const totalSteps = chain.length - 1;

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
            <span>{phase === 'memorize' ? 'Encadenando eslabones' : 'Reconstruyendo la cadena'}</span>
            <span>
              {phase === 'memorize' ? `${currentIndex + 1}/${totalSteps}` : `${recallIndex + 1}/${totalSteps}`}
            </span>
          </div>
          <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/60">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-300"
              style={{
                width: `${
                  phase === 'memorize'
                    ? ((currentIndex + 1) / totalSteps) * 100
                    : ((recallIndex + 1) / totalSteps) * 100
                }%`
              }}
            />
          </div>
        </div>

        <div className="px-2.5 py-1 rounded-xl bg-slate-800 border border-slate-700 text-xs font-black text-amber-400">
          +{difficulty.xp}xp
        </div>
      </div>

      {/* PHASE 1: MEMORIZE CHAIN */}
      {phase === 'memorize' && (
        <div className="flex-1 flex flex-col justify-between my-2">
          <div className="text-center">
            <span className="inline-block bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider">
              Eslabón {currentIndex + 1} de {totalSteps}
            </span>
            <p className="text-xs text-slate-400 mt-1">Conecta el eslabón actual con el siguiente en una sola acción</p>
          </div>

          <div className="my-auto flex flex-col items-center">
            <div className="flex items-center justify-center space-x-3 w-full">
              {/* Item From */}
              <div className="flex-1 bg-slate-800/90 border-2 border-slate-700 rounded-3xl p-5 text-center shadow-xl">
                <span className="text-5xl block mb-2">{currentFrom.emoji}</span>
                <span className="text-lg font-black text-white">{currentFrom.word}</span>
                <span className="text-[10px] text-slate-400 block uppercase font-bold mt-1">
                  Eslabón #{currentIndex + 1}
                </span>
              </div>

              {/* Chain Link Icon */}
              <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-600/30 animate-pulse">
                <LinkIcon className="w-6 h-6" />
              </div>

              {/* Item To */}
              <div className="flex-1 bg-slate-800/90 border-2 border-slate-700 rounded-3xl p-5 text-center shadow-xl">
                <span className="text-5xl block mb-2">{currentTo.emoji}</span>
                <span className="text-lg font-black text-white">{currentTo.word}</span>
                <span className="text-[10px] text-slate-400 block uppercase font-bold mt-1">
                  Eslabón #{currentIndex + 2}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-center mb-6">
            <button
              onClick={() => setOracleOpen(true)}
              className="flex items-center space-x-2 text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 px-4 py-2 rounded-2xl text-xs font-bold transition-all active:scale-95"
            >
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span>Oráculo del Absurdo</span>
            </button>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2">
              <span>Tiempo restante</span>
              <span className="font-mono text-amber-400">{timeLeft}s</span>
            </div>
            <button
              onClick={handleNextLink}
              className="w-full btn-duo btn-duo-indigo py-4 rounded-2xl flex items-center justify-center space-x-2 text-base font-black"
            >
              <span>¡Eslabón conectado! Continuar</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* PHASE 2: RECALL CHAIN */}
      {phase === 'recall' && (
        <div className="flex-1 flex flex-col justify-between my-2">
          <div className="text-center">
            <h2 className="text-lg font-black text-white mb-1">
              ¿Qué objeto venía después de...?
            </h2>
            <p className="text-xs text-slate-400 font-semibold">
              Sigue el hilo de tu historia encadenada
            </p>
          </div>

          <div className="my-auto flex flex-col items-center">
            <div className="bg-gradient-to-tr from-indigo-600 to-purple-600 p-6 rounded-3xl text-center shadow-2xl border-2 border-indigo-400/30 w-full max-w-xs animate-in zoom-in-95 duration-200">
              <span className="text-6xl block mb-2">{chain[recallIndex].emoji}</span>
              <span className="text-2xl font-black text-white">{chain[recallIndex].word}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            {options.map((opt) => {
              const isSelected = selectedOption?.word === opt.word;
              let btnClass = 'btn-duo-white text-slate-800';

              if (isAnswerChecked) {
                if (opt.word === chain[recallIndex + 1].word) {
                  btnClass = 'btn-duo-green text-white border-emerald-600';
                } else if (isSelected) {
                  btnClass = 'btn-duo-rose text-white border-rose-600';
                }
              } else if (isSelected) {
                btnClass = 'btn-duo-indigo text-white';
              }

              return (
                <button
                  key={opt.word}
                  disabled={isAnswerChecked}
                  onClick={() => handleSelectOption(opt)}
                  className={`btn-duo ${btnClass} p-3.5 rounded-2xl flex items-center justify-center space-x-2 text-sm font-black transition-all`}
                >
                  <span className="text-2xl">{opt.emoji}</span>
                  <span className="truncate">{opt.word}</span>
                </button>
              );
            })}
          </div>

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
            <div className={`p-4 rounded-2xl border flex items-center justify-between animate-in fade-in slide-in-from-bottom-2 ${
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
                    {isCorrect ? '¡Cadena intacta!' : '¡Ruptura de cadena!'}
                  </div>
                  {!isCorrect && (
                    <div className="text-xs font-bold text-white flex items-center space-x-1 mt-0.5">
                      <span>{chain[recallIndex + 1].emoji}</span>
                      <span>{chain[recallIndex + 1].word}</span>
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

      {/* PHASE 3: RESULTS */}
      {phase === 'results' && (
        <div className="flex-1 flex flex-col items-center justify-center text-center my-auto animate-in zoom-in-95 duration-300">
          <div className="w-20 h-20 rounded-full bg-indigo-500/20 border-2 border-indigo-500/50 flex items-center justify-center text-indigo-400 mb-4 animate-bounce">
            <Trophy className="w-10 h-10" />
          </div>

          <h2 className="text-2xl font-black text-white mb-2">¡Cadena Completada!</h2>
          <p className="text-sm text-slate-400 mb-6 max-w-xs">
            Has mantenido viva una película mental de {chain.length} eslabones sin perder el hilo.
          </p>

          <div className="bg-slate-800/80 border border-slate-700 rounded-3xl p-5 w-full max-w-xs mb-8 space-y-3">
            <div className="flex justify-between items-center text-sm font-bold text-slate-300">
              <span>Eslabones superados:</span>
              <span className="text-emerald-400 font-black">{score} de {totalSteps}</span>
            </div>
            <div className="flex justify-between items-center text-sm font-bold text-slate-300">
              <span>Experiencia:</span>
              <span className="text-indigo-400 font-black flex items-center">
                <Zap className="w-4 h-4 mr-1 fill-indigo-400" />
                +{difficulty.xp} XP
              </span>
            </div>
          </div>

          <button
            onClick={onBack}
            className="w-full max-w-xs btn-duo btn-duo-indigo py-3.5 rounded-2xl font-black text-sm"
          >
            Volver al Menú de Retos
          </button>
        </div>
      )}

      <OracleModal
        isOpen={oracleOpen}
        onClose={() => setOracleOpen(false)}
        itemA={currentFrom}
        itemB={currentTo}
        soundEnabled={soundEnabled}
      />

    </div>
  );
};
