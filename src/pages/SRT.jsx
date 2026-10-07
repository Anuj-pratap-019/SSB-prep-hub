import React, { useState } from 'react';
import { Brain, Sparkles, CheckCircle2, Clock, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';
import TimerCircle from '../components/TimerCircle';
import { SRT_SCENARIOS } from '../data/srtScenarios';
import { evaluateSRTReaction } from '../services/gemini';

import TestPageHeader from '../components/TestPageHeader';

export default function SRT() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reactionInput, setReactionInput] = useState('');
  const [isTimed, setIsTimed] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(30);
  const [evaluating, setEvaluating] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [showModel, setShowModel] = useState(false);

  const activeScenario = SRT_SCENARIOS[currentIndex] || SRT_SCENARIOS[0];

  const handleEvaluate = async () => {
    if (!reactionInput.trim()) return;
    setEvaluating(true);
    setAiResult(null);
    try {
      const res = await evaluateSRTReaction(activeScenario.situation, reactionInput.trim());
      setAiResult(res);
    } catch (err) {
      console.warn('SRT evaluation error:', err);
    } finally {
      setEvaluating(false);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < SRT_SCENARIOS.length) {
      setCurrentIndex((prev) => prev + 1);
      setReactionInput('');
      setAiResult(null);
      setShowModel(false);
      setSecondsLeft(30);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setReactionInput('');
      setAiResult(null);
      setShowModel(false);
      setSecondsLeft(30);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      
      {/* Test Page Header with Breadcrumb */}
      <TestPageHeader
        stage="Day 2: Psychological Battery"
        title="Situation Reaction Test (SRT)"
        subtitle="Practical military and social crisis dilemmas. Evaluate your immediate action and OLQ alignment."
        badge="Psych Battery"
        actions={
          <button
            onClick={() => setIsTimed(!isTimed)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all ${
              isTimed
                ? 'bg-amber-950/60 border-amber-600 text-amber-400 font-bold'
                : 'bg-[#222810] border-[#3a4520] text-[#9a9780]'
            }`}
          >
            {isTimed ? '⏱️ 30s Timed Active' : 'Free Practice Mode'}
          </button>
        }
      />

      {/* Main Situation Card */}
      <div className="bg-[#1b2212] border-2 border-[#3a4520] rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between text-xs font-mono text-[#9a9780]">
          <span>Situation #{currentIndex + 1} of {SRT_SCENARIOS.length}</span>
          <span className="px-2 py-0.5 rounded bg-[#222810] text-[#c8a84b] font-bold">
            Category: {activeScenario.category}
          </span>
        </div>

        {/* Prompt Box */}
        <div className="bg-[#12160a] border-l-4 border-[#c8a84b] p-5 rounded-r-xl space-y-2">
          <span className="text-xs font-mono uppercase text-[#c8a84b] font-bold block">
            The Situation
          </span>
          <p className="font-heading text-lg sm:text-xl text-[#e8e4d0] font-bold leading-relaxed">
            "{activeScenario.situation}"
          </p>
        </div>

        {/* Reaction Input */}
        <div className="space-y-3">
          <label className="text-xs font-mono uppercase text-[#9a9780] block font-bold">
            Your Immediate Reaction (Past Tense, Crisp Action Clauses)
          </label>
          <textarea
            value={reactionInput}
            onChange={(e) => setReactionInput(e.target.value)}
            placeholder="E.g., Pulled emergency alarm, alerted passengers, guided safe evacuation, and informed railway control..."
            rows={3}
            className="w-full bg-[#12160a] border-2 border-[#3a4520] focus:border-[#c8a84b] rounded-xl p-4 text-sm text-[#e8e4d0] outline-none leading-relaxed"
          />

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <button
              onClick={() => setShowModel(!showModel)}
              className="text-xs font-mono text-[#c8a84b] hover:underline"
            >
              {showModel ? 'Hide Model Reaction' : '👁️ View Expert Model Reaction'}
            </button>

            <button
              disabled={evaluating || !reactionInput.trim()}
              onClick={handleEvaluate}
              className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#c8a84b] to-[#a8882e] hover:from-[#d8b85b] hover:to-[#b8983e] disabled:opacity-50 text-[#12160a] font-heading font-bold text-xs uppercase tracking-wider shadow-md flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{evaluating ? 'Analyzing...' : 'Evaluate with Gemini AI'}</span>
            </button>
          </div>
        </div>

        {/* Model Answer Preview */}
        {showModel && (
          <div className="bg-[#12160a] border border-[#c8a84b]/40 rounded-xl p-4 space-y-2 text-xs">
            <span className="font-mono text-[#c8a84b] font-bold uppercase block">
              ✅ Model Reaction:
            </span>
            <p className="text-[#e8e4d0] leading-relaxed italic">{activeScenario.model}</p>
            <div className="flex gap-2 pt-1">
              <span className="text-[#9a9780]">OLQs Demonstrated:</span>
              {activeScenario.olqs.map((olq, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded bg-[#222810] text-[#c8a84b] font-mono text-[10px]">
                  {olq}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* AI Evaluation Report */}
        {aiResult && (
          <div className="bg-[#12160a] border-2 border-[#c8a84b] rounded-xl p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-[#3a4520] pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#c8a84b]" />
                <span className="font-heading font-bold text-sm text-[#e8e4d0]">
                  SSB Psychologist Reaction Assessment
                </span>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#222810] text-emerald-400 font-mono font-bold">
                {aiResult.verdict} ({aiResult.score}/5)
              </span>
            </div>

            <p className="text-[#e8e4d0] leading-relaxed">{aiResult.feedback}</p>

            {aiResult.olqsDemonstrated && aiResult.olqsDemonstrated.length > 0 && (
              <div className="space-y-1">
                <span className="text-[#9a9780] font-mono uppercase block">OLQs Verified:</span>
                <div className="flex flex-wrap gap-1.5">
                  {aiResult.olqsDemonstrated.map((olq, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800 text-emerald-400 font-mono">
                      ✓ {olq}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-[#3a4520]">
          <button
            disabled={currentIndex === 0}
            onClick={handlePrev}
            className="px-4 py-2 rounded-lg bg-[#222810] hover:bg-[#2d3a18] disabled:opacity-40 text-xs font-mono text-[#9a9780]"
          >
            &larr; Previous Situation
          </button>
          <button
            disabled={currentIndex === SRT_SCENARIOS.length - 1}
            onClick={handleNext}
            className="px-4 py-2 rounded-lg bg-[#4a5c2a] hover:bg-[#5e7535] text-xs font-heading font-bold uppercase text-[#e8e4d0]"
          >
            Next Situation &rarr;
          </button>
        </div>

      </div>

    </div>
  );
}
