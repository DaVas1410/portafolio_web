import { useLang, t } from '../context/LangContext.jsx'
import { contact, links } from '../data/content.js'
import { useReveal } from '../hooks/useReveal.js'
import SectionHeader from './SectionHeader.jsx'
import { GithubIcon, LinkedinIcon, MailIcon } from './Icons.jsx'

export default function Contact() {
  const { lang } = useLang()
  const revealRef = useReveal()

  const channels = [
    { icon: GithubIcon, label: 'GitHub', value: '@DaVas1410', href: links.github },
    { icon: LinkedinIcon, label: 'LinkedIn', value: lang === 'es' ? 'Perfil' : 'Profile', href: links.linkedin },
    { icon: MailIcon, label: 'Email', value: links.email, href: `mailto:${links.email}` },
  ]

  return (
    <section id="contact" className="relative overflow-hidden">
      <div className="absolute inset-0 grid-backdrop opacity-40" />
      <div className="relative section-pad">
        <SectionHeader index="07" eyebrow={contact.eyebrow} title={contact.title} />

        <div ref={revealRef} className="reveal grid gap-10 md:grid-cols-[1.2fr_1fr] md:gap-16">
          <div>
            <p className="max-w-xl text-lg leading-relaxed text-muted">
              {t(contact.body, lang)}
            </p>
            <a
              href={`mailto:${links.email}`}
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-medium text-bg transition-transform hover:-translate-y-0.5"
            >
              <MailIcon width={18} height={18} />
              {t(contact.emailCta, lang)}
            </a>
          </div>

          <div className="space-y-3">
            {channels.map(({ icon: Icon, label, value, href }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('mailto') ? undefined : '_blank'}
                rel="noreferrer"
                className="group flex items-center gap-4 rounded-xl border border-line bg-elev p-4 transition-colors hover:border-accent/50"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-bg text-muted transition-colors group-hover:text-accent">
                  <Icon width={18} height={18} />
                </span>
                <span className="min-w-0">
                  <span className="block font-mono text-xs uppercase tracking-wider text-faint">
                    {label}
                  </span>
                  <span className="block truncate text-sm font-medium text-ink">{value}</span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
