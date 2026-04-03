let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AC =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  if (!audioCtx) audioCtx = new AC();
  return audioCtx;
}

function beep(
  freq: number,
  duration: number,
  type: OscillatorType,
  gainValue: number,
  when?: number,
) {
  const ctx = getCtx();
  if (!ctx) return;
  const t = when ?? ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(gainValue, t + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t);
  osc.stop(t + duration + 0.06);
}

/** やわらかいピッチ下降（「ぷぅ」系。ブザー感を出さない） */
function softSlideDown(
  startHz: number,
  endHz: number,
  duration: number,
  gainValue: number,
  when: number,
) {
  const ctx = getCtx();
  if (!ctx) return;
  const t = when;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(startHz, t);
  osc.frequency.exponentialRampToValueAtTime(Math.max(80, endHz), t + duration);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(gainValue, t + 0.028);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t);
  osc.stop(t + duration + 0.07);
}

/** 短いファンファーレ（上昇アルペジオ） */
export function playCorrectChime() {
  const ctx = getCtx();
  if (!ctx) {
    beep(784, 0.1, "sine", 0.12);
    return;
  }
  void ctx.resume().then(() => {
    const t0 = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98];
    const gains = [0.1, 0.1, 0.11, 0.1, 0.09, 0.08];
    notes.forEach((freq, i) => {
      beep(freq, 0.14, "sine", gains[i], t0 + i * 0.085);
    });
    setTimeout(() => {
      const t1 = ctx.currentTime;
      beep(2093, 0.22, "sine", 0.09, t1);
      beep(2637, 0.28, "triangle", 0.06, t1 + 0.12);
    }, notes.length * 85);
  });
}

/**
 * 不正解用：明るいペンタトニックの短い下降＋やわらかいスライド。
 * 低いブザーではなく、ゲームや教材でよくある「もういちど」向けの軽い音。
 */
export function playWrongBuzz() {
  const ctx = getCtx();
  if (!ctx) {
    beep(392, 0.14, "sine", 0.07);
    return;
  }
  void ctx.resume().then(() => {
    const t0 = ctx.currentTime;
    // C メジャー・ペンタトニックを上から短く（木琴／おもちゃっぽい明るさ）
    const step = 0.11;
    beep(523.25, 0.1, "sine", 0.078, t0); // C5
    beep(440, 0.1, "sine", 0.072, t0 + step); // A4
    beep(392, 0.11, "sine", 0.068, t0 + step * 2); // G4
    const tail = t0 + step * 3 + 0.02;
    softSlideDown(349.23, 261.63, 0.16, 0.052, tail); // F4 → C4
  });
}
