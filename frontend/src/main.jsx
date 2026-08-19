// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes/AppRoutes';
import { loadSettings } from './utils/settingsCache';
import './index.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return <div style={{padding: '20px', color: 'red', fontFamily: 'sans-serif'}}>
        <h1>React Render Error</h1>
        <pre>{this.state.error.stack || this.state.error.message}</pre>
      </div>;
    }
    return this.props.children;
  }
}

loadSettings().catch(console.error);

ReactDOM.createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppRoutes />
    </BrowserRouter>
  </ErrorBoundary>
);
