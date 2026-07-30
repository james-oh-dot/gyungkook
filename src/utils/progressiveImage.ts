import { asset } from './asset'

/**
 * Progressive (blur-up) image pair.
 * - `preview`: tiny WebP (~32–64px) shown immediately with blur
 * - `src`: high-quality WebP (q≈90) that crossfades in when ready
 *
 * See `docs/progressive-images.md`.
 */
export type ProgressiveSrc = {
  src: string
  preview: string
}

/**
 * Build a progressive pair from a public path stem (no extension).
 * Example: `progressiveAsset('assets/sub/sub-01-01')`
 * → `{ src: …/sub-01-01.webp, preview: …/sub-01-01.preview.webp }`
 */
export function progressiveAsset(stem: string): ProgressiveSrc {
  const normalized = stem.replace(/^\//, '').replace(/\.(jpe?g|png|webp)$/i, '')
  return {
    src: asset(`${normalized}.webp`),
    preview: asset(`${normalized}.preview.webp`),
  }
}
