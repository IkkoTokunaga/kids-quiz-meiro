"use client";

import { Flag } from "lucide-react";
import {
  STEP_HUES,
  clampProgress,
  filledTrackBackground,
  isStepFilled,
} from "@/lib/pathTrackStep";

type Props = {
  /** 0〜10。10 はゴール */
  progress: number;
};

export function PathTrack({ progress }: Props) {
  const clamped = clampProgress(progress);
  const remaining = 10 - clamped;
  const fillPercent = (clamped / 10) * 100;
  const fillBg = filledTrackBackground(clamped);

  return (
    <div className="relative w-full px-0.5 pt-1">
      <p className="sr-only">
        いま {clamped} マス すすんでいる。ゴールまで あと {remaining} マス。
      </p>

      {/* スマホ：帯状トラック */}
      <div className="flex items-center gap-2 sm:hidden">
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-1.5">
          <div className="relative h-3.5 w-full overflow-hidden rounded-full border-2 border-amber-800/35 bg-amber-50/95 shadow-inner">
            {clamped > 0 && fillBg && (
              <div
                className="h-full max-w-full rounded-full shadow-sm transition-[width] duration-300 ease-out"
                style={{
                  width: `${fillPercent}%`,
                  background: fillBg,
                }}
                aria-hidden
              />
            )}
          </div>
          <p
            className="text-center text-[0.7rem] font-bold tabular-nums text-amber-950/90"
            aria-hidden
          >
            マス {clamped} / 10
          </p>
        </div>
        <div
          className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-full border-2 border-emerald-600 bg-emerald-200 shadow-md"
          title="ゴール"
          aria-hidden
        >
          <Flag className="h-5 w-5 text-emerald-800" strokeWidth={2.5} />
        </div>
      </div>

      {/* タブレット以上：マスブロック */}
      <div className="relative hidden w-full items-end gap-1 sm:flex">
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
                      ? "text-xs font-bold tabular-nums text-slate-900/90"
                      : "text-xs font-bold tabular-nums text-amber-900/45"
                  }
                >
                  {i + 1}
                </span>
              </div>
            );
          })}
        </div>
        <div
          className="flex h-12 min-h-[2.75rem] w-14 shrink-0 flex-col items-center justify-center rounded-xl border-2 border-emerald-600 bg-emerald-200 shadow-md"
          aria-hidden
        >
          <Flag className="h-6 w-6 text-emerald-800" strokeWidth={2.5} />
          <span className="text-[9px] font-bold leading-tight text-emerald-900">ゴール</span>
        </div>
      </div>
    </div>
  );
}
