import React, { useState, useRef, useEffect } from 'react';
import { Mic, Send, Sparkles, User, Shield, AlertCircle, RefreshCw, Award } from 'lucide-react';
import SpeechRecorder from '../components/SpeechRecorder';
import { generatePIReply } from '../services/gemini';
import TestPageHeader from '../components/TestPageHeader';

export default function PIMock() {
  const [profile, setProfile] = useState({
    name: 'Cadet Arjun',
    education: 'B.Tech Computer Science (Final Year)',
    nativePlace: 'Chandigarh / Punjab',
    service: 'Indian Army (Infantry / Signals)',
    hobbies: 'Cross-country running, debating, basketball'
  });
  const [isStarted, setIsStarted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [useVoice, setUseVoice] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleStart = async () => {
    setIsStarted(true);
    setIsLoading(true);
    const initialPrompt = [
      {
        role: 'model',
        content: `Jai Hind, ${profile.name}. Welcome to the board. Take a seat, relax, and make yourself comfortable. You've had a busy morning with the psychological battery. Tell me briefly about yourself—your background, your family, and what brings you here to the SSB today.`
      }
    ];
    setMessages(initialPrompt);
    setIsLoading(false);
  };

  const handleSendMessage = async (msgToSend = inputText) => {
    if (!msgToSend.trim() || isLoading) return;

    const userMessage = { role: 'user', content: msgToSend.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputText('');
    setIsLoading(true);

    try {
      const reply = await generatePIReply({
        messages: updatedMessages,
        candidateProfile: profile
      });
      setMessages([...updatedMessages, { role: 'model', content: reply }]);
    } catch (err) {
      console.warn('PI error:', err);
      setMessages([
        ...updatedMessages,
        {
          role: 'model',
          content: 'I noticed a minor technical lag on my end. Please elaborate on what you were just saying.'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      
      {/* Test Page Header with Breadcrumbs */}
      <TestPageHeader
        stage="Days 3 & 4: Interview Stage"
        title="AI Mock Personal Interview"
        subtitle="Conversational spoken interview with Senior IO Col. Rathore. Dynamic PIQ probing with voice input support."
        badge="Voice Enabled"
        actions={
          isStarted ? (
            <button
              onClick={() => setIsStarted(false)}
              className="px-3 py-1.5 rounded-lg bg-[#222810] border border-[#3a4520] text-xs font-mono text-[#c8a84b] flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Interview</span>
            </button>
          ) : null
        }
      />

      {/* PIQ Profile Intake (Before Starting) */}
      {!isStarted ? (
        <div className="bg-[#1b2212] border-2 border-[#3a4520] rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <h2 className="font-heading text-xl text-[#c8a84b] font-bold uppercase tracking-wider">
              PIQ Form Intake (Personal Information Questionnaire)
            </h2>
            <p className="text-sm text-[#9a9780] leading-relaxed">
              In SSB, the Interviewing Officer (IO) thoroughly scrutinizes your PIQ form before you enter. Customize your profile details below so Col. Rathore can cross-examine you realistically!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-[#9a9780] block mb-1 font-bold">Candidate Name:</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full bg-[#12160a] border border-[#3a4520] rounded p-2.5 text-[#e8e4d0]"
              />
            </div>
            <div>
              <label className="text-[#9a9780] block mb-1 font-bold">Education &amp; Degree:</label>
              <input
                type="text"
                value={profile.education}
                onChange={(e) => setProfile({ ...profile, education: e.target.value })}
                className="w-full bg-[#12160a] border border-[#3a4520] rounded p-2.5 text-[#e8e4d0]"
              />
            </div>
            <div>
              <label className="text-[#9a9780] block mb-1 font-bold">Native Place / State:</label>
              <input
                type="text"
                value={profile.nativePlace}
                onChange={(e) => setProfile({ ...profile, nativePlace: e.target.value })}
                className="w-full bg-[#12160a] border border-[#3a4520] rounded p-2.5 text-[#e8e4d0]"
              />
            </div>
            <div>
              <label className="text-[#9a9780] block mb-1 font-bold">Service / Arm Preference:</label>
              <input
                type="text"
                value={profile.service}
                onChange={(e) => setProfile({ ...profile, service: e.target.value })}
                className="w-full bg-[#12160a] border border-[#3a4520] rounded p-2.5 text-[#e8e4d0]"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-[#9a9780] block mb-1 font-bold">Hobbies &amp; Sports Extracurriculars:</label>
              <input
                type="text"
                value={profile.hobbies}
                onChange={(e) => setProfile({ ...profile, hobbies: e.target.value })}
                className="w-full bg-[#12160a] border border-[#3a4520] rounded p-2.5 text-[#e8e4d0]"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleStart}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#c8a84b] to-[#a8882e] hover:from-[#d8b85b] hover:to-[#b8983e] text-[#12160a] font-heading font-bold text-sm uppercase tracking-wider shadow-lg flex items-center gap-2"
            >
              <span>Enter Interview Room &rarr;</span>
            </button>
          </div>
        </div>
      ) : (
        /* Active Interview Chat */
        <div className="bg-[#1b2212] border-2 border-[#3a4520] rounded-2xl flex flex-col h-[650px] shadow-2xl overflow-hidden">
          
          {/* Chat Window */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.map((m, idx) => {
              const isOfficer = m.role === 'model';
              return (
                <div
                  key={idx}
                  className={`flex gap-3 max-w-[85%] ${
                    isOfficer ? 'mr-auto' : 'ml-auto flex-row-reverse'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm border shadow-md ${
                    isOfficer
                      ? 'bg-[#2d3a18] border-[#c8a84b] text-[#c8a84b]'
                      : 'bg-[#4a5c2a] border-[#e8e4d0]/40 text-[#e8e4d0]'
                  }`}>
                    {isOfficer ? '🎖️' : '👤'}
                  </div>
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                    isOfficer
                      ? 'bg-[#12160a] border border-[#3a4520] text-[#e8e4d0] rounded-tl-none shadow-md'
                      : 'bg-[#374420] text-[#e8e4d0] border border-[#526433] rounded-tr-none shadow-md'
                  }`}>
                    {isOfficer && (
                      <span className="text-[10px] font-mono text-[#c8a84b] block uppercase font-bold mb-1">
                        Col. R.S. Rathore (IO)
                      </span>
                    )}
                    <p className="whitespace-pre-wrap">{m.content}</p>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex gap-3 mr-auto max-w-[80%] items-center text-xs font-mono text-[#c8a84b]">
                <div className="w-8 h-8 rounded-full bg-[#2d3a18] border border-[#c8a84b] flex items-center justify-center">
                  🎖️
                </div>
                <div className="bg-[#12160a] border border-[#3a4520] px-4 py-2 rounded-xl flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c8a84b] animate-bounce"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c8a84b] animate-bounce [animation-delay:0.1s]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c8a84b] animate-bounce [animation-delay:0.2s]"></span>
                  <span className="ml-1 text-[#9a9780]">Col. Rathore is listening &amp; observing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Voice Input Drawer (Optional) */}
          {useVoice && (
            <div className="p-3 bg-[#12160a] border-t border-[#3a4520]">
              <SpeechRecorder
                initialText={inputText}
                onTranscriptChange={(t) => setInputText(t)}
                label="Voice Input (Indian English)"
              />
            </div>
          )}

          {/* Input Control Bar */}
          <div className="p-4 bg-[#141a0d] border-t border-[#3a4520] flex items-center gap-3">
            <button
              onClick={() => setUseVoice(!useVoice)}
              className={`p-2.5 rounded-xl border transition-all text-xs flex items-center gap-1.5 ${
                useVoice
                  ? 'bg-[#c8a84b] text-[#12160a] font-bold border-[#c8a84b]'
                  : 'bg-[#1b2212] border-[#3a4520] text-[#9a9780] hover:text-[#c8a84b]'
              }`}
              title="Toggle Microphone Input"
            >
              <Mic className="w-4 h-4" />
              <span className="hidden sm:inline font-mono">Mic</span>
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              placeholder="Speak via microphone or type your response to Col. Rathore..."
              className="flex-1 bg-[#12160a] border border-[#3a4520] focus:border-[#c8a84b] rounded-xl px-4 py-2.5 text-sm text-[#e8e4d0] outline-none font-sans"
            />

            <button
              disabled={isLoading || !inputText.trim()}
              onClick={() => handleSendMessage()}
              className="px-5 py-2.5 rounded-xl bg-[#c8a84b] hover:bg-[#a8882e] disabled:opacity-40 text-[#12160a] font-heading font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md"
            >
              <span>Reply</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
