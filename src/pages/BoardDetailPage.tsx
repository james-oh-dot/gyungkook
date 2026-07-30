import { Navigate, useParams } from 'react-router-dom'
import { PostDetail } from '../components/sub/PostDetail'
import type { BoardModule } from '../data/board'

type BoardDetailPageProps = {
  board: BoardModule
}

/**
 * Generic board detail route (Figma SUB_게시글_상세_*).
 *
 * 근거: 언론보도/컬럼미디어/사회공헌 상세 페이지 3개가 데이터 함수 이름만
 * 다른 동일 로직이었다 (param 검증 → findPost → adjacent → PostDetail).
 * `BoardModule` 주입으로 1개로 통합 — 새 게시판 추가 시 라우트에
 * `<BoardDetailPage board={NEW_BOARD} />` 한 줄이면 된다.
 *
 * URL shapes:
 * - tabbed:  basePath/:tab/:postId   (언론보도, 컬럼미디어)
 * - single:  basePath/:postId        (사회공헌 — tab은 defaultTab로 암묵 처리)
 */
export function BoardDetailPage({ board }: BoardDetailPageProps) {
  const { tab, postId } = useParams<{ tab?: string; postId: string }>()

  // Single boards have no :tab segment — resolve to the implicit default.
  const tabId = board.hasTabSegment ? tab : board.defaultTab

  if (!board.isTab(tabId) || !postId || tabId === undefined) {
    return <Navigate to={board.listPath(board.defaultTab)} replace />
  }

  const post = board.findPost(tabId, postId)
  if (!post) {
    return <Navigate to={board.listPath(tabId)} replace />
  }

  const tabDef = board.tabs.find((t) => t.id === tabId)
  if (!tabDef) {
    return <Navigate to={board.listPath(board.defaultTab)} replace />
  }

  const { prev, next } = board.adjacent(tabId, postId)

  return (
    <PostDetail
      post={post}
      tabDef={tabDef}
      prev={prev}
      next={next}
      listPath={board.listPath(tabId)}
      detailPath={board.detailPath}
    />
  )
}
