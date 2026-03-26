import {
  getAllSortedPortfolio,
  getAllSortedSeries,
  getAllSortedWritings,
} from "app/utils"

export const baseUrl = "https://www.jessewei.net"

export default async function sitemap() {
  const writingsList = getAllSortedWritings()
  let writings = writingsList.map((writing) => ({
    url: `${baseUrl}/writings/${writing.slug}`,
    lastModified: writing.metadata.publishedAt,
  }))

  const portfolioList = getAllSortedPortfolio()
  let portfolio = portfolioList.map((item) => ({
    url: `${baseUrl}/portfolio/${item.slug}`,
    lastModified: item.metadata.publishedAt,
  }))

  const seriesList = getAllSortedSeries()
  const seriesRoutes = seriesList.map((s) => ({
    url: `${baseUrl}/writings/series/${s.subdir}`,
    lastModified: s.items[0]?.metadata.publishedAt,
  }))

  const today = new Date().toISOString().split("T")[0]

  const maxPublishedAt = (dates: Array<string | undefined>) => {
    const valid = dates.filter(Boolean) as string[]
    if (valid.length === 0) return today
    return valid.reduce((max, current) =>
      new Date(current) > new Date(max) ? current : max
    )
  }

  const writingsLastMod = maxPublishedAt(
    writingsList.map((w) => w.metadata.publishedAt)
  )
  const portfolioLastMod = maxPublishedAt(
    portfolioList.map((p) => p.metadata.publishedAt)
  )
  const seriesLastMod = maxPublishedAt(
    seriesList.flatMap((s) => s.items.map((i) => i.metadata.publishedAt))
  )

  let routes = [
    { url: `${baseUrl}`, lastModified: today },
    { url: `${baseUrl}/about`, lastModified: today },
    { url: `${baseUrl}/writings`, lastModified: writingsLastMod },
    { url: `${baseUrl}/writings/series`, lastModified: seriesLastMod },
    { url: `${baseUrl}/portfolio`, lastModified: portfolioLastMod },
  ]

  return [...routes, ...seriesRoutes, ...writings, ...portfolio]
}
