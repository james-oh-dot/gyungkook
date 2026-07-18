import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { LocalTabs } from '../components/sub/LocalTabs'
import { SubVisual } from '../components/sub/SubVisual'
import {
  RENEWAL_ADVISORY,
  RENEWAL_EVICTION,
  RENEWAL_EXPROPRIATION,
  RENEWAL_LEVY,
  RENEWAL_OVERVIEW,
  RENEWAL_PAGE,
  RENEWAL_PUBLIC_LAND,
  RENEWAL_SALE,
  RENEWAL_TABS,
  RENEWAL_TRACK_RECORD,
  RENEWAL_TRANSFER,
  type RenewalTabId,
  type WorkSection,
} from '../data/renewal'
import { useScrollGage } from '../hooks/useScrollGage'
import { LOCAL_TABS_ANCHOR_ID } from '../hooks/useScrollToLocalTabs'
import { asset } from '../utils/asset'
import './Renewal.css'

const BULLET_SRC = asset('assets/icon-bullet.svg')
const SAFETY_SRC = asset('assets/icon-safety.svg')

function readGnbBarH(): number {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue('--gnb-bar-h')
    .trim()
  const n = Number.parseFloat(raw)
  return Number.isFinite(n) ? n : 100
}

function readLocalTabsH(): number {
  const el = document.getElementById(LOCAL_TABS_ANCHOR_ID)
  return el?.getBoundingClientRect().height ?? 62
}

function sectionId(id: RenewalTabId): string {
  return `renewal-section-${id}`
}

function BulletTitle({ children }: { children: ReactNode }) {
  return (
    <div className="renewal-bullet-title">
      <img className="renewal-bullet-title__icon" src={BULLET_SRC} alt="" />
      <h3 className="renewal-bullet-title__text">{children}</h3>
    </div>
  )
}

function SectionHead({
  enLabel,
  title,
  titleNote,
}: {
  enLabel: string
  title: string
  titleNote?: string
}) {
  return (
    <div className="renewal-section__head">
      <p className="renewal-section__en">{enLabel}</p>
      <h2 className="renewal-section__title">{title}</h2>
      {titleNote ? <p className="renewal-section__title-note">{titleNote}</p> : null}
    </div>
  )
}

