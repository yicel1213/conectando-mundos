export type AppLanguage = 'es' | 'en' | 'ko' | 'ja';
export type VoiceGender = 'male' | 'female';

export interface TranslationDictionary {
  title: string;
  subtitle: string;
  guideTitle: string;
  guideTip1: string;
  guideTip2: string;
  guideTip3: string;
  guideSubtitle: string;
  origen: string;
  tabVoz: string;
  tabEscribir: string;
  tabAtajos: string;
  tabPizarra: string;
  tabIa: string;
  tabConfig: string;
  tabVozDesc: string;
  tabEscribirDesc: string;
  tabAtajosDesc: string;
  tabPizarraDesc: string;
  tabIaDesc: string;
  tabConfigDesc: string;
  configTitle: string;
  configDesc: string;
  selectLanguage: string;
  voiceGender: string;
  voiceGenderMale: string;
  voiceGenderFemale: string;
  themeMode: string;
  themeLight: string;
  themeDark: string;
  timeLabel: string;
  activeStatus: string;
  presetsLabel: string;
  presets: string[];
  placeholderTts: string;
  btnSpeak: string;
  btnStop: string;
  btnGiant: string;
  btnClear: string;
  btnSave: string;
  placeholderQuickPhrase: string;
  addQuickPhraseTitle: string;
  btnSavePhrase: string;
  promptAiHelper: string;
  aiSuggestedPromptTitle: string;
  aiSuggestedPrompt1: string;
  aiSuggestedPrompt1Label: string;
  aiSuggestedPrompt2: string;
  aiSuggestedPrompt2Label: string;
  aiSuggestedPrompt3: string;
  aiSuggestedPrompt3Label: string;
  aiSuggestedPrompt4: string;
  aiSuggestedPrompt4Label: string;
  navTabsLabel: string;
  footerCredit: string;
  billboardTitle: string;
  billboardHelp: string;
  speakerMe: string;
  speakerOpponent: string;
  listeningActive: string;
  listeningPaused: string;
  clearChat: string;
  consultAiBtn: string;
  aiLoading: string;
  btnReset: string;
  summarizeBtn: string;
  summarizeBoxTitle: string;
  summarizeBoxDesc: string;
}

