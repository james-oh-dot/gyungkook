import { asset } from '../utils/asset'
import './Footer.css'

const PHONES = [
  { label: '행정/송무', tel: '02-598-0350' },
  { label: '무료법률상담', tel: '02-598-0353' },
] as const

const META = [
  { label: '사업자등록번호', value: '460-87-03078' },
  { label: '대표변호사', value: '공대호' },
  { label: '광고책임변호사', value: '공대호' },
] as const

const SNS = [
  { name: 'Naver', href: '#', icon: 'assets/footer/sns-naver.svg' },
  { name: 'Blog', href: '#', icon: 'assets/footer/sns-blog.svg' },
  { name: 'Instagram', href: '#', icon: 'assets/footer/sns-instagram.svg' },
  { name: 'Facebook', href: '#', icon: 'assets/footer/sns-facebook.svg' },
] as const

export function Footer() {
  return (
    <footer className="site-footer" data-name="Footer" data-header-theme="dark">
      <div className="site-footer__inner">
        <div className="site-footer__top">
          <a className="site-footer__logo" href="./" aria-label="법무법인 경국 홈">
            <img
              className="site-footer__logo-mark"
              src={asset('assets/logo-mark.png')}
              alt=""
            />
            <img
              className="site-footer__logo-word"
              src={asset('assets/logo-wordmark-light.svg')}
              alt="법무법인 경국"
            />
          </a>
        </div>

        <div className="site-footer__rule" aria-hidden="true" />

        <div className="site-footer__columns">
          <div className="site-footer__col">
            <p className="site-footer__line">
              서울 서초구 서초대로 264, 15층 (서초동, 법조타워)
            </p>
            {META.map((row) => (
              <p key={row.label} className="site-footer__meta">
                <span className="site-footer__meta-label">{row.label}</span>
                <span className="site-footer__meta-value">{row.value}</span>
              </p>
            ))}
          </div>

          <div className="site-footer__col">
            <p className="site-footer__phone-title">전화</p>
            {PHONES.map((row) => (
              <div key={row.tel} className="site-footer__phone-row">
                <span className="site-footer__chip">{row.label}</span>
                <a className="site-footer__phone" href={`tel:${row.tel.replace(/-/g, '')}`}>
                  {row.tel}
                </a>
              </div>
            ))}
          </div>
        </div>

        <div className="site-footer__contact">
          <p className="site-footer__meta">
            <span className="site-footer__meta-label">팩스</span>
            <span className="site-footer__meta-value">02-598-0870</span>
          </p>
          <p className="site-footer__meta">
            <span className="site-footer__meta-label">메일</span>
            <a className="site-footer__meta-value" href="mailto:support@gyungook.com">
              support@gyungook.com
            </a>
          </p>

          <div className="site-footer__sns" aria-label="소셜 미디어">
            {SNS.map((item) => (
              <a
                key={item.name}
                className="site-footer__sns-link"
                href={item.href}
                aria-label={item.name}
              >
                <img src={asset(item.icon)} alt="" />
              </a>
            ))}
          </div>
        </div>

        <div className="site-footer__rule" aria-hidden="true" />

        <p className="site-footer__copy">
          Copyright ⓒ 법무법인 경국. ALL RIGHTS RESERVED.
        </p>
      </div>
    </footer>
  )
}
