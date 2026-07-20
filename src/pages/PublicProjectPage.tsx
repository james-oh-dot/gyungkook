import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { LocalTabs } from '../components/sub/LocalTabs'
import { SubVisual } from '../components/sub/SubVisual'
import {
  buildResults,
  PUBLIC_COMPENSATION,
  PUBLIC_OVERVIEW,
  PUBLIC_PROJECT_PAGE,
  PUBLIC_PROCEDURE,
  PUBLIC_RECORD_1,
  PUBLIC_RECORD_2,
  PUBLIC_TABS,
  type FlowStep,
  type ProcedureFlow,
  type PublicTabId,
  type ResultSection,
  type RightsCard,
  type WorkBlock,
} from '../data/publicProject'
import { LOCAL_TABS_ANCHOR_ID } from '../hooks/useScrollToLocalTabs'
import { asset } from '../utils/asset'
import '../pages/Renewal.css'
import './PublicProject.css'

const BULLET_SRC = asset('assets/icon-bullet.svg')
const QUOT_SRC = asset('assets/renewal/quot.svg')

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

function sectionId(id: PublicTabId): string {
  return `public-section-${id}`
}

function SectionHead({
  enLabel,
  title,
}: {
  enLabel: string
  title: ReactNode
}) {
  return (
    <div className="renewal-section__head">
      <p className="renewal-section__en">{enLabel}</p>
      <h2 className="renewal-section__title">{title}</h2>
    </div>
  )
}

function BulletTitle({ children }: { children: ReactNode }) {
  return (
    <div className="renewal-bullet-title">
      <img className="renewal-bullet-title__icon" src={BULLET_SRC} alt="" />
      <h3 className="renewal-bullet-title__text">{children}</h3>
    </div>
  )
}

