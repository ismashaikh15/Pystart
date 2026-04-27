/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Sparkles, 
  ChevronRight, 
  Play, 
  RotateCcw, 
  Lightbulb,
  MessageSquare,
  Box,
  Split,
  CircleArrowRight
} from 'lucide-react';
import { LESSONS } from './constants';
import { UserProgress, Lesson, AIResponse } from './types';
import { getFeedback, simplifyExplanation } from './services/geminiService';

// --- Sub-components ---

const IconMap: Record<string, React.ReactNode> = {
  MessageSquare: <MessageSquare size={24} />,
  Box: <Box size={24} />,
  Split: <Split size={24} />,
};

export default function App() {
  const [progress, setProgress] = useState<UserProgress>({
    completedLessons: [],
    currentLessonId: LESSONS[0].id,
    stars: 0
  });
  
  const [code, setCode] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [aiResult, setAiResult] = useState<AIResponse | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [learningMode, setLearningMode] = useState<'roadmap' | 'lesson' | 'parent'>('roadmap');

  const currentLesson = LESSONS.find(l => l.id === progress.currentLessonId) || LESSONS[0];

  useEffect(() => {
    setCode(currentLesson.challenge.starterCode);
    setAiResult(null);
    setShowHint(false);
  }, [currentLesson]);

  const stats = {
    accuracy: 85,
    timeSpent: '45 minutes',
    achievements: progress.completedLessons.length
  };

  const handleRunCode = async () => {
    if (!code.trim()) return;
    setIsEvaluating(true);
    const feedback = await getFeedback(code, currentLesson.title, currentLesson.challenge.instruction);
    setAiResult(feedback);
    setIsEvaluating(false);

    if (feedback.isCorrect) {
      if (!progress.completedLessons.includes(currentLesson.id)) {
        setProgress(prev => ({
          ...prev,
          completedLessons: [...prev.completedLessons, currentLesson.id],
          stars: prev.stars + 10
        }));
      }
    }
  };

  const handleNextLesson = () => {
    const currentIndex = LESSONS.findIndex(l => l.id === currentLesson.id);
    if (currentIndex < LESSONS.length - 1) {
      setProgress(prev => ({
        ...prev,
        currentLessonId: LESSONS[currentIndex + 1].id
      }));
      setLearningMode('lesson');
    } else {
       setLearningMode('roadmap');
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-brand-bg text-brand-ink">
      {/* Navbar */}
      <nav className="h-16 px-8 flex items-center justify-between sleek-glass sticky top-0 z-50">
        <div 
          className="flex items-center gap-3 cursor-pointer group" 
          onClick={() => setLearningMode('roadmap')}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center shadow-lg shadow-brand-primary/20 transition-transform group-hover:scale-105">
            <span className="text-2xl">🐍</span>
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">
            PyStart
          </span>
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={() => setLearningMode('parent')}
            className="text-brand-muted hover:text-brand-primary font-bold text-xs uppercase tracking-widest transition-colors outline-none"
          >
            Parent Zone
          </button>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-800/80 px-4 py-1.5 rounded-full border border-slate-700">
              <span className="text-brand-primary font-bold text-sm">Lv. {progress.completedLessons.length + 1}</span>
              <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-brand-primary transition-all duration-500" 
                  style={{ width: `${(progress.completedLessons.length / LESSONS.length) * 100}%` }}
                />
              </div>
            </div>
            <div className="flex items-center gap-1.5 font-mono font-bold text-brand-accent">
              <span>⭐</span>
              <span>{progress.stars.toLocaleString()}</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-brand-panel border-2 border-brand-primary/50 p-1 overflow-hidden">
              <div className="w-full h-full rounded-full bg-brand-border flex items-center justify-center">👤</div>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {learningMode === 'roadmap' ? (
            <motion.div 
              key="roadmap"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto py-12 px-6"
            >
              <div className="text-center mb-16 px-4">
                <span className="text-[10px] font-black text-brand-primary uppercase tracking-[0.4em] mb-4 block">Adventure Protocol</span>
                <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight leading-tight">Your Python Journey!</h2>
                <p className="text-brand-muted font-medium max-w-lg mx-auto italic leading-relaxed">Master the syntax, earn your stars, and become the ultimate explorer.</p>
              </div>

              <div className="relative">
                <div className="absolute left-1/2 top-4 bottom-4 w-[2px] bg-gradient-to-b from-brand-primary/0 via-brand-primary/20 to-brand-primary/0 -translate-x-1/2" />
                
                <div className="space-y-20 relative px-4">
                  {LESSONS.map((lesson, idx) => {
                    const isCompleted = progress.completedLessons.includes(lesson.id);
                    const isUnlocked = idx === 0 || progress.completedLessons.includes(LESSONS[idx-1]?.id);
                    
                    return (
                      <motion.div 
                        key={lesson.id}
                        initial={false}
                        whileHover={isUnlocked ? { scale: 1.02, x: idx % 2 === 0 ? -5 : 5 } : {}}
                        className={`relative flex items-center gap-6 md:gap-16 ${idx % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                      >
                        <div className={`flex-1 flex ${idx % 2 === 0 ? 'justify-end text-right' : 'justify-start text-left'}`}>
                          <div className={`max-w-[280px] transition-all duration-300 ${isUnlocked ? 'text-slate-200 opacity-100' : 'text-slate-700 opacity-50'}`}>
                            <h3 className="text-xl font-bold mb-1 tracking-tight">{lesson.title}</h3>
                            <p className="text-xs text-brand-muted font-medium leading-relaxed">{lesson.description}</p>
                          </div>
                        </div>

                        <div className="relative flex-shrink-0">
                          {isUnlocked && !isCompleted && (
                            <div className="absolute inset-0 bg-brand-primary/30 blur-2xl animate-pulse rounded-full" />
                          )}
                          <button 
                            onClick={() => isUnlocked && (setProgress(p => ({ ...p, currentLessonId: lesson.id })), setLearningMode('lesson'))}
                            disabled={!isUnlocked}
                            className={`
                              relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 border-2
                              ${isCompleted 
                                ? 'bg-brand-primary/10 border-brand-primary text-brand-primary shadow-[0_0_20px_rgba(16,185,129,0.2)]' 
                                : isUnlocked 
                                  ? 'bg-slate-900 border-slate-800 text-slate-300 hover:border-brand-primary hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] cursor-pointer' 
                                  : 'bg-slate-950 border-slate-800 text-slate-800 cursor-not-allowed'}
                            `}
                          >
                            {isCompleted ? <Trophy size={24} /> : IconMap[lesson.icon] || <RotateCcw size={24} />}
                          </button>
                        </div>

                        <div className="flex-1 hidden md:block" />
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          ) : learningMode === 'parent' ? (
            <motion.div 
              key="parent"
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              className="max-w-4xl mx-auto py-12 px-6"
            >
              <div className="sleek-card overflow-hidden">
                <div className="bg-gradient-to-br from-brand-panel p-12 lg:p-16 border-b border-brand-border relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-brand-secondary/5 blur-[100px] pointer-events-none" />
                  <span className="text-[10px] font-black text-brand-secondary uppercase tracking-[0.5em] mb-4 block">Secure Administrator Access</span>
                  <h2 className="text-4xl font-black text-white mb-2 leading-none uppercase tracking-tighter">Parent Console</h2>
                  <p className="text-brand-muted font-medium italic opacity-70">Real-time mastery tracking and behavioral analytics.</p>
                </div>

                <div className="p-8 lg:p-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-slate-950/40 p-8 rounded-[32px] border border-brand-border/40 hover:border-brand-border transition-colors">
                    <p className="text-[10px] uppercase font-black text-slate-500 tracking-[0.2em] mb-3">Focus Session</p>
                    <p className="text-4xl font-black text-white tracking-tighter">{stats.timeSpent}</p>
                  </div>
                  <div className="bg-brand-primary/5 p-8 rounded-[32px] border border-brand-primary/20 hover:border-brand-primary/40 transition-colors">
                    <p className="text-[10px] uppercase font-black text-brand-primary/60 tracking-[0.2em] mb-3">Accuracy Logic</p>
                    <p className="text-4xl font-black text-brand-primary tracking-tighter">{stats.accuracy}%</p>
                  </div>
                  <div className="bg-brand-secondary/5 p-8 rounded-[32px] border border-brand-secondary/20 hover:border-brand-secondary/40 transition-colors">
                    <p className="text-[10px] uppercase font-black text-brand-secondary/60 tracking-[0.2em] mb-3">Mastery Level</p>
                    <p className="text-4xl font-black text-brand-secondary tracking-tighter">{stats.achievements}<span className="text-xl opacity-30 mx-1">/</span>{LESSONS.length}</p>
                  </div>
                </div>

                <div className="px-8 lg:px-12 pb-16">
                  <div className="flex items-center gap-4 mb-8">
                     <h3 className="text-xs font-black text-white uppercase tracking-[0.3em] opacity-40">Operational Logs</h3>
                     <div className="h-px flex-1 bg-brand-border/40" />
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    {progress.completedLessons.map(id => {
                      const l = LESSONS.find(lesson => lesson.id === id);
                      return (
                        <div key={id} className="flex justify-between items-center bg-slate-950/20 p-6 rounded-2xl border border-brand-border/30 group hover:bg-slate-950/40 hover:border-brand-primary/40 transition-all duration-300">
                          <div className="flex items-center gap-5">
                            <div className="w-12 h-12 bg-brand-primary/10 text-brand-primary rounded-xl flex items-center justify-center border border-brand-primary/10 shadow-inner">
                              <Trophy size={20} />
                            </div>
                            <div>
                               <span className="font-bold text-slate-200 block mb-0.5">{l?.title}</span>
                               <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Success Grade: A+</span>
                            </div>
                          </div>
                          <div className="text-right">
                             <div className="flex items-center gap-2 justify-end mb-1">
                               <span className="h-1.5 w-1.5 rounded-full bg-brand-primary shadow-[0_0_8px_#10b981]" />
                               <span className="text-[10px] font-black text-brand-primary uppercase tracking-[0.1em]">Verified</span>
                             </div>
                             <span className="text-[9px] text-slate-600 font-bold">2026-04-23</span>
                          </div>
                        </div>
                      )
                    })}
                    {progress.completedLessons.length === 0 && (
                      <div className="text-center py-16 sleek-glass rounded-[32px] border-dashed">
                        <p className="text-brand-muted italic text-sm font-medium opacity-50 uppercase tracking-widest">Awaiting First Log Initialization...</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="lesson"
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
              className="max-w-[1500px] mx-auto w-full h-[calc(100vh-64px)] p-6 lg:p-8 flex gap-8"
            >
              {/* Left Column: Mission Information */}
              <div className="w-[480px] flex flex-col gap-6">
                <div className="sleek-card p-10 flex-1 flex flex-col relative overflow-hidden border-2 border-brand-border">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 blur-[80px] pointer-events-none" />
                  
                  <div className="flex items-center justify-between mb-8">
                    <div className="bg-brand-primary/10 border border-brand-primary/40 px-4 py-1.5 rounded-xl text-brand-primary text-[10px] font-black uppercase tracking-[0.2em]">
                      Module {currentLesson.level}
                    </div>
                    <div className="flex gap-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
                       <div className="w-1.5 h-1.5 rounded-full bg-brand-border" />
                       <div className="w-1.5 h-1.5 rounded-full bg-brand-border" />
                    </div>
                  </div>

                  <h2 className="text-4xl font-black text-white mb-8 leading-[1.1] tracking-tighter">
                    {currentLesson.title}
                  </h2>

                  <div className="flex-1 overflow-y-auto pr-4 space-y-10 custom-scrollbar pb-6 text-sm">
                    <section>
                      <h4 className="text-[9px] uppercase font-black text-brand-primary tracking-[0.4em] mb-4 opacity-70">Case File</h4>
                      <p className="text-slate-200 font-medium leading-relaxed italic border-l-[3px] border-brand-primary/30 pl-6 text-base shadow-sm">
                        {currentLesson.description}
                      </p>
                    </section>

                    <section>
                      <h4 className="text-[9px] uppercase font-black text-brand-secondary tracking-[0.4em] mb-4 opacity-70">Technical Brief</h4>
                      <p className="text-slate-400 font-medium leading-relaxed mb-6">
                        {currentLesson.explanation}
                      </p>
                      <div className="bg-slate-950/80 p-6 rounded-2xl font-mono text-sm border border-brand-border text-brand-secondary shadow-2xl relative group">
                        <div className="absolute top-3 right-4 text-[10px] text-slate-800 uppercase tracking-widest font-black">Schema</div>
                        <pre className="whitespace-pre-wrap">{currentLesson.example}</pre>
                      </div>
                    </section>

                    <section className="bg-indigo-500/5 p-8 rounded-[32px] border border-indigo-500/20 relative group overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 blur-3xl" />
                      <div className="absolute -top-3 -left-3 bg-indigo-500 w-10 h-10 rounded-2xl flex items-center justify-center text-xl shadow-lg shadow-indigo-500/20">🎯</div>
                      <h4 className="text-[10px] uppercase font-black text-indigo-300 tracking-[0.3em] mb-4">Prime Objective</h4>
                      <p className="text-indigo-50 font-bold leading-relaxed text-base">{currentLesson.challenge.instruction}</p>
                    </section>
                  </div>

                  <div className="mt-8 pt-8 border-t border-brand-border/40 flex gap-4">
                    <button 
                      onClick={() => setShowHint(!showHint)}
                      className="flex-1 flex items-center justify-center gap-3 p-5 rounded-2xl bg-slate-900 hover:bg-slate-800 transition-all text-slate-300 font-bold border border-slate-700 active:scale-95 group"
                    >
                      <Lightbulb size={22} className={showHint ? "text-brand-accent transform scale-110 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]" : "text-slate-600 group-hover:text-amber-500/50 transition-colors"} />
                      <span className="uppercase text-xs tracking-widest">{showHint ? "Conceal Strategy" : "Override Hint"}</span>
                    </button>
                  </div>

                  <AnimatePresence>
                    {showHint && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-5 p-6 bg-slate-950 rounded-2xl text-sm italic text-amber-200/60 leading-relaxed border border-amber-500/10 shadow-inner">
                          <span className="text-amber-500 font-black not-italic block mb-1 uppercase text-[9px] tracking-widest">Tactical Support:</span>
                          "{currentLesson.challenge.hint}"
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* AI Coach Overlay */}
                <AnimatePresence>
                  {aiResult && !aiResult.isCorrect && (
                    <motion.div 
                      key="feedback"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 30 }}
                      className="bg-gradient-to-br from-brand-panel p-6 lg:p-8 flex gap-6 items-start rounded-[40px] border-2 border-brand-primary/20 shadow-2xl relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-brand-primary/5 opacity-50 blur-3xl pointer-events-none" />
                      <div className="w-16 h-16 bg-white/5 rounded-3xl flex-shrink-0 flex items-center justify-center text-4xl shadow-inner border border-white/10 group-hover:rotate-6 transition-transform">🐍</div>
                      <div className="flex-1 relative">
                        <p className="text-[10px] font-black text-brand-primary uppercase tracking-[0.4em] mb-3">Neural Feedback Link</p>
                        <p className="text-base text-slate-200 leading-relaxed font-semibold italic">
                          "{aiResult.feedback}"
                        </p>
                        <div className="mt-5 flex gap-3">
                           <button className="bg-slate-800 hover:bg-slate-700 text-[9px] font-black px-6 py-2.5 rounded-full text-white uppercase tracking-[0.2em] transition-all border border-slate-600 active:scale-95">Deconstruct</button>
                           <button className="bg-brand-primary hover:bg-brand-primary/80 text-[9px] font-black px-6 py-2.5 rounded-full text-slate-950 uppercase tracking-[0.2em] transition-all active:scale-95 shadow-lg shadow-brand-primary/20">Init Repair</button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Right Column: Integrated Development Environment */}
              <div className="flex-1 flex flex-col gap-6">
                <div className="sleek-card flex-1 flex flex-col overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.6)] relative border-2 border-brand-border">
                  <div className="h-14 bg-slate-900/80 px-8 flex items-center justify-between border-b border-brand-border/60">
                    <div className="flex gap-2.5">
                      <div className="w-3.5 h-3.5 rounded-full bg-rose-500/20 border border-rose-500/40" />
                      <div className="w-3.5 h-3.5 rounded-full bg-amber-500/20 border border-amber-500/40" />
                      <div className="w-3.5 h-3.5 rounded-full bg-brand-primary/20 border border-brand-primary/40" />
                    </div>
                    <div className="flex items-center gap-2">
                       <span className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.4em] font-bold">terminal.sys</span>
                       <div className="w-1 h-3 bg-brand-primary/20 rounded-full" />
                    </div>
                    <button 
                      onClick={() => setCode(currentLesson.challenge.starterCode)}
                      className="text-slate-600 hover:text-brand-primary transition-all p-2 rounded-lg hover:bg-slate-800"
                    >
                      <RotateCcw size={18} />
                    </button>
                  </div>
                  
                  <div className="flex-1 relative font-mono text-xl flex overflow-hidden">
                     <div className="w-14 bg-slate-950/40 text-slate-800 text-right pr-6 pt-10 select-none border-r border-brand-border/20 text-xs font-bold leading-[1.6]">
                       {Array.from({ length: 20 }).map((_, i) => <div key={i}>{i+1}</div>)}
                     </div>
                     <textarea 
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="flex-1 bg-transparent p-10 outline-none resize-none text-brand-secondary placeholder:text-slate-900 caret-brand-primary leading-[1.6]"
                      spellCheck="false"
                      autoFocus
                    />
                  </div>

                  <div className="p-10 bg-slate-950/80 border-t border-brand-border flex justify-between items-center shadow-inner">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                         <div className="absolute inset-0 bg-brand-primary/50 blur-md rounded-full shadow-[0_0_15px_#10b981]" />
                         <span className="relative block w-2.5 h-2.5 rounded-full bg-brand-primary" />
                      </div>
                      <div className="flex flex-col">
                        <p className="text-slate-200 text-[11px] font-black uppercase tracking-[0.2em] leading-tight mb-0.5">Engine Online</p>
                        <p className="text-slate-600 text-[9px] font-bold uppercase tracking-widest">Protocol: Python_v3.x</p>
                      </div>
                    </div>
                    <div className="flex gap-5">
                      <button 
                        onClick={handleRunCode}
                        disabled={isEvaluating}
                        className="group relative px-14 py-5 bg-gradient-to-r from-brand-primary to-brand-secondary hover:brightness-110 text-slate-950 font-black text-xl rounded-2xl shadow-2xl shadow-brand-primary/20 transform transition-all active:scale-95 disabled:opacity-50"
                      >
                        <div className="flex items-center gap-4">
                          {isEvaluating ? (
                            <div className="w-6 h-6 border-[3px] border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                          ) : (
                            <Play size={24} fill="currentColor" className="ml-1" />
                          )}
                          <span className="tracking-tighter">{isEvaluating ? 'EXECUTING...' : 'INITIATE SEQUENCE'}</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {aiResult && aiResult.isCorrect && (
                    <motion.div 
                      key="success"
                      initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                      animate={{ opacity: 1, backdropFilter: 'blur(8px)' }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 z-50 flex items-center justify-center bg-brand-bg/60 p-8 pt-0"
                    >
                      <motion.div 
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        className="sleek-card max-w-lg w-full p-12 text-center relative overflow-hidden border-2 border-brand-primary/40 bg-slate-900 shadow-[0_0_100px_rgba(16,185,129,0.2)]"
                      >
                        <div className="absolute top-0 left-0 w-full h-[6px] bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-primary animate-shine" />
                        <div className="w-24 h-24 bg-brand-primary/10 rounded-[32px] flex items-center justify-center text-brand-primary mx-auto mb-10 shadow-inner border border-brand-primary/20">
                          <motion.div
                            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                             <Trophy size={48} />
                          </motion.div>
                        </div>
                        <h2 className="text-4xl font-black text-white mb-4 uppercase tracking-tighter italic">Sector Cleared</h2>
                        <p className="text-slate-300 font-bold mb-12 leading-relaxed italic text-lg px-4 opacity-90">
                          "{aiResult.feedback}"
                        </p>
                        <button 
                          onClick={handleNextLesson}
                          className="w-full py-6 bg-brand-primary text-slate-950 font-black rounded-2xl flex items-center justify-center gap-4 hover:bg-brand-primary/90 transition-all active:scale-95 group shadow-[0_15px_30px_rgba(16,185,129,0.3)] text-xl"
                        >
                          PROCEED TO NEXT MODULE
                          <ChevronRight className="group-hover:translate-x-2 transition-transform h-8 w-8" />
                        </button>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      
      <footer className="h-12 px-10 flex items-center justify-between bg-slate-950/60 border-t border-brand-border/40 backdrop-blur-md">
        <div className="flex items-center gap-4">
           <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em]">Hardware System Log</span>
           <div className="w-1 h-3 bg-slate-800 rounded-full" />
           <span className="text-[9px] font-bold text-brand-primary uppercase tracking-widest opacity-60">Status: Nominal</span>
        </div>
        <div className="flex gap-2.5">
          {LESSONS.map((l, i) => {
            const isDone = progress.completedLessons.includes(l.id);
            return (
              <div 
                key={l.id} 
                className={`transition-all duration-700 rounded-full ${isDone ? 'w-8 h-2.5 bg-brand-primary shadow-[0_0_15px_#10b981]' : 'w-2.5 h-2.5 bg-slate-800'}`} 
              />
            );
          })}
        </div>
        <div className="text-[9px] font-mono text-slate-700">UTC: 2026-04-23</div>
      </footer>
    </div>
  );
}
