import Link from "next/link"
import { notFound } from "next/navigation"
import {
  getAllSortedWritings,
  getWritingBySlug,
  getWritingHref,
  formatDate,
  isCaseStudy,
  isWorkItem,
} from "app/utils"
import { buildStandardMetadata } from "app/seo/metadata"
import { CustomMDX } from "@/components/mdx"
import { BackToTop } from "@/components/back-to-top"
import { Tags } from "@/components/tags"
import { ResultBlock } from "@/components/result-block"
import { baseUrl } from "app/sitemap"

export const dynamic = "force-static"

function getWork(slug: string) {
  const writing = getWritingBySlug(slug)
  return writing && isWorkItem(writing.metadata) ? writing : null
}

export async function generateStaticParams() {
  return getAllSortedWritings()
    .filter((w) => isWorkItem(w.metadata))
    .map((w) => ({ slug: w.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const work = getWork(params.slug)
  if (!work) {
    return buildStandardMetadata({
      title: "Not Found",
      description: "This page could not be found.",
      pathname: `/work/${params.slug}`,
    })
  }

  const { title, publishedAt: publishedTime, summary: description, image, archived } =
    work.metadata

  // Only true case studies (tags: ["casestudy", ...]) are canonical at
  // /work/[slug] (see docs/publish.md). A writing surfaced here only via
  // `track` keeps its natural home under /writings as canonical, so the
  // two views of the same content don't fight over canonical URLs.
  const pathname = isCaseStudy(work.metadata)
    ? `/work/${work.slug}`
    : getWritingHref(work)

  return buildStandardMetadata({
    title,
    description,
    pathname,
    type: "article",
    publishedTime,
    image,
    noIndex: archived,
  })
}

export default async function WorkCasePage({ params }: { params: { slug: string } }) {
  const work = getWork(params.slug)
  if (!work) {
    notFound()
  }

  return (
    <div className="w-full max-w-[1024px] mx-auto px-8 md:px-16 py-24">
      <section className="pb-16 bg-[var(--surface-card)] rounded-lg shadow-xs border border-[var(--border-subtle)] p-8 md:p-12">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-[var(--text-muted)]">
          <Link href="/" className="hover:underline hover:text-[var(--text-strong)] transition-colors">
            Home
          </Link>
          <span className="mx-2 text-[var(--text-subtle)]">/</span>
          <Link href="/work" className="hover:underline hover:text-[var(--text-strong)] transition-colors">
            Work
          </Link>
          <span className="mx-2 text-[var(--text-subtle)]">/</span>
          <span className="text-[var(--text-strong)]">{work.metadata.title}</span>
        </nav>

        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              headline: work.metadata.title,
              datePublished: work.metadata.publishedAt,
              dateModified: work.metadata.updatedAt ?? work.metadata.publishedAt,
              description: work.metadata.summary,
              image: work.metadata.image
                ? `${baseUrl}${work.metadata.image}`
                : `${baseUrl}/og?title=${encodeURIComponent(work.metadata.title)}`,
              url: `${baseUrl}${
                isCaseStudy(work.metadata) ? `/work/${work.slug}` : getWritingHref(work)
              }`,
              author: {
                "@type": "Person",
                name: "Jesse Wei | Writings and Works",
              },
            }),
          }}
        />

        <h1 className="display text-4xl mb-4">{work.metadata.title}</h1>
        <Tags tags={work.metadata.tags} className="mb-4" />
        {work.metadata.archived && (
          <div className="mb-6 px-4 py-3 rounded-md border border-[var(--border-subtle)] bg-[var(--surface-sunken)] text-sm text-[var(--text-muted)]">
            This case study has been archived and is no longer listed on the site.
          </div>
        )}
        <div className="flex justify-between items-center mt-2 mb-12 text-sm border-b border-[var(--border-subtle)] pb-6">
          <p className="text-sm text-[var(--text-muted)]">
            Published: {formatDate(work.metadata.publishedAt)}
            {work.metadata.updatedAt && (
              <> · Updated: {formatDate(work.metadata.updatedAt)}</>
            )}
          </p>
        </div>

        <ResultBlock metadata={work.metadata} />

        <article className="prose">
          <CustomMDX source={work.content} />
        </article>

        <div className="mt-8 pt-8 border-t border-[var(--border-subtle)]">
          <Link
            href="/work"
            className="inline-flex items-center gap-2 text-[var(--accent-text)] hover:underline transition-colors font-medium"
          >
            ← Back to Work
          </Link>
        </div>
      </section>

      <BackToTop />
    </div>
  )
}
