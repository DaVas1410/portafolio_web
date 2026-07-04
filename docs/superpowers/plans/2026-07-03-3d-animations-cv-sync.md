# 3D Animation Overhaul + CV Sync Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a lazy-loaded WebGL "chaos → lattice" particle background that reacts to scroll and section changes, plus scroll-reveal + 3D tilt micro-interactions, and sync the site with the full CV including cited Diversa contributions.

**Architecture:** A single `ScrollContext` publishes normalized scroll progress + active section; a `MotionContext` resolves reduced-motion. A fixed, behind-content `SceneCanvas` lazy-loads three.js and renders `ParticleLattice`, which lerps particles from turbulent chaos toward a structured lattice as scroll progresses and recolors teal↔amber per section. Reduced-motion swaps the whole canvas for a static gradient. Content lives in bilingual `{ en, es }` data modules.

**Tech Stack:** React 18, Vite 5, TailwindCSS v3, `three` + `@react-three/fiber` + `@react-three/drei` (lazy chunk).

## Global Constraints

- **No test framework exists.** Verification per task = `npm run build` (must succeed) and/or `npm run dev` visual check. Do NOT add jest/vitest.
- All user-facing copy MUST be `{ en, es }` pairs, consumed via `LangContext` — no hard-coded strings in JSX.
- Tailwind accent classes MUST be full static strings (see `src/components/accentStyles.js`); never interpolate class names.
- Colors come from CSS vars in `src/index.css` (`--accent`, `--accent-warm`, etc.); read them at runtime for canvas colors so theme swap works.
- `prefers-reduced-motion` OR the manual toggle → no `<Canvas>`, no three.js import, instant reveals.
- three.js must be a **separate lazy chunk** (verify in build output), never blocking first paint.
- Work on branch `feat/3d-animations-cv-sync`. Commit after every task.
- Node/tooling already set up; use `npm`.

---

### Task 1: Install deps + MotionContext + reduce-motion toggle

**Files:**
- Modify: `package.json` (deps)
- Create: `src/context/MotionContext.jsx`
- Modify: `src/main.jsx` (wrap provider), `src/components/Nav.jsx` (toggle), `src/components/Toggles.jsx` (add motion toggle button)

**Interfaces:**
- Produces: `MotionProvider` (component), `useMotion()` → `{ reduced: boolean, manualReduced: boolean, setManualReduced: (b)=>void }`.

- [ ] **Step 1: Install dependencies**

Run:
```bash
npm install three @react-three/fiber @react-three/drei
```
Expected: added to `dependencies` in `package.json`, no peer errors that break install.

- [ ] **Step 2: Create MotionContext**

Create `src/context/MotionContext.jsx`:
```jsx
import { createContext, useContext, useEffect, useState } from 'react'

const MotionContext = createContext({ reduced: false, manualReduced: false, setManualReduced: () => {} })

const KEY = 'prefers-reduced-motion-manual'

export function MotionProvider({ children }) {
  const [systemReduced, setSystemReduced] = useState(false)
  const [manualReduced, setManualReduced] = useState(() => {
    if (typeof localStorage === 'undefined') return false
    return localStorage.getItem(KEY) === '1'
  })

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setSystemReduced(mq.matches)
    const onChange = (e) => setSystemReduced(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    localStorage.setItem(KEY, manualReduced ? '1' : '0')
  }, [manualReduced])

  const reduced = systemReduced || manualReduced

  return (
    <MotionContext.Provider value={{ reduced, manualReduced, setManualReduced }}>
      {children}
    </MotionContext.Provider>
  )
}

export const useMotion = () => useContext(MotionContext)
```

- [ ] **Step 3: Wrap app in MotionProvider**

In `src/main.jsx`, import and wrap the existing tree (alongside the current Theme/Lang providers):
```jsx
import { MotionProvider } from './context/MotionContext.jsx'
// ...inside render, wrap <App/> (innermost or outermost is fine):
// <MotionProvider><App /></MotionProvider>
```
Read the existing `main.jsx` first and nest `MotionProvider` around the same children the other providers wrap.

