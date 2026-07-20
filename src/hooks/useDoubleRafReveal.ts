import { useEffect, useState } from 'react'

/**
 * Shared reveal-timing primitive for `CharReveal` / `LineReveal`.
 *
 * 계약 (AGENTS.md "Char/line reveals must actually animate" — blocking):
 * 1. `is-active`는 마운트 프레임에 바로 붙이면 CSS transition이 스킵된다.
 *    **double rAF** 후에 켜야 초기 상태가 한 번 페인트되고 전환이 발생한다.
 * 2. deps는 반드시 **원시값**(`contentKey` 문자열)이어야 한다 — hero의
 *    rAF `setProgress`가 매 프레임 리렌더하므로, 배열/객체 identity를
 *    의존성으로 쓰면 리빌이 매 프레임 리셋되어 opacity 0에 갇힌다
 *    (2026-07-17 회귀: VALUE/설명 텍스트 영구 비표시).
 *
 * 이 훅으로 로직을 한 곳에 모아 두 컴포넌트가 따로 수정되다
 * 한쪽만 계약이 깨지는 사고를 방지한다 (2026-07 리팩터).
 *
 * @param contentKey  콘텐츠를 대표하는 원시 키 (예: `lines.join('\n')`, `text`)
 * @param active      false면 즉시 숨김 상태로 리셋
 * @returns           `is-active`를 붙여도 되는 시점이면 true
 */
export function useDoubleRafReveal(contentKey: string, active: boolean): boolean {
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    setRevealed(false)
    if (!active) return

    let raf2 = 0
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setRevealed(true))
    })

    return () => {
      cancelAnimationFrame(raf1)
      cancelAnimationFrame(raf2)
    }
  }, [contentKey, active])

  return active && revealed
}
