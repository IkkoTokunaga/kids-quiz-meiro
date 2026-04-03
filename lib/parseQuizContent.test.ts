import { describe, expect, it } from "vitest";
import {
  loadQuizBundleFromFile,
  loadQuizBundleFromPath,
  loadQuizQuestionsFromFile,
} from "./parseQuizContent";

describe("loadQuizBundleFromFile", () => {
  it("loads quiz.json with title and 50 questions", () => {
    const bundle = loadQuizBundleFromFile();
    expect(bundle.quizTitle).toBeTruthy();
    expect(bundle.questions).toHaveLength(50);
    for (const item of bundle.questions) {
      expect(item.choices).toHaveLength(4);
      expect(item.correctIndex).toBeGreaterThanOrEqual(0);
      expect(item.correctIndex).toBeLessThanOrEqual(3);
      expect(item.hint).toBeTruthy();
    }
  });
});

describe("loadQuizBundleFromPath", () => {
  it("loads quiz-2.json with title and 50 questions", () => {
    const bundle = loadQuizBundleFromPath("quiz-2.json");
    expect(bundle.quizTitle).toBeTruthy();
    expect(bundle.questions).toHaveLength(50);
    for (const item of bundle.questions) {
      expect(item.choices).toHaveLength(4);
      expect(item.correctIndex).toBeGreaterThanOrEqual(0);
      expect(item.correctIndex).toBeLessThanOrEqual(3);
      expect(item.hint).toBeTruthy();
    }
  });
});

describe("loadQuizQuestionsFromFile", () => {
  it("returns the same questions array length as bundle", () => {
    const bundle = loadQuizBundleFromFile();
    const q = loadQuizQuestionsFromFile();
    expect(q).toHaveLength(bundle.questions.length);
  });
});
