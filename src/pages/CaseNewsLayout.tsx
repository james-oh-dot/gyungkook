import { Outlet } from 'react-router-dom'
import { SubVisual } from '../components/sub/SubVisual'
import { CASE_NEWS_PAGE } from '../data/caseNews'
import {
  LOCAL_TABS_ANCHOR_ID,
  useScrollToLocalTabs,
} from '../hooks/useScrollToLocalTabs'
import './News.css'

/** Shell for 판례뉴스 list + detail (sub-05-01). No LocalTabs — single board. */
export function CaseNewsLayout() {
  useScrollToLocalTabs()
  return (
    <div className="news-board" data-name="SUB_소식공지_판례뉴스">
      <div className="news-board__visual" data-name="SUB_LAYOUT">
        <SubVisual
          parentLabel={CASE_NEWS_PAGE.parentLabel}
          title={CASE_NEWS_PAGE.title}
          image={CASE_NEWS_PAGE.visual}
          imagePreview={CASE_NEWS_PAGE.visualPreview}
          visualKey="sub-05-01"
          showChip={false}
        />
      </div>
      <div id={LOCAL_TABS_ANCHOR_ID} className="news-board__anchor" aria-hidden="true" />
      <div className="news-board__main">
        <Outlet />
      </div>
    </div>
  )
}
