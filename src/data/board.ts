/**
 * Shared board types for list + detail subpages
 * (컬럼미디어, 언론보도, …).
 *
 * Detail UI: `PostDetail` (Figma SUB_게시글_상세_*).
 */

export type BoardTabDef = {
  id: string
  label: string
  /** Chip on list / detail cards */
  chip: string
}

export type BoardPost = {
  id: string
  /** Tab key (URL segment) */
  tab: string
  title: string
  summary: string
  source?: string
  author?: string
  publishedAt: string
  views: number
  thumbnail: string
  detailImage?: string
  body: string[]
}

export type BoardAdjacent = {
  prev?: BoardPost
  next?: BoardPost
}

export function adjacentInList(
  list: BoardPost[],
  postId: string,
): BoardAdjacent {
  const index = list.findIndex((p) => p.id === postId)
  if (index < 0) return {}
  return {
    next: index > 0 ? list[index - 1] : undefined,
    prev: index < list.length - 1 ? list[index + 1] : undefined,
  }
}
