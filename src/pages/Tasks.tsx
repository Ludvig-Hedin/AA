import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import { Button } from '../components/ui/Button';

interface Task {
  id: number;
  title: string;
  status: 'pending' | 'completed';
  priority: 'Low' | 'Medium' | 'High';
  category: string;
  dueDate?: string;
  tags?: string[];
}

const Tasks: React.FC = () => {
  const [userName, setUserName] = useState('User');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeView, setActiveView] = useState('All Tasks');
  const [tasks, setTasks] = useState<Task[]>([
    { 
      id: 1, 
      title: 'Conduct a competitor analysis', 
      status: 'pending', 
      priority: 'High',
      category: 'Research',
      dueDate: 'Today'
    },
    { 
      id: 2, 
      title: 'Provide feedback on communication', 
      status: 'pending', 
      priority: 'Medium',
      category: 'Review',
      dueDate: 'Tomorrow'
    },
    { 
      id: 3, 
      title: 'Craft a LinkedIn connection request', 
      status: 'completed', 
      priority: 'Low',
      category: 'Marketing',
      dueDate: 'Completed'
    },
    { 
      id: 4, 
      title: 'Review Q4 marketing strategy', 
      status: 'pending', 
      priority: 'High',
      category: 'Strategy',
      dueDate: '3 days left'
    },
    { 
      id: 5, 
      title: 'Update team documentation', 
      status: 'pending', 
      priority: 'Medium',
      category: 'Documentation',
      dueDate: '5 days left'
    },
    { 
      id: 6, 
      title: 'Prepare for quarterly presentation', 
      status: 'pending', 
      priority: 'High',
      category: 'Presentation',
      dueDate: '1 week left'
    },
    { 
      id: 7, 
      title: 'Schedule interviews for new position', 
      status: 'completed', 
      priority: 'Medium',
      category: 'HR',
      dueDate: 'Completed'
    }
  ]);
  
  // Load user info from localStorage
  React.useEffect(() => {
    const storedUserName = localStorage.getItem('userName');
    if (storedUserName) {
      setUserName(storedUserName);
    }
    
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark') {
      setIsDarkMode(true);
    }
  }, []);

  const handleTaskStatusChange = (taskId: number) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: task.status === 'completed' ? 'pending' : 'completed' } 
        : task
    ));
  };

  const filteredTasks = tasks.filter(task => {
    if (activeView === 'All Tasks') {
      return true;
    } else {
      return task.status === (activeView === 'Completed' ? 'completed' : 'pending');
    }
  }).filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar userName={userName} isDarkMode={isDarkMode} activePage="tasks" />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-background">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
          <div className="container mx-auto px-6 py-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tasks</h1>
              
              <div className="flex items-center space-x-4">
                <button 
                  className="p-2 rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                  onClick={() => {/* Add filter functionality */}}
                >
                  <span className="flex items-center">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                    </svg>
                    <span className="ml-2">Filter</span>
                  </span>
                </button>
                
                <div className="flex items-center">
                  <span className="mr-2 text-sm text-gray-500 dark:text-gray-400">View:</span>
                  <select 
                    className="bg-transparent border border-gray-300 dark:border-gray-700 rounded-md text-sm text-gray-700 dark:text-gray-300"
                    value={activeView}
                    onChange={(e) => setActiveView(e.target.value)}
                  >
                    <option>All</option>
                    <option>Active</option>
                    <option>Completed</option>
                  </select>
                </div>
                
                <Button
                  onClick={() => {/* Add new task functionality */}}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  <span className="flex items-center">
                    <svg className="mr-2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    New Task
                  </span>
                </Button>
              </div>
            </div>
            
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search tasks..."
                className="w-full p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{activeView}</h2>
                
                <div className="space-y-4">
                  {filteredTasks.map((task) => (
                    <div key={task.id} className="flex items-start p-4 border-b last:border-b-0 border-gray-200 dark:border-gray-700">
                      <div className="flex-shrink-0 mr-4">
                        <button
                          className="w-6 h-6 rounded-full border-2 flex items-center justify-center"
                          onClick={() => handleTaskStatusChange(task.id)}
                          style={{ 
                            borderColor: task.status === 'completed' ? '#10B981' : '#6B7280',
                            backgroundColor: task.status === 'completed' ? '#10B981' : 'transparent'
                          }}
                        >
                          {task.status === 'completed' && (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          )}
                        </button>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between">
                          <h3 className={`text-lg font-medium ${task.status === 'completed' ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                            {task.title}
                          </h3>
                          <button className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="1"></circle>
                              <circle cx="19" cy="12" r="1"></circle>
                              <circle cx="5" cy="12" r="1"></circle>
                            </svg>
                          </button>
                        </div>
                        
                        <div className="mt-1 flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                            {task.category}
                          </span>
                          
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            task.priority === 'High' 
                              ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
                              : task.priority === 'Medium'
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          }`}>
                            {task.priority}
                          </span>
                          
                          <span className="inline-flex items-center text-xs text-gray-500 dark:text-gray-400">
                            <svg className="mr-1" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="10"></circle>
                              <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                            {task.dueDate}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
        
        {/* AI Assistant */}
        <div className="fixed bottom-4 right-4 p-4 bg-gray-800 rounded-lg shadow-lg max-w-xs">
          <div className="flex items-center mb-3">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            <h3 className="text-white font-semibold">AI Assistant</h3>
            <button className="ml-auto text-gray-400 hover:text-white">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="18 15 12 9 6 15"></polyline>
              </svg>
            </button>
          </div>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Message AI Assistant..."
              className="w-full py-2 pl-3 pr-10 rounded-md bg-gray-700 text-white border-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-400 hover:text-blue-300">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tasks; 