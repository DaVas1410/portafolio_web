// Full, static Tailwind class strings per accent pole. Tailwind's JIT only
// generates classes it can find as complete literals, so we must NOT build
// class names by string interpolation at runtime — we look them up here.
export const accentStyles = {
  accent: {
    text: 'text-accent',
    hoverBorder: 'hover:border-accent/60',
    via: 'via-accent',
    tag: 'border-accent/40 bg-accent/10 text-accent',
    dot: 'bg-accent',
    ring: 'border-accent/50',
    barFrom: 'from-accent',
  },
  warm: {
    text: 'text-warm',
    hoverBorder: 'hover:border-warm/60',
    via: 'via-warm',
    tag: 'border-warm/40 bg-warm/10 text-warm',
    dot: 'bg-warm',
    ring: 'border-warm/50',
    barFrom: 'from-warm',
  },
}

export const pick = (accent) => accentStyles[accent === 'warm' ? 'warm' : 'accent']
