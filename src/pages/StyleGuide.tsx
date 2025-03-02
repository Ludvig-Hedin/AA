import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const StyleGuide: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.documentElement.classList.toggle('dark', newMode);
  };

  React.useEffect(() => {
    // Initialize dark mode
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, []);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-[#121314] text-[#FFFEFC]' : 'bg-[#FFFEFC] text-[#040404]'}`}>
      <header className="border-b border-gray-300 dark:border-[#434343] p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Style Guide</h1>
          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {isDarkMode ? '🌙' : '☀️'}
            </button>
            <Link to="/" className="text-accent hover:underline">Back to App</Link>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Colors</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="h-20 bg-[#121314] rounded"></div>
              <p className="mt-2 text-sm">Dark Background: #121314</p>
            </div>
            <div>
              <div className="h-20 bg-[#FFFEFC] border border-gray-300 rounded"></div>
              <p className="mt-2 text-sm">Light Background: #FFFEFC</p>
            </div>
            <div>
              <div className="h-20 bg-[#434343] rounded"></div>
              <p className="mt-2 text-sm">Dark Border: #434343</p>
            </div>
            <div>
              <div className="h-20 bg-[#E6E3DE] rounded"></div>
              <p className="mt-2 text-sm">Light Border: #E6E3DE</p>
            </div>
            <div>
              <div className="h-20 bg-[#2383E2] rounded"></div>
              <p className="mt-2 text-sm">Accent: #2383E2</p>
            </div>
            <div>
              <div className="h-20 bg-[#9A9A9A] rounded"></div>
              <p className="mt-2 text-sm">Dark Secondary Text: #9A9A9A</p>
            </div>
            <div>
              <div className="h-20 bg-[#ADABA9] rounded"></div>
              <p className="mt-2 text-sm">Light Secondary Text: #ADABA9</p>
            </div>
          </div>
        </section>
        
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Typography</h2>
          <div className="space-y-4">
            <div>
              <h1 className="text-4xl font-bold">Heading 1</h1>
              <p className="text-sm text-gray-500">text-4xl font-bold</p>
            </div>
            <div>
              <h2 className="text-3xl font-bold">Heading 2</h2>
              <p className="text-sm text-gray-500">text-3xl font-bold</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold">Heading 3</h3>
              <p className="text-sm text-gray-500">text-2xl font-bold</p>
            </div>
            <div>
              <h4 className="text-xl font-bold">Heading 4</h4>
              <p className="text-sm text-gray-500">text-xl font-bold</p>
            </div>
            <div>
              <p className="text-base">Body Text</p>
              <p className="text-sm text-gray-500">text-base</p>
            </div>
            <div>
              <p className="text-sm">Small Text</p>
              <p className="text-sm text-gray-500">text-sm</p>
            </div>
          </div>
        </section>
        
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Buttons</h2>
          <div className="space-y-4">
            <div>
              <button className="btn-primary mr-2">Primary Button</button>
              <p className="text-sm text-gray-500 mt-2">class="btn-primary"</p>
            </div>
            <div>
              <button className="btn-secondary mr-2">Secondary Button</button>
              <p className="text-sm text-gray-500 mt-2">class="btn-secondary"</p>
            </div>
          </div>
        </section>
        
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Form Elements</h2>
          <div className="space-y-4 max-w-md">
            <div>
              <label htmlFor="example-input" className="block text-sm font-medium mb-1">
                Input Label
              </label>
              <input
                type="text"
                id="example-input"
                placeholder="Placeholder text"
                className="input-field"
              />
              <p className="text-sm text-gray-500 mt-2">class="input-field"</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default StyleGuide; 