import { describe, expect, it } from "vitest";
import {
  isCorrectAnswer,
  pickRandomQuestions,
  shuffleArrayInPlace,
  shuffleChoices,
} from "./quizLogic";
import type { QuizQuestionRaw } from "./quizTypes";

describe("shuffleChoices", () => {
  it("keeps shuffled label matching displayToOriginal mapping", () => {
    const choices: [string, string, string, string] = ["A", "B", "C", "D"];
    const { shuffledChoices, displayToOriginal } = shuffleChoices(choices, () => 0);
    for (let d = 0; d < 4; d++) {
      expect(shuffledChoices[d]).toBe(choices[displayToOriginal[d]]);
    }
  });

  it("correct when original index matches via displayToOriginal", () => {
    const choices: [string, string, string, string] = ["いち", "に", "さん", "よん"];
    const { displayToOriginal } = shuffleChoices(choices, () => 0.42);
    const correctIndex = 2 as const;
    for (let d = 0; d < 4; d++) {
      const ok = isCorrectAnswer(d as 0 | 1 | 2 | 3, correctIndex, displayToOriginal);
      expect(ok).toBe(displayToOriginal[d as 0 | 1 | 2 | 3] === correctIndex);
    }
  });
});

describe("pickRandomQuestions", () => {
  const pool: QuizQuestionRaw[] = Array.from({ length: 20 }, (_, i) => ({
    question: `q${i}`,
    choices: ["a", "b", "c", "d"] as [string, string, string, string],
    correctIndex: 0,
  }));

  it("returns 10 unique questions when pool is large enough", () => {
    const picked = pickRandomQuestions(pool, 10, () => 0.5);
    expect(picked).toHaveLength(10);
    const texts = new Set(picked.map((p) => p.question));
    expect(texts.size).toBe(10);
  });
});

describe("shuffleArrayInPlace", () => {
  it("permutes in place", () => {
    const arr = [1, 2, 3, 4, 5];
    shuffleArrayInPlace(arr, () => 0.3);
    expect(arr.sort((a, b) => a - b)).toEqual([1, 2, 3, 4, 5]);
  });
});
