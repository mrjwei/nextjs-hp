import { Grid } from "app/components/grid"
import { ParseSeriesDirName, getAllSortedWritings } from "app/utils"
import { Sidebar } from "app/components/sidebar"
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
        classname="hidden md:block bg-neutral-900 text-white p-8 md:col-span-3 sticky md:top-[var(--header-height)] h-screen"
      />
      <div className="col-span-12 px-6 py-8 md:col-span-9 md:pl-0 md:pr-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-3 text-neutral-900">Writings</h1>
          <p className="text-lg text-neutral-600 mb-6">Design, tech, innovation and more.</p>
          <Sidebar items={items} targetValue={undefined} classname="block md:hidden" />

          <WritingsFilterController />
        </div>

        {writings.length === 0 ? (
          <div className="text-neutral-700 bg-white rounded-xl border border-neutral-200 p-8 shadow-sm">
            <p className="mb-3 font-medium text-neutral-900">No writings found.</p>
          </div>
        ) : (
          <>
            <Grid writings={writings} selectedTags={[]} />
            <div
              id="writings-empty-state"
              className="hidden text-neutral-700 bg-white rounded-xl border border-neutral-200 p-8 shadow-sm"
            >
              <p className="mb-3 font-medium text-neutral-900">No writings found for those tags.</p>
              <Link
                href="/writings"
                className="text-blue-600 hover:text-blue-700 hover:underline font-medium transition-colors"
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
