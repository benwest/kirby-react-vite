import { usePage } from "@/hooks/usePage"

export default function DefaultPage() {
  const page = usePage("default")
  return (
    <div>
      <h1>Default</h1>
      <pre>{JSON.stringify(page, null, 2)}</pre>
    </div>
  )
}
