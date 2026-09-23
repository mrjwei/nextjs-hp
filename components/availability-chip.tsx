import { formatDate } from "app/utils"
import type { Lang } from "app/i18n/config"

const updatedLabel: Record<Lang, string> = {
  en: "Updated",
  ja: "更新日",
}

export function AvailabilityChip({
  availability,
  lang = "en",
}: {
  availability: { open: boolean; text: string; updated: string }
  lang?: Lang
}) {
  if (!availability.open) return null

  return (
    <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-card)] px-3 py-1.5 text-sm text-[var(--text-body)]">
      <span
        className="size-2 shrink-0 rounded-full bg-[var(--success)]"
        aria-hidden="true"
      />
      <span>{availability.text}</span>
      <span className="text-[var(--text-subtle)]">
        · {updatedLabel[lang]} {formatDate(availability.updated)}
      </span>
    </div>
  )
}
