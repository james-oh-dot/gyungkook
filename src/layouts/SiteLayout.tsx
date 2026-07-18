import type { ReactNode } from 'react'
import { Footer } from '../components/Footer'
import { Gnb } from '../components/Gnb'

type SiteLayoutProps = {
  children: ReactNode
}

/**
 * Shared page chrome for every entry (home + future subpages):
 * GNB (header/menu) + page content + Footer.
 */
export function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <main className="page">
      <Gnb />
      {children}
      <Footer />
    </main>
  )
}
