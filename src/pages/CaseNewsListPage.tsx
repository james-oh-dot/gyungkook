import { CaseNewsCard } from '../components/sub/CaseNewsCard'
import { CASE_NEWS_BOARD } from '../data/caseNews'

/** 판례뉴스 list — full-width chip cards (Figma 99:5802). */
export function CaseNewsListPage() {
  const posts = CASE_NEWS_BOARD.postsByTab(CASE_NEWS_BOARD.defaultTab)
  return (
    <div className="news-board__contents" data-name="Contents">
      <ul className="case-news-list" data-name="list_wrap" aria-label="판례뉴스 목록">
        {posts.map((post) => (
          <li key={post.id}>
            <CaseNewsCard post={post} detailPath={CASE_NEWS_BOARD.detailPath} />
          </li>
        ))}
      </ul>
    </div>
  )
}
