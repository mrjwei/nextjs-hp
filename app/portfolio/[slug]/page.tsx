import Link from "next/link"
import { notFound } from "next/navigation"
import { CustomMDX } from "app/components/mdx"
import { BackToTop } from "app/components/back-to-top"
import { WritingCard } from "app/components/article-card"
import { Tags } from "app/components/tags"
import { formatDate, getAllSortedPortfolio, getPortfolioItemBySlug } from "app/utils"
import { openSans } from "app/data/fonts"
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
      <section className="pb-16 bg-white rounded-2xl shadow-sm border border-neutral-200 p-8 md:p-12">
        <nav aria-label="Breadcrumb" className="text-sm text-neutral-600 mb-4">
          <Link href="/" className="hover:underline hover:text-neutral-900 transition-colors">
            Home
          </Link>
          <span className="mx-2 text-neutral-400">/</span>
          <Link
            href="/portfolio"
            className="hover:underline hover:text-neutral-900 transition-colors"
          >
            Portfolio
          </Link>
        </nav>

        <Link
          href={from ? `/${from}`.replace(/\/\/+/, "/") : "/portfolio"}
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:underline transition-colors font-medium block mb-6"
        >
          ← Back to Portfolio
        </Link>

        <h1 className="title font-bold text-4xl mb-4 text-neutral-900">
          {item.metadata.title}
        </h1>
        <Tags tags={item.metadata.tags} className="mb-4" />
        <div className="flex justify-between items-center mt-2 mb-12 text-sm border-b border-neutral-200 pb-6">
          <p className={`text-sm text-neutral-600 ${openSans.className}`}>
            Published: {formatDate(item.metadata.publishedAt)}
          </p>
        </div>

        <article className="prose">
          <CustomMDX source={item.content} />
        </article>
      </section>

      {moreWorks.length ? (
        <section className="pt-16 bg-white rounded-2xl shadow-sm border border-neutral-200 p-8 md:p-12 mt-8">
          <h2 className="text-2xl font-bold mb-8 text-neutral-900">More Works</h2>
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
