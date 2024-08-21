import { notFound } from 'next/navigation'
import { CustomMDX } from 'app/components/mdx'
import { formatDate, getWorks } from 'app/blog/utils'
import { baseUrl } from 'app/sitemap'
import Head from 'next/head'

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
      type: 'article',
      publishedTime,
      url: `${baseUrl}/blog/${work.slug}`,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

export default function Blog({ params }) {
  let work = getWorks().find((work) => work.slug === params.slug)

  if (!work) {
    notFound()
  }

  return (
    <>
      <Head>
        <title>{work.metadata.title}</title>
        <link rel="canonical" href={`${baseUrl}/blog/${work.slug}`} />
      </Head>
      <section>
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Publishingworks',
              headline: work.metadata.title,
              datePublished: work.metadata.publishedAt,
              dateModified: work.metadata.publishedAt,
              description: work.metadata.summary,
              image: work.metadata.image
                ? `${baseUrl}${work.metadata.image}`
                : `/og?title=${encodeURIComponent(work.metadata.title)}`,
              url: `${baseUrl}/blog/${work.slug}`,
              author: {
                '@type': 'Person',
                name: 'My Portfolio',
              },
            }),
          }}
        />
        <h1 className="title font-bold text-4xl">
          {work.metadata.title}
        </h1>
        <div className="flex justify-between items-center mt-2 mb-8 text-sm">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {formatDate(work.metadata.publishedAt)}
          </p>
        </div>
        <article className="prose">
          <CustomMDX source={work.content} />
        </article>
      </section>
    </>
  )
}