- [ ] **Step 4: Add a motion toggle button**

Read `src/components/Toggles.jsx` to match its button styling. Add a third toggle that calls `useMotion()` and flips `manualReduced`, labeled with an icon + `sr-only` bilingual text (add copy `motionToggle: { on: {en:'Motion on',es:'Movimiento activado'}, off: {en:'Reduce motion',es:'Reducir movimiento'} }` to `content.js`). Use an existing icon from `src/components/Icons.jsx` or add a simple "sparkles/pause" SVG there.

- [ ] **Step 5: Build**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json src/context/MotionContext.jsx src/main.jsx src/components/Nav.jsx src/components/Toggles.jsx src/components/Icons.jsx src/data/content.js
git commit -m "feat: add three.js deps + MotionContext with reduce-motion toggle"
```

---

### Task 2: ScrollContext

**Files:**
- Create: `src/context/ScrollContext.jsx`
- Modify: `src/main.jsx` (wrap provider)

**Interfaces:**
- Consumes: nothing.
- Produces: `ScrollProvider` (component), `useScroll()` → `{ progressRef: React.MutableRefObject<number>, activeSection: string }`. `progressRef.current` is 0..1 page scroll progress, updated every rAF WITHOUT causing re-renders (so the canvas reads it in its own frame loop). `activeSection` is a state string (re-renders on change) holding the current section id.

- [ ] **Step 1: Create ScrollContext**

Create `src/context/ScrollContext.jsx`:
```jsx
import { createContext, useContext, useEffect, useRef, useState } from 'react'

const ScrollContext = createContext(null)

const SECTION_IDS = ['about', 'projects', 'research', 'experience', 'skills', 'contact']

export function ScrollProvider({ children }) {
  const progressRef = useRef(0)
  const [activeSection, setActiveSection] = useState('about')

  useEffect(() => {
    let raf = 0
    const update = () => {
      const doc = document.documentElement
      const max = doc.scrollHeight - window.innerHeight
      progressRef.current = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0

      // active section = last section whose top has passed 45% of viewport
      const mid = window.innerHeight * 0.45
      let current = 'about'
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= mid) current = id
      }
      setActiveSection((prev) => (prev === current ? prev : current))
      raf = 0
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    update()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <ScrollContext.Provider value={{ progressRef, activeSection }}>
      {children}
    </ScrollContext.Provider>
  )
}

export const useScroll = () => useContext(ScrollContext)
export { SECTION_IDS }
```

- [ ] **Step 2: Wrap app in ScrollProvider**

In `src/main.jsx`, nest `ScrollProvider` inside `MotionProvider` (both wrapping `<App/>`).

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/context/ScrollContext.jsx src/main.jsx
git commit -m "feat: add ScrollContext (progress ref + active section)"
```

---

### Task 3: SceneCanvas wrapper (lazy + static fallback)

**Files:**
- Create: `src/three/SceneCanvas.jsx`
- Create: `src/three/StaticBackdrop.jsx`
- Modify: `src/App.jsx` (mount behind content)

**Interfaces:**
- Consumes: `useMotion()`, `useScroll()`.
- Produces: `SceneCanvas` default export — a fixed, `pointer-events-none`, `z-index:-1` full-viewport background. When `reduced` → renders `StaticBackdrop` (no three import). Else lazy-loads `ParticleLattice` inside an R3F `<Canvas>`.

- [ ] **Step 1: Create StaticBackdrop (reduced-motion fallback)**

Create `src/three/StaticBackdrop.jsx`:
```jsx
// Cheap, motionless gradient shown when motion is reduced. No WebGL.
export default function StaticBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10"
      style={{
        background:
          'radial-gradient(60% 50% at 30% 20%, rgb(var(--accent) / 0.08), transparent 70%),' +
          'radial-gradient(50% 50% at 80% 80%, rgb(var(--accent-warm) / 0.06), transparent 70%)',
      }}
    />
  )
}
```

