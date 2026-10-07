import React, { useState } from 'react';
import { Sparkles, Eye, Clock, RotateCcw, ArrowRight } from 'lucide-react';
import TimerCircle from '../components/TimerCircle';
import { PPDT_SCENES } from '../data/ppdtScenes';
import { evaluateTAT } from '../services/gemini';

import TestPageHeader from '../components/TestPageHeader';

export default function TAT() {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [story, setStory] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [result, setResult] = useState(null);

  const activeScene = PPDT_SCENES[sceneIndex] || PPDT_SCENES[0];

  const handleEvaluate = async () => {
    if (!story.trim()) return;
    setEvaluating(true);
    setResult(null);
    try {
      const res = await evaluateTAT({
        story: story.trim(),
        sceneTheme: activeScene.title,
        sceneDescription: activeScene.prompt
      });
      setResult(res);
    } catch (err) {
      console.warn('TAT eval error:', err);
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <TestPageHeader
        stage="Day 2: Psychological Battery"
        title="Thematic Apperception Test (TAT)"
        subtitle="12 ambiguous pictures (including 1 blank card). Formulate heroic, structured stories projecting your genuine OLQs."
        badge="Psych Projective Test"
      />

      <div className="bg-[#1b2212] border-2 border-[#3a4520] rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between text-xs font-mono text-[#9a9780]">
          <span>Theme: {activeScene.title}</span>
          <span className="px-2 py-0.5 rounded bg-[#222810] text-[#c8a84b]">Stimulus #{activeScene.id}</span>
        </div>

        {/* Scene Graphic */}
        <div
          className="w-full aspect-[16/9] max-h-[360px] rounded-xl overflow-hidden border border-[#3a4520] bg-black shadow-inner"
          dangerouslySetInnerHTML={{ __html: activeScene.svgContent }}
        />

        <div className="space-y-2">
          <label className="text-xs font-mono uppercase text-[#9a9780] font-bold block">
            Write Your Thematic Story (Past Background &rarr; Decisive Action &rarr; Positive Outcome)
          </label>
          <textarea
            value={story}
            onChange={(e) => setStory(e.target.value)}
            placeholder="Introduce your hero, set the problem context, explain step-by-step action taken, and conclude with the tangible result..."
            rows={7}
            className="w-full bg-[#12160a] border border-[#3a4520] focus:border-[#c8a84b] rounded-xl p-4 text-sm text-[#e8e4d0] outline-none leading-relaxed"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex gap-2">
            {PPDT_SCENES.map((_, i) => (
              <button
                key={i}
                onClick={() => { setSceneIndex(i); setResult(null); setStory(''); }}
                className={`w-7 h-7 rounded text-xs font-mono ${
                  sceneIndex === i ? 'bg-[#c8a84b] text-[#12160a] font-bold' : 'bg-[#12160a] border border-[#3a4520] text-[#9a9780]'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            disabled={evaluating || !story.trim()}
            onClick={handleEvaluate}
            className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#c8a84b] to-[#a8882e] hover:from-[#d8b85b] disabled:opacity-40 text-[#12160a] font-heading font-bold text-xs uppercase tracking-wider flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{evaluating ? 'Analyzing...' : 'Evaluate TAT Story (AI)'}</span>
          </button>
        </div>

        {/* AI Result Card */}
        {result && (
          <div className="bg-[#12160a] border-2 border-[#c8a84b] rounded-xl p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-[#3a4520] pb-3">
              <span className="font-heading font-bold text-sm text-[#e8e4d0]">
                Psychologist Assessment Score: <strong className="text-[#c8a84b]">{result.score}/10</strong>
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[#9a9780] font-mono uppercase block font-bold">Hero Assessment:</span>
              <p className="text-[#e8e4d0]">{result.heroAssessment}</p>
            </div>

            {result.olqsFound && result.olqsFound.length > 0 && (
              <div className="space-y-1">
                <span className="text-[#9a9780] font-mono uppercase block font-bold">OLQs Evidenced:</span>
                <div className="flex flex-wrap gap-1.5">
                  {result.olqsFound.map((item, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-400 font-mono">
                      ✓ {item.name}: {item.evidence}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {result.improvedVersion && (
              <div className="bg-[#1b2212] p-3 rounded-lg border border-[#3a4520] space-y-1">
                <span className="font-mono text-[#c8a84b] font-bold block uppercase">
                  💡 High-Scoring Revision Idea:
                </span>
                <p className="text-[#e8e4d0] italic leading-relaxed">{result.improvedVersion}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
