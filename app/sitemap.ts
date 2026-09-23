import {
  getAllSortedGallery,
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
      lastModified: writing.metadata.updatedAt ?? writing.metadata.publishedAt,
    }
  })

  const galleryList = getAllSortedGallery()
  let gallery = galleryList.map((item) => ({
    url: `${baseUrl}/gallery/${item.slug}`,
    lastModified: item.metadata.updatedAt ?? item.metadata.publishedAt,
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
    writingsList.map((w) => w.metadata.updatedAt ?? w.metadata.publishedAt)
  )
  const galleryLastMod = maxPublishedAt(
    galleryList.map((p) => p.metadata.updatedAt ?? p.metadata.publishedAt)
  )

  const collectionRoutes = (list: typeof writingsList, lang: "en" | "ja") => {
    const byCollection = new Map<string, string[]>()
    for (const w of list) {
      if (!w.metadata.series) continue
      const dates = byCollection.get(w.metadata.series) ?? []
      dates.push(w.metadata.updatedAt ?? w.metadata.publishedAt)
      byCollection.set(w.metadata.series, dates)
    }
    const prefix = lang === "ja" ? "/ja" : ""
    return Array.from(byCollection.entries()).map(([slug, dates]) => ({
      url: `${baseUrl}${prefix}/writings/${slug}`,
      lastModified: maxPublishedAt(dates),
    }))
  }

  let routes = [
    { url: `${baseUrl}`, lastModified: today },
    { url: `${baseUrl}/about`, lastModified: today },
    { url: `${baseUrl}/writings`, lastModified: writingsLastMod },
    { url: `${baseUrl}/writings/series`, lastModified: writingsLastMod },
    { url: `${baseUrl}/gallery`, lastModified: galleryLastMod },
    { url: `${baseUrl}/ja`, lastModified: today },
    { url: `${baseUrl}/ja/about`, lastModified: today },
    { url: `${baseUrl}/ja/writings`, lastModified: today },
    { url: `${baseUrl}/ja/writings/series`, lastModified: today },
    { url: `${baseUrl}/ja/gallery`, lastModified: today },
  ]

  const writingsJaList = getAllSortedWritings("ja")
  const writingsJa = writingsJaList.map((writing) => {
    const collection = primaryCollectionSlug(writing.metadata)
    const url = collection
      ? `${baseUrl}/ja/writings/${collection}/${writing.slug}`
      : `${baseUrl}/ja/writings/${writing.slug}`
    return { url, lastModified: writing.metadata.updatedAt ?? writing.metadata.publishedAt }
  })

  const galleryJaList = getAllSortedGallery("ja")
  const galleryJa = galleryJaList.map((item) => ({
    url: `${baseUrl}/ja/gallery/${item.slug}`,
    lastModified: item.metadata.updatedAt ?? item.metadata.publishedAt,
  }))

  const writingsCollections = collectionRoutes(writingsList, "en")
  const writingsCollectionsJa = collectionRoutes(writingsJaList, "ja")

  return [
    ...routes,
    ...writings,
    ...gallery,
    ...writingsJa,
    ...galleryJa,
    ...writingsCollections,
    ...writingsCollectionsJa,
  ]
}
