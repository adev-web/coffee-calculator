let audio_context = null;

function get_context() {
  if (!audio_context) {
    audio_context = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audio_context;
}

export async function warmup_audio() {
  const ctx = get_context();
  if (ctx.state === "suspended") {
    await ctx.resume();
  }
}

export function play_beep() {
  try {
    const ctx = get_context();
    const t = ctx.currentTime + 0.01;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    osc.type = "square";
    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
    osc.start(t);
    osc.stop(t + 0.15);
  } catch (_) {}
}

export function play_tick(high) {
  try {
    const ctx = get_context();
    const t = ctx.currentTime + 0.01;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = high ? 2400 : 1800;
    osc.type = "sine";
    gain.gain.setValueAtTime(0.06, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
    osc.start(t);
    osc.stop(t + 0.04);
  } catch (_) {}
}
