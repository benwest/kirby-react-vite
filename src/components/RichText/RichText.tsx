import { twMerge } from "tailwind-merge"
import { HTML, HTMLProps } from "../HTML"

export type RichTextProps = HTMLProps

export function RichText({ className, ...props }: RichTextProps) {
  return <HTML className={twMerge("rich-text", className)} {...props} />
}
