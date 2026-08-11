# 법무법인 경국 — 변경분 패치 (PR #163 ~ #164)

생성일 2026-08-11 · 기준 커밋 `4f3c17e` → `2f76981` (main 기준)
직전 패치(`patch-2026-08-05`, PR #157~#161) 이후의 변경분입니다.

`files/` 안에 **변경된 파일만** 저장소와 동일한 폴더 구조로 들어 있습니다.
저장소 루트에 그대로 덮어쓰면 적용됩니다. 신규·삭제 파일은 없습니다.

```
cp -R files/. /path/to/gyungkook/
```

## 파일 목록 (3개, 모두 수정)

| 경로 | 내용 |
|---|---|
| `src/components/HeroClassic.tsx` | 히어로 카피 재배치 + 라벨 글자 단위 등장 |
| `src/components/HeroClassic.css` | 위 배치에 따른 타입 스케일·간격 |
| `src/data/slidesClassic.ts` | 슬라이드 03 라벨 오타 수정 (`Compensationand` → `Compensation and`) |

## 변경 요약

### 좌측 카피 재배치 (PR #163)

`hero__index`의 좌측 수직 라인 하나에 네 블록을 모두 정렬했습니다.

```
hero__index   01
hero__label   VALUE        ← hero__title 위로 이동
hero__title   오래된 가치 …
hero__desc    오랜 시간 …   ← 가장 아래
```

기존에는 label과 desc가 `gap: clamp(20px, 7.6vw, 147px)`인 2단 row라 desc가
우측으로 밀려 수직 라인이 깨져 있었습니다. label을 `.hero__maincopy`로 옮기고
`.hero__copy`는 desc 단독 블록으로 바꿔 하단 고정했습니다.

### 타입 스케일 (PR #163 ~ #164)

| 요소 | 이전 | 이후 |
|---|---|---|
| `hero__label` 크기 | `clamp(16px, 1.25vw, 24px)` | 데스크톱 `clamp(88px, 9.4vw, 108px)` · 768~1024 `72px` · 모바일 `clamp(30px, 11vw, 72px)` |
| `hero__label` 줄간격 | `1.4` | `0.95` |
| `hero__title` 크기 | `clamp(32px, 3.75vw, 72px)` · 모바일 `32px` | `clamp(20px, 1.875vw, 36px)` · 모바일 `20px` (나눔명조 유지) |
| `hero__desc` 위 간격 | 데스크톱 84px · 이하 28px | 데스크톱 30px · 이하 14px |

### 등장 애니메이션 (PR #164)

`hero__label`이 `LineReveal` → `CharReveal`로 바뀌어 타이틀처럼 글자 하나씩
등장합니다. 등장 순서도 위에서 아래로(index 60 → label 100 → title 120~).

## 개발자용 주의사항

- **`hero__label`은 단어마다 `CharReveal`을 하나씩 두고 `.hero__label-word`(`white-space: nowrap`)로 감쌌습니다.** 문자열 전체에 `CharReveal`을 한 번 쓰면 글자마다 독립된 inline-block 박스가 되어 아무 글자 사이에서나 줄바꿈이 일어납니다(`COMPENSATION`이 단어 중간에서 잘림). 라벨 문구를 바꿀 때 이 구조를 유지해 주세요.
- **`.hero__label`의 데스크톱 크기 규칙은 기본 규칙 뒤에 와야 합니다.** 둘 다 클래스 1개 깊이인데 미디어 쿼리는 특이도를 더하지 않아, 앞쪽 `@media (min-width: 1025px)` 블록에 넣으면 뒤쪽 기본 규칙에 밀려 적용되지 않습니다.
- **`--hero-maincopy-top`**(HeroClassic.tsx)은 이제 화면 중앙 기준이 아니라 하단 고정된 `.hero__copy`에서 `MAINCOPY_COPY_GAP`(30px)만큼 위에 매다는 방식입니다. desc 위 간격을 조정하려면 이 상수 하나만 바꾸면 됩니다.
- 라벨 크기의 상한을 더 올릴 경우, 슬라이드 03의 `COMPENSATION`이 한 단어라 줄바꿈되지 않아 우측 슬라이드 화살표와 겹칠 수 있습니다(1025px에서 실제로 발생해 램프를 넣었습니다).
