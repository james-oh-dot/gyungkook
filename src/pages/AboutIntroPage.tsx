import { useCallback, useEffect, useRef, useState } from 'react'
import { ProgressiveImage } from '../components/ProgressiveImage'
import { LocalTabs } from '../components/sub/LocalTabs'
import { SubVisual } from '../components/sub/SubVisual'
import {
  ABOUT_INTRO_ABOUT,
  ABOUT_INTRO_PAGE,
  ABOUT_INTRO_PARTNERS,
  ABOUT_INTRO_PHILOSOPHY,
  ABOUT_INTRO_STRENGTH,
  ABOUT_INTRO_TABS,
  type AboutIntroTabId,
} from '../data/aboutIntro'
import { LOCAL_TABS_ANCHOR_ID } from '../hooks/useScrollToLocalTabs'
import './AboutIntro.css'

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

function sectionId(id: AboutIntroTabId): string {
  return `about-intro-section-${id}`
}

function SectionHead({ enLabel, title }: { enLabel: string; title: string }) {
  return (
    <div className="about-intro-section__head">
      <p className="about-intro-section__en">{enLabel}</p>
      <h2 className="about-intro-section__title">{title}</h2>
    </div>
  )
}

/**
 * 법무법인경국 > 법인소개 (sub-01-01).
 * Scroll-spy local tabs; GNB entry keeps sub-visual at top.
 */
