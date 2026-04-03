"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Map } from "lucide-react";
import type { QuizQuestionRaw, ShuffledRound } from "@/lib/quizTypes";
import { CHOICE_PALETTE } from "@/lib/choicePalette";
import { isCorrectAnswer, pickRandomQuestions, shuffleChoices } from "@/lib/quizLogic";
import { advanceAfterCorrect } from "@/lib/quizSessionProgress";
import { playCorrectChime, playWrongBuzz } from "@/lib/playFeedbackSounds";
import { useChoiceTapGuard } from "@/lib/useChoiceTapGuard";
import { PathTrack } from "./PathTrack";
import { FeedbackOverlay } from "./FeedbackOverlay";
import { GoalScreen } from "./GoalScreen";

type Props = {
  pool: QuizQuestionRaw[];
  quizTitle: string;
};

export default function MannersMazeGame({ pool, quizTitle }: Props) {
  const [phase, setPhase] = useState<"quiz" | "goal">("quiz");
  const [questions, setQuestions] = useState<QuizQuestionRaw[]>(() => pickRandomQuestions(pool, 10));
  const [progress, setProgress] = useState(0);
  const [round, setRound] = useState<ShuffledRound | null>(null);
  const [feedback, setFeedback] = useState<null | "correct" | "wrong">(null);
  /** オーバーレイの種類・進捗はイベント内で最新値を読む（Strict Mode の updater 二重実行と無関係にする） */
  const feedbackRef = useRef<null | "correct" | "wrong">(null);
  const progressRef = useRef(0);
  feedbackRef.current = feedback;
  progressRef.current = progress;

  const current = progress < 10 ? questions[progress] : undefined;

  useEffect(() => {
    if (phase !== "quiz" || !current) return;
    setRound(shuffleChoices(current.choices));
  }, [phase, progress, current]);

  const startNewPlay = useCallback(() => {
    setQuestions(pickRandomQuestions(pool, 10));
    setProgress(0);
    setPhase("quiz");
    setFeedback(null);
    setRound(null);
  }, [pool]);

  const handlePick = useCallback(
    (displayIndex: 0 | 1 | 2 | 3) => {
      if (feedback !== null || phase !== "quiz" || !current || !round) return;
      const ok = isCorrectAnswer(displayIndex, current.correctIndex, round.displayToOriginal);
      if (ok) {
        playCorrectChime();
        setFeedback("correct");
      } else {
        playWrongBuzz();
        setFeedback("wrong");
      }
    },
    [feedback, phase, current, round],
  );

  const { onTouchEnd, onClick } = useChoiceTapGuard(handlePick);

  const closeFeedback = useCallback(() => {
    const wasCorrect = feedbackRef.current === "correct";
    setFeedback(null);
    if (!wasCorrect) return;
    const { next, goal } = advanceAfterCorrect(progressRef.current);
    if (goal) setPhase("goal");
    setProgress(next);
  }, []);

  /** いま解いているもんだい番号（1〜10）。進捗バーと常に一致 */
  const questionNum = progress + 1;
  const overlayOpen = feedback !== null;

  if (phase === "goal") {
    return <GoalScreen onReplay={startNewPlay} />;
  }

  if (!current || !round) {
    return (
      <div className="mx-auto flex min-h-[100dvh] w-full max-w-4xl items-center justify-center px-3 text-lg font-bold text-white sm:px-4">
        よみこみちゅう…
      </div>
    );
  }

  return (
    <div className="relative mx-auto flex min-h-[100dvh] w-full max-w-4xl flex-col px-3 pb-[calc(1.75rem+env(safe-area-inset-bottom,0px))] pt-4 sm:px-4 sm:pb-6">
      <header className="mb-3 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/25 px-4 py-2 shadow-sm backdrop-blur-sm">
          <Map className="h-7 w-7 text-amber-900" aria-hidden />
          <h1 className="text-xl font-black tracking-wide text-amber-950 sm:text-2xl">
            {quizTitle}
          </h1>
        </div>
        <p className="mt-2 text-sm font-semibold text-white/90">まちがえたら もういちど。10ます ゴールを めざそう！</p>
      </header>

      <section aria-label="すすみかた" className="mb-4 rounded-2xl bg-white/30 p-2 shadow-inner backdrop-blur-sm">
        <PathTrack progress={progress} />
      </section>

      <section
        aria-label="もんだい"
        className="flex min-h-0 flex-col rounded-3xl border-4 border-white/80 bg-white/95 p-3 pb-4 shadow-xl max-sm:mb-1 sm:flex-1 sm:p-5 sm:pb-5"
      >
        <p className="text-center text-sm font-bold text-sky-700">
          もんだい {questionNum} / 10
        </p>
        <h2 className="mt-2 min-h-[2.75rem] text-center text-lg font-extrabold leading-snug text-slate-800 sm:mt-3 sm:min-h-[3.5rem] sm:text-xl">
          {current.question}
        </h2>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:mt-6 sm:grid-cols-2 sm:gap-4 md:gap-5">
          {round.shuffledChoices.map((text, i) => {
            const di = i as 0 | 1 | 2 | 3;
            const pal = CHOICE_PALETTE[i];
            return (
              <button
                key={`${progress}-${i}-${text}`}
                type="button"
                disabled={overlayOpen}
                className={`flex w-full min-h-[5.5rem] items-center justify-center rounded-3xl border-4 px-3 py-4 text-center text-base font-extrabold leading-snug transition active:scale-[0.99] disabled:opacity-50 sm:min-h-[7.5rem] sm:px-5 sm:py-6 sm:text-xl ${pal.btn}`}
                aria-label={`${pal.ariaChunk}。${text}`}
                onTouchEnd={(e) => onTouchEnd(e, di)}
                onClick={() => onClick(di)}
              >
                {text}
              </button>
            );
          })}
        </div>
      </section>

      <FeedbackOverlay
        open={overlayOpen}
        variant={feedback === "wrong" ? "wrong" : "correct"}
        wrongHint={feedback === "wrong" ? current.hint : undefined}
        onClose={closeFeedback}
      />
    </div>
  );
}
