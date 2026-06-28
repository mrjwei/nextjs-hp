import Link from "next/link"
import { notFound } from "next/navigation"
import { CustomMDX } from "@/components/mdx"
import { BackToTop } from "@/components/back-to-top"
import { WritingCard } from "@/components/article-card"
import { Tags } from "@/components/tags"
import { formatDate, getAllSortedPortfolio, getPortfolioItemBySlug } from "app/utils"
import { buildStandardMetadata } from "app/seo/metadata"

export async function generateStaticParams() {
  const items = getAllSortedPortfolio()
  return items.map((item) => ({ slug: item.slug }))
}

export function generateMetadata({ params }) {
  const item = getAllSortedPortfolio().find((p) => p.slug === params.slug)
  if (!item) return

  return {
    ...buildStandardMetadata({
      title: item.metadata.title,
      description: item.metadata.summary,
      pathname: `/portfolio/${item.slug}`,
      type: "article",
      publishedTime: item.metadata.publishedAt,
      image: item.metadata.image,
    }),
  }
}

export default async function PortfolioItemPage({ params, searchParams }) {
  const allItems = getAllSortedPortfolio()
  const item = getPortfolioItemBySlug(params.slug)
  if (!item) {
    notFound()
  }

  const from = (await searchParams).from || null

  const moreWorks = allItems
    .filter((w) => w.slug !== item.slug)
    .slice(0, 4)

  return (
    <div className="w-full max-w-[1024px] mx-auto px-8 md:px-16 py-24">
      <section className="pb-16 bg-[var(--surface-card)] rounded-lg shadow-xs border border-[var(--border-subtle)] p-8 md:p-12">
        <nav aria-label="Breadcrumb" className="text-sm text-[var(--text-muted)] mb-4">
          <Link href="/" className="hover:underline hover:text-[var(--text-strong)] transition-colors">
            Home
          </Link>
          <span className="mx-2 text-[var(--text-subtle)]">/</span>
          <Link
            href="/portfolio"
            className="hover:underline hover:text-[var(--text-strong)] transition-colors"
          >
            Portfolio
          </Link>
        </nav>

        <Link
          href={from ? `/${from}`.replace(/\/\/+/, "/") : "/portfolio"}
          className="inline-flex items-center gap-2 text-[var(--accent-text)] hover:underline transition-colors font-medium block mb-6"
        >
          ← Back to Portfolio
        </Link>

        <h1 className="display text-4xl mb-4">
          {item.metadata.title}
        </h1>
        <Tags tags={item.metadata.tags} className="mb-4" />
        <div className="flex justify-between items-center mt-2 mb-12 text-sm border-b border-[var(--border-subtle)] pb-6">
          <p className="text-sm text-[var(--text-muted)]">
            Published: {formatDate(item.metadata.publishedAt)}
          </p>
        </div>

        <article className="prose">
          <CustomMDX source={item.content} />
        </article>
      </section>

      {moreWorks.length ? (
        <section className="pt-16 bg-[var(--surface-card)] rounded-lg shadow-xs border border-[var(--border-subtle)] p-8 md:p-12 mt-8">
          <h2 className="display text-2xl mb-8">More Works</h2>
          <div className="grid grid-cols-12 gap-y-8 md:gap-8">
            {moreWorks.map((work) => (
              <WritingCard key={work.slug} article={work} path="portfolio" />
            ))}
          </div>
        </section>
      ) : null}

      <BackToTop />
    </div>
  )
}
