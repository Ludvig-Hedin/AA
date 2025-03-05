import React, { useState, useEffect } from 'react';
import { PageContainer } from '../components/PageContainer';
import Sidebar from '../components/layout/Sidebar';
import { SendIcon } from '../components/icons/SendIcon';
import { sendMessageToAI } from '../services/aiService';
import { startBrowserTask, getBrowserTaskStatus, sendMessageToBrowserTask } from '../services/browserUseService';

export default function ComputerUsePage() {
  const [userName, setUserName] = useState('User');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [userInput, setUserInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [taskId, setTaskId] = useState<string | null>(null);
  const [browserUrl, setBrowserUrl] = useState('');
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);

  // Load user info from localStorage
  useEffect(() => {
    const storedUserName = localStorage.getItem('userName');
    if (storedUserName) {
      setUserName(storedUserName);
    }
    
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark') {
      setIsDarkMode(true);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    
    const userInputText = inputValue;
    setUserInput(userInputText);
    setInputValue('');
    setIsProcessing(true);
    
    try {
      const response = await sendMessageToAI(userInputText);
      setAiResponse(response.message || 'No response from AI');
    } catch (error) {
      setAiResponse('Error communicating with AI');
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStartTask = async () => {
    if (!inputValue.trim()) return;
    
    const userInputText = inputValue;
    setUserInput(userInputText);
    setInputValue('');
    setIsProcessing(true);
    setMessages([{ role: 'user', content: userInputText }]);
    
    try {
      const response = await startBrowserTask(userInputText);
      if (response.task_id) {
        setTaskId(response.task_id);
        pollTaskStatus(response.task_id);
      }
      
      if (response.data?.currentUrl) {
        setBrowserUrl(response.data.currentUrl);
      }
      
      setMessages(prev => [...prev, { role: 'assistant', content: `Task started: ${response.message}` }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'system', content: 'Error starting task' }]);
    }
  };

  const pollTaskStatus = async (id: string) => {
    try {
      const response = await getBrowserTaskStatus(id);
      
      if (response.data?.currentUrl) {
        setBrowserUrl(response.data.currentUrl);
      }
      
      if (response.data?.reasoning) {
        const reasoningText = response.data.reasoning;
        setMessages(prev => {
          // Check if this reasoning is already in messages to avoid duplicates
          if (!prev.some(m => m.role === 'assistant' && m.content === reasoningText)) {
            return [...prev, { role: 'assistant', content: reasoningText }];
          }
          return prev;
        });
      }
      
      if (response.status === 'running' || response.status === 'pending') {
        // Continue polling
        setTimeout(() => pollTaskStatus(id), 3000);
      } else {
        setIsProcessing(false);
        setMessages(prev => [...prev, { role: 'system', content: `Task completed with status: ${response.status}` }]);
      }
    } catch (error) {
      console.error(error);
      setIsProcessing(false);
      setMessages(prev => [...prev, { role: 'system', content: 'Error polling task status' }]);
    }
  };

  return (
    <div className="flex h-screen" style={{ backgroundColor: '#131314' }}>
      {/* Sidebar */}
      <Sidebar userName={userName} isDarkMode={isDarkMode} activePage="computerUse" />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden" style={{ backgroundColor: '#131314' }}>
        <PageContainer>
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-2">Computer Use</h1>
            <p className="text-gray-400 mb-8">Let AI control your computer to perform tasks for you</p>
            
            {userInput && (
              <div className="mb-6">
                <h2 className="text-lg font-medium mb-2">Your request:</h2>
                <div className="p-3 bg-gray-800 rounded-md">{userInput}</div>
                
                {isProcessing ? (
                  <div className="mt-4 text-blue-400">Processing your request...</div>
                ) : (
                  <div className="mt-4 text-green-400">Task completed! Ask something else below.</div>
                )}
              </div>
            )}
            
            {/* Text input at bottom */}
            <div className="input-container mt-auto">
              <input
                type="text"
                className="text-input"
                placeholder="Ask anything, use @ to tag files and collections"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
              />
              <button className="send-button" onClick={handleSend}>
                <SendIcon />
              </button>
            </div>

            <button 
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md mt-4"
              onClick={handleStartTask}
            >
              Start Task
            </button>
          </div>
        </PageContainer>
      </div>
    </div>
  );
} 