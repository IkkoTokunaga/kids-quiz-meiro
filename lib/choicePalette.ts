/** 表示位置 0〜3：赤・青・緑・黄の背景（Tailwind はリテラル列挙） */
export const CHOICE_PALETTE = [
  {
    ariaChunk: "あかい ボタン",
    btn: "border-red-800/80 bg-red-500 text-white shadow-md shadow-red-900/20",
  },
  {
    ariaChunk: "あおい ボタン",
    btn: "border-blue-800/80 bg-blue-600 text-white shadow-md shadow-blue-900/20",
  },
  {
    ariaChunk: "みどりの ボタン",
    btn: "border-green-800/80 bg-green-600 text-white shadow-md shadow-green-900/20",
  },
  {
    ariaChunk: "きいろい ボタン",
    btn: "border-amber-900/85 bg-amber-500 text-white shadow-md shadow-amber-950/25 ring-1 ring-amber-950/15",
  },
] as const;
