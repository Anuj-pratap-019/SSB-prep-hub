import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0e1208] border-t border-[#2a3318] text-[#8e8b78] py-12 px-4 sm:px-6 lg:px-8 mt-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        
        {/* Brand Column */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎖️</span>
            <span className="font-heading text-xl text-[#c8a84b] font-bold tracking-wider">
              SSB PREP HUB AI
            </span>
          </div>
          <p className="text-sm text-[#8e8b78] max-w-md leading-relaxed">
            The next-generation intelligence platform for Services Selection Board aspirants. Powered by Google Gemini AI and browser-native Speech Recognition to evaluate Officer Like Qualities (OLQs) with psychometric scrutiny.
          </p>
          <div className="flex items-center gap-2 text-xs font-mono text-[#c8a84b]">
            <Shield className="w-4 h-4 flex-shrink-0" />
            <span>Built for NDA, CDS, AFCAT, INET, TGC & NCC Special Entry aspirants</span>
          </div>
        </div>

        {/* Screening & Psych Tests Links */}
        <div>
          <h4 className="font-heading text-sm text-[#e8e4d0] font-bold tracking-wider uppercase mb-3 text-[#c8a84b]">
            Testing Modules
          </h4>
          <ul className="space-y-2 text-xs font-mono">
            <li><Link to="/ppdt" className="hover:text-[#c8a84b] transition-colors">→ PPDT 5-Stage Simulator</Link></li>
            <li><Link to="/oir" className="hover:text-[#c8a84b] transition-colors">→ Officer Intelligence Rating (OIR)</Link></li>
            <li><Link to="/wat" className="hover:text-[#c8a84b] transition-colors">→ Word Association Test (WAT)</Link></li>
            <li><Link to="/srt" className="hover:text-[#c8a84b] transition-colors">→ Situation Reaction Test (SRT)</Link></li>
            <li><Link to="/tat" className="hover:text-[#c8a84b] transition-colors">→ Thematic Apperception Test (TAT)</Link></li>
            <li><Link to="/sd" className="hover:text-[#c8a84b] transition-colors">→ Self Description Review</Link></li>
          </ul>
        </div>

        {/* Interview & Analysis */}
        <div>
          <h4 className="font-heading text-sm text-[#e8e4d0] font-bold tracking-wider uppercase mb-3 text-[#c8a84b]">
            Interview & Analysis
          </h4>
          <ul className="space-y-2 text-xs font-mono">
            <li><Link to="/pi" className="hover:text-[#c8a84b] transition-colors">→ AI Personal Interview (Voice)</Link></li>
            <li><Link to="/gto" className="hover:text-[#c8a84b] transition-colors">→ GTO Ground Tasks Manual</Link></li>
            <li><Link to="/dashboard" className="hover:text-[#c8a84b] transition-colors">→ Candidate OLQ Radar & Progress</Link></li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-[#1d2412] flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-[#787565]">
        <p>&copy; {new Date().getFullYear()} SSB Prep Hub. Engineered for Armed Forces aspirants.</p>
        <p className="flex items-center gap-1 mt-2 sm:mt-0 text-[#c8a84b]/80">
          <span>🇮🇳 Jai Hind · Valour &amp; Wisdom</span>
        </p>
      </div>
    </footer>
  );
}
