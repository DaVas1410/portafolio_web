import { useLang, t } from '../context/LangContext.jsx'
import { projects } from '../data/projects.js'
import { projectsSection, links } from '../data/content.js'
import SectionHeader from './SectionHeader.jsx'
import { GithubIcon, ArrowUpRight } from './Icons.jsx'
import { pick } from './accentStyles.js'
import { useReveal } from '../hooks/useReveal.js'
import TiltCard from './TiltCard.jsx'
import ProjectMedia from './ProjectMedia.jsx'

function ProjectCard({ p, lang }) {
  const a = pick(p.accent)
  const revealRef = useReveal()
  const featured = p.featured
  return (
    <TiltCard className={`reveal rounded-2xl ${featured ? 'md:col-span-2' : ''}`}>
      <a
        ref={revealRef}
        href={p.repo}
        target="_blank"
        rel="noreferrer"
        className={`group relative flex h-full overflow-hidden rounded-2xl border border-line bg-elev transition-colors duration-300 ${a.hoverBorder} ${
          featured ? 'flex-col md:flex-row' : 'flex-col'
        }`}
      >
        {/* top hairline that lights up on hover */}
        <span className={`pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent to-transparent ${a.via} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />

        <ProjectMedia
          slug={p.slug}
          name={p.name}
          accent={p.accent}
          className={featured ? 'aspect-[16/10] md:aspect-auto md:w-[45%]' : 'aspect-[16/9] w-full'}
        />

        <div className={`flex flex-1 flex-col ${featured ? 'p-6 md:p-8' : 'p-6'}`}>
          <div className="mb-3 flex items-start justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span className={`font-mono text-xs ${a.text}`}>{'{ }'}</span>
              <h3 className={`font-display font-semibold text-ink ${featured ? 'text-xl sm:text-2xl' : 'text-lg'}`}>
                {p.name}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              {p.tag && (
                <span className={`flex-none rounded-full border px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-wider ${a.tag}`}>
                  {t(p.tag, lang)}
                </span>
              )}
              <ArrowUpRight
                width={18}
                height={18}
                className="flex-none text-faint transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink"
              />
            </div>
          </div>

          {p.outcome && (
            <p className={`mb-3 font-medium text-ink ${featured ? 'text-base sm:text-lg' : 'text-[0.95rem]'}`}>
              {t(p.outcome, lang)}
            </p>
          )}

          <p className={`mb-5 flex-1 leading-relaxed text-muted ${featured ? 'text-sm sm:text-base' : 'text-sm'}`}>
            {t(p.desc, lang)}
          </p>

          <div className="flex flex-wrap gap-1.5">
            {p.stack.map((s) => (
              <span key={s} className="badge">
                {s}
              </span>
            ))}
          </div>
        </div>
      </a>
    </TiltCard>
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
