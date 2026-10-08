import React, { useEffect, useState } from 'react';
import { CheckCircle, KeyRound } from 'lucide-react';
import { supabase } from '../lib/supabase';
import TestPageHeader from '../components/TestPageHeader';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [sessionReady, setSessionReady] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (!mounted) return;
      if (sessionError) setError(sessionError.message);
      setSessionReady(Boolean(data.session));
    });

    const { data: listener } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (event === 'PASSWORD_RECOVERY' || nextSession) {
        setSessionReady(Boolean(nextSession));
      }
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const updatePassword = async (event) => {
    event.preventDefault();
    setError('');
    setStatus('');

    if (password.length < 8) {
      setError('Use a password with at least 8 characters.');
      return;
    }
    if (password !== confirmation) {
      setError('The passwords do not match.');
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      setError(updateError.message);
      return;
    }

    setPassword('');
    setConfirmation('');
    setStatus('Password updated. You can now sign in with the new password.');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <TestPageHeader
        stage="Account Security"
        title="Set New Password"
        subtitle="Choose a new password for your SSB Prep Hub admin account."
      />
      <form onSubmit={updatePassword} className="bg-[#1b2212] border border-[#3a4520] rounded-2xl p-6 space-y-4">
        {!sessionReady && (
          <p className="text-sm text-[#9a9780]">
            Open this page using the latest password-recovery link from Supabase.
          </p>
        )}
        <label className="block text-xs text-[#9a9780]">
          New password
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            minLength={8}
            required
            className="mt-1 w-full bg-[#12160a] border border-[#3a4520] rounded-lg p-3 text-sm text-[#e8e4d0]"
          />
        </label>
        <label className="block text-xs text-[#9a9780]">
          Confirm new password
          <input
            value={confirmation}
            onChange={(event) => setConfirmation(event.target.value)}
            type="password"
            minLength={8}
            required
            className="mt-1 w-full bg-[#12160a] border border-[#3a4520] rounded-lg p-3 text-sm text-[#e8e4d0]"
          />
        </label>
        {error && <p className="text-sm text-red-300">{error}</p>}
        {status && (
          <p className="flex items-center gap-2 text-sm text-emerald-300">
            <CheckCircle className="w-4 h-4" />
            {status}
          </p>
        )}
        <button
          type="submit"
          disabled={!sessionReady}
          className="w-full px-4 py-3 rounded-lg bg-[#c8a84b] disabled:opacity-40 text-[#12160a] font-bold flex items-center justify-center gap-2"
        >
          <KeyRound className="w-4 h-4" />
          Update password
        </button>
      </form>
    </div>
  );
}