export const translations: Record<AppLanguage, TranslationDictionary> = {
  es: {
    title: "Conectando Mundos",
    subtitle: "Asistente de accesibilidad e inclusión cara a cara",
    guideTitle: "Guía de Convivencia",
    guideSubtitle: "Interacción respetuosa",
    guideTip1: "🤝 Atención visual: Asegura contacto directo antes de hablar.",
    guideTip2: "👄 Labiolectura: Vocaliza a ritmo calmado sin exagerar ni gritar.",
    guideTip3: "👋 Mímica interactiva: Gesticula con tus manos amigablemente.",
    origen: "ACTIVO",
    tabVoz: "TRANSCRIPTOR",
    tabEscribir: "HABLA / CARTEL",
    tabAtajos: "RUTINAS",
    tabPizarra: "PIZARRA",
    tabIa: "ASISTENTE IA",
    tabConfig: "CONFIGURAR",
    tabVozDesc: "Convierte voz a texto gigante",
    tabEscribirDesc: "Escribe para reproducir audio",
    tabAtajosDesc: "Biblioteca de frases recurrentes",
    tabPizarraDesc: "Dibujo o apuntes manuables",
    tabIaDesc: "Dudas de señas y resúmenes",
    tabConfigDesc: "Idioma, voz y modo visual",
    configTitle: "Personalización del Entorno",
    configDesc: "Modifica las preferencias de idioma de la interfaz, el género de la voz de síntesis (TTS) y el tema de color.",
    selectLanguage: "Idioma de la interfaz:",
    voiceGender: "Género de la voz asistida:",
    voiceGenderMale: "Voz Masculina",
    voiceGenderFemale: "Voz Femenina",
    themeMode: "Tema de pantalla:",
    themeLight: "Modo Claro",
    themeDark: "Modo Oscuro",
    timeLabel: "Hora local",
    activeStatus: "ESTADO DE CONEXIÓN",
    presetsLabel: "Atajos de escritura rápida:",
    presets: [
      'Hola',
      'Buenos días',
      'Por favor',
      'Gracias',
      '¿Cuánto cuesta?',
      '¿Dónde está el baño?',
      'No comprendo',
      'Escríbelo por favor',
      'Sí',
      'No',
      'Disculpa',
      'Necesito ayuda'
    ],
    placeholderTts: "Escribe lo que quieres decir aquí... La otra persona escuchará tu voz sintetizada o podrá leer en pantalla gigante.",
    btnSpeak: "Reproducir Voz (Hablar)",
    btnStop: "Detener reproducción",
    btnGiant: "Pantalla拆Gigante",
    btnClear: "Borrar",
    btnSave: "Guardar",
    placeholderQuickPhrase: "Ejemplo: Hola, vengo a buscar mis medicamentos programados...",
    addQuickPhraseTitle: "Añadir frase o rutina personalizada:",
    btnSavePhrase: "Guardar Frase",
    promptAiHelper: "Por favor, explícame de manera sencilla y corta el significado o contexto de esta frase:",
    aiSuggestedPromptTitle: "Dudas sugeridas:",
    aiSuggestedPrompt1: "👋 Cómo saludar respetuosamente",
    aiSuggestedPrompt1Label: "Presentación",
    aiSuggestedPrompt2: "👄 Consejos de labiolectura",
    aiSuggestedPrompt2Label: "Labiolectura",
    aiSuggestedPrompt3: "⭐ Tips de inclusión cara a cara",
    aiSuggestedPrompt3Label: "Inclusión",
    aiSuggestedPrompt4: "👐 Cómo aprender dactilología básica",
    aiSuggestedPrompt4Label: "Lengua de Señas",
    navTabsLabel: "SERVICIOS",
    footerCredit: "Conectando Mundos • Diseñado bajo principios de inclusión social y adaptabilidad universal.",
    billboardTitle: "Modo Cartelera Gigante",
    billboardHelp: "Muestra esta pantalla directamente a la otra persona para comunicarle tu mensaje a distancia.",
    speakerMe: "Yo",
    speakerOpponent: "Oponente",
    listeningActive: "TRANSCRIBIENDO EN REAL-TIME...",
    listeningPaused: "MICRÓFONO PAUSADO. CLIC EN EL BOTÓN PARA ACTIVAR.",
    clearChat: "Limpiar historial",
    consultAiBtn: "Preguntar a la IA sobre esto",
    aiLoading: "Asistente pensando la respuesta...",
    btnReset: "Reiniciar",
    summarizeBtn: "Generar Resumen con IA",
    summarizeBoxTitle: "¿Deseas resumir la conversación activa?",
    summarizeBoxDesc: "líneas de diálogo dictadas.",
  },
  en: {
    title: "Connecting Worlds",
    subtitle: "Accessibility and inclusion assistant face-to-face",
    guideTitle: "Guideline Guide",
    guideSubtitle: "Respectful interaction",
    guideTip1: "🤝 Eye contact: Ensure a direct visual bond before speaking.",
    guideTip2: "👄 Lip reading: Speak at a calm pace, do not exaggerate or shout.",
    guideTip3: "👋 Interactive mime: Gesture naturally with your hands.",
    origen: "ACTIVE",
    tabVoz: "TRANSCRIBER",
    tabEscribir: "SPEAK / BOARD",
    tabAtajos: "ROUTINES",
    tabPizarra: "CANVAS",
    tabIa: "AI HELPER",
    tabConfig: "SETTINGS",
    tabVozDesc: "Convert speech to giant texts",
    tabEscribirDesc: "Write to run speech synthesis",
    tabAtajosDesc: "Quick preset phrases library",
    tabPizarraDesc: "Handy drawing or handnotes",
    tabIaDesc: "Sign alphabet & summary doubts",
    tabConfigDesc: "Language, voice synth & visuals",
    configTitle: "Environment Customization",
    configDesc: "Modify system interface language, speech synthesis (TTS) voice accent gender, and visual layout colors.",
    selectLanguage: "System Language:",
    voiceGender: "Text-to-Speech gender:",
    voiceGenderMale: "Male Voice",
    voiceGenderFemale: "Female Voice",
    themeMode: "Layout Contrast:",
    themeLight: "Light Mode",
    themeDark: "Dark Mode",
    timeLabel: "Local time",
    activeStatus: "CONNECTION STATUS",
    presetsLabel: "Speedy text helpers:",
    presets: [
      'Hello',
      'Good morning',
      'Please',
      'Thank you',
      'How much is it?',
      'Where is the restroom?',
      'I do not understand',
      'Please write it down',
      'Yes',
      'No',
      'Excuse me',
      'I need help'
    ],
    placeholderTts: "Write what you want to declare... The other individual will hear synthesized audio or view huge billboard characters.",
    btnSpeak: "Play Voice (Speak)",
    btnStop: "Cancel Audio",
    btnGiant: "Billboard Mode",
    btnClear: "Delete",
    btnSave: "Save",
    placeholderQuickPhrase: "Example: Hello, I am here for my prescription drugs...",
    addQuickPhraseTitle: "Save dynamic preset or custom routine:",
    btnSavePhrase: "Save Phrase",
    promptAiHelper: "Please, explain in a brief and simple manner the meaning or context of:",
    aiSuggestedPromptTitle: "Suggested questions:",
    aiSuggestedPrompt1: "👋 How to interact respectfully",
    aiSuggestedPrompt1Label: "Greeting",
    aiSuggestedPrompt2: "👄 Lip-reading basic tips",
    aiSuggestedPrompt2Label: "Lip-reading",
    aiSuggestedPrompt3: "⭐ Face-to-face inclusion tricks",
    aiSuggestedPrompt3Label: "Inclusion",
    aiSuggestedPrompt4: "👐 How to learn fingerspelling basis",
    aiSuggestedPrompt4Label: "Sign Language",
    navTabsLabel: "SERVICES",
    footerCredit: "Connecting Worlds • Engineered under rules of universal social cohesion.",
    billboardTitle: "Huge Billboard Display",
    billboardHelp: "Display this screen directly to the other participant to deliver your statement.",
    speakerMe: "Me",
    speakerOpponent: "Opponent",
    listeningActive: "TRANSCRIBING IN REAL-TIME...",
    listeningPaused: "MIC STOPPED. CLICK RE-LAUNCH TO SPEECH TRANSCRIPTION.",
    clearChat: "Clear history",
    consultAiBtn: "Ask AI for local details",
    aiLoading: "Assistant thinking logic response...",
    btnReset: "Reset Thread",
    summarizeBtn: "Generate Summary with AI",
    summarizeBoxTitle: "Would you like to analyze active transcript?",
    summarizeBoxDesc: "dialogue statements logged.",
  },
  ko: {
    title: "세상을 연결하다",
    subtitle: "대면 수화 및 청각 접근성을 위한 인공지능 어시스턴트",
    guideTitle: "공동체 지침 가이드",
    guideSubtitle: "존중 어린 소통",
    guideTip1: "🤝 시선 연락: 말하기 전에 눈을 맞추어 연대를 만들어가세요.",
    guideTip2: "👄 입모양 읽기: 적당한 속도로 조용히 발음하세요. 소리치지 마세요.",
    guideTip3: "👋 몸짓 동작: 소통할 때 편안하게 제스처를 사용해 보세요.",
    origen: "정상 작동",
    tabVoz: "음성 기록",
    tabEscribir: "음성 출력",
    tabAtajos: "자주 쓰는 문장",
    tabPizarra: "그림판",
    tabIa: "AI 비서",
    tabConfig: "환경 설정",
    tabVozDesc: "말하는 즉시 큰 텍스트로 보임",
    tabEscribirDesc: "문장을 스피커 음성으로 합성",
    tabAtajosDesc: "자주 쓰는 단어 및 일상 표현 라이브러리",
    tabPizarraDesc: "급할 때 손글씨나 도식 그림 그리기",
    tabIaDesc: "수어 알파벳 및 지난 대화 정밀 요약",
    tabConfigDesc: "인터페이스 설정 및 맞춤화 기능",
    configTitle: "환경 맞춤화",
    configDesc: "인터페이스 언어, 음성 합성(TTS) 목소리 성별, 테마를 제어할 수 있습니다.",
    selectLanguage: "화면 인코딩 언어:",
    voiceGender: "안내 목소리 성별:",
    voiceGenderMale: "남성 음성",
    voiceGenderFemale: "여성 음성",
    themeMode: "시각 테마 적용:",
    themeLight: "밝은 테마",
    themeDark: "어두운 테마",
    timeLabel: "오전/오후 시간",
    activeStatus: "음성 연결 상황 판독",
    presetsLabel: "신속 제어 핫키:",
    presets: [
      '안녕하세요',
      '좋은 아침입니다',
      '부탁드립니다',
      '감사합니다',
      '얼마인가요?',
      '화장실은 어디인가요?',
      '이해하지 못했습니다',
      '여기에 적어주세요',
      '예',
      '아니요',
      '죄송합니다',
      '도움이 필요합니다'
    ],
    placeholderTts: "얘기할 문장을 입력하십시오. 합성 스피치로 출력되거나 카드로 보기 버튼을 사용해 대각선에서도 보이게 할 수 있습니다.",
    btnSpeak: "말하기 출력 실행",
    btnStop: "음성 중지",
    btnGiant: "대형 카드로 보기",
    btnClear: "비우기",
    btnSave: "저장하기",
    placeholderQuickPhrase: "예: 안녕하세요, 처방전 약을 찾으러 왔습니다...",
    addQuickPhraseTitle: "커스텀 루틴 추가하기:",
    btnSavePhrase: "문구 세이브",
    promptAiHelper: "쉽고 간결하게 이 문장의 문맥이나 소통 팁을 알려주십시오:",
    aiSuggestedPromptTitle: "기타 제안 질문:",
    aiSuggestedPrompt1: "👋 존중하며 관계 시작 인사하기",
    aiSuggestedPrompt1Label: "인사법",
    aiSuggestedPrompt2: "👄 입 모양 읽을 때 유용한 조언",
    aiSuggestedPrompt2Label: "구독 조언",
    aiSuggestedPrompt3: "⭐ 대면 통합 복지 관련 요령",
    aiSuggestedPrompt3Label: "통합 요령",
    aiSuggestedPrompt4: "👐 기초 지문 수어 배우는 법",
    aiSuggestedPrompt4Label: "지문 수어",
    navTabsLabel: "기능",
    footerCredit: "세상을 연결하다 • 보편적 인류 복지 및 포용 원칙에 따른 디자인 구현.",
    billboardTitle: "초대형 디스플레이",
    billboardHelp: "상대방이 읽기 쉽도록 스마트폰이나 태블릿 화면을 보이며 소통하세요.",
    speakerMe: "나",
    speakerOpponent: "상대방",
    listeningActive: "현재 실시간 소리 인식 분석 중...",
    listeningPaused: "마이크 꺼짐. 시작 버튼을 터치해 인식하세요.",
    clearChat: "대화방 비우기",
    consultAiBtn: "AI 가이드 질문하기",
    aiLoading: "어시스턴트 지능형 연산 처리 중...",
    btnReset: "새 대화",
    summarizeBtn: "대화 요약본 생성",
    summarizeBoxTitle: "지나간 대화를 요약하시겠습니까?",
    summarizeBoxDesc: "개의 대사 기록을 정독합니다.",
  },
  ja: {
    title: "世界のつながり",
    subtitle: "対面音声の可視化と相互理解インクルージョン支援ツール",
    guideTitle: "共生の心得ガイド",
    guideSubtitle: "敬意を持った接し方",
    guideTip1: "🤝 アイコンタクト: 会話の前に、まず相手を見つめてください。",
    guideTip2: "👄 口の動き: ゆっくり落ちついて口を開けてください、叫ばないこと。",
    guideTip3: "👋 豊かな表現: 手振りを交えて明るくお伝えしましょう。",
    origen: "アクティブ",
    tabVoz: "音声文字変換",
    tabEscribir: "音声読み上げ",
    tabAtajos: "定型句",
    tabPizarra: "手書き掲示",
    tabIa: "AI相談箱",
    tabConfig: "システム設定",
    tabVozDesc: "声を大きく分かりやすい文字に",
    tabEscribirDesc: "書き込んだ文字をスピーチ再生",
    tabAtajosDesc: "よく使う言葉を一発ボタン登録",
    tabPizarraDesc: "急な図解やジェスチャー補佐に",
    tabIaDesc: "手話記号の疑問や内容要約AI",
    tabConfigDesc: "表示言語、合成音声、テーマ変更",
    configTitle: "環境のカスタマイズ設定",
    configDesc: "表示されるコントロール言語、TTS（合成音声の質・性別設定）、画面モードの色調を変更できます。",
    selectLanguage: "システムインターフェース言語:",
    voiceGender: "発音者の声音属性:",
    voiceGenderMale: "男性音声",
    voiceGenderFemale: "女性音声",
    themeMode: "色彩コントラスト:",
    themeLight: "ライトモード",
    themeDark: "ダークモード",
    timeLabel: "現在時刻",
    activeStatus: "マイク接続の判定",
    presetsLabel: "クイックショートカット:",
    presets: [
      'こんにちは',
      'おはようございます',
      'お願いします',
      'ありがとう',
      'いくらですか？',
      'トイレはどこですか？',
      '理解できません',
      '書いてください',
      'はい',
      'いいえ',
      'すみません',
      '助けが必要です'
    ],
    placeholderTts: "伝えたい言葉を書き込んでください。再生したり、フルスクリーン拡大で相手に見せたりできます。",
    btnSpeak: "発音を開始（スピーチ）",
    btnStop: "再生を停止",
    btnGiant: "デカ文字看板にする",
    btnClear: "クリア",
    btnSave: "保存",
    placeholderQuickPhrase: "例：処方箋の薬を取りに来ました...",
    addQuickPhraseTitle: "定型句・マイお気に入り追加:",
    btnSavePhrase: "定型句セーブ",
    promptAiHelper: "簡潔で分かりやすい日本語でこの会話の隠れた背景を補足・説明してください:",
    aiSuggestedPromptTitle: "お勧めAIクエリ:",
    aiSuggestedPrompt1: "👋 初対面での正しいマナー",
    aiSuggestedPrompt1Label: "マナー",
    aiSuggestedPrompt2: "👄 口唇読みの基本知識",
    aiSuggestedPrompt2Label: "リップ読み",
    aiSuggestedPrompt3: "⭐ 対面コミュニケーション成功の秘訣",
    aiSuggestedPrompt3Label: "秘訣",
    aiSuggestedPrompt4: "👐 基本的な指文字を覚えるコツ",
    aiSuggestedPrompt4Label: "指文字の基礎",
    navTabsLabel: "メニュー",
    footerCredit: "世界のつながり • 社会福祉と誰も取り残さないユニバーサル包摂デザイン。",
    billboardTitle: "カンペデカ文字看板",
    billboardHelp: "このタブレットやスマホ画面を相手に見せるだけで言葉がすぐ伝わります。",
    speakerMe: "自分",
    speakerOpponent: "相手",
    listeningActive: "周囲の会話のリアルタイム解析中...",
    listeningPaused: "マイク休止中。ボタンを押して解析スタート。",
    clearChat: "メッセージスレッド削除",
    consultAiBtn: "AI補助相談をする",
    aiLoading: "アシスタントが言葉を考えています...",
    btnReset: "新規会話",
    summarizeBtn: "会話サマリー要約生成",
    summarizeBoxTitle: "進行中のテキスト会話を要約しますか？",
    summarizeBoxDesc: "個の会話パラグラフが取得されました。",
  }
};
