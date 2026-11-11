export const splitInHalf = <T>(items: T[]): [T[], T[]] => {
  const middle = Math.ceil(items.length / 2)
  return [items.slice(0, middle), items.slice(middle)]
}
