import { Grid } from "@/components/grid"
import { getAllSortedWritings, getAllSortedWritingSeries } from "app/utils"
import { normalizeTag, formatTagLabel } from "app/utils/tags"
import { buildStandardMetadata } from "app/seo/metadata"
import Link from "next/link"
import { WritingsTagFilter } from "app/writings/writings-tag-filter.client"
import { JaEmptyNotice } from "@/components/ja-empty-notice"
import tagsData from "app/data/tags.json"

export const metadata = buildStandardMetadata({
  title: "記事",
  description:
    "デザイン・技術に関する記事——暗号技術、AIエージェント、デザインシステム、そしてその背後にある考え方について。",
  pathname: "/ja/writings",
  alternatePathname: "/writings",
  alternateLang: "en",
})

export const dynamic = "force-static"

export default async function Page() {
  const writings = getAllSortedWritings("ja")

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

  const series = getAllSortedWritingSeries("ja").map((s) => ({
    slug: s.slug,
    title: s.title,
    count: s.items.length,
  }))

  return (
    <WritingsTagFilter
      basePath="/ja/writings"
      tags={tags}
      totalCount={writings.length}
      series={series}
      lang="ja"
      heading={
        <>
          <span className="eyebrow">記事</span>
          <h1 className="mt-3 mb-3 text-3xl md:text-4xl font-semibold tracking-tight text-[var(--text-strong)]">
            記事
          </h1>
          <p className="text-lg text-[var(--text-muted)] mb-6">
            デザイン・技術に関する記事——暗号技術、AIエージェント、デザインシステム、そしてその背後にある考え方について。
          </p>
        </>
      }
    >
      {writings.length === 0 ? (
        <JaEmptyNotice englishHref="/writings" englishLabel="英語版の記事を見る" />
      ) : (
        <>
          <Grid writings={writings} selectedTags={[]} lang="ja" />
          <div
            id="writings-empty-state"
            className="hidden text-[var(--text-body)] bg-[var(--surface-card)] rounded-lg border border-[var(--border-subtle)] p-8 shadow-xs"
          >
            <p className="mb-3 font-medium text-[var(--text-strong)]">
              該当するタグの記事が見つかりませんでした。
            </p>
            <Link
              href="/ja/writings"
              className="text-[var(--accent-text)] hover:underline font-medium transition-colors"
            >
              すべての記事を見る
            </Link>
          </div>
        </>
      )}
    </WritingsTagFilter>
  )
}
