import {
  getAllSortedPortfolio,
  getAllSortedWritings,
} from "app/utils"

export const baseUrl = "https://www.jessewei.net"

export default async function sitemap() {
  const writingsList = getAllSortedWritings()

  const primaryCollectionSlug = (metadata: { series?: string }) =>
    metadata.series

  let writings = writingsList.map((writing) => {
    const collection = primaryCollectionSlug(writing.metadata)
    let url = collection ? `${baseUrl}/writings/${collection}/${writing.slug}` : `${baseUrl}/writings/${writing.slug}`
    return {
      url,
      lastModified: writing.metadata.publishedAt,
    }
  })

  const collectionToLatestPublishedAt = new Map<string, string>()
  for (const w of writingsList) {
    const collection = primaryCollectionSlug(w.metadata)
    if (!collection) continue
    const existing = collectionToLatestPublishedAt.get(collection)
    if (!existing || new Date(w.metadata.publishedAt) > new Date(existing)) {
      collectionToLatestPublishedAt.set(collection, w.metadata.publishedAt)
    }
  }

  const collectionRoutes = Array.from(collectionToLatestPublishedAt.entries()).map(
    ([collection, lastModified]) => ({
      url: `${baseUrl}/writings/${collection}`,
      lastModified,
    })
  )

  const portfolioList = getAllSortedPortfolio()
  let portfolio = portfolioList.map((item) => ({
    url: `${baseUrl}/portfolio/${item.slug}`,
    lastModified: item.metadata.publishedAt,
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

  let routes = [
    { url: `${baseUrl}`, lastModified: today },
    { url: `${baseUrl}/about`, lastModified: today },
    { url: `${baseUrl}/writings`, lastModified: writingsLastMod },
    { url: `${baseUrl}/portfolio`, lastModified: portfolioLastMod },
  ]

  return [...routes, ...collectionRoutes, ...writings, ...portfolio]
}
