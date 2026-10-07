import React from 'react';
import { Award, CheckCircle2, AlertTriangle, Sparkles, Star, TrendingUp, Lightbulb, UserCheck, Compass, ArrowRight } from 'lucide-react';

export default function AIReviewReport({ review, onRetry }) {
  if (!review) return null;

  const {
    overallScore = 4,
    verdict = 'Recommended',
    heroAnalysis = {},
    structure = {},
    olqsDemonstrated = [],
    olqsMissing = [],
    redFlags = [],
    positivityRating = 8,
    actionOrientationRating = 8,
    narrationFeedback = '',
    keyStrengths = [],
    improvementSuggestions = [],
    modelStorySnippet = ''
  } = review;

  const isRecommended = verdict.toLowerCase().includes('recommend') && !verdict.toLowerCase().includes('not');

  return (
    <div className="bg-[#1b2212] border-2 border-[#c8a84b]/60 rounded-2xl p-6 sm:p-8 space-y-8 shadow-2xl text-[#e8e4d0]">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#3a4520] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-[#c8a84b]" />
            <span className="text-xs font-mono uppercase tracking-widest text-[#c8a84b] font-bold">
              SSB Psychologist AI Assessment
            </span>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold tracking-wide">
            Candidate Performance Dossier
          </h2>
        </div>

        {/* Verdict Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-6 h-6 ${
                  star <= overallScore
                    ? 'text-[#c8a84b] fill-[#c8a84b]'
                    : 'text-[#3a4520]'
                }`}
              />
            ))}
          </div>
          <span className={`px-4 py-1.5 rounded-full text-xs font-heading font-bold uppercase tracking-wider border shadow-lg ${
            isRecommended
              ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/50'
              : 'bg-amber-950/80 text-amber-400 border-amber-500/50'
          }`}>
            {verdict}
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Hero Assessment */}
        <div className="bg-[#12160a] border border-[#3a4520] rounded-xl p-4 space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-[#9a9780] uppercase">
            <UserCheck className="w-4 h-4 text-[#c8a84b]" />
            <span>Hero Identification</span>
          </div>
          <p className="font-heading text-lg font-bold text-[#c8a84b]">
            {heroAnalysis.heroNameOrRole || 'Hero Detected'}
          </p>
          <p className="text-xs text-[#9a9780]">
            {heroAnalysis.comment || 'Hero age and personality aligned with candidate demographic.'}
          </p>
        </div>

        {/* Action Orientation */}
        <div className="bg-[#12160a] border border-[#3a4520] rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-[#9a9780] uppercase">
            <span className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Action Orientation</span>
            </span>
            <span className="font-bold text-[#e8e4d0]">{actionOrientationRating}/10</span>
          </div>
          <div className="w-full bg-[#222810] h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-1000"
              style={{ width: `${actionOrientationRating * 10}%` }}
            />
          </div>
          <p className="text-[11px] text-[#9a9780]">Measures concrete problem solving vs idle wishful thinking.</p>
        </div>

        {/* Positivity / Constructive Tone */}
        <div className="bg-[#12160a] border border-[#3a4520] rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-[#9a9780] uppercase">
            <span className="flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-[#c8a84b]" />
              <span>Psychological Tone</span>
            </span>
            <span className="font-bold text-[#e8e4d0]">{positivityRating}/10</span>
          </div>
          <div className="w-full bg-[#222810] h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#c8a84b] h-full rounded-full transition-all duration-1000"
              style={{ width: `${positivityRating * 10}%` }}
            />
          </div>
          <p className="text-[11px] text-[#9a9780]">Assesses resilience, absence of morbid themes, and constructive optimism.</p>
        </div>
      </div>

      {/* Story Structure Arc Breakdown */}
      {structure && (
        <div className="bg-[#12160a] border border-[#3a4520] rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-sm uppercase tracking-wider text-[#c8a84b] font-bold">
              Narrative Triad: Past · Present · Future
            </h3>
            {structure.score && (
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#222810] text-[#c8a84b]">
                Structure Score: {structure.score}/10
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs leading-relaxed">
            <div className="bg-[#1a2211] p-3 rounded-lg border border-[#303c1b]">
              <span className="font-bold font-mono text-[#c8a84b] block mb-1">1. Background (Past):</span>
              <p className="text-[#e8e4d0]/90">{structure.past || 'Adequately set up the context and precipitating situation.'}</p>
            </div>
            <div className="bg-[#1a2211] p-3 rounded-lg border border-[#303c1b]">
              <span className="font-bold font-mono text-emerald-400 block mb-1">2. Execution (Present):</span>
              <p className="text-[#e8e4d0]/90">{structure.present || 'Demonstrated active leadership, coordination, and resource mobilization.'}</p>
            </div>
            <div className="bg-[#1a2211] p-3 rounded-lg border border-[#303c1b]">
              <span className="font-bold font-mono text-amber-400 block mb-1">3. Resolution (Future):</span>
              <p className="text-[#e8e4d0]/90">{structure.future || 'Logical and satisfying mission conclusion with positive social impact.'}</p>
            </div>
          </div>
        </div>
      )}

      {/* OLQs Detected Section */}
      <div className="space-y-4">
        <h3 className="font-heading text-lg tracking-wider text-[#e8e4d0] font-bold flex items-center gap-2">
          <Award className="w-5 h-5 text-[#c8a84b]" />
          <span>Officer Like Qualities (OLQs) Detected</span>
        </h3>

        {olqsDemonstrated.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {olqsDemonstrated.map((olq, idx) => (
              <div
                key={idx}
                className="bg-[#12160a] border border-[#3a4520] hover:border-[#c8a84b]/50 transition-colors rounded-xl p-3.5 space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-heading font-bold text-sm text-[#c8a84b]">
                    {olq.name}
                  </span>
                  {olq.factor && (
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#222810] text-[#9a9780]">
                      {olq.factor}
                    </span>
                  )}
                </div>
                {olq.quote && (
                  <p className="text-xs italic text-[#e8e4d0]/80 border-l-2 border-[#c8a84b] pl-2 my-1">
                    "{olq.quote}"
                  </p>
                )}
                <p className="text-[11px] text-[#9a9780]">{olq.insight}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-amber-400 bg-amber-950/20 p-3 rounded border border-amber-900/30">
            No clear OLQs were explicitly demonstrated in this response. Ensure your hero takes active initiative, cooperates with team members, and acts decisively.
          </p>
        )}
      </div>

      {/* Red Flags & Areas to Watch */}
      {redFlags && redFlags.length > 0 && (
        <div className="bg-red-950/20 border border-red-900/40 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-red-400">
            <AlertTriangle className="w-4 h-4" />
            <span>Psychological Red Flags to Eliminate</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-xs text-red-300/90">
            {redFlags.map((flag, idx) => (
              <li key={idx}>{flag}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Narration Critique (if audio narration was given) */}
      {narrationFeedback && (
        <div className="bg-[#12160a] border border-[#3a4520] rounded-xl p-4 space-y-1">
          <span className="text-xs font-mono text-[#c8a84b] uppercase font-bold">
            Verbal Narration &amp; Speech Feedback
          </span>
          <p className="text-xs text-[#e8e4d0] leading-relaxed">{narrationFeedback}</p>
        </div>
      )}

      {/* Concrete Improvement Suggestions */}
      {improvementSuggestions && improvementSuggestions.length > 0 && (
        <div className="bg-[#12160a] border border-[#3a4520] rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#c8a84b] font-bold">
            <Lightbulb className="w-4 h-4" />
            <span>How to Score Higher in Next Attempt</span>
          </div>
          <div className="space-y-2">
            {improvementSuggestions.map((tip, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-[#e8e4d0]">
                <ArrowRight className="w-3.5 h-3.5 text-[#c8a84b] mt-0.5 flex-shrink-0" />
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Model Story Snippet */}
      {modelStorySnippet && (
        <div className="bg-gradient-to-r from-[#222a14] to-[#1a2110] border border-[#c8a84b]/40 rounded-xl p-5 space-y-2">
          <span className="text-xs font-mono font-bold uppercase text-[#c8a84b]">
            💡 Model Story Plot (SSB Recommended Pattern)
          </span>
          <p className="text-xs text-[#e8e4d0] italic leading-relaxed">
            "{modelStorySnippet}"
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-[#3a4520]">
        <button
          onClick={() => window.print()}
          className="px-4 py-2 rounded-lg bg-[#222810] hover:bg-[#2d3715] border border-[#3a4520] text-xs font-mono text-[#e8e4d0] transition-colors"
        >
          🖨️ Print / Save PDF Dossier
        </button>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-6 py-2 rounded-lg bg-[#c8a84b] hover:bg-[#a8882e] text-[#12160a] text-xs font-heading font-bold uppercase tracking-wider shadow-lg transition-all"
          >
            Practise Another Stimulus →
          </button>
        )}
      </div>

    </div>
  );
}
