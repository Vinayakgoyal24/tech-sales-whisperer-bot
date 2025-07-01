import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import posthog from 'posthog-js';

try {
  posthog.init('phc_5o7AhpmhUi8g8aPDVxqe2EFq1tFIbFHKjvZ8Xeq7Gy1', {
    api_host: 'https://app.posthog.com',
    autocapture: true,
    capture_pageview: true,
    disable_session_recording: false,
  });
} catch (error) {
  console.error("PostHog failed to initialize:", error);
}


createRoot(document.getElementById('root')!).render(<App />);