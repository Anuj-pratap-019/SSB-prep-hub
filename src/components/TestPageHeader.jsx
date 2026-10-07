import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ArrowLeft } from 'lucide-react';

export default function TestPageHeader({ 
  stage = 'Stage 1: Screening', 
  title, 
  subtitle, 
  badge,
  badgeColor = 'bg-[#c8a84b]/20 text-[#c8a84b] border-[#c8a84b]/40',
  actions
}) {
  return (
    <div className="mb-8 pb-6 border-b border-[#3a4520]/70 space-y-4">
      {/* Breadcrumb & Back Link */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-1.5 text-[#8e8b78]">
          <Link 
            to="/" 
            className="flex items-center gap-1 hover:text-[#c8a84b] transition-colors py-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Hub</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#555a42]" />
          <span className="text-[#a5a18c]">{stage}</span>
          <ChevronRight className="w-3.5 h-3.5 text-[#555a42]" />
          <span className="text-[#c8a84b] font-semibold">{title}</span>
        </div>

        {badge && (
          <span className={`px-2.5 py-0.5 rounded-full border text-[11px] font-semibold uppercase tracking-wider ${badgeColor}`}>
            {badge}
          </span>
        )}
      </div>

      {/* Main Title & Action Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold tracking-wide text-[#e8e4d0]">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-[#9a9780] mt-1 max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex items-center gap-2.5 flex-shrink-0 self-start sm:self-center">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
