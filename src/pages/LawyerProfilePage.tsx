import { Navigate, useParams } from 'react-router-dom'
import type { ReactNode } from 'react'
import { LocalTabs } from '../components/sub/LocalTabs'
import { ProgressiveImage } from '../components/ProgressiveImage'
import {
  DEFAULT_LAWYER_ID,
  findLawyer,
  LAWYERS,
  lawyerPath,
  type CertItem,
  type Lawyer,
} from '../data/lawyers'
import { asset } from '../utils/asset'
import { progressiveAsset } from '../utils/progressiveImage'
import './LawyerProfile.css'

const BULLET_SRC = asset('assets/icon-bullet.svg')
const ARROW_SRC = asset('assets/icon-arrow.svg')
const SHARE_SRC = asset('assets/icon-share.svg')
const DOWNLOAD_SRC = asset('assets/icon-download.svg')
const HERO = progressiveAsset('assets/sub/sub-01-03')

/** Share the current lawyer page (native share sheet, else copy the link). */
function shareLawyer(name: string) {
  const url = window.location.href
  if (typeof navigator.share === 'function') {
    navigator.share({ title: `${name} 변호사 · 법무법인 경국`, url }).catch(() => {})
  } else {
    navigator.clipboard?.writeText(url).catch(() => {})
  }
}

/** Label + content row (alternating tint via CSS :nth-child). */
function Block({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section className="lawyer-block">
      <div className="lawyer-block__label">
        <img className="lawyer-block__icon" src={BULLET_SRC} alt="" />
        <h2 className="lawyer-block__title">{label}</h2>
      </div>
      <div className="lawyer-block__content">{children}</div>
    </section>
  )
}

function Chips({ items }: { items: string[] }) {
  return (
    <div className="lawyer-chips">
      {items.map((i) => (
        <span key={i} className="lawyer-chip">
          {i}
        </span>
      ))}
    </div>
  )
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="lawyer-bullets">
      {items.map((i) => (
        <li key={i}>{i}</li>
      ))}
    </ul>
  )
}

function ResultBlock({
  label,
  items,
  moreLabel,
}: {
  label: string
  items: string[]
  moreLabel: string
}) {
  if (!items.length) return null
  return (
    <Block label={label}>
      <div className="lawyer-result">
        <Bullets items={items} />
        <button type="button" className="lawyer-more">
          {moreLabel}
          <img className="lawyer-more__icon" src={ARROW_SRC} alt="" />
        </button>
      </div>
    </Block>
  )
}

function CertGrid({ label, items }: { label: string; items: CertItem[] }) {
  if (!items.length) return null
  return (
    <Block label={label}>
      <div className="lawyer-cert-grid">
        {items.map((item) => (
          <figure key={item.label} className="lawyer-cert">
            <div className="lawyer-cert__frame">
              {item.image ? <img src={item.image} alt={item.label} /> : null}
            </div>
            <figcaption className="lawyer-chip">{item.label}</figcaption>
          </figure>
        ))}
      </div>
    </Block>
  )
}

