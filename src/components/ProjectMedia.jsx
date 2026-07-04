import { useState } from 'react'
import { pick } from './accentStyles.js'

// Visual evidence for a project card. Loads /projects/<slug>.webp; if the file
// isn't there yet it falls back to an intentional accent-tinted placeholder so
// the card never looks broken. Drop real images in incrementally.
export default function ProjectMedia({ slug, name, accent, className = '' }) {
  const [failed, setFailed] = useState(false)
  const a = pick(accent)
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!failed ? (
        <img
          src={`/projects/${slug}.webp`}
          alt={name}
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      ) : (
        <div className="media-fallback flex h-full w-full items-center justify-center">
          <span className={`font-mono text-sm ${a.text} opacity-70`}>{`{ ${slug} }`}</span>
        </div>
      )}
    </div>
  )
}
