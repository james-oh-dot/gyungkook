import { HOME_PARTNER_LOGOS } from '../data/content'
import './PartnerMarquee.css'

/**
 * Home footer partner strip — monochrome logos drifting continuously.
 *
 * The list is rendered twice: the CSS loop translates the track by exactly
 * -50%, which lands copy 2 where copy 1 began, so the scroll never seams.
 * Copy 2 is `aria-hidden` so assistive tech reads the set once.
 *
 * Logos carry `alt=""`: the source data is a bare list of image paths with no
 * company names attached, and inventing them would put fabricated
 * organisation names into the accessibility tree. The region label announces
 * what the strip is instead.
 */
export function PartnerMarquee() {
  return (
    <section className="partner-marquee" aria-label="협력사">
      <div className="partner-marquee__track">
        {HOME_PARTNER_LOGOS.map((src) => (
          <div className="partner-marquee__item" key={src}>
            <img src={src} alt="" loading="lazy" draggable={false} />
          </div>
        ))}
        {HOME_PARTNER_LOGOS.map((src) => (
          <div
            className="partner-marquee__item"
            key={`dup-${src}`}
            aria-hidden="true"
          >
            <img src={src} alt="" loading="lazy" draggable={false} />
          </div>
        ))}
      </div>
    </section>
  )
}
