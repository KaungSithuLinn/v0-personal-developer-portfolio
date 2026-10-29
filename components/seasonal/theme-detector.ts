export function isHalloweenWindow(now: Date = new Date()): boolean {
  const m = now.getMonth()
  const d = now.getDate()
  if (m === 9) return d >= 1
  if (m === 10) return d < 1
  return false
}

export type HalloweenMode = "on" | "off" | "auto"
