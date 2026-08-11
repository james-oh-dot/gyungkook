# 법무법인 경국 — 변경분 패치 통합본 (PR #157 ~ #164)

생성일 2026-08-11 · 기준 커밋 `edc3824` → `2f76981` (main 기준)

앞서 따로 드린 두 묶음(`patch-2026-08-05` = PR #157~#161, `patch-2026-08-11`
= PR #163~#164)을 하나로 합친 것입니다. **이 묶음 하나만 적용하면 됩니다.**
겹치는 파일은 최신 내용(현재 main)이 들어 있습니다.

`files/` 안에 **변경·추가된 파일만** 저장소와 동일한 폴더 구조로 들어 있습니다.
저장소 루트에 그대로 덮어쓰면 적용됩니다. 삭제된 파일은 없습니다.

```
cp -R files/. /path/to/gyungkook/
```

(`files/.gitignore`는 숨김 파일이라 `files/*`가 아니라 `files/.`로 복사해야 포함됩니다.)

## 파일 목록 (37개)

### 신규 (22)

| 경로 | 내용 |
|---|---|
| `src/components/PartnerMarquee.tsx` `.css` | 홈 푸터 위 협력사 무한 흐름 띠 |
| `scripts/generate-partner-mono.py` | 협력사 로고 → 모노 변환 스크립트 (빌드에 포함되지 않는 개발용 도구) |
| `public/assets/partners-mono/partner-01…19.png` | 위 스크립트가 만든 모노 로고 19개 |

### 수정 (15)

| 경로 | 내용 |
|---|---|
| `src/components/HeroClassic.tsx` `.css` | 히어로 풀블리드·좌우 끝 화살표·swipe 제거, 좌측 카피 재배치, 타입 스케일, 라벨 글자 단위 등장 |
| `src/components/Gnb.tsx` `.css` | 풀메뉴 배경 이미지 제거 → 검은 리퀴드글라스, 서브메뉴 영역 슬라이드인·아웃 |
| `src/layouts/SiteLayout.tsx` | 협력사 띠를 홈 푸터 위에 배치 |
| `src/data/nav.ts` | 메뉴명: 업무사례 → 분야별 사례, 정비사업 → 정비사업 · 실적, 공익사업 → 공익사업 · 실적 |
| `src/data/caseStudies.ts` `renewal.ts` `publicProject.ts` `searchIndex.ts` | 위 메뉴명에 맞춘 페이지 히어로 타이틀 / 검색 문서 타이틀 |
| `src/data/content.ts` | 협력사 띠에 쓰는 로고 목록 |
| `src/data/slidesClassic.ts` | 슬라이드 03 라벨 오타 수정 (`Compensationand` → `Compensation and`) |
| `public/assets/about/partners/partner-09.png` `partner-19.png` | 의성군 · S-OIL 고해상도 원본 교체 |
| `.gitignore` | `__pycache__/` `*.pyc` 무시 (선택 사항 — 기존 파일에 이미 있으면 넘어가도 됩니다) |

## 변경 요약

### 홈 히어로 (PR #157, #163, #164)

- 이미지 풀블리드, swipe 컴포넌트 전면 제거, 이전/다음 화살표를 화면 좌우 끝으로.
- 좌측 카피를 `hero__index`의 좌측 수직 라인 하나에 정렬:
  `index → label → title → desc` (label이 title 위로, desc가 가장 아래).
- 타입 스케일:

  | 요소 | 이전 | 이후 |
  |---|---|---|
  | `hero__label` 크기 | `clamp(16px, 1.25vw, 24px)` | 데스크톱 `clamp(88px, 9.4vw, 108px)` · 768~1024 `72px` · 모바일 `clamp(30px, 11vw, 72px)` |
  | `hero__label` 줄간격 | `1.4` | `0.95` |
  | `hero__title` | `clamp(32px, 3.75vw, 72px)` · 모바일 `32px` | `clamp(20px, 1.875vw, 36px)` · 모바일 `20px` (나눔명조) |
  | `hero__desc` 위 간격 | 데스크톱 84px · 이하 28px | 데스크톱 30px · 이하 14px |

- 글자 등장 애니메이션 2배 감속, 라벨도 타이틀처럼 글자 단위 등장.

### 협력사 띠 (PR #157, #160, #161)

홈 푸터 바로 위 무한 흐름 띠. 로고는 모두 투명 배경 모노로 변환했습니다.
변환 톤 기준은 휘도가 아니라 **배경색과의 거리**입니다 — 검은 글자와 노란 마크가
섞인 로고(의성군)는 휘도 반전으로는 절반이 배경에 묻히기 때문입니다.

### GNB (PR #159, #160)

풀메뉴의 메뉴별 배경 이미지를 제거하고 검은 리퀴드글라스로 통일, 서브메뉴와
인디케이터 색상 재구성. 호버 시 서브메뉴 영역이 슬라이드인하고 마우스가 벗어나면
역방향으로 재생됩니다.

### 메뉴명 (PR #157)

GNB 라벨 · 페이지 히어로 타이틀 · 검색 인덱스에만 적용했습니다. 각 페이지 안쪽
섹션 제목과 탭 라벨은 의도적으로 그대로 뒀습니다.

## 개발자용 주의사항

- **`public/assets/partners-mono/`는 `scripts/generate-partner-mono.py`의 산출물입니다.** 원본(`public/assets/about/partners/`)을 바꾸면 스크립트를 다시 돌려 주세요: `python3 scripts/generate-partner-mono.py` (Pillow 필요).
- **`hero__label`은 단어마다 `CharReveal`을 하나씩 두고 `.hero__label-word`(`white-space: nowrap`)로 감쌌습니다.** 문자열 전체에 `CharReveal`을 한 번 쓰면 글자마다 독립된 inline-block 박스가 되어 아무 글자 사이에서나 줄바꿈이 일어납니다(`COMPENSATION`이 단어 중간에서 잘림). 라벨 문구를 바꿀 때 이 구조를 유지해 주세요.
- **`.hero__label`의 데스크톱 크기 규칙은 기본 규칙 뒤에 와야 합니다.** 둘 다 클래스 1개 깊이인데 미디어 쿼리는 특이도를 더하지 않아, 앞쪽 `@media (min-width: 1025px)` 블록에 넣으면 뒤쪽 기본 규칙에 밀려 적용되지 않습니다.
- **`--hero-maincopy-top`**(HeroClassic.tsx)은 화면 중앙 기준이 아니라 하단 고정된 `.hero__copy`에서 `MAINCOPY_COPY_GAP`(30px)만큼 위에 매다는 방식입니다. desc 위 간격은 이 상수 하나가 결정합니다.
- 라벨 크기 상한을 더 올릴 경우, 슬라이드 03의 `COMPENSATION`이 한 단어라 줄바꿈되지 않아 우측 슬라이드 화살표와 겹칠 수 있습니다(1025px에서 실제로 발생해 램프를 넣었습니다).
- **`backdrop-filter`는 표준 속성만 쓰세요.** `-webkit-` 접두사를 직접 써 두면 lightningcss가 쌍을 webkit 전용으로 접어버려 Firefox에서 유리 효과가 깨집니다.
- 작업 기록(`WORKLOG.md`)과 AI 작업 규칙 문서는 제외했습니다.
