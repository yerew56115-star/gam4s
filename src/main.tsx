import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Global error handler for debugging production white screens
window.onerror = function(message, source, lineno, colno, error) {
  const root = document.getElementById('root');
  if (root && root.innerHTML === "") {
    root.innerHTML = `<div style="background:#0c0c0e;color:#f87171;padding:2rem;font-family:monospace;height:100vh;">
      <h1 style="font-size:1.2rem;margin-bottom:1rem;">CRITICAL_SYSTEM_ERROR</h1>
      <p style="font-size:0.8rem;color:#71717a;">The stealth node failed to initialize.</p>
      <pre style="background:#18181b;padding:1rem;border-radius:4px;overflow:auto;margin-top:1rem;">${message}</pre>
      <p style="font-size:0.7rem;margin-top:2rem;color:#3f3f46;">Ensure you are serving this from a web server and have run the build process.</p>
    </div>`;
  }
  return false;
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
