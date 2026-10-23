import React, { useEffect, useRef, useState } from 'react';
import { Camera, Mic, Square, Play, RotateCcw } from 'lucide-react';
import TestPageHeader from '../components/TestPageHeader';
import { evaluateLecturette } from '../services/gemini';
import { getLecturetteAttempts, getLecturetteTopics, saveLecturetteAttempt } from '../services/lecturette';

const PREP_SECONDS = 180;
const SPEAK_SECONDS = 180;

export default function Lecturette() {
  const [topics, setTopics] = useState([]);
  const [phase, setPhase] = useState('select');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(PREP_SECONDS);
  const [transcript, setTranscript] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [evaluation, setEvaluation] = useState(null);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const recognitionRef = useRef(null);
  const transcriptRef = useRef('');
  const videoBlobRef = useRef(null);

  useEffect(() => {
    Promise.all([getLecturetteTopics(), getLecturetteAttempts()])
      .then(([loadedTopics, loadedHistory]) => { setTopics(loadedTopics); setHistory(loadedHistory); })
      .catch((err) => setError(err.message));
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      recognitionRef.current?.stop();
      if (videoUrl) URL.revokeObjectURL(videoUrl);
    };
  }, [videoUrl]);

  useEffect(() => {
    if (!['prepare', 'speak'].includes(phase)) return undefined;
    if (secondsLeft <= 0) {
      if (phase === 'prepare') startSpeaking();
      else finishRecording();
      return undefined;
    }
    const timer = setInterval(() => setSecondsLeft((value) => value - 1), 1000);
    return () => clearInterval(timer);
  }, [phase, secondsLeft]);

  const startSpeaking = async () => {
    setError('');
    setPhase('speak');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
      chunksRef.current = [];
      recorder.ondataavailable = (event) => event.data.size && chunksRef.current.push(event.data);
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        videoBlobRef.current = blob;
        setVideoUrl(URL.createObjectURL(blob));
      };
      recorder.start();
      recorderRef.current = recorder;
      const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (Recognition) {
        const recognition = new Recognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-IN';
        recognition.onresult = (event) => {
          let finalText = transcriptRef.current;
          for (let index = event.resultIndex; index < event.results.length; index += 1) {
            const text = event.results[index][0].transcript;
            if (event.results[index].isFinal) finalText += `${text} `;
          }
          transcriptRef.current = finalText;
          setTranscript(finalText);
        };
        recognition.start();
        recognitionRef.current = recognition;
      }
      setSecondsLeft(SPEAK_SECONDS);
    } catch (err) {
      setError(`Camera and microphone access is required: ${err.message}`);
    }
  };

  const beginPreparation = () => {
    setSelectedTopic(topics.sort(() => Math.random() - 0.5).slice(0, 4)[0]?.topic || '');
    setPhase('prepare');
    setSecondsLeft(PREP_SECONDS);
    setTranscript('');
    transcriptRef.current = '';
    setEvaluation(null);
  };

  const finishRecording = async () => {
    const recordingReady = new Promise((resolve) => {
      if (!recorderRef.current || recorderRef.current.state === 'inactive') {
        resolve();
        return;
      }
      const recorder = recorderRef.current;
      const originalStop = recorder.onstop;
      recorder.onstop = (event) => {
        originalStop?.(event);
        resolve();
      };
      recorder.stop();
    });
    recognitionRef.current?.stop();
    streamRef.current?.getTracks().forEach((track) => track.stop());
    setPhase('evaluating');
    setError('');
    try {
      const result = await evaluateLecturette({ topic: selectedTopic, transcript: transcriptRef.current });
      await recordingReady;
      await saveLecturetteAttempt({ topic: selectedTopic, transcript: transcriptRef.current, videoBlob: videoBlobRef.current, evaluation: result });
      const updatedHistory = await getLecturetteAttempts();
      setHistory(updatedHistory);
      setEvaluation(result);
      setPhase('result');
    } catch (err) {
      setError(err.message);
      setPhase('result');
    }
  };

  const reset = () => {
    setPhase('select');
    setSelectedTopic('');
    setVideoUrl('');
    setEvaluation(null);
    setError('');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <TestPageHeader stage="Days 3 & 4: GTO Series" title="Lecturette Evaluation" subtitle="Choose one topic, prepare for 3 minutes, then deliver a recorded 3-minute lecturette." badge="Camera + AI Review" />
      {error && <p className="bg-red-950/40 border border-red-800 rounded-xl p-4 text-sm text-red-300">{error}</p>}
      {phase === 'select' && (
        <div className="bg-[#1b2212] border-2 border-[#c8a84b] rounded-2xl p-6 sm:p-8 space-y-6">
          <h2 className="font-heading text-xl font-bold text-[#c8a84b]">Lecturette Card</h2>
          <p className="text-sm text-[#9a9780]">Four topics will appear on your card. Select one and prepare your points before the camera opens.</p>
          <button onClick={beginPreparation} disabled={topics.length < 4} className="px-6 py-3 rounded-lg bg-[#c8a84b] text-[#12160a] font-bold disabled:opacity-40">
            {topics.length < 4 ? 'Waiting for four topics...' : 'Draw Lecturette Card'}
          </button>
        </div>
      )}
      {['prepare', 'speak'].includes(phase) && (
        <div className="bg-[#1b2212] border-2 border-[#c8a84b] rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-[#c8a84b] font-bold">{phase === 'prepare' ? 'Preparation time' : 'Lecturette in progress'}</span>
            <span className="font-heading text-3xl font-bold text-[#e8e4d0]">{Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, '0')}</span>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {topics.slice(0, 4).map((item) => <button key={item.id} onClick={() => phase === 'prepare' && setSelectedTopic(item.topic)} className={`p-4 rounded-xl border text-left font-heading font-bold ${selectedTopic === item.topic ? 'border-[#c8a84b] bg-[#2d3a18] text-[#c8a84b]' : 'border-[#3a4520] bg-[#12160a] text-[#e8e4d0]'}`}>{item.topic}</button>)}
          </div>
          {phase === 'prepare' && <button onClick={startSpeaking} className="px-6 py-3 rounded-lg bg-emerald-600 text-white font-bold flex items-center gap-2"><Camera className="w-4 h-4" /> Start 3-minute lecturette</button>}
          {phase === 'speak' && <div className="space-y-3"><video ref={videoRef} autoPlay muted className="w-full max-h-[420px] rounded-xl bg-black object-contain" /><div className="flex items-center gap-2 text-xs text-red-300"><Mic className="w-4 h-4" /> Camera and microphone recording active</div><button onClick={finishRecording} className="px-6 py-3 rounded-lg bg-red-600 text-white font-bold flex items-center gap-2"><Square className="w-4 h-4" /> Finish lecturette</button></div>}
        </div>
      )}
      {phase === 'evaluating' && <div className="bg-[#1b2212] rounded-2xl p-12 text-center text-[#c8a84b]">Saving recording and preparing AI feedback...</div>}
      {phase === 'result' && evaluation && (
        <div className="bg-[#1b2212] border-2 border-[#c8a84b] rounded-2xl p-6 space-y-5">
          <h2 className="font-heading text-2xl font-bold text-[#c8a84b]">Lecturette Feedback: {evaluation.score}/10</h2>
          <p className="text-emerald-300 font-bold">{evaluation.verdict}</p>
          <p className="text-sm text-[#e8e4d0]">{evaluation.feedback}</p>
          <p className="text-sm text-[#9a9780]">{evaluation.structureFeedback}</p>
          <ul className="list-disc list-inside text-sm text-[#e8e4d0]">{(evaluation.improvementSuggestions || []).map((item) => <li key={item}>{item}</li>)}</ul>
          {videoUrl && <video controls src={videoUrl} className="w-full max-h-80 rounded-xl bg-black" />}
          <button onClick={reset} className="px-5 py-2 rounded-lg bg-[#c8a84b] text-[#12160a] font-bold flex items-center gap-2"><RotateCcw className="w-4 h-4" /> New lecturette</button>
        </div>
      )}
      {phase === 'select' && history.length > 0 && (
        <div className="bg-[#1b2212] border border-[#3a4520] rounded-2xl p-6 space-y-3">
          <h2 className="font-heading text-xl font-bold text-[#c8a84b]">Your Lecturette History</h2>
          {history.map((attempt) => <div key={attempt.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#12160a] border border-[#3a4520] rounded-lg p-3"><div><strong className="text-[#e8e4d0]">{attempt.topic}</strong><p className="text-xs text-[#9a9780]">{new Date(attempt.created_at).toLocaleString()} · {attempt.verdict}</p></div><div className="flex items-center gap-3"><span className="font-bold text-emerald-300">{attempt.score}/10</span>{attempt.videoUrl && <a href={attempt.videoUrl} target="_blank" rel="noreferrer" className="text-xs text-[#c8a84b] underline">Watch video</a>}</div></div>)}
        </div>
      )}
    </div>
  );
}
