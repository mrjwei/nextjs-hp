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

export const dynamic = "force-static"
export const dynamicParams = true

export async function generateStaticParams() {
  const writings = getAllSortedWritings("ja")
  return writings
    .filter((w) => w.metadata.series)
    .map((w) => ({
      slugOrCollection: w.metadata.series as string,
      slug: w.slug,
    }))
}

export function generateMetadata({ params }) {
  const writing = getAllSortedWritings("ja").find((w) => w.slug === params.slug)
  if (!writing) return

  const collection = writing.metadata.series
  if (collection !== params.slugOrCollection) {
    return
  }

  const { title, publishedAt: publishedTime, summary: description, image } = writing.metadata

  return buildStandardMetadata({
    title,
    description,
    pathname: `/ja/writings/${params.slugOrCollection}/${writing.slug}`,
    type: "article",
    publishedTime,
    image,
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

export default async function WritingInCollection({ params, searchParams }) {
  const writings = getAllSortedWritings("ja")
  const writing = getWritingBySlug(params.slug, "ja")

  const collection = params.slugOrCollection

  if (!writing || writing.metadata.series !== collection) {
    const englishWriting = getWritingBySlug(params.slug, "en")
    if (englishWriting && englishWriting.metadata.series === collection) {
      return <NotTranslatedYet englishHref={getWritingHref(englishWriting, "en")} />
    }
    notFound()
  }

  const collectionItems = writings.filter((w) => w.metadata.series === collection)
  const writingIndex = collectionItems.findIndex((w) => w.slug === params.slug)

  const seriesParts = writing.metadata.partOf
    ? writings
        .filter((w) => w.metadata.partOf === writing.metadata.partOf)
        .sort((a, b) => (a.metadata.partNumber ?? 0) - (b.metadata.partNumber ?? 0))
    : []
  const partIndex = seriesParts.findIndex((w) => w.slug === writing.slug)

  const backHref = writing.metadata.partOf ? `/ja/writings/${writing.metadata.partOf}` : "/ja/writings"
  const backLabel = writing.metadata.partOf ? "シリーズトップに戻る" : "記事一覧に戻る"

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

  return (
    <div className="w-full max-w-[1024px] mx-auto px-8 md:px-16 py-24">
      <section className="pb-16 bg-[var(--surface-card)] rounded-lg shadow-xs border border-[var(--border-subtle)] p-8 md:p-12">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-x-4 gap-y-2 mb-4">
          <nav aria-label="Breadcrumb" className="min-w-0 sm:flex-1 text-sm text-[var(--text-muted)]">
            <Link href="/ja" className="hover:underline hover:text-[var(--text-strong)] transition-colors">
              ホーム
            </Link>
            <span className="mx-2 text-[var(--text-subtle)]">/</span>
            <Link href="/ja/writings" className="hover:underline hover:text-[var(--text-strong)] transition-colors">
              記事
            </Link>
            {writing.metadata.partOf && (
              <>
                <span className="mx-2 text-[var(--text-subtle)]">/</span>
                <Link
                  href={`/ja/writings/${writing.metadata.partOf}`}
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
              url: `${baseUrl}/ja/writings/${collection}/${writing.slug}`,
              inLanguage: "ja",
              author: {
                "@type": "Person",
                name: "Jesse Wei | Writings and Works",
              },
            }),
          }}
        />

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

            return `/ja/writings${qs}`
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
            linkFor={(item) => `/ja/writings/${collection}/${item.slug}`}
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
