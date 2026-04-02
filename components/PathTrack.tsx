"use client";

import { Flag } from "lucide-react";

type Props = {
  /** 0〜10。10 はゴール */
  progress: number;
};

export function PathTrack({ progress }: Props) {
  const clamped = Math.min(10, Math.max(0, progress));
  const remaining = 10 - clamped;

  return (
    <div className="relative w-full px-0.5 pt-14">
      <p className="sr-only">
        いま {clamped} マス すすんでいる。ゴールまで あと {remaining} マス。
      </p>
      <div className="relative flex w-full items-end gap-1">
        <div className="flex min-w-0 flex-1 items-end gap-1">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="relative flex h-12 min-h-[2.75rem] min-w-0 flex-1 items-center justify-center rounded-xl border-2 border-amber-800/35 bg-amber-50/95 shadow-inner"
              aria-hidden
            >
              <span className="text-[0.65rem] font-bold tabular-nums text-amber-900/45 sm:text-xs">
                {i + 1}
              </span>
            </div>
          ))}
        </div>
        <div
          className="flex h-12 min-h-[2.75rem] w-[3.25rem] shrink-0 flex-col items-center justify-center rounded-xl border-2 border-emerald-600 bg-emerald-200 shadow-md sm:w-14"
          aria-hidden
        >
          <Flag className="h-5 w-5 text-emerald-800 sm:h-6 sm:w-6" strokeWidth={2.5} />
          <span className="text-[9px] font-bold leading-tight text-emerald-900">ゴール</span>
        </div>

        <div
          className="pointer-events-none absolute bottom-[3.25rem] left-0 right-0 h-12"
          aria-hidden
        >
          <div
            className="absolute bottom-0 h-11 w-11 -translate-x-1/2 transition-[left] duration-500 ease-out"
            style={{
              left:
                clamped === 0
                  ? "6%"
                  : `calc(6% + (100% - 12% - 3.25rem) * ${clamped / 10})`,
            }}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full border-4 border-white bg-sky-400 text-xl shadow-lg ring-2 ring-sky-600 sm:text-2xl">
              🧒
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
