/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Copy, Send, Trash2 } from 'lucide-react';
import { TranscriptionItem } from '../types';
import { AppLanguage, translations } from '../translations';

interface SpeechToTextProps {
  onSendToAi?: (text: string) => void;
  transcriptionHistory: TranscriptionItem[];
  setTranscriptionHistory: React.Dispatch<React.SetStateAction<TranscriptionItem[]>>;
  language: AppLanguage;
}

export default function SpeechToText({ onSendToAi, transcriptionHistory, setTranscriptionHistory, language }: SpeechToTextProps) {
  const [isListening, setIsListening] = useState(false);
  const [currentText, setCurrentText] = useState('');
  const [lang, setLang] = useState('es-ES');
  const [fontSize, setFontSize] = useState<number>(32); // Default large size 32px
  const [speaker, setSpeaker] = useState<'Oponente' | 'Yo'>('Oponente');
  const [supportSpeech, setSupportSpeech] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const endOfLogRef = useRef<HTMLDivElement>(null);

  const t = translations[language];

  // Map app general language to recognition specific locale standard code
  useEffect(() => {
    if (language === 'es') setLang('es-ES');
    else if (language === 'en') setLang('en-US');
    else if (language === 'ko') setLang('ko-KR');
    else if (language === 'ja') setLang('ja-JP');
  }, [language]);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupportSpeech(false);
    }
  }, []);

  // Autofocus onto latest transcription item
  useEffect(() => {
    if (endOfLogRef.current) {
      endOfLogRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [transcriptionHistory, currentText]);

  const startListening = () => {
    setErrorMsg(null);
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupportSpeech(false);
      return;
    }

    try {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = lang;

      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        if (finalTranscript) {
          const newItem: TranscriptionItem = {
            id: crypto.randomUUID(),
            text: finalTranscript.trim(),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            speaker: speaker === 'Oponente' ? 'Oponente' : 'Yo'
          };
          setTranscriptionHistory(prev => [...prev, newItem]);
          setCurrentText('');
        } else {
          setCurrentText(interimTranscript);
        }
      };

      rec.onerror = (event: any) => {
        console.error('Speech recognition error', event);
        if (event.error === 'not-allowed') {
          setErrorMsg(language === 'es' ? 'Permiso de micrófono denegado. Por favor, habilítalo.' : 'Microphone permission denied. Please enable it.');
        } else if (event.error === 'no-speech') {
          // Safe to ignore
        } else {
          setErrorMsg(`${event.error}`);
        }
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
      rec.start();
    } catch (e: any) {
      setErrorMsg(`Error: ${e.message}`);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
    if (currentText.trim()) {
      const newItem: TranscriptionItem = {
        id: crypto.randomUUID(),
        text: currentText.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        speaker: speaker === 'Oponente' ? 'Oponente' : 'Yo'
      };
      setTranscriptionHistory(prev => [...prev, newItem]);
      setCurrentText('');
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleClearHistory = () => {
    setTranscriptionHistory([]);
    setCurrentText('');
  };

  return (
    <div id="speech-to-text-section" className="flex flex-col h-full bg-white/10 dark:bg-black/30 backdrop-blur-xl rounded-[32px] border border-white/25 dark:border-white/10 shadow-2xl overflow-hidden min-h-[500px] text-white animate-fade-in">
      {/* Top action bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-5 border-b border-white/20 dark:border-white/10 bg-white/10 dark:bg-black/20">
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-xl p-1 border border-white/10">
            <button
              id="speaker-other-btn"
              onClick={() => setSpeaker('Oponente')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                speaker === 'Oponente'
                  ? 'bg-white text-teal-755 shadow-lg'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              {language === 'es' ? 'Habla Oyente' : language === 'ja' ? '相手の話' : language === 'ko' ? '상대방' : 'Opponent'}
            </button>
            <button
              id="speaker-me-btn"
              onClick={() => setSpeaker('Yo')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                speaker === 'Yo'
                  ? 'bg-white text-teal-755 shadow-lg'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              {language === 'es' ? 'Hablo Yo' : language === 'ja' ? '自分の話' : language === 'ko' ? '나의 말' : 'My Talk'}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Font Size controls */}
          <div className="flex items-center bg-white/10 dark:bg-black/20 rounded-xl overflow-hidden border border-white/20">
            <button
              id="decrease-font-btn"
              onClick={() => setFontSize(Math.max(16, fontSize - 4))}
              className="px-3.5 py-2 text-sm font-bold text-white hover:bg-white/10 font-mono transition cursor-pointer"
              title="A-"
            >
              A-
            </button>
            <span className="px-2 w-12 text-center text-xs font-bold font-mono text-white/95 border-x border-white/20">
              {fontSize}px
            </span>
            <button
              id="increase-font-btn"
              onClick={() => setFontSize(Math.min(72, fontSize + 4))}
              className="px-3.5 py-2 text-sm font-bold text-white hover:bg-white/10 font-mono transition cursor-pointer"
              title="A+"
            >
              A+
            </button>
          </div>

          {/* Language selection */}
          <select
            id="transcription-lang-select"
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="text-xs font-bold bg-zinc-950 text-white py-2 px-3 rounded-xl border border-white/20 focus:ring-1 focus:ring-white transition outline-none cursor-pointer"
          >
            {language === 'es' ? (
              <>
                <option value="es-ES" className="text-white bg-zinc-950">Español (España)</option>
                <option value="es-MX" className="text-white bg-zinc-950">Español (México)</option>
                <option value="es-AR" className="text-white bg-zinc-950">Español (Argentina)</option>
              </>
            ) : null}
            <option value="en-US" className="text-white bg-zinc-950">English (US)</option>
            <option value="ko-KR" className="text-white bg-zinc-950">한국어 (KO)</option>
            <option value="ja-JP" className="text-white bg-zinc-950">日本語 (JA)</option>
          </select>
        </div>
      </div>

      {/* Screen transcription display area */}
      <div 
        id="transcription-terminal"
        className="flex-1 p-6 overflow-y-auto min-h-[250px] max-h-[480px] bg-white/5 dark:bg-black/10 flex flex-col space-y-5"
      >
        {transcriptionHistory.length === 0 && !currentText && (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-white/60">
            <div className="w-16 h-16 rounded-full bg-white/10 dark:bg-white/5 flex items-center justify-center mb-4 transition border border-white/20">
              <Mic className="h-6 w-6 text-white" />
            </div>
            <p className="text-sm font-semibold text-white">{language === 'es' ? 'Listo transcriptor' : 'Transcriber Ready'}</p>
            <p className="text-xs text-white/70 max-w-sm mt-2 leading-relaxed">
              {language === 'es'
                ? 'Presione el botón redondo de abajo para grabar. El texto se mostrará gigante.'
                : 'Press the round recording microphone trigger. Speak to display giant sized text characters on-screen.'}
            </p>
          </div>
        )}

        {/* History of transcriptions */}
        {transcriptionHistory.map((item) => (
          <div
            key={item.id}
            id={`transcription-item-${item.id}`}
            className={`flex flex-col space-y-2 p-5 rounded-[24px] max-w-[85%] transition shadow-lg border backdrop-blur-md ${
              item.speaker === 'Oponente'
                ? 'bg-white/20 border-white/25 rounded-bl-none self-start text-white animate-fade-in'
                : 'bg-teal-600/40 border-white/30 rounded-br-none self-end text-right items-end text-white animate-fade-in'
            }`}
          >
            <div className="flex items-center gap-2 text-[10px] font-mono font-bold tracking-wider uppercase">
              <span className={item.speaker === 'Oponente' ? 'text-white/60' : 'text-white/75 font-semibold'}>
                {item.speaker === 'Oponente' ? t.speakerOpponent : t.speakerMe}
              </span>
              <span className="text-white/50">{item.timestamp}</span>
            </div>

            <p
              style={{ fontSize: `${fontSize}px`, lineHeight: '1.3' }}
              className="text-white font-sans font-medium tracking-tight text-left break-words"
            >
              {item.text}
            </p>

            <div className="flex items-center gap-1.5 pt-2 select-none self-start">
              <button
                id={`copy-item-${item.id}`}
                onClick={() => handleCopyText(item.text)}
                className="p-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-xl transition border border-white/10 cursor-pointer"
                title="Copy"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
              {onSendToAi && (
                <button
                  id={`ai-item-${item.id}`}
                  onClick={() => onSendToAi(item.text)}
                  className="p-2 text-teal-100 hover:text-white bg-white/10 hover:bg-white/20 rounded-xl transition border border-white/10 flex items-center gap-1 text-xs font-bold cursor-pointer"
                  title={t.consultAiBtn}
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>IA</span>
                </button>
              )}
            </div>
          </div>
        ))}

        {/* Current real-time results */}
        {currentText && (
          <div
            id="transcription-realtime"
            className={`flex flex-col space-y-2 p-5 rounded-[24px] max-w-[85%] border animate-pulse shadow-lg backdrop-blur-md ${
              speaker === 'Oponente'
                ? 'bg-white/20 border-white/30 self-start text-white rounded-bl-none'
                : 'bg-teal-600/30 border-white/30 self-end text-right items-end text-white rounded-br-none'
            }`}
          >
            <div className="flex items-center gap-2 text-[10px] font-mono font-bold tracking-wider uppercase text-white/80">
              <span className="h-2 w-2 rounded-full bg-red-505 animate-ping"></span>
              <span>{t.listeningActive}</span>
            </div>
            <p
              style={{ fontSize: `${fontSize}px`, lineHeight: '1.3' }}
              className="text-white font-sans font-medium tracking-tight text-left break-words"
            >
              {currentText}
            </p>
          </div>
        )}

        <div ref={endOfLogRef} />
      </div>

      {!supportSpeech && (
        <div className="mx-6 my-2 p-4 bg-red-500/10 border border-red-530 rounded-2xl text-xs text-red-200">
          Recomendamos abrir en una pestaña móvil externa y autorizar el micrófono para utilizar el reconocimiento.
        </div>
      )}

      {errorMsg && (
        <div className="mx-6 my-2 p-4 bg-amber-500/10 border border-amber-510 rounded-2xl text-xs text-amber-200">
          {errorMsg}
        </div>
      )}

      {/* Recording operations bar */}
      <div className="p-5 border-t border-white/25 dark:border-white/10 bg-white/10 dark:bg-black/20 flex flex-wrap items-center justify-between gap-4">
        <button
          id="clear-transcription-history-btn"
          onClick={handleClearHistory}
          disabled={transcriptionHistory.length === 0 && !currentText}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-xl transition disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer"
        >
          <Trash2 className="h-4 w-4" />
          <span>{t.btnClear}</span>
        </button>

        {/* Giant Red Microphone Activation Button */}
        <div className="relative">
          <button
            id="toggle-mic-btn"
            onClick={toggleListening}
            className={`relative flex items-center justify-center p-6 rounded-full transition-all outline-none focus:ring-4 focus:ring-white/20 cursor-pointer ${
              isListening
                ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.5)] border border-red-400/50'
                : 'bg-teal-600 hover:bg-teal-500 text-white shadow-[0_0_15px_rgba(13,148,136,0.3)] border border-teal-400/20'
            }`}
            title={isListening ? 'Stop' : 'Go'}
          >
            {isListening ? (
              <MicOff className="h-6 w-6" />
            ) : (
              <Mic className="h-6 w-6" />
            )}
            {isListening && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            )}
          </button>
        </div>

        <div className="flex items-center gap-2">
          {isListening ? (
            <div className="flex items-center gap-1 text-xs text-red-300 font-bold tracking-tight animate-pulse font-mono">
              <span className="h-2.5 w-2.5 rounded-full bg-red-550 animate-ping"></span>
              <span>{t.origen}</span>
            </div>
          ) : (
            <div className="text-xs text-white/70 font-semibold font-mono">
              {language === 'es' ? 'Listo' : 'Idle'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
