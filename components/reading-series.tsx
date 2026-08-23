import Link from "next/link"

export function ReadingSeriesBadge({
  title,
  partNumber,
  total,
  prevHref,
  nextHref,
}: {
  title: string
  partNumber: number
  total: number
  prevHref?: string
  nextHref?: string
}) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[var(--text-muted)] bg-[var(--surface-sunken)] border border-[var(--border-subtle)] rounded-md px-3 py-2">
      <span>
        Part {partNumber} of {total} in{" "}
        <span className="font-medium text-[var(--text-strong)]">{title}</span>
      </span>
      <div className="flex items-center gap-3 md:ml-auto">
        {prevHref && (
          <Link href={prevHref} className="text-[var(--accent-text)] hover:underline">
            ← Prev part
          </Link>
        )}
        {nextHref && (
          <Link href={nextHref} className="font-medium inline-flex items-center gap-2 text-[var(--accent-text)] hover:underline">
            Next Part →
          </Link>
        )}
      </div>
    </div>
  )
}
