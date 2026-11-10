import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"
import { List, ListItem } from "@/components/ui/list"
import EmptyState from "./EmptyState"
import PageHeader from "./PageHeader"
import Spinner from "./Spinner"

type Props<T> = {
  title: string
  Icon?: LucideIcon
  createLink?: string
  list: T[] | null | undefined
  isLoading: boolean
  /** Defaults to String(item). */
  renderItem?: (item: T) => ReactNode
  getKey?: (item: T, index: number) => string
  emptyState?: ReactNode
}

/** PageHeader + loading / empty / list states. */
export default function ListPage<T>({ title, Icon, createLink, list, isLoading, renderItem = String, getKey = (_, i) => String(i), emptyState }: Props<T>) {
  return (
    <div className="flex flex-col gap-4">
      <PageHeader title={title} Icon={Icon} createLink={createLink} />
      {isLoading ? (
        <Spinner />
      ) : !list || list.length === 0 ? (
        (emptyState ?? <EmptyState />)
      ) : (
        <List>{list.map((item, i) => <ListItem key={getKey(item, i)}>{renderItem(item)}</ListItem>)}</List>
      )}
    </div>
  )
}
