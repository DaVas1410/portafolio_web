# Portfolio Redesign — Design Spec

Date: 2026-07-04
Repo: cv_web (React + Vite + Tailwind, bilingual EN/ES)

## Goal

Move the site from "student who lists things" to "researcher who ships things."
Address a five-point critique: (1) add visual evidence to projects, (2) break
the uniform card monotony with layout rhythm, (3) cut and reorder sections,
(4) lead with outcomes not tech stacks, (5) give the hero a single focal
element and let the copy sit still.

Scope: content/structure/layout redesign. The generative particle background
(ParticleLattice) stays; only its intensity behind the hero is dialed back.

## Decisions (locked)

- Hero focal: **portrait right, still copy left**; stop the 2.8s role
  rotation; particle lattice dialed back to ambient behind the hero.
- Section order: **About stays #2** (short context), then evidence.
- Full five-point scope in one coordinated pass.
- Real assets exist (project screenshots/plots + a portrait) but are NOT yet
  in the repo. Build **graceful fallbacks** so the site looks intentional
  before every image is added; user drops files in incrementally.

## 1. Section structure (8 → 5 core)

New order:
`Hero → About → Projects → Research & Publications → Experience → Skills → Contact`

Folds:
- **Publications → Research.** Research section gains a compact "Papers &
  posters" strip at its end (the 2 items from `publications.js`). Remove the
  standalone `<Publications>` section and its nav entry.
- **PersonalWork → About.** About gains a compact "Community & leadership"
  strip (grouped clubs/committees/schools from `personalWork.js`, condensed).
  Remove the standalone `<PersonalWork>` section.

Nav becomes: About · Projects · Research · Experience · Skills · Contact.

`App.jsx` render order updated; `ScrollContext.SECTION_IDS` and `Nav` `nav`
list updated to match (drop `publications`; no `personalwork` id existed in
nav). Keep section `id`s stable for the ones that remain.

## 2. Project cards: visual evidence + outcome

Card structure (top → bottom):
1. **16:9 media** — `<ProjectMedia slug accent />`:
   - Renders `public/projects/<slug>.webp` via `<img loading="lazy">`.
   - On error/missing, swaps to a CSS **accent-gradient placeholder** with a
     subtle `{ }` / mono glyph so it reads as intentional, not broken.
2. **Outcome line** — one bold sentence, `text-ink`, above the description,
   visually distinct from badges. Drafted per project (see below).
3. Existing description (kept, possibly trimmed).
4. Tech badges (kept).

Featured project (`cnn_astro`) renders **full-bleed**: 2-column span, larger
media (side-by-side media + text on desktop), the section's visual anchor.

New data field per project in `projects.js`: `outcome: { en, es }`.
Draft outcomes (from existing, factual copy — refine on review):
- cnn_astro: "~99% accuracy recovering turbulence k_min from synthetic cloud
  images; trained on HPC/SLURM."
- orbits-simulation: "Reproduces Mercury's perihelion precession from a
  relativistic two-body integrator."
- relativity_rag: "A fully offline GR study agent — OCRs handwritten notes and
  answers with LaTeX, no data leaves the machine."
- deepsci-agent: "Semantic search + citation graphs over 2M+ arXiv papers,
  entirely local."
- pinn_demo: "Solves Burgers' equation mesh-free in the browser with live
  training plots."
- TopoGenTech: "Detects palm-oil expansion & forest fragmentation across
  Ecuador using persistent homology + ML."
- yachay_water_study: "Ranks water-refill sites by solar exposure, shade, and
  access with NASA POWER data."
- web_aefn: "Student-management portal shipped for the Yachay Tech student
  association." (no media; lower priority / may drop to a compact row)

## 3. Layout rhythm

- **Featured full-bleed** card as above (breaks the grid).
- **Experience/Diversa tinted band**: wrap the Experience section in a
  full-width warm-tinted background (new `.section-tint` using a color between
  `--bg` and `--bg-elev`, or a subtle accent wash), edge-to-edge, with inner
  content constrained to `max-w-content`. Signals weight and breaks cream.
- **Research** presented as asymmetric text + figure (thesis figure media on
  one side, narrative + pipeline on the other) rather than uniform cards.

## 4. Outcome-led copy

Covered by the `outcome` field above; About and Research intros trimmed for
confidence. No invented claims — outcomes derive from existing README-sourced
copy already in the repo.

## 5. Hero

- Layout: responsive 2-column. Left: greeting + name + **single static role
  line** (`hero.role`) + tagline + CTAs (unchanged links). Right: **portrait**
  in a framed treatment (`public/portrait.webp`, graceful fallback = accent
  gradient block with initials "JV").
- **Remove** the `setInterval` role rotation and the `roles[]` cycling; use the
  static `hero.role`. Keep `reduced`-motion behavior trivially (nothing to
  pause).
- Particle lattice: reduce presence behind the hero specifically (e.g. a
  top-anchored fade/scrim already exists via `grid-backdrop`; add a soft
  radial vignette or lower canvas opacity in the hero band so the portrait and
  copy dominate). No change to the lattice elsewhere.

## Components touched

- `App.jsx` — section order, drop Publications/PersonalWork.
- `Nav.jsx` + `content.js` `nav` — nav items.
- `context/ScrollContext.jsx` — `SECTION_IDS`.
- `Hero.jsx` — 2-col portrait layout, remove role rotation.
- `Projects.jsx` — media slot, outcome line, featured full-bleed.
- `data/projects.js` — add `outcome`.
- `Research.jsx` — asymmetric layout + folded Publications strip.
- `About.jsx` — folded Community & leadership strip.
- `Experience.jsx` — tinted band wrapper.
- `index.css` — `.section-tint`, media/placeholder helpers.
- New: `components/ProjectMedia.jsx` (image + fallback), `components/HeroPortrait.jsx`.
- Delete: `components/Publications.jsx`, `components/PersonalWork.jsx` (or keep
  files but unmount; prefer delete to reduce dead code).

## Non-goals

- No CMS / dynamic GitHub fetch (static data stays).
- No new color system (reuse the warm palette; only add a tint token).
- Not redesigning the particle shader (separate, already-tuned work).

## Success criteria

- Projects show visual proof (real image or intentional placeholder) + one
  outcome line each.
- Page has clear rhythm: at least one full-bleed feature and one tinted band.
- Section count reduced to 5 core; nav matches.
- Hero has a still focal portrait; no rotating text competing for attention.
- Builds clean; light/dark + EN/ES all correct; smooth scroll retained.
