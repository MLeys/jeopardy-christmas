export function keyFor(cIndex, rIndex) {
  return String(cIndex) + "-" + String(rIndex);
}

export function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

export function safeInt(value, fallback) {
  var v = parseInt(value, 10);
  if (isNaN(v)) return fallback;
  return v;
}