export function AboutIntroPage() {
  const [activeTab, setActiveTab] = useState<AboutIntroTabId>('about')
  const scrollingRef = useRef(false)
  const mainRef = useRef<HTMLElement>(null)

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(sectionId(id as AboutIntroTabId))
    if (!el) return
    scrollingRef.current = true
    setActiveTab(id as AboutIntroTabId)
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
    const nodes = root.querySelectorAll<HTMLElement>('[data-about-intro-section]')
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
          const id = first.target.getAttribute('data-about-intro-section')
          if (id) setActiveTab(id as AboutIntroTabId)
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
    <div className="about-intro" data-name="SUB_법무법인경국_법인소개">
      <div className="about-intro__visual" data-name="SUB_LAYOUT">
        <SubVisual
          parentLabel={ABOUT_INTRO_PAGE.parentLabel}
          title={ABOUT_INTRO_PAGE.title}
          image={ABOUT_INTRO_PAGE.visual}
          imagePreview={ABOUT_INTRO_PAGE.visualPreview}
          visualKey="sub-01-01"
          showChip={false}
        />
      </div>

      <LocalTabs
        tabs={ABOUT_INTRO_TABS}
        activeTab={activeTab}
        onTabSelect={scrollToSection}
        ariaLabel="법인소개 로컬 메뉴"
      />

      <main ref={mainRef} className="about-intro__main">
        <div className="about-intro__contents">
          {/* —— 법무법인경국 소개 —— */}
          <section
            id={sectionId('about')}
            data-about-intro-section="about"
            className="about-intro-section"
            aria-label="법무법인경국 소개"
          >
            <div className="about-intro-split">
              <SectionHead
                enLabel={ABOUT_INTRO_ABOUT.enLabel}
                title={ABOUT_INTRO_ABOUT.title}
              />
              <div className="about-intro-split__body about-intro-split__body--lead">
                {ABOUT_INTRO_ABOUT.paragraphs.map((p) => (
                  <p key={p.slice(0, 40)} className="about-intro-lead">
                    {p}
                  </p>
                ))}
              </div>
            </div>

            <div className="about-intro-value-cards" role="list">
              {ABOUT_INTRO_ABOUT.values.map((card) => (
                <article
                  key={card.no}
                  className="about-intro-value-card"
                  role="listitem"
                >
                  <div className="about-intro-value-card__copy">
                    <p className="about-intro-value-card__no">{card.no}</p>
                    <h3 className="about-intro-value-card__title">
                      {card.title}
                    </h3>
                  </div>
                  <div className="about-intro-value-card__icon">
                    <img src={card.icon} alt="" />
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* —— 이념 —— */}
          <section
            id={sectionId('philosophy')}
            data-about-intro-section="philosophy"
            className="about-intro-section"
            aria-label="이념"
          >
            <div className="about-intro-split">
              <SectionHead
                enLabel={ABOUT_INTRO_PHILOSOPHY.enLabel}
                title={ABOUT_INTRO_PHILOSOPHY.title}
              />
              <div className="about-intro-split__body">
                <div className="about-intro-ci">
                  <div className="about-intro-ci__logo">
                    <img
                      src={ABOUT_INTRO_PHILOSOPHY.ciLogo}
                      alt="법무법인 경국 CI"
                    />
                  </div>
                  <div className="about-intro-ci__desc">
                    <p className="about-intro-ci__label">
                      {ABOUT_INTRO_PHILOSOPHY.ciMeaningLabel}
                    </p>
                    <p className="about-intro-ci__text">
                      {ABOUT_INTRO_PHILOSOPHY.ciMeaning}
                    </p>
                  </div>
                </div>

                <div className="about-intro-hanja">
                  <div className="about-intro-hanja__cards">
                    {ABOUT_INTRO_PHILOSOPHY.hanja.map((item) => (
                      <div key={item.char} className="about-intro-hanja__card">
                        <p className="about-intro-hanja__char">{item.char}</p>
                        <p className="about-intro-hanja__reading">
                          {item.reading}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="about-intro-hanja__notes">
                    {ABOUT_INTRO_PHILOSOPHY.hanjaNotes.map((note) => (
                      <p key={note}>{note}</p>
                    ))}
                  </div>
                </div>

                <div className="about-intro-body">
                  {ABOUT_INTRO_PHILOSOPHY.body.map((p) => (
                    <p key={p.slice(0, 40)}>{p}</p>
                  ))}
                </div>
              </div>
            </div>

            <aside className="about-intro-quote" data-name="Quote Block">
              <img
                className="about-intro-quote__mark"
                src={ABOUT_INTRO_PHILOSOPHY.quoteMark}
                alt=""
              />
              <div className="about-intro-quote__text">
                {ABOUT_INTRO_PHILOSOPHY.quote.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </aside>
          </section>

          {/* —— 강점 —— */}
          <section
            id={sectionId('strength')}
            data-about-intro-section="strength"
            className="about-intro-section"
            aria-label="강점"
          >
            <div className="about-intro-split">
              <SectionHead
                enLabel={ABOUT_INTRO_STRENGTH.enLabel}
                title={ABOUT_INTRO_STRENGTH.title}
              />
              <div className="about-intro-split__body about-intro-split__body--lead">
                <div className="about-intro-body">
                  {ABOUT_INTRO_STRENGTH.lead.map((p) => (
                    <p key={p.slice(0, 40)}>{p}</p>
                  ))}
                </div>
              </div>
            </div>

            <div className="about-intro-features" role="list">
              {ABOUT_INTRO_STRENGTH.features.map((card) => (
                <article
                  key={card.no}
                  className="about-intro-feature"
                  role="listitem"
                >
                  <span className="about-intro-feature__no">{card.no}</span>
                  <div className="about-intro-feature__copy">
                    <h3 className="about-intro-feature__title">{card.title}</h3>
                    <p className="about-intro-feature__body">{card.body}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className="about-intro-dark" data-name="Dark Emphasis">
              <div className="about-intro-dark__left">
                <h3 className="about-intro-dark__title">
                  {ABOUT_INTRO_STRENGTH.dark.title.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </h3>
                <div className="about-intro-dark__body">
                  {ABOUT_INTRO_STRENGTH.dark.body.map((p) => (
                    <p key={p.slice(0, 32)}>{p}</p>
                  ))}
                </div>
                <ProgressiveImage
                  className="about-intro-dark__seal"
                  src={ABOUT_INTRO_STRENGTH.dark.seal}
                  preview={ABOUT_INTRO_STRENGTH.dark.sealPreview}
                  alt=""
                  objectFit="cover"
                />
              </div>
              <ul className="about-intro-dark__list">
                {ABOUT_INTRO_STRENGTH.dark.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="about-intro-steps">
              {ABOUT_INTRO_STRENGTH.steps.map((step) => (
                <article key={step.no} className="about-intro-step">
                  <div className="about-intro-step__head">
                    <p className="about-intro-step__no">{step.no}</p>
                    <h3 className="about-intro-step__title">{step.title}</h3>
                    <div className="about-intro-step__body">
                      {step.paragraphs.map((para, i) => (
                        <p key={`${step.no}-${i}`}>
                          {para.parts.map((part, j) =>
                            'bold' in part && part.bold ? (
                              <strong key={j}>{part.text}</strong>
                            ) : (
                              <span key={j}>{part.text}</span>
                            ),
                          )}
                        </p>
                      ))}
                    </div>
                  </div>
                  <div className="about-intro-step__visual">
                    <ProgressiveImage
                      className="progressive-image--fill"
                      imgClassName={
                        step.imageFlipY
                          ? 'about-intro-step__img about-intro-step__img--flip'
                          : 'about-intro-step__img'
                      }
                      src={step.image}
                      preview={step.imagePreview}
                      alt=""
                      objectFit="cover"
                      objectPosition={
                        step.imageFlipY ? 'center 55%' : 'center 30%'
                      }
                    />
                  </div>
                </article>
              ))}
            </div>

            <aside
              className="about-intro-city-quote"
              data-name="Quote Block"
            >
              <ProgressiveImage
                className="progressive-image--fill about-intro-city-quote__bg"
                src={ABOUT_INTRO_STRENGTH.cityQuote.image}
                preview={ABOUT_INTRO_STRENGTH.cityQuote.imagePreview}
                alt=""
                objectFit="cover"
              />
              <div className="about-intro-city-quote__scrim" aria-hidden="true" />
              <div className="about-intro-city-quote__inner">
                <img
                  className="about-intro-city-quote__mark"
                  src={ABOUT_INTRO_STRENGTH.cityQuote.mark}
                  alt=""
                />
                <div className="about-intro-city-quote__title">
                  {ABOUT_INTRO_STRENGTH.cityQuote.lines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
                <div className="about-intro-city-quote__sub">
                  {ABOUT_INTRO_STRENGTH.cityQuote.sub.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </div>
            </aside>

            <div className="about-intro-corp">
              <p className="about-intro-corp__watermark" aria-hidden="true">
                {ABOUT_INTRO_STRENGTH.corporateValue.watermark}
              </p>
              <div className="about-intro-corp__badge">
                {ABOUT_INTRO_STRENGTH.corporateValue.badge}
              </div>
              <div className="about-intro-corp__list">
                {ABOUT_INTRO_STRENGTH.corporateValue.items.map((item) => (
                  <div
                    key={item.title.join('')}
                    className="about-intro-corp__row"
                  >
                    <h3 className="about-intro-corp__title">
                      {item.title.map((line) => (
                        <span key={line}>{line}</span>
                      ))}
                    </h3>
                    <p className="about-intro-corp__body">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* —— 협력사 —— */}
          <section
            id={sectionId('partners')}
            data-about-intro-section="partners"
            className="about-intro-section about-intro-section--partners"
            aria-label="협력사"
          >
            <div className="about-intro-split">
              <SectionHead
                enLabel={ABOUT_INTRO_PARTNERS.enLabel}
                title={ABOUT_INTRO_PARTNERS.title}
              />
              <div className="about-intro-split__body about-intro-split__body--partners">
                <ul className="about-intro-partners">
                  {ABOUT_INTRO_PARTNERS.logos.map((src, i) => (
                    <li key={src} className="about-intro-partners__item">
                      <div className="about-intro-partners__logo">
                        <img src={src} alt={`협력사 로고 ${i + 1}`} />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
