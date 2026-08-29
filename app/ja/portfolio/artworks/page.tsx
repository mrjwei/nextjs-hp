import Link from "next/link"
import { Grid } from "@/components/grid"
import { Sidebar } from "@/components/sidebar"
import { JaEmptyNotice } from "@/components/ja-empty-notice"
import { getAllSortedPortfolioCollections } from "app/utils"
import { buildStandardMetadata } from "app/seo/metadata"

export const dynamic = "force-static"

export const metadata = buildStandardMetadata({
  title: "ポートフォリオ - アートワーク",
  description: "ポートフォリオのアートワーク一覧。",
  pathname: "/ja/portfolio/artworks",
})

const collectionLabel: Record<string, string> = {
  projects: "プロジェクト",
  artworks: "アートワーク",
}

export default async function PortfolioArtworksPage() {
  const collection = "artworks"
  const allCollections = getAllSortedPortfolioCollections("ja")
  const allItems = allCollections.flatMap((c) => c.items)

  const shownCollections = allCollections.filter(
    (c) => c.subdir === "projects" || c.subdir === "artworks"
  )

  const items = [
    {
      label: "すべて",
      value: "all",
      href: "/ja/portfolio",
      length: allItems.length,
      shouldBeUppercase: false,
    },
    ...shownCollections.map((c) => ({
      label: collectionLabel[c.subdir] ?? c.subdir,
      value: c.subdir,
      href: `/ja/portfolio/${c.subdir}`,
      length: c.items.length,
    })),
  ]

  const filtered = allCollections.find((c) => c.subdir === collection)?.items ?? []

  return (
    <section className="grid grid-cols-12 gap-8 pt-[var(--header-height)]">
      <Sidebar
        items={items}
        targetValue={collection}
        classname="hidden md:block bg-gray-800 text-white p-8 md:col-span-3 sticky md:top-[var(--header-height)] h-screen"
      />
      <div className="col-span-12 px-4 py-8 md:col-span-9 md:pl-0 md:pr-8">
        <div className="mb-8">
          <nav aria-label="Breadcrumb" className="text-sm text-neutral-600 mb-4">
            <Link href="/ja" className="hover:underline">
              ホーム
            </Link>
            <span className="mx-2">/</span>
            <Link href="/ja/portfolio" className="hover:underline">
              ポートフォリオ
            </Link>
          </nav>

          <h1 className="text-2xl md:text-3xl font-bold mb-2">アートワーク</h1>
          <p className="text-lg text-gray-600 mb-4">
            「アートワーク」に含まれるポートフォリオ項目。
          </p>

          <Sidebar items={items} targetValue={collection} classname="block md:hidden" />
        </div>

        {filtered.length === 0 ? (
          <JaEmptyNotice englishHref="/portfolio/artworks" englishLabel="英語版のアートワークを見る" />
        ) : (
          <Grid writings={filtered} path="portfolio" lang="ja" />
        )}
      </div>
    </section>
  )
}
