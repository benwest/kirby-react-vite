import {
  ComponentProps,
  Ref,
  RefObject,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react"
import { useRect, zeroRect } from "@/hooks/useRect"
import { twMerge } from "tailwind-merge"

export type Fit = "cover" | "contain"

const fitToClass: Record<Fit, string> = {
  cover: "object-cover",
  contain: "object-contain",
}

export interface ImageProps extends ComponentProps<"img"> {
  ratio: number
  fit?: Fit
}

const useMergeRefs = (externalRef: Ref<any>, internalRef: RefObject<any>) =>
  useImperativeHandle(externalRef, () => internalRef.current, [internalRef])

const getWidth = (rect: DOMRect, ratio: number, fit?: Fit) => {
  if (!fit) return rect.width
  const sw = rect.width
  const sh = rect.height / ratio
  const scale = fit === "cover" ? Math.max(sw, sh) : Math.min(sw, sh)
  return scale
}

export const Image = forwardRef<HTMLImageElement, ImageProps>(
  ({ srcSet, ratio, fit = "cover", className, ...props }, externalRef) => {
    const ref = useRef<HTMLImageElement>(null)
    useMergeRefs(externalRef, ref)
    const rect = useRect(ref)
    const width = rect !== zeroRect ? getWidth(rect, ratio, fit) : null
    return (
      <img
        ref={ref}
        className={twMerge(fitToClass[fit], className)}
        srcSet={width ? srcSet : undefined}
        sizes={width ? `${width}px` : undefined}
        {...props}
      />
    )
  },
)

Image.displayName = "Image"
