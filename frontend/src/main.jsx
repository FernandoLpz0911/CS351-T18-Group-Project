// main.jsx - Entry point of the React application
// This file renders the App component into the DOM

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'  // Import base styles
import App from './App.jsx'  // Import main App component

// Find the root HTML element (defined in index.html)
// Then create a React root and render the App component inside it
createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* StrictMode helps catch potential problems in your app during development */}
    <App />
  </StrictMode>,
)