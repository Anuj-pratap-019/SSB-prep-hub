import React, { useState } from 'react';
import { Shield, Award, CheckCircle, ChevronRight, Compass } from 'lucide-react';
import { GTO_TASKS } from '../data/olqs';
import TestPageHeader from '../components/TestPageHeader';

export default function GTOGuide() {
  const [selectedTaskIndex, setSelectedTaskIndex] = useState(0);
  const activeTask = GTO_TASKS[selectedTaskIndex] || GTO_TASKS[0];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      
      {/* Test Page Header */}
      <TestPageHeader
        stage="Days 3 & 4: GTO Series"
        title="GTO Tactical Manual"
        subtitle="Complete strategy guide for all 9–10 outdoor & indoor Group Testing Officer tasks — PGT, HGT, Command Task, Snake Race, and Lecturette."
        badge="Ground Tasks Guide"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Task List Navigation */}
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase text-[#9a9780] font-bold block mb-1">
            Select GTO Task
          </span>
          {GTO_TASKS.map((task, idx) => {
            const isSelected = selectedTaskIndex === idx;
            return (
              <button
                key={task.id}
                onClick={() => setSelectedTaskIndex(idx)}
                className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                  isSelected
                    ? 'bg-[#2d3a18] border-[#c8a84b] text-[#c8a84b] font-bold shadow-md'
                    : 'bg-[#1b2212] border-[#3a4520] text-[#e8e4d0] hover:border-[#c8a84b]/40'
                }`}
              >
                <div>
                  <span className="text-xs font-mono text-[#9a9780] block">
                    Task #{task.id} · {task.type}
                  </span>
                  <span className="font-heading text-sm font-bold block">
                    {task.title}
                  </span>
                </div>
                <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-[#c8a84b]' : 'text-[#3a4520]'}`} />
              </button>
            );
          })}
        </div>

        {/* Right: Task Deep Dive Dossier */}
        <div className="lg:col-span-2 bg-[#1b2212] border-2 border-[#3a4520] rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-[#3a4520] pb-4">
            <div>
              <span className="text-xs font-mono uppercase text-[#c8a84b] font-bold">
                {activeTask.type}
              </span>
              <h2 className="font-heading text-2xl font-bold text-[#e8e4d0]">
                {activeTask.title}
              </h2>
            </div>
          </div>

          {/* Overview */}
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase text-[#9a9780] font-bold block">
              Task Brief &amp; Format:
            </span>
            <p className="text-sm text-[#e8e4d0] leading-relaxed">
              {activeTask.overview}
            </p>
          </div>

          {/* OLQs Being Assessed */}
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase text-[#c8a84b] font-bold block">
              Core Officer Like Qualities (OLQs) Under Scrutiny:
            </span>
            <div className="flex flex-wrap gap-2">
              {activeTask.assessorLooksFor.map((olq, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg bg-[#12160a] border border-[#3a4520] text-xs font-mono text-[#c8a84b] font-bold"
                >
                  🎖️ {olq}
                </span>
              ))}
            </div>
          </div>

          {/* Golden Tactical Rules */}
          <div className="space-y-3 bg-[#12160a] border border-[#3a4520] p-5 rounded-xl">
            <span className="text-xs font-mono uppercase text-emerald-400 font-bold block">
              🛡️ Golden Tactical Rules to Clear This Task:
            </span>
            <div className="space-y-2">
              {activeTask.goldenRules.map((rule, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-[#e8e4d0] leading-relaxed">
                  <CheckCircle className="w-4 h-4 text-[#c8a84b] mt-0.5 flex-shrink-0" />
                  <span>{rule}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
