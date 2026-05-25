import { useCallback, useMemo, useSyncExternalStore } from "react"

const style = window.getComputedStyle(document.documentElement)

const breakpoints = {
  sm: style.getPropertyValue("--breakpoint-sm"),
  md: style.getPropertyValue("--breakpoint-md"),
  lg: style.getPropertyValue("--breakpoint-lg"),
  xl: style.getPropertyValue("--breakpoint-xl"),
  "2xl": style.getPropertyValue("--breakpoint-2xl"),
} as const

export function useMediaQuery(query: string) {
  if (query in breakpoints)
    query = `(min-width: ${breakpoints[query as keyof typeof breakpoints]})`

  const mediaQueryList = useMemo(() => window.matchMedia(query), [query])

  const subscribe = useCallback(
    (onChange: () => void) => {
      mediaQueryList.addEventListener("change", onChange)
      return () => {
        mediaQueryList.removeEventListener("change", onChange)
      }
    },
    [mediaQueryList],
  )

  const getSnapshot = useCallback(
    () => mediaQueryList.matches,
    [mediaQueryList],
  )

  return useSyncExternalStore<boolean>(subscribe, getSnapshot)
}
