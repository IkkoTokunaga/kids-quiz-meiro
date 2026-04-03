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

/** 低めのブザーを2回＋わずかに下がる */
export function playWrongBuzz() {
  const ctx = getCtx();
  if (!ctx) {
    beep(180, 0.18, "square", 0.1);
    return;
  }
  void ctx.resume().then(() => {
    const t0 = ctx.currentTime;
    beep(220, 0.22, "sawtooth", 0.11, t0);
    beep(165, 0.32, "square", 0.12, t0 + 0.2);
    beep(120, 0.38, "sawtooth", 0.09, t0 + 0.48);
  });
}
