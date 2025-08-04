import type { CallState } from '../components/VoiceCall/types';

export const getStateDisplay = (callState: CallState): string => {
  switch (callState) {
    case 'idle':
      return 'Ready to call';
    case 'connecting':
      return 'Connecting...';
    case 'listening':
      return 'Listening...';
    case 'speaking':
      return 'AI is speaking';
    case 'processing':
      return 'Processing...';
    default:
      return 'In call';
  }
};

export const getStateColor = (callState: CallState): string => {
  switch (callState) {
    case 'listening':
      return 'text-emerald-400';
    case 'speaking':
      return 'text-blue-400';
    case 'processing':
      return 'text-amber-400';
    case 'connecting':
      return 'text-orange-400';
    default:
      return 'text-slate-400';
  }
};

export const generateAIResponse = async (
  userMessage: string,
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<string> => {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: userMessage,
        history: conversationHistory,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get AI response');
    }

    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error('AI Response Error:', error);
    // Fallback responses for demo
    const fallbackResponses = [
      "I understand what you're saying. That's an interesting point.",
      "Thank you for sharing that with me. What else would you like to discuss?",
      "I hear you. Could you tell me more about that?",
      "That's a great question. Let me think about that for a moment.",
      "I appreciate you bringing that up. What are your thoughts on it?"
    ];
    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  }
};