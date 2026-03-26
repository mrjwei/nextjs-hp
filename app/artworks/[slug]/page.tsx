import { notFound } from "next/navigation"
import Link from "next/link"
import { CustomMDX } from "app/components/mdx"
import { PrevNext } from "app/components/prev-next"
import { formatDate, getAllSortedWorks, getWorkBySlug } from "app/utils"
import { baseUrl } from "app/sitemap"
import { BackToTop } from "app/components/back-to-top"
import { buildStandardMetadata } from "app/seo/metadata"

export async function generateStaticParams() {
  let works = getAllSortedWorks()

  return works.map((work) => ({
    slug: work.slug,
  }))
}

export function generateMetadata({ params }) {
  let work = getAllSortedWorks().find((work) => work.slug === params.slug)
  if (!work) {
    return
  }

  let {
    title,
    publishedAt: publishedTime,
    summary: description,
    image,
  } = work.metadata
  let ogImage = image
    ? image
    : `${baseUrl}/og?title=${encodeURIComponent(title)}`

  return buildStandardMetadata({
    title,
    description,
    pathname: `/artworks/${work.slug}`,
    type: "article",
    publishedTime,
    image: ogImage,
  })
}

export default function Artwork({ params }) {
  const works = getAllSortedWorks()
  const work = getWorkBySlug(params.slug)
  if (!work) {
    notFound()
  }

  const workIndex = works.findIndex((work) => work.slug === params.slug)

  return (
    <div className="w-full max-w-[1024px] mx-auto px-8 md:px-16 py-24">
      <section>
        <nav aria-label="Breadcrumb" className="text-sm text-neutral-600 mb-4">
          <Link href="/" className="hover:underline">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/artworks" className="hover:underline">Artworks</Link>
        </nav>
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "VisualArtwork",
              headline: work.metadata.title,
              datePublished: work.metadata.publishedAt,
              dateModified: work.metadata.publishedAt,
              description: work.metadata.summary,
              image: work.metadata.image
                ? `${baseUrl}${work.metadata.image}`
                : `${baseUrl}/og?title=${encodeURIComponent(work.metadata.title)}`,
              url: `${baseUrl}/artworks/${work.slug}`,
              author: {
                "@type": "Person",
                name: "Jesse Wei",
              },
            }),
          }}
        />
        <Link href={`/artworks`} className="text-blue-500 hover:underline block mb-4">
            Back to All Artworks
          </Link>
        <h1 className="title font-bold text-4xl">{work.metadata.title}</h1>
        <div className="flex justify-between items-center mt-2 mb-8 text-sm">
          <p className="text-sm text-neutral-600">
            Published at: {formatDate(work.metadata.publishedAt)}
          </p>
        </div>
        <article className="prose">
          <CustomMDX source={work.content} />
        </article>
        <div className="mt-8 flex flex-col md:flex-row md:justify-between items-center">
          <Link href={`/artworks`} className="text-blue-500 hover:underline mb-4 md:mb-0">
            Back to All Artworks
          </Link>
          <PrevNext
            items={works}
            itemIndex={workIndex}
            path='artworks'
          />
        </div>
      </section>
      <BackToTop />
    </div>
  )
}
