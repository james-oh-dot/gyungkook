import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  /* Aliased so it never shadows the DOM `PointerEvent` global */
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { CharReveal } from './CharReveal'
import { LineReveal } from './LineReveal'
import { ProgressiveImage } from './ProgressiveImage'
import { HERO_DURATION_MS, classicHeroSlides } from '../data/slidesClassic'
import { asset } from '../utils/asset'
import './HeroClassic.css'

/*
  Touch swipe thresholds. Mobile (≤767) hides `.hero__swipe`, so a finger drag
  is the only manual navigation there — but the hero is also the top of a
  vertically scrolling page, so the gesture has to be clearly horizontal before
  it counts as a slide jump.
*/
const SWIPE_MIN_PX = 48
/** |dx| must beat |dy| by this much — a diagonal drag while scrolling is not a swipe */
const SWIPE_AXIS_RATIO = 1.5
/** A slow drag is a hold/scroll correction, not a flick */
const SWIPE_MAX_MS = 800

/** Matches HeroClassic.css mobile breakpoint — portrait `hero-M-*` arts swap here. */
const MQ_MOBILE_HERO = '(max-width: 767px)'

/**
 * Entrance pacing multiplier for the hero copy. Every stagger delay/step below
 * is written at its original value and scaled by this, so the whole sequence
 * slows together. The matching transition durations live in HeroClassic.css
 * (`.hero .char-reveal__item` / `.hero .line-reveal__item`) — change both or
 * the glyphs finish early and only the stagger stretches.
 */
const REVEAL_PACE = 2

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false,
  )

  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => setMatches(mql.matches)
    onChange()
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])

  return matches
}

