/**
 * Path helpers for GitHub Pages `base` (`/gyungkook/` in prod, `/` locally).
 *
 * Nav `href` conventions in `src/data/nav.ts`:
 * - `#section`  → home section anchor (works from any page)
 * - `/press/...` → SPA route (React Router path, leading slash, no base prefix)
 */

/** Resolve a nav/data href into a real document URL (safe for plain `<a href>`). */
export function resolveNavHref(href: string): string {
  if (!href) return import.meta.env.BASE_URL
  if (/^https?:\/\//i.test(href) || href.startsWith('mailto:') || href.startsWith('tel:')) {
    return href
  }
  if (href.startsWith('#')) {
    // `/#about` or `/gyungkook/#about` — leaves subpages and lands on home section
    return `${import.meta.env.BASE_URL}${href}`
  }
  const normalized = href.replace(/^\//, '')
  return `${import.meta.env.BASE_URL}${normalized}`
}

/** React Router `to` value — strip base; keep hash as `{ pathname, hash }`-friendly string. */
export function routerPath(href: string): string {
  if (href.startsWith('#')) return `/${href}`
  return href.startsWith('/') ? href : `/${href}`
}
