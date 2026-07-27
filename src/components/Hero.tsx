import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { CharReveal } from './CharReveal'
import { LineReveal } from './LineReveal'
import { ProgressiveImage } from './ProgressiveImage'
import { HERO_DURATION_MS, heroSlides } from '../data/slides'
import { asset } from '../utils/asset'
import './Hero.css'

export function Hero() {
  const [index, setIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [animKey, setAnimKey] = useState(0)
  const indexRef = useRef(0)
  const startRef = useRef(performance.now())
  const pausedRef = useRef(false)
  const pauseElapsedRef = useRef(0)
  const progressRef = useRef(0)
  const lastJumpAtRef = useRef(0)

  const slide = heroSlides[index]
  const nextSlide = heroSlides[(index + 1) % heroSlides.length]
  /** Progressive pair for the upcoming slide's 300×170 swipe thumb. */
  const thumbSrc = slide.nextImage
  const thumbPreview = slide.nextImagePreview

  const jumpTo = useCallback((next: number) => {
    const now = performance.now()
    const total = heroSlides.length
    const resolved = ((next % total) + total) % total

    /*
      Debounce only blocks stacked double-advances (rAF + click) that would
      skip a slide. indexRef is updated synchronously so a second call in the
      same window targets index+2 — that is what we must drop.
    */
    if (now - lastJumpAtRef.current < 180) return
    lastJumpAtRef.current = now

    indexRef.current = resolved
    setIndex(resolved)
    progressRef.current = 0
    setProgress(0)
    setAnimKey((k) => k + 1)
    startRef.current = now
    pauseElapsedRef.current = 0
    pausedRef.current = false
  }, [])

  const next = useCallback(() => jumpTo(indexRef.current + 1), [jumpTo])
  const prev = useCallback(() => jumpTo(indexRef.current - 1), [jumpTo])

  useEffect(() => {
    // Warm preview + full for every slide so swipe jumps stay sharp.
    heroSlides.forEach((item) => {
      const preview = new Image()
      preview.src = item.imagePreview
      const full = new Image()
      full.src = item.image
      const thumb = new Image()
      thumb.src = item.nextImage
      const thumbPrev = new Image()
      thumbPrev.src = item.nextImagePreview
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

  const wordCharCount = Array.from(slide.word).length
  const titleBlocks = useMemo(
    () =>
      slide.titleLines.map((line, lineIndex) => {
        const previous = slide.titleLines
          .slice(0, lineIndex)
          .reduce((sum, item) => sum + Array.from(item).length, 0)
        return (
          <p key={`${animKey}-title-${lineIndex}`} className="hero__title-line">
            <CharReveal
              key={`${animKey}-title-char-${lineIndex}`}
              text={line}
              baseDelay={280 + wordCharCount * 28 + previous * 28 + lineIndex * 60}
              step={28}
            />
          </p>
        )
      }),
    [animKey, slide.titleLines, wordCharCount],
  )

  return (
    <section className="hero" aria-label="메인 비주얼" data-header-theme="dark">
      <div className="hero__stage" aria-hidden="true">
        {heroSlides.map((item, i) => (
          <div
            key={item.id}
            className={`hero__bg-slide hero__bg-slide--${item.visual}${
              i === index ? ' is-active' : ''
            }${item.fadeEdges ? ' has-fade' : ''}`}
          >
            <div className="hero__visual">
              {/* birds: flip wrapper keeps scaleX(-1) at center; Ken Burns on progressive box */}
              <div className="hero__visual-media">
                <ProgressiveImage
                  src={item.image}
                  preview={item.imagePreview}
                  alt=""
                  priority={i === 0}
                  decoding="async"
                  /* Framing (contain vs cover) lives in Hero.css per visual —
                     never force cover here or statue hands / sides get clipped. */
                  style={
                    i === index
                      ? ({ '--hero-zoom': progress } as CSSProperties)
                      : undefined
                  }
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="hero__shell">
        <div className="hero__content" key={animKey}>
          {/*
            Desktop: artboard sizes + zoom scale (side-by-side maincopy).
            ≤768 (HOME_TABLET2 / MOBILE2): native stacked sizes — see Hero.css.
          */}
          <div
            className={`hero__copy-scale${slide.wordSize === 'md' ? ' is-compact' : ''}`}
          >
            <div className="hero__copy" data-name="hero_copy">
              <div className="hero__desc">
                <LineReveal
                  key={`${animKey}-desc`}
                  lines={slide.description}
                  baseDelay={80}
                  step={120}
                />
              </div>

              <div className="hero__maincopy" data-name="hero_maincopy">
                <p
                  className={`hero__word${slide.wordSize === 'md' ? ' is-md' : ''}`}
                >
                  <CharReveal
                    key={`${animKey}-word`}
                    text={slide.word}
                    baseDelay={220}
                    step={32}
                  />
                </p>
                <div className="hero__title">{titleBlocks}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="hero__swipe" data-name="hero_swipe">
          <button
            type="button"
            className="hero__swipe-preview"
            onMouseEnter={() => {
              pausedRef.current = true
              /* Use ref — render-closure `progress` can be a frame behind. */
              pauseElapsedRef.current = progressRef.current * HERO_DURATION_MS
            }}
            onMouseLeave={() => {
              startRef.current = performance.now() - pauseElapsedRef.current
              pausedRef.current = false
            }}
            onClick={(e) => {
              e.preventDefault()
              next()
            }}
            aria-label={`다음 화면 ${nextSlide.index} ${nextSlide.word}로 이동`}
          >
            <div className="hero__swipe-thumb">
              {/*
                Remount on every slide change so the thumb never sticks on a
                stale composited bitmap (src-only swap + transform hover).
              */}
              <ProgressiveImage
                key={nextSlide.id}
                className="hero__swipe-thumb-progressive"
                src={thumbSrc}
                preview={thumbPreview}
                alt=""
              />
            </div>
            <div className="hero__swipe-meta">
              {/* Desktop: index + nextLabel row. Card (≤1024): 3-line stack. */}
              <span className="hero__swipe-meta-row">
                <span className="hero__swipe-meta-index">{nextSlide.index}</span>
                <span className="hero__swipe-meta-name">{nextSlide.word}</span>
              </span>
              <span className="hero__swipe-meta-title">{slide.nextSwipeTitle}</span>
              <span className="hero__swipe-meta-count">
                {slide.index} / {String(heroSlides.length).padStart(2, '0')}
              </span>
            </div>
          </button>

          <div className="hero__gage" data-name="swipe_gage">
            <div className="hero__gage-track">
              <span className="hero__gage-no">01</span>
              {/*
                Decorative auto-advance gage. `role="progressbar"` +
                aria-value* were contradictory under `aria-hidden` (hidden
                nodes expose no role), and announcing % every frame would be
                noise anyway — slide position is conveyed by button labels.
              */}
              <div className="hero__gage-bar" aria-hidden="true">
                <div
                  className="hero__gage-fill"
                  style={{ transform: `scaleX(${progress})` }}
                />
              </div>
              <span className="hero__gage-no">05</span>
            </div>
            <div className="hero__gage-btns">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  prev()
                }}
                aria-label="이전 화면"
              >
                <img
                  src={asset('assets/icon-arrow.svg')}
                  alt=""
                  className="is-flip"
                  draggable={false}
                />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  next()
                }}
                aria-label="다음 화면"
              >
                <img
                  src={asset('assets/icon-arrow.svg')}
                  alt=""
                  draggable={false}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
