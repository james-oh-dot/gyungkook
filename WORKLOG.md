# WORKLOG — Hero motion / icons / assets (handoff)

## 2026-07-21 — 신규 페이지: 법무법인경국 > 경국인 · 갤러리 (sub-01-04)

> Branch: `claude/o-boinida-98drdm` (PR #83 머지 후 최신 main에서 재시작)
> Figma: `SUB_법무법인경국_경국인갤러리` (94:3369).

### 요구
- 메뉴 법무법인경국 > 경국인갤러리 (sub-01-04) 신규 페이지, 반응형 규칙대로 대응.
- **탭 갤러리 선택 시 gallery 섹션으로 스크롤 이동**(스크롤 모드).
- 서브비주얼 = sub-01-04, GNB 메뉴 스왑에 반영. 메뉴 연결.

### 구조 (Figma)
로컬탭 2개(경국인 / 갤러리) **스크롤 모드**(법인소개와 동일 패턴):
- **경국인 섹션**: 브랜드 피라미드(고객/경국인/경국) + serif 인용구(NanumMyeongjo) +
  경국인의 약속 10개(번호 배지 + 영문 + 국문 설명).
- **갤러리 섹션**: 마조너리 포토 그리드(3열×5행, 좌상단·우하단에 2×2 big 타일).

### 이미지 (Figma 직접 추출 — get_screenshot base64 우회)
- **sub-01-04 히어로**(node 94:3371): 금속 피라미드 빌딩 사진. 원본에 "경국인 · 갤러리"
  타이틀 베이크 → **cv2 인페인트로 제거** 후 SubVisual이 라이브 타이틀 오버레이(다른
  서브페이지와 동일). 규칙적 격자 패턴이라 인페인트 잔흔이 약간 남지만 scrim + 라이브
  타이틀 아래라 실제로는 비가시.
- **피라미드 다이어그램**(node 94:3384): 고객/경국인/경국 3단 + 청록 방사 링. 라벨이
  이미지에 베이크된 브랜드 그래픽 → `gallery/pyramid.*`로 저장.
- **인용부호**: `icon-quote.svg`(청록) 신규 제작, 닫는 인용부호는 rotate(180).
- **갤러리 사진**: Figma는 하트 스톡(플레이스홀더) → 실제 경국인 사진 미제공이므로
  중립 그라데이션 플레이스홀더 타일로 구현(마조너리 레이아웃은 정확히 유지).

### 구현
- 데이터 `src/data/gallery.ts`: 탭 2개, 피라미드, 인용구(lines+strong), 약속 10개
  (no/en/ko), 갤러리 타일 9개(big 플래그).
- 페이지 `src/pages/GalleryPage.tsx` + `Gallery.css`: SubVisual → 경국인 섹션(피라미드
  중앙 + 인용구 + 약속 2단) → 갤러리 섹션(제목 좌 + 마조너리 우). IntersectionObserver
  스크롤스파이 + `scrollToSection`(법인소개와 동일).
- 약속 번호 배지: 청록 `#58bdc2` `w-34` 정사각(초기엔 stretch 바였으나 Figma대로 compact
  square로 교정).
- 라우트 `App.tsx`: `/about/gallery` Placeholder → `GalleryPage`.
- 네비 `nav.ts`: `about-gallery` visual = sub-01-04 (`GNB_SUB_VISUAL_ABOUT_GALLERY`).

### 반응형
- 데스크톱: 피라미드 564 중앙, 약속 2단(라벨 299 + 행), 갤러리 마조너리 3열.
- ≤1024: 약속·갤러리 라벨이 콘텐츠 위로 스택. 마조너리 유지(aspect-ratio로 스케일).
- ≤767: 약속 행이 [번호+영문] / [국문] 2줄로 랩. **갤러리 마조너리 → 균일 2열
  (aspect 4/3)** 로 단순화.

### 검증 (Playwright, vite preview)
- 1440/900/390 풀페이지: Figma와 일치. **가로 넘침 0**, JS 에러 0(외부 폰트 CDN 차단 무관).
- **갤러리 탭 클릭 → gallery 섹션으로 스크롤 이동 PASS**(scrollY 0→3121, 섹션 top이 sticky
  탭 바로 아래 180px). 스크롤스파이로 탭 활성 전환 확인.
- GNB 메뉴 호버(경국인갤러리) → sub-01-04 클린 히어로 스왑 확인.
- build(strict)·lint 클린.

### ⚠️ 후속
- 갤러리 실제 경국인 사진(9장) 제공 시 플레이스홀더 타일 교체.

---

## 2026-07-21 — 변호사자문단 히어로 divider + 상단 버튼 2개 Figma 정밀 일치

> Branch: `claude/o-boinida-98drdm` (PR #82 머지 후 최신 main에서 재시작)
> Figma: `SUB_법무법인경국_변호사자문단_공대호` (89:2963) 정밀 재확인.

### 요구
서브비주얼 텍스트 배치·divider 확장 범위를 Figma와 눈으로 대조해 일치시키고, 콘텐츠 최상단
버튼 2개(위치·컬러·아이콘)를 정확히 구현.

### Figma 대조로 발견한 차이
1. **히어로 eyebrow 불필요**: Figma 히어로는 `공대호 / 변호사 / 연락처 / divider / intro`
   구성 — 이름 위 "법무법인 경국 변호사자문단" eyebrow가 **없음**. 기존 구현엔 있었음 → 제거.
2. **divider 길이**: Figma `Line 6`(89:2975)는 **width 1004px**, 텍스트 좌측(content-x 0)에서
   시작해 **초상 중앙(content-x≈1019)까지** 이어짐. 기존 구현은 `.lawyer-hero__contact`의
   `border-bottom`이라 연락처 행 폭까지만 → 너무 짧았음.
3. **상단 버튼**: Figma `btn`(89:2993)은 **공유하기 + PDF 다운받기** 2개(민트 `#58bdc2`,
   56×56, 아이콘 24 흰색, gap 10, 직각). 기존 구현은 **이전/다음 화살표**(Figma에 없음 —
   변호사 전환은 로컬탭이 담당)였음.

### 구현
- 히어로: eyebrow 제거, 이름+직함을 `.lawyer-hero__name-row`로 타이트하게, 연락처
  `border-bottom` 제거 후 **전용 `.lawyer-hero__divider`** 추가(`width:130%; max-width:1004px`
  of info column → 초상 중앙 도달; 모바일은 초상 숨김이라 `width:100%`).
- 버튼: `.lawyer-toolbar` 내용을 화살표 Link → **`.lawyer-action` 버튼 2개**로 교체. 민트
  `#58bdc2` 직각, hover `#45aab0`. 공유하기 = `navigator.share`(없으면 클립보드 복사),
  PDF 다운받기 = `window.print()`.
- 신규 아이콘 `public/assets/icon-share.svg`(3노드+2링크), `icon-download.svg`(상단 pill +
  하향 화살표 + U 트레이). Figma 글리프를 흰색 인라인 SVG로 재현.
- `adjacentLawyers`/`Link` import 제거(미사용).

### 검증 (Playwright, vite preview)
- 1440/900/390: 히어로가 Figma와 일치(eyebrow 없음, divider가 초상 중앙까지, 버튼 2개 민트).
  가로 넘침 0, JS 에러 0.
- 플레이스홀더 변호사(박효영, 연락처 없음)도 divider 정상 렌더.
- build(strict)·lint 클린.

---

## 2026-07-21 — 공유 아이콘 `icon-bullet.svg` 교체 (사용자 SVG 직접 제공)

> Branch: `claude/o-boinida-98drdm` (PR #81 머지 후 최신 main에서 재시작)

사용자가 변호사자문단 페이지의 블록 라벨 아이콘(`lawyer-block__icon`)이 마음에 안 든다며
새 SVG를 채팅에 **텍스트로 직접 붙여넣음**(이미지 첨부가 아니라 SVG는 XML 텍스트라 코드
그대로 붙여넣는 방식을 안내 → 사용자가 채택). 처음엔 lawyer 페이지만 바꿀지 물었으나,
"icon-bullet.svg 로 지정된 곳은 모두 이걸로 교체해줘"로 명확화.

`public/assets/icon-bullet.svg`는 `LawyerProfilePage`(`.lawyer-block__icon`),
`RenewalPage`/`PublicProjectPage`(`.renewal-bullet-title__icon`, `.pp-list`) **3곳에서
공유**하는 단일 파일 — 기존 "teal 사각형 + 검정 ▶" 에서 사용자가 제공한 "teal 대각선
깃발/페넌트" 모양으로 교체. 파일 하나만 바꾸면 3개 페이지 모두 자동 반영되는 구조라
별도 참조 변경 없음.

### 검증
Playwright로 세 페이지(변호사자문단 `.lawyer-block__icon`, 정비사업/공익사업
`.renewal-bullet-title__icon`) 모두 새 아이콘으로 정상 렌더 확인. build(strict)·lint 클린.

---

## 2026-07-21 — 신규 페이지: 법무법인경국 > 대표 인사말 (sub-01-02)

> Branch: `claude/o-boinida-98drdm` (PR #80 머지 후 최신 main에서 재시작)
> Figma: `SUB_법무법인경국_대표인사말` (92:2898) + _TABLET(92:2986) / _MOBILE(92:3067).

### 요구
- 메뉴 법무법인경국 > 대표인사말 (sub-01-02) 신규 페이지, 반응형 3벌.
- 서브비주얼 = sub-01-02, GNB 메뉴 스왑에 반영. 메뉴 연결.

### 구조 (Figma)
로컬탭 없는 **정적 단일 페이지**: hero_type2(칩 없음, 타이틀 "대표 인사말") → CEO 사진
(aspect 1710/919) → 2단 인사말(좌 헤딩 / 우 본문 2블록 + 서명). 태블릿은 2단 유지,
모바일(≤767)만 1단 스택. 헤딩 eyebrow "ABOUT 경국"은 Figma 민트 `#58bdc2`.

### 이미지 3개 — Figma 직접 추출 + 히어로 인페인트 (핵심)
figma.com egress 차단은 여전하지만 **Figma MCP `get_screenshot(enableBase64Response)`
는 우회 가능**(PR #80에서 확립). 이를 이용해 3개 이미지를 직접 확보:
1. **sub-01-02 히어로** (node 92:2910): Figma 원본은 "대표 인사말" 타이틀이 이미지에
   **베이크되어** 있었음. 그대로 쓰면 (a) SubVisual이 라이브 타이틀을 다시 올려 **이중
   텍스트**, (b) GNB 메뉴 썸네일에도 텍스트가 박혀 다른 메뉴와 불일치. 클린 원본(raw)은
   `download_assets`로만 나오는데 그 URL은 `curl` 차단(403). → **cv2 인페인트로 타이틀
   제거**: 중앙 우드 밴드에서 흰 픽셀(min 채널 高 + 저채도) 마스크 → `INPAINT_NS` + `TELEA`
   2패스 → 우드 텍스처로 자연 복원. 결과 클린 이미지를 sub-01-02로 사용, SubVisual이
   라이브·반응형 타이틀을 올림(다른 서브페이지와 동일 패턴). scrim 아래라 잔흔 비가시.
2. **CEO 사진** (node 92:2916): 1280×688, 그대로 `greeting/ceo.jpg`.
3. **서명** (node 92:2925): 184×72, 흰 배경을 알파로 키잉해 투명 PNG(`greeting/signature.png`).
- `scripts/generate-progressive-images.py` TARGETS에 3개 추가 후 재생성.
- cv2/numpy는 세션에 없어 `pip install opencv-python-headless numpy`로 설치(로컬 전처리용,
  런타임 의존성 아님).

### 구현
- 데이터 `src/data/greeting.ts`: `GREETING_PAGE`(visual/portrait/signature + eyebrow +
  heading 3줄 + `blocks` 본문 2블록, `''`=연 구분). 텍스트는 Figma 원문 그대로.
- 페이지 `src/pages/GreetingPage.tsx` + `Greeting.css`: SubVisual(showChip=false) →
  `.greeting__photo`(ProgressiveImage) → `.greeting__about`(grid 1fr 1fr, gap 33) →
  모바일 1단. 서명은 투명 PNG를 plain `<img>`.
- 라우트 `App.tsx`: `/about/greeting` PlaceholderPage → `GreetingPage` 교체.
- 네비 `nav.ts`: `about-greeting` visual = sub-01-02 (`GNB_SUB_VISUAL_ABOUT_GREETING`).

### 검증 (Playwright, vite preview)
- 1440/768/390 풀페이지: Figma 3프레임과 일치. **가로 넘침 0**, JS 에러 0(외부 폰트 CDN
  차단 2건은 샌드박스 환경 이슈, 무관).
- 히어로: 인페인트로 베이크 타이틀 제거 + 라이브 타이틀 오버레이 → 이중 텍스트 없음.
- GNB 메뉴 호버(대표인사말) → sub-01-02 클린 히어로로 스왑 확인.
- build(strict)·lint 클린.

---

## 2026-07-21 — 공대호 변호사 인증서·위촉·수상 이미지 11개 Figma 직접 추출

> Branch: `claude/o-boinida-98drdm` (PR #79 머지 후 최신 main에서 재시작)

### 배경 (중요한 발견)
사용자가 "인증서수상 이미지는 10개가 넘는데 어떻게 하지?"라고 묻자, 처음엔 채팅 첨부를
제안했다. 이어서 사용자가 "네트워크 정책에서 figma.com 허용" 방법을 자세히 알려달라고
요청 — 답변 도중 **Figma MCP 도구(`get_screenshot`, `get_metadata`, `get_design_context`)는
이미 이 세션에서 계속 정상 동작해왔다는 사실을 재확인**했다. 즉, egress 차단은 세션의
`curl`(sandboxed shell)에만 적용되고, **MCP 서버와의 통신은 별도 경로**라 막히지 않는다.

`download_assets`가 반환하는 자산은 `https://www.figma.com/api/mcp/asset/...` **단기 URL**이라
결국 `curl`로 받아와야 해서 여전히 403 — 하지만 `get_screenshot`을
`enableBase64Response:true`로 호출하면 **PNG가 MCP 응답에 base64로 직접 포함**되어 온다.
이를 실제로 검증(노드 89:3357 스크린샷 성공 → 진짜 "전문분야 등록증서" 이미지 확인)한 뒤,
**네트워크 정책 변경 없이 이 세션에서 바로 공대호 변호사의 인증서/위촉/수상 이미지 13개를
직접 추출**하기로 방향 전환.

### 구현
1. **구조 확인**: `get_metadata`(node 73:6934)로 이미지 노드 후보를 찾은 뒤, `get_design_context`
   를 `block_9`(89:3348, 전문 인증서) / `block_10`(89:3365, 위촉·임명) / `block_11`(89:3402, 수상)
   각각에 호출해 **실제 캡션 텍스트 + 이미지 참조**를 정확히 확인. 결과: 기존 데이터(인증서 2 +
   위촉 8 + 수상 3 = 13)의 라벨은 전부 정확했음(회귀 없음).
2. **중요 발견**: 위촉 8개 중 마지막 2개(`서울시사회복지협의회봉사단`, `대한법률봉사회회장`)는
   Figma 소스 자체가 **다른 항목과 동일한 이미지 참조**(`imgImage4`/`imgImage5` 재사용)를 쓰고
   있어 — 디자이너가 아직 실제 스캔본을 올리지 않은 자리표시자임. 이 2개는 잘못된 이미지를
   붙이지 않고 캡션 있는 줄무늬 플레이스홀더로 유지.
3. 나머지 **11개**(인증서 2 + 위촉 6 + 수상 3)를 `get_screenshot(fileKey, nodeId,
   enableBase64Response:true, maxDimension:900)`으로 순서대로 호출 — Figma 노드의 실제 크기가
   184×260이라 900 요청에도 원본 그대로(업스케일 없음) 반환.
4. base64 추출: 세션 자신의 트랜스크립트 JSONL에서 `tool_use`(nodeId 기록) ↔ `tool_result`
   (base64 이미지)를 `tool_use_id`로 매칭하는 Python 스크립트로 13개 PNG를 디스크에 저장
   (중복 호출 1개 자동 스킵).
5. `public/assets/lawyers/gongdaeho-{cert-redevelopment,cert-admin,apt-lh,
   apt-seoul-human-rights,apt-medical-volunteer,apt-youth-legal,apt-nk-human-rights,
   apt-village-lawyer,award-human-rights,award-police,award-brand-index}.png`(11개) 저장 →
   `scripts/generate-progressive-images.py`의 `TARGETS`에 추가(각 400w, 원본이 이미 작아
   업스케일 없음) → 재생성.
6. `src/data/lawyers.ts`: `cert(stem)` 헬퍼로 `progressiveAsset().src`를 `CertItem.image`에
   연결. 위촉 마지막 2개는 `image` 필드 생략(플레이스홀더 유지, 의도적).

### 검증
- Playwright: 1440 데스크톱 — 인증서 2개, 위촉 6개(실사진) + 2개(플레이스홀더), 수상 3개
  모두 올바른 라벨과 이미지로 렌더. 390 모바일도 확인.
- `npm run build`(strict) / `npm run lint` 클린.

### ⚠️ 남은 것
- 위촉 2개(서울시사회복지협의회봉사단, 대한법률봉사회회장) — Figma 소스 자체에 실제 이미지
  없음. 사용자가 실제 스캔본을 제공하면 반영.
- 박효영·공성준·신지호 3명 프로필 콘텐츠·사진 — 여전히 미제공.

### 재사용 가능한 우회 기법 (다음 작업자 참고)
figma.com이 이 세션 egress로 차단돼도, **Figma MCP 도구 자체는 차단되지 않는다** —
`download_assets`(단기 URL 반환, curl 필요 → 여전히 막힘) 대신 **`get_screenshot` +
`enableBase64Response:true`**를 쓰면 이미지가 MCP 응답에 직접 포함되어 우회 가능. 자세한
내용은 `AGENTS.md`의 "Egress workaround" 항목 참고.

---

## 2026-07-21 — 실제 이미지 3장 반영 (sub-01-03 히어로 / sub-02-02 히어로 / 공대호 변호사 사진)

> Branch: `claude/o-boinida-98drdm` (PR #77 · #78 머지 후 최신 main에서 재시작)

### 배경
figma.com이 이 세션의 egress 정책으로 계속 403 차단되어(직접 다운로드 불가 재확인:
`curl`로 `www.figma.com` → `CONNECT tunnel failed, 403`, `api.github.com` → 200), 사용자가
플레이스홀더로 남아있던 3개 이미지(변호사자문단 sub-01-03 히어로, 공익사업 sub-02-02 히어로,
공대호 변호사 사진)를 **채팅에 직접 첨부**하는 방식(제안한 3가지 대안 중 ①)으로 제공.
지시: "이미지 첨부하니, 이미지 규칙에 맞게 반영해줘".

### 이미지 식별 및 매칭 근거
세션 트랜스크립트(`~/.claude/projects/.../*.jsonl`)에 첨부 당시 메시지의 base64 이미지
3장이 그대로 보존되어 있어 이를 추출:
1. **인물사진**(PNG, 451×581, **실제 알파채널 있는 투명 배경 컷아웃** — bbox (10,25)-(445,581),
   캔버스 대부분을 차지) → 정장+안경 착용 남성, 공대호 변호사 사진으로 확정(다른 후보 없음).
2. **흑백 도심 스카이라인**(JPEG, 1920×619, 법원풍 건물 포함, 어두운 그라데이션)
3. **흑백 금속 루버 파사드 클로즈업**(JPEG, 1920×622)

2·3번의 페이지 매칭은 **기존 sub-02-01.jpg(정비사업 히어로, 현재 실사용 중인 진짜 Figma
이미지)와의 스타일 대조**로 판단: sub-02-01은 청록 틴트의 유리·금속 루버/핀 파사드
클로즈업 — 이미지 3(금속 루버 파사드)과 동일 계열. 재개발·보상업무 그룹(정비사업 ↔
공익사업)의 히어로 톤을 통일하는 것이 합리적이므로 **이미지3 → sub-02-02**, 남는
**이미지2(도심/법원 스카이라인) → sub-01-03**(법무법인경국 > 변호사자문단 — 법원·도심
이미지가 그룹 성격에 부합)으로 배정. Figma 원본 재확인은 egress 차단으로 불가했으므로
스타일 연속성에 근거한 합리적 추론이며, 향후 실제 export 확보 시 대조 권장.

### 구현 (이미지 규칙 = `docs/progressive-images.md` blur-up 파이프라인)
- 원본 저장: `public/assets/sub/sub-01-03.jpg`(이미지2), `public/assets/sub/sub-02-02.jpg`
  (이미지3), `public/assets/lawyers/gongdaeho.png`(이미지1, 알파 보존을 위해 PNG 유지).
- `scripts/generate-progressive-images.py`의 `TARGETS`에 3개 항목 추가
  (`sub/sub-01-03.jpg` 1920w, `sub/sub-02-02.jpg` 1920w, `lawyers/gongdaeho.png` 900w) →
  스크립트 실행해 `.webp` + `.preview.webp` 쌍 재생성 (더 이상 sub-01-01/sub-02-01의
  단순 복사본이 아님).
- `src/data/lawyers.ts`: `Lawyer.photo`는 유지하되 `photoPreview?: string` 필드 신설.
  `GONG_DAEHO`만 `progressiveAsset('assets/lawyers/gongdaeho')`로 실제 blur-up 쌍 연결,
  나머지 placeholder 변호사 3명은 `photoPreview` 미설정(변화 없음, 기존 `profile2-4.png`
  그대로 raw `<img>`).
- `src/pages/LawyerProfilePage.tsx`의 `LawyerHero`: `lawyer.photoPreview`가 있으면
  `ProgressiveImage`(objectFit=cover, objectPosition="top center", priority)로 렌더,
  없으면 기존 raw `<img>` fallback — 회귀 없이 실제 사진만 blur-up 적용.
- `LawyerProfile.css`: `.lawyer-hero__photo-progressive { width/height:100% }` 추가
  (`ProgressiveImage` 컨테이너가 기존 `.lawyer-hero__photo`의 86%/420px 박스를 그대로 채움).
- `src/data/publicProject.ts` / `src/data/lawyers.ts` / `AGENTS.md`의 "⚠️ 임시 복사본
  (egress 차단)" 경고 문구를 "실제 사진 반영 완료(2026-07-21)"로 갱신.

### 검증 (Playwright, `vite build` + `vite preview`)
- 1440/768/390 스크린샷: 변호사 히어로(공대호 실제 사진 + 도심 배경), 공익사업 히어로
  (금속 루버 배경) 모두 정상 렌더 — 가로 넘침 없음, 크롭 비율 자연스러움(우려했던
  `.sub-visual__img`의 `height:163.88%` 오버스케일 크롭도 실제 렌더에서는 파사드 대각선
  구도가 오히려 극적으로 잘 어울림, 스카이라인도 건물 라인이 잘 보임 → 별도 CSS 조정
  불필요).
- 모바일(≤768): `.lawyer-hero__photo{display:none}` 규칙대로 사진 숨김·텍스트만 노출
  (기존 규칙 그대로 유지, 회귀 없음).
- GNB fullmenu 호버 스왑(법무법인경국>변호사자문단, 재개발·보상업무>공익사업) 모두
  새 이미지로 정상 교체 확인.
- `npm run build`(tsc strict + vite) / `npm run lint`(oxlint) 클린.

### ⚠️ 여전히 남은 플레이스홀더
- 박효영·공성준·신지호 3명 프로필 콘텐츠 및 사진 — 사용자 제공 대기.
- 공대호 변호사의 인증서·위촉·수상 이미지(13개) — 캡션 있는 줄무늬 플레이스홀더 프레임 유지.
- 홈페이지 "전문가소개" 섹션(`content.ts`의 `professionals` 배열, 공대호 항목이
  `profile-2.jpg` 사용 중)은 이번 작업 범위 밖 — 필요 시 별도 요청으로 처리.

---

## 2026-07-20 — 신규 페이지: 법무법인경국 > 변호사자문단 (sub-01-03)

> Branch: `claude/o-boinida-98drdm` (PR #74 머지 후 최신 main에서 재시작)
> Figma: `SUB_법무법인경국_변호사자문단_공대호` (89:2963) + _TABLET(89:3220) / _MOBILE(89:3467).

### 특이점 (요구)
- **스티키 로컬탭 = 라우트 모드** — 각 탭이 변호사 1명의 프로필 페이지
  (`/about/lawyers/:lawyerId`). 탭: 공대호변호사 / 박효영변호사 / 공성준변호사 / 신지호변호사.
- 서브비주얼 = sub-01-03, GNB 메뉴 스왑에 반영. 메뉴 연결.

### 구현
- **데이터** `src/data/lawyers.ts`: `Lawyer` 타입 + `LAWYERS`(공대호 = Figma 전체 프로필,
  나머지 3명 = 플레이스홀더). 히어로(이름/직함/연락처/소개/사진), 프로필 11블록
  (주요업무분야·전문분야·학력·경력활동 2단·저서·강의·실적2·인증서/위촉/수상 이미지 그리드).
- **페이지** `src/pages/LawyerProfilePage.tsx`: 다크 히어로 cover(sub-01-03 bg + scrim +
  이름/연락처/소개 + 사진) → 라우트 로컬탭 → prev/next 변호사 이동 버튼 → 라벨-값 블록
  (교차 배경 `:nth-child`) → 인증서 그리드. `LawyerProfile.css`.
- **LocalTabs 확장**: 라우트 모드에 `routeState?` prop 추가. 변호사 탭은 `routeState={null}`
  → 링크에 `scrollToLocalTabs` state 미부여 → 탭 전환/진입 시 `ScrollToTop`이 top으로
  스크롤(새 변호사 히어로 노출). 기본값은 기존 `{ scrollToLocalTabs: true }` 유지(무회귀).
- **라우트** `App.tsx`: `/about/lawyers` → `Navigate to gongdaeho`,
  `/about/lawyers/:lawyerId` → `LawyerProfilePage` (기존 Placeholder 제거).
- **네비** `nav.ts`: `about-lawyers` 비주얼 = sub-01-03 (`GNB_SUB_VISUAL_ABOUT_LAWYERS`).

### 반응형
- 데스크톱: 히어로 info(좌) + 사진(우 340), 블록 라벨(300) + 값 2단.
- ≤1024: 블록 라벨이 값 위로 스택, 사진 260.
- ≤768: 히어로 1열 + **사진 숨김**(텍스트 cover), 경력 1단, 실적 버튼 아래로, 인증서 3→2열.

### 검증 (Playwright, vite preview)
- 1440/768/390: 11블록·23칩·13인증서·4탭 렌더, **가로 넘침 0**, JS 에러 0.
- **탭 라우팅 PASS**: 박효영변호사 클릭 → URL `/about/lawyers/parkhyoyoung`, scrollY=0,
  새 히어로(박효영) 표시.
- build(strict)·lint 클린.

### ⚠️ 후속 (egress 차단으로 플레이스홀더)
- **sub-01-03 히어로** = sub-01-01 임시 복사본. **변호사 사진** = 기존 profile 이미지 임시.
  **인증서/위촉/수상 이미지** = 캡션 있는 줄무늬 플레이스홀더 프레임.
  figma.com이 이 세션 egress 정책으로 403 차단 → 실제 export 확보 시 교체 필요.
- 박효영/공성준/신지호 3명은 **프로필 콘텐츠 미제공** → "프로필 준비 중" 플레이스홀더.

---

## 2026-07-20 — 공익사업 "절차 · 유의할 점" 흐름 재설계 (Figma 플로우차트 복원)

> Branch: `claude/o-boinida-98drdm` (PR #74에서 개선)
> 파일: `src/data/publicProject.ts`, `src/pages/PublicProjectPage.tsx`, `PublicProject.css`.

### 요구
1. **데스크톱 = 원래 Figma 플로우차트 그대로** (스텝1~3행 → 협의 결정 → 스텝4 → Y분기 → 5·6 병렬).
2. **모든 UI 직각**(라운드 0) — 이전 원형 번호배지(`border-radius:50%`)가 규칙 위반이었음.
3. **태블릿/모바일 = 카드 UI 최대 활용해 흐름 설계.**

### 발견 (중요)
이전 데이터가 Figma 대비 **크게 축약**돼 있었음 (스텝1이 실제 4개 불릿인데 1개만, 소제목·
※주석 누락). Figma 스크린샷(80:2096 / 80:2097)에서 **두 흐름 전체 콘텐츠를 정확히 복원**.
- 스텝 모델 변경: `{no,label,notes[],caution}` → `{no,title,subtitle?,bullets[],note?}`.
- ProcedureFlow 구조: `steps(1-3)` + `outcomes(성립/불성립)` + `lead(4)` + `forkNote?`(재개발
  병행절차) + `parallel(5,6)`.

### 구현
- **StepCard**(공통): 사각 번호배지 + 제목(+inline subtitle) + 불릿 + ※ 회색 note 박스. 전부 직각.
- **데스크톱 플로우차트**(`.pp-flow__chart`): `--top` 3열, `--decision` 2열(성립 teal·✓ / 불성립
  red·↓, 사각 아이콘), `--parallel` 2열. 우각 커넥터 —
  `.pp-flow__link`(수직), `--branch`(불성립 75%에서 하강), `.pp-flow__fork`(┌─┐ 브래킷 → 5·6).
  `forkNote`는 스텝4와 분기 사이 사각 박스.
- **태블릿/모바일**(≤1024): 같은 카드가 1열로 스택, 커넥터는 중앙 수직선으로 전환,
  Y분기 브래킷은 직선으로 붕괴, 상단 스텝(1→2→3)엔 gap 커넥터 추가. **마크업 1벌, 레이아웃만 스왑.**

### 검증 (Playwright, vite preview)
- 1440: Figma 플로우차트 충실 복원(양 흐름). 768/390: 카드 스택 + 커넥터.
- **border-radius 감사: 절차 섹션 내 0개(전부 직각)**. 스텝 12개, 전 구간 가로 넘침 0.
- build(strict)·lint 클린.

> (앞선 세로 타임라인 시안은 이 플로우차트 복원으로 대체됨.)

---

## 2026-07-20 — 정비사업 "재개발 vs 재건축" 비교표 모바일 대응

> Branch: `claude/o-boinida-98drdm` (PR #72 머지 후 최신 main에서 재시작)
> 파일: `src/pages/Renewal.css`, `src/pages/RenewalPage.tsx` (data-col 부여).

### 증상
overview 섹션 "재개발 vs 재건축" 3열 표가 모바일에서 화면을 벗어남(재건축 열 잘림).

### 근본 원인 (Playwright 측정으로 확정)
`.renewal-table`는 `min-width: 640px`, `.renewal-table-wrap`은 `overflow-x: auto`.
하지만 wrap은 `.renewal-split__body`(flex column)의 **flex 아이템**이고 `min-width`
기본값이 `auto`(= 콘텐츠 min-content = 640)라, 뷰포트 390에서도 wrap이 342로 줄지
못하고 **640으로 부풀어** overflow-x:auto가 무력화됨. `body{overflow-x:hidden}`이
넘친 부분(재건축 열)을 잘라버림.
- 측정: viewport 390 → wrapClientW/tableW = **640**(잘림), 수정 후 = **342**(정확히 맞음).

### 해결 (설계: 데스크톱 표 유지 + 모바일 카드 리플로우)
1. **안전망**: `.renewal-table-wrap { min-width: 0 }` — flex 아이템이 줄어들 수 있게 해
   혹시 넘쳐도 wrap 내부에서만 스크롤(페이지·잘림 없음).
2. **모바일(≤767) 카드 리플로우**: 같은 시맨틱 `<table>`을 순수 CSS로 변형 —
   `table→block`, `thead`는 시각 숨김(스크린리더 유지), 각 `tr`을 카드로,
   `구분 label`을 카드 헤더, 두 `td`(재개발/재건축)를 라벨 블록으로 세로 스택.
   `td`에 `data-col`(재개발/재건축)을 부여하고 `::before content: attr(data-col)`로
   티얼 아이브로우 표시. **가로 스크롤 0, 마크업·접근성·데스크톱 표 그대로.**

### 검증 (Playwright, vite preview)
| 폭 | 결과 |
|---|---|
| 1440 / 768 | `display:table`, thead 보임 → 원래 3열 표 유지(무회귀) |
| 390 | `display:block` 카드, thead 숨김, `재개발` 아이브로우 표시 |
| 전 구간 | 페이지 가로 넘침 없음 |
- build(strict tsc)·lint 클린.

---

## 2026-07-20 — 신규 페이지: 재개발·보상업무 > 공익사업 (sub-02-02)

> Branch: `claude/o-boinida-98drdm` (PR #71 머지 후 최신 main에서 재시작)
> Figma: `SUB_재개발보상업무_공익사업` (node 80:1908) — 정비사업(renewal)과 동일한
> **원스크롤 + 스크롤모드 로컬탭** 패턴.

### 구현
- **데이터** `src/data/publicProject.ts`: 5개 탭/섹션 콘텐츠(Figma design_context에서 정확 추출).
- **페이지** `src/pages/PublicProjectPage.tsx`: renewal의 스크롤-스파이 로직 복제
  (`data-public-section` + IntersectionObserver, 탭 클릭 → `scrollTo`(GNB+로컬탭+8px offset)).
  renewal의 시각 클래스(`renewal-section/split/bullet-title/list/quotes/results`)를
  `Renewal.css` import로 재사용.
- **CSS** `src/pages/PublicProject.css`: 신규 컴포넌트만 —
  `.pp-two-col`(주요업무/대상사업 2단), `.pp-strengths`(변호사 겸 감정평가사 강점: 라이트박스
  + 시안 요약바 + 2×2 카드), `.pp-flow`(손실보상절차: 번호 스텝 + 협의 성립/불성립 색상 박스
  + 후속 스텝), `.pp-rights`(토지/지장물/영업손실 권리 카드).
- **라우트** `App.tsx`: `/practice/public` → `PublicProjectPage` (기존 Placeholder 제거).
- **네비** `nav.ts`: `redev-public.visual` = `PUBLIC_PROJECT_PAGE.visual`(sub-02-02) —
  GNB 풀메뉴/드로어 서브비주얼 스왑에 반영.

### 로컬탭 (Section / Bread 순서)
공익사업 / 공익사업실적 / 보상업무 / 절차 · 유의할 점 / 보상업무실적
(마지막 프레임 이름은 `TAB_정비사업실적` copy-paste 잔재 → 실제 라벨은 **보상업무실적**.)

### 영문 보조문구(enLabel) 교정 — 사용자 요청
Figma의 영문 eyebrow가 대부분 copy-paste 잔재라 법률용어 기준으로 재번역:
| 섹션 | Figma(잘못) | 적용(교정) |
|---|---|---|
| 공익사업 | Urban Refurbishment Project | **Public Works Project** |
| 공익사업(시행자대리)실적 | STRENGTH | **Public Works Track Record** |
| 보상업무 | Urban Refurbishment Project | **Loss Compensation** |
| 절차·유의할 점 | Preliminary Injunction for Eviction | **Procedure & Key Points** |
| 공익사업(보상업무)실적 | STRENGTH | **Compensation Track Record** |
> 근거: 「공익사업을 위한 토지 등의 취득 및 보상에 관한 법률」 공식 영문 = *Act on
> Acquisition of and Compensation for Land for **Public Works** Projects*.

### ⚠️ 미해결 / 후속 (중요)
- **sub-02-02 히어로 이미지 = 임시 플레이스홀더**: 실제 Figma export를 받지 못함
  (figma.com이 이 세션 egress 정책으로 **403 차단**, base64는 파일 저장 불가).
  `public/assets/sub/sub-02-02.{jpg,webp,preview.webp}`는 현재 **sub-02-01 복사본**.
  → 실제 이미지 확보 시 jpg 교체 후 `python3 scripts/generate-progressive-images.py`
  (TARGETS에 `sub/sub-02-02.jpg` 추가) 재생성 필요.
- **절차 흐름도 단순화**: Figma는 분기 화살표가 있는 플로우차트지만, 반응형/유지보수를
  위해 **번호 스텝 리스트 + 성립(teal)/불성립(red) 결과 박스**로 충실히 대체(모든 법률
  문구 보존). 정확한 SVG 커넥터는 후속 과제.
- 보상업무 섹션의 "법무법인 경국 대표 이미지" 배너(1280×500)는 이미지 확보 불가로 **생략**.

### 검증 (Playwright, vite preview)
- 1440 / 768 / 390 모두: 탭 5개·섹션 5개·강점 4카드·절차 12스텝·권리 3카드·실적 30(15+15),
  JS 에러 0.
- **탭 클릭 → 섹션 스크롤**: 보상업무 클릭 시 섹션 top이 GNB+로컬탭+8px에 정확히 안착
  (오차 <1px). build(strict tsc)·lint 클린.

---

## 2026-07-20 — 소식·공지(Notice) 섹션 반응형 Figma 정합

> Branch: `claude/o-boinida-98drdm` (PR #70 머지 후 최신 main에서 재시작)
> 파일: `src/styles/global.css` 만 변경 (JSX/데이터 무변경).
> Figma: `AI_dev` — HOME(`1:7226`) / HOME_TABLET_768(`1:7720`) / HOME_MOBILE_390(`1:8221`)의
> `Home Section / 소식·공지`.

### 배경
Figma 3개 프레임과 현재 구현을 대조한 결과, **태블릿 카드 레이아웃이 완전히 달랐고**
간격·비율·헤더 버튼 위치에도 차이가 있었다. (분석 근거: get_metadata 수치 + 스크린샷)

### Figma 스펙 (확정)
| 구간 | 컬럼 | 카드 | 간격 | 좌우마진 |
|---|---|---|---|---|
| 데스크톱(1920) | 3열 | 세로 오버레이 500×700 (이미지풀+하단 흰 텍스트) | **10px** | 200 |
| 태블릿(768) | **1열** | **가로형 672×250: 좌 250² 이미지 + 우 밝은(#F7F7FB) 패널 · 어두운 글자 · 어두운 화살표** | **16px** | 48 |
| 모바일(390) | 1열 | 세로 오버레이 342×478.8 (=5:7) | **8px** | 24 |

- 태블릿 텍스트 토큰: Title 24 / Body 16 / Date 14 (Pretendard), 글자 `#111`, 패널 `#F7F7FB`.
- 헤더 `전체보기` 버튼: 데스크톱·**태블릿=제목 오른쪽(같은 행)**, 모바일=제목 아래.
- 아이콘(`icon-link.svg`)은 흰색 소스 → 오버레이(데/모)는 흰색 유지, 태블릿은 `filter: brightness(0)`로 어둡게.

### 구현 (CSS만)
- **base(데스크톱)**: `.notice-grid` gap 20→**10**; `.notice-card` `min-height` clamp → **`aspect-ratio: 5/7`**.
- **`@media (max-width:1024px)`**: 그리드 2열→**1열** (min-height 규칙 삭제).
- **신규 `@media (min-width:768px) and (max-width:1024px)`** (태블릿 전용 가로카드):
  카드 `display:grid; grid-template-columns:250px minmax(0,1fr)`, 배경 `#f7f7fb`, 글자 ink;
  미디어 `position:relative; aspect-ratio:1/1`; 오버레이 `position:relative; background:none; justify-content:center`;
  제목 24 / 본문 body색 / 날짜 muted; 아이콘 `top/right:20; filter:brightness(0)`;
  `#notice .section-head { flex-direction:row; align-items:flex-end }` (공용 ≤1024 column 규칙 위 오버라이드).
- **`@media (max-width:767px)`**: gap **8**, 오버레이 gap 8·padding 20, 제목 24, 본문 14, 아이콘 top/right 16.
  (카드는 base 오버레이 그대로 상속 — 태블릿 가로카드는 768–1024로 **경계 한정**해 모바일이 되돌릴 필요 없게 설계.)

### 왜 이 경계 구조인가
가로카드를 `min-width:768 and max-width:1024`로 **범위 한정**하면, 모바일(≤767)은 base 오버레이
카드를 그대로 물려받아 "태블릿 override를 다시 되돌리는" 취약한 역보정이 사라진다.
경계도 Figma 프레임과 정확히 일치(768=가로카드, 767=오버레이).

### 검증 (Playwright, vite preview)
| 구간 | 측정 | Figma |
|---|---|---|
| 1440 | 3열·gap 10·카드 373×523(=5:7)·헤더 row | ✅ |
| 768 | 1열·gap 16·카드 672×250·bg #f7f7fb·이미지 250²·헤더 row | ✅ |
| 390 | 1열·gap 8·카드 342×479(=5:7)·오버레이·헤더 column | ✅ |
- 스크린샷 육안 확인: 태블릿 가로카드(밝은 패널·어두운 화살표), 데스크톱/모바일 흰 오버레이 일치.
- build/lint 클린.

### 참고 (미변경)
- 데스크톱 카드 모서리: Figma `rounded-rectangle`이나 스크린샷상 각진 형태 + 브랜드=sharp rect라 **각진 유지**.
- 헤더 설명문("법무법인경국의 가치는 다양한 수상, 위촉, 인증…")은 수상 섹션 카피처럼 보이나
  이번 작업 범위(레이아웃)가 아니라 **원문 유지**. 카피 교체는 별도 확인 후 진행 권장.

---

## 2026-07-20 — 게시판 상세 이전/다음 스크롤 버그 수정 (스티키 기준점)

> Branch: `claude/o-boinida-98drdm` (merged PR #69 이후 최신 main에서 재시작)
> 파일: `src/hooks/useScrollToLocalTabs.ts` 만 변경.

### 증상 (사용자 리포트)
게시판 상세에서 **이전/다음 게시글 클릭 시 화면 스크롤 위치가 그대로** 유지됨.
기대: 새 게시글의 **본문 상단이 sticky 로컬탭 바로 아래**에 오도록 점프.

### 근본 원인 (Playwright로 재현·확정)
`useScrollToLocalTabs`가 `document.getElementById(LOCAL_TABS_ANCHOR_ID)`로
얻은 요소에 `el.scrollIntoView()`를 호출했는데, 그 요소는 로컬탭 `<nav>`이고
**`position: sticky; top: var(--gnb-bar-h)`**. 스크롤이 내려간 상태에선 이
nav가 이미 `top:100px`에 **stuck** 되어 있어, 브라우저는 "이미 뷰포트
시작에 보임"으로 판단 → `scrollIntoView`가 **완전 no-op**.

진단 수치 (수정 전, 1440px):
```
클릭 전:  scrollY=1358  tabsTop=100(stuck)  bodyTop=-397
클릭 후:  scrollY=1358  tabsTop=100          bodyTop=-397   ← 안 움직임
수동 el.scrollIntoView(sticky nav): 700 → 700 (no-op 재현)
비-sticky sentinel 기준 window.scrollTo: 700 → 628 (정상)
```
> 참고: 이 버그는 prev/next 뿐 아니라 **list→detail / 목록으로 / 탭클릭**
> 모든 board 스크롤에 있었음 (전부 같은 sticky nav를 대상으로 했기 때문).
> prev/next에서 가장 눈에 띄었을 뿐.

### 해결
sticky 요소가 아니라 **비-sticky 기준점**을 측정해 `window.scrollTo`로 계산:
- 탭형 보드 → `.local-tabs__sentinel` (nav 바로 앞 1px 마커, non-sticky)
- 사회공헌(탭 없음) → `#subpage-local-tabs` 앵커 div (non-sticky)
- `targetY = window.scrollY + anchor.rect.top − gnbH`, `Math.max(0, …)` 클램프,
  `behavior: 'smooth'`. 새 라우트 콘텐츠 레이아웃을 위해 double rAF 유지.

### 검증 (Playwright, vite preview)
- 데스크톱 1440 + 모바일 390(gnbH 82) 모두 PASS.
- 언론보도/컬럼미디어/사회공헌 각각: list→detail & prev/next에서 탭이
  GNB 밑(±3px)에 고정되고 본문 상단이 뷰포트 상단 근처에 노출.
- 회귀 확인: **list 페이지 GNB 진입 시 scrollY=0** (sub-visual 유지) — 정상.

---

## 2026-07-20 — 구조 리팩터 4종 (board 통합 / strict / reveal 훅 / a11y)

> Branch: `claude/o-boinida-98drdm`
> Audience: Codex / Cursor / future agents. **UI 픽셀·모션 변경 없음** — 순수 구조 개선.
> 검증: `npm run build` ✅ / `npm run lint` ✅ / Playwright 스모크 27개 전부 PASS (아래).

### 1. 게시판(board) 모듈 통합 — `BoardModule`

**문제 (근거):** 언론보도·컬럼미디어·사회공헌 세 게시판이 접두사만 다른
병렬 API를 3벌 유지하고 있었다:

| columnMedia | pressCoverage | socialContribution |
|---|---|---|
| `findPost` | `findPressPost` | `findSocialPost` |
| `adjacentPosts` | `adjacentPressPosts` | `adjacentSocialPosts` |
| `tabListPath` | `pressTabListPath` | `socialListPath` |
| `postDetailPath` | `pressPostDetailPath` | `socialPostDetailPath` |

상세 페이지 3개(`PostDetailPage` / `PressCoverageDetailPage` /
`SocialContributionDetailPage`)는 데이터 함수 이름만 다른 **동일 로직**
(param 검증 → find → adjacent → `PostDetail`)이었고, 탭형 레이아웃 2개
(`ColumnMediaLayout` ≈ `PressCoverageLayout`)도 클래스명만 다른 판박이였다.
CMS 연동 시 세 곳을 동시에 고쳐야 하는 구조.

**해결:**
- `src/data/board.ts` — `BoardPageMeta` / `BoardModule` 타입 +
  `createBoardModule()` 팩토리 추가. `isTab`/`postsByTab`/`findPost`/
  `adjacent`/`listPath`/`detailPath`를 한 계약으로 생성.
  `hasTabSegment: false` → 사회공헌처럼 탭 세그먼트 없는 단일 보드
  (`basePath/:postId`).
- 각 데이터 파일은 `*_BOARD` 모듈 export (`COLUMN_MEDIA_BOARD` /
  `PRESS_COVERAGE_BOARD` / `SOCIAL_CONTRIBUTION_BOARD`). 구 래퍼 함수 전부 삭제.
- `src/pages/BoardDetailPage.tsx` (신규) — 제네릭 상세 라우트.
  상세 페이지 3개 파일 **삭제**, `App.tsx`에서
  `<BoardDetailPage board={…_BOARD} />`로 주입.
- `src/pages/BoardTabsLayout.tsx` (신규) — 제네릭 탭형 셸
  (SubVisual + LocalTabs + Outlet). `ColumnMediaLayout` /
  `PressCoverageLayout`은 CSS import + Figma naming만 소유한 얇은 래퍼로 축소.
  CSS import는 정적이라 제네릭에서 조건부 불가 → 래퍼가 담당 (의도적).
- `PRESS_COVERAGE_POSTS`는 `Record<tab, posts[]>` → **flat 배열**로 변경
  (모듈이 `tab` 필드로 필터). CMS 응답을 flat list로 받는 형태와도 정합.

**유지된 것 (회귀 없음 확인):**
- URL 스킴 전부 동일 (`/press/coverage/:tab/:postId` 등) — SEO/딥링크 불변.
- `PostDetail` / `PostListCard` / `PressGridCard` / `SocialGridCard` /
  `LocalTabs` / `SubVisual` 컴포넌트 무변경.
- 잘못된 tab/postId → 리스트로 redirect 동작 동일.
- 사회공헌 레이아웃(anchor + showChip=false + intro)은 구조가 달라
  `BoardTabsLayout`을 쓰지 **않는다** — 그대로 둠.

**새 게시판 추가 절차 (이제):** 데이터 파일에서 `createBoardModule()` →
`App.tsx` 라우트에 `BoardTabsLayout`(탭형이면) + `BoardDetailPage` 주입 → 끝.

### 2. TypeScript `strict: true`

- `tsconfig.app.json` + `tsconfig.node.json`에 `"strict": true` 추가.
- **결과: 기존 코드 오류 0** — 이미 strict-호환으로 작성돼 있었고,
  안전망만 공짜로 확보. 앞으로 null 부주의가 컴파일 타임에 잡힌다.
- 이 과정에서 제네릭 페이지들은 non-null 단언(`!`) 대신 명시적 가드
  (`if (!tabDef) return …`)를 사용하도록 작성함.

### 3. `useDoubleRafReveal` 훅 — CharReveal/LineReveal 공통화

**문제:** 두 컴포넌트가 "double rAF 후 `is-active`" 타이밍 로직을 글자
그대로 중복. 이 로직은 AGENTS.md의 **blocking QA 계약**(“Char/line reveals
must actually animate”)이라, 한쪽만 수정되다 깨지는 사고 위험이 있었다.

**해결:** `src/hooks/useDoubleRafReveal.ts`로 추출. 계약 두 가지를 훅
주석에 박제:
1. 마운트 프레임에 `is-active`를 붙이면 CSS transition 스킵 → double rAF 필수.
2. deps는 원시 `contentKey`만 (hero rAF `setProgress` 리렌더가 배열
   identity를 매 프레임 갈아끼우면 리빌이 opacity 0에 갇힘 —
   2026-07-17 회귀 사례).

`CharReveal`의 공백 → NBSP(`' '`) 치환 동작 그대로 유지.

### 4. Hero gage 접근성 모순 해소

`.hero__gage-bar`가 `aria-hidden="true"` + `role="progressbar"` +
`aria-value*`를 동시에 갖고 있었다. hidden 노드는 role을 노출하지 않으므로
progressbar 선언이 무의미했고, 매 프레임 % 갱신은 노출됐다면 오히려 소음.
슬라이드 위치는 버튼 aria-label이 전달하므로 **장식으로 정리**
(role/aria-value* 제거, `aria-hidden` 유지). 시각 동작 무변경.

### 검증 (Playwright, vite preview :4173)

- **보드 스모크 15개 PASS**: 세 게시판 각각 리스트 렌더 → 상세 진입 →
  다음/이전 내비 → 목록으로 복귀 + 잘못된 tab/postId redirect 3종.
- **Hero QA 12개 PASS** (AGENTS.md blocking bar): char/line 리빌
  `is-active` + opacity 1, 게이지 scaleX 진행/클릭 시 즉시 리셋,
  next/prev 즉시 전환, 리빌 재시작, 활성 슬라이드 정확히 1개,
  썸 호버 시 `.is-preview` 고스트 없음 / 배경 피크 없음.
- 콘솔 JS 에러 없음 (외부 폰트 CDN 차단은 CI 샌드박스 환경 문제로 무관).

### 파일 요약

| 변경 | 파일 |
|---|---|
| 신규 | `src/pages/BoardDetailPage.tsx`, `src/pages/BoardTabsLayout.tsx`, `src/hooks/useDoubleRafReveal.ts` |
| 삭제 | `src/pages/PostDetailPage.tsx`, `src/pages/PressCoverageDetailPage.tsx`, `src/pages/SocialContributionDetailPage.tsx` |
| 재작성 | `src/data/board.ts`(+팩토리), 레이아웃/리스트 페이지 5개, `CharReveal`/`LineReveal` |
| 수정 | `App.tsx`(라우트 주입), 데이터 3파일(모듈 export), `Hero.tsx`(gage a11y), tsconfig 2개(strict) |

---

> Audience: Codex / Claude Code / future Cursor agents continuing this repo.
> Branch: `cursor/hero-motion-icons-129f`
> Date: 2026-07-17
> Live site: https://james-oh-dot.github.io/gyungkook/

---

## Goal (user request — must match)

1. **`hero_maincopy`**: character-by-character sequential reveal (index + title lines).
2. **`hero_copy`**: **line-by-line parallax** entrance (label + description lines). **Not** char-by-char.
3. **`swipe_gage`**: fills over **10s** (`HERO_DURATION_MS`). On prev/next/preview click → **gage resets to 0 immediately** and **all slide elements switch instantly** (do not wait for 10s).
4. **Hero slide 02**: must use the **jewel/diamond** image (not architecture / person).
5. **Icons/arrows**: no broken “X box” images — use real `.svg` files.
6. Visual language: **premium + sharp/rectangular**; interactions: **soft / smooth** (impeccable + brand notes).
7. Document thoroughly for handoff (this file).

---

## Root cause notes (important)

### Broken icons (X boxes)
- Files under `public/assets/icon-*.png` were **SVG XML saved with a `.png` extension**.
- Browsers request `image/png`, fail to decode → broken image icon.
- **Fix**: ship clean `public/assets/icon-*.svg`, point all `asset('assets/icon-…')` calls to `.svg`, **delete** the fake `.png` icons.
- Hero arrows: SVG stroke is already **white**. Do **not** apply `filter: invert(1)` (that made arrows black-on-black).

### Wrong slide 02 image
- Figma `hero_type1` / `02rebuild` main fill historically pointed at a **modern architecture** photo (metal panels).
- User explicitly wants **jewel**. Correct asset is the jewel used as the “02 Rebuild” **preview** on `hero_concept` (`swipe` thumb).
- Current mapping:
  - `hero-01.jpg` → traditional Korean eaves / dancheong (VALUE)
  - `hero-02.jpg` → **teal jewel on dark** (REBUILD) ✅
  - `hero-01-next.jpg` → jewel thumb (preview of slide 02)

### Hero copy animation was wrong
- Previously `hero_copy` also used `CharReveal` (char stagger).
- Now uses `LineReveal` (`src/components/LineReveal.tsx`) with per-line `--line-parallax` Y offset + staggered delay.

### Gage jank
- Do **not** animate gage with CSS `width` + transition while also driving progress via rAF (double interpolation → rubber-band feel).
- Drive with `transform: scaleX(progress)` and `transition: none`. On `jumpTo`, `setProgress(0)` instantly.

---

## Key files

| Path | Role |
|------|------|
| `src/components/Hero.tsx` | Carousel state, 10s timer, instant `jumpTo`, wires reveals |
| `src/components/Hero.css` | Soft premium motion, gage, reduced-motion |
| `src/components/CharReveal.tsx` | Char-by-char for `hero_maincopy` |
| `src/components/LineReveal.tsx` | Line parallax for `hero_copy` |
| `src/data/slides.ts` | Slide copy + image paths + `HERO_DURATION_MS = 10000` |
| `src/utils/asset.ts` | Prefixes Vite `BASE_URL` (GitHub Pages `/gyungkook/`) |
| `public/assets/hero-0{1..5}.jpg` | Slide backgrounds |
| `public/assets/icon-*.svg` | UI icons (source of truth) |
| `.cursor/skills/impeccable/` | UI craft skill (also mirrored under `.claude` / `.agents`) |

---

## Behavior contract (do not regress)

```
Timer: rAF loop → progress = elapsed / 10000
At progress >= 1 → jumpTo(index + 1)

jumpTo(n):
  - index = n (wrapped)
  - progress = 0          // gage snaps to empty
  - animKey++             // remount content → re-run reveals
  - restart startRef
  - clear pause / preview hover

Buttons (prev / next / swipe preview click):
  - call jumpTo immediately (no wait)

Hover swipe thumbnail:
  - pauses timer only
  - scales thumbnail image ONLY (never peeks next slide onto .hero__bg)
  - leave resumes from paused elapsed
```

### Reveal timing (soft, sequential)

- Main title chars: ~30ms step, line offset, ease-out expo-ish curves.
- Copy lines: ~160ms between lines, each line starts with larger Y offset (`22 + i*12` px) → parallax feel.
- BG crossfade ~1.05s opacity / ~1.35s scale — soft, not snappy. Inactive slides stay `visibility: hidden`.

---

## Impeccable / brand constraints applied

- Motion: ease-out quart/expo curves; no bounce/elastic.
- Prefer `transform` / `opacity` / light `filter` blur — avoid layout animation for gage.
- `prefers-reduced-motion: reduce` → instant show, no blur/transform choreography.
- Sharp rect UI (no rounded hero chrome); soft interaction feedback on buttons (opacity / 1px lift / active scale).

Optional later: `/impeccable init` to create `PRODUCT.md` / `DESIGN.md` (not blocking this scoped fix).

---

## Commands

```bash
npm install
npm run dev          # http://localhost:5173
npm run lint
npm run build
# Pages production base:
GITHUB_PAGES=true npm run build
```

---

## QA checklist (manual) — blocking

- [ ] Slide 01: eaves image; maincopy chars cascade; copy lines parallax in
- [ ] Slide 02: **jewel** image; Rebuild copy
- [ ] Gage fills smoothly over ~10s; at end advances; image Ken Burns zooms slowly over those 10s
- [ ] Click next: gage → 0 instantly; image + copy switch immediately; reveals restart
- [ ] Click prev: same
- [ ] Click swipe preview: advances; gage resets
- [ ] **Hover thumbnail: ONLY thumb image scales; full hero background does NOT show next slide** (critical)
- [ ] Desktop / tablet / mobile: hero copy never covered by swipe; long labels wrap (no clipped English)
- [ ] Arrows visible (white chevrons), not X boxes
- [ ] Section icons (notice link, office, awards, text buttons) render
- [ ] Responsive: thumb morphs softly via `--hero-thumb-scale` / size transitions
- [ ] No rubber-banding / stutter on gage or text

---

## Known follow-ups

- Re-verify slides 03–05 against Figma `hero_type1` variants if art direction drifts.
- `nextImage` fields in `slides.ts` are legacy; Hero uses `nextSlide.image` — can remove `nextImage` later.
- GitHub Pages deploy: merge to `main`; workflow uses `GITHUB_PAGES=true`. Confirm live `/gyungkook/` after merge.
- Agent PR creation may still need repo collaborator rights — push branch + open PR manually if tool fails.

---

## Change summary (this branch)

- Rewrote hero motion: CharReveal maincopy + LineReveal copy + scaleX gage.
- Replaced slide 01/02 assets (architecture eaves + jewel).
- Replaced all icons with real SVGs; removed broken SVG-as-PNG files.
- Fixed PNG-bytes saved as `.jpg` for `hero-02-next` / `hero-03`.
- Fixed slide skip bug: `jumpTo` 180ms debounce + `alive` flag on rAF cleanup (Strict Mode / stacked pointer / auto-advance race).
- Preload all hero images on mount to avoid black flash on first visit to a slide.
- Added this WORKLOG + AGENTS.md cloud notes update.

### QA notes (local)
- Stale Vite on :5173 (old session) caused false “black slide 02 / broken icons” — kill old `vite-dev` before testing.
- After restart on :5173: slide 02 jewel ✅, icons ✅.
- Playwright headless confirms sequential nav `01→02→03→04→05→01` and gage reset (`scaleX≈0` after click).
- Swipe meta must use `slide.nextLabel` + `nextSlide.index` (not `nextSlide.nextLabel`).

---

## 2026-07-18 — Classic dark hero preserved as separate page

Client still comparing two art directions. Current default = teal rebuild; previous dark hero restored as MPA page:

| URL | Entry | Hero |
|---|---|---|
| `/` (`index.html`) | `src/main.tsx` → `App` | Teal `Hero` (AI-hero-change) |
| `/classic.html` | `src/main-classic.tsx` → `AppClassic` | Dark `HeroClassic` |

- Assets: `public/assets/classic/hero-0{1..5}.jpg` (+ next thumbs) restored from pre-rebuild commit
- Data: `src/data/slidesClassic.ts`
- Floating compare control: `VersionSwitch` on both pages (`A · Teal` / `B · Dark`)
- Vite `build.rollupOptions.input` includes both HTML entries (GitHub Pages deploys both)

Live after merge: `https://james-oh-dot.github.io/gyungkook/` and `…/classic.html`

---

## 2026-07-18 — Hero full rebuild from Figma `AI-hero-change`

### Source
Figma file `AI_dev` canvas `AI-hero-change` (`22:10492`) → `hero_1`…`hero_5`.

### Structure (replaces old black / right-panel hero)
| Layer | Spec |
|---|---|
| Stage | Solid `#58bdc2` |
| Visual | Per-slide centered subject (`statue` / `jewel` / `cubes` / `birds` / `campus`) |
| `hero_copy` | Description (Pretendard 24) **above** maincopy |
| `hero_maincopy` | Large Nanum Myeongjo English word + Korean title (side-by-side) |
| `hero_swipe` | White-border thumb + **white** meta card (`02 REBUILD`) + gage |

### Motion (unchanged contract)
- 10s Ken Burns on active visual (`--hero-zoom`)
- Desc = `LineReveal`; word + title = `CharReveal`
- Gage `scaleX(progress)`; instant `jumpTo` on controls
- Thumb hover: thumb image scale only — **never** full-stage next peek

### Assets
- `public/assets/hero-0{1..5}.jpg` + `hero-0{1..5}-next.jpg` from Figma MCP
- Transparent PNG fills composited onto `#58bdc2` before JPEG (avoids black boxes)

---

## 2026-07-17 — Hero responsive QA + hover regression (critical)

### Bugs fixed
1. **Critical:** Thumbnail hover applied `.is-preview` on next `.hero__bg-slide` (opacity ~0.42 over full hero). Removed entirely. Hover may only scale `.hero__swipe-thumb img`. Timer pause on hover remains.
2. Copy overlapped by absolute `hero__swipe` — added `--hero-swipe-reserve` bottom padding; mid-width right padding keeps left column clear; long labels wrap.
3. Inactive slides now `visibility: hidden` when opacity 0 (no ghost stacks).
4. Responsive thumb morph via `--hero-thumb-scale` + size transitions.
5. **LineReveal never activated:** hero `setProgress` re-renders every frame; `lines={[…]}` new array ref reset the reveal effect. Fixed with stable `contentKey = lines.join('\n')` dependency (this made `VALUE` / desc appear invisible — opacity stuck at 0).

### Docs
- `AGENTS.md` → **Hero QA quality bar** section (blocking rules).
- This checklist updated (hover preview of full BG is forbidden).

### Automated QA (Playwright)
Viewports 1440 / 1280 / 1024 / 390: no copy↔swipe overlap; no `.is-preview`; no ghost inactive slides on thumb hover; labels/desc `is-active` + opacity 1.
---

## 2026-07-17 — Section interactions (Professionals / Press / Awards)

### Figma naming caveat (critical)
| Frame name in Figma | Actual content implemented |
|---|---|
| `Home Section / 실적` (`21:1931`) | **Professionals** default cards |
| `Home Section / 실적_hover …` (`21:2035`) | **Professionals** hover: dim + full copy / siblings blur + opacity 0.4 |
| `Home Section / OFFICE` (`1:7480`) | **Press (활동·보도)** horizontal `list_swipe` + gage (not the map Office) |
| `Section` (`1:7516`) | **Awards** + `호버시imgs` mouse-follow |

Real map Office remains `1:7571` / `OfficeSection` (unchanged).

### Behavior shipped
1. **Professionals** (`ProfessionalsSection`)
   - Hovered card: veil `rgba(14,24,24,0.8)` + hover copy (headline/bio/tags) soft fade/slide in
   - Sibling cards: image blur ~6px + default text opacity 0.4
2. **Press** (`PressSection`) — Figma “OFFICE” swipe list
   - Full-bleed horizontal track (`press-breakout`), starts padded to `--page-pad` (title align), scrolls across viewport
   - Max 5 items (`pressItems.slice(0,5)`)
   - `useScrollGage`: bottom gage thickens to **20px** on hover/scroll; thumb draggable / mirrors scroll
3. **Awards** (`AwardsSection`)
   - Default active index **2** (3rd list)
   - `호버시imgs` fades in and follows pointer **inside the section** only
   - Image keyed by list; currently all map to `award-hover.jpg` until per-item assets arrive

### Key files
- `src/components/sections/HomeSections.tsx`
- `src/hooks/useScrollGage.ts`
- `src/data/content.ts` (professionals headline/bio; awards objects; 5 press items)
- `src/styles/global.css`

### Follow-ups
- Replace awards per-item images when provided
- Optional: apply same hover language to Achievements white-card rows if design wants parity (separate from misnamed Figma frames)
