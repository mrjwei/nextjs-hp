import { Grid } from "@/components/grid"
import { ParseSeriesDirName, getAllSortedWritings } from "app/utils"
import { Sidebar } from "@/components/sidebar"
import { buildStandardMetadata } from "app/seo/metadata"
import Link from "next/link"
import { WritingsFilterController } from "app/writings/writings-filter.client"

export const metadata = buildStandardMetadata({
  title: "Writings",
  description: "My blog posts, tutorials and more.",
  pathname: "/writings",
})

export const dynamic = "force-static"

function formatCollectionLabel(value: string) {
  if (value.includes("-")) return ParseSeriesDirName(value)
  if (value.length <= 4) return value.toUpperCase()
  return value
}

export default async function Page() {
  const writings = getAllSortedWritings()

  const collectionCounts = new Map<string, number>()
  for (const writing of writings) {
    if (writing.metadata.series) {
      const series = writing.metadata.series
      collectionCounts.set(series, (collectionCounts.get(series) ?? 0) + 1)
    }
  }

  const collections = Array.from(collectionCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([value, length]) => ({
      label: formatCollectionLabel(value),
      value,
      href: `/writings/${value}`,
      length,
      shouldBeUppercase: value.length <= 4,
    }))

  const items = [
    {
      label: "All",
      value: "all",
      href: "/writings",
      length: writings.length,
      shouldBeUppercase: false,
    },
    ...collections,
  ]

  return (
    <section className="grid grid-cols-12 gap-8 pt-[var(--header-height)]">
      <Sidebar
        items={items}
        targetValue="all"
        classname="hidden md:block bg-[var(--surface-sunken)] border-r border-[var(--border-subtle)] p-8 md:col-span-3 sticky md:top-[var(--header-height)] h-screen"
      />
      <div className="col-span-12 px-6 py-8 md:col-span-9 md:pl-0 md:pr-8">
        <div className="mb-8">
          <span className="eyebrow">Writings</span>
          <h1 className="display mt-3 mb-3 text-3xl md:text-4xl">Writings</h1>
          <p className="text-lg text-[var(--text-muted)] mb-6">
            Design, tech, innovation and more.
          </p>
          <Sidebar items={items} targetValue={undefined} classname="block md:hidden" />

          <WritingsFilterController />
        </div>

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
      </div>
    </section>
  )
}
