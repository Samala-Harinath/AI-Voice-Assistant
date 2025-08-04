"use client";

import { useRef, useEffect, useCallback } from 'react';

export function useSpeechSynthesis() {
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  const speak = useCallback((
    text: string,
    onStart?: (event: SpeechSynthesisEvent) => void,
    onEnd?: (event: SpeechSynthesisEvent) => void,
    onError?: (event: SpeechSynthesisEvent) => void
  ) => {
    if (!synthRef.current) return;

    // Cancel any ongoing speech
    synthRef.current.cancel();
    
    // Small delay to ensure previous speech is fully cancelled
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = onStart || null;
      utterance.onend = onEnd || null;
      utterance.onerror = onError || null;

      try {
        synthRef.current?.speak(utterance);
      } catch (error) {
        console.error('Failed to start speech:', error);
        if (onError) {
          const errorEvent = new SpeechSynthesisEvent('error', {
            utterance,
            charIndex: 0,
            charLength: text.length,
            elapsedTime: 0,
            name: 'error'
          });
          onError(errorEvent);
        }
      }
    }, 100);
  }, []);

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
  };

  return {
    synthesis: synthRef.current,
    speak,
    stopSpeaking
  };
}