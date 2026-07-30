import { Link } from 'react-router-dom'
import type { BoardPost } from '../../data/board'

type NoticeCardProps = {
  post: BoardPost
  detailPath: (tab: string, postId: string) => string
}

/**
 * 소식공지 list card (Figma 99:5702) — title / divider / 3-line body / date · 조회.
 * Two per row on desktop.
 */
export function NoticeCard({ post, detailPath }: NoticeCardProps) {
  return (
    <article className="news-notice-card" data-name="list">
      <Link
        className="news-notice-card__link"
        to={detailPath(post.tab, post.id)}
        state={{ scrollToLocalTabs: true }}
      >
        <h2 className="news-notice-card__title">{post.title}</h2>
        <span className="news-notice-card__divider" aria-hidden="true" />
        <p className="news-notice-card__body">{post.summary}</p>
        <p className="news-notice-card__meta">
          <span>{post.publishedAt}</span>
          <span className="news-notice-card__dot" aria-hidden="true">·</span>
          <span>조회 {post.views}</span>
        </p>
      </Link>
    </article>
  )
}
