import React from 'react';

const AppPreviewMockup: React.FC = () => {
  return (
    <div className="relative w-full max-w-lg">
      {/* Background Decorations - Monochrome pulsing blobs */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-gray-500 rounded-full opacity-10 animate-pulse" style={{ animationDuration: '6s' }}></div>
      <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-64 h-64 bg-gray-300 rounded-full opacity-10 animate-pulse" style={{ animationDuration: '8s' }}></div>
      <div className="absolute top-1/2 left-1/4 transform -translate-y-1/2 -translate-x-1/2 w-32 h-32 bg-white rounded-full opacity-10 animate-pulse" style={{ animationDuration: '7s' }}></div>
      
      <div className="relative">
        <div className="relative overflow-hidden rounded-xl bg-gray-900 shadow-xl">
          <div className="p-8">
            {/* App Interface Mockup */}
            <div className="relative mx-auto w-full max-w-md">
              {/* Top Bar */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                    <span className="text-white font-bold">A</span>
                  </div>
                  <div className="ml-2">
                    <div className="h-3 w-20 bg-gray-700 rounded"></div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <div className="w-6 h-6 rounded-full bg-gray-800 border border-gray-700"></div>
                  <div className="w-6 h-6 rounded-full bg-gray-800 border border-gray-700"></div>
                </div>
              </div>
              
              {/* Main Content Area */}
              <div className="aspect-w-3 aspect-h-2 bg-gray-800 rounded-lg overflow-hidden shadow-lg mb-6">
                <div className="p-4 flex flex-col">
                  <div className="h-4 w-1/2 bg-gray-700 rounded mb-2"></div>
                  <div className="h-10 bg-gray-600 rounded-md opacity-75 mb-4"></div>
                  <div className="h-3 bg-gray-700 rounded mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded"></div>
                </div>
              </div>
              
              {/* Chat Interface Preview with Animation */}
              <div className="bg-gray-800 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-4 w-16 bg-gray-700 rounded"></div>
                  <div className="h-4 w-4 bg-gray-700 rounded-full"></div>
                </div>
                <div className="space-y-2">
                  {/* Existing user message */}
                  <div className="flex justify-end">
                    <div className="bg-gray-700 rounded-lg p-2 max-w-xs">
                      <div className="h-2 w-20 bg-gray-600 rounded mb-1"></div>
                      <div className="h-2 w-16 bg-gray-600 rounded"></div>
                    </div>
                  </div>
                  
                  {/* Existing AI response */}
                  <div className="flex justify-start">
                    <div className="bg-gray-700 rounded-lg p-2 max-w-xs">
                      <div className="h-2 w-24 bg-gray-600 rounded mb-1"></div>
                      <div className="h-2 w-32 bg-gray-600 rounded mb-1"></div>
                      <div className="h-2 w-20 bg-gray-600 rounded"></div>
                    </div>
                  </div>
                  
                  {/* Animated new user message - appears with animation */}
                  <div className="flex justify-end animate-fadeIn" style={{ animationDelay: '1s', animationDuration: '0.5s' }}>
                    <div className="bg-gray-700 rounded-lg p-2 max-w-xs">
                      <div className="h-2 w-28 bg-gray-600 rounded mb-1"></div>
                      <div className="h-2 w-24 bg-gray-600 rounded"></div>
                    </div>
                  </div>
                  
                  {/* Animated AI typing indicator - appears with animation */}
                  <div className="flex justify-start animate-fadeIn" style={{ animationDelay: '2s', animationDuration: '0.5s' }}>
                    <div className="bg-gray-700 rounded-lg py-2 px-3 max-w-xs">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Animated AI response - appears with animation */}
                  <div className="flex justify-start animate-fadeIn" style={{ animationDelay: '3.5s', animationDuration: '0.8s' }}>
                    <div className="bg-gray-700 rounded-lg p-2 max-w-xs">
                      <div className="h-2 w-36 bg-gray-600 rounded mb-1"></div>
                      <div className="h-2 w-32 bg-gray-600 rounded mb-1"></div>
                      <div className="h-2 w-24 bg-gray-600 rounded"></div>
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex items-center">
                  <div className="flex-1 h-8 bg-gray-700 rounded-lg"></div>
                  <div className="ml-2 w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="white">
                      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Bottom Navigation */}
              <div className="flex gap-2">
                <div className="flex-1 bg-gray-800 rounded-lg p-3 flex items-center justify-center">
                  <div className="h-5 w-5 bg-gray-700 rounded-full"></div>
                </div>
                <div className="flex-1 bg-gray-800 rounded-lg p-3 flex items-center justify-center">
                  <div className="h-5 w-5 bg-gray-700 rounded-full"></div>
                </div>
                <div className="flex-1 bg-gray-800 rounded-lg p-3 flex items-center justify-center">
                  <div className="h-5 w-5 bg-gray-700 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppPreviewMockup; 