import Link from "next/link"
import { notFound } from "next/navigation"
import {
  getAllSortedWritings,
  getAllSortedWritingSeries,
  getWritingBySlug,
  getWritingHref,
  formatDate,
} from "app/utils"
import { buildStandardMetadata } from "app/seo/metadata"
import { CustomMDX } from "@/components/mdx"
import { PrevNext } from "@/components/prev-next"
import { BackToTop } from "@/components/back-to-top"
import { WritingCard } from "@/components/article-card"
import { Tags } from "@/components/tags"
import { ReadingSeriesBadge } from "@/components/reading-series"
import { BackLink } from "@/components/back-link"
import { SeriesView } from "app/writings/series-view"
import { baseUrl } from "app/sitemap"

export const dynamic = "force-static"

export async function generateStaticParams() {
  const writings = getAllSortedWritings()

  const writingSlugsWithoutCollection = writings
    .filter(w => !w.metadata.series)
    .map(w => w.slug)

  const seriesSlugs = getAllSortedWritingSeries().map((s) => s.slug)

  return [...writingSlugsWithoutCollection, ...seriesSlugs].map((val) => ({
    slugOrCollection: val,
  }))
}

export function generateMetadata({ params }) {
  const slugOrCollection = params.slugOrCollection

  const candidate = getWritingBySlug(slugOrCollection)
  const writing = candidate && !candidate.metadata.series ? candidate : undefined

  if (writing) {
    const { title, publishedAt: publishedTime, summary: description, image, archived } = writing.metadata
    return buildStandardMetadata({
      title,
      description,
      pathname: `/writings/${writing.slug}`,
      type: "article",
      publishedTime,
      image,
      noIndex: archived,
    })
  }

  const series = getAllSortedWritingSeries().find((s) => s.slug === slugOrCollection)
  if (series) {
    return buildStandardMetadata({
      title: `Writings — ${series.title}`,
      description: `${series.items.length} posts in the "${series.title}" series.`,
      pathname: `/writings/${slugOrCollection}`,
    })
  }

  return buildStandardMetadata({
    title: "Not Found",
    description: "This page could not be found.",
    pathname: `/writings/${slugOrCollection}`,
  })
}

export default async function SlugOrCollectionPage({ params, searchParams }) {
  const writings = getAllSortedWritings()
  const slugOrCollection = params.slugOrCollection

  const writing = getWritingBySlug(slugOrCollection)
  const isFlatWriting = !!writing && !writing.metadata.series

  if (isFlatWriting) {
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

    const backHref = writing.metadata.partOf ? `/writings/${writing.metadata.partOf}` : "/writings"
    const backLabel = writing.metadata.partOf ? "Back to Series Top" : "Back to All Writings"

    return (
      <div className="w-full max-w-[1024px] mx-auto px-8 md:px-16 py-24">
        <section className="pb-16 bg-[var(--surface-card)] rounded-lg shadow-xs border border-[var(--border-subtle)] p-8 md:p-12">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-x-4 gap-y-2 mb-6">
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
                dateModified: writing.metadata.updatedAt ?? writing.metadata.publishedAt,
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
          {writing.metadata.archived && (
            <div className="mb-6 px-4 py-3 rounded-md border border-[var(--border-subtle)] bg-[var(--surface-sunken)] text-sm text-[var(--text-muted)]">
              This article has been archived and is no longer listed on the site.
            </div>
          )}
          <div className="flex justify-between items-center mt-2 mb-12 text-sm border-b border-[var(--border-subtle)] pb-6">
            <p className="text-sm text-[var(--text-muted)]">
              Published: {formatDate(writing.metadata.publishedAt)}
              {writing.metadata.updatedAt && (
                <> · Updated: {formatDate(writing.metadata.updatedAt)}</>
              )}
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

  // Otherwise, it may be a reading series (posts sharing `partOf`).
  const allSeries = getAllSortedWritingSeries()
  const activeSeries = allSeries.find((s) => s.slug === slugOrCollection)

  if (!activeSeries) {
    notFound()
  }

  return (
    <SeriesView
      seriesSlug={activeSeries.slug}
      seriesTitle={activeSeries.title}
      items={activeSeries.items}
      allSeries={allSeries.map((s) => ({
        slug: s.slug,
        title: s.title,
        count: s.items.length,
      }))}
    />
  )
}
