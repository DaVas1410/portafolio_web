import { useLang, t } from '../context/LangContext.jsx'

// Coordinate-style section header: mono index + eyebrow, then display title,
// with a thin rule that evokes an axis.
export default function SectionHeader({ index, eyebrow, title, intro }) {
  const { lang } = useLang()
  return (
    <div className="mb-14 md:mb-20">
      <div className="mb-4 flex items-center gap-3">
        <span className="font-mono text-xs text-accent">{index}</span>
        <span className="h-px w-8 bg-accent/50" />
        <span className="eyebrow">{t(eyebrow, lang)}</span>
      </div>
      <h2 className="max-w-3xl font-display text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl md:text-5xl">
        {t(title, lang)}
      </h2>
      {intro && (
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
          {t(intro, lang)}
        </p>
      )}
    </div>
  )
}
