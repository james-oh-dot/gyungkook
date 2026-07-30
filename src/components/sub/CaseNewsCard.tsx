import { Link } from 'react-router-dom'
import type { BoardPost } from '../../data/board'

type CaseNewsCardProps = {
  post: BoardPost
  detailPath: (tab: string, postId: string) => string
}

/**
 * 판례뉴스 list card (Figma 99:5804) — full width: [category chip + title] /
 * 3-line body / 출처 / date · 조회. Category chip = per-post (`post.author`).
 */
export function CaseNewsCard({ post, detailPath }: CaseNewsCardProps) {
  return (
    <article className="case-news-card" data-name="list">
      <Link
        className="case-news-card__link"
        to={detailPath(post.tab, post.id)}
        state={{ scrollToLocalTabs: true }}
      >
        <div className="case-news-card__title-row">
          {post.author ? (
            <span className="case-news-card__chip">{post.author}</span>
          ) : null}
          <h2 className="case-news-card__title">{post.title}</h2>
        </div>
        <p className="case-news-card__body">{post.summary}</p>
        {post.source ? (
          <p className="case-news-card__source">{post.source}</p>
        ) : null}
        <p className="case-news-card__meta">
          <span>{post.publishedAt}</span>
          <span className="case-news-card__dot" aria-hidden="true">·</span>
          <span>조회 {post.views}</span>
        </p>
      </Link>
    </article>
  )
}