- [ ] **Step 2: Create SceneCanvas**

Create `src/three/SceneCanvas.jsx`. `ParticleLattice` is created in Task 4; the lazy import is written now and will resolve once that file exists.
```jsx
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
```

- [ ] **Step 3: Mount SceneCanvas in App**

In `src/App.jsx`, import `SceneCanvas` and render it as the first child inside the root `<div>` (it is fixed, so order only affects DOM, not layout):
```jsx
import SceneCanvas from './three/SceneCanvas.jsx'
// ...
// <div className="min-h-screen bg-bg">
//   <SceneCanvas />
//   <Nav /> ...
```
Also make the root `bg-bg` allow the canvas to show: change `bg-bg` on the root `<div>` to `bg-bg/95` is NOT needed — instead ensure sections don't paint an opaque full background over it. Leave section backgrounds as-is; the canvas is subtle and behind. (If content fully hides it, revisit in Task 5.)

- [ ] **Step 4: Build (expect fail until Task 4 exists)**

Run: `npm run build`
Expected: FAILS — `./ParticleLattice.jsx` not found. This confirms the lazy wiring points at the right path. Proceed to Task 4; do not commit a broken build.

> Note: Tasks 3 and 4 form one commit boundary. Complete Task 4 before committing.

---

### Task 4: ParticleLattice scene (chaos → lattice, scroll + color driven)

**Files:**
- Create: `src/three/ParticleLattice.jsx`

**Interfaces:**
- Consumes: `useScroll()` (`progressRef`, `activeSection`), R3F `useFrame`, `three`.
- Produces: default export `ParticleLattice({ mobile })` — a `<points>` mesh. Reads `progressRef.current` each frame to lerp positions and reads CSS vars for color.

- [ ] **Step 1: Create ParticleLattice**

Create `src/three/ParticleLattice.jsx`:
```jsx
import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
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
  const { size } = useThree()

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
```
Note: `size` from `useThree` is imported for future use/parallax scaling; keep the import only if used, else remove to avoid lint noise. (It is currently unused — remove the `size` destructure and `useThree` import if your build warns.)

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: build succeeds; output shows a separate chunk containing three.js (a large `.js` file distinct from the main bundle). Confirm the main entry chunk did NOT swallow three.

- [ ] **Step 3: Visual check**

Run: `npm run dev`, open the site. Verify: particles visible behind content; scrolling top→bottom visibly tightens the cloud toward a lattice; the color shifts warmer toward the lower sections; toggling the OS reduce-motion (or the manual toggle) removes the canvas and shows the static gradient.

- [ ] **Step 4: Commit (Tasks 3 + 4 together)**

```bash
git add src/three/ src/App.jsx
git commit -m "feat: lazy WebGL particle-lattice background with reduced-motion fallback"
```

---

### Task 5: Readability + canvas layering pass

**Files:**
- Modify: `src/index.css` (readability helpers), possibly section components

**Interfaces:** none new.

- [ ] **Step 1: Ensure text readability over canvas**

If the dev check in Task 4 showed text competing with particles, add a subtle scrim. In `src/index.css` under `@layer components`, add:
```css
  /* Optional readability scrim usable behind dense text blocks */
  .scrim {
    background: rgb(var(--bg) / 0.55);
    backdrop-filter: blur(2px);
  }
```
Apply `scrim` + rounded corners only where a text block sits directly on busy particles (e.g. hero tagline card). Do NOT blanket every section — keep the canvas visible.

- [ ] **Step 2: Verify contrast**

Run `npm run dev`; confirm body text meets comfortable contrast in both light and dark themes with the canvas active.

- [ ] **Step 3: Commit**

```bash
git add src/index.css src/components
git commit -m "feat: readability scrim for text over particle canvas"
```

---

### Task 6: Scroll-reveal hook + apply to sections

**Files:**
- Create: `src/hooks/useReveal.js`
- Modify: `src/index.css` (reveal classes), section components (`About.jsx`, `Projects.jsx`, `Research.jsx`, `Experience.jsx`, `Skills.jsx`, `Contact.jsx`)

