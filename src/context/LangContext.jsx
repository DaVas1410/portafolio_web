import { createContext, useContext, useEffect, useState } from 'react'

const LangContext = createContext(null)

function getInitialLang() {
  if (typeof window === 'undefined') return 'en'
  try {
    const stored = localStorage.getItem('lang')
    if (stored === 'en' || stored === 'es') return stored
    return navigator.language?.toLowerCase().startsWith('es') ? 'es' : 'en'
  } catch {
    return 'en'
  }
}

export function LangProvider({ children }) {
  const [lang, setLang] = useState(getInitialLang)

  useEffect(() => {
    document.documentElement.lang = lang
    try {
      localStorage.setItem('lang', lang)
    } catch {
      /* storage unavailable — non-fatal */
    }
  }, [lang])

  const toggle = () => setLang((l) => (l === 'en' ? 'es' : 'en'))

  return <LangContext.Provider value={{ lang, toggle }}>{children}</LangContext.Provider>
}

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used within LangProvider')
  return ctx
}

/** Pick the string for the active language from a { en, es } pair. */
export function t(pair, lang) {
  if (pair == null) return ''
  if (typeof pair === 'string') return pair
  return pair[lang] ?? pair.en ?? ''
}
