/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Volume2, VolumeX, Maximize2, Minimize2, Trash2, Play, AlertCircle } from 'lucide-react';
import { AppLanguage, VoiceGender, translations } from '../translations';

interface TextToSpeechProps {
  onAddHistoryItem?: (text: string) => void;
  language: AppLanguage;
  voiceGender: VoiceGender;
}

export default function TextToSpeech({ onAddHistoryItem, language, voiceGender }: TextToSpeechProps) {
  const [text, setText] = useState('');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>('');
  const [rate, setRate] = useState<number>(1.0);
  const [pitch, setPitch] = useState<number>(1.0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // Fullscreen billboard mode state
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [billboardFontSize, setBillboardFontSize] = useState<number>(64);

  const t = translations[language];

  // Scoring helper to rank voices based on language and gender target
  const scoreVoice = (v: SpeechSynthesisVoice, lang: AppLanguage, gender: VoiceGender): number => {
    let score = 0;
    const lowerName = v.name.toLowerCase();
    
    // Exact language match is crucial
    if (v.lang.toLowerCase().startsWith(lang.toLowerCase())) {
      score += 100;
    } else if (v.lang.toLowerCase().includes(lang.toLowerCase())) {
      score += 50;
    } else {
      return -1; // Ignore voices of different languages if possible
    }

    const maleKeywords = [
      'male', 'masculino', 'hombre', 'chico', 'david', 'james', 'richard', 'mark', 'george', 'pablo', 'juan', 'alex', 'daniel', 'tom', 'kyle', 'oliver', 'ms-m', 'minsu', 'ichiro', 'haruto', 'shinji', 'pavel', 'gorgio', 'paco', 'carlos', 'miguel', 'enrique', 'luis', 'pedro', 'gregorio', 'ignacio', 'roberto', 'mateo', 'diego', 'alejandro', 'jorge', 'manuel', 'jose', 'steve', 'guy', 'michael', 'ravi', 'minho', 'seung', 'jun', 'kenji', 'takashi', 'daiki', 'yuto', 'arthur', 'robert', 'william', 'charles', 'stefan', 'peter', 'andrew'
    ];
    const femaleKeywords = [
      'female', 'femenino', 'femenina', 'mujer', 'chica', 'zira', 'hazel', 'susan', 'heera', 'haruka', 'ayumi', 'kyoko', 'yuri', 'siri', 'samantha', 'karen', 'moira', 'tessa', 'veena', 'fiona', 'yuna', 'hyejin', 'mei', 'nanami', 'shizuka', 'sabina', 'helena', 'elena', 'lucia', 'monica', 'sandra', 'paulina', 'carmen', 'soledad', 'rosa', 'juana', 'victoria', 'eva', 'conchita', 'lola', 'marisol', 'maria', 'ana', 'clara', 'beatriz', 'isabel', 'gabriela', 'sofia', 'teresa', 'heather', 'joanna', 'lisa', 'amy', 'emma', 'vicki', 'chika', 'yuki', 'mio', 'rin', 'sakura', 'hina', 'aoi', 'haru', 'yoko', 'naoko', 'kumiko', 'michelle', 'amanda', 'emily', 'jessica', 'sarah', 'daria', 'linda', 'sabreena', 'alicia'
    ];

    if (gender === 'male') {
      const isMale = maleKeywords.some(keyword => lowerName.includes(keyword));
      if (isMale) score += 50;
      const isFemale = femaleKeywords.some(keyword => lowerName.includes(keyword));
      if (isFemale) score -= 50;
    } else {
      const isFemale = femaleKeywords.some(keyword => lowerName.includes(keyword));
      if (isFemale) score += 50;
      const isMale = maleKeywords.some(keyword => lowerName.includes(keyword));
      if (isMale) score -= 50;
    }

    // Google natural/high quality voices are preferred
    if (lowerName.includes('google') || lowerName.includes('natural')) {
      score += 5;
    }

    return score;
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const updateVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        
        // Filter and sort based on scoring for the current configuration
        const filtered = availableVoices
          .map(v => ({ voice: v, score: scoreVoice(v, language, voiceGender) }))
          .filter(item => item.score >= 0)
          .sort((a, b) => b.score - a.score)
          .map(item => item.voice);

        setVoices(filtered.length > 0 ? filtered : availableVoices);
        
        // Auto-select optimal voice that scored highest
        if (filtered.length > 0) {
          setSelectedVoiceName(filtered[0].name);
        } else if (availableVoices.length > 0) {
          setSelectedVoiceName(availableVoices[0].name);
        }
      };

      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, [language, voiceGender]);

  const handleSpeak = () => {
    if (!text.trim()) return;

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      
      const foundVoice = window.speechSynthesis.getVoices().find(v => v.name === selectedVoiceName);
      if (foundVoice) {
        utterance.voice = foundVoice;
      }
      
      utterance.rate = rate;
      utterance.pitch = pitch;

      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        if (onAddHistoryItem) {
          onAddHistoryItem(text);
        }
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    }
  };

  const handleStop = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const clearText = () => {
    setText('');
    handleStop();
  };

  const handleQuickAdd = (word: string) => {
    setText(prev => (prev ? `${prev} ${word}`.trim() : word));
  };

  return (
    <div id="text-to-speech-section" className="flex flex-col bg-white/10 dark:bg-black/30 backdrop-blur-xl border border-white/25 dark:border-white/10 rounded-[32px] p-6 shadow-2xl min-h-[480px] text-white animate-fade-in">
      <div className="flex items-center justify-between border-b border-white/15 pb-4 mb-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Volume2 className="h-5 w-5 text-teal-200" />
            {t.tabEscribir}
          </h2>
          <p className="text-xs text-white/70 mt-1">
            {t.tabEscribirDesc}
          </p>
        </div>
        
        {/* Billboard / Fullscreen Button */}
        <button
          id="billboard-activate-btn"
          onClick={() => setIsFullscreen(true)}
          className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-4 py-2 border border-white/15 rounded-xl text-xs font-bold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:hover:scale-100 cursor-pointer"
          title={t.billboardTitle}
          disabled={!text.trim()}
        >
          <Maximize2 className="h-4 w-4" />
          <span>{t.btnGiant}</span>
        </button>
      </div>

      {/* Main input layout */}
      <div className="flex-1 flex flex-col space-y-4">
        {/* Word helpers toolbar */}
        <div className="flex flex-wrap gap-1.5 bg-white/5 dark:bg-black/15 p-3 rounded-2xl border border-white/10">
          <span className="text-[10px] w-full text-white/50 font-bold uppercase tracking-wider mb-1.5 font-mono">
            {t.presetsLabel}
          </span>
          {t.presets.map((preset, idx) => (
            <button
              key={idx}
              id={`preset-word-${idx}`}
              onClick={() => handleQuickAdd(preset)}
              className="px-3 py-1.5 text-xs font-bold bg-white/10 dark:bg-black/20 border border-white/15 text-white rounded-xl hover:border-white/35 hover:bg-white/20 active:scale-95 transition-all cursor-pointer"
            >
              {preset}
            </button>
          ))}
        </div>

        {/* Big textbox */}
        <div className="relative flex-1 flex flex-col min-h-[150px]">
          <textarea
            id="tts-text-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t.placeholderTts}
            className="flex-1 w-full bg-white/5 dark:bg-black/30 border border-white/15 p-4 rounded-2xl text-white placeholder-white/40 font-sans font-medium text-lg leading-relaxed focus:ring-1 focus:ring-white outline-none resize-none transition"
          />

          {text && (
            <div className="absolute bottom-3 right-3 flex items-center gap-1">
              <button
                id="clear-tts-text-btn"
                onClick={clearText}
                className="p-2 text-white/60 hover:text-white bg-red-500/20 hover:bg-red-500/35 rounded-xl transition border border-red-500/10 cursor-pointer"
                title={t.btnClear}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Audio settings drawer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/10 dark:bg-black/20 p-4 rounded-2xl border border-white/10">
          {/* Voices select */}
          <div className="flex flex-col space-y-1.5">
            <label htmlFor="tts-voice-select" className="text-xs font-bold text-white/60 uppercase tracking-wider font-mono">
              Voz de reproducción ({voices.length} disponibles):
            </label>
            <select
              id="tts-voice-select"
              value={selectedVoiceName}
              onChange={(e) => setSelectedVoiceName(e.target.value)}
              className="text-xs font-bold bg-zinc-950 text-white py-2.5 px-3 rounded-xl border border-white/15 outline-none focus:ring-1 focus:ring-white cursor-pointer"
            >
              {voices.length === 0 ? (
                <option className="text-zinc-900">Cargando voces del sistema...</option>
              ) : (
                voices.map((v) => (
                  <option key={v.name} value={v.name} className="text-white bg-zinc-950">
                    {v.name} ({v.lang})
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Speed slider */}
            <div className="flex flex-col space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-white/60 uppercase tracking-wider font-mono">Velocidad:</span>
                <span className="text-xs font-bold font-mono text-white">{rate.toFixed(1)}x</span>
              </div>
              <input
                id="tts-rate-slider"
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={rate}
                onChange={(e) => setRate(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-white/15 rounded-lg appearance-none cursor-pointer accent-white"
              />
            </div>

            {/* Pitch slider */}
            <div className="flex flex-col space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-white/60 uppercase tracking-wider font-mono">Tono:</span>
                <span className="text-xs font-bold font-mono text-white">{pitch.toFixed(1)}</span>
              </div>
              <input
                id="tts-pitch-slider"
                type="range"
                min="0.5"
                max="1.5"
                step="0.1"
                value={pitch}
                onChange={(e) => setPitch(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-white/15 rounded-lg appearance-none cursor-pointer accent-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main trigger button section */}
      <div className="mt-5 pt-4 border-t border-white/15 flex gap-3">
        {isSpeaking ? (
          <button
            id="tts-stop-speak-btn"
            onClick={handleStop}
            className="flex-1 bg-red-650 hover:bg-red-650 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg hover:scale-[1.01] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <VolumeX className="h-5 w-5" />
            <span>{t.btnStop}</span>
          </button>
        ) : (
          <button
            id="tts-start-speak-btn"
            disabled={!text.trim()}
            onClick={handleSpeak}
            className="flex-1 bg-teal-600 hover:bg-teal-500 disabled:opacity-40 disabled:hover:scale-100 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="h-5 w-5" />
            <span>{t.btnSpeak}</span>
          </button>
        )}
      </div>

      {/* Billboard Overlay / Fullscreen mode */}
      {isFullscreen && (
        <div 
          id="billboard-overlay" 
          className="fixed inset-0 bg-zinc-950/95 backdrop-blur-2xl text-white z-50 flex flex-col p-6 overflow-hidden md:p-10 select-none animate-fade-in"
        >
          {/* Header controls inside Billboard */}
          <div className="flex items-center justify-between border-b border-white/15 pb-4 mb-4 flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse"></span>
              <span className="text-xs font-bold text-white/80 uppercase tracking-widest font-mono">{t.billboardTitle}</span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Font Size controls */}
              <div className="flex items-center bg-white/5 border border-white/15 rounded-xl overflow-hidden p-0.5">
                <button
                  id="billboard-font-dec"
                  onClick={() => setBillboardFontSize(Math.max(24, billboardFontSize - 8))}
                  className="px-4 py-2 hover:bg-white/10 font-bold font-mono transition cursor-pointer"
                  title="reducir texto"
                >
                  -
                </button>
                <span className="px-3 text-xs font-bold font-mono text-white/90">
                  {billboardFontSize}px
                </span>
                <button
                  id="billboard-font-inc"
                  onClick={() => setBillboardFontSize(Math.min(140, billboardFontSize + 8))}
                  className="px-4 py-2 hover:bg-white/10 font-bold font-mono transition cursor-pointer"
                  title="agrandar texto"
                >
                  +
                </button>
              </div>

              {/* Speak on billboard */}
              <button
                id="billboard-speak-btn"
                onClick={handleSpeak}
                className="p-3 bg-white/10 hover:bg-white/20 border border-white/15 text-white rounded-xl transition cursor-pointer"
                title={t.btnSpeak}
              >
                <Volume2 className="h-5 w-5" />
              </button>

              {/* Close billboard button */}
              <button
                id="billboard-close-btn"
                onClick={() => setIsFullscreen(false)}
                className="flex items-center gap-1.5 bg-red-550 hover:bg-red-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer"
              >
                <Minimize2 className="h-4 w-4" />
                <span>{t.btnClear}</span>
              </button>
            </div>
          </div>

          {/* Large text display box centered */}
          <div className="flex-1 flex items-center justify-center overflow-y-auto p-4 select-text">
            <p
              style={{ fontSize: `${billboardFontSize}px`, lineHeight: '1.2' }}
              className="w-full text-center text-amber-300 dark:text-amber-200 tracking-tight font-black font-sans break-words whitespace-pre-wrap selection:bg-teal-600 selection:text-white"
            >
              {text}
            </p>
          </div>

          {/* Interactive hints at the bottom */}
          <div className="flex-shrink-0 text-center text-[10px] text-white/50 font-mono border-t border-white/10 pt-4">
            {t.billboardHelp}
          </div>
        </div>
      )}
    </div>
  );
}
