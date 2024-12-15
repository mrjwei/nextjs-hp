import { getArticles } from 'app/utils'

export const baseUrl = 'https://www.jessewei.net'

export default async function sitemap() {
  let articles = getArticles().map((post) => ({
    url: `${baseUrl}/articles/${post.slug}`,
    lastModified: post.metadata.publishedAt,
  }))

  let routes = ['', '/articles'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  return [...routes, ...articles]
}
