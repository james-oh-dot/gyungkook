import {
  CAREERS_CONTACT,
  CAREERS_INTRO,
  CAREERS_VALUES,
} from '../data/careers'
import { asset } from '../utils/asset'

const PHONE_SRC = asset('assets/icon-call.svg')
const MAIL_SRC = asset('assets/icon-mail.svg')

/**
 * 인재영입 info tab (Figma 99:5934) — centered intro + 3 value cards +
 * dark 수시지원 contact block.
 */
export function CareersInfoPage() {
  return (
    <div className="news-board__contents careers-info" data-name="Contents">
      <p className="careers-intro">
        {CAREERS_INTRO.map((line) => (
          <span key={line} className="careers-intro__line">
            {line}
          </span>
        ))}
      </p>

      <ul className="careers-values" aria-label="인재상">
        {CAREERS_VALUES.map((v) => (
          <li key={v.title} className="careers-value">
            <p className="careers-value__title">{v.title}</p>
            <p className="careers-value__desc">
              {v.lines.map((l) => (
                <span key={l} className="careers-value__line">
                  {l}
                </span>
              ))}
            </p>
            <img className="careers-value__icon" src={v.icon} alt="" />
          </li>
        ))}
      </ul>

      <section className="careers-contact" aria-label="지원 문의">
        <h2 className="careers-contact__title">{CAREERS_CONTACT.title}</h2>
        {CAREERS_CONTACT.groups.map((g, i) => (
          <div key={g.label} className="careers-contact__group">
            {i > 0 ? (
              <span className="careers-contact__divider" aria-hidden="true" />
            ) : null}
            <div className="careers-contact__col">
              <p className="careers-contact__label">{g.label}</p>
              <p className="careers-contact__row">
                <img src={PHONE_SRC} alt="" />
                <a href={`tel:${g.phone.replace(/-/g, '')}`}>{g.phone}</a>
              </p>
              <p className="careers-contact__row">
                <img src={MAIL_SRC} alt="" />
                <a href={`mailto:${g.mail}`}>{g.mail}</a>
              </p>
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}
