import Link from "next/link"
import type { Lang } from "app/i18n/config"

const copy: Record<Lang, { partOf: (n: number, total: number) => string; prevPart: string; nextPart: string }> = {
  en: {
    partOf: (n, total) => `Part ${n} of ${total} in`,
    prevPart: "← Prev part",
    nextPart: "Next Part →",
  },
  ja: {
    partOf: (n, total) => `${total}回シリーズ 第${n}回`,
    prevPart: "← 前の記事",
    nextPart: "次の記事 →",
  },
}

export function ReadingSeriesBadge({
  title,
  partNumber,
  total,
  prevHref,
  nextHref,
  lang = "en",
}: {
  title: string
  partNumber: number
  total: number
  prevHref?: string
  nextHref?: string
  lang?: Lang
}) {
  const t = copy[lang]

  return (
    <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[var(--text-muted)] bg-[var(--surface-sunken)] border border-[var(--border-subtle)] rounded-md px-3 py-2">
      <span>
        {t.partOf(partNumber, total)}{" "}
        <span className="font-medium text-[var(--text-strong)]">{title}</span>
      </span>
      <div className="flex items-center gap-3 md:ml-auto">
        {prevHref && (
          <Link href={prevHref} className="text-[var(--accent-text)] hover:underline">
            {t.prevPart}
          </Link>
        )}
        {nextHref && (
          <Link href={nextHref} className="font-medium inline-flex items-center gap-2 text-[var(--accent-text)] hover:underline">
            {t.nextPart}
          </Link>
        )}
      </div>
    </div>
  )
}
