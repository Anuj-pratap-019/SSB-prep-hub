import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  Sparkles, 
  Mic, 
  Brain, 
  Award, 
  Clock, 
  ArrowRight, 
  UserCheck, 
  Compass, 
  BarChart3,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

export default function Home() {
  const testCategories = [
    {
      stage: 'Day 1 Screening Battery',
      stageBadge: 'Screening Day',
      badgeColor: 'text-[#c8a84b] border-[#c8a84b]/40 bg-[#c8a84b]/10',
      description: 'The critical first elimination round. Master picture perception and reasoning speed.',
      tests: [
        {
          title: 'PPDT AI Simulator',
          subtitle: 'Picture Perception & Discussion Test',
          path: '/ppdt',
          icon: Sparkles,
          iconBg: 'bg-[#4a5c2a]/40 text-[#c8a84b]',
          badge: 'Flagship AI',
          badgeStyle: 'bg-[#c8a84b] text-[#12160a]',
          description: 'Authentic 5-stage simulation: 30s stimulus observation, box character marking, 4-min story writing, and 1-min browser speech narration analyzed by Gemini AI.',
          features: ['Ambiguous image stimuli', 'Timed narration capture', '15 OLQ psychometric score'],
        },
        {
          title: 'OIR Reasoning Test',
          subtitle: 'Officer Intelligence Rating',
          path: '/oir',
          icon: Award,
          iconBg: 'bg-amber-950/40 text-amber-400',
          badge: 'Graded',
          badgeStyle: 'bg-amber-400/20 text-amber-300 border border-amber-400/40',
          description: 'Official-pattern verbal and non-verbal reasoning MCQs designed to calculate your exact OIR Grade (Grade I to V) with instantaneous accuracy analysis.',
          features: ['30 reasoning challenges', 'Timed countdown timer', 'Official Grade I-V rating'],
        },
      ],
    },
    {
      stage: 'Day 2 Psychological Battery',
      stageBadge: 'Psychologist Tests',
      badgeColor: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10',
      description: 'Projective psych testing. Evaluates your unconscious thoughts and spontaneous character reactions.',
      tests: [
        {
          title: 'Word Association Test (WAT)',
          subtitle: '60 Words · 15 Seconds Each',
          path: '/wat',
          icon: Clock,
          iconBg: 'bg-blue-950/40 text-blue-400',
          badge: 'Speed Drill',
          badgeStyle: 'bg-blue-400/20 text-blue-300 border border-blue-400/40',
          description: 'Automatic rapid stimulus test. Write natural, positive, and officer-calibre sentences under strict 15-second time pressure per word.',
          features: ['Official 15s auto-ticker', 'Real-time AI critique', 'Positivity & depth check'],
        },
        {
          title: 'Situation Reaction Test (SRT)',
          subtitle: 'Practical Crisis Responses',
          path: '/srt',
          icon: Brain,
          iconBg: 'bg-purple-950/40 text-purple-400',
          badge: 'AI Graded',
          badgeStyle: 'bg-purple-400/20 text-purple-300 border border-purple-400/40',
          description: 'Real-world military, social, and emergency dilemmas. Type quick, decisive reactions and benchmark against psychological gold standards.',
          features: ['Realistic situations', 'Action-oriented feedback', 'OLQ mapping'],
        },
        {
          title: 'Thematic Apperception Test (TAT)',
          subtitle: '10 Thematic Story Prompts',
          path: '/tat',
          icon: Sparkles,
          iconBg: 'bg-teal-950/40 text-teal-400',
          badge: 'Narrative',
          badgeStyle: 'bg-teal-400/20 text-teal-300 border border-teal-400/40',
          description: 'Standard 4-minute story writing module. Practice formulating past background, present decisive execution, and realistic outcome for 10 scenes.',
          features: ['10 rich prompt themes', 'Standard 4-min clock', 'Hero OLQ character analysis'],
        },
        {
          title: 'Self Description (SD)',
          subtitle: '5-Angle Self Appraisal',
          path: '/sd',
          icon: UserCheck,
          iconBg: 'bg-emerald-950/40 text-emerald-400',
          badge: 'Introspection',
          badgeStyle: 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/40',
          description: 'Structure your 5 crucial statements: Parents, Teachers, Friends, Self, and Future Aims. Analyzed for psychological honesty and maturity.',
          features: ['5 structured fields', 'Psychological congruence check', 'Actionable suggestions'],
        },
      ],
    },
    {
      stage: 'Days 3 to 5: Interview & GTO Tasks',
      stageBadge: 'Interviews & Ground Tasks',
      badgeColor: 'text-sky-400 border-sky-500/40 bg-sky-500/10',
      description: 'Interactive spoken assessments and group obstacle strategies evaluated by the Board.',
      tests: [
        {
          title: 'AI Mock Personal Interview',
          subtitle: 'Voice-to-Voice Conversational PI',
          path: '/pi',
          icon: Mic,
          iconBg: 'bg-rose-950/40 text-rose-400',
          badge: 'Voice AI',
          badgeStyle: 'bg-rose-400/20 text-rose-300 border border-rose-400/40',
          description: 'Live spoken interview with Col. Rathore (Retd.). Speak answers directly via microphone and receive counter-questions and personality appraisal.',
          features: ['Speech recognition input', 'Dynamic follow-up questions', 'Confidence & tone dossier'],
        },
        {
          title: 'GTO Ground Tasks Manual',
          subtitle: 'PGT, HGT, Snake Race & Command Task',
          path: '/gto',
          icon: Compass,
          iconBg: 'bg-[#4a5c2a]/40 text-[#c8a84b]',
          badge: 'Guide & Tactics',
          badgeStyle: 'bg-[#c8a84b]/20 text-[#c8a84b] border border-[#c8a84b]/40',
          description: 'Complete breakdown of outdoor group testing: rules of fulcrum, cantilever principles, bridging methods, and group dynamics tactics.',
          features: ['Bridging techniques', 'Do’s and Don’ts for tasks', 'Leadership & group behaviour'],
        },
      ],
    },
  ];

  return (
    <div className="space-y-16 pb-20">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden premium-shell rounded-b-[28px] border-b border-[#3a4520] pt-12 sm:pt-16 pb-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#162013] border border-[#c8a84b]/30 shadow-[0_0_0_1px_rgba(200,168,75,0.12)]">
            <span className="w-2 h-2 rounded-full bg-[#c8a84b] animate-ping" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-[0.22em] text-[#d7bb63] premium-badge">
              Services Selection Board · AI Evaluation Suite
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-7xl font-bold tracking-[-0.04em] text-[#f4f0e5] uppercase leading-[0.95]">
            Master Every SSB Test with <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d7bb63] via-[#f0d27a] to-[#b7973e]">
              Dedicated Practice &amp; AI Feedback
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#b2b29b] leading-relaxed">
            Prepare for NDA, CDS, AFCAT, and SSC entries with realistic, distraction-free test environments. Select any module below to practice in dedicated full-page focus mode.
          </p>


        </div>
      </section>

      {/* Categorized Test Sections */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        {testCategories.map((cat, idx) => (
          <section key={idx} className="space-y-6">
            
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#2d3818] pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${cat.badgeColor}`}>
                    {cat.stageBadge}
                  </span>
                </div>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold tracking-wide text-[#e8e4d0]">
                  {cat.stage}
                </h2>
                <p className="text-xs sm:text-sm text-[#918e7c] mt-0.5">
                  {cat.description}
                </p>
              </div>
            </div>

            {/* Test Cards Grid */}
            <div className={`grid grid-cols-1 ${cat.tests.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-2'} gap-6`}>
              {cat.tests.map((test) => {
                const Icon = test.icon;
                return (
                  <div
                    key={test.path}
                    className="bg-[#171d10] border border-[#303c1b] hover:border-[#c8a84b]/70 rounded-2xl p-6 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-xl group h-full"
                  >
                    <div className="space-y-5 flex-1">
                      
                      {/* Card Top */}
                      <div className="flex items-start justify-between gap-3">
                        <div className={`w-12 h-12 rounded-xl ${test.iconBg} border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        {test.badge && (
                          <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-[0.14em] ${test.badgeStyle}`}>
                            {test.badge}
                          </span>
                        )}
                      </div>

                      {/* Title & Subtitle */}
                      <div>
                        <h3 className="font-heading text-2xl sm:text-[2rem] font-bold leading-tight text-[#f0efe7] group-hover:text-[#d9c06c] transition-colors">
                          {test.title}
                        </h3>
                        <p className="text-[15px] font-medium text-[#d0b96f] mt-2 leading-relaxed">
                          {test.subtitle}
                        </p>
                      </div>

                      {/* Description */}
                      <p className="text-[15px] text-[#a9a38d] leading-7">
                        {test.description}
                      </p>

                      {/* Feature Bullet Points */}
                      <div className="pt-3 border-t border-[#253015] grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {test.features.map((feat, fIdx) => (
                          <span 
                            key={fIdx} 
                            className="inline-flex items-center gap-2 text-[14px] font-medium text-[#d5d0bf] bg-[#12160a] px-3 py-2.5 rounded-lg border border-[#263116] min-h-[42px]"
                          >
                            <CheckCircle2 className="w-4 h-4 text-[#c8a84b] flex-shrink-0" />
                            <span>{feat}</span>
                          </span>
                        ))}
                      </div>

                    </div>

                    {/* Bottom CTA Button */}
                    <div className="pt-6 mt-4">
                      <Link
                        to={test.path}
                        className="w-full py-3 px-4 rounded-xl bg-[#202814] group-hover:bg-[#c8a84b] text-[#dcd7c7] group-hover:text-[#12160a] font-heading font-bold text-xs uppercase tracking-[0.16em] flex items-center justify-center gap-2 transition-all border border-[#35431e] group-hover:border-[#c8a84b]"
                      >
                        <span>Open {test.title}</span>
                        <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>

                  </div>
                );
              })}
            </div>

          </section>
        ))}

        {/* Analytics Callout Banner */}
        <section className="bg-gradient-to-r from-[#1c2412] via-[#242e16] to-[#1a2110] border border-[#3d4b22] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#12160a] border border-[#c8a84b]/30 text-xs font-mono text-[#c8a84b]">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>15 OLQs Dossier Tracking</span>
            </div>
            <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#e8e4d0]">
              Candidate Psychological Radar &amp; Progress
            </h3>
            <p className="text-xs sm:text-sm text-[#999684] max-w-xl">
              Every completed PPDT narration, WAT sentence, and SRT response aggregates into your personal psychometric profile. View your Factor I to IV OLQ coverage anytime.
            </p>
          </div>
          <Link
            to="/dashboard"
            className="flex-shrink-0 px-6 py-3 rounded-xl bg-[#c8a84b] hover:bg-[#d8b85b] text-[#12160a] font-heading font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow"
          >
            <span>View Performance Radar</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>

      </div>

    </div>
  );
}
