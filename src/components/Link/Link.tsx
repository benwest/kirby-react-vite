import { Link as BaseLink } from "react-router-dom"
import { styled } from "@/styled-system/jsx"
import { ComponentProps } from "react"

export const Link = styled(BaseLink)
export type LinkProps = ComponentProps<typeof Link>
