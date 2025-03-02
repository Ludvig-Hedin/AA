import React from 'react';

const Test: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text">
      <h1 className="text-3xl font-bold mb-4">Test Page</h1>
      <p className="text-xl mb-4">If you can see this, the server is working!</p>
      <div className="flex space-x-4">
        <button className="btn-primary">Primary Button</button>
        <button className="btn-secondary">Secondary Button</button>
      </div>
    </div>
  );
};

export default Test; 