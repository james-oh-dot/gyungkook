import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react'
import { PRIVACY_DRAWER, QUICK_CONSULT, type QuickConsultMode } from '../data/quickConsult'
import { asset } from '../utils/asset'
import './QuickConsult.css'

type FormState = {
  name: string
  phone: string
  message: string
  mode: QuickConsultMode
  consent: boolean
}

const INITIAL: FormState = {
  name: '',
  phone: '',
  message: '',
  mode: 'sms',
  consent: false,
}

/** Format as 010-1234-5678 while typing digits only. */
function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 3) return digits
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`
}

function isPhoneValid(phone: string): boolean {
  return /^01[016789]-?\d{3,4}-?\d{4}$/.test(phone.replace(/\s/g, ''))
}

export function QuickConsult() {
  const formId = useId()
  const [form, setForm] = useState<FormState>(INITIAL)
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [privacyOpen, setPrivacyOpen] = useState(false)
  const [shakeConsent, setShakeConsent] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { threshold: 0.18 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const errors = {
    name: touched.name && form.name.trim().length < 2,
    phone: touched.phone && !isPhoneValid(form.phone),
    message: touched.message && form.message.trim().length < 5,
    consent: touched.consent && !form.consent,
  }

  const canSubmit =
    form.name.trim().length >= 2 &&
    isPhoneValid(form.phone) &&
    form.message.trim().length >= 5 &&
    form.consent &&
    !submitting

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setTouched({ name: true, phone: true, message: true, consent: true })
    if (!form.consent) {
      setShakeConsent(true)
      window.setTimeout(() => setShakeConsent(false), 520)
    }
    if (
      form.name.trim().length < 2 ||
      !isPhoneValid(form.phone) ||
      form.message.trim().length < 5 ||
      !form.consent
    ) {
      return
    }
    setSubmitting(true)
    // Front-only mock — wire to backend later.
    await new Promise((r) => window.setTimeout(r, 700))
    setSubmitting(false)
    setSuccess(true)
  }

  const reset = () => {
    setForm(INITIAL)
    setTouched({})
    setSuccess(false)
  }

  return (
    <section
      ref={sectionRef}
      className={`section section--dark quick-consult${inView ? ' is-inview' : ''}`}
      data-header-theme="dark"
      aria-labelledby={`${formId}-title`}
    >
      <div className="quick-consult__inner">
        <header className="quick-consult__intro">
          <p className="quick-consult__eyebrow">{QUICK_CONSULT.eyebrow}</p>
          <h2 id={`${formId}-title`} className="quick-consult__title">
            {QUICK_CONSULT.title}
          </h2>
          <p className="quick-consult__desc">{QUICK_CONSULT.description}</p>
        </header>

        <div className="quick-consult__panel">
          {success ? (
            <div className="quick-consult__success" role="status">
              <span className="quick-consult__success-mark" aria-hidden="true" />
              <h3 className="quick-consult__success-title">{QUICK_CONSULT.success.title}</h3>
              <p className="quick-consult__success-body">{QUICK_CONSULT.success.body}</p>
              <button type="button" className="quick-consult__again" onClick={reset}>
                {QUICK_CONSULT.success.again}
              </button>
            </div>
          ) : (
            <form className="quick-consult__form" onSubmit={onSubmit} noValidate>
              <div className="quick-consult__row quick-consult__row--inputs">
                <label
                  className={`quick-consult__field${errors.name ? ' is-invalid' : ''}${form.name ? ' has-value' : ''}`}
                >
                  <span className="quick-consult__label">{QUICK_CONSULT.fields.name.label}</span>
                  <input
                    className="quick-consult__input"
                    name="name"
                    type="text"
                    autoComplete={QUICK_CONSULT.fields.name.autoComplete}
                    placeholder={QUICK_CONSULT.fields.name.placeholder}
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                    required
                    maxLength={40}
                  />
                  <span className="quick-consult__focus" aria-hidden="true" />
                </label>

                <label
                  className={`quick-consult__field${errors.phone ? ' is-invalid' : ''}${form.phone ? ' has-value' : ''}`}
                >
                  <span className="quick-consult__label">{QUICK_CONSULT.fields.phone.label}</span>
                  <input
                    className="quick-consult__input"
                    name="phone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete={QUICK_CONSULT.fields.phone.autoComplete}
                    placeholder={QUICK_CONSULT.fields.phone.placeholder}
                    value={form.phone}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, phone: formatPhone(e.target.value) }))
                    }
                    onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
                    required
                  />
                  <span className="quick-consult__focus" aria-hidden="true" />
                </label>

                <label
                  className={`quick-consult__field quick-consult__field--message${errors.message ? ' is-invalid' : ''}${form.message ? ' has-value' : ''}`}
                >
                  <span className="quick-consult__label">{QUICK_CONSULT.fields.message.label}</span>
                  <input
                    className="quick-consult__input"
                    name="message"
                    type="text"
                    placeholder={QUICK_CONSULT.fields.message.placeholder}
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    onBlur={() => setTouched((t) => ({ ...t, message: true }))}
                    required
                    maxLength={1000}
                  />
                  <span className="quick-consult__focus" aria-hidden="true" />
                </label>
              </div>

              <div className="quick-consult__row quick-consult__row--meta">
                <fieldset className="quick-consult__modes">
                  <legend className="quick-consult__legend">상담 방식</legend>
                  <div className="quick-consult__mode-list" role="radiogroup" aria-label="상담 방식">
                    {QUICK_CONSULT.modes.map((mode) => {
                      const selected = form.mode === mode.id
                      return (
                        <label
                          key={mode.id}
                          className={`quick-consult__mode${selected ? ' is-selected' : ''}`}
                        >
                          <input
                            type="radio"
                            name="consult-mode"
                            value={mode.id}
                            checked={selected}
                            onChange={() => setForm((f) => ({ ...f, mode: mode.id }))}
                          />
                          <span className="quick-consult__mode-dot" aria-hidden="true" />
                          <span className="quick-consult__mode-label">{mode.label}</span>
                        </label>
                      )
                    })}
                  </div>
                </fieldset>

                <div
                  className={`quick-consult__consent${errors.consent ? ' is-invalid' : ''}${shakeConsent ? ' is-shake' : ''}`}
                >
                  <label className="quick-consult__check">
                    <input
                      type="checkbox"
                      checked={form.consent}
                      onChange={(e) => {
                        setForm((f) => ({ ...f, consent: e.target.checked }))
                        setTouched((t) => ({ ...t, consent: true }))
                      }}
                    />
                    <span className="quick-consult__check-box" aria-hidden="true">
                      <span className="quick-consult__check-mark" />
                    </span>
                    <span className="quick-consult__check-text">
                      {QUICK_CONSULT.consent.label}
                      <button
                        type="button"
                        className="quick-consult__privacy-link"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          setPrivacyOpen(true)
                        }}
                      >
                        {QUICK_CONSULT.consent.linkLabel}
                      </button>
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  className={`quick-consult__submit${submitting ? ' is-busy' : ''}`}
                  disabled={submitting}
                  aria-disabled={!canSubmit && !submitting}
                >
                  <span className="quick-consult__submit-label">
                    {submitting ? QUICK_CONSULT.submitting : QUICK_CONSULT.submit}
                  </span>
                  <span className="quick-consult__submit-shine" aria-hidden="true" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <PrivacyDrawer open={privacyOpen} onClose={() => setPrivacyOpen(false)} />
    </section>
  )
}

function PrivacyDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
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

  const onKeyDown = useCallback(
    (e: ReactKeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Escape') onClose()
      if (e.key !== 'Tab' || !panelRef.current) return
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input, textarea, [tabindex]:not([tabindex="-1"])',
      )
      if (!focusable.length) return
      const first = focusable[0]!
      const last = focusable[focusable.length - 1]!
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    },
    [onClose],
  )

  useEffect(() => {
    if (!open) return
    const onWin = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onWin)
    return () => window.removeEventListener('keydown', onWin)
  }, [open, onClose])

  return (
    <div
      className={`qc-privacy${open ? ' is-open' : ''}`}
      aria-hidden={!open}
      onKeyDown={onKeyDown}
    >
      <button
        type="button"
        className="qc-privacy__scrim"
        tabIndex={open ? 0 : -1}
        aria-label="개인정보 안내 닫기"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        className="qc-privacy__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="qc-privacy__bar">
          <div>
            <p className="qc-privacy__eyebrow">{PRIVACY_DRAWER.eyebrow}</p>
            <h3 id={titleId} className="qc-privacy__title">
              {PRIVACY_DRAWER.title}
            </h3>
          </div>
          <button
            ref={closeRef}
            type="button"
            className="qc-privacy__close"
            aria-label="닫기"
            onClick={onClose}
          >
            <img src={asset('assets/icon-close.svg')} alt="" />
          </button>
        </div>
        <div className="qc-privacy__body">
          {PRIVACY_DRAWER.sections.map((section) => (
            <section key={section.heading} className="qc-privacy__section">
              <h4 className="qc-privacy__heading">{section.heading}</h4>
              <p className="qc-privacy__text">{section.body}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
