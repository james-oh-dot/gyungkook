import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from 'react'
import { ProgressiveImage } from '../ProgressiveImage'
import { Reveal } from '../Reveal'
import { CharReveal } from '../CharReveal'
import { LineReveal } from '../LineReveal'
import { WordReveal } from '../WordReveal'
import { asset } from '../../utils/asset'
import { useCardTrackNav } from '../../hooks/useCardTrackNav'
import { useReversibleInView } from '../../hooks/useReversibleInView'
import { resolveNavHref } from '../../utils/path'
import {
  HOME_ABOUT_IMAGE,
  HOME_NOTICE_BG,
  HOME_OFFICE_MAP,
  HOME_PROFESSIONALS_BG,
  HOME_SOCIAL_BG,
  achievements,
  awards,
  notices,
  practices,
  pressItems,
  professionals,
} from '../../data/content'

/** 오시는길 액션 칩 — 전부 버튼, 민트 스타일은 hover/press 상태 */
const OFFICE_CHIPS = ['네이버 예약', 'SMS 약도 전송', '카카오내비', '티맵 연결']

/** Home press-card chips → matching list routes (mock cards have no post ids). */
function pressCardHref(chip: string): string {
  if (chip === '컬럼') return '/press/column-media/column'
  if (chip === '보도자료') return '/press/coverage/release'
  if (chip === '간행물') return '/press/column-media/publication'
  if (chip === '미디어') return '/press/column-media/media'
  return '/press/coverage/tv'
}

function TextBtn({
  label,
  icon = asset('assets/icon-btn.svg'),
  to,
}: {
  label: string
  icon?: string
  /** SPA path (no base) — e.g. `/press/social` */
  to?: string
}) {
  const content = (
    <>
      <span>{label}</span>
      <img src={icon} alt="" />
    </>
  )
  if (to) {
    // Plain <a> + resolveNavHref: works on both SPA (index) and classic.html MPA
    // (no BrowserRouter — react-router <Link> crashes the whole classic tree).
    return (
      <a className="text-btn" href={resolveNavHref(to)}>
        {content}
      </a>
    )
  }
  return (
    <button type="button" className="text-btn">
      {content}
    </button>
  )
}

/** `icon-arrow.svg` ships a hard-coded `stroke="white"` — fine over the hero's
 *  photo, invisible on these light card sections. Same mask-image +
 *  `background-color: currentColor` recolor QuickNav uses for its icons. */
const ARROW_ICON_VAR = {
  '--card-track-nav-icon': `url("${asset('assets/icon-arrow.svg')}")`,
} as CSSProperties

/**
 * Prev/next for Notice/Press feature-card galleries.
 * Mobile: sits above the rail (CSS order). Desktop/tablet: below the rail,
 * right-aligned — buttons disable at the scroll ends (Apple-style stop).
 */
function CardTrackNav({
  prev,
  next,
  canPrev,
  canNext,
  label,
}: {
  prev: () => void
  next: () => void
  canPrev: boolean
  canNext: boolean
  label: string
}) {
  return (
    <div className="card-track-nav">
      <button
        type="button"
        className="card-track-nav__btn is-prev"
        onClick={prev}
        disabled={!canPrev}
        aria-label={`이전 ${label}`}
      >
        <span className="card-track-nav__icon is-flip" style={ARROW_ICON_VAR} aria-hidden="true" />
      </button>
      <button
        type="button"
        className="card-track-nav__btn is-next"
        onClick={next}
        disabled={!canNext}
        aria-label={`다음 ${label}`}
      >
        <span className="card-track-nav__icon" style={ARROW_ICON_VAR} aria-hidden="true" />
      </button>
    </div>
  )
}

