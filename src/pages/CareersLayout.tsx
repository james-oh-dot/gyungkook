import { Outlet, useLocation } from 'react-router-dom'
import { LocalTabs } from '../components/sub/LocalTabs'
import { SubVisual } from '../components/sub/SubVisual'
import { CAREERS_PAGE, CAREERS_TABS } from '../data/careers'
import { useScrollToLocalTabs } from '../hooks/useScrollToLocalTabs'
import './News.css'

/**
 * Shell for 인재영입 (sub-05-01) — route-mode local tabs (인재영입 / 채용공고).
 * 인재영입 = info page (`/news/careers`); 채용공고 = board (`/news/careers/jobs`).
 * LocalTabs owns the sticky anchor; Outlet swaps the two tab pages.
 */
export function CareersLayout() {
  useScrollToLocalTabs()
  const { pathname } = useLocation()
  const activeTab = pathname.includes('/news/careers/jobs') ? 'jobs' : 'careers'
  const toTab = (id: string) =>
    id === 'jobs' ? '/news/careers/jobs' : '/news/careers'

  return (
    <div className="news-board careers" data-name="SUB_소식공지_인재영입">
      <div className="news-board__visual" data-name="SUB_LAYOUT">
        <SubVisual
          parentLabel={CAREERS_PAGE.parentLabel}
          title={CAREERS_PAGE.title}
          image={CAREERS_PAGE.visual}
          imagePreview={CAREERS_PAGE.visualPreview}
          visualKey="sub-05-01"
        />
      </div>
      <LocalTabs
        tabs={CAREERS_TABS}
        activeTab={activeTab}
        toTab={toTab}
        ariaLabel="인재영입 로컬 메뉴"
      />
      <div className="news-board__main">
        <Outlet />
      </div>
    </div>
  )
}
