import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Base is set for GitHub Pages project-site deploys. When deploying to a custom
// domain, Vercel, or a user/org Pages site, set VITE_BASE='/' (see README).
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE || '/',
})
