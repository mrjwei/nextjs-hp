import { notFound } from 'next/navigation'
import { CustomMDX } from 'app/components/mdx'
import { formatDate, getSeries } from 'app/utils'
import { baseUrl } from 'app/sitemap'
import Head from 'next/head'

export async function generateStaticParams() {
  return getSeries().flat().map(article => ({
    slug: [article.metadata.seriesSlug, article.slug]
  }))
}

export function generateMetadata({ params }) {
  let article = getSeries().flat().find((article) => article.slug === params.slug[1])

  if (!article) {
    return
  }

  let {
    title,
    publishedAt: publishedTime,
    summary: description,
    image,
  } = article.metadata
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
      url: `${baseUrl}/series/${article.metadata.seriesSlug}/${article.slug}`,
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

export default function SeriesArticle({ params }) {
  console.log()
  let article = getSeries().flat().find((article) => article.slug === params.slug[1])

  if (!article) {
    notFound()
  }

  return (
    <>
      <Head>
        <title>{article.metadata.title}</title>
        <link rel="canonical" href={`${baseUrl}/series/${article.metadata.seriesSlug}/${article.slug}`} />
      </Head>
      <section>
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BlogPosting',
              headline: article.metadata.title,
              datePublished: article.metadata.publishedAt,
              dateModified: article.metadata.publishedAt,
              description: article.metadata.summary,
              image: article.metadata.image
                ? `${baseUrl}${article.metadata.image}`
                : `/og?title=${encodeURIComponent(article.metadata.title)}`,
              url: `${baseUrl}/articles/${article.slug}`,
              author: {
                '@type': 'Person',
                name: 'My Portfolio',
              },
            }),
          }}
        />
        <h1 className="title font-bold text-4xl">
          {article.metadata.title}
        </h1>
        <div className="flex justify-between items-center mt-2 mb-8 text-sm">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {formatDate(article.metadata.publishedAt)}
          </p>
        </div>
        <article className="prose">
          <CustomMDX source={article.content} />
        </article>
      </section>
    </>
  )
}
