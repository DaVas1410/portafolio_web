import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { useMotion } from '../context/MotionContext.jsx'
import { useScroll } from '../context/ScrollContext.jsx'
import { useTheme } from '../context/ThemeContext.jsx'
import StaticBackdrop from './StaticBackdrop.jsx'

const Canvas = lazy(() => import('@react-three/fiber').then((m) => ({ default: m.Canvas })))
const ParticleLattice = lazy(() => import('./ParticleLattice.jsx'))

export default function SceneCanvas() {
  const { reduced } = useMotion()
  // Read context OUTSIDE the R3F <Canvas> — React context does not cross the
  // fiber reconciler boundary, so scene values must be passed in as props.
  const { progressRef, activeSection } = useScroll()
  const { theme } = useTheme()
  const wrapRef = useRef(null)
  const [visible, setVisible] = useState(true)
  // Interaction state, tracked on window because the canvas is
  // pointer-events-none (content sits on top). x/y drive parallax; yaw/pitch
  // are the drag-orbit offsets; dragging gates it all.
  const pointerRef = useRef({ x: 0, y: 0, active: false, yaw: 0, pitch: 0, dragging: false })

  // Pause rendering when the (fixed, full-screen) canvas' host tab is hidden.
  useEffect(() => {
    const onVis = () => setVisible(!document.hidden)
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  useEffect(() => {
    const p = pointerRef.current
    let lastX = 0
    let lastY = 0
    // Don't start an orbit drag on interactive content — keep clicks working.
    const INTERACTIVE = 'a, button, input, textarea, select, label, [role="button"]'

    const onDown = (e) => {
      // Mouse only (leave touch for scrolling) and primary button only.
      if (e.pointerType !== 'mouse' || e.button !== 0) return
      if (e.target.closest && e.target.closest(INTERACTIVE)) return
      p.dragging = true
      lastX = e.clientX
      lastY = e.clientY
      document.body.style.userSelect = 'none'
      document.body.style.cursor = 'grabbing'
    }
    const onMove = (e) => {
      p.x = (e.clientX / window.innerWidth) * 2 - 1
      p.y = -((e.clientY / window.innerHeight) * 2 - 1)
      p.active = true
      if (p.dragging) {
        p.yaw += (e.clientX - lastX) * 0.005
        p.pitch = Math.max(-1.2, Math.min(1.2, p.pitch + (e.clientY - lastY) * 0.005))
        lastX = e.clientX
        lastY = e.clientY
      }
    }
    const onUp = () => {
      if (!p.dragging) return
      p.dragging = false
      document.body.style.userSelect = ''
      document.body.style.cursor = ''
    }
    const onLeave = () => {
      p.active = false
    }

    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    document.addEventListener('mouseleave', onLeave)
    return () => {
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
      document.removeEventListener('mouseleave', onLeave)
      document.body.style.userSelect = ''
      document.body.style.cursor = ''
    }
  }, [])

  if (reduced) return <StaticBackdrop />

  const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 640px)').matches

  return (
    <div ref={wrapRef} aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
      <Suspense fallback={null}>
        <Canvas
          dpr={1}
          gl={{ antialias: false, powerPreference: 'high-performance' }}
          camera={{ position: [0, 0, 6], fov: 60 }}
          frameloop={visible ? 'always' : 'never'}
        >
          <ParticleLattice
            mobile={isMobile}
            progressRef={progressRef}
            activeSection={activeSection}
            theme={theme}
            pointerRef={pointerRef}
          />
        </Canvas>
      </Suspense>
    </div>
  )
}