**Interfaces:**
- Consumes: `useMotion()`.
- Produces: `useReveal(options?)` → `ref` to attach to an element; toggles a `.revealed` class when it enters view. Under reduced motion, the class is applied immediately.

- [ ] **Step 1: Create useReveal**

Create `src/hooks/useReveal.js`:
```js
import { useEffect, useRef } from 'react'
import { useMotion } from '../context/MotionContext.jsx'

export function useReveal({ threshold = 0.15, rootMargin = '0px 0px -10% 0px' } = {}) {
  const ref = useRef(null)
  const { reduced } = useMotion()

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (reduced) {
      el.classList.add('revealed')
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('revealed')
            io.unobserve(e.target)
          }
        })
      },
      { threshold, rootMargin }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [reduced, threshold, rootMargin])

  return ref
}
```

- [ ] **Step 2: Add reveal CSS**

In `src/index.css` under `@layer components`, add:
```css
  .reveal {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1),
      transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .reveal.revealed {
    opacity: 1;
    transform: none;
  }
```
The existing global `prefers-reduced-motion` block already zeroes transitions, so this is safe.

- [ ] **Step 3: Apply to each section**

In each section component (`About`, `Projects`, `Research`, `Experience`, `Skills`, `Contact`), import `useReveal`, create `const revealRef = useReveal()`, and attach it with `className="... reveal"` to the section's main content wrapper. For list/grid sections (Projects), apply to the grid container so cards reveal together, OR call `useReveal` per card for a staggered feel (choose per-card only for Projects and Skills grids; single wrapper elsewhere).

- [ ] **Step 4: Verify**

Run `npm run dev`; scroll and confirm sections fade+slide up on entry; with reduce-motion on they appear instantly.

- [ ] **Step 5: Build + commit**

```bash
npm run build
git add src/hooks/useReveal.js src/index.css src/components
git commit -m "feat: IntersectionObserver scroll-reveal for sections"
```

---

### Task 7: TiltCard + apply to project cards

**Files:**
- Create: `src/components/TiltCard.jsx`
- Modify: `src/components/Projects.jsx`

**Interfaces:**
- Consumes: `useMotion()`.
- Produces: `TiltCard({ children, className })` — wraps children in a div with pointer-driven 3D tilt + glare. Under reduced motion, renders a plain div (no listeners).

- [ ] **Step 1: Create TiltCard**

Create `src/components/TiltCard.jsx`:
```jsx
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
```

- [ ] **Step 2: Add glare CSS**

In `src/index.css` under `@layer components`:
```css
  .tilt-card {
    position: relative;
    transform-style: preserve-3d;
    will-change: transform;
  }
  .tilt-card::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.2s ease;
    background: radial-gradient(
      circle at var(--glare-x, 50%) var(--glare-y, 50%),
      rgb(var(--accent) / 0.14),
      transparent 55%
    );
  }
  .tilt-card:hover::after {
    opacity: 1;
  }
```

- [ ] **Step 3: Wrap project cards**

In `src/components/Projects.jsx`, read the current card markup first, then wrap each card element with `<TiltCard className="<existing card classes incl. rounded>">…</TiltCard>`, moving the border/rounded classes onto the TiltCard wrapper so the glare `border-radius: inherit` matches. Keep the existing hairline-glow hover.

- [ ] **Step 4: Verify + build + commit**

Run `npm run dev`; hover project cards → subtle tilt + glare; reduce-motion → no tilt.
```bash
npm run build
git add src/components/TiltCard.jsx src/components/Projects.jsx src/index.css
git commit -m "feat: 3D tilt + glare micro-interaction on project cards"
```

---

### Task 8: Hero rotating role line

**Files:**
- Modify: `src/components/Hero.jsx`, `src/data/content.js`

**Interfaces:**
- Consumes: `useMotion()`, `LangContext`.

- [ ] **Step 1: Add rotating roles copy**

