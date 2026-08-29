import Link from "next/link"
import { Grid } from "@/components/grid"
import { BackLink } from "@/components/back-link"
import { WritingsTagFilter, TSeriesFacet } from "app/writings/writings-tag-filter.client"
import { normalizeTag, formatTagLabel } from "app/utils/tags"
import type { TContentMeta } from "app/utils"
import type { Lang } from "app/i18n/config"
import tagsData from "app/data/tags.json"

const copy: Record<
  Lang,
  {
    home: string
    writings: string
    series: string
    backToAll: string
    postCount: (n: number) => string
    noneForTags: string
    viewAllInSeries: string
  }
> = {
  en: {
    home: "Home",
    writings: "Writings",
    series: "Series",
    backToAll: "Back to All Writings",
    postCount: (n) => `${n} ${n === 1 ? "post" : "posts"} in this series.`,
    noneForTags: "No writings found for those tags.",
    viewAllInSeries: "View all writings in this series",
  },
  ja: {
    home: "ホーム",
    writings: "記事",
    series: "シリーズ",
    backToAll: "記事一覧に戻る",
    postCount: (n) => `このシリーズの記事: ${n}件。`,
    noneForTags: "該当するタグの記事が見つかりませんでした。",
    viewAllInSeries: "このシリーズの記事をすべて見る",
  },
}

export function SeriesView({
  seriesSlug,
  seriesTitle,
  items,
  allSeries,
  lang = "en",
}: {
  seriesSlug: string
  seriesTitle: string
  items: TContentMeta[]
  allSeries: TSeriesFacet[]
  lang?: Lang
}) {
  const t = copy[lang]
  const knownTags: Record<string, { color: string }> = tagsData

  const tagCounts = new Map<string, number>(
    Object.keys(knownTags).map((tag) => [tag, 0])
  )
  for (const item of items) {
    const seen = new Set<string>()
    for (const rawTag of item.metadata.tags ?? []) {
      const tag = normalizeTag(rawTag)
      if (!tag || seen.has(tag) || !tagCounts.has(tag)) continue
      seen.add(tag)
      tagCounts.set(tag, tagCounts.get(tag)! + 1)
    }
  }

  const tags = Array.from(tagCounts.entries())
    .map(([value, count]) => ({
      value,
      label: formatTagLabel(value),
      count,
      color: knownTags[value].color,
    }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))

  const writingsRoot = lang === "ja" ? "/ja/writings" : "/writings"
  const basePath = `${writingsRoot}/${seriesSlug}`
  const homeHref = lang === "ja" ? "/ja" : "/"

  return (
    <WritingsTagFilter
      basePath={basePath}
      tags={tags}
      totalCount={items.length}
      series={allSeries}
      lang={lang}
      heading={
        <>
          <nav aria-label="Breadcrumb" className="text-sm text-[var(--text-muted)] mb-4">
            <Link href={homeHref} className="hover:underline hover:text-[var(--text-strong)] transition-colors">
              {t.home}
            </Link>
            <span className="mx-2 text-[var(--text-subtle)]">/</span>
            <Link href={writingsRoot} className="hover:underline hover:text-[var(--text-strong)] transition-colors">
              {t.writings}
            </Link>
            <span className="mx-2 text-[var(--text-subtle)]">/</span>
            <span className="text-[var(--text-strong)]">{seriesTitle}</span>
          </nav>

          <div className="flex items-center justify-between mb-3">
            <span className="eyebrow">{t.series}</span>
            <BackLink href={writingsRoot} label={t.backToAll} />
          </div>
          <h1 className="mb-3 text-3xl md:text-4xl font-semibold tracking-tight text-[var(--text-strong)]">
            {seriesTitle}
          </h1>
          <p className="text-lg text-[var(--text-muted)] mb-6">
            {t.postCount(items.length)}
          </p>
        </>
      }
    >
      <Grid writings={items} selectedTags={[]} path="writings" lang={lang} />
      <div
        id="writings-empty-state"
        className="hidden text-[var(--text-body)] bg-[var(--surface-card)] rounded-lg border border-[var(--border-subtle)] p-8 shadow-xs"
      >
        <p className="mb-3 font-medium text-[var(--text-strong)]">
          {t.noneForTags}
        </p>
        <Link
          href={basePath}
          className="text-[var(--accent-text)] hover:underline font-medium transition-colors"
        >
          {t.viewAllInSeries}
        </Link>
      </div>
    </WritingsTagFilter>
  )
}
