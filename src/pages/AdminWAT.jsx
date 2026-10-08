import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, FileText, LogIn, LogOut, Plus, Save, Trash2, UploadCloud } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { WAT_WORDS } from '../data/watWords';
import { dedupeWATWords, normalizeWATWord } from '../lib/wat';
import TestPageHeader from '../components/TestPageHeader';

const emptyWord = { word: '', tip: '' };

function cleanImportedWord(value) {
  return value
    .replace(/^\s*\d+\s*(?:[.)\-:]|\s)\s*/, '')
    .split('|')[0]
    .trim();
}

export default function AdminWAT() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [words, setWords] = useState([]);
  const [form, setForm] = useState(emptyWord);
  const [bulkText, setBulkText] = useState('');
  const [documentName, setDocumentName] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (!mounted) return;
      if (sessionError) setError(sessionError.message);
      setSession(data.session);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession));
    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (session) loadWords();
  }, [session]);

  const loadWords = async () => {
    const { data, error: loadError } = await supabase.from('wat_words').select('*').order('created_at');
    if (loadError) {
      setWords([]);
      setError(formatSupabaseError(loadError));
    } else {
      setError('');
      setWords(data || []);
    }
  };

  const formatSupabaseError = (supabaseError) => {
    if (supabaseError.message?.includes('wat_words')) {
      return 'WAT library is not connected yet. Run supabase/schema.sql in the Supabase SQL Editor, then refresh this page.';
    }
    return supabaseError.message || 'The WAT library could not be loaded.';
  };

  const signIn = async (event) => {
    event.preventDefault();
    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) setError(signInError.message);
    else setSession(data.session);
  };

  const addWords = async (items) => {
    const existing = new Set(words.map((item) => normalizeWATWord(item.word)));
    const unique = dedupeWATWords(items).filter((item) => !existing.has(normalizeWATWord(item.word)));
    if (!unique.length) {
      setError('No new words were added. Duplicate words are ignored automatically.');
      return;
    }
    const { error: insertError } = await supabase.from('wat_words').insert(unique.map((item) => ({
      word: item.word.trim(),
      tip: item.tip || '',
      created_by: session.user.id
    })));
    if (insertError) setError(formatSupabaseError(insertError));
    else {
      setForm(emptyWord);
      setBulkText('');
      setStatus(`${unique.length} unique word${unique.length === 1 ? '' : 's'} added.`);
      loadWords();
    }
  };

  const addManualWord = async (event) => {
    event.preventDefault();
    if (!form.word.trim()) return setError('Enter a word first.');
    addWords([form]);
  };

  const importText = () => {
    const parsed = bulkText.split(/\r?\n|,/)
      .map((line) => ({ word: cleanImportedWord(line) }))
      .filter((item) => item.word);
    addWords(parsed);
  };

  const readDocument = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setBulkText(String(reader.result || ''));
      setDocumentName(file.name);
      setError('');
    };
    reader.onerror = () => setError('Could not read that document. Paste its words into the box instead.');
    reader.readAsText(file);
  };

  const seedDefaults = () => addWords(WAT_WORDS);

  const toggleActive = async (word) => {
    const { error: updateError } = await supabase.from('wat_words').update({ active: !word.active, updated_at: new Date().toISOString() }).eq('id', word.id);
    if (updateError) setError(updateError.message);
    else loadWords();
  };

  const deleteWord = async (word) => {
    if (!window.confirm(`Delete "${word.word}"?`)) return;
    const { error: deleteError } = await supabase.from('wat_words').delete().eq('id', word.id);
    if (deleteError) setError(deleteError.message);
    else loadWords();
  };

  const activeCount = useMemo(() => words.filter((word) => word.active).length, [words]);

  if (!session) return (
    <div className="max-w-md mx-auto px-4 py-12">
      <TestPageHeader stage="Administration" title="WAT Word Library" subtitle="Sign in to manage the rapid-fire word bank." actions={<Link to="/admin" className="text-xs text-[#c8a84b] flex items-center gap-2"><ArrowLeft className="w-4 h-4" /> Admin section</Link>} />
      <form onSubmit={signIn} className="bg-[#1b2212] border border-[#3a4520] rounded-2xl p-6 space-y-4">
        <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="Admin email" required className="w-full bg-[#12160a] border border-[#3a4520] rounded-lg p-3 text-sm" />
        <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" placeholder="Password" required className="w-full bg-[#12160a] border border-[#3a4520] rounded-lg p-3 text-sm" />
        {error && <p className="text-sm text-red-300">{error}</p>}
        <button className="w-full px-4 py-3 rounded-lg bg-[#c8a84b] text-[#12160a] font-bold flex items-center justify-center gap-2"><LogIn className="w-4 h-4" /> Sign in</button>
      </form>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <TestPageHeader stage="Administration" title="WAT Word Library" subtitle="Add words manually or paste a numbered word list. Numbers are ignored and duplicate words are removed." actions={<><Link to="/admin" className="text-xs text-[#c8a84b] flex items-center gap-2"><ArrowLeft className="w-4 h-4" /> Admin section</Link><button onClick={() => supabase.auth.signOut()} className="text-xs text-[#c8a84b] flex items-center gap-2"><LogOut className="w-4 h-4" /> Sign out</button></>} />
      <div className="grid lg:grid-cols-2 gap-6">
        <form onSubmit={addManualWord} className="bg-[#1b2212] border border-[#3a4520] rounded-2xl p-6 space-y-3">
          <h2 className="font-bold text-[#c8a84b] flex items-center gap-2"><Plus className="w-4 h-4" /> Add one word</h2>
          <input value={form.word} onChange={(event) => setForm({ ...form, word: event.target.value })} placeholder="Stimulus word" className="w-full bg-[#12160a] border border-[#3a4520] rounded-lg p-3 text-sm" />
          <input value={form.tip} onChange={(event) => setForm({ ...form, tip: event.target.value })} placeholder="Optional trainer tip" className="w-full bg-[#12160a] border border-[#3a4520] rounded-lg p-3 text-sm" />
          <button className="rounded-lg bg-[#c8a84b] text-[#12160a] px-4 py-2 font-bold flex items-center gap-2"><Save className="w-4 h-4" /> Save word</button>
        </form>
        <div className="bg-[#1b2212] border border-[#3a4520] rounded-2xl p-6 space-y-3">
          <h2 className="font-bold text-[#c8a84b] flex items-center gap-2"><UploadCloud className="w-4 h-4" /> Paste document words</h2>
          <p className="text-xs text-[#9a9780]">One word per line, with optional numbering such as <code>1. Failure</code>. Numbers are ignored automatically. Upload a plain-text document/CSV, or paste content copied from Word.</p>
          <input type="file" accept=".txt,.csv,.doc,text/plain,text/csv" onChange={readDocument} className="block w-full bg-[#12160a] border border-[#3a4520] rounded-lg p-2 text-sm" />
          {documentName && <p className="text-xs text-emerald-300">Loaded: {documentName}</p>}
          <textarea value={bulkText} onChange={(event) => setBulkText(event.target.value)} rows="6" placeholder={'1. Failure\n2. Courage\n3. Leadership'} className="w-full bg-[#12160a] border border-[#3a4520] rounded-lg p-3 text-sm" />
          <div className="flex gap-2 flex-wrap">
            <button onClick={importText} type="button" className="rounded-lg bg-[#c8a84b] text-[#12160a] px-4 py-2 font-bold flex items-center gap-2"><FileText className="w-4 h-4" /> Import unique words</button>
            <button onClick={seedDefaults} type="button" className="rounded-lg border border-[#3a4520] px-4 py-2 text-sm">Add built-in 60</button>
          </div>
        </div>
      </div>
      {status && <p className="text-sm text-emerald-300">{status}</p>}
      {error && <p className="text-sm text-red-300">{error}</p>}
      <div className="bg-[#1b2212] border border-[#3a4520] rounded-xl p-4 space-y-2">
        <p className="text-xs font-mono text-[#9a9780]">{activeCount} active words. The test uses the first 60 active words in library order.</p>
        <p className="text-xs text-[#9a9780]"><strong className="text-[#c8a84b]">Add built-in 60:</strong> saves the app's original 60 starter words into Supabase. It does not replace your words and will not add duplicates.</p>
        {words.length === 0 && !error && <p className="text-sm text-[#e8e4d0]">No words have been added yet. Import your list or click Add built-in 60.</p>}
        {error?.includes('not connected yet') && <p className="text-sm text-[#e8e4d0]">Setup required: open Supabase → SQL Editor → run <code>supabase/schema.sql</code>, then reload this page.</p>}
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {words.map((word) => <article key={word.id} className="bg-[#1b2212] border border-[#3a4520] rounded-xl p-4 space-y-2">
          <div className="flex justify-between gap-2"><strong className="text-[#c8a84b]">{word.word}</strong></div>
          <p className="text-xs text-[#9a9780] min-h-8">{word.tip || 'No trainer tip'}</p>
          <div className="flex justify-between items-center"><button onClick={() => toggleActive(word)} className={`text-xs px-2 py-1 rounded ${word.active ? 'bg-emerald-900 text-emerald-300' : 'bg-[#12160a] text-[#9a9780]'}`}>{word.active ? 'Active' : 'Inactive'}</button><button onClick={() => deleteWord(word)} aria-label={`Delete ${word.word}`} className="text-red-300"><Trash2 className="w-4 h-4" /></button></div>
        </article>)}
      </div>
    </div>
  );
}
