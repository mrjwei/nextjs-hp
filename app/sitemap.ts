import {
  getAllSortedGallery,
  getAllSortedWritings,
} from "app/utils"

export const baseUrl = "https://jessewei.net"

export default async function sitemap() {
  const writingsList = getAllSortedWritings()

  const primaryCollectionSlug = (metadata: { series?: string }) =>
    metadata.series

  // Case studies (tags includes "casestudy") are canonical at /work/[slug]
  // (see docs/publish.md) — list that URL instead of /writings/[slug].
  const writingUrl = (writing: (typeof writingsList)[number], lang: "en" | "ja") => {
    const prefix = lang === "ja" ? "/ja" : ""
    if (writing.metadata.tags.includes("casestudy")) {
      return `${baseUrl}${prefix}/work/${writing.slug}`
    }
    const collection = primaryCollectionSlug(writing.metadata)
    return collection
      ? `${baseUrl}${prefix}/writings/${collection}/${writing.slug}`
      : `${baseUrl}${prefix}/writings/${writing.slug}`
  }

  let writings = writingsList.map((writing) => ({
    url: writingUrl(writing, "en"),
    lastModified: writing.metadata.updatedAt ?? writing.metadata.publishedAt,
  }))

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
    { url: `${baseUrl}/work`, lastModified: writingsLastMod },
    { url: `${baseUrl}/writings`, lastModified: writingsLastMod },
    { url: `${baseUrl}/writings/series`, lastModified: writingsLastMod },
    { url: `${baseUrl}/gallery`, lastModified: galleryLastMod },
    { url: `${baseUrl}/ja`, lastModified: today },
    { url: `${baseUrl}/ja/about`, lastModified: today },
    { url: `${baseUrl}/ja/work`, lastModified: today },
    { url: `${baseUrl}/ja/writings`, lastModified: today },
    { url: `${baseUrl}/ja/writings/series`, lastModified: today },
    { url: `${baseUrl}/ja/gallery`, lastModified: today },
  ]

  const writingsJaList = getAllSortedWritings("ja")
  const writingsJa = writingsJaList.map((writing) => ({
    url: writingUrl(writing, "ja"),
    lastModified: writing.metadata.updatedAt ?? writing.metadata.publishedAt,
  }))

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
