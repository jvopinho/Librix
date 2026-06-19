export function pcall<T>(fn: () => Promise<T>): Promise<[Error | null, T | null]> {
  return fn()
    .then((result) => [null, result] as [null, T])
    .catch((error) => [error instanceof Error ? error : new Error(String(error)), null] as [Error, null])
}