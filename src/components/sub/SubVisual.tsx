import './SubVisual.css'

type SubVisualProps = {
  /** Parent menu chip — e.g. 활동 · 보도 */
  parentLabel: string
  /** Page title — e.g. 컬럼 · 미디어 */
  title: string
  /** Background image URL (already `asset()`-prefixed) */
  image: string
  /** Figma layer name for future agents (e.g. sub-04-03) */
  visualKey?: string
}

/**
 * Shared sub-page hero (SUB_LAYOUT visual).
 * Same chrome for list + detail under a menu family.
 */
export function SubVisual({ parentLabel, title, image, visualKey }: SubVisualProps) {
  return (
    <section
      className="sub-visual"
      data-name={visualKey ?? 'sub-visual'}
      aria-label={`${parentLabel} ${title}`}
    >
      <div className="sub-visual__media" aria-hidden="true">
        <img className="sub-visual__img" src={image} alt="" />
        <div className="sub-visual__scrim" />
      </div>
      <div className="sub-visual__copy">
        <span className="sub-visual__chip">{parentLabel}</span>
        <h1 className="sub-visual__title">{title}</h1>
      </div>
    </section>
  )
}
