import { describe, expect, it } from "vitest";
import { advanceAfterCorrect } from "./quizSessionProgress";

describe("advanceAfterCorrect", () => {
  it("increments within quiz", () => {
    expect(advanceAfterCorrect(0)).toEqual({ next: 1, goal: false });
    expect(advanceAfterCorrect(5)).toEqual({ next: 6, goal: false });
    expect(advanceAfterCorrect(8)).toEqual({ next: 9, goal: false });
  });

  it("last question reaches goal", () => {
    expect(advanceAfterCorrect(9)).toEqual({ next: 10, goal: true });
  });

  it("clamps high progress", () => {
    expect(advanceAfterCorrect(99)).toEqual({ next: 10, goal: true });
  });
});
