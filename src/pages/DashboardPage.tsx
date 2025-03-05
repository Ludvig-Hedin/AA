import React from 'react';
import { PageContainer } from '../components/PageContainer';
import Sidebar from '../components/layout/Sidebar';
import { useTheme } from '../contexts/ThemeContext';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  const { theme } = useTheme();

  // Mock data for dashboard
  const recentActivities = [
    { id: 1, type: 'browser', title: 'Web research on AI trends', time: '10 minutes ago', status: 'completed' },
    { id: 2, type: 'document', title: 'Analyzed quarterly report', time: '2 hours ago', status: 'completed' },
    { id: 3, type: 'browser', title: 'Searched for product comparisons', time: '5 hours ago', status: 'completed' }
  ];

  const activeAgents = [
    { id: 1, name: 'Browser Assistant', status: 'active', task: 'Researching market trends' },
    { id: 3, name: 'Data Processor', status: 'active', task: 'Analyzing sales data' }
  ];

  const quickTasks = [
    { id: 1, title: 'Web Research', icon: 'search', path: '/computer-use', description: 'Research a topic online' },
    { id: 2, title: 'Analyze Document', icon: 'description', path: '/agents', description: 'Extract insights from documents' },
    { id: 3, title: 'Data Analysis', icon: 'analytics', path: '/agents', description: 'Process and visualize data' },
    { id: 4, title: 'Content Creation', icon: 'edit', path: '/agents', description: 'Generate content for various purposes' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'completed':
        return 'bg-blue-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'browser':
        return 'language';
      case 'document':
        return 'description';
      case 'data':
        return 'analytics';
      default:
        return 'task';
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar userName="John Doe" isDarkMode={theme === 'dark'} activePage="dashboard" />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <PageContainer>
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <Link 
                to="/computer-use"
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors flex items-center"
              >
                <span className="material-icons mr-1">computer</span>
                New Browser Task
              </Link>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Quick Stats */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-lg font-medium mb-4">System Status</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Active Agents</span>
                    <span className="font-medium">{activeAgents.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Tasks Completed Today</span>
                    <span className="font-medium">7</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">System Status</span>
                    <span className="flex items-center text-green-500">
                      <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                      Operational
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Active Agents */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium">Active Agents</h2>
                  <Link to="/agents" className="text-blue-500 hover:text-blue-700 text-sm">View All</Link>
                </div>
                {activeAgents.length > 0 ? (
                  <div className="space-y-4">
                    {activeAgents.map(agent => (
                      <div key={agent.id} className="flex items-start">
                        <span className="material-icons text-blue-500 mr-3">smart_toy</span>
                        <div>
                          <div className="flex items-center">
                            <h3 className="font-medium">{agent.name}</h3>
                            <span className="ml-2 inline-block w-2 h-2 rounded-full bg-green-500"></span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{agent.task}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">No active agents</p>
                )}
              </div>
              
              {/* Recent Activities */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium">Recent Activities</h2>
                  <Link to="/activities" className="text-blue-500 hover:text-blue-700 text-sm">View All</Link>
                </div>
                {recentActivities.length > 0 ? (
                  <div className="space-y-4">
                    {recentActivities.map(activity => (
                      <div key={activity.id} className="flex items-start">
                        <span className="material-icons text-blue-500 mr-3">{getActivityIcon(activity.type)}</span>
                        <div>
                          <h3 className="font-medium">{activity.title}</h3>
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <span>{activity.time}</span>
                            <span className="mx-2">•</span>
                            <span className="flex items-center">
                              <span className={`inline-block w-2 h-2 rounded-full ${getStatusColor(activity.status)} mr-1`}></span>
                              {activity.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">No recent activities</p>
                )}
              </div>
            </div>
            
            {/* Quick Tasks */}
            <div className="mb-8">
              <h2 className="text-lg font-medium mb-4">Quick Tasks</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickTasks.map(task => (
                  <Link 
                    key={task.id}
                    to={task.path}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 hover:shadow-md transition-shadow flex flex-col items-center text-center"
                  >
                    <span className="material-icons text-blue-500 text-3xl mb-3">{task.icon}</span>
                    <h3 className="font-medium mb-1">{task.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{task.description}</p>
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Resources and Help */}
            <div>
              <h2 className="text-lg font-medium mb-4">Resources & Help</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
                  <h3 className="font-medium flex items-center mb-2">
                    <span className="material-icons text-blue-500 mr-2">school</span>
                    Tutorials
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Learn how to use the AI Assistant effectively</p>
                  <a href="#" className="text-blue-500 hover:text-blue-700 text-sm">View Tutorials</a>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
                  <h3 className="font-medium flex items-center mb-2">
                    <span className="material-icons text-blue-500 mr-2">help_outline</span>
                    FAQ
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Find answers to common questions</p>
                  <a href="#" className="text-blue-500 hover:text-blue-700 text-sm">View FAQ</a>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
                  <h3 className="font-medium flex items-center mb-2">
                    <span className="material-icons text-blue-500 mr-2">support_agent</span>
                    Support
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Get help with any issues you encounter</p>
                  <a href="#" className="text-blue-500 hover:text-blue-700 text-sm">Contact Support</a>
                </div>
              </div>
            </div>
          </div>
        </PageContainer>
      </div>
    </div>
  );
} 