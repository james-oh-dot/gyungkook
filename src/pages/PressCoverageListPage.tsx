import { useParams } from 'react-router-dom'
import { PressGridCard } from '../components/sub/PressGridCard'
import {
  isPressCoverageTab,
  PRESS_COVERAGE_TABS,
  pressPostDetailPath,
  pressPostsByTab,
} from '../data/pressCoverage'

/**
 * 언론보도 tab list — TV방송 / 보도자료 (4-col card grid).
 * Data: `src/data/pressCoverage.ts`
 */
export function PressCoverageListPage() {
  const { tab } = useParams<{ tab: string }>()
  if (!isPressCoverageTab(tab)) return null

  const tabDef = PRESS_COVERAGE_TABS.find((t) => t.id === tab)!
  const posts = pressPostsByTab(tab)

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
              detailPath={pressPostDetailPath}
            />
          </li>
        ))}
      </ul>
    </section>
  )
}
