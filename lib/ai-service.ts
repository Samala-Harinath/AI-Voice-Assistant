import { Message } from '@/types/call';
import { uuidv4 } from '@/hooks/uuid';


export class AIService {
  private phoneNumber: string = '9011615832';  // Default phone number

  constructor() {}

  async generateResponse(messages: Message[]): Promise<string> {
    try {
      // Get the last message from the user
      const lastMessage = messages[messages.length - 1]?.text || '';
      
      const url = `https://api.llamaworx.com/websearch?question=${encodeURIComponent(lastMessage)}&language=English&userchatid=${uuidv4()}&questionuid=${uuidv4()}&phoneno=${this.phoneNumber}`;
      
      const response = await fetch(url, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`Llamaworx API error: ${response.statusText}`);
      }

      // Log raw response text for debugging
      const rawText = await response.text();
      console.log("Raw API response:", rawText);

      // Check if the response starts with '{' which would indicate JSON
      if (rawText.trim().startsWith('{')) {
        try {
          const data = JSON.parse(rawText);
          if (!data || typeof data.answer !== 'string') {
            console.error('Unexpected API response structure:', data);
            throw new Error('Invalid response structure from API');
          }
          return data.answer;
        } catch (parseError) {
          console.error('Failed to parse API response as JSON:', parseError);
          // Fall through to plain text handling
        }
      }

      // Handle plain text response
      if (typeof rawText === 'string' && rawText.trim()) {
        return rawText.trim();
      }

      throw new Error('Empty or invalid response from API');
    } catch (error) { 
      console.error('AI Service Error:', error);
      throw error;
    }
  }
}

export const createAIService = () => new AIService();