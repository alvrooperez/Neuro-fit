import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Trophy, RotateCcw, Brain, ArrowLeft, Search, CheckCircle2, XCircle } from 'lucide-react';
import { CASILLERO_100 } from '../data/casillero';
import { playSound } from '../utils/sound';
import { triggerHaptic } from '../utils/haptics';

export const CasilleroView = ({ soundEnabled }) => {
  // Modes: 'study' | 'quiz' | 'minigame'
  const [viewMode, setViewMode] = useState('study');

  // Filter range
  const [rangeFilter, setRangeFilter] = useState('1-100');
  const [searchTerm, setSearchTerm] = useState('');

  // Quiz Drill states
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizInput, setQuizInput] = useState('');
  const [quizAnswerChecked, setQuizAnswerChecked] = useState(false);
  const [quizIsCorrect, setQuizIsCorrect] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizMistakes, setQuizMistakes] = useState([]);
  const [quizFinished, setQuizFinished] = useState(false);

  // Minigame states
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [isGameFinished, setIsGameFinished] = useState(false);

  // Filtered casillero items for study
  const getFilteredItems = () => {
    let items = CASILLERO_100;
    if (rangeFilter === '1-20') items = items.slice(0, 20);
    else if (rangeFilter === '21-40') items = items.slice(20, 40);
    else if (rangeFilter === '41-60') items = items.slice(40, 60);
    else if (rangeFilter === '61-80') items = items.slice(60, 80);
    else if (rangeFilter === '81-100') items = items.slice(80, 100);

    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      items = items.filter(
        (it) => it.num.toString().includes(term) || it.word.toLowerCase().includes(term)
      );
    }
    return items;
  };

  const normalize = (text) => {
    return text ? text.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim() : "";
  };

  const startQuiz = (count = 15) => {
    if (soundEnabled) playSound('pop');
    triggerHaptic('medium');

    const pool = [...getFilteredItems()].sort(() => 0.5 - Math.random()).slice(0, count);
    const questions = pool.map((item) => {
      const askForNumber = Math.random() > 0.5;
      return {
        number: item.num,
        word: item.word,
        emoji: item.emoji,
        type: askForNumber ? 'number' : 'word',
        prompt: askForNumber ? `${item.word} ${item.emoji}` : item.num.toString(),
        correctAnswer: askForNumber ? item.num.toString() : item.word
      };
    });

    setQuizQuestions(questions);
    setQuizIndex(0);
    setQuizInput('');
    setQuizAnswerChecked(false);
    setQuizScore(0);
    setQuizMistakes([]);
    setQuizFinished(false);
    setViewMode('quiz');
  };

  const handleCheckQuiz = (e) => {
    if (e) e.preventDefault();
    if (quizAnswerChecked || !quizInput.trim()) return;

    const currentQ = quizQuestions[quizIndex];
    const isCorrect = normalize(quizInput) === normalize(currentQ.correctAnswer);

    setQuizAnswerChecked(true);
    setQuizIsCorrect(isCorrect);

    if (isCorrect) {
      if (soundEnabled) playSound('success');
      triggerHaptic('success');
      setQuizScore((prev) => prev + 1);
    } else {
      if (soundEnabled) playSound('error');
      triggerHaptic('error');
      setQuizMistakes((prev) => [
        ...prev,
        {
          num: currentQ.number,
          word: currentQ.word,
          emoji: currentQ.emoji,
          userAnswer: quizInput
        }
      ]);
    }
  };

  const handleNextQuiz = () => {
    if (quizIndex < quizQuestions.length - 1) {
      setQuizIndex((prev) => prev + 1);
      setQuizInput('');
      setQuizAnswerChecked(false);
    } else {
      setQuizFinished(true);
      if (soundEnabled) playSound('fanfare');
      triggerHaptic('levelUp');
      confetti({ particleCount: 75, spread: 70 });
    }
  };

  const startMinigame = () => {
    if (soundEnabled) playSound('pop');
    triggerHaptic('medium');

    const sample = [...getFilteredItems()].sort(() => 0.5 - Math.random()).slice(0, 8);
    const newCards = [];
    sample.forEach((item) => {
      newCards.push({
        id: `num-${item.num}`,
        refId: item.num,
        type: 'num',
        content: item.num,
        isFlipped: false,
        isMatched: false
      });
      newCards.push({
        id: `emoji-${item.num}`,
        refId: item.num,
        type: 'emoji',
        content: item.emoji,
        isFlipped: false,
        isMatched: false
      });
    });

    newCards.sort(() => 0.5 - Math.random());
    setCards(newCards);
    setFlippedCards([]);
    setMatchedPairs(0);
    setIsLocked(false);
    setIsGameFinished(false);
    setViewMode('minigame');
  };

  const handleCardClick = (index) => {
    if (isLocked || cards[index].isFlipped || cards[index].isMatched) return;

    if (soundEnabled) playSound('click');
    triggerHaptic('light');

    const updated = [...cards];
    updated[index].isFlipped = true;
    setCards(updated);

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setIsLocked(true);
      const [firstIdx, secondIdx] = newFlipped;
      const firstCard = updated[firstIdx];
      const secondCard = updated[secondIdx];

      if (firstCard.refId === secondCard.refId) {
        if (soundEnabled) playSound('success');
        triggerHaptic('success');
        setTimeout(() => {
          firstCard.isMatched = true;
          secondCard.isMatched = true;
          setCards([...updated]);
          setFlippedCards([]);
          setIsLocked(false);
          const newMatched = matchedPairs + 1;
          setMatchedPairs(newMatched);

          if (newMatched === 8) {
            setIsGameFinished(true);
            if (soundEnabled) playSound('fanfare');
            triggerHaptic('levelUp');
            confetti({ particleCount: 70, spread: 60 });
          }
        }, 400);
      } else {
        if (soundEnabled) playSound('error');
        triggerHaptic('error');
        setTimeout(() => {
          firstCard.isFlipped = false;
          secondCard.isFlipped = false;
          setCards([...updated]);
          setFlippedCards([]);
          setIsLocked(false);
        }, 900);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 pb-28 select-none space-y-4 animate-in fade-in duration-200">
      
      {/* Top Selector: Study vs Test vs Minigame */}
      <div className="flex bg-slate-200/70 p-1 rounded-2xl border border-slate-300/60">
        <button
          onClick={() => setViewMode('study')}
          className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${
            viewMode === 'study' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          📖 Casillero 1-100
        </button>
        <button
          onClick={() => startQuiz(15)}
          className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${
            viewMode === 'quiz' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          ⚡ Test Flash
        </button>
        <button
          onClick={startMinigame}
          className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${
            viewMode === 'minigame' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          🎮 Parejas
        </button>
      </div>

      {/* 1. STUDY DIRECTORY */}
      {viewMode === 'study' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          
          <div className="bg-gradient-to-tr from-amber-500/15 to-orange-500/10 border border-amber-200 rounded-3xl p-4">
            <div className="flex items-center space-x-2 text-amber-700 mb-1">
              <Brain className="w-5 h-5" />
              <h2 className="font-black text-slate-900 text-base">Directorio del Casillero 1 al 100</h2>
            </div>
            <p className="text-xs text-slate-600">
              Convierte cualquier número en un objeto visual indestructible en tu memoria.
            </p>
          </div>

          {/* Search bar & Range pills */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por número o palabra (ej. 42, Cuna)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-amber-500 shadow-sm"
              />
            </div>

            <div className="flex overflow-x-auto gap-1.5 py-1 text-[11px] scrollbar-none font-bold">
              {['1-100', '1-20', '21-40', '41-60', '61-80', '81-100'].map((range) => (
                <button
                  key={range}
                  onClick={() => setRangeFilter(range)}
                  className={`px-3 py-1.5 rounded-xl shrink-0 transition-all ${
                    rangeFilter === range
                      ? 'bg-amber-500 text-slate-900 font-black shadow-sm'
                      : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 shadow-sm'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-2 gap-2.5 max-h-[52vh] overflow-y-auto pr-1">
            {getFilteredItems().map((item) => (
              <div
                key={item.num}
                className="card-light p-3 flex items-center space-x-2.5 hover:border-slate-300 transition-all hover:scale-[1.02]"
              >
                <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-sm shrink-0 font-black text-amber-700 font-mono">
                  {item.num}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-xl">{item.emoji}</span>
                    <span className="font-black text-slate-800 text-xs truncate">{item.word}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => startQuiz(15)}
            className="w-full btn-duo btn-duo-amber py-3.5 rounded-2xl flex items-center justify-center space-x-2 text-xs font-black text-slate-900 mt-2"
          >
            <Sparkles className="w-4 h-4 text-slate-900" />
            <span>Poner a prueba este rango con Test Flash</span>
          </button>
        </div>
      )}

      {/* 2. QUIZ MODE */}
      {viewMode === 'quiz' && (
        <div className="animate-in fade-in duration-200">
          {!quizFinished ? (
            <div>
              <div className="flex justify-between items-center mb-4">
                <button
                  onClick={() => setViewMode('study')}
                  className="p-2 rounded-2xl bg-white text-slate-500 hover:text-slate-800 border border-slate-200 shadow-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-bold text-slate-500">
                  Pregunta {quizIndex + 1} de {quizQuestions.length}
                </span>
                <span className="text-xs font-black text-amber-700 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200">
                  {quizScore} aciertos
                </span>
              </div>

              {quizQuestions[quizIndex] && (
                <div className="my-6 text-center">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                    {quizQuestions[quizIndex].type === 'number'
                      ? '¿Qué número corresponde a...?'
                      : '¿Qué palabra corresponde al número...?'}
                  </p>
                  
                  <div className="card-light p-6 shadow-md my-4 flex items-center justify-center">
                    <span className="text-4xl md:text-5xl font-black text-slate-900">
                      {quizQuestions[quizIndex].prompt}
                    </span>
                  </div>

                  <form onSubmit={handleCheckQuiz} className="space-y-3">
                    <input
                      type={quizQuestions[quizIndex].type === 'number' ? 'number' : 'text'}
                      autoFocus
                      disabled={quizAnswerChecked}
                      placeholder="Tu respuesta..."
                      value={quizInput}
                      onChange={(e) => setQuizInput(e.target.value)}
                      className="w-full bg-white border-2 border-slate-300 focus:border-amber-500 rounded-2xl py-3.5 px-4 text-center text-xl font-black text-slate-900 outline-none shadow-sm"
                    />

                    {!quizAnswerChecked ? (
                      <button
                        type="submit"
                        disabled={!quizInput.trim()}
                        className={`w-full btn-duo py-3.5 rounded-2xl text-sm font-black ${
                          quizInput.trim() ? 'btn-duo-amber text-slate-900' : 'bg-slate-200 text-slate-400 border-b-4 border-slate-300'
                        }`}
                      >
                        Comprobar
                      </button>
                    ) : (
                      <div className={`p-4 rounded-2xl border flex items-center justify-between ${
                        quizIsCorrect ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-rose-50 border-rose-300 text-rose-800'
                      }`}>
                        <div className="flex items-center space-x-2 text-left">
                          {quizIsCorrect ? <CheckCircle2 className="w-7 h-7 text-emerald-600" /> : <XCircle className="w-7 h-7 text-rose-600" />}
                          <div>
                            <span className="font-black text-xs block">{quizIsCorrect ? '¡Correcto!' : 'Incorrecto'}</span>
                            {!quizIsCorrect && (
                              <span className="font-bold text-sm">
                                Era: {quizQuestions[quizIndex].number} = {quizQuestions[quizIndex].word} {quizQuestions[quizIndex].emoji}
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleNextQuiz}
                          className={`btn-duo py-2 px-4 rounded-xl text-xs font-black ${
                            quizIsCorrect ? 'btn-duo-green' : 'btn-duo-rose'
                          }`}
                        >
                          Siguiente (Enter)
                        </button>
                      </div>
                    )}
                  </form>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6 animate-in zoom-in-95">
              <Trophy className="w-14 h-14 text-amber-500 mx-auto mb-3 animate-bounce" />
              <h2 className="text-xl font-black text-slate-900">¡Test Finalizado!</h2>
              <p className="text-xs text-slate-500 mb-6">
                Has acertado {quizScore} de {quizQuestions.length} ({Math.round((quizScore / quizQuestions.length) * 100)}%)
              </p>

              {quizMistakes.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-2xl p-4 text-left mb-6 max-h-52 overflow-y-auto shadow-sm">
                  <h4 className="text-xs font-black text-rose-600 uppercase tracking-wider mb-2">Debes repasar:</h4>
                  <div className="space-y-2 text-xs text-slate-700">
                    {quizMistakes.map((m, i) => (
                      <div key={i} className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                        <span className="font-bold">{m.num} = {m.word} {m.emoji}</span>
                        <span className="text-rose-500 text-[11px] italic">Respondiste: {m.userAnswer}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => startQuiz(15)}
                className="w-full btn-duo btn-duo-amber py-3.5 rounded-2xl text-xs font-black text-slate-900"
              >
                Volver a Entrenar
              </button>
            </div>
          )}
        </div>
      )}

      {/* 3. MINIGAME (PAIRS) */}
      {viewMode === 'minigame' && (
        <div className="animate-in fade-in duration-200">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setViewMode('study')}
              className="p-2 rounded-2xl bg-white text-slate-500 hover:text-slate-800 border border-slate-200 shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-slate-600">
              Parejas: <strong className="text-amber-600 font-black">{matchedPairs}</strong> / 8
            </span>
            <button
              onClick={startMinigame}
              className="p-2 rounded-2xl bg-white text-slate-500 hover:text-slate-800 border border-slate-200 shadow-sm active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2.5">
            {cards.map((card, idx) => {
              const isRevealed = card.isFlipped || card.isMatched;
              return (
                <button
                  key={card.id}
                  disabled={card.isMatched || isLocked}
                  onClick={() => handleCardClick(idx)}
                  className={`h-20 rounded-2xl font-black transition-all duration-200 flex items-center justify-center border-b-4 ${
                    card.isMatched
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-700 opacity-60 cursor-default'
                      : isRevealed
                      ? 'bg-white border-slate-300 text-slate-900 scale-105 shadow-md'
                      : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-400 active:scale-95'
                  }`}
                >
                  {isRevealed ? (
                    <span className={card.type === 'emoji' ? 'text-3xl' : 'text-2xl font-black text-amber-600 font-mono'}>
                      {card.content}
                    </span>
                  ) : (
                    <span className="text-xl opacity-40">🧠</span>
                  )}
                </button>
              );
            })}
          </div>

          {isGameFinished && (
            <div className="bg-white border-2 border-amber-300 rounded-3xl p-6 text-center my-6 shadow-xl animate-in zoom-in-95">
              <Trophy className="w-12 h-12 text-amber-500 mx-auto mb-2 animate-bounce" />
              <h3 className="text-lg font-black text-slate-900">¡Memoria Perfecta!</h3>
              <p className="text-xs text-slate-600 mt-1 mb-4">
                Has conectado las imágenes del casillero sin dudar.
              </p>
              <button
                onClick={startMinigame}
                className="btn-duo btn-duo-amber py-3 px-6 rounded-2xl text-xs font-black text-slate-900 mx-auto"
              >
                Jugar otra vez
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
