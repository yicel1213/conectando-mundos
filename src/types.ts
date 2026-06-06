/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface QuickPhrase {
  id: string;
  text: string;
  category: 'general' | 'ayuda' | 'preguntas' | 'comercio' | 'personalizado';
  speechText?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

export interface TranscriptionItem {
  id: string;
  text: string;
  timestamp: string;
  speaker: 'Oponente' | 'Yo';
}

export interface GeminiResponse {
  success: boolean;
  text?: string;
  error?: string;
}
