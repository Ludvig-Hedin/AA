import React, { useState, useEffect } from 'react';
import { PageContainer } from '../components/PageContainer';
import Sidebar from '../components/layout/Sidebar';
import { PageHeader } from '../components/PageHeader';
import { ChatWithBrowserUse } from '../components/ChatWithBrowserUse';

export default function ComputerUsePage() {
  const [userName, setUserName] = useState('User');
  const [isDarkMode, setIsDarkMode] = useState(false);

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

  return (
    <div className="flex h-screen" style={{ backgroundColor: '#131314' }}>
      {/* Sidebar */}
      <Sidebar userName={userName} isDarkMode={isDarkMode} activePage="computerUse" />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden" style={{ backgroundColor: '#131314' }}>
        <PageContainer>
          <PageHeader 
            title="Computer Use" 
            subtitle="Let AI control your browser to perform tasks for you" 
          />
          
          <div className="flex-1 h-[calc(100vh-160px)]">
            <ChatWithBrowserUse />
          </div>
        </PageContainer>
      </div>
    </div>
  );
} 