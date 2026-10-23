import React, { useEffect, useState } from 'react';
import { ArrowLeft, Upload, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { extractLecturetteTopics } from '../services/gemini';
import TestPageHeader from '../components/TestPageHeader';

export default function AdminLecturette() {
  const [topics, setTopics] = useState([]);
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  const loadTopics = async () => {
    const { data, error: loadError } = await supabase.from('lecturette_topics').select('*').order('created_at', { ascending: false });
    if (loadError) setError(loadError.message);
    else setTopics(data || []);
  };
  useEffect(() => { loadTopics(); }, []);

  const addTopics = async (values) => {
    const unique = [...new Set(values.map((value) => value.trim()).filter(Boolean))];
    if (!unique.length) return;
    const { error: insertError } = await supabase.from('lecturette_topics').insert(unique.map((topic) => ({ topic })));
    if (insertError) throw new Error(insertError.message);
    setStatus(`${unique.length} topic${unique.length === 1 ? '' : 's'} added.`);
    setText('');
    await loadTopics();
  };

  const uploadText = async (event) => {
    event.preventDefault();
    setError('');
    try { await addTopics(text.split(/\r?\n/)); } catch (err) { setError(err.message); }
  };

  const extractFromFile = async () => {
    if (!file) return;
    setError('');
    try {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        const dataUrl = await new Promise((resolve, reject) => {
          reader.onload = () => resolve(String(reader.result));
          reader.onerror = () => reject(new Error('Could not read the image.'));
          reader.readAsDataURL(file);
        });
        const [, data] = dataUrl.split(',');
        const result = await extractLecturetteTopics({ mimeType: file.type, data });
        await addTopics(result.topics || []);
      } else if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        const reader = new FileReader();
        const dataUrl = await new Promise((resolve, reject) => {
          reader.onload = () => resolve(String(reader.result));
          reader.onerror = () => reject(new Error('Could not read the PDF.'));
          reader.readAsDataURL(file);
        });
        const [, data] = dataUrl.split(',');
        const result = await extractLecturetteTopics({ mimeType: 'application/pdf', data });
        await addTopics(result.topics || []);
      } else if (file.type === 'text/plain' || file.name.endsWith('.csv')) {
        const content = await file.text();
        await addTopics(content.split(/\r?\n/).map((line) => line.replace(/^\s*\d+[\].:-]?\s*/, '')));
      } else {
        throw new Error('Use a clear image, PDF, TXT, or CSV file. DOCX files are not supported by the browser uploader yet.');
      }
    } catch (err) { setError(err.message); }
  };

  const removeTopic = async (id) => {
    const { error: deleteError } = await supabase.from('lecturette_topics').delete().eq('id', id);
    if (deleteError) setError(deleteError.message);
    else setTopics((current) => current.filter((topic) => topic.id !== id));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <TestPageHeader stage="Administration" title="Lecturette Topic Library" subtitle="Add one topic per line or extract four printed topics from an image." actions={<Link to="/admin" className="text-xs text-[#c8a84b] flex items-center gap-2"><ArrowLeft className="w-4 h-4" /> Admin section</Link>} />
      <div className="grid lg:grid-cols-2 gap-5">
        <form onSubmit={uploadText} className="bg-[#1b2212] border border-[#3a4520] rounded-2xl p-6 space-y-4">
          <h2 className="font-heading font-bold text-[#c8a84b]">Paste topics</h2>
          <textarea value={text} onChange={(event) => setText(event.target.value)} rows={9} placeholder={'Leadership\nClimate change\nTechnology in education'} className="w-full bg-[#12160a] border border-[#3a4520] rounded-lg p-3 text-sm text-[#e8e4d0]" />
          <button className="px-5 py-2.5 rounded-lg bg-[#c8a84b] text-[#12160a] font-bold">Add topics</button>
        </form>
        <div className="bg-[#1b2212] border border-[#3a4520] rounded-2xl p-6 space-y-4">
          <h2 className="font-heading font-bold text-[#c8a84b]">Upload source</h2>
          <p className="text-xs text-[#9a9780]">Upload a clear image/PDF containing four topics, or a TXT/CSV file with one topic per line.</p>
          <input type="file" accept="image/*,application/pdf,.pdf,.txt,.csv" onChange={(event) => setFile(event.target.files?.[0] || null)} className="w-full text-sm" />
          <button onClick={extractFromFile} disabled={!file} className="px-5 py-2.5 rounded-lg bg-[#4a5c2a] text-white font-bold disabled:opacity-40 flex items-center gap-2"><Upload className="w-4 h-4" /> Extract and add</button>
        </div>
      </div>
      {status && <p className="text-sm text-emerald-300">{status}</p>}
      {error && <p className="text-sm text-red-300">{error}</p>}
      <div className="bg-[#1b2212] border border-[#3a4520] rounded-2xl p-6">
        <h2 className="font-heading font-bold text-[#c8a84b] mb-4">Topics ({topics.length})</h2>
        <div className="grid sm:grid-cols-2 gap-2">{topics.map((item) => <div key={item.id} className="flex items-center justify-between bg-[#12160a] border border-[#3a4520] rounded-lg p-3 text-sm"><span>{item.topic}</span><button onClick={() => removeTopic(item.id)} className="text-red-300 hover:text-red-200" aria-label={`Delete ${item.topic}`}><Trash2 className="w-4 h-4" /></button></div>)}</div>
      </div>
    </div>
  );
}
