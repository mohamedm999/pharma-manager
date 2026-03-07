import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSize: '0.9rem',
          borderRadius: '10px',
          padding: '12px 16px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
        },
        success: {
          iconTheme: { primary: '#14b8a6', secondary: '#fff' },
          style: { border: '1px solid #ccfbf1', background: '#f0fdfa' },
        },
        error: {
          iconTheme: { primary: '#ef4444', secondary: '#fff' },
          style: { border: '1px solid #fee2e2', background: '#fef2f2' },
          duration: 5000,
        },
      }}
    />
    <App />
  </StrictMode>,
);
