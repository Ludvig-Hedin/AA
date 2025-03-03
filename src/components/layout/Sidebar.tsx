import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { signOut } from '../../services/supabase';

interface SidebarProps {
  userName: string;
  isDarkMode: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ userName, isDarkMode }) => {
  const [width, setWidth] = useState(240);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [chatHistory, setChatHistory] = useState<{ id: string; title: string; date: Date }[]>([
    { id: '1', title: 'Hur man använder AI för att skapa en presentation', date: new Date() },
    { id: '2', title: 'Analys av kvartalsrapport Q1', date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2) },
    { id: '3', title: 'Vad jag kan göra', date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5) }
  ]);
  
  const sidebarRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [notifications, setNotifications] = useState(3); // Number of task notifications
  
  // Format chat histories by time period
  const today = chatHistory.filter(chat => {
    const chatDate = new Date(chat.date);
    const today = new Date();
    return chatDate.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0);
  });
  
  const yesterday = chatHistory.filter(chat => {
    const chatDate = new Date(chat.date);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return chatDate.setHours(0, 0, 0, 0) === yesterday.setHours(0, 0, 0, 0);
  });
  
  const older = chatHistory.filter(chat => {
    const chatDate = new Date(chat.date);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return chatDate.setHours(0, 0, 0, 0) < yesterday.setHours(0, 0, 0, 0);
  });
  
  // Handle mouse events for sidebar resizing
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      const newWidth = e.clientX;
      if (newWidth >= 50 && newWidth <= 400) {
        setWidth(newWidth);
      }
      if (newWidth < 100 && !isCollapsed) {
        setIsCollapsed(true);
      } else if (newWidth >= 100 && isCollapsed) {
        setIsCollapsed(false);
      }
    }
  }, [isDragging, isCollapsed]);
  
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);
  
  // Add keyboard shortcut for toggling sidebar width
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '§' || e.key === '±') { // § key in different keyboard layouts
        toggleSidebar();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCollapsed, width]);
  
  // Toggle sidebar collapse state
  const toggleSidebar = () => {
    if (isCollapsed) {
      setIsCollapsed(false);
      setWidth(240);
    } else {
      setIsCollapsed(true);
      setWidth(60);
    }
  };
  
  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);
  
  const handleNavigation = (path: string) => {
    navigate(path);
  };
  
  // Check if the current path matches a given path
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };
  
  return (
    <div 
      className={`h-screen transition-width duration-300 ease-in-out ${isCollapsed ? 'w-16' : 'w-64'} bg-[#181819] flex flex-col relative border-r border-[#232425]`}
      ref={sidebarRef}
    >
      {/* Ta bort logga och titel - börja direkt med navigation */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          <button 
            className="w-full flex items-center p-2 rounded-md text-white hover:bg-[#232425]"
            onClick={() => navigate('/')}
          >
            <span className="material-icons">dashboard</span>
            {!isCollapsed && <span className="ml-3">Dashboard</span>}
          </button>
          
          <button 
            className={`w-full flex items-center p-2 mb-1 rounded-md ${isActive('/search') ? 'bg-[#232425] text-white' : 'text-gray-400 hover:bg-[#232425] hover:text-white'}`}
            onClick={() => handleNavigation('/search')}
          >
            <span className="material-icons">search</span>
            {!isCollapsed && <span className="ml-3">Search</span>}
          </button>
          
          <button 
            className={`w-full flex items-center p-2 mb-1 rounded-md ${isActive('/calendar') ? 'bg-[#232425] text-white' : 'text-gray-400 hover:bg-[#232425] hover:text-white'}`}
            onClick={() => handleNavigation('/calendar')}
          >
            <span className="material-icons">calendar_month</span>
            {!isCollapsed && <span className="ml-3">Calendar</span>}
          </button>
          
          <button 
            className={`w-full flex items-center p-2 mb-1 rounded-md ${isActive('/tasks') ? 'bg-[#232425] text-white' : 'text-gray-400 hover:bg-[#232425] hover:text-white'}`}
            onClick={() => handleNavigation('/tasks')}
          >
            <span className="material-icons">task</span>
            {!isCollapsed && <span className="ml-3">Tasks</span>}
            {notifications > 0 && (
              <div className="ml-auto bg-red-500 text-white text-xs rounded-full flex items-center justify-center px-1.5 min-w-[20px] h-5">
                {notifications}
              </div>
            )}
            {isCollapsed && notifications > 0 && (
              <div className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full flex items-center justify-center px-1.5 min-w-[20px] h-5">
                {notifications}
              </div>
            )}
          </button>
          
          <button 
            className={`w-full flex items-center p-2 mb-1 rounded-md ${isActive('/integrations') ? 'bg-[#232425] text-white' : 'text-gray-400 hover:bg-[#232425] hover:text-white'}`}
            onClick={() => handleNavigation('/integrations')}
          >
            <span className="material-icons">extension</span>
            {!isCollapsed && <span className="ml-3">Integrations</span>}
          </button>
          
          <button 
            className={`w-full flex items-center p-2 mb-1 rounded-md ${isActive('/computer-use') ? 'bg-[#232425] text-white' : 'text-gray-400 hover:bg-[#232425] hover:text-white'}`}
            onClick={() => handleNavigation('/computer-use')}
          >
            <span className="material-icons">computer</span>
            {!isCollapsed && <span className="ml-3">Computer Use</span>}
          </button>
        </div>
        
        {/* Recent chats */}
        {!isCollapsed && (
          <div className="mt-4 p-2">
            <div className="text-xs font-medium text-gray-500 uppercase px-2 mb-2">Recent Chats</div>
            
            {today.length > 0 && (
              <>
                <div className="text-xs text-gray-500 px-2 py-1">Today</div>
                {today.map(chat => (
                  <button 
                    key={chat.id}
                    className="w-full flex items-center p-2 text-left rounded-md text-gray-400 hover:bg-[#232425] hover:text-white"
                    onClick={() => handleNavigation(`/chat/${chat.id}`)}
                  >
                    <span className="material-icons text-sm">chat</span>
                    <span className="ml-3 truncate text-sm">{chat.title}</span>
                  </button>
                ))}
              </>
            )}
            
            {yesterday.length > 0 && (
              <>
                <div className="text-xs text-gray-500 px-2 py-1 mt-2">Yesterday</div>
                {yesterday.map(chat => (
                  <button 
                    key={chat.id}
                    className="w-full flex items-center p-2 text-left rounded-md text-gray-400 hover:bg-[#232425] hover:text-white"
                    onClick={() => handleNavigation(`/chat/${chat.id}`)}
                  >
                    <span className="material-icons text-sm">chat</span>
                    <span className="ml-3 truncate text-sm">{chat.title}</span>
                  </button>
                ))}
              </>
            )}
            
            {older.length > 0 && (
              <>
                <div className="text-xs text-gray-500 px-2 py-1 mt-2">Older</div>
                {older.map(chat => (
                  <button 
                    key={chat.id}
                    className="w-full flex items-center p-2 text-left rounded-md text-gray-400 hover:bg-[#232425] hover:text-white"
                    onClick={() => handleNavigation(`/chat/${chat.id}`)}
                  >
                    <span className="material-icons text-sm">chat</span>
                    <span className="ml-3 truncate text-sm">{chat.title}</span>
                  </button>
                ))}
              </>
            )}
          </div>
        )}
      </div>
      
      {/* Sidebar footer */}
      <div className="p-2 border-t border-[#232425]">
        {/* Inställningar-knapp */}
        <Link 
          to="/settings"
          className="w-full flex items-center p-2 mb-2 rounded-md text-gray-400 hover:bg-[#232425] hover:text-white"
        >
          <span className="material-icons">settings</span>
          {!isCollapsed && <span className="ml-3">Settings</span>}
        </Link>
        
        {/* Logout-knapp */}
        <button 
          className="w-full flex items-center p-2 rounded-md text-gray-400 hover:bg-[#232425] hover:text-white cursor-pointer"
          onClick={() => {
            signOut();
            navigate('/login');
          }}
        >
          <span className="material-icons">logout</span>
          {!isCollapsed && <span className="ml-3">Log out</span>}
        </button>
        
        {!isCollapsed && (
          <div className="flex items-center mt-2 p-2">
            <div className="w-8 h-8 bg-[#232425] rounded-full flex items-center justify-center mr-2">
              <span className="material-icons text-sm">person</span>
            </div>
            <div className="text-sm text-white">{userName}</div>
          </div>
        )}
      </div>
      
      {/* Draggable resizer */}
      <div 
        className="absolute top-0 right-0 w-1 h-full cursor-ew-resize hover:bg-blue-500"
        onMouseDown={handleMouseDown}
      ></div>
    </div>
  );
};

export default Sidebar; 