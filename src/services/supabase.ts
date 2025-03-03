import { createClient } from '@supabase/supabase-js';
import { getSupabaseConfig } from '../config/config';

// TypeScript interface for Vite's import.meta.env
interface ImportMetaEnv {
  VITE_SUPABASE_URL: string;
  VITE_SUPABASE_ANON_KEY: string;
}

// Augment the existing ImportMeta interface
declare global {
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

const { url, anonKey } = getSupabaseConfig();

// Initialize Supabase client
if (!url || !anonKey) {
  console.error('⚠️ Missing Supabase environment variables');
  console.error('Please check that your .env file contains:');
  console.error('VITE_SUPABASE_URL=your_supabase_url');
  console.error('VITE_SUPABASE_ANON_KEY=your_supabase_anon_key');
}

// Create the client even with empty strings for development - will fail gracefully
export const supabase = createClient(url, anonKey);

// Authentication functions
export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
};

// Alias for signUp to match the name used in SessionContext
export const signUpWithEmail = signUp;

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
};

// Alias for signIn to match the name used in SessionContext
export const signInWithEmail = signIn;

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// Map of OAuth providers status
export const oauthProviders = {
  google: { enabled: true, name: 'Google' },
  apple: { enabled: false, name: 'Apple' },
  microsoft: { enabled: false, name: 'Microsoft' }
};

export const signInWithOAuth = async (provider: 'google' | 'apple' | 'microsoft') => {
  try {
    // Check if the provider is available in our configuration
    if (!oauthProviders[provider]) {
      throw new Error(`Provider ${provider} is not supported at this time.`);
    }
    
    // Check if the provider is enabled
    if (!oauthProviders[provider].enabled) {
      throw new Error(`${oauthProviders[provider].name} authentication is currently unavailable. Please try another sign-in method.`);
    }
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      }
    });
    
    if (error) {
      // Handle specific errors better 
      if (error.message.includes('Provider not enabled')) {
        throw new Error(`${oauthProviders[provider].name} sign-in is not properly configured in Supabase. Please use another sign-in method.`);
      }
      throw error;
    }
    
    return data;
  } catch (error: any) {
    console.error(`OAuth error with ${provider}:`, error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data.user;
};

export const isAuthenticated = async () => {
  const { data } = await supabase.auth.getSession();
  return !!data.session;
};

// Password reset function
export const resetPassword = async (email: string) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  
  if (error) throw error;
  return data;
};

// Verify email with token
export const verifyEmail = async (token: string) => {
  const { error } = await supabase.auth.verifyOtp({
    token_hash: token,
    type: 'email'
  });
  
  if (error) {
    throw new Error(error.message);
  }
  
  return true;
}; 