import { useEffect, useState } from "react"

/** Current window scroll offset; used to elevate the sticky AppBar once content scrolls under it. */
export function useScrollY() {
  const [y, setY] = useState(0)
  useEffect(() => {
    const onScroll = () => setY(window.scrollY)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])
  return y
}
