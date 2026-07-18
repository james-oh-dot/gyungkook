import { Navigate, Outlet, useParams } from 'react-router-dom'
import { LocalTabs } from '../components/sub/LocalTabs'
import { SubVisual } from '../components/sub/SubVisual'
import {
  COLUMN_MEDIA_PAGE,
  COLUMN_MEDIA_TABS,
  isColumnMediaTab,
  type ColumnMediaTab,
} from '../data/columnMedia'
import './ColumnMedia.css'

/**
 * Shell for 컬럼·미디어 list + detail.
 * Visual (sub-04-03) + local tabs stay mounted; only the Outlet content swaps.
 */
export function ColumnMediaLayout() {
  const { tab } = useParams<{ tab: string }>()

  if (!isColumnMediaTab(tab)) {
    return <Navigate to={`${COLUMN_MEDIA_PAGE.basePath}/column`} replace />
  }

  const activeTab = tab as ColumnMediaTab

  return (
    <div className="column-media" data-name="SUB_활동보도_컬럼미디어">
      <div className="column-media__top" data-name="SUB_LAYOUT">
        <SubVisual
          parentLabel={COLUMN_MEDIA_PAGE.parentLabel}
          title={COLUMN_MEDIA_PAGE.title}
          image={COLUMN_MEDIA_PAGE.visual}
          visualKey="sub-04-03"
        />
        <LocalTabs tabs={COLUMN_MEDIA_TABS} activeTab={activeTab} />
      </div>
      <div className="column-media__main">
        <Outlet context={{ activeTab }} />
      </div>
    </div>
  )
}
