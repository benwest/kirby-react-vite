import { PageContent } from "@/types/pages"
import { SiteContent } from "@/types/site"
import { createContext, ReactNode, useMemo } from "react"
import { useLoaderData } from "react-router-dom"
import { z } from "zod"
import { SiteContext } from "./useSite"

const LoaderData = z.object({
  site: z.unknown(),
  page: z.unknown(),
})

let didLog = false

export const PageContext = createContext<PageContent | null>(null)

interface PageProviderProps {
  children: ReactNode
}
export function PageProvider({ children }: PageProviderProps) {
  const rawData = useLoaderData()
  const { site: rawSite, page: rawPage } = useMemo(
    () => LoaderData.parse(rawData),
    [rawData],
  )
  if (!didLog) {
    console.log({ site: rawSite, page: rawPage })
    didLog = true
  }
  const site = useMemo(() => SiteContent.parse(rawSite), [rawSite])
  const page = useMemo(() => PageContent.parse(rawPage), [rawPage])
  return (
    <SiteContext.Provider value={site}>
      <PageContext.Provider value={page}>{children}</PageContext.Provider>
    </SiteContext.Provider>
  )
}
