import { useEffect } from 'react'
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom'
import { SiteLayout } from './layouts/SiteLayout'
import { ColumnMediaLayout } from './pages/ColumnMediaLayout'
import { ColumnMediaListPage } from './pages/ColumnMediaListPage'
import { HomePage } from './pages/HomePage'
import { PostDetailPage } from './pages/PostDetailPage'
import './styles/global.css'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname])
  return null
}

/**
 * Main SPA routes (index.html).
 *
 * Subpages:
 * - /press/column-media/:tab              → 컬럼 | 간행물 | 미디어 list
 * - /press/column-media/:tab/:postId      → shared post detail
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
          <Route
            path="press/column-media"
            element={<Navigate to="column" replace />}
          />
          <Route path="press/column-media/:tab" element={<ColumnMediaLayout />}>
            <Route index element={<ColumnMediaListPage />} />
            <Route path=":postId" element={<PostDetailPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
