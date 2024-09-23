import { PageContent } from "@/content/pages"
import { useContext } from "react"
import { PageContext } from "./PageContext"

type PageType = PageContent["type"]
type PageOfType<T extends PageType> = Extract<PageContent, { type: T }>

export function usePage(): PageContent
export function usePage<T extends PageType>(type: T): PageOfType<T>
export function usePage(type?: PageContent["type"]) {
  const page = useContext(PageContext)
  if (page === null) {
    throw new Error("usePage must be used within a Page component")
  }
  if (type !== undefined && page.type !== type) {
    throw new Error(`Expected page type "${type}", but got "${page.type}"`)
  }
  return page
}
