import { SubVisual } from '../components/sub/SubVisual'
import {
  CONSULT_CONTACT,
  CONSULT_INTRO,
  CONSULT_PAGE,
  CONSULT_SNS,
} from '../data/consult'
import { asset } from '../utils/asset'
import './Consult.css'

const PHONE_SRC = asset('assets/icon-call.svg')
const MAIL_SRC = asset('assets/icon-mail.svg')

/**
 * 소식 · 공지 > 상담신청 (Figma SUB_소식공지_상담문의 / node 100:723).
 * Static single page (no local tabs): SubVisual(sub-05-01) → 2-col split
 * (좌 eyebrow+타이틀 / 우 리드 + 연락처·SNS 카드). ≤1024 stacks to 1 column.
 */
export function ConsultPage() {
  return (
    <div className="consult" data-name="SUB_소식공지_상담문의">
      <div className="consult__visual" data-name="SUB_LAYOUT">
        <SubVisual
          parentLabel={CONSULT_PAGE.parentLabel}
          title={CONSULT_PAGE.title}
          image={CONSULT_PAGE.visual}
          imagePreview={CONSULT_PAGE.visualPreview}
          visualKey="sub-05-01"
        />
      </div>

      <main className="consult__main">
        <div className="consult__inner" data-name="Contents">
          <div className="consult-head" data-name="Block_left">
            <p className="consult-head__eyebrow">{CONSULT_INTRO.eyebrow}</p>
            <h2 className="consult-head__title">
              {CONSULT_INTRO.heading.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h2>
          </div>

          <div className="consult-body" data-name="block_right">
            <p className="consult-body__lead">
              {CONSULT_INTRO.lead.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </p>

            <div className="consult-card">
              <section
                className="consult-card__section"
                aria-label={CONSULT_CONTACT.label}
              >
                <p className="consult-card__label">{CONSULT_CONTACT.label}</p>
                <p className="consult-contact">
                  <img className="consult-contact__icon" src={PHONE_SRC} alt="" />
                  <span>{CONSULT_CONTACT.phone}</span>
                </p>
                <p className="consult-contact">
                  <img className="consult-contact__icon" src={MAIL_SRC} alt="" />
                  <a href={`mailto:${CONSULT_CONTACT.email}`}>
                    {CONSULT_CONTACT.email}
                  </a>
                </p>
              </section>

              <span className="consult-card__divider" aria-hidden="true" />

              <section
                className="consult-card__section"
                aria-label={CONSULT_SNS.label}
              >
                <p className="consult-card__label">{CONSULT_SNS.label}</p>
                {CONSULT_SNS.links.map((link) => (
                  <a key={link.id} className="consult-sns" href={link.href}>
                    <span className="consult-sns__icon" aria-hidden="true">
                      <img src={asset(`assets/${link.icon}`)} alt="" />
                    </span>
                    <span className="consult-sns__text">{link.text}</span>
                  </a>
                ))}
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
