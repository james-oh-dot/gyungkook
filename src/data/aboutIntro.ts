import { asset } from '../utils/asset'

/** Figma SUB_법무법인경국_법인소개 — sub-01-01 */
export const ABOUT_INTRO_PAGE = {
  parentLabel: '법무법인경국',
  title: '법인 소개',
  visual: asset('assets/sub/sub-01-01.jpg'),
  basePath: '/about/intro',
} as const

export type AboutIntroTabId = 'about' | 'philosophy' | 'strength' | 'partners'

export type AboutIntroTabDef = {
  id: AboutIntroTabId
  label: string
}

export const ABOUT_INTRO_TABS: AboutIntroTabDef[] = [
  { id: 'about', label: '법무법인경국 소개' },
  { id: 'philosophy', label: '이념' },
  { id: 'strength', label: '강점' },
  { id: 'partners', label: '협력사' },
]

export const ABOUT_INTRO_ABOUT = {
  enLabel: 'ABOUT 경국',
  title: '법무법인경국 소개',
  paragraphs: [
    '법무법인경국은 대한변호사협회에서 인증된 재개발·재건축·수용보상·행정 분야을 주축으로 하여 조합·이에준하는단체·공공기관 등 자문 및 소송을 다수 수행하고 있으며 감정평가사 자격을 보유한 변호사의 차별성에 법원감정인 경험을 더하여 보다 정확한 가치평가와 분석을 제공함으로써 고객의 가치를 수호하고 극대화 할 수 있는 서초동 소재 전문로펌입니다.',
    '단체소송에 특화된 로펌의 경력을 바탕으로 다수당사자 사건의 빠르고 정확한 처리가 가능한 강점을 지녔으면서도 20년 이상 다방면의 사건경험을 갖춘 탄탄한 실무진이 분야별 전담팀을 유기적으로 구성하고 있어 어떤 분야의 문제가 발생하더라도 즉각적인 대응이 가능한 시스템을 구축하고 있습니다.',
  ],
  values: [
    { no: '01', title: 'Humanity', icon: asset('assets/about/value-01.svg') },
    { no: '02', title: '소통', icon: asset('assets/about/value-02.svg') },
    { no: '03', title: '공존과 협력', icon: asset('assets/about/value-03.svg') },
    { no: '04', title: '다양성 존중', icon: asset('assets/about/value-04.svg') },
    { no: '05', title: '가치의 영속성', icon: asset('assets/about/value-05.svg') },
  ],
} as const

export const ABOUT_INTRO_PHILOSOPHY = {
  enLabel: 'PHILOSOPHY',
  title: '사명에 담은 이념, 耕과 局',
  ciLogo: asset('assets/about/ci-logo.png'),
  ciMeaningLabel: 'CI 의미',
  ciMeaning:
    '경국의 ‘ㄱ’과 ‘ㅇ’을 담고, 쟁기로 밭을 갈아 가치를 일구는 정성 어린 마음을 형상화 하였습니다.',
  hanja: [
    { char: '耕', reading: '밭갈 경' },
    { char: '局', reading: '판 국' },
  ],
  hanjaNotes: [
    '논밭을 갈다, 고르다, 평평하게 하다, 농사에 힘쓰다',
    '사무를 맡아보는 부서, 재능, 도량, 바둑·장기에서 승부를 내는 판',
  ],
  body: [
    '누구나 최선을 다한다고 말하지만, 진정한 결실을 맺기 위해서는 농부가 밭을 일구는 묵묵한 정성과 희생이 필요합니다.',
    '비록 변호사의 역할을 수행하지만, 고객의 땅에 뿌려진 귀중한 씨앗을 알뜰히 살피고 키우는 농부의 마음으로 일하며(耕), 시류를 읽는 지혜와 결단력으로 판(局)세를 가르는 승부를 약속 드립니다.',
  ],
  quote: ['농부의 마음으로 일하며,', '판세를 가르는 승부를', '약속드립니다.'],
  quoteMark: asset('assets/about/quote-teal.svg'),
} as const

