/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, RotateCcw, Volume2, Copy, Send, Trash2, ArrowUpDown } from 'lucide-react';
import { TranscriptionItem } from '../types';

interface SpeechToTextProps {
  onSendToAi?: (text: string) => void;
  transcriptionHistory: TranscriptionItem[];
  setTranscriptionHistory: React.Dispatch<React.SetStateAction<TranscriptionItem[]>>;
}

export default function SpeechToText({ onSendToAi, transcriptionHistory, setTranscriptionHistory }: SpeechToTextProps) {
  const [isListening, setIsListening] = useState(false);
  const [currentText, setCurrentText] = useState('');
  const [lang, setLang] = useState('es-ES');
  const [fontSize, setFontSize] = useState<number>(32); // Default large size 32px
  const [speaker, setSpeaker] = useState<'Oponente' | 'Yo'>('Oponente');
  const [supportSpeech, setSupportSpeech] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const endOfLogRef = useRef<HTMLDivElement>(null);

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
          setErrorMsg('Permiso de micrófono denegado. Por favor, habilítalo en la barra de direcciones.');
        } else if (event.error === 'no-speech') {
          // No-speech can be safely ignored, it will keep listening in continuous mode
        } else {
          setErrorMsg(`Error de dictado: ${event.error}`);
        }
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
      rec.start();
    } catch (e: any) {
      setErrorMsg(`No se pudo iniciar el servicio de dictado: ${e.message}`);
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
    <div id="speech-to-text-section" className="flex flex-col h-full bg-white/10 dark:bg-black/30 backdrop-blur-xl rounded-[32px] border border-white/25 dark:border-white/10 shadow-2xl overflow-hidden min-h-[500px] text-white">
      {/* Top action bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-5 border-b border-white/20 dark:border-white/10 bg-white/10 dark:bg-black/20">
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-xl p-1 border border-white/10">
            <button
              id="speaker-other-btn"
              onClick={() => setSpeaker('Oponente')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
                speaker === 'Oponente'
                  ? 'bg-white text-indigo-700 shadow-lg'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              Habla Oyente
            </button>
            <button
              id="speaker-me-btn"
              onClick={() => setSpeaker('Yo')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
                speaker === 'Yo'
                  ? 'bg-white text-indigo-700 shadow-lg'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              Hablo Yo
            </button>
          </div>

          <span className="text-[10px] uppercase tracking-wider text-white/50 font-mono hidden sm:inline">
            → Modo dictado
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Font Size controls */}
          <div className="flex items-center bg-white/10 dark:bg-black/20 rounded-xl overflow-hidden border border-white/20">
            <button
              id="decrease-font-btn"
              onClick={() => setFontSize(Math.max(16, fontSize - 4))}
              className="px-3.5 py-2 text-sm font-bold text-white hover:bg-white/10 font-mono transition"
              title="Disminuir tamaño de letra"
            >
              A-
            </button>
            <span className="px-2 w-12 text-center text-xs font-bold font-mono text-white/95 border-x border-white/20">
              {fontSize}px
            </span>
            <button
              id="increase-font-btn"
              onClick={() => setFontSize(Math.min(72, fontSize + 4))}
              className="px-3.5 py-2 text-sm font-bold text-white hover:bg-white/10 font-mono transition"
              title="Aumentar tamaño de letra"
            >
              A+
            </button>
          </div>

          {/* Language selection */}
          <select
            id="transcription-lang-select"
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="text-xs font-bold bg-white/15 dark:bg-black/30 text-white py-2 px-3 rounded-xl border border-white/20 focus:ring-1 focus:ring-white transition outline-none cursor-pointer"
          >
            <option value="es-ES" className="text-zinc-900">Español (ES)</option>
            <option value="es-MX" className="text-zinc-900">Español (MX)</option>
            <option value="es-AR" className="text-zinc-900">Español (AR)</option>
            <option value="en-US" className="text-zinc-900">English (US)</option>
            <option value="pt-BR" className="text-zinc-900">Portugués (BR)</option>
            <option value="fr-FR" className="text-zinc-900">Français (FR)</option>
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
            <p className="text-sm font-semibold text-white">Listo para transcribir</p>
            <p className="text-xs text-white/70 max-w-sm mt-2 leading-relaxed">
              Presione el botón redondo de abajo para grabar. El texto hablado aparecerá de inmediato en un tamaño de letra gigante ideal para lectura cómoda.
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
                : 'bg-indigo-600/40 border-white/30 rounded-br-none self-end text-right items-end text-white animate-fade-in'
            }`}
          >
            <div className="flex items-center gap-2 text-[10px] font-mono font-bold tracking-wider uppercase">
              <span className={item.speaker === 'Oponente' ? 'text-white/60' : 'text-white/75 font-semibold'}>
                {item.speaker === 'Oponente' ? 'Persona Sorda / Interlocutor' : 'Tú (Voz a Texto)'}
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
                className="p-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-xl transition border border-white/10"
                title="Copiar texto"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
              {onSendToAi && (
                <button
                  id={`ai-item-${item.id}`}
                  onClick={() => onSendToAi(item.text)}
                  className="p-2 text-indigo-100 hover:text-white bg-white/10 hover:bg-white/20 rounded-xl transition border border-white/10 flex items-center gap-1 text-xs font-bold"
                  title="Preguntar a la IA sobre esto"
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
                : 'bg-indigo-650/30 border-white/30 self-end text-right items-end text-white rounded-br-none'
            }`}
          >
            <div className="flex items-center gap-2 text-[10px] font-mono font-bold tracking-wider uppercase text-white/80">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-ping"></span>
              <span>🗣️ Transcribiendo en tiempo real...</span>
            </div>
            <p
              style={{ fontSize: `${fontSize}px`, lineHeight: '1.3' }}
              className="text-white font-sans font-medium tracking-tight text-left break-words"
            >
              {currentText}
            </p>
          </div>
        )}

        {/* Anchor point to auto-scroll */}
        <div ref={endOfLogRef} />
      </div>

      {/* Browser Speech Recognition Warning */}
      {!supportSpeech && (
        <div className="mx-6 my-2 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-xs text-red-200">
          Tu navegador o iframe actual no soporta el reconocimiento de voz nativo en esta pestaña. 
          Te recomendamos abrir la aplicación en una <strong>nueva pestaña</strong> o usar Chrome/Safari para la experiencia de dictado por voz. Podrás seguir agregando textos manualmente.
        </div>
      )}

      {errorMsg && (
        <div className="mx-6 my-2 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-xs text-amber-200">
          {errorMsg}
        </div>
      )}

      {/* Recording operations bar */}
      <div className="p-5 border-t border-white/25 dark:border-white/10 bg-white/10 dark:bg-black/20 flex flex-wrap items-center justify-between gap-4">
        <button
          id="clear-transcription-history-btn"
          onClick={handleClearHistory}
          disabled={transcriptionHistory.length === 0 && !currentText}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-xl transition disabled:opacity-40 disabled:hover:bg-transparent"
        >
          <Trash2 className="h-4 w-4" />
          <span>Borrar todo</span>
        </button>

        {/* Giant Red Microphone Activation Button */}
        <div className="relative">
          <button
            id="toggle-mic-btn"
            onClick={toggleListening}
            className={`relative flex items-center justify-center p-6 rounded-full transition-all outline-none focus:ring-4 focus:ring-white/20 ${
              isListening
                ? 'bg-red-550 hover:bg-red-600 text-white animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.5)] border border-red-400/50'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_15px_rgba(79,70,229,0.3)] border border-indigo-400/20'
            }`}
            title={isListening ? 'Detener dictado' : 'Iniciar dictado de voz'}
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
              <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-ping"></span>
              <span>ESCUCHANDO</span>
            </div>
          ) : (
            <div className="text-xs text-white/70 font-semibold font-mono">
              Listos para grabar
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
