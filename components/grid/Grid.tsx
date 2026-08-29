import { TWriting } from "@/components/grid"
import { WritingCard } from "@/components/article-card"
import type { Lang } from "app/i18n/config"

export function Grid({
  writings,
  numWritings,
  className = "",
  from,
  path = "writings",
  selectedTags,
  lang = "en",
}: {
  writings: TWriting[]
  numWritings?: number
  className?: string
  from?: string
  path?: string
  selectedTags?: string[]
  lang?: Lang
}) {
  if (numWritings) {
    writings = writings.slice(0, numWritings)
  }

  return (
    <div className={className}>
      <div className="grid grid-cols-12 gap-y-8 md:gap-8">
        {writings.map((article) => (
          <WritingCard
            key={article.slug}
            article={article}
            from={from}
            path={path}
            selectedTags={selectedTags}
            lang={lang}
            wrapperProps={{
              "data-writing-tags":
                path === "writings" ? (article.metadata.tags ?? []).join(",") : undefined,
              "data-portfolio-collection":
                path === "portfolio"
                  ? String(article.metadata.series || "general")
                  : undefined,
            }}
          />
        ))}
      </div>
    </div>
  )
}
