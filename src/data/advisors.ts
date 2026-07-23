/**
 * 법무법인 경국 > 변호사 · 자문단 — 자문단 directory + drawer content.
 * Source copy: https://gyunggook.com/attorneys (자문단 section).
 * No SPA routes — in-page drawer / mobile bottom sheet only.
 *
 * Portraits: public/assets/advisors/{id}.jpg (+ progressive webp pair).
 */

import { progressiveAsset } from '../utils/progressiveImage'

export type AdvisorSection = {
  title: string
  items: string[]
}

export type Advisor = {
  id: string
  name: string
  title: string
  /** Short bullets on the directory card */
  highlights: string[]
  /** Full drawer body (학력 / 경력 / 주요업무 …) */
  sections: AdvisorSection[]
  photo: string
  photoPreview: string
}

const photo = (id: string) => progressiveAsset(`assets/advisors/${id}`)

function advisor(
  id: string,
  name: string,
  title: string,
  highlights: string[],
  sections: AdvisorSection[],
): Advisor {
  const p = photo(id)
  return {
    id,
    name,
    title,
    highlights,
    sections,
    photo: p.src,
    photoPreview: p.preview,
  }
}

/** Figma order (105:1310) — 이석우 / 윤규희 / 정현 / 조아라 / 백진기 */
export const ADVISORS: Advisor[] = [
  advisor(
    'leeseokwoo',
    '이석우',
    '전문위원',
    [
      'DL E&C(구 대림산업) 도시정비 담당임원 역임',
      '부동산 관련 자문(재개발·재건축·정비사업)',
      '건설 관련 자문(도급계약·입찰·인허가)',
      '건설 등 분쟁 관련 자문',
    ],
    [
      {
        title: '학력',
        items: [
          '장훈 고등학교 졸업',
          '한국외국어대학교 졸업',
          '한국외국어대학교 일반대학원 졸업',
        ],
      },
      {
        title: '경력',
        items: [
          'DL E&C(구 대림산업)',
          '도시정비 수주 및 관리업무 담당',
          '건축기획업무, 현장관리',
          '도시정비 팀장',
          '도시정비 담당임원 역임',
        ],
      },
      {
        title: '주요업무',
        items: [
          '부동산 관련 자문(재개발, 재건축, 정비사업추진 관련 업무 등)',
          '건설 관련 자문(도급계약, 입찰, 인허가 등)',
          '건설 등 분쟁 관련 자문',
        ],
      },
    ],
  ),
  advisor(
    'yoonkyuhee',
    '윤규희',
    '전문위원',
    [
      '(현) 행정사',
      '수서·방배경찰서 청문감사관 역임',
      '형사 관련 자문',
      '행정·정비사업 관련 자문',
    ],
    [
      {
        title: '학력',
        items: ['장훈 고등학교 졸업', '한양대학교 법학과 졸업'],
      },
      {
        title: '경력',
        items: [
          '수서경찰서, 방배경찰서 청문감사관',
          '관악경찰서 안보과장',
          '서울지방경찰청 면접위원',
          '서울소방재난본부 감찰위원',
          '동작관악교육지원청 학교폭력 전담조사관',
          '(현) 행정사',
          '(현) 엠유엠 파트너스 전무이사',
          '(현) 법무사법인 동양 이사',
        ],
      },
      {
        title: '주요업무',
        items: [
          '형사 관련 자문',
          '행정, 정비사업 관련 자문(도급계약, 입찰, 인허가 등)',
        ],
      },
    ],
  ),
  advisor(
    'junghyun',
    '정현',
    '세무사',
    [
      '현) 성지세무회계 대표',
      '현) 서울시 마을세무사',
      '현) 은평구 지방세심의위원',
      '국세공무원 회계실무 강사 역임',
    ],
    [
      {
        title: '경력',
        items: [
          '그랜드힐튼호텔 재경부',
          '국세공무원 회계실무 강사',
          '현) 성지세무회계 대표',
          '현) 서울시 마을세무사',
          '현) 은평구 지방세심의위원',
        ],
      },
    ],
  ),
  advisor(
    'joara',
    '조아라',
    '노무사',
    [
      '현) 노동법률사무소 율정 대표노무사',
      '다현로앤컨설팅 노무법인 공인노무사',
      '연세대학교 국제학대학원 석사',
      'University of California Irvine 학사',
    ],
    [
      {
        title: '학력',
        items: [
          '연세대학교 국제학대학원 국제통상경영학 석사',
          'University of California Irvine (USA) 범죄법률학 학사',
          'Oaks Christian High School (USA) 졸업',
        ],
      },
      {
        title: '경력',
        items: [
          '다현로앤컨설팅 노무법인 공인노무사',
          '국제기구 한-아세안센터 근무',
          'The Korea Times 근무',
          '현) 노동법률사무소 율정 대표노무사',
        ],
      },
    ],
  ),
  advisor(
    'baekjinki',
    '백진기',
    '법무사',
    [
      '제10회 법무사',
      '수원·서울중앙지방법원 민사조정위원',
      'GS칼텍스㈜, GS에너지㈜ 전임법무사',
      '서울가정법원 성년후견인',
    ],
    [
      {
        title: '학력',
        items: ['전주 우석고등학교 졸업', '고려대학교 졸업'],
      },
      {
        title: '경력',
        items: [
          '제10회 법무사',
          'GS칼텍스㈜, GS에너지㈜ 전임법무사',
          '광교엘리시안 상가건물전체 총괄책임등기 진행',
          '판교테크노밸리아이포타벤쳐기업 건물전체 총괄책임등기 진행',
          '수원미래회계법인 협력법무사',
          '서울태경회계법인 협력법무사',
          '수원지방법원 민사조정위원(2008.02.26~현재)',
          '서울중앙지방법원 민사조정위원(2013.06.03~현재)',
          '서울가정법원 성년후견인',
          '양천구 신월복지관 자문',
        ],
      },
    ],
  ),
]

export function findAdvisor(id: string | undefined): Advisor | undefined {
  return ADVISORS.find((a) => a.id === id)
}
