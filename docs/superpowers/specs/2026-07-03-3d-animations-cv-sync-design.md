# 3D Animation Overhaul + CV Sync — Design

**Date:** 2026-07-03
**Branch:** `feat/3d-animations-cv-sync`
**Project:** `cv_web` — Juan Vásconez portfolio (React + Vite + TailwindCSS v3, bilingual EN/ES, light/dark)

## Goal

Make the site feel alive and distinctly *Juan* (physics + AI) via a WebGL 3D background
that reacts to scroll and transitions between sections, plus scroll-reveal and card
micro-interactions — striking but **not overdone**. In the same pass, sync the site with
the latest CV content and cite Diversa (`github.com/DiversaStudio`) contributions.

Two decisions already locked with the user:
- **3D stack:** Real WebGL via Three.js / react-three-fiber (lazy-loaded).
- **Scene concept:** "Chaos → Lattice" — a particle field that reorganizes from
  turbulent chaos (physics) into a structured data lattice (data science) as the user
  scrolls, narrating Juan's physics → data-science arc.
- **Scope:** Full CV sync + Diversa citations.

## Non-goals (YAGNI)

- No routing / multi-page. Single-page site stays.
- No CMS or backend. Content stays as static `{ en, es }` data modules.
- No physics engine — the "turbulence" is procedural curl-noise, not simulated.

## Architecture

### New dependencies
- `three`, `@react-three/fiber`, `@react-three/drei`
- All three are **lazy-loaded** (`React.lazy` + dynamic import) so the WebGL bundle is a
  separate chunk that never blocks first paint. Verified via `npm run build` chunk split.

### New / changed files
```
src/three/SceneCanvas.jsx       fixed full-viewport <Canvas> wrapper; lazy Suspense; DPR/mobile caps; visibility pause
src/three/ParticleLattice.jsx   the particle system (chaos -> lattice), scroll + color driven
src/context/ScrollContext.jsx   normalized page scroll (0..1) + active section id
src/context/MotionContext.jsx   resolves prefers-reduced-motion + manual toggle
src/hooks/useReveal.js          IntersectionObserver scroll-reveal hook
src/data/publications.js        publications content ({ en, es })
src/data/diversa.js             Diversa contributions content ({ en, es })
src/components/Publications.jsx new section
src/components/TiltCard.jsx     reusable CSS-3D tilt wrapper (used by Projects/Diversa cards)
```
Changed: `App.jsx` (mount SceneCanvas + providers + Publications), `Hero.jsx`
(composite over canvas + rotating role line), `Projects.jsx`, `Experience.jsx`,
`Skills.jsx`, `Nav.jsx` (reduce-motion toggle), `index.css` (reveal + tilt utilities),
`src/data/content.js` (new copy).

### Data flow
```
scroll event ─► ScrollContext (progress 0..1, activeSection)
                    │
     ┌──────────────┼───────────────────────────┐
     ▼              ▼                             ▼
ParticleLattice   palette target            Nav active link /
 (morph + color)  (teal<->amber per section) reveal triggers
```
`MotionContext` gates all of it: when reduced motion is on, `SceneCanvas` renders a static
fallback instead of a `<Canvas>`, and `useReveal` returns "already revealed".

## Components

### `ScrollContext`
- Single `scroll`/`resize` listener (rAF-throttled) computes `progress = scrollY / (docHeight - viewportH)` and the current section id (from section offsets).
- Exposes `{ progress, activeSection }`. One source of truth; no component adds its own scroll listener.

### `MotionContext`
- Reads `matchMedia('(prefers-reduced-motion: reduce)')` and a manual boolean (persisted to `localStorage`, like theme/lang).
- Exposes `reduced` (true if either says reduce). Nav gets a small toggle.

### `SceneCanvas`
- `position: fixed; inset: 0; z-index: -1; pointer-events: none;` behind all content, low opacity so text stays AA-readable.
- If `reduced`: render a cheap static CSS gradient/radial fallback — **no WebGL, no three.js import.**
- Else: lazy `<Suspense>` → `<Canvas dpr={[1, 1.5]}>` with `frameloop` paused when the canvas is off-screen (IntersectionObserver) or tab hidden.
- Mobile: lower particle count + DPR cap.

### `ParticleLattice`
- `~8–12k` points (BufferGeometry) on desktop, `~3–4k` on mobile.
- Each particle stores a **chaos position** (seeded random within a volume) and a **lattice target** (structured grid/network node).
- Per frame: `pos = lerp(chaosPos + curlNoise(t), latticeTarget, ease(progress))`. At `progress≈0` = turbulent cloud; at `progress≈1` = settled lattice. Connecting lines fade in as `progress` rises (kept sparse for perf).
- **Color:** particle color = `lerp(accentTeal, accentWarm, sectionMix)` where `sectionMix` derives from `activeSection`; reads current `--accent` / `--accent-warm` values so it recolors correctly on theme swap.
- **Camera:** slow scroll-driven dolly + subtle damped mouse parallax (drei `useFrame`).

