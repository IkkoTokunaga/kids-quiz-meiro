/** 正解1問あとの進捗（0〜9 がクイズ中、10 でゴール） */
export function advanceAfterCorrect(progress: number): { next: number; goal: boolean } {
  const clamped = Math.min(10, Math.max(0, progress));
  const next = clamped + 1;
  if (next >= 10) return { next: 10, goal: true };
  return { next, goal: false };
}
