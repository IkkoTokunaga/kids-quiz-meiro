"use client";

import { Flag } from "lucide-react";
import { STEP_HUES, clampProgress, isStepFilled } from "@/lib/pathTrackStep";

type Props = {
  /** 0〜10。10 はゴール */
  progress: number;
};

export function PathTrack({ progress }: Props) {
  const clamped = clampProgress(progress);
  const remaining = 10 - clamped;

  return (
    <div className="relative w-full px-0.5 pt-1">
      <p className="sr-only">
        いま {clamped} マス すすんでいる。ゴールまで あと {remaining} マス。
      </p>
      <div className="relative flex w-full items-end gap-1">
        <div className="flex min-w-0 flex-1 items-end gap-1">
          {Array.from({ length: 10 }).map((_, i) => {
            const filled = isStepFilled(progress, i);
            const hue = STEP_HUES[i] ?? 160;
            return (
              <div
                key={i}
                className={
                  filled
                    ? "relative flex h-12 min-h-[2.75rem] min-w-0 flex-1 items-center justify-center rounded-xl border-2 shadow-md transition-[background-color,border-color] duration-300"
                    : "relative flex h-12 min-h-[2.75rem] min-w-0 flex-1 items-center justify-center rounded-xl border-2 border-amber-800/35 bg-amber-50/95 shadow-inner transition-[background-color,border-color] duration-300"
                }
                style={
                  filled
                    ? {
                        backgroundColor: `hsl(${hue} 78% 62%)`,
                        borderColor: `hsl(${hue} 55% 38%)`,
                      }
                    : undefined
                }
                aria-hidden
              >
                <span
                  className={
                    filled
                      ? "text-[0.65rem] font-bold tabular-nums text-slate-900/90 sm:text-xs"
                      : "text-[0.65rem] font-bold tabular-nums text-amber-900/45 sm:text-xs"
                  }
                >
                  {i + 1}
                </span>
              </div>
            );
          })}
        </div>
        <div
          className="flex h-12 min-h-[2.75rem] w-[3.25rem] shrink-0 flex-col items-center justify-center rounded-xl border-2 border-emerald-600 bg-emerald-200 shadow-md sm:w-14"
          aria-hidden
        >
          <Flag className="h-5 w-5 text-emerald-800 sm:h-6 sm:w-6" strokeWidth={2.5} />
          <span className="text-[9px] font-bold leading-tight text-emerald-900">ゴール</span>
        </div>
      </div>
    </div>
  );
}
