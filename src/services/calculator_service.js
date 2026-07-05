import { clamp_positive } from "../utilities/helpers.js";

export function calculate_coffee(ratio, value, param) {
  if (!ratio) {
    return { error: "Define un ratio para calcular." };
  }

  if (!value) {
    return { error: "Ingresa un valor para calcular." };
  }

  if (param === "grams") {
    const ml = clamp_positive(value * ratio);
    return { result: `${value}g café → ${ml.toFixed(1)}ml agua (1:${ratio})` };
  }

  const grams = clamp_positive(value / ratio);
  return { result: `${value}ml agua → ${grams.toFixed(1)}g café (1:${ratio})` };
}
