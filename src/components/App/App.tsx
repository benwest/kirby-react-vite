import { Page, PageProvider, usePage, useSite } from "@/components/Page"
import { useEffect } from "react"
import { ScrollRestoration } from "react-router-dom"

export function App() {
  return (
    <PageProvider>
      <Title />
      <ScrollRestoration />
      <Page />
    </PageProvider>
  )
}

function Title() {
  const page = usePage()
  const site = useSite()
  const title = `${page.title} | ${site.title}`
  useEffect(() => {
    document.title = title
  }, [title])
  return null
}
