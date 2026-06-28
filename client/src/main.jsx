// main.jsx is the true entry point of the React application.
// It mounts the top-level <App /> component into the <div id="root"> in index.html.
// We also import our global CSS here so it applies to every component.

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

// StrictMode intentionally renders components twice in development
// to help detect side effects and deprecated API usage.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
