import { WritingCard } from "@/components/posts/article-card"
import type { Lang } from "@/lib/i18n/config"
import type { TMetadata } from "@/lib/content"

export type TWriting = {
  metadata: TMetadata
  slug: string
  content?: string
}

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
            }}
          />
        ))}
      </div>
    </div>
  )
}
