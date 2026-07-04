import { useLang, t } from '../context/LangContext.jsx'
import { hero, links } from '../data/content.js'
import { GithubIcon, MailIcon, FileIcon, ArrowUpRight } from './Icons.jsx'
import HeroPortrait from './HeroPortrait.jsx'

export default function Hero() {
  const { lang } = useLang()

  return (
    <section id="top" className="relative flex min-h-[92vh] items-center overflow-hidden">
      <div className="absolute inset-0 grid-backdrop opacity-60" />
      {/* Soft vignette so the portrait and copy dominate over the ambient lattice. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(120% 85% at 50% 42%, transparent 42%, rgb(var(--bg) / 0.55) 100%)' }}
      />

      <div className="relative mx-auto w-full max-w-content px-6 py-28 sm:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
          <div className="max-w-2xl">
            <p className="mb-5 flex items-center gap-2 font-mono text-sm text-accent animate-fade-up">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
              {t(hero.location, lang)}
            </p>

            <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-ink sm:text-6xl md:text-7xl animate-fade-up" style={{ animationDelay: '60ms' }}>
              <span className="block text-muted text-2xl font-medium sm:text-3xl">{t(hero.greeting, lang)}</span>
              {hero.name}
            </h1>

            <p className="mt-5 font-mono text-base text-warm sm:text-lg animate-fade-up" style={{ animationDelay: '120ms' }}>
              {t(hero.role, lang)}
            </p>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl animate-fade-up" style={{ animationDelay: '180ms' }}>
              {t(hero.tagline, lang)}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3 animate-fade-up" style={{ animationDelay: '240ms' }}>
              <a
                href={links.github}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-bg transition-transform hover:-translate-y-0.5"
              >
                <GithubIcon width={18} height={18} />
                {t(hero.ctaGithub, lang)}
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-lg border border-line bg-elev px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:border-accent hover:text-accent"
              >
                <MailIcon width={18} height={18} />
                {t(hero.ctaContact, lang)}
              </a>
              <a
                href={links.cv}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2 rounded-lg border border-line bg-elev px-5 py-2.5 text-sm font-medium text-muted transition-colors hover:border-warm hover:text-warm"
              >
                <FileIcon width={18} height={18} />
                {t(hero.ctaCv, lang)}
                <ArrowUpRight width={14} height={14} className="opacity-60" />
              </a>
            </div>
          </div>

          <div className="animate-fade-up" style={{ animationDelay: '160ms' }}>
            <HeroPortrait />
          </div>
        </div>
      </div>
    </section>
  )
}
