'use client';

import { useState, useCallback, useRef } from 'react';

interface UseTextToSpeechProps {
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: any) => void;
}

export const useTextToSpeech = ({ onStart, onEnd, onError }: UseTextToSpeechProps = {}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useState(() => {
    if (typeof window !== 'undefined') {
      setIsSupported('speechSynthesis' in window);
    }
  });

  const speak = useCallback((text: string, options?: { rate?: number; pitch?: number; volume?: number }) => {
    if (!isSupported || !text) return;

    // Cancel any existing speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options?.rate || 1;
    utterance.pitch = options?.pitch || 1;
    utterance.volume = options?.volume || 1;

    utterance.onstart = () => {
      setIsSpeaking(true);
      onStart?.();
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      onEnd?.();
    };

    utterance.onerror = (error) => {
      setIsSpeaking(false);
      onError?.(error);
    };

    utteranceRef.current = utterance;
    speechSynthesis.speak(utterance);
  }, [isSupported, onStart, onEnd, onError]);

  const stop = useCallback(() => {
    if (isSupported) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [isSupported]);

  return {
    speak,
    stop,
    isSpeaking,
    isSupported,
  };
};