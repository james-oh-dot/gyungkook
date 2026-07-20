import { Navigate, Outlet, useParams } from 'react-router-dom'
import { LocalTabs } from '../components/sub/LocalTabs'
import { SubVisual } from '../components/sub/SubVisual'
import type { BoardModule } from '../data/board'
import { useScrollToLocalTabs } from '../hooks/useScrollToLocalTabs'

type BoardTabsLayoutProps = {
  board: BoardModule
  /** BEM block for page CSS scoping (e.g. `column-media`, `press-coverage`) */
  baseClass: string
  /** Figma frame name for the root `data-name` (QA / Figma tracing) */
  dataName: string
  /** SubVisual key (e.g. `sub-04-03`) */
  visualKey: string
  ariaLabel: string
}

/**
 * Generic shell for tabbed boards: SubVisual + LocalTabs + Outlet.
 *
 * 근거: ColumnMediaLayout / PressCoverageLayout이 클래스명·데이터만 다른
 * 동일 구조였다. 페이지별 CSS와 data-name은 wrapper가 주입한다
 * (CSS import는 정적이라 제네릭에서 조건부 불가 — wrapper가 담당).
 *
 * 구조 계약 (AGENTS.md — do not regress):
 * - LocalTabs는 히어로와 wrap되지 않고 main의 **형제**여야
 *   `position: sticky`가 GNB 아래에 고정된다.
 * - visual + tabs는 마운트 유지, Outlet만 list/detail 교체.
 * - 사회공헌(단일 보드, anchor + showChip=false)은 이 shell을 쓰지 않는다
 *   — SocialContributionLayout 참고.
 */
export function BoardTabsLayout({
  board,
  baseClass,
  dataName,
  visualKey,
  ariaLabel,
}: BoardTabsLayoutProps) {
  const { tab } = useParams<{ tab: string }>()
  useScrollToLocalTabs()

  if (!board.isTab(tab) || tab === undefined) {
    return <Navigate to={board.listPath(board.defaultTab)} replace />
  }

  return (
    <div className={baseClass} data-name={dataName}>
      <div className={`${baseClass}__visual`} data-name="SUB_LAYOUT">
        <SubVisual
          parentLabel={board.page.parentLabel}
          title={board.page.title}
          image={board.page.visual}
          imagePreview={board.page.visualPreview}
          visualKey={visualKey}
        />
      </div>
      <LocalTabs
        tabs={board.tabs}
        activeTab={tab}
        toTab={(id) => board.listPath(id)}
        ariaLabel={ariaLabel}
      />
      <div className={`${baseClass}__main`}>
        <Outlet context={{ activeTab: tab }} />
      </div>
    </div>
  )
}
