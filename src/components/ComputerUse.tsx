import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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

export function ComputerUse() {
  const [task, setTask] = useState('');
  const [apiKey, setApiKey] = useState('');
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
      const response = await axios.post<TaskResponse>('/api/computer-use', {
        task,
        openai_api_key: apiKey,
      });
      
      setTaskId(response.data.task_id);
      setStatus(response.data.status);
      setMessages(prev => [...prev, { role: 'assistant', content: `Task started: ${response.data.message}` }]);
      
      // Show browser interface
      setShowBrowser(true);
      
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
    <Card className="w-full max-w-full mx-auto">
      <CardHeader>
        <CardTitle>Computer Use</CardTitle>
        <CardDescription>
          Let AI control your computer to perform tasks
        </CardDescription>
      </CardHeader>
      
      {!showBrowser ? (
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="task">Task</Label>
                <Textarea 
                  id="task"
                  placeholder="Describe what you want the AI to do"
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                  required
                  className="min-h-20"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="apiKey">OpenAI API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="sk-..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  required
                />
                <p className="text-sm text-gray-500">
                  Your API key is used only for this request and not stored
                </p>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="mt-4 w-full"
              disabled={loading}
            >
              {loading ? <><Spinner className="mr-2" /> Processing...</> : 'Start Task'}
            </Button>
          </form>
          
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      ) : (
        <CardContent>
          <Tabs defaultValue="browser" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="browser">Browser View</TabsTrigger>
              <TabsTrigger value="interaction">Interaction</TabsTrigger>
              <TabsTrigger value="debugging">Debugging</TabsTrigger>
            </TabsList>
            
            <TabsContent value="browser" className="w-full">
              <div className="border rounded-md overflow-hidden">
                <div className="bg-gray-100 p-2 flex items-center border-b">
                  <Input 
                    type="text" 
                    value={browserUrl} 
                    readOnly 
                    className="flex-1 mr-2"
                  />
                  <Button variant="outline" size="sm" disabled>Refresh</Button>
                </div>
                <div className="aspect-video bg-white">
                  <iframe 
                    src="/api/computer-use/browser-view" 
                    className="w-full h-full" 
                    title="Browser View"
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="interaction" className="w-full h-[600px] flex flex-col">
              <div className="flex-1 overflow-y-auto border rounded-md p-4 mb-4 bg-gray-50">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`mb-4 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                    <div className={`inline-block p-3 rounded-lg ${
                      msg.role === 'user' 
                        ? 'bg-blue-500 text-white' 
                        : msg.role === 'system' 
                          ? 'bg-gray-300 text-gray-800' 
                          : 'bg-gray-200 text-gray-800'
                    }`}>
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              
              <div className="flex gap-2">
                <Input 
                  type="text" 
                  placeholder="Type a message to the AI..." 
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} disabled={!taskId || !isPolling}>
                  Send
                </Button>
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button 
                  variant="outline" 
                  onClick={handlePauseTask} 
                  disabled={!taskId || !isPolling}
                >
                  Pause
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleResumeTask} 
                  disabled={!taskId || isPolling}
                >
                  Resume
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleStopTask} 
                  disabled={!taskId}
                >
                  Stop Task
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="debugging" className="w-full">
              <div className="border rounded-md p-4 bg-gray-50 h-[600px] overflow-y-auto">
                <h3 className="text-lg font-medium mb-2">AI Reasoning</h3>
                <div className="bg-white p-3 rounded border mb-4">
                  <pre className="whitespace-pre-wrap text-sm">{aiReasoning || 'No reasoning data available yet.'}</pre>
                </div>
                
                <h3 className="text-lg font-medium mb-2">Task Status: {status}</h3>
                <p className="text-sm text-gray-500 mb-4">Task ID: {taskId}</p>
                
                {taskResult && taskResult.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Task History:</h4>
                    {taskResult.map((item, index) => (
                      <div key={index} className="mb-4 p-3 border rounded bg-white">
                        <pre className="whitespace-pre-wrap break-words text-sm">
                          {JSON.stringify(item, null, 2)}
                        </pre>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      )}
    </Card>
  );
} 