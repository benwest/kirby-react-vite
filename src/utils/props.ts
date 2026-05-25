import { ComponentProps, createElement } from "react"
import { twMerge } from "tailwind-merge"

type IntrinsicElements = React.JSX.IntrinsicElements

export function bindProps<Tag extends keyof IntrinsicElements>(
  tag: Tag,
  baseProps: ComponentProps<Tag>,
) {
  function Component(props: ComponentProps<Tag>) {
    return createElement(tag, mergeProps(baseProps, props))
  }
  Component.displayName = `bound ${tag}`
  return Component
}

export function mergeProps<Tag extends keyof IntrinsicElements = any>(
  ...props: ComponentProps<Tag>[]
): ComponentProps<Tag> {
  return props.reduce(
    (a, b) => ({
      ...a,
      ...b,
      className: twMerge(a.className, b.className),
      style: { ...a.style, ...b.style },
    }),
    {} as ComponentProps<Tag>,
  )
}
