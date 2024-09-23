import { PageContent } from "@/content/pages"
import { createContext, ReactNode, useMemo } from "react"
import { useLoaderData } from "react-router-dom"

export const PageContext = createContext<PageContent | null>(null)

interface PageProviderProps {
  children: ReactNode
}
export function PageProvider({ children }: PageProviderProps) {
  const loaderData = useLoaderData()
  const page = useMemo(() => PageContent.parse(loaderData), [loaderData])
  return <PageContext.Provider value={page}>{children}</PageContext.Provider>
}
