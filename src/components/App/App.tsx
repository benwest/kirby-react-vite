import { Page, PageProvider, usePage } from "@/components/Page"
import { site } from "@/site"
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
  const title = `${page.title} | ${site.title}`
  useEffect(() => {
    document.title = title
  }, [title])
  return null
}
