import { ComponentType } from "react"
import { usePage } from "./usePage"

const pages = import.meta.glob<ComponentType>("/src/pages/*.tsx", {
  eager: true,
  import: "default",
})

export function Page() {
  const page = usePage()
  const Component = pages[`/src/pages/${page.type}.tsx`]
  if (!Component) throw new Error(`Page component not found: ${page.type}`)
  return <Component />
}
