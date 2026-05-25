import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { App } from "./components/App"
import { loader } from "./loader"
import "./styles/index.css"

const router = createBrowserRouter([
  {
    path: "/*",
    loader,
    element: <App />,
  },
])

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
