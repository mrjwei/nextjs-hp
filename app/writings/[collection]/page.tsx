import Link from "next/link"
import { notFound } from "next/navigation"
import { Grid } from "app/components/grid"
import { Sidebar } from "app/components/sidebar"
import { ParseSeriesDirName, getAllSortedWritings } from "app/utils"
import { buildStandardMetadata } from "app/seo/metadata"

function formatCollectionLabel(value: string) {
  if (value.includes("-")) return ParseSeriesDirName(value)
  if (value.length <= 4) return value.toUpperCase()
  return value
}

export function generateMetadata({ params }) {
  const collection = params.collection
  const title = formatCollectionLabel(collection)

  return buildStandardMetadata({
    title: `Writings - ${title}`,
    description: `Writings in ${title}.`,
    pathname: `/writings/${collection}`,
  })
}

export default async function CollectionPage({ params }) {
  const writings = getAllSortedWritings()

  const collectionCounts = new Map<string, number>()
  for (const writing of writings) {
    const series = writing.metadata.series || "general"
    collectionCounts.set(series, (collectionCounts.get(series) ?? 0) + 1)
  }

  const items = [
    {
      label: "All",
      value: "all",
      href: "/writings",
      length: writings.length,
      shouldBeUppercase: false,
    },
    ...Array.from(collectionCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([value, length]) => ({
        label: formatCollectionLabel(value),
        value,
        href: `/writings/${value}`,
        length,
        shouldBeUppercase: value.length <= 4,
      })),
  ]

  const collection = params.collection
  const filtered = writings.filter(
    (w) => (w.metadata.series || "general") === collection
  )

  if (filtered.length === 0) {
    notFound()
  }

  return (
    <section className="grid grid-cols-12 gap-8 pt-[var(--header-height)]">
      <Sidebar
        items={items}
        targetValue={collection}
        classname="hidden md:block bg-gray-800 text-white p-8 md:col-span-3 sticky md:top-[var(--header-height)] h-screen"
      />
      <div className="col-span-12 px-4 py-8 md:col-span-9 md:pl-0 md:pr-8">
        <div className="mb-8">
          <nav aria-label="Breadcrumb" className="text-sm text-neutral-600 mb-4">
            <Link href="/" className="hover:underline">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/writings" className="hover:underline">
              Writings
            </Link>
          </nav>

          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            {formatCollectionLabel(collection)}
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            All writings in “{formatCollectionLabel(collection)}”.
          </p>

          <Sidebar
            items={items}
            targetValue={collection}
            classname="block md:hidden"
          />
        </div>

        <Grid writings={filtered} />
      </div>
    </section>
  )
}