function WorkBlockView({ data }: { data: WorkBlock }) {
  return (
    <div className="renewal-block">
      <BulletTitle>{data.title}</BulletTitle>
      <ul className="renewal-list">
        {data.bullets.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  )
}

function Quotes({ quotes }: { quotes: string[] }) {
  return (
    <div className="renewal-quotes" aria-label="경국 약속" data-name="특징">
      <img
        className="renewal-quotes__mark"
        src={QUOT_SRC}
        alt=""
        width={301}
        height={242}
      />
      {quotes.map((q) => (
        <p key={q.slice(0, 32)} className="renewal-quotes__item">
          {q.split('\n').map((line) => (
            <span key={line} className="renewal-quotes__line">
              {line}
            </span>
          ))}
        </p>
      ))}
    </div>
  )
}

/** 실적 grid with show-more / collapse (Figma 15/47 dropdown). */
function ResultsBlock({
  section,
  prefix,
}: {
  section: ResultSection
  prefix: string
}) {
  const [visibleCount, setVisibleCount] = useState(section.initialVisible)
  const results = buildResults(section, prefix)
  const visible = results.slice(0, visibleCount)
  const canShowMore = visibleCount < section.total
  const canCollapse = visibleCount > section.initialVisible

  return (
    <div className="renewal-split">
      <SectionHead
        enLabel={section.enLabel}
        title={section.titleLines.join('\n')}
      />
      <div className="renewal-split__body">
        <div className="renewal-results-wrap">
          <ul className="renewal-results" aria-label={`${section.titleLines.join(' ')} 목록`}>
            {visible.map((item) => (
              <li key={item.id} className="renewal-result-card">
                <span className="renewal-result-card__cat">{item.category}</span>
                <p className="renewal-result-card__result">{item.result}</p>
              </li>
            ))}
          </ul>
          <div className="renewal-results__actions">
            {canCollapse ? (
              <button
                type="button"
                className="renewal-results__btn"
                onClick={() => setVisibleCount(section.initialVisible)}
              >
                접기
                <span className="renewal-results__chev is-up" aria-hidden="true" />
              </button>
            ) : null}
            {canShowMore ? (
              <button
                type="button"
                className="renewal-results__btn"
                onClick={() =>
                  setVisibleCount((n) => Math.min(n + section.pageSize, section.total))
                }
              >
                실적 더보기
                <span className="renewal-results__count">
                  {visibleCount}/{section.total}
                </span>
                <span className="renewal-results__chev" aria-hidden="true" />
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

/** One procedure step card (square, sharp-rect). Shared by all rows. */
function StepCard({ step }: { step: FlowStep }) {
  return (
    <div className="pp-step">
      <div className="pp-step__head">
        <span className="pp-step__no" aria-hidden="true">
          {step.no}
        </span>
        <h4 className="pp-step__title">
          {step.title}
          {step.subtitle ? (
            <span className="pp-step__sub">{step.subtitle}</span>
          ) : null}
        </h4>
      </div>
      {step.bullets.length ? (
        <ul className="pp-step__list">
          {step.bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      ) : null}
      {step.note ? (
        <p className="pp-step__note">
          <span aria-hidden="true">※</span> {step.note}
        </p>
      ) : null}
    </div>
  )
}

/**
 * 손실보상절차 flowchart (Figma). Desktop: steps 1–3 row → 협의 결정 → step 4 →
 * Y-fork → steps 5·6. Tablet/mobile: same cards stacked with vertical connectors
 * (see PublicProject.css — a single markup, layout swaps by breakpoint).
 */
function FlowView({ flow }: { flow: ProcedureFlow }) {
  return (
    <div className="pp-flow">
      <h3 className="pp-flow__heading">{flow.heading}</h3>

      <div className="pp-flow__chart">
        <ol
          className="pp-flow__row pp-flow__row--top"
          aria-label={`${flow.heading} 기본 절차`}
        >
          {flow.steps.map((s) => (
            <li key={s.no} className="pp-flow__cell">
              <StepCard step={s} />
            </li>
          ))}
        </ol>

        <div className="pp-flow__link" aria-hidden="true" />

        <div className="pp-flow__decision" aria-label="협의 결과">
          {flow.outcomes.map((o) => (
            <div key={o.label} className={`pp-outcome pp-outcome--${o.kind}`}>
              <span className="pp-outcome__icon" aria-hidden="true">
                {o.kind === 'success' ? '✓' : '↓'}
              </span>
              <div className="pp-outcome__body">
                <p className="pp-outcome__label">{o.label}</p>
                <p className="pp-outcome__note">{o.note}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="pp-flow__link pp-flow__link--branch" aria-hidden="true" />

        <div className="pp-flow__lead">
          <StepCard step={flow.lead} />
        </div>

        {flow.forkNote ? (
          <div className="pp-flow__fork-note" aria-label="병행 진행 절차">
            <ul className="pp-step__list">
              {flow.forkNote.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="pp-flow__fork" aria-hidden="true" />

        <ol
          className="pp-flow__row pp-flow__row--parallel"
          aria-label={`${flow.heading} 후속 절차`}
        >
          {flow.parallel.map((s) => (
            <li key={s.no} className="pp-flow__cell">
              <StepCard step={s} />
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

function RightsCardView({ card }: { card: RightsCard }) {
  return (
    <article className="pp-right-card">
      <header className="pp-right-card__head">
        <h4 className="pp-right-card__title">{card.title}</h4>
        {card.subtitle ? (
          <span className="pp-right-card__subtitle">{card.subtitle}</span>
        ) : null}
      </header>
      {card.items ? (
        <ul className="renewal-list pp-right-card__list">
          {card.items.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      ) : null}
      {card.caution ? (
        <p className="pp-flow-step__caution">
          <span aria-hidden="true">※</span> {card.caution}
        </p>
      ) : null}
      {card.groups?.map((g) => (
        <div key={g.label} className="pp-right-group">
          <p className="pp-right-group__label">{g.label}</p>
          <ul className="renewal-list pp-right-card__list">
            {g.items.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
          {g.caution ? (
            <p className="pp-flow-step__caution">
              <span aria-hidden="true">※</span> {g.caution}
            </p>
          ) : null}
        </div>
      ))}
    </article>
  )
}

/**
 * 재개발 · 보상업무 > 공익사업 (sub-02-02).
 * Scroll-spy local tabs; GNB entry keeps sub-visual at top (mirrors 정비사업).
 */
export function PublicProjectPage() {
  const [activeTab, setActiveTab] = useState<PublicTabId>('overview')
  const scrollingRef = useRef(false)
  const mainRef = useRef<HTMLElement>(null)

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(sectionId(id as PublicTabId))
    if (!el) return
    scrollingRef.current = true
    setActiveTab(id as PublicTabId)
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
    const nodes = root.querySelectorAll<HTMLElement>('[data-public-section]')
    if (!nodes.length) return

    const observe = () => {
      const offset = readGnbBarH() + readLocalTabsH() + 12
      const io = new IntersectionObserver(
        (entries) => {
          if (scrollingRef.current) return
          const visible = entries
            .filter((e) => e.isIntersecting)
            .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
          const first = visible[0]
          if (!first) return
          const id = first.target.getAttribute('data-public-section')
          if (id) setActiveTab(id as PublicTabId)
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

  return (
    <div className="renewal public-project" data-name="SUB_재개발보상업무_공익사업">
      <div className="renewal__visual" data-name="SUB_LAYOUT">
        <SubVisual
          parentLabel={PUBLIC_PROJECT_PAGE.parentLabel}
          title={PUBLIC_PROJECT_PAGE.title}
          image={PUBLIC_PROJECT_PAGE.visual}
          imagePreview={PUBLIC_PROJECT_PAGE.visualPreview}
          visualKey="sub-02-02"
          showChip={false}
        />
      </div>

      <LocalTabs
        tabs={PUBLIC_TABS}
        activeTab={activeTab}
        onTabSelect={scrollToSection}
        ariaLabel="공익사업 로컬 메뉴"
      />

      <main ref={mainRef} className="renewal__main">
        <div className="renewal__contents">
          {/* —— 1. 공익사업 —— */}
          <section
            id={sectionId('overview')}
            data-public-section="overview"
            className="renewal-section"
            aria-label="공익사업"
          >
            <div className="renewal-split">
              <SectionHead enLabel={PUBLIC_OVERVIEW.enLabel} title={PUBLIC_OVERVIEW.title} />
              <div className="renewal-split__body">
                {PUBLIC_OVERVIEW.intro.map((p) => (
                  <p key={p.slice(0, 40)} className="renewal-body">
                    {p}
                  </p>
                ))}
              </div>
            </div>

            <Quotes quotes={PUBLIC_OVERVIEW.quotes} />

            <div className="renewal-split">
              <div className="renewal-section__head renewal-section__head--spacer" aria-hidden="true" />
              <div className="renewal-split__body pp-two-col">
                {PUBLIC_OVERVIEW.blocks.map((b) => (
                  <WorkBlockView key={b.title} data={b} />
                ))}
              </div>
            </div>
          </section>

          {/* —— 2. 공익사업 (시행자대리) 실적 —— */}
          <section
            id={sectionId('record1')}
            data-public-section="record1"
            className="renewal-section"
            aria-label="공익사업 시행자대리 실적"
          >
            <ResultsBlock section={PUBLIC_RECORD_1} prefix="pub" />
          </section>

          {/* —— 3. 보상업무 —— */}
          <section
            id={sectionId('compensation')}
            data-public-section="compensation"
            className="renewal-section"
            aria-label="보상업무"
          >
            <div className="renewal-split">
              <SectionHead
                enLabel={PUBLIC_COMPENSATION.enLabel}
                title={PUBLIC_COMPENSATION.title}
              />
              <div className="renewal-split__body">
                {PUBLIC_COMPENSATION.intro.map((p) => (
                  <p key={p.slice(0, 40)} className="renewal-body">
                    {p}
                  </p>
                ))}
              </div>
            </div>

            <div className="renewal-split">
              <div className="renewal-section__head renewal-section__head--spacer" aria-hidden="true" />
              <div className="renewal-split__body">
                <WorkBlockView data={PUBLIC_COMPENSATION.block} />
              </div>
            </div>

            <Quotes quotes={PUBLIC_COMPENSATION.quotes} />

            <div className="pp-strengths" data-name="역할및경쟁력">
              <div className="pp-strengths__head">
                <p className="pp-strengths__eyebrow">
                  {PUBLIC_COMPENSATION.strengths.eyebrow}
                </p>
                <h3 className="pp-strengths__title">
                  <span className="is-teal">
                    {PUBLIC_COMPENSATION.strengths.titleTeal}
                  </span>{' '}
                  <span className="is-ink">
                    {PUBLIC_COMPENSATION.strengths.titleBlack}
                  </span>
                </h3>
              </div>
              <p className="pp-strengths__summary">
                {PUBLIC_COMPENSATION.strengths.summary}
              </p>
              <div className="pp-strengths__grid">
                {PUBLIC_COMPENSATION.strengths.cards.map((card) => (
                  <article key={card.no} className="pp-strength-card">
                    <div className="pp-strength-card__head">
                      <span className="pp-strength-card__no" aria-hidden="true">
                        {card.no}
                      </span>
                      <h4 className="pp-strength-card__title">{card.title}</h4>
                    </div>
                    <p className="pp-strength-card__desc">{card.desc}</p>
                    <div className="pp-strength-card__benefit">
                      <span className="pp-strength-card__mark" aria-hidden="true" />
                      {card.benefit}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* —— 4. 절차 · 유의할 점 —— */}
          <section
            id={sectionId('procedure')}
            data-public-section="procedure"
            className="renewal-section"
            aria-label="절차 · 유의할 점"
          >
            <div className="renewal-split">
              <SectionHead
                enLabel={PUBLIC_PROCEDURE.enLabel}
                title={PUBLIC_PROCEDURE.title}
              />
              <div className="renewal-split__body">
                <div className="pp-flows">
                  {PUBLIC_PROCEDURE.flows.map((f) => (
                    <FlowView key={f.heading} flow={f} />
                  ))}
                </div>
              </div>
            </div>

            <div className="renewal-split">
              <div className="renewal-section__head renewal-section__head--spacer" aria-hidden="true" />
              <div className="renewal-split__body">
                <BulletTitle>{PUBLIC_PROCEDURE.rights.heading}</BulletTitle>
                <div className="pp-rights">
                  {PUBLIC_PROCEDURE.rights.cards.map((c) => (
                    <RightsCardView key={c.title} card={c} />
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* —— 5. 공익사업 (보상업무) 실적 —— */}
          <section
            id={sectionId('record2')}
            data-public-section="record2"
            className="renewal-section"
            aria-label="공익사업 보상업무 실적"
          >
            <ResultsBlock section={PUBLIC_RECORD_2} prefix="comp" />
          </section>
        </div>
      </main>
    </div>
  )
}