In `src/data/content.js`, add to the `hero` object:
```js
  roles: {
    en: ['Physics undergraduate', 'Data Scientist @ Diversa', 'AI for social & environmental good'],
    es: ['Estudiante de física', 'Data Scientist @ Diversa', 'IA para el bien social y ambiental'],
  },
```

- [ ] **Step 2: Implement rotating line in Hero**

Read `src/components/Hero.jsx`. Add a small component/state that cycles `hero.roles[lang]` every ~2.8s with a fade. Under `reduced`, show only `roles[0]` (no interval). Example logic:
```jsx
// inside Hero, after existing hooks:
const { reduced } = useMotion()
const roles = hero.roles[lang]
const [ri, setRi] = useState(0)
useEffect(() => {
  if (reduced) return
  const id = setInterval(() => setRi((i) => (i + 1) % roles.length), 2800)
  return () => clearInterval(id)
}, [reduced, roles.length])
// render: <span key={ri} className="animate-fade-up">{roles[ri]}</span>
```
Place it near the existing `hero.role` line (you may replace the static role subtitle with this rotator, keeping `hero.role` as fallback text). Do not remove the existing tagline.

- [ ] **Step 3: Verify + build + commit**

Run `npm run dev`; role line cycles; reduce-motion shows a single static role.
```bash
npm run build
git add src/components/Hero.jsx src/data/content.js
git commit -m "feat: rotating role line in hero (reduced-motion safe)"
```

---

### Task 9: Experience — all four roles + Diversa contributions data

**Files:**
- Create: `src/data/diversa.js`
- Modify: `src/data/content.js` (experience roles), `src/components/Experience.jsx`

**Interfaces:**
- Produces: `export const diversaContributions` (array) from `src/data/diversa.js`.

- [ ] **Step 1: Create Diversa contributions data**

Create `src/data/diversa.js`:
```js
// Cited contributions to the Diversa org (github.com/DiversaStudio).
const ORG = 'https://github.com/DiversaStudio'

export const diversaContributions = [
  {
    slug: 'feminist-urban-design',
    name: {
      en: 'AI + Feminist Urban Design',
      es: 'IA + Diseño Urbano Feminista',
    },
    accent: 'accent',
    role: { en: 'Co-author', es: 'Coautor' },
    desc: {
      en: 'Comparative study of public spaces in South America and Southeast Asia. Street-level imagery enhanced with Real-ESRGAN super-resolution, YOLO-World object detection, and OSMnx spatial data, scored against six feminist design principles (safety, proximity, diversity, autonomy, vitality, representativeness).',
      es: 'Estudio comparativo de espacios públicos en Sudamérica y el Sudeste Asiático. Imágenes a nivel de calle mejoradas con super-resolución Real-ESRGAN, detección de objetos con YOLO-World y datos espaciales OSMnx, evaluadas según seis principios de diseño feminista (seguridad, proximidad, diversidad, autonomía, vitalidad, representatividad).',
    },
    stack: ['PyTorch', 'YOLO-World', 'Real-ESRGAN', 'OSMnx', 'Street View'],
    repo: `${ORG}/A-comparative-AI-approach-to-feminist-urban-design-of-public-spaces-of-the-GlobalSouth`,
  },
  {
    slug: 'radar-agent',
    name: { en: 'Radar Agent', es: 'Radar Agent' },
    accent: 'warm',
    role: { en: 'Contributor', es: 'Colaborador' },
    desc: {
      en: 'Fullstack research agent that generates search queries, reflects on knowledge gaps, and iteratively refines web research into well-cited answers.',
      es: 'Agente de investigación fullstack que genera consultas de búsqueda, detecta vacíos de conocimiento y refina iterativamente la investigación web en respuestas con citas.',
    },
    stack: ['React', 'LangGraph', 'FastAPI', 'Gemini', 'Docker'],
    repo: `${ORG}/radar_agent`,
  },
]
```

- [ ] **Step 2: Add the four work roles to content.js**

