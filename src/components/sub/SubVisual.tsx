import { ProgressiveImage } from '../ProgressiveImage'
import './SubVisual.css'

type SubVisualProps = {
  /** Parent menu chip — e.g. 활동 · 보도 */
  parentLabel: string
  /** Page title — e.g. 컬럼 · 미디어 */
  title: string
  /** High-quality background image URL (already `asset()`-prefixed) */
  image: string
  /**
   * Tiny blur-up preview URL. Required for progressive LCP paint —
   * generate via `scripts/generate-progressive-images.py`.
   */
  imagePreview: string
  /** Figma layer name for future agents (e.g. sub-04-03) */
  visualKey?: string
  /**
   * Show parent chip above title.
   * Figma `hero_type2` (e.g. 정비사업) has no chip — pass `false`.
   */
  showChip?: boolean
}

/**
 * Shared sub-page hero (SUB_LAYOUT visual).
 * Uses progressive blur-up so the frame fills on entry, then sharpens.
 */
export function SubVisual({
  parentLabel,
  title,
  image,
  imagePreview,
  visualKey,
  showChip = true,
}: SubVisualProps) {
  return (
    <section
      className="sub-visual"
      data-name={visualKey ?? 'sub-visual'}
      data-header-theme="dark"
      aria-label={`${parentLabel} ${title}`}
    >
      <div className="sub-visual__media" aria-hidden="true">
        <ProgressiveImage
          className="progressive-image--fill sub-visual__progressive"
          imgClassName="sub-visual__img"
          src={image}
          preview={imagePreview}
          alt=""
          priority
        />
        <div className="sub-visual__scrim" />
      </div>
      <div className="sub-visual__copy">
        {showChip ? <span className="sub-visual__chip">{parentLabel}</span> : null}
        <h1 className="sub-visual__title">{title}</h1>
      </div>
    </section>
  )
}
