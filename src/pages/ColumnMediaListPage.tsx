import { useParams } from 'react-router-dom'
import { PostListCard } from '../components/sub/PostListCard'
import { COLUMN_MEDIA_BOARD } from '../data/columnMedia'

/**
 * Tab list view — 컬럼 / 간행물 / 미디어.
 * Data: `COLUMN_MEDIA_BOARD` (src/data/columnMedia.ts — swap for API later)
 */
export function ColumnMediaListPage() {
  const { tab } = useParams<{ tab: string }>()
  if (!COLUMN_MEDIA_BOARD.isTab(tab) || tab === undefined) return null

  const tabDef = COLUMN_MEDIA_BOARD.tabs.find((t) => t.id === tab)
  if (!tabDef) return null
  const posts = COLUMN_MEDIA_BOARD.postsByTab(tab)

  return (
    <section className="column-media__list" data-name="Contents" aria-label={`${tabDef.label} 목록`}>
      <div className="column-media__list-wrap" data-name="list_wrap">
        {posts.map((post) => (
          <PostListCard
            key={post.id}
            post={post}
            tabDef={tabDef}
            detailPath={COLUMN_MEDIA_BOARD.detailPath}
          />
        ))}
      </div>
    </section>
  )
}
