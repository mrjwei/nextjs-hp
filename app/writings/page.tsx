import { Grid } from "@/components/grid"
import { getAllSortedWritings } from "app/utils"
import { normalizeTag, formatTagLabel } from "app/utils/tags"
import { buildStandardMetadata } from "app/seo/metadata"
import Link from "next/link"
import { WritingsTagFilter } from "app/writings/writings-tag-filter.client"
import tagsData from "app/data/tags.json"

export const metadata = buildStandardMetadata({
  title: "Writing",
  description:
    "Technical and design writing — cryptography, AI agents, design systems, and the reasoning behind them.",
  pathname: "/writings",
})

export const dynamic = "force-static"

export default async function Page() {
  const writings = getAllSortedWritings()

  const knownTags: Record<string, { color: string }> = tagsData

  const tagCounts = new Map<string, number>(
    Object.keys(knownTags).map((tag) => [tag, 0])
  )
  for (const writing of writings) {
    const seen = new Set<string>()
    for (const rawTag of writing.metadata.tags ?? []) {
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

  return (
    <WritingsTagFilter tags={tags} totalCount={writings.length}>
      {writings.length === 0 ? (
        <div className="text-[var(--text-body)] bg-[var(--surface-card)] rounded-lg border border-[var(--border-subtle)] p-8 shadow-xs">
          <p className="mb-3 font-medium text-[var(--text-strong)]">No writings found.</p>
        </div>
      ) : (
        <>
          <Grid writings={writings} selectedTags={[]} />
          <div
            id="writings-empty-state"
            className="hidden text-[var(--text-body)] bg-[var(--surface-card)] rounded-lg border border-[var(--border-subtle)] p-8 shadow-xs"
          >
            <p className="mb-3 font-medium text-[var(--text-strong)]">
              No writings found for those tags.
            </p>
            <Link
              href="/writings"
              className="text-[var(--accent-text)] hover:underline font-medium transition-colors"
            >
              View all writings
            </Link>
          </div>
        </>
      )}
    </WritingsTagFilter>
  )
}
