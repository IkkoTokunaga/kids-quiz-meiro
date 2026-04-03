/** 1問ごとに進むにつれ色相が変わる（10マスで区別しやすく） */
export const STEP_HUES = [200, 188, 176, 164, 152, 140, 128, 116, 104, 92] as const;

export function clampProgress(progress: number): number {
  return Math.min(10, Math.max(0, progress));
}

/** stepIndex は 0〜9。正解1問でマス1が埋まる → progress 1 のとき index 0 が true */
export function isStepFilled(progress: number, stepIndex: number): boolean {
  return clampProgress(progress) > stepIndex;
}

/** 帯状トラックの塗り幅用。0 マスは null（未塗装） */
export function filledTrackBackground(clampedProgress: number): string | null {
  const n = clampProgress(clampedProgress);
  if (n <= 0) return null;
  if (n === 1) {
    const h = STEP_HUES[0];
    return `hsl(${h} 78% 62%)`;
  }
  const parts = STEP_HUES.slice(0, n).map((hue, i) => {
    const p = (i / (n - 1)) * 100;
    return `hsl(${hue} 78% 62%) ${p}%`;
  });
  return `linear-gradient(to right, ${parts.join(", ")})`;
}
