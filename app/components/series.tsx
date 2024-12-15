import Link from "next/link"
import { ArrowRightIcon } from "@heroicons/react/24/outline"
import { getSeries } from "app/utils"
import { ArticleCard } from "app/components/article-card"
import { kanit } from "app/data/fonts"

export function Series({
  numSeries,
  hasSeeMore = true,
}: {
  numSeries?: number
  hasSeeMore?: boolean
}) {
  let series = getSeries().sort((a, b) => {
    if (new Date(a[0].metadata.order) > new Date(b[0].metadata.order)) {
      return -1
    }
    return 1
  })

  if (numSeries) {
    series = series.slice(0, numSeries)
  }

  return (
    <div>
      {series.map((s) => {
        return (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">{s[0].metadata.seriesTitle}</h2>
            <div className="grid grid-cols-12 gap-6">
              {s.map((article) => (
                <Link
                  key={article.slug}
                  className="col-span-12 sm:col-span-6 lg:col-span-4"
                  href={`/series/${article.metadata.seriesSlug}/${article.slug}`}
                >
                  <ArticleCard article={article} />
                </Link>
              ))}
            </div>
          </div>
        )
      })}
      {hasSeeMore && (
        <div className="flex justify-center mt-8">
          <Link
            href="/series"
            className="border-2 rounded border-neutral-600 p-2 flex items-center"
          >
            <span className={`mr-2 ${kanit.className}`}>See more</span>
            <ArrowRightIcon className="w-5" />
          </Link>
        </div>
      )}
    </div>
  )
}
