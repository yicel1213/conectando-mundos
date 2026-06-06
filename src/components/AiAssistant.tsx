/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Trash2, HelpCircle, Loader2, RefreshCw, FileText, ArrowRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { ChatMessage, TranscriptionItem, GeminiResponse } from '../types';

interface AiAssistantProps {
  transcriptionHistory: TranscriptionItem[];
  prefilledPrompt?: string;
  onClearPrefilledPrompt?: () => void;
}

export default function AiAssistant({ transcriptionHistory, prefilledPrompt, onClearPrefilledPrompt }: AiAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-msg',
      role: 'model',
      content: '¡Hola! Escribí mi IA para servirte como **Asistente Inclusivo** 🧠✨\n\nPuedo ayudarte con:\n\n* **Consejos prácticos**: Por ejemplo, cómo lograr una buena lectura de labios (labiolectura) o consejos de gesticulación.\n* **Lengua de Señas**: Consultar el alfabeto dactilológico o cómo se estructuran las señas básicas.\n* **Simplificador de texto**: Convierto textos complejos a un lenguaje directo y visual.\n* **Resumen de reuniones**: Puedo resumir las transcripciones de voz que grabes en la pestaña anterior para que no pierdas ningún detalle.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [sysError, setSysError] = useState<string | null>(null);
  
  const endOfChatRef = useRef<HTMLDivElement | null>(null);

  // Handle external prompts (e.g. from the Transcription tab)
  useEffect(() => {
    if (prefilledPrompt) {
      setInputValue(prefilledPrompt);
      if (onClearPrefilledPrompt) {
        onClearPrefilledPrompt();
      }
    }
  }, [prefilledPrompt]);

  // Scroll to bottom of chat
  useEffect(() => {
    if (endOfChatRef.current) {
      endOfChatRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputValue;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customText) setInputValue('');
    setLoading(true);
    setSysError(null);

    // Prepare simplified local history to send to server proxy
    // Map ChatMessage format to server expectation
    const historyToSend = messages.slice(1).map(msg => ({
      role: msg.role === 'model' ? 'model' : 'user',
      content: msg.content
    }));

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: userMsg.content,
          history: historyToSend
        })
      });

      if (!response.ok) {
        throw new Error(`Error en los servidores de IA (${response.status})`);
      }

      const data = await response.json();
      if (data.success) {
        const aiMsg: ChatMessage = {
          id: crypto.randomUUID(),
          role: 'model',
          content: data.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, aiMsg]);
      } else {
        setSysError(data.error || 'La IA regresó una respuesta insatisfactoria.');
      }
    } catch (err: any) {
      console.error(err);
      setSysError(err.message || 'Error de conexión con el asistente inteligente.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    handleSendMessage(question);
  };

  const handleSummarizeTranscription = () => {
    if (transcriptionHistory.length === 0) return;

    const formattedTranscript = transcriptionHistory
      .map(item => `[${item.timestamp}] ${item.speaker === 'Yo' ? 'Yo' : 'Interlocutor'}: ${item.text}`)
      .join('\n');

    const promptText = `Por favor, ayúdame a resumir la siguiente conversación transcrita cara a cara de manera muy clara, con bullets principales, acciones o conclusiones:\n\n${formattedTranscript}`;
    handleSendMessage(promptText);
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'init-msg',
        role: 'model',
        content: 'Chat reiniciado. ¿En qué más puedo asistirte hoy con respecto a la comunicación inclusiva?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setSysError(null);
  };

  const suggestionPills = [
    { text: '👋 Cómo saludar respetuosamente', label: 'Presentación' },
    { text: '👄 Consejos de labiolectura', label: 'Labiolectura' },
    { text: '⭐ Tips de inclusión cara a cara', label: 'Inclusión' },
    { text: '👐 Cómo aprender dactilología básica', label: 'Lengua de Señas' }
  ];

  return (
    <div id="ai-assistant-wrapper" className="bg-white/10 dark:bg-black/30 backdrop-blur-xl border border-white/25 dark:border-white/10 rounded-[32px] p-6 shadow-2xl flex flex-col h-full min-h-[480px] text-white animate-fade-in">
      <div className="flex items-center justify-between border-b border-white/15 pb-4 mb-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-200 animate-pulse" />
            Asistente de Inclusión con IA
          </h2>
          <p className="text-xs text-white/70 mt-1">
            IA de apoyo entrenada en gesticulación, Lengua de Señas y accesibilidad de comunicación.
          </p>
        </div>

        {messages.length > 1 && (
          <button
            id="clear-ai-chat-btn"
            onClick={clearChat}
            className="flex items-center gap-1.5 hover:text-white bg-white/10 hover:bg-white/25 text-white/80 text-xs font-bold px-3 py-1.5 rounded-xl transition cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline">Reiniciar</span>
          </button>
        )}
      </div>

      {/* Transcription summaries context activator if logs exist */}
      {transcriptionHistory.length > 0 && (
        <div className="mb-4 bg-indigo-500/20 border border-white/15 p-3.5 rounded-2xl flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <FileText className="h-4.5 w-4.5 text-indigo-200 flex-shrink-0" />
            <div className="text-left">
              <p className="text-xs font-bold text-white">¿Deseas resumir la conversación activa?</p>
              <p className="text-[10px] text-white/70">Tienes {transcriptionHistory.length} líneas de diálogo dictadas.</p>
            </div>
          </div>
          <button
            id="ai-summarize-active-btn"
            onClick={handleSummarizeTranscription}
            className="bg-white text-indigo-700 hover:bg-white/95 active:scale-95 font-bold text-xs py-2 px-3.5 rounded-xl shadow-lg transition-all flex items-center gap-1 cursor-pointer hover:scale-[1.02]"
          >
            <span>Generar Resumen con IA</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Suggestion Quick Pills */}
      <div className="mb-3">
        <span className="text-[9px] text-white/50 font-extrabold uppercase tracking-wider font-mono block mb-1.5">Dudas sugeridas:</span>
        <div className="flex flex-wrap gap-1.5">
          {suggestionPills.map((pill, i) => (
            <button
              key={i}
              id={`ai-suggestion-pill-${i}`}
              onClick={() => handleQuickQuestion(pill.text)}
              disabled={loading}
              className="text-xs font-bold text-white bg-white/10 hover:bg-white/20 border border-white/15 dark:bg-white/5 dark:hover:bg-white/10 rounded-xl px-3 py-2 text-left transition disabled:opacity-40 select-none shadow-sm cursor-pointer"
            >
              {pill.text}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Thread panel */}
      <div 
        id="ai-chat-thread" 
        className="flex-1 overflow-y-auto max-h-[300px] min-h-[200px] bg-white/5 p-4 border border-white/15 rounded-2xl flex flex-col space-y-4 mb-4 shadow-inner"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            id={`ai-msg-block-${msg.id}`}
            className={`flex flex-col space-y-1.5 p-4 rounded-xl max-w-[85%] border shadow-md transition-all ${
              msg.role === 'model'
                ? 'bg-white/10 dark:bg-black/30 border-white/15 text-white shadow-sm self-start rounded-tr-2xl rounded-br-2xl rounded-bl-2xl rounded-tl-sm'
                : 'bg-indigo-600/80 hover:bg-indigo-600 border-white/15 text-white shadow-md self-end rounded-tl-2xl rounded-bl-2xl rounded-br-2xl rounded-tr-sm font-medium'
            }`}
          >
            {/* Speaker name */}
            <div className={`text-[9.5px] font-mono font-black uppercase tracking-wider ${
              msg.role === 'model' ? 'text-indigo-200' : 'text-white/75'
            }`}>
              {msg.role === 'model' ? '✨ Asistente IA' : '🙋 Yo'}
            </div>

            {/* Markdown rendered text body */}
            <div className={`text-xs leading-relaxed font-sans prose prose-invert max-w-none text-white selection:bg-indigo-500`}>
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>

            <div className={`text-[8px] font-mono text-right self-end ${
              msg.role === 'model' ? 'text-white/40' : 'text-white/60'
            }`}>
              {msg.timestamp}
            </div>
          </div>
        ))}

        {loading && (
          <div id="ai-loading-bubble" className="bg-white/10 dark:bg-black/30 border border-white/15 self-start p-3.5 rounded-2xl flex items-center gap-2 max-w-[80%] shadow-md">
            <Loader2 className="h-4.5 w-4.5 text-indigo-200 animate-spin" />
            <span className="text-xs text-white/70 font-medium animate-pulse">Asistente pensando la respuesta...</span>
          </div>
        )}

        {sysError && (
          <div className="bg-red-500/20 border border-red-500/30 text-white p-3.5 rounded-xl text-xs">
            {sysError}
          </div>
        )}

        <div ref={endOfChatRef} />
      </div>

      {/* User Prompt Input Form */}
      <div 
        id="ai-prompt-box" 
        className="flex gap-2"
      >
        <input
          id="ai-text-input-field"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSendMessage();
            }
          }}
          disabled={loading}
          placeholder="Pregunta algo (ej. '¿cómo se deletrea mamá en señas?')..."
          className="flex-1 text-xs bg-white/5 dark:bg-black/30 border border-white/15 rounded-xl px-4 py-3.5 text-white placeholder-white/35 focus:ring-1 focus:ring-white outline-none transition disabled:opacity-50"
        />

        <button
          id="ai-send-prompt-btn"
          onClick={() => handleSendMessage()}
          disabled={!inputValue.trim() || loading}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold p-3.5 px-4 rounded-xl transition flex items-center justify-center cursor-pointer shadow-lg hover:scale-105 active:scale-95"
        >
          <Send className="h-4.5 w-4.5" />
        </button>
      </div>
    </div>
  );
}
