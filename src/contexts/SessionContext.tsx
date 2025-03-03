import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { getCurrentUser, signInWithEmail, signUpWithEmail } from '../services/supabase';

// Define the session interface
interface Session {
  user: {
    id: string;
    email: string;
  } | null;
}

// Define the context type
interface SessionContextType {
  session: Session | null;
  loading: boolean;
  setSession: (session: Session | null) => void;
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Create context with default values
const SessionContext = createContext<SessionContextType>({
  session: null,
  loading: true,
  setSession: () => {},
  login: async () => {},
  signUp: async () => {},
  logout: async () => {}
});

// Custom hook to use the session context
export const useSession = () => useContext(SessionContext);

// Provider component
export const SessionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          setSession({
            user: {
              id: user.id,
              email: user.email || ''
            }
          });
        }
      } catch (error) {
        console.error('Error checking user session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    const user = await signInWithEmail(email, password);
    if (user) {
      setSession({
        user: {
          id: user.id,
          email: user.email || ''
        }
      });
    }
  };

  // Sign up function
  const signUp = async (email: string, password: string) => {
    const user = await signUpWithEmail(email, password);
    if (user) {
      setSession({
        user: {
          id: user.id,
          email: user.email || ''
        }
      });
    }
  };

  // Logout function
  const logout = async () => {
    // Add logout logic here
    setSession(null);
  };

  return (
    <SessionContext.Provider value={{ session, loading, setSession, login, signUp, logout }}>
      {children}
    </SessionContext.Provider>
  );
};

export default SessionContext; 