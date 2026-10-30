import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { MotionProvider } from './context/MotionContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import './styles/index.css';

createRoot(document.getElementById('root')).render(
  <ThemeProvider>
    <MotionProvider>
      <App />
    </MotionProvider>
  </ThemeProvider>,
);
