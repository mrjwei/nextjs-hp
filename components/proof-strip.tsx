import type { ProofItem } from "app/content/profile"

export function ProofStrip({ items }: { items: ProofItem[] }) {
  if (!items.length) return null

  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-6 md:grid-cols-4 md:gap-8">
      {items.map((item, i) => (
        <p
          key={i}
          className="text-sm font-medium leading-snug text-[var(--text-strong)]"
        >
          {item.label}
        </p>
      ))}
    </div>
  )
}