export function HeroClassic() {
  const isMobile = useMediaQuery(MQ_MOBILE_HERO)
  const [index, setIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [animKey, setAnimKey] = useState(0)
  const indexRef = useRef(0)
  const startRef = useRef(performance.now())
  const progressRef = useRef(0)
  const lastJumpAtRef = useRef(0)
  const heroRef = useRef<HTMLElement>(null)
  const swipeStartRef = useRef<{ id: number; x: number; y: number; t: number } | null>(null)

  const slide = classicHeroSlides[index]

  const jumpTo = useCallback(
    (next: number) => {
      const now = performance.now()
      // Guard against double-advance (Strict Mode / stacked pointer events / rAF race)
      if (now - lastJumpAtRef.current < 180) return
      lastJumpAtRef.current = now

      const total = classicHeroSlides.length
      const resolved = ((next % total) + total) % total
      indexRef.current = resolved
      setIndex(resolved)
      progressRef.current = 0
      setProgress(0)
      setAnimKey((k) => k + 1)
      startRef.current = now
    },
    [],
  )

  const next = useCallback(() => jumpTo(indexRef.current + 1), [jumpTo])
  const prev = useCallback(() => jumpTo(indexRef.current - 1), [jumpTo])

  /*
    Touch/pen only — a mouse drag over the hero is text selection, not a swipe.
    Touch pointers get implicit capture from `pointerdown`, so `pointerup`
    lands back here even if the finger drifts off the section.
  */
  const onPointerDown = useCallback((e: ReactPointerEvent) => {
    if (e.pointerType === 'mouse') return
    swipeStartRef.current = {
      id: e.pointerId,
      x: e.clientX,
      y: e.clientY,
      t: performance.now(),
    }
  }, [])

  const onPointerUp = useCallback(
    (e: ReactPointerEvent) => {
      const start = swipeStartRef.current
      if (!start || start.id !== e.pointerId) return
      swipeStartRef.current = null

      const dx = e.clientX - start.x
      const dy = e.clientY - start.y
      if (Math.abs(dx) < SWIPE_MIN_PX) return
      if (Math.abs(dx) < Math.abs(dy) * SWIPE_AXIS_RATIO) return
      if (performance.now() - start.t > SWIPE_MAX_MS) return

      // Drag left = pull the next slide in; drag right = go back
      if (dx < 0) next()
      else prev()
    },
    [next, prev],
  )

  /* Browser took over the gesture (vertical scroll won) — abandon it */
  const onPointerCancel = useCallback(() => {
    swipeStartRef.current = null
  }, [])

  useEffect(() => {
    // Preload all slide images so advance never flashes empty/black
    classicHeroSlides.forEach((item) => {
      const img = new Image()
      img.src = item.image
      if (item.mobileImage) {
        const mobile = new Image()
        mobile.src = item.mobileImage
      }
    })
  }, [])

  useEffect(() => {
    let raf = 0
    let alive = true

    const tick = (now: number) => {
      if (!alive) return

      const elapsed = now - startRef.current
      if (elapsed >= HERO_DURATION_MS) {
        // Advance exactly one slide; jumpTo debounce blocks double fire
        jumpTo(indexRef.current + 1)
      } else {
        const p = Math.min(1, elapsed / HERO_DURATION_MS)
        progressRef.current = p
        setProgress(p)
      }

      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => {
      alive = false
      cancelAnimationFrame(raf)
    }
  }, [jumpTo])

  /*
    Publishes `--hero-maincopy-top` on `.hero`: prefer mid-viewport, but never
    let the maincopy collide with the copy block below it — cap so its bottom
    stays ≥60px clear. When the viewport grows again the pin returns to mid.

    This used to hang off the swipe block's measured top; with the swipe gone,
    `.hero__copy` is bottom-anchored in CSS and is measured directly instead.
    Desktop (≥1025) is the only breakpoint that reads the property — below
    that the copy column is a plain flex stack.
  */
  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return

    const MAINCOPY_COPY_GAP = 60

    const sync = () => {
      const maincopy = hero.querySelector<HTMLElement>('.hero__maincopy')
      const copy = hero.querySelector<HTMLElement>('.hero__copy')
      if (!maincopy || !copy) return

      const heroTop = hero.getBoundingClientRect().top
      const copyTop = copy.getBoundingClientRect().top - heroTop
      if (copyTop <= 0) return

      const mainH = maincopy.getBoundingClientRect().height
      /* Same length CSS uses for `top: 50svh` (offset from copy-col / hero top). */
      const midOffset =
        (window.visualViewport?.height ?? window.innerHeight) * 0.5
      const maxTop = copyTop - MAINCOPY_COPY_GAP - mainH
      hero.style.setProperty(
        '--hero-maincopy-top',
        `${Math.min(midOffset, maxTop)}px`,
      )
    }

    sync()
    const ro = new ResizeObserver(sync)
    ro.observe(hero)
    const maincopy = hero.querySelector('.hero__maincopy')
    if (maincopy) ro.observe(maincopy)
    const copy = hero.querySelector('.hero__copy')
    if (copy) ro.observe(copy)
    window.addEventListener('resize', sync)
    window.visualViewport?.addEventListener('resize', sync)
    void document.fonts?.ready.then(sync)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', sync)
      window.visualViewport?.removeEventListener('resize', sync)
    }
  }, [animKey])

  const titleBlocks = useMemo(
    () =>
      slide.titleLines.map((line, lineIndex) => {
        const previous = slide.titleLines
          .slice(0, lineIndex)
          .reduce((sum, item) => sum + Array.from(item).length, 0)
        return (
          <p key={`${animKey}-title-${lineIndex}`} className="hero__title-line">
            <CharReveal
              key={`${animKey}-char-${lineIndex}`}
              text={line}
              baseDelay={(120 + previous * 30 + lineIndex * 80) * REVEAL_PACE}
              step={30 * REVEAL_PACE}
            />
          </p>
        )
      }),
    [animKey, slide.titleLines],
  )

  return (
    <section
      ref={heroRef}
      className="hero"
      aria-label="메인 비주얼"
      data-header-theme="dark"
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
    >
      <div className="hero__bg">
        {classicHeroSlides.map((item, i) => {
          const useMobileArt = isMobile && !!item.mobileImage
          const src = useMobileArt ? item.mobileImage! : item.image
          const preview = useMobileArt
            ? (item.mobileImagePreview ?? item.imagePreview)
            : item.imagePreview
          /* Portrait mobile arts are already composed — skip landscape crop hacks. */
          const frameClass =
            !useMobileArt && item.mobileFrame
              ? ` hero__bg-slide--frame-${item.mobileFrame}`
              : ''
          const artClass = item.mobileImage ? ' hero__bg-slide--mobile-art' : ''

          return (
            <div
              key={item.id}
              className={`hero__bg-slide${i === index ? ' is-active' : ''}${frameClass}${artClass}`}
            >
              <ProgressiveImage
                src={src}
                preview={preview}
                alt=""
                priority={i === 0}
                style={
                  i === index
                    ? ({ '--hero-zoom': progress } as CSSProperties)
                    : undefined
                }
              />
              <div className="hero__bg-veil" />
            </div>
          )
        })}
      </div>

      <div className="hero__content" key={animKey}>
        {/*
          Left column stays inside `.hero__content` (pad-x). Absolute Y pins
          for maincopy/copy are scoped to this col so `left:0` = content inset.
        */}
        <div className="hero__copy-col">
          <div className="hero__maincopy" data-name="hero_maincopy">
            <p className="hero__index">
              <CharReveal
                key={`${animKey}-index`}
                text={slide.index}
                baseDelay={60 * REVEAL_PACE}
                step={34 * REVEAL_PACE}
              />
            </p>
            <div className="hero__title">{titleBlocks}</div>
          </div>

          <div className="hero__copy" data-name="hero_copy">
            <div className="hero__label">
              <LineReveal
                key={`${animKey}-label`}
                lines={[slide.label]}
                baseDelay={420 * REVEAL_PACE}
                step={0}
              />
            </div>
            <div className="hero__desc">
              <LineReveal
                key={`${animKey}-desc`}
                lines={slide.description}
                baseDelay={520 * REVEAL_PACE}
                step={160 * REVEAL_PACE}
              />
            </div>
          </div>
        </div>
      </div>

      {/*
        Edge-anchored slide arrows. These replaced the whole swipe block
        (thumb preview + meta + gage track + pause) — the only manual
        navigation left, mirrored on both sides of the viewport.
      */}
      <button
        type="button"
        className="hero__nav hero__nav--prev"
        onClick={prev}
        aria-label="이전 화면"
      >
        <img src={asset('assets/icon-arrow.svg')} alt="" className="is-flip" draggable={false} />
      </button>
      <button
        type="button"
        className="hero__nav hero__nav--next"
        onClick={next}
        aria-label="다음 화면"
      >
        <img src={asset('assets/icon-arrow.svg')} alt="" draggable={false} />
      </button>
    </section>
  )
}
