import Link from "next/link"
import { Grid } from "@/components/grid"
import { BackLink } from "@/components/back-link"
import { WritingsTagFilter, TSeriesFacet } from "app/writings/writings-tag-filter.client"
import { normalizeTag, formatTagLabel } from "app/utils/tags"
import type { TContentMeta } from "app/utils"
import tagsData from "app/data/tags.json"

export function SeriesView({
  seriesSlug,
  seriesTitle,
  items,
  allSeries,
}: {
  seriesSlug: string
  seriesTitle: string
  items: TContentMeta[]
  allSeries: TSeriesFacet[]
}) {
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

  const basePath = `/writings/${seriesSlug}`

  return (
    <WritingsTagFilter
      basePath={basePath}
      tags={tags}
      totalCount={items.length}
      series={allSeries}
      heading={
        <>
          <nav aria-label="Breadcrumb" className="text-sm text-[var(--text-muted)] mb-4">
            <Link href="/" className="hover:underline hover:text-[var(--text-strong)] transition-colors">
              Home
            </Link>
            <span className="mx-2 text-[var(--text-subtle)]">/</span>
            <Link href="/writings" className="hover:underline hover:text-[var(--text-strong)] transition-colors">
              Writings
            </Link>
            <span className="mx-2 text-[var(--text-subtle)]">/</span>
            <span className="text-[var(--text-strong)]">{seriesTitle}</span>
          </nav>

          <div className="flex items-center justify-between mb-3">
            <span className="eyebrow">Series</span>
            <BackLink href="/writings" label="Back to All Writings" />
          </div>
          <h1 className="mb-3 text-3xl md:text-4xl font-semibold tracking-tight text-[var(--text-strong)]">
            {seriesTitle}
          </h1>
          <p className="text-lg text-[var(--text-muted)] mb-6">
            {items.length} {items.length === 1 ? "post" : "posts"} in this series.
          </p>
        </>
      }
    >
      <Grid writings={items} selectedTags={[]} />
      <div
        id="writings-empty-state"
        className="hidden text-[var(--text-body)] bg-[var(--surface-card)] rounded-lg border border-[var(--border-subtle)] p-8 shadow-xs"
      >
        <p className="mb-3 font-medium text-[var(--text-strong)]">
          No writings found for those tags.
        </p>
        <Link
          href={basePath}
          className="text-[var(--accent-text)] hover:underline font-medium transition-colors"
        >
          View all writings in this series
        </Link>
      </div>
    </WritingsTagFilter>
  )
}
