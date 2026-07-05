export function clamp_positive(value) {
  return value < 0 ? 0 : value;
}

export function format_time(seconds) {
  const sign = seconds < 0 ? "-" : "";
  const abs = Math.abs(seconds);
  const m = Math.floor(abs / 60);
  const s = Math.floor(abs % 60);
  return `${sign}${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function format_minutes(minutes) {
  const total_seconds = Math.round(minutes * 60);
  const m = Math.floor(total_seconds / 60);
  const s = total_seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function parse_minutes(time_str) {
  const parts = time_str.split(":");
  const m = parseInt(parts[0]) || 0;
  const s = parseInt(parts[1]) || 0;
  return m + s / 60;
}
