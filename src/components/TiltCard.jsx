import { useRef } from 'react'
import { useMotion } from '../context/MotionContext.jsx'

export default function TiltCard({ children, className = '' }) {
  const ref = useRef(null)
  const { reduced } = useMotion()

  if (reduced) return <div className={className}>{children}</div>

  const onMove = (e) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    const rx = (0.5 - py) * 8 // deg
    const ry = (px - 0.5) * 10
    el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`
    el.style.setProperty('--glare-x', `${px * 100}%`)
    el.style.setProperty('--glare-y', `${py * 100}%`)
  }
  const onLeave = () => {
    const el = ref.current
    if (el) el.style.transform = 'perspective(900px) rotateX(0) rotateY(0)'
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`tilt-card ${className}`}
      style={{ transition: 'transform 0.2s ease-out' }}
    >
      {children}
    </div>
  )
}
