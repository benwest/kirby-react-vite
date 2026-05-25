import { LoaderFunctionArgs } from "react-router-dom"

async function fetchJson(url: URL, signal: AbortSignal) {
  const response = await fetch(url, { signal })
  if (!response.ok) throw new Error(response.statusText)
  return response.json()
}

export async function loader({ request }: LoaderFunctionArgs) {
  const { pathname, origin } = new URL(request.url)
  const pagePath = pathname === "/" ? "/home.json" : `${pathname}.json`
  const [site, page] = await Promise.all([
    fetchJson(new URL("/site.json", origin), request.signal),
    fetchJson(new URL(pagePath, origin), request.signal),
  ])
  return { site, page }
}
