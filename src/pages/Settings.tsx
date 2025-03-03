import React, { useEffect, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import Sidebar from '../components/layout/Sidebar';

const Settings: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState('en');
  
  // AI-modell inställningar
  const [aiModel, setAiModel] = useState('deepseek');
  const [apiKey, setApiKey] = useState('');
  const [hostingOption, setHostingOption] = useState('direct');
  const [apiEndpoint, setApiEndpoint] = useState('');

  // Ladda användardata (mockad för tillfället)
  useEffect(() => {
    // Simulerar inladdning av användardata
    setTimeout(() => {
      setUsername('John Doe');
      setEmail('john.doe@example.com');
      
      // Ladda sparade AI-inställningar från localStorage
      const savedApiKey = localStorage.getItem('aiApiKey');
      const savedModel = localStorage.getItem('aiModel');
      const savedHosting = localStorage.getItem('aiHosting');
      
      if (savedApiKey) setApiKey(savedApiKey);
      if (savedModel) setAiModel(savedModel);
      if (savedHosting) setHostingOption(savedHosting);
    }, 500);
  }, []);

  const handleSaveSettings = () => {
    // Spara AI-inställningar
    localStorage.setItem('aiApiKey', apiKey);
    localStorage.setItem('aiModel', aiModel);
    localStorage.setItem('aiHosting', hostingOption);
    
    // Implementera annan sparfunktion här
    alert('Inställningar sparade!');
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar userName="John Doe" isDarkMode={theme === 'dark'} />
      <div className="flex-1 p-8 overflow-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Inställningar</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Utseende</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tema</label>
            <div className="flex space-x-4">
              <button
                onClick={() => setTheme('light')}
                className={`px-4 py-2 rounded-md ${
                  theme === 'light' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                }`}
              >
                Ljust
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`px-4 py-2 rounded-md ${
                  theme === 'dark' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                }`}
              >
                Mörkt
              </button>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">AI-modell</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Välj AI-modell</label>
            <select
              value={aiModel}
              onChange={(e) => setAiModel(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="mock">Development (Mock)</option>
              <option value="deepseek">DeepSeek API</option>
              <option value="self-hosted-chat">Self-Hosted DeepSeek Chat</option>
              <option value="self-hosted-reasoning">Self-Hosted DeepSeek Reasoning</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">API-nyckel</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Ange din API-nyckel här"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          {(aiModel === 'self-hosted-chat' || aiModel === 'self-hosted-reasoning') && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">API Endpoint</label>
              <input
                type="text"
                value={apiEndpoint}
                onChange={(e) => setApiEndpoint(e.target.value)}
                placeholder="https://your-domain.com"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          )}
        </div>
        
        <button
          onClick={handleSaveSettings}
          className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
        >
          Spara inställningar
        </button>
      </div>
    </div>
  );
};

export default Settings; 