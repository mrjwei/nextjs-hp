import Link from "next/link"
import { getAllSortedWritingSeries } from "app/utils"
import { buildStandardMetadata } from "app/seo/metadata"
import { BackLink } from "@/components/back-link"
import { SeriesIndexView } from "app/writings/series-index.client"

export const metadata = buildStandardMetadata({
  title: "シリーズ",
  description: "すべてのシリーズを見る。",
  pathname: "/ja/writings/series",
  alternatePathname: "/writings/series",
  alternateLang: "en",
})

export const dynamic = "force-static"

export default async function Page() {
  const series = getAllSortedWritingSeries("ja").map((s) => ({
    slug: s.slug,
    title: s.title,
    count: s.items.length,
  }))

  return (
    <div className="w-full max-w-[1024px] mx-auto px-6 md:px-8 py-24">
      <nav aria-label="Breadcrumb" className="text-sm text-[var(--text-muted)] mb-4">
        <Link href="/ja" className="hover:underline hover:text-[var(--text-strong)] transition-colors">
          ホーム
        </Link>
        <span className="mx-2 text-[var(--text-subtle)]">/</span>
        <Link href="/ja/writings" className="hover:underline hover:text-[var(--text-strong)] transition-colors">
          記事
        </Link>
        <span className="mx-2 text-[var(--text-subtle)]">/</span>
        <span className="text-[var(--text-strong)]">シリーズ</span>
      </nav>

      <div className="flex items-center justify-between mb-3">
        <span className="eyebrow">シリーズ</span>
        <BackLink href="/ja/writings" label="記事一覧に戻る" />
      </div>
      <h1 className="mb-3 text-3xl md:text-4xl font-semibold tracking-tight text-[var(--text-strong)]">
        シリーズ
      </h1>
      <p className="text-lg text-[var(--text-muted)] mb-8">
        関連記事のシリーズ {series.length}件。
      </p>

      <SeriesIndexView series={series} writingsRoot="/ja/writings" lang="ja" />
    </div>
  )
}
