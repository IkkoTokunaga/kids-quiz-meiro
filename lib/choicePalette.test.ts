import { describe, expect, it } from "vitest";
import { CHOICE_PALETTE } from "./choicePalette";

describe("CHOICE_PALETTE", () => {
  it("has four slots with distinct aria hints", () => {
    expect(CHOICE_PALETTE).toHaveLength(4);
    const chunks = CHOICE_PALETTE.map((p) => p.ariaChunk);
    expect(new Set(chunks).size).toBe(4);
  });
});
