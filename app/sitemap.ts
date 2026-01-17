import { getAllSortedPortfolio, getAllSortedWritings } from "app/utils"

export const baseUrl = "https://www.jessewei.net"

export default async function sitemap() {
  let writings = getAllSortedWritings().map((writing) => ({
    url: `${baseUrl}/writings/${writing.slug}`,
    lastModified: writing.metadata.publishedAt,
  }))

  let portfolio = getAllSortedPortfolio().map((item) => ({
    url: `${baseUrl}/portfolio/${item.slug}`,
    lastModified: item.metadata.publishedAt,
  }))

  let routes = ["", "/writings", "/portfolio"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split("T")[0],
  }))

  return [...routes, ...writings, ...portfolio]
}
