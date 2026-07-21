/**
 * ============================================================================
 * 법무법인 경국 > 대표 인사말 (sub-01-02) — content
 * ============================================================================
 *
 * Figma frames: `SUB_법무법인경국_대표인사말` (92:2898) + _TABLET (92:2986) /
 * _MOBILE (92:3067). A single static page (no local tabs): hero_type2 (no chip)
 * → large CEO photo → two-column greeting (left heading / right body + sign).
 *
 * Assets (extracted directly from Figma via `get_screenshot` — figma.com
 * download URLs are egress-blocked in this session, but MCP inlines the PNG):
 * - `sub-01-02` hero: node 92:2910, with the baked "대표 인사말" title painted
 *   out (cv2 inpaint) so `SubVisual` can overlay its own live/responsive title
 *   like every other subpage — see WORKLOG 2026-07-21.
 * - `greeting/ceo`: node 92:2916 (CEO photo, 1280×688).
 * - `greeting/signature`: node 92:2925 (공대호 signature; white keyed to alpha).
 */

import { progressiveAsset } from '../utils/progressiveImage'

const GREETING_VISUAL = progressiveAsset('assets/sub/sub-01-02')
const GREETING_PORTRAIT = progressiveAsset('assets/greeting/ceo')
const GREETING_SIGNATURE = progressiveAsset('assets/greeting/signature')

/** A greeting paragraph block — lines rendered with <br>; '' = stanza gap. */
export type GreetingBlock = string[]

export const GREETING_PAGE = {
  parentLabel: '법무법인경국',
  title: '대표 인사말',
  /** Figma sub-01-02 — progressive WebP pair */
  visual: GREETING_VISUAL.src,
  visualPreview: GREETING_VISUAL.preview,
  basePath: '/about/greeting',

  /** CEO photo (progressive blur-up) */
  portrait: GREETING_PORTRAIT.src,
  portraitPreview: GREETING_PORTRAIT.preview,
  /** 공대호 signature (transparent PNG → WebP) */
  signature: GREETING_SIGNATURE.src,
  signatureAlt: '대표변호사 공대호 서명',

  eyebrow: 'ABOUT 경국',
  heading: ['안녕하세요,', '법무법인 경국 CEO', '공대호 대표변호사 입니다.'],

  blocks: [
    [
      '변호사 4만명 시대.',
      '권위적이고 폐쇄적이던 법률시장 역시',
      '급속한 변화의 물결을 피할 수 없게 되었습니다.',
      '',
      '과잉 정보, 상업적 법률상담으로 인해',
      '오히려 더 큰 실망감을 얻진 않으셨나요?',
      '진심으로 나의 목소리를 경청할 변호사를 찾으시나요?',
      '',
      '법무법인 경국은 변호사 본연의 역할수행에',
      '유일한 목표를 두고 시작되었습니다.',
    ],
    [
      '법무법인 경국의 변호사들은',
      '잠깐의 명예와 경력을 위해 변호사로서의 기본 윤리를 벗어나거나',
      '고객을 영리의 수단으로 바라보지 않습니다.',
      '',
      '하나의 사안이 끝난 이후',
      '모든 과업을 다했다고 생각하지 않겠습니다.',
      '',
      '경국과 만난 이후',
      '고객의 10년, 20년, 30년을 고민하겠습니다.',
      '',
      '변호사로서 다할 수 있는 최선을 다한 뒤',
      '고객의 마음에서 기적을 기도하는 벗이 되겠습니다.',
      '',
      '귀하의 미래를 함께 하는 한 페이지가 될 수 있도록',
      '언제든 경국의 문을 두드려 주시기 바랍니다.',
      '감사합니다.',
    ],
  ] satisfies GreetingBlock[],
} as const
