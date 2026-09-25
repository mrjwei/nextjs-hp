import Link from "next/link"
import { notFound, permanentRedirect } from "next/navigation"
import {
  getAllSortedWritings,
  getAllSortedWritingSeries,
  getAllSortedWritingCollections,
  getWritingBySlug,
  getWritingHref,
  getProjectHref,
  formatDate,
} from "app/utils"
import { buildStandardMetadata } from "app/seo/metadata"
import { CustomMDX } from "@/components/mdx"
import { PrevNext } from "@/components/prev-next"
import { BackToTop } from "@/components/back-to-top"
import { WritingCard } from "@/components/article-card"
import { Tags } from "@/components/tags"
import { ResultBlock } from "@/components/result-block"
import { ProjectBadge } from "@/components/project-badge"
import { ReadingSeriesBadge } from "@/components/reading-series"
import { BackLink } from "@/components/back-link"
import { SeriesView } from "app/writings/series-view"
import { baseUrl } from "app/sitemap"

export const dynamic = "force-static"
export const dynamicParams = true

export async function generateStaticParams() {
  const writings = getAllSortedWritings("ja")

  const writingSlugsWithoutCollection = writings
    .filter((w) => !w.metadata.series)
    .map((w) => w.slug)

  const seriesSlugs = getAllSortedWritingSeries("ja").map((s) => s.slug)

  const folderCollectionSlugs = Array.from(
    new Set(writings.map((w) => w.metadata.series).filter(Boolean) as string[])
  )

  const allSlugs = Array.from(
    new Set([...writingSlugsWithoutCollection, ...seriesSlugs, ...folderCollectionSlugs])
  )

  return allSlugs.map((val) => ({
    slugOrCollection: val,
  }))
}

export function generateMetadata({ params }) {
  const slugOrCollection = params.slugOrCollection

  const candidate = getWritingBySlug(slugOrCollection, "ja")
  const writing = candidate && !candidate.metadata.series ? candidate : undefined

  if (writing) {
    const { title, publishedAt: publishedTime, summary: description, image } = writing.metadata
    const pathname = `/ja/posts/${writing.slug}`
    return buildStandardMetadata({
      title,
      description,
      pathname,
      type: "article",
      publishedTime,
      image,
    })
  }

  const series = getAllSortedWritingSeries("ja").find((s) => s.slug === slugOrCollection)
  if (series) {
    return buildStandardMetadata({
      title: `記事 — ${series.title}`,
      description: `「${series.title}」シリーズの記事 ${series.items.length}件。`,
      pathname: `/ja/posts/${slugOrCollection}`,
    })
  }

  const collectionItems = getAllSortedWritings("ja").filter(
    (w) => w.metadata.series === slugOrCollection
  )
  if (collectionItems.length) {
    const title = collectionItems[0].metadata.seriesTitle ?? slugOrCollection
    return buildStandardMetadata({
      title: `記事 — ${title}`,
      description: `「${title}」の記事 ${collectionItems.length}件。`,
      pathname: `/ja/posts/${slugOrCollection}`,
    })
  }

  return buildStandardMetadata({
    title: "見つかりません",
    description: "このページは見つかりませんでした。",
    pathname: `/ja/posts/${slugOrCollection}`,
  })
}

function NotTranslatedYet({ englishHref }: { englishHref: string }) {
  return (
    <div className="w-full max-w-[1024px] mx-auto px-8 md:px-16 py-24">
      <div className="bg-[var(--surface-card)] rounded-lg shadow-xs border border-[var(--border-subtle)] p-8 md:p-12 text-center">
        <p className="mb-3 font-medium text-[var(--text-strong)]">
          この記事はまだ日本語訳がありません。
        </p>
        <p className="mb-6 text-[var(--text-muted)]">
          現在は英語でのみ公開しています。
        </p>
        <Link
          href={englishHref}
          className="text-[var(--accent-text)] hover:underline font-medium"
        >
          英語版を読む →
        </Link>
      </div>
    </div>
  )
}

