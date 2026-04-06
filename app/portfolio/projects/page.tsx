import Link from "next/link"
import { notFound } from "next/navigation"
import { Grid } from "app/components/grid"
import { Sidebar } from "app/components/sidebar"
import { getAllSortedPortfolioCollections, ParseSeriesDirName } from "app/utils"
import { buildStandardMetadata } from "app/seo/metadata"

export const dynamic = "force-static"

export const metadata = buildStandardMetadata({
  title: "Portfolio - Projects",
  description: "Portfolio projects.",
  pathname: "/portfolio/projects",
})

export default async function PortfolioProjectsPage() {
  const collection = "projects"
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

  const filtered = allCollections.find((c) => c.subdir === collection)?.items ?? []
  if (filtered.length === 0) {
    notFound()
  }

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
            <Link href="/" className="hover:underline">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/portfolio" className="hover:underline">
              Portfolio
            </Link>
          </nav>

          <h1 className="text-2xl md:text-3xl font-bold mb-2">Projects</h1>
          <p className="text-lg text-gray-600 mb-4">All portfolio items in “Projects”.</p>

          <Sidebar items={items} targetValue={collection} classname="block md:hidden" />
        </div>

        <Grid writings={filtered} path="portfolio" />
      </div>
    </section>
  )
}
