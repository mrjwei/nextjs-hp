import Link from "next/link"
import { notFound } from "next/navigation"
import { Grid } from "app/components/grid"
import { Sidebar } from "app/components/sidebar"
import { ParseSeriesDirName, getAllSortedWritings, getWritingBySlug, formatDate } from "app/utils"
import { buildStandardMetadata } from "app/seo/metadata"
import { CustomMDX } from "app/components/mdx"
import { PrevNext } from "app/components/prev-next"
import { BackToTop } from "app/components/back-to-top"
import { WritingCard } from "app/components/article-card"
import { Tags } from "app/components/tags"
import { openSans } from "app/data/fonts"
import { baseUrl } from "app/sitemap"

export const dynamic = "force-static"

export async function generateStaticParams() {
  const writings = getAllSortedWritings()
  const collections = Array.from(
    new Set(writings.filter(w => w.metadata.series).map((w) => w.metadata.series as string))
  )

  const writingSlugsWithoutCollection = writings
    .filter(w => !w.metadata.series)
    .map(w => w.slug)

  const allParams = [
    ...collections.map((collection) => collection),
    ...writingSlugsWithoutCollection
  ]
  return allParams.map((val) => ({ slugOrCollection: val }))
}

function formatCollectionLabel(value: string) {
  if (value.includes("-")) return ParseSeriesDirName(value)
  if (value.length <= 4) return value.toUpperCase()
  return value
}

export function generateMetadata({ params }) {
  const slugOrCollection = params.slugOrCollection

  // Attempt to find a writing without a collection
  const writing = getAllSortedWritings().find(w => w.slug === slugOrCollection && !w.metadata.series)
  
  if (writing) {
    const { title, publishedAt: publishedTime, summary: description, image } = writing.metadata
    return buildStandardMetadata({
      title,
      description,
      pathname: `/writings/${writing.slug}`,
      type: "article",
      publishedTime,
      image,
    })
  }

  // Otherwise, treat as a collection
  const title = formatCollectionLabel(slugOrCollection)
  return buildStandardMetadata({
    title: `Writings - ${title}`,
    description: `Writings in ${title}.`,
    pathname: `/writings/${slugOrCollection}`,
  })
}

export default async function SlugOrCollectionPage({ params, searchParams }) {
  const writings = getAllSortedWritings()
  const slugOrCollection = params.slugOrCollection

  const isWritingWithoutCollection = writings.some(w => w.slug === slugOrCollection && !w.metadata.series)

  if (isWritingWithoutCollection) {
    const writing = getWritingBySlug(slugOrCollection)
    if (!writing) notFound()

    const writingTagSet = new Set(writing.metadata.tags)
    const rawTags = (await searchParams)?.tags
    const selectedTags = Array.from(
      new Set(
        (Array.isArray(rawTags) ? rawTags : rawTags ? [rawTags] : [])
          .flatMap((v) => String(v).split(","))
          .map((v) => v.trim())
          .filter(Boolean)
      )
    )

    const similarWritings = writings
      .filter((w) => w.slug !== writing.slug)
      .filter((w) => w.metadata.tags.some((t) => writingTagSet.has(t)))
      .sort((a, b) =>
        new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt) ? -1 : 1
      )

    const collectionItems = writings.filter(w => !w.metadata.series)
    const writingIndex = collectionItems.findIndex(w => w.slug === writing.slug)

    return (
      <div className="w-full max-w-[1024px] mx-auto px-8 md:px-16 py-24">
        <section className="pb-16 bg-white rounded-2xl shadow-sm border border-neutral-200 p-8 md:p-12">
          <nav aria-label="Breadcrumb" className="text-sm text-neutral-600 mb-4">
            <Link href="/" className="hover:underline hover:text-neutral-900 transition-colors">
              Home
            </Link>
            <span className="mx-2 text-neutral-400">/</span>
            <Link href="/writings" className="hover:underline hover:text-neutral-900 transition-colors">
              Writings
            </Link>
          </nav>

          <script
            type="application/ld+json"
            suppressHydrationWarning
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "BlogPosting",
                headline: writing.metadata.title,
                datePublished: writing.metadata.publishedAt,
                dateModified: writing.metadata.publishedAt,
                description: writing.metadata.summary,
                image: writing.metadata.image
                  ? `${baseUrl}${writing.metadata.image}`
                  : `${baseUrl}/og?title=${encodeURIComponent(writing.metadata.title)}`,
                url: `${baseUrl}/writings/${writing.slug}`,
                author: {
                  "@type": "Person",
                  name: "Jesse Wei | Writings and Works",
                },
              }),
            }}
          />

          <Link
            href={`/writings`}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:underline transition-colors font-medium block mb-6"
          >
            ← Back to All Writings
          </Link>

          <h1 className="title font-bold text-4xl mb-4 text-neutral-900">
            {writing.metadata.title}
          </h1>
          <Tags
            tags={writing.metadata.tags}
            className="mb-4"
            hrefForTag={(tag) => {
              const next = selectedTags.includes(tag)
                ? selectedTags.filter((t) => t !== tag)
                : [...selectedTags, tag]

              const qs = next.length
                ? `?tags=${encodeURIComponent(next.join(","))}`
                : ""

              return `/writings${qs}`
            }}
          />
          <div className="flex justify-between items-center mt-2 mb-12 text-sm border-b border-neutral-200 pb-6">
            <p className={`text-sm text-neutral-600 ${openSans.className}`}>
              Published: {formatDate(writing.metadata.publishedAt)}
            </p>
          </div>

          <article className="prose">
            <CustomMDX source={writing.content} />
          </article>

          <div className="mt-8 flex flex-col md:flex-row md:justify-between items-center pt-8 border-t border-neutral-200">
            <Link
              href={`/writings`}
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:underline transition-colors font-medium mb-4 md:mb-0"
            >
              ← Back to All Writings
            </Link>
            <PrevNext
              items={collectionItems}
              itemIndex={writingIndex}
              path="writings"
              linkFor={(item) => `/writings/${item.slug}`}
            />
          </div>
        </section>

        <section className="pt-16 bg-white rounded-2xl shadow-sm border border-neutral-200 p-8 md:p-12 mt-8">
          <h2 className="text-2xl font-bold mb-8 text-neutral-900">You May Also Like</h2>
          <div className="grid grid-cols-12 gap-y-8 md:gap-8">
            {similarWritings.slice(0, 4).map((similarWriting) => (
              <WritingCard key={similarWriting.slug} article={similarWriting} />
            ))}
          </div>
        </section>

        <BackToTop />
      </div>
    )
  }

  // Otherwise, it's a COLLECTION
  const collectionCounts = new Map<string, number>()
  for (const writing of writings) {
    if (writing.metadata.series) {
      const series = writing.metadata.series
      collectionCounts.set(series, (collectionCounts.get(series) ?? 0) + 1)
    }
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

  const filtered = writings.filter(
    (w) => w.metadata.series === slugOrCollection
  )

  if (filtered.length === 0) {
    notFound()
  }

  return (
    <section className="grid grid-cols-12 gap-8 pt-[var(--header-height)]">
      <Sidebar
        items={items}
        targetValue={slugOrCollection}
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
            {formatCollectionLabel(slugOrCollection)}
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            All writings in “{formatCollectionLabel(slugOrCollection)}”.
          </p>

          <Sidebar
            items={items}
            targetValue={slugOrCollection}
            classname="block md:hidden"
          />
        </div>

        <Grid writings={filtered} />
      </div>
    </section>
  )
}
