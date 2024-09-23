type Key = string | number | symbol

export function keys<T extends object>(obj: T) {
  return Object.keys(obj) as (keyof T)[]
}

export function values<T extends object>(obj: T) {
  return Object.values(obj) as T[keyof T][]
}

export function entries<T extends Record<any, any>>(obj: T) {
  return Object.entries(obj) as [keyof T, T[keyof T]][]
}

export function mapKeys<
  InKeyType extends Key,
  OutKeyType extends Key,
  ValueType,
>(
  obj: Record<InKeyType, ValueType>,
  fn: (key: InKeyType, value: ValueType) => OutKeyType,
) {
  const result: Partial<Record<OutKeyType, ValueType>> = {}
  for (const key of keys(obj)) result[fn(key, obj[key])] = obj[key]
  return result as Record<OutKeyType, ValueType>
}

export function mapValues<KeyType extends Key, InValueType, OutValueType>(
  obj: Record<KeyType, InValueType>,
  fn: (value: InValueType, key: KeyType) => OutValueType,
) {
  const result: Partial<Record<KeyType, OutValueType>> = {}
  for (const key of keys(obj)) result[key] = fn(obj[key], key)
  return result as Record<KeyType, OutValueType>
}

export function mapEntries<
  InKeyType extends Key,
  OutKeyType extends Key,
  InValueType,
  OutValueType,
>(
  obj: Record<InKeyType, InValueType>,
  fn: (key: InKeyType, value: InValueType) => [OutKeyType, OutValueType],
) {
  const result: Partial<Record<OutKeyType, OutValueType>> = {}
  for (const key of keys(obj)) {
    const [newKey, newValue] = fn(key, obj[key])
    result[newKey] = newValue
  }
  return result as Record<OutKeyType, OutValueType>
}
