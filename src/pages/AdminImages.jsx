import React, { useEffect, useState } from 'react';
import { ImagePlus, LogIn, LogOut, Trash2, UploadCloud } from 'lucide-react';
import { supabase } from '../lib/supabase';
import TestPageHeader from '../components/TestPageHeader';

const emptyForm = {
  title: '',
  category: 'Uncategorized',
  tone: 'Challenging',
  difficulty: 'Medium',
  file: null
};

export default function AdminImages() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [images, setImages] = useState([]);
  const [signedUrls, setSignedUrls] = useState({});
  const [status, setStatus] = useState('');
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

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });
    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (session) loadImages();
  }, [session]);

  const loadImages = async () => {
    setError('');
    const { data, error: imageError } = await supabase
      .from('ppdt_images')
      .select('*')
      .order('created_at', { ascending: false });
    if (imageError) {
      setError(imageError.message);
      return;
    }
    setImages(data || []);
    const urlEntries = await Promise.all((data || []).map(async (image) => {
      const { data: signedData } = await supabase.storage
        .from('ppdt-images')
        .createSignedUrl(image.storage_path, 3600);
      return [image.id, signedData?.signedUrl];
    }));
    setSignedUrls(Object.fromEntries(urlEntries.filter(([, url]) => url)));
  };

  const signIn = async (event) => {
    event.preventDefault();
    setError('');
    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) setError(signInError.message);
    else setSession(data.session);
  };

  const uploadImage = async (event) => {
    event.preventDefault();
    if (!form.file || !form.title.trim()) {
      setError('Choose an image and enter a title before uploading.');
      return;
    }
    setError('');
    setStatus('Uploading image...');
    const extension = form.file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const storagePath = `${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await supabase.storage
      .from('ppdt-images')
      .upload(storagePath, form.file, { contentType: form.file.type, upsert: false });
    if (uploadError) {
      setError(uploadError.message);
      setStatus('');
      return;
    }

    const { error: metadataError } = await supabase.from('ppdt_images').insert({
      storage_path: storagePath,
      title: form.title.trim(),
      category: form.category,
      tone: form.tone,
      difficulty: form.difficulty,
      created_by: session.user.id
    });
    if (metadataError) {
      await supabase.storage.from('ppdt-images').remove([storagePath]);
      setError(metadataError.message);
      setStatus('');
      return;
    }
    setForm(emptyForm);
    setStatus('Image added to the cloud library.');
    await loadImages();
  };

  const toggleActive = async (image) => {
    const { error: updateError } = await supabase
      .from('ppdt_images')
      .update({ active: !image.active, updated_at: new Date().toISOString() })
      .eq('id', image.id);
    if (updateError) setError(updateError.message);
    else loadImages();
  };

  const deleteImage = async (image) => {
    if (!window.confirm(`Delete "${image.title}" from the cloud library?`)) return;
    const { error: deleteError } = await supabase.from('ppdt_images').delete().eq('id', image.id);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    await supabase.storage.from('ppdt-images').remove([image.storage_path]);
    loadImages();
  };

  if (loading) return <div className="max-w-5xl mx-auto px-4 py-12 text-[#9a9780]">Loading admin access...</div>;

  if (!session) {
    return (
      <div className="max-w-md mx-auto px-4 py-12">
        <TestPageHeader stage="Administration" title="PPDT Image Library" subtitle="Sign in to manage cloud-stored assessment pictures." />
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
      <TestPageHeader stage="Administration" title="PPDT Image Library" subtitle="Upload and organize the cloud picture library used by random assessments." actions={<button onClick={() => supabase.auth.signOut()} className="text-xs text-[#c8a84b] flex items-center gap-2"><LogOut className="w-4 h-4" /> Sign out</button>} />
      <form onSubmit={uploadImage} className="bg-[#1b2212] border border-[#3a4520] rounded-2xl p-6 grid md:grid-cols-2 gap-4">
        <div className="md:col-span-2 flex items-center gap-2 text-[#c8a84b] font-bold"><UploadCloud className="w-5 h-5" /> Add picture</div>
        <input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Picture title" required className="bg-[#12160a] border border-[#3a4520] rounded-lg p-3 text-sm" />
        <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => setForm({ ...form, file: event.target.files?.[0] || null })} required className="bg-[#12160a] border border-[#3a4520] rounded-lg p-2 text-sm" />
        <input value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} placeholder="Category" className="bg-[#12160a] border border-[#3a4520] rounded-lg p-3 text-sm" />
        <select value={form.tone} onChange={(event) => setForm({ ...form, tone: event.target.value })} className="bg-[#12160a] border border-[#3a4520] rounded-lg p-3 text-sm"><option>Positive</option><option>Neutral</option><option>Challenging</option><option>Crisis</option></select>
        <select value={form.difficulty} onChange={(event) => setForm({ ...form, difficulty: event.target.value })} className="bg-[#12160a] border border-[#3a4520] rounded-lg p-3 text-sm"><option>Easy</option><option>Medium</option><option>Hard</option></select>
        <button className="rounded-lg bg-[#c8a84b] text-[#12160a] font-bold flex items-center justify-center gap-2"><ImagePlus className="w-4 h-4" /> Upload to Supabase</button>
        {status && <p className="md:col-span-2 text-sm text-emerald-300">{status}</p>}
        {error && <p className="md:col-span-2 text-sm text-red-300">{error}</p>}
      </form>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {images.map((image) => (
          <article key={image.id} className="bg-[#1b2212] border border-[#3a4520] rounded-xl overflow-hidden">
            {signedUrls[image.id] ? <img src={signedUrls[image.id]} alt={image.title} className="w-full aspect-[16/10] object-cover" /> : <div className="aspect-[16/10] bg-[#12160a]" />}
            <div className="p-3 space-y-2">
              <h3 className="font-bold text-sm">{image.title}</h3>
              <p className="text-xs text-[#9a9780]">{image.category} · {image.tone} · {image.difficulty}</p>
              <div className="flex items-center justify-between gap-2">
                <button onClick={() => toggleActive(image)} className={`text-xs px-2 py-1 rounded ${image.active ? 'bg-emerald-900 text-emerald-300' : 'bg-[#12160a] text-[#9a9780]'}`}>{image.active ? 'Active' : 'Inactive'}</button>
                <button onClick={() => deleteImage(image)} aria-label={`Delete ${image.title}`} className="text-red-300 hover:text-red-200"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
