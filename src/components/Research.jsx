import { useLang, t } from '../context/LangContext.jsx'
import { research } from '../data/content.js'
import SectionHeader from './SectionHeader.jsx'
import { ArrowUpRight } from './Icons.jsx'

export default function Research() {
  const { lang } = useLang()
  return (
    <section id="research" className="relative overflow-hidden">
      {/* subtle contour-like band to set this section apart */}
      <div className="absolute inset-0 grid-backdrop opacity-40" />
      <div className="relative section-pad">
        <SectionHeader
          index="03"
          eyebrow={research.eyebrow}
          title={research.title}
        />

        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr] md:gap-16">
          <div>
            <p className="mb-6 inline-flex rounded-lg border border-line bg-elev px-3 py-1.5 font-mono text-xs text-warm">
              {t(research.supervisor, lang)}
            </p>
            <div className="space-y-5">
              {research.body[lang].map((para, i) => (
                <p key={i} className="text-base leading-relaxed text-muted sm:text-lg">
                  {para}
                </p>
              ))}
            </div>

            <a
              href={research.repo}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-lg border border-line bg-elev px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-accent hover:text-accent"
            >
              {t(research.repoLabel, lang)}
              <ArrowUpRight width={16} height={16} />
            </a>
          </div>

          {/* Method pipeline rendered as a vertical flow */}
          <div className="rounded-2xl border border-line bg-elev/60 p-6">
            <div className="mb-5 font-mono text-xs uppercase tracking-wider text-faint">
              {lang === 'es' ? 'metodología' : 'methodology'}
            </div>
            <ol className="space-y-0">
              {research.pipeline.map((step, i) => (
                <li key={i} className="relative pl-8">
                  <span className="absolute left-0 top-0 flex h-6 w-6 items-center justify-center rounded-full border border-accent/50 bg-bg font-mono text-[0.65rem] text-accent">
                    {i + 1}
                  </span>
                  {i < research.pipeline.length - 1 && (
                    <span className="absolute left-3 top-6 h-full w-px bg-gradient-to-b from-accent/40 to-warm/30" />
                  )}
                  <div className="pb-7">
                    <div className="text-sm font-medium text-ink">{t(step, lang)}</div>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-2 rounded-lg border border-warm/30 bg-warm/5 px-3 py-2 font-mono text-xs text-warm">
              k_min · ~99% acc
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
