import { Navigate, useParams } from 'react-router-dom'
import { PostDetail } from '../components/sub/PostDetail'
import {
  adjacentPressPosts,
  findPressPost,
  isPressCoverageTab,
  PRESS_COVERAGE_PAGE,
  PRESS_COVERAGE_TABS,
  pressPostDetailPath,
  pressTabListPath,
} from '../data/pressCoverage'

/**
 * 언론보도 detail — reuses shared `PostDetail` (SUB_게시글_상세_*).
 * URL: /press/coverage/:tab/:postId
 */
export function PressCoverageDetailPage() {
  const { tab, postId } = useParams<{ tab: string; postId: string }>()

  if (!isPressCoverageTab(tab) || !postId) {
    return <Navigate to={`${PRESS_COVERAGE_PAGE.basePath}/tv`} replace />
  }

  const post = findPressPost(tab, postId)
  if (!post) {
    return <Navigate to={pressTabListPath(tab)} replace />
  }

  const tabDef = PRESS_COVERAGE_TABS.find((t) => t.id === tab)!
  const { prev, next } = adjacentPressPosts(tab, postId)

  return (
    <PostDetail
      post={post}
      tabDef={tabDef}
      prev={prev}
      next={next}
      listPath={pressTabListPath(tab)}
      detailPath={pressPostDetailPath}
    />
  )
}
