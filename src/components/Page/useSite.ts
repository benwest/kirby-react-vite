import { SiteContent } from "@/types/site"
import { createContext, useContext } from "react"

export const SiteContext = createContext<SiteContent | null>(null)

export function useSite() {
  const site = useContext(SiteContext)
  if (site === null) {
    throw new Error("useSite must be used within a PageProvider")
  }
  return site
}
