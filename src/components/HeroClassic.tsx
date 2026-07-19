import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { CharReveal } from './CharReveal'
import { LineReveal } from './LineReveal'
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
    <section className="hero" aria-label="메인 비주얼">
      <div className="hero__bg">
        {classicHeroSlides.map((item, i) => (
          <div
            key={item.id}
            className={`hero__bg-slide${i === index ? ' is-active' : ''}`}
          >
            <img
              src={item.image}
              alt=""
              decoding="async"
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

      <div className="hero__swipe" data-name="hero_swipe">
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
          onClick={(e) => {
            e.preventDefault()
            next()
          }}
          aria-label={`다음 화면 ${nextSlide.index} ${slide.nextLabel}로 이동`}
        >
          <div className="hero__swipe-thumb">
            <img
              key={nextSlide.id}
              src={nextSlide.image}
              alt=""
              decoding="sync"
              draggable={false}
            />
          </div>
          <div className="hero__swipe-meta">
            <span>{nextSlide.index}</span>
            <span>{slide.nextLabel}</span>
          </div>
        </button>

        <div className="hero__gage" data-name="swipe_gage">
          <div className="hero__gage-track">
            <span className="hero__gage-no">01</span>
            <div
              className="hero__gage-bar"
              aria-hidden="true"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progress * 100)}
            >
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
    </section>
  )
}
