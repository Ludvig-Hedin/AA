"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

type User = {
  id: string;
  email: string;
  name?: string;
  image?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signInWithMicrosoft: () => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check for existing session on mount
    const checkSession = async () => {
      try {
        // This would be replaced with actual API call to validate session
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error('Session validation error:', err);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      // This would be replaced with actual API call
      // Simulating authentication for demo purposes
      if (email && password) {
        const mockUser = {
          id: '123',
          email,
          name: email.split('@')[0],
        };
        setUser(mockUser);
        localStorage.setItem('user', JSON.stringify(mockUser));
        toast.success('Signed in successfully');
        router.push('/dashboard');
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
      toast.error(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      // This would be replaced with actual OAuth implementation
      toast.info('Google authentication will be implemented');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google');
      toast.error(err.message || 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  const signInWithApple = async () => {
    setLoading(true);
    setError(null);
    try {
      // This would be replaced with actual OAuth implementation
      toast.info('Apple authentication will be implemented');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Apple');
      toast.error(err.message || 'Failed to sign in with Apple');
    } finally {
      setLoading(false);
    }
  };

  const signInWithMicrosoft = async () => {
    setLoading(true);
    setError(null);
    try {
      // This would be replaced with actual OAuth implementation
      toast.info('Microsoft authentication will be implemented');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Microsoft');
      toast.error(err.message || 'Failed to sign in with Microsoft');
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name?: string) => {
    setLoading(true);
    setError(null);
    try {
      // This would be replaced with actual API call
      if (email && password) {
        const mockUser = {
          id: '123',
          email,
          name: name || email.split('@')[0],
        };
        setUser(mockUser);
        localStorage.setItem('user', JSON.stringify(mockUser));
        toast.success('Account created successfully');
        router.push('/dashboard');
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
      toast.error(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      // This would be replaced with actual API call
      setUser(null);
      localStorage.removeItem('user');
      toast.success('Signed out successfully');
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Failed to sign out');
      toast.error(err.message || 'Failed to sign out');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      // This would be replaced with actual API call
      toast.success('Password reset email sent');
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
      toast.error(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    signIn,
    signInWithGoogle,
    signInWithApple,
    signInWithMicrosoft,
    signUp,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};