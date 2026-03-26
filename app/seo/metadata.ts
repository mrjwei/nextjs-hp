import type { Metadata } from "next"
import { baseUrl } from "app/sitemap"

type StandardMetadataInput = {
  title: string
  description: string
  pathname: string
  image?: string
  type?: "website" | "article"
  publishedTime?: string
}

function toAbsoluteUrl(url: string) {
  if (url.startsWith("http://") || url.startsWith("https://")) return url
  return `${baseUrl}${url.startsWith("/") ? url : `/${url}`}`
}

export function buildStandardMetadata({
  title,
  description,
  pathname,
  image,
  type = "website",
  publishedTime,
}: StandardMetadataInput): Metadata {
  const canonical = `${baseUrl}${pathname}`

  const ogImage = toAbsoluteUrl(
    image ? image : `/og?title=${encodeURIComponent(title)}`
  )

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Jesse Wei",
      type,
      ...(type === "article" && publishedTime
        ? { publishedTime }
        : null),
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  }
}
