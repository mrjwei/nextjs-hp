import { Grid } from "app/components/grid"
import { getAllSortedSeries, getAllSortedSeriesItems, ParseSeriesDirName } from "app/utils"
import { Sidebar, TCategory } from "app/components/sidebar"
import {capitalize} from 'app/utils'
import {categories} from 'app/data/categories'

export const metadata = {
  title: "Series | Jesse Wei",
  description: "My series of writings, experiments, and projects.",
}

export default async function AllSeriesPage() {
  const allSeries = getAllSortedSeries()
  const allSeriesItems = getAllSortedSeriesItems()

  const items = [{label: "All", value: "all", href: "/writings/series", length: allSeriesItems.length, shouldBeUppercase: false}, ...allSeries.map((s) => ({label: ParseSeriesDirName(s.subdir), value: s.subdir, href: `/writings/series/${s.subdir}`, length: s.items.length}))]

  return (
    <section className="grid grid-cols-12 gap-8 pt-[48px]">
      <Sidebar items={items} targetValue="all" classname="hidden md:block bg-gray-800 text-white p-8 md:col-span-3 sticky md:top-[48px] h-screen" />
      <div className="col-span-12 md:col-span-9 px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-2">Series</h1>
        {allSeries.map((s) => {
          return (
            <div className="mb-4" key={s.subdir}>
              <h2 className="font-bold text-lg py-4">{ParseSeriesDirName(s.subdir)}</h2>
              <Grid writings={s.items} from="/series" />
            </div>
          )
        })}
      </div>
    </section>
  )
}
