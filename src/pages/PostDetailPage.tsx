import { Navigate, useParams } from 'react-router-dom'
import { PostDetail } from '../components/sub/PostDetail'
import {
  adjacentPosts,
  COLUMN_MEDIA_PAGE,
  COLUMN_MEDIA_TABS,
  findPost,
  isColumnMediaTab,
  postDetailPath,
  tabListPath,
} from '../data/columnMedia'

/**
 * 컬럼·미디어 detail route (Figma SUB_게시글_상세_*).
 * URL: /press/column-media/:tab/:postId
 */
export function PostDetailPage() {
  const { tab, postId } = useParams<{ tab: string; postId: string }>()

  if (!isColumnMediaTab(tab) || !postId) {
    return <Navigate to={`${COLUMN_MEDIA_PAGE.basePath}/column`} replace />
  }

  const post = findPost(tab, postId)
  if (!post) {
    return <Navigate to={tabListPath(tab)} replace />
  }

  const tabDef = COLUMN_MEDIA_TABS.find((t) => t.id === tab)!
  const { prev, next } = adjacentPosts(tab, postId)

  return (
    <PostDetail
      post={post}
      tabDef={tabDef}
      prev={prev}
      next={next}
      listPath={tabListPath(tab)}
      detailPath={postDetailPath}
    />
  )
}
