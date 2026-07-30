import { BoardTabsLayout } from './BoardTabsLayout'
import { COLUMN_MEDIA_BOARD } from '../data/columnMedia'
import './ColumnMedia.css'

/**
 * Shell for 컬럼·미디어 list + detail (sub-04-03).
 * Structure lives in the shared `BoardTabsLayout`; this wrapper owns the
 * page CSS import + Figma naming (see BoardTabsLayout for the sticky-tabs
 * contract — LocalTabs must stay a sibling of main content).
 */
export function ColumnMediaLayout() {
  return (
    <BoardTabsLayout
      board={COLUMN_MEDIA_BOARD}
      baseClass="column-media"
      dataName="SUB_활동보도_컬럼미디어"
      visualKey="sub-04-03"
      ariaLabel="컬럼 · 미디어 로컬 메뉴"
    />
  )
}
