import './VersionSwitch.css'

type VersionSwitchProps = {
  /** Which design this page currently shows */
  current: 'teal' | 'classic'
}

/**
 * Client comparison switch between the two hero art directions.
 * - teal: current AI-hero-change rebuild (default index)
 * - classic: previous dark hero
 *
 * Uses relative hrefs so GitHub Pages base (`/gyungkook/`) works from either page.
 */
export function VersionSwitch({ current }: VersionSwitchProps) {
  return (
    <aside className="version-switch" aria-label="히어로 시안 전환">
      <p className="version-switch__label">Hero 시안</p>
      <div className="version-switch__links">
        <a
          className={`version-switch__link${current === 'teal' ? ' is-active' : ''}`}
          href="./"
          aria-current={current === 'teal' ? 'page' : undefined}
        >
          A · Teal (현재)
        </a>
        <a
          className={`version-switch__link${current === 'classic' ? ' is-active' : ''}`}
          href="./classic.html"
          aria-current={current === 'classic' ? 'page' : undefined}
        >
          B · Dark (이전)
        </a>
      </div>
    </aside>
  )
}
