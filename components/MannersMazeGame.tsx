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
import { StageClearScreen } from "./StageClearScreen";

type StageBundle = {
  pool: QuizQuestionRaw[];
  quizTitle: string;
};

type Props = {
  stage1: StageBundle;
  stage2: StageBundle;
  stage3: StageBundle;
};

type PlayStage = 1 | 2 | 3;

function stageVisuals(playStage: PlayStage) {
  if (playStage === 1) {
    return {
      outerBg: "bg-gradient-to-b from-sky-400 via-sky-200 to-lime-200",
      cloudClass: "bg-white/70",
      cloudClass2: "bg-white/60",
      groundStripClass: "bg-gradient-to-t from-lime-400/80 to-transparent",
    };
  }
  if (playStage === 2) {
    return {
      outerBg: "bg-gradient-to-b from-indigo-500 via-violet-200 to-rose-200",
      cloudClass: "bg-white/50",
      cloudClass2: "bg-white/45",
      groundStripClass: "bg-gradient-to-t from-fuchsia-600/75 to-transparent",
    };
  }
  return {
    outerBg: "bg-gradient-to-b from-teal-600 via-cyan-200 to-emerald-100",
    cloudClass: "bg-white/45",
    cloudClass2: "bg-white/40",
    groundStripClass: "bg-gradient-to-t from-emerald-700/70 to-transparent",
  };
}

export default function MannersMazeGame({ stage1, stage2, stage3 }: Props) {
  const [playStage, setPlayStage] = useState<PlayStage>(1);
  const [phase, setPhase] = useState<"quiz" | "stage1Complete" | "stage2Complete" | "goal">("quiz");
  const [questions, setQuestions] = useState<QuizQuestionRaw[]>(() =>
    pickRandomQuestions(stage1.pool, 10),
  );
  const [progress, setProgress] = useState(0);
  const [round, setRound] = useState<ShuffledRound | null>(null);
  const [feedback, setFeedback] = useState<null | "correct" | "wrong">(null);
  /** オーバーレイの種類・進捗はイベント内で最新値を読む（Strict Mode の updater 二重実行と無関係にする） */
  const feedbackRef = useRef<null | "correct" | "wrong">(null);
  const progressRef = useRef(0);
  const playStageRef = useRef<PlayStage>(1);
  feedbackRef.current = feedback;
  progressRef.current = progress;
  playStageRef.current = playStage;

  const activeBundle =
    playStage === 1 ? stage1 : playStage === 2 ? stage2 : stage3;
  const quizTitle = activeBundle.quizTitle;

  const current = progress < 10 ? questions[progress] : undefined;

  useEffect(() => {
    if (phase !== "quiz" || !current) return;
    setRound(shuffleChoices(current.choices));
  }, [phase, progress, current]);

  const startFromStage1 = useCallback(() => {
    setQuestions(pickRandomQuestions(stage1.pool, 10));
    setProgress(0);
    setPlayStage(1);
    setPhase("quiz");
    setFeedback(null);
    setRound(null);
  }, [stage1.pool]);

  const goToStage2 = useCallback(() => {
    setQuestions(pickRandomQuestions(stage2.pool, 10));
    setProgress(0);
    setPlayStage(2);
    setPhase("quiz");
    setFeedback(null);
    setRound(null);
  }, [stage2.pool]);

  const goToStage3 = useCallback(() => {
    setQuestions(pickRandomQuestions(stage3.pool, 10));
    setProgress(0);
    setPlayStage(3);
    setPhase("quiz");
    setFeedback(null);
    setRound(null);
  }, [stage3.pool]);

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
    if (goal) {
      const s = playStageRef.current;
      if (s === 1) setPhase("stage1Complete");
      else if (s === 2) setPhase("stage2Complete");
      else setPhase("goal");
    }
    setProgress(next);
  }, []);

  /** いま解いているもんだい番号（1〜10）。進捗バーと常に一致 */
  const questionNum = progress + 1;
  const overlayOpen = feedback !== null;

  const { outerBg, cloudClass, cloudClass2, groundStripClass } = stageVisuals(playStage);

  if (phase === "stage1Complete") {
    return (
      <div className={`relative min-h-[100dvh] overflow-x-clip ${outerBg}`}>
        <StageClearScreen clearedStage={1} onPlayFromStart={startFromStage1} onNextStage={goToStage2} />
      </div>
    );
  }

  if (phase === "stage2Complete") {
    return (
      <div className={`relative min-h-[100dvh] overflow-x-clip ${outerBg}`}>
        <StageClearScreen clearedStage={2} onPlayFromStart={startFromStage1} onNextStage={goToStage3} />
      </div>
    );
  }

  if (phase === "goal") {
    return (
      <div className={`relative min-h-[100dvh] overflow-x-clip ${outerBg}`}>
        <GoalScreen onReplay={startFromStage1} />
      </div>
    );
  }

  if (!current || !round) {
    return (
      <div
        className={`relative mx-auto flex min-h-[100dvh] w-full max-w-4xl items-center justify-center overflow-x-clip px-3 text-lg font-bold text-white sm:px-4 ${outerBg}`}
      >
        よみこみちゅう…
      </div>
    );
  }

  const tagline =
    playStage === 1
      ? "まちがえたら もういちど。10ます ゴールを めざそう！"
      : playStage === 2
        ? "ちょっと レベルアップ！まちがえたら もういちど。10ます ゴールを めざそう！"
        : "ちょうせん ステージ！まちがえたら もういちど。10ます ゴールを めざそう！";

  return (
    <div className={`relative min-h-[100dvh] overflow-x-clip ${outerBg}`}>
      <div
        className={`pointer-events-none absolute left-[6%] top-10 h-14 w-24 rounded-full ${cloudClass} blur-[1px] animate-cloud-drift`}
        aria-hidden
      />
      <div
        className={`pointer-events-none absolute right-[10%] top-24 h-10 w-20 ${cloudClass2} animate-cloud-drift`}
        style={{ animationDelay: "1.5s" }}
        aria-hidden
      />
      <div
        className={`pointer-events-none absolute bottom-0 left-0 right-0 h-24 ${groundStripClass}`}
        aria-hidden
      />

      <div className="relative mx-auto flex min-h-[100dvh] w-full max-w-4xl flex-col px-3 pb-[calc(1.75rem+env(safe-area-inset-bottom,0px))] pt-4 sm:px-4 sm:pb-6">
        <header className="mb-3 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/25 px-4 py-2 shadow-sm backdrop-blur-sm">
            <Map className="h-7 w-7 text-amber-900" aria-hidden />
            <h1 className="text-xl font-black tracking-wide text-amber-950 sm:text-2xl">{quizTitle}</h1>
          </div>
          <p className="mt-2 text-sm font-semibold text-white/90">{tagline}</p>
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
    </div>
  );
}
