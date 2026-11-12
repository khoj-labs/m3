import { cn } from "cn"
import { ChevronRightIcon, ChevronLeftIcon, ChevronsRightIcon, ChevronsLeftIcon } from "lucide-react"
import * as React from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Paper } from "@/components/ui/paper"

type TransferItem = { id: string; label: string; disabled?: boolean }

type TransferListProps = Omit<React.ComponentProps<"div">, "onChange" | "defaultValue"> & {
  items: TransferItem[]
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
  titles?: [string, string]
  /** ids currently in the right-hand list */
  value?: string[]
}

function TransferList({
  className,
  items,
  value: valueProp,
  defaultValue = [],
  onValueChange,
  titles = ["Available", "Chosen"],
  ...props
}: TransferListProps) {
  const [inner, setInner] = React.useState(defaultValue)
  const right = valueProp ?? inner
  const [checked, setChecked] = React.useState<string[]>([])

  const rightItems = items.filter((i) => right.includes(i.id))
  const leftItems = items.filter((i) => !right.includes(i.id))
  const isIn = (list: TransferItem[], id: string) => list.some((i) => i.id === id)
  const checkedLeft = checked.filter((id) => isIn(leftItems, id))
  const checkedRight = checked.filter((id) => isIn(rightItems, id))

  const setRight = (next: string[]) => {
    if (valueProp === undefined) setInner(next)
    onValueChange?.(next)
    setChecked([])
  }
  const toggle = (id: string) => setChecked((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]))

  const movable = (list: TransferItem[]) => list.filter((i) => !i.disabled).map((i) => i.id)

  const panel = (title: string, list: TransferItem[], checkedIds: string[]) => {
    const enabled = movable(list)
    const allChecked = enabled.length > 0 && enabled.every((id) => checkedIds.includes(id))
    const some = checkedIds.length > 0 && !allChecked
    return (
      <Paper variant="outlined" elevation={0} className="flex min-h-64 w-56 flex-col overflow-hidden" data-slot="transfer-list-panel">
        <div className="flex items-center gap-3 border-b border-md-outline-variant px-3 py-2">
          <Checkbox
            aria-label={`Select all in ${title}`}
            checked={allChecked}
            indeterminate={some}
            disabled={enabled.length === 0}
            onCheckedChange={() =>
              setChecked((c) => (allChecked ? c.filter((id) => !enabled.includes(id)) : [...new Set([...c, ...enabled])]))
            }
          />
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-medium">{title}</span>
            <span className="text-xs text-md-on-surface-variant">
              {checkedIds.length}/{list.length} selected
            </span>
          </div>
        </div>
        <ul role="list" className="m-0 flex-1 list-none overflow-auto p-1">
          {list.map((item) => (
            <li key={item.id}>
              <label
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-1.5 text-sm hover:bg-md-on-surface/8",
                  item.disabled && "pointer-events-none opacity-40"
                )}
              >
                <Checkbox checked={checked.includes(item.id)} disabled={item.disabled} onCheckedChange={() => toggle(item.id)} />
                {item.label}
              </label>
            </li>
          ))}
        </ul>
      </Paper>
    )
  }

  return (
    <div data-slot="transfer-list" className={cn("inline-flex items-center gap-3", className)} {...props}>
      {panel(titles[0], leftItems, checkedLeft)}
      <div className="flex flex-col gap-1" role="group" aria-label="Transfer controls">
        <Button variant="outline" size="icon-sm" aria-label="Move all right" disabled={movable(leftItems).length === 0}
          onClick={() => setRight([...right, ...movable(leftItems)])}><ChevronsRightIcon /></Button>
        <Button variant="outline" size="icon-sm" aria-label="Move selected right" disabled={checkedLeft.length === 0}
          onClick={() => setRight([...right, ...checkedLeft])}><ChevronRightIcon /></Button>
        <Button variant="outline" size="icon-sm" aria-label="Move selected left" disabled={checkedRight.length === 0}
          onClick={() => setRight(right.filter((id) => !checkedRight.includes(id)))}><ChevronLeftIcon /></Button>
        <Button variant="outline" size="icon-sm" aria-label="Move all left" disabled={movable(rightItems).length === 0}
          onClick={() => setRight(right.filter((id) => !movable(rightItems).includes(id)))}><ChevronsLeftIcon /></Button>
      </div>
      {panel(titles[1], rightItems, checkedRight)}
    </div>
  )
}

export { TransferList, type TransferItem }
