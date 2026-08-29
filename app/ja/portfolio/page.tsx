import { Grid } from "@/components/grid"
import { Sidebar } from "@/components/sidebar"
import { JaEmptyNotice } from "@/components/ja-empty-notice"
import { getAllSortedPortfolioCollections } from "app/utils"
import { buildStandardMetadata } from "app/seo/metadata"

export const metadata = buildStandardMetadata({
  title: "ポートフォリオ",
  description:
    "厳選したケーススタディ——最終画面だけでなく、その裏にある意思決定・制約・トレードオフまで。",
  pathname: "/ja/portfolio",
  alternatePathname: "/portfolio",
  alternateLang: "en",
})

export const dynamic = "force-static"

const collectionLabel: Record<string, string> = {
  projects: "プロジェクト",
  artworks: "アートワーク",
}

export default async function PortfolioPage() {
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

  const portfolioItems = allItems

  return (
    <section className="grid grid-cols-12 gap-8 pt-[var(--header-height)]">
      <Sidebar
        items={items}
        targetValue="all"
        classname="hidden md:block bg-[var(--surface-sunken)] border-r border-[var(--border-subtle)] p-8 md:col-span-3 sticky md:top-[var(--header-height)] h-screen"
      />
      <div className="col-span-12 px-4 py-8 md:col-span-9 md:pl-0 md:pr-8">
        <div className="mb-8">
          <span className="eyebrow">ポートフォリオ</span>
          <h1 className="mt-3 mb-2 text-3xl md:text-4xl font-semibold tracking-tight text-[var(--text-strong)]">
            ポートフォリオ
          </h1>
          <p className="text-lg text-[var(--text-muted)] mb-4">
            厳選したケーススタディ——最終画面だけでなく、その裏にある意思決定・制約・トレードオフまで。
          </p>
          <Sidebar items={items} targetValue="all" classname="block md:hidden" />
        </div>

        {portfolioItems.length === 0 ? (
          <JaEmptyNotice englishHref="/portfolio" englishLabel="英語版のポートフォリオを見る" />
        ) : (
          <Grid writings={portfolioItems} path="portfolio" lang="ja" />
        )}
      </div>
    </section>
  )
}
