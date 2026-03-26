import Link from "next/link"
import { notFound } from "next/navigation"
import { CustomMDX } from "app/components/mdx"
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
  const item = getPortfolioItemBySlug(params.slug)
  if (!item) {
    notFound()
  }

  const from = (await searchParams).from || null

  return (
    <div className="w-full max-w-[1024px] mx-auto px-8 md:px-16 py-24">
      <section className="pb-16">
        <nav aria-label="Breadcrumb" className="text-sm text-neutral-600 mb-4">
          <Link href="/" className="hover:underline">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/portfolio" className="hover:underline">Portfolio</Link>
        </nav>
        <Link
          href={from ? `/${from}`.replace(/\/\/+/g, "/") : "/portfolio"}
          className="text-blue-500 hover:underline block mb-4"
        >
          Back to Portfolio
        </Link>
        <h1 className="title font-bold text-4xl mb-4">{item.metadata.title}</h1>
        <Tags tags={item.metadata.tags} className="mb-4" />
        <div className="flex justify-between items-center mt-2 mb-12 text-sm">
          <p className={`text-sm text-neutral-500 ${openSans.className}`}>
            Published at: {formatDate(item.metadata.publishedAt)}
          </p>
        </div>
        <article className="prose">
          <CustomMDX source={item.content} />
        </article>
      </section>
    </div>
  )
}
