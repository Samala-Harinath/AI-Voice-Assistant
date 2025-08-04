'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AudioVisualizer } from '@/components/ui/audio-visualizer';
import { CallControls } from '@/components/ui/call-controls';
import { ConnectionStatus } from '@/components/ui/connection-status';
import { ConversationDisplay } from '@/components/ui/conversation-display';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { useCallTimer } from '@/hooks/useCallTimer';
import { createAIService } from '@/lib/ai-service';
import { CallState, Message } from '@/types/call';
import { Settings, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { uuidv4 } from '@/hooks/uuid';

export const VoiceCallInterface: React.FC = () => {
  const [callState, setCallState] = useState<CallState>({
    isActive: false,
    isConnected: false,
    isMuted: false,
    isSpeakerOn: false,
    isListening: false,
    isSpeaking: false,
    duration: 0,
    status: 'idle',
  });

  const [messages, setMessages] = useState<Message[]>([]);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [apiKey, setApiKey] = useState('');
  // const [showSettings, setShowSettings] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGeneratingResponse, setIsGeneratingResponse] = useState(false);

  const { duration, formattedDuration } = useCallTimer(callState.isActive);

  const handleSpeechResult = useCallback((result: any) => {
    setCurrentTranscript(result.transcript);
    
    if (result.isFinal && result.transcript.trim()) {
      const userMessage: Message = {
        id: uuidv4(),
        text: result.transcript.trim(),
        speaker: 'user',
        timestamp: Date.now(),
      };
      
      setMessages(prev => [...prev, userMessage]);
      setCurrentTranscript('');
      
      // Generate AI response
      generateAIResponse([...messages, userMessage]);
    }
  }, [messages, apiKey]);

  const handleSpeechError = useCallback((error: any) => {
    setError(`Speech recognition error: ${error.message}`);
    setTimeout(() => setError(null), 5000);
  }, []);

  const { isListening, isSupported: speechSupported, startListening, stopListening } = 
    useSpeechRecognition({
      onResult: handleSpeechResult,
      onError: handleSpeechError,
    });

  const handleTTSStart = useCallback(() => {
    setCallState(prev => ({ ...prev, isSpeaking: true }));
  }, []);

  const handleTTSEnd = useCallback(() => {
    setCallState(prev => ({ ...prev, isSpeaking: false }));
    if (callState.isActive && !callState.isMuted) {
      startListening();
    }
  }, [callState.isActive, callState.isMuted, startListening]);

  const { speak, stop: stopSpeaking, isSpeaking, isSupported: ttsSupported } = 
    useTextToSpeech({
      onStart: handleTTSStart,
      onEnd: handleTTSEnd,
      onError: (error) => setError(`Text-to-speech error: ${error.message}`),
    });

  const generateAIResponse = async (messageHistory: Message[]) => {
    try {
      setIsGeneratingResponse(true);
      stopListening();
      const aiService = createAIService();
      const response = await aiService.generateResponse(messageHistory);
      
      const aiMessage: Message = {
        id: uuidv4(),
        text: response,
        speaker: 'ai',
        timestamp: Date.now(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
      speak(response);
    } catch (error: any) {
      setError(`AI response error: ${error.message}`);
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsGeneratingResponse(false);
    }
  };

  const handleStartCall = useCallback(() => {
    setApiKey("array dependency")
    setCallState(prev => ({ 
      ...prev, 
      isActive: true, 
      status: 'connecting' 
    }));

    // Simulate connection delay
    setTimeout(() => {
      setCallState(prev => ({ 
        ...prev, 
        isConnected: true, 
        status: 'connected',
        isListening: true 
      }));
      startListening();
    }, 2000);
  }, [apiKey, startListening]);

  const handleEndCall = useCallback(() => {
    stopListening();
    stopSpeaking();
    setCallState({
      isActive: false,
      isConnected: false,
      isMuted: false,
      isSpeakerOn: false,
      isListening: false,
      isSpeaking: false,
      duration: 0,
      status: 'ended',
    });
    setCurrentTranscript('');
    
    // Reset status after a delay
    setTimeout(() => {
      setCallState(prev => ({ ...prev, status: 'idle' }));
    }, 3000);
  }, [stopListening, stopSpeaking]);

  const handleToggleMute = useCallback(() => {
    setCallState(prev => {
      const newMuted = !prev.isMuted;
      if (newMuted) {
        stopListening();
      } else if (prev.isActive && !prev.isSpeaking) {
        startListening();
      }
      return { ...prev, isMuted: newMuted };
    });
  }, [startListening, stopListening]);

  const handleToggleSpeaker = useCallback(() => {
    setCallState(prev => ({ ...prev, isSpeakerOn: !prev.isSpeakerOn }));
  }, []);

  useEffect(() => {
    setCallState(prev => ({ 
      ...prev, 
      isListening: isListening && !prev.isMuted,
      isSpeaking 
    }));
  }, [isListening, isSpeaking]);

  if (!speechSupported || !ttsSupported) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Browser Not Supported
            </h2>
            <p className="text-gray-600">
              Your browser doesn't support the required speech features. 
              Please use a modern browser like Chrome or Edge.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Voice Assistant</h1>
            <p className="text-gray-600">Have a natural conversation with AI</p>
          </div>
          {/* <Button
            variant="outline"
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center space-x-2 text-gray-700 cursor-pointer"
          >
            <Settings className="w-4 h-4 " />
            <span>Settings</span>
          </Button> */}
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Settings Panel */}
          {/* <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="apiKey">OpenAI API Key</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your OpenAI API key"
                    className="mt-1"
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    Your API key is stored locally and never sent to our servers.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card> */}

        {/* Main Call Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Call Panel */}
          <Card className="lg:col-span-1">
            <CardContent className="p-8 text-center space-y-6">
              {/* Connection Status */}
              <ConnectionStatus 
                status={callState.status} 
                duration={formattedDuration}
                className="justify-center"
              />

              {/* Audio Visualizer */}
              <div className="flex flex-col items-center space-y-4">
                <div className="w-24 h-24 bg-[#c3ddf7] rounded-full flex items-center justify-center shadow-lg">
                  <AudioVisualizer 
                    isActive={callState.isActive}
                    isSpeaking={callState.isSpeaking || isListening}
                    className="text-white"
                  />
                </div>
                
                {callState.isActive && (
                  <div className="text-center">
                    <p className="text-lg font-semibold text-gray-900">
                      {isGeneratingResponse ? 'Generating response...' :
                       callState.isSpeaking ? 'AI Speaking...' : 
                       isListening ? 'Listening...' : 
                       callState.isMuted ? 'Muted' : 'Ready'}
                    </p>
                    {currentTranscript && (
                      <p className="text-sm text-blue-600 italic mt-2">
                        "{currentTranscript}"
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Call Controls */}
              <CallControls
                isActive={callState.isActive}
                isMuted={callState.isMuted}
                isSpeakerOn={callState.isSpeakerOn}
                onStartCall={handleStartCall}
                onEndCall={handleEndCall}
                onToggleMute={handleToggleMute}
                onToggleSpeaker={handleToggleSpeaker}
              />
            </CardContent>
          </Card>

          {/* Conversation Panel */}
          <div className="lg:col-span-1">
            <ConversationDisplay
              messages={messages}
              isListening={isListening}
              currentTranscript={currentTranscript}
              className="h-full min-h-96"
            />
          </div>
        </div>
      </div>
    </div>
  );
};