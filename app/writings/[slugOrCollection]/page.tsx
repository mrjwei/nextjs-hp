import Link from "next/link"
import { notFound } from "next/navigation"
import { getAllSortedWritings, getWritingBySlug, getWritingHref, formatDate } from "app/utils"
import { buildStandardMetadata } from "app/seo/metadata"
import { CustomMDX } from "@/components/mdx"
import { PrevNext } from "@/components/prev-next"
import { BackToTop } from "@/components/back-to-top"
import { WritingCard } from "@/components/article-card"
import { Tags } from "@/components/tags"
import { ReadingSeriesBadge } from "@/components/reading-series"
import { baseUrl } from "app/sitemap"

export const dynamic = "force-static"

export async function generateStaticParams() {
  const writings = getAllSortedWritings()

  const writingSlugsWithoutCollection = writings
    .filter(w => !w.metadata.series)
    .map(w => w.slug)

  return writingSlugsWithoutCollection.map((val) => ({ slugOrCollection: val }))
}

export function generateMetadata({ params }) {
  const slugOrCollection = params.slugOrCollection

  const writing = getAllSortedWritings().find(w => w.slug === slugOrCollection && !w.metadata.series)

  if (!writing) {
    return buildStandardMetadata({
      title: "Not Found",
      description: "This page could not be found.",
      pathname: `/writings/${slugOrCollection}`,
    })
  }

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

export default async function SlugOrCollectionPage({ params, searchParams }) {
  const writings = getAllSortedWritings()
  const slugOrCollection = params.slugOrCollection

  const writing = getWritingBySlug(slugOrCollection)
  if (!writing || writing.metadata.series) {
    notFound()
  }

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

  const seriesParts = writing.metadata.partOf
    ? writings
        .filter((w) => w.metadata.partOf === writing.metadata.partOf)
        .sort((a, b) => (a.metadata.partNumber ?? 0) - (b.metadata.partNumber ?? 0))
    : []
  const partIndex = seriesParts.findIndex((w) => w.slug === writing.slug)

  return (
    <div className="w-full max-w-[1024px] mx-auto px-8 md:px-16 py-24">
      <section className="pb-16 bg-[var(--surface-card)] rounded-lg shadow-xs border border-[var(--border-subtle)] p-8 md:p-12">
        <nav aria-label="Breadcrumb" className="text-sm text-[var(--text-muted)] mb-4">
          <Link href="/" className="hover:underline hover:text-[var(--text-strong)] transition-colors">
            Home
          </Link>
          <span className="mx-2 text-[var(--text-subtle)]">/</span>
          <Link href="/writings" className="hover:underline hover:text-[var(--text-strong)] transition-colors">
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
          className="inline-flex items-center gap-2 text-[var(--accent-text)] hover:underline transition-colors font-medium mb-6"
        >
          ← Back to All Writings
        </Link>

        <h1 className="display text-4xl mb-4">
          {writing.metadata.title}
        </h1>
        {seriesParts.length > 1 && partIndex !== -1 && (
          <ReadingSeriesBadge
            title={writing.metadata.partOfTitle ?? writing.metadata.partOf!}
            partNumber={partIndex + 1}
            total={seriesParts.length}
            prevHref={partIndex > 0 ? getWritingHref(seriesParts[partIndex - 1]) : undefined}
            nextHref={
              partIndex < seriesParts.length - 1
                ? getWritingHref(seriesParts[partIndex + 1])
                : undefined
            }
          />
        )}
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
        <div className="flex justify-between items-center mt-2 mb-12 text-sm border-b border-[var(--border-subtle)] pb-6">
          <p className="text-sm text-[var(--text-muted)]">
            Published: {formatDate(writing.metadata.publishedAt)}
          </p>
        </div>

        <article className="prose">
          <CustomMDX source={writing.content} />
        </article>

        <div className="mt-8 flex flex-col md:flex-row md:justify-between items-center pt-8 border-t border-[var(--border-subtle)]">
          <Link
            href={`/writings`}
            className="inline-flex items-center gap-2 text-[var(--accent-text)] hover:underline transition-colors font-medium mb-4 md:mb-0"
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

      <section className="pt-16 bg-[var(--surface-card)] rounded-lg shadow-xs border border-[var(--border-subtle)] p-8 md:p-12 mt-8">
        <h2 className="text-2xl font-semibold tracking-tight text-[var(--text-strong)] mb-8">You May Also Like</h2>
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
