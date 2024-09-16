export function getPropertyFromUnknown<T>(
  object: unknown,
  property: string,
): T | undefined {
  if (typeof object !== 'object' || object === null) return undefined

  return (object as Record<string, unknown>)[property] as T
}
