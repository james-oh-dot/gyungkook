import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { CharReveal } from './CharReveal'
import { LineReveal } from './LineReveal'
import { ProgressiveImage } from './ProgressiveImage'
import { HERO_DURATION_MS, classicHeroSlides } from '../data/slidesClassic'
import { asset } from '../utils/asset'
import './HeroClassic.css'

export function HeroClassic() {
  const [index, setIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [animKey, setAnimKey] = useState(0)
  const indexRef = useRef(0)
  const startRef = useRef(performance.now())
  const pausedRef = useRef(false)
  const pauseElapsedRef = useRef(0)
  const progressRef = useRef(0)
  const lastJumpAtRef = useRef(0)
  const heroRef = useRef<HTMLElement>(null)
  const swipeRef = useRef<HTMLDivElement>(null)

  const slide = classicHeroSlides[index]
  const nextSlide = classicHeroSlides[(index + 1) % classicHeroSlides.length]

  const jumpTo = useCallback((next: number) => {
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
    pausedRef.current = false
  }, [])

  const next = useCallback(() => jumpTo(indexRef.current + 1), [jumpTo])
  const prev = useCallback(() => jumpTo(indexRef.current - 1), [jumpTo])

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
    Publish the swipe block's top edge (offset from the hero's top) as
    `--hero-swipe-top`, so the image frame can end exactly 20px above it.
    Measured rather than derived: the block is `zoom`-scaled and its meta text
    reflows per breakpoint, and anchoring off the measured top (instead of
    `100% - height`) keeps the gap exact regardless of sub-pixel rounding.
  */
  useEffect(() => {
    const hero = heroRef.current
    const swipe = swipeRef.current
    if (!hero || !swipe) return

    const sync = () => {
      const top = swipe.getBoundingClientRect().top - hero.getBoundingClientRect().top
      if (top > 0) hero.style.setProperty('--hero-swipe-top', `${top}px`)
    }

    sync()
    const ro = new ResizeObserver(sync)
    ro.observe(swipe)
    ro.observe(hero)
    window.addEventListener('resize', sync)
    void document.fonts?.ready.then(sync)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', sync)
    }
  }, [])

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
          <button
            type="button"
            className="hero__swipe-preview"
            onMouseEnter={() => {
              pausedRef.current = true
              pauseElapsedRef.current = progressRef.current * HERO_DURATION_MS
            }}
            onMouseLeave={() => {
              startRef.current = performance.now() - pauseElapsedRef.current
              pausedRef.current = false
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
        <div className="hero__gage-track" data-name="swipe_gage">
          <span className="hero__gage-no">01</span>
          <div className="hero__gage-bar" aria-hidden="true">
            <div className="hero__gage-fill" style={{ transform: `scaleX(${progress})` }} />
          </div>
          <span className="hero__gage-no">05</span>
        </div>
      </div>
    </section>
  )
}
