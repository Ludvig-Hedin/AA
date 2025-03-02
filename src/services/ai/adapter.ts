// AI Service Adapter Interface
export interface AIServiceAdapter {
  generateResponse: (prompt: string, options?: any) => Promise<string>;
  name: string;
}

// OpenAI Adapter
export class OpenAIAdapter implements AIServiceAdapter {
  private apiKey: string;
  name = 'OpenAI';
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }
  
  async generateResponse(prompt: string, options: any = {}): Promise<string> {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: options.model || 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: options.maxTokens || 500,
          temperature: options.temperature || 0.7
        })
      });
      
      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error('Failed to generate response from OpenAI');
    }
  }
}

// Anthropic Adapter
export class AnthropicAdapter implements AIServiceAdapter {
  private apiKey: string;
  name = 'Anthropic';
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }
  
  async generateResponse(prompt: string, options: any = {}): Promise<string> {
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: options.model || 'claude-2',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: options.maxTokens || 500
        })
      });
      
      const data = await response.json();
      return data.content[0].text;
    } catch (error) {
      console.error('Anthropic API error:', error);
      throw new Error('Failed to generate response from Anthropic');
    }
  }
}

// Mock Adapter for Development
export class MockAIAdapter implements AIServiceAdapter {
  name = 'Development AI';
  
  async generateResponse(prompt: string): Promise<string> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return `This is a mock response to: "${prompt}"\n\nIn a production environment, this would be replaced with a real AI response from an API.`;
  }
}

// AI Service Factory
export class AIServiceFactory {
  static createAdapter(type: string, apiKey?: string): AIServiceAdapter {
    switch (type) {
      case 'openai':
        if (!apiKey) throw new Error('API key required for OpenAI');
        return new OpenAIAdapter(apiKey);
      case 'anthropic':
        if (!apiKey) throw new Error('API key required for Anthropic');
        return new AnthropicAdapter(apiKey);
      case 'mock':
      default:
        return new MockAIAdapter();
    }
  }
} 