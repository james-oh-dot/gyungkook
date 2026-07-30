import { Link } from 'react-router-dom'
import type { BoardPost, BoardTabDef } from '../../data/board'
import './PressGridCard.css'

type PressGridCardProps = {
  post: BoardPost
  tabDef: BoardTabDef
  detailPath: (tab: string, postId: string) => string
}

/**
 * 4-col grid card (언론보도).
 * Thumb → title → summary → meta → chip (Figma SUB_활동보도_언론보도_*).
 */
export function PressGridCard({ post, tabDef, detailPath }: PressGridCardProps) {
  const to = detailPath(post.tab, post.id)

  return (
    <article className="press-grid-card" data-name="list">
      <Link className="press-grid-card__link" to={to}>
        <div className="press-grid-card__thumb">
          <img src={post.thumbnail} alt="" />
        </div>
        <div className="press-grid-card__copy" data-name="copy">
          <h2 className="press-grid-card__title">{post.title}</h2>
          <p className="press-grid-card__summary">{post.summary}</p>
          <p className="press-grid-card__meta">
            <span>{post.publishedAt}</span>
            <span className="press-grid-card__dot" aria-hidden="true">
              ·
            </span>
            <span>조회 {post.views}</span>
          </p>
          <span className="press-grid-card__chip">{tabDef.chip}</span>
        </div>
      </Link>
    </article>
  )
}
