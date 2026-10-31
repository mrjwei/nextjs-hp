import { Fragment } from "react"
import Link from "next/link"
import { CustomMDX } from "@/components/posts/mdx"
import { PrevNext } from "@/components/posts/prev-next"
import { BackToTop } from "@/components/layout/back-to-top"
import { WritingCard } from "@/components/posts/article-card"
import { Tags } from "@/components/posts/tags"
import { ResultBlock } from "@/components/projects/result-block"
import { ProjectBadge } from "@/components/projects/project-badge"
import { ComingSoonBadge } from "@/components/posts/coming-soon-badge"
import { ReadingSeriesBadge } from "@/components/posts/reading-series"
import { BackLink } from "@/components/layout/back-link"
import {
  formatDate,
  getAllSortedWritings,
  getProjectHref,
  type TContentItem,
  type TContentMeta,
} from "@/lib/content"
import { dictionaries } from "@/lib/i18n/dictionaries"
import { localeHref, type Lang } from "@/lib/i18n/config"
import { baseUrl } from "@/lib/site"

export type Crumb = { label: string; href: string }

const crumbLink = "hover:underline hover:text-[var(--text-strong)] transition-colors"

/**
 * The body of a post page, shared by /posts/[slug], /posts/[collection]/[slug]
 * and /projects/[project]/[slug] in both languages. The caller decides the
 * breadcrumb, back link and prev/next sequence; everything else is the post.
 */
export function PostArticle({
  writing,
  lang,
  crumbs,
  backHref,
  backLabel,
  canonicalPath,
  prevNext,
  partHref,
  showProjectBadge = true,
  headerSpacing = "mb-4",
}: {
  writing: TContentItem
  lang: Lang
  /** Breadcrumb between Home and the post title. */
  crumbs: Crumb[]
  backHref: string
  backLabel: string
  /** The post's canonical /posts path, for the BlogPosting JSON-LD. */
  canonicalPath: string
  prevNext: { items: TContentMeta[]; linkFor: (item: TContentMeta) => string }
  /** Link for a part of the post's "Part N of M" sequence. */
  partHref: (item: TContentMeta) => string
  /** The project badge links to the project page, so a project page's own posts leave it out. */
  showProjectBadge?: boolean
  headerSpacing?: "mb-4" | "mb-6"
}) {
  const t = dictionaries[lang]
  const writings = getAllSortedWritings(lang)
  const { metadata } = writing

  const seriesParts = metadata.partOf
    ? writings
        .filter((w) => w.metadata.partOf === metadata.partOf)
        .sort((a, b) => (a.metadata.partNumber ?? 0) - (b.metadata.partNumber ?? 0))
    : []
  const partIndex = seriesParts.findIndex((w) => w.slug === writing.slug)
  const itemIndex = prevNext.items.findIndex((w) => w.slug === writing.slug)

  const writingTagSet = new Set(metadata.tags)
  const similarWritings = writings
    .filter((w) => w.slug !== writing.slug && !w.metadata.placeholder)
    .filter((w) => w.metadata.tags.some((tag) => writingTagSet.has(tag)))
    .sort((a, b) =>
      new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt) ? -1 : 1
    )

  const showBadges = (showProjectBadge && metadata.project) || metadata.placeholder

  return (
    <div className="w-full max-w-[1024px] mx-auto px-8 md:px-16 py-24">
      <section className="pb-16 bg-[var(--surface-card)] rounded-lg shadow-xs border border-[var(--border-subtle)] p-8 md:p-12">
        <div className={`flex flex-col sm:flex-row sm:items-start sm:justify-between gap-x-4 gap-y-2 ${headerSpacing}`}>
          <nav aria-label="Breadcrumb" className="min-w-0 sm:flex-1 text-sm text-[var(--text-muted)]">
            <Link href={localeHref(lang, "/")} className={crumbLink}>
              {t.nav.home}
            </Link>
            {crumbs.map((crumb) => (
              <Fragment key={crumb.href}>
                <span className="mx-2 text-[var(--text-subtle)]">/</span>
                <Link href={crumb.href} className={crumbLink}>
                  {crumb.label}
                </Link>
              </Fragment>
            ))}
            <span className="mx-2 text-[var(--text-subtle)]">/</span>
            <span className="text-[var(--text-strong)]">{metadata.title}</span>
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
              headline: metadata.title,
              datePublished: metadata.publishedAt,
              dateModified: metadata.updatedAt ?? metadata.publishedAt,
              description: metadata.summary,
              image: metadata.image
                ? `${baseUrl}${metadata.image}`
                : `${baseUrl}/og?title=${encodeURIComponent(metadata.title)}`,
              url: `${baseUrl}${canonicalPath}`,
              inLanguage: lang,
              author: {
                "@type": "Person",
                name: "Jesse Wei | Writings and Works",
              },
            }),
          }}
        />

        {showBadges && (
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {showProjectBadge && metadata.project && (
              <ProjectBadge project={metadata.project} href={getProjectHref(metadata.project, lang)} />
            )}
            {metadata.placeholder && <ComingSoonBadge lang={lang} />}
          </div>
        )}
        <h1 className="display text-4xl mb-4">{metadata.title}</h1>
        {seriesParts.length > 1 && partIndex !== -1 && (
          <ReadingSeriesBadge
            title={metadata.partOfTitle ?? metadata.partOf!}
            partNumber={partIndex + 1}
            total={seriesParts.length}
            prevHref={partIndex > 0 ? partHref(seriesParts[partIndex - 1]) : undefined}
            nextHref={partIndex < seriesParts.length - 1 ? partHref(seriesParts[partIndex + 1]) : undefined}
            lang={lang}
          />
        )}
        <Tags
          tags={metadata.tags}
          className="mb-4"
          hrefForTag={(tag) => `${localeHref(lang, "/posts")}?tags=${encodeURIComponent(tag)}`}
        />
        <div className="flex justify-between items-center mt-2 mb-12 text-sm border-b border-[var(--border-subtle)] pb-6">
          {!metadata.placeholder && (
            <p className="text-sm text-[var(--text-muted)]">
              {t.post.published} {formatDate(metadata.publishedAt, lang)}
              {metadata.updatedAt && (
                <> · {t.post.updated} {formatDate(metadata.updatedAt, lang)}</>
              )}
            </p>
          )}
        </div>

        <ResultBlock metadata={metadata} lang={lang} />

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
            items={prevNext.items}
            itemIndex={itemIndex}
            path="writings"
            linkFor={prevNext.linkFor}
            lang={lang}
          />
        </div>
      </section>

      <section className="pt-16 bg-[var(--surface-card)] rounded-lg shadow-xs border border-[var(--border-subtle)] p-8 md:p-12 mt-8">
        <h2 className="text-2xl font-semibold tracking-tight text-[var(--text-strong)] mb-8">
          {t.post.similar}
        </h2>
        <div className="grid grid-cols-12 gap-y-8 md:gap-8">
          {similarWritings.slice(0, 4).map((similarWriting) => (
            <WritingCard key={similarWriting.slug} article={similarWriting} lang={lang} />
          ))}
        </div>
      </section>

      <BackToTop />
    </div>
  )
}
