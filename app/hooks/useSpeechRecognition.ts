"use client";

import { useRef, useEffect } from 'react';
import type { SpeechRecognition } from '../components/VoiceCall/types';

export function useSpeechRecognition() {
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        recognitionRef.current = recognition;
      }
    }
  }, []);

  const stopRecognition = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.log('Recognition was already stopped');
      }
    }
  };

  return {
    recognition: recognitionRef.current,
    stopRecognition
  };
}