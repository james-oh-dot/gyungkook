import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ImgHTMLAttributes,
} from 'react'
import './ProgressiveImage.css'

export type ProgressiveImageProps = {
  /** High-quality final image URL */
  src: string
  /** Tiny preview URL (shown immediately, blurred) */
  preview: string
  alt?: string
  className?: string
  /** Applied to the outer progressive box (e.g. hero `--hero-zoom`) */
  style?: CSSProperties
  /** Applied to both preview + full `<img>` layers */
  imgClassName?: string
  imgStyle?: CSSProperties
  /**
   * LCP / above-the-fold: eager + fetchpriority=high + preload link.
   * Below-the-fold: lazy full image (preview still paints immediately).
   */
  priority?: boolean
  objectFit?: CSSProperties['objectFit']
  objectPosition?: CSSProperties['objectPosition']
} & Pick<ImgHTMLAttributes<HTMLImageElement>, 'sizes' | 'decoding' | 'loading'>

/**
 * Apple / Medium-style blur-up image.
 * 1) Preview paints immediately (layout filled)
 * 2) Full image fetches in parallel
 * 3) Crossfade to sharp when ready (cached → near-instant)
 */
export function ProgressiveImage({
  src,
  preview,
  alt = '',
  className = '',
  style,
  imgClassName = '',
  imgStyle,
  priority = false,
  objectFit = 'cover',
  objectPosition = 'center',
  sizes,
  decoding,
  loading,
}: ProgressiveImageProps) {
  const [ready, setReady] = useState(false)
  const fullRef = useRef<HTMLImageElement>(null)

  // Reset when the target image changes (route / menu swap)
  useEffect(() => {
    setReady(false)
    const el = fullRef.current
    if (el?.complete && el.naturalWidth > 0) {
      // Already cached — reveal on next frame for a clean paint
      const id = requestAnimationFrame(() => setReady(true))
      return () => cancelAnimationFrame(id)
    }
  }, [src])

  // LCP preload — start full download as early as possible
  useEffect(() => {
    if (!priority || !src) return
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = src
    link.setAttribute('fetchpriority', 'high')
    document.head.appendChild(link)
    return () => {
      link.remove()
    }
  }, [src, priority])

  const layerStyle: CSSProperties = {
    objectFit,
    objectPosition,
    ...imgStyle,
  }

  return (
    <div
      className={`progressive-image${ready ? ' is-ready' : ''}${className ? ` ${className}` : ''}`}
      data-progressive="blur-up"
      style={style}
    >
      <img
        className={`progressive-image__preview${imgClassName ? ` ${imgClassName}` : ''}`}
        src={preview}
        alt=""
        aria-hidden="true"
        draggable={false}
        style={layerStyle}
        // Preview must win the first paint — never lazy
        loading="eager"
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
      />
      <img
        ref={fullRef}
        className={`progressive-image__full${imgClassName ? ` ${imgClassName}` : ''}`}
        src={src}
        alt={alt}
        draggable={false}
        style={layerStyle}
        sizes={sizes}
        loading={loading ?? (priority ? 'eager' : 'lazy')}
        decoding={decoding ?? 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
        onLoad={() => setReady(true)}
      />
    </div>
  )
}
