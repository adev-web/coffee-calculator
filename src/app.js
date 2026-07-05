import { PRESETS } from "./config/presets.js";
import { calculate_coffee } from "./services/calculator_service.js";
import { TimerService } from "./services/timer_service.js";
import { format_minutes, parse_minutes } from "./utilities/helpers.js";
import { warmup_audio } from "./utilities/audio.js";

let active_preset = "personalizado";

const elements = {
  prep_select: document.getElementById("preparation"),
  ratio_input: document.getElementById("ratio"),
  brew_time_input: document.getElementById("brewTime"),
  param_select: document.getElementById("param"),
  value_input: document.getElementById("value"),
  result: document.getElementById("result"),
  timer_section: document.getElementById("timerSection"),
  timer_display: document.getElementById("timerDisplay"),
  timer_btn: document.getElementById("timerBtn"),
};

const timer = new TimerService();

function apply_preset(key) {
  const preset = PRESETS[key];
  if (!preset) return;

  active_preset = key;
  elements.ratio_input.value = preset.ratio;
  elements.brew_time_input.value = format_minutes(preset.time);
  timer.set_duration(preset.time);
  elements.timer_display.textContent = timer.get_formatted_time();
}

function check_manual_change(current_value, expected) {
  if (active_preset === "personalizado") return;
  if (current_value !== expected) {
    elements.prep_select.value = "personalizado";
    active_preset = "personalizado";
  }
}

function update_value_placeholder() {
  const labels = {
    grams: "Ingresa los gramos de café a usar",
    milliliters: "Ingresa los mililitros de agua a usar",
  };
  elements.value_input.placeholder = labels[elements.param_select.value] || "";
}

export function init_app() {
  apply_preset("personalizado");
  update_value_placeholder();

  [elements.ratio_input, elements.value_input].forEach((input) => {
    input.addEventListener("input", () => {
      const val = parseFloat(input.value);
      if (input.value !== "" && (isNaN(val) || val < 0)) {
        input.value = 0;
      }
    });
  });

  elements.prep_select.addEventListener("change", () => {
    apply_preset(elements.prep_select.value);
  });

  elements.param_select.addEventListener("change", update_value_placeholder);

  elements.ratio_input.addEventListener("change", () => {
    const p = PRESETS[active_preset];
    check_manual_change(parseFloat(elements.ratio_input.value), p?.ratio);
  });

  elements.brew_time_input.addEventListener("change", () => {
    const new_minutes = parse_minutes(elements.brew_time_input.value) || 0;
    timer.set_duration(new_minutes);
    if (!timer.is_running) {
      elements.timer_display.textContent = timer.get_formatted_time();
    }

    const p = PRESETS[active_preset];
    check_manual_change(new_minutes, p?.time);
  });

  document.getElementById("calculate").addEventListener("click", () => {
    const ratio = parseFloat(elements.ratio_input.value);
    const value = parseFloat(elements.value_input.value);
    const param = elements.param_select.value;

    const output = calculate_coffee(ratio, value, param);

    if (output.error) {
      elements.result.textContent = output.error;
      return;
    }

    elements.timer_section.classList.remove("hidden");
    elements.result.textContent = output.result;
  });

  elements.timer_btn.addEventListener("click", async () => {
    if (timer.is_running) {
      timer.stop();
      elements.timer_btn.textContent = "Iniciar";
      return;
    }

    await warmup_audio();

    const minutes = parse_minutes(elements.brew_time_input.value) || 0;
    timer.set_duration(minutes);

    if (timer.seconds <= 0) return;

    elements.timer_display.classList.remove("alarm");
    elements.timer_display.textContent = timer.get_formatted_time();
    elements.timer_btn.textContent = "Detener";

    timer.start(
      (time, alarm) => {
        elements.timer_display.textContent = time;
        elements.timer_display.classList.toggle("alarm", alarm);
      },
      () => {
        elements.timer_btn.textContent = "Iniciar";
      }
    );
  });
}
