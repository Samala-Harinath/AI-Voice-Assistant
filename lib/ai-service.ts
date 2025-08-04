import { Message } from '@/types/call';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export class AIService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateResponse(messages: Message[]): Promise<string> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key is required');
    }

    try {
      const response = await fetch(OPENAI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful AI assistant in a voice call. Keep responses conversational, natural, and concise. Respond as if you are speaking, not writing.',
            },
            ...messages.map(msg => ({
              role: msg.speaker === 'user' ? 'user' : 'assistant',
              content: msg.text,
            })),
          ],
          max_tokens: 150,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || 'I apologize, I could not generate a response.';
    } catch (error) {
      console.error('AI Service Error:', error);
      throw error;
    }
  }
}

export const createAIService = (apiKey: string) => new AIService(apiKey);