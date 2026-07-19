import { SubVisual } from '../components/sub/SubVisual'
import {
  PLACEHOLDER_PAGES,
  PLACEHOLDER_VISUAL_PREVIEW,
  PLACEHOLDER_VISUAL_SRC,
} from '../data/placeholderPages'
import './PlaceholderPage.css'

type PlaceholderPageProps = {
  pageId: keyof typeof PLACEHOLDER_PAGES
}

/**
 * Temporary subpage shell until real content is designed.
 * Sub visual = sub-01-01 (1번 비주얼); body = “곧 업데이트예정”.
 */
export function PlaceholderPage({ pageId }: PlaceholderPageProps) {
  const page = PLACEHOLDER_PAGES[pageId]

  return (
    <div className="placeholder-page" data-name={`SUB_${page.title}`}>
      <div className="placeholder-page__visual" data-name="SUB_LAYOUT">
        <SubVisual
          parentLabel={page.parentLabel}
          title={page.title}
          image={PLACEHOLDER_VISUAL_SRC}
          imagePreview={PLACEHOLDER_VISUAL_PREVIEW}
          visualKey="sub-01-01"
          showChip={page.showChip}
        />
      </div>
      <div className="placeholder-page__main">
        <p className="placeholder-page__message">곧 업데이트예정</p>
      </div>
    </div>
  )
}
