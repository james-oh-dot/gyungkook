import type { ReactNode } from 'react'
import { Outlet } from 'react-router-dom'
import { Footer } from '../components/Footer'
import { Gnb } from '../components/Gnb'
import { QuickConsult } from '../components/QuickConsult'
import { QuickNav } from '../components/QuickNav'

type SiteLayoutProps = {
  /** Optional children when used outside <Outlet> (e.g. classic entry). */
  children?: ReactNode
}

/**
 * Shared page chrome for every entry (home + subpages):
 * GNB (header/menu) + page content + Footer.
 *
 * Prefer the React Router layout-route form (`<Outlet />`).
 * `children` remains for the classic.html MPA entry which has no router tree.
 */
export function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <main className="page">
      <Gnb />
      {children ?? <Outlet />}
      {/* Desktop-only (≥1025) — hidden on tablet/mobile via CSS */}
      <QuickConsult />
      <Footer />
      {/* Tablet/mobile floating quick rail — hidden on desktop via CSS */}
      <QuickNav />
    </main>
  )
}
