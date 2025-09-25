import { TCategory } from "app/components/sidebar"
import { Item } from "app/components/sidebar/Item"

export function Sidebar({
  items,
  targetValue,
  classname,
}: {
  items: (TCategory & { href: string; length: number })[]
  targetValue: string | undefined
  classname?: string
}) {
  return (
    <aside className={classname}>
      <ul className="flex flex-wrap gap-2 md:block md:gap-0">
        {items.map((item) => {
          return (
            <li key={item.label}>
              <Item label={item.label} href={item.href} shouldHighlight={targetValue === item.value} length={item.length} />
            </li>
          )
        })}
      </ul>
    </aside>
  )
}
