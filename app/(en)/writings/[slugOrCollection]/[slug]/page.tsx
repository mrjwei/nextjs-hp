import Link from "next/link"
import { notFound } from "next/navigation"
import { CustomMDX } from "@/components/mdx"
import { PrevNext } from "@/components/prev-next"
import { BackToTop } from "@/components/back-to-top"
import { WritingCard } from "@/components/article-card"
import { Tags } from "@/components/tags"
import { ReadingSeriesBadge } from "@/components/reading-series"
import { BackLink } from "@/components/back-link"
import {
  formatDate,
  getAllSortedWritings,
  getWritingBySlug,
  getWritingHref,
} from "app/utils"
import { baseUrl } from "app/sitemap"
import { buildStandardMetadata } from "app/seo/metadata"

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

  const seriesParts = writing.metadata.partOf
    ? writings
        .filter((w) => w.metadata.partOf === writing.metadata.partOf)
        .sort((a, b) => (a.metadata.partNumber ?? 0) - (b.metadata.partNumber ?? 0))
    : []
  const partIndex = seriesParts.findIndex((w) => w.slug === writing.slug)

  const backHref = writing.metadata.partOf ? `/writings/${writing.metadata.partOf}` : "/writings"
  const backLabel = writing.metadata.partOf ? "Back to Series Top" : "Back to All Writings"

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
      <section className="pb-16 bg-[var(--surface-card)] rounded-lg shadow-xs border border-[var(--border-subtle)] p-8 md:p-12">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-x-4 gap-y-2 mb-4">
          <nav aria-label="Breadcrumb" className="min-w-0 sm:flex-1 text-sm text-[var(--text-muted)]">
            <Link href="/" className="hover:underline hover:text-[var(--text-strong)] transition-colors">
              Home
            </Link>
            <span className="mx-2 text-[var(--text-subtle)]">/</span>
            <Link href="/writings" className="hover:underline hover:text-[var(--text-strong)] transition-colors">
              Writings
            </Link>
            {writing.metadata.partOf && (
              <>
                <span className="mx-2 text-[var(--text-subtle)]">/</span>
                <Link
                  href={`/writings/${writing.metadata.partOf}`}
                  className="hover:underline hover:text-[var(--text-strong)] transition-colors"
                >
                  {writing.metadata.partOfTitle ?? writing.metadata.partOf}
                </Link>
              </>
            )}
            <span className="mx-2 text-[var(--text-subtle)]">/</span>
            <span className="text-[var(--text-strong)]">{writing.metadata.title}</span>
          </nav>
          <BackLink href={backHref} label={backLabel} />
        </div>

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
            href={backHref}
            className="inline-flex items-center gap-2 text-[var(--accent-text)] hover:underline transition-colors font-medium mb-4 md:mb-0"
          >
            ← {backLabel}
          </Link>
          <PrevNext
            items={collectionItems}
            itemIndex={writingIndex}
            path="writings"
            linkFor={(item) => `/writings/${collection}/${item.slug}`}
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
