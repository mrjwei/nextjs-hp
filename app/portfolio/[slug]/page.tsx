import Link from "next/link"
import { notFound } from "next/navigation"
import { CustomMDX } from "app/components/mdx"
import { Tags } from "app/components/tags"
import { formatDate, getAllSortedPortfolio } from "app/utils"
import { openSans } from "app/data/fonts"

export async function generateStaticParams() {
  const items = getAllSortedPortfolio()
  return items.map((item) => ({ slug: item.slug }))
}

export function generateMetadata({ params }) {
  const item = getAllSortedPortfolio().find((p) => p.slug === params.slug)
  if (!item) return

  return {
    title: item.metadata.title,
    description: item.metadata.summary,
  }
}

export default async function PortfolioItemPage({ params, searchParams }) {
  const items = getAllSortedPortfolio()
  const item = items.find((p) => p.slug === params.slug)
  if (!item) {
    notFound()
  }

  const from = (await searchParams).from || null

  return (
    <div className="w-full max-w-[1024px] mx-auto px-8 md:px-16 py-24">
      <section className="pb-16">
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
