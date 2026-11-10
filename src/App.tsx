import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import Gallery from "@/gallery/Gallery"
import BoilerplateDemo from "@/boilerplate/demo/BoilerplateDemo"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/boilerplate/*" element={<BoilerplateDemo />} />
        <Route path="*" element={<Navigate to="/gallery" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
