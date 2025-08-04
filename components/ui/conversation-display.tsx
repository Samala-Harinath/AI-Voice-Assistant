'use client';

import React, { useEffect, useRef } from 'react';
import { Message } from '@/types/call';
import { cn } from '@/lib/utils';
import { User, Bot } from 'lucide-react';

interface ConversationDisplayProps {
  messages: Message[];
  isListening: boolean;
  currentTranscript?: string;
  className?: string;
}

export const ConversationDisplay: React.FC<ConversationDisplayProps> = ({
  messages,
  isListening,
  currentTranscript,
  className,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, currentTranscript]);

  return (
    <div className={cn('bg-white rounded-lg border border-gray-300 shadow-sm p-4', className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Conversation</h3>
        {isListening && (
          <div className="flex items-center space-x-2 text-blue-600">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
            <span className="text-sm">Listening...</span>
          </div>
        )}
      </div>
      
      <div
        ref={scrollRef}
        className="space-y-3 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
      >
        {messages.map((message, index) => (
          <div
            key={message.id || index}
            className={cn(
              'flex items-start space-x-3 p-3 rounded-lg',
              message.speaker === 'user' 
                ? 'bg-blue-50 border-l-4 border-blue-500' 
                : 'bg-gray-50 border-l-4 border-gray-500'
            )}
          >
            <div className={cn(
              'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
              message.speaker === 'user' ? 'bg-blue-500' : 'bg-gray-500'
            )}>
              {message.speaker === 'user' ? (
                <User className="w-4 h-4 text-white" />
              ) : (
                <Bot className="w-4 h-4 text-white" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-sm font-medium text-gray-900">
                  {message.speaker === 'user' ? 'You' : 'AI Assistant'}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-sm text-gray-800">{message.text}</p>
            </div>
          </div>
        ))}
        
        {currentTranscript && (
          <div className="flex items-start space-x-3 p-3 rounded-lg bg-blue-50 border-l-4 border-blue-500 opacity-70">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-sm font-medium text-gray-900">You</span>
                <span className="text-xs text-blue-600">Speaking...</span>
              </div>
              <p className="text-sm text-gray-800 italic">{currentTranscript}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};