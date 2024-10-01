import { Ref, RefObject, forwardRef, useImperativeHandle, useRef } from "react"
import { useRect, zeroRect } from "@/hooks/useRect"
import { HTMLStyledProps, styled } from "@/styled-system/jsx"
import { Replace } from "@/utils/types"

export type Fit = "cover" | "contain"

export type ImageProps = Replace<
  HTMLStyledProps<"img">,
  { ratio: number; objectFit?: Fit }
>

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
  ({ srcSet, ratio, objectFit, ...props }, externalRef) => {
    const ref = useRef<HTMLImageElement>(null)
    useMergeRefs(externalRef, ref)
    const rect = useRect(ref)
    const width = rect !== zeroRect ? getWidth(rect, ratio, objectFit) : null
    return (
      <styled.img
        ref={ref}
        srcSet={width ? srcSet : undefined}
        sizes={width ? `${width}px` : undefined}
        objectFit={objectFit}
        {...props}
      />
    )
  },
)

Image.displayName = "Image"
