import { SubVisual } from '../components/sub/SubVisual'
import { CASE_STUDIES, CASE_STUDIES_PAGE } from '../data/caseStudies'
import './CaseStudies.css'

/**
 * 활동·보도 > 업무사례 (sub-04-01).
 * Grid hover: hovered card stays highlighted; siblings dim (Figma note).
 */
export function CaseStudiesPage() {
  return (
    <div className="case-studies" data-name="SUB_활동보도_업무사례">
      <div className="case-studies__top" data-name="SUB_LAYOUT">
        <SubVisual
          parentLabel={CASE_STUDIES_PAGE.parentLabel}
          title={CASE_STUDIES_PAGE.title}
          image={CASE_STUDIES_PAGE.visual}
          visualKey="sub-04-01"
        />
      </div>

      <div className="case-studies__main">
        <section
          className="case-studies__contents"
          data-name="Contents"
          aria-label="업무사례 목록"
        >
          {/*
            Hover contract (Figma):
            `.case-studies__grid:hover .case-card` → dim
            `.case-card:hover` → full opacity + lift shadow
          */}
          <ul className="case-studies__grid" data-name="list_wrap">
            {CASE_STUDIES.map((item) => (
              <li key={item.id} className="case-card" data-name="list">
                <p className="case-card__category">{item.category}</p>
                <p className="case-card__result">{item.result}</p>
                <p className="case-card__detail">{item.detail}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
