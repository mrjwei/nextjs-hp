import { Grid } from "@/components/grid"
import { Sidebar } from "@/components/sidebar"
import { getAllSortedPortfolioCollections, ParseSeriesDirName } from "app/utils"
import { buildStandardMetadata } from "app/seo/metadata"

export const metadata = buildStandardMetadata({
  title: "Portfolio",
  description: "A selection of my projects and work.",
  pathname: "/portfolio",
})

export const dynamic = "force-static"

export default async function PortfolioPage() {
  const allCollections = getAllSortedPortfolioCollections()
  const allItems = allCollections.flatMap((c) => c.items)
  const shownCollections = allCollections.filter(
    (c) => c.subdir === "projects" || c.subdir === "artworks"
  )
  const items = [
    {
      label: "All",
      value: "all",
      href: "/portfolio",
      length: allItems.length,
      shouldBeUppercase: false,
    },
    ...shownCollections.map((c) => ({
      label: ParseSeriesDirName(c.subdir),
      value: c.subdir,
      href: `/portfolio/${c.subdir}`,
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
          <span className="eyebrow">Portfolio</span>
          <h1 className="display mt-3 mb-2 text-3xl md:text-4xl">Portfolio</h1>
          <p className="text-lg text-[var(--text-muted)] mb-4">
            Selected projects and experiments. (More coming soon.)
          </p>
          <Sidebar items={items} targetValue="all" classname="block md:hidden" />
        </div>

        {portfolioItems.length === 0 ? (
          <div className="bg-[var(--surface-card)] border border-[var(--border-subtle)] shadow-xs rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-2 text-[var(--text-strong)]">No items yet</h2>
            <p className="text-[var(--text-muted)]">
              Add MDX files under <code>app/portfolio/posts</code> to populate this page.
            </p>
          </div>
        ) : (
          <>
            <Grid writings={portfolioItems} path="portfolio" />
          </>
        )}
      </div>
    </section>
  )
}
