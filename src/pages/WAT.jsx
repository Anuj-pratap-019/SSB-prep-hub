import React, { useState, useEffect } from 'react';
import { Clock, Play, RotateCcw, Sparkles, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import TimerCircle from '../components/TimerCircle';
import { WAT_WORDS } from '../data/watWords';
import { evaluateWATResponse } from '../services/gemini';

import TestPageHeader from '../components/TestPageHeader';

export default function WAT() {
  const [mode, setMode] = useState('full'); // 'full' (15s automatic) | 'practice' (untimed + AI)
  const [isRunning, setIsRunning] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(15);
  const [responses, setResponses] = useState({});
  const [currentInput, setCurrentInput] = useState('');
  
  // Real-time AI analysis state
  const [evaluating, setEvaluating] = useState(false);
  const [singleEval, setSingleEval] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const activeWordObj = WAT_WORDS[currentIndex] || WAT_WORDS[0];

  // 15-second countdown timer for official SSB mode
  useEffect(() => {
    let timer = null;
    if (isRunning && mode === 'full' && secondsLeft > 0) {
      timer = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && mode === 'full' && secondsLeft === 0) {
      // Auto-advance to next word on 15s expiry
      handleNextWord();
    }
    return () => clearInterval(timer);
  }, [isRunning, mode, secondsLeft]);

  const startTest = (selectedMode) => {
    setMode(selectedMode);
    setCurrentIndex(0);
    setResponses({});
    setCurrentInput('');
    setSingleEval(null);
    setIsCompleted(false);
    setIsRunning(true);
    setSecondsLeft(15);
  };

  const handleNextWord = async () => {
    // Save current sentence
    const saved = { ...responses, [currentIndex]: currentInput.trim() };
    setResponses(saved);

    // If practice mode and sentence is present, trigger instant AI critique
    if (mode === 'practice' && currentInput.trim()) {
      setEvaluating(true);
      try {
        const res = await evaluateWATResponse(activeWordObj.word, currentInput.trim());
        setSingleEval(res);
      } catch (err) {
        console.warn('WAT single eval error:', err);
      } finally {
        setEvaluating(false);
      }
    }

    if (currentIndex + 1 < WAT_WORDS.length) {
      setCurrentIndex((prev) => prev + 1);
      setCurrentInput('');
      setSecondsLeft(15);
    } else {
      setIsRunning(false);
      setIsCompleted(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      
      {/* Test Page Header with Breadcrumb */}
      <TestPageHeader
        stage="Day 2: Psychological Battery"
        title="Word Association Test (WAT)"
        subtitle="60 words flashed at strict 15-second intervals. Train subconscious projection with instant AI critique."
        badge="Official SSB Drill"
        actions={
          isRunning && mode === 'full' ? (
            <TimerCircle
              totalSeconds={15}
              remainingSeconds={secondsLeft}
              size={68}
              label="15s Word Timer"
            />
          ) : null
        }
      />

      {/* Start / Selection Screen */}
      {!isRunning && !isCompleted && (
        <div className="bg-[#1b2212] border border-[#3a4520] rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <h2 className="font-heading text-xl text-[#c8a84b] font-bold uppercase tracking-wider">
              Test Instructions
            </h2>
            <p className="text-sm text-[#9a9780] leading-relaxed">
              60 words are flashed on screen for <strong className="text-[#c8a84b]">15 seconds each</strong>. Write the first meaningful sentence that flashes in your subconscious mind.
              Avoid clichés and preachy sentences starting with "One should...", "Always...", or "Never...".
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              onClick={() => startTest('full')}
              className="bg-[#12160a] border-2 border-[#3a4520] hover:border-[#c8a84b] p-5 rounded-xl cursor-pointer transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="font-heading text-base font-bold text-[#c8a84b] group-hover:underline">
                  ⚡ Official SSB Mode
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#222810] text-[#9a9780]">
                  15s Automatic
                </span>
              </div>
              <p className="text-xs text-[#9a9780]">
                Strict 15 seconds per word. Screen advances automatically simulating the psychological test hall conditions.
              </p>
            </div>

            <div
              onClick={() => startTest('practice')}
              className="bg-[#12160a] border-2 border-[#3a4520] hover:border-[#c8a84b] p-5 rounded-xl cursor-pointer transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="font-heading text-base font-bold text-emerald-400 group-hover:underline flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#c8a84b]" />
                  <span>🧠 AI Learning Mode</span>
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#222810] text-emerald-400 font-bold">
                  With Gemini AI
                </span>
              </div>
              <p className="text-xs text-[#9a9780]">
                Untimed. Receive instant psychological analysis and OLQ alignment after every single sentence you write.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Running Test Arena */}
      {isRunning && (
        <div className="bg-[#1b2212] border-2 border-[#c8a84b]/60 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between text-xs font-mono text-[#9a9780]">
            <span>Word #{currentIndex + 1} of {WAT_WORDS.length}</span>
            <span className="px-2 py-0.5 rounded bg-[#222810] text-[#c8a84b] font-bold">
              Category: {activeWordObj.category}
            </span>
          </div>

          {/* Flash Word Card */}
          <div className="bg-[#12160a] border-2 border-[#3a4520] rounded-2xl py-12 text-center shadow-inner space-y-2">
            <span className="font-heading text-4xl sm:text-6xl font-bold tracking-widest text-[#c8a84b] block uppercase">
              {activeWordObj.word}
            </span>
            <span className="text-xs font-mono text-[#9a9780]/70 italic">
              Hint: {activeWordObj.tip}
            </span>
          </div>

          {/* Sentence Input */}
          <div className="space-y-3">
            <input
              type="text"
              autoFocus
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleNextWord();
              }}
              placeholder="Type your spontaneous sentence here and press Enter..."
              className="w-full bg-[#12160a] border-2 border-[#3a4520] focus:border-[#c8a84b] rounded-xl px-4 py-3 text-base text-[#e8e4d0] outline-none font-sans"
            />
            <div className="flex justify-between items-center text-xs font-mono text-[#9a9780]">
              <span>Tip: First person, active voice, non-preachy.</span>
              <button
                onClick={handleNextWord}
                className="px-6 py-2 rounded-lg bg-[#c8a84b] hover:bg-[#a8882e] text-[#12160a] font-heading font-bold text-xs uppercase tracking-wider"
              >
                Next Word &rarr;
              </button>
            </div>
          </div>

          {/* Practice Mode: Instant AI feedback on the previous word */}
          {mode === 'practice' && singleEval && (
            <div className="bg-[#12160a] border border-[#3a4520] p-4 rounded-xl space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-heading font-bold text-[#c8a84b] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#c8a84b]" />
                  <span>Gemini AI Instant Feedback on Previous Word:</span>
                </span>
                <span className="font-mono font-bold text-emerald-400">
                  Rating: {singleEval.rating} ({singleEval.score}/5)
                </span>
              </div>
              <p className="text-[#e8e4d0]">{singleEval.critique}</p>
              {singleEval.betterAlternative && (
                <p className="text-[#9a9780] italic">
                  💡 High-OLQ Alternative: "{singleEval.betterAlternative}"
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Completion Summary */}
      {isCompleted && (
        <div className="bg-[#1b2212] border-2 border-[#c8a84b] rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="font-heading text-2xl font-bold text-[#c8a84b]">
              WAT Session Complete! 🎖️
            </h2>
            <p className="text-sm text-[#9a9780]">
              You attempted {Object.keys(responses).length} words. Review your responses below.
            </p>
          </div>

          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {WAT_WORDS.map((w, idx) => (
              <div
                key={idx}
                className="bg-[#12160a] border border-[#3a4520] rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div>
                  <span className="font-heading font-bold text-sm text-[#c8a84b] mr-2">
                    {idx + 1}. {w.word}
                  </span>
                  <span className="text-[10px] font-mono text-[#9a9780] px-1.5 py-0.5 rounded bg-[#222810]">
                    {w.category}
                  </span>
                </div>
                <p className="text-[#e8e4d0] font-sans flex-1 sm:text-right">
                  {responses[idx] || <span className="italic text-[#9a9780]">— Left blank —</span>}
                </p>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-3 pt-4">
            <button
              onClick={() => startTest('full')}
              className="px-6 py-2.5 rounded-lg bg-[#c8a84b] text-[#12160a] font-heading font-bold text-xs uppercase"
            >
              Retake 60 Words
            </button>
            <button
              onClick={() => { setIsCompleted(false); setIsRunning(false); }}
              className="px-6 py-2.5 rounded-lg bg-[#222810] text-[#e8e4d0] border border-[#3a4520] text-xs font-mono"
            >
              Back to Menu
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
