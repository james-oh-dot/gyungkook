import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from 'react'
import { searchDocs } from '../data/searchIndex'
import { asset } from '../utils/asset'
import { resolveNavHref } from '../utils/path'
import './SearchOverlay.css'

type SearchOverlayProps = {
  open: boolean
  onClose: () => void
}

export function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const reactId = useId()
  const [query, setQuery] = useState('')

  const results = useMemo(() => searchDocs(query), [query])

  const hasResults = results.length > 0
  const searching = query.trim().length > 0

  useEffect(() => {
    if (!open) {
      setQuery('')
      return
    }
    // Lock the page behind the glass; scrolling now only happens inside the
    // overlay's results list. Pad for the reclaimed scrollbar width so the
    // frozen page doesn't shift under the frosted layer.
    const prevOverflow = document.body.style.overflow
    const prevPadRight = document.body.style.paddingRight
    const scrollbarW = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    if (scrollbarW > 0) document.body.style.paddingRight = `${scrollbarW}px`
    const t = window.setTimeout(() => inputRef.current?.focus(), 40)
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      document.body.style.paddingRight = prevPadRight
      window.clearTimeout(t)
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  const onRootKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Tab' || !rootRef.current) return
    const focusables = rootRef.current.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]):not(.search-overlay__dim), input, [tabindex]:not([tabindex="-1"])',
    )
    if (!focusables.length) return
    const first = focusables[0]
    const last = focusables[focusables.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const first = results[0]
    if (!first) return
    onClose()
    // Home-anchor hit: smooth-scroll if the section is on the current page,
    // otherwise navigate home to it. Route hit: plain navigation.
    if (first.href.startsWith('#')) {
      const target = document.querySelector(first.href)
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' })
        window.history.replaceState(null, '', first.href)
      } else {
        window.location.href = resolveNavHref(first.href)
      }
    } else {
      window.location.href = resolveNavHref(first.href)
    }
  }

  if (!open) return null

  return (
    <div
      ref={rootRef}
      className="search-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${reactId}-label`}
      onKeyDown={onRootKeyDown}
    >
      <button
        type="button"
        className="search-overlay__dim"
        aria-label="검색 닫기"
        onClick={onClose}
      />

      <button
        type="button"
        className="search-overlay__close"
        aria-label="검색 닫기"
        onClick={onClose}
      >
        <img
          src={asset('assets/icon-close.svg')}
          alt=""
          className="search-overlay__close-icon"
        />
      </button>

      <div
        className={`search-overlay__panel${searching ? ' is-searching' : ''}${
          hasResults ? ' has-results' : ''
        }`}
      >
        <p id={`${reactId}-label`} className="search-overlay__sr-only">
          사이트 검색
        </p>

        <form className="search-overlay__form" onSubmit={onSubmit}>
          <input
            ref={inputRef}
            className="search-overlay__input"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="검색어 입력"
            autoComplete="off"
            enterKeyHint="search"
            aria-describedby={`${reactId}-hint`}
          />
          <p id={`${reactId}-hint`} className="search-overlay__hint">
            궁금한 내용을 단어로 검색해보세요. 예시: 재개발
          </p>
        </form>

        <div
          className={`search-overlay__results${hasResults ? ' is-visible' : ''}`}
          aria-live="polite"
        >
          {searching && !hasResults ? (
            <p className="search-overlay__empty">검색 결과가 없습니다.</p>
          ) : null}
          {hasResults ? (
            <>
              <p className="search-overlay__summary">
                총 <strong>{results.length}</strong>개 페이지에서 발견
              </p>
              <ul className="search-overlay__list" role="list">
                {results.map((hit) => (
                  <li key={hit.id} className="search-overlay__item">
                    <a
                      className="search-overlay__link"
                      href={resolveNavHref(hit.href)}
                      onClick={onClose}
                    >
                      <span className="search-overlay__chips" aria-hidden="true">
                        {hit.depth.map((part, i) => (
                          <span key={`${hit.id}-${i}`} className="search-overlay__depth">
                            {i > 0 ? (
                              <span className="search-overlay__depth-sep">/</span>
                            ) : null}
                            <span className="search-overlay__chip">{part}</span>
                          </span>
                        ))}
                      </span>
                      <span className="search-overlay__title">{hit.title}</span>
                      <span
                        className="search-overlay__count"
                        aria-label={`이 페이지에서 ${hit.count}회 일치`}
                      >
                        {hit.count}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </div>
      </div>
    </div>
  )
}
