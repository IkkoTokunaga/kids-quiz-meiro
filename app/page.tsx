import MannersMazeGame from "@/components/MannersMazeGame";
import { loadQuizBundleFromFile } from "@/lib/parseQuizContent";

export default function Page() {
  const { quizTitle, questions: pool } = loadQuizBundleFromFile();

  return (
    <div className="relative min-h-[100dvh] overflow-x-clip bg-gradient-to-b from-sky-400 via-sky-200 to-lime-200">
      <div
        className="pointer-events-none absolute left-[6%] top-10 h-14 w-24 rounded-full bg-white/70 blur-[1px] animate-cloud-drift"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute right-[10%] top-24 h-10 w-20 rounded-full bg-white/60 animate-cloud-drift"
        style={{ animationDelay: "1.5s" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-lime-400/80 to-transparent"
        aria-hidden
      />
      <MannersMazeGame pool={pool} quizTitle={quizTitle} />
    </div>
  );
}
