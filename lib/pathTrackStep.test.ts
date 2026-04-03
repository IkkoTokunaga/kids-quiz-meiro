import { describe, expect, it } from "vitest";
import { STEP_HUES, clampProgress, isStepFilled } from "./pathTrackStep";

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
});
