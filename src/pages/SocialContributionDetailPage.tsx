import { Navigate, useParams } from 'react-router-dom'
import { PostDetail } from '../components/sub/PostDetail'
import {
  adjacentSocialPosts,
  findSocialPost,
  SOCIAL_CONTRIBUTION_PAGE,
  SOCIAL_CONTRIBUTION_TABS,
  socialListPath,
  socialPostDetailPath,
} from '../data/socialContribution'

/**
 * 사회공헌 detail — reuses shared `PostDetail` (SUB_게시글_상세_*).
 * URL: /press/social/:postId
 */
export function SocialContributionDetailPage() {
  const { postId } = useParams<{ postId: string }>()

  if (!postId) {
    return <Navigate to={SOCIAL_CONTRIBUTION_PAGE.basePath} replace />
  }

  const post = findSocialPost(postId)
  if (!post) {
    return <Navigate to={socialListPath()} replace />
  }

  const tabDef = SOCIAL_CONTRIBUTION_TABS[0]!
  const { prev, next } = adjacentSocialPosts(postId)

  return (
    <PostDetail
      post={post}
      tabDef={tabDef}
      prev={prev}
      next={next}
      listPath={socialListPath()}
      detailPath={socialPostDetailPath}
    />
  )
}
