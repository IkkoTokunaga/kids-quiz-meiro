import fs from "fs";
import path from "path";
import type { QuizQuestionRaw } from "./quizTypes";

export type QuizBundle = {
  quizTitle: string;
  targetAge?: string;
  questions: QuizQuestionRaw[];
};

type JsonOption = { text: string; rationale?: string; isCorrect: boolean };

type JsonQuestion = {
  questionNumber?: number;
  question: string;
  answerOptions: JsonOption[];
  hint?: string;
};

type QuizJsonRoot = {
  quizTitle?: string;
  targetAge?: string;
  questions: JsonQuestion[];
};

function isJsonOption(x: unknown): x is JsonOption {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return typeof o.text === "string" && typeof o.isCorrect === "boolean";
}

function isJsonQuestion(x: unknown): x is JsonQuestion {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  if (typeof o.question !== "string" || !Array.isArray(o.answerOptions)) return false;
  if (o.answerOptions.length !== 4 || !o.answerOptions.every(isJsonOption)) return false;
  const correctCount = o.answerOptions.filter((opt: JsonOption) => opt.isCorrect).length;
  if (correctCount !== 1) return false;
  if (o.hint !== undefined && typeof o.hint !== "string") return false;
  return true;
}

function parseQuizJson(raw: string): QuizBundle {
  let root: unknown;
  try {
    root = JSON.parse(raw) as unknown;
  } catch {
    throw new Error("quiz.json: invalid JSON");
  }
  if (!root || typeof root !== "object") {
    throw new Error("quiz.json: root must be an object");
  }
  const r = root as QuizJsonRoot;
  if (typeof r.quizTitle !== "string" || !r.quizTitle.trim()) {
    throw new Error("quiz.json: quizTitle is required");
  }
  if (!Array.isArray(r.questions) || r.questions.length < 10) {
    throw new Error("quiz.json: need at least 10 questions");
  }
  const questions: QuizQuestionRaw[] = [];
  for (let i = 0; i < r.questions.length; i++) {
    const item = r.questions[i];
    if (!isJsonQuestion(item)) {
      throw new Error(`quiz.json: invalid question at index ${i}`);
    }
    const correctIdx = item.answerOptions.findIndex((opt) => opt.isCorrect);
    if (correctIdx < 0 || correctIdx > 3) {
      throw new Error(`quiz.json: question at index ${i} has no valid correct option`);
    }
    questions.push({
      question: item.question,
      choices: [
        item.answerOptions[0].text,
        item.answerOptions[1].text,
        item.answerOptions[2].text,
        item.answerOptions[3].text,
      ] as [string, string, string, string],
      correctIndex: correctIdx as 0 | 1 | 2 | 3,
      ...(item.hint !== undefined && item.hint !== "" ? { hint: item.hint } : {}),
    });
  }
  return {
    quizTitle: r.quizTitle.trim(),
    ...(typeof r.targetAge === "string" ? { targetAge: r.targetAge } : {}),
    questions,
  };
}

export function loadQuizBundleFromFile(): QuizBundle {
  const full = path.join(process.cwd(), "quiz.json");
  const raw = fs.readFileSync(full, "utf8");
  return parseQuizJson(raw);
}

export function loadQuizQuestionsFromFile(): QuizQuestionRaw[] {
  return loadQuizBundleFromFile().questions;
}
