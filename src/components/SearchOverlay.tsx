import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from 'react'
import { NAV_ITEMS } from '../data/nav'
import { asset } from '../utils/asset'
import './SearchOverlay.css'

export type SearchHit = {
  id: string
  label: string
  href: string
  depth: string[]
}

function buildSearchIndex(): SearchHit[] {
  const hits: SearchHit[] = []
  for (const item of NAV_ITEMS) {
    hits.push({
      id: item.id,
      label: item.label,
      href: item.href,
      depth: [item.label],
    })
    for (const sub of item.children) {
      hits.push({
        id: sub.id,
        label: sub.label,
        href: sub.href,
        depth: [item.label, sub.label],
      })
    }
  }
  return hits
}

const SEARCH_INDEX = buildSearchIndex()

type SearchOverlayProps = {
  open: boolean
  onClose: () => void
}

export function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const reactId = useId()
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return SEARCH_INDEX.filter((hit) => {
      const hay = [...hit.depth, hit.label].join(' ').toLowerCase()
      return hay.includes(q)
    })
  }, [query])

  const hasResults = results.length > 0
  const searching = query.trim().length > 0

  useEffect(() => {
    if (!open) {
      setQuery('')
      return
    }
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const t = window.setTimeout(() => inputRef.current?.focus(), 40)
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
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
    if (first.href.startsWith('#')) {
      document.querySelector(first.href)?.scrollIntoView({ behavior: 'smooth' })
      window.history.replaceState(null, '', first.href)
    } else {
      window.location.href = first.href
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
            <ul className="search-overlay__list" role="list">
              {results.map((hit) => (
                <li key={hit.id} className="search-overlay__item">
                  <a
                    className="search-overlay__link"
                    href={hit.href}
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
                    <span className="search-overlay__title">{hit.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </div>
  )
}
