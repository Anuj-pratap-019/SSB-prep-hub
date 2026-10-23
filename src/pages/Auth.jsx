import React, { useState } from 'react';
import { LogIn, UserPlus } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Auth() {
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    const result = mode === 'signin'
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });
    if (result.error) setError(result.error.message);
    else if (mode === 'signup' && !result.data.session) setMessage('Account created. Check your email to confirm your account, then sign in.');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-[#1b2212] border-2 border-[#c8a84b] rounded-2xl p-6 sm:p-8 space-y-6">
        <div>
          <span className="text-xs font-mono uppercase text-[#c8a84b] font-bold">Private candidate workspace</span>
          <h1 className="font-heading text-3xl text-[#e8e4d0] font-bold mt-2">{mode === 'signin' ? 'Sign in to SSB Prep Hub' : 'Create your candidate account'}</h1>
          <p className="text-sm text-[#9a9780] mt-2">Your evaluations and progress are private to your account.</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <label className="block text-xs text-[#9a9780]">Email<input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required className="mt-1 w-full bg-[#12160a] border border-[#3a4520] rounded-lg p-3 text-sm text-[#e8e4d0]" /></label>
          <label className="block text-xs text-[#9a9780]">Password<input value={password} onChange={(event) => setPassword(event.target.value)} type="password" minLength={8} required className="mt-1 w-full bg-[#12160a] border border-[#3a4520] rounded-lg p-3 text-sm text-[#e8e4d0]" /></label>
          {error && <p className="text-sm text-red-300">{error}</p>}
          {message && <p className="text-sm text-emerald-300">{message}</p>}
          <button type="submit" className="w-full px-4 py-3 rounded-lg bg-[#c8a84b] text-[#12160a] font-bold flex items-center justify-center gap-2">
            {mode === 'signin' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}{mode === 'signin' ? 'Sign in' : 'Create account'}
          </button>
        </form>
        <button onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(''); setMessage(''); }} className="w-full text-sm text-[#c8a84b] hover:underline">
          {mode === 'signin' ? 'New here? Create an account' : 'Already have an account? Sign in'}
        </button>
      </div>
    </div>
  );
}

