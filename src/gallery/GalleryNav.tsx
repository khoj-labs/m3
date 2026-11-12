import { ChevronRightIcon } from "lucide-react"
import { Fragment, useEffect, useState } from "react"
import { List, ListItem, ListItemText, ListSubheader } from "@/components/ui/list"

type Group = { items: { id: string; title: string }[]; name: string }

/**
 * Left index. Built from the sections actually rendered (`[data-group] > [data-gallery]`),
 * so adding a Section to a group adds it here with no other change.
 */
export function GalleryNav({ tab }: { tab: string }) {
  const [groups, setGroups] = useState<Group[]>([])
  const [active, setActive] = useState("")
  const [open, setOpen] = useState<Set<string>>(new Set()) // collapsed by default

  useEffect(() => {
    let observer: IntersectionObserver | undefined
    let signature = ""

    function scan() {
      const sections = [...document.querySelectorAll<HTMLElement>("[data-group] [data-gallery]")]
      const next = sections.map((s) => s.id).join()
      if (next === signature) return
      signature = next
      const byGroup = new Map<string, Group>()
      for (const s of sections) {
        const name = s.closest<HTMLElement>("[data-group]")?.dataset.group ?? ""
        const group = byGroup.get(name) ?? { items: [], name }
        group.items.push({ id: s.id, title: s.querySelector("[data-slot=typography]")?.textContent ?? s.id })
        byGroup.set(name, group)
      }
      setGroups([...byGroup.values()])
      setActive(sections[0]?.id ?? "")

      observer?.disconnect()
      observer = new IntersectionObserver(
        (entries) => {
          const top = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
          if (top) setActive(top.target.id)
        },
        { rootMargin: "-80px 0px -65% 0px" }
      )
      sections.forEach((s) => observer?.observe(s))
    }

    scan()
    // Sections can appear later (lazy tab content), so rescan when the page changes.
    const mutations = new MutationObserver(scan)
    mutations.observe(document.body, { childList: true, subtree: true })
    return () => {
      mutations.disconnect()
      observer?.disconnect()
    }
  }, [tab])

  return (
    <nav aria-label="Components" className="max-h-[calc(100vh-6rem)] overflow-y-auto">
      <List dense>
        {groups.map(({ items, name }) => {
          // A lone group has nothing to collapse into, so its items always show.
          const collapsible = groups.length > 1
          const expanded = !collapsible || open.has(name)
          const holdsActive = items.some((item) => item.id === active)
          return (
            <Fragment key={name}>
              {collapsible && (
                <ListSubheader className="px-0 pt-1 pb-0">
                  <button
                    type="button"
                    aria-expanded={expanded}
                    onClick={() => setOpen((prev) => { const next = new Set(prev); if (!next.delete(name)) next.add(name); return next })}
                    className="flex w-full items-center gap-1 rounded-full px-4 py-2 text-left text-sm font-medium outline-none hover:bg-md-surface-container-high focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <ChevronRightIcon aria-hidden className={`size-4 transition-transform duration-(--motion-duration-short) ease-standard ${expanded ? "rotate-90" : ""}`} />
                    <span className="flex-1">{name}</span>
                    {!expanded && holdsActive && <span aria-label="contains the section in view" className="size-1.5 rounded-full bg-md-primary" />}
                  </button>
                </ListSubheader>
              )}
              {expanded && items.map(({ id, title }) => (
                <ListItem
                  key={id}
                  selected={active === id}
                  render={<a href={`#${id}`} onClick={(e) => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }) }} />}
                >
                  <ListItemText primary={title} className="[&>span]:text-sm" />
                </ListItem>
              ))}
            </Fragment>
          )
        })}
      </List>
    </nav>
  )
}