Read `src/components/Experience.jsx` and the current `experience` shape in `content.js`. Replace/extend the experience data so it lists all four roles (bilingual), each with `{ title, org, period, bullets: [] }`:
- Data Scientist — Diversa — Jan 2025–Present
- Junior Data Scientist — Diversa — Jan 2024–Jan 2025
- Security Systems Manager — Orion Seguridad — 2019, 2024
- HS Physics & Math Tutor — U.E. Salesiana Sánchez y Cifuentes — 2023

Use the bullet content from the design spec §"Experience (all 4 roles)". Keep the existing data key/structure the component already maps over; only add fields it can render.

- [ ] **Step 3: Render Diversa contributions subsection**

In `src/components/Experience.jsx`, import `diversaContributions` and `TiltCard`, and render a "Selected work at Diversa" subsection (bilingual heading via a new `content.js` key `experience.diversaHeading = { en: 'Selected work at Diversa', es: 'Trabajo destacado en Diversa' }`) as a grid of `TiltCard`s, each showing name, role badge, desc, stack badges, and a repo link. Reuse existing badge/`accentStyles` classes; accent classes must be full static strings.

- [ ] **Step 4: Verify + build + commit**

Run `npm run dev`; Experience shows 4 roles + a Diversa contributions grid, EN/ES both correct, repo links resolve to DiversaStudio.
```bash
npm run build
git add src/data/diversa.js src/data/content.js src/components/Experience.jsx
git commit -m "feat: full work history + cited Diversa contributions"
```

---

### Task 10: Publications section

**Files:**
- Create: `src/data/publications.js`, `src/components/Publications.jsx`
- Modify: `src/App.jsx` (mount), `src/data/content.js` (nav + section copy), `src/components/Nav.jsx` (nav entry)

**Interfaces:**
- Produces: `export const publications` from `src/data/publications.js`; `Publications` default component.

- [ ] **Step 1: Create publications data**

Create `src/data/publications.js`:
```js
export const publications = [
  {
    slug: 'feminist-urban-ai',
    title: {
      en: 'Integrating Artificial Intelligence (AI) and Feminist Urban Design: A Comparative Study of Public Spaces in South America and Southeast Asia',
      es: 'Integrando Inteligencia Artificial (IA) y Diseño Urbano Feminista: Un estudio comparativo de espacios públicos en Sudamérica y el Sudeste Asiático',
    },
    venue: { en: 'Diversa · In press', es: 'Diversa · En prensa' },
    type: { en: 'Paper', es: 'Artículo' },
    link: 'https://github.com/DiversaStudio/A-comparative-AI-approach-to-feminist-urban-design-of-public-spaces-of-the-GlobalSouth',
  },
  {
    slug: 'spectral-navier-stokes',
    title: {
      en: 'Spectral Methods for the Navier–Stokes Equations',
      es: 'Métodos Espectrales para las Ecuaciones de Navier–Stokes',
    },
    venue: { en: 'NanoPhys Day V4', es: 'NanoPhys Day V4' },
    type: { en: 'Poster', es: 'Póster' },
    link: null,
  },
]
```

- [ ] **Step 2: Create Publications component**

Create `src/components/Publications.jsx` following the pattern of an existing simple section (read `src/components/Research.jsx` for the eyebrow/`SectionHeader` pattern). Render `<section id="publications">` with `useReveal` on the wrapper, a `SectionHeader`, and a list mapping `publications` → title, a `type` badge, venue (muted), and a "View" link when `link` is non-null. All labels via `content.js` (add `publications: { eyebrow, title }` bilingual keys).

- [ ] **Step 3: Mount + nav**

In `src/App.jsx`, add `<Publications />` after `<Research />`. In `src/data/content.js` `nav` array add `{ id: 'publications', label: { en: 'Publications', es: 'Publicaciones' } }` (place after `research`). Confirm `Nav.jsx` maps `nav` so the link appears automatically; if section anchor offset needed, `section[id]` rule in CSS already handles it.

- [ ] **Step 4: Verify + build + commit**