/** Shared Figma gallery card shell (소식공지 / 활동보도 list cards). */
function GalleryCard({
  title,
  desc,
  date,
  href,
  label,
  chip,
}: {
  title: string
  desc: string
  date: string
  href: string
  label: string
  /** Category chip — used on 활동·보도 cards (TV방송, 컬럼, …). */
  chip?: string
}) {
  return (
    <a
      className="gallery-card"
      data-gallery-card
      href={resolveNavHref(href)}
      aria-label={`${title} ${label} 보기`}
    >
      <span className="gallery-card__accent" aria-hidden="true">
        <img src={asset('assets/icon-link-white.svg')} alt="" />
      </span>
      <div className="gallery-card__body">
        {chip ? <span className="gallery-card__chip">{chip}</span> : null}
        <h3 className="gallery-card__title">{title}</h3>
        <p className="gallery-card__desc">{desc}</p>
        <time className="gallery-card__date" dateTime={date.replaceAll('.', '-')}>
          {date}
        </time>
      </div>
    </a>
  )
}

export function NoticeSection() {
  const trackRef = useRef<HTMLDivElement>(null)
  const nav = useCardTrackNav(trackRef)

  return (
    <section id="notice" className="section notice-section" aria-labelledby="notice-title">
      <div className="notice-section__bg" aria-hidden="true">
        <ProgressiveImage
          className="progressive-image--fill"
          src={HOME_NOTICE_BG.src}
          preview={HOME_NOTICE_BG.preview}
          alt=""
        />
      </div>
      <div className="section-head">
        <Reveal className="section-head__copy">
          <p className="eyebrow">NOTICE</p>
          <h2 id="notice-title" className="section-title">
            소식·공지
          </h2>
          <p className="section-desc">
            법무법인경국의 새로운 소식을 전합니다.
          </p>
        </Reveal>
        <Reveal delay={120}>
          <TextBtn
            label="전체보기"
            icon={asset('assets/icon-btn-white.svg')}
            to="/news/notice"
          />
        </Reveal>
      </div>
      <CardTrackNav {...nav} label="소식·공지" />
      <div className="feature-gallery" ref={trackRef}>
        {notices.map((item, index) => (
          <Reveal key={`${item.title}-${index}`} className="feature-gallery__item" delay={index * 80}>
            <GalleryCard
              title={item.title}
              desc={item.desc}
              date={item.date}
              href="/news/notice"
              label="소식·공지"
            />
          </Reveal>
        ))}
      </div>
    </section>
  )
}

export function AboutSection() {
  const leadRef = useRef<HTMLDivElement>(null)
  const leadActive = useReversibleInView(leadRef, 0.3, '0px 0px -12% 0px')

  return (
    <section id="about" className="section section--about" aria-labelledby="about-title">
      <div className="about">
        <Reveal className="about__copy">
          <div>
            <p className="eyebrow">ABOUT</p>
            <h2 id="about-title" className="section-title">
              법인소개
            </h2>
            <div ref={leadRef} className="about__lead">
              {['경국의 포커스는 오로지', '고객이 지켜 온 ‘가치’에 집중되어 있습니다.'].map(
                (line, lineIndex) => (
                  <span className="about__lead-line" key={line}>
                    <CharReveal
                      text={line}
                      baseDelay={180 + lineIndex * 320}
                      step={28}
                      active={leadActive}
                    />
                  </span>
                ),
              )}
            </div>
          </div>
          <WordReveal
            className="about__points"
            lines={[
              '고객의 가치를',
              '“정확히 분석”하며',
              '“볼륨을 극대화” 하고,',
              '“영속성 있게 수호”하는 것',
            ]}
            baseDelay={2100}
            step={110}
            active={leadActive}
          />
          <div className="about__appeal" data-parallax data-parallax-strength="10">
            <LineReveal
              lines={[
                '감정평가사 자격 보유 변호사의 차별화된 전문성',
                '전문 인증 변호사의 철저한 법리분석',
                '소송 그 이후의 고민까지, 분야별 전문가의 협력공조',
              ]}
              baseDelay={3600}
              step={220}
              active={leadActive}
            />
          </div>
        </Reveal>
        <Reveal delay={160} className="about__media media-card">
          <ProgressiveImage
            className="media-card__img"
            src={HOME_ABOUT_IMAGE.src}
            preview={HOME_ABOUT_IMAGE.preview}
            alt="법인 소개 이미지"
          />
        </Reveal>
      </div>
    </section>
  )
}

