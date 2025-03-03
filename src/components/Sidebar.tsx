import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const navItems = [
    { 
      name: 'Dashboard', 
      path: '/dashboard', 
      icon: 'home' 
    },
    { 
      name: 'Search', 
      path: '/search', 
      icon: 'search' 
    },
    { 
      name: 'Tasks', 
      path: '/tasks', 
      icon: 'assignment' 
    },
    { 
      name: 'Calendar', 
      path: '/calendar', 
      icon: 'calendar_today' 
    },
    { 
      name: 'Collections', 
      path: '/collections', 
      icon: 'folder' 
    },
    { 
      name: 'Files', 
      path: '/files', 
      icon: 'description' 
    },
  ];

  return (
    <div className="w-64 bg-white dark:bg-gray-800 h-screen flex flex-col shadow-md">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">Mitt Projekt</h1>
      </div>
      
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center p-3 rounded-lg transition-colors ${
              isActive(item.path) 
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <span className="material-icons mr-3">{item.icon}</span>
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
      
      {/* Inställningsknapp längst ner */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <Link
          to="/settings"
          className={`flex items-center p-3 rounded-lg transition-colors ${
            isActive('/settings') 
              ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300' 
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          <span className="material-icons mr-3">settings</span>
          <span>Inställningar</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar; 