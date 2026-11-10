import { CheckIcon, CopyIcon, XIcon } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

/** navigator.clipboard needs a secure, focused document; fall back to the legacy command. */
function legacyCopy(text: string) {
  const textarea = document.createElement("textarea")
  textarea.value = text
  textarea.style.position = "fixed"
  textarea.style.opacity = "0"
  document.body.appendChild(textarea)
  textarea.select()
  let ok = false
  try { ok = document.execCommand("copy") }
  catch { /* unsupported */ }
  textarea.remove()
  return ok
}

type Status = "copied" | "failed" | "idle"

/** Sample usage with a copy button. */
export default function Snippet({ code }: { code: string }) {
  const [status, setStatus] = useState<Status>("idle")

  async function copy() {
    let ok = false
    try {
      await navigator.clipboard.writeText(code)
      ok = true
    }
    catch { ok = legacyCopy(code) }
    setStatus(ok ? "copied" : "failed")
    setTimeout(() => setStatus("idle"), 1500)
  }

  const label = { copied: "Copied", failed: "Copy failed", idle: "Copy snippet" }[status]
  return (
    <div className="relative">
      <pre className="overflow-auto rounded-lg bg-md-surface-container-high p-3 pr-12 text-xs">{code}</pre>
      <Button variant="ghost" size="icon-sm" className="absolute top-1.5 right-1.5" aria-label={label} title={label} onClick={copy}>
        {status === "copied" ? <CheckIcon /> : status === "failed" ? <XIcon /> : <CopyIcon />}
      </Button>
    </div>
  )
}
