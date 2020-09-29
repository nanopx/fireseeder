export const createSeeds = (
  count: number,
  factory: (index: number) => Record<string, unknown>
) => {
  return Array.from({ length: count }).map((_, i) => factory(i))
}
