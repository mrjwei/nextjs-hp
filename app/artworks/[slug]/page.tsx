import { notFound } from "next/navigation"
import { CustomMDX } from "app/components/mdx"
import { PrevNext } from "app/components/prev-next"
import { formatDate, getWorks } from "app/utils"
import { baseUrl } from "app/sitemap"
import Head from "next/head"
import { BackToTop } from "app/components/back-to-top"

export async function generateStaticParams() {
  let works = getWorks()

  return works.map((work) => ({
    slug: work.slug,
  }))
}

export function generateMetadata({ params }) {
  let work = getWorks().find((work) => work.slug === params.slug)
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

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime,
      url: `${baseUrl}/writings/${work.slug}`,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  }
}

export default function Artwork({ params }) {
  const works = getWorks()
  const work = works.find((work) => work.slug === params.slug)
  const workIndex = works.findIndex((work) => work.slug === params.slug)

  let prevIndex = workIndex - 1
  let nextIndex = workIndex + 1

  if (workIndex === works.length - 1) {
    nextIndex = 0
  } else if (workIndex === 0) {
    prevIndex = works.length - 1
  }

  const prevWork = getWorks()[prevIndex]
  const nextWork = getWorks()[nextIndex]

  if (!work) {
    notFound()
  }

  return (
    <div className="w-full max-w-[1024px] mx-auto px-16 py-24">
      <Head>
        <title>{work.metadata.title}</title>
        <link rel="canonical" href={`${baseUrl}/artworks/${work.slug}`} />
      </Head>
      <section>
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Publishingworks",
              headline: work.metadata.title,
              datePublished: work.metadata.publishedAt,
              dateModified: work.metadata.publishedAt,
              description: work.metadata.summary,
              image: work.metadata.image
                ? `${baseUrl}${work.metadata.image}`
                : `/og?title=${encodeURIComponent(work.metadata.title)}`,
              url: `${baseUrl}/artworks/${work.slug}`,
              author: {
                "@type": "Person",
                name: "Jesse Wei | Writings and Works",
              },
            }),
          }}
        />
        <h1 className="title font-bold text-4xl">{work.metadata.title}</h1>
        <div className="flex justify-between items-center mt-2 mb-8 text-sm">
          <p className="text-sm text-neutral-600">
            Published at: {formatDate(work.metadata.publishedAt)}
          </p>
        </div>
        <article className="prose">
          <CustomMDX source={work.content} />
        </article>
        <PrevNext
          prevLink={`/artworks/${prevWork.slug}`}
          nextLink={`/artworks/${nextWork.slug}`}
        />
      </section>
      <BackToTop />
    </div>
  )
}
