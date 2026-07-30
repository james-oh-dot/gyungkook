/** Prefix public assets with Vite base (e.g. `/gyungkook/` on GitHub Pages). */
export function asset(path: string): string {
  const normalized = path.replace(/^\//, '')
  return `${import.meta.env.BASE_URL}${normalized}`
}
