# 인물 사진 · 서브비주얼 파일 구조

변호사/자문단 사진이 쓰이는 자리는 **네 곳**이고, 자리마다 **다른 파일**을 씁니다.
서브비주얼(`assets/sub/*`)은 인물 사진이 아니라 **페이지 상단 띠 배경**이므로
프로필 자리에 가져다 쓰면 안 됩니다.

## 1. 확장자 규칙 — 런타임은 `.webp` 두 장만 씁니다

한 장의 사진은 파일 **3개**로 존재합니다.

| 파일 | 역할 | 런타임 로드 |
|---|---|---|
| `{이름}.jpg` 또는 `{이름}.png` | **원본 마스터.** 변환 스크립트의 입력 | ✗ 안 함 |
| `{이름}.webp` | 최종 화질 (q=90) | ✓ |
| `{이름}.preview.webp` | 즉시 표시용 초저용량 (가로 ~64px) | ✓ |

코드에서는 **확장자를 쓰지 않습니다.** `progressiveAsset()`이 stem을 받아
`.webp` + `.preview.webp` 두 경로를 만들어 줍니다.

```ts
progressiveAsset('assets/profile-2')
// → { src: '…/assets/profile-2.webp', preview: '…/assets/profile-2.preview.webp' }
```

`.jpg` / `.png` 원본을 `<img src>`에 직접 넣지 마세요. 원본은 1~7MB이고,
블러업 2단 로드(`docs/progressive-images.md`)가 무력화됩니다.

`.webp` 쌍은 손으로 만들지 말고 스크립트로 생성합니다. 새 사진을 추가하면
`scripts/generate-progressive-images.py`의 `TARGETS`에 원본 경로와 최대 가로폭을
등록한 뒤 실행하세요.

```
python3 scripts/generate-progressive-images.py            # 전체
python3 scripts/generate-progressive-images.py profile-2.jpg   # 일부만
```

## 2. 자리별 파일 — 여기가 헷갈리는 지점입니다

| 자리 | 경로 stem | 비율 | 정의 위치 |
|---|---|---|---|
| **홈** `PROFESSIONALS & ADVISORS` 4장 | `assets/profile-1` ~ `profile-4` | 1104×1200 (세로형) | `src/data/content.ts` → `professionals[].image` |
| **변호사·자문단 목록** 카드 | `assets/lawyers/{id}-card` | 897×1200 (더 좁음) | `src/data/lawyers.ts` → `LawyerCard.photo` |
| **변호사 개인 프로필** 인물 사진 | `assets/lawyers/{id}` (`-card` 없음) | 원본 비율 | `src/data/lawyers.ts` → `Lawyer.photo` |
| **자문단** 카드 | `assets/advisors/{id}` | 749×1200 | `src/data/advisors.ts` |

`{id}`는 `parkhyoyoung` `gongdaeho` `gongseongjun` `sinjiho`처럼 사람 식별자입니다.

**홈만 이름이 다릅니다.** 홈은 순번(`profile-1`…`4`), 서브페이지는 사람 이름(`{id}`).
같은 인물의 같은 촬영본이지만 **크롭 비율이 달라서 서로 대체할 수 없습니다.**

| 순번 | 인물 | 홈 파일 | 목록 카드 파일 |
|---|---|---|---|
| 1 | 박효영 | `profile-1` | `lawyers/parkhyoyoung-card` |
| 2 | 공대호 | `profile-2` | `lawyers/gongdaeho-card` |
| 3 | 공성준 | `profile-3` | `lawyers/gongseongjun-card` |
| 4 | 신지호 | `profile-4` | `lawyers/sinjiho-card` |

홈 카드는 얼굴 위치를 `imagePosition`(`content.ts`)으로 따로 잡습니다
(예: 박효영 `50% 18%`). 사진을 교체하면 이 값도 함께 확인해야 합니다.

## 2-1. 예시 — 공대호 변호사 파일

`public/assets/lawyers/`에 6개, `public/assets/`에 3개, 합쳐서 **9개**입니다.
사진 3장이 각각 마스터 + webp 2장으로 존재하는 구조입니다.

| 파일 | 사진 | 쓰이는 화면 |
|---|---|---|
| `lawyers/gongdaeho.png` | ① | 마스터 (로드 안 함) |
| `lawyers/gongdaeho.webp` | ① | **변호사 개인 프로필 페이지**의 인물 사진 |
| `lawyers/gongdaeho.preview.webp` | ① | 위 이미지의 프리뷰 |
| `lawyers/gongdaeho-card.jpg` | ② | 마스터 (로드 안 함) |
| `lawyers/gongdaeho-card.webp` | ② | **변호사·자문단 목록 페이지**의 카드 |
| `lawyers/gongdaeho-card.preview.webp` | ② | 위 이미지의 프리뷰 |
| `profile-2.jpg` | ③ | 마스터 (로드 안 함) |
| `profile-2.webp` | ③ | **홈** `PROFESSIONALS & ADVISORS` 카드 |
| `profile-2.preview.webp` | ③ | 위 이미지의 프리뷰 |

**`-card`는 홈이 아니라 목록 페이지입니다.** 그리고 홈에서 읽는 파일은
`lawyers/` 폴더 안에 아예 없습니다 — `public/assets/profile-2.*`입니다.

```
홈 카드           → assets/profile-2
목록 페이지 카드    → assets/lawyers/gongdaeho-card
개인 프로필 인물    → assets/lawyers/gongdaeho
```

정의 위치: 홈은 `src/data/content.ts`의 `professionals`, 목록 카드는
`src/data/lawyers.ts`의 `LAWYER_CARDS`, 개인 프로필은 같은 파일의 `Lawyer.photo`.

## 3. 서브비주얼은 인물 사진이 아닙니다

`assets/sub/sub-XX-YY`는 **페이지 상단 가로 띠 배경**입니다. 가로 1920 × 세로 620
전후의 파노라마라서, 인물 카드(세로 1200) 자리에 넣으면 얼굴이 잘리거나 늘어납니다.

| 파일 | 쓰이는 곳 |
|---|---|
| `assets/sub/sub-01-03` | 변호사·자문단 **목록 페이지** 상단 띠 (`LAWYERS_PAGE.visual`) |
| `assets/sub/sub-01-03-profile` | 변호사 **개인 프로필 페이지** 상단 띠 (`LawyerProfilePage.tsx`의 `HERO`) |

이름에 `-profile`이 붙어 있어 인물 사진처럼 보이지만, **개인 프로필 페이지용 배경 띠**라는
뜻입니다(1920×619). 인물 사진이 필요하면 위 2번 표의 파일을 쓰세요.

## 4. 요약 — 사진을 바꿀 때

1. 원본을 `public/assets/…`에 `.jpg`/`.png`로 넣는다 (기존 파일명 유지).
2. `scripts/generate-progressive-images.py`의 `TARGETS`에 있는지 확인하고 실행한다.
3. 생성된 `.webp` / `.preview.webp`를 커밋한다.
4. 코드는 손댈 필요 없다 — 파일명이 같으면 `progressiveAsset()`이 그대로 잡는다.
5. 얼굴 위치가 어긋나면 `imagePosition`(홈) 또는 해당 CSS의 `object-position`을 조정한다.

관련 문서: `docs/progressive-images.md` (블러업 2단 로드 방식과 화질/용량 기준)
