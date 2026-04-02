"use client";

import { PartyPopper } from "lucide-react";
import { ConfettiBurst } from "./ConfettiBurst";

type Props = {
  onReplay: () => void;
};

export function GoalScreen({ onReplay }: Props) {
  return (
    <div
      className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-gradient-to-b from-sky-300/95 via-lime-100/95 to-amber-100/95 p-6 text-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="goal-title"
      aria-describedby="goal-desc"
    >
      <div className="relative w-full max-w-4xl overflow-hidden rounded-[2rem] border-4 border-white bg-white/95 p-8 shadow-2xl">
        <ConfettiBurst active />
        <div className="relative z-20 flex flex-col items-center">
          <PartyPopper className="h-16 w-16 text-amber-500" strokeWidth={2} aria-hidden />
          <h2 id="goal-title" className="mt-4 text-3xl font-black text-emerald-700 sm:text-4xl">
            ゴール！
          </h2>
          <p
            id="goal-desc"
            className="mt-4 text-lg font-semibold text-slate-700"
            aria-live="polite"
          >
            10もん ぜんぶ せいかい！
            <br />
            とっても えらいね！
          </p>
          <button
            type="button"
            className="mt-10 min-h-[3.25rem] w-full rounded-2xl bg-gradient-to-r from-pink-500 to-orange-400 px-4 py-3 text-lg font-bold text-white shadow-lg active:scale-[0.98] sm:text-xl"
            onClick={onReplay}
            aria-label="もういちど あそぶ"
          >
            もういちど あそぶ
          </button>
        </div>
      </div>
    </div>
  );
}
