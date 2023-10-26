export function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min)
}

export function getRandomItems<T>(from: T[], count: number): T[] {
  if (from.length === 0 || !count) return []

  return Array(count).map(() => from[getRandomInt(0, from.length - 1)])
}