import { describe, expect, it } from "vitest";
import {
  STEP_HUES,
  clampProgress,
  filledTrackBackground,
  isStepFilled,
} from "./pathTrackStep";

describe("pathTrackStep", () => {
  it("has 10 step hues", () => {
    expect(STEP_HUES).toHaveLength(10);
  });

  it("clamps progress to 0..10", () => {
    expect(clampProgress(-1)).toBe(0);
    expect(clampProgress(0)).toBe(0);
    expect(clampProgress(5)).toBe(5);
    expect(clampProgress(10)).toBe(10);
    expect(clampProgress(99)).toBe(10);
  });

  it("fills steps in order as progress increases", () => {
    expect(isStepFilled(0, 0)).toBe(false);
    expect(isStepFilled(1, 0)).toBe(true);
    expect(isStepFilled(1, 1)).toBe(false);
    expect(isStepFilled(10, 9)).toBe(true);
    expect(isStepFilled(10, 10)).toBe(false);
  });

  describe("filledTrackBackground", () => {
    it("returns null for 0マス", () => {
      expect(filledTrackBackground(0)).toBeNull();
      expect(filledTrackBackground(-3)).toBeNull();
    });

    it("returns solid hsl for 1マス", () => {
      expect(filledTrackBackground(1)).toBe(`hsl(${STEP_HUES[0]} 78% 62%)`);
    });

    it("returns gradient spanning filled hues", () => {
      const g = filledTrackBackground(3);
      expect(g).toContain("linear-gradient(to right");
      expect(g).toContain(`hsl(${STEP_HUES[0]} 78% 62%) 0%`);
      expect(g).toContain(`hsl(${STEP_HUES[2]} 78% 62%) 100%`);
    });

    it("clamps beyond 10 to full track", () => {
      const g = filledTrackBackground(99);
      expect(g).toContain(`hsl(${STEP_HUES[9]} 78% 62%) 100%`);
    });
  });
});
