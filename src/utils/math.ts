export function clamp(x: number, min: number, max: number) {
  return Math.max(Math.min(x, max), min)
}

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

export function inverseLerp(a: number, b: number, x: number) {
  const range = b - a
  if (range === 0) return a
  return (x - a) / range
}

export function map(
  x: number,
  oldMin: number,
  oldMax: number,
  newMin: number,
  newMax: number,
) {
  return lerp(newMin, newMax, inverseLerp(oldMin, oldMax, x))
}

export function mapClamped(
  x: number,
  oldMin: number,
  oldMax: number,
  newMin: number,
  newMax: number,
) {
  return clamp(map(x, oldMin, oldMax, newMin, newMax), newMin, newMax)
}

export function wrap(num: number, min: number, max: number) {
  const range = max - min
  if (range === 0) return min
  return ((((num - min) % range) + range) % range) + min
}

export function shortestDistance(
  a: number,
  b: number,
  min: number,
  max: number,
) {
  const range = max - min
  const dist = (b - a) % range
  return dist > range / 2 ? dist - range : dist
}

export function sign(x: number) {
  return x > 0 ? 1 : -1
}

export const DEG2RAD = Math.PI / 180
export const RAD2DEG = 180 / Math.PI
