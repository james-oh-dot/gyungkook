# 법무법인 경국 — 변경분 패치 (PR #157 ~ #161)

생성일 2026-08-05 · 기준 커밋 `edc3824` → `4f3c17e` (main 기준)

`files/` 안에 **변경·추가된 파일만** 저장소와 동일한 폴더 구조로 들어 있습니다.
저장소 루트에 그대로 덮어쓰면 적용됩니다. 삭제된 파일은 없습니다.

```
cp -R files/. /path/to/gyungkook/
```

(`files/.gitignore`는 숨김 파일이라 `files/*`가 아니라 `files/.`로 복사해야 포함됩니다.)

## 파일 목록 (36개)

### 신규 (22)

| 경로 | 내용 |
|---|---|
| `src/components/PartnerMarquee.tsx` `.css` | 홈 푸터 위 협력사 무한 흐름 띠 |
| `scripts/generate-partner-mono.py` | 협력사 로고 → 모노 변환 스크립트 (빌드에 포함되지 않는 개발용 도구) |
| `public/assets/partners-mono/partner-01…19.png` | 위 스크립트가 만든 모노 로고 19개 |

### 수정 (14)

| 경로 | 내용 |
|---|---|
| `src/components/HeroClassic.tsx` `.css` | 히어로 풀블리드, swipe 컴포넌트 제거, 좌우 끝 화살표 버튼, 등장 애니메이션 2배 감속, `hero__title` 나눔명조 |
| `src/components/Gnb.tsx` `.css` | 풀메뉴 배경 이미지 제거 → 검은 리퀴드글라스, 서브메뉴/인디케이터 재구성, 서브메뉴 영역 슬라이드인·아웃 |
| `src/layouts/SiteLayout.tsx` | 협력사 띠를 홈 푸터 위에 배치 |
| `src/data/nav.ts` | 메뉴명: 업무사례 → 분야별 사례, 정비사업 → 정비사업 · 실적, 공익사업 → 공익사업 · 실적 |
| `src/data/caseStudies.ts` `renewal.ts` `publicProject.ts` `searchIndex.ts` | 위 메뉴명에 맞춘 페이지 히어로 타이틀 / 검색 문서 타이틀 |
| `src/data/content.ts` | 협력사 띠에 쓰는 로고 목록 |
| `public/assets/about/partners/partner-09.png` `partner-19.png` | 의성군 · S-OIL 고해상도 원본 교체 |
| `.gitignore` | `__pycache__/` `*.pyc` 무시 (선택 사항 — 기존 파일에 이미 있으면 넘어가도 됩니다) |

## 주의

- `public/assets/partners-mono/`는 `scripts/generate-partner-mono.py`의 산출물입니다.
  원본(`public/assets/about/partners/`)을 바꾸면 스크립트를 다시 돌려 주세요:
  `python3 scripts/generate-partner-mono.py` (Pillow 필요)
- `src/data/*.ts`의 메뉴명 변경은 GNB 라벨 · 페이지 히어로 타이틀 · 검색 인덱스에만
  적용했습니다. 각 페이지 안쪽 섹션 제목과 탭 라벨은 의도적으로 그대로 뒀습니다.
- 작업 기록(`WORKLOG.md`)과 AI 작업 규칙 문서는 제외했습니다.
