import { Grid } from "app/components/grid"
import { Sidebar } from "app/components/sidebar"
import { getAllSortedPortfolioCollections, ParseSeriesDirName } from "app/utils"

export const metadata = {
  title: "Portfolio | Jesse Wei",
  description: "A selection of my projects and work.",
}

export default async function PortfolioPage({ searchParams }) {
  const allCollections = getAllSortedPortfolioCollections()
  const collectionValue = searchParams?.collection
  const activeCollection = collectionValue
    ? allCollections.find((c) => c.subdir === collectionValue)
    : undefined

  const allItems = allCollections.flatMap((c) => c.items)
  const items = [
    {
      label: "All",
      value: "all",
      href: "/portfolio",
      length: allItems.length,
      shouldBeUppercase: false,
    },
    ...allCollections.map((c) => ({
      label: ParseSeriesDirName(c.subdir),
      value: c.subdir,
      href: `/portfolio?collection=${c.subdir}`,
      length: c.items.length,
    })),
  ]

  const targetValue = activeCollection ? activeCollection.subdir : "all"
  const portfolioItems = activeCollection ? activeCollection.items : allItems

  return (
    <section className="grid grid-cols-12 gap-8 pt-[48px]">
      <Sidebar
        items={items}
        targetValue={targetValue}
        classname="hidden md:block bg-gray-800 text-white p-8 md:col-span-3 sticky md:top-[48px] h-screen"
      />
      <div className="col-span-12 px-4 py-8 md:col-span-9 md:pl-0 md:pr-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Portfolio</h1>
          <p className="text-lg text-gray-600 mb-4">
            Selected projects and experiments. (More coming soon.)
          </p>
          <Sidebar items={items} targetValue={activeCollection?.subdir} classname="block md:hidden" />
        </div>

        {portfolioItems.length === 0 ? (
          <div className="bg-white shadow-md rounded-2xl p-6">
            <h2 className="text-lg font-bold mb-2">No items yet</h2>
            <p className="text-neutral-600">
              Add MDX files under <code>app/portfolio/posts</code> to populate this page.
            </p>
          </div>
        ) : (
          <Grid writings={portfolioItems} path="portfolio" />
        )}
      </div>
    </section>
  )
}
