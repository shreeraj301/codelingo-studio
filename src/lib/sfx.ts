import { useProgress } from "@/lib/progress";

let ctx: AudioContext | null = null;

function audio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return null;
  if (!ctx) ctx = new Ctx();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function tone(context: AudioContext, freq: number, at: number, dur: number, type: OscillatorType, gain: number) {
  const osc = context.createOscillator();
  const amp = context.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, at);
  amp.gain.setValueAtTime(0.0001, at);
  amp.gain.exponentialRampToValueAtTime(gain, at + 0.02);
  amp.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  osc.connect(amp);
  amp.connect(context.destination);
  osc.start(at);
  osc.stop(at + dur + 0.02);
}

function audible(): AudioContext | null {
  if (useProgress.getState().muted) return null;
  return audio();
}

export function playChime() {
  const context = audible();
  if (!context) return;
  const now = context.currentTime;
  tone(context, 523.25, now, 0.18, "sine", 0.05);
  tone(context, 659.25, now + 0.08, 0.2, "sine", 0.05);
  tone(context, 783.99, now + 0.16, 0.28, "sine", 0.045);
}

export function playMiss() {
  const context = audible();
  if (!context) return;
  const now = context.currentTime;
  tone(context, 196, now, 0.14, "triangle", 0.04);
  tone(context, 155, now + 0.09, 0.18, "triangle", 0.035);
}
