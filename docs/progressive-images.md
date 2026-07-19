# Progressive Images (Blur-up)

## 목적

서브페이지 진입 시 **이미지가 비어 있거나 늦게 뜨는 체감**을 없앤다.

사용자는 화면 진입과 동시에 이미지 자리를 채운 화면을 봐야 하고,  
처음엔 해상도가 낮아도 되며, **1~2초 안에 원본 수준의 선명한 이미지로 자연스럽게 전환**되어야 한다.  
최종 화질은 타협하지 않는다.

## 왜 필요한가

Figma에서보낸 원본 사진은 종종 **수 MB~7MB** (예: `sub-01-01.jpg` 6.9MB, `quote-city.png` 5.7MB).  
이를 `<img src>`에 그대로 쓰면:

1. 네트워크 완료 전까지 히어로가 비어 보이거나 늦게 페인트된다
2. LCP(Largest Contentful Paint)가 나빠진다
3. 모바일/저속망에서 체감 지연이 커진다

최종 화질만 올리면 “선명하지만 늦게”가 되고,  
용량만 깎으면 “빠르지만 화질이 떨어진다”.  
둘 다 피하기 위해 **2단계 로드**를 쓴다.

## 방법 (Apple / Medium 계열 Blur-up)

글로벌 마케팅·미디어 사이트(Apple 제품 페이지, Medium 등)에서 쓰는 패턴과 동일한 축:

```
화면 진입
  ├─ 즉시: tiny preview WebP (~64px, 1KB 전후) 배치 + CSS blur
  │         → 레이아웃이 바로 채워짐 (빈 화면 없음)
  └─ 동시에: high-quality WebP (q≈90, 표시 해상도) fetch
       └─ onload 후 ~400ms opacity crossfade → sharp
```

| 레이어 | 파일 | 스펙 | 역할 |
|--------|------|------|------|
| Preview | `{stem}.preview.webp` | 가로 ~64px, q≈45 | 즉시 페인트 |
| Full | `{stem}.webp` | max 2560w(히어로), **q=90** | 최종 선명도 |

핵심: **즉시성을 preview가 담당**하고, **퀄리티는 full이 담당**한다.  
full을 과도하게 압축하지 않는다.

## 코드 구조

| 파일 | 역할 |
|------|------|
| `src/components/ProgressiveImage.tsx` | blur-up UI (preview + full, preload, crossfade) |
| `src/components/ProgressiveImage.css` | blur / scale / opacity transition |
| `src/utils/progressiveImage.ts` | `progressiveAsset(stem)` → `{ src, preview }` |
| `src/components/sub/SubVisual.tsx` | 서브 히어로에 `priority` blur-up 적용 |
| `scripts/generate-progressive-images.py` | preview/full WebP 재생성 |

### `ProgressiveImage` 동작

1. **Preview** — `loading="eager"`, 즉시 표시, `filter: blur(16px)` + `scale(1.08)`
2. **Full** — **항상 `loading="eager"`** 로 preview와 병렬 fetch  
   - ⚠ 예전 `lazy`는 below-fold에서 `currentSrc`가 비어 preview에 영구 고정되는 버그가 있었음
3. **레이아웃 (필수)** — preview + full 모두 `position: absolute; inset: 0` 으로 **같은 박스에 스택**  
   - ⚠ in-flow로 세로 쌓으면 `overflow:hidden` 부모가 full을 preview **아래**로 잘라 냄 → ready 후에도 빈 구멍
4. **Ready 판정 (캐시/레이스 안전)**  
   - `useLayoutEffect`에서 `img.complete && naturalWidth > 0` 동기 체크  
   - `onLoad` 후 reveal (페인트 가능한 뒤에만 crossfade)  
   - full `<img key={src}>` 로 src 변경 시 load 이벤트 재발생 보장  
   - priority preload는 모듈 레벨 Set으로 Strict Mode remount에도 취소되지 않음
5. Crossfade **0.2s** → ready 후 preview opacity 0 (블러가 남는 착시 방지)
6. `prefers-reduced-motion: reduce` → 전환/블러 최소화

