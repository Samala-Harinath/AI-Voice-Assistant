"use client";

import type { Message } from './types';

interface ConversationHistoryProps {
  messages: Message[];
}

export function ConversationHistory({ messages }: ConversationHistoryProps) {
  if (messages.length === 0) return null;

  return (
    <div className="max-h-48 overflow-y-auto space-y-3 mb-4">
      <div className="text-white/60 text-xs font-medium mb-2">Recent Conversation</div>
      {messages.slice(-4).map((msg, index) => (
        <div
          key={index}
          className={`p-3 rounded-2xl text-sm leading-relaxed transition-all duration-300 ${
            msg.role === 'user'
              ? 'bg-blue-500/20 text-blue-100 ml-6 border border-blue-500/20'
              : 'bg-white/10 text-white/90 mr-6 border border-white/10'
          }`}
        >
          <span className="font-medium text-xs opacity-70 block mb-1">
            {msg.role === 'user' ? 'You' : 'AI Assistant'}
          </span>
          <span>{msg.content}</span>
        </div>
      ))}
    </div>
  );
}