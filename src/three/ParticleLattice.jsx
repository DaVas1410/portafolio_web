import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const CLUSTERS = 6
const K = 6 // retrieval neighbors per query
const SECTION_ORDER = ['about', 'projects', 'research', 'publications', 'experience', 'skills', 'contact']

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

// Box–Muller gaussian for organic cluster spread.
function gauss() {
  let u = 0
  let v = 0
  while (u === 0) u = Math.random()
  while (v === 0) v = Math.random()
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
}

export default function ParticleLattice({ mobile, progressRef, activeSection, theme }) {
  const groupRef = useRef()
  const pointsRef = useRef()
  const linesRef = useRef()
  const lineMatRef = useRef()

  const COUNT = mobile ? 3500 : 10000

  // Build clusters, chaos cloud, per-particle cluster-target positions, the
  // color buffer, and (desktop only) precomputed retrieval edges — all once.
  const built = useMemo(() => {
    const span = 9
    // Cluster centroids spread on a loose sphere within the span.
    const centroids = []
    for (let c = 0; c < CLUSTERS; c++) {
      const phi = Math.acos(1 - (2 * (c + 0.5)) / CLUSTERS)
      const theta = Math.PI * (1 + Math.sqrt(5)) * c
      const r = span * 0.32
      centroids.push([
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi),
      ])
    }

    const chaos = new Float32Array(COUNT * 3)
    const target = new Float32Array(COUNT * 3)
    const colors = new Float32Array(COUNT * 3)
    const clusterOf = new Uint8Array(COUNT)
    const jitter = 0.9

    for (let i = 0; i < COUNT; i++) {
      const c = i % CLUSTERS
      clusterOf[i] = c
      const ix = i * 3
      chaos[ix] = (Math.random() - 0.5) * span
      chaos[ix + 1] = (Math.random() - 0.5) * span
      chaos[ix + 2] = (Math.random() - 0.5) * span
      target[ix] = centroids[c][0] + gauss() * jitter
      target[ix + 1] = centroids[c][1] + gauss() * jitter
      target[ix + 2] = centroids[c][2] + gauss() * jitter
    }

    // Retrieval edges: one query per cluster (particle nearest its centroid),
    // wired to its K nearest neighbors in embedding (target) space. Precompute
    // the index pairs once — never brute-force kNN per frame.
    const edgePairs = []
    if (!mobile) {
      for (let c = 0; c < CLUSTERS; c++) {
        // query = particle in cluster c closest to the centroid
        let qi = -1
        let qBest = Infinity
        for (let i = c; i < COUNT; i += CLUSTERS) {
          const dx = target[i * 3] - centroids[c][0]
          const dy = target[i * 3 + 1] - centroids[c][1]
          const dz = target[i * 3 + 2] - centroids[c][2]
          const d = dx * dx + dy * dy + dz * dz
          if (d < qBest) {
            qBest = d
            qi = i
          }
        }
        if (qi < 0) continue
        // K nearest neighbors to the query across all particles
        const best = [] // {idx, d} kept sorted ascending, length <= K
        const qx = target[qi * 3]
        const qy = target[qi * 3 + 1]
        const qz = target[qi * 3 + 2]
        for (let j = 0; j < COUNT; j++) {
          if (j === qi) continue
          const dx = target[j * 3] - qx
          const dy = target[j * 3 + 1] - qy
          const dz = target[j * 3 + 2] - qz
          const d = dx * dx + dy * dy + dz * dz
          if (best.length < K) {
            best.push({ idx: j, d })
            best.sort((a, b) => a.d - b.d)
          } else if (d < best[K - 1].d) {
            best[K - 1] = { idx: j, d }
            best.sort((a, b) => a.d - b.d)
          }
        }
        for (const nb of best) edgePairs.push(qi, nb.idx)
      }
    }

    const positions = new Float32Array(chaos) // live buffer (starts at chaos)
    const edgePositions = new Float32Array(edgePairs.length * 3)

    return { chaos, target, colors, clusterOf, positions, edgePairs, edgePositions }
  }, [COUNT, mobile])

  // Recolor per-cluster from the theme palette — once per theme change, not per
  // frame (avoids getComputedStyle forcing layout every tick).
  useEffect(() => {
    const teal = cssColor('--accent')
    const warm = cssColor('--accent-warm')
    const clusterColors = []
    for (let c = 0; c < CLUSTERS; c++) {
      clusterColors.push(teal.clone().lerp(warm, c / (CLUSTERS - 1)))
    }
    const { colors, clusterOf } = built
    for (let i = 0; i < colors.length / 3; i++) {
      const col = clusterColors[clusterOf[i]]
      colors[i * 3] = col.r
      colors[i * 3 + 1] = col.g
      colors[i * 3 + 2] = col.b
    }
    const geo = pointsRef.current?.geometry
    if (geo?.attributes.color) geo.attributes.color.needsUpdate = true
    if (lineMatRef.current) lineMatRef.current.color.copy(teal.clone().lerp(warm, 0.5))
  }, [theme, built])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const p = progressRef?.current ?? 0
    const ease = p * p * (3 - 2 * p) // smoothstep
    const { chaos, target, positions, edgePairs, edgePositions } = built

    const geo = pointsRef.current.geometry
    const arr = geo.attributes.position.array
    for (let i = 0; i < positions.length; i += 3) {
      const [fx, fy, fz] = flow(chaos[i], chaos[i + 1], chaos[i + 2], t * 0.3)
      arr[i] = THREE.MathUtils.lerp(chaos[i] + fx * (1 - ease), target[i], ease)
      arr[i + 1] = THREE.MathUtils.lerp(chaos[i + 1] + fy * (1 - ease), target[i + 1], ease)
      arr[i + 2] = THREE.MathUtils.lerp(chaos[i + 2] + fz * (1 - ease), target[i + 2], ease)
    }
    geo.attributes.position.needsUpdate = true

    // Retrieval edges follow the live particle positions; fade in as the cloud
    // settles into clusters, with a gentle pulse.
    if (edgePairs.length && linesRef.current) {
      for (let e = 0; e < edgePairs.length; e++) {
        const src = edgePairs[e] * 3
        edgePositions[e * 3] = arr[src]
        edgePositions[e * 3 + 1] = arr[src + 1]
        edgePositions[e * 3 + 2] = arr[src + 2]
      }
      const lgeo = linesRef.current.geometry
      lgeo.attributes.position.needsUpdate = true
      if (lineMatRef.current) {
        const pulse = 0.55 + 0.45 * Math.sin(t * 1.4)
        lineMatRef.current.opacity = ease * ease * 0.3 * pulse
      }
    }

    // Section-driven slow rotation of the whole embedding, so navigation feels
    // like turning the space to a new topic region.
    if (groupRef.current) {
      const idx = Math.max(0, SECTION_ORDER.indexOf(activeSection))
      const targetRot = (idx / (SECTION_ORDER.length - 1)) * Math.PI * 0.5
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRot, 0.02)
    }

    // Gentle scroll-driven camera dolly + pointer parallax.
    state.camera.position.z = THREE.MathUtils.lerp(6, 4.5, ease)
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, state.pointer.x * 0.6, 0.03)
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, state.pointer.y * 0.4, 0.03)
    state.camera.lookAt(0, 0, 0)
  })

  return (
    <group ref={groupRef}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={COUNT} array={built.positions} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={COUNT} array={built.colors} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial
          vertexColors
          size={mobile ? 0.03 : 0.024}
          sizeAttenuation
          transparent
          opacity={0.7}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {built.edgePairs.length > 0 && (
        <lineSegments ref={linesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={built.edgePositions.length / 3}
              array={built.edgePositions}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial
            ref={lineMatRef}
            transparent
            opacity={0}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </lineSegments>
      )}
    </group>
  )
}
