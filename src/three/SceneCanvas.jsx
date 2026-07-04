import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { useMotion } from '../context/MotionContext.jsx'
import StaticBackdrop from './StaticBackdrop.jsx'

const Canvas = lazy(() => import('@react-three/fiber').then((m) => ({ default: m.Canvas })))
const ParticleLattice = lazy(() => import('./ParticleLattice.jsx'))

export default function SceneCanvas() {
  const { reduced } = useMotion()
  const wrapRef = useRef(null)
  const [visible, setVisible] = useState(true)

  // Pause rendering when the (fixed, full-screen) canvas' host tab is hidden.
  useEffect(() => {
    const onVis = () => setVisible(!document.hidden)
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  if (reduced) return <StaticBackdrop />

  const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 640px)').matches

  return (
    <div ref={wrapRef} aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
      <Suspense fallback={null}>
        <Canvas
          dpr={[1, 1.5]}
          gl={{ antialias: false, powerPreference: 'high-performance' }}
          camera={{ position: [0, 0, 6], fov: 60 }}
          frameloop={visible ? 'always' : 'never'}
        >
          <ParticleLattice mobile={isMobile} />
        </Canvas>
      </Suspense>
    </div>
  )
}