function LawyerHero({ lawyer }: { lawyer: Lawyer }) {
  const hasContact = !!(lawyer.phone || lawyer.fax || lawyer.email)
  return (
    <section className="lawyer-hero" aria-label={`${lawyer.name} 변호사`}>
      <ProgressiveImage
        className="lawyer-hero__bg"
        src={HERO.src}
        preview={HERO.preview}
        alt=""
        priority
        objectFit="cover"
      />
      <div className="lawyer-hero__scrim" aria-hidden="true" />
      <div className="lawyer-hero__inner">
        <div className="lawyer-hero__info">
          <div className="lawyer-hero__name-row">
            <h1 className="lawyer-hero__name">{lawyer.name}</h1>
            <p className="lawyer-hero__title">{lawyer.title}</p>
          </div>
          {hasContact ? (
            <p className="lawyer-hero__contact">
              {[lawyer.phone, lawyer.fax, lawyer.email]
                .filter(Boolean)
                .map((c) => (
                  <span key={c}>{c}</span>
                ))}
            </p>
          ) : null}
          {/* Figma Line 6 — divider extends past the text to the portrait centre */}
          <span className="lawyer-hero__divider" aria-hidden="true" />
          <ul className="lawyer-hero__intro">
            {lawyer.intro.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
        <div className="lawyer-hero__photo">
          {lawyer.photoPreview ? (
            <ProgressiveImage
              className="lawyer-hero__photo-progressive"
              imgClassName="lawyer-hero__photo-img"
              src={lawyer.photo}
              preview={lawyer.photoPreview}
              alt={`${lawyer.name} 변호사`}
              objectFit="cover"
              objectPosition="top center"
              priority
            />
          ) : (
            <img src={lawyer.photo} alt={`${lawyer.name} 변호사`} />
          )}
        </div>
      </div>
    </section>
  )
}

/**
 * 법무법인 경국 > 변호사자문단 (sub-01-03).
 * Route-mode local tabs (each tab = a lawyer page). GNB/menu entry & tab switch
 * reveal the new hero at the top (routeState={null} → ScrollToTop).
 */
export function LawyerProfilePage() {
  const { lawyerId } = useParams<{ lawyerId: string }>()
  const lawyer = findLawyer(lawyerId)
  if (!lawyer) {
    return <Navigate to={lawyerPath(DEFAULT_LAWYER_ID)} replace />
  }

  const tabs = LAWYERS.map((l) => ({ id: l.id, label: l.tabLabel }))
  const hasCareers = lawyer.careers.some((c) => c.length > 0)

  return (
    <div className="lawyer" data-name="SUB_법무법인경국_변호사자문단">
      <LawyerHero lawyer={lawyer} />

      <LocalTabs
        tabs={tabs}
        activeTab={lawyer.id}
        toTab={lawyerPath}
        routeState={null}
        ariaLabel="변호사자문단 로컬 메뉴"
      />

      <main className="lawyer-main">
        {/* Figma `btn` — 공유하기 + PDF 다운받기, top-right of the content */}
        <div className="lawyer-toolbar">
          <button
            type="button"
            className="lawyer-action"
            onClick={() => shareLawyer(lawyer.name)}
            aria-label="공유하기"
          >
            <img src={SHARE_SRC} alt="" />
          </button>
          <button
            type="button"
            className="lawyer-action"
            onClick={() => window.print()}
            aria-label="PDF 다운받기"
          >
            <img src={DOWNLOAD_SRC} alt="" />
          </button>
        </div>

        <div className="lawyer-blocks">
          {lawyer.practiceAreas.length ? (
            <Block label="주요업무분야">
              <Chips items={lawyer.practiceAreas} />
            </Block>
          ) : null}

          {lawyer.specialties.length ? (
            <Block label="전문분야">
              <Chips items={lawyer.specialties} />
            </Block>
          ) : null}

          {lawyer.education.length ? (
            <Block label="학력">
              <Chips items={lawyer.education} />
            </Block>
          ) : null}

          {hasCareers ? (
            <Block label="경력 · 활동">
              <div className="lawyer-cols">
                {lawyer.careers.map((col, i) =>
                  col.length ? <Bullets key={i} items={col} /> : null,
                )}
              </div>
            </Block>
          ) : null}

          {lawyer.books.length ? (
            <Block label="저서">
              <Bullets items={lawyer.books} />
            </Block>
          ) : null}

          {lawyer.lectures.length ? (
            <Block label="강의">
              <Bullets items={lawyer.lectures} />
            </Block>
          ) : null}

          <ResultBlock
            label="실적(정비사업 등)"
            items={lawyer.renewalResults}
            moreLabel="정비사업 실적 더보기"
          />
          <ResultBlock
            label="실적(공익사업 등)"
            items={lawyer.publicResults}
            moreLabel="공익사업 실적 더보기"
          />

          <CertGrid label="전문 인증서" items={lawyer.certificates} />
          <CertGrid label="위촉 · 임명" items={lawyer.appointments} />
          <CertGrid label="수상" items={lawyer.awards} />
        </div>
      </main>
    </div>
  )
}
