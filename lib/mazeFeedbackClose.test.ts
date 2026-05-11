import { describe, expect, it } from "vitest";
import { planMazeFeedbackClose } from "./mazeFeedbackClose";

describe("planMazeFeedbackClose", () => {
  it("clears wrong overlay without advancing", () => {
    expect(planMazeFeedbackClose("wrong", 0)).toEqual({ action: "clearWrongOverlay" });
    expect(planMazeFeedbackClose("wrong", 9)).toEqual({ action: "clearWrongOverlay" });
  });

  it("noops when overlay is already cleared", () => {
    expect(planMazeFeedbackClose(null, 3)).toEqual({ action: "noop" });
  });

  it("advances after correct before goal", () => {
    expect(planMazeFeedbackClose("correct", 0)).toEqual({
      action: "advanceFromCorrect",
      next: 1,
      goal: false,
    });
    expect(planMazeFeedbackClose("correct", 8)).toEqual({
      action: "advanceFromCorrect",
      next: 9,
      goal: false,
    });
  });

  it("marks goal after last correct", () => {
    expect(planMazeFeedbackClose("correct", 9)).toEqual({
      action: "advanceFromCorrect",
      next: 10,
      goal: true,
    });
  });
});
