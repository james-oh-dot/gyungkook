/**
 * ============================================================================
 * 법무법인 경국 > 경국인 · 갤러리 (sub-01-04) — content
 * ============================================================================
 *
 * Figma frame: `SUB_법무법인경국_경국인갤러리` (94:3369). One-scroll page with
 * two scroll-mode local tabs (경국인 / 갤러리) mirroring 법인소개(aboutIntro):
 *   - 경국인: layered brand pyramid (outer ring rotate / white disc pulse /
 *     3 hoverable tiers) + serif quote + 경국인의 약속 (10)
 *   - 갤러리: masonry photo grid (placeholder tiles until real 경국인 photos arrive)
 *
 * Assets:
 *   - `sub-01-04` hero (node 94:3371): baked title painted out for live SubVisual
 *   - Pyramid layers (node 94:3384): `gallery/pyramid-ring.png` (sunburst) +
 *     tier SVGs; labels are live HTML (not baked) so hover scale includes text.
 */

import { asset } from '../utils/asset'
import { progressiveAsset } from '../utils/progressiveImage'

const GALLERY_VISUAL = progressiveAsset('assets/sub/sub-01-04')

export type GalleryTabId = 'people' | 'gallery'

export type GalleryTabDef = { id: GalleryTabId; label: string }

export const GALLERY_TABS: GalleryTabDef[] = [
  { id: 'people', label: '경국인' },
  { id: 'gallery', label: '갤러리' },
]

export const GALLERY_PAGE = {
  parentLabel: '법무법인경국',
  title: '경국인 · 갤러리',
  /** Figma sub-01-04 — progressive WebP pair */
  visual: GALLERY_VISUAL.src,
  visualPreview: GALLERY_VISUAL.preview,
  basePath: '/about/gallery',
} as const

export type GalleryPyramidTier = {
  id: 'top' | 'mid' | 'bot'
  label: string
  shape: string
  /** Intrinsic SVG aspect used for layout width % of the 564 diagram */
  widthPct: number
}

/** Layered brand pyramid (Figma 94:3384) — ring / disc / 3 tiers. */
export const GALLERY_PYRAMID = {
  alt: '경국 · 경국인 · 고객 3단 브랜드 피라미드',
  ring: asset('assets/gallery/pyramid-ring.png'),
  tiers: [
    {
      id: 'top',
      label: '고객',
      shape: asset('assets/gallery/pyramid-tier-top.svg'),
      widthPct: 27.3, // 154/564 — Figma 94:3386 clean triangle (no shadow pad)
    },
    {
      id: 'mid',
      label: '경국인',
      shape: asset('assets/gallery/pyramid-tier-mid.svg'),
      widthPct: 56.0, // ~316/564
    },
    {
      id: 'bot',
      label: '경국',
      shape: asset('assets/gallery/pyramid-tier-bot.svg'),
      widthPct: 85.1, // ~480/564
    },
  ] satisfies GalleryPyramidTier[],
} as const

/** Serif quote under the pyramid (NanumMyeongjo in Figma). */
export const GALLERY_QUOTE = {
  lines: ['경국의 이념 위에', '경국인의 수고로움을 더하여', '고객만족을 구현하는'],
  strong: ['고객가치의 수호자,', '법무법인 경국입니다.'],
} as const

export type Promise = { no: number; en: string; ko: string }

export const GALLERY_PROMISE = {
  enLabel: 'Our Promise as Gyeonggook',
  title: '경국인의 약속',
  items: [
    {
      no: 1,
      en: 'Basement',
      ko: '기초부터 튼튼한 집을 짓는 마음으로, 가장 기본적인 법리부터 시작해 응용으로 나아갑니다',
    },
    {
      no: 2,
      en: 'Responsibility',
      ko: '남의 일처럼 대하지 않으며, 고객서비스를 제공하는 책임자로서 임합니다',
    },
    {
      no: 3,
      en: 'Communication',
      ko: '신속한 소통, 깊은 경청으로 더 귀 기울이고 마음에 새기겠습니다.',
    },
    {
      no: 4,
      en: 'Analysis',
      ko: '냉정한 통찰력으로 날카롭게 분석하며 과학적으로 접근하겠습니다.',
    },
    {
      no: 5,
      en: 'Diversity',
      ko: '우리와 다른 생각, 입장 … 그 다양성을 폭넓게 이해하고 수용하겠습니다.',
    },
    {
      no: 6,
      en: 'Performance',
      ko: '늦지 않은 즉각적인 대응, 일필휘지의 기세로 최상의 퍼포먼스를 구현하겠습니다.',
    },
    {
      no: 7,
      en: 'Sincerity',
      ko: '모든 법률적 언행에 진심을 담아 상대방과 법관에 호소하겠습니다.',
    },
    {
      no: 8,
      en: 'Struggle',
      ko: '쉽게 놓아버리지 않으며, 단 1%의 가능성 만으로도 끝까지 싸워 이루겠습니다.',
    },
    {
      no: 9,
      en: 'Respect',
      ko: '고객이 지키고자 하는 주관적 가치를 존중하며, 그 동안의 노고에 깊은 경의를 표합니다.',
    },
    {
      no: 10,
      en: 'Augmentation',
      ko: '단순한 유지와 보호를 넘어서서, 가치의 극대화(증강)을 도모합니다.',
    },
  ] satisfies Promise[],
} as const

/**
 * 갤러리 masonry (Figma `gallery` 94:3781). 9 tiles in a 3-col grid; two 2×2
 * "big" tiles anchor the top-left and bottom-right. `span` = big tile.
 * Photos are placeholders until real 경국인 gallery images are provided.
 */
export type GalleryTile = { id: string; big?: boolean }

export const GALLERY_GRID = {
  title: ['경국, 그리고', '경국인의 아름다운', '순간들입니다'],
  tiles: [
    { id: 'g1', big: true },
    { id: 'g2' },
    { id: 'g3' },
    { id: 'g4' },
    { id: 'g5' },
    { id: 'g6' },
    { id: 'g7' },
    { id: 'g8' },
    { id: 'g9', big: true },
  ] satisfies GalleryTile[],
} as const
