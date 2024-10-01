import { PageContent } from "@/content/pages"
import { site } from "@/site"
import { createContext, ReactNode, useMemo } from "react"
import { useLoaderData } from "react-router-dom"

let didLog = false

export const PageContext = createContext<PageContent | null>(null)

interface PageProviderProps {
  children: ReactNode
}
export function PageProvider({ children }: PageProviderProps) {
  const loaderData = useLoaderData()
  const page = useMemo(() => PageContent.parse(loaderData), [loaderData])
  if (!didLog) {
    console.log({ page, site })
    didLog = true
  }
  return <PageContext.Provider value={page}>{children}</PageContext.Provider>
}
