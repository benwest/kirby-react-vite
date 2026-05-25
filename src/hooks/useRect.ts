import { useState, useLayoutEffect } from "react"

export const zeroRect = new DOMRect(0, 0, 0, 0)

interface UseOnResizeOptions {
  enabled?: boolean
}

export function useOnResize<T extends Element>(
  ref: React.RefObject<T | null>,
  callback: (rect: DOMRect) => void,
  { enabled = true }: UseOnResizeOptions = {},
) {
  useLayoutEffect(() => {
    if (!enabled) return
    const el = ref.current
    if (!el) throw new Error("Ref not set")
    const onResize = () => callback(el.getBoundingClientRect())
    onResize()
    const observer = new ResizeObserver(onResize)
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref, callback, enabled])
}

export function useRect<T extends Element>(
  ref: React.RefObject<T | null>,
  options: UseOnResizeOptions = {},
) {
  const [rect, setRect] = useState<DOMRect>(zeroRect)
  useOnResize(ref, setRect, options)
  return rect
}
