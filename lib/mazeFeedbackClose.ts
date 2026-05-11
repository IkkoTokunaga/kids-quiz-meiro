import { advanceAfterCorrect } from "./quizSessionProgress";

export type FeedbackWhileOverlay = "correct" | "wrong" | null;

export type MazeFeedbackClosePlan =
  | { action: "noop" }
  | { action: "clearWrongOverlay" }
  | { action: "advanceFromCorrect"; next: number; goal: boolean };

/** フィードバックオーバーレイを閉じるときの次の一手（正解は進捗更新、不正解はオーバーレイだけ閉じる） */
export function planMazeFeedbackClose(
  feedback: FeedbackWhileOverlay,
  progress: number,
): MazeFeedbackClosePlan {
  if (feedback === "wrong") return { action: "clearWrongOverlay" };
  if (feedback !== "correct") return { action: "noop" };
  return { action: "advanceFromCorrect", ...advanceAfterCorrect(progress) };
}
