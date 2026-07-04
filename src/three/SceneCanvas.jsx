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
  // Normalized pointer (-1..1), tracked on window because the canvas is
  // pointer-events-none (content sits on top). `active` gates the particle
  // repulsion so it only kicks in once the user actually moves the mouse.
  const pointerRef = useRef({ x: 0, y: 0, active: false })

  // Pause rendering when the (fixed, full-screen) canvas' host tab is hidden.
  useEffect(() => {
    const onVis = () => setVisible(!document.hidden)
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  useEffect(() => {
    const onMove = (e) => {
      pointerRef.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointerRef.current.y = -((e.clientY / window.innerHeight) * 2 - 1)
      pointerRef.current.active = true
    }
    const onLeave = () => {
      pointerRef.current.active = false
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onMove, { passive: true })
    document.addEventListener('mouseleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onMove)
      document.removeEventListener('mouseleave', onLeave)
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
