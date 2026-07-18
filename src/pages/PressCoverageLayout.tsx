import { Navigate, Outlet, useParams } from 'react-router-dom'
import { LocalTabs } from '../components/sub/LocalTabs'
import { SubVisual } from '../components/sub/SubVisual'
import {
  isPressCoverageTab,
  PRESS_COVERAGE_PAGE,
  PRESS_COVERAGE_TABS,
  pressTabListPath,
  type PressCoverageTab,
} from '../data/pressCoverage'
import { useScrollToLocalTabs } from '../hooks/useScrollToLocalTabs'
import './PressCoverage.css'

/**
 * Shell for 언론보도 list + detail.
 * Visual (sub-04-02) + local tabs stay mounted; Outlet swaps list/detail.
 * LocalTabs is a sibling of main content so sticky works under GNB.
 */
export function PressCoverageLayout() {
  const { tab } = useParams<{ tab: string }>()
  useScrollToLocalTabs()

  if (!isPressCoverageTab(tab)) {
    return <Navigate to={`${PRESS_COVERAGE_PAGE.basePath}/tv`} replace />
  }

  const activeTab = tab as PressCoverageTab

  return (
    <div className="press-coverage" data-name="SUB_활동보도_언론보도">
      <div className="press-coverage__visual" data-name="SUB_LAYOUT">
        <SubVisual
          parentLabel={PRESS_COVERAGE_PAGE.parentLabel}
          title={PRESS_COVERAGE_PAGE.title}
          image={PRESS_COVERAGE_PAGE.visual}
          visualKey="sub-04-02"
        />
      </div>
      <LocalTabs
        tabs={PRESS_COVERAGE_TABS}
        activeTab={activeTab}
        toTab={(id) => pressTabListPath(id as PressCoverageTab)}
        ariaLabel="언론보도 로컬 메뉴"
      />
      <div className="press-coverage__main">
        <Outlet context={{ activeTab }} />
      </div>
    </div>
  )
}
