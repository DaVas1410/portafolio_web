import { createContext, useContext, useEffect } from 'react'

const ThemeContext = createContext(null)

// Dark-only. The light theme was removed; this provider just guarantees the
// `dark` class is present and reports a fixed theme to consumers (SceneCanvas).
export function ThemeProvider({ children }) {
  useEffect(() => {
    document.documentElement.classList.add('dark')
  }, [])

  return <ThemeContext.Provider value={{ theme: 'dark', toggle: () => {} }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
