import Link from "next/link"
import { notFound } from "next/navigation"
import { CustomMDX } from "app/components/mdx"
import { PrevNext } from "app/components/prev-next"
import { BackToTop } from "app/components/back-to-top"
import { WritingCard } from "app/components/article-card"
import { formatDate, getAllSortedWritings } from "app/utils"
import { baseUrl } from "app/sitemap"
import Head from "next/head"
import { openSans } from "app/data/fonts"
import { Tags } from "app/components/tags"

export async function generateStaticParams() {
  let writings = getAllSortedWritings()

  return writings.map((writing) => ({
    slug: writing.slug,
  }))
}

export function generateMetadata({ params }) {
  let writing = getAllSortedWritings().find(
    (writing) => writing.slug === params.slug
  )
  if (!writing) {
    return
  }

  let {
    title,
    publishedAt: publishedTime,
    summary: description,
    image,
  } = writing.metadata
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
      url: `${baseUrl}/writings/${writing.slug}`,
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

export default function Writing({ params }) {
  let writings = getAllSortedWritings()
  let writing = writings.find((writing) => writing.slug === params.slug)
  const writingIndex = writings.findIndex(
    (writing) => writing.slug === params.slug
  )

  let similarWritings = writings
    .filter(
      (w) =>
        w.metadata.tags.some((t) => writing?.metadata.tags) && w !== writing
    )
    .sort((a, b) => {
      if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
        return -1
      }
      return 1
    })

  let prevIndex = writingIndex - 1
  let nextIndex = writingIndex + 1

  if (writingIndex === writings.length - 1) {
    nextIndex = 0
  } else if (writingIndex === 0) {
    prevIndex = writings.length - 1
  }

  const prevPost = writings[prevIndex]
  const nextPost = writings[nextIndex]

  if (!writing) {
    notFound()
  }

  return (
    <div className="w-full max-w-[1024px] mx-auto px-8 md:px-16 py-24">
      <Head>
        <title>{writing.metadata.title}</title>
        <link rel="canonical" href={`${baseUrl}/writings/${writing.slug}`} />
      </Head>
      <section className="pb-16">
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              headline: writing.metadata.title,
              datePublished: writing.metadata.publishedAt,
              dateModified: writing.metadata.publishedAt,
              description: writing.metadata.summary,
              image: writing.metadata.image
                ? `${baseUrl}${writing.metadata.image}`
                : `/og?title=${encodeURIComponent(writing.metadata.title)}`,
              url: `${baseUrl}/writings/${writing.slug}`,
              author: {
                "@type": "Person",
                name: "Jesse Wei | Writings and Works",
              },
            }),
          }}
        />
        <h1 className="title font-bold text-4xl mb-4">
          {writing.metadata.title}
        </h1>
        <Tags tags={writing.metadata.tags} className="mb-4" />
        <div className="flex justify-between items-center mt-2 mb-12 text-sm">
          <p
            className={`text-sm text-neutral-500 dark:text-neutral-400 ${openSans.className}`}
          >
            Published at: {formatDate(writing.metadata.publishedAt)}
          </p>
        </div>
        <article className="prose">
          <CustomMDX source={writing.content} />
        </article>
        <PrevNext
          prevLink={`/writings/${prevPost.slug}`}
          nextLink={`/writings/${nextPost.slug}`}
        />
      </section>
      <hr className="border-[1px] border-gray-200" />
      <section className="pt-16">
        <h2 className="text-2xl font-bold mb-8">You May Also Like</h2>
        <div className="grid grid-cols-12 gap-y-8 md:gap-8">
          {similarWritings.slice(0, 4).map((similarWriting) => (
            <WritingCard article={similarWriting} />
          ))}
        </div>
      </section>
      <BackToTop />
    </div>
  )
}
