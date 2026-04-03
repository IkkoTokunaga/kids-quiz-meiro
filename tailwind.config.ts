import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        confettiFall: {
          "0%": { transform: "translateY(-10vh) rotate(0deg)", opacity: "1" },
          "100%": { transform: "translateY(100vh) rotate(720deg)", opacity: "0.3" },
        },
        pop: {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "50%": { transform: "scale(1.05)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        cloudDrift: {
          "0%, 100%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(12px)" },
        },
        feedbackCorrectPop: {
          "0%": { transform: "scale(0.45)", opacity: "0" },
          "55%": { transform: "scale(1.08)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        feedbackWrongShake: {
          "0%, 100%": { transform: "translateX(0)" },
          "12%": { transform: "translateX(-12px)" },
          "24%": { transform: "translateX(12px)" },
          "36%": { transform: "translateX(-10px)" },
          "48%": { transform: "translateX(10px)" },
          "60%": { transform: "translateX(-6px)" },
          "72%": { transform: "translateX(6px)" },
        },
        feedbackStarTwinkle: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.9" },
          "50%": { transform: "scale(1.35)", opacity: "1" },
        },
      },
      animation: {
        "confetti-fall": "confettiFall 2.5s ease-in forwards",
        pop: "pop 0.35s ease-out forwards",
        "cloud-drift": "cloudDrift 8s ease-in-out infinite",
        "feedback-correct-pop": "feedbackCorrectPop 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        "feedback-wrong-shake": "feedbackWrongShake 0.55s ease-in-out infinite",
        "feedback-star-twinkle": "feedbackStarTwinkle 0.9s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
