import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { signOut } from '../../services/supabase';

interface SidebarProps {
  userName: string;
  isDarkMode: boolean;
  activePage?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ userName, isDarkMode, activePage }) => {
  const [width, setWidth] = useState(240);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [chatHistory, setChatHistory] = useState<{ id: string; title: string; date: Date }[]>([
    { id: '1', title: 'Hur man använder AI för att skapa en presentation', date: new Date() },
    { id: '2', title: 'Analys av kvartalsrapport Q1', date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2) },
    { id: '3', title: 'Vad jag kan göra', date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5) }
  ]);
  
  const sidebarRef = useRef<HTMLDivElement>(null);
  const resizeRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef<number | null>(null);
  const startWidthRef = useRef<number | null>(null);
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
    if (activePage) {
      return path === `/${activePage}` || 
        (path === '/dashboard' && activePage === 'dashboard') ||
        (path === '/computer-use' && activePage === 'computerUse');
    }
    return location.pathname === path;
  };
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };
  
  const MIN_WIDTH = 180;
  const MAX_WIDTH = 400;
  
  return (
    <div 
      ref={sidebarRef}
      className={`h-screen ${isCollapsed ? 'w-16' : `w-[${width}px]`} flex-shrink-0 border-r border-gray-800 transition-all duration-200 ease-in-out relative`}
      style={{ width: isCollapsed ? 64 : width, backgroundColor: '#242628 !important', zIndex: 100 }}
    >
      <div className="flex flex-col h-full p-4">
        {/* Logo/Header with Collapse Button - AI Assistant title removed */}
        <div className="flex items-center justify-between h-12 mb-6">
          {isCollapsed && (
            <div className="mx-auto">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          )}
          
          {/* Collapse Button at Top */}
          <button
            onClick={toggleSidebar}
            className="flex items-center justify-center p-1 rounded-md text-gray-400 hover:text-white hover:bg-gray-800"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 10L8 12L6 14M11 5V19M4 19H20C20.2652 19 20.5196 18.8946 20.7071 18.7071C20.8946 18.5196 21 18.2652 21 18V6C21 5.73478 20.8946 5.48043 20.7071 5.29289C20.5196 5.10536 20.2652 5 20 5H4C3.73478 5 3.48043 5.10536 3.29289 5.29289C3.10536 5.48043 3 5.73478 3 6V18C3 18.2652 3.10536 18.5196 3.29289 18.7071C3.48043 18.8946 3.73478 19 4 19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 10L6 12L8 14M11 5V19M4 19H20C20.2652 19 20.5196 18.8946 20.7071 18.7071C20.8946 18.5196 21 18.2652 21 18V6C21 5.73478 20.8946 5.48043 20.7071 5.29289C20.5196 5.10536 20.2652 5 20 5H4C3.73478 5 3.48043 5.10536 3.29289 5.29289C3.10536 5.48043 3 5.73478 3 6V18C3 18.2652 3.10536 18.5196 3.29289 18.7071C3.48043 18.8946 3.73478 19 4 19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            )}
          </button>
        </div>
        
        {/* Nav items with updated active background color */}
        <nav className="flex-1 space-y-2">
          <Link 
            to="/dashboard" 
            className={`flex items-center p-2 rounded-md ${isActive('/dashboard') ? 'text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
            style={isActive('/dashboard') ? { backgroundColor: '#2E3032' } : {}}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 12L5 10M5 10L12 3L19 10M5 10V20C5 20.5523 5.44772 21 6 21H9M19 10L21 12M19 10V20C19 20.5523 18.5523 21 18 21H15M9 21C9.55228 21 10 20.5523 10 20V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V20C14 20.5523 14.4477 21 15 21M9 21H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {!isCollapsed && <span className="ml-3">Dashboard</span>}
          </Link>
          
          <Link 
            to="/search" 
            className={`flex items-center p-2 rounded-md ${isActive('/search') ? 'text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
            style={isActive('/search') ? { backgroundColor: '#2E3032' } : {}}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {!isCollapsed && <span className="ml-3">Search</span>}
          </Link>
          
          <Link 
            to="/tasks" 
            className={`flex items-center p-2 rounded-md ${isActive('/tasks') ? 'text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
            style={isActive('/tasks') ? { backgroundColor: '#2E3032' } : {}}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 11L12 14L22 4M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {!isCollapsed && <span className="ml-3">Tasks</span>}
          </Link>
          
          <Link 
            to="/calendar" 
            className={`flex items-center p-2 rounded-md ${isActive('/calendar') ? 'text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
            style={isActive('/calendar') ? { backgroundColor: '#2E3032' } : {}}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 7V3M16 7V3M7 11H17M5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {!isCollapsed && <span className="ml-3">Calendar</span>}
          </Link>
          
          <Link 
            to="/computer-use" 
            className={`flex items-center p-2 rounded-md ${isActive('/computer-use') ? 'text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
            style={isActive('/computer-use') ? { backgroundColor: '#2E3032' } : {}}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
              <line x1="8" y1="21" x2="16" y2="21"></line>
              <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
            {!isCollapsed && <span className="ml-3">Computer Use</span>}
          </Link>
          
          <Link 
            to="/collections" 
            className={`flex items-center p-2 rounded-md ${isActive('/collections') ? 'text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
            style={isActive('/collections') ? { backgroundColor: '#2E3032' } : {}}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 11H5M19 11C20.1046 11 21 11.8954 21 13V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V13C3 11.8954 3.89543 11 5 11M19 11V9C19 7.89543 18.1046 7 17 7M5 11V9C5 7.89543 5.89543 7 7 7M7 7V5C7 3.89543 7.89543 3 9 3H15C16.1046 3 17 3.89543 17 5V7M7 7H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {!isCollapsed && <span className="ml-3">Collections</span>}
          </Link>
          
          <Link 
            to="/files" 
            className={`flex items-center p-2 rounded-md ${isActive('/files') ? 'text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
            style={isActive('/files') ? { backgroundColor: '#2E3032' } : {}}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 19C3.89543 19 3 18.1046 3 17V7C3 5.89543 3.89543 5 5 5H9L11 7H15C16.1046 7 17 7.89543 17 9V11M5 19H19C20.1046 19 21 18.1046 21 17V11C21 9.89543 20.1046 9 19 9H5M5 19C3.89543 19 3 18.1046 3 17V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {!isCollapsed && <span className="ml-3">Files</span>}
          </Link>
          
          <Link 
            to="/settings" 
            className={`flex items-center p-2 rounded-md ${isActive('/settings') ? 'text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
            style={isActive('/settings') ? { backgroundColor: '#2E3032' } : {}}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.325 4.317C10.751 2.561 13.249 2.561 13.675 4.317C13.7389 4.5808 13.8642 4.82578 14.0407 5.032C14.2172 5.23822 14.4399 5.39985 14.6907 5.50375C14.9414 5.60764 15.2132 5.65085 15.4838 5.62987C15.7544 5.60889 16.0162 5.5243 16.248 5.383C17.791 4.443 19.558 6.209 18.618 7.753C18.4769 7.98466 18.3924 8.24634 18.3715 8.51677C18.3506 8.78721 18.3938 9.05877 18.4975 9.30938C18.6013 9.55999 18.7627 9.78258 18.9687 9.95905C19.1747 10.1355 19.4194 10.2609 19.683 10.325C21.439 10.751 21.439 13.249 19.683 13.675C19.4192 13.7389 19.1742 13.8642 18.968 14.0407C18.7618 14.2172 18.6001 14.4399 18.4963 14.6907C18.3924 14.9414 18.3491 15.2132 18.3701 15.4838C18.3911 15.7544 18.4757 16.0162 18.617 16.248C19.557 17.791 17.791 19.558 16.247 18.618C16.0153 18.4769 15.7537 18.3924 15.4832 18.3715C15.2128 18.3506 14.9412 18.3938 14.6906 18.4975C14.44 18.6013 14.2174 18.7627 14.0409 18.9687C13.8645 19.1747 13.7391 19.4194 13.675 19.683C13.249 21.439 10.751 21.439 10.325 19.683C10.2611 19.4192 10.1358 19.1742 9.95929 18.968C9.7828 18.7618 9.56011 18.6001 9.30935 18.4963C9.05859 18.3924 8.78683 18.3491 8.51621 18.3701C8.24559 18.3911 7.98375 18.4757 7.752 18.617C6.209 19.557 4.442 17.791 5.382 16.247C5.5231 16.0153 5.60755 15.7537 5.62848 15.4832C5.64942 15.2128 5.60624 14.9412 5.50247 14.6906C5.3987 14.44 5.23726 14.2174 5.03127 14.0409C4.82529 13.8645 4.58056 13.7391 4.317 13.675C2.561 13.249 2.561 10.751 4.317 10.325C4.5808 10.2611 4.82578 10.1358 5.032 9.95929C5.23822 9.7828 5.39985 9.56011 5.50375 9.30935C5.60764 9.05859 5.65085 8.78683 5.62987 8.51621C5.60889 8.24559 5.5243 7.98375 5.383 7.752C4.443 6.209 6.209 4.442 7.753 5.382C8.753 5.99 10.049 5.452 10.325 4.317Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {!isCollapsed && <span className="ml-3">Settings</span>}
          </Link>
        </nav>
        
        {/* User info and settings */}
        <div className="mt-auto">
          {/* Profile Section - Make Clickable */}
          <Link 
            to="/profile" 
            className={`flex items-center p-2 rounded-md ${isActive('/profile') ? 'text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
            style={isActive('/profile') ? { backgroundColor: '#2E3032' } : {}}
          >
            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white">
              {userName[0]?.toUpperCase() || 'U'}
            </div>
            {!isCollapsed && <span className="ml-2 text-sm font-medium">{userName}</span>}
          </Link>
          
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center p-2 rounded-md text-gray-400 hover:bg-gray-800 hover:text-white mt-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9M16 17L21 12M21 12L16 7M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {!isCollapsed && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </div>
      
      {!isCollapsed && (
        <div
          ref={resizeRef}
          className="absolute top-0 right-0 h-full w-1 cursor-ew-resize"
          onMouseDown={(e) => {
            startXRef.current = e.clientX;
            startWidthRef.current = width;
          }}
        />
      )}
    </div>
  );
};

export default Sidebar; 