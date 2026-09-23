import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { CustomMDX } from "@/components/mdx"
import { getPageContent } from "app/pages-content"
import { formatDate } from "app/utils"
import type { Lang } from "app/i18n/config"

const copy: Record<Lang, { eyebrow: string; heading: string; updated: string; cta: string }> = {
  en: {
    eyebrow: "Now",
    heading: "What I'm on",
    updated: "Updated",
    cta: "See what else I'm on",
  },
  ja: {
    eyebrow: "Now",
    heading: "いま取り組んでいること",
    updated: "更新日",
    cta: "続きを見る",
  },
}

export function NowBand({ lang = "en" }: { lang?: Lang }) {
  const t = copy[lang]
  const now = getPageContent("now", lang)
  const excerpt = now.content.split(/\n{2,}/).slice(0, 2).join("\n\n")
  const href = lang === "ja" ? "/ja/now" : "/now"

  return (
    <div>
      <div className="mb-6 flex items-end justify-between">
        <div>
          <span className="eyebrow">{t.eyebrow}</span>
          <h2 className="mt-2.5 text-3xl font-semibold tracking-tight text-[var(--text-strong)]">
            {t.heading}
          </h2>
        </div>
        {now.metadata.updatedAt && (
          <p className="text-sm text-[var(--text-subtle)]">
            {t.updated} {formatDate(now.metadata.updatedAt)}
          </p>
        )}
      </div>
      <div className="max-w-[65ch] text-base leading-relaxed text-[var(--text-body)] [&>p]:mb-4 [&>p:last-child]:mb-0">
        <CustomMDX source={excerpt} />
      </div>
      <Link
        href={href}
        className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-[var(--accent-text)] hover:underline"
      >
        {t.cta}
        <ArrowRight className="size-4" />
      </Link>
    </div>
  )
}
