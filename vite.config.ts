import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const isGitHubPages = process.env.GITHUB_PAGES === 'true'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Project Pages: https://james-oh-dot.github.io/gyungkook/
  // Local/dev keeps `/` so http://localhost:5173 works as before.
  base: isGitHubPages ? '/gyungkook/' : '/',
})
