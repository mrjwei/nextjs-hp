import Link from "next/link"
import { notFound } from "next/navigation"
import { CustomMDX } from "app/components/mdx"
import { PrevNext } from "app/components/prev-next"
import { BackToTop } from "app/components/back-to-top"
import { WritingCard } from "app/components/article-card"
import { Tags } from "app/components/tags"
import { openSans } from "app/data/fonts"
import {
  ParseSeriesDirName,
  formatDate,
  getAllSortedWritings,
  getWritingBySlug,
} from "app/utils"
import { baseUrl } from "app/sitemap"
import { buildStandardMetadata } from "app/seo/metadata"

function formatCollectionLabel(value: string) {
  if (value.includes("-")) return ParseSeriesDirName(value)
  if (value.length <= 4) return value.toUpperCase()
  return value
}


export async function generateStaticParams() {
  const writings = getAllSortedWritings()
  return writings.filter(w => w.metadata.series).map((w) => ({
    slugOrCollection: w.metadata.series as string,
    slug: w.slug,
  }))
}

export function generateMetadata({ params }) {
  const writing = getAllSortedWritings().find((w) => w.slug === params.slug)
  if (!writing) return

  const collection = writing.metadata.series
  if (collection !== params.slugOrCollection) {
    return
  }

  const { title, publishedAt: publishedTime, summary: description, image } =
    writing.metadata

  return buildStandardMetadata({
    title,
    description,
    pathname: `/writings/${params.slugOrCollection}/${writing.slug}`,
    type: "article",
    publishedTime,
    image,
  })
}

export default async function WritingInCollection({ params, searchParams }) {
  const writings = getAllSortedWritings()
  const writing = getWritingBySlug(params.slug)
  if (!writing) {
    notFound()
  }

  const collection = params.slugOrCollection

  const writingCollection = writing.metadata.series
  if (writingCollection !== collection) {
    notFound()
  }

  const collectionItems = writings.filter(
    (w) => w.metadata.series === collection
  )

  const writingIndex = collectionItems.findIndex((w) => w.slug === params.slug)

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
      new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)
        ? -1
        : 1
    )

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
          <span className="mx-2 text-neutral-400">/</span>
          <Link href={`/writings/${collection}`} className="hover:underline hover:text-neutral-900 transition-colors">
            {formatCollectionLabel(collection)}
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
              url: `${baseUrl}/writings/${collection}/${writing.slug}`,
              author: {
                "@type": "Person",
                name: "Jesse Wei | Writings and Works",
              },
            }),
          }}
        />

        <Link
          href={`/writings/${collection}`}
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:underline transition-colors font-medium block mb-6"
        >
          ← Back to Collection
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
            href={`/writings/${collection}`}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:underline transition-colors font-medium mb-4 md:mb-0"
          >
            ← Back to Collection
          </Link>
          <PrevNext
            items={collectionItems}
            itemIndex={writingIndex}
            path="writings"
            linkFor={(item) => `/writings/${collection}/${item.slug}`}
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
