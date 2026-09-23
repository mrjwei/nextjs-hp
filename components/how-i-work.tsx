import Link from "next/link"
import { MessagesSquare, Workflow, FlaskConical } from "lucide-react"
import type { HowIWorkItem } from "app/content/profile"

const icons = [MessagesSquare, Workflow, FlaskConical]

export function HowIWork({ items }: { items: HowIWorkItem[] }) {
  if (!items.length) return null

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-10">
      {items.map((item, i) => {
        const Icon = icons[i % icons.length]
        const body = (
          <>
            <Icon className="size-5 text-[var(--accent-text)]" strokeWidth={1.75} />
            <h3 className="mt-4 text-base font-semibold text-[var(--text-strong)]">
              {item.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
              {item.body}
            </p>
          </>
        )
        return item.href ? (
          <Link key={item.title} href={item.href} className="group block">
            {body}
          </Link>
        ) : (
          <div key={item.title}>{body}</div>
        )
      })}
    </div>
  )
}