export default async function SlugOrCollectionPage({ params, searchParams }) {
  const writings = getAllSortedWritings("ja")
  const slugOrCollection = params.slugOrCollection

  const writing = getWritingBySlug(slugOrCollection, "ja")
  const isFlatWriting = !!writing && !writing.metadata.series

  // Posts inside a collection live at /posts/<collection>/<slug>; send the
  // short /posts/<slug> form (and old /work/<slug> links) there.
  if (writing?.metadata.series) {
    permanentRedirect(getWritingHref(writing, "ja"))
  }

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

    const collectionItems = writings.filter((w) => !w.metadata.series)
    const writingIndex = collectionItems.findIndex((w) => w.slug === writing.slug)

    const seriesParts = writing.metadata.partOf
      ? writings
          .filter((w) => w.metadata.partOf === writing.metadata.partOf)
          .sort((a, b) => (a.metadata.partNumber ?? 0) - (b.metadata.partNumber ?? 0))
      : []
    const partIndex = seriesParts.findIndex((w) => w.slug === writing.slug)

    const backHref = writing.metadata.partOf
      ? `/ja/posts/${writing.metadata.partOf}`
      : "/ja/posts"
    const backLabel = writing.metadata.partOf ? "シリーズトップに戻る" : "記事一覧に戻る"

    return (
      <div className="w-full max-w-[1024px] mx-auto px-8 md:px-16 py-24">
        <section className="pb-16 bg-[var(--surface-card)] rounded-lg shadow-xs border border-[var(--border-subtle)] p-8 md:p-12">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-x-4 gap-y-2 mb-6">
            <nav aria-label="Breadcrumb" className="min-w-0 sm:flex-1 text-sm text-[var(--text-muted)]">
              <Link href="/ja" className="hover:underline hover:text-[var(--text-strong)] transition-colors">
                ホーム
              </Link>
              <span className="mx-2 text-[var(--text-subtle)]">/</span>
              <Link href="/ja/posts" className="hover:underline hover:text-[var(--text-strong)] transition-colors">
                記事
              </Link>
              {writing.metadata.partOf && (
                <>
                  <span className="mx-2 text-[var(--text-subtle)]">/</span>
                  <Link
                    href={`/ja/posts/${writing.metadata.partOf}`}
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
                url: `${baseUrl}/ja/posts/${writing.slug}`,
                inLanguage: "ja",
                author: {
                  "@type": "Person",
                  name: "Jesse Wei | Writings and Works",
                },
              }),
            }}
          />

          {writing.metadata.project && (
            <ProjectBadge
              project={writing.metadata.project}
              href={getProjectHref(writing.metadata.project, "ja")}
              className="mb-4"
            />
          )}
          <h1 className="display text-4xl mb-4">{writing.metadata.title}</h1>
          {seriesParts.length > 1 && partIndex !== -1 && (
            <ReadingSeriesBadge
              title={writing.metadata.partOfTitle ?? writing.metadata.partOf!}
              partNumber={partIndex + 1}
              total={seriesParts.length}
              prevHref={partIndex > 0 ? getWritingHref(seriesParts[partIndex - 1], "ja") : undefined}
              nextHref={
                partIndex < seriesParts.length - 1
                  ? getWritingHref(seriesParts[partIndex + 1], "ja")
                  : undefined
              }
              lang="ja"
            />
          )}
          <Tags
            tags={writing.metadata.tags}
            className="mb-4"
            hrefForTag={(tag) => {
              const next = selectedTags.includes(tag)
                ? selectedTags.filter((t) => t !== tag)
                : [...selectedTags, tag]

              const qs = next.length ? `?tags=${encodeURIComponent(next.join(","))}` : ""

              return `/ja/posts${qs}`
            }}
          />
          <div className="flex justify-between items-center mt-2 mb-12 text-sm border-b border-[var(--border-subtle)] pb-6">
            <p className="text-sm text-[var(--text-muted)]">
              公開日: {formatDate(writing.metadata.publishedAt)}
              {writing.metadata.updatedAt && (
                <> · 更新日: {formatDate(writing.metadata.updatedAt)}</>
              )}
            </p>
          </div>

          <ResultBlock metadata={writing.metadata} lang="ja" />

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
              linkFor={(item) => `/ja/posts/${item.slug}`}
              lang="ja"
            />
          </div>
        </section>

        <section className="pt-16 bg-[var(--surface-card)] rounded-lg shadow-xs border border-[var(--border-subtle)] p-8 md:p-12 mt-8">
          <h2 className="text-2xl font-semibold tracking-tight text-[var(--text-strong)] mb-8">
            あわせて読みたい
          </h2>
          <div className="grid grid-cols-12 gap-y-8 md:gap-8">
            {similarWritings.slice(0, 4).map((similarWriting) => (
              <WritingCard key={similarWriting.slug} article={similarWriting} lang="ja" />
            ))}
          </div>
        </section>

        <BackToTop />
      </div>
    )
  }

  // The sidebar always shows folder-based collections (the canonical
  // series, per the directory structure under app/writings/posts), regardless
  // of which kind of collection page is being rendered below.
  const sidebarSeries = getAllSortedWritingCollections("ja").map((s) => ({
    slug: s.slug,
    title: s.title,
    count: s.items.length,
  }))

  // Otherwise, it may be a reading series (posts sharing `partOf`).
  const activeSeries = getAllSortedWritingSeries("ja").find((s) => s.slug === slugOrCollection)

  if (activeSeries) {
    return (
      <SeriesView
        seriesSlug={activeSeries.slug}
        seriesTitle={activeSeries.title}
        items={activeSeries.items}
        allSeries={sidebarSeries}
        lang="ja"
      />
    )
  }

  // Otherwise, it may be a folder-based collection (posts sharing `series`,
  // e.g. a case study like "LingoBun").
  const collectionItems = writings.filter((w) => w.metadata.series === slugOrCollection)

  if (collectionItems.length) {
    const collectionTitle = collectionItems[0].metadata.seriesTitle ?? slugOrCollection
    return (
      <SeriesView
        seriesSlug={slugOrCollection}
        seriesTitle={collectionTitle}
        items={collectionItems}
        allSeries={sidebarSeries}
        lang="ja"
      />
    )
  }

  // No Japanese version — if the English original exists, say so instead of
  // a bare 404.
  const englishWriting = getWritingBySlug(slugOrCollection, "en")
  if (englishWriting) {
    return <NotTranslatedYet englishHref={getWritingHref(englishWriting, "en")} />
  }

  const englishSeries = getAllSortedWritingSeries("en").find((s) => s.slug === slugOrCollection)
  if (englishSeries) {
    return <NotTranslatedYet englishHref={`/posts/${slugOrCollection}`} />
  }

  const englishCollectionItems = getAllSortedWritings("en").filter(
    (w) => w.metadata.series === slugOrCollection
  )
  if (englishCollectionItems.length) {
    return <NotTranslatedYet englishHref={`/posts/${slugOrCollection}`} />
  }

  notFound()
}
