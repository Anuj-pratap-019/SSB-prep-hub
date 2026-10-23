import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Auth from '../pages/Auth';

export default function AuthGate({ children }) {
  const [session, setSession] = useState(undefined);
  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data, error }) => { if (mounted) setSession(error ? null : data.session); });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession));
    return () => { mounted = false; listener.subscription.unsubscribe(); };
  }, []);
  if (session === undefined) return <div className="min-h-screen flex items-center justify-center text-[#c8a84b]">Checking your account...</div>;
  return session ? children : <Auth />;
}

