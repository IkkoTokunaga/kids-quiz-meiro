"use client";

import { ConfettiBurst } from "./ConfettiBurst";

type Props = {
  open: boolean;
  variant: "correct" | "wrong";
  onClose: () => void;
};

export function FeedbackOverlay({ open, variant, onClose }: Props) {
  if (!open) return null;

  const title = variant === "correct" ? "せいかい！" : "ざんねん！もういちど";
  const desc =
    variant === "correct"
      ? "つぎの ますに すすんだよ"
      : "ちがうよ。もういちど えらんでみてね";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="feedback-title"
      aria-describedby="feedback-desc"
    >
      <div
        className="relative w-full max-w-4xl overflow-hidden rounded-3xl border-4 border-white bg-white p-6 text-center shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <ConfettiBurst active={variant === "correct"} />
        <div aria-live="assertive" className="relative z-20">
          <h2 id="feedback-title" className="text-2xl font-black text-slate-800 sm:text-3xl">
            {title}
          </h2>
          <p id="feedback-desc" className="mt-3 text-base font-medium text-slate-600">
            {desc}
          </p>
        </div>
        <button
          type="button"
          className="relative z-20 mt-8 min-h-[3rem] w-full rounded-2xl bg-sky-500 px-4 py-3 text-lg font-bold text-white shadow-md active:scale-[0.98] sm:min-h-[3.25rem]"
          onClick={onClose}
          aria-label="とじる"
        >
          とじる
        </button>
      </div>
    </div>
  );
}
