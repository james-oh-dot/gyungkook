import { useCallback, useEffect, useRef, useState } from 'react'
import { ProgressiveImage } from '../components/ProgressiveImage'
import { LocalTabs } from '../components/sub/LocalTabs'
import { SubVisual } from '../components/sub/SubVisual'
import {
  HISTORY_AWARDS,
  HISTORY_CERTIFICATIONS,
  HISTORY_INTRO,
  HISTORY_PAGE,
  HISTORY_TABS,
  HISTORY_TIMELINE,
  type HistoryImageItem,
  type HistoryTabId,
} from '../data/history'
import { LOCAL_TABS_ANCHOR_ID } from '../hooks/useScrollToLocalTabs'
import './HistoryPage.css'

function sectionId(id: HistoryTabId) {
  return `history-section-${id}`
}

function offsetTop() {
  const gnb = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--gnb-bar-h')) || 100
  const tabs = document.getElementById(LOCAL_TABS_ANCHOR_ID)?.getBoundingClientRect().height ?? 62
  return gnb + tabs + 8
}

function SectionHead({ label, title }: { label: string; title: string }) {
  return (
    <div className="history-section__head">
      <p className="history-section__label">{label}</p>
      <h2 className="history-section__title">{title}</h2>
    </div>
  )
}

function CertificateGrid({ items }: { items: HistoryImageItem[] }) {
  return (
    <div className="history-cert-grid" role="list">
      {items.map((item) => (
        <figure className="history-cert" role="listitem" key={item.label}>
          <div className={`history-cert__image${item.fit === 'contain' ? ' history-cert__image--contain' : ''}`}>
            <ProgressiveImage
              src={item.image.src}
              preview={item.image.preview}
              alt={item.label}
              imgClassName="history-cert__img"
            />
          </div>
          <figcaption>{item.label}</figcaption>
        </figure>
      ))}
    </div>
  )
}

/** 법무법인경국 > 연혁 · 수상 · 인증 (Figma sub-01-05). */
export function HistoryPage() {
  const [activeTab, setActiveTab] = useState<HistoryTabId>('history')
  const scrolling = useRef(false)
  const mainRef = useRef<HTMLElement>(null)

  const scrollToSection = useCallback((id: string) => {
    const target = document.getElementById(sectionId(id as HistoryTabId))
    if (!target) return
    scrolling.current = true
    setActiveTab(id as HistoryTabId)
    window.scrollTo({
      top: Math.max(0, target.getBoundingClientRect().top + window.scrollY - offsetTop()),
      behavior: 'smooth',
    })
    window.setTimeout(() => { scrolling.current = false }, 700)
  }, [])

  useEffect(() => {
    const root = mainRef.current
    if (!root) return
    const sections = root.querySelectorAll<HTMLElement>('[data-history-section]')
    const observer = new IntersectionObserver(
      (entries) => {
        if (scrolling.current) return
        const current = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        const id = current?.target.getAttribute('data-history-section')
        if (id) setActiveTab(id as HistoryTabId)
      },
      { rootMargin: `-${offsetTop()}px 0px -55% 0px`, threshold: [0, 0.1] },
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="history-page" data-name="SUB_법무법인경국_연혁수상인증">
      <SubVisual
        parentLabel={HISTORY_PAGE.parentLabel}
        title={HISTORY_PAGE.title}
        image={HISTORY_PAGE.visual}
        imagePreview={HISTORY_PAGE.visualPreview}
        visualKey="sub-01-05"
      />
      <LocalTabs tabs={[...HISTORY_TABS]} activeTab={activeTab} onTabSelect={scrollToSection} ariaLabel="연혁 수상 인증 로컬 메뉴" />
      <main className="history-page__main" ref={mainRef}>
        <div className="history-page__contents">
          <section id={sectionId('history')} className="history-section" data-history-section="history">
            <div className="history-split">
              <SectionHead label="History" title="연혁" />
              <div className="history-split__body history-split__body--intro">
                {HISTORY_INTRO.map((line) => <p key={line}>{line}</p>)}
              </div>
            </div>
            <div className="history-timeline" aria-label="법무법인 경국 연혁">
              <p className="history-timeline__range">2025 ~ 현재</p>
              <div className="history-timeline__track">
                {HISTORY_TIMELINE.map((entry) => (
                  <article className={`history-timeline__entry history-timeline__entry--${entry.side}`} key={entry.year}>
                    <div className="history-timeline__copy">
                      {entry.items.map((item) => <p key={item}>{item}</p>)}
                    </div>
                    <div className="history-timeline__year">{entry.year}</div>
                  </article>
                ))}
              </div>
              <p className="history-timeline__caption">A journey through the key milestones that shaped a</p>
            </div>
          </section>

          <section id={sectionId('awards')} className="history-section" data-history-section="awards">
            <div className="history-split">
              <SectionHead label="Awards" title="수상" />
              <div className="history-split__body history-split__body--awards">
                <p>법무법인 경국은<br />스스로의 만족에 그치지 않고,<br />끊임없이 평가 받으며 고민하며 성장하겠습니다.</p>
                <p>그리고 ‘우리’, ‘사회’와 함께 하는<br />전문인 단체가 되겠습니다.</p>
                <CertificateGrid items={HISTORY_AWARDS} />
              </div>
            </div>
          </section>

          <section id={sectionId('certifications')} className="history-section" data-history-section="certifications">
            <div className="history-split">
              <SectionHead label="Appointment and Certification" title="위촉 · 인증" />
              <div className="history-split__body history-split__body--certifications">
                <CertificateGrid items={HISTORY_CERTIFICATIONS} />
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
