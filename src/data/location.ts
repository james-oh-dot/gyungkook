import { asset } from '../utils/asset'
import { progressiveAsset } from '../utils/progressiveImage'

const LOCATION_VISUAL = progressiveAsset('assets/sub/sub-01-06')

export const LOCATION_PAGE = {
  parentLabel: '법무법인경국',
  title: '오시는 길',
  visual: LOCATION_VISUAL.src,
  visualPreview: LOCATION_VISUAL.preview,
  lead: ['고객의 하루 한 시간도 소중하게.', '사건 처리의 속도가 다른 로펌.'],
  description:
    '대법원, 대검찰청, 중앙고등법원, 중앙고등검찰청, 등기국 등 주요 법조기관 소재지에 위치합니다.',
  address: '서울특별시 서초구 서초대로 264, 15층',
  addressDetail: '(서초동, 법조타워)',
  icons: {
    tram: asset('assets/icon-tram.svg'),
    parking: asset('assets/icon-parking.svg'),
    location: asset('assets/icon-location.svg'),
    phone: asset('assets/icon-phone.svg'),
    clock: asset('assets/icon-clock.svg'),
  },
} as const
