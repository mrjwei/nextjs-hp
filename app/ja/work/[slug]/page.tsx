import Link from "next/link"
import { notFound } from "next/navigation"
import { getAllSortedWritings, getWritingBySlug, formatDate } from "app/utils"
import { buildStandardMetadata } from "app/seo/metadata"
import { CustomMDX } from "@/components/mdx"
import { BackToTop } from "@/components/back-to-top"
import { Tags } from "@/components/tags"
import { baseUrl } from "app/sitemap"

export const dynamic = "force-static"
export const dynamicParams = true

function getWork(slug: string) {
  const writing = getWritingBySlug(slug, "ja")
  return writing && writing.metadata.tags.includes("casestudy")
    ? writing
    : null
}

export async function generateStaticParams() {
  return getAllSortedWritings("ja")
    .filter((w) => w.metadata.tags.includes("casestudy"))
    .map((w) => ({ slug: w.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const work = getWork(params.slug)
  if (!work) return

  const { title, publishedAt: publishedTime, summary: description, image, archived } =
    work.metadata

  return buildStandardMetadata({
    title,
    description,
    pathname: `/ja/work/${work.slug}`,
    type: "article",
    publishedTime,
    image,
    noIndex: archived,
  })
}

function NotTranslatedYet({ englishHref }: { englishHref: string }) {
  return (
    <div className="w-full max-w-[1024px] mx-auto px-8 md:px-16 py-24">
      <div className="bg-[var(--surface-card)] rounded-lg shadow-xs border border-[var(--border-subtle)] p-8 md:p-12 text-center">
        <p className="mb-3 font-medium text-[var(--text-strong)]">
          この実績はまだ日本語訳がありません。
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

export default async function WorkCasePage({ params }: { params: { slug: string } }) {
  const work = getWork(params.slug)
  if (!work) {
    const englishWriting = getWritingBySlug(params.slug, "en")
    if (englishWriting?.metadata.tags.includes("casestudy")) {
      return <NotTranslatedYet englishHref={`/work/${englishWriting.slug}`} />
    }
    notFound()
  }

  return (
    <div className="w-full max-w-[1024px] mx-auto px-8 md:px-16 py-24">
      <section className="pb-16 bg-[var(--surface-card)] rounded-lg shadow-xs border border-[var(--border-subtle)] p-8 md:p-12">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-[var(--text-muted)]">
          <Link href="/ja" className="hover:underline hover:text-[var(--text-strong)] transition-colors">
            ホーム
          </Link>
          <span className="mx-2 text-[var(--text-subtle)]">/</span>
          <Link href="/ja/work" className="hover:underline hover:text-[var(--text-strong)] transition-colors">
            実績
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
              url: `${baseUrl}/ja/work/${work.slug}`,
              inLanguage: "ja",
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
            この実績はアーカイブされており、サイト上には掲載されていません。
          </div>
        )}
        <div className="flex justify-between items-center mt-2 mb-12 text-sm border-b border-[var(--border-subtle)] pb-6">
          <p className="text-sm text-[var(--text-muted)]">
            公開日: {formatDate(work.metadata.publishedAt)}
            {work.metadata.updatedAt && (
              <> · 更新日: {formatDate(work.metadata.updatedAt)}</>
            )}
          </p>
        </div>

        <article className="prose">
          <CustomMDX source={work.content} />
        </article>

        <div className="mt-8 pt-8 border-t border-[var(--border-subtle)]">
          <Link
            href="/ja/work"
            className="inline-flex items-center gap-2 text-[var(--accent-text)] hover:underline transition-colors font-medium"
          >
            ← 実績一覧に戻る
          </Link>
        </div>
      </section>

      <BackToTop />
    </div>
  )
}
