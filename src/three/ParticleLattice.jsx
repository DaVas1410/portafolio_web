import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useScroll } from '../context/ScrollContext.jsx'

// Read a CSS var "r g b" triplet from :root and return a normalized THREE.Color.
function cssColor(name) {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  const [r, g, b] = raw.split(/\s+/).map(Number)
  return new THREE.Color(r / 255, g / 255, b / 255)
}

// Cheap pseudo-curl flow: offset a point by trig of its own coords + time.
function flow(x, y, z, t) {
  return [
    Math.sin(y * 0.7 + t) * 0.15 + Math.cos(z * 0.5 + t * 0.7) * 0.12,
    Math.sin(z * 0.6 + t * 1.1) * 0.15 + Math.cos(x * 0.4 + t) * 0.12,
    Math.sin(x * 0.5 + t * 0.9) * 0.15 + Math.cos(y * 0.6 + t) * 0.12,
  ]
}

export default function ParticleLattice({ mobile }) {
  const { progressRef, activeSection } = useScroll()
  const pointsRef = useRef()
  const matRef = useRef()

  const COUNT = mobile ? 3500 : 10000
  const GRID = Math.round(Math.cbrt(COUNT)) // lattice side length

  const { chaos, lattice } = useMemo(() => {
    const chaos = new Float32Array(COUNT * 3)
    const lattice = new Float32Array(COUNT * 3)
    const span = 9
    for (let i = 0; i < COUNT; i++) {
      // chaotic cloud
      chaos[i * 3] = (Math.random() - 0.5) * span
      chaos[i * 3 + 1] = (Math.random() - 0.5) * span
      chaos[i * 3 + 2] = (Math.random() - 0.5) * span
      // structured lattice target
      const gx = i % GRID
      const gy = Math.floor(i / GRID) % GRID
      const gz = Math.floor(i / (GRID * GRID)) % GRID
      const step = span / GRID
      lattice[i * 3] = (gx - GRID / 2) * step
      lattice[i * 3 + 1] = (gy - GRID / 2) * step
      lattice[i * 3 + 2] = (gz - GRID / 2) * step
    }
    return { chaos, lattice }
  }, [COUNT, GRID])

  const positions = useMemo(() => new Float32Array(chaos), [chaos])

  // Section -> teal(0)..amber(1) mix
  const sectionMix = useMemo(() => {
    const order = ['about', 'projects', 'research', 'experience', 'skills', 'contact']
    const idx = Math.max(0, order.indexOf(activeSection))
    return idx / (order.length - 1)
  }, [activeSection])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const p = progressRef.current
    const ease = p * p * (3 - 2 * p) // smoothstep
    const geo = pointsRef.current.geometry
    const arr = geo.attributes.position.array
    for (let i = 0; i < COUNT; i++) {
      const ix = i * 3
      const [fx, fy, fz] = flow(chaos[ix], chaos[ix + 1], chaos[ix + 2], t * 0.3)
      // chaos + flow when p~0, settle to lattice when p~1
      arr[ix] = THREE.MathUtils.lerp(chaos[ix] + fx * (1 - ease), lattice[ix], ease)
      arr[ix + 1] = THREE.MathUtils.lerp(chaos[ix + 1] + fy * (1 - ease), lattice[ix + 1], ease)
      arr[ix + 2] = THREE.MathUtils.lerp(chaos[ix + 2] + fz * (1 - ease), lattice[ix + 2], ease)
    }
    geo.attributes.position.needsUpdate = true

    // color: lerp teal->amber by section, damped
    const teal = cssColor('--accent')
    const warm = cssColor('--accent-warm')
    const target = teal.clone().lerp(warm, sectionMix)
    if (matRef.current) matRef.current.color.lerp(target, 0.05)

    // gentle scroll-driven camera dolly + parallax
    state.camera.position.z = THREE.MathUtils.lerp(6, 4.5, ease)
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, state.pointer.x * 0.6, 0.03)
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, state.pointer.y * 0.4, 0.03)
    state.camera.lookAt(0, 0, 0)
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={COUNT} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        ref={matRef}
        size={mobile ? 0.03 : 0.022}
        sizeAttenuation
        transparent
        opacity={0.55}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
