/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { BookOpen, Volume2, Plus, Trash2, HelpCircle } from 'lucide-react';
import { QuickPhrase } from '../types';
import { AppLanguage, translations } from '../translations';

interface QuickPhrasesProps {
  onSelectPhrase: (text: string, flagSpeakImmediately?: boolean) => void;
  language: AppLanguage;
}

export default function QuickPhrases({ onSelectPhrase, language }: QuickPhrasesProps) {
  const [filterCategory, setFilterCategory] = useState<string>('todos');
  const [customText, setCustomText] = useState('');
  const [phrases, setPhrases] = useState<QuickPhrase[]>([]);

  const t = translations[language];

  // Default prebuilt phrases per language
  const localizedDefaults: Record<AppLanguage, QuickPhrase[]> = {
    es: [
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
    ],
    en: [
      { id: 'def-1', text: 'Hello, good afternoon.', category: 'general' },
      { id: 'def-2', text: 'Nice to meet you.', category: 'general' },
      { id: 'def-3', text: 'I am deaf or hard of hearing.', category: 'ayuda' },
      { id: 'def-4', text: 'Please type what you want to declare on this device display.', category: 'ayuda' },
      { id: 'def-5', text: 'Please speak slowly facing me directly, I read lips.', category: 'ayuda' },
      { id: 'def-6', text: 'Could you please state that once more using clean gestures?', category: 'ayuda' },
      { id: 'def-7', text: 'Where is the bathroom?', category: 'preguntas' },
      { id: 'def-8', text: 'How much does this article cost?', category: 'comercio' },
      { id: 'def-9', text: 'Do you accept debit or credit cards?', category: 'comercio' },
      { id: 'def-10', text: 'I need to purchase this, can you wrap it, please?', category: 'comercio' },
      { id: 'def-11', text: 'Could you lend me a pen and paper and notebook please?', category: 'preguntas' },
      { id: 'def-12', text: 'Yes, I definitely agree.', category: 'general' },
      { id: 'def-13', text: 'No, thank you very much.', category: 'general' },
      { id: 'def-14', text: 'Please assist, urgent medical help required, call emergency.', category: 'ayuda' },
    ],
    ja: [
      { id: 'def-1', text: 'こんにちは、よろしくお願いします。', category: 'general' },
      { id: 'def-2', text: 'はじめまして。お会いできて嬉しいです。', category: 'general' },
      { id: 'def-3', text: '私は聴覚障害を抱えています。聞こえません。', category: 'ayuda' },
      { id: 'def-4', text: '伝えたいことをこの文字スクリーンに入力してください。', category: 'ayuda' },
      { id: 'def-5', text: '口唇を読むことができますので、ゆっくり話していただけますか？', category: 'ayuda' },
      { id: 'def-6', text: 'ジェスチャーを交えてもう一度お伝え願えますか？', category: 'ayuda' },
      { id: 'def-7', text: 'トイレの位置はどこでしょうか？', category: 'preguntas' },
      { id: 'def-8', text: 'これは価格はおいくらですか？', category: 'comercio' },
      { id: 'def-9', text: 'クレジットカードでの電子マネー決済は可能ですか？', category: 'comercio' },
      { id: 'def-10', text: 'これを購入します、包装をお願いします。', category: 'comercio' },
      { id: 'def-11', text: '筆記用の紙とパズル用筆記用具を貸していただけますか？', category: 'preguntas' },
      { id: 'def-12', text: 'はい、了解しました。賛成です。', category: 'general' },
      { id: 'def-13', text: 'いいえ、十分ですのでご遠慮させていただきます。', category: 'general' },
      { id: 'def-14', text: '体調が非常に悪化しています、救急車の手配を要請します。', category: 'ayuda' },
    ],
    ko: [
      { id: 'def-1', text: '안녕하세요, 반갑습니다.', category: 'general' },
      { id: 'def-2', text: '만나 뵙게 되어 매우 기쁩니다.', category: 'general' },
      { id: 'def-3', text: '저는 청각장애가 있어 소리를 잘 들을 수 없습니다.', category: 'ayuda' },
      { id: 'def-4', text: '화면을 이용해 여기에 전달하고자 하시는 내용을 글로 타이핑 해주세요.', category: 'ayuda' },
      { id: 'def-5', text: '제가 입모양을 정독하고 있으니 얼굴을 보고 정면에서 차분히 말씀 부탁드립니다.', category: 'ayuda' },
      { id: 'def-6', text: '더 간결하고 명확한 신체 손짓 동작으로 다시 강조해 말씀해 주시겠습니까?', category: 'ayuda' },
      { id: 'def-7', text: '화장실은 혹시 어느 방향에 위치해 있나요?', category: 'preguntas' },
      { id: 'def-8', text: '이 물건은 판매 금액이 어떻게 편성되어 있습니까?', category: 'comercio' },
      { id: 'def-9', text: '일반 직불 신용카드나 마일리지 결제 시스템 사용이 통용되나요?', category: 'comercio' },
      { id: 'def-10', text: '이것을 즉시 매입하고자 합니다, 깔끔하게 봉투에 담아 주십시오.', category: 'comercio' },
      { id: 'def-11', text: '상호 손글씨 대화를 나눌 수 있도록 조그만 메모지 혹은 필기도구 임대가 됩니까?', category: 'preguntas' },
      { id: 'def-12', text: '네, 좋습니다. 적극적 동감의 뜻을 보냅니다.', category: 'general' },
      { id: 'def-13', text: '아니오, 정중히 사양하겠습니다. 진심으로 감사 무한합니다.', category: 'general' },
      { id: 'def-14', text: '정신을 잃을 것처럼 극심한 병증 진행을 체감 중입니다, 긴급 응급구조 이송 전화를 즉시 부탁드립니다.', category: 'ayuda' },
    ]
  };

  // Keep load state sync'd when language switches
  useEffect(() => {
    const defaultPhrases = localizedDefaults[language];
    const stored = localStorage.getItem(`sordcom_custom_phrases_${language}`) || localStorage.getItem('sordcom_custom_phrases');
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
  }, [language]);

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customText.trim()) return;

    const newPhrase: QuickPhrase = {
      id: `custom-${crypto.randomUUID()}`,
      text: customText.trim(),
      category: 'personalizado'
    };

    const storageKey = `sordcom_custom_phrases_${language}`;
    const storedStr = localStorage.getItem(storageKey);
    let customList: QuickPhrase[] = [];
    if (storedStr) {
      try {
        customList = JSON.parse(storedStr);
      } catch (e) {}
    }

    customList.push(newPhrase);
    localStorage.setItem(storageKey, JSON.stringify(customList));
    setPhrases(prev => [...prev, newPhrase]);
    setCustomText('');
  };

  const handleDeleteCustom = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const storageKey = `sordcom_custom_phrases_${language}`;
    const storedStr = localStorage.getItem(storageKey);
    if (storedStr) {
      try {
        let customList: QuickPhrase[] = JSON.parse(storedStr);
        customList = customList.filter(p => p.id !== id);
        localStorage.setItem(storageKey, JSON.stringify(customList));
      } catch (e) {}
    }
    setPhrases(prev => prev.filter(p => p.id !== id));
  };

  const categories = [
    { value: 'todos', label: language === 'es' ? '🗂️ Todos' : language === 'ja' ? '🗂️ 全て' : language === 'ko' ? '🗂️ 전체보기' : '🗂️ All' },
    { value: 'general', label: language === 'es' ? '👋 General' : language === 'ja' ? '👋 一般挨拶' : language === 'ko' ? '👋 일상인사' : '👋 General' },
    { value: 'ayuda', label: language === 'es' ? '🚨 Ayuda' : language === 'ja' ? '🚨 助け合い' : language === 'ko' ? '🚨 구조요청' : '🚨 Aid' },
    { value: 'preguntas', label: language === 'es' ? '❓ Preguntas' : language === 'ja' ? '❓ 質問疑問' : language === 'ko' ? '❓ 단골질문' : '❓ Doubts' },
    { value: 'comercio', label: language === 'es' ? '🛍️ Comercio' : language === 'ja' ? '🛍️ ショップ' : language === 'ko' ? '🛍️ 쇼핑/마트' : '🛍️ Shop' },
    { value: 'personalizado', label: language === 'es' ? '⭐ Mis Rutinas' : language === 'ja' ? '⭐ マイ定型句' : language === 'ko' ? '⭐ 나의 루틴' : '⭐ Favorites' },
  ];

  const filteredPhrases = filterCategory === 'todos' 
    ? phrases 
    : phrases.filter((p) => p.category === filterCategory);

  return (
    <div id="quick-phrases-wrapper" className="bg-white/40 dark:bg-black/20 backdrop-blur-xl border border-pink-200/50 dark:border-emerald-500/10 rounded-[32px] p-6 shadow-2xl flex flex-col h-full min-h-[480px] animate-fade-in">
      <div className="flex items-center justify-between border-b border-pink-100 dark:border-emerald-500/10 pb-4 mb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-emerald-250 tracking-tight flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-pink-500 dark:text-emerald-400" />
            {t.tabAtajos}
          </h2>
          <p className="text-xs text-slate-600 dark:text-emerald-200/70 mt-1">
            {t.tabAtajosDesc}
          </p>
        </div>
      </div>

      {/* Category selector pill filter tabs */}
      <div className="flex flex-wrap gap-1.5 mb-4 pb-2 border-b border-pink-100 dark:border-emerald-500/10">
        {categories.map((cat) => (
          <button
            key={cat.value}
            id={`cat-tab-${cat.value}`}
            onClick={() => setFilterCategory(cat.value)}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterCategory === cat.value
                ? 'bg-gradient-to-r from-pink-500 to-amber-500 dark:from-[#10b981] dark:to-emerald-400 text-white dark:text-black shadow-md transform scale-[1.03] font-black'
                : 'bg-white/80 dark:bg-[#031d0f]/60 hover:bg-pink-50 dark:hover:bg-emerald-950/20 border border-pink-100 dark:border-emerald-800/10 text-pink-700 dark:text-[#10b981]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Main interactive grid card list */}
      <div className="flex-1 overflow-y-auto max-h-[350px] min-h-[220px] p-1 grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {filteredPhrases.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center text-center p-8 text-slate-400 dark:text-emerald-200/50">
            <HelpCircle className="h-8 w-8 text-slate-300 dark:text-emerald-500/45 mb-2" />
            <p className="text-xs font-semibold text-slate-700 dark:text-emerald-150">No entries</p>
            {filterCategory === 'personalizado' && (
              <p className="text-[11px] text-slate-500 dark:text-emerald-250/60 mt-1.5 max-w-xs leading-normal">
                {language === 'es' ? 'Usa el formulario de abajo para agregar tus rutinas favoritas.' : 'Add custom phrase cards with the text field below.'}
              </p>
            )}
          </div>
        ) : (
          filteredPhrases.map((phrase) => (
            <div
              key={phrase.id}
              id={`phrase-card-${phrase.id}`}
              onClick={() => onSelectPhrase(phrase.text, true)}
              className="group text-left p-4 bg-white/90 dark:bg-emerald-950/30 border border-pink-100 dark:border-emerald-500/15 hover:bg-pink-50 dark:hover:bg-emerald-950 hover:border-pink-300 dark:hover:border-emerald-500/35 rounded-2xl cursor-pointer transition-all duration-200 flex items-start justify-between gap-3 shadow-md hover:scale-[1.01]"
            >
              <div className="flex-1 flex flex-col space-y-1.5">
                <span className="inline-block px-1.5 py-0.5 max-fit text-[9px] uppercase tracking-wider font-extrabold font-mono rounded bg-pink-100/50 dark:bg-emerald-950 text-pink-700 dark:text-[#10b981]">
                  {phrase.category === 'personalizado' ? (language === 'es' ? 'Rutina' : 'Routine') : phrase.category}
                </span>
                <p className="text-slate-800 dark:text-[#e2f5e9] text-sm font-semibold leading-relaxed tracking-tight group-hover:text-pink-600 dark:group-hover:text-[#10b981] transition-colors">
                  {phrase.text}
                </p>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {/* Immediate speech output icon */}
                <button
                  id={`play-phrase-icon-${phrase.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectPhrase(phrase.text, true); // True to speak instantly
                  }}
                  className="p-2 rounded-xl text-pink-600 dark:text-emerald-400 hover:text-white dark:hover:text-black bg-pink-50 dark:bg-emerald-950/80 hover:bg-pink-500 dark:hover:bg-[#10b981] transition-all cursor-pointer border border-pink-100 dark:border-emerald-500/20"
                  title="Speak"
                >
                  <Volume2 className="h-4 w-4" />
                </button>

                {phrase.category === 'personalizado' && (
                  <button
                    id={`delete-custom-phrase-${phrase.id}`}
                    onClick={(e) => handleDeleteCustom(phrase.id, e)}
                    className="p-2 text-pink-450 dark:text-emerald-500 hover:text-red-500 dark:hover:text-red-400 bg-pink-50 dark:bg-emerald-950/85 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-all cursor-pointer border border-pink-100 dark:border-emerald-500/20"
                    title="Delete"
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
        className="pt-4 border-t border-pink-100 dark:border-emerald-500/10 flex flex-col space-y-3"
      >
        <label htmlFor="custom-phrase-input" className="text-xs font-bold text-slate-500 dark:text-emerald-100/60 uppercase tracking-wider font-mono">
          {t.addQuickPhraseTitle}
        </label>
        
        <div className="flex gap-2">
          <input
            id="custom-phrase-input"
            type="text"
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder={t.placeholderQuickPhrase}
            className="flex-1 text-xs bg-white/90 dark:bg-black/30 border border-pink-100 dark:border-emerald-500/20 rounded-xl px-4 py-3 text-slate-850 dark:text-white placeholder-slate-400 dark:placeholder-white/35 focus:ring-1 focus:ring-pink-500 dark:focus:ring-emerald-400 outline-none transition"
          />
          
          <button
            id="add-custom-phrase-submit-btn"
            type="submit"
            className="bg-pink-600 hover:bg-pink-500 dark:bg-emerald-600 dark:hover:bg-emerald-500 active:scale-95 text-white dark:text-black p-3 px-4 rounded-xl transition flex items-center justify-center font-bold cursor-pointer"
            title={t.btnSavePhrase}
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
