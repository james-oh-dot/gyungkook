import { useState } from 'react'
import { Reveal } from '../Reveal'
import { asset } from '../../utils/asset'
import {
  achievements,
  awards,
  notices,
  practices,
  pressItems,
  professionals,
} from '../../data/content'

function TextBtn({
  label,
  icon = asset('assets/icon-btn.svg'),
}: {
  label: string
  icon?: string
}) {
  return (
    <button type="button" className="text-btn">
      <span>{label}</span>
      <img src={icon} alt="" />
    </button>
  )
}

export function NoticeSection() {
  return (
    <section className="section" aria-labelledby="notice-title">
      <div className="section-head">
        <Reveal className="section-head__copy">
          <p className="eyebrow">NOTICE</p>
          <h2 id="notice-title" className="section-title">
            소식·공지
          </h2>
          <p className="section-desc">
            법무법인경국의 가치는 다양한 수상, 위촉, 인증 경력에서 더욱 빛을
            발합니다.
          </p>
        </Reveal>
        <Reveal delay={120}>
          <TextBtn label="전체보기" />
        </Reveal>
      </div>
      <div className="notice-grid">
        {notices.map((item, index) => (
          <Reveal key={item.title} delay={index * 120} className="notice-card media-card">
            <div className="notice-card__media media-card">
              <img className="media-card__img" src={item.image} alt="" />
            </div>
            <img className="notice-card__icon" src={asset('assets/icon-link.svg')} alt="" />
            <div className="notice-card__overlay">
              <h3 className="notice-card__title">{item.title}</h3>
              <p className="notice-card__desc">{item.desc}</p>
              <p className="notice-card__date">{item.date}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

export function AboutSection() {
  return (
    <section className="section section--gray" aria-labelledby="about-title">
      <div className="about">
        <Reveal className="about__copy">
          <div>
            <p className="eyebrow">ABOUT</p>
            <h2 id="about-title" className="section-title">
              법인소개
            </h2>
            <p className="about__lead">
              경국의 포커스는 오로지
              <br />
              고객이 지켜 온 ‘가치’에 집중되어 있습니다.
            </p>
          </div>
          <div className="about__points">
            <p>고객의 가치를</p>
            <p>“정확히 분석”하며</p>
            <p>“볼륨을 극대화” 하고,</p>
            <p>“영속성 있게 수호”하는 것</p>
          </div>
        </Reveal>
        <Reveal delay={160} className="about__media media-card">
          <img className="media-card__img" src={asset('assets/about.jpg')} alt="법인 소개 이미지" />
        </Reveal>
      </div>
      <Reveal delay={220} className="about__appeal">
        <span>감정평가사 자격 보유 변호사의 차별화된 전문성</span>
        <span className="about__appeal-divider" />
        <span>전문 인증 변호사의 철저한 법리분석</span>
        <span className="about__appeal-divider" />
        <span>소송 그 이후의 고민까지, 분야별 전문가의 협력공조</span>
      </Reveal>
    </section>
  )
}

export function PracticeSection() {
  return (
    <section className="section" aria-labelledby="practice-title">
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
      <div className="practice-grid">
        {practices.map((item, index) => (
          <Reveal
            key={item.title}
            delay={index * 100}
            className={`practice-card media-card${item.featured ? ' is-featured' : ''}`}
          >
            <div className="practice-card__media">
              <img className="media-card__img" src={item.image} alt="" />
              {item.featured ? <div className="practice-card__shade" /> : null}
            </div>
            <div className="practice-card__top">
              <span className="practice-card__line" />
              <span>{item.no}</span>
            </div>
            <div className="practice-card__title">
              <span>{item.title}</span>
              <img src={asset('assets/icon-link-white.svg')} alt="" />
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

export function AchievementsSection() {
  return (
    <section className="section section--gray" aria-labelledby="achieve-title">
      <Reveal className="section-head__copy" style={{ marginBottom: 40 }}>
        <p className="eyebrow">ACHIEVEMENTS</p>
        <h2 id="achieve-title" className="section-title">
          실적
        </h2>
        <p className="section-desc">
          정비사업, 공익사업, 기타 분야별 업무 사례를 분야별로 연결합니다.
        </p>
      </Reveal>
      <div className="achieve-list">
        {achievements.map((item, index) => (
          <Reveal
            key={item.title}
            delay={index * 120}
            className={`achieve-row is-${item.align}`}
          >
            <div className="achieve-row__media media-card">
              <img className="media-card__img" src={item.image} alt="" />
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
              <TextBtn label={item.cta} />
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

export function ProfessionalsSection() {
  return (
    <section className="section professionals" aria-labelledby="pro-title">
      <div className="professionals__bg">
        <img src={asset('assets/professionals-bg.jpg')} alt="" />
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
            <TextBtn label="변호사 자문단 보기" icon={asset('assets/icon-btn-white.svg')} />
          </Reveal>
        </div>
        <div className="pro-grid">
          {professionals.map((person, index) => (
            <Reveal key={person.name} delay={index * 90} className="pro-card media-card">
              <div className="pro-card__media">
                <img className="media-card__img" src={person.image} alt={person.name} />
              </div>
              <div className="pro-card__body">
                <p className="pro-card__role">{person.role}</p>
                <p className="pro-card__name">{person.name}</p>
                <div className="pro-card__tags">
                  {person.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export function PressSection() {
  return (
    <section className="section" aria-labelledby="press-title">
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
          <TextBtn label="전체보기" />
        </Reveal>
      </div>
      <div className="press-track">
        {pressItems.map((item, index) => (
          <Reveal key={item.title} delay={index * 100} className="press-card">
            <div className="press-card__media media-card">
              <img className="media-card__img" src={item.image} alt="" />
            </div>
            <div>
              <div className="press-card__title">
                <span className="press-card__chip">{item.chip}</span>
                <span>{item.title}</span>
              </div>
              <p className="press-card__desc">{item.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
      <div className="press-gage" aria-hidden="true">
        <span />
      </div>
    </section>
  )
}

export function AwardsSection() {
  const [active, setActive] = useState(2)

  return (
    <section className="section section--dark" aria-labelledby="awards-title">
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
          <TextBtn label="전체보기" icon={asset('assets/icon-btn-award.svg')} />
        </Reveal>
        <Reveal delay={120} className="awards__list">
          {awards.map((item, index) => (
            <div
              key={item}
              className={`awards__item${active === index ? ' is-active' : ''}`}
              onMouseEnter={() => setActive(index)}
            >
              <span>{item}</span>
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
          <div className="awards__preview media-card">
            <img className="media-card__img" src={asset('assets/award-hover.jpg')} alt="" />
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export function SocialSection() {
  return (
    <section className="section social" aria-labelledby="social-title">
      <div className="social__bg">
        <img src={asset('assets/social-bg.jpg')} alt="" />
      </div>
      <div className="social__row">
        <Reveal>
          <p className="eyebrow">SOCIAL CONTRIBUTION</p>
          <h2 id="social-title" className="section-title">
            사회공헌
          </h2>
        </Reveal>
        <Reveal delay={140}>
          <div className="social__quote">
            <p>“혼자서 빨리 뛰어가는 것 보다는”</p>
            <p>“다소 늦더라도 함께 걸어가는 것”</p>
          </div>
          <p className="social__body">
            경국이 추구하는 또 하나의 가치,
            <br />
            한 번 더 우리의 주변을 돌아보고,
            <br />
            걸음이 무거운 분들과 동행하는 것에 있습니다.
          </p>
          <TextBtn label="전체보기" icon={asset('assets/icon-btn-social.svg')} />
        </Reveal>
      </div>
    </section>
  )
}

export function OfficeSection() {
  return (
    <section className="section" aria-labelledby="office-title">
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
            <span className="office__chip">네이버 예약</span>
            <span className="office__chip is-active">SMS 약도 전송</span>
            <span className="office__chip">카카오내비</span>
            <span className="office__chip">티맵 연결</span>
          </div>
        </Reveal>

        <Reveal delay={140} className="office__panel">
          <div className="office__map media-card">
            <img className="media-card__img" src={asset('assets/office-map.jpg')} alt="오피스 위치" />
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
