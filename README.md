# Juan Vásconez — Portfolio

Personal portfolio of Juan Vásconez — *Physics student & Data Scientist* at Yachay Tech University (Ecuador). Single-page, responsive, bilingual (EN/ES), with light/dark themes.

Built with **React + Vite + TailwindCSS** (pure utility classes, no prebuilt component kits).

## Design

The look is driven by a small, deliberate design system rather than framework defaults:

- **Palette** — a *diverging scientific colormap* (cool teal/plasma ↔ warm amber/stellar) over blue-tinted slate neutrals evoking the interstellar medium. Defined as CSS variables in `src/index.css` and mapped to Tailwind color utilities, so one set of classes serves both themes.
- **Typography** — `Space Grotesk` (display), `Inter` (body), `JetBrains Mono` (data / code labels / section indices).
- **Motifs** — an animated orbital SVG in the hero, faint data-grid backdrops, coordinate-style section headers, and hairline accents.

## Sections

Hero · About · Projects · Research (thesis) · Experience · Skills · Contact.

Project cards are generated from **real repositories** on [github.com/DaVas1410](https://github.com/DaVas1410) — see `src/data/projects.js`. All copy lives in `src/data/content.js` as `{ en, es }` pairs.

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
```

```bash
npm run build    # production build -> dist/
npm run preview  # preview the production build
```

Node 18+ recommended (developed on Node 24).

## Editing content

| What | Where |
|------|-------|
| Project cards | `src/data/projects.js` |
| All section text (EN/ES) | `src/data/content.js` |
| Links (GitHub, LinkedIn, email, CV) | `src/data/content.js` → `links` |
| Colors / theme tokens | `src/index.css` (`:root` and `.dark`) |
| Fonts | `index.html` (Google Fonts) + `tailwind.config.js` |

### Things to replace

- **LinkedIn** — `links.linkedin` in `src/data/content.js` is a placeholder (`https://www.linkedin.com/`). Swap in your profile URL.
- **CV** — the CV button points to `/cv.pdf`, served from `public/cv.pdf` (your `CV_JUANDA_VASCONEZ.pdf`, already copied). Replace that file to update the CV.

## Deploy

### Vercel (recommended — zero config)

1. Push this repo to GitHub.
2. Import it at [vercel.com/new](https://vercel.com/new). Framework preset **Vite** is detected automatically (build `npm run build`, output `dist`).
3. Deploy. Custom domains work out of the box.

No `base` change is needed for Vercel or a custom domain.

### GitHub Pages (project site)

A project site is served from `https://<user>.github.io/<repo>/`, so assets must use that sub-path. Build with the `VITE_BASE` env var set to your repo name:

```bash
# bash
VITE_BASE=/cv_web/ npm run build

# PowerShell
$env:VITE_BASE = '/cv_web/'; npm run build
```

Then publish `dist/` — either push it to a `gh-pages` branch, or use a GitHub Action. A ready-made workflow:

```yaml
# .github/workflows/deploy.yml
name: Deploy to Pages
on:
  push:
    branches: [main]
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: VITE_BASE=/cv_web/ npm run build
      - uses: actions/upload-pages-artifact@v3
        with: { path: dist }
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment: { name: github-pages }
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

Enable Pages → *Build and deployment* → **GitHub Actions**. For a user/org site (`<user>.github.io`) or a custom domain, drop `VITE_BASE` (defaults to `/`).

## Project structure

```
src/
  main.jsx            # entry, wraps app in Theme + Lang providers
  App.jsx             # section composition
  index.css           # design tokens (CSS vars) + base styles
  context/            # ThemeContext, LangContext (both persisted to localStorage)
  data/               # projects.js, content.js
  components/         # Nav, Hero, OrbitBackdrop, About, Projects, Research,
                     # Experience, Skills, Contact, Footer, Icons, Toggles
public/
  cv.pdf              # served at /cv.pdf
  favicon.svg
```
