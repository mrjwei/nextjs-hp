import { Grid } from "app/components/grid"
import { ParseSeriesDirName, getAllSortedWritings } from "app/utils"
import { Sidebar } from "app/components/sidebar"
import { buildStandardMetadata } from "app/seo/metadata"
import Link from "next/link"
import tagsData from "app/data/tags.json"
import { Tag } from "app/components/tag"

export const metadata = buildStandardMetadata({
  title: "Writings",
  description: "My blog posts, tutorials and more.",
  pathname: "/writings",
})

function formatCollectionLabel(value: string) {
  if (value.includes("-")) return ParseSeriesDirName(value)
  if (value.length <= 4) return value.toUpperCase()
  return value
}

export default async function Page({
  searchParams,
}: {
  searchParams?: { tags?: string | string[] }
}) {
  const writings = getAllSortedWritings()

  const rawTags = searchParams?.tags
  const selectedTags = Array.from(
    new Set(
      (Array.isArray(rawTags) ? rawTags : rawTags ? [rawTags] : [])
        .flatMap((v) => String(v).split(","))
        .map((v) => v.trim())
        .filter(Boolean)
    )
  )

  const toggleTagHref = (tag: string) => {
    const next = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag]
    const qs = next.length ? `?tags=${encodeURIComponent(next.join(","))}` : ""
    return `/writings${qs}`
  }

  const removeTagHref = (tag: string) => {
    const next = selectedTags.filter((t) => t !== tag)
    const qs = next.length ? `?tags=${encodeURIComponent(next.join(","))}` : ""
    return `/writings${qs}`
  }

  const filteredWritings = selectedTags.length
    ? writings.filter((w) =>
        selectedTags.some((tag) => (w.metadata.tags ?? []).includes(tag))
      )
    : writings

  const collectionCounts = new Map<string, number>()
  for (const writing of writings) {
    const series = writing.metadata.series || "general"
    collectionCounts.set(series, (collectionCounts.get(series) ?? 0) + 1)
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
        classname="hidden md:block bg-gray-800 text-white p-8 md:col-span-3 sticky md:top-[var(--header-height)] h-screen"
      />
      <div className="col-span-12 px-4 py-8 md:col-span-9 md:pl-0 md:pr-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Writings</h1>
          <p className="text-lg text-gray-600 mb-4">Design, tech, innovation and more.</p>
          <Sidebar items={items} targetValue={undefined} classname="block md:hidden" />

          {selectedTags.length ? (
            <div className="mt-4 text-sm text-neutral-700 flex flex-wrap items-center gap-2">
              <span>Filtering by tags:</span>
              {selectedTags
                .filter((tag) => Object.keys(tagsData).includes(tag))
                .map((tag) => (
                  <Tag
                    key={tag}
                    label={tag}
                    color={(tagsData as any)[tag].color}
                    href={`/writings?tags=${encodeURIComponent(selectedTags.join(","))}`}
                    closeHref={removeTagHref(tag)}
                  />
                ))}
              <Link href="/writings" className="ml-1 text-blue-500 hover:underline">
                Clear
              </Link>
            </div>
          ) : null}
        </div>
        {filteredWritings.length === 0 ? (
          <div className="text-neutral-700">
            <p className="mb-2">No writings found for those tags.</p>
            <Link href="/writings" className="text-blue-500 hover:underline">
              View all writings
            </Link>
          </div>
        ) : (
          <Grid writings={filteredWritings} selectedTags={selectedTags} />
        )}
      </div>
    </section>
  )
}