### 장애 분석 (2026-07 수정)

| 증상 | 원인 | 조치 |
|------|------|------|
| preview에 영원히 고정 | `loading="lazy"` → full `currentSrc=""`, onLoad 미발생 | full은 항상 eager |
| 캐시 hit 시 전환 안 됨 | 브라우저가 onLoad를 생략하는데 effect가 ready를 false로만 둠 | layout-effect + complete 체크 |
| 전환이 수 초 | full 862KB~931KB + 0.4s fade + LCP와 대역 경쟁 | 표시폭(1920/1600) 재인코딩, fade 0.2s, priority preload 고정 |
| **ready인데도 사진이 안 보임 (빈 구멍)** | preview/full이 in-flow로 세로 스택 → full이 overflow 밖으로 잘림, preview opacity 0 후 공백 | `ProgressiveImage.css`에서 두 레이어 항상 absolute 스택 (HARD RULE) |

### 데이터 연결

페이지 메타는 `progressiveAsset`으로 쌍을 만든다:

```ts
const VISUAL = progressiveAsset('assets/sub/sub-01-01')
// visual: …/sub-01-01.webp
// visualPreview: …/sub-01-01.preview.webp
```

`SubVisual`은 `image` + `imagePreview`를 모두 받는다.  
GNB fullmenu 스왑은 최적화된 **full WebP** (`PAGE.visual`)를 사용한다.

## 적용 범위 (현재)

- **홈 전체 사진** (`HomePage` / `HomeSections` / `Hero`):
  - 히어로 슬라이드 `hero-01` … `hero-05` (+ Ken Burns on `.progressive-image`)
  - 히어로 swipe thumb `hero-01-next` … `hero-05-next`
  - Notice / About / Practice / Achievements / Professionals(BG+초상) / Press / Awards preview / Social BG / Office map
- 모든 서브비주얼: `sub-01-01`, `sub-02-01`, `sub-04-01` … `sub-04-04`
- 법인소개 대형 사진: `quote-city`, `strength-01..03`, `dark-seal`

원본 JPG/PNG는 보관해도 되지만, **런타임은 WebP 쌍을 사용**한다.  
SVG 아이콘은 blur-up 대상이 아니다.

## 에셋 재생성

새 원본을 넣거나 Figma에서 다시 받은 뒤:

```bash
python3 scripts/generate-progressive-images.py
```

`TARGETS` 목록에 경로를 추가한 다음 스크립트를 실행한다.

## 품질 / 용량 가이드

| 항목 | 권장 |
|------|------|
| Full WebP quality | **90** (최상급 유지) |
| Full max width | 히어로 2560 / 섹션 사진 1600 내외 |
| Preview width | 64px |
| Preview 목표 용량 | **1–4KB** |
| Full 히어로 목표 | 대략 **200–900KB** (장면 복잡도 따름) |

예시 (도입 시 측정):

- `sub-01-01.jpg` 6.9MB → full **842KB** + preview **0.4KB**
- `quote-city.png` 5.7MB → full **281KB** + preview **0.3KB**

## 하지 않는 것

- 최종 이미지를 과도 압축해 “처음부터 선명하지만 화질 나쁜” 타협
- BlurHash만으로 끝내기 (색 블록만 보이고 사진이 안 보임)
- Full을 너무 lazy로 미뤄 preview만 오래 방치하기 (히어로는 진입 즉시 full도 요청)
- Progressive JPEG에만 의존하기 (브라우저/디코더 체감 편차)
- **preview/full을 in-flow 블록으로 세로 배치하기** (overflow 클리핑 → ready 후 빈 화면)
- ProgressiveImage 래퍼에 높이/크기를 주지 않은 채 absolute 레이어만 두기 (박스 높이 0)

## 향후 확장

- GNB fullmenu 패널에 preview→full blur-up (현재는 최적화된 full WebP만 스왑)
- AVIF 추가 시 `<picture>`로 full만 교체 (preview는 WebP 유지 가능)
- 메뉴 hover 시 해당 서브비주얼 full preload (클릭 전 warm cache)