export const ABOUT_INTRO_STRENGTH = {
  enLabel: 'STRENGTH',
  title: '법무법인 경국의 강점',
  lead: [
    '법무법인 경국은 구성원 변호사 50% 이상이 감정평가사 자격 및 법원 감정인 경력을 갖추고 있어 부동산·유체동산·기타재산권 등 가치 분석과 조정에 탁월한 능력을 보유하고 있으며,',
    '분쟁 대상이 된 가치의 정확한 분석을 바탕으로 가치의 극대화가 가능한 로펌입니다.',
    '이는 재개발·재건축·정비사업을 큰 축으로 하면서도 민사 ·행정 ·가사 ·기업법무 등 분야별 전문팀을 구축한 법무법인 경국의 강한 경쟁력을 뒷받침해주는 핵심요소라 할 수 있습니다.',
  ],
  features: [
    {
      no: '1',
      title: '감정평가사 자격 보유',
      body: '구성원 변호사 50% 이상이 감정평가사 자격 및 법원감정인 경력을 갖추고 있습니다.',
    },
    {
      no: '2',
      title: '정비사업 특화 경력',
      body: '재개발·재건축·정비사업을 큰 축으로 축적된 사건 경험을 보유합니다.',
    },
    {
      no: '3',
      title: '법원감정인 경력',
      body: '부동산·유체동산·기타재산권 등 가치 분석과 조정에 강점을 갖습니다.',
    },
    {
      no: '4',
      title: '분야별 전담팀 연계',
      body: '민사·행정·가사·기업법무 등 분야별 전문팀과 협업합니다.',
    },
  ],
  dark: {
    title: [
      '자산 가치의 정확한 예측에서부터 시작되는',
      '분쟁의 예방과 해결, 그리고 가치의 Level UP',
    ],
    body: [
      '경국은 가치의 정확한 분석을 바탕으로 분쟁을 예방하고 해결하며,',
      '고객 가치의 Level UP을 목표로 합니다.',
    ],
    seal: asset('assets/about/dark-seal.png'),
    items: [
      '구성원 50% 이상 감정평가사 자격 보유 및 법원감정인 출신',
      '회계사·법무사·전문위원 등 분야별 전문인력 풀과 협력',
      '수천 세대 구역별 사건처리를 통한 방대하고 다양한 경험',
    ],
  },
  steps: [
    {
      no: '01',
      title: '재개발 · 단체소송 · 공공기관 자문 특화',
      paragraphs: [
        {
          parts: [
            { text: '법무법인 경국은 구성원 변호사 50% 이상이 ' },
            { text: '감정평가사 자격', bold: true },
            {
              text: '을 겸비한 변호사들로 구성되어 따라 올 수 없는 과학적 ·수치적 가치평가가 가능하며 가치의 예측 · 조정 · 증대에 탁월한 실력을 자랑합니다.',
            },
          ],
        },
        {
          parts: [
            {
              text: '여기에 더하여, 10년 이상 누적된 경험을 바탕으로 대한변호사협회에서 인증한 재개발·재건축 전문인증 내역은 법인의 공신력을 더욱 높여주고 있습니다.',
            },
          ],
        },
        {
          parts: [
            {
              text: '재개발· 명도(가처분) · 등기는 물론이고 조합이나 비대위 · 추진위를 서포트 하는 자문 · 소송대리를 다수 진행하고 있으며, 국내 대기업 · 전국 지방자치단체(시청 · 군청) 및 산업단지 등 대규모 권리관계가 얽힌 분야에 있어서도 역시 특수한 메리트를 보유하고 있습니다.',
            },
          ],
        },
      ],
      image: asset('assets/about/strength-01.png'),
      imageFlipY: false,
    },
    {
      no: '02',
      title: '분야별 전담센터로 다양한 사건처리 가능',
      paragraphs: [
        {
          parts: [
            {
              text: '다수 당사자 사건들을 다수 행하다 보면 그 안에서 결부되어 있는 각종 개인간의 분쟁(민사 ·형사 ·가사 ·행정 ·채권추심 ·지적재산권 등) 다양한 사건까지 일체로 처리하게 됩니다.',
            },
          ],
        },
        {
          parts: [
            {
              text: '상속인들간의 권리다툼(지분, 유류분, 유증, 증여, 기여분 등)에서부터 이혼재산분할, 형사고소, 민사소송 등에 이르기까지 다양한 사인간 분쟁에 대한 DB를 보유하고 있어 예측불허의 상황에서도 신속한 자문과 소송대리가 가능합니다.',
            },
          ],
        },
        {
          parts: [
            {
              text: '법무법인 경국에서는 20년 가까운 경험을 갖춘 실무진으로 구성된 별도의 분야별 전담팀을 구성하여, 24시간 365일 어떤 문제가 발생해도 즉각적으로 대응할 수 있는 시스템을 갖추고 있습니다.',
            },
          ],
        },
      ],
      image: asset('assets/about/strength-02.png'),
      imageFlipY: false,
    },
    {
      no: '03',
      title: '경청, 집중, 전문성, 그리고 해결',
      paragraphs: [
        {
          parts: [
            {
              text: '법무법인 경국(耕局)은 당신의 고민이 무엇인지 묻고 끝나는 것에 그치지 않고,',
            },
          ],
        },
        {
          parts: [
            { text: '상황에 대하여 경청하고 집중적으로 분석하며,' },
          ],
        },
        {
          parts: [
            {
              text: '여러 전문가의 검토를 거쳐 당신의 법적 고민을 ‘해결’ 합니다.',
            },
          ],
        },
      ],
      image: asset('assets/about/strength-03.png'),
      imageFlipY: true,
    },
  ],
  cityQuote: {
    image: asset('assets/about/quote-city.png'),
    mark: asset('assets/about/quote-white.svg'),
    lines: ['고객의 하루 한 시간도 소중하게.', '사건 처리의 속도가 다른 로펌.'],
    sub: [
      '대법원 / 대검찰청 / 서울중앙·고등법원',
      '서울중앙·고등검찰청 / 등기국 등',
      '주요 법조 기관이 모여있는 서초역에 위치',
    ],
  },
  corporateValue: {
    watermark: '企業價値',
    badge: '기업가치',
    items: [
      {
        title: ['신뢰를', '최우선 가치로 하는 로펌'],
        body: '법무법인 경국의 변호사들은 10년 이상 경력의 대표변호사 산하에 재개발재건축, 토지보상 등 대규모 정비사업 관련 사건경험을 갖춘 변호사단으로 구성되어 있습니다 . 서울지방법원 등 법원감정인 출신 감정평가사 자격 변호사단이 협업하여 과학적으로 최상의 시스템과 솔루션을 제공합니다.',
      },
      {
        title: ['전문성 · 속도 · 정확성을', '모두 갖춘 로펌'],
        body: '법무법인 경국은 형식적인 규모와 분야 분류를 갖춘 로펌이 아니라, 실질적인 재건축 재개발 전문로펌의 효시 입니다. 각 분야별로 대한변호사협회 전문 인증을 받은 전문 경력 변호사들이 상주하면서, 일·주·월 정기 통합 회의를 통해 경국에 선임된 사안을 점검하고 다각적인 측면에서 함께 접근하기에, 가장 정확하고 안전한 법적 검토가 가능합니다.',
      },
      {
        title: ['고객 우선 법률서비스'],
        body: '법무법인경국은 전담변호사의 철저한 관리, 상시피드백, 열린소통창구를 통해 고객만족법률서비스를 제공합니다.\n총무·송무 등 각 팀별 철저한 분업화, 사건처리 단계별 시스템 구축으로 저비용 고효율의 사건처리가 가능합니다.',
      },
    ],
  },
} as const

export const ABOUT_INTRO_PARTNERS = {
  enLabel: 'PARTNERS',
  title: '함께 합니다',
  logos: [
    asset('assets/about/partners/partner-01.png'),
    asset('assets/about/partners/partner-02.png'),
    asset('assets/about/partners/partner-03.jpg'),
    asset('assets/about/partners/partner-04.png'),
    asset('assets/about/partners/partner-05.png'),
    asset('assets/about/partners/partner-06.png'),
    asset('assets/about/partners/partner-07.png'),
    asset('assets/about/partners/partner-08.png'),
    asset('assets/about/partners/partner-09.png'),
    asset('assets/about/partners/partner-10.png'),
    asset('assets/about/partners/partner-11.png'),
    asset('assets/about/partners/partner-12.png'),
    asset('assets/about/partners/partner-13.png'),
    asset('assets/about/partners/partner-14.png'),
    asset('assets/about/partners/partner-15.png'),
    asset('assets/about/partners/partner-16.png'),
    asset('assets/about/partners/partner-17.jpg'),
    asset('assets/about/partners/partner-18.png'),
    asset('assets/about/partners/partner-19.png'),
  ],
} as const
