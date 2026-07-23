/**
 * Supplied performance spreadsheets contain some project names without spaces
 * between their meaningful legal/project terms. Add display-only spacing so a
 * result card can wrap on those terms instead of overflowing its grid cell.
 */
const WORD_BOUNDARIES = [
  '재정비촉진구역',
  '도시환경정비사업',
  '주택재개발정비사업',
  '주택재건축정비사업',
  '소규모재건축정비사업',
  '소규모재개발사업',
  '가로주택정비사업',
  '주택재개발사업',
  '주택재건축사업',
  '지식산업단지개발사업',
  '일반산업단지조성사업',
  '일반산업단지개발사업',
  '도시개발사업',
  '택지개발사업',
  '공공주택지구',
  '지역주택사업',
  '정비사업',
]

const BOUNDARY_PATTERN = new RegExp(
  `(?<!\\s)(${WORD_BOUNDARIES.join('|')})`,
  'g',
)

export function formatPerformanceTitle(title: string): string {
  return title.replace(BOUNDARY_PATTERN, ' $1').replace(/\\s{2,}/g, ' ').trim()
}
