import { baseUrl } from "app/sitemap"
import { getAllSortedWritings } from "app/utils"

export const revalidate = 3600

function primaryCollectionSlug(metadata: { series?: string }) {
  return metadata.series || "general"
}

function escapeXml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

export async function GET() {
  const allBlogs = getAllSortedWritings()

  const itemsXml = allBlogs
    .map(
      (post) => {
        const collection = primaryCollectionSlug(post.metadata)
        const url = `${baseUrl}/writings/${collection}/${post.slug}`
        const title = escapeXml(post.metadata.title)
        const description = escapeXml(post.metadata.summary || "")
        const pubDate = new Date(post.metadata.publishedAt).toUTCString()

        return (
        `<item>
          <title>${title}</title>
          <link>${url}</link>
          <guid isPermaLink="true">${url}</guid>
          <description>${description}</description>
          <pubDate>${pubDate}</pubDate>
        </item>`
        )
      }
    )
    .join("\n")

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
        <title>Jesse Wei | Writings and Works</title>
        <link>${baseUrl}</link>
        <atom:link href="${baseUrl}/rss" rel="self" type="application/rss+xml" />
        <description>This is my writings and works RSS feed</description>
        <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
        ${itemsXml}
    </channel>
  </rss>`

  return new Response(rssFeed, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  })
}
