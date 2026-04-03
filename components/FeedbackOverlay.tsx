"use client";

import { FullScreenConfetti } from "./FullScreenConfetti";

type Props = {
  open: boolean;
  variant: "correct" | "wrong";
  /** 不正解のときだけ表示（1回まちがえたあとのヒント） */
  wrongHint?: string;
  onClose: () => void;
};

export function FeedbackOverlay({ open, variant, wrongHint, onClose }: Props) {
  if (!open) return null;

  const isCorrect = variant === "correct";
  const title = isCorrect ? "せいかい！" : "ざんねん！もういちど";
  const desc = isCorrect
    ? "つぎの ますに すすんだよ"
    : "ちがうよ。もういちど えらんでみてね";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden p-3 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="feedback-title"
      aria-describedby={wrongHint && variant === "wrong" ? "feedback-desc feedback-hint" : "feedback-desc"}
    >
      {isCorrect ? (
        <>
          <div className="absolute inset-0 feedback-correct-backdrop" aria-hidden />
          <div className="feedback-rays-layer opacity-70" aria-hidden />
          <div
            className="absolute inset-0 animate-pulse bg-[radial-gradient(ellipse_80%_60%_at_50%_38%,rgba(255,255,255,0.55)_0%,transparent_55%)] mix-blend-overlay"
            aria-hidden
          />
          <div
            className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,200,255,0.35)_0%,transparent_40%),radial-gradient(circle_at_70%_25%,rgba(255,255,150,0.4)_0%,transparent_35%)]"
            aria-hidden
          />
          <FullScreenConfetti />
          <div
            className="pointer-events-none absolute inset-0 z-[56] flex items-start justify-center pt-[12vh]"
            aria-hidden
          >
            <span className="animate-feedback-star-twinkle text-5xl drop-shadow-lg sm:text-7xl">✨</span>
            <span
              className="animate-feedback-star-twinkle ml-4 text-4xl drop-shadow-md sm:ml-8 sm:text-6xl"
              style={{ animationDelay: "0.15s" }}
            >
              ⭐
            </span>
            <span
              className="animate-feedback-star-twinkle ml-3 text-5xl drop-shadow-lg sm:ml-6 sm:text-7xl"
              style={{ animationDelay: "0.3s" }}
            >
              ✨
            </span>
          </div>
        </>
      ) : (
        <>
          <div
            className="absolute inset-0 bg-gradient-to-b from-red-950 via-slate-950 to-red-950 opacity-95 feedback-wrong-pulse"
            aria-hidden
          />
          <div
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(127,29,29,0.55)_100%)]"
            aria-hidden
          />
          <div
            className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,rgba(0,0,0,0.08)_2px,rgba(0,0,0,0.08)_4px)] opacity-40"
            aria-hidden
          />
        </>
      )}

      <div
        className={[
          "relative z-[60] w-full max-w-4xl overflow-hidden rounded-3xl border-4 p-6 text-center shadow-2xl sm:p-8",
          isCorrect
            ? "animate-feedback-correct-pop border-amber-200 bg-gradient-to-b from-amber-50 via-yellow-100 to-amber-100 shadow-[0_0_0_4px_rgba(251,191,36,0.5),0_0_80px_rgba(250,204,21,0.75),0_25px_50px_rgba(245,158,11,0.35)]"
            : "border-red-600 bg-gradient-to-b from-red-100 to-rose-200 shadow-[0_0_0_3px_rgba(220,38,38,0.4),0_20px_40px_rgba(0,0,0,0.35)]",
        ].join(" ")}
        onClick={(e) => e.stopPropagation()}
      >
        <div aria-live="assertive" className="relative z-20">
          <h2
            id="feedback-title"
            className={[
              "text-3xl font-black sm:text-5xl md:text-6xl",
              isCorrect
                ? "bg-gradient-to-r from-amber-700 via-orange-500 to-rose-600 bg-clip-text text-transparent [filter:drop-shadow(0_3px_0_rgba(255,255,255,0.85))]"
                : "text-red-900 [text-shadow:0_2px_0_rgba(255,255,255,0.85),0_4px_12px_rgba(127,29,29,0.35)]",
            ].join(" ")}
          >
            {title}
          </h2>
          <p
            id="feedback-desc"
            className={[
              "mt-4 text-base font-bold sm:text-xl",
              isCorrect ? "text-amber-900" : "text-red-950",
            ].join(" ")}
          >
            {desc}
          </p>
          {!isCorrect && wrongHint ? (
            <p
              id="feedback-hint"
              className="mt-5 rounded-2xl border-2 border-red-400/60 bg-white/80 px-4 py-3 text-left text-base font-bold leading-snug text-red-950 sm:text-lg"
            >
              <span className="block text-sm font-extrabold text-red-800 sm:text-base">ヒント</span>
              {wrongHint}
            </p>
          ) : null}
        </div>
        <button
          type="button"
          className={[
            "relative z-20 mt-8 min-h-[3rem] w-full rounded-2xl px-4 py-3 text-lg font-bold shadow-lg active:scale-[0.98] sm:mt-10 sm:min-h-[3.25rem] sm:text-xl",
            isCorrect
              ? "bg-gradient-to-r from-amber-500 via-yellow-400 to-orange-500 text-amber-950 ring-4 ring-amber-200/80"
              : "bg-gradient-to-r from-red-600 to-rose-700 text-white ring-4 ring-red-300/50",
          ].join(" ")}
          onClick={onClose}
          aria-label="とじる"
        >
          とじる
        </button>
      </div>
    </div>
  );
}
