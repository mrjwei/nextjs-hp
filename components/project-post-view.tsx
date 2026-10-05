import Link from "next/link"
import { CustomMDX } from "@/components/mdx"
import { PrevNext } from "@/components/prev-next"
import { BackToTop } from "@/components/back-to-top"
import { WritingCard } from "@/components/article-card"
import { Tags } from "@/components/tags"
import { ResultBlock } from "@/components/result-block"
import { ComingSoonBadge } from "@/components/coming-soon-badge"
import { ReadingSeriesBadge } from "@/components/reading-series"
import { BackLink } from "@/components/back-link"
import {
  formatDate,
  getAllSortedWritings,
  getWritingHref,
  getProjectHref,
  getProjectPostHref,
  type TContentItem,
  type TContentMeta,
  type TProject,
} from "app/utils"
import { baseUrl } from "app/sitemap"
import type { Lang } from "app/i18n/config"

const copy: Record<
  Lang,
  {
    home: string
    projects: string
    backToProject: (project: string) => string
    published: string
    updated: string
    similar: string
  }
> = {
  en: {
    home: "Home",
    projects: "Projects",
    backToProject: (project) => `Back to ${project}`,
    published: "Published:",
    updated: "Updated:",
    similar: "You May Also Like",
  },
  ja: {
    home: "ホーム",
    projects: "プロジェクト",
    backToProject: (project) => `${project}に戻る`,
    published: "公開日:",
    updated: "更新日:",
    similar: "あわせて読みたい",
  },
}

// A post read from its project's page (/projects/[project]/[slug]). Same body
// as the /posts page, but the breadcrumb, back link and prev/next stay inside
// the project. The canonical URL is still the /posts one.
export function ProjectPostView({
  project,
  writing,
  lang = "en",
}: {
  project: TProject
  writing: TContentItem
  lang?: Lang
}) {
  const t = copy[lang]
  const prefix = lang === "ja" ? "/ja" : ""
  const projectHref = getProjectHref(project.id, lang)
  const writings = getAllSortedWritings(lang)

  // Sibling posts in this project stay on the project path; anything else
  // goes to its canonical /posts URL.
  const hrefFor = (w: TContentMeta) =>
    w.metadata.project === project.id
      ? getProjectPostHref(project.id, w.slug, lang)
      : getWritingHref(w, lang)

  const itemIndex = project.items.findIndex((w) => w.slug === writing.slug)

  const seriesParts = writing.metadata.partOf
    ? writings
        .filter((w) => w.metadata.partOf === writing.metadata.partOf)
        .sort((a, b) => (a.metadata.partNumber ?? 0) - (b.metadata.partNumber ?? 0))
    : []
  const partIndex = seriesParts.findIndex((w) => w.slug === writing.slug)

  const writingTagSet = new Set(writing.metadata.tags)
  const similarWritings = writings
    .filter((w) => w.slug !== writing.slug && !w.metadata.placeholder)
    .filter((w) => w.metadata.tags.some((tag) => writingTagSet.has(tag)))
    .sort((a, b) =>
      new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt) ? -1 : 1
    )

  const backLabel = t.backToProject(project.id)

  return (
    <div className="w-full max-w-[1024px] mx-auto px-8 md:px-16 py-24">
      <section className="pb-16 bg-[var(--surface-card)] rounded-lg shadow-xs border border-[var(--border-subtle)] p-8 md:p-12">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-x-4 gap-y-2 mb-4">
          <nav aria-label="Breadcrumb" className="min-w-0 sm:flex-1 text-sm text-[var(--text-muted)]">
            <Link href={prefix || "/"} className="hover:underline hover:text-[var(--text-strong)] transition-colors">
              {t.home}
            </Link>
            <span className="mx-2 text-[var(--text-subtle)]">/</span>
            <Link href={`${prefix}/projects`} className="hover:underline hover:text-[var(--text-strong)] transition-colors">
              {t.projects}
            </Link>
            <span className="mx-2 text-[var(--text-subtle)]">/</span>
            <Link href={projectHref} className="hover:underline hover:text-[var(--text-strong)] transition-colors">
              {project.id}
            </Link>
            <span className="mx-2 text-[var(--text-subtle)]">/</span>
            <span className="text-[var(--text-strong)]">{writing.metadata.title}</span>
          </nav>
          <BackLink href={projectHref} label={backLabel} />
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
              url: `${baseUrl}${getWritingHref(writing, lang)}`,
              inLanguage: lang,
              author: {
                "@type": "Person",
                name: "Jesse Wei | Writings and Works",
              },
            }),
          }}
        />

        {writing.metadata.placeholder && (
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <ComingSoonBadge lang={lang} />
          </div>
        )}
        <h1 className="display text-4xl mb-4">{writing.metadata.title}</h1>
        {seriesParts.length > 1 && partIndex !== -1 && (
          <ReadingSeriesBadge
            title={writing.metadata.partOfTitle ?? writing.metadata.partOf!}
            partNumber={partIndex + 1}
            total={seriesParts.length}
            prevHref={partIndex > 0 ? hrefFor(seriesParts[partIndex - 1]) : undefined}
            nextHref={
              partIndex < seriesParts.length - 1 ? hrefFor(seriesParts[partIndex + 1]) : undefined
            }
            lang={lang}
          />
        )}
        <Tags
          tags={writing.metadata.tags}
          className="mb-4"
          hrefForTag={(tag) => `${prefix}/posts?tags=${encodeURIComponent(tag)}`}
        />
        <div className="flex justify-between items-center mt-2 mb-12 text-sm border-b border-[var(--border-subtle)] pb-6">
          <p className="text-sm text-[var(--text-muted)]">
            {t.published} {formatDate(writing.metadata.publishedAt, false, lang)}
            {writing.metadata.updatedAt && (
              <> · {t.updated} {formatDate(writing.metadata.updatedAt, false, lang)}</>
            )}
          </p>
        </div>

        <ResultBlock metadata={writing.metadata} lang={lang} />

        <article className="prose">
          <CustomMDX source={writing.content} />
        </article>

        <div className="mt-8 flex flex-col md:flex-row md:justify-between items-center pt-8 border-t border-[var(--border-subtle)]">
          <Link
            href={projectHref}
            className="inline-flex items-center gap-2 text-[var(--accent-text)] hover:underline transition-colors font-medium mb-4 md:mb-0"
          >
            ← {backLabel}
          </Link>
          <PrevNext
            items={project.items}
            itemIndex={itemIndex}
            path="writings"
            linkFor={hrefFor}
            lang={lang}
          />
        </div>
      </section>

      <section className="pt-16 bg-[var(--surface-card)] rounded-lg shadow-xs border border-[var(--border-subtle)] p-8 md:p-12 mt-8">
        <h2 className="text-2xl font-semibold tracking-tight text-[var(--text-strong)] mb-8">
          {t.similar}
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
