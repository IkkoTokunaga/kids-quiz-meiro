"use client";

const COLORS = [
  "#ff0055",
  "#ffcc00",
  "#00e676",
  "#00b0ff",
  "#e040fb",
  "#ff6d00",
  "#ffffff",
  "#ffeb3b",
];

/** 画面全体にかかる紙吹雪（正解演出用） */
export function FullScreenConfetti() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[55] overflow-hidden" aria-hidden>
      {Array.from({ length: 110 }).map((_, i) => {
        const left = `${(i * 17 + (i % 7) * 13) % 100}%`;
        const delay = `${(i % 14) * 0.06}s`;
        const duration = `${1.8 + (i % 7) * 0.35}s`;
        const color = COLORS[i % COLORS.length];
        const rot = `${(i * 41) % 360}deg`;
        const w = i % 3 === 0 ? 10 : i % 3 === 1 ? 6 : 14;
        const h = i % 3 === 0 ? 14 : i % 3 === 1 ? 10 : 6;
        const rounded = i % 2 === 0 ? "rounded-sm" : "rounded-full";
        return (
          <span
            key={i}
            className={`absolute -top-6 opacity-95 shadow-sm ${rounded}`}
            style={{
              left,
              width: `${w}px`,
              height: `${h}px`,
              backgroundColor: color,
              animation: `confetti-fall-game ${duration} ease-in ${delay} forwards`,
              transform: `rotate(${rot})`,
            }}
          />
        );
      })}
      {Array.from({ length: 45 }).map((_, i) => {
        const left = `${(i * 23) % 100}%`;
        const delay = `${0.15 + (i % 10) * 0.05}s`;
        const duration = `${2.8 + (i % 5) * 0.4}s`;
        return (
          <span
            key={`s-${i}`}
            className="absolute -top-8 h-4 w-4 rounded-full opacity-80"
            style={{
              left,
              backgroundColor: COLORS[(i + 3) % COLORS.length],
              animation: `confetti-fall-game ${duration} linear ${delay} forwards`,
              transform: `rotate(${i * 53}deg) scale(${1.2 + (i % 4) * 0.15})`,
            }}
          />
        );
      })}
    </div>
  );
}
