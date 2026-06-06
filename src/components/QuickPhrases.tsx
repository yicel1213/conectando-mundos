/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { BookOpen, Volume2, Plus, Trash2, Eye, HelpCircle, Star } from 'lucide-react';
import { QuickPhrase } from '../types';

interface QuickPhrasesProps {
  onSelectPhrase: (text: string, flagSpeakImmediately?: boolean) => void;
}

export default function QuickPhrases({ onSelectPhrase }: QuickPhrasesProps) {
  const [filterCategory, setFilterCategory] = useState<string>('todos');
  const [customText, setCustomText] = useState('');
  const [customCategory, setCustomCategory] = useState<QuickPhrase['category']>('personalizado');
  const [phrases, setPhrases] = useState<QuickPhrase[]>([]);

  // Default prebuilt phrases
  const defaultPhrases: QuickPhrase[] = [
    { id: 'def-1', text: 'Hola, buenas tardes.', category: 'general' },
    { id: 'def-2', text: 'Mucho gusto en conocerte.', category: 'general' },
    { id: 'def-3', text: 'Soy una persona sorda o con discapacidad auditiva.', category: 'ayuda' },
    { id: 'def-4', text: 'Por favor, escribe lo que quieres decir en esta pantalla.', category: 'ayuda' },
    { id: 'def-5', text: 'Hable despacio mirando de frente, por favor, puedo leer los labios.', category: 'ayuda' },
    { id: 'def-6', text: '¿Me lo podrías volver a repetir por favor con gestos más claros?', category: 'ayuda' },
    { id: 'def-7', text: '¿Dónde está el baño?', category: 'preguntas' },
    { id: 'def-8', text: '¿Cuánto cuesta este artículo?', category: 'comercio' },
    { id: 'def-9', text: '¿Aceptan tarjetas de débito o crédito?', category: 'comercio' },
    { id: 'def-10', text: 'Necesito comprar esto, ¿me lo puede empacar por favor?', category: 'comercio' },
    { id: 'def-11', text: '¿Me puedes prestar un bolígrafo y papel por favor?', category: 'preguntas' },
    { id: 'def-12', text: 'Sí, estoy de acuerdo.', category: 'general' },
    { id: 'def-13', text: 'No, muchas gracias.', category: 'general' },
    { id: 'def-14', text: 'Por favor, necesito ayuda médica urgente, llame a emergencias.', category: 'ayuda' },
  ];

  // Load custom phrases from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('sordcom_custom_phrases');
    if (stored) {
      try {
        const customList = JSON.parse(stored) as QuickPhrase[];
        setPhrases([...defaultPhrases, ...customList]);
      } catch (e) {
        setPhrases(defaultPhrases);
      }
    } else {
      setPhrases(defaultPhrases);
    }
  }, []);

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customText.trim()) return;

    const newPhrase: QuickPhrase = {
      id: `custom-${crypto.randomUUID()}`,
      text: customText.trim(),
      category: 'personalizado'
    };

    const storedStr = localStorage.getItem('sordcom_custom_phrases');
    let customList: QuickPhrase[] = [];
    if (storedStr) {
      try {
        customList = JSON.parse(storedStr);
      } catch (e) {}
    }

    customList.push(newPhrase);
    localStorage.setItem('sordcom_custom_phrases', JSON.stringify(customList));
    setPhrases(prev => [...prev, newPhrase]);
    setCustomText('');
  };

  const handleDeleteCustom = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const storedStr = localStorage.getItem('sordcom_custom_phrases');
    if (storedStr) {
      try {
        let customList: QuickPhrase[] = JSON.parse(storedStr);
        customList = customList.filter(p => p.id !== id);
        localStorage.setItem('sordcom_custom_phrases', JSON.stringify(customList));
      } catch (e) {}
    }
    setPhrases(prev => prev.filter(p => p.id !== id));
  };

  const categories = [
    { value: 'todos', label: '🗂️ Todos' },
    { value: 'general', label: '👋 General' },
    { value: 'ayuda', label: '🚨 Ayuda y Soporte' },
    { value: 'preguntas', label: '❓ Preguntas' },
    { value: 'comercio', label: '🛍️ Comercio' },
    { value: 'personalizado', label: '⭐ Mis Rutinas' },
  ];

  const filteredPhrases = filterCategory === 'todos' 
    ? phrases 
    : phrases.filter((p) => p.category === filterCategory);

  return (
    <div id="quick-phrases-wrapper" className="bg-white/10 dark:bg-black/30 backdrop-blur-xl border border-white/25 dark:border-white/10 rounded-[32px] p-6 shadow-2xl flex flex-col h-full min-h-[480px] text-white animate-fade-in">
      <div className="flex items-center justify-between border-b border-white/15 pb-4 mb-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-indigo-200" />
            Biblioteca de Frases Rápidas
          </h2>
          <p className="text-xs text-white/70 mt-1">
            Haz clic en cualquier frase para reproducirla por voz y cargarla en pantalla gigante de inmediato.
          </p>
        </div>
      </div>

      {/* Category selector pill filter tabs */}
      <div className="flex flex-wrap gap-1.5 mb-4 pb-2 border-b border-white/15">
        {categories.map((cat) => (
          <button
            key={cat.value}
            id={`cat-tab-${cat.value}`}
            onClick={() => setFilterCategory(cat.value)}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterCategory === cat.value
                ? 'bg-white text-indigo-700 shadow-md transform scale-[1.03]'
                : 'bg-white/10 hover:bg-white/20 border border-white/10 text-white/80 hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Main interactive grid card list */}
      <div className="flex-1 overflow-y-auto max-h-[350px] min-h-[220px] p-1 grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {filteredPhrases.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center text-center p-8 text-white/50">
            <HelpCircle className="h-8 w-8 text-white/40 mb-2" />
            <p className="text-xs font-semibold text-white">No hay frases guardadas en esta categoría</p>
            {filterCategory === 'personalizado' && (
              <p className="text-[11px] text-white/60 mt-1.5 max-w-xs leading-normal">
                Usa el formulario de abajo para agregar tus frases recurrentes favoritas para el supermercado, médico o transporte.
              </p>
            )}
          </div>
        ) : (
          filteredPhrases.map((phrase) => (
            <div
              key={phrase.id}
              id={`phrase-card-${phrase.id}`}
              onClick={() => onSelectPhrase(phrase.text, true)}
              className="group text-left p-4 bg-white/5 dark:bg-black/25 border border-white/15 hover:bg-white/15 dark:hover:bg-white/10 hover:border-white/35 rounded-2xl cursor-pointer transition-all duration-200 flex items-start justify-between gap-3 shadow-md hover:scale-[1.01]"
            >
              <div className="flex-1 flex flex-col space-y-1.5">
                <span className="inline-block px-2.5 py-0.5 max-fit text-[9px] uppercase tracking-wider font-extrabold font-mono rounded-md bg-white/10 text-white/70">
                  {phrase.category === 'personalizado' ? '⭐ Mis Rutinas' : phrase.category}
                </span>
                <p className="text-white text-sm font-semibold leading-relaxed tracking-tight group-hover:text-white">
                  {phrase.text}
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Immediate speech output icon */}
                <button
                  id={`play-phrase-icon-${phrase.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectPhrase(phrase.text, true); // True to speak instantly
                  }}
                  className="p-2 rounded-xl text-white/60 hover:text-white bg-white/10 hover:bg-white/20 transition-all cursor-pointer"
                  title="Reproducir por voz"
                >
                  <Volume2 className="h-4.5 w-4.5" />
                </button>

                {phrase.category === 'personalizado' && (
                  <button
                    id={`delete-custom-phrase-${phrase.id}`}
                    onClick={(e) => handleDeleteCustom(phrase.id, e)}
                    className="p-2 text-white/60 hover:text-red-300 bg-white/10 hover:bg-white/25 rounded-xl transition-all cursor-pointer"
                    title="Eliminar rutina"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Creación de frases personalizadas */}
      <form 
        onSubmit={handleCreateCustom} 
        id="add-custom-phrase-form" 
        className="pt-4 border-t border-white/15 flex flex-col space-y-3"
      >
        <label htmlFor="custom-phrase-input" className="text-xs font-bold text-white/60 uppercase tracking-wider font-mono">
          Añadir frase o rutina personalizada:
        </label>
        
        <div className="flex gap-2">
          <input
            id="custom-phrase-input"
            type="text"
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="Ejemplo: Hola, vengo a buscar mis medicamentos programados..."
            className="flex-1 text-xs bg-white/5 dark:bg-black/30 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/35 focus:ring-1 focus:ring-white outline-none transition"
          />
          
          <button
            id="add-custom-phrase-submit-btn"
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white p-3 px-4 rounded-xl transition flex items-center justify-center font-bold cursor-pointer"
            title="Guardar Frase"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
