import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { 
  Shield, 
  ChevronDown, 
  Sparkles, 
  Clock, 
  Brain, 
  Award, 
  Mic, 
  User, 
  BarChart3, 
  Menu, 
  X,
  Compass
} from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null); // 'stage1' | 'stage2' | 'stage3' | null
  const location = useLocation();
  const navRef = useRef(null);

  // Close menus on route change or outside click
  useEffect(() => {
    setMobileMenuOpen(false);
    setOpenDropdown(null);
  }, [location.pathname]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (name) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  const navGroups = [
    {
      id: 'stage1',
      title: 'Stage 1: Screening',
      paths: ['/ppdt', '/oir'],
      items: [
        {
          to: '/ppdt',
          label: 'PPDT AI Simulator',
          desc: '5-Stage Picture Perception & Speech Narration',
          icon: Sparkles,
          badge: 'AI Flagship',
          badgeColor: 'bg-[#c8a84b] text-[#12160a]',
        },
        {
          to: '/oir',
          label: 'OIR Reasoning Test',
          desc: 'Verbal & Non-Verbal MCQs with grading',
          icon: Award,
        },
      ],
    },
    {
      id: 'stage2',
      title: 'Stage 2: Psych Tests',
      paths: ['/wat', '/srt', '/tat', '/sd'],
      items: [
        {
          to: '/wat',
          label: 'Word Association (WAT)',
          desc: '60 words at 15s speed with AI evaluation',
          icon: Clock,
        },
        {
          to: '/srt',
          label: 'Situation Reaction (SRT)',
          desc: 'Military & crisis dilemma evaluations',
          icon: Brain,
        },
        {
          to: '/tat',
          label: 'Thematic Apperception (TAT)',
          desc: '10 image theme story writing drills',
          icon: Sparkles,
        },
        {
          to: '/sd',
          label: 'Self Description (SD)',
          desc: '5-part self-appraisal congruence',
          icon: User,
        },
      ],
    },
    {
      id: 'stage3',
      title: 'Interview & GTO',
      paths: ['/pi', '/gto'],
      items: [
        {
          to: '/pi',
          label: 'AI Mock Personal Interview',
          desc: 'Live conversational voice assessment',
          icon: Mic,
          badge: 'Voice',
          badgeColor: 'bg-emerald-500 text-slate-950',
        },
        {
          to: '/gto',
          label: 'GTO Tasks Guide',
          desc: 'Ground obstacles, PGT, HGT, and Command Task',
          icon: Compass,
        },
      ],
    },
  ];

  return (
    <header ref={navRef} className="sticky top-0 z-50 border-b border-[#2a3318]/80 bg-[#10180f]/85 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2.5 flex-shrink-0 group select-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#d4b864] via-[#c8a84b] to-[#695422] border border-[#f0d27a]/70 flex items-center justify-center shadow-[0_8px_20px_rgba(200,168,75,0.25)] group-hover:scale-[1.03] transition-all">
              <span className="text-lg">🎖️</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading text-lg sm:text-xl font-bold tracking-[0.12em] text-[#f0efe9] group-hover:text-[#d7bb63] transition-colors uppercase">
                SSB PREP HUB
              </span>
              <span className="text-[9px] bg-[#c8a84b]/15 text-[#d7bb63] border border-[#d7bb63]/40 px-1.5 py-0.5 rounded-full font-mono font-bold tracking-[0.15em] uppercase">
                AI
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Groups */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
            
            {/* Direct Home Link */}
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-xl text-[11px] font-heading font-semibold uppercase tracking-[0.12em] transition-all ${
                  isActive
                    ? 'bg-[#1e2a14] text-[#f0d27a] border border-[#d7bb63]/40 shadow-[0_0_0_1px_rgba(215,187,99,0.12)]'
                    : 'text-[#c7c1ae] hover:text-[#f3efe7] hover:bg-[#1a2315]'
                }`
              }
            >
              Home
            </NavLink>

            {/* Dropdown Groups */}
            {navGroups.map((group) => {
              const isGroupActive = group.paths.some((p) => location.pathname.startsWith(p));
              const isOpen = openDropdown === group.id;

              return (
                <div key={group.id} className="relative">
                  <button
                    onClick={() => toggleDropdown(group.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-heading font-semibold uppercase tracking-[0.12em] transition-all ${
                      isGroupActive || isOpen
                        ? 'bg-[#1e2a14] text-[#f0d27a] border border-[#d7bb63]/40 shadow-[0_0_0_1px_rgba(215,187,99,0.12)]'
                        : 'text-[#c7c1ae] hover:text-[#f3efe7] hover:bg-[#1a2315]'
                    }`}
                  >
                    <span>{group.title}</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#c8a84b]' : 'text-[#7d7a66]'}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {isOpen && (
                    <div className="absolute top-full left-0 mt-2 w-72 rounded-xl bg-[#181e10] border border-[#3a4520] shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                      <div className="text-[10px] font-mono uppercase tracking-widest text-[#7d7a66] px-3 py-1 mb-1 border-b border-[#252f16]">
                        {group.title}
                      </div>
                      <div className="space-y-1">
                        {group.items.map((item) => {
                          const Icon = item.icon;
                          return (
                            <NavLink
                              key={item.to}
                              to={item.to}
                              className={({ isActive }) =>
                                `flex items-start gap-2.5 p-2.5 rounded-lg transition-all ${
                                  isActive
                                    ? 'bg-[#2d3a18] text-[#e8e4d0] border border-[#c8a84b]/50'
                                    : 'text-[#c0bba8] hover:text-[#e8e4d0] hover:bg-[#202812]'
                                }`
                              }
                            >
                              <div className="p-1.5 rounded bg-[#12160a] border border-[#3a4520] mt-0.5 text-[#c8a84b]">
                                <Icon className="w-4 h-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1">
                                  <span className="font-heading text-xs font-bold tracking-wide">
                                    {item.label}
                                  </span>
                                  {item.badge && (
                                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full leading-tight ${item.badgeColor || 'bg-[#c8a84b] text-[#12160a]'}`}>
                                      {item.badge}
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-[#85826f] line-clamp-1 mt-0.5">
                                  {item.desc}
                                </p>
                              </div>
                            </NavLink>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Direct Analytics Link */}
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-heading font-semibold uppercase tracking-wider transition-colors ${
                  isActive
                    ? 'bg-[#283214] text-[#c8a84b] border border-[#c8a84b]/50 shadow-sm'
                    : 'text-[#c0bba8] hover:text-[#e8e4d0] hover:bg-[#1f2514]'
                }`
              }
            >
              <BarChart3 className="w-3.5 h-3.5 text-[#c8a84b]" />
              <span>Analytics</span>
            </NavLink>
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-heading font-semibold uppercase tracking-wider transition-colors ${
                  isActive
                    ? 'bg-[#283214] text-[#c8a84b] border border-[#c8a84b]/50 shadow-sm'
                    : 'text-[#c0bba8] hover:text-[#e8e4d0] hover:bg-[#1f2514]'
                }`
              }
            >
              <Shield className="w-3.5 h-3.5 text-[#c8a84b]" />
              <span>Admin</span>
            </NavLink>
          </nav>

          {/* Right Status Pill & Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#1b2212] border border-[#3a4520] text-[11px] font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[#9a9780]">AI Engine: <strong className="text-emerald-400 font-semibold">Active</strong></span>
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-[#e8e4d0] hover:text-[#c8a84b] hover:bg-[#202812] border border-[#3a4520]"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#161b0f] border-b border-[#3a4520] px-4 pt-3 pb-6 max-h-[85vh] overflow-y-auto space-y-4 shadow-2xl">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `block px-3 py-2 rounded-lg font-heading text-sm uppercase tracking-wider font-semibold ${
                isActive ? 'bg-[#283214] text-[#c8a84b]' : 'text-[#c0bba8] hover:bg-[#202812]'
              }`
            }
          >
            🏠 Home Overview
          </NavLink>

          {navGroups.map((group) => (
            <div key={group.id} className="space-y-1 pt-2 border-t border-[#252f16]">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#c8a84b] font-bold px-3 block">
                {group.title}
              </span>
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center justify-between p-2.5 rounded-lg text-sm transition-colors ${
                        isActive
                          ? 'bg-[#283214] text-[#c8a84b] font-bold border border-[#c8a84b]/40'
                          : 'text-[#c0bba8] hover:bg-[#202812]'
                      }`
                    }
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-[#c8a84b]" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#c8a84b] text-[#12160a]">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}

          <div className="pt-2 border-t border-[#252f16]">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center gap-2.5 p-2.5 rounded-lg text-sm uppercase font-heading font-semibold ${
                  isActive ? 'bg-[#283214] text-[#c8a84b]' : 'text-[#c0bba8] hover:bg-[#202812]'
                }`
              }
            >
              <BarChart3 className="w-4 h-4 text-[#c8a84b]" />
              <span>Candidate Analytics & Radar</span>
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
}
