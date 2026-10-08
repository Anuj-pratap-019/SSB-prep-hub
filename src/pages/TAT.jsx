import React, { useEffect, useState } from 'react';
import { Sparkles, Upload, Volume2 } from 'lucide-react';
import TimerCircle from '../components/TimerCircle';
import TestPageHeader from '../components/TestPageHeader';
import { supabase } from '../lib/supabase';
import { evaluateTATBatch } from '../services/gemini';

const TOTAL_CARDS = 12;
const OBSERVATION_SECONDS = 30;
const WRITING_SECONDS = 240;
const TAT_CYCLE_KEY = 'ssb-prep-hub-tat-used-images';

function playBuzzer() {
  const audioContext = new window.AudioContext();
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.type = 'square';
  oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(180, audioContext.currentTime + 0.35);
  gain.gain.setValueAtTime(0.18, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.35);
  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.35);
  oscillator.addEventListener('ended', () => audioContext.close());
}

function chooseImages(images) {
  const used = JSON.parse(window.localStorage.getItem(TAT_CYCLE_KEY) || '[]');
  const unused = images.filter((image) => !used.includes(image.id));
  const pool = unused.length >= TOTAL_CARDS - 1 ? unused : images;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, TOTAL_CARDS - 1);
  const nextUsed = unused.length >= TOTAL_CARDS - 1
    ? [...used, ...selected.map((image) => image.id)]
    : selected.map((image) => image.id);
  window.localStorage.setItem(TAT_CYCLE_KEY, JSON.stringify(nextUsed));
  return selected;
}

