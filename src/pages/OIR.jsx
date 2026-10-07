import React, { useState } from 'react';
import { Award, CheckCircle, XCircle, Clock, RotateCcw, ArrowRight } from 'lucide-react';
import TimerCircle from '../components/TimerCircle';
import { OIR_QUESTIONS } from '../data/oirQuestions';

import TestPageHeader from '../components/TestPageHeader';

export default function OIR() {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isTimed, setIsTimed] = useState(true);
  const [secondsLeft, setSecondsLeft] = useState(900); // 15 mins

  const activeQ = OIR_QUESTIONS[currentQIndex] || OIR_QUESTIONS[0];

  const handleSelect = (optionIndex) => {
    if (isSubmitted) return;
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQIndex]: optionIndex
    });
  };

  const calculateScore = () => {
    let correct = 0;
    OIR_QUESTIONS.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.answer) correct++;
    });
    return correct;
  };

  const getOIRGrade = (score, total) => {
    const pct = (score / total) * 100;
    if (pct >= 85) return { grade: 'OIR Grade I', desc: 'Outstanding — Top Tier Intelligence Rating', color: 'text-emerald-400' };
    if (pct >= 70) return { grade: 'OIR Grade II', desc: 'Very Good — Highly Recommended', color: 'text-emerald-500' };
    if (pct >= 55) return { grade: 'OIR Grade III', desc: 'Average — Clear pass mark', color: 'text-amber-400' };
    if (pct >= 40) return { grade: 'OIR Grade IV', desc: 'Below Average — Risk of Stage 1 screening out', color: 'text-orange-400' };
    return { grade: 'OIR Grade V', desc: 'Poor — High probability of screening out', color: 'text-red-400' };
  };

  const restartTest = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setCurrentQIndex(0);
    setSecondsLeft(900);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      
      {/* Test Page Header with Breadcrumb */}
      <TestPageHeader
        stage="Stage 1: Day 1 Screening"
        title="Officer Intelligence Rating (OIR)"
        subtitle="Verbal & non-verbal reasoning MCQs. Benchmark your speed and calculate your OIR Grade I to V."
        badge="Official Pattern"
        actions={
          !isSubmitted && isTimed ? (
            <TimerCircle
              totalSeconds={900}
              remainingSeconds={secondsLeft}
              size={68}
              label="OIR Timer"
            />
          ) : null
        }
      />

      {/* Test Arena */}
      {!isSubmitted ? (
        <div className="bg-[#1b2212] border-2 border-[#3a4520] rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between text-xs font-mono text-[#9a9780]">
            <span>Question #{currentQIndex + 1} of {OIR_QUESTIONS.length}</span>
            <span className="px-2 py-0.5 rounded bg-[#222810] text-[#c8a84b] font-bold">
              Type: {activeQ.type}
            </span>
          </div>

          {/* Question Text */}
          <div className="bg-[#12160a] border border-[#3a4520] p-5 rounded-xl space-y-2">
            <p className="font-heading text-lg sm:text-xl text-[#e8e4d0] font-bold">
              {activeQ.question}
            </p>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {activeQ.options.map((opt, idx) => {
              const isSelected = selectedAnswers[currentQIndex] === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  className={`p-4 rounded-xl border text-left flex items-center justify-between text-sm transition-all ${
                    isSelected
                      ? 'border-[#c8a84b] bg-[#2d3a18] text-[#c8a84b] font-bold shadow-md'
                      : 'border-[#3a4520] bg-[#12160a] text-[#e8e4d0] hover:border-[#c8a84b]/40'
                  }`}
                >
                  <span>{String.fromCharCode(65 + idx)}. {opt}</span>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    isSelected ? 'border-[#c8a84b] bg-[#c8a84b]' : 'border-[#3a4520]'
                  }`}>
                    {isSelected && <div className="w-2 h-2 rounded-full bg-[#12160a]" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Question Navigator */}
          <div className="flex items-center justify-between pt-4 border-t border-[#3a4520]">
            <button
              disabled={currentQIndex === 0}
              onClick={() => setCurrentQIndex((prev) => prev - 1)}
              className="px-4 py-2 rounded-lg bg-[#222810] disabled:opacity-40 text-xs font-mono text-[#9a9780]"
            >
              &larr; Previous
            </button>

            {currentQIndex + 1 < OIR_QUESTIONS.length ? (
              <button
                onClick={() => setCurrentQIndex((prev) => prev + 1)}
                className="px-6 py-2.5 rounded-lg bg-[#4a5c2a] hover:bg-[#5e7535] text-xs font-heading font-bold uppercase text-[#e8e4d0]"
              >
                Next &rarr;
              </button>
            ) : (
              <button
                onClick={() => setIsSubmitted(true)}
                className="px-6 py-2.5 rounded-lg bg-[#c8a84b] hover:bg-[#a8882e] text-[#12160a] text-xs font-heading font-bold uppercase tracking-wider shadow-lg"
              >
                Submit Mock Test
              </button>
            )}
          </div>

          {/* Dot navigation */}
          <div className="flex flex-wrap gap-2 pt-2 justify-center">
            {OIR_QUESTIONS.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentQIndex(i)}
                className={`w-7 h-7 rounded-lg text-xs font-mono transition-all ${
                  currentQIndex === i
                    ? 'bg-[#c8a84b] text-[#12160a] font-bold ring-2 ring-[#c8a84b]'
                    : selectedAnswers[i] !== undefined
                    ? 'bg-[#4a5c2a] text-[#e8e4d0]'
                    : 'bg-[#12160a] border border-[#3a4520] text-[#9a9780]'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* Results View */
        <div className="bg-[#1b2212] border-2 border-[#c8a84b] rounded-2xl p-6 sm:p-8 space-y-8">
          <div className="text-center space-y-3">
            <span className="text-xs font-mono uppercase text-[#c8a84b] font-bold">
              Official OIR Assessment Result
            </span>
            <div className={`font-heading text-4xl font-bold ${getOIRGrade(calculateScore(), OIR_QUESTIONS.length).color}`}>
              {getOIRGrade(calculateScore(), OIR_QUESTIONS.length).grade}
            </div>
            <p className="text-sm text-[#9a9780]">
              {getOIRGrade(calculateScore(), OIR_QUESTIONS.length).desc}
            </p>
            <div className="font-heading text-2xl text-[#e8e4d0]">
              Score: <strong className="text-[#c8a84b]">{calculateScore()}</strong> / {OIR_QUESTIONS.length} Correct
            </div>
          </div>

          {/* Detailed Solutions */}
          <div className="space-y-4">
            <h3 className="font-heading text-base uppercase tracking-wider text-[#c8a84b] font-bold">
              Detailed Question Solutions &amp; Logic
            </h3>
            {OIR_QUESTIONS.map((q, idx) => {
              const userAns = selectedAnswers[idx];
              const isCorrect = userAns === q.answer;
              return (
                <div key={idx} className="bg-[#12160a] border border-[#3a4520] p-4 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#e8e4d0]">Q{idx + 1}: {q.question}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      isCorrect ? 'bg-emerald-950 text-emerald-400' : 'bg-red-950 text-red-400'
                    }`}>
                      {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                    </span>
                  </div>
                  <p className="text-[#9a9780]">
                    Your Answer: <strong className="text-[#e8e4d0]">{userAns !== undefined ? q.options[userAns] : 'Not attempted'}</strong> | Correct: <strong className="text-emerald-400">{q.options[q.answer]}</strong>
                  </p>
                  <p className="text-xs text-[#c8a84b] bg-[#1a2211] p-2 rounded">
                    💡 Logic: {q.explanation}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="flex justify-center pt-2">
            <button
              onClick={restartTest}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#c8a84b] text-[#12160a] font-heading font-bold text-xs uppercase"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake OIR Test</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
