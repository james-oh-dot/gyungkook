import { useContext, type ReactNode } from 'react'
import { Outlet, UNSAFE_LocationContext } from 'react-router-dom'
import { Footer } from '../components/Footer'
import { Gnb } from '../components/Gnb'
import { QuickConsult } from '../components/QuickConsult'
import { QuickNav } from '../components/QuickNav'

type SiteLayoutProps = {
  /** Optional children when used outside <Outlet> (e.g. classic entry). */
  children?: ReactNode
}

/**
 * Router pathname when under BrowserRouter; otherwise `/` (classic.html home).
 * Avoids calling `useLocation()` outside a Router (hooks throw).
 */
function usePathname(): string {
  const ctx = useContext(UNSAFE_LocationContext)
  return ctx?.location.pathname ?? '/'
}

/**
 * Shared page chrome for every entry (home + subpages):
 * GNB (header/menu) + page content + Footer.
 *
 * Prefer the React Router layout-route form (`<Outlet />`).
 * `children` remains for the classic.html MPA entry which has no router tree.
 *
 * `빠른문자상담` is home-only (SPA `/` and classic.html). Subpages keep
 * GNB “상담하기” / QuickNav for contact.
 */
export function SiteLayout({ children }: SiteLayoutProps) {
  const pathname = usePathname()
  const isHome = pathname === '/'

  return (
    <main className="page">
      <Gnb />
      {children ?? <Outlet />}
      {/* Desktop-only (≥1025) — hidden on tablet/mobile via CSS; home only */}
      {isHome ? <QuickConsult /> : null}
      <Footer />
      {/* Tablet/mobile floating quick rail — hidden on desktop via CSS */}
      <QuickNav />
    </main>
  )
}
