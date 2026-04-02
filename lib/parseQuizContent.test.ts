import { describe, expect, it } from "vitest";
import { loadQuizQuestionsFromFile } from "./parseQuizContent";

describe("loadQuizQuestionsFromFile", () => {
  it("loads at least 30 questions from content/manners-quiz.md", () => {
    const q = loadQuizQuestionsFromFile();
    expect(q.length).toBeGreaterThanOrEqual(30);
    for (const item of q) {
      expect(item.choices).toHaveLength(4);
      expect(item.correctIndex).toBeGreaterThanOrEqual(0);
      expect(item.correctIndex).toBeLessThanOrEqual(3);
    }
  });
});
