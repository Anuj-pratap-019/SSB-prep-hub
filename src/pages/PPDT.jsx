import React, { useState, useEffect } from 'react';
import { Eye, Edit3, Mic, Sparkles, AlertCircle, ArrowRight, RotateCcw, Clock, CheckCircle } from 'lucide-react';
import TimerCircle from '../components/TimerCircle';
import SpeechRecorder from '../components/SpeechRecorder';
import AIReviewReport from '../components/AIReviewReport';
import { PPDT_IMAGES } from '../data/ppdtImages';
import { evaluatePPDT } from '../services/gemini';

import TestPageHeader from '../components/TestPageHeader';

// 5 Stages of SSB PPDT
const STAGES = {
  PREPARE: 'PREPARE',
  IMAGE_OBSERVE: 'IMAGE_OBSERVE',   // 30 Seconds
  BOX_MARKING: 'BOX_MARKING',       // 1 Minute (60s)
  STORY_WRITING: 'STORY_WRITING',   // 4 Minutes (240s)
  NARRATION: 'NARRATION',           // 1 Minute (60s)
  EVALUATING: 'EVALUATING',         // AI Analyzing
  RESULT: 'RESULT'                  // Full Dossier
};

export default function PPDT() {
  const [selectedSceneIndex, setSelectedSceneIndex] = useState(0);
  const [stage, setStage] = useState(STAGES.PREPARE);
  const [secondsLeft, setSecondsLeft] = useState(30);

  // Form State
  const [characters, setCharacters] = useState({
    count: '3',
    heroAge: '23',
    heroSex: 'Male',
    heroMood: 'Positive (+)'
  });
  const [actionSummary, setActionSummary] = useState('');
  const [storyText, setStoryText] = useState('');
  const [narrationTranscript, setNarrationTranscript] = useState('');

  // AI Evaluation State
  const [evaluation, setEvaluation] = useState(null);
  const [evalError, setEvalError] = useState(null);

  const activeImage = PPDT_IMAGES[selectedSceneIndex] || PPDT_IMAGES[0];

  // Stage Timer Handler
  useEffect(() => {
    let timer = null;
    const shouldTick = [
      STAGES.IMAGE_OBSERVE,
      STAGES.BOX_MARKING,
      STAGES.STORY_WRITING,
      STAGES.NARRATION
    ].includes(stage);

    if (shouldTick && secondsLeft > 0) {
      timer = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (shouldTick && secondsLeft === 0) {
      // Transition automatically on timer completion
      handleStageAdvance();
    }

    return () => clearInterval(timer);
  }, [stage, secondsLeft]);

  const startTest = () => {
    setStage(STAGES.IMAGE_OBSERVE);
    setSecondsLeft(30); // 30s official SSB picture exposure
  };

  const handleStageAdvance = () => {
    switch (stage) {
      case STAGES.IMAGE_OBSERVE:
        setStage(STAGES.BOX_MARKING);
        setSecondsLeft(60); // 1 minute to mark box
        break;
      case STAGES.BOX_MARKING:
        setStage(STAGES.STORY_WRITING);
        setSecondsLeft(240); // 4 minutes to write story
        break;
      case STAGES.STORY_WRITING:
        setStage(STAGES.NARRATION);
        setSecondsLeft(60); // 1 minute individual narration
        break;
      case STAGES.NARRATION:
        triggerEvaluation();
        break;
      default:
        break;
    }
  };

  const triggerEvaluation = async () => {
    setStage(STAGES.EVALUATING);
    setEvalError(null);
    try {
      const res = await evaluatePPDT({
        story: storyText || 'Candidate did not complete story in allotted time.',
        characters,
        actionSummary,
        narration: narrationTranscript
      });
      setEvaluation(res);
      setStage(STAGES.RESULT);
    } catch (err) {
      console.error('PPDT eval error:', err);
      setEvalError(err.message || 'Failed to communicate with AI Evaluation Engine.');
      setStage(STAGES.RESULT);
    }
  };

  const resetAll = () => {
    setStage(STAGES.PREPARE);
    setSecondsLeft(30);
    setActionSummary('');
    setStoryText('');
    setNarrationTranscript('');
    setEvaluation(null);
    setEvalError(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      
      {/* Test Page Header with Breadcrumbs */}
      <TestPageHeader
        stage="Stage 1: Screening Test"
        title="PPDT AI Simulator"
        subtitle="Picture Perception & Discussion Test — 30s observation, 1m character box, 4m story writing, and 1m live speech narration."
        badge="Flagship AI Module"
        actions={
          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              { id: STAGES.IMAGE_OBSERVE, label: '1. Picture (30s)' },
              { id: STAGES.BOX_MARKING, label: '2. Box (1m)' },
              { id: STAGES.STORY_WRITING, label: '3. Story (4m)' },
              { id: STAGES.NARRATION, label: '4. Narration (1m)' },
              { id: STAGES.RESULT, label: '5. AI Dossier' },
            ].map((s) => {
              const isCurrent = stage === s.id;
              return (
                <span
                  key={s.id}
                  className={`text-[11px] font-mono px-2.5 py-1 rounded-lg transition-colors ${
                    isCurrent
                      ? 'bg-[#c8a84b] text-[#12160a] font-bold shadow'
                      : 'bg-[#182012] text-[#8e8b78] border border-[#2e3a19]'
                  }`}
                >
                  {s.label}
                </span>
              );
            })}
          </div>
        }
      />

      {/* ──────────────── STAGE: PREPARE ──────────────── */}
      {stage === STAGES.PREPARE && (
        <div className="bg-[#1b2212] border border-[#3a4520] rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <h2 className="font-heading text-xl text-[#c8a84b] font-bold uppercase tracking-wider">
              Simulation Protocol Briefing
            </h2>
            <p className="text-sm text-[#9a9780] leading-relaxed">
              In the actual SSB screening on Day 1, over 60-70% of candidates get screened out in PPDT. This AI simulator follows the exact Ministry of Defence timeline to train your perception, characterization, narrative speed, and speech confidence.
            </p>
          </div>

          {/* Timeline Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="bg-[#12160a] border border-[#3a4520] p-4 rounded-xl space-y-1">
              <span className="font-heading text-[#c8a84b] font-bold text-sm block">1. 30 Seconds</span>
              <p className="text-xs text-[#9a9780]">Hazy picture is projected. Note setting, character counts, gender, mood, and core dilemma.</p>
            </div>
            <div className="bg-[#12160a] border border-[#3a4520] p-4 rounded-xl space-y-1">
              <span className="font-heading text-emerald-400 font-bold text-sm block">2. 1 Minute</span>
              <p className="text-xs text-[#9a9780]">Fill character box (Age, Sex, Mood: +/0/-) and define Action in 1 crisp line.</p>
            </div>
            <div className="bg-[#12160a] border border-[#3a4520] p-4 rounded-xl space-y-1">
              <span className="font-heading text-amber-400 font-bold text-sm block">3. 4 Minutes</span>
              <p className="text-xs text-[#9a9780]">Write complete story: Past background $\rightarrow$ Present decisive action $\rightarrow$ Positive outcome.</p>
            </div>
            <div className="bg-[#12160a] border border-[#3a4520] p-4 rounded-xl space-y-1">
              <span className="font-heading text-sky-400 font-bold text-sm block">4. 1 Minute</span>
              <p className="text-xs text-[#9a9780]">Narrate aloud using your microphone. AI evaluates your speech, tone, and OLQs!</p>
            </div>
          </div>

          {/* Stimulus Selector */}
          <div className="space-y-3 pt-2">
            <label className="text-xs font-mono uppercase tracking-wider text-[#9a9780] block font-bold">
              Select PPDT Picture Stimulus ({PPDT_IMAGES.length} Available)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {PPDT_IMAGES.map((image, idx) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedSceneIndex(idx)}
                  className={`rounded-xl border text-left overflow-hidden transition-all ${
                    selectedSceneIndex === idx
                      ? 'border-[#c8a84b] bg-[#2d3a18] shadow-md shadow-[#c8a84b]/10'
                      : 'border-[#3a4520] bg-[#12160a] hover:border-[#c8a84b]/40'
                  }`}
                >
                  <img
                    src={image.image}
                    alt={image.title}
                    className="w-full aspect-[16/10] object-cover bg-black"
                  />
                  <span className="text-[10px] font-mono text-[#c8a84b] block uppercase px-3 pt-2">
                    Stimulus #{image.id}
                  </span>
                  <span className="font-heading text-sm text-[#e8e4d0] font-bold block truncate px-3 pb-3">
                    {image.title}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Launch Action */}
          <div className="pt-4 flex justify-end">
            <button
              onClick={startTest}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#c8a84b] to-[#a8882e] hover:from-[#d8b85b] hover:to-[#b8983e] text-[#12160a] font-heading text-base font-bold uppercase tracking-wider shadow-xl flex items-center gap-2 transform hover:scale-[1.02] transition-all"
            >
              <span>Begin Official 30s Observation</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* ──────────────── STAGE 1: 30s IMAGE OBSERVATION ──────────────── */}
      {stage === STAGES.IMAGE_OBSERVE && (
        <div className="bg-[#1b2212] border-2 border-[#c8a84b] rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Eye className="w-6 h-6 text-[#c8a84b] animate-pulse" />
              <div>
                <h2 className="font-heading text-xl text-[#e8e4d0] font-bold">
                  Observe the Picture Carefully
                </h2>
                <p className="text-xs text-[#9a9780]">Picture will disappear automatically in 30 seconds.</p>
              </div>
            </div>
            <TimerCircle
              totalSeconds={30}
              remainingSeconds={secondsLeft}
              size={80}
              label="Observation"
            />
          </div>

          <div className="w-full aspect-[16/10] max-h-[460px] rounded-xl overflow-hidden border-2 border-[#3a4520] bg-black shadow-inner flex items-center justify-center">
            <img
              src={activeImage.image}
              alt={activeImage.title}
              className="w-full h-full object-contain"
            />
          </div>

          <div className="flex justify-between items-center text-xs font-mono text-[#9a9780]">
            <span>Tip: Identify the central character (your age), mood, and what led to this situation.</span>
            <button
              onClick={handleStageAdvance}
              className="text-[#c8a84b] hover:underline flex items-center gap-1 font-bold"
            >
              Skip Ahead to Box Marking &rarr;
            </button>
          </div>
        </div>
      )}

      {/* ──────────────── STAGE 2: 1m BOX MARKING ──────────────── */}
      {stage === STAGES.BOX_MARKING && (
        <div className="bg-[#1b2212] border-2 border-[#3a4520] rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-[#3a4520] pb-4">
            <div>
              <span className="text-xs font-mono uppercase text-[#c8a84b] font-bold">
                SSB PPDT Answer Sheet — Part I
              </span>
              <h2 className="font-heading text-xl text-[#e8e4d0] font-bold">
                Fill the Character Box &amp; Action
              </h2>
            </div>
            <TimerCircle
              totalSeconds={60}
              remainingSeconds={secondsLeft}
              size={76}
              label="Box Timer"
            />
          </div>

          {/* Character Box Replica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Box Simulator */}
            <div className="border-2 border-[#c8a84b]/70 bg-[#12160a] p-5 rounded-xl space-y-4">
              <span className="text-xs font-mono uppercase text-[#c8a84b] font-bold block">
                Square Box (Record Hero &amp; Subordinates)
              </span>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[#9a9780] block mb-1">Total Characters Seen:</label>
                  <input
                    type="number"
                    value={characters.count}
                    onChange={(e) => setCharacters({ ...characters, count: e.target.value })}
                    className="w-full bg-[#1b2212] border border-[#3a4520] rounded p-2 text-[#e8e4d0] font-bold"
                  />
                </div>
                <div>
                  <label className="text-[#9a9780] block mb-1">Hero Age (Candidate Demographic):</label>
                  <input
                    type="number"
                    value={characters.heroAge}
                    onChange={(e) => setCharacters({ ...characters, heroAge: e.target.value })}
                    className="w-full bg-[#1b2212] border border-[#3a4520] rounded p-2 text-[#e8e4d0] font-bold"
                  />
                </div>
                <div>
                  <label className="text-[#9a9780] block mb-1">Hero Sex:</label>
                  <select
                    value={characters.heroSex}
                    onChange={(e) => setCharacters({ ...characters, heroSex: e.target.value })}
                    className="w-full bg-[#1b2212] border border-[#3a4520] rounded p-2 text-[#e8e4d0]"
                  >
                    <option value="Male">Male (M)</option>
                    <option value="Female">Female (F)</option>
                    <option value="Person">Person (P)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[#9a9780] block mb-1">Hero Mood:</label>
                  <select
                    value={characters.heroMood}
                    onChange={(e) => setCharacters({ ...characters, heroMood: e.target.value })}
                    className="w-full bg-[#1b2212] border border-[#3a4520] rounded p-2 text-[#e8e4d0]"
                  >
                    <option value="Positive (+)">Positive (+)</option>
                    <option value="Neutral (0)">Neutral (0)</option>
                    <option value="Negative (-)">Negative (-)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Action Box */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-mono uppercase text-[#c8a84b] font-bold block mb-1">
                  Action of the Story (1 Sentence)
                </label>
                <p className="text-xs text-[#9a9780] mb-2">
                  E.g., "Repairing breached canal and saving crops" or "Organizing emergency shelter after landslide".
                </p>
                <textarea
                  value={actionSummary}
                  onChange={(e) => setActionSummary(e.target.value)}
                  placeholder="Enter the main action of your story here..."
                  rows={4}
                  className="w-full bg-[#12160a] border border-[#3a4520] focus:border-[#c8a84b] rounded-xl p-3 text-sm text-[#e8e4d0] outline-none"
                />
              </div>
            </div>

          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleStageAdvance}
              className="px-6 py-2.5 rounded-lg bg-[#c8a84b] hover:bg-[#a8882e] text-[#12160a] font-heading font-bold text-xs uppercase tracking-wider"
            >
              Proceed to Story Writing (4 Min) &rarr;
            </button>
          </div>
        </div>
      )}

      {/* ──────────────── STAGE 3: 4m STORY WRITING ──────────────── */}
      {stage === STAGES.STORY_WRITING && (
        <div className="bg-[#1b2212] border-2 border-[#3a4520] rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-[#3a4520] pb-4">
            <div>
              <span className="text-xs font-mono uppercase text-[#c8a84b] font-bold">
                SSB PPDT Answer Sheet — Part II
              </span>
              <h2 className="font-heading text-xl text-[#e8e4d0] font-bold">
                Write Your Story (Past $\rightarrow$ Present $\rightarrow$ Future)
              </h2>
            </div>
            <TimerCircle
              totalSeconds={240}
              remainingSeconds={secondsLeft}
              size={84}
              label="Writing Timer"
            />
          </div>

          {/* Action reminder banner */}
          {actionSummary && (
            <div className="bg-[#12160a] border-l-4 border-[#c8a84b] px-4 py-2 rounded text-xs text-[#e8e4d0]">
              <strong className="text-[#c8a84b]">Chosen Action:</strong> {actionSummary}
            </div>
          )}

          {/* Story Textarea */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-mono text-[#9a9780]">
              <span>Aim for 80-120 words. No fantasy, no fatal injuries, keep the hero proactive.</span>
              <span>Words: {storyText.trim() ? storyText.trim().split(/\s+/).length : 0}</span>
            </div>
            <textarea
              value={storyText}
              onChange={(e) => setStoryText(e.target.value)}
              placeholder="Start writing: What led to the scene? What is currently happening? What was the outcome? E.g., Rohit, a 23-year-old mechanical engineer from Pune, was working at the assembly facility when an urgent pump system stalled..."
              rows={9}
              className="w-full bg-[#12160a] border border-[#3a4520] focus:border-[#c8a84b] rounded-xl p-4 text-sm text-[#e8e4d0] leading-relaxed outline-none"
            />
          </div>

          <div className="flex justify-between items-center pt-2">
            <span className="text-xs text-[#9a9780] font-mono">
              Timer will automatically transition to Narration when finished.
            </span>
            <button
              onClick={handleStageAdvance}
              className="px-6 py-2.5 rounded-lg bg-[#c8a84b] hover:bg-[#a8882e] text-[#12160a] font-heading font-bold text-xs uppercase tracking-wider"
            >
              Done Writing &rarr; Proceed to Narration
            </button>
          </div>
        </div>
      )}

      {/* ──────────────── STAGE 4: 1m VERBAL NARRATION ──────────────── */}
      {stage === STAGES.NARRATION && (
        <div className="bg-[#1b2212] border-2 border-[#c8a84b] rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-[#3a4520] pb-4">
            <div>
              <span className="text-xs font-mono uppercase text-[#c8a84b] font-bold">
                SSB Stage 1 — Discussion Room Round
              </span>
              <h2 className="font-heading text-xl text-[#e8e4d0] font-bold">
                Individual Narration (1 Minute Speech)
              </h2>
            </div>
            <TimerCircle
              totalSeconds={60}
              remainingSeconds={secondsLeft}
              size={80}
              label="Narration"
            />
          </div>

          {/* Written story preview for quick recall */}
          <div className="bg-[#12160a] border border-[#3a4520] p-4 rounded-xl text-xs space-y-1">
            <span className="font-mono text-[#c8a84b] font-bold uppercase block">
              Reference Story You Just Wrote:
            </span>
            <p className="text-[#9a9780] italic leading-relaxed line-clamp-3">
              "{storyText || 'No written story.'}"
            </p>
          </div>

          {/* Speech Recorder */}
          <SpeechRecorder
            initialText={narrationTranscript}
            onTranscriptChange={(t) => setNarrationTranscript(t)}
            label="Speak your 1-minute narration into the microphone"
          />

          <div className="flex justify-between items-center pt-2">
            <span className="text-xs text-[#9a9780] font-mono">
              Speak clearly: 'Good morning friends, in the picture I perceived...'
            </span>
            <button
              onClick={triggerEvaluation}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-heading font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Submit &amp; Run Gemini AI Assessment</span>
            </button>
          </div>
        </div>
      )}

      {/* ──────────────── STAGE 5: AI EVALUATING SPINNER ──────────────── */}
      {stage === STAGES.EVALUATING && (
        <div className="bg-[#1b2212] border border-[#3a4520] rounded-2xl p-12 text-center space-y-4">
          <div className="w-16 h-16 border-4 border-[#c8a84b] border-t-transparent rounded-full animate-spin mx-auto" />
          <h3 className="font-heading text-xl text-[#e8e4d0] font-bold tracking-wide">
            SSB Psychologist AI is Analyzing Your Response
          </h3>
          <p className="text-sm text-[#9a9780] max-w-md mx-auto">
            Extracting 15 Officer Like Qualities (OLQs), testing narrative past-present-future congruence, checking action orientation, and preparing your recommendation verdict...
          </p>
        </div>
      )}

      {/* ──────────────── STAGE 6: RESULT DOSSIER ──────────────── */}
      {stage === STAGES.RESULT && (
        <div className="space-y-6">
          {evalError ? (
            <div className="bg-red-950/40 border border-red-800 rounded-xl p-6 text-red-300 space-y-3">
              <div className="flex items-center gap-2 font-bold font-heading text-lg">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <span>AI Assessment Notice</span>
              </div>
              <p className="text-sm">{evalError}</p>
              <button
                onClick={resetAll}
                className="px-4 py-2 bg-red-800/60 hover:bg-red-700 rounded text-xs font-mono uppercase"
              >
                Try Again
              </button>
            </div>
          ) : (
            <AIReviewReport review={evaluation} onRetry={resetAll} />
          )}

          <div className="flex justify-center">
            <button
              onClick={resetAll}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#222810] hover:bg-[#2d3a18] border border-[#3a4520] text-xs font-mono text-[#c8a84b] font-bold"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Start Fresh PPDT Simulation</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
