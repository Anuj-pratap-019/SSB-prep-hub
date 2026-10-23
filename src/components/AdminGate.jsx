import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function AdminGate({ children }) {
  const [isAdmin, setIsAdmin] = useState(undefined);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getUser().then(async ({ data, error }) => {
      if (error || !data.user) {
        if (mounted) setIsAdmin(false);
        return;
      }
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .maybeSingle();
      if (mounted) setIsAdmin(!profileError && profile?.role === 'admin');
    });
    return () => { mounted = false; };
  }, []);

  if (isAdmin === undefined) {
    return <div className="min-h-screen flex items-center justify-center text-[#c8a84b]">Checking administrator access...</div>;
  }
  return isAdmin ? children : <Navigate to="/" replace />;
}

