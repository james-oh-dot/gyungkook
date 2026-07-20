import { useParams } from 'react-router-dom'
import { PressGridCard } from '../components/sub/PressGridCard'
import { PRESS_COVERAGE_BOARD } from '../data/pressCoverage'

/**
 * 언론보도 tab list — TV방송 / 보도자료 (4-col card grid).
 * Data: `PRESS_COVERAGE_BOARD` (src/data/pressCoverage.ts — swap for API later)
 */
export function PressCoverageListPage() {
  const { tab } = useParams<{ tab: string }>()
  if (!PRESS_COVERAGE_BOARD.isTab(tab) || tab === undefined) return null

  const tabDef = PRESS_COVERAGE_BOARD.tabs.find((t) => t.id === tab)
  if (!tabDef) return null
  const posts = PRESS_COVERAGE_BOARD.postsByTab(tab)

  return (
    <section
      className="press-coverage__list"
      data-name="Contents"
      aria-label={`${tabDef.label} 목록`}
    >
      <ul className="press-coverage__grid" data-name="list_wrap">
        {posts.map((post) => (
          <li key={post.id}>
            <PressGridCard
              post={post}
              tabDef={tabDef}
              detailPath={PRESS_COVERAGE_BOARD.detailPath}
            />
          </li>
        ))}
      </ul>
    </section>
  )
}
