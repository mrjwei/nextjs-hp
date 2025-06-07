import { getAllSortedWritings } from "app/utils"

export const baseUrl = "https://www.jessewei.net"

export default async function sitemap() {
  let writings = getAllSortedWritings().map((writing) => ({
    url: `${baseUrl}/writings/${writing.slug}`,
    lastModified: writing.metadata.publishedAt,
  }))

  let routes = ["", "/writings"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split("T")[0],
  }))

  return [...routes, ...writings]
}
