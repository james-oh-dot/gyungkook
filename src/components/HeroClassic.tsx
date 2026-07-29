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

export function HeroClassic() {
  const [index, setIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [animKey, setAnimKey] = useState(0)
  const [userPaused, setUserPaused] = useState(false)
  const indexRef = useRef(0)
  const startRef = useRef(performance.now())
  const pausedRef = useRef(false)
  const userPausedRef = useRef(false)
  const hoverPausedRef = useRef(false)
  const pauseElapsedRef = useRef(0)
  const progressRef = useRef(0)
  const lastJumpAtRef = useRef(0)
  const heroRef = useRef<HTMLElement>(null)
  const swipeRef = useRef<HTMLDivElement>(null)
  const swipeStartRef = useRef<{ id: number; x: number; y: number; t: number } | null>(null)

  const slideCount = classicHeroSlides.length
  const slide = classicHeroSlides[index]
  const nextSlide = classicHeroSlides[(index + 1) % slideCount]
  const totalLabel = String(slideCount).padStart(2, '0')

  const syncPaused = useCallback((now = performance.now()) => {
    const nextPaused = userPausedRef.current || hoverPausedRef.current
    if (nextPaused && !pausedRef.current) {
      pauseElapsedRef.current = progressRef.current * HERO_DURATION_MS
    } else if (!nextPaused && pausedRef.current) {
      startRef.current = now - pauseElapsedRef.current
    }
    pausedRef.current = nextPaused
  }, [])

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
      pauseElapsedRef.current = 0
      // Keep user pause; only clear hover-pause from a jump
      hoverPausedRef.current = false
      pausedRef.current = userPausedRef.current
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

  const togglePause = useCallback(() => {
    const now = performance.now()
    userPausedRef.current = !userPausedRef.current
    setUserPaused(userPausedRef.current)
    syncPaused(now)
  }, [syncPaused])

  useEffect(() => {
    // Preload all slide images so advance never flashes empty/black
    classicHeroSlides.forEach((item) => {
      const img = new Image()
      img.src = item.image
    })
  }, [])

  useEffect(() => {
    let raf = 0
    let alive = true

    const tick = (now: number) => {
      if (!alive) return

      if (!pausedRef.current) {
        const elapsed = now - startRef.current
        if (elapsed >= HERO_DURATION_MS) {
          // Advance exactly one slide; jumpTo debounce blocks double fire
          jumpTo(indexRef.current + 1)
        } else {
          const p = Math.min(1, elapsed / HERO_DURATION_MS)
          progressRef.current = p
          setProgress(p)
        }
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
    Publish layout pins on `.hero`:
    - `--hero-swipe-top`: swipe top (image frame + copy Y)
    - `--hero-maincopy-top`: prefer 50svh, but never overlap copy —
      cap so maincopy bottom stays ≥60px above copy top. When the
      viewport grows again, the pin returns to mid fluidly.
  */
  useEffect(() => {
    const hero = heroRef.current
    const swipe = swipeRef.current
    if (!hero || !swipe) return

    const MAINCOPY_COPY_GAP = 60

    const sync = () => {
      const swipeRect = swipe.getBoundingClientRect()
      /*
        ≤767 hides the swipe block (`display: none`), where a zero rect would
        otherwise read as `top: 0` and publish `-heroTop` as the pin once the
        page is scrolled. Mobile doesn't consume either custom property, so
        just leave the last desktop values alone.
      */
      if (swipeRect.width === 0 && swipeRect.height === 0) return

      const heroTop = hero.getBoundingClientRect().top
      const swipeTop = swipeRect.top - heroTop
      if (swipeTop > 0) hero.style.setProperty('--hero-swipe-top', `${swipeTop}px`)

      const maincopy = hero.querySelector<HTMLElement>('.hero__maincopy')
      if (!maincopy || swipeTop <= 0) return

      const mainH = maincopy.getBoundingClientRect().height
      /* Same length CSS uses for `top: 50svh` (offset from copy-col / hero top). */
      const midOffset =
        (window.visualViewport?.height ?? window.innerHeight) * 0.5
      const maxTop = swipeTop - MAINCOPY_COPY_GAP - mainH
      const top = Math.min(midOffset, maxTop)
      hero.style.setProperty('--hero-maincopy-top', `${top}px`)
    }

    sync()
    const ro = new ResizeObserver(sync)
    ro.observe(swipe)
    ro.observe(hero)
    const maincopy = hero.querySelector('.hero__maincopy')
    if (maincopy) ro.observe(maincopy)
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
              baseDelay={120 + previous * 30 + lineIndex * 80}
              step={30}
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
        {classicHeroSlides.map((item, i) => (
          <div
            key={item.id}
            className={`hero__bg-slide${i === index ? ' is-active' : ''}`}
          >
            <ProgressiveImage
              src={item.image}
              preview={item.imagePreview}
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
        ))}
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
                baseDelay={60}
                step={34}
              />
            </p>
            <div className="hero__title">{titleBlocks}</div>
          </div>

          <div className="hero__copy" data-name="hero_copy">
            <div className="hero__label">
              <LineReveal key={`${animKey}-label`} lines={[slide.label]} baseDelay={420} step={0} />
            </div>
            <div className="hero__desc">
              <LineReveal
                key={`${animKey}-desc`}
                lines={slide.description}
                baseDelay={520}
                step={160}
              />
            </div>
          </div>
        </div>
      </div>

      <div ref={swipeRef} className="hero__swipe" data-name="hero_swipe">
        <div className="hero__swipe-controls">
          <div className="hero__gage-btns hero__gage-btns--prev">
            <button type="button" onClick={prev} aria-label="이전 화면">
              <img src={asset('assets/icon-arrow.svg')} alt="" className="is-flip" draggable={false} />
            </button>
          </div>
          <div className="hero__gage-btns hero__gage-btns--pause">
            <button
              type="button"
              onClick={togglePause}
              aria-label={userPaused ? '자동 재생 시작' : '자동 재생 일시정지'}
              aria-pressed={userPaused}
            >
              <img
                src={asset(userPaused ? 'assets/icon-play.svg' : 'assets/icon-pause.svg')}
                alt=""
                draggable={false}
              />
            </button>
          </div>
          <button
            type="button"
            className="hero__swipe-preview"
            onMouseEnter={() => {
              hoverPausedRef.current = true
              syncPaused()
            }}
            onMouseLeave={() => {
              hoverPausedRef.current = false
              syncPaused()
            }}
            onClick={next}
            aria-label={`다음 화면 ${nextSlide.index} ${slide.nextLabel}로 이동`}
          >
            <div className="hero__swipe-meta">
              <span>{nextSlide.index}</span>
              <span>{slide.nextLabel}</span>
            </div>
            <div className="hero__swipe-thumb">
              <ProgressiveImage
                key={nextSlide.id}
                src={nextSlide.image}
                preview={nextSlide.imagePreview}
                alt=""
                decoding="sync"
              />
            </div>
          </button>
          <div className="hero__gage-btns hero__gage-btns--next">
            <button type="button" onClick={next} aria-label="다음 화면">
              <img src={asset('assets/icon-arrow.svg')} alt="" draggable={false} />
            </button>
          </div>
        </div>
        <div
          className="hero__gage-track"
          data-name="swipe_gage"
          aria-label={`슬라이드 ${slide.index} / ${totalLabel}`}
        >
          <span className="hero__gage-no">{slide.index}</span>
          <div className="hero__gage-bar" aria-hidden="true">
            <div className="hero__gage-fill" style={{ transform: `scaleX(${progress})` }} />
          </div>
          <span className="hero__gage-no">{totalLabel}</span>
        </div>
      </div>
    </section>
  )
}
