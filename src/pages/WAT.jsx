import React, { useState, useEffect } from 'react';
import { FileImage, Sparkles } from 'lucide-react';
import TimerCircle from '../components/TimerCircle';
import { WAT_WORDS } from '../data/watWords';
import { evaluateWATResponse, evaluateWATSheet } from '../services/gemini';
import { supabase } from '../lib/supabase';

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
  const [libraryWords, setLibraryWords] = useState(WAT_WORDS);
  const [sheetFile, setSheetFile] = useState(null);
  const [sheetEvaluation, setSheetEvaluation] = useState(null);
  const [sheetEvaluating, setSheetEvaluating] = useState(false);
  const [sheetError, setSheetError] = useState('');

  const testWords = libraryWords.slice(0, 60);
  const activeWordObj = testWords[currentIndex] || testWords[0];

  useEffect(() => {
    let mounted = true;
    supabase.from('wat_words').select('word, tip').eq('active', true).order('created_at').limit(60)
      .then(({ data, error }) => {
        if (mounted && !error && data?.length >= 60) setLibraryWords(data);
      });
    return () => { mounted = false; };
  }, []);

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

  const startTest = (selectedMode = 'full') => {
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

    if (currentIndex + 1 < testWords.length) {
      setCurrentIndex((prev) => prev + 1);
      setCurrentInput('');
      setSecondsLeft(15);
    } else {
      setIsRunning(false);
      setIsCompleted(true);
    }
  };

  const readImage = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve({
      mimeType: file.type,
      data: String(reader.result).split(',')[1]
    });
    reader.onerror = () => reject(new Error('Could not read the answer sheet.'));
    reader.readAsDataURL(file);
  });

  const reviewSheet = async () => {
    if (!sheetFile) return;
    setSheetError('');
    setSheetEvaluation(null);
    setSheetEvaluating(true);
    try {
      const result = await evaluateWATSheet(testWords, await readImage(sheetFile));
      setSheetEvaluation(result);
    } catch (error) {
      setSheetError(error.message);
    } finally {
      setSheetEvaluating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      
      {/* Test Page Header with Breadcrumb */}
      <TestPageHeader
        stage="Day 2: Psychological Battery"
        title="Word Association Test (WAT)"
        subtitle="60 words flashed at strict 15-second intervals. Write your first natural response for each word."
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
              {testWords.length} words are flashed one at a time for <strong className="text-[#c8a84b]">15 seconds each</strong>.
              Read the word, write the first meaningful sentence that comes to mind, and leave the numbered line blank if you miss a word.
            </p>
          </div>
          <div className="bg-[#12160a] border border-[#3a4520] rounded-xl p-5 space-y-3">
            <h3 className="font-heading font-bold text-[#c8a84b]">Before you proceed</h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-[#9a9780]">
              <li>Keep your paper ready and number your answer lines from 1 to 60.</li>
              <li>Write one short, natural, action-oriented sentence for each word.</li>
              <li>Do not wait for a perfect sentence; write your first practical thought.</li>
              <li>If you miss a word, leave that numbered line blank. Do not shift later answers upward.</li>
              <li>Avoid memorised slogans, preachy phrases, and unrealistic claims.</li>
              <li>After the test, upload a clear photo of the numbered sheet for evaluation.</li>
            </ul>
            <button onClick={() => startTest('full')} className="mt-2 w-full sm:w-auto px-8 py-3 rounded-lg bg-[#c8a84b] text-[#12160a] font-heading font-bold uppercase tracking-wider">
              Proceed to first word
            </button>
          </div>
        </div>
      )}

      {/* Running Test Arena */}
      {isRunning && (
        <div className="bg-[#1b2212] border-2 border-[#c8a84b]/60 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between text-xs font-mono text-[#9a9780]">
            <span>Word #{currentIndex + 1} of {testWords.length}</span>
            <span className="text-[#c8a84b]">Write your first response</span>
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
            {testWords.map((w, idx) => (
              <div
                key={idx}
                className="bg-[#12160a] border border-[#3a4520] rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div>
                  <span className="font-heading font-bold text-sm text-[#c8a84b] mr-2">
                    {idx + 1}. {w.word}
                  </span>
                </div>

                <p className="text-[#e8e4d0] font-sans flex-1 sm:text-right">
                  {responses[idx] || <span className="italic text-[#9a9780]">— Left blank —</span>}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t border-[#3a4520] pt-5 space-y-3">
            <div>
              <h3 className="font-heading font-bold text-[#c8a84b] flex items-center gap-2"><FileImage className="w-4 h-4" /> Evaluate a handwritten answer sheet</h3>
              <p className="text-xs text-[#9a9780] mt-1">For reliable matching, number your paper 1–60 and leave a blank line for skipped words. Upload a clear JPG, PNG, or WEBP photo.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => setSheetFile(event.target.files?.[0] || null)} className="flex-1 bg-[#12160a] border border-[#3a4520] rounded-lg p-2 text-sm" />
              <button onClick={reviewSheet} disabled={!sheetFile || sheetEvaluating} className="rounded-lg bg-[#c8a84b] text-[#12160a] px-4 py-2 font-bold text-sm disabled:opacity-50">{sheetEvaluating ? 'Reading sheet...' : 'Review sheet'}</button>
            </div>
            {sheetError && <p className="text-sm text-red-300">{sheetError}</p>}
            {sheetEvaluation && <div className="bg-[#12160a] rounded-xl p-4 space-y-3 text-sm">
              <p className="text-[#e8e4d0]">{sheetEvaluation.summary}</p>
              <div className="grid sm:grid-cols-2 gap-3">
                <div><strong className="text-emerald-300">Strengths</strong><ul className="list-disc list-inside text-xs text-[#9a9780]">{(sheetEvaluation.strengths || []).map((item) => <li key={item}>{item}</li>)}</ul></div>
                <div><strong className="text-[#c8a84b]">Keep in mind</strong><ul className="list-disc list-inside text-xs text-[#9a9780]">{(sheetEvaluation.improvementTips || []).map((item) => <li key={item}>{item}</li>)}</ul></div>
              </div>
              <div className="max-h-72 overflow-y-auto space-y-2">
                {(sheetEvaluation.answers || []).map((answer) => <div key={answer.number} className="border-b border-[#3a4520] pb-2 text-xs"><span className="text-[#c8a84b] font-bold">{answer.number}. {answer.word}</span> <span className="text-[#9a9780]">— {answer.status}</span><p>{answer.transcription || 'No readable sentence.'}</p>{answer.feedback && <p className="text-[#9a9780]">{answer.feedback}</p>}</div>)}
              </div>
            </div>}
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
