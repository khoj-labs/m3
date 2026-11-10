import { FolderIcon, HouseIcon } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"
import { Section, Row } from "@/gallery/Section"
import ActionButtonGroup from "../common/ActionButtonGroup"
import BreadcrumbsNavigation from "../common/BreadcrumbsNavigation"
import Spinner from "../common/Spinner"
import SpinnerButton from "../common/SpinnerButton"
import Frame from "./Frame"
import Snippet from "./Snippet"

export function ComponentsGroup() {
  const [fullPage, setFullPage] = useState(false)
  const [busy, setBusy] = useState(false)

  return (
    <>
      <Section name="Spinner" title="Spinner">
        <Row label="Sizes">
          <Spinner size="sm" className="w-auto py-0" />
          <Spinner className="w-auto py-0" />
          <Spinner size="lg" className="w-auto py-0" />
        </Row>
        <Row label="fullPage (positioned in the upper third of its container)">
          <Button variant="outline" onClick={() => { setFullPage(true); setTimeout(() => setFullPage(false), 2000) }}>Show for 2s</Button>
        </Row>
        <Frame className="h-40">{fullPage ? <Spinner fullPage /> : <Typography tone="muted" className="p-4">Container for the fullPage spinner</Typography>}</Frame>
        <Snippet code={`<Spinner />               // inline, centred in its container
<Spinner size="lg" />      // sm | default | lg
<Spinner fullPage />       // fixed, upper third of the viewport`} />
      </Section>

      <Section name="SpinnerButton" title="SpinnerButton">
        <Row label="Click to load for 1.5s / always loading / disabled">
          <SpinnerButton isLoading={busy} onClick={() => { setBusy(true); setTimeout(() => setBusy(false), 1500) }}>Save</SpinnerButton>
          <SpinnerButton isLoading variant="secondary">Loading</SpinnerButton>
          <SpinnerButton isLoading variant="outline">Outline loading</SpinnerButton>
          <SpinnerButton disabled>Disabled</SpinnerButton>
        </Row>
        <Snippet code={`<SpinnerButton isLoading={saving} onClick={save}>
  Save
</SpinnerButton>`} />
      </Section>

      <Section name="BreadcrumbsNavigation" title="BreadcrumbsNavigation">
        <BreadcrumbsNavigation items={[
          { href: "#BreadcrumbsNavigation", icon: <HouseIcon />, label: "Home" },
          { href: "#projects", icon: <FolderIcon />, label: "Projects" },
          { href: "#details", label: "Details (current page)" },
        ]} />
        <Snippet code={`<BreadcrumbsNavigation
  items={[
    { href: "/", icon: <House />, label: "Home" },
    { href: "/projects", label: "Projects" },
    { href: "/projects/42", label: "Details" }, // last item is the current page
  ]}
/>`} />
      </Section>

      <Section name="ActionButtonGroup" title="ActionButtonGroup">
        <ActionButtonGroup>
          <Button variant="ghost">Cancel</Button>
          <Button variant="outline">Save draft</Button>
          <Button>Publish</Button>
        </ActionButtonGroup>
        <Snippet code={`<ActionButtonGroup>
  <Button variant="ghost">Cancel</Button>
  <Button>Publish</Button>
</ActionButtonGroup>`} />
      </Section>
    </>
  )
}