function WorkSectionView({ data }: { data: WorkSection }) {
  return (
    <div className="renewal-split">
      <SectionHead
        enLabel={data.enLabel}
        title={data.title}
        titleNote={data.titleNote}
      />
      <div className="renewal-split__body">
        {data.blocks.map((block) => (
          <div key={block.title} className="renewal-block">
            <BulletTitle>{block.title}</BulletTitle>
            {block.paragraphs?.map((p) => (
              <p key={p.slice(0, 48)} className="renewal-body">
                {p}
              </p>
            ))}
            {block.bullets ? (
              <ul className="renewal-list">
                {block.bullets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
          </div>
        ))}
        {data.notes?.map((note) => (
          <div key={note.slice(0, 40)} className="renewal-note">
            <p className="renewal-body">{note}</p>
          </div>
        ))}
        {data.emphasis ? (
          <div className="renewal-note renewal-note--stack">
            <div className="renewal-emphasis">
              <p className="renewal-emphasis__text">{data.emphasis}</p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

/**
 * Figma Quote Block (miscabeled TAB_명도가처분 → 기타법률자문).
 * Full-viewport horizontal rail + home `press-gage` scrollbar.
 */
function AdvisoryServicesRail() {
  const {
    trackRef,
    gageRef,
    ratio,
    offset,
    active,
    activeHeight,
    setGageHover,
    onGagePointerDown,
  } = useScrollGage({ activeHeight: 20 })

  return (
    <div className="renewal-services" data-name="Quote Block">
      <div
        ref={trackRef}
        className="renewal-services__rail"
        role="list"
        aria-label="기타 법률자문 서비스"
      >
        {RENEWAL_ADVISORY.services.map((svc) => (
          <article
            key={svc.no}
            className="renewal-service-card"
            role="listitem"
          >
            <div className="renewal-service-card__head">
              <span className="renewal-service-card__no">{svc.no}</span>
              <h3 className="renewal-service-card__title">{svc.title}</h3>
            </div>
            <ul className="renewal-service-card__list">
              {svc.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <div
        ref={gageRef}
        className={`press-gage renewal-services__gage${active ? ' is-active' : ''}`}
        style={
          { '--gage-h': `${active ? activeHeight : 2}px` } as CSSProperties
        }
        onMouseEnter={() => setGageHover(true)}
        onMouseLeave={() => setGageHover(false)}
        onPointerDown={onGagePointerDown}
        role="scrollbar"
        aria-orientation="horizontal"
        aria-controls={sectionId('advisory')}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(offset * 100)}
        tabIndex={0}
      >
        <span
          style={{
            width: `${Math.max(8, ratio * 100)}%`,
            transform: `translate3d(${offset * ((1 - ratio) / Math.max(ratio, 0.001)) * 100}%, 0, 0)`,
          }}
        />
      </div>
    </div>
  )
}

/**
 * 재개발 · 보상업무 > 정비사업 (sub-02-01).
 * Scroll-spy local tabs; GNB entry keeps sub-visual at top.
 */
export function RenewalPage() {
  const [activeTab, setActiveTab] = useState<RenewalTabId>('overview')
  const [visibleCount, setVisibleCount] = useState<number>(
    RENEWAL_TRACK_RECORD.initialVisible,
  )
  const scrollingRef = useRef(false)
  const mainRef = useRef<HTMLElement>(null)

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(sectionId(id as RenewalTabId))
    if (!el) return
    scrollingRef.current = true
    setActiveTab(id as RenewalTabId)
    const offset = readGnbBarH() + readLocalTabsH() + 8
    const top = el.getBoundingClientRect().top + window.scrollY - offset
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
    window.setTimeout(() => {
      scrollingRef.current = false
    }, 700)
  }, [])

  useEffect(() => {
    const root = mainRef.current
    if (!root) return
    const nodes = root.querySelectorAll<HTMLElement>('[data-renewal-section]')
    if (!nodes.length) return

    const observe = () => {
      const offset = readGnbBarH() + readLocalTabsH() + 12
      const io = new IntersectionObserver(
        (entries) => {
          if (scrollingRef.current) return
          const visible = entries
            .filter((e) => e.isIntersecting)
            .sort(
              (a, b) =>
                a.boundingClientRect.top - b.boundingClientRect.top,
            )
          const first = visible[0]
          if (!first) return
          const id = first.target.getAttribute('data-renewal-section')
          if (id) setActiveTab(id as RenewalTabId)
        },
        {
          root: null,
          rootMargin: `-${offset}px 0px -55% 0px`,
          threshold: [0, 0.1, 0.25],
        },
      )
      nodes.forEach((n) => io.observe(n))
      return io
    }

    let io = observe()
    const onResize = () => {
      io.disconnect()
      io = observe()
    }
    window.addEventListener('resize', onResize)
    return () => {
      io.disconnect()
      window.removeEventListener('resize', onResize)
    }
  }, [])

  const showMore = () => {
    setVisibleCount((n) =>
      Math.min(n + RENEWAL_TRACK_RECORD.pageSize, RENEWAL_TRACK_RECORD.total),
    )
  }
  const collapse = () => {
    setVisibleCount(RENEWAL_TRACK_RECORD.initialVisible)
  }

  const visibleResults = RENEWAL_TRACK_RECORD.results.slice(0, visibleCount)
  const canShowMore = visibleCount < RENEWAL_TRACK_RECORD.total
  const canCollapse = visibleCount > RENEWAL_TRACK_RECORD.initialVisible

  return (
    <div className="renewal" data-name="SUB_재개발보상업무_정비사업">
      <div className="renewal__visual" data-name="SUB_LAYOUT">
        <SubVisual
          parentLabel={RENEWAL_PAGE.parentLabel}
          title={RENEWAL_PAGE.title}
          image={RENEWAL_PAGE.visual}
          visualKey="sub-02-01"
          showChip={false}
        />
      </div>

      <LocalTabs
        tabs={RENEWAL_TABS}
        activeTab={activeTab}
        onTabSelect={scrollToSection}
        ariaLabel="정비사업 로컬 메뉴"
      />

      <main ref={mainRef} className="renewal__main">
        <div className="renewal__contents">
          {/* —— 정비사업 overview —— */}
          <section
            id={sectionId('overview')}
            data-renewal-section="overview"
            className="renewal-section"
            aria-label="정비사업"
          >
            <div className="renewal-split">
              <SectionHead
                enLabel={RENEWAL_OVERVIEW.enLabel}
                title={RENEWAL_OVERVIEW.title}
              />
              <div className="renewal-split__body renewal-split__body--laws">
                {RENEWAL_OVERVIEW.laws.map((law) => (
                  <article key={law.title} className="renewal-law">
                    <div className="renewal-law__badge">{law.badge}</div>
                    <h3 className="renewal-law__title">{law.title}</h3>
                    <p className="renewal-law__quote">{law.quote}</p>
                    <div className="renewal-law__divider" aria-hidden="true" />
                    <div className="renewal-law__body">
                      {law.body.map((line) => (
                        <p key={line.slice(0, 40)}>{line}</p>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="renewal-types" aria-label="정비사업 유형">
              {RENEWAL_OVERVIEW.types.map((card) => (
                <article key={card.title} className="renewal-type-card">
                  <h3 className="renewal-type-card__title">{card.title}</h3>
                  <p className="renewal-type-card__body">{card.body}</p>
                </article>
              ))}
            </div>

            <div className="renewal-split">
              <div className="renewal-section__head renewal-section__head--spacer" aria-hidden="true" />
              <div className="renewal-split__body">
                <div className="renewal-block">
                  <BulletTitle>{RENEWAL_OVERVIEW.compare.title}</BulletTitle>
                  <p className="renewal-body">{RENEWAL_OVERVIEW.compare.lead}</p>
                </div>
                <div className="renewal-table-wrap">
                  <table className="renewal-table">
                    <thead>
                      <tr>
                        <th scope="col" className="renewal-table__label">
                          구분
                        </th>
                        {RENEWAL_OVERVIEW.compare.columns.map((col) => (
                          <th key={col} scope="col" className="renewal-table__col-head">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {RENEWAL_OVERVIEW.compare.rows.map((row) => (
                        <tr key={row.label}>
                          <th scope="row" className="renewal-table__label">
                            {row.label}
                          </th>
                          <td className="renewal-table__cell">
                            {row.redevelopment.split('\n').map((line) => (
                              <span key={line} className="renewal-table__line">
                                {line}
                              </span>
                            ))}
                          </td>
                          <td className="renewal-table__cell">
                            {row.reconstruction.split('\n').map((line) => (
                              <span key={line} className="renewal-table__line">
                                {line}
                              </span>
                            ))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="renewal-split">
              <div className="renewal-section__head renewal-section__head--spacer" aria-hidden="true" />
              <div className="renewal-split__body">
                <div className="renewal-block">
                  <BulletTitle>{RENEWAL_OVERVIEW.procedure.title}</BulletTitle>
                  <div className="renewal-body">
                    {RENEWAL_OVERVIEW.procedure.lead.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                </div>
                <ol className="renewal-procedure" aria-label="재개발 · 재건축 절차">
                  {RENEWAL_OVERVIEW.procedure.steps.map((step) =>
                    step.kind === 'highlight' ? (
                      <li
                        key={`hl-${step.label}`}
                        className="renewal-procedure__item is-highlight"
                      >
                        <span className="renewal-procedure__front">
                          <span className="renewal-procedure__icon is-safety" aria-hidden="true">
                            <img src={SAFETY_SRC} alt="" />
                          </span>
                          <span className="renewal-procedure__label">{step.label}</span>
                        </span>
                        <span className="renewal-procedure__note">{step.note}</span>
                      </li>
                    ) : (
                      <li key={step.number} className="renewal-procedure__item">
                        <span className="renewal-procedure__icon" aria-hidden="true">
                          {step.number}
                        </span>
                        <span className="renewal-procedure__label">{step.label}</span>
                      </li>
                    ),
                  )}
                </ol>
              </div>
            </div>
          </section>

          <section
            id={sectionId('eviction')}
            data-renewal-section="eviction"
            className="renewal-section"
            aria-label="명도 ·가처분"
          >
            <WorkSectionView data={RENEWAL_EVICTION} />
          </section>

          <section
            id={sectionId('sale')}
            data-renewal-section="sale"
            className="renewal-section"
            aria-label="매도청구"
          >
            <WorkSectionView data={RENEWAL_SALE} />
          </section>

          <section
            id={sectionId('expropriation')}
            data-renewal-section="expropriation"
            className="renewal-section"
            aria-label="수용재결"
          >
            <WorkSectionView data={RENEWAL_EXPROPRIATION} />
          </section>

          <section
            id={sectionId('transfer')}
            data-renewal-section="transfer"
            className="renewal-section"
            aria-label="이전고시.등기"
          >
            <WorkSectionView data={RENEWAL_TRANSFER} />
          </section>

          <section
            id={sectionId('levy')}
            data-renewal-section="levy"
            className="renewal-section"
            aria-label="원인자부담금"
          >
            <div className="renewal-split">
              <SectionHead
                enLabel={RENEWAL_LEVY.enLabel}
                title={RENEWAL_LEVY.title}
              />
              <div className="renewal-split__body">
                <div className="renewal-block">
                  <BulletTitle>{RENEWAL_LEVY.overview.title}</BulletTitle>
                  {RENEWAL_LEVY.overview.paragraphs.map((p) => (
                    <p key={p.slice(0, 40)} className="renewal-body">
                      {p}
                    </p>
                  ))}
                </div>
                <div className="renewal-block">
                  <BulletTitle>{RENEWAL_LEVY.workTitle}</BulletTitle>
                  {RENEWAL_LEVY.workGroups.map((group, gi) => (
                    <div key={group.title} className="renewal-levy-group">
                      <p className="renewal-levy-group__title">
                        <span className="renewal-levy-group__no">{gi + 1}.</span>{' '}
                        {group.title}
                      </p>
                      <ul className="renewal-list">
                        {group.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                {RENEWAL_LEVY.notes.map((note, i) => (
                  <div
                    key={note.slice(0, 40)}
                    className={`renewal-note${i === 1 ? ' renewal-note--stack' : ''}`}
                  >
                    <p className="renewal-body">{note}</p>
                    {i === 1 ? (
                      <div className="renewal-emphasis">
                        <p className="renewal-emphasis__text">
                          {RENEWAL_LEVY.emphasis}
                        </p>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section
            id={sectionId('publicLand')}
            data-renewal-section="publicLand"
            className="renewal-section"
            aria-label="국공유지"
          >
            <WorkSectionView data={RENEWAL_PUBLIC_LAND} />
          </section>

          <section
            id={sectionId('advisory')}
            data-renewal-section="advisory"
            className="renewal-section renewal-section--advisory"
            aria-label="기타법률자문"
          >
            <div className="renewal-split">
              <SectionHead
                enLabel={RENEWAL_ADVISORY.enLabel}
                title={RENEWAL_ADVISORY.title}
              />
              <div className="renewal-split__body">
                <p className="renewal-body">{RENEWAL_ADVISORY.intro}</p>
                <div className="renewal-note">
                  <p className="renewal-body">{RENEWAL_ADVISORY.note}</p>
                </div>
              </div>
            </div>

            <AdvisoryServicesRail />
          </section>

          <section
            id={sectionId('trackRecord')}
            data-renewal-section="trackRecord"
            className="renewal-section"
            aria-label="정비사업실적"
          >
            <div className="renewal-split">
              <SectionHead
                enLabel={RENEWAL_TRACK_RECORD.enLabel}
                title={RENEWAL_TRACK_RECORD.titleLines.join('\n')}
              />
              <div className="renewal-split__body">
                {RENEWAL_TRACK_RECORD.intro.map((p) => (
                  <p key={p.slice(0, 48)} className="renewal-body">
                    {p}
                  </p>
                ))}
              </div>
            </div>

            <div className="renewal-quotes" aria-label="경국 약속">
              {RENEWAL_TRACK_RECORD.quotes.map((q) => (
                <p key={q.slice(0, 32)} className="renewal-quotes__item">
                  {q.split('\n').map((line) => (
                    <span key={line} className="renewal-quotes__line">
                      {line}
                    </span>
                  ))}
                </p>
              ))}
            </div>

            <div className="renewal-split">
              <SectionHead
                enLabel={RENEWAL_TRACK_RECORD.resultsLabel}
                title={RENEWAL_TRACK_RECORD.resultsTitle}
              />
              <div className="renewal-split__body">
                <ul className="renewal-results" aria-label="정비사업 실적 목록">
                  {visibleResults.map((item) => (
                    <li key={item.id} className="renewal-result-card">
                      <span className="renewal-result-card__cat">
                        {item.category}
                      </span>
                      <p className="renewal-result-card__result">{item.result}</p>
                    </li>
                  ))}
                </ul>
                <div className="renewal-results__actions">
                  {canCollapse ? (
                    <button
                      type="button"
                      className="renewal-results__btn"
                      onClick={collapse}
                    >
                      접기
                      <span className="renewal-results__chev is-up" aria-hidden="true" />
                    </button>
                  ) : null}
                  {canShowMore ? (
                    <button
                      type="button"
                      className="renewal-results__btn"
                      onClick={showMore}
                    >
                      실적 더보기
                      <span className="renewal-results__count">
                        {visibleCount}/{RENEWAL_TRACK_RECORD.total}
                      </span>
                      <span className="renewal-results__chev" aria-hidden="true" />
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
