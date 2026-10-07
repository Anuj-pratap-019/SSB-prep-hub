import React from 'react';
import { Mic, MicOff, AlertCircle, RefreshCw } from 'lucide-react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

export default function SpeechRecorder({ onTranscriptChange, initialText = '', label = 'Speak your narration aloud' }) {
  const {
    transcript,
    setTranscript,
    isListening,
    isSupported,
    error,
    startListening,
    stopListening,
    resetTranscript
  } = useSpeechRecognition({ lang: 'en-IN' });

  // Sync transcript back to parent component
  React.useEffect(() => {
    if (transcript) {
      onTranscriptChange(transcript);
    }
  }, [transcript, onTranscriptChange]);

  return (
    <div className="bg-[#1b2212] border border-[#3a4520] rounded-xl p-4 sm:p-5 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isListening ? 'bg-red-500 animate-ping' : 'bg-[#c8a84b]'}`} />
          <span className="text-sm font-semibold font-heading tracking-wider uppercase text-[#e8e4d0]">
            {label}
          </span>
        </div>

        {/* Mic Control Button */}
        <div className="flex items-center gap-2">
          {transcript && (
            <button
              type="button"
              onClick={resetTranscript}
              className="p-1.5 rounded-lg bg-[#222810] border border-[#3a4520] text-[#9a9780] hover:text-[#c8a84b] text-xs flex items-center gap-1"
              title="Clear recording"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={isListening ? stopListening : startListening}
            className={`px-4 py-2 rounded-lg font-heading text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
              isListening
                ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/40 animate-pulse'
                : 'bg-[#4a5c2a] hover:bg-[#5e7535] text-[#e8e4d0] border border-[#c8a84b]/40'
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="w-4 h-4" />
                <span>Stop Recording</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 text-[#c8a84b]" />
                <span>Start Microphone</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Audio Waveform simulation during recording */}
      {isListening && (
        <div className="flex items-center justify-center gap-1 py-2">
          <span className="w-1 h-3 bg-[#c8a84b] rounded-full animate-bounce"></span>
          <span className="w-1 h-6 bg-[#c8a84b] rounded-full animate-bounce [animation-delay:0.1s]"></span>
          <span className="w-1 h-8 bg-[#c8a84b] rounded-full animate-bounce [animation-delay:0.2s]"></span>
          <span className="w-1 h-5 bg-[#c8a84b] rounded-full animate-bounce [animation-delay:0.15s]"></span>
          <span className="w-1 h-7 bg-[#c8a84b] rounded-full animate-bounce [animation-delay:0.25s]"></span>
          <span className="w-1 h-3 bg-[#c8a84b] rounded-full animate-bounce [animation-delay:0.05s]"></span>
          <span className="text-xs font-mono text-emerald-400 ml-2">Listening (Indian English)...</span>
        </div>
      )}

      {/* Transcription Preview / Editable Area */}
      <div>
        <textarea
          value={transcript || initialText}
          onChange={(e) => {
            setTranscript(e.target.value);
            onTranscriptChange(e.target.value);
          }}
          placeholder="Your speech will appear here in real-time as you narrate... You can also edit or type manually if needed."
          rows={3}
          className="w-full bg-[#12160a] border border-[#3a4520] focus:border-[#c8a84b] focus:ring-1 focus:ring-[#c8a84b] rounded-lg p-3 text-sm text-[#e8e4d0] placeholder-[#9a9780]/50 outline-none transition-all font-sans"
        />
      </div>

      {!isSupported && (
        <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-950/30 border border-amber-800/40 p-2 rounded">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>Speech Recognition is best supported in Chrome, Edge, or Brave. You can still type your narration above!</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-xs text-red-400 bg-red-950/30 border border-red-800/40 p-2 rounded">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
