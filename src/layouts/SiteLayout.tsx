import type { ReactNode } from 'react'
import { Outlet } from 'react-router-dom'
import { Footer } from '../components/Footer'
import { Gnb } from '../components/Gnb'

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
      <Footer />
    </main>
  )
}