Run `npm run dev`; Publications section renders, nav link scrolls to it, EN/ES correct.
```bash
npm run build
git add src/data/publications.js src/components/Publications.jsx src/App.jsx src/data/content.js src/components/Nav.jsx
git commit -m "feat: add Publications section"
```

---

### Task 11: Expand Skills to full CV matrix

**Files:**
- Modify: `src/data/content.js` (skills groups), `src/components/Skills.jsx`

- [ ] **Step 1: Expand skills data**

Read the current `skills` shape in `content.js` and `src/components/Skills.jsx`. Extend the data to the four groups from the spec, keeping the existing structure the component maps over:
- **Programming:** Python; AI & ML on Python; SQL / PostgreSQL; AI Agents; Scientific Programming; Data Analysis & Visualization; Frontend Development; Backend Development
- **Tools & Technologies:** Linux (Administration & Kernel); Version Control (Git); Quantum Computing (Qiskit); Deployment; HPC Computing
- **Professional:** Scientific Writing & Research; Process Optimization; Prompt Engineering; Content Creation; Video & Audio Editing
- **Languages:** English (Advanced); Spanish (Native)

Provide group labels bilingually. Skill item names can stay as single strings (proper nouns) — no translation needed, but wrap in `{en,es}` only if the component expects it; match existing shape.

- [ ] **Step 2: Verify component renders all groups**

If `Skills.jsx` hard-codes group count/layout, adjust the grid to accommodate four groups responsively. Keep badges using existing `.badge` class.

- [ ] **Step 3: Verify + build + commit**

Run `npm run dev`; four skill groups render, EN/ES labels correct, layout not broken on mobile.
```bash
npm run build
git add src/data/content.js src/components/Skills.jsx
git commit -m "feat: expand skills to full CV matrix"
```

---

### Task 12: Personal Work / Leadership (collapsible)

**Files:**
- Create: `src/data/personalWork.js`, `src/components/PersonalWork.jsx`
- Modify: `src/App.jsx`, `src/data/content.js`

- [ ] **Step 1: Create personal-work data**

Create `src/data/personalWork.js` with bilingual groups from the spec:
```js
export const personalWork = [
  {
    group: { en: 'Clubs', es: 'Clubes' },
    items: [
      { en: 'Computational Physics — President, Yachay Tech (1 yr)', es: 'Física Computacional — Presidente, Yachay Tech (1 año)' },
      { en: 'Basketball Club — President, Yachay Tech (2 yrs)', es: 'Club de Baloncesto — Presidente, Yachay Tech (2 años)' },
      { en: 'CAS IEEE Chapter — President, Yachay Tech (1 yr)', es: 'Capítulo CAS IEEE — Presidente, Yachay Tech (1 año)' },
      { en: 'IEEE Student Chapter — Web Master, Yachay Tech (1 yr)', es: 'Capítulo Estudiantil IEEE — Web Master, Yachay Tech (1 año)' },
    ],
  },
  {
    group: { en: 'Committees', es: 'Comités' },
    items: [
      { en: 'EPIC V Organizing Committee — 2025, Latitud 0 research group', es: 'Comité Organizador EPIC V — 2025, grupo de investigación Latitud 0' },
      { en: 'Physics & Nanotechnology Student Association — President, 2025', es: 'Asociación de Estudiantes de Física y Nanotecnología — Presidente, 2025' },
      { en: 'Olympic Basketball Tournament — Organizer, 2024 & 2025, Yachay Tech', es: 'Torneo Olímpico de Baloncesto — Organizador, 2024 y 2025, Yachay Tech' },
    ],
  },
  {
    group: { en: 'Schools', es: 'Escuelas' },
    items: [
      { en: 'EPIC IV Scientific Programming — 2024, UIDE', es: 'EPIC IV Programación Científica — 2024, UIDE' },
      { en: 'International School for Young Astronomers (ISYA) — 2025, Yachay Tech', es: 'Escuela Internacional para Jóvenes Astrónomos (ISYA) — 2025, Yachay Tech' },
      { en: 'Quantum Computing School — 2023, Yachay Tech', es: 'Escuela de Computación Cuántica — 2023, Yachay Tech' },
    ],
  },
]
```

