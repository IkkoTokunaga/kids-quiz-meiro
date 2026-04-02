import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { QuizQuestionRaw } from "./quizTypes";

type Frontmatter = { questions: unknown };

function isQuestion(x: unknown): x is QuizQuestionRaw {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  if (typeof o.question !== "string" || !Array.isArray(o.choices) || o.choices.length !== 4)
    return false;
  if (!o.choices.every((c) => typeof c === "string")) return false;
  const ci = o.correctIndex;
  return ci === 0 || ci === 1 || ci === 2 || ci === 3;
}

export function loadQuizQuestionsFromFile(): QuizQuestionRaw[] {
  const full = path.join(process.cwd(), "content", "manners-quiz.md");
  const raw = fs.readFileSync(full, "utf8");
  const { data } = matter(raw) as unknown as { data: Frontmatter };
  const list = data.questions;
  if (!Array.isArray(list) || list.length < 10) {
    throw new Error("manners-quiz.md: need at least 10 questions");
  }
  const questions: QuizQuestionRaw[] = [];
  for (const item of list) {
    if (!isQuestion(item)) {
      throw new Error("manners-quiz.md: invalid question entry");
    }
    questions.push({
      question: item.question,
      choices: [
        item.choices[0],
        item.choices[1],
        item.choices[2],
        item.choices[3],
      ] as [string, string, string, string],
      correctIndex: item.correctIndex,
    });
  }
  return questions;
}
