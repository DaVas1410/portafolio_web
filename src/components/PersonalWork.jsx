import { useState } from 'react'
import { useLang, t } from '../context/LangContext.jsx'
import { personal } from '../data/content.js'
import { personalWork } from '../data/personalWork.js'
import { useReveal } from '../hooks/useReveal.js'
import SectionHeader from './SectionHeader.jsx'

export default function PersonalWork() {
  const { lang } = useLang()
  const revealRef = useReveal()
  const [open, setOpen] = useState(false)

  return (
    <section id="personal" className="section-pad">
      <SectionHeader index="07" eyebrow={personal.eyebrow} title={personal.title} />

      <div ref={revealRef} className="reveal">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="personal-panel"
          className="inline-flex items-center gap-2 rounded-lg border border-line bg-elev px-4 py-2 text-sm font-medium text-muted transition-colors hover:border-accent hover:text-accent"
        >
          {open ? t(personal.hide, lang) : t(personal.toggle, lang)}
          <span className={`transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true">
            ▾
          </span>
        </button>

        {open && (
          <div id="personal-panel" className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {personalWork.map((col, i) => (
              <div key={i} className="rounded-2xl border border-line bg-elev p-6">
                <h3 className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-accent">
                  {t(col.group, lang)}
                </h3>
                <ul className="space-y-2.5">
                  {col.items.map((item, j) => (
                    <li key={j} className="text-sm leading-relaxed text-muted">
                      {t(item, lang)}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
