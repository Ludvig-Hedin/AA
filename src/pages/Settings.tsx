import React, { useEffect, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import Sidebar from '../components/layout/Sidebar';

const Settings: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState('en');
  
  // AI model settings
  const [aiModel, setAiModel] = useState('deepseek');
  const [apiKey, setApiKey] = useState('');
  const [hostingOption, setHostingOption] = useState('direct');
  const [apiEndpoint, setApiEndpoint] = useState('');

  // Load user data (mocked for now)
  useEffect(() => {
    // Simulating loading user data
    setTimeout(() => {
      setUsername('John Doe');
      setEmail('john.doe@example.com');
      
      // Load saved AI settings from localStorage
      const savedApiKey = localStorage.getItem('aiApiKey');
      const savedModel = localStorage.getItem('aiModel');
      const savedHosting = localStorage.getItem('aiHosting');
      const savedLanguage = localStorage.getItem('language');
      
      if (savedApiKey) setApiKey(savedApiKey);
      if (savedModel) setAiModel(savedModel);
      if (savedHosting) setHostingOption(savedHosting);
      if (savedLanguage) setLanguage(savedLanguage);
    }, 500);
  }, []);

  const handleSaveSettings = () => {
    // Save AI settings
    localStorage.setItem('aiApiKey', apiKey);
    localStorage.setItem('aiModel', aiModel);
    localStorage.setItem('aiHosting', hostingOption);
    localStorage.setItem('language', language);
    
    // Implement other save functionality here
    alert('Settings saved!');
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar userName="John Doe" isDarkMode={theme === 'dark'} />
      <div className="flex-1 p-8 overflow-auto bg-background">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Settings</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Appearance</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Theme</label>
            <div className="flex space-x-4">
              <button
                onClick={() => setTheme('light')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  theme === 'light' 
                    ? 'bg-blue-500 text-white shadow-sm' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                Light
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  theme === 'dark' 
                    ? 'bg-blue-500 text-white shadow-sm' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                Dark
              </button>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Language</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="en">English</option>
              <option value="sv">Swedish</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">AI Model</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select AI Model</label>
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">API Key</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your API key here"
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
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default Settings; 