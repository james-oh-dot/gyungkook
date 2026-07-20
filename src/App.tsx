import { useEffect } from 'react'
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom'
import { COLUMN_MEDIA_BOARD } from './data/columnMedia'
import { PRESS_COVERAGE_BOARD } from './data/pressCoverage'
import { SOCIAL_CONTRIBUTION_BOARD } from './data/socialContribution'
import { shouldScrollToLocalTabs } from './hooks/useScrollToLocalTabs'
import { SiteLayout } from './layouts/SiteLayout'
import { BoardDetailPage } from './pages/BoardDetailPage'
import { CaseStudiesPage } from './pages/CaseStudiesPage'
import { ColumnMediaLayout } from './pages/ColumnMediaLayout'
import { ColumnMediaListPage } from './pages/ColumnMediaListPage'
import { HomePage } from './pages/HomePage'
import { PlaceholderPage } from './pages/PlaceholderPage'
import { PressCoverageLayout } from './pages/PressCoverageLayout'
import { PressCoverageListPage } from './pages/PressCoverageListPage'
import { AboutIntroPage } from './pages/AboutIntroPage'
import { RenewalPage } from './pages/RenewalPage'
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
 * Implemented:
 * - /press/cases                          → 업무사례 (sub-04-01)
 * - /press/coverage/:tab                  → TV방송 | 보도자료 list (sub-04-02)
 * - /press/coverage/:tab/:postId          → shared post detail
 * - /press/column-media/:tab              → 컬럼 | 간행물 | 미디어 list (sub-04-03)
 * - /press/column-media/:tab/:postId      → shared post detail
 * - /press/social                         → 사회공헌 list (sub-04-04)
 * - /press/social/:postId                 → shared post detail
 * - /about/intro                          → 법인소개 (sub-01-01)
 * - /practice/renewal                     → 정비사업 (sub-02-01)
 *
 * Placeholders (sub-01-01 visual + “곧 업데이트예정”):
 * - /about/greeting|lawyers|gallery|history|location
 * - /practice/public
 * - /other/misc|realestate
 * - /news/notice|cases|careers|consult
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

          {/* 법무법인경국 */}
          <Route path="about/intro" element={<AboutIntroPage />} />
          <Route
            path="about/greeting"
            element={<PlaceholderPage pageId="about-greeting" />}
          />
          <Route
            path="about/lawyers"
            element={<PlaceholderPage pageId="about-lawyers" />}
          />
          <Route
            path="about/gallery"
            element={<PlaceholderPage pageId="about-gallery" />}
          />
          <Route
            path="about/history"
            element={<PlaceholderPage pageId="about-history" />}
          />
          <Route
            path="about/location"
            element={<PlaceholderPage pageId="about-location" />}
          />

          {/* 재개발 · 보상업무 */}
          <Route path="practice/renewal" element={<RenewalPage />} />
          <Route
            path="practice/public"
            element={<PlaceholderPage pageId="redev-public" />}
          />

          {/* 기타업무 */}
          <Route
            path="other/misc"
            element={<PlaceholderPage pageId="other-misc" />}
          />
          <Route
            path="other/realestate"
            element={<PlaceholderPage pageId="other-realestate" />}
          />

          {/* 활동 · 보도 */}
          <Route path="press/cases" element={<CaseStudiesPage />} />
          <Route
            path="press/coverage"
            element={<Navigate to="tv" replace />}
          />
          <Route path="press/coverage/:tab" element={<PressCoverageLayout />}>
            <Route index element={<PressCoverageListPage />} />
            <Route
              path=":postId"
              element={<BoardDetailPage board={PRESS_COVERAGE_BOARD} />}
            />
          </Route>
          <Route
            path="press/column-media"
            element={<Navigate to="column" replace />}
          />
          <Route path="press/column-media/:tab" element={<ColumnMediaLayout />}>
            <Route index element={<ColumnMediaListPage />} />
            <Route
              path=":postId"
              element={<BoardDetailPage board={COLUMN_MEDIA_BOARD} />}
            />
          </Route>
          <Route path="press/social" element={<SocialContributionLayout />}>
            <Route index element={<SocialContributionListPage />} />
            <Route
              path=":postId"
              element={<BoardDetailPage board={SOCIAL_CONTRIBUTION_BOARD} />}
            />
          </Route>

          {/* 소식 · 공지 */}
          <Route
            path="news/notice"
            element={<PlaceholderPage pageId="news-notice" />}
          />
          <Route
            path="news/cases"
            element={<PlaceholderPage pageId="news-cases" />}
          />
          <Route
            path="news/careers"
            element={<PlaceholderPage pageId="news-careers" />}
          />
          <Route
            path="news/consult"
            element={<PlaceholderPage pageId="news-consult" />}
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
