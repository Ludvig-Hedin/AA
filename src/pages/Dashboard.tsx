import React, { useEffect, useState } from 'react';
import { getCurrentUser } from '../services/supabase';
import ChatInterface from '../components/chat/ChatInterface';

const Dashboard: React.FC = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  useEffect(() => {
    // Get current user
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser();
        setUserName(user.email);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();

    // Set up dark mode listener
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleDarkModeChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
      document.documentElement.classList.toggle('dark', e.matches);
    };

    darkModeMediaQuery.addEventListener('change', handleDarkModeChange);
    
    // Initialize dark mode
    document.documentElement.classList.toggle('dark', isDarkMode);

    return () => {
      darkModeMediaQuery.removeEventListener('change', handleDarkModeChange);
    };
  }, []);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-[#121314] text-[#FFFEFC]' : 'bg-[#FFFEFC] text-[#040404]'}`}>
      <header className="border-b border-gray-300 dark:border-[#434343] p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">AI Assistant</h1>
          <div className="flex items-center space-x-4">
            <span>{userName || 'User'}</span>
            <button 
              onClick={() => {
                const newMode = !isDarkMode;
                setIsDarkMode(newMode);
                document.documentElement.classList.toggle('dark', newMode);
              }}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {isDarkMode ? '🌙' : '☀️'}
            </button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto p-4 flex-1 h-[calc(100vh-80px)]">
        <ChatInterface />
      </main>
    </div>
  );
};

export default Dashboard; 