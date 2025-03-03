import { AIAdapter } from './adapter';

export class DeepSeekAIAdapter implements AIAdapter {
  private apiKey: string;
  private apiEndpoint: string = 'https://api.deepseek.com/v1/chat/completions'; // Detta är en exempel-URL, kolla upp den verkliga URL:en

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateResponse(prompt: string): Promise<string> {
    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat', // Ersätt med korrekt modellnamn
          messages: [
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to generate response');
      }

      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error generating AI response:', error);
      throw error;
    }
  }
} 