import React, { useEffect, useState } from 'react';
import { Image, Library, LogIn, LogOut, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import TestPageHeader from '../components/TestPageHeader';

export default function Admin() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (!mounted) return;
      if (sessionError) setError(sessionError.message);
      setSession(data.session);
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession));
    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (event) => {
    event.preventDefault();
    setError('');
    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) setError(signInError.message);
    else setSession(data.session);
  };

  if (loading) return <div className="max-w-5xl mx-auto px-4 py-12 text-[#9a9780]">Loading admin access...</div>;

  if (!session) {
    return (
      <div className="max-w-md mx-auto px-4 py-12">
        <TestPageHeader stage="Administration" title="Admin Section" subtitle="Sign in to manage assessment content and libraries." />
        <form onSubmit={signIn} className="bg-[#1b2212] border border-[#3a4520] rounded-2xl p-6 space-y-4">
          <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="Admin email" required className="w-full bg-[#12160a] border border-[#3a4520] rounded-lg p-3 text-sm" />
          <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" placeholder="Password" required className="w-full bg-[#12160a] border border-[#3a4520] rounded-lg p-3 text-sm" />
          {error && <p className="text-sm text-red-300">{error}</p>}
          <button className="w-full px-4 py-3 rounded-lg bg-[#c8a84b] text-[#12160a] font-bold flex items-center justify-center gap-2"><LogIn className="w-4 h-4" /> Sign in</button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <TestPageHeader stage="Administration" title="Admin Section" subtitle="Choose a library to manage. More evaluation libraries can be added here later." actions={<button onClick={() => supabase.auth.signOut()} className="text-xs text-[#c8a84b] flex items-center gap-2"><LogOut className="w-4 h-4" /> Sign out</button>} />
      <div className="grid md:grid-cols-2 gap-5">
        <Link to="/admin/wat" className="bg-[#1b2212] border-2 border-[#3a4520] hover:border-[#c8a84b] rounded-2xl p-6 space-y-3 transition-colors">
          <Library className="w-8 h-8 text-[#c8a84b]" />
          <h2 className="font-heading text-xl font-bold text-[#c8a84b]">WAT Word Library</h2>
          <p className="text-sm text-[#9a9780]">Upload, add, deduplicate, activate, and manage the 60-word rapid-fire sequence.</p>
          <span className="text-xs text-[#c8a84b] font-bold uppercase tracking-wider">Open library →</span>
        </Link>
        <Link to="/admin/images" className="bg-[#1b2212] border-2 border-[#3a4520] hover:border-[#c8a84b] rounded-2xl p-6 space-y-3 transition-colors">
          <Image className="w-8 h-8 text-[#c8a84b]" />
          <h2 className="font-heading text-xl font-bold text-[#c8a84b]">PPDT Image Library</h2>
          <p className="text-sm text-[#9a9780]">Upload, activate, deactivate, and remove PPDT assessment pictures.</p>
          <span className="text-xs text-[#c8a84b] font-bold uppercase tracking-wider">Open library →</span>
        </Link>
      </div>
      <div className="flex items-center gap-2 text-xs text-[#9a9780]"><Shield className="w-4 h-4 text-[#c8a84b]" /> Future SRT, TAT, and other evaluation databases can be added as cards in this section.</div>
    </div>
  );
}
