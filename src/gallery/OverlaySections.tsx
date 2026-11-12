import { CopyIcon, Loader2Icon, PencilIcon, Trash2Icon } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { Backdrop } from "@/components/ui/backdrop"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Section, Row } from "./Section"

export function OverlaySections() {
  const [check, setCheck] = useState(true)
  const [radio, setRadio] = useState("a")
  const [backdrop, setBackdrop] = useState<false | "scrim" | "blur">(false)
  return (
    <>
      <Section name="dialog" title="Dialog">
        <Dialog>
          <DialogTrigger render={<Button variant="outline" />}>Open dialog</DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Edit profile</DialogTitle><DialogDescription>Make changes, then save.</DialogDescription></DialogHeader>
            <Input placeholder="Name" />
            <DialogFooter><DialogClose render={<Button variant="ghost" />}>Cancel</DialogClose><Button>Save</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </Section>

      <Section name="sheet" title="Sheet">
        <Row label="Sides">
          {(["top", "right", "bottom", "left"] as const).map((side) => (
            <Sheet key={side}>
              <SheetTrigger render={<Button variant="outline" />}>{side}</SheetTrigger>
              <SheetContent side={side}>
                <SheetHeader><SheetTitle>Sheet ({side})</SheetTitle><SheetDescription>Slides in from the {side}.</SheetDescription></SheetHeader>
                <SheetFooter><Button>Done</Button></SheetFooter>
              </SheetContent>
            </Sheet>
          ))}
        </Row>
      </Section>

      <Section name="popover" title="Popover">
        <Popover>
          <PopoverTrigger render={<Button variant="outline" />}>Open popover</PopoverTrigger>
          <PopoverContent className="w-64 text-sm">Popover content with <b>rich</b> text.</PopoverContent>
        </Popover>
      </Section>

      <Section name="tooltip" title="Tooltip">
        <Row label="Sides / disabled trigger wrapper">
          {(["top", "right", "bottom", "left"] as const).map((side) => (
            <Tooltip key={side}><TooltipTrigger render={<Button variant="outline" />}>{side}</TooltipTrigger><TooltipContent side={side}>Tooltip {side}</TooltipContent></Tooltip>
          ))}
        </Row>
      </Section>

      <Section name="dropdown-menu" title="Dropdown Menu">
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="outline" />}>Open menu</DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuLabel>My account</DropdownMenuLabel>
              <DropdownMenuItem><PencilIcon />Edit<DropdownMenuShortcut>⌘E</DropdownMenuShortcut></DropdownMenuItem>
              <DropdownMenuItem><CopyIcon />Copy<DropdownMenuShortcut>⌘C</DropdownMenuShortcut></DropdownMenuItem>
              <DropdownMenuItem disabled>Disabled</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem checked={check} onCheckedChange={setCheck}>Show toolbar</DropdownMenuCheckboxItem>
            <DropdownMenuRadioGroup value={radio} onValueChange={setRadio}>
              <DropdownMenuRadioItem value="a">Option A</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="b">Option B</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
            <DropdownMenuSeparator />
            <DropdownMenuSub><DropdownMenuSubTrigger>More</DropdownMenuSubTrigger><DropdownMenuSubContent><DropdownMenuItem>Sub item</DropdownMenuItem></DropdownMenuSubContent></DropdownMenuSub>
            <DropdownMenuItem variant="destructive"><Trash2Icon />Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Section>

      <Section name="sonner" title="Sonner">
        <Row label="Toast types">
          <Button variant="outline" onClick={() => toast("Event created", { description: "Sunday, December 03, 2023" })}>Default</Button>
          <Button variant="outline" onClick={() => toast.success("Saved")}>Success</Button>
          <Button variant="outline" onClick={() => toast.error("Something failed")}>Error</Button>
          <Button variant="outline" onClick={() => toast.info("FYI")}>Info</Button>
          <Button variant="outline" onClick={() => toast.warning("Careful")}>Warning</Button>
          <Button variant="outline" onClick={() => toast("With action", { action: { label: "Undo", onClick: () => toast("Undone") } })}>Action</Button>
          <Button variant="outline" onClick={() => toast.promise(new Promise((r) => setTimeout(r, 1500)), { loading: "Working…", success: "Done", error: "Failed" })}><Loader2Icon className="hidden" />Promise</Button>
        </Row>
      </Section>

      <Section name="backdrop" title="Backdrop">
        <Row label="Click to show (click the backdrop to dismiss)">
          <Button variant="outline" onClick={() => setBackdrop("scrim")}>Scrim</Button>
          <Button variant="outline" onClick={() => setBackdrop("blur")}>Blur + spinner</Button>
        </Row>
        <Backdrop open={backdrop !== false} tone={backdrop === "blur" ? "blur" : "scrim"} onClick={() => setBackdrop(false)}>
          {backdrop === "blur" && <Loader2Icon className="size-10 animate-spin text-white" />}
        </Backdrop>
      </Section>
    </>
  )
}
