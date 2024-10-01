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
  if (!didLog) {
    console.log({ page: loaderData, site })
    didLog = true
  }
  const page = useMemo(() => PageContent.parse(loaderData), [loaderData])
  return <PageContext.Provider value={page}>{children}</PageContext.Provider>
}
