import Link from "next/link"
import { notFound } from "next/navigation"
import { Grid } from "app/components/grid"
import { getAllSortedSeries, ParseSeriesDirName } from "app/utils"
import { Sidebar } from "app/components/sidebar"

export async function generateStaticParams() {
  let allSeries = getAllSortedSeries()

  return allSeries.map((s) => ({
    slug: s.subdir,
  }))
}

export const metadata = {
  title: "Series | Jesse Wei",
  description: "My series of writings, experiments, and projects.",
}

export default async function Series({ params }) {
  const allSeries = getAllSortedSeries()
  const allSeriesItems = allSeries.flatMap((s) => s.items)
  const series = allSeries.find((s) => s.subdir === params.slug)
  if (!series) {
    notFound()
  }

  const items = [
    {
      label: "All",
      value: "all",
      href: "/writings/series",
      length: allSeriesItems.length,
      shouldBeUppercase: false,
    },
    ...allSeries.map((s) => ({
      label: ParseSeriesDirName(s.subdir),
      value: s.subdir,
      href: `/writings/series/${s.subdir}`,
      length: s.items.length,
    })),
  ]

  return (
    <section className="grid grid-cols-12 gap-8 pt-[48px]">
      <Sidebar
        items={items}
        targetValue={params.slug}
        classname="hidden md:block bg-gray-800 text-white p-8 md:col-span-3 sticky md:top-[48px] h-screen"
      />
      <div className="col-span-12 md:col-span-9 px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-8">
          Series - {ParseSeriesDirName(series.subdir)}
        </h1>
        <div className="" key={series.subdir}>
          <Grid writings={series.items} from={`/series/${series.subdir}`} />
        </div>
        <Link
          href={`/writings/series`}
          className="text-blue-500 hover:underline block mt-8"
        >
          Back to All Series
        </Link>
      </div>
    </section>
  )
}
