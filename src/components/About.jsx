import { useLang, t } from '../context/LangContext.jsx'
import { about } from '../data/content.js'
import { useReveal } from '../hooks/useReveal.js'
import SectionHeader from './SectionHeader.jsx'

export default function About() {
  const { lang } = useLang()
  const revealRef = useReveal()
  return (
    <section id="about" className="section-pad">
      <SectionHeader index="01" eyebrow={about.eyebrow} title={about.title} />

      <div ref={revealRef} className="reveal grid gap-12 md:grid-cols-[1.6fr_1fr] md:gap-16">
        <div className="space-y-5">
          {about.body[lang].map((para, i) => (
            <p key={i} className="text-base leading-relaxed text-muted sm:text-lg">
              {para}
            </p>
          ))}
        </div>

        <div className="space-y-3">
          {about.facts.map((f, i) => (
            <div
              key={i}
              className="rounded-xl border border-line bg-elev p-5 transition-colors hover:border-accent/50"
            >
              <div className="mb-1 font-mono text-xs uppercase tracking-wider text-faint">
                {t(f.k, lang)}
              </div>
              <div className="text-base font-medium text-ink">{t(f.v, lang)}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
