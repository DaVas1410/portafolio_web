import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { LangProvider } from './context/LangContext.jsx'
import { MotionProvider } from './context/MotionContext.jsx'
import { ScrollProvider } from './context/ScrollContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <LangProvider>
        <MotionProvider>
          <ScrollProvider>
            <App />
          </ScrollProvider>
        </MotionProvider>
      </LangProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
