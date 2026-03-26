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

function primaryCollectionSlug(metadata: { series?: string; tags?: string[] }) {
  return metadata.series || "general"
}

export async function generateStaticParams() {
  const writings = getAllSortedWritings()
  return writings.map((w) => ({
    collection: primaryCollectionSlug(w.metadata),
    slug: w.slug,
  }))
}

export function generateMetadata({ params }) {
  const writing = getAllSortedWritings().find((w) => w.slug === params.slug)
  if (!writing) return

  const collection = primaryCollectionSlug(writing.metadata)
  if (collection !== params.collection) {
    return
  }

  const { title, publishedAt: publishedTime, summary: description, image } =
    writing.metadata

  return buildStandardMetadata({
    title,
    description,
    pathname: `/writings/${params.collection}/${writing.slug}`,
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

  const collection = params.collection

  const writingCollection = primaryCollectionSlug(writing.metadata)
  if (writingCollection !== collection) {
    notFound()
  }

  const collectionItems = writings.filter(
    (w) => primaryCollectionSlug(w.metadata) === collection
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
      <section className="pb-16">
        <nav aria-label="Breadcrumb" className="text-sm text-neutral-600 mb-4">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/writings" className="hover:underline">
            Writings
          </Link>
          <span className="mx-2">/</span>
          <Link href={`/writings/${collection}`} className="hover:underline">
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
          className="text-blue-500 hover:underline block mb-4"
        >
          Back to Collection
        </Link>

        <h1 className="title font-bold text-4xl mb-4">
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
        <div className="flex justify-between items-center mt-2 mb-12 text-sm">
          <p className={`text-sm text-neutral-500 ${openSans.className}`}>
            Published at: {formatDate(writing.metadata.publishedAt)}
          </p>
        </div>

        <article className="prose">
          <CustomMDX source={writing.content} />
        </article>

        <div className="mt-8 flex flex-col md:flex-row md:justify-between items-center">
          <Link
            href={`/writings/${collection}`}
            className="text-blue-500 hover:underline mb-4 md:mb-0"
          >
            Back to Collection
          </Link>
          <PrevNext
            items={collectionItems}
            itemIndex={writingIndex}
            path="writings"
            linkFor={(item) => `/writings/${collection}/${item.slug}`}
          />
        </div>
      </section>

      <hr className="border-[1px] border-gray-200" />

      <section className="pt-16">
        <h2 className="text-2xl font-bold mb-8">You May Also Like</h2>
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
