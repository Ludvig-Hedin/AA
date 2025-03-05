import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import Sidebar from '../components/layout/Sidebar';
import { PageContainer } from '../components/PageContainer';

interface Agent {
  id: number;
  name: string;
  description: string;
  status: 'active' | 'resting' | 'error';
  type: string;
  lastActive: string;
  tasks: string[];
  capabilities: string[];
}

const Agents: React.FC = () => {
  const { theme } = useTheme();
  const [selectedAgent, setSelectedAgent] = useState<number | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Mock agents data
  const agents: Agent[] = [
    {
      id: 1,
      name: 'Browser Assistant',
      description: 'Controls the browser to perform web-based tasks',
      status: 'active',
      type: 'Browser Control',
      lastActive: '2 minutes ago',
      tasks: [
        'Web research',
        'Data extraction',
        'Form filling',
        'Screenshot capture',
        'Content summarization'
      ],
      capabilities: [
        'Can navigate to any website',
        'Can extract data from web pages',
        'Can fill out forms and submit them',
        'Can take screenshots of web pages',
        'Can summarize web content'
      ]
    },
    {
      id: 2,
      name: 'Document Analyzer',
      description: 'Analyzes and extracts information from documents',
      status: 'resting',
      type: 'Document Processing',
      lastActive: '3 hours ago',
      tasks: [
        'Text extraction',
        'Document summarization',
        'Key information identification',
        'Data categorization',
        'Content analysis'
      ],
      capabilities: [
        'Can extract text from PDFs, DOCXs, and images',
        'Can summarize document content',
        'Can identify key information in documents',
        'Can categorize document data',
        'Can analyze document sentiment and tone'
      ]
    },
    {
      id: 3,
      name: 'Data Processor',
      description: 'Processes and analyzes data from various sources',
      status: 'active',
      type: 'Data Analysis',
      lastActive: '15 minutes ago',
      tasks: [
        'Data cleaning',
        'Statistical analysis',
        'Data visualization',
        'Pattern recognition',
        'Anomaly detection'
      ],
      capabilities: [
        'Can clean and preprocess data',
        'Can perform statistical analysis',
        'Can create data visualizations',
        'Can identify patterns in data',
        'Can detect anomalies in data'
      ]
    },
    {
      id: 4,
      name: 'Email Assistant',
      description: 'Manages and responds to emails',
      status: 'error',
      type: 'Communication',
      lastActive: '1 day ago',
      tasks: [
        'Email categorization',
        'Response drafting',
        'Follow-up scheduling',
        'Email summarization',
        'Priority identification'
      ],
      capabilities: [
        'Can categorize emails by importance',
        'Can draft responses to common emails',
        'Can schedule follow-ups',
        'Can summarize email threads',
        'Can identify high-priority emails'
      ]
    },
    {
      id: 5,
      name: 'Content Creator',
      description: 'Creates various types of content',
      status: 'resting',
      type: 'Content Generation',
      lastActive: '5 hours ago',
      tasks: [
        'Blog post writing',
        'Social media content creation',
        'Product description writing',
        'Email newsletter drafting',
        'Report generation'
      ],
      capabilities: [
        'Can write blog posts on various topics',
        'Can create engaging social media content',
        'Can write compelling product descriptions',
        'Can draft email newsletters',
        'Can generate detailed reports'
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'resting':
        return 'bg-yellow-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'resting':
        return 'Resting';
      case 'error':
        return 'Error';
      default:
        return 'Unknown';
    }
  };

  const handleActivateAgent = (id: number) => {
    alert(`Activating agent ${id} - this would start the agent in a real application.`);
  };

  const handlePauseAgent = (id: number) => {
    alert(`Pausing agent ${id} - this would pause the agent in a real application.`);
  };

  const handleStopAgent = (id: number) => {
    alert(`Stopping agent ${id} - this would stop the agent in a real application.`);
  };

  const handleCreateAgent = () => {
    setShowCreateModal(true);
  };

  return (
    <div className="flex h-screen">
      <Sidebar userName="John Doe" isDarkMode={theme === 'dark'} />
      <PageContainer>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">AI Agents</h1>
            <button 
              onClick={handleCreateAgent}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors flex items-center"
            >
              <span className="material-icons mr-1">add</span>
              Create Agent
            </button>
          </div>
          
          {selectedAgent === null ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {agents.map((agent) => (
                <div 
                  key={agent.id} 
                  className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      <span className="material-icons text-blue-500 text-3xl mr-3">smart_toy</span>
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{agent.name}</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{agent.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className={`inline-block w-3 h-3 rounded-full ${getStatusColor(agent.status)} mr-2`}></span>
                      <span className="text-sm font-medium">{getStatusText(agent.status)}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300 mb-4">{agent.description}</p>
                  
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tasks:</h3>
                    <div className="flex flex-wrap gap-2">
                      {agent.tasks.slice(0, 3).map((task, index) => (
                        <span 
                          key={index} 
                          className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs"
                        >
                          {task}
                        </span>
                      ))}
                      {agent.tasks.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-xs">
                          +{agent.tasks.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Last active: {agent.lastActive}</span>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => setSelectedAgent(agent.id)}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        Details
                      </button>
                      {agent.status === 'active' ? (
                        <button 
                          onClick={() => handlePauseAgent(agent.id)}
                          className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-md text-sm hover:bg-yellow-200 dark:hover:bg-yellow-800 transition-colors"
                        >
                          Pause
                        </button>
                      ) : agent.status === 'resting' ? (
                        <button 
                          onClick={() => handleActivateAgent(agent.id)}
                          className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-md text-sm hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
                        >
                          Activate
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleActivateAgent(agent.id)}
                          className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-md text-sm hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                        >
                          Restart
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>
              {(() => {
                const agent = agents.find(a => a.id === selectedAgent);
                if (!agent) return null;
                
                return (
                  <div>
                    <div className="flex items-center mb-6">
                      <button 
                        onClick={() => setSelectedAgent(null)}
                        className="mr-4 text-blue-500 hover:text-blue-700 flex items-center"
                      >
                        <span className="material-icons mr-1">arrow_back</span>
                        Back to Agents
                      </button>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center">
                          <span className="material-icons text-blue-500 text-4xl mr-4">smart_toy</span>
                          <div>
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{agent.name}</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{agent.type}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className={`inline-block w-3 h-3 rounded-full ${getStatusColor(agent.status)} mr-2`}></span>
                          <span className="text-sm font-medium">{getStatusText(agent.status)}</span>
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <h3 className="text-lg font-medium mb-2">Description</h3>
                        <p className="text-gray-700 dark:text-gray-300">{agent.description}</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <h3 className="text-lg font-medium mb-3">Tasks</h3>
                          <ul className="space-y-2">
                            {agent.tasks.map((task, index) => (
                              <li key={index} className="flex items-start">
                                <span className="material-icons text-blue-500 mr-2 text-sm">check_circle</span>
                                <span className="text-gray-700 dark:text-gray-300">{task}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium mb-3">Capabilities</h3>
                          <ul className="space-y-2">
                            {agent.capabilities.map((capability, index) => (
                              <li key={index} className="flex items-start">
                                <span className="material-icons text-green-500 mr-2 text-sm">stars</span>
                                <span className="text-gray-700 dark:text-gray-300">{capability}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                        <h3 className="text-lg font-medium mb-3">Agent Controls</h3>
                        <div className="flex space-x-3">
                          <button 
                            onClick={() => handleActivateAgent(agent.id)}
                            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors flex items-center"
                            disabled={agent.status === 'active'}
                          >
                            <span className="material-icons mr-1">play_arrow</span>
                            Activate
                          </button>
                          <button 
                            onClick={() => handlePauseAgent(agent.id)}
                            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md transition-colors flex items-center"
                            disabled={agent.status === 'resting'}
                          >
                            <span className="material-icons mr-1">pause</span>
                            Pause
                          </button>
                          <button 
                            onClick={() => handleStopAgent(agent.id)}
                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors flex items-center"
                          >
                            <span className="material-icons mr-1">stop</span>
                            Stop
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                      <h3 className="text-lg font-medium mb-4">Activity Log</h3>
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <div className="min-w-[100px] text-sm text-gray-500 dark:text-gray-400">2 min ago</div>
                          <div className="flex-1 bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                            <p className="text-gray-700 dark:text-gray-300">Started task: Web research on AI trends</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="min-w-[100px] text-sm text-gray-500 dark:text-gray-400">15 min ago</div>
                          <div className="flex-1 bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                            <p className="text-gray-700 dark:text-gray-300">Completed task: Data extraction from quarterly reports</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="min-w-[100px] text-sm text-gray-500 dark:text-gray-400">1 hour ago</div>
                          <div className="flex-1 bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                            <p className="text-gray-700 dark:text-gray-300">Agent was activated</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </PageContainer>
      
      {/* Create Agent Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Create New Agent</h2>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <span className="material-icons">close</span>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Agent Name</label>
                <input 
                  type="text" 
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter agent name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Agent Type</label>
                <select className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option value="">Select agent type</option>
                  <option value="browser">Browser Control</option>
                  <option value="document">Document Processing</option>
                  <option value="data">Data Analysis</option>
                  <option value="communication">Communication</option>
                  <option value="content">Content Generation</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea 
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Describe what this agent does"
                  rows={3}
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Capabilities</label>
                <div className="p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 min-h-[100px]">
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs flex items-center">
                      Web navigation
                      <button className="ml-1 text-blue-500 hover:text-blue-700">
                        <span className="material-icons text-xs">close</span>
                      </button>
                    </span>
                    <input 
                      type="text" 
                      className="border-none outline-none bg-transparent text-sm flex-1 min-w-[100px]" 
                      placeholder="Add capability and press Enter"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end mt-6 space-x-3">
              <button 
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  alert('Creating new agent - this would create a new agent in a real application.');
                  setShowCreateModal(false);
                }}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
              >
                Create Agent
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Agents; 