### `TiltCard`
- Pointer-position → CSS `transform: perspective() rotateX/rotateY` + a moving glare highlight. Resets on leave. Disabled under `reduced`. Wraps existing project/Diversa cards without changing their inner markup.

### `useReveal`
- IntersectionObserver adds a `revealed` class when a node enters view; CSS handles fade+slide-up (reuse existing `animate-fade-up` vocabulary). Under `reduced`, returns revealed immediately.

### Hero
- Keep `OrbitBackdrop` SVG, composited above the new canvas.
- Add a rotating/typewriter role line (e.g. "Physics undergraduate" ↔ "Data Scientist @ Diversa" ↔ "AI for social & environmental good"). Static first line under `reduced`.

## Content additions (full CV sync)

All copy as `{ en, es }` pairs following `content.js` conventions. Accent classes stay full
static strings per `accentStyles.js` (Tailwind JIT constraint).

### Experience (all 4 roles)
- **Data Scientist — Diversa** (Jan 2025–Present) and **Junior Data Scientist — Diversa** (Jan 2024–Jan 2025): AI experts collaboration on human-centered / environmentally-conscious solutions; scalable Python/SQL data solutions; AI agents + full-stack apps; ethical AI; UI/UX + generative UI; actionable insights.
- **Security Systems Manager — Orion Seguridad** (2019, 2024): 2000+ recorder camera network on Linux servers; workflows improved response time 30%; live monitoring; Linux server maintenance.
- **HS Physics & Math Tutor — U.E. Salesiana Sánchez y Cifuentes** (2023): targeted lessons, custom materials (math/chem/physics), measurable score improvement.

### New: Publications section
- *Integrating AI and Feminist Urban Design: A Comparative Study of Public Spaces in South America and Southeast Asia* — **Diversa, in press / awaiting publication.**
- *Spectral Methods for the Navier–Stokes Equations* — Poster, NanoPhys Day V4.

### New: Diversa Contributions block
Cited from `github.com/DiversaStudio`:
- **feminist-urban-design** (`A-comparative-AI-approach-to-feminist-urban-design-of-public-spaces-of-the-GlobalSouth`) — Juan is a listed co-author (Vásconez, J.). YOLO-World object detection + Real-ESRGAN super-resolution + OSMnx + Google Street View; feminist safety-perception analysis of micro-public spaces. Links to the paper above.
- **radar_agent** — Fullstack research agent: React/Vite + Tailwind/Shadcn frontend, LangGraph + FastAPI backend, Gemini, Docker/Postgres/Redis.
- (Optional, lower priority) mention org repos GOIA / Hidden-Geographies-of-AI as context.

Placement: a subsection within Experience ("Selected work at Diversa"), each as a `TiltCard`
linking to the DiversaStudio repo. Keeps personal repos (Projects) and org work distinct.

### Skills (expanded to full CV matrix)
Programming (Python, AI/ML on Python, SQL/PostgreSQL, AI Agents, Scientific Programming,
Data Analysis & Viz, Frontend, Backend); Tools & Tech (Linux admin/kernel, Git, Qiskit,
Deployment, HPC); Professional (Scientific Writing & Research, Process Optimization, Prompt
Engineering, Content Creation, Video/Audio Editing); Languages (English Advanced, Spanish
Native).

### Personal Work / Leadership (optional, collapsible)
Clubs & presidencies (Computational Physics, Basketball, CAS IEEE, IEEE Web Master),
committees (EPIC V, Physics & Nanotech Assoc. president, Olympic Basketball organizer),
schools (EPIC IV, ISYA 2025, Quantum Computing School), personal projects (DiffCut astro
segmentation, skin-cancer CV, EMG hand-movement ML, Waves & Oscillations TA).

## Reduced-motion & performance (hard requirements)

- `prefers-reduced-motion: reduce` **or** manual toggle → no `<Canvas>`, no three.js import; static gradient fallback; reveals instant.
- Canvas: `dpr` capped ≤1.5; `frameloop="demand"`/paused when off-screen or tab hidden; particle count + DPR reduced on mobile (pointer/coarse or width check).
- three.js loads only as a lazy chunk. Text contrast stays AA — canvas opacity kept low and behind a readability gradient where needed.

## Testing / verification

Manual via `npm run dev`:
1. Scene renders; particles morph chaos→lattice on scroll; lines fade in.
2. Section changes shift particle color teal↔amber; Nav active link tracks.
3. Theme swap recolors particles correctly (light & dark).
4. Reduced-motion (OS setting and manual toggle) → canvas absent, static fallback, instant reveals.
5. Mobile viewport: acceptable frame rate, lower particle count.
6. New content renders bilingually (EN/ES) and links resolve.
7. `npm run build` succeeds; three.js is a separate lazy chunk.

## Rollout

Feature branch `feat/3d-animations-cv-sync` off `master`. Incremental commits. Merge when
verification passes.
