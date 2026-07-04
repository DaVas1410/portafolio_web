import { useLang, t } from '../context/LangContext.jsx'
import { projects } from '../data/projects.js'
import { projectsSection, links } from '../data/content.js'
import SectionHeader from './SectionHeader.jsx'
import { GithubIcon, ArrowUpRight } from './Icons.jsx'
import { pick } from './accentStyles.js'
import { useReveal } from '../hooks/useReveal.js'

function ProjectCard({ p, lang }) {
  const a = pick(p.accent)
  const revealRef = useReveal()
  return (
    <a
      ref={revealRef}
      href={p.repo}
      target="_blank"
      rel="noreferrer"
      className={`reveal group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-elev p-6 transition-all duration-300 hover:-translate-y-1 ${a.hoverBorder} ${
        p.featured ? 'md:col-span-2' : ''
      }`}
    >
      {/* top hairline that lights up on hover */}
      <span className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent ${a.via} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />

      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <span className={`font-mono text-xs ${a.text}`}>{'{ }'}</span>
          <h3 className="font-display text-lg font-semibold text-ink">{p.name}</h3>
        </div>
        <div className="flex items-center gap-2">
          {p.tag && (
            <span className={`rounded-full border px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-wider ${a.tag}`}>
              {t(p.tag, lang)}
            </span>
          )}
          <ArrowUpRight
            width={18}
            height={18}
            className="text-faint transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink"
          />
        </div>
      </div>

      <p className={`mb-5 flex-1 leading-relaxed text-muted ${p.featured ? 'text-base sm:text-lg' : 'text-sm sm:text-base'}`}>
        {t(p.desc, lang)}
      </p>

      <div className="flex flex-wrap gap-1.5">
        {p.stack.map((s) => (
          <span key={s} className="badge">
            {s}
          </span>
        ))}
      </div>
    </a>
  )
}

export default function Projects() {
  const { lang } = useLang()
  return (
    <section id="projects" className="section-pad">
      <SectionHeader
        index="02"
        eyebrow={projectsSection.eyebrow}
        title={projectsSection.title}
        intro={projectsSection.intro}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        {projects.map((p) => (
          <ProjectCard key={p.slug} p={p} lang={lang} />
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <a
          href={links.github}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-line bg-elev px-5 py-2.5 text-sm font-medium text-muted transition-colors hover:border-accent hover:text-accent"
        >
          <GithubIcon width={18} height={18} />
          {t(projectsSection.more, lang)}
        </a>
      </div>
    </section>
  )
}
