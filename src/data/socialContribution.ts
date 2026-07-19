/**
 * ============================================================================
 * 사회공헌 (활동·보도 > 사회공헌) — mock content for publishing
 * ============================================================================
 *
 * Figma frames (AI_dev / AI-subpage-04):
 * - List: SUB_활동보도_사회공헌_{DESKTOP|TABLET|MOBILE}
 * - Detail (shared): SUB_게시글_상세_* via `PostDetail`
 * - Sub visual: sub-04-04 (menu order 활동보도 = 04, 사회공헌 = 04)
 *
 * No local tabs — single board list + detail.
 * Backend / CMS: replace SOCIAL_CONTRIBUTION_POSTS with API.
 */

import type { BoardPost, BoardTabDef } from './board'
import { adjacentInList } from './board'
import { asset } from '../utils/asset'

/** Single board key (kept for BoardPost / PostDetail compatibility). */
export type SocialContributionTab = 'social'

export const SOCIAL_CONTRIBUTION_TABS: BoardTabDef[] = [
  { id: 'social', label: '사회공헌', chip: '사회공헌' },
]

export const SOCIAL_CONTRIBUTION_PAGE = {
  parentLabel: '활동 · 보도',
  title: '사회공헌',
  enLabel: 'SOCIAL',
  intro: [
    '법무법인 경국은 승소, 성공, 완전회복, 가치극대화를 위하여 고객을 대신하여 첨예하게 대립하고 투쟁하지만 경국이 설립된 기초에는 사람에 대한 따뜻한 관심, 약자에 대한 배려, 사회공동체의 공존과 영속에 근본적인 중점을 두고 있습니다.',
    '극단적이고 양극화 된 사회가 아닌 함께 걸어가는 공동체가 될 수 있도록 지속적인 사회공헌에 힘쓰겠습니다.',
  ],
  /** Figma layer name sub-04-04 */
  visual: asset('assets/sub/sub-04-04.jpg'),
  basePath: '/press/social',
} as const

const THUMB = asset('assets/social/thumb-1.png')

const BODY = [
  '법무법인 경국은 사회 공동체의 공존과 나눔을 위해 다양한 사회공헌 활동을 이어가고 있습니다.',
  '취약계층 법률 지원, 지역 사회와의 협력, 공익 캠페인 등 경국의 전문성을 바탕으로 실질적인 도움이 될 수 있는 활동을 모색합니다.',
  '앞으로도 사람과 공동체를 중심에 두고, 지속 가능한 사회공헌에 힘쓰겠습니다.',
]

const SUMMARY =
  '사회공헌 내용사회공헌 내용사회공헌 내용사회공헌 내용사회공헌 내용사회공헌 내용사회공헌 내용사회공헌 내용사회공헌 내용사회공헌 내용사회공헌 내용'

function buildPosts(): BoardPost[] {
  return Array.from({ length: 8 }, (_, i) => {
    const n = i + 1
    return {
      id: `social-${n}`,
      tab: 'social',
      title: '사회공헌 제목',
      summary: SUMMARY,
      publishedAt: '2026.06.29 10:16',
      views: 75,
      thumbnail: THUMB,
      detailImage: THUMB,
      body: BODY,
    }
  })
}

export const SOCIAL_CONTRIBUTION_POSTS: BoardPost[] = buildPosts()

export function socialPosts(): BoardPost[] {
  return SOCIAL_CONTRIBUTION_POSTS
}

export function findSocialPost(postId: string): BoardPost | undefined {
  return SOCIAL_CONTRIBUTION_POSTS.find((item) => item.id === postId)
}

export function adjacentSocialPosts(postId: string) {
  return adjacentInList(SOCIAL_CONTRIBUTION_POSTS, postId)
}

export function socialListPath(): string {
  return SOCIAL_CONTRIBUTION_PAGE.basePath
}

export function socialPostDetailPath(_tab: string, postId: string): string {
  return `${SOCIAL_CONTRIBUTION_PAGE.basePath}/${postId}`
}
