'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { SpeechRecognitionResult } from '@/types/call';

interface UseSpeechRecognitionProps {
  onResult: (result: SpeechRecognitionResult) => void;
  onError: (error: any) => void;
  continuous?: boolean;
  interimResults?: boolean;
}

export const useSpeechRecognition = ({
  onResult,
  onError,
  continuous = true,
  interimResults = true,
}: UseSpeechRecognitionProps) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      setIsSupported(!!SpeechRecognition);
      
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = continuous;
        recognitionRef.current.interimResults = interimResults;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0])
            .map((result: any) => result.transcript)
            .join('');

          const confidence = event.results[event.results.length - 1][0].confidence;
          const isFinal = event.results[event.results.length - 1].isFinal;

          onResult({ transcript, confidence, isFinal });
        };

        recognitionRef.current.onerror = onError;
        recognitionRef.current.onend = () => setIsListening(false);
      }
    }
  }, [continuous, interimResults, onResult, onError]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        onError(error);
      }
    }
  }, [isListening, onError]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [isListening]);

  return {
    isListening,
    isSupported,
    startListening,
    stopListening,
  };
};