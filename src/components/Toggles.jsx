import { useTheme } from '../context/ThemeContext.jsx'
import { useLang } from '../context/LangContext.jsx'
import { SunIcon, MoonIcon } from './Icons.jsx'

export function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const isDark = theme === 'dark'
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-elev text-muted transition-colors hover:border-accent hover:text-accent"
    >
      {isDark ? <SunIcon width={17} height={17} /> : <MoonIcon width={17} height={17} />}
    </button>
  )
}

export function LangToggle() {
  const { lang, toggle } = useLang()
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle language"
      className="inline-flex h-9 items-center gap-1 rounded-lg border border-line bg-elev px-2.5 font-mono text-xs text-muted transition-colors hover:border-accent hover:text-accent"
    >
      <span className={lang === 'en' ? 'text-accent' : ''}>EN</span>
      <span className="opacity-40">/</span>
      <span className={lang === 'es' ? 'text-accent' : ''}>ES</span>
    </button>
  )
}
