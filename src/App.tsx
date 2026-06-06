/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  Mic, 
  Volume2, 
  BookOpen, 
  Palette, 
  Sparkles, 
  Sun, 
  Moon, 
  Accessibility, 
  Clock, 
  Heart,
  MessageSquareOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Import components
import SpeechToText from './components/SpeechToText';
import TextToSpeech from './components/TextToSpeech';
import QuickPhrases from './components/QuickPhrases';
import DrawingCanvas from './components/DrawingCanvas';
import AiAssistant from './components/AiAssistant';

// Types
import { TranscriptionItem } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'escuchar' | 'escribir' | 'frases' | 'pizarra' | 'ia'>('escuchar');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  
  // Shared state: Transcription logs are accessible by both Speech tab and AI helper tab
  const [transcriptionHistory, setTranscriptionHistory] = useState<TranscriptionItem[]>([]);
  
  // State for forwarding prompts from Speech tab directly into AI Chat
  const [prefilledAiPrompt, setPrefilledAiPrompt] = useState<string>('');

  // Loaded dark mode preference from local storage or system configuration
  useEffect(() => {
    const isDark = localStorage.getItem('sordcom_dark_mode') === 'true';
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const nextDark = !darkMode;
    setDarkMode(nextDark);
    localStorage.setItem('sordcom_dark_mode', String(nextDark));
    if (nextDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Callback to carry a phrase text to Escribir / Hablar tab and speak it
  const handleSelectPhrase = (text: string, flagSpeakImmediately = false) => {
    // Copy the text of the phrase to clipboard or speech synthesis
    // To make it dynamic, we can place a shared state or utilize SpeechSynthesis directly
    if (flagSpeakImmediately) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES';
        window.speechSynthesis.speak(utterance);
      }
    }
    
    // Add item to transcription history as 'Yo' responding
    const newItem: TranscriptionItem = {
      id: crypto.randomUUID(),
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      speaker: 'Yo'
    };
    setTranscriptionHistory(prev => [...prev, newItem]);
  };

  // Callback from transcription log to consult the AI about it
  const handleConsultAiAboutText = (text: string) => {
    // Navigate straight to IA tab and prepopulate inquiry
    setPrefilledAiPrompt(`Por favor, explícame de manera sencilla, corta o adaptada a lenguaje directo/visual el significado o el contexto de esta frase: "${text}"`);
    setActiveTab('ia');
  };

  const navTabs = [
    { id: 'escuchar', label: '🎙️ Transcriptor de Voz', desc: 'Convierte voz a texto gigante', color: 'border-amber-500' },
    { id: 'escribir', label: '🗣️ Escribir (Voz y Cartel)', desc: 'Escribe para reproducir audio', color: 'border-sky-500' },
    { id: 'frases', label: '👋 Atajos / Rutinas', desc: 'Biblioteca de frases recurrentes', color: 'border-teal-500' },
    { id: 'pizarra', label: '🖌️ Pizarra Táctil', desc: 'Dibujo o apuntes manuables', color: 'border-pink-500' },
    { id: 'ia', label: '✨ Asistente de IA', desc: 'Dudas de señas y resúmenes', color: 'border-indigo-500' },
  ] as const;

  return (
    <div id="master-app-root" className="min-h-screen bg-gradient-to-tr from-sky-400 via-indigo-400 to-purple-400 dark:from-zinc-950 dark:via-indigo-950/80 dark:to-purple-950 text-white font-sans transition-all duration-300 md:p-8 flex flex-col justify-start">
      
      {/* Outer Frosted Dashboard Card Container */}
      <div className="w-full max-w-7xl mx-auto bg-white/20 dark:bg-zinc-900/30 backdrop-blur-2xl rounded-none md:rounded-[40px] border-0 md:border border-white/30 dark:border-white/10 shadow-2xl flex flex-col flex-1 overflow-hidden">
        
        {/* Top Accessible Glass Banner & Title */}
        <header id="app-master-header" className="border-b border-white/20 dark:border-white/10 bg-white/10 dark:bg-black/10 backdrop-blur-md sticky top-0 z-40 transition-colors">
          <div className="px-6 py-5 flex items-center justify-between gap-4">
            
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-white flex items-center justify-center text-indigo-600 shadow-lg animate-pulse">
                <Accessibility className="h-5.5 w-5.5 stroke-[2.5]" />
              </div>
              
              <div className="text-left">
                <h1 className="text-base sm:text-2xl font-bold tracking-tight text-white font-sans">
                  Conectando Mundos
                </h1>
                <p className="text-[10px] sm:text-xs text-white/70 font-medium">
                  Asistente de accesibilidad auditiva e inclusión cara a cara
                </p>
              </div>
            </div>

            {/* Quick Access Actions */}
            <div className="flex items-center gap-2">
              {/* Quick Dark Mode Toggler */}
              <button
                id="theme-toggle-btn"
                onClick={toggleDarkMode}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 transition-all text-white"
                title={darkMode ? "Pasar a Modo Claro" : "Pasar a Modo Oscuro / Alto Contraste"}
              >
                {darkMode ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
              </button>
              
              <div className="hidden md:flex items-center gap-1.5 bg-white/10 border border-white/20 rounded-xl px-3 py-1.5 text-[11px] font-mono font-bold text-white/80 select-none">
                <Clock className="h-3.5 w-3.5 text-white/60" />
                <span>Hora local: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>

          </div>
        </header>

        {/* main glass-split board layout */}
        <main className="flex-1 p-4 md:p-8 flex flex-col md:flex-row gap-6 overflow-y-auto">
          
          {/* Sidebar Nav: Tabs */}
          <aside className="w-full md:w-80 flex-shrink-0 flex flex-col gap-4">
            
            {/* Header tab switcher */}
            <div className="bg-white/10 dark:bg-black/20 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-3xl p-5 shadow-lg text-left">
              <span className="text-[10px] font-extrabold text-white/60 uppercase tracking-widest font-mono block mb-4 pl-1">
                Servicios Disponibles
              </span>

              <nav id="sidebar-tab-navigation" className="flex flex-col gap-2">
                {navTabs.map((tab) => {
                  const isSelected = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      id={`sidebar-tab-button-${tab.id}`}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full text-left p-4 rounded-2xl transition-all duration-200 border-l-4 flex flex-col justify-start gap-1 select-none relative ${
                        isSelected
                          ? `bg-white text-indigo-700 border-white shadow-xl transform scale-[1.01] font-bold`
                          : `bg-white/10 border-transparent text-white/80 hover:bg-white/20 hover:text-white`
                      }`}
                    >
                      <span className="text-[14px]">
                        {tab.label}
                      </span>
                      <span className={`text-[10px] leading-normal font-sans ${isSelected ? 'text-indigo-600/80' : 'text-white/60'}`}>
                        {tab.desc}
                      </span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Accessible Health / Quick practices feedback box */}
            <div className="bg-indigo-600/30 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-3xl p-5 shadow-lg text-left">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5 mb-3 pl-0.5">
                <Heart className="h-4.5 w-4.5 text-red-300 fill-red-300" />
                Guía de Convivencia
              </h3>
              
              <ul className="text-xs text-white/90 space-y-2.5 list-none pl-0.5">
                <li className="leading-snug">
                  🤝 <strong>Atención visual:</strong> Asegura contacto visual directo antes de entablar el diálogo.
                </li>
                <li className="leading-snug">
                  👄 <strong>Labio-lectura:</strong> Vocaliza con ritmo calmado, sin exagerar ni gritar.
                </li>
                <li className="leading-snug">
                  👋 <strong>Mímica interactiva:</strong> Gesticula amigablemente con tus manos para aportar dinamismo.
                </li>
              </ul>
            </div>
          </aside>

          {/* Content Viewer viewport */}
          <section id="panel-content-area" className="flex-1 min-w-0 min-h-[500px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                {activeTab === 'escuchar' && (
                  <SpeechToText 
                    onSendToAi={handleConsultAiAboutText}
                    transcriptionHistory={transcriptionHistory}
                    setTranscriptionHistory={setTranscriptionHistory}
                  />
                )}

                {activeTab === 'escribir' && (
                  <TextToSpeech 
                    onAddHistoryItem={(text) => {
                      const newItem: TranscriptionItem = {
                        id: crypto.randomUUID(),
                        text: text,
                        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        speaker: 'Yo'
                      };
                      setTranscriptionHistory(prev => [...prev, newItem]);
                    }}
                  />
                )}

                {activeTab === 'frases' && (
                  <QuickPhrases 
                    onSelectPhrase={handleSelectPhrase} 
                  />
                )}

                {activeTab === 'pizarra' && (
                  <DrawingCanvas />
                )}

                {activeTab === 'ia' && (
                  <AiAssistant 
                    transcriptionHistory={transcriptionHistory}
                    prefilledPrompt={prefilledAiPrompt}
                    onClearPrefilledPrompt={() => setPrefilledAiPrompt('')}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </section>

        </main>

        {/* Humble Footer metadata */}
        <footer className="py-5 border-t border-white/20 dark:border-white/10 bg-white/5 text-center select-none text-[10px] text-white/55 font-mono">
          <div>
            Conectando Mundos • Diseñado bajo principios de inclusión social y adaptabilidad universal.
          </div>
        </footer>

      </div>
    </div>
  );
}
