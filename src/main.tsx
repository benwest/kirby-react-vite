import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { App } from "./components/App"
import "./style.css"

const router = createBrowserRouter([
  {
    path: "/*",
    loader: async ({ params: { "*": path }, request }) => {
      const url = `/${path || "home"}.json`
      return fetch(url, { signal: request.signal })
    },
    element: <App />,
  },
])

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
