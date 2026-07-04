import { useLang, t } from '../context/LangContext.jsx'
import { experience } from '../data/content.js'
import { diversaContributions } from '../data/diversa.js'
import { useReveal } from '../hooks/useReveal.js'
import SectionHeader from './SectionHeader.jsx'
import TiltCard from './TiltCard.jsx'
import { pick } from './accentStyles.js'
import { ArrowUpRight } from './Icons.jsx'

function DiversaCard({ c, lang }) {
  const a = pick(c.accent)
  const revealRef = useReveal()
  return (
    <TiltCard className="rounded-2xl">
      <div
        ref={revealRef}
        className={`reveal flex h-full flex-col rounded-2xl border border-line bg-elev p-6 transition-colors ${a.hoverBorder}`}
      >
        <div className="mb-3 flex items-start justify-between gap-3">
          <h4 className="font-display text-lg font-semibold text-ink">{t(c.name, lang)}</h4>
          <span className={`flex-none rounded-full border px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-wider ${a.tag}`}>
            {t(c.role, lang)}
          </span>
        </div>
        <p className="mb-5 flex-1 text-sm leading-relaxed text-muted">{t(c.desc, lang)}</p>
        <div className="mb-4 flex flex-wrap gap-1.5">
          {c.stack.map((s) => (
            <span key={s} className="badge">
              {s}
            </span>
          ))}
        </div>
        <a
          href={c.repo}
          target="_blank"
          rel="noreferrer"
          className={`inline-flex items-center gap-1.5 font-mono text-xs ${a.text} transition-opacity hover:opacity-80`}
        >
          {lang === 'es' ? 'Ver repositorio' : 'View repository'}
          <ArrowUpRight width={14} height={14} />
        </a>
      </div>
    </TiltCard>
  )
}

export default function Experience() {
  const { lang } = useLang()
  const revealRef = useReveal()
  return (
    <section id="experience" className="section-tint">
      <div className="section-pad">
      <SectionHeader index="04" eyebrow={experience.eyebrow} title={experience.title} />

      <div ref={revealRef} className="reveal relative">
        {/* vertical timeline axis */}
        <span className="absolute left-0 top-2 hidden h-[calc(100%-1rem)] w-px bg-line sm:block" />

        <div className="space-y-10">
          {experience.items.map((item, i) => {
            const a = pick(item.accent)
            return (
              <div key={i} className="relative sm:pl-10">
                <span className={`absolute -left-[5px] top-1.5 hidden h-2.5 w-2.5 rounded-full ${a.dot} sm:block`} />
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                  <h3 className="font-display text-xl font-semibold text-ink">
                    {t(item.role, lang)}
                    <span className={`${a.text} font-normal`}> · {item.org}</span>
                  </h3>
                  <span className="font-mono text-xs uppercase tracking-wider text-faint">
                    {t(item.period, lang)}
                  </span>
                </div>
                {item.bullets ? (
                  <ul className="mt-2 max-w-2xl space-y-1.5">
                    {item.bullets.map((b, j) => (
                      <li key={j} className="flex gap-2 text-base leading-relaxed text-muted">
                        <span className={`mt-2 h-1 w-1 flex-none rounded-full ${a.dot}`} />
                        {t(b, lang)}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 max-w-2xl text-base leading-relaxed text-muted">
                    {t(item.desc, lang)}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Cited contributions at Diversa */}
      <div className="mt-16">
        <h3 className="mb-5 font-mono text-sm uppercase tracking-[0.2em] text-accent">
          {t(experience.diversaHeading, lang)}
        </h3>
        <div className="grid gap-5 sm:grid-cols-2">
          {diversaContributions.map((c) => (
            <DiversaCard key={c.slug} c={c} lang={lang} />
          ))}
        </div>
      </div>
      </div>
    </section>
  )
}
