import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ImgHTMLAttributes,
  type SyntheticEvent,
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
   * LCP / above-the-fold: fetchpriority=high + durable preload.
   * Full layer still starts immediately (blur-up requires parallel fetch).
   */
  priority?: boolean
  objectFit?: CSSProperties['objectFit']
  objectPosition?: CSSProperties['objectPosition']
} & Pick<ImgHTMLAttributes<HTMLImageElement>, 'sizes' | 'decoding'>

/** Survive React Strict Mode remounts — never remove these from <head>. */
const preloaded = new Set<string>()

function preloadFull(url: string, high: boolean) {
  if (!url || preloaded.has(url)) return
  preloaded.add(url)
  const link = document.createElement('link')
  link.rel = 'preload'
  link.as = 'image'
  link.href = url
  if (high) link.setAttribute('fetchpriority', 'high')
  document.head.appendChild(link)
}

function isBitmapReady(img: HTMLImageElement | null): boolean {
  return !!img && img.complete && img.naturalWidth > 0
}

/**
 * Reveal as soon as the bitmap is available.
 * - `complete && naturalWidth > 0` is enough to paint (don't block on decode()).
 * - Still kick `decode()` in the background to warm the decoder without delaying UI.
 * Never leave the UI stuck on preview because `onLoad` was missed (cache hit).
 */
function whenPaintable(
  img: HTMLImageElement,
  onReady: () => void,
  isActive: () => boolean,
) {
  if (!isBitmapReady(img)) return
  if (!isActive()) return
  onReady()
  if (typeof img.decode === 'function') {
    img.decode().catch(() => {})
  }
}

/**
 * Apple / Medium-style blur-up.
 *
 * Contract:
 * - Preview paints on first frame (eager, tiny).
 * - Full fetch starts immediately in parallel (never lazy — lazy left src empty
 *   and kept some layers stuck on preview forever).
 * - Reveal after load; cache hits use layout-effect sync check so we never miss
 *   a skipped `onLoad`.
 * - CSS stacks preview+full with `position:absolute; inset:0` inside the box.
 *   NEVER rely on in-flow stacking — overflow:hidden parents clip the full
 *   layer below the preview and leave a blank hole after preview fades out.
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
  objectFit,
  objectPosition,
  sizes,
  decoding = 'async',
}: ProgressiveImageProps) {
  const [ready, setReady] = useState(false)
  const fullRef = useRef<HTMLImageElement>(null)
  const srcRef = useRef(src)
  srcRef.current = src

  const reveal = useCallback(() => {
    setReady(true)
  }, [])

  // Durable preload for LCP / active heroes (no Strict Mode teardown cancel).
  useLayoutEffect(() => {
    if (priority) preloadFull(src, true)
  }, [src, priority])

  // Sync cache-hit path — must run in layout effect so we don't flash preview
  // when the full bitmap is already in memory (onLoad often does not re-fire).
  useLayoutEffect(() => {
    setReady(false)
    const img = fullRef.current
    if (!img) return

    let active = true
    const isActive = () => active && srcRef.current === src

    whenPaintable(img, reveal, isActive)

    // If the browser hasn't committed currentSrc yet (rare), retry once after paint.
    let raf = 0
    if (!isBitmapReady(img)) {
      raf = requestAnimationFrame(() => {
        whenPaintable(img, reveal, isActive)
      })
    }

    return () => {
      active = false
      if (raf) cancelAnimationFrame(raf)
    }
  }, [src, reveal])

  const onFullLoad = (e: SyntheticEvent<HTMLImageElement>) => {
    whenPaintable(e.currentTarget, reveal, () => srcRef.current === src)
  }

  const onFullError = () => {
    // Keep preview visible; mark ready so we don't spin forever waiting.
    // (Preview remains the painted layer if full failed.)
    setReady(false)
  }

  /* Only set object-* inline when callers pass them — otherwise CSS wins.
     (Defaulting to cover here previously overrode Hero statue `contain`
     and cropped hands / L-R edges.) */
  const layerStyle: CSSProperties = {
    ...(objectFit ? { objectFit } : {}),
    ...(objectPosition ? { objectPosition } : {}),
    ...imgStyle,
  }

  const imgClass = imgClassName ? ` ${imgClassName}` : ''

  return (
    <div
      className={`progressive-image${ready ? ' is-ready' : ''}${className ? ` ${className}` : ''}`}
      data-progressive="blur-up"
      data-ready={ready ? 'true' : 'false'}
      style={style}
    >
      <img
        className={`progressive-image__preview${imgClass}`}
        src={preview}
        alt=""
        aria-hidden="true"
        draggable={false}
        style={layerStyle}
        loading="eager"
        decoding="async"
        fetchPriority={priority ? 'high' : 'low'}
      />
      <img
        key={src}
        ref={fullRef}
        className={`progressive-image__full${imgClass}`}
        src={src}
        alt={alt}
        draggable={false}
        style={layerStyle}
        sizes={sizes}
        // Blur-up requires parallel fetch. Native lazy left currentSrc empty
        // for below-fold nodes and caused permanent preview lock.
        loading="eager"
        decoding={decoding}
        fetchPriority={priority ? 'high' : 'auto'}
        onLoad={onFullLoad}
        onError={onFullError}
      />
    </div>
  )
}
