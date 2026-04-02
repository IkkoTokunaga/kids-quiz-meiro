let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  if (!audioCtx) audioCtx = new AC();
  return audioCtx;
}

function beep(freq: number, duration: number, type: OscillatorType, gainValue: number) {
  const ctx = getCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  gain.gain.setValueAtTime(0.0001, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(gainValue, ctx.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + duration + 0.05);
}

/** ピンポン風（高めの2音） */
export function playCorrectChime() {
  const ctx = getCtx();
  if (!ctx) {
    beep(880, 0.08, "sine", 0.12);
    return;
  }
  void ctx.resume().then(() => {
    beep(784, 0.07, "sine", 0.11);
    setTimeout(() => beep(1046, 0.1, "sine", 0.1), 70);
  });
}

/** 低めのブザー風 */
export function playWrongBuzz() {
  const ctx = getCtx();
  if (!ctx) {
    beep(120, 0.25, "square", 0.06);
    return;
  }
  void ctx.resume().then(() => {
    beep(150, 0.2, "sawtooth", 0.07);
  });
}
