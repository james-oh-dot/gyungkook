import { NoticeCard } from '../components/sub/NoticeCard'
import { NEWS_NOTICE_BOARD } from '../data/newsNotice'

/** 소식공지 list — 2-col cards (Figma 99:5700). */
export function NewsNoticeListPage() {
  const posts = NEWS_NOTICE_BOARD.postsByTab(NEWS_NOTICE_BOARD.defaultTab)
  return (
    <div className="news-board__contents" data-name="Contents">
      <ul className="news-notice-grid" data-name="list_wrap" aria-label="소식공지 목록">
        {posts.map((post) => (
          <li key={post.id}>
            <NoticeCard post={post} detailPath={NEWS_NOTICE_BOARD.detailPath} />
          </li>
        ))}
      </ul>
    </div>
  )
}
