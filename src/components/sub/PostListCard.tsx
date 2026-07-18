import { Link } from 'react-router-dom'
import type { ColumnMediaPost, ColumnMediaTabDef } from '../../data/columnMedia'
import { postDetailPath } from '../../data/columnMedia'
import './PostListCard.css'

type PostListCardProps = {
  post: ColumnMediaPost
  tabDef: ColumnMediaTabDef
}

/**
 * List row for 컬럼 / 간행물 / 미디어.
 * Clicking the card (or thumbnail) enters the shared post-detail layout.
 */
export function PostListCard({ post, tabDef }: PostListCardProps) {
  const to = postDetailPath(post.tab, post.id)

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
          <p className="post-card__author">{post.author}</p>
          <p className="post-card__meta">
            <span>{post.publishedAt}</span>
            <span className="post-card__dot" aria-hidden="true">
              ·
            </span>
            <span>조회 {post.views}</span>
          </p>
        </div>
        <div className={`post-card__thumb post-card__thumb--${post.tab}`}>
          <img src={post.thumbnail} alt="" />
        </div>
      </Link>
    </article>
  )
}