- [ ] **Step 2: Create collapsible component**

Create `src/components/PersonalWork.jsx`: a `<section id="personal">` with `useReveal`, a `SectionHeader`, and a native `<details>`/`<summary>` (or a state-toggled disclosure) that expands to show the groups as columns of `.badge`/list items. Default collapsed. Bilingual summary label via `content.js` key `personal: { eyebrow, title, toggle: { en:'Show all', es:'Ver todo' } }`.

- [ ] **Step 3: Mount**

In `src/App.jsx`, add `<PersonalWork />` after `<Skills />`. Do NOT add it to the top nav (keeps nav focused) — it is reachable by scroll only.

- [ ] **Step 4: Verify + build + commit**

Run `npm run dev`; section collapsed by default, expands on click, EN/ES correct.
```bash
npm run build
git add src/data/personalWork.js src/components/PersonalWork.jsx src/App.jsx src/data/content.js
git commit -m "feat: collapsible Personal Work / Leadership section"
```

---

### Task 13: Final verification pass

**Files:** none (verification only), minor fixes as needed.

- [ ] **Step 1: Production build + chunk check**

Run: `npm run build`
Expected: succeeds. Inspect `dist/assets` output — three.js is a separate large chunk, not merged into the main entry. If it was eagerly bundled, fix the lazy import in `SceneCanvas.jsx`.

- [ ] **Step 2: Preview + full walkthrough**

Run: `npm run preview`. Walk the whole page and verify against spec §Testing:
1. Particles morph chaos→lattice on scroll; lines/tightening visible.
2. Section change shifts particle color teal↔amber; nav active link tracks.
3. Theme swap (light/dark) recolors particles correctly.
4. Reduce-motion (OS + manual toggle) → no canvas, static fallback, instant reveals, no rotating role, no tilt.
5. Mobile viewport (devtools ~375px): lower particle count, acceptable smoothness.
6. All new content (4 roles, Diversa grid, Publications, expanded Skills, Personal Work) renders in EN and ES.
7. All external links resolve (DiversaStudio repos, publication link).

- [ ] **Step 3: Fix any issues found, then commit**

```bash
git add -A
git commit -m "chore: final verification fixes for 3D + CV sync"
```

- [ ] **Step 4: Update memory**

Note in the session that `project-animations-todo.md` memory is now largely completed; update or delete it, and refresh `project-portfolio-site.md` to mention the WebGL background + new sections.

---

## Self-Review

**Spec coverage:**
- WebGL chaos→lattice scene → Tasks 3–4 ✓
- Lazy-load / separate chunk → Tasks 3, 13 ✓
- Scroll progress + active section → Task 2 ✓
- Teal↔amber per-section color + theme-aware → Task 4 ✓
- Scroll-reveal → Task 6 ✓
- Card 3D tilt + glare → Task 7 ✓
- Hero rotating role → Task 8 ✓
- Reduced-motion (system + manual toggle, no canvas) → Tasks 1, 3, and honored in 4/6/7/8 ✓
- Mobile perf caps → Tasks 3, 4 ✓
- Experience ×4 roles → Task 9 ✓
- Diversa contributions cited → Task 9 ✓
- Publications section → Task 10 ✓
- Skills matrix expanded → Task 11 ✓
- Personal Work collapsible → Task 12 ✓
- Bilingual copy throughout → enforced per task ✓
- Final verification → Task 13 ✓

**Placeholder scan:** No TBD/TODO left as work items; every code step shows real code. Component-integration steps that say "read the existing file first" are intentional (the existing shapes must be matched) and include the exact data/labels to add.

**Type consistency:** `useMotion()` → `{ reduced, manualReduced, setManualReduced }` used consistently (Tasks 1,3,6,7,8). `useScroll()` → `{ progressRef, activeSection }` used consistently (Tasks 2,4). `diversaContributions`, `publications`, `personalWork` export names match their consumers.
