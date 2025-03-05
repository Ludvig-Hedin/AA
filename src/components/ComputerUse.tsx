import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/Card';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

// Deklarera miljövariabeltyp
declare global {
  interface ImportMetaEnv {
    readonly VITE_OPENAI_API_KEY: string;
  }
}

// Inline Spinner component
const Spinner = ({ className = "" }) => (
  <div className={`animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full ${className}`}>
    <span className="sr-only">Loading</span>
  </div>
);

interface TaskResponse {
  status: string;
  message: string;
  task_id?: string;
  data?: {
    history?: any[];
    currentUrl?: string;
    reasoning?: string;
  };
}

export const ComputerUse: React.FC = () => {
  const [task, setTask] = useState('');
  const [loading, setLoading] = useState(false);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [taskResult, setTaskResult] = useState<any[] | null>(null);
  const [browserUrl, setBrowserUrl] = useState<string>('');
  const [userMessage, setUserMessage] = useState('');
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);
  const [showBrowser, setShowBrowser] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [aiReasoning, setAiReasoning] = useState<string>('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setTaskResult(null);
    setTaskId(null);
    setMessages([{ role: 'user', content: task }]);
    
    try {
      // Using environment variable for API key
      const response = await axios.post<TaskResponse>('/api/computer-use', {
        task,
        openai_api_key: import.meta.env.VITE_OPENAI_API_KEY,
        headless: false
      });
      
      if (response.data.task_id) {
        setTaskId(response.data.task_id);
      }
      setStatus(response.data.status);
      setMessages(prev => [...prev, { role: 'assistant', content: `Task started: ${response.data.message}` }]);
      
      // Show browser interface
      setShowBrowser(true);
      if (response.data.data?.currentUrl) {
        setBrowserUrl(response.data.data.currentUrl);
      }
      
      // Poll for updates if task started successfully
      if (response.data.status === 'started' && response.data.task_id) {
        setIsPolling(true);
        pollTaskStatus(response.data.task_id);
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'An unknown error occurred');
      setLoading(false);
      setMessages(prev => [...prev, { role: 'system', content: `Error: ${err.response?.data?.detail || err.message || 'An unknown error occurred'}` }]);
    }
  };

  const pollTaskStatus = async (id: string) => {
    if (!isPolling) return;
    
    try {
      const response = await axios.get<TaskResponse>(`/api/computer-use/${id}`);
      
      setStatus(response.data.status);
      
      // Update browser URL if available
      if (response.data.data?.currentUrl) {
        setBrowserUrl(response.data.data.currentUrl as string);
      }
      
      // Update AI reasoning if available
      if (response.data.data?.reasoning && response.data.data.reasoning !== aiReasoning) {
        setAiReasoning(response.data.data.reasoning);
        // Ensure content is always a string
        const reasoningText = response.data.data.reasoning || 'AI reasoning unavailable';
        setMessages(prev => [...prev, { role: 'assistant', content: reasoningText }]);
      }
      
      // Update task result/history
      setTaskResult(response.data.data?.history || []);
      
      // Continue polling if task is still running
      if (response.data.status === 'running' || response.data.status === 'pending') {
        setTimeout(() => pollTaskStatus(id), 3000);
      } else {
        setLoading(false);
        setIsPolling(false);
        setMessages(prev => [...prev, { role: 'system', content: `Task completed with status: ${response.data.status}` }]);
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Error fetching task status');
      setLoading(false);
      setIsPolling(false);
      setMessages(prev => [...prev, { role: 'system', content: `Error: ${err.response?.data?.detail || err.message || 'Error fetching task status'}` }]);
    }
  };

  const handleSendMessage = async () => {
    if (!userMessage.trim() || !taskId) return;
    
    const messageToSend = userMessage;
    setUserMessage('');
    setMessages(prev => [...prev, { role: 'user', content: messageToSend }]);
    
    try {
      await axios.post(`/api/computer-use/${taskId}/message`, {
        message: messageToSend
      });
      
      // The response will be captured in the next polling cycle
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Error sending message');
      setMessages(prev => [...prev, { role: 'system', content: `Error sending message: ${err.response?.data?.detail || err.message}` }]);
    }
  };

  const handlePauseTask = async () => {
    if (!taskId) return;
    
    try {
      await axios.post(`/api/computer-use/${taskId}/pause`);
      setMessages(prev => [...prev, { role: 'system', content: 'Task paused' }]);
      setIsPolling(false);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Error pausing task');
      setMessages(prev => [...prev, { role: 'system', content: `Error pausing task: ${err.response?.data?.detail || err.message}` }]);
    }
  };

  const handleResumeTask = async () => {
    if (!taskId) return;
    
    try {
      await axios.post(`/api/computer-use/${taskId}/resume`);
      setMessages(prev => [...prev, { role: 'system', content: 'Task resumed' }]);
      setIsPolling(true);
      pollTaskStatus(taskId);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Error resuming task');
      setMessages(prev => [...prev, { role: 'system', content: `Error resuming task: ${err.response?.data?.detail || err.message}` }]);
    }
  };

  const handleStopTask = async () => {
    if (!taskId) return;
    
    try {
      await axios.post(`/api/computer-use/${taskId}/stop`);
      setMessages(prev => [...prev, { role: 'system', content: 'Task stopped' }]);
      setIsPolling(false);
      setLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Error stopping task');
      setMessages(prev => [...prev, { role: 'system', content: `Error stopping task: ${err.response?.data?.detail || err.message}` }]);
    }
  };

  return (
    <div className="computer-use-content">
      {!showBrowser ? (
        <Card className="bg-white dark:bg-gray-900 shadow-md border-0">
          <CardHeader>
            <CardTitle>Computer Use</CardTitle>
            <CardDescription>
              Let AI control your computer to perform tasks for you
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="task">What would you like the AI to do?</Label>
                  <Textarea 
                    id="task"
                    placeholder="Describe what you want the AI to do, e.g. 'Search for latest news about AI development'"
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                    required
                    className="min-h-24 max-w-3xl dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-gray-400 dark:focus:border-gray-500 focus:ring-0"
                  />
                </div>
                
                <div className="flex items-center space-x-2 max-w-3xl">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="rounded text-gray-600 focus:ring-gray-500"
                  />
                  <Label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-300">
                    I understand that allowing AI to control my computer may carry risks. I accept responsibility for the tasks I instruct the AI to perform.
                  </Label>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="mt-4 w-auto px-6"
                disabled={loading || !acceptedTerms || !task.trim()}
              >
                {loading ? <><Spinner className="mr-2" /> Processing...</> : 'Start Task'}
              </Button>
            </form>
            
            {error && (
              <Alert variant="destructive" className="mt-4 max-w-3xl">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Browser view takes 2/3 of the space */}
          <div className="lg:col-span-2">
            <Card className="h-full bg-white dark:bg-gray-900 shadow-md border-0">
              <CardHeader className="border-b border-gray-200 dark:border-gray-800">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span>Browser View</span>
                  {loading && <Spinner />}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-md text-sm truncate">
                    {browserUrl || 'Loading...'}
                  </div>
                  <div className="flex space-x-1">
                    <Button 
                      onClick={handlePauseTask}
                      disabled={!isPolling || !taskId}
                      className="h-8 px-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                      variant="secondary"
                    >
                      Pause
                    </Button>
                    <Button 
                      onClick={handleResumeTask}
                      disabled={isPolling || !taskId}
                      className="h-8 px-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                      variant="secondary"
                    >
                      Resume
                    </Button>
                    <Button 
                      onClick={handleStopTask}
                      disabled={!taskId}
                      className="h-8 px-2 text-red-600 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                      variant="secondary"
                    >
                      Stop
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-0 h-[calc(100vh-15rem)] overflow-hidden">
                <iframe 
                  src="/api/computer-use/browser-view" 
                  className="w-full h-full border-0"
                  title="Browser View"
                  sandbox="allow-same-origin allow-scripts"
                />
              </CardContent>
            </Card>
          </div>
          
          {/* Chat takes 1/3 of the space */}
          <div>
            <Card className="h-full bg-white dark:bg-gray-900 shadow-md border-0 flex flex-col">
              <CardHeader className="border-b border-gray-200 dark:border-gray-800 pb-3">
                <CardTitle className="text-lg">Chat with AI</CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 overflow-y-auto p-4 h-[calc(100vh-18rem)]">
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div 
                      key={index} 
                      className={`flex flex-col ${
                        message.role === 'user' 
                          ? 'items-end' 
                          : 'items-start'
                      }`}
                    >
                      <div 
                        className={`max-w-[80%] rounded-lg px-4 py-2 ${
                          message.role === 'user' 
                            ? 'bg-blue-600 text-white' 
                            : message.role === 'system'
                              ? 'bg-gray-600 text-white'
                              : 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                        }`}
                      >
                        {message.content}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {message.role === 'user' ? 'You' : message.role === 'system' ? 'System' : 'AI'}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </CardContent>
              
              <CardFooter className="border-t border-gray-200 dark:border-gray-800 p-4">
                <div className="flex w-full space-x-2">
                  <Input
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    placeholder="Type a message..."
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    disabled={!taskId || !isPolling}
                    className="flex-1 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-gray-400 dark:focus:border-gray-500"
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!taskId || !isPolling || !userMessage.trim()}
                    className="w-auto"
                  >
                    Send
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}; 