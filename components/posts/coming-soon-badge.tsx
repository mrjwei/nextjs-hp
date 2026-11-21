import { Badge } from "@/components/ui/badge"
import type { Lang } from "@/lib/i18n/config"

const copy: Record<Lang, { label: string; title: string }> = {
  en: { label: "Coming soon", title: "This post hasn't been published yet." },
  ja: { label: "近日公開", title: "この記事は準備中です。" },
}

// Shown on cards and post pages for posts with `placeholder: true` (including
// posts scheduled for a later date, which the content index marks as placeholders).
export function ComingSoonBadge({
  lang = "en",
  className,
}: {
  lang?: Lang
  className?: string
}) {
  const t = copy[lang]

  return (
    <Badge tone="warning" title={t.title} className={className}>
      <svg aria-hidden="true" viewBox="0 0 16 16" className="size-3" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="8" cy="8" r="6.25" />
        <path d="M8 4.75V8l2.25 1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {t.label}
    </Badge>
  )
}
