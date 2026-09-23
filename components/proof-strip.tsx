import Link from "next/link"
import type { ProofItem } from "app/content/profile"

export function ProofStrip({ items }: { items: ProofItem[] }) {
  if (!items.length) return null

  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-6 md:grid-cols-4 md:gap-8">
      {items.map((item, i) => {
        const fact = (
          <p className="text-sm font-medium leading-snug text-[var(--text-strong)]">
            {item.label}
          </p>
        )
        return (
          <div key={i} className="border-t border-[var(--border-subtle)] pt-3">
            {item.href ? (
              <Link href={item.href} className="block hover:underline">
                {fact}
              </Link>
            ) : (
              fact
            )}
          </div>
        )
      })}
    </div>
  )
}
