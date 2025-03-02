import { AIServiceAdapter } from './mock-ai';

// This would be expanded in a real implementation to include more sophisticated
// AI service management, model selection, and context handling

export type AIModelProvider = 'openai' | 'anthropic' | 'local-deepseek' | 'local-qwen';

export interface AIServiceConfig {
  provider: AIModelProvider;
  apiKey?: string;
  modelName?: string;
  temperature?: number;
  maxTokens?: number;
}

export class AIService {
  private adapter: AIServiceAdapter;
  private config: AIServiceConfig;
  
  constructor(config: AIServiceConfig) {
    this.config = config;
    this.adapter = new AIServiceAdapter(config.provider);
  }
  
  async generateResponse(prompt: string, context: string[] = []): Promise<string> {
    try {
      return await this.adapter.generateResponse(prompt, context);
    } catch (error) {
      console.error('Error generating AI response:', error);
      throw new Error('Failed to generate AI response');
    }
  }
  
  async streamResponse(prompt: string, callback: (chunk: string) => void): Promise<void> {
    try {
      await this.adapter.streamResponse(prompt, callback);
    } catch (error) {
      console.error('Error streaming AI response:', error);
      throw new Error('Failed to stream AI response');
    }
  }
  
  // This would be expanded to include more sophisticated context management
  // using ChromaDB for vector storage and retrieval
  async getRelevantContext(query: string): Promise<string[]> {
    // In a real implementation, this would query ChromaDB for relevant context
    return [];
  }
}

// Factory function to create an AI service with the appropriate configuration
export function createAIService(config: Partial<AIServiceConfig> = {}): AIService {
  const defaultConfig: AIServiceConfig = {
    provider: 'openai',
    modelName: 'gpt-4',
    temperature: 0.7,
    maxTokens: 2048,
  };
  
  return new AIService({
    ...defaultConfig,
    ...config,
  });
}