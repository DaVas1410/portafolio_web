import { useLang, t } from '../context/LangContext.jsx'
import { experience } from '../data/content.js'
import SectionHeader from './SectionHeader.jsx'
import { pick } from './accentStyles.js'

export default function Experience() {
  const { lang } = useLang()
  return (
    <section id="experience" className="section-pad">
      <SectionHeader index="04" eyebrow={experience.eyebrow} title={experience.title} />

      <div className="relative">
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
                <p className="mt-2 max-w-2xl text-base leading-relaxed text-muted">
                  {t(item.desc, lang)}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
