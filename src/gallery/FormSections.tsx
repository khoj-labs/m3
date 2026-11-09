import { useState } from "react"
import { BoldIcon, ItalicIcon, UnderlineIcon, MailIcon, SearchIcon, PlusIcon, DownloadIcon, Loader2Icon } from "lucide-react"
import { Section, Row } from "./Section"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Toggle } from "@/components/ui/toggle"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Combobox, ComboboxChip, ComboboxChips, ComboboxChipsInput, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList, ComboboxValue } from "@/components/ui/combobox"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Rating } from "@/components/ui/rating"
import { TransferList } from "@/components/ui/transfer-list"
import { Label } from "@/components/ui/label"
import { Fab } from "@/components/ui/fab"
import { SpeedDial } from "@/components/ui/speed-dial"
import { CopyIcon, PrinterIcon, ShareIcon, SaveIcon } from "lucide-react"

const frameworks = ["React", "Vue", "Svelte", "Solid", "Angular", "Qwik"]

export function FormSections() {
  const [rating, setRating] = useState(3)
  const [range, setRange] = useState([20, 70])
  const [multi, setMulti] = useState<string[]>(["React"])
  return (
    <>
      <Section name="button" title="Button">
        <Row label="Variants">
          {(["default", "secondary", "outline", "ghost", "destructive", "link"] as const).map((v) => (
            <Button key={v} variant={v}>{v}</Button>
          ))}
        </Row>
        <Row label="Sizes">
          {(["xs", "sm", "default", "lg"] as const).map((s) => <Button key={s} size={s}>{s}</Button>)}
          {(["icon-xs", "icon-sm", "icon", "icon-lg"] as const).map((s) => (
            <Button key={s} size={s} variant="outline" aria-label={s}><PlusIcon /></Button>
          ))}
        </Row>
        <Row label="With icon / loading / disabled">
          <Button><DownloadIcon data-icon="inline-start" />Download</Button>
          <Button variant="secondary"><Loader2Icon className="animate-spin" data-icon="inline-start" />Loading</Button>
          {(["default", "secondary", "outline", "ghost", "destructive", "link"] as const).map((v) => (
            <Button key={v} variant={v} disabled>{v} disabled</Button>
          ))}
        </Row>
      </Section>

      <Section name="label" title="Label">
        <Row label="Paired with controls (used throughout this page)">
          <div className="flex flex-col gap-2"><Label htmlFor="lbl-demo">Email</Label><Input id="lbl-demo" placeholder="you@example.com" className="w-56" /></div>
          <Label><Checkbox /> Inline label</Label>
        </Row>
      </Section>

      <Section name="checkbox" title="Checkbox">
        <Row label="States">
          <Label><Checkbox /> Unchecked</Label>
          <Label><Checkbox defaultChecked /> Checked</Label>
          <Label><Checkbox checked="indeterminate" /> Indeterminate</Label>
          <Label><Checkbox disabled /> Disabled</Label>
          <Label><Checkbox disabled defaultChecked /> Disabled checked</Label>
          <Label><Checkbox aria-invalid defaultChecked={false} /> Invalid</Label>
        </Row>
      </Section>

      <Section name="radio-group" title="Radio Group">
        <Row label="Vertical / horizontal / disabled item / invalid">
          <RadioGroup defaultValue="a">
            {["a", "b"].map((v) => <Label key={v}><RadioGroupItem value={v} /> Option {v.toUpperCase()}</Label>)}
            <Label><RadioGroupItem value="c" disabled /> Disabled</Label>
          </RadioGroup>
          <RadioGroup defaultValue="b" className="flex gap-4">
            {["a", "b", "c"].map((v) => <Label key={v}><RadioGroupItem value={v} /> {v.toUpperCase()}</Label>)}
          </RadioGroup>
          <RadioGroup disabled defaultValue="a">
            <Label><RadioGroupItem value="a" /> Group disabled</Label>
          </RadioGroup>
          <RadioGroup>
            <Label><RadioGroupItem value="a" aria-invalid /> Invalid</Label>
          </RadioGroup>
        </Row>
      </Section>

      <Section name="select" title="Select">
        <Row label="Default / small / with groups / disabled / invalid">
          <Select defaultValue="apple">
            <SelectTrigger className="w-44"><SelectValue placeholder="Fruit" /></SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Fruits</SelectLabel>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="cherry" disabled>Cherry (disabled)</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger size="sm" className="w-44"><SelectValue placeholder="Small" /></SelectTrigger>
            <SelectContent><SelectItem value="x">X</SelectItem><SelectItem value="y">Y</SelectItem></SelectContent>
          </Select>
          <Select disabled>
            <SelectTrigger className="w-44"><SelectValue placeholder="Disabled" /></SelectTrigger>
            <SelectContent><SelectItem value="x">X</SelectItem></SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-44" aria-invalid><SelectValue placeholder="Invalid" /></SelectTrigger>
            <SelectContent><SelectItem value="x">X</SelectItem></SelectContent>
          </Select>
        </Row>
      </Section>

      <Section name="slider" title="Slider">
        <Row label="Single / range / disabled / vertical" className="items-start">
          <Slider defaultValue={[40]} className="w-48" />
          <Slider value={range} onValueChange={setRange} className="w-48" />
          <Slider defaultValue={[60]} disabled className="w-48" />
          <Slider defaultValue={[50]} orientation="vertical" className="h-24" />
        </Row>
      </Section>

      <Section name="switch" title="Switch">
        <Row label="Sizes and states">
          <Label><Switch /> Off</Label>
          <Label><Switch defaultChecked /> On</Label>
          <Label><Switch size="sm" defaultChecked /> Small</Label>
          <Label><Switch disabled /> Disabled</Label>
          <Label><Switch disabled defaultChecked /> Disabled on</Label>
        </Row>
      </Section>

      <Section name="input" title="Input">
        <Row label="Types and states">
          <Input placeholder="Default" className="w-44" />
          <Input defaultValue="With value" className="w-44" />
          <Input type="password" defaultValue="secret" className="w-44" />
          <Input type="file" className="w-56" />
          <Input disabled placeholder="Disabled" className="w-44" />
          <Input aria-invalid placeholder="Invalid" className="w-44" />
        </Row>
      </Section>

      <Section name="input-group" title="Input Group">
        <Row label="Addons">
          <InputGroup className="w-56"><InputGroupAddon><SearchIcon /></InputGroupAddon><InputGroupInput placeholder="Search…" /></InputGroup>
          <InputGroup className="w-56"><InputGroupInput placeholder="Email" /><InputGroupAddon align="inline-end"><MailIcon /></InputGroupAddon></InputGroup>
        </Row>
      </Section>

      <Section name="textarea" title="Textarea">
        <Row label="Default / disabled / invalid">
          <Textarea placeholder="Default" className="w-56" />
          <Textarea disabled placeholder="Disabled" className="w-56" />
          <Textarea aria-invalid placeholder="Invalid" className="w-56" />
        </Row>
      </Section>

      <Section name="toggle" title="Toggle">
        <Row label="Variants / sizes / states">
          <Toggle aria-label="bold"><BoldIcon /></Toggle>
          <Toggle variant="outline" aria-label="italic"><ItalicIcon /></Toggle>
          <Toggle variant="outline" defaultPressed aria-label="pressed"><UnderlineIcon /></Toggle>
          <Toggle size="sm" variant="outline"><BoldIcon />Small</Toggle>
          <Toggle size="lg" variant="outline"><BoldIcon />Large</Toggle>
          <Toggle disabled variant="outline"><BoldIcon />Disabled</Toggle>
        </Row>
      </Section>

      <Section name="toggle-group" title="Toggle Group">
        <Row label="Single / multiple / outline / disabled">
          <ToggleGroup type="single" defaultValue="left">
            <ToggleGroupItem value="left">Left</ToggleGroupItem>
            <ToggleGroupItem value="center">Center</ToggleGroupItem>
            <ToggleGroupItem value="right">Right</ToggleGroupItem>
          </ToggleGroup>
          <ToggleGroup type="multiple" variant="outline" defaultValue={["b"]}>
            <ToggleGroupItem value="b" aria-label="bold"><BoldIcon /></ToggleGroupItem>
            <ToggleGroupItem value="i" aria-label="italic"><ItalicIcon /></ToggleGroupItem>
            <ToggleGroupItem value="u" aria-label="underline"><UnderlineIcon /></ToggleGroupItem>
          </ToggleGroup>
          <ToggleGroup type="single" variant="outline" disabled>
            <ToggleGroupItem value="a">A</ToggleGroupItem>
            <ToggleGroupItem value="b">B</ToggleGroupItem>
          </ToggleGroup>
        </Row>
      </Section>

      <Section name="combobox" title="Combobox">
        <Row label="Single / multiple chips / disabled">
          <Combobox items={frameworks} defaultValue="React">
            <ComboboxInput placeholder="Framework" className="w-48" />
            <ComboboxContent>
              <ComboboxEmpty>No results.</ComboboxEmpty>
              <ComboboxList>{(item: string) => <ComboboxItem key={item} value={item}>{item}</ComboboxItem>}</ComboboxList>
            </ComboboxContent>
          </Combobox>
          <Combobox items={frameworks} multiple value={multi} onValueChange={setMulti}>
            <ComboboxChips className="w-64">
              <ComboboxValue>
                {(values: string[]) => (
                  <>
                    {values.map((v) => <ComboboxChip key={v}>{v}</ComboboxChip>)}
                    <ComboboxChipsInput placeholder="Add…" />
                  </>
                )}
              </ComboboxValue>
            </ComboboxChips>
            <ComboboxContent>
              <ComboboxEmpty>No results.</ComboboxEmpty>
              <ComboboxList>{(item: string) => <ComboboxItem key={item} value={item}>{item}</ComboboxItem>}</ComboboxList>
            </ComboboxContent>
          </Combobox>
          <Combobox items={frameworks} disabled>
            <ComboboxInput placeholder="Disabled" className="w-48" />
          </Combobox>
        </Row>
      </Section>

      <Section name="rating" title="Rating">
        <Row label="Interactive / half precision / read-only / disabled / sizes">
          <Rating value={rating} onValueChange={setRating} />
          <Rating defaultValue={2.5} precision={0.5} />
          <Rating value={4} readOnly />
          <Rating defaultValue={3} disabled />
          <Rating size="sm" defaultValue={2} />
          <Rating size="lg" defaultValue={4} max={7} />
        </Row>
      </Section>

      <Section name="transfer-list" title="Transfer List">
        <Row label="Interactive (with a disabled item)">
          <TransferList
            items={[
              { id: "1", label: "Alpha" }, { id: "2", label: "Bravo" }, { id: "3", label: "Charlie" },
              { id: "4", label: "Delta", disabled: true }, { id: "5", label: "Echo" }, { id: "6", label: "Foxtrot" },
            ]}
            defaultValue={["5"]}
          />
        </Row>
      </Section>

      <Section name="fab" title="FAB">
        <Row label="Variants">
          {(["primary", "secondary", "tertiary", "surface", "solid"] as const).map((v) => (
            <Fab key={v} variant={v} aria-label={v}><PlusIcon /></Fab>
          ))}
        </Row>
        <Row label="Sizes / extended / disabled">
          <Fab size="sm" aria-label="small"><PlusIcon /></Fab>
          <Fab aria-label="default"><PlusIcon /></Fab>
          <Fab size="lg" aria-label="large"><PlusIcon /></Fab>
          <Fab extended><PlusIcon />Compose</Fab>
          <Fab extended variant="tertiary" size="lg"><PlusIcon />Large extended</Fab>
          <Fab disabled aria-label="disabled"><PlusIcon /></Fab>
        </Row>
      </Section>

      <Section name="speed-dial" title="Speed Dial">
        <Row label="Directions (click to open; Esc closes). Second is open by default." className="min-h-64 gap-32 pl-16 pt-48">
          {(["up", "down", "left", "right"] as const).map((d, i) => (
            <SpeedDial
              key={d}
              direction={d}
              defaultOpen={i === 0}
              className={d === "down" ? "-mt-40" : undefined}
              actions={[
                { key: "copy", icon: <CopyIcon />, label: "Copy" },
                { key: "save", icon: <SaveIcon />, label: "Save" },
                { key: "print", icon: <PrinterIcon />, label: "Print" },
                { key: "share", icon: <ShareIcon />, label: "Share" },
              ]}
            />
          ))}
        </Row>
      </Section>
    </>
  )
}
