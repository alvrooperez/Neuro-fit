import React, { useState } from 'react';
import { CHAPTERS, LESSONS } from '../data/lessons';
import { Mascot } from './Mascot';
import { Lock, Star, Check, Zap, Play, Trophy, Sparkles } from 'lucide-react';
import { playSound } from '../utils/sound';
import { triggerHaptic } from '../utils/haptics';

export const SagaPath = ({ userProgress, onSelectLesson, soundEnabled }) => {
  // Modal for lesson details
  const [activeLessonModal, setActiveLessonModal] = useState(null);

  const highestUnlocked = userProgress.highestUnlocked || 1;
  const lessonScores = userProgress.lessonScores || {}; // { [lessonId]: { stars, xp } }

  const handleNodeClick = (lesson) => {
    const isUnlocked = lesson.id <= highestUnlocked;
    if (!isUnlocked) {
      if (soundEnabled) playSound('error');
      triggerHaptic('error');
      return;
    }

    if (soundEnabled) playSound('click');
    triggerHaptic('light');
    setActiveLessonModal(lesson);
  };

  const handleStart = (lesson) => {
    if (soundEnabled) playSound('pop');
    triggerHaptic('medium');
    setActiveLessonModal(null);
    onSelectLesson(lesson);
  };

  // Group lessons by chapter
  const chapterLessons = (chapterId) => LESSONS.filter(l => l.chapterId === chapterId);

  return (
    <div className="max-w-md mx-auto p-4 pb-28 select-none space-y-8 animate-in fade-in duration-200">
      
      {/* Top Welcome / Motivation with Mascot */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 shadow-xl">
        <Mascot
          mood="happy"
          size={60}
          speech="¡Bienvenido a la Ruta Mnemotécnica! Cada lección bajará tu tiempo y aumentará tus palabras."
        />
      </div>

      {/* Chapters & Zig-zag Nodes */}
      {CHAPTERS.map((chapter) => {
        const lessons = chapterLessons(chapter.id);
        const chapterUnlocked = lessons.some(l => l.id <= highestUnlocked);

        return (
          <div key={chapter.id} className="space-y-4">
            
            {/* Chapter Banner */}
            <div className={`p-4 rounded-3xl bg-gradient-to-r ${chapter.color} text-white shadow-xl relative overflow-hidden`}>
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-xl">{chapter.icon}</span>
                <span className="text-xs font-black uppercase tracking-wider opacity-90">
                  Capítulo {chapter.id}
                </span>
              </div>
              <h2 className="text-base font-black tracking-tight">{chapter.title}</h2>
              <p className="text-xs opacity-90 mt-0.5">{chapter.subtitle}</p>
            </div>

            {/* Zig-Zag Level Nodes */}
            <div className="flex flex-col items-center space-y-6 py-2">
              {lessons.map((lesson, idx) => {
                const isUnlocked = lesson.id <= highestUnlocked;
                const isCurrent = lesson.id === highestUnlocked;
                const scoreData = lessonScores[lesson.id];
                const stars = scoreData?.stars || 0;

                // Zig-zag offset: -40px, 0px, +40px, 0px...
                const offsets = [0, 36, 0, -36];
                const xOffset = offsets[idx % offsets.length];

                return (
                  <div
                    key={lesson.id}
                    style={{ transform: `translateX(${xOffset}px)` }}
                    className="flex flex-col items-center relative group"
                  >
                    {/* Pulsing halo for current active lesson */}
                    {isCurrent && (
                      <div className="absolute -inset-2 rounded-full bg-emerald-500/30 animate-ping pointer-events-none" />
                    )}

                    {/* Node Button */}
                    <button
                      onClick={() => handleNodeClick(lesson)}
                      className={`w-16 h-16 rounded-full flex flex-col items-center justify-center relative transition-transform active:scale-95 shadow-xl border-b-4 ${
                        isCurrent
                          ? 'bg-emerald-500 hover:bg-emerald-400 border-emerald-700 text-white animate-bounceShort'
                          : isUnlocked
                          ? 'bg-indigo-600 hover:bg-indigo-500 border-indigo-800 text-white'
                          : 'bg-slate-800 border-slate-900 text-slate-500 cursor-not-allowed opacity-75'
                      }`}
                    >
                      {/* Icon */}
                      <span className="text-2xl">
                        {!isUnlocked ? (
                          <Lock className="w-6 h-6 text-slate-500" />
                        ) : stars === 3 ? (
                          <Check className="w-7 h-7 text-amber-300 stroke-[3]" />
                        ) : (
                          lesson.icon
                        )}
                      </span>
                    </button>

                    {/* Stars row under node */}
                    {isUnlocked && (
                      <div className="flex items-center space-x-0.5 mt-1.5">
                        {[1, 2, 3].map((s) => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${
                              s <= stars
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-slate-700 fill-slate-700'
                            }`}
                          />
                        ))}
                      </div>
                    )}

                    {/* Lesson Label */}
                    <span className="text-[11px] font-black text-slate-300 mt-1 max-w-[110px] text-center truncate">
                      {lesson.title}
                    </span>
                  </div>
                );
              })}
            </div>

          </div>
        );
      })}

      {/* Pre-flight Lesson Modal */}
      {activeLessonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border-2 border-emerald-500/50 rounded-3xl p-6 w-full max-w-sm shadow-2xl space-y-4">
            
            <div className="text-center">
              <span className="text-4xl block mb-2">{activeLessonModal.icon}</span>
              <h3 className="text-lg font-black text-white">{activeLessonModal.title}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{activeLessonModal.subtitle}</p>
            </div>

            {/* Target specs */}
            <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-3 flex justify-around text-center text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Palabras</span>
                <span className="font-black text-white text-base">{activeLessonModal.itemCount}</span>
              </div>
              <div className="w-px h-8 bg-slate-700" />
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Velocidad</span>
                <span className="font-black text-amber-400 text-base">{activeLessonModal.cadence}s</span>
              </div>
              <div className="w-px h-8 bg-slate-700" />
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">XP</span>
                <span className="font-black text-indigo-400 text-base">+{activeLessonModal.xp}</span>
              </div>
            </div>

            {/* Tip box */}
            <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-2xl p-3 text-xs text-emerald-200 leading-relaxed">
              💡 <strong>Consejo:</strong> {activeLessonModal.tip}
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => setActiveLessonModal(null)}
                className="btn-duo btn-duo-slate py-3 rounded-2xl text-xs font-black text-slate-300"
              >
                Volver
              </button>
              <button
                onClick={() => handleStart(activeLessonModal)}
                className="btn-duo btn-duo-green py-3 rounded-2xl text-xs font-black text-white flex items-center justify-center space-x-1"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>¡Empezar!</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
