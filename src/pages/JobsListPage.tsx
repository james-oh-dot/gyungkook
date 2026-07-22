import { JobCard } from '../components/sub/JobCard'
import { JOBS_BOARD, JOBS_FILTERS } from '../data/careers'
import { asset } from '../utils/asset'

const SEARCH_SRC = asset('assets/icon-search.svg')
const CHEVRON_SRC = asset('assets/icon-chevron-down.svg')

/**
 * 채용공고 tab (Figma 99:6085) — search/filter bar + job list.
 * Filters are static UI for now (wire to API later).
 */
export function JobsListPage() {
  const posts = JOBS_BOARD.postsByTab(JOBS_BOARD.defaultTab)
  return (
    <div className="news-board__contents jobs" data-name="Contents">
      <div className="jobs-filter" data-name="여기에검색필터넣어줘">
        <div className="jobs-filter__search">
          <img src={SEARCH_SRC} alt="" />
          <input
            type="search"
            placeholder={JOBS_FILTERS.searchPlaceholder}
            aria-label="채용공고 검색"
          />
        </div>
        {JOBS_FILTERS.selects.map((label) => (
          <button key={label} type="button" className="jobs-filter__select">
            <span>{label}</span>
            <img src={CHEVRON_SRC} alt="" />
          </button>
        ))}
      </div>

      <ul className="jobs-list" data-name="list_wrap" aria-label="채용공고 목록">
        {posts.map((post) => (
          <li key={post.id}>
            <JobCard post={post} detailPath={JOBS_BOARD.detailPath} />
          </li>
        ))}
      </ul>
    </div>
  )
}
