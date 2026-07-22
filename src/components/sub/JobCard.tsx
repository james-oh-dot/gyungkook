import { Link } from 'react-router-dom'
import type { BoardPost } from '../../data/board'

type JobCardProps = {
  post: BoardPost
  detailPath: (tab: string, postId: string) => string
}

/**
 * 채용공고 list card (Figma 99:6092) — title + [직무 | 직책 | 고용형태] on the
 * left, deadline + D-day badge on the right.
 */
export function JobCard({ post, detailPath }: JobCardProps) {
  const meta = post.jobMeta ?? []
  return (
    <article className="job-card" data-name="list">
      <Link
        className="job-card__link"
        to={detailPath(post.tab, post.id)}
        state={{ scrollToLocalTabs: true }}
      >
        <div className="job-card__copy">
          <h2 className="job-card__title">{post.title}</h2>
          <p className="job-card__info">
            {meta.map((m, i) => (
              <span key={m} className="job-card__info-item">
                {i > 0 ? (
                  <span className="job-card__sep" aria-hidden="true" />
                ) : null}
                {m}
              </span>
            ))}
          </p>
        </div>
        <div className="job-card__date">
          {post.deadline ? <span>{post.deadline}</span> : null}
          {post.dday ? <span className="job-card__dday">{post.dday}</span> : null}
        </div>
      </Link>
    </article>
  )
}
