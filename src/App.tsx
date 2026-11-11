import { lazy, Suspense } from "react"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import Spinner from "@/boilerplate/common/Spinner"
import Gallery from "@/gallery/Gallery"

const EmbedRoutes = lazy(() => import("@/boilerplate/gallery/EmbedRoutes"))

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/boilerplate/embed/*" element={<Suspense fallback={<Spinner fullPage />}><EmbedRoutes /></Suspense>} />
        <Route path="/boilerplate" element={<Navigate to="/gallery#page-components" replace />} />
        <Route path="*" element={<Navigate to="/gallery" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
