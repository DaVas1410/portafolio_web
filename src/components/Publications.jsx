import { useLang, t } from '../context/LangContext.jsx'
import { publicationsSection } from '../data/content.js'
import { publications } from '../data/publications.js'
import { useReveal } from '../hooks/useReveal.js'
import SectionHeader from './SectionHeader.jsx'
import { ArrowUpRight } from './Icons.jsx'

export default function Publications() {
  const { lang } = useLang()
  const revealRef = useReveal()
  return (
    <section id="publications" className="section-pad">
      <SectionHeader
        index="04"
        eyebrow={publicationsSection.eyebrow}
        title={publicationsSection.title}
      />

      <ul ref={revealRef} className="reveal space-y-4">
        {publications.map((p) => (
          <li
            key={p.slug}
            className="group flex flex-col gap-3 rounded-2xl border border-line bg-elev p-6 transition-colors hover:border-accent/50 sm:flex-row sm:items-start sm:justify-between"
          >
            <div className="min-w-0">
              <div className="mb-2 flex items-center gap-2">
                <span className="rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-wider text-accent">
                  {t(p.type, lang)}
                </span>
                <span className="font-mono text-xs text-faint">{t(p.venue, lang)}</span>
              </div>
              <h3 className="max-w-3xl font-display text-base font-semibold leading-snug text-ink sm:text-lg">
                {t(p.title, lang)}
              </h3>
            </div>
            {p.link && (
              <a
                href={p.link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex flex-none items-center gap-1.5 font-mono text-xs text-accent transition-opacity hover:opacity-80"
              >
                {lang === 'es' ? 'Ver' : 'View'}
                <ArrowUpRight width={14} height={14} />
              </a>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
