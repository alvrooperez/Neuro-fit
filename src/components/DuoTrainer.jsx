import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { ArrowLeft, Lightbulb, CheckCircle2, XCircle, ArrowRight, Zap, Trophy, RotateCcw } from 'lucide-react';
import { WORD_BANK } from '../data/words';
import { OracleModal } from './OracleModal';
import { playSound } from '../utils/sound';
import { triggerHaptic } from '../utils/haptics';

export const DuoTrainer = ({ difficulty, onBack, onComplete, onLoseLife, soundEnabled }) => {
  // Phase: 'memorize' | 'recall' | 'results'
  const [phase, setPhase] = useState('memorize');
  const [pairs, setPairs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(difficulty.timePerPair);
  const [oracleOpen, setOracleOpen] = useState(false);

  // Recall states
  const [recallIndex, setRecallIndex] = useState(0);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);

  const timerRef = useRef(null);

  // 1. Initialize pairs on mount
  useEffect(() => {
    const shuffled = [...WORD_BANK].sort(() => 0.5 - Math.random());
    const generatedPairs = [];
    for (let i = 0; i < difficulty.pairs; i++) {
      generatedPairs.push({
        itemA: shuffled[i * 2],
        itemB: shuffled[i * 2 + 1]
      });
    }
    setPairs(generatedPairs);
    setCurrentIndex(0);
    setTimeLeft(difficulty.timePerPair);
  }, [difficulty]);

  // 2. Timer during 'memorize' phase
  useEffect(() => {
    if (phase !== 'memorize' || pairs.length === 0) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleNextPair();
          return difficulty.timePerPair;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [phase, currentIndex, pairs.length]);

  const handleNextPair = () => {
    if (soundEnabled) playSound('tick');
    if (currentIndex < pairs.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setTimeLeft(difficulty.timePerPair);
    } else {
      // Transition to recall phase!
      if (soundEnabled) playSound('pop');
      triggerHaptic('medium');
      setPhase('recall');
      setRecallIndex(0);
      setupRecallQuestion(0, pairs);
    }
  };

  // 3. Setup recall questions (options)
  const setupRecallQuestion = (index, allPairs) => {
    if (!allPairs || allPairs.length === 0) return;
    const currentPair = allPairs[index];
    const correctAnswer = currentPair.itemB;

    // Distractors from other words
    const distractors = WORD_BANK
      .filter((w) => w.word !== correctAnswer.word && w.word !== currentPair.itemA.word)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    const questionOptions = [correctAnswer, ...distractors].sort(() => 0.5 - Math.random());
    setOptions(questionOptions);
    setSelectedOption(null);
    setIsAnswerChecked(false);
  };

  const handleSelectOption = (option) => {
    if (isAnswerChecked) return;
    if (soundEnabled) playSound('click');
    triggerHaptic('light');
    setSelectedOption(option);
  };

  const handleCheckAnswer = () => {
    if (!selectedOption || isAnswerChecked) return;

    const currentPair = pairs[recallIndex];
    const correct = selectedOption.word === currentPair.itemB.word;
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
    if (recallIndex < pairs.length - 1) {
      const nextIdx = recallIndex + 1;
      setRecallIndex(nextIdx);
      setupRecallQuestion(nextIdx, pairs);
    } else {
      // Finished all questions!
      const finalScore = score + (isCorrect ? 0 : 0); // score already updated
      finishChallenge();
    }
  };

  const finishChallenge = () => {
    setPhase('results');
    if (soundEnabled) playSound('fanfare');
    triggerHaptic('levelUp');
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    onComplete(difficulty.xp);
  };

  if (pairs.length === 0) return null;

  const currentPair = pairs[currentIndex];
  const currentRecallPair = pairs[recallIndex];

  return (
    <div className="max-w-md mx-auto min-h-[calc(100dvh-4rem)] flex flex-col justify-between p-4 pb-24 select-none">
      
      {/* Top Bar with Back and Progress */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          className="p-2 rounded-2xl bg-slate-800 text-slate-400 hover:text-white border border-slate-700 active:scale-95"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Phase Progress Bar */}
        <div className="flex-1 mx-4">
          <div className="flex justify-between text-xs font-bold text-slate-400 mb-1">
            <span>{phase === 'memorize' ? 'Fase 1: Visualización' : phase === 'recall' ? 'Fase 2: Comprobación' : 'Resultados'}</span>
            <span>
              {phase === 'memorize' 
                ? `${currentIndex + 1}/${pairs.length}` 
                : phase === 'recall' 
                  ? `${recallIndex + 1}/${pairs.length}` 
                  : 'Completado'}
            </span>
          </div>
          <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/60">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                phase === 'memorize' ? 'bg-emerald-500' : 'bg-indigo-500'
              }`}
              style={{
                width: `${
                  phase === 'memorize'
                    ? ((currentIndex + 1) / pairs.length) * 100
                    : phase === 'recall'
                    ? ((recallIndex + 1) / pairs.length) * 100
                    : 100
                }%`
              }}
            />
          </div>
        </div>

        {/* Phase Indicator Badge */}
        <div className="px-2.5 py-1 rounded-xl bg-slate-800 border border-slate-700 text-xs font-black text-amber-400">
          +{difficulty.xp}xp
        </div>
      </div>

      {/* PHASE 1: MEMORIZE (VISUALIZATION) */}
      {phase === 'memorize' && (
        <div className="flex-1 flex flex-col justify-between my-2">
          
          {/* Instruction Pill */}
          <div className="text-center">
            <span className="inline-block bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider">
              Crea una escena absurda en tu mente
            </span>
          </div>

          {/* Cards Display */}
          <div className="my-auto grid grid-cols-2 gap-4">
            {/* Item A */}
            <div className="bg-slate-800/90 border-2 border-slate-700/80 rounded-3xl p-5 text-center shadow-xl animate-in zoom-in-95 duration-200">
              <div className="text-6xl mb-3 transform hover:scale-110 transition-transform">
                {currentPair.itemA.emoji}
              </div>
              <div className="text-xl font-black text-white tracking-wide">
                {currentPair.itemA.word}
              </div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                {currentPair.itemA.category}
              </span>
            </div>

            {/* Item B */}
            <div className="bg-slate-800/90 border-2 border-slate-700/80 rounded-3xl p-5 text-center shadow-xl animate-in zoom-in-95 duration-200 delay-75">
              <div className="text-6xl mb-3 transform hover:scale-110 transition-transform">
                {currentPair.itemB.emoji}
              </div>
              <div className="text-xl font-black text-white tracking-wide">
                {currentPair.itemB.word}
              </div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                {currentPair.itemB.category}
              </span>
            </div>
          </div>

          {/* Absurd Oracle Button */}
          <div className="flex justify-center mb-6">
            <button
              onClick={() => setOracleOpen(true)}
              className="flex items-center space-x-2 text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 px-4 py-2 rounded-2xl text-xs font-bold transition-all active:scale-95"
            >
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span>¿Bloqueado? Inspiración absurda</span>
            </button>
          </div>

          {/* Bottom Action & Timer */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2">
              <span>Tiempo de visualización</span>
              <span className="font-mono text-amber-400">{timeLeft}s</span>
            </div>
            <button
              onClick={handleNextPair}
              className="w-full btn-duo btn-duo-green py-4 rounded-2xl flex items-center justify-center space-x-2 text-base font-black"
            >
              <span>¡Imagen creada! Siguiente</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* PHASE 2: RECALL TEST */}
      {phase === 'recall' && (
        <div className="flex-1 flex flex-col justify-between my-2">
          
          <div className="text-center">
            <h2 className="text-lg font-black text-white mb-1">
              ¿Cuál era la pareja absurda de...?
            </h2>
            <p className="text-xs text-slate-400 font-semibold">
              Busca en tu memoria la imagen estrafalaria que creaste
            </p>
          </div>

          {/* Target Item Prompt */}
          <div className="my-auto flex flex-col items-center">
            <div className="bg-gradient-to-tr from-indigo-600 to-purple-600 p-6 rounded-3xl text-center shadow-2xl border-2 border-indigo-400/30 w-full max-w-xs animate-in zoom-in-95 duration-200">
              <span className="text-6xl block mb-2">{currentRecallPair.itemA.emoji}</span>
              <span className="text-2xl font-black text-white">{currentRecallPair.itemA.word}</span>
            </div>
          </div>

          {/* 4 Options Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {options.map((opt) => {
              const isSelected = selectedOption?.word === opt.word;
              let btnClass = 'btn-duo-white text-slate-800';

              if (isAnswerChecked) {
                if (opt.word === currentRecallPair.itemB.word) {
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

          {/* Duolingo Check / Continue Bottom Bar */}
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
                    {isCorrect ? '¡Impresionante memoria!' : '¡Casi! Era:'}
                  </div>
                  {!isCorrect && (
                    <div className="text-xs font-bold text-white flex items-center space-x-1 mt-0.5">
                      <span>{currentRecallPair.itemB.emoji}</span>
                      <span>{currentRecallPair.itemB.word}</span>
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

      {/* PHASE 3: RESULTS SCREEN */}
      {phase === 'results' && (
        <div className="flex-1 flex flex-col items-center justify-center text-center my-auto animate-in zoom-in-95 duration-300">
          <div className="w-20 h-20 rounded-full bg-amber-500/20 border-2 border-amber-500/50 flex items-center justify-center text-amber-400 mb-4 animate-bounce">
            <Trophy className="w-10 h-10" />
          </div>

          <h2 className="text-2xl font-black text-white mb-2">¡Reto Superado!</h2>
          <p className="text-sm text-slate-400 mb-6 max-w-xs">
            Tu cerebro está forjando conexiones neuronales ultrarrápidas con imágenes absurdas.
          </p>

          <div className="bg-slate-800/80 border border-slate-700 rounded-3xl p-5 w-full max-w-xs mb-8 space-y-3">
            <div className="flex justify-between items-center text-sm font-bold text-slate-300">
              <span>Aciertos:</span>
              <span className="text-emerald-400 font-black">{score} de {pairs.length} ({Math.round((score / pairs.length) * 100)}%)</span>
            </div>
            <div className="flex justify-between items-center text-sm font-bold text-slate-300">
              <span>Experiencia:</span>
              <span className="text-indigo-400 font-black flex items-center">
                <Zap className="w-4 h-4 mr-1 fill-indigo-400" />
                +{difficulty.xp} XP
              </span>
            </div>
          </div>

          <div className="w-full max-w-xs space-y-3">
            <button
              onClick={onBack}
              className="w-full btn-duo btn-duo-green py-3.5 rounded-2xl font-black text-sm"
            >
              Volver al Menú de Retos
            </button>
          </div>
        </div>
      )}

      {/* Absurd Oracle Modal */}
      <OracleModal
        isOpen={oracleOpen}
        onClose={() => setOracleOpen(false)}
        itemA={currentPair?.itemA}
        itemB={currentPair?.itemB}
        soundEnabled={soundEnabled}
      />

    </div>
  );
};
