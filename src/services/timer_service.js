import { play_beep, play_tick } from "../utilities/audio.js";
import { format_time } from "../utilities/helpers.js";

export class TimerService {
  constructor() {
    this.seconds = 0;
    this.is_running = false;
    this._last_tick = 0;
    this._accumulator = 0;
  }

  set_duration(minutes) {
    this.seconds = Math.round(minutes * 60);
  }

  get_formatted_time() {
    return format_time(this.seconds);
  }

  start(on_tick, on_finish) {
    if (this.seconds <= 0) return;

    this.is_running = true;
    this.on_tick = on_tick;
    this.on_finish = on_finish;
    this._last_tick = performance.now();
    this._accumulator = 0;
    this._raf_id = requestAnimationFrame((t) => this._process(t));
  }

  stop() {
    if (this._raf_id) {
      cancelAnimationFrame(this._raf_id);
      this._raf_id = null;
    }
    this.is_running = false;
  }

  _process(timestamp) {
    if (!this.is_running) return;

    const delta = Math.min(timestamp - this._last_tick, 2000);
    this._last_tick = timestamp;
    this._accumulator += delta;

    if (this._accumulator >= 1000) {
      this._tick();
      this._accumulator -= 1000;
    }

    if (this.is_running) {
      this._raf_id = requestAnimationFrame((t) => this._process(t));
    }
  }

  _tick() {
    this.seconds--;

    if (this.seconds <= 0) {
      play_beep();
      this.on_tick?.("00:00", true);
      this.stop();
      this.on_finish?.();
      return;
    }

    if (this.seconds <= 10) {
      play_beep();
    } else {
      play_tick(this.seconds % 2 === 1);
    }

    this.on_tick?.(this.get_formatted_time(), this.seconds <= 10);
  }
}
