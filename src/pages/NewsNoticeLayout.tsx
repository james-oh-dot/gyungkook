import { Outlet } from 'react-router-dom'
import { SubVisual } from '../components/sub/SubVisual'
import { NEWS_NOTICE_PAGE } from '../data/newsNotice'
import {
  LOCAL_TABS_ANCHOR_ID,
  useScrollToLocalTabs,
} from '../hooks/useScrollToLocalTabs'
import './News.css'

/**
 * Shell for 소식공지 list + detail (sub-05-01). No LocalTabs — single board.
 * Anchor keeps detail scroll under the GNB (same as 사회공헌).
 */
export function NewsNoticeLayout() {
  useScrollToLocalTabs()
  return (
    <div className="news-board" data-name="SUB_소식공지_소식공지">
      <div className="news-board__visual" data-name="SUB_LAYOUT">
        <SubVisual
          parentLabel={NEWS_NOTICE_PAGE.parentLabel}
          title={NEWS_NOTICE_PAGE.title}
          image={NEWS_NOTICE_PAGE.visual}
          imagePreview={NEWS_NOTICE_PAGE.visualPreview}
          visualKey="sub-05-01"
        />
      </div>
      <div id={LOCAL_TABS_ANCHOR_ID} className="news-board__anchor" aria-hidden="true" />
      <div className="news-board__main">
        <Outlet />
      </div>
    </div>
  )
}
