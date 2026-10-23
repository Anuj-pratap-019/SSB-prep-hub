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
  const [saving, setSaving] = useState(false);

  const parseTopics = (value) => value
    .replace(/\r/g, '')
    .split(/\n+/)
    .flatMap((line) => line.split(/(?=(?:^|\s)\d+\s*[.)\-:]\s*)/))
    .map((topic) => topic
      .replace(/^\s*(?:\d+\s*[.)\-:]|[-*•])\s*/, '')
      .trim())
    .filter(Boolean);

  const normalizeTopic = (value) => value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const loadTopics = async () => {
    const { data, error: loadError } = await supabase.from('lecturette_topics').select('*').order('created_at', { ascending: false });
    if (loadError) setError(loadError.message);
    else setTopics(data || []);
  };
  useEffect(() => { loadTopics(); }, []);

  const addTopics = async (values) => {
    const requested = [...new Map(
      values
        .map((value) => value.trim())
        .filter(Boolean)
        .map((topic) => [normalizeTopic(topic), topic])
    ).values()].filter((topic) => normalizeTopic(topic));
    if (!requested.length) throw new Error('Enter at least one lecturette topic.');
    const { data: existing, error: existingError } = await supabase
      .from('lecturette_topics')
      .select('topic');
    if (existingError) throw new Error(existingError.message);
    const existingKeys = new Set((existing || []).map((item) => normalizeTopic(item.topic)));
    const unique = requested.filter((topic) => !existingKeys.has(normalizeTopic(topic)));
    if (!unique.length) {
      setStatus('All submitted topics already exist. No duplicates were added.');
      return;
    }
    const { error: insertError } = await supabase
      .from('lecturette_topics')
      .upsert(unique.map((topic) => ({ topic })), { onConflict: 'topic', ignoreDuplicates: true });
    if (insertError) throw new Error(insertError.message);
    setStatus(`${unique.length} topic${unique.length === 1 ? '' : 's'} added.`);
    setText('');
    await loadTopics();
  };

  const readImageAttachment = (sourceFile) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const scale = Math.min(1, 1800 / Math.max(image.naturalWidth, image.naturalHeight));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
        canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
        const context = canvas.getContext('2d');
        if (!context) {
          reject(new Error('Your browser could not prepare the image for extraction.'));
          return;
        }
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        resolve({ mimeType: 'image/jpeg', data: dataUrl.split(',')[1] });
      };
      image.onerror = () => reject(new Error('The selected image could not be decoded. Try a JPG or PNG image.'));
      image.src = String(reader.result);
    };
    reader.onerror = () => reject(new Error('Could not read the selected image.'));
    reader.readAsDataURL(sourceFile);
  });

  const uploadText = async (event) => {
    event.preventDefault();
    setError('');
    setStatus('');
    setSaving(true);
    try { await addTopics(parseTopics(text)); } catch (err) { setError(err.message); } finally { setSaving(false); }
  };

  const extractFromFile = async () => {
    if (!file) return;
    setError('');
    setStatus('');
    setSaving(true);
    try {
      const fileName = file.name.toLowerCase();
      const isImage = file.type.startsWith('image/') || /\.(jpg|jpeg|png|webp|gif|bmp)$/i.test(fileName);
      if (isImage) {
        setStatus('Reading image and extracting topics with Gemini...');
        const result = await extractLecturetteTopics(await readImageAttachment(file));
        if (!Array.isArray(result.topics) || !result.topics.length) {
          throw new Error('Gemini did not find any topics in the image. Use a clear image with visible text.');
        }
        await addTopics(result.topics || []);
      } else if (file.type === 'application/pdf' || fileName.endsWith('.pdf')) {
        const reader = new FileReader();
        const dataUrl = await new Promise((resolve, reject) => {
          reader.onload = () => resolve(String(reader.result));
          reader.onerror = () => reject(new Error('Could not read the PDF.'));
          reader.readAsDataURL(file);
        });
        const [, data] = dataUrl.split(',');
        setStatus('Reading PDF and extracting topics with Gemini...');
        const result = await extractLecturetteTopics({ mimeType: 'application/pdf', data });
        if (!Array.isArray(result.topics) || !result.topics.length) {
          throw new Error('Gemini did not find any topics in the PDF.');
        }
        await addTopics(result.topics || []);
      } else if (file.type === 'text/plain' || file.name.endsWith('.csv')) {
        const content = await file.text();
        await addTopics(parseTopics(content));
      } else {
        throw new Error('Use a clear image, PDF, TXT, or CSV file. DOCX files are not supported by the browser uploader yet.');
      }
    } catch (err) { setError(err.message); } finally { setSaving(false); }
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
          <button disabled={saving} className="px-5 py-2.5 rounded-lg bg-[#c8a84b] text-[#12160a] font-bold disabled:opacity-50">{saving ? 'Adding topics...' : 'Add topics'}</button>
        </form>
        <div className="bg-[#1b2212] border border-[#3a4520] rounded-2xl p-6 space-y-4">
          <h2 className="font-heading font-bold text-[#c8a84b]">Upload source</h2>
          <p className="text-xs text-[#9a9780]">Upload a clear image/PDF containing four topics, or a TXT/CSV file with one topic per line.</p>
          <input id="lecturette-source-file" type="file" accept="image/*,application/pdf,.pdf,.txt,.csv" onChange={(event) => { setFile(event.target.files?.[0] || null); setError(''); setStatus(''); }} className="sr-only" />
          <label htmlFor="lecturette-source-file" className="inline-flex cursor-pointer rounded-lg border border-[#3a4520] bg-[#12160a] px-4 py-2 text-sm text-[#e8e4d0] hover:border-[#c8a84b]">
            Choose image or document
          </label>
          <p className="text-xs text-[#c8a84b] min-h-4">{file ? file.name : 'No file selected'}</p>
          <button type="button" onClick={extractFromFile} disabled={!file || saving} className="px-5 py-2.5 rounded-lg bg-[#4a5c2a] text-white font-bold disabled:opacity-40 flex items-center gap-2"><Upload className="w-4 h-4" /> {saving ? 'Extracting...' : 'Extract and add'}</button>
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
