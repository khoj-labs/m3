import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import Gallery from "@/gallery/Gallery"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/gallery" element={<Gallery />} />
        <Route path="*" element={<Navigate to="/gallery" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
