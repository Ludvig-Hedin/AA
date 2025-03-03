// Typer för konfiguration
export interface AIServiceConfig {
  type: string;
  endpoint?: string;
  apiKey?: string;
}

export interface AppConfig {
  name: string;
  defaultLanguage: string;
  enableAnalytics: boolean;
}

// Funktion för att hämta AI-tjänstkonfiguration
export const getAIServiceConfig = (): AIServiceConfig => {
  return {
    type: import.meta.env.VITE_AI_SERVICE_TYPE || 'mock',
    endpoint: import.meta.env.VITE_AI_ENDPOINT,
    apiKey: import.meta.env.VITE_AI_API_KEY,
    // Specifika API-nycklar för olika tjänster
    deepseekApiKey: import.meta.env.VITE_DEEPSEEK_API_KEY,
    openaiApiKey: import.meta.env.VITE_OPENAI_API_KEY,
    anthropicApiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
  };
};

// Funktion för att hämta Supabase-konfiguration
export const getSupabaseConfig = () => {
  return {
    url: import.meta.env.VITE_SUPABASE_URL,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  };
};

// Funktion för att hämta appkonfiguration
export const getAppConfig = (): AppConfig => {
  return {
    name: import.meta.env.VITE_APP_NAME || 'AI Assistant',
    defaultLanguage: import.meta.env.VITE_DEFAULT_LANGUAGE || 'en',
    enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  };
};

// Export av alla konfigurationer
export default {
  ai: getAIServiceConfig(),
  supabase: getSupabaseConfig(),
  app: getAppConfig(),
}; 