export function PracticeSection() {
  const [hovered, setHovered] = useState<number | null>(null)
  const hasHover = hovered !== null

  return (
    <section id="practice" className="section section--tint" aria-labelledby="practice-title">
      <div className="practice-head">
        <Reveal>
          <p className="eyebrow">PRACTICE AREAS</p>
          <h2 id="practice-title" className="section-title">
            업무영역
          </h2>
        </Reveal>
        <Reveal delay={100} className="practice-head__desc">
          정비사업의 큰 틀을 주축으로 하되, 공익사업 업무를 동반하며, 파생업무나
          개별 사건 대응을 위한 분야별 전문팀이 구성되어 있습니다.
        </Reveal>
      </div>
      <div
        className={`practice-grid${hasHover ? ' is-hovering' : ''}`}
        data-parallax
        data-parallax-strength="18"
      >
        {practices.map((item, index) => {
          const isActive = hovered === index
          const isDimmed = hasHover && !isActive
          return (
            <a
              key={item.title}
              className="practice-card-link"
              href={resolveNavHref(item.to)}
              aria-label={`${item.title} 자세히 보기`}
            >
              <article
                className={`practice-card media-card${item.featured ? ' is-featured' : ''}${
                  isActive ? ' is-active' : ''
                }${isDimmed ? ' is-dimmed' : ''}`}
                onMouseEnter={() => setHovered(index)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(index)}
                onBlur={() => setHovered(null)}
              >
                <div className="practice-card__media">
                  <ProgressiveImage
                    className="media-card__img"
                    src={item.image.src}
                    preview={item.image.preview}
                    alt=""
                  />
                  {item.featured ? <div className="practice-card__shade" /> : null}
                </div>
                <div className="practice-card__top">
                  <span className="practice-card__line" />
                  <span>{item.no}</span>
                </div>
                <div className="practice-card__title" data-number={item.no}>
                  <span>{item.title}</span>
                  <img src={asset('assets/icon-link-white.svg')} alt="" />
                </div>
              </article>
            </a>
          )
        })}
      </div>
    </section>
  )
}

