import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CharReveal } from './CharReveal'
import { HERO_DURATION_MS, heroSlides } from '../data/slides'
import { asset } from '../utils/asset'
import './Hero.css'

export function Hero() {
  const [index, setIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [animKey, setAnimKey] = useState(0)
  const [previewHover, setPreviewHover] = useState(false)
  const indexRef = useRef(0)
  const startRef = useRef(performance.now())
  const pausedRef = useRef(false)
  const pauseElapsedRef = useRef(0)

  const slide = heroSlides[index]
  const nextSlide = heroSlides[(index + 1) % heroSlides.length]

  const jumpTo = useCallback((next: number) => {
    const total = heroSlides.length
    const resolved = ((next % total) + total) % total
    indexRef.current = resolved
    setIndex(resolved)
    setProgress(0)
    setAnimKey((k) => k + 1)
    startRef.current = performance.now()
    pauseElapsedRef.current = 0
    pausedRef.current = false
    setPreviewHover(false)
  }, [])

  const next = useCallback(() => jumpTo(indexRef.current + 1), [jumpTo])
  const prev = useCallback(() => jumpTo(indexRef.current - 1), [jumpTo])

  useEffect(() => {
    let raf = 0
    const tick = (now: number) => {
      if (pausedRef.current) {
        raf = requestAnimationFrame(tick)
        return
      }

      const elapsed = now - startRef.current
      const ratio = Math.min(1, elapsed / HERO_DURATION_MS)
      setProgress(ratio)

      if (ratio >= 1) {
        jumpTo(indexRef.current + 1)
      }

      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [jumpTo])

  const titleBlocks = useMemo(
    () =>
      slide.titleLines.map((line, lineIndex) => {
        const previous = slide.titleLines
          .slice(0, lineIndex)
          .reduce((sum, item) => sum + Array.from(item).length, 0)
        return (
          <p key={`${animKey}-${line}`} className="hero__title-line">
            <CharReveal
              text={line}
              active
              baseDelay={120 + previous * 28 + lineIndex * 80}
              step={28}
            />
          </p>
        )
      }),
    [animKey, slide.titleLines],
  )

  return (
    <section className="hero" aria-label="메인 비주얼">
      <div className="hero__bg">
        {heroSlides.map((item, i) => (
          <div
            key={item.id}
            className={`hero__bg-slide${i === index ? ' is-active' : ''}${
              previewHover && i === (index + 1) % heroSlides.length
                ? ' is-preview'
                : ''
            }`}
          >
            <img src={item.image} alt="" />
            <div className="hero__bg-veil" />
          </div>
        ))}
      </div>

      <div className="hero__content" key={animKey}>
        <div className="hero__maincopy">
          <p className="hero__index">
            <CharReveal text={slide.index} baseDelay={40} step={40} />
          </p>
          <div className="hero__title">{titleBlocks}</div>
        </div>

        <div className="hero__copy">
          <p className="hero__label">
            <CharReveal text={slide.label} baseDelay={420} step={22} />
          </p>
          <div className="hero__desc">
            {slide.description.map((line, i) => (
              <p key={line}>
                <CharReveal text={line} baseDelay={520 + i * 180} step={12} />
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className="hero__swipe">
        <button
          type="button"
          className="hero__swipe-preview"
          onMouseEnter={() => {
            pausedRef.current = true
            pauseElapsedRef.current = progress * HERO_DURATION_MS
            setPreviewHover(true)
          }}
          onMouseLeave={() => {
            startRef.current = performance.now() - pauseElapsedRef.current
            pausedRef.current = false
            setPreviewHover(false)
          }}
          onClick={next}
          aria-label={`다음 화면 ${nextSlide.index} ${nextSlide.nextLabel}로 이동`}
        >
          <div className="hero__swipe-thumb">
            <img src={nextSlide.image} alt="" />
          </div>
          <div className="hero__swipe-meta">
            <span>{nextSlide.index}</span>
            <span>{nextSlide.nextLabel}</span>
          </div>
        </button>

        <div className="hero__gage">
          <div className="hero__gage-track">
            <span className="hero__gage-no">01</span>
            <div className="hero__gage-bar" aria-hidden="true">
              <div
                className="hero__gage-fill"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
            <span className="hero__gage-no">05</span>
          </div>
          <div className="hero__gage-btns">
            <button type="button" onClick={prev} aria-label="이전 화면">
              <img src={asset('assets/icon-arrow.png')} alt="" className="is-flip" />
            </button>
            <button type="button" onClick={next} aria-label="다음 화면">
              <img src={asset('assets/icon-arrow.png')} alt="" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
