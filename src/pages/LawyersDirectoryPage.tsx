import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ProgressiveImage } from '../components/ProgressiveImage'
import { SubVisual } from '../components/sub/SubVisual'
import { ADVISORS, type Advisor } from '../data/advisors'
import {
  LAWYER_CARDS,
  LAWYERS_PAGE,
  type LawyerCard,
} from '../data/lawyers'
import { asset } from '../utils/asset'
import './LawyersDirectory.css'

const ARROW_DEFAULT_SRC = asset('assets/icon-member-arrow.svg')
const ARROW_HOVER_SRC = asset('assets/icon-member-arrow-hover.svg')
const CLOSE_SRC = asset('assets/icon-close.svg')
const BULLET_SRC = asset('assets/icon-bullet.svg')

function MemberCard({
  name,
  title,
  highlights,
  photo,
  photoPreview,
  onActivate,
  href,
}: {
  name: string
  title: string
  highlights: string[]
  photo: string
  photoPreview?: string
  onActivate?: () => void
  href?: string
}) {
  const body = (
    <>
      <div className="ld-card__photo">
        {photoPreview ? (
          <ProgressiveImage
            className="ld-card__progressive"
            imgClassName="ld-card__img"
            src={photo}
            preview={photoPreview}
            alt=""
            objectFit="cover"
            objectPosition="top center"
          />
        ) : (
          <img className="ld-card__img" src={photo} alt="" />
        )}
      </div>
      <div className="ld-card__body">
        <div className="ld-card__head">
          <div className="ld-card__name-wrap">
            <p className="ld-card__name">{name}</p>
            <p className="ld-card__role">{title}</p>
          </div>
          <span className="ld-card__arrow" aria-hidden="true">
            <img
              className="ld-card__arrow-img ld-card__arrow-img--default"
              src={ARROW_DEFAULT_SRC}
              alt=""
            />
            <img
              className="ld-card__arrow-img ld-card__arrow-img--hover"
              src={ARROW_HOVER_SRC}
              alt=""
            />
          </span>
        </div>
        <div className="ld-card__rule" aria-hidden="true" />
        <ul className="ld-card__highlights">
          {highlights.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </div>
    </>
  )

  if (href) {
    return (
      <Link className="ld-card" to={href} data-name="list">
        {body}
      </Link>
    )
  }

  return (
    <button
      type="button"
      className="ld-card"
      data-name="list"
      onClick={onActivate}
    >
      {body}
    </button>
  )
}

function AdvisorDrawer({
  advisor,
  open,
  onClose,
}: {
  advisor: Advisor | null
  open: boolean
  onClose: () => void
}) {
  const titleId = useId()
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <div
      className={`ld-drawer${open ? ' is-open' : ''}`}
      aria-hidden={!open}
    >
      <button
        type="button"
        className="ld-drawer__scrim"
        tabIndex={open ? 0 : -1}
        aria-label="자문단 프로필 닫기"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        className="ld-drawer__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="ld-drawer__bar">
          <p className="ld-drawer__eyebrow">자문단</p>
          <button
            ref={closeRef}
            type="button"
            className="ld-drawer__close"
            onClick={onClose}
            aria-label="닫기"
          >
            <img src={CLOSE_SRC} alt="" />
          </button>
        </div>
        {advisor ? (
          <div className="ld-drawer__content">
            <div className="ld-drawer__photo">
              <ProgressiveImage
                className="ld-drawer__progressive"
                imgClassName="ld-drawer__img"
                src={advisor.photo}
                preview={advisor.photoPreview}
                alt={`${advisor.name} ${advisor.title}`}
                objectFit="cover"
                objectPosition="top center"
                priority
              />
            </div>
            <div className="ld-drawer__meta">
              <h2 id={titleId} className="ld-drawer__name">
                {advisor.name}
              </h2>
              <p className="ld-drawer__role">{advisor.title}</p>
              <div className="ld-drawer__rule" aria-hidden="true" />
              <div className="ld-drawer__sections">
                {advisor.sections.map((section) => (
                  <section
                    key={section.title}
                    className="ld-drawer__section"
                    aria-label={section.title}
                  >
                    <h3 className="ld-drawer__section-title">{section.title}</h3>
                    <ul className="ld-drawer__highlights">
                      {section.items.map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                  </section>
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
 * 법무법인경국 > 변호사 · 자문단 entry (Figma 105:1229).
 * Lawyer cards → profile routes; advisor cards → in-page drawer (no route).
 */
export function LawyersDirectoryPage() {
  const [advisorId, setAdvisorId] = useState<string | null>(null)
  const advisor = ADVISORS.find((a) => a.id === advisorId) ?? null
  const open = !!advisorId

  const closeAdvisor = useCallback(() => setAdvisorId(null), [])

  return (
    <div className="ld" data-name="SUB_법무법인경국_변호사자문단">
      <div className="ld__top" data-name="SUB_LAYOUT">
        <SubVisual
          parentLabel={LAWYERS_PAGE.parentLabel}
          title={LAWYERS_PAGE.title}
          image={LAWYERS_PAGE.visual}
          imagePreview={LAWYERS_PAGE.visualPreview}
          visualKey="sub-01-03"
        />
      </div>

      <div className="ld__main">
        <section className="ld__section" aria-labelledby="ld-lawyers-title">
          <div className="ld__section-head">
            <img className="ld__bullet" src={BULLET_SRC} alt="" />
            <h2 id="ld-lawyers-title" className="ld__section-title">
              변호사단
            </h2>
          </div>
          <ul className="ld__grid ld__grid--lawyers">
            {LAWYER_CARDS.map((card: LawyerCard) => (
              <li key={card.id}>
                <MemberCard
                  name={card.name}
                  title={card.title}
                  highlights={card.highlights}
                  photo={card.photo}
                  photoPreview={card.photoPreview}
                  href={card.href}
                />
              </li>
            ))}
          </ul>
        </section>

        <section className="ld__section" aria-labelledby="ld-advisors-title">
          <div className="ld__section-head">
            <img className="ld__bullet" src={BULLET_SRC} alt="" />
            <h2 id="ld-advisors-title" className="ld__section-title">
              자문단
            </h2>
          </div>
          <ul className="ld__grid ld__grid--advisors">
            {ADVISORS.map((a) => (
              <li key={a.id}>
                <MemberCard
                  name={a.name}
                  title={a.title}
                  highlights={a.highlights}
                  photo={a.photo}
                  photoPreview={a.photoPreview}
                  onActivate={() => setAdvisorId(a.id)}
                />
              </li>
            ))}
          </ul>
        </section>
      </div>

      <AdvisorDrawer advisor={advisor} open={open} onClose={closeAdvisor} />
    </div>
  )
}
