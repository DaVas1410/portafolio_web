import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const CLUSTERS = 6
const K = 5 // retrieval neighbors per query
const QUERIES_PER_CLUSTER = 4 // several query nodes per cluster → denser graph
const SECTION_ORDER = ['about', 'projects', 'research', 'publications', 'experience', 'skills', 'contact']

// One distinct warm hue per cluster — a Claude-ish spread from terracotta
// through clay, ochre, olive and sage to green. Tuned for legibility over the
// cream light background and glow on the charcoal dark background.
const CLUSTER_HEX_LIGHT = ['#c05a37', '#b3703c', '#a98a3e', '#7f8a3f', '#5f8455', '#3f7d68']
const CLUSTER_HEX_DARK = ['#e08260', '#d69a5a', '#d8bd6f', '#b6c072', '#93bd7e', '#6fbba0']

// Cheap pseudo-curl flow: offset a point by trig of its own coords + time.
// Mirrors the GLSL `flow()` in the vertex shader so CPU-side edge endpoints
// stay glued to their GPU-animated particles.
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

// GPU does the chaos→target morph + curl flow per vertex, so the main thread
// never touches per-particle positions. Only uTime / uEase change per frame.
const VERT = /* glsl */ `
  attribute vec3 aChaos;
  attribute vec3 aTarget;
  attribute vec3 aColor;
  uniform float uTime;
  uniform float uEase;
  uniform float uScale;
  uniform float uSize;
  varying vec3 vColor;

  vec3 flow(vec3 p, float t) {
    return vec3(
      sin(p.y * 0.7 + t) * 0.15 + cos(p.z * 0.5 + t * 0.7) * 0.12,
      sin(p.z * 0.6 + t * 1.1) * 0.15 + cos(p.x * 0.4 + t) * 0.12,
      sin(p.x * 0.5 + t * 0.9) * 0.15 + cos(p.y * 0.6 + t) * 0.12
    );
  }

  void main() {
    vColor = aColor;
    vec3 drift = flow(aChaos, uTime * 0.3) * (1.0 - uEase);
    vec3 pos = mix(aChaos + drift, aTarget, uEase);
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    // Guard the perspective divide: particles that drift near or behind the
    // camera plane would otherwise blow gl_PointSize up to a screen-filling
    // quad, and with additive blending that overdraw tanks the frame rate.
    float depth = max(-mv.z, 0.6);
    gl_PointSize = min(uSize * (uScale / depth), 24.0);
    gl_Position = projectionMatrix * mv;
  }
`

// Soft round falloff — glowing node, not a hard square "snowflake".
const FRAG = /* glsl */ `
  uniform float uOpacity;
  varying vec3 vColor;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.05, d);
    gl_FragColor = vec4(vColor, a * uOpacity);
  }
`

