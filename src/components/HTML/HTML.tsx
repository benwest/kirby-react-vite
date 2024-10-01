import { styled } from "@/styled-system/jsx"
import { HTMLStyledProps } from "@/styled-system/types"

export type HTMLProps = Omit<HTMLStyledProps<"div">, "children"> & {
  children?: string
}

export function HTML({ children = "", ...props }: HTMLProps) {
  return (
    <styled.div {...props} dangerouslySetInnerHTML={{ __html: children }} />
  )
}
