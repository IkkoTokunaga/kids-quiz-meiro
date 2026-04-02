"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Map } from "lucide-react";
import type { QuizQuestionRaw, ShuffledRound } from "@/lib/quizTypes";
import { isCorrectAnswer, pickRandomQuestions, shuffleChoices } from "@/lib/quizLogic";
import { playCorrectChime, playWrongBuzz } from "@/lib/playFeedbackSounds";
import { useChoiceTapGuard } from "@/lib/useChoiceTapGuard";
import { PathTrack } from "./PathTrack";
import { FeedbackOverlay } from "./FeedbackOverlay";
import { GoalScreen } from "./GoalScreen";

type Props = {
  pool: QuizQuestionRaw[];
};

export default function MannersMazeGame({ pool }: Props) {
  const [phase, setPhase] = useState<"quiz" | "goal">("quiz");
  const [questions, setQuestions] = useState<QuizQuestionRaw[]>(() => pickRandomQuestions(pool, 10));
  const [qIndex, setQIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [round, setRound] = useState<ShuffledRound | null>(null);
  const [feedback, setFeedback] = useState<null | "correct" | "wrong">(null);

  const current = questions[qIndex];

  useEffect(() => {
    if (phase !== "quiz" || !current) return;
    setRound(shuffleChoices(current.choices));
  }, [phase, qIndex, current]);

  const startNewPlay = useCallback(() => {
    setQuestions(pickRandomQuestions(pool, 10));
    setQIndex(0);
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
    setFeedback((prev) => {
      if (prev === "correct") {
        setProgress((p) => {
          const next = p + 1;
          if (next >= 10) setPhase("goal");
          else setQIndex((i) => i + 1);
          return next;
        });
      }
      return null;
    });
  }, []);

  const questionNum = qIndex + 1;
  const overlayOpen = feedback !== null;

  const labels = useMemo(() => ["いち", "に", "さん", "よん"] as const, []);

  if (phase === "goal") {
    return <GoalScreen onReplay={startNewPlay} />;
  }

  if (!current || !round) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center text-lg font-bold text-white">
        よみこみちゅう…
      </div>
    );
  }

  return (
    <div className="relative flex min-h-[100dvh] flex-col px-3 pb-6 pt-4 sm:px-4">
      <header className="mb-3 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/25 px-4 py-2 shadow-sm backdrop-blur-sm">
          <Map className="h-7 w-7 text-amber-900" aria-hidden />
          <h1 className="text-xl font-black tracking-wide text-amber-950 sm:text-2xl">
            せいかつマナー めいろ
          </h1>
        </div>
        <p className="mt-2 text-sm font-semibold text-white/90">まちがえたら もういちど。10ます ゴールを めざそう！</p>
      </header>

      <section aria-label="すすみかた" className="mb-4 rounded-2xl bg-white/30 p-2 shadow-inner backdrop-blur-sm">
        <PathTrack progress={progress} />
      </section>

      <section
        aria-label="もんだい"
        className="flex flex-1 flex-col rounded-3xl border-4 border-white/80 bg-white/95 p-4 shadow-xl sm:p-5"
      >
        <p className="text-center text-sm font-bold text-sky-700">
          もんだい {questionNum} / 10
        </p>
        <h2 className="mt-3 min-h-[3.5rem] text-center text-lg font-extrabold leading-snug text-slate-800 sm:text-xl">
          {current.question}
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:gap-3.5">
          {round.shuffledChoices.map((text, i) => {
            const di = i as 0 | 1 | 2 | 3;
            const label = labels[i];
            return (
              <button
                key={`${qIndex}-${i}-${text}`}
                type="button"
                disabled={overlayOpen}
                className="min-h-[3.25rem] w-full rounded-2xl border-4 border-sky-200 bg-gradient-to-b from-sky-50 to-sky-100 px-3 py-3 text-left text-base font-bold text-slate-800 shadow-md transition active:scale-[0.99] disabled:opacity-50 sm:min-h-[3.5rem] sm:text-lg"
                aria-label={`せんたくし ${label}。${text}`}
                onTouchEnd={(e) => onTouchEnd(e, di)}
                onClick={() => onClick(di)}
              >
                <span className="mr-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-sky-500 text-sm text-white">
                  {i + 1}
                </span>
                {text}
              </button>
            );
          })}
        </div>
      </section>

      <FeedbackOverlay
        open={overlayOpen}
        variant={feedback === "wrong" ? "wrong" : "correct"}
        onClose={closeFeedback}
      />
    </div>
  );
}
