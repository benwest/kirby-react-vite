import { styled } from "@/styled-system/jsx"
import { HTML } from "../HTML"
import { ComponentProps } from "react"

export const RichText = styled(HTML, {
  base: {
    "& > *:not(:last-child)": {
      marginBottom: 4,
    },
  },
})

export type RichTextProps = ComponentProps<typeof RichText>
