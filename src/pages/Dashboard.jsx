import React, { useEffect, useMemo, useState } from 'react';
import { Award, Shield, CheckCircle, TrendingUp, Copy, Check, Sparkles, BarChart2 } from 'lucide-react';
import { OLQS } from '../data/olqs';
import { getEvaluationHistory } from '../lib/evaluationHistory';

export default function Dashboard({ setActiveTab }) {
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const refreshHistory = () => getEvaluationHistory().then(setHistory).catch(console.error);
    refreshHistory();
    window.addEventListener('ssb-evaluation-saved', refreshHistory);
    window.addEventListener('storage', refreshHistory);
    return () => {
      window.removeEventListener('ssb-evaluation-saved', refreshHistory);
      window.removeEventListener('storage', refreshHistory);
    };
  }, []);

  const resumeBullet = `SSB Prep Hub — AI-Powered Armed Forces Evaluation Platform (React 19, Vite, Gemini AI, Web Speech API)
• Architected a full-stack psychometric evaluation platform simulating 5-day SSB (Services Selection Board) interview tests.
• Engineered a 5-stage PPDT simulation utilizing Google Gemini 1.5/2.5 Flash for natural language psychometric scoring of characterization, narrative coherence, and OLQ (Officer Like Qualities) alignment.
• Integrated browser-native Web Speech API for real-time speech-to-text transcription during individual narration and conversational PI (Personal Interview) mock sessions.
• Developed adaptive conversational AI Interviewing Officer (Col. Rathore) with dynamic follow-up probing and psychometric debriefing.`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(resumeBullet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const latestByTest = useMemo(() => (
    history.reduce((latest, entry) => {
      if (!latest[entry.testType]) latest[entry.testType] = entry;
      return latest;
    }, {})
  ), [history]);
  const scoreAsPercentage = (entry) => {
    if (!entry || entry.score === null) return null;
    return Math.round((entry.score <= 5 ? entry.score / 5 : entry.score / 10) * 100);
  };
  const readiness = history.length
    ? Math.round(history.reduce((sum, entry) => sum + (scoreAsPercentage(entry) || 0), 0) / history.length)
    : null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#3a4520] pb-4">
        <div>
          <span className="text-xs bg-[#c8a84b]/20 text-[#c8a84b] border border-[#c8a84b]/40 px-2 py-0.5 rounded font-mono font-semibold">
            CANDIDATE INTELLIGENCE DOSSIER
          </span>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-wide text-[#e8e4d0] mt-1">
            SSB Performance &amp; OLQ Analytics
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-4 py-2 rounded-xl bg-[#1b2212] border border-[#c8a84b] text-center">
            <span className="text-[10px] font-mono text-[#9a9780] block uppercase">Readiness Index</span>
            <span className="font-heading text-xl font-bold text-emerald-400">
              {readiness === null ? 'No attempts yet' : `${readiness}% current readiness`}
            </span>
          </div>
        </div>
      </div>

      {/* Latest score by test */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {['OIR', 'PPDT', 'TAT', 'WAT', 'SRT', 'SD'].map((testType) => {
          const entry = latestByTest[testType];
          const percentage = scoreAsPercentage(entry);
          return (
          <div key={testType} className="bg-[#1b2212] border border-[#3a4520] rounded-xl p-4 space-y-2">
            <span className="text-[11px] font-mono text-[#9a9780] block font-bold">{testType}</span>
            <div className="flex items-baseline justify-between">
              <span className="font-heading text-2xl font-bold text-[#e8e4d0]">{percentage === null ? '—' : `${percentage}%`}</span>
              <span className="text-xs font-mono text-[#c8a84b]">{entry ? 'Latest' : 'Not attempted'}</span>
            </div>
            <div className="w-full bg-[#12160a] h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-1000"
                style={{ width: `${percentage || 0}%` }}
              />
            </div>
          </div>
          );
        })}
      </div>

      <div className="bg-[#1b2212] border border-[#3a4520] rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-xl font-bold text-[#e8e4d0]">Evaluation History</h2>
            <p className="text-xs text-[#9a9780] mt-1">Your completed AI assessments are saved on this device.</p>
          </div>
          <span className="text-xs font-mono text-[#c8a84b]">{history.length} attempt{history.length === 1 ? '' : 's'}</span>
        </div>
        {history.length === 0 ? (
          <p className="text-sm text-[#9a9780]">Complete a PPDT, TAT, WAT, SRT, or SD assessment to start tracking your progress.</p>
        ) : (
          <div className="space-y-2">
            {history.slice(0, 10).map((entry) => (
              <div key={entry.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#12160a] border border-[#3a4520] rounded-lg px-4 py-3">
                <div>
                  <span className="font-heading font-bold text-[#c8a84b]">{entry.testType}</span>
                  <span className="text-xs text-[#9a9780] ml-3">{new Date(entry.createdAt).toLocaleString()}</span>
                  {entry.result && <p className="text-xs text-[#e8e4d0] mt-1 line-clamp-1">{entry.result}</p>}
                </div>
                <span className="font-heading font-bold text-emerald-400">{scoreAsPercentage(entry) === null ? 'Reviewed' : `${scoreAsPercentage(entry)}%`}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Resume Pitch Box (Special Feature for Final Year B.Tech Student!) */}
      <div className="bg-gradient-to-br from-[#1b2212] via-[#222a15] to-[#161c0d] border-2 border-[#c8a84b] rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-6 h-6 text-[#c8a84b]" />
            <div>
              <h2 className="font-heading text-xl font-bold text-[#c8a84b]">
                Resume Portfolio Generator (For Final Year B.Tech)
              </h2>
              <p className="text-xs text-[#9a9780]">
                Copy-paste this production-grade bullet point directly into your Resume / LinkedIn under Projects!
              </p>
            </div>
          </div>

          <button
            onClick={copyToClipboard}
            className="px-5 py-2.5 rounded-xl bg-[#c8a84b] hover:bg-[#a8882e] text-[#12160a] font-heading font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Resume Bullet'}</span>
          </button>
        </div>

        <div className="bg-[#12160a] border border-[#3a4520] rounded-xl p-4 font-mono text-xs text-[#e8e4d0] leading-relaxed whitespace-pre-wrap select-all">
          {resumeBullet}
        </div>
      </div>

      {/* 15 OLQs Comprehensive Matrix */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-xl font-bold text-[#e8e4d0]">
            The 15 Officer Like Qualities (OLQ) Matrix
          </h2>
          <span className="text-xs font-mono text-[#9a9780]">Assessed across PPDT, TAT, WAT, SRT &amp; PI</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {OLQS.map((olq) => (
            <div
              key={olq.id}
              className="bg-[#1b2212] border border-[#3a4520] hover:border-[#c8a84b]/60 transition-all rounded-xl p-4 space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-heading text-sm font-bold text-[#c8a84b]">
                  {olq.id}. {olq.name}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#12160a] text-[#9a9780]">
                  {olq.factorShort}
                </span>
              </div>
              <p className="text-xs text-[#e8e4d0]/80 leading-relaxed">
                {olq.definition}
              </p>
              <div className="text-[11px] text-emerald-400 font-mono pt-1">
                ✓ Indicator: {olq.indicator}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
