"use client";

import { Sparkles } from "lucide-react";
import { ConfettiBurst } from "./ConfettiBurst";

type Props = {
  clearedStage: 1 | 2;
  onPlayFromStart: () => void;
  onNextStage: () => void;
};

const overlayByStage: Record<1 | 2, string> = {
  1: "bg-gradient-to-b from-sky-300/95 via-lime-100/95 to-amber-100/95",
  2: "bg-gradient-to-b from-indigo-400/95 via-fuchsia-100/95 to-rose-100/95",
};

export function StageClearScreen({ clearedStage, onPlayFromStart, onNextStage }: Props) {
  const titleId = `stage-clear-title-${clearedStage}`;
  const descId = `stage-clear-desc-${clearedStage}`;

  return (
    <div
      className={`fixed inset-0 z-40 flex flex-col items-center justify-center p-6 text-center ${overlayByStage[clearedStage]}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descId}
    >
      <div className="relative w-full max-w-4xl overflow-hidden rounded-[2rem] border-4 border-white bg-white/95 p-8 shadow-2xl">
        <ConfettiBurst active />
        <div className="relative z-20 flex flex-col items-center">
          <Sparkles className="h-16 w-16 text-amber-500" strokeWidth={2} aria-hidden />
          <h2 id={titleId} className="mt-4 text-3xl font-black text-emerald-700 sm:text-4xl">
            ステージ{clearedStage} クリア！
          </h2>
          <p
            id={descId}
            className="mt-4 text-lg font-semibold text-slate-700"
            aria-live="polite"
          >
            10もん ぜんぶ せいかい！
            <br />
            {clearedStage === 1 ? (
              <>つぎは ちょっと むずかしいよ。チャレンジする？</>
            ) : (
              <>さいごの ステージは ちょうせん！がんばろう！</>
            )}
          </p>
          <div className="mt-10 flex w-full flex-col gap-3 sm:gap-4">
            <button
              type="button"
              className="min-h-[3.25rem] w-full rounded-2xl border-4 border-sky-400 bg-white px-4 py-3 text-lg font-bold text-sky-800 shadow-md active:scale-[0.98] sm:text-xl"
              onClick={onPlayFromStart}
              aria-label="最初から遊ぶ"
            >
              最初から遊ぶ
            </button>
            <button
              type="button"
              className="min-h-[3.25rem] w-full rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-4 py-3 text-lg font-bold text-white shadow-lg active:scale-[0.98] sm:text-xl"
              onClick={onNextStage}
              aria-label="つぎのステージへチャレンジする"
            >
              つぎのステージへチャレンジする
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
