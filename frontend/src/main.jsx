// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes/AppRoutes';
import { loadSettings } from './utils/settingsCache';
import './index.css';

// Load settings from DB before rendering so utilities like formatCurrency
// have the correct currency code from the very first render.
loadSettings().finally(() => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppRoutes />
      </BrowserRouter>
    </React.StrictMode>
  );
});
