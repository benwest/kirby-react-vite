import { usePage } from "@/components/Page"

export default function HomePage() {
  const page = usePage("home")
  return (
    <div>
      <h1>Home</h1>
      <pre>{JSON.stringify(page, null, 2)}</pre>
    </div>
  )
}
