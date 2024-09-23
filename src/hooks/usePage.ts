import { PageContent } from "@/content/pages"
import { useMemo } from "react"
import { useLoaderData } from "react-router-dom"

type PageType = PageContent["type"]
type PageOfType<T extends PageType> = Extract<PageContent, { type: T }>

export function usePage(): PageContent
export function usePage<T extends PageType>(type: T): PageOfType<T>
export function usePage(type?: PageContent["type"]) {
  const loaderData = useLoaderData()
  const page = useMemo(() => PageContent.parse(loaderData), [loaderData])
  if (type && page.type !== type) {
    throw new Error(`Expected page type "${type}", but got "${page.type}"`)
  }
  return page
}
