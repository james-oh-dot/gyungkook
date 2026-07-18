import { Link } from 'react-router-dom'
import type { ColumnMediaPost, ColumnMediaTabDef } from '../../data/columnMedia'
import { postDetailPath, tabListPath } from '../../data/columnMedia'
import './PostDetail.css'

type PostDetailProps = {
  post: ColumnMediaPost
  tabDef: ColumnMediaTabDef
  prev?: ColumnMediaPost
  next?: ColumnMediaPost
}

/**
 * Shared post detail layout (Figma: SUB_게시글_상세_*).
 * Used when a list thumbnail/card is opened — keep this layout generic
 * so other board types can reuse it later with the same props shape.
 */
export function PostDetail({ post, tabDef, prev, next }: PostDetailProps) {
  const image = post.detailImage ?? post.thumbnail
  const listTo = tabListPath(post.tab)

  return (
    <div className="post-detail" data-name="SUB_게시글_상세">
      <article className="post-detail__card" data-name="list">
        <header className="post-detail__header">
          <div className="post-detail__title-row">
            <span className="post-detail__chip">{tabDef.chip}</span>
            <h1 className="post-detail__title">{post.title}</h1>
          </div>
          <p className="post-detail__meta">
            <span>{post.publishedAt}</span>
            <span className="post-detail__dot" aria-hidden="true">
              ·
            </span>
            <span>조회 {post.views}</span>
          </p>
        </header>

        <div className="post-detail__body" data-name="object_frame">
          <figure className="post-detail__figure">
            <img src={image} alt="" />
          </figure>
          <div className="post-detail__prose">
            {post.body.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
            {/* CMS: render rich HTML here instead of plain paragraphs */}
            <p className="post-detail__copyright">
              저작권자 © 법무법인 경국 / 무단전재 및 재배포, AI학습 및 활용 금지
            </p>
          </div>
        </div>
      </article>

      <div className="post-detail__nav" data-name="btn">
        {next ? (
          <Link className="post-detail__adj" to={postDetailPath(next.tab, next.id)}>
            <span className="post-detail__adj-icon" aria-hidden="true">
              ↑
            </span>
            <span className="post-detail__adj-label">다음</span>
            <span className="post-detail__adj-title">{next.title}</span>
          </Link>
        ) : null}
        {prev ? (
          <Link className="post-detail__adj" to={postDetailPath(prev.tab, prev.id)}>
            <span className="post-detail__adj-icon" aria-hidden="true">
              ↓
            </span>
            <span className="post-detail__adj-label">이전</span>
            <span className="post-detail__adj-title">{prev.title}</span>
          </Link>
        ) : null}
        <Link className="post-detail__list-btn" to={listTo}>
          목록으로
        </Link>
      </div>
    </div>
  )
}
