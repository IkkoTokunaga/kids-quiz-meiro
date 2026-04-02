export type QuizQuestionRaw = {
  question: string;
  choices: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
};

export type ShuffledRound = {
  shuffledChoices: [string, string, string, string];
  /** displayIndex → original choice index */
  displayToOriginal: [number, number, number, number];
};
