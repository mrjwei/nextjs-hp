import { notFound } from "next/navigation"
import { CustomMDX } from "app/components/mdx"
import { PrevNext } from "app/components/prev-next"
import { formatDate, getWritings } from "app/utils"
import { baseUrl } from "app/sitemap"
import Head from "next/head"
import { openSans } from "app/data/fonts"
import { Tags } from "app/components/tags"

export async function generateStaticParams() {
  let posts = getWritings()

  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export function generateMetadata({ params }) {
  let post = getWritings().find((post) => post.slug === params.slug)
  if (!post) {
    return
  }

  let {
    title,
    publishedAt: publishedTime,
    summary: description,
    image,
  } = post.metadata
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
      url: `${baseUrl}/writings/${post.slug}`,
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
  let posts = getWritings()
  let post = posts.find((post) => post.slug === params.slug)
  const postIndex = posts.findIndex((post) => post.slug === params.slug)
  let prevIndex = postIndex - 1
  let nextIndex = postIndex + 1

  if (postIndex === posts.length - 1) {
    nextIndex = 0
  } else if (postIndex === 0) {
    prevIndex = posts.length - 1
  }

  const prevPost = getWritings()[prevIndex]
  const nextPost = getWritings()[nextIndex]

  if (!post) {
    notFound()
  }

  return (
    <div className="w-full max-w-[1024px] mx-auto px-16 py-24">
      <Head>
        <title>{post.metadata.title}</title>
        <link rel="canonical" href={`${baseUrl}/writings/${post.slug}`} />
      </Head>
      <section>
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              headline: post.metadata.title,
              datePublished: post.metadata.publishedAt,
              dateModified: post.metadata.publishedAt,
              description: post.metadata.summary,
              image: post.metadata.image
                ? `${baseUrl}${post.metadata.image}`
                : `/og?title=${encodeURIComponent(post.metadata.title)}`,
              url: `${baseUrl}/writings/${post.slug}`,
              author: {
                "@type": "Person",
                name: "My Portfolio",
              },
            }),
          }}
        />
        <Tags tags={post.metadata.tags} className="mb-4" />
          <p
            className={`text-sm text-neutral-500 dark:text-neutral-400 ${openSans.className}`}
          >
            {formatDate(post.metadata.publishedAt)}
          </p>
        </div>
        <article className="prose">
          <CustomMDX source={post.content} />
        </article>
        <PrevNext
          prevLink={`/writings/${prevPost.slug}`}
          nextLink={`/writings/${nextPost.slug}`}
        />
      </section>
    </div>
  )
}
