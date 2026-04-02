import { useCallback, useRef } from "react";

/**
 * タッチ後に続く click の二重発火を無視する。
 * タッチ端末: touchend のみ処理。マウス: click のみ処理。
 */
export function useChoiceTapGuard(onPick: (displayIndex: 0 | 1 | 2 | 3) => void) {
  const ignoreClickUntil = useRef(0);
  const lastTouchTs = useRef(0);

  const onTouchEnd = useCallback(
    (e: React.TouchEvent, displayIndex: 0 | 1 | 2 | 3) => {
      e.preventDefault();
      const now = Date.now();
      lastTouchTs.current = now;
      ignoreClickUntil.current = now + 500;
      onPick(displayIndex);
    },
    [onPick],
  );

  const onClick = useCallback(
    (displayIndex: 0 | 1 | 2 | 3) => {
      const now = Date.now();
      if (now < ignoreClickUntil.current) return;
      if (now - lastTouchTs.current < 400) return;
      onPick(displayIndex);
    },
    [onPick],
  );

  return { onTouchEnd, onClick };
}
