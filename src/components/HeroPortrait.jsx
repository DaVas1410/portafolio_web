import { useState } from 'react'

// Hero focal element. Loads /portrait.webp; falls back to an accent-tinted
// block with initials so the hero composition holds before the photo is added.
export default function HeroPortrait() {
  const [failed, setFailed] = useState(false)
  return (
    <div className="relative mx-auto w-full max-w-[17rem] sm:max-w-xs lg:max-w-sm">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-line bg-elev shadow-sm">
        {!failed ? (
          <img
            src="/portrait.webp"
            alt="Juan Vásconez"
            onError={() => setFailed(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="media-fallback flex h-full w-full items-center justify-center">
            <span className="font-display text-6xl font-bold text-ink/60">JV</span>
          </div>
        )}
      </div>
      {/* faint accent frame */}
      <span className="pointer-events-none absolute -inset-px rounded-2xl ring-1 ring-accent/20" />
    </div>
  )
}
