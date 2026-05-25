import { usePage } from "@/components/Page"

export default function ErrorPage() {
  const page = usePage("error")
  return (
    <div>
      <h1>Error</h1>
      <pre>{JSON.stringify(page, null, 2)}</pre>
    </div>
  )
}
