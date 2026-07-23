import { SubVisual } from '../components/sub/SubVisual'
import { LOCATION_PAGE } from '../data/location'
import './LocationPage.css'

function InfoIcon({ src, alt = '' }: { src: string; alt?: string }) {
  return <span className="location-page__icon"><img src={src} alt={alt} /></span>
}

/** 법무법인경국 > 오시는 길 (Figma sub-01-06). */
export function LocationPage() {
  return (
    <div className="location-page" data-name="SUB_법무법인경국_오시는길">
      <SubVisual
        parentLabel={LOCATION_PAGE.parentLabel}
        title={LOCATION_PAGE.title}
        image={LOCATION_PAGE.visual}
        imagePreview={LOCATION_PAGE.visualPreview}
        visualKey="sub-01-06"
      />
      <main className="location-page__main">
        <div className="location-page__contents">
          <header className="location-page__heading">
            <div className="location-page__section-title">
              <p>Office</p>
              <h1>오시는 길</h1>
            </div>
            <div className="location-page__intro">
              <h2>{LOCATION_PAGE.lead.map((line) => <span key={line}>{line}</span>)}</h2>
              <p>{LOCATION_PAGE.description}</p>
            </div>
          </header>

          <section className="location-page__map" aria-label="법무법인 경국 지도 위치">
            <p>지도 연결해주세요</p>
          </section>

          <section className="location-page__details" aria-label="오시는 길 상세 정보">
            <div className="location-page__access">
              <div className="location-page__access-list">
                <div className="location-page__row">
                  <InfoIcon src={LOCATION_PAGE.icons.tram} />
                  <div>
                    <h3>지하철</h3>
                    <p><span className="location-page__metro location-page__metro--2">2</span>2호선 서초역 1번 출구 약 200m</p>
                    <p><span className="location-page__metro location-page__metro--2">2</span><span className="location-page__metro location-page__metro--3">3</span>2,3호선 교대역 9번 출구</p>
                  </div>
                </div>
                <div className="location-page__row">
                  <InfoIcon src={LOCATION_PAGE.icons.parking} />
                  <div>
                    <h3>주차</h3>
                    <p>1층 발렛주차 가능. (상담고객 1시간 무료, 시간당 1,000원.)<br />주차공간 협소, 가급적 대중교통 이용 권장</p>
                  </div>
                </div>
              </div>
              <div className="location-page__chips" aria-label="오시는 길 서비스">
                <span>네이버 예약</span><span className="is-accent">SMS 약도 전송</span><span>카카오내비</span><span>티맵 연결</span>
              </div>
            </div>

            <div className="location-page__contact">
              <div className="location-page__row">
                <InfoIcon src={LOCATION_PAGE.icons.location} />
                <div><h3>{LOCATION_PAGE.address}</h3><p>{LOCATION_PAGE.addressDetail}</p></div>
              </div>
              <div className="location-page__row">
                <InfoIcon src={LOCATION_PAGE.icons.phone} />
                <div><h3>02-598-0350</h3><p>FAX 02-598-0870</p></div>
              </div>
              <div className="location-page__row">
                <InfoIcon src={LOCATION_PAGE.icons.clock} />
                <div><h3>오전 9시 ~ 오후 10시</h3><p>365일 24시간 상담 및 긴급대응 가능</p></div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