export default function ParticleLattice({ mobile, progressRef, activeSection, theme }) {
  const groupRef = useRef()
  const pointsRef = useRef()
  const linesRef = useRef()
  const lineMatRef = useRef()
  const matRef = useRef()

  const COUNT = mobile ? 450 : 900
  // Additive glow reads well on the dark charcoal, but washes out to invisible
  // on the cream light theme — there we composite normally as colored dots.
  const dark = theme === 'dark'
  const blend = dark ? THREE.AdditiveBlending : THREE.NormalBlending

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

    // Retrieval edges: several query nodes per cluster, each wired to its K
    // nearest neighbors in embedding (target) space, so the space reads as a
    // connected graph rather than isolated stars. Precompute the index pairs
    // once — never brute-force kNN per frame.
    const edgePairs = []
    if (!mobile) {
      for (let c = 0; c < CLUSTERS; c++) {
        // Spread query nodes through the cluster by striding its members.
        const members = []
        for (let i = c; i < COUNT; i += CLUSTERS) members.push(i)
        if (!members.length) continue
        const step = Math.max(1, Math.floor(members.length / QUERIES_PER_CLUSTER))
        for (let q = 0; q < QUERIES_PER_CLUSTER; q++) {
          const qi = members[Math.min(members.length - 1, q * step)]
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
    }

    const edgePositions = new Float32Array(edgePairs.length * 3)

    return { chaos, target, colors, clusterOf, edgePairs, edgePositions }
  }, [COUNT, mobile])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uEase: { value: 0 },
      uScale: { value: 500 },
      uSize: { value: mobile ? 0.085 : 0.065 },
      uOpacity: { value: 0.72 },
    }),
    [mobile],
  )

  // Colored dots over cream need more presence than an additive glow.
  useEffect(() => {
    if (matRef.current) matRef.current.uniforms.uOpacity.value = dark ? 0.72 : 0.85
  }, [dark])

  // Recolor per-cluster from the theme palette — once per theme change, not per
  // frame (avoids getComputedStyle forcing layout every tick). Each cluster gets
  // its own distinct warm hue (terracotta → clay → ochre → olive → sage → green)
  // so the space reads as multi-color embedding clusters, not an orange wash.
  useEffect(() => {
    const hexes = dark ? CLUSTER_HEX_DARK : CLUSTER_HEX_LIGHT
    const clusterColors = hexes.map((h) => new THREE.Color(h))
    const { colors, clusterOf } = built
    for (let i = 0; i < colors.length / 3; i++) {
      const col = clusterColors[clusterOf[i]]
      colors[i * 3] = col.r
      colors[i * 3 + 1] = col.g
      colors[i * 3 + 2] = col.b
    }
    const geo = pointsRef.current?.geometry
    if (geo?.attributes.aColor) geo.attributes.aColor.needsUpdate = true
    // Edge tint: a neutral mid-olive so links between clusters stay legible.
    if (lineMatRef.current) lineMatRef.current.color.set(dark ? '#b0a878' : '#7a7350')
  }, [dark, built])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const p = progressRef?.current ?? 0
    const scrollEase = p * p * (3 - 2 * p) // smoothstep
    // Autonomous idle "breathing": when the page isn't being scrolled the scene
    // would otherwise sit at ease≈0 (a dull chaos cloud). Slowly form and
    // dissolve the clusters on their own — strongest at the top, fading out as
    // scroll drives the real morph so the two never fight.
    // Keep the clusters mostly formed while idle (breathe between 0.35 and
    // 0.85 instead of dissolving to a full chaos cloud). This makes the
    // clusters + connections readable at landing AND is cheaper to draw:
    // clustered particles cover far less screen than a fully spread cloud.
    const breath = 0.5 - 0.5 * Math.cos(t * 0.22) // 0→1 slow oscillation
    const idleTarget = 0.35 + breath * 0.5 // 0.35 → 0.85
    const ease = scrollEase + (1 - scrollEase) * idleTarget

    // O(1) per-frame cost: the GPU vertex shader morphs every particle.
    if (matRef.current) {
      const u = matRef.current.uniforms
      u.uTime.value = t
      u.uEase.value = ease
      // sizeAttenuation scale — match three's point-size projection to px height.
      u.uScale.value = state.size.height * state.gl.getPixelRatio() * 0.5
    }

    // Retrieval edges follow the same morph, computed only for their endpoints.
    const { chaos, target, edgePairs, edgePositions } = built
    if (edgePairs.length && linesRef.current) {
      for (let e = 0; e < edgePairs.length; e++) {
        const i = edgePairs[e] * 3
        const [fx, fy, fz] = flow(chaos[i], chaos[i + 1], chaos[i + 2], t * 0.3)
        edgePositions[e * 3] = THREE.MathUtils.lerp(chaos[i] + fx * (1 - ease), target[i], ease)
        edgePositions[e * 3 + 1] = THREE.MathUtils.lerp(chaos[i + 1] + fy * (1 - ease), target[i + 1], ease)
        edgePositions[e * 3 + 2] = THREE.MathUtils.lerp(chaos[i + 2] + fz * (1 - ease), target[i + 2], ease)
      }
      linesRef.current.geometry.attributes.position.needsUpdate = true
      if (lineMatRef.current) {
        const pulse = 0.6 + 0.4 * Math.sin(t * 1.4)
        // Visible base so the connections read at landing, growing with ease.
        lineMatRef.current.opacity = (0.18 + ease * 0.32) * pulse
      }
    }

    // Section-driven slow rotation of the whole embedding, so navigation feels
    // like turning the space to a new topic region.
    if (groupRef.current) {
      const idx = Math.max(0, SECTION_ORDER.indexOf(activeSection))
      // Section target + a slow continuous drift so the scene never fully
      // settles into a frozen pose while idle.
      const targetRot = (idx / (SECTION_ORDER.length - 1)) * Math.PI * 0.5 + t * 0.03
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
      <points ref={pointsRef} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={COUNT} array={built.chaos} itemSize={3} />
          <bufferAttribute attach="attributes-aChaos" count={COUNT} array={built.chaos} itemSize={3} />
          <bufferAttribute attach="attributes-aTarget" count={COUNT} array={built.target} itemSize={3} />
          <bufferAttribute attach="attributes-aColor" count={COUNT} array={built.colors} itemSize={3} />
        </bufferGeometry>
        <shaderMaterial
          ref={matRef}
          uniforms={uniforms}
          vertexShader={VERT}
          fragmentShader={FRAG}
          transparent
          depthWrite={false}
          blending={blend}
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
            blending={blend}
          />
        </lineSegments>
      )}
    </group>
  )
}
