import { useCallback, useRef } from "react"

export function useEvent<T extends (...args: any[]) => any>(fn: T) {
  const ref = useRef<T>(fn)
  ref.current = fn
  return useCallback(
    (...args: Parameters<T>): ReturnType<T> => ref.current!(...args),
    [],
  )
}
