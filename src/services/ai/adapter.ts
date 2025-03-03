import { getAIServiceConfig } from '../../config/config';

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

// DeepSeek Adapter
export class DeepSeekAdapter implements AIServiceAdapter {
  private apiKey: string;
  name = 'DeepSeek';
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }
  
  async generateResponse(prompt: string, options: any = {}): Promise<string> {
    try {
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: options.model || 'deepseek-chat',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: options.maxTokens || 500,
          temperature: options.temperature || 0.7
        })
      });
      
      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('DeepSeek API error:', error);
      throw new Error('Failed to generate response from DeepSeek');
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

// Self-Hosted Adapter
export class SelfHostedAdapter implements AIServiceAdapter {
  private apiEndpoint: string;
  private apiKey: string;
  name = 'Self-Hosted LLM';
  
  constructor(apiEndpoint: string, apiKey: string) {
    this.apiEndpoint = apiEndpoint;
    this.apiKey = apiKey;
  }
  
  async generateResponse(prompt: string, options: any = {}): Promise<string> {
    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: options.maxTokens || 500,
            temperature: options.temperature || 0.7,
            do_sample: true,
            top_p: 0.95
          }
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error (${response.status}): ${errorText}`);
      }
      
      const data = await response.json();
      return data.generated_text;
    } catch (error) {
      console.error('Self-hosted LLM error:', error);
      throw new Error('Failed to generate response from self-hosted model');
    }
  }
}

// AI Service Factory
export class AIServiceFactory {
  static createAdapter(providerOverride?: string): AIServiceAdapter {
    const config = getAIServiceConfig();
    const provider = providerOverride || config.type;
    
    switch (provider) {
      case 'deepseek':
        if (!config.deepseekApiKey) {
          throw new Error('API key is required for DeepSeek');
        }
        return new DeepSeekAdapter(config.deepseekApiKey);
      
      case 'self-hosted-chat':
        if (!config.apiKey || !config.endpoint) {
          throw new Error('API key and endpoint are required for self-hosted models');
        }
        return new SelfHostedAdapter(config.endpoint + '/api/chat', config.apiKey);
      
      case 'self-hosted-reasoning':
        if (!config.apiKey || !config.endpoint) {
          throw new Error('API key and endpoint are required for self-hosted models');
        }
        return new SelfHostedAdapter(config.endpoint + '/api/reasoning', config.apiKey);
      
      case 'mock':
      default:
        return new MockAIAdapter();
    }
  }
} 