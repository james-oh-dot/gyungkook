import { Link } from 'react-router-dom'
import type { BoardPost } from '../../data/board'
import './SocialGridCard.css'

type SocialGridCardProps = {
  post: BoardPost
  detailPath: (tab: string, postId: string) => string
}

/**
 * 사회공헌 grid card (Figma SUB_활동보도_사회공헌_*).
 * Copy on top → thumbnail below (no chip on list card).
 */
export function SocialGridCard({ post, detailPath }: SocialGridCardProps) {
  const to = detailPath(post.tab, post.id)

  return (
    <article className="social-grid-card" data-name="list">
      <Link
        className="social-grid-card__link"
        to={to}
        state={{ scrollToLocalTabs: true }}
      >
        <div className="social-grid-card__copy" data-name="copy">
          <h2 className="social-grid-card__title">{post.title}</h2>
          <p className="social-grid-card__summary">{post.summary}</p>
          <p className="social-grid-card__meta">
            <span>{post.publishedAt}</span>
            <span className="social-grid-card__dot" aria-hidden="true">
              ·
            </span>
            <span>조회 {post.views}</span>
          </p>
        </div>
        <div className="social-grid-card__thumb" data-name="썸네일">
          <img src={post.thumbnail} alt="" />
        </div>
      </Link>
    </article>
  )
}
