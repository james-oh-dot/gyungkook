import { Navigate, Outlet, useParams } from 'react-router-dom'
import { LocalTabs } from '../components/sub/LocalTabs'
import { SubVisual } from '../components/sub/SubVisual'
import {
  COLUMN_MEDIA_PAGE,
  COLUMN_MEDIA_TABS,
  isColumnMediaTab,
  tabListPath,
  type ColumnMediaTab,
} from '../data/columnMedia'
import { useScrollToLocalTabs } from '../hooks/useScrollToLocalTabs'
import './ColumnMedia.css'

/**
 * Shell for 컬럼·미디어 list + detail.
 * Visual (sub-04-03) + local tabs stay mounted; only the Outlet content swaps.
 * Scroll-to-tabs: local tab clicks + detail entry / prev·next.
 * GNB/menu entry keeps the sub-visual at top.
 *
 * LocalTabs is a direct child of `.column-media` (not wrapped with the hero)
 * so `position: sticky` can pin under the GNB through the main content.
 */
export function ColumnMediaLayout() {
  const { tab } = useParams<{ tab: string }>()
  useScrollToLocalTabs()

  if (!isColumnMediaTab(tab)) {
    return <Navigate to={`${COLUMN_MEDIA_PAGE.basePath}/column`} replace />
  }

  const activeTab = tab as ColumnMediaTab

  return (
    <div className="column-media" data-name="SUB_활동보도_컬럼미디어">
      <div className="column-media__visual" data-name="SUB_LAYOUT">
        <SubVisual
          parentLabel={COLUMN_MEDIA_PAGE.parentLabel}
          title={COLUMN_MEDIA_PAGE.title}
          image={COLUMN_MEDIA_PAGE.visual}
          visualKey="sub-04-03"
        />
      </div>
      <LocalTabs
        tabs={COLUMN_MEDIA_TABS}
        activeTab={activeTab}
        toTab={(id) => tabListPath(id as ColumnMediaTab)}
        ariaLabel="컬럼 · 미디어 로컬 메뉴"
      />
      <div className="column-media__main">
        <Outlet context={{ activeTab }} />
      </div>
    </div>
  )
}
