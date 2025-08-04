export interface CallState {
  isActive: boolean;
  isConnected: boolean;
  isMuted: boolean;
  isSpeakerOn: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  duration: number;
  status: 'idle' | 'connecting' | 'connected' | 'ended';
}

export interface Message {
  id: string;
  text: string;
  speaker: 'user' | 'ai';
  timestamp: number;
}

export interface AudioVisualizationData {
  volume: number;
  frequency: number[];
}

export interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}