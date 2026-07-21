import { Fragment } from 'react'
import { ProgressiveImage } from '../components/ProgressiveImage'
import { SubVisual } from '../components/sub/SubVisual'
import { GREETING_PAGE } from '../data/greeting'
import './Greeting.css'

/**
 * 법무법인경국 > 대표 인사말 (sub-01-02).
 * Static page (no local tabs): hero_type2 (no chip) → CEO photo →
 * two-column greeting (heading left / body + signature right). Tablet keeps the
 * two columns; mobile (≤767) stacks to one. GNB entry keeps the visual at top.
 */
export function GreetingPage() {
  const p = GREETING_PAGE
  return (
    <div className="greeting" data-name="SUB_법무법인경국_대표인사말">
      <div className="greeting__visual" data-name="SUB_LAYOUT">
        <SubVisual
          parentLabel={p.parentLabel}
          title={p.title}
          image={p.visual}
          imagePreview={p.visualPreview}
          visualKey="sub-01-02"
          showChip={false}
        />
      </div>

      <main className="greeting__main">
        <figure className="greeting__photo">
          <ProgressiveImage
            className="greeting__photo-progressive"
            src={p.portrait}
            preview={p.portraitPreview}
            alt="법무법인 경국 대표변호사 공대호"
            objectFit="cover"
          />
        </figure>

        <div className="greeting__about">
          <div className="greeting__head">
            <p className="greeting__eyebrow">{p.eyebrow}</p>
            <h2 className="greeting__heading">
              {p.heading.map((line) => (
                <span key={line} className="greeting__heading-line">
                  {line}
                </span>
              ))}
            </h2>
          </div>

          <div className="greeting__body">
            {p.blocks.map((block, i) => (
              <p key={i} className="greeting__para">
                {block.map((line, j) => (
                  <Fragment key={j}>
                    {line}
                    {j < block.length - 1 ? <br /> : null}
                  </Fragment>
                ))}
              </p>
            ))}
            <img
              className="greeting__sign"
              src={p.signature}
              alt={p.signatureAlt}
              width={184}
              height={72}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
