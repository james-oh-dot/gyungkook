/** Copy for the desktop-only 빠른문자상담 strip above the footer. */

export const QUICK_CONSULT = {
  eyebrow: 'CONTACT',
  title: '빠른문자상담',
  description:
    '간단한 정보만 남겨 주시면, 담당 변호사가 확인 후 빠르게 연락드립니다.',
  fields: {
    name: { label: '이름', placeholder: '홍길동', autoComplete: 'name' },
    phone: {
      label: '전화번호',
      placeholder: '010-0000-0000',
      autoComplete: 'tel',
    },
    message: {
      label: '상담내용',
      placeholder: '상담하고 싶은 내용을 간단히 적어 주세요.',
    },
  },
  modes: [
    { id: 'call', label: '전화상담' },
    { id: 'visit', label: '방문상담' },
    { id: 'sms', label: '문자상담' },
  ] as const,
  consent: {
    label: '개인정보 수집·처리·이용 동의',
    linkLabel: '내용 보기',
  },
  submit: '상담 신청',
  submitting: '신청 중…',
  success: {
    title: '상담 신청이 접수되었습니다',
    body: '남겨 주신 연락처로 빠르게 안내드리겠습니다.',
    again: '추가 상담 신청',
  },
} as const

export type QuickConsultMode = (typeof QUICK_CONSULT.modes)[number]['id']

export const PRIVACY_DRAWER = {
  eyebrow: 'PRIVACY',
  title: '개인정보 수집·처리·이용 안내',
  sections: [
    {
      heading: '1. 수집 항목',
      body: '이름, 전화번호, 상담내용, 상담 희망 방식(전화·방문·문자).',
    },
    {
      heading: '2. 수집 목적',
      body: '법률 상담 접수, 상담 일정 안내, 문의에 대한 회신 및 관련 안내.',
    },
    {
      heading: '3. 보유 및 이용 기간',
      body: '상담 목적 달성 후 지체 없이 파기합니다. 단, 관련 법령에 따라 보관이 필요한 경우 해당 기간 동안 보관합니다.',
    },
    {
      heading: '4. 동의 거부 권리',
      body: '동의를 거부할 수 있습니다. 다만 동의하지 않을 경우 상담 신청 서비스 이용이 제한될 수 있습니다.',
    },
    {
      heading: '5. 처리 위탁 및 제3자 제공',
      body: '수집된 개인정보는 상담 목적 범위 내에서만 이용하며, 법령에 따른 경우를 제외하고 제3자에게 제공하지 않습니다.',
    },
  ],
} as const
