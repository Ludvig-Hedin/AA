import React, { useEffect, useState, useRef } from 'react';
import { getCurrentUser, signOut } from '../services/supabase';
import { Link, useNavigate } from 'react-router-dom';
import { AIServiceFactory } from '../services/ai/adapter';
import Sidebar from '../components/layout/Sidebar';
import ChatInput from '../components/chat/ChatInput';
import config from '../config/config';

// Define message interface
interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  files?: File[];
}

// Define meeting interface
interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  imageUrl?: string;
  details?: string;
  attendees?: string[];
  isVideoCall?: boolean;
  location?: string;
  status?: 'upcoming' | 'past';
  participants?: string[];
}

// Define task interface
interface Task {
  id: string;
  title: string;
  description: string;
  type: string;
  dueDate?: string;
  status?: 'pending' | 'in-progress' | 'completed';
  onClick?: () => void;
}

// Define chat history interface
interface ChatHistory {
  id: string;
  title: string;
  date: Date;
}

const Dashboard: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState('sales');
  const [aiProvider, setAiProvider] = useState('mock');
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMeeting, setSelectedMeeting] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [sidebarWidth, setSidebarWidth] = useState(240);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [userName, setUserName] = useState<string>("Ludvig"); // Default user name
  
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([
    { id: '1', title: 'Greetings and Introductions', date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60) },
    { id: '2', title: 'Document Summary Request', date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 58) },
    { id: '3', title: 'Vad jag kan göra', date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 55) }
  ]);
  
  const [meetings, setMeetings] = useState<Meeting[]>([
    {
      id: '1',
      title: 'LIA-återkoppling (friviligt möte)',
      date: 'Feb 20',
      time: '11:00 AM',
      details: 'Discussion about the LIA program and feedback session with mentors',
      attendees: ['Ludvig', 'Sofia', 'Erik', 'Maria'],
      isVideoCall: true
    },
    {
      id: '2',
      title: 'LIA-återkoppling (friviligt möte)',
      date: 'Feb 6',
      time: '11:00 AM',
      details: 'Monthly progress review and goal setting for the upcoming sprint',
      attendees: ['Ludvig', 'Sofia', 'Johan'],
      isVideoCall: true
    }
  ]);
  
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Conduct a competitor analysis',
      description: 'Research and document strengths and weaknesses of top 3 competitors',
      type: 'research',
      dueDate: 'Mar 15',
      status: 'pending'
    },
    {
      id: '2',
      title: 'Provide feedback on communication effectiveness',
      description: 'Review the latest marketing materials and provide actionable feedback',
      type: 'review',
      dueDate: 'Mar 17',
      status: 'in-progress'
    },
    {
      id: '3',
      title: 'Craft a LinkedIn connection request',
      description: 'Create a personalized connection message for potential clients',
      type: 'writing',
      dueDate: 'Mar 10',
      status: 'completed'
    }
  ]);

  const navigate = useNavigate();

  const [prompt, setPrompt] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const [chatPosition, setChatPosition] = useState({ x: 0, y: 0 });
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const chatRef = useRef<HTMLDivElement>(null);
  
  // Initialize AI service with selected adapter
  const getAiService = () => {
    if (aiProvider === 'mock') {
      return AIServiceFactory.createAdapter('mock');
    } else if (apiKey) {
      return AIServiceFactory.createAdapter(aiProvider, apiKey);
    } else {
      console.warn(`No API key provided for ${aiProvider}. Falling back to mock adapter.`);
      return AIServiceFactory.createAdapter('mock');
    }
  };

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.documentElement.classList.toggle('dark', newMode);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // Handle sending a message
  const handleSendMessage = async (inputText: string, uploadedFiles?: File[]) => {
    if (!inputText.trim() && (!uploadedFiles || uploadedFiles.length === 0)) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputText,
      sender: 'user',
      timestamp: new Date(),
      files: uploadedFiles
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      const aiService = AIServiceFactory.createAdapter();
      const response = await aiService.generateResponse(inputText);
      
      // Add AI message
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // Add to chat history if it's a new conversation
      if (messages.length === 0) {
        const newChat: ChatHistory = {
          id: Date.now().toString(),
          title: inputText.length > 30 ? `${inputText.substring(0, 30)}...` : inputText,
          date: new Date()
        };
        
        setChatHistory(prev => [newChat, ...prev]);
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error processing your request.',
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Format date for chat history
  const formatChatDate = (date: Date) => {
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 1) {
      return 'Today';
    } else if (diffDays < 2) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      return `${Math.floor(diffDays / 7)} weeks ago`;
    } else if (diffDays < 365) {
      return `${Math.floor(diffDays / 30)} months ago`;
    } else {
      return `${Math.floor(diffDays / 365)} years ago`;
    }
  };

  // Group chat history by time period
  const groupedChatHistory = chatHistory.reduce((groups: Record<string, ChatHistory[]>, chat) => {
    const key = formatChatDate(chat.date);
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(chat);
    return groups;
  }, {});

  const toggleTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    const newStatus = task.status === 'completed' ? 'pending' : 
                     task.status === 'pending' ? 'in-progress' : 'completed';
    
    setTasks(tasks.map(t => 
      t.id === taskId ? {...t, status: newStatus as 'pending' | 'in-progress' | 'completed'} : t
    ));
    
    setSelectedTask(taskId);
  };

  const viewMeetingDetails = (meetingId: string) => {
    setSelectedMeeting(meetingId);
  };

  const handleChatHistoryClick = (chatId: string) => {
    // Find the chat in history
    const selectedChat = chatHistory.find(chat => chat.id === chatId);
    if (selectedChat) {
      // Set input to the chat title as an example
      const promptText = `Tell me more about "${selectedChat.title}"`;
      handleSendMessage(promptText);
      // Clear messages to start a new conversation
      setMessages([]);
    }
  };

  // Handle removing a file
  const handleRemoveFile = (file: File, index: number) => {
    // Implementation would go here
  };

  // Fokusera input när komponenten laddas
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) return;
    
    // Skapa ett nytt chat ID om det inte finns aktivt
    const chatId = activeChatId || Date.now().toString();
    if (!activeChatId) {
      setActiveChatId(chatId);
      
      // Lägg till i chat history med truncated name
      const newChatEntry: ChatHistory = {
        id: chatId,
        title: prompt.length > 25 ? prompt.substring(0, 25) + '...' : prompt,
        date: new Date()
      };
      
      setChatHistory(prev => [newChatEntry, ...prev]);
    }
    
    // Skapa användarmeddelande
    const userMessage: Message = {
      id: Date.now().toString(),
      content: prompt,
      sender: 'user',
      timestamp: new Date()
    };
    
    // Lägg till i chattmeddelanden
    setChatMessages(prev => [...prev, userMessage]);
    setPrompt('');
    setShowChat(true);
    setIsMinimized(false);
    
    // Simulera AI-svar
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Detta är ett svar på: "${prompt}"`,
        sender: 'ai',
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  // Lägg till draggable funktionalitet
  const handleMouseDown = (e: React.MouseEvent) => {
    if (chatRef.current && e.target === chatRef.current.querySelector('.chat-header')) {
      setIsDragging(true);
      dragStartPos.current = { 
        x: e.clientX - chatPosition.x, 
        y: e.clientY - chatPosition.y 
      };
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - dragStartPos.current.x;
      const newY = e.clientY - dragStartPos.current.y;
      setChatPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Lägg till event listeners
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  // Update the Dashboard component to use the settings from localStorage
  useEffect(() => {
    // Load AI settings from localStorage
    const savedApiKey = localStorage.getItem('aiApiKey') || '';
    const savedModel = localStorage.getItem('aiModel') || 'mock';
    const savedEndpoint = localStorage.getItem('apiEndpoint') || '';
    
    // Initialize AI service with saved settings
    const aiService = AIServiceFactory.createAdapter(savedModel, savedApiKey, savedEndpoint);
    
    // You can now use aiService for generating responses
  }, []);

  return (
    <div className={`min-h-screen flex ${isDarkMode ? 'dark bg-[#121314] text-[#FFFEFC]' : 'bg-[#FFFEFC] text-[#040404]'}`}>
      {/* Sidebar */}
      <Sidebar userName={userName} isDarkMode={isDarkMode} />
      
      {/* Main content */}
      <div className="flex-1 overflow-auto flex justify-center relative">
        <div className="w-full max-w-[1160px] mx-auto">
          {/* Top nav with blur effect */}
          <div className="sticky top-0 z-10 backdrop-blur-xl bg-opacity-50 dark:bg-opacity-50 bg-[#FFFEFC] dark:bg-[#121314] p-3 flex items-center">
            <div className="ml-6 flex items-center space-x-3">
              <button 
                className={`px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-opacity-80 ${activeTab === 'all' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-300 hover:bg-[#232425]'}`}
                onClick={() => setActiveTab('all')}
              >
                All
              </button>
              <button 
                className={`px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-opacity-80 ${activeTab === 'sales' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-300 hover:bg-[#232425]'}`}
                onClick={() => setActiveTab('sales')}
              >
                Sales Assistant
              </button>
            </div>
          </div>
          
          {/* Dashboard content area */}
          <div className="p-8">
            {/* Upcoming meetings section */}
            <div className="mb-10">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Upcoming Meetings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {meetings.map(meeting => (
                  <div 
                    key={meeting.id}
                    className="bg-white dark:bg-[#1E1F20] rounded-lg p-4 shadow hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => viewMeetingDetails(meeting.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">{meeting.title}</h3>
                        <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="material-icons text-sm mr-1">calendar_today</span>
                          <span>{meeting.date}, {meeting.time}</span>
                        </div>
                        {meeting.isVideoCall && (
                          <div className="mt-2 text-sm text-blue-500 flex items-center">
                            <span className="material-icons text-sm mr-1">videocam</span>
                            <span>Video Call</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tasks section */}
            <div className="mb-10">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Your Tasks</h2>
              <div className="space-y-3">
                {tasks.map(task => (
                  <div 
                    key={task.id}
                    className={`bg-white dark:bg-[#1E1F20] rounded-lg p-4 shadow border-l-4 ${
                      task.status === 'completed' ? 'border-green-500' : 
                      task.status === 'in-progress' ? 'border-yellow-500' : 'border-blue-500'
                    }`}
                    onClick={() => toggleTask(task.id)}
                  >
                    <div className="flex items-start">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white">{task.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{task.description}</p>
                        {task.dueDate && (
                          <div className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                            <span className="material-icons text-xs mr-1">schedule</span>
                            <span>Due {task.dueDate}</span>
                          </div>
                        )}
                      </div>
                      <span className="material-icons text-lg">
                        {task.status === 'completed' ? 'check_circle' : 
                        task.status === 'in-progress' ? 'pending' : 'radio_button_unchecked'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* "Optimize prompt" knapp flyttad till chattinputens botten */}

      {/* Chattinput längst ner */}
      <div className="fixed bottom-0 left-0 right-0 z-10 flex justify-center">
        <div className="w-full max-w-[720px] p-4">
          <form onSubmit={handleSubmit} className="relative">
            <div className="bg-[#1E1F20] rounded-[24px] overflow-hidden shadow-lg border border-[#404141]">
              <div className="flex flex-col">
                {/* Textinput på egen rad med bättre padding och vänsterjusterad med knapparna */}
                <input
                  ref={inputRef}
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey && prompt.trim()) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                  placeholder="Ask anything, use @ to tag files and collections"
                  className="w-full px-6 py-4 text-sm text-white bg-[#1E1F20] border-none focus:ring-0 focus:outline-none placeholder:text-opacity-40 placeholder:text-white focus:placeholder:text-opacity-100 caret-white"
                />
                
                {/* Knappar på rad under utan streck, justerad till vänster */}
                <div className="flex items-center px-6 py-3">
                  <button 
                    type="button"
                    className="p-2 text-[#A5A5A6] rounded-lg cursor-pointer hover:text-white hover:bg-gray-700"
                  >
                    <span className="material-icons">attach_file</span>
                  </button>
                  <button 
                    type="button"
                    className="p-2 text-[#A5A5A6] rounded-lg cursor-pointer hover:text-white hover:bg-gray-700"
                  >
                    <span className="material-icons">photo</span>
                  </button>
                  <button 
                    type="button"
                    className="p-2 text-[#A5A5A6] rounded-lg cursor-pointer hover:text-white hover:bg-gray-700"
                  >
                    <span className="material-icons">alternate_email</span>
                  </button>
                  
                  {/* Knapp för att prata med AI-assistenten */}
                  <button 
                    type="button"
                    className="p-2 text-[#A5A5A6] rounded-lg cursor-pointer hover:text-white hover:bg-gray-700"
                  >
                    <span className="material-icons">mic</span>
                  </button>
                  
                  <div className="flex-1"></div>
                  
                  {/* Optimize prompt-knapp - anpassad för jämn storlek med skicka-knappen */}
                  <button 
                    type="button"
                    className="flex items-center gap-1 px-3 py-1.5 mr-3 h-8 text-[#A5A5A6] border border-[#353536] rounded-full hover:bg-[#353536] transition-colors"
                  >
                    <span className="text-sm">Optimize prompt</span>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.33347 8.43184L10.9135 6.85184C11.1095 6.6565 11.2068 6.5585 11.2588 6.45317C11.3588 6.25317 11.3588 6.01784 11.2588 5.81717C11.2068 5.71184 11.1095 5.6145 10.9141 5.41917C10.7188 5.22384 10.6208 5.1265 10.5161 5.0745C10.4174 5.02531 10.3085 4.9997 10.1981 4.9997C10.0878 4.9997 9.97892 5.02531 9.88014 5.0745C9.7748 5.1265 9.6768 5.22384 9.48147 5.41917L7.90147 6.99984M9.33347 8.43184L3.85214 13.9138C3.6568 14.1092 3.5588 14.2065 3.45347 14.2585C3.25347 14.3585 3.01814 14.3585 2.81747 14.2585C2.71214 14.2065 2.6148 14.1092 2.41947 13.9138C2.22414 13.7185 2.1268 13.6205 2.0748 13.5158C2.02561 13.4171 2 13.3082 2 13.1978C2 13.0875 2.02561 12.9786 2.0748 12.8798C2.1268 12.7745 2.22414 12.6765 2.41947 12.4812L7.90147 6.99984M9.33347 8.43184L7.90147 6.99984M13.0001 1.6665L12.9268 1.86584C12.8295 2.1265 12.7815 2.25717 12.6868 2.3525C12.5908 2.44784 12.4601 2.4965 12.1995 2.5925L12.0001 2.6665L12.1995 2.73984C12.4601 2.8365 12.5908 2.88517 12.6861 2.97984C12.7815 3.07584 12.8295 3.2065 12.9261 3.46717L13.0001 3.6665L13.0735 3.46717C13.1708 3.2065 13.2188 3.07584 13.3135 2.9805C13.4095 2.88517 13.5401 2.8365 13.8008 2.7405L14.0001 2.6665L13.8008 2.59317C13.5401 2.4965 13.4095 2.44784 13.3141 2.35317C13.2188 2.25717 13.1708 2.1265 13.0741 1.86584L13.0001 1.6665ZM13.0001 8.33317L12.9268 8.5325C12.8295 8.79317 12.7815 8.92384 12.6868 9.01917C12.5908 9.1145 12.4601 9.16317 12.1995 9.25917L12.0001 9.33317L12.1995 9.4065C12.4601 9.50384 12.5908 9.55184 12.6861 9.6465C12.7815 9.7425 12.8295 9.87317 12.9261 10.1338L13.0001 10.3332L13.0735 10.1338C13.1708 9.87317 13.2188 9.7425 13.3135 9.64717C13.4095 9.55184 13.5401 9.50317 13.8008 9.40717L14.0001 9.33317L13.8008 9.25984C13.5401 9.1625 13.4095 9.1145 13.3141 9.01984C13.2188 8.92384 13.1708 8.79317 13.0741 8.5325L13.0001 8.33317ZM7.00014 1.6665L6.9268 1.86584C6.82947 2.1265 6.78147 2.25717 6.6868 2.3525C6.5908 2.44784 6.46014 2.4965 6.19947 2.5925L6.00014 2.6665L6.19947 2.73984C6.46014 2.8365 6.5908 2.88517 6.68614 2.97984C6.78147 3.07584 6.83014 3.2065 6.92614 3.46717L7.00014 3.6665L7.07347 3.46717C7.1708 3.2065 7.2188 3.07584 7.31347 2.9805C7.40947 2.88517 7.54014 2.8365 7.8008 2.7405L8.00014 2.6665L7.8008 2.59317C7.54014 2.4965 7.40947 2.44784 7.31414 2.35317C7.2188 2.25717 7.17014 2.1265 7.07414 1.86584L7.00014 1.6665Z" stroke="#A5A5A6" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                  
                  {/* Rund skicka-knapp - anpassad höjd och bredd för att matcha optimize knappen */}
                  <button 
                    type="submit"
                    className={`h-8 w-8 flex items-center justify-center rounded-full focus:outline-none bg-[#565758] hover:bg-gray-600 ${
                      prompt.trim() ? 'text-[#1E1F20]' : 'text-gray-400'
                    }`}
                    disabled={!prompt.trim()}
                  >
                    <span className="material-icons text-sm">arrow_upward</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-2 text-xs text-center text-gray-500 dark:text-gray-400">
              Our AI can make mistakes, check important info.
            </div>
          </form>
        </div>
      </div>
      
      {/* Chattfönster som visas när meddelanden skickas */}
      {showChat && (
        <div 
          className="fixed inset-0 z-30 pointer-events-none"
          style={{ backdropFilter: isMinimized ? 'none' : 'blur(4px)' }}
        >
          <div 
            ref={chatRef}
            className={`bg-[#1E1F20] rounded-[24px] shadow-xl border border-[#404141] pointer-events-auto transition-all duration-300 ease-in-out ${
              isMinimized ? 'w-64 h-12' : 'w-full max-w-2xl h-3/4'
            }`}
            style={{ 
              position: 'absolute',
              left: isMinimized ? 'auto' : '50%',
              right: isMinimized ? '20px' : 'auto',
              bottom: isMinimized ? '20px' : '50%',
              transform: isMinimized 
                ? 'none' 
                : `translate(-50%, 50%) translate(${chatPosition.x}px, ${chatPosition.y}px)`,
              transformOrigin: 'center',
              animation: 'chatAppear 0.3s ease-out'
            }}
            onMouseDown={handleMouseDown}
          >
            <div className="chat-header flex items-center justify-between px-6 py-4 border-b border-[#404141] cursor-move">
              <h2 className="text-lg font-semibold text-white truncate">
                {activeChatId && chatHistory.find(c => c.id === activeChatId)?.title || "New Chat"}
              </h2>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="text-[#A5A5A6] hover:text-white transition-colors"
                >
                  <span className="material-icons">
                    {isMinimized ? 'maximize' : 'minimize'}
                  </span>
                </button>
                <button 
                  onClick={() => {
                    setShowChat(false);
                    setActiveChatId(null);
                  }}
                  className="text-[#A5A5A6] hover:text-white transition-colors"
                >
                  <span className="material-icons">close</span>
                </button>
              </div>
            </div>
            
            {!isMinimized && (
              <>
                <div className="flex-1 overflow-auto px-6 py-4 space-y-6 h-[calc(100%-140px)]">
                  {chatMessages.map((message) => (
                    <div 
                      key={message.id} 
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                      style={{ animationDuration: '0.3s' }}
                    >
                      <div className={`max-w-[80%] rounded-[16px] p-4 ${
                        message.sender === 'user' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-[#333435] text-white'
                      }`}>
                        {message.content}
                        <div className="text-xs opacity-70 mt-2">
                          {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-4 border-t border-[#404141]">
                  <form 
                    onSubmit={handleSubmit}
                    className="flex items-center px-2"
                  >
                    <input
                      type="text"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 p-3 rounded-[16px] bg-[#333435] text-white border-none focus:ring-0 focus:outline-none placeholder:text-opacity-40 placeholder:text-white focus:placeholder:text-opacity-100"
                    />
                    <button 
                      type="submit"
                      className="ml-3 h-8 w-8 flex items-center justify-center bg-[#565758] rounded-full text-[#1E1F20] hover:bg-gray-600"
                      disabled={!prompt.trim()}
                    >
                      <span className="material-icons text-sm">send</span>
                    </button>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;