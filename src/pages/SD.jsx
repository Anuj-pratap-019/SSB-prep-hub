import React, { useState } from 'react';
import { User, Sparkles, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { evaluateSelfDescription } from '../services/gemini';
import TestPageHeader from '../components/TestPageHeader';

export default function SD() {
  const [sd, setSd] = useState({
    parents: 'My parents consider me affectionate, sincere, and dependable. They appreciate that I help with household duties and take academic goals seriously. My father advises me to practice more patience during family discussions.',
    teachers: 'My professors have viewed me as an attentive and disciplined student who meets project deadlines consistently. They noted my analytical aptitude during laboratory seminars and encouraged me to speak up more in large debates.',
    friends: 'My close comrades value my loyalty and cheerfulness. They count on me to organize group study sessions and trek outings. Occasionally they tease me for being excessively detail-oriented.',
    self: 'I consider myself determined, socially open, and eager to serve as a military officer. I handle physical challenges with vigor. My area of improvement is time-management under high pressure, which I am rectifying through daily scheduling.',
    aims: 'I aim to earn a commission in the Armed Forces, lead troops with moral courage and tactical mastery, and make my parents and nation proud.'
  });

  const [evaluating, setEvaluating] = useState(false);
  const [result, setResult] = useState(null);

  const handleEvaluate = async () => {
    setEvaluating(true);
    setResult(null);
    try {
      const res = await evaluateSelfDescription(sd);
      setResult(res);
    } catch (err) {
      console.warn('SD eval error:', err);
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      
      {/* Test Page Header */}
      <TestPageHeader
        stage="Day 2: Psychological Battery"
        title="Self Description (SD)"
        subtitle="15 minutes · 5 perspectives. Assesses self-awareness, honesty, and psychological consistency across all five lenses."
        badge="Final Psych Test"
      />

      <div className="bg-[#1b2212] border-2 border-[#3a4520] rounded-2xl p-6 sm:p-8 space-y-6">
        
        {/* 5 Input Sections */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-mono uppercase text-[#c8a84b] font-bold block mb-1">
              1. Parents' / Guardians' Opinion of You
            </label>
            <textarea
              value={sd.parents}
              onChange={(e) => setSd({ ...sd, parents: e.target.value })}
              rows={3}
              className="w-full bg-[#12160a] border border-[#3a4520] focus:border-[#c8a84b] rounded-xl p-3 text-xs text-[#e8e4d0] outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-mono uppercase text-[#c8a84b] font-bold block mb-1">
              2. Teachers' / Employers' / Professors' Opinion of You
            </label>
            <textarea
              value={sd.teachers}
              onChange={(e) => setSd({ ...sd, teachers: e.target.value })}
              rows={3}
              className="w-full bg-[#12160a] border border-[#3a4520] focus:border-[#c8a84b] rounded-xl p-3 text-xs text-[#e8e4d0] outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-mono uppercase text-[#c8a84b] font-bold block mb-1">
              3. Friends' / Peers' Opinion of You
            </label>
            <textarea
              value={sd.friends}
              onChange={(e) => setSd({ ...sd, friends: e.target.value })}
              rows={3}
              className="w-full bg-[#12160a] border border-[#3a4520] focus:border-[#c8a84b] rounded-xl p-3 text-xs text-[#e8e4d0] outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-mono uppercase text-[#c8a84b] font-bold block mb-1">
              4. Your Own Opinion (Strengths &amp; True Areas of Improvement)
            </label>
            <textarea
              value={sd.self}
              onChange={(e) => setSd({ ...sd, self: e.target.value })}
              rows={3}
              className="w-full bg-[#12160a] border border-[#3a4520] focus:border-[#c8a84b] rounded-xl p-3 text-xs text-[#e8e4d0] outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-mono uppercase text-[#c8a84b] font-bold block mb-1">
              5. Aims in Life &amp; Qualities You Strive to Develop
            </label>
            <textarea
              value={sd.aims}
              onChange={(e) => setSd({ ...sd, aims: e.target.value })}
              rows={3}
              className="w-full bg-[#12160a] border border-[#3a4520] focus:border-[#c8a84b] rounded-xl p-3 text-xs text-[#e8e4d0] outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            disabled={evaluating}
            onClick={handleEvaluate}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#c8a84b] to-[#a8882e] hover:from-[#d8b85b] disabled:opacity-40 text-[#12160a] font-heading font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg"
          >
            <Sparkles className="w-4 h-4" />
            <span>{evaluating ? 'Analyzing Congruence...' : 'Check Psychological Consistency (Gemini AI)'}</span>
          </button>
        </div>

        {/* AI Result */}
        {result && (
          <div className="bg-[#12160a] border-2 border-[#c8a84b] rounded-xl p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-[#3a4520] pb-3">
              <span className="font-heading font-bold text-sm text-[#e8e4d0]">
                Psychological Congruence Rating: <strong className="text-[#c8a84b]">{result.congruenceScore}/10</strong>
              </span>
              <span className="text-xs font-mono px-3 py-1 rounded bg-[#222810] text-emerald-400 font-bold">
                {result.overallVerdict}
              </span>
            </div>

            <p className="text-[#e8e4d0] leading-relaxed">{result.personalitySummary}</p>

            {result.improvementTips && (
              <div className="bg-[#1b2212] p-4 rounded-xl border border-[#3a4520] space-y-2">
                <span className="font-mono text-[#c8a84b] font-bold uppercase block">
                  💡 Psychologist Recommendations for Interview Defense:
                </span>
                <ul className="list-disc list-inside space-y-1 text-[#e8e4d0]/90">
                  {result.improvementTips.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
}