export function AchievementsSection() {
  return (
    <section className="section" id="achievements" aria-labelledby="achieve-title">
      <Reveal className="section-head__copy" style={{ marginBottom: 40 }}>
        <p className="eyebrow">ACHIEVEMENTS</p>
        <h2 id="achieve-title" className="section-title">
          실적
        </h2>
        <p className="section-desc">
          정비사업, 공익사업, 기타 분야별 업무 사례를 분야별로 연결합니다.
        </p>
      </Reveal>
      <div className="achieve-list" data-parallax data-parallax-strength="14">
        {achievements.map((item, index) => (
          <Reveal
            key={item.title}
            delay={index * 120}
            className={`achieve-row is-${item.align}`}
          >
            <div className="achieve-row__media media-card">
              <ProgressiveImage
                className="media-card__img"
                src={item.image.src}
                preview={item.image.preview}
                alt=""
              />
            </div>
            <div className="achieve-row__card">
              <div>
                <h3 className="achieve-row__title">{item.title}</h3>
                <p className="achieve-row__subtitle">
                  {item.badge ? (
                    <span className="achieve-row__badge">{item.badge}</span>
                  ) : null}
                  {item.subtitle}
                </p>
                <div className="achieve-row__body">
                  {item.body.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </div>
              <TextBtn label={item.cta} to={item.to} />
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

export function ProfessionalsSection() {
  const [hovered, setHovered] = useState<number | null>(null)
  const hasHover = hovered !== null

  const leaveTimerRef = useRef<number | null>(null)
  const clearLeaveTimer = () => {
    if (leaveTimerRef.current !== null) {
      window.clearTimeout(leaveTimerRef.current)
      leaveTimerRef.current = null
    }
  }

  const scheduleClear = (index: number) => {
    // Reset should be card-scoped: leaving the hovered card returns to default.
    // Use a short delay to avoid flicker when moving between adjacent cards.
    if (leaveTimerRef.current !== null) window.clearTimeout(leaveTimerRef.current)
    leaveTimerRef.current = window.setTimeout(() => {
      setHovered((v) => (v === index ? null : v))
      leaveTimerRef.current = null
    }, 80)
  }

  return (
    <section
      className={`section professionals${hasHover ? ' is-hovering' : ''}`}
      id="professionals" aria-labelledby="pro-title"
    >
      <div className="professionals__bg">
        <ProgressiveImage
          className="progressive-image--fill"
          src={HOME_PROFESSIONALS_BG.src}
          preview={HOME_PROFESSIONALS_BG.preview}
          alt=""
        />
      </div>
      <div className="professionals__inner">
        <div className="section-head">
          <Reveal>
            <p className="eyebrow">변호사 자문단</p>
            <h2 id="pro-title" className="section-title">
              PROFESSIONALS & ADVISORS
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <TextBtn
              label="변호사 자문단 보기"
              icon={asset('assets/icon-btn-white.svg')}
              to="/about/lawyers"
            />
          </Reveal>
        </div>
        <div className="pro-grid">
          {professionals.map((person, index) => {
            const isActive = hovered === index
            const isDimmed = hasHover && !isActive
            return (
              <a
                key={person.name}
                className="pro-card-link reveal"
                href={resolveNavHref(`/about/lawyers/${person.id}`)}
                aria-label={`${person.name} 변호사 프로필 보기`}
                data-reveal
                data-reveal-delay={index * 120}
                data-parallax
                data-parallax-strength={12 + index * 2}
              >
                <article
                  className={`pro-card${isActive ? ' is-active' : ''}${
                    isDimmed ? ' is-dimmed' : ''
                  }`}
                  onMouseEnter={() => {
                    clearLeaveTimer()
                    setHovered(index)
                  }}
                  onMouseLeave={() => {
                    if (hovered === index) scheduleClear(index)
                  }}
                  onFocus={() => {
                    clearLeaveTimer()
                    setHovered(index)
                  }}
                  onBlur={() => {
                    if (hovered === index) scheduleClear(index)
                  }}
                >
                <div className="pro-card__media">
                  <ProgressiveImage
                    className="progressive-image--fill"
                    src={person.image.src}
                    preview={person.image.preview}
                    alt={person.name}
                    objectPosition={person.imagePosition}
                  />
                </div>
                <div className="pro-card__veil" aria-hidden="true" />

                <div className="pro-card__default">
                  <p className="pro-card__role">{person.role}</p>
                  <p className="pro-card__name">{person.name}</p>
                  <div className="pro-card__tags">
                    {person.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </div>

                <div className="pro-card__hover">
                  <div className="pro-card__hover-top">
                    <p className="pro-card__name">{person.name}</p>
                    <p className="pro-card__role">{person.role}</p>
                  </div>
                  <div className="pro-card__hover-bottom">
                    <p className="pro-card__headline">{person.headline}</p>
                    <div className="pro-card__tags">
                      {person.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                    <div className="pro-card__bio">
                      {person.bio.map((line) => (
                        <p key={line}>{line}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function PressSection() {
  const trackRef = useRef<HTMLDivElement>(null)
  const nav = useCardTrackNav(trackRef)

  const items = pressItems.slice(0, 5)

  return (
    <section id="press" className="section press" aria-labelledby="press-title">
      <div className="section-head">
        <Reveal className="section-head__copy">
          <p className="eyebrow">PRESS</p>
          <h2 id="press-title" className="section-title">
            활동·보도
          </h2>
          <p className="section-desc">
            법무법인경국의 가치는 다양한 수상, 위촉, 인증 경력에서 더욱 빛을
            발합니다.
          </p>
        </Reveal>
        <Reveal delay={100}>
          <TextBtn label="전체보기" to="/press/coverage/tv" />
        </Reveal>
      </div>
      <CardTrackNav {...nav} label="활동·보도" />

      <div className="feature-gallery" ref={trackRef}>
        {items.map((item, index) => {
          const href = pressCardHref(item.chip)
          return (
            <Reveal
              key={`${item.title}-${item.desc}`}
              className="feature-gallery__item"
              delay={index * 80}
            >
              <GalleryCard
                title={item.title}
                desc={item.desc}
                date={item.date}
                href={href}
                label={`${item.chip} 활동·보도`}
                chip={item.chip}
              />
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}

export function AwardsSection() {
  const [active, setActive] = useState(2)
  const [visible, setVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const posRef = useRef({ x: 0, y: 0 })
  const rafRef = useRef(0)

  const movePreview = useCallback((clientX: number, clientY: number) => {
    const section = sectionRef.current
    const preview = previewRef.current
    if (!section || !preview) return

    const rect = section.getBoundingClientRect()
    const pw = preview.offsetWidth
    const ph = preview.offsetHeight
    const pad = 16

    let x = clientX - rect.left - pw / 2
    let y = clientY - rect.top - ph / 2
    x = Math.min(Math.max(pad, x), rect.width - pw - pad)
    y = Math.min(Math.max(pad, y), rect.height - ph - pad)

    posRef.current = { x, y }
    if (rafRef.current) return
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = 0
      const { x: px, y: py } = posRef.current
      preview.style.transform = `translate3d(${px}px, ${py}px, 0)`
    })
  }, [])

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const activeAward = awards[active] ?? awards[0]

  return (
    <section
      ref={sectionRef}
      className={`section section--dark awards-section${visible ? ' is-previewing' : ''}`}
      id="awards"
      aria-labelledby="awards-title"
    >
      <div className="awards">
        <Reveal>
          <p className="eyebrow">AWARDS</p>
          <h2 id="awards-title" className="section-title">
            수상·위촉·인증
          </h2>
          <p className="awards__desc">
            법무법인경국의 가치는 다양한 수상, 위촉, 인증 경력에서 더욱 빛을
            발합니다.
          </p>
          <TextBtn
            label="전체보기"
            icon={asset('assets/icon-btn-award.svg')}
            to="/about/history"
          />
        </Reveal>
        {/*
          Hover preview only while the pointer is inside the awards list.
          Leaving the list (copy column, section chrome, etc.) fades it out.
        */}
        <Reveal
          delay={120}
          className="awards__list"
          data-parallax
          data-parallax-strength="12"
          onMouseMove={(e) => {
            if (!visible) return
            movePreview(e.clientX, e.clientY)
          }}
          onMouseLeave={() => setVisible(false)}
        >
          {awards.map((item, index) => (
            <div
              key={item.title}
              className={`awards__item${active === index ? ' is-active' : ''}`}
              onMouseEnter={(e) => {
                setActive(index)
                setVisible(true)
                movePreview(e.clientX, e.clientY)
              }}
            >
              <span>{item.title}</span>
              <img
                src={
                  active === index
                    ? asset('assets/icon-award-active.svg')
                    : asset('assets/icon-award.svg')
                }
                alt=""
              />
            </div>
          ))}
        </Reveal>
      </div>

      <div
        ref={previewRef}
        className={`awards__preview media-card${visible ? ' is-visible' : ''}${
          activeAward.fit === 'contain' ? ' awards__preview--contain' : ''
        }`}
        aria-hidden={!visible}
      >
        <ProgressiveImage
          key={activeAward.title}
          className="media-card__img"
          src={activeAward.image.src}
          preview={activeAward.image.preview}
          objectFit={activeAward.fit ?? 'cover'}
          alt=""
        />
      </div>
    </section>
  )
}

export function SocialSection() {
  return (
    <section id="social" className="section social" aria-labelledby="social-title">
      <div className="social__bg">
        <ProgressiveImage
          className="progressive-image--fill"
          src={HOME_SOCIAL_BG.src}
          preview={HOME_SOCIAL_BG.preview}
          alt=""
        />
      </div>
      <div className="social__row">
        <Reveal>
          <p className="eyebrow">SOCIAL CONTRIBUTION</p>
          <h2 id="social-title" className="section-title">
            사회공헌
          </h2>
        </Reveal>
        <Reveal delay={140}>
          <WordReveal
            className="social__quote"
            lines={['“혼자서 빨리 뛰어가는 것 보다는”', '“다소 늦더라도 함께 걸어가는 것”']}
            baseDelay={180}
            step={130}
          />
          <p className="social__body">
            경국이 추구하는 또 하나의 가치,
            <br />
            한 번 더 우리의 주변을 돌아보고,
            <br />
            걸음이 무거운 분들과 동행하는 것에 있습니다.
          </p>
          <TextBtn
            label="전체보기"
            icon={asset('assets/icon-btn-social.svg')}
            to="/press/social"
          />
        </Reveal>
      </div>
    </section>
  )
}

export function OfficeSection() {
  return (
    <section id="office" className="section" aria-labelledby="office-title">
      <div className="office">
        <Reveal className="office__left">
          <div>
            <p className="eyebrow">OFFICE</p>
            <h2 id="office-title" className="section-title">
              고객의 하루 한 시간도 소중하게.
              <br />
              사건 처리의 속도가 다른 로펌.
            </h2>
            <p className="section-desc">
              대법원, 대검찰청, 중앙고등법원, 중앙고등검찰청, 등기국 등 주요
              법조기관 소재지에 위치합니다.
            </p>
          </div>
          <div className="office__info">
            <div className="office__info-row">
              <div className="office__icon">
                <img src={asset('assets/icon-tram.svg')} alt="" />
              </div>
              <div>
                <p className="office__info-title">지하철</p>
                <p className="office__info-text">
                  <span className="metro metro--2">2</span> 2호선 서초역 1번 출구
                  약 200m
                </p>
                <p className="office__info-text" style={{ marginTop: 6 }}>
                  <span className="metro metro--2">2</span>
                  <span className="metro metro--3">3</span> 2,3호선 교대역 9번 출구
                </p>
              </div>
            </div>
            <div className="office__info-row">
              <div className="office__icon">
                <img src={asset('assets/icon-parking.svg')} alt="" />
              </div>
              <div>
                <p className="office__info-title">주차</p>
                <p className="office__info-text">
                  1층 발렛주차 가능. (상담고객 1시간 무료, 시간당 1,000원.)
                  <br />
                  주차공간 협소, 가급적 대중교통 이용 권장
                </p>
              </div>
            </div>
          </div>
          <div className="office__chips">
            {OFFICE_CHIPS.map((label) => (
              <button key={label} type="button" className="office__chip">
                {label}
              </button>
            ))}
          </div>
        </Reveal>

        <Reveal delay={140} className="office__panel">
          <div className="office__map media-card">
            <ProgressiveImage
              className="media-card__img"
              src={HOME_OFFICE_MAP.src}
              preview={HOME_OFFICE_MAP.preview}
              alt="오피스 위치"
            />
          </div>
          <div className="office__panel-body">
            <div className="office__info-row">
              <div className="office__icon">
                <img src={asset('assets/icon-location.svg')} alt="" />
              </div>
              <div>
                <p className="office__info-title">서울특별시 서초구 서초대로 264, 15층</p>
                <p className="office__info-text">(서초동, 법조타워)</p>
              </div>
            </div>
            <div className="office__info-row">
              <div className="office__icon">
                <img src={asset('assets/icon-phone.svg')} alt="" />
              </div>
              <div>
                <p className="office__info-title">02-1111-1111</p>
                <p className="office__info-text">FAX 02-1111-1111</p>
              </div>
            </div>
            <div className="office__info-row">
              <div className="office__icon">
                <img src={asset('assets/icon-clock.svg')} alt="" />
              </div>
              <div>
                <p className="office__info-title">오전9시 ~ 오후10시</p>
                <p className="office__info-text">365일 24시간 상담 및 긴급대응 가능</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
