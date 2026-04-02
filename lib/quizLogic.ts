import type { QuizQuestionRaw, ShuffledRound } from "./quizTypes";

export function shuffleArrayInPlace<T>(arr: T[], random: () => number = Math.random): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

/** Fisher–Yates で [0,1,2,3] をシャッフルし、表示用の選択肢と対応表を返す */
export function shuffleChoices(
  choices: readonly [string, string, string, string],
  random: () => number = Math.random,
): ShuffledRound {
  const order: [number, number, number, number] = [0, 1, 2, 3];
  shuffleArrayInPlace(order, random);
  const shuffledChoices: [string, string, string, string] = [
    choices[order[0]],
    choices[order[1]],
    choices[order[2]],
    choices[order[3]],
  ];
  return { shuffledChoices, displayToOriginal: order };
}

export function isCorrectAnswer(
  displayedIndex: 0 | 1 | 2 | 3,
  correctIndex: 0 | 1 | 2 | 3,
  displayToOriginal: [number, number, number, number],
): boolean {
  return displayToOriginal[displayedIndex] === correctIndex;
}

export function pickRandomQuestions(
  pool: readonly QuizQuestionRaw[],
  count: number,
  random: () => number = Math.random,
): QuizQuestionRaw[] {
  if (pool.length <= count) {
    const copy = [...pool];
    shuffleArrayInPlace(copy, random);
    return copy;
  }
  const idxs = pool.map((_, i) => i);
  shuffleArrayInPlace(idxs, random);
  return idxs.slice(0, count).map((i) => pool[i]);
}
