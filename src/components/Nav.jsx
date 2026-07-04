import { useEffect, useState } from 'react'
import { useLang, t } from '../context/LangContext.jsx'
import { nav } from '../data/content.js'
import { ThemeToggle, LangToggle, MotionToggle } from './Toggles.jsx'

export default function Nav() {
  const { lang } = useLang()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Highlight the section currently in view.
  useEffect(() => {
    const sections = nav
      .map((n) => document.getElementById(n.id))
      .filter(Boolean)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? 'border-b border-line bg-bg/80 backdrop-blur-md' : 'border-b border-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-content items-center justify-between px-6 py-3.5 sm:px-8">
        <a href="#top" className="group flex items-center gap-2.5" aria-label="Home">
          <span className="flex h-8 w-8 items-center justify-center rounded-md border border-line bg-elev font-mono text-sm font-semibold text-accent transition-colors group-hover:border-accent">
            JV
          </span>
          <span className="hidden font-mono text-sm text-muted sm:inline">juan-vasconez</span>
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`rounded-md px-3 py-1.5 text-sm transition-colors hover:text-accent ${
                active === item.id ? 'text-accent' : 'text-muted'
              }`}
            >
              {t(item.label, lang)}
            </a>
          ))}
          <span className="mx-2 h-5 w-px bg-line" />
          <LangToggle />
          <MotionToggle />
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <LangToggle />
          <MotionToggle />
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-elev text-muted"
          >
            <div className="flex flex-col gap-1.5">
              <span className={`h-px w-4 bg-current transition-transform ${open ? 'translate-y-[3px] rotate-45' : ''}`} />
              <span className={`h-px w-4 bg-current transition-transform ${open ? '-translate-y-[3px] -rotate-45' : ''}`} />
            </div>
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-line bg-bg/95 backdrop-blur-md md:hidden">
          <div className="mx-auto flex max-w-content flex-col px-6 py-2">
            {nav.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setOpen(false)}
                className="border-b border-line/60 py-3 font-mono text-sm text-muted last:border-0 hover:text-accent"
              >
                {t(item.label, lang)}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
