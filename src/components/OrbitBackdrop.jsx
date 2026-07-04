// Decorative orbital motif for the hero: concentric elliptical orbits with
// bodies traveling along them, plus a faint field of stars. Purely aesthetic
// (aria-hidden). Respects reduced-motion via CSS in index.css.
export default function OrbitBackdrop() {
  const orbits = [
    { rx: 150, ry: 60, dur: 26, r: 3.5, color: 'var(--accent)', rot: -18 },
    { rx: 230, ry: 95, dur: 40, r: 2.5, color: 'var(--accent-warm)', rot: -18 },
    { rx: 310, ry: 128, dur: 58, r: 3, color: 'var(--accent)', rot: -18 },
  ]

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <svg
        className="absolute left-1/2 top-1/2 h-[130%] w-[130%] -translate-x-1/2 -translate-y-1/2 opacity-70"
        viewBox="-360 -200 720 400"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgb(var(--accent))" stopOpacity="0.9" />
            <stop offset="60%" stopColor="rgb(var(--accent))" stopOpacity="0.15" />
            <stop offset="100%" stopColor="rgb(var(--accent))" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Central body glow */}
        <circle cx="0" cy="0" r="46" fill="url(#core)" />
        <circle cx="0" cy="0" r="4.5" fill="rgb(var(--accent))" />

        {orbits.map((o, i) => (
          <g key={i} transform={`rotate(${o.rot})`}>
            <ellipse
              cx="0"
              cy="0"
              rx={o.rx}
              ry={o.ry}
              fill="none"
              stroke="rgb(var(--border))"
              strokeWidth="0.75"
              strokeDasharray="2 5"
            />
            <circle r={o.r} fill={`rgb(${o.color})`}>
              <animateMotion
                dur={`${o.dur}s`}
                repeatCount="indefinite"
                path={`M ${o.rx},0 A ${o.rx},${o.ry} 0 1,1 ${-o.rx},0 A ${o.rx},${o.ry} 0 1,1 ${o.rx},0`}
              />
            </circle>
          </g>
        ))}
      </svg>

      {/* Fade the motif into the page so text stays readable */}
      <div className="absolute inset-0 bg-gradient-to-b from-bg/10 via-bg/40 to-bg" />
      <div className="absolute inset-0 bg-gradient-to-r from-bg via-transparent to-bg" />
    </div>
  )
}
