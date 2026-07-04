import { useLang, t } from '../context/LangContext.jsx'
import { skills } from '../data/content.js'
import { useReveal } from '../hooks/useReveal.js'
import SectionHeader from './SectionHeader.jsx'
import { pick } from './accentStyles.js'

export default function Skills() {
  const { lang } = useLang()
  const revealRef = useReveal()
  return (
    <section id="skills" className="section-pad">
      <SectionHeader index="06" eyebrow={skills.eyebrow} title={skills.title} />

      <div ref={revealRef} className="reveal grid gap-5 sm:grid-cols-2">
        {skills.groups.map((group, i) => {
          const a = pick(group.accent)
          return (
            <div
              key={i}
              className={`group rounded-2xl border border-line bg-elev p-6 transition-colors ${a.hoverBorder}`}
            >
              <div className="mb-5 flex items-center gap-3">
                <span className={`h-2 w-2 rounded-full ${a.dot}`} />
                <h3 className="font-display text-lg font-semibold text-ink">
                  {t(group.title, lang)}
                </h3>
                <span className="ml-auto font-mono text-xs text-faint">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {group.items.map((skill) => {
                  const label = t(skill, lang)
                  return (
                    <span
                      key={label}
                      className="rounded-lg border border-line bg-bg px-3 py-1.5 font-mono text-sm text-muted transition-colors hover:text-ink"
                    >
                      {label}
                    </span>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
