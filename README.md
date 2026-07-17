# 법무법인 경국 (GYUNGKOOK) Homepage

Figma `HOME` / `HOME_TABLET_768_RESPONSIVE_AUTO` / `HOME_MOBILE_390_RESPONSIVE_AUTO` 기준 반응형 퍼블리싱.

## 개발

```bash
npm install
npm run dev
```

- Dev server: `http://localhost:5173`
- Lint: `npm run lint`
- Build: `npm run build`

## Live (GitHub Pages)

https://james-oh-dot.github.io/gyungkook/

`main` 푸시 시 GitHub Actions로 자동 배포됩니다.

## 구현 포인트

- Desktop / Tablet(768) / Mobile(390) 반응형
- Hero 5슬라이드 · 10초 자동 전환 · 게이지 · 화살표 즉시 전환
- 메인카피 글자 단위 순차 등장
- Swipe 프리뷰 호버 시 다음 배경 프리뷰 + 타이틀 갱신
- 섹션 스크롤 페이드인/슬라이드업
- 썸네일 호버 스케일업
