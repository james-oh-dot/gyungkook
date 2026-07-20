import { BoardTabsLayout } from './BoardTabsLayout'
import { PRESS_COVERAGE_BOARD } from '../data/pressCoverage'
import './PressCoverage.css'

/**
 * Shell for 언론보도 list + detail (sub-04-02).
 * Structure lives in the shared `BoardTabsLayout`; this wrapper owns the
 * page CSS import + Figma naming (see BoardTabsLayout for the sticky-tabs
 * contract — LocalTabs must stay a sibling of main content).
 */
export function PressCoverageLayout() {
  return (
    <BoardTabsLayout
      board={PRESS_COVERAGE_BOARD}
      baseClass="press-coverage"
      dataName="SUB_활동보도_언론보도"
      visualKey="sub-04-02"
      ariaLabel="언론보도 로컬 메뉴"
    />
  )
}
