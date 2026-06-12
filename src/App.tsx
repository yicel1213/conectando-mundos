/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  Volume2, 
  Sparkles, 
  Sun, 
  Moon, 
  Accessibility, 
  Clock, 
  Heart,
  Home,
  MapPin,
  FileText,
  RefreshCw,
  Sliders,
  Settings,
  Menu,
  Maximize2,
  Minimize2,
  X,
  Languages,
  BookOpen,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Import subcomponents
import SpeechToText from './components/SpeechToText';
import TextToSpeech from './components/TextToSpeech';
import QuickPhrases from './components/QuickPhrases';
import DrawingCanvas from './components/DrawingCanvas';
import AiAssistant from './components/AiAssistant';

// Types and translations
import { TranscriptionItem } from './types';
import { AppLanguage, VoiceGender, translations } from './translations';

export default function App() {
  const [activeTab, setActiveTab] = useState<'escuchar' | 'escribir' | 'frases' | 'pizarra' | 'ia' | 'config'>('escuchar');
  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(true); // Default to a gorgeous warm dark mode matching the image
  const [selectedLanguage, setSelectedLanguage] = useState<AppLanguage>('es');
  const [selectedVoiceGender, setSelectedVoiceGender] = useState<VoiceGender>('female');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false); // Hamburger guide menu
  const [currentTime, setCurrentTime] = useState<string>('');

  // Shared state: Transcription logs are accessible by both Speech tab and AI helper tab
  const [transcriptionHistory, setTranscriptionHistory] = useState<TranscriptionItem[]>([]);
  
  // State for forwarding prompts from Speech tab directly into AI Chat
  const [prefilledAiPrompt, setPrefilledAiPrompt] = useState<string>('');

  // Time dynamic clock
  useEffect(() => {
    const updateClock = () => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Loaded dark mode preference and general settings from local storage
  useEffect(() => {
    const savedTheme = localStorage.getItem('sordcom_dark_mode');
    const isDark = savedTheme === null ? true : savedTheme === 'true'; // Default true for dark warm photography
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    const savedLang = localStorage.getItem('conectando_mundos_language') as AppLanguage;
    if (savedLang && ['es', 'en', 'ko', 'ja'].includes(savedLang)) {
      setSelectedLanguage(savedLang);
    }

    const savedGender = localStorage.getItem('conectando_mundos_voice_gender') as VoiceGender;
    if (savedGender && ['male', 'female'].includes(savedGender)) {
      setSelectedVoiceGender(savedGender);
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

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Callback to carry a phrase text to Escribir / Hablar tab and speak it
  const handleSelectPhrase = (text: string, flagSpeakImmediately = false) => {
    if (flagSpeakImmediately) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        
        if (selectedLanguage === 'es') utterance.lang = 'es-ES';
        else if (selectedLanguage === 'en') utterance.lang = 'en-US';
        else if (selectedLanguage === 'ko') utterance.lang = 'ko-KR';
        else if (selectedLanguage === 'ja') utterance.lang = 'ja-JP';

        const voices = window.speechSynthesis.getVoices();
        const scoreVoice = (voice: SpeechSynthesisVoice) => {
          let score = 0;
          const name = voice.name.toLowerCase();
          const langCode = voice.lang.toLowerCase();

          if (selectedLanguage === 'es' && (langCode.startsWith('es') || langCode.includes('spa'))) score += 100;
          if (selectedLanguage === 'en' && (langCode.startsWith('en') || langCode.includes('eng'))) score += 100;
          if (selectedLanguage === 'ko' && (langCode.startsWith('ko') || langCode.includes('kor'))) score += 100;
          if (selectedLanguage === 'ja' && (langCode.startsWith('ja') || langCode.includes('jp'))) score += 100;

          const femaleNames = [
            'female', 'femenino', 'femenina', 'mujer', 'chica', 'zira', 'hazel', 'susan', 'heera', 'haruka', 'ayumi', 'kyoko', 'yuri', 'siri', 'samantha', 'karen', 'moira', 'tessa', 'veena', 'fiona', 'yuna', 'hyejin', 'mei', 'nanami', 'shizuka', 'sabina', 'helena', 'elena', 'lucia', 'monica', 'sandra', 'paulina', 'carmen', 'soledad', 'rosa', 'juana', 'victoria', 'eva', 'conchita', 'lola', 'marisol', 'maria', 'ana', 'clara', 'beatriz', 'isabel', 'gabriela', 'sofia', 'teresa', 'heather', 'joanna', 'lisa', 'amy', 'emma', 'vicki', 'chika', 'yuki', 'mio', 'rin', 'sakura', 'hina', 'aoi', 'haru', 'yoko', 'naoko', 'kumiko', 'michelle', 'amanda', 'emily', 'jessica', 'sarah', 'daria', 'linda', 'sabreena', 'alicia'
          ];
          const maleNames = [
            'male', 'masculino', 'hombre', 'chico', 'david', 'james', 'richard', 'mark', 'george', 'pablo', 'juan', 'alex', 'daniel', 'tom', 'kyle', 'oliver', 'ms-m', 'minsu', 'ichiro', 'haruto', 'shinji', 'pavel', 'gorgio', 'paco', 'carlos', 'miguel', 'enrique', 'luis', 'pedro', 'gregorio', 'ignacio', 'roberto', 'mateo', 'diego', 'alejandro', 'jorge', 'manuel', 'jose', 'steve', 'guy', 'michael', 'ravi', 'minho', 'seung', 'jun', 'kenji', 'takashi', 'daiki', 'yuto', 'arthur', 'robert', 'william', 'charles', 'stefan', 'peter', 'andrew'
          ];

          const isFemaleKeyword = femaleNames.some(k => name.includes(k));
          const isMaleKeyword = maleNames.some(k => name.includes(k));
          
          if (selectedVoiceGender === 'female') {
            if (isFemaleKeyword) score += 50;
            if (isMaleKeyword) score -= 50;
          } else {
            if (isMaleKeyword) score += 50;
            if (isFemaleKeyword) score -= 50;
          }
          return score;
        };

        const sortedVoices = [...voices].sort((a, b) => scoreVoice(b) - scoreVoice(a));
        if (sortedVoices.length > 0 && scoreVoice(sortedVoices[0]) > 20) {
          utterance.voice = sortedVoices[0];
        }

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
    const defaultPrefix = selectedLanguage === 'es' 
      ? 'Por favor, explícame de manera sencilla, corta o adaptada a lenguaje directo/visual el significado o el contexto de esta frase:' 
      : 'Explain in a friendly, simplified manner the context or meaning of:';
    setPrefilledAiPrompt(`${defaultPrefix} "${text}"`);
    setActiveTab('ia');
    setIsPanelOpen(true);
  };

  const t = translations[selectedLanguage] || translations.es;

  // Localized date formatting matching Jum'at, 22 Mei 2020 format
  const getFormattedLocalDate = () => {
    const days: Record<AppLanguage, string[]> = {
      es: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
      en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      ja: ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'],
      ko: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
    };
    const months: Record<AppLanguage, string[]> = {
      es: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      ja: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      ko: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
    };
    const now = new Date();
    const dayName = days[selectedLanguage][now.getDay()];
    const day = now.getDate();
    const month = months[selectedLanguage][now.getMonth()];
    const year = now.getFullYear();

    if (selectedLanguage === 'ko' || selectedLanguage === 'ja') {
      return `${year}年 ${month} ${day}日 (${dayName.charAt(0)})`;
    }
    return `${dayName} ${day} ${month} ${year}`;
  };

  // Interactive buttons mapping list mimicking the visual stagger curve
  const menuCircles = [
    { id: 'escuchar', label: t.tabVoz, icon: RefreshCw, staggerClass: 'translate-x-[20px] md:translate-x-[80px]' }, // FEEDBACK
    { id: 'escribir', label: t.tabEscribir, icon: Home, staggerClass: 'translate-x-[-15px] md:translate-x-[10px]' }, // HOME
    { id: 'frases', label: t.tabAtajos, icon: MapPin, staggerClass: 'translate-x-[35px] md:translate-x-[110px]' }, // LOCATION
    { id: 'pizarra', label: t.tabPizarra, icon: FileText, staggerClass: 'translate-x-[10px] md:translate-x-[70px]' }, // FILE
    { id: 'ia', label: t.tabIa, icon: Sparkles, staggerClass: 'translate-x-[-5px] md:translate-x-[30px]' }, // DRINKFOOD
    { id: 'config', label: t.tabConfig, icon: Sliders, staggerClass: 'translate-x-[-35px] md:translate-x-[-10px]' }, // MUSIC
  ] as const;

  return (
    <div 
      id="master-app-root" 
      className={`min-h-screen relative flex flex-col justify-between overflow-hidden select-none font-sans transition-all duration-500 ${
        darkMode 
          ? 'bg-gradient-to-tr from-[#021108] via-[#042d18] to-[#011409] text-[#e8f7ed]' 
          : 'bg-gradient-to-tr from-[#fff0f3] via-[#fffae6] to-[#e0f2fe] text-[#0f172a]'
      }`}
    >
      {/* Immersive Photo-like Cozy Coffee Background Overlay Grains */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Glowing warm pink/amber ambiance ball on left */}
        <div className={`absolute top-[10%] -left-[10%] w-[500px] h-[500px] rounded-full blur-[140px] opacity-45 mix-blend-screen transition-all duration-1000 ${
          darkMode ? 'bg-emerald-600/35' : 'bg-rose-400/40'
        }`} />
        
        {/* Spotlight warm cheerful glow in the middle */}
        <div className={`absolute bottom-[15%] left-[25%] w-[400px] h-[400px] rounded-full blur-[120px] opacity-40 mix-blend-screen transition-all duration-1000 ${
          darkMode ? 'bg-green-500/25' : 'bg-amber-300/40'
        }`} />

        {/* Happy balance glow right */}
        <div className={`absolute top-[40%] -right-[15%] w-[600px] h-[600px] rounded-full blur-[150px] opacity-30 transition-all duration-1000 ${
          darkMode ? 'bg-[#0f172a]/60' : 'bg-sky-350/45'
        }`} />
        
        {/* Subtle photo noise filter */}
        <div className="absolute inset-0 bg-repeat opacity-[0.015] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
      </div>

      {/* Top Main Navigation Header */}
      <header id="custom-photo-header" className="relative z-30 px-6 py-5 flex items-center justify-between w-full max-w-7xl mx-auto">
        <button
          id="hamburger-btn"
          onClick={() => setIsDrawerOpen(true)}
          className={`p-3 rounded-full border transition-all cursor-pointer backdrop-blur-md flex items-center justify-center ${
            darkMode 
              ? 'border-[#10b981]/20 bg-[#10b981]/10 text-[#10b981] hover:bg-[#10b981]/20' 
              : 'border-[#f472b6]/30 bg-white hover:bg-pink-50 text-[#db2777] shadow-sm'
          }`}
          title="Manual Guide"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* App Title in header for screen accessibility, hidden on lock screen context */}
        {isPanelOpen && (
          <div className="text-center animate-fade-in hidden sm:block">
            <h1 className={`text-sm font-black tracking-widest uppercase ${darkMode ? 'text-[#10b981]' : 'text-[#db2777]'}`}>{t.title}</h1>
            <p className={`text-[10px] uppercase font-mono tracking-wider opacity-75 ${darkMode ? 'text-[#e2f5e9]' : 'text-slate-600'}`}>{t.subtitle}</p>
          </div>
        )}

        <div className="flex items-center gap-2">
          {/* Active indicator clock badge */}
          <div className={`hidden md:flex items-center gap-1.5 border rounded-full px-3 py-1 text-[11px] font-mono font-bold select-none ${
            darkMode ? 'bg-emerald-950/40 border-[#10b981]/20 text-[#10b981]' : 'bg-pink-50 border-pink-200 text-[#db2777]'
          }`}>
            <Clock className="h-3.5 w-3.5 opacity-70" />
            <span>{currentTime}</span>
          </div>

          <button
            id="header-theme-toggle"
            onClick={toggleDarkMode}
            className={`p-3 rounded-full border transition-all cursor-pointer backdrop-blur-md flex items-center justify-center ${
              darkMode 
                ? 'border-[#10b981]/20 bg-[#10b981]/10 hover:bg-[#10b981]/20 text-[#10b981]' 
                : 'border-[#f472b6]/30 bg-white hover:bg-pink-50 text-[#ea580c] shadow-sm animate-bounce-subtle'
            }`}
            title={darkMode ? "Claro" : "Oscuro"}
          >
            {darkMode ? <Sun className="h-5 w-5 animate-spin-slow" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Main Structural Body Viewport */}
      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center w-full min-h-[500px]">
          
          {/* LEFT AREA: ROTI SUSU / CONECTANDO MUNDOS Lockscreen Curved Emblem Card */}
          <section className="lg:col-span-5 flex justify-start items-center relative py-6">
            <div id="lockscreen-left-emblem" className={`relative rounded-[40px] md:rounded-[60px] border p-12 w-full max-w-md backdrop-blur-xl shadow-2xl overflow-hidden text-left flex flex-col justify-between min-h-[380px] transition-all duration-300 ${
              darkMode 
                ? 'bg-[#062414]/80 border-[#10b981]/30 text-[#e2f5e9] shadow-[0_0_50px_-12px_rgba(16,185,129,0.15)]' 
                : 'bg-gradient-to-br from-yellow-100/90 via-pink-50/95 to-sky-100/95 border-pink-200 text-sky-950 shadow-xl shadow-pink-100'
            }`}>
              {/* Internal absolute subtle backing graphic for visual aesthetic */}
              <div className={`absolute -bottom-10 -right-10 w-44 h-44 rounded-full pointer-events-none ${
                darkMode ? 'bg-[#10b981]/15' : 'bg-rose-300/20'
              }`} />

              <div>
                {/* Small tracking tag */}
                <span className={`text-[11px] font-black uppercase tracking-[0.25em] block mb-2 opacity-70 font-mono`}>
                  {t.activeStatus}
                </span>

                {/* Big main headline resembling ROTI SUSU */}
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-none mb-4 font-sans uppercase">
                  {isPanelOpen ? menuCircles.find(c => c.id === activeTab)?.label : t.title}
                </h2>

                {/* Separation line */}
                <div className={`w-full h-[1.5px] mb-4 ${darkMode ? 'bg-white/20' : 'bg-black/20'}`} />

                {/* Localized Date text */}
                <p className="text-sm font-semibold opacity-80 mb-2">
                  {getFormattedLocalDate()}
                </p>
                
                {/* Active Interactive Sublabel */}
                <p className={`text-xs font-mono tracking-widest opacity-60 flex items-center gap-1.5`}>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                  {t.origen} • CONNECTED
                </p>
              </div>

              {/* Weather indicators + Sun / Micro states at the bottom */}
              <div className="flex items-end justify-between mt-8">
                <div className="flex items-center gap-2">
                  <div className="text-4xl font-extrabold font-mono tracking-tighter relative flex">
                    31<span className="text-lg font-light leading-none absolute -top-1 -right-4">°C</span>
                  </div>
                  <div className="ml-5">
                    <Sun className="h-7 w-7 text-amber-300 animate-pulse" />
                    <span className="text-[9px] uppercase font-mono block opacity-60">WEATHER NORMAL</span>
                  </div>
                </div>

                {isPanelOpen && (
                  <button
                    onClick={() => setIsPanelOpen(false)}
                    className="px-4 py-2 text-xs font-black uppercase tracking-wider rounded-xl bg-amber-500 hover:bg-amber-600 transition text-black cursor-pointer shadow-lg active:scale-95 flex items-center gap-1"
                  >
                    <span>MÚNICH</span>
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          </section>

          {/* CENTRE / RIGHT AREA: The Curved Dynamic Dial Column or Responsive Open Content Workspace */}
          <section className="lg:col-span-7 flex flex-col justify-center relative w-full h-full min-h-[460px]">
            <AnimatePresence mode="wait">
              {!isPanelOpen ? (
                /* SCREEN 1: Launcher Menu list staggered in a gorgeous diagonal wave */
                <motion.div
                  key="launcher-menu"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="flex flex-col gap-4 py-6 w-full max-w-lg mx-auto"
                >
                  <span className={`text-[10px] font-black tracking-[0.3em] font-mono block mb-2 uppercase opacity-60 text-left pl-4`}>
                    {t.navTabsLabel}
                  </span>

                  <div className="flex flex-col gap-3">
                    {menuCircles.map((circle, i) => {
                      const IconComponent = circle.icon;
                      return (
                        <button
                          key={circle.id}
                          onClick={() => {
                            setActiveTab(circle.id);
                            setIsPanelOpen(true);
                          }}
                          className={`flex items-center pr-6 py-2.5 rounded-full border transition-all duration-300 cursor-pointer text-left select-none group w-full max-w-[320px] ${circle.staggerClass} ${
                            darkMode 
                              ? 'border-[#10b981]/20 bg-[#041d0f]/80 hover:bg-[#10b981] hover:text-black hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-900/10' 
                              : 'border-[#fef08a] bg-[#fffdf5]/95 hover:bg-gradient-to-r hover:from-yellow-250 hover:to-pink-100/90 hover:border-[#f472b6] hover:shadow-xl hover:shadow-pink-150/10'
                          }`}
                        >
                          {/* Round Floating Icon Container */}
                          <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shrink-0 border ${
                            darkMode
                              ? 'bg-emerald-950/80 border-[#10b981]/35 text-[#10b981] group-hover:bg-black group-hover:border-black group-hover:text-[#10b981]'
                              : 'bg-[#fff5f5] border-pink-100 text-[#db2777] group-hover:bg-pink-500 group-hover:border-pink-400 group-hover:text-white'
                          }`}>
                            <IconComponent className="h-5 w-5 stroke-[1.5]" />
                          </div>

                          {/* Category text key names */}
                          <div className="pl-4">
                            <span className={`text-xs font-black tracking-widest uppercase block transition-colors ${
                              darkMode ? 'text-[#e2f5e9] group-hover:text-black' : 'text-[#0f172a]'
                            }`}>
                              {circle.label}
                            </span>
                            <span className={`text-[10px] block truncate max-w-[170px] ${
                              darkMode ? 'opacity-60 group-hover:text-black/75' : 'opacity-70 text-slate-500'
                            }`}>
                              {selectedLanguage === 'es' ? 'ABRIR SERVICIO' : 'OPEN MODULE'}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              ) : (
                /* SCREEN 2: Translucent Workspace active screen */
                <motion.div
                  key="active-panel"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full flex flex-col relative"
                >
                  {/* Top quick navigation selector so the navigation wave is still interactable instantly on desktop */}
                  <div className="hidden lg:flex items-center gap-1.5 mb-3 select-none flex-wrap">
                    {menuCircles.map((circle) => {
                      const isSelected = activeTab === circle.id;
                      return (
                        <button
                          key={circle.id}
                          onClick={() => setActiveTab(circle.id)}
                          className={`px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase transition-all duration-200 border cursor-pointer ${
                            isSelected
                              ? darkMode
                                ? 'bg-[#10b981] border-[#10b981] text-black shadow-md'
                                : 'bg-gradient-to-r from-pink-500 to-amber-500 border-transparent text-white shadow-md scale-105 font-extrabold'
                              : darkMode
                                ? 'bg-[#031d0f]/60 border-[#10b981]/20 text-[#10b981] hover:bg-[#10b981]/20 hover:text-white'
                                : 'bg-white border-pink-100 text-[#db2777] hover:bg-pink-50 hover:border-pink-300'
                          }`}
                        >
                          {circle.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Translucent Frosted Glass container */}
                  <div className={`p-4 md:p-6 rounded-[32px] border shadow-2xl flex flex-col flex-1 min-h-[460px] relative ${
                    darkMode
                      ? 'bg-[#031c0e]/90 border-[#10b981]/25 text-[#e2f5e9]'
                      : 'bg-white/90 border-pink-200/50 text-[#0f172a] shadow-xl shadow-pink-100/30'
                  }`}>
                    {/* Header bar and Close button */}
                    <div className={`flex items-center justify-between mb-4 pb-3 border-b shrink-0 ${
                      darkMode ? 'border-emerald-500/20' : 'border-pink-100'
                    }`}>
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${
                          darkMode ? 'bg-[#10b981]' : 'bg-[#db2777]'
                        }`} />
                        <h3 className={`text-xs font-black tracking-widest uppercase ${
                          darkMode ? 'text-[#10b981]/80' : 'text-[#db2777]/80'
                        }`}>
                          {menuCircles.find(c => c.id === activeTab)?.label}
                        </h3>
                      </div>

                      <button
                        onClick={() => setIsPanelOpen(false)}
                        className={`p-2 rounded-xl transition text-xs font-bold font-mono tracking-widest uppercase cursor-pointer flex items-center gap-1.5 ${
                          darkMode 
                            ? 'bg-emerald-950/80 hover:bg-[#10b981] hover:text-black border border-[#10b981]/25' 
                            : 'bg-pink-50 hover:bg-gradient-to-r hover:from-pink-500 hover:to-amber-500 hover:text-white text-[#db2777] border border-pink-100 hover:border-transparent'
                        }`}
                        title="Close Workspace"
                      >
                        <span>{selectedLanguage === 'es' ? 'Atrás' : 'Back'}</span>
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Active container content viewport */}
                    <div className="flex-1 min-h-0 overflow-y-auto">
                      {activeTab === 'escuchar' && (
                        <SpeechToText 
                          onSendToAi={handleConsultAiAboutText}
                          transcriptionHistory={transcriptionHistory}
                          setTranscriptionHistory={setTranscriptionHistory}
                          language={selectedLanguage}
                        />
                      )}

                      {activeTab === 'escribir' && (
                        <TextToSpeech 
                          language={selectedLanguage}
                          voiceGender={selectedVoiceGender}
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
                          language={selectedLanguage}
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
                          language={selectedLanguage}
                        />
                      )}

                      {activeTab === 'config' && (
                        <div id="settings-environment-panel" className="text-left py-2">
                          <h4 className="text-sm font-black tracking-widest uppercase mb-4 opacity-80">
                            ⚙️ {t.configTitle}
                          </h4>
                          <p className="text-xs opacity-70 leading-relaxed font-mono mb-6">
                            {t.configDesc}
                          </p>

                          <div className="space-y-6 max-w-md">
                            {/* Interface Language Setup Option */}
                            <div className="flex flex-col space-y-2">
                              <label id="settings-lang-lbl" className="text-[10px] font-black uppercase tracking-widest opacity-80">
                                {t.selectLanguage}
                              </label>
                              <div className="grid grid-cols-2 gap-2">
                                {[
                                  { code: 'es', label: '🇪🇸 Español' },
                                  { code: 'en', label: '🇺🇸 English' },
                                  { code: 'ko', label: '🇰🇷 한국어' },
                                  { code: 'ja', label: '🇯🇵 日本語' }
                                ].map((langObj) => (
                                  <button
                                    key={langObj.code}
                                    id={`set-lang-${langObj.code}`}
                                    onClick={() => {
                                      setSelectedLanguage(langObj.code as AppLanguage);
                                      localStorage.setItem('conectando_mundos_language', langObj.code);
                                    }}
                                    className={`px-4 py-3 rounded-2xl text-[11px] font-black tracking-wide cursor-pointer transition border ${
                                      selectedLanguage === langObj.code
                                        ? darkMode
                                          ? 'bg-[#10b981] text-black border-[#10b981] shadow-xl'
                                          : 'bg-gradient-to-r from-pink-500 via-orange-400 to-amber-400 text-white border-transparent shadow-xl font-extrabold scale-102'
                                        : darkMode
                                          ? 'bg-emerald-950/40 border-emerald-900/40 text-[#10b981]/70 hover:bg-[#10b981]/15 hover:text-[#e2f5e9]'
                                          : 'bg-pink-50/50 border-pink-100 text-[#db2777] hover:bg-pink-100/70 hover:border-pink-300'
                                    }`}
                                  >
                                    {langObj.label}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Voice Gender Preference Setup Option */}
                            <div className="flex flex-col space-y-2">
                              <label id="settings-gender-lbl" className="text-[10px] font-black uppercase tracking-widest opacity-80">
                                {t.voiceGender}
                              </label>
                              <div className="grid grid-cols-2 gap-2">
                                {[
                                  { value: 'female', label: `👩 ${t.voiceGenderFemale}` },
                                  { value: 'male', label: `👨 ${t.voiceGenderMale}` }
                                ].map((gObj) => (
                                  <button
                                    key={gObj.value}
                                    id={`set-gender-${gObj.value}`}
                                    onClick={() => {
                                      setSelectedVoiceGender(gObj.value as VoiceGender);
                                      localStorage.setItem('conectando_mundos_voice_gender', gObj.value);
                                    }}
                                    className={`px-4 py-3 rounded-2xl text-[11px] font-black tracking-wide cursor-pointer transition border ${
                                      selectedVoiceGender === gObj.value
                                        ? darkMode
                                          ? 'bg-[#10b981] text-black border-[#10b981] shadow-xl'
                                          : 'bg-gradient-to-r from-pink-500 via-orange-400 to-amber-400 text-white border-transparent shadow-xl font-extrabold scale-102'
                                        : darkMode
                                          ? 'bg-emerald-950/40 border-emerald-900/40 text-[#10b981]/70 hover:bg-[#10b981]/15 hover:text-[#e2f5e9]'
                                          : 'bg-pink-50/50 border-pink-100 text-[#db2777] hover:bg-pink-100/70 hover:border-pink-300'
                                    }`}
                                  >
                                    {gObj.label}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Color Mode / Contrast Preference Option */}
                            <div className="flex flex-col space-y-2">
                              <label id="settings-theme-lbl" className="text-[10px] font-black uppercase tracking-widest opacity-80">
                                {t.themeMode}
                              </label>
                              <div className="grid grid-cols-2 gap-2">
                                <button
                                  id="set-theme-light"
                                  onClick={() => {
                                    if (darkMode) toggleDarkMode();
                                  }}
                                  className={`px-4 py-3 rounded-2xl text-[11px] font-black tracking-wide cursor-pointer transition border ${
                                    !darkMode
                                      ? 'bg-gradient-to-r from-pink-500 via-orange-400 to-amber-400 text-white border-transparent shadow-xl font-extrabold scale-102'
                                      : darkMode
                                        ? 'bg-emerald-950/40 border-emerald-900/40 text-[#10b981]/50 hover:bg-[#10b981]/15 hover:text-[#e2f5e9]'
                                        : 'bg-pink-50/50 border-pink-100 text-[#db2777] hover:bg-pink-100/70 hover:border-pink-300'
                                  }`}
                                >
                                  ☀️ {t.themeLight}
                                </button>
                                <button
                                  id="set-theme-dark"
                                  onClick={() => {
                                    if (!darkMode) toggleDarkMode();
                                  }}
                                  className={`px-4 py-3 rounded-2xl text-[11px] font-black tracking-wide cursor-pointer transition border ${
                                    darkMode
                                      ? 'bg-[#10b981] text-black border-[#10b981] shadow-xl'
                                      : 'bg-pink-50/50 border-pink-100 text-[#db2777] hover:bg-pink-100/70 hover:border-pink-300'
                                  }`}
                                >
                                  🌙 {t.themeDark}
                                </button>
                              </div>
                            </div>

                            {/* Dynamic Voice Tester button */}
                            <div className="pt-4 border-t border-white/15 flex flex-col space-y-2">
                              <button
                                id="test-voice-synth-btn"
                                onClick={() => {
                                  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                                    window.speechSynthesis.cancel();
                                    const testPhrases: Record<AppLanguage, string> = {
                                      es: 'Hola, voz de prueba activada correctamente.',
                                      en: 'Hello, testing voice synthesizer configuration.',
                                      ja: 'こんにちは、合成音声の設定テスト中です。',
                                      ko: '안녕하세요, 우리들의 연결 목소리 테스트 중입니다.'
                                    };
                                    const utterance = new SpeechSynthesisUtterance(testPhrases[selectedLanguage]);
                                    
                                    if (selectedLanguage === 'es') utterance.lang = 'es-ES';
                                    else if (selectedLanguage === 'en') utterance.lang = 'en-US';
                                    else if (selectedLanguage === 'ko') utterance.lang = 'ko-KR';
                                    else if (selectedLanguage === 'ja') utterance.lang = 'ja-JP';

                                    const availableVoices = window.speechSynthesis.getVoices();
                                    const scoreVoice = (voice: SpeechSynthesisVoice) => {
                                      let score = 0;
                                      const name = voice.name.toLowerCase();
                                      const langCode = voice.lang.toLowerCase();

                                      if (selectedLanguage === 'es' && (langCode.startsWith('es') || langCode.includes('spa'))) score += 100;
                                      if (selectedLanguage === 'en' && (langCode.startsWith('en') || langCode.includes('eng'))) score += 100;
                                      if (selectedLanguage === 'ko' && (langCode.startsWith('ko') || langCode.includes('kor'))) score += 100;
                                      if (selectedLanguage === 'ja' && (langCode.startsWith('ja') || langCode.includes('jp'))) score += 100;

                                      const femaleNames = [
                                        'female', 'femenino', 'femenina', 'mujer', 'chica', 'zira', 'hazel', 'susan', 'heera', 'haruka', 'ayumi', 'kyoko', 'yuri', 'siri', 'samantha', 'karen', 'moira', 'tessa', 'veena', 'fiona', 'yuna', 'hyejin', 'mei', 'nanami', 'shizuka', 'sabina', 'helena', 'elena', 'lucia', 'monica', 'sandra', 'paulina', 'carmen', 'soledad', 'rosa', 'juana', 'victoria', 'eva', 'conchita', 'lola', 'marisol', 'maria', 'ana', 'clara', 'beatriz', 'isabel', 'gabriela', 'sofia', 'teresa', 'heather', 'joanna', 'lisa', 'amy', 'emma', 'vicki', 'chika', 'yuki', 'mio', 'rin', 'sakura', 'hina', 'aoi', 'haru', 'yoko', 'naoko', 'kumiko', 'michelle', 'amanda', 'emily', 'jessica', 'sarah', 'daria', 'linda', 'sabreena', 'alicia'
                                      ];
                                      const maleNames = [
                                        'male', 'masculino', 'hombre', 'chico', 'david', 'james', 'richard', 'mark', 'george', 'pablo', 'juan', 'alex', 'daniel', 'tom', 'kyle', 'oliver', 'ms-m', 'minsu', 'ichiro', 'haruto', 'shinji', 'pavel', 'gorgio', 'paco', 'carlos', 'miguel', 'enrique', 'luis', 'pedro', 'gregorio', 'ignacio', 'roberto', 'mateo', 'diego', 'alejandro', 'jorge', 'manuel', 'jose', 'steve', 'guy', 'michael', 'ravi', 'minho', 'seung', 'jun', 'kenji', 'takashi', 'daiki', 'yuto', 'arthur', 'robert', 'william', 'charles', 'stefan', 'peter', 'andrew'
                                      ];

                                      const isFemaleKeyword = femaleNames.some(k => name.includes(k));
                                      const isMaleKeyword = maleNames.some(k => name.includes(k));
                                      
                                      if (selectedVoiceGender === 'female') {
                                        if (isFemaleKeyword) score += 50;
                                        if (isMaleKeyword) score -= 50;
                                      } else {
                                        if (isMaleKeyword) score += 50;
                                        if (isFemaleKeyword) score -= 50;
                                      }
                                      return score;
                                    };

                                    const sortedVoices = [...availableVoices].sort((a, b) => scoreVoice(b) - scoreVoice(a));
                                    if (sortedVoices.length > 0 && scoreVoice(sortedVoices[0]) > 20) {
                                      utterance.voice = sortedVoices[0];
                                    }

                                    window.speechSynthesis.speak(utterance);
                                  }
                                }}
                                className={`w-full font-black uppercase tracking-wider h-11 rounded-2xl flex items-center justify-center gap-2 cursor-pointer transition hover:scale-[1.01] active:scale-[0.99] text-xs ${
                                  darkMode
                                    ? 'bg-[#10b981] hover:bg-[#34d399] text-black shadow-lg shadow-emerald-900/30'
                                    : 'bg-gradient-to-r from-pink-500 via-orange-400 to-amber-500 text-white shadow-xl shadow-pink-150'
                                }`}
                              >
                                <Volume2 className="h-4.5 w-4.5" />
                                <span>{selectedLanguage === 'es' ? 'Probar voz configurada' : 'Test configured voice'}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

        </div>
      </main>

      {/* BOTTOM-RIGHT CORNER: Double actions floating circles replicating Fullscreen and Search widgets */}
      <div className="absolute bottom-6 right-6 z-30 flex flex-col gap-3">
        {/* Fullscreen Expand widget */}
        <button
          id="fullscreen-double-arrows"
          onClick={toggleFullscreen}
          className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all cursor-pointer backdrop-blur-md shadow-lg border hover:scale-105 active:scale-95 ${
            darkMode 
              ? 'bg-white/10 border-white/10 text-white hover:bg-amber-500 hover:text-black hover:border-amber-400' 
              : 'bg-black/5 border-black/10 text-zinc-800 hover:bg-amber-500 hover:text-black hover:border-amber-400'
          }`}
          title="Fullscreen Map"
        >
          {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
        </button>

        {/* Dynamic Reset/Search assistant widget */}
        <button
          id="quick-query-ai-shortcut"
          onClick={() => {
            setActiveTab('ia');
            setIsPanelOpen(true);
          }}
          className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all cursor-pointer backdrop-blur-md shadow-lg border hover:scale-105 active:scale-95 ${
            darkMode 
              ? 'bg-amber-500 border-amber-400 text-black hover:bg-amber-600' 
              : 'bg-amber-500 border-amber-400 text-black hover:bg-amber-600'
          }`}
          title="Consutar IA Directamente"
        >
          <Sparkles className="h-5 w-5 animate-pulse" />
        </button>
      </div>

      {/* Accessible Interactive Slide-In Drawer: Guidelines & Multi-Language configuration */}
      <AnimatePresence>
        {isDrawerOpen && (
          <div id="coexistence-drawer-modal" className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop cover overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="absolute inset-0 bg-black"
            />

            {/* Slider container cabinet */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`relative z-10 w-full max-w-md h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto ${
                darkMode ? 'bg-zinc-950 text-white' : 'bg-white text-zinc-900'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-amber-500" />
                    <h3 className="text-sm font-black tracking-widest uppercase">
                      {t.guideTitle}
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsDrawerOpen(false)}
                    className="p-2 rounded-full hover:bg-white/10 transition cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="p-4 rounded-3xl bg-amber-500/10 border border-amber-500/20 text-left">
                    <p className="text-xs font-bold text-amber-500 mb-1 font-mono uppercase">{t.guideSubtitle}</p>
                    <p className="text-xs opacity-85 leading-relaxed">{t.subtitle}</p>
                  </div>

                  <ul className="space-y-4 list-none p-0 text-left">
                    {[
                      { icon: '🤝', text: t.guideTip1 },
                      { icon: '👄', text: t.guideTip2 },
                      { icon: '👋', text: t.guideTip3 }
                    ].map((tip, i) => (
                      <li key={i} className="flex gap-3 text-xs leading-relaxed">
                        <span className="text-lg">{tip.icon}</span>
                        <span className="opacity-85">{tip.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 text-center select-none text-[9px] opacity-50 font-mono">
                {t.footerCredit}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Humble Footer text matching original aesthetic */}
      <footer className="relative z-20 py-4 text-center select-none text-[9px] uppercase font-mono opacity-40">
        {t.title} • {t.footerCredit.split('•')[1] || t.footerCredit}
      </footer>
    </div>
  );
}