export default function TAT() {
  const [images, setImages] = useState([]);
  const [cards, setCards] = useState([]);
  const [cardIndex, setCardIndex] = useState(0);
  const [phase, setPhase] = useState('prepare');
  const [secondsLeft, setSecondsLeft] = useState(OBSERVATION_SECONDS);
  const [stories, setStories] = useState({});
  const [storyUploads, setStoryUploads] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [result, setResult] = useState(null);

  const activeCard = cards[cardIndex];
  const isBlank = cardIndex === TOTAL_CARDS - 1;

  useEffect(() => {
    let cancelled = false;
    const loadImages = async () => {
      const { data, error: queryError } = await supabase
        .from('ppdt_images')
        .select('id, title, storage_path')
        .eq('active', true)
        .order('created_at', { ascending: true });
      if (queryError) throw queryError;
      const signed = await Promise.all((data || []).map(async (image) => {
        const { data: signedData, error: signedError } = await supabase.storage
          .from('ppdt-images')
          .createSignedUrl(image.storage_path, 3600);
        if (signedError) throw signedError;
        return { ...image, image: signedData.signedUrl };
      }));
      if (!cancelled) {
        setImages(signed);
        setLoading(false);
        if (signed.length < TOTAL_CARDS - 1) {
          setError(`TAT needs at least ${TOTAL_CARDS - 1} active pictures. Upload more in Admin.`);
        }
      }
    };
    loadImages().catch((loadError) => {
      if (!cancelled) {
        setError(loadError.message || 'Unable to load the TAT image library.');
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!['observe', 'write'].includes(phase) || secondsLeft <= 0) return undefined;
    const timer = window.setInterval(() => setSecondsLeft((value) => value - 1), 1000);
    return () => window.clearInterval(timer);
  }, [phase, secondsLeft]);

  useEffect(() => {
    if (secondsLeft !== 0 || !['observe', 'write'].includes(phase)) return;
    if (phase === 'observe') {
      setPhase('write');
      setSecondsLeft(WRITING_SECONDS);
    } else if (cardIndex < TOTAL_CARDS - 1) {
      playBuzzer();
      setCardIndex((value) => value + 1);
      setPhase('observe');
      setSecondsLeft(OBSERVATION_SECONDS);
    } else {
      playBuzzer();
      setPhase('review');
    }
  }, [secondsLeft, phase, cardIndex]);

  const startTest = () => {
    const selected = chooseImages(images);
    setCards([...selected, { id: 'blank', title: 'Blank Card', image: null }]);
    setStories({});
    setStoryUploads({});
    setCardIndex(0);
    setPhase('observe');
    setSecondsLeft(OBSERVATION_SECONDS);
    setResult(null);
  };

  const updateStory = (value) => setStories((current) => ({ ...current, [cardIndex]: value }));

  const uploadStory = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Upload a JPG, PNG, or WEBP image of the handwritten story.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const preview = String(reader.result);
      const [header, data] = preview.split(',');
      setStoryUploads((current) => ({
        ...current,
        [cardIndex]: {
          data,
          mimeType: header.match(/data:(.*);base64/)?.[1] || file.type,
          preview
        }
      }));
      setError('');
    };
    reader.readAsDataURL(file);
  };

  const evaluateAll = async () => {
    setEvaluating(true);
    setError('');
    try {
      const submissions = cards.map((card, index) => ({
        cardNumber: index + 1,
        pictureTitle: card.title,
        pictureImage: card.image,
        story: stories[index] || '',
        storyImage: storyUploads[index] || null
      }));
      const evaluation = await evaluateTATBatch(submissions);
      setResult(evaluation);
      setPhase('result');
    } catch (evaluationError) {
      setError(evaluationError.message || 'Unable to evaluate the TAT submission.');
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <TestPageHeader
        stage="Day 2: Psychological Battery"
        title="Thematic Apperception Test (TAT)"
        subtitle="11 picture cards plus one blank card. Every picture is shown once in a continuous timed assessment."
        badge="12-Card Assessment"
      />

      {phase === 'prepare' && (
        <div className="bg-[#1b2212] border-2 border-[#3a4520] rounded-2xl p-6 sm:p-8 space-y-5">
          <h2 className="font-heading text-xl text-[#c8a84b] font-bold">Official TAT Protocol</h2>
          <p className="text-sm text-[#9a9780] leading-relaxed">
            Each card is shown for 30 seconds, followed immediately by 4 minutes to write.
            A buzzer marks each transition. There are no breaks between cards. Card 12 is blank:
            imagine your own scene during observation and write its story.
          </p>
          {loading && <p className="text-sm text-[#c8a84b]">Loading the secure picture library...</p>}
          {error && <p className="text-sm text-red-300">{error}</p>}
          <button onClick={startTest} disabled={loading || images.length < TOTAL_CARDS - 1} className="px-7 py-3 rounded-xl bg-[#c8a84b] disabled:opacity-40 text-[#12160a] font-bold">
            Begin 12-Card TAT Assessment →
          </button>
        </div>
      )}

      {['observe', 'write'].includes(phase) && activeCard && (
        <div className="bg-[#1b2212] border-2 border-[#c8a84b] rounded-2xl p-6 sm:p-8 space-y-5">
          <div className="flex items-center justify-between border-b border-[#3a4520] pb-4">
            <div>
              <span className="text-xs font-mono text-[#c8a84b] font-bold">CARD {cardIndex + 1} OF {TOTAL_CARDS}</span>
              <h2 className="font-heading text-xl text-[#e8e4d0] font-bold">{isBlank ? 'Blank Card — Imagine Your Own Scene' : 'Observe the Picture'}</h2>
            </div>
            <TimerCircle totalSeconds={phase === 'observe' ? OBSERVATION_SECONDS : WRITING_SECONDS} remainingSeconds={secondsLeft} size={86} label={phase === 'observe' ? 'Observe' : 'Write'} />
          </div>
          <div className="w-full aspect-[16/9] max-h-[380px] rounded-xl overflow-hidden border-2 border-[#3a4520] bg-black flex items-center justify-center">
            {activeCard.image ? <img src={activeCard.image} alt="TAT assessment card" className="w-full h-full object-contain" /> : <span className="text-5xl text-[#3a4520]">?</span>}
          </div>
          {phase === 'write' && (
            <textarea value={stories[cardIndex] || ''} onChange={(event) => updateStory(event.target.value)} rows={8} placeholder="Write your story: past background → present action → future outcome..." className="w-full bg-[#12160a] border border-[#3a4520] rounded-xl p-4 text-sm text-[#e8e4d0] leading-relaxed" />
          )}
          <div className="flex items-center justify-between text-xs text-[#9a9780]">
            <span><Volume2 className="inline w-4 h-4 mr-1" />Buzzer only — the next card starts immediately.</span>
            {phase === 'write' && storyUploads[cardIndex] && <span className="text-emerald-300">Handwritten story attached</span>}
          </div>
          {phase === 'write' && (
            <label className="inline-flex items-center gap-2 text-xs text-[#c8a84b] cursor-pointer">
              <Upload className="w-4 h-4" /> Upload handwritten story
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={uploadStory} className="hidden" />
            </label>
          )}
        </div>
      )}

      {phase === 'review' && (
        <div className="bg-[#1b2212] border-2 border-[#3a4520] rounded-2xl p-6 space-y-4">
          <h2 className="font-heading text-xl text-[#c8a84b] font-bold">Review All 12 Stories</h2>
          <p className="text-sm text-[#9a9780]">You may add or correct typed stories before sending the complete card-by-card submission to the AI assessor.</p>
          {cards.map((card, index) => (
            <div key={card.id} className="border border-[#3a4520] rounded-xl p-3">
              <span className="text-xs font-mono text-[#c8a84b]">CARD {index + 1} — {card.title}</span>
              <textarea value={stories[index] || ''} onChange={(event) => setStories((current) => ({ ...current, [index]: event.target.value }))} rows={3} className="mt-2 w-full bg-[#12160a] border border-[#3a4520] rounded-lg p-3 text-sm" />
            </div>
          ))}
          {error && <p className="text-sm text-red-300">{error}</p>}
          <button onClick={evaluateAll} disabled={evaluating} className="px-6 py-3 rounded-xl bg-[#c8a84b] disabled:opacity-40 text-[#12160a] font-bold">{evaluating ? 'Analyzing all 12 cards...' : 'Submit 12 Stories for AI Dossier →'}</button>
        </div>
      )}

      {phase === 'result' && result && (
        <div className="bg-[#1b2212] border-2 border-[#c8a84b] rounded-2xl p-6 space-y-4">
          <h2 className="font-heading text-xl text-[#c8a84b] font-bold">TAT AI Dossier</h2>
          <p className="text-sm text-[#e8e4d0]">{result.overallAssessment}</p>
          <p className="text-sm text-[#9a9780]">Overall score: <strong className="text-[#c8a84b]">{result.overallScore}/10</strong></p>
          <div className="grid md:grid-cols-2 gap-3">{(result.cardAssessments || []).map((item) => <div key={item.cardNumber} className="bg-[#12160a] rounded-lg p-3 text-xs"><strong className="text-[#c8a84b]">Card {item.cardNumber}: {item.score}/10</strong><p className="mt-1">{item.analysis}</p><p className="mt-1 text-emerald-300">OLQs: {(item.olqs || []).join(', ')}</p></div>)}</div>
        </div>
      )}
    </div>
  );
}
