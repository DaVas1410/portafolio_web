import { useLang, t } from '../context/LangContext.jsx'
import { useMotion } from '../context/MotionContext.jsx'
import { SparklesIcon, MotionOffIcon } from './Icons.jsx'
import { motionToggle } from '../data/content.js'

export function MotionToggle() {
  const { lang } = useLang()
  const { manualReduced, setManualReduced } = useMotion()
  const label = manualReduced ? t(motionToggle.off, lang) : t(motionToggle.on, lang)
  return (
    <button
      type="button"
      onClick={() => setManualReduced((v) => !v)}
      aria-pressed={manualReduced}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-elev text-muted transition-colors hover:border-accent hover:text-accent"
    >
      {manualReduced ? <MotionOffIcon width={17} height={17} /> : <SparklesIcon width={17} height={17} />}
      <span className="sr-only">{label}</span>
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
