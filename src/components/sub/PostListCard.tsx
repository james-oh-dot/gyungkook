import { Link } from 'react-router-dom'
import type { BoardPost, BoardTabDef } from '../../data/board'
import './PostListCard.css'

type PostListCardProps = {
  post: BoardPost
  tabDef: BoardTabDef
  detailPath: (tab: string, postId: string) => string
}

/**
 * Horizontal list row (컬럼미디어 style).
 * Clicking enters the shared post-detail layout.
 */
export function PostListCard({ post, tabDef, detailPath }: PostListCardProps) {
  const to = detailPath(post.tab, post.id)

  return (
    <article className="post-card" data-name="list">
      <Link className="post-card__link" to={to}>
        <div className="post-card__copy">
          <div className="post-card__title-row">
            <span className="post-card__chip">{tabDef.chip}</span>
            <h2 className="post-card__title">{post.title}</h2>
          </div>
          <p className="post-card__summary">{post.summary}</p>
          {post.source ? <p className="post-card__source">{post.source}</p> : null}
          {post.author ? <p className="post-card__author">{post.author}</p> : null}
          <p className="post-card__meta">
            <span>{post.publishedAt}</span>
            <span className="post-card__dot" aria-hidden="true">
              ·
            </span>
            <span>조회 {post.views}</span>
          </p>
        </div>
        <div className="post-card__thumb">
          <img src={post.thumbnail} alt="" />
        </div>
      </Link>
    </article>
  )
}
