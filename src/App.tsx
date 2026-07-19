import { useEffect } from 'react'
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom'
import { shouldScrollToLocalTabs } from './hooks/useScrollToLocalTabs'
import { SiteLayout } from './layouts/SiteLayout'
import { CaseStudiesPage } from './pages/CaseStudiesPage'
import { ColumnMediaLayout } from './pages/ColumnMediaLayout'
import { ColumnMediaListPage } from './pages/ColumnMediaListPage'
import { HomePage } from './pages/HomePage'
import { PostDetailPage } from './pages/PostDetailPage'
import { PressCoverageDetailPage } from './pages/PressCoverageDetailPage'
import { PressCoverageLayout } from './pages/PressCoverageLayout'
import { PressCoverageListPage } from './pages/PressCoverageListPage'
import { RenewalPage } from './pages/RenewalPage'
import { SocialContributionDetailPage } from './pages/SocialContributionDetailPage'
import { SocialContributionLayout } from './pages/SocialContributionLayout'
import { SocialContributionListPage } from './pages/SocialContributionListPage'
import './styles/global.css'

function ScrollToTop() {
  const { pathname, state } = useLocation()
  useEffect(() => {
    // Detail / local-tab clicks scroll to tabs (sticky under GNB)
    if (shouldScrollToLocalTabs(pathname, state)) return
    // GNB/menu entry: keep sub-visual visible at top
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname, state])
  return null
}

/**
 * Main SPA routes (index.html).
 *
 * Subpages:
 * - /press/cases                          → 업무사례 (sub-04-01)
 * - /press/coverage/:tab                  → TV방송 | 보도자료 list (sub-04-02)
 * - /press/coverage/:tab/:postId          → shared post detail
 * - /press/column-media/:tab              → 컬럼 | 간행물 | 미디어 list (sub-04-03)
 * - /press/column-media/:tab/:postId      → shared post detail
 * - /press/social                         → 사회공헌 list (sub-04-04)
 * - /press/social/:postId                 → shared post detail
 * - /practice/renewal                     → 정비사업 (sub-02-01)
 *
 * GitHub Pages deep links require dist/404.html → index.html (see deploy workflow).
 */
function App() {
  // BASE_URL is `/` or `/gyungkook/` — React Router basename has no trailing slash
  const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || undefined

  return (
    <BrowserRouter basename={basename}>
      <ScrollToTop />
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<HomePage />} />
          <Route path="practice/renewal" element={<RenewalPage />} />
          <Route path="press/cases" element={<CaseStudiesPage />} />
          <Route
            path="press/coverage"
            element={<Navigate to="tv" replace />}
          />
          <Route path="press/coverage/:tab" element={<PressCoverageLayout />}>
            <Route index element={<PressCoverageListPage />} />
            <Route path=":postId" element={<PressCoverageDetailPage />} />
          </Route>
          <Route
            path="press/column-media"
            element={<Navigate to="column" replace />}
          />
          <Route path="press/column-media/:tab" element={<ColumnMediaLayout />}>
            <Route index element={<ColumnMediaListPage />} />
            <Route path=":postId" element={<PostDetailPage />} />
          </Route>
          <Route path="press/social" element={<SocialContributionLayout />}>
            <Route index element={<SocialContributionListPage />} />
            <Route path=":postId" element={<SocialContributionDetailPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
