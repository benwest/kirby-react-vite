import { ComponentProps } from "react"

export type HTMLProps = Omit<ComponentProps<"div">, "children"> & {
  children?: string | null
}

export function HTML({ children = "", ...props }: HTMLProps) {
  return <div {...props} dangerouslySetInnerHTML={{ __html: children ?? "" }} />
}
