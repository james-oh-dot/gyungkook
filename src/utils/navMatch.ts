import { NAV_ITEMS } from '../data/nav'

export type ActiveNavMatch = {
  topId: string | null
  subId: string | null
}

/** Strip Vite/GitHub Pages `BASE_URL` and normalize trailing slash. */
export function stripBasePath(pathname: string): string {
  const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '')
  let path = pathname || '/'
  if (base && (path === base || path.startsWith(`${base}/`))) {
    path = path.slice(base.length) || '/'
  }
  if (!path.startsWith('/')) path = `/${path}`
  if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1)
  return path
}

/**
 * Match prefix for SPA nav hrefs.
 * `/press/coverage/tv` → `/press/coverage` so detail tabs stay under 언론보도.
 */
function spaMatchPrefix(href: string): string {
  const normalized = href.replace(/\/$/, '')
  const parts = normalized.split('/').filter(Boolean)
  if (parts[0] === 'press' && parts.length >= 2) {
    return `/${parts[0]}/${parts[1]}`
  }
  return normalized
}

/**
 * Resolve which GNB top + sub item matches the current document location.
 * Prefers longest SPA route match, then home hash match.
 */
export function matchActiveNav(pathname: string, hash: string): ActiveNavMatch {
  const path = stripBasePath(pathname)

  let best: { topId: string; subId: string; len: number } | null = null
  for (const item of NAV_ITEMS) {
    for (const sub of item.children) {
      if (!sub.href.startsWith('/')) continue
      const prefix = spaMatchPrefix(sub.href)
      if (path === prefix || path.startsWith(`${prefix}/`) || path === sub.href.replace(/\/$/, '')) {
        if (!best || prefix.length > best.len) {
          best = { topId: item.id, subId: sub.id, len: prefix.length }
        }
      }
    }
  }
  if (best) return { topId: best.topId, subId: best.subId }

  const h = hash.startsWith('#') ? hash : hash ? `#${hash}` : ''
  if (h) {
    for (const item of NAV_ITEMS) {
      for (const sub of item.children) {
        if (sub.href === h) return { topId: item.id, subId: sub.id }
      }
    }
  }

  return { topId: null, subId: null }
}
