import { useEffect } from 'react'
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom'
import { CASE_NEWS_BOARD } from './data/caseNews'
import { JOBS_BOARD } from './data/careers'
import { COLUMN_MEDIA_BOARD } from './data/columnMedia'
import { DEFAULT_LAWYER_ID } from './data/lawyers'
import { NEWS_NOTICE_BOARD } from './data/newsNotice'
import { PRESS_COVERAGE_BOARD } from './data/pressCoverage'
import { SOCIAL_CONTRIBUTION_BOARD } from './data/socialContribution'
import { shouldScrollToLocalTabs } from './hooks/useScrollToLocalTabs'
import { SiteLayout } from './layouts/SiteLayout'
import { BoardDetailPage } from './pages/BoardDetailPage'
import { CaseStudiesPage } from './pages/CaseStudiesPage'
import { ColumnMediaLayout } from './pages/ColumnMediaLayout'
import { ColumnMediaListPage } from './pages/ColumnMediaListPage'
import { ConsultPage } from './pages/ConsultPage'
import { CareersInfoPage } from './pages/CareersInfoPage'
import { CareersLayout } from './pages/CareersLayout'
import { CaseNewsLayout } from './pages/CaseNewsLayout'
import { CaseNewsListPage } from './pages/CaseNewsListPage'
import { GalleryPage } from './pages/GalleryPage'
import { GreetingPage } from './pages/GreetingPage'
import { HomePage } from './pages/HomePage'
import { JobsListPage } from './pages/JobsListPage'
import { LawyerProfilePage } from './pages/LawyerProfilePage'
import { MiscPage } from './pages/MiscPage'
import { NewsNoticeLayout } from './pages/NewsNoticeLayout'
import { NewsNoticeListPage } from './pages/NewsNoticeListPage'
import { PlaceholderPage } from './pages/PlaceholderPage'
import { PublicProjectPage } from './pages/PublicProjectPage'
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
 * - /about/greeting                       → 대표 인사말 (sub-01-02)
 * - /about/lawyers/:lawyerId              → 변호사자문단 (sub-01-03, route-mode tabs)
 * - /about/gallery                        → 경국인 · 갤러리 (sub-01-04, scroll-mode tabs)
 * - /practice/renewal                     → 정비사업 (sub-02-01)
 * - /practice/public                      → 공익사업 (sub-02-02)
 *
 * Placeholders (sub-01-01 visual + “곧 업데이트예정”):
 * - /about/history|location
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
          <Route path="about/greeting" element={<GreetingPage />} />
          <Route
            path="about/lawyers"
            element={<Navigate to={DEFAULT_LAWYER_ID} replace />}
          />
          <Route path="about/lawyers/:lawyerId" element={<LawyerProfilePage />} />
          <Route path="about/gallery" element={<GalleryPage />} />
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
          <Route path="practice/public" element={<PublicProjectPage />} />

          {/* 기타업무 (부동산 분야 등 5개 영역 스크롤 탭 단일 페이지) */}
          <Route path="other/misc" element={<MiscPage />} />
          <Route
            path="other/realestate"
            element={<Navigate to="/other/misc" replace />}
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
          <Route path="news/notice" element={<NewsNoticeLayout />}>
            <Route index element={<NewsNoticeListPage />} />
            <Route
              path=":postId"
              element={<BoardDetailPage board={NEWS_NOTICE_BOARD} />}
            />
          </Route>
          <Route path="news/cases" element={<CaseNewsLayout />}>
            <Route index element={<CaseNewsListPage />} />
            <Route
              path=":postId"
              element={<BoardDetailPage board={CASE_NEWS_BOARD} />}
            />
          </Route>
          <Route path="news/careers" element={<CareersLayout />}>
            <Route index element={<CareersInfoPage />} />
            <Route path="jobs">
              <Route index element={<JobsListPage />} />
              <Route
                path=":postId"
                element={<BoardDetailPage board={JOBS_BOARD} />}
              />
            </Route>
          </Route>
          <Route path="news/consult" element={<ConsultPage />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
