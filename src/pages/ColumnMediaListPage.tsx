import { useParams } from 'react-router-dom'
import { PostListCard } from '../components/sub/PostListCard'
import {
  COLUMN_MEDIA_TABS,
  isColumnMediaTab,
  postsByTab,
} from '../data/columnMedia'

/**
 * Tab list view — 컬럼 / 간행물 / 미디어.
 * Data: `src/data/columnMedia.ts` (swap for API later).
 */
export function ColumnMediaListPage() {
  const { tab } = useParams<{ tab: string }>()
  if (!isColumnMediaTab(tab)) return null

  const tabDef = COLUMN_MEDIA_TABS.find((t) => t.id === tab)!
  const posts = postsByTab(tab)

  return (
    <section className="column-media__list" data-name="Contents" aria-label={`${tabDef.label} 목록`}>
      <div className="column-media__list-wrap" data-name="list_wrap">
        {posts.map((post) => (
          <PostListCard key={post.id} post={post} tabDef={tabDef} />
        ))}
      </div>
    </section>
  )
}
