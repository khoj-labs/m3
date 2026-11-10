import { lazy, Suspense } from "react"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import Spinner from "@/boilerplate/common/Spinner"
import Gallery from "@/gallery/Gallery"

// Lazy: the boilerplate gallery pulls in the full lucide icon map for the PageHeader playground.
const BoilerplateGallery = lazy(() => import("@/boilerplate/gallery/BoilerplateGallery"))
const EmbedRoutes = lazy(() => import("@/boilerplate/gallery/EmbedRoutes"))

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/boilerplate/embed/*" element={<Suspense fallback={<Spinner fullPage />}><EmbedRoutes /></Suspense>} />
        <Route path="/boilerplate" element={<Suspense fallback={<Spinner fullPage />}><BoilerplateGallery /></Suspense>} />
        <Route path="*" element={<Navigate to="/gallery" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
