import { useLang, t } from '../context/LangContext.jsx'
import { footer, links } from '../data/content.js'
import { GithubIcon, LinkedinIcon, MailIcon } from './Icons.jsx'

export default function Footer() {
  const { lang } = useLang()
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-content flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div>
          <p className="font-mono text-sm text-ink">Juan Vásconez</p>
          <p className="mt-1 text-xs text-faint">
            © {year} · {t(footer.built, lang)} {t(footer.note, lang)}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a href={links.github} target="_blank" rel="noreferrer" aria-label="GitHub"
             className="text-muted transition-colors hover:text-accent">
            <GithubIcon width={20} height={20} />
          </a>
          <a href={links.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"
             className="text-muted transition-colors hover:text-accent">
            <LinkedinIcon width={20} height={20} />
          </a>
          <a href={`mailto:${links.email}`} aria-label="Email"
             className="text-muted transition-colors hover:text-accent">
            <MailIcon width={20} height={20} />
          </a>
        </div>
      </div>
    </footer>
  )
}
