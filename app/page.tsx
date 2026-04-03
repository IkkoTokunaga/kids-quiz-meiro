import MannersMazeGame from "@/components/MannersMazeGame";
import { loadQuizBundleFromFile, loadQuizBundleFromPath } from "@/lib/parseQuizContent";

export default function Page() {
  const stage1 = loadQuizBundleFromFile();
  const stage2 = loadQuizBundleFromPath("quiz-2.json");
  const stage3 = loadQuizBundleFromPath("quiz-3.json");

  return (
    <MannersMazeGame
      stage1={{ pool: stage1.questions, quizTitle: stage1.quizTitle }}
      stage2={{ pool: stage2.questions, quizTitle: stage2.quizTitle }}
      stage3={{ pool: stage3.questions, quizTitle: stage3.quizTitle }}
    />
  );
}
