import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/styles.css';

console.log('Application starting...');

// Check if root element exists
const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('Root element not found in the DOM!');
  // Add a fallback element if root doesn't exist
  const fallbackElement = document.createElement('div');
  fallbackElement.id = 'root';
  fallbackElement.innerHTML = '<div style="padding: 20px; text-align: center;">Error: Root element not found. A fallback has been created.</div>';
  document.body.appendChild(fallbackElement);
  
  // Try again with the fallback
  ReactDOM.createRoot(fallbackElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.log('Root element found, mounting React app');
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} 