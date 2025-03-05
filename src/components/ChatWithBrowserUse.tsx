import React, { useState, useEffect, useRef } from 'react';
import { sendMessageToAI } from '../services/aiService';
import { startBrowserTask, getBrowserTaskStatus, sendMessageToBrowserTask } from '../services/browserUseService';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Textarea } from './ui/textarea';

// Message types for chat
interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatWithBrowserUseProps {
  initialMessage?: string;
  className?: string;
}

const Spinner = () => (
  <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full">
    <span className="sr-only">Loading</span>
  </div>
);

export const ChatWithBrowserUse: React.FC<ChatWithBrowserUseProps> = ({ 
  initialMessage,
  className = ''
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isBrowserTask, setIsBrowserTask] = useState(false);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [browserUrl, setBrowserUrl] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Focus input on initial render and after message send
  useEffect(() => {
    if (inputRef.current && !isProcessing) {
      inputRef.current.focus();
    }
  }, [isProcessing]);
  
  // Handle initial message if provided
  useEffect(() => {
    if (initialMessage) {
      handleSendMessage(initialMessage);
    }
  }, [initialMessage]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const handleSendMessage = async (message?: string) => {
    const messageToSend = message || inputValue;
    if (!messageToSend.trim()) return;
    
    // Clear input and add user message to chat
    setInputValue('');
    setIsProcessing(true);
    setMessages(prev => [...prev, { role: 'user', content: messageToSend }]);
    
    // Detect browser use command
    const isBrowserCommand = messageToSend.toLowerCase().includes('browser');
    
    try {
      if (taskId) {
        // Send message to existing browser task
        await sendMessageToBrowserTask(taskId, messageToSend);
        // Response will be captured in the next polling cycle
      } else if (isBrowserCommand) {
        // Start a new browser task
        setIsBrowserTask(true);
        const response = await startBrowserTask(messageToSend);
        
        if (response.task_id) {
          setTaskId(response.task_id);
          setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: `I'll help you with that. Starting browser task...`
          }]);
          pollTaskStatus(response.task_id);
        }
      } else {
        // Regular chat message - Pass the conversation history
        const response = await sendMessageToAI(
          messageToSend, 
          // Only include the last 10 messages to keep context manageable
          messages.slice(-10)
        );
        
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: response.message 
        }]);
        
        // Check if the AI response suggests a browser task
        if (response.suggests_browser) {
          setMessages(prev => [...prev, { 
            role: 'system', 
            content: 'You can say "Yes, use the browser" to start a browser task.'
          }]);
        }
        
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { 
        role: 'system', 
        content: 'Error processing your request. Please try again.'
      }]);
      setIsProcessing(false);
    }
  };
  
  const pollTaskStatus = async (id: string) => {
    try {
      const response = await getBrowserTaskStatus(id);
      
      if (response.data?.currentUrl) {
        setBrowserUrl(response.data.currentUrl);
      }
      
      if (response.data?.reasoning) {
        const reasoningText = response.data.reasoning;
        setMessages(prev => {
          // Check if this reasoning is already in messages to avoid duplicates
          if (!prev.some(m => m.role === 'assistant' && m.content === reasoningText)) {
            return [...prev, { role: 'assistant', content: reasoningText }];
          }
          return prev;
        });
      }
      
      if (response.status === 'running' || response.status === 'pending') {
        // Continue polling
        setTimeout(() => pollTaskStatus(id), 3000);
      } else {
        setIsProcessing(false);
        setMessages(prev => [...prev, { 
          role: 'system', 
          content: `Task completed with status: ${response.status}`
        }]);
        
        // Clear task ID if the task is completed
        if (response.status === 'completed' || response.status === 'failed') {
          setTaskId(null);
        }
      }
    } catch (error) {
      console.error('Error polling task status:', error);
      setIsProcessing(false);
      setMessages(prev => [...prev, { 
        role: 'system', 
        content: 'Error checking task status. Please try again.'
      }]);
    }
  };
  
  return (
    <div className={`flex flex-col h-full bg-gray-900 ${className}`}>
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex h-full items-center justify-center text-gray-400">
            <div className="text-center">
              <p>How can I help you today?</p>
              <p className="mt-2 text-sm">You can ask me to do tasks in the browser or just chat.</p>
              <p className="mt-4 text-xs text-gray-500">Note: AI browser control has limitations and operates within your browser permissions.</p>
            </div>
          </div>
        )}
        
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`max-w-3xl ${
              message.role === 'user' 
                ? 'ml-auto bg-blue-600 text-white' 
                : message.role === 'system'
                  ? 'mx-auto bg-gray-700 text-gray-200 italic text-sm'
                  : 'mr-auto bg-gray-800 text-white'
            } rounded-lg p-3 shadow-md`}
          >
            {message.content}
          </div>
        ))}
        
        {/* Auto-scroll anchor */}
        <div ref={messagesEndRef} />
        
        {/* Loading indicator */}
        {isProcessing && (
          <div className="flex justify-center items-center gap-2 text-gray-400">
            <Spinner />
            <span>Processing...</span>
          </div>
        )}
        
        {/* Browser info */}
        {isBrowserTask && browserUrl && (
          <div className="mx-auto bg-gray-800 p-3 rounded-lg text-sm text-gray-300 shadow-md border border-gray-700">
            <p className="font-semibold">Current URL:</p>
            <p className="truncate">{browserUrl}</p>
          </div>
        )}
      </div>
      
      {/* Input area */}
      <div className="border-t border-gray-700 p-4 bg-gray-900 rounded-b-lg">
        <div className="flex gap-2">
          <Textarea
            ref={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message or browser task..."
            className="resize-none min-h-12 max-h-36 rounded-lg border-gray-600 focus:border-blue-500"
            disabled={isProcessing}
          />
          <Button 
            onClick={() => handleSendMessage()} 
            disabled={isProcessing || !inputValue.trim()}
            className="self-end bg-white text-black hover:bg-gray-100 rounded-lg font-medium"
          >
            {isProcessing ? <Spinner /> : 'Send'}
          </Button>
        </div>
        
        {taskId && (
          <div className="mt-2 text-sm text-gray-400 flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
            AI is controlling your browser. You can give additional instructions.
          </div>
        )}
      </div>
    </div>
  );
}; 