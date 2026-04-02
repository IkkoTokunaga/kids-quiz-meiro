"use client";

const COLORS = ["#ff6b6b", "#ffd93d", "#6bcb77", "#4d96ff", "#c084fc", "#ff922b"];

type Props = { active: boolean };

export function ConfettiBurst({ active }: Props) {
  if (!active) return null;
  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden" aria-hidden>
      {Array.from({ length: 28 }).map((_, i) => {
        const left = `${(i * 37) % 100}%`;
        const delay = `${(i % 8) * 0.08}s`;
        const duration = `${2 + (i % 5) * 0.2}s`;
        const color = COLORS[i % COLORS.length];
        const rot = `${(i * 47) % 360}deg`;
        return (
          <span
            key={i}
            className="absolute top-0 h-2 w-2 rounded-sm opacity-90"
            style={{
              left,
              backgroundColor: color,
              animation: `confetti-fall-game ${duration} ease-in ${delay} forwards`,
              transform: `rotate(${rot})`,
            }}
          />
        );
      })}
    </div>
  );
}
