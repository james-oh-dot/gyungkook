/**
 * ============================================================================
 * 언론보도 (활동·보도 > 언론보도) — mock content for publishing
 * ============================================================================
 *
 * Figma frames (AI_dev):
 * - List: SUB_활동보도_언론보도_{TV방송|보도자료}_{DESKTOP|TABLET|MOBILE}
 * - Detail (shared): SUB_게시글_상세_* via `PostDetail`
 * - Sub visual: sub-04-02 (menu order 활동보도 = 04, 언론보도 = 02)
 *
 * Backend / CMS: replace PRESS_COVERAGE_POSTS with API keyed by `tab`.
 */

import type { BoardPost, BoardTabDef } from './board'
import { adjacentInList } from './board'
import { asset } from '../utils/asset'
import { progressiveAsset } from '../utils/progressiveImage'

const PRESS_COVERAGE_VISUAL = progressiveAsset('assets/sub/sub-04-02')

export type PressCoverageTab = 'tv' | 'release'

export const PRESS_COVERAGE_TABS: BoardTabDef[] = [
  { id: 'tv', label: 'TV방송', chip: 'TV방송' },
  { id: 'release', label: '보도자료', chip: '보도자료' },
]

export const PRESS_COVERAGE_PAGE = {
  parentLabel: '활동 · 보도',
  title: '언론보도',
  /** Figma layer name sub-04-02 — progressive WebP pair */
  visual: PRESS_COVERAGE_VISUAL.src,
  visualPreview: PRESS_COVERAGE_VISUAL.preview,
  basePath: '/press/coverage',
} as const

const THUMB = {
  tv1: asset('assets/press-coverage/thumb-tv-1.png'),
  tv2: asset('assets/press-coverage/thumb-tv-2.png'),
  tv3: asset('assets/press-coverage/thumb-tv-3.png'),
  tv4: asset('assets/press-coverage/thumb-tv-4.png'),
  release: asset('assets/press-coverage/thumb-release.png'),
} as const

const BODY_TV = [
  '경국 변호사가 방송에 출연해 주요 현안과 법률 쟁점을 짚었습니다. 시청자들에게 사건의 쟁점과 시사점을 알기 쉽게 설명하고, 관련 법령과 판례의 흐름을 정리했습니다.',
  '방송에서는 사실관계 확인, 적용 법리, 그리고 실무에서 자주 제기되는 질문을 중심으로 대화가 이어졌습니다. 경국은 재개발·보상 등 전문 영역에서의 경험을 바탕으로 균형 잡힌 시각을 제시했습니다.',
]

const BODY_RELEASE = [
  '법무법인 경국이 주요 현안과 관련한 입장과 법률 해석을 담은 보도자료를 발표했습니다.',
  '본 자료는 관련 법령과 판례, 실무 관행을 토대로 작성되었으며, 언론 및 이해관계자의 이해를 돕기 위한 참고 자료입니다.',
]

const TV_SUMMARY = '수십년 일군 땅에서 쫒겨나는 농민들 그 사연은'

const TV_SEED: Array<Pick<BoardPost, 'title' | 'summary' | 'thumbnail'>> = [
  { title: 'KBS2 제보자들', summary: TV_SUMMARY, thumbnail: THUMB.tv1 },
  { title: 'KBS2 제보자들', summary: TV_SUMMARY, thumbnail: THUMB.tv2 },
  { title: 'KBS2 제보자들', summary: TV_SUMMARY, thumbnail: THUMB.tv3 },
  { title: 'KBS2 제보자들', summary: TV_SUMMARY, thumbnail: THUMB.tv4 },
]

function buildTvPosts(): BoardPost[] {
  return Array.from({ length: 8 }, (_, i) => {
    const seed = TV_SEED[i % TV_SEED.length]!
    const n = i + 1
    return {
      id: `tv-${n}`,
      tab: 'tv',
      title: seed.title,
      summary: seed.summary,
      publishedAt: '2026.06.29 10:16',
      views: 75,
      thumbnail: seed.thumbnail,
      detailImage: seed.thumbnail,
      body: BODY_TV,
    }
  })
}

function buildReleasePosts(): BoardPost[] {
  return Array.from({ length: 8 }, (_, i) => ({
    id: `release-${i + 1}`,
    tab: 'release',
    title: '경국, 보도자료 제목 텍스트',
    summary: '경국 법률사무소 보도자료 요약 텍스트가 한 줄로 표시됩니다',
    publishedAt: '2026.06.29 10:16',
    views: 42,
    thumbnail: THUMB.release,
    detailImage: THUMB.release,
    body: BODY_RELEASE,
  }))
}

export const PRESS_COVERAGE_POSTS: Record<PressCoverageTab, BoardPost[]> = {
  tv: buildTvPosts(),
  release: buildReleasePosts(),
}

export function isPressCoverageTab(value: string | undefined): value is PressCoverageTab {
  return value === 'tv' || value === 'release'
}

export function pressPostsByTab(tab: PressCoverageTab): BoardPost[] {
  return PRESS_COVERAGE_POSTS[tab]
}

export function findPressPost(tab: PressCoverageTab, postId: string): BoardPost | undefined {
  return PRESS_COVERAGE_POSTS[tab].find((item) => item.id === postId)
}

export function adjacentPressPosts(tab: PressCoverageTab, postId: string) {
  return adjacentInList(PRESS_COVERAGE_POSTS[tab], postId)
}

export function pressTabListPath(tab: PressCoverageTab): string {
  return `${PRESS_COVERAGE_PAGE.basePath}/${tab}`
}

export function pressPostDetailPath(tab: string, postId: string): string {
  return `${PRESS_COVERAGE_PAGE.basePath}/${tab}/${postId}`
}
