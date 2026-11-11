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
        {groups.map(({ items, name }) => (
          <Fragment key={name}>
            {groups.length > 1 && <ListSubheader>{name}</ListSubheader>}
            {items.map(({ id, title }) => (
              <ListItem key={id} asChild selected={active === id}>
                <a href={`#${id}`} onClick={(e) => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }) }}>
                  <ListItemText primary={title} className="[&>span]:text-sm" />
                </a>
              </ListItem>
            ))}
          </Fragment>
        ))}
      </List>
    </nav>
  )
}
