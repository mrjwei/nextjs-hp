import Link from "next/link"
import { getAllSortedWritingSeries } from "app/utils"
import { buildStandardMetadata } from "app/seo/metadata"
import { BackLink } from "@/components/back-link"
import { SeriesIndexView } from "app/writings/series-index.client"

export const metadata = buildStandardMetadata({
  title: "Series",
  description: "Browse all writing series.",
  pathname: "/writings/series",
  alternatePathname: "/ja/writings/series",
  alternateLang: "ja",
})

export const dynamic = "force-static"

export default async function Page() {
  const series = getAllSortedWritingSeries().map((s) => ({
    slug: s.slug,
    title: s.title,
    count: s.items.length,
  }))

  return (
    <div className="w-full max-w-[1024px] mx-auto px-6 md:px-8 py-24">
      <nav aria-label="Breadcrumb" className="text-sm text-[var(--text-muted)] mb-4">
        <Link href="/" className="hover:underline hover:text-[var(--text-strong)] transition-colors">
          Home
        </Link>
        <span className="mx-2 text-[var(--text-subtle)]">/</span>
        <Link href="/writings" className="hover:underline hover:text-[var(--text-strong)] transition-colors">
          Writings
        </Link>
        <span className="mx-2 text-[var(--text-subtle)]">/</span>
        <span className="text-[var(--text-strong)]">Series</span>
      </nav>

      <div className="flex items-center justify-between mb-3">
        <span className="eyebrow">Series</span>
        <BackLink href="/writings" label="Back to All Writings" />
      </div>
      <h1 className="mb-3 text-3xl md:text-4xl font-semibold tracking-tight text-[var(--text-strong)]">
        Series
      </h1>
      <p className="text-lg text-[var(--text-muted)] mb-8">
        {series.length} series of related writings.
      </p>

      <SeriesIndexView series={series} writingsRoot="/writings" />
    </div>
  )
}
