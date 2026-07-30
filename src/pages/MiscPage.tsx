import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { LocalTabs } from '../components/sub/LocalTabs'
import { SubVisual } from '../components/sub/SubVisual'
import {
  MISC_PAGE,
  MISC_TABS,
  type MiscGroup,
  type MiscPartner,
  type MiscSection,
} from '../data/misc'
import { LOCAL_TABS_ANCHOR_ID } from '../hooks/useScrollToLocalTabs'
import { asset } from '../utils/asset'
import './Renewal.css'
import './Misc.css'

const BULLET_SRC = asset('assets/icon-bullet.svg')
const ARROW_SRC = asset('assets/icon-arrow.svg')

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

function sectionId(id: string): string {
  return `misc-section-${id}`
}

function BulletTitle({ children }: { children: ReactNode }) {
  return (
    <div className="renewal-bullet-title">
      <img className="renewal-bullet-title__icon" src={BULLET_SRC} alt="" />
      <h3 className="renewal-bullet-title__text">{children}</h3>
    </div>
  )
}

function Lead({ lines }: { lines: string[] }) {
  return (
    <div className="misc-lead">
      {lines.map((line) => (
        <p key={line.slice(0, 40)}>{line}</p>
      ))}
    </div>
  )
}

function GroupView({ group }: { group: MiscGroup }) {
  return (
    <div className="misc-group">
      {group.headline ? <BulletTitle>{group.headline}</BulletTitle> : null}
      {group.lead?.length ? <Lead lines={group.lead} /> : null}
      {group.cards.length ? (
        <div className="misc-cards">
          {group.cards.map((card) => (
            <article key={card.title} className="misc-card">
              <h4 className="misc-card__title">{card.title}</h4>
              <ul className="misc-card__list">
                {card.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      ) : null}
      {group.button ? (
        <button type="button" className="misc-cta">
          <span>{group.button}</span>
          <img src={ARROW_SRC} alt="" aria-hidden="true" />
        </button>
      ) : null}
    </div>
  )
}

function PartnerCard({ partner }: { partner: MiscPartner }) {
  return (
    <article className="misc-partner">
      <div className="misc-partner__photo">
        {partner.photo ? (
          <img src={partner.photo} alt={`${partner.name} 변리사`} />
        ) : (
          <span className="misc-partner__photo-ph" aria-hidden="true" />
        )}
      </div>
      <div className="misc-partner__head">
        <h4 className="misc-partner__name">{partner.name}</h4>
        <div className="misc-partner__quals">
          {partner.quals.map((q) => (
            <span key={q} className="misc-partner__qual">
              {q}
            </span>
          ))}
        </div>
        <div className="misc-partner__fields">
          {partner.fields.map((f) => (
            <span key={f} className="misc-partner__field">
              {f}
            </span>
          ))}
        </div>
      </div>
      <span className="misc-partner__divider" aria-hidden="true" />
      <div className="misc-partner__block">
        <p className="misc-partner__label">학력</p>
        <ul className="misc-partner__list">
          {partner.education.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      </div>
      <div className="misc-partner__block">
        <p className="misc-partner__label">주요 경력</p>
        <ul className="misc-partner__list">
          {partner.careers.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </div>
    </article>
  )
}

function SectionView({ section }: { section: MiscSection }) {
  return (
    <div className="renewal-split">
      <div className="renewal-section__head">
        <p className="renewal-section__en">{section.eyebrow}</p>
        <h2 className="renewal-section__title">{section.title}</h2>
      </div>
      <div className="renewal-split__body">
        {section.lead?.length ? <Lead lines={section.lead} /> : null}
        {section.groups.map((group, i) => (
          <GroupView key={group.headline || `group-${i}`} group={group} />
        ))}
        {section.partners ? (
          <div className="misc-partners">
            <BulletTitle>{section.partners.headline}</BulletTitle>
            <div className="misc-partners__content">
              <img
                className="misc-partners__logo"
                src={section.partners.logo}
                alt={section.partners.firm}
                width={373}
                height={65}
              />
              <div className="misc-partners__grid">
                {section.partners.people.map((p) => (
                  <PartnerCard key={p.name} partner={p} />
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

/**
 * 기타업무 (Figma SUB_기타업무 / sub-03-01). 스크롤-모드 로컬 탭 단일 페이지 —
 * 정비사업/공익사업과 동일 쉘(renewal-* 클래스)로 탭 400/88 · 내부 140/74 간격을
 * 그대로 상속. GNB 서브메뉴는 `/other/misc#{tabId}` 해시로 진입 → 해당 섹션 스크롤
 * + 탭 활성화.
 */
function tabIdFromHash(hash: string): string | null {
  const id = hash.replace(/^#/, '')
  return MISC_TABS.some((t) => t.id === id) ? id : null
}

export function MiscPage() {
  const { hash } = useLocation()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState(
    () => tabIdFromHash(hash) ?? MISC_TABS[0]!.id,
  )
  const scrollingRef = useRef(false)
  const mainRef = useRef<HTMLElement>(null)

  const scrollToSection = useCallback((id: string, syncHash = true) => {
    const el = document.getElementById(sectionId(id))
    if (!el) return
    scrollingRef.current = true
    setActiveTab(id)
    if (syncHash) {
      const next = `#${id}`
      if (window.location.hash !== next) {
        navigate({ pathname: '/other/misc', hash: id }, { replace: true })
      }
    }
    const offset = readGnbBarH() + readLocalTabsH() + 8
    const top = el.getBoundingClientRect().top + window.scrollY - offset
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
    window.setTimeout(() => {
      scrollingRef.current = false
    }, 700)
  }, [navigate])

  /* GNB / deep-link: /other/misc#family → activate + scroll that tab */
  useEffect(() => {
    const id = tabIdFromHash(hash)
    if (!id) return
    const timer = window.setTimeout(() => {
      scrollToSection(id, false)
    }, 50)
    return () => window.clearTimeout(timer)
  }, [hash, scrollToSection])

  useEffect(() => {
    const root = mainRef.current
    if (!root) return
    const nodes = root.querySelectorAll<HTMLElement>('[data-misc-section]')
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
          const id = first.target.getAttribute('data-misc-section')
          if (!id || id === activeTab) return
          setActiveTab(id)
          const next = `#${id}`
          if (window.location.hash !== next) {
            navigate({ pathname: '/other/misc', hash: id }, { replace: true })
          }
        },
        { root: null, rootMargin: `-${offset}px 0px -55% 0px`, threshold: [0, 0.1, 0.25] },
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
  }, [activeTab, navigate])

  return (
    <div className="renewal misc" data-name="SUB_기타업무">
      <div className="renewal__visual" data-name="SUB_LAYOUT">
        <SubVisual
          parentLabel={MISC_PAGE.parentLabel}
          title={MISC_PAGE.title}
          image={MISC_PAGE.visual}
          imagePreview={MISC_PAGE.visualPreview}
          visualKey="sub-03-01"
        />
      </div>

      <LocalTabs
        tabs={MISC_TABS}
        activeTab={activeTab}
        onTabSelect={(id) => scrollToSection(id, true)}
        ariaLabel="기타업무 로컬 메뉴"
      />

      <main ref={mainRef} className="renewal__main">
        <div className="renewal__contents">
          {MISC_TABS.map((tab) => (
            <section
              key={tab.id}
              id={sectionId(tab.id)}
              data-misc-section={tab.id}
              className="renewal-section"
              aria-label={tab.label}
            >
              {tab.sections.map((section) => (
                <SectionView key={section.title} section={section} />
              ))}
            </section>
          ))}
        </div>
      </main>
    </div>
  )
}
