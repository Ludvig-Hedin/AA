import React, { useState, useRef, useEffect, ChangeEvent, FormEvent } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string, files: File[]) => void;
  isLoading?: boolean;
  placeholder?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  isLoading = false, 
  placeholder = "Ask anything, use @ to tag files and collections",
}) => {
  const [message, setMessage] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [isAttachmentMenuOpen, setIsAttachmentMenuOpen] = useState(false);
  const [isMentionMenuOpen, setIsMentionMenuOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(true); // Start active by default
  const [lastMentionIndex, setLastMentionIndex] = useState(-1);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const mentionRef = useRef<HTMLDivElement>(null);
  const attachmentRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Effect to focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  
  // Effect to handle escape key and clicking outside
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFocused(false);
      }
    };
    
    const handleClickOutside = (e: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Reset form state after sending a message
  const resetForm = () => {
    setMessage('');
    setAttachedFiles([]);
    setIsAttachmentMenuOpen(false);
    setIsMentionMenuOpen(false);
  };
  
  // Handle message submission
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() || attachedFiles.length > 0) {
      onSendMessage(message, attachedFiles);
      resetForm();
    }
  };
  
  // Handle message input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newMessage = e.target.value;
    setMessage(newMessage);
    
    // Check for @ symbol to trigger mention menu
    const match = newMessage.match(/@(\w*)$/);
    if (match) {
      setIsMentionMenuOpen(true);
      setLastMentionIndex(match.index || -1);
    } else {
      setIsMentionMenuOpen(false);
    }
  };
  
  // Handle file attachment
  const handleFileAttachment = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachedFiles(prev => [...prev, ...newFiles]);
    }
  };
  
  // Handle file removal
  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  // Handle opening file input
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Handle opening image input
  const triggerImageInput = () => {
    if (imageInputRef.current) {
      imageInputRef.current.click();
    }
  };
  
  // Add mention to message
  const addMention = (username: string) => {
    if (lastMentionIndex >= 0) {
      const before = message.substring(0, lastMentionIndex);
      const after = message.substring(lastMentionIndex + 1);
      setMessage(`${before}@${username} `);
      setIsMentionMenuOpen(false);
      inputRef.current?.focus();
    }
  };
  
  // Optimize the prompt
  const handleOptimizePrompt = () => {
    if (message.trim()) {
      // This would be the logic to optimize the prompt
      // For now, we'll just add a prefix as an example
      setMessage(`Optimized: ${message}`);
    }
  };
  
  return (
    <form 
      ref={formRef}
      onSubmit={handleSubmit} 
      className={`relative rounded-lg transition-all duration-300 ${
        isFocused 
          ? 'bg-[#232425] shadow-lg' 
          : 'bg-[#1D1E1F] hover:bg-[#232425]'
      }`}
      onClick={() => {
        if (!isFocused) {
          setIsFocused(true);
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }
      }}
    >
      {/* Optimize button - only shown when text is entered and input is focused */}
      {message.trim() && isFocused && (
        <div className="mb-3 flex justify-end">
          <button
            type="button"
            onClick={handleOptimizePrompt}
            className="bg-[#232425] border border-[#333435] rounded-lg px-3 py-1.5 flex items-center cursor-pointer hover:bg-[#2A2B2C] transition-colors"
          >
            <span className="text-sm font-medium">Optimize prompt</span>
            <svg className="ml-2" width="20" height="20" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.9079 13.5557L17.2779 11.1857C17.5719 10.8927 17.7179 10.7457 17.7959 10.5877C17.9459 10.2877 17.9459 9.93471 17.7959 9.63371C17.7179 9.47571 17.5719 9.32971 17.2789 9.03671C16.9859 8.74371 16.8389 8.59771 16.6819 8.51971C16.5337 8.44592 16.3705 8.40751 16.2049 8.40751C16.0394 8.40751 15.8761 8.44592 15.7279 8.51971C15.5699 8.59771 15.4229 8.74371 15.1299 9.03671L12.7599 11.4077M14.9079 13.5557L6.68592 21.7787C6.39292 22.0717 6.24592 22.2177 6.08792 22.2957C5.78792 22.4457 5.43492 22.4457 5.13392 22.2957C4.97592 22.2177 4.82992 22.0717 4.53692 21.7787C4.24392 21.4857 4.09792 21.3387 4.01992 21.1817C3.94612 21.0335 3.90771 20.8703 3.90771 20.7047C3.90771 20.5392 3.94612 20.3759 4.01992 20.2277C4.09792 20.0697 4.24392 19.9227 4.53692 19.6297L12.7599 11.4077M14.9079 13.5557L12.7599 11.4077M20.4079 3.40771L20.2979 3.70671C20.1519 4.09771 20.0799 4.29371 19.9379 4.43671C19.7939 4.57971 19.5979 4.65271 19.2069 4.79671L18.9079 4.90771L19.2069 5.01771C19.5979 5.16271 19.7939 5.23571 19.9369 5.37771C20.0799 5.52171 20.1519 5.71772 20.2969 6.10872L20.4079 6.40771L20.5179 6.10872C20.6639 5.71772 20.7359 5.52172 20.8779 5.37872C21.0219 5.23572 21.2179 5.16271 21.6089 5.01871L21.9079 4.90771L21.6089 4.79771C21.2179 4.65271 21.0219 4.57971 20.8789 4.43771C20.7359 4.29371 20.6639 4.09771 20.5189 3.70671L20.4079 3.40771ZM20.4079 13.4077L20.2979 13.7067C20.1519 14.0977 20.0799 14.2937 19.9379 14.4367C19.7939 14.5797 19.5979 14.6527 19.2069 14.7967L18.9079 14.9077L19.2069 15.0177C19.5979 15.1637 19.7939 15.2357 19.9369 15.3777C20.0799 15.5217 20.1519 15.7177 20.2969 16.1087L20.4079 16.4077L20.5179 16.1087C20.6639 15.7177 20.7359 15.5217 20.8779 15.3787C21.0219 15.2357 21.2179 15.1627 21.6089 15.0187L21.9079 14.9077L21.6089 14.7977C21.2179 14.6517 21.0219 14.5797 20.8789 14.4377C20.7359 14.2937 20.6639 14.0977 20.5189 13.7067L20.4079 13.4077ZM11.4079 3.40771L11.2979 3.70671C11.1519 4.09771 11.0799 4.29371 10.9379 4.43671C10.7939 4.57971 10.5979 4.65271 10.2069 4.79671L9.90792 4.90771L10.2069 5.01771C10.5979 5.16271 10.7939 5.23571 10.9369 5.37771C11.0799 5.52171 11.1529 5.71772 11.2969 6.10872L11.4079 6.40771L11.5179 6.10872C11.6639 5.71772 11.7359 5.52172 11.8779 5.37872C12.0219 5.23572 12.2179 5.16271 12.6089 5.01871L12.9079 4.90771L12.6089 4.79771C12.2179 4.65271 12.0219 4.57971 11.8789 4.43771C11.7359 4.29371 11.6629 4.09771 11.5189 3.70671L11.4079 3.40771Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      )}
      
      {/* Hidden file inputs */}
      <input 
        type="file" 
        ref={fileInputRef}
        className="hidden" 
        onChange={handleFileAttachment}
        multiple
      />
      <input 
        type="file" 
        ref={imageInputRef}
        className="hidden" 
        accept="image/*" 
        onChange={handleFileAttachment}
        multiple
      />
      
      {/* File preview area */}
      {attachedFiles.length > 0 && (
        <div className="flex flex-wrap gap-2 p-2 border-b border-[#333435]">
          {attachedFiles.map((file, index) => (
            <div key={index} className="bg-[#333435] rounded px-2 py-1 flex items-center text-xs">
              <span className="material-icons text-xs mr-1">
                {file.type.startsWith('image/') ? 'image' : 'insert_drive_file'}
              </span>
              <span className="max-w-[100px] truncate">{file.name}</span>
              <button 
                type="button"
                className="ml-1 text-gray-400 hover:text-gray-200"
                onClick={() => removeFile(index)}
              >
                <span className="material-icons text-xs">close</span>
              </button>
            </div>
          ))}
        </div>
      )}
      
      {/* Input area */}
      <div className="flex items-center p-2">
        {isFocused && (
          <div className="flex items-center mr-2">
            <div className="relative">
              <button 
                type="button"
                className="p-1 text-gray-400 hover:text-gray-200 rounded-full hover:bg-[#333435]"
                onClick={() => setIsAttachmentMenuOpen(!isAttachmentMenuOpen)}
              >
                <span className="material-icons text-sm">attach_file</span>
              </button>
              
              {/* Attachment menu */}
              {isAttachmentMenuOpen && (
                <div 
                  ref={attachmentRef}
                  className="absolute bottom-full left-0 mb-2 bg-[#333435] rounded-md shadow-lg overflow-hidden"
                >
                  <button 
                    type="button"
                    className="w-full flex items-center p-2 hover:bg-[#444546] text-left text-sm"
                    onClick={triggerFileInput}
                  >
                    <span className="material-icons text-sm mr-2">insert_drive_file</span>
                    Document
                  </button>
                  <button 
                    type="button"
                    className="w-full flex items-center p-2 hover:bg-[#444546] text-left text-sm"
                    onClick={triggerImageInput}
                  >
                    <span className="material-icons text-sm mr-2">image</span>
                    Image
                  </button>
                  <button 
                    type="button"
                    className="w-full flex items-center p-2 hover:bg-[#444546] text-left text-sm"
                    onClick={() => alert('URL attachment coming soon')}
                  >
                    <span className="material-icons text-sm mr-2">link</span>
                    URL
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Mention buttons */}
        {isFocused && (
          <div className="flex items-center mr-2 space-x-1">
            <button
              type="button"
              className="px-1.5 py-0.5 text-xs rounded text-gray-300 bg-[#333435] hover:bg-[#444546]"
              onClick={() => addMention('Sofia')}
            >
              @Sofia
            </button>
            <button
              type="button"
              className="px-1.5 py-0.5 text-xs rounded text-gray-300 bg-[#333435] hover:bg-[#444546]"
              onClick={() => addMention('Ludvig')}
            >
              @Ludvig
            </button>
            <button
              type="button"
              className="px-1.5 py-0.5 text-xs rounded text-gray-300 bg-[#333435] hover:bg-[#444546]"
              onClick={() => addMention('MarketingDocs')}
            >
              @MarketingDocs
            </button>
          </div>
        )}
        
        {/* Text input */}
        <div className="flex flex-1 items-center">
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={handleChange}
            placeholder={isFocused ? placeholder : "Click to type..."}
            className={`flex-1 bg-transparent border-none outline-none ${isFocused ? 'text-white' : 'text-gray-400'}`}
            disabled={isLoading}
          />
          
          {/* Mention menu */}
          {isMentionMenuOpen && (
            <div 
              ref={mentionRef}
              className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-[#333435] rounded-md shadow-lg overflow-hidden"
            >
              <button 
                type="button"
                className="w-full flex items-center p-2 hover:bg-[#444546] text-left"
                onClick={() => addMention('Sofia')}
              >
                @Sofia
              </button>
              <button 
                type="button"
                className="w-full flex items-center p-2 hover:bg-[#444546] text-left"
                onClick={() => addMention('Ludvig')}
              >
                @Ludvig
              </button>
              <button 
                type="button"
                className="w-full flex items-center p-2 hover:bg-[#444546] text-left"
                onClick={() => addMention('MarketingDocs')}
              >
                @MarketingDocs
              </button>
            </div>
          )}
        </div>
        
        {/* Send button */}
        <button 
          type="submit"
          className={`p-1 rounded-full ${
            message.trim() || attachedFiles.length > 0 
              ? 'bg-blue-600 text-white' 
              : 'text-gray-400 bg-[#333435]'
          }`}
          disabled={isLoading || (!message.trim() && attachedFiles.length === 0)}
        >
          <span className="material-icons">send</span>
        </button>
      </div>
    </form>
  );
};

export default ChatInput; 