import Link from "next/link"
import { notFound } from "next/navigation"
import { CustomMDX } from "@/components/mdx"
import { BackToTop } from "@/components/back-to-top"
import { WritingCard } from "@/components/article-card"
import { Tags } from "@/components/tags"
import { formatDate, getAllSortedGallery, getGalleryItemBySlug } from "app/utils"
import { buildStandardMetadata } from "app/seo/metadata"

export const dynamic = "force-static"
export const dynamicParams = true

export async function generateStaticParams() {
  const items = getAllSortedGallery("ja")
  return items.map((item) => ({ slug: item.slug }))
}

export function generateMetadata({ params }) {
  const item = getGalleryItemBySlug(params.slug, "ja")
  if (!item) return

  return {
    ...buildStandardMetadata({
      title: item.metadata.title,
      description: item.metadata.summary,
      pathname: `/ja/gallery/${item.slug}`,
      type: "article",
      publishedTime: item.metadata.publishedAt,
      image: item.metadata.image,
    }),
  }
}

function NotTranslatedYet({ englishHref }: { englishHref: string }) {
  return (
    <div className="w-full max-w-[1024px] mx-auto px-8 md:px-16 py-24">
      <div className="bg-[var(--surface-card)] rounded-lg shadow-xs border border-[var(--border-subtle)] p-8 md:p-12 text-center">
        <p className="mb-3 font-medium text-[var(--text-strong)]">
          この作品はまだ日本語訳がありません。
        </p>
        <p className="mb-6 text-[var(--text-muted)]">
          現在は英語でのみ公開しています。
        </p>
        <Link
          href={englishHref}
          className="text-[var(--accent-text)] hover:underline font-medium"
        >
          英語版を読む →
        </Link>
      </div>
    </div>
  )
}

export default async function GalleryItemPage({ params, searchParams }) {
  const allItems = getAllSortedGallery("ja")
  const item = getGalleryItemBySlug(params.slug, "ja")

  if (!item) {
    const englishItem = getGalleryItemBySlug(params.slug, "en")
    if (englishItem) {
      return <NotTranslatedYet englishHref={`/gallery/${params.slug}`} />
    }
    notFound()
  }

  const from = (await searchParams).from || null

  const moreWorks = allItems.filter((w) => w.slug !== item.slug).slice(0, 4)

  return (
    <div className="w-full max-w-[1024px] mx-auto px-8 md:px-16 py-24">
      <section className="pb-16 bg-[var(--surface-card)] rounded-lg shadow-xs border border-[var(--border-subtle)] p-8 md:p-12">
        <nav aria-label="Breadcrumb" className="text-sm text-[var(--text-muted)] mb-4">
          <Link href="/ja" className="hover:underline hover:text-[var(--text-strong)] transition-colors">
            ホーム
          </Link>
          <span className="mx-2 text-[var(--text-subtle)]">/</span>
          <Link
            href="/ja/gallery"
            className="hover:underline hover:text-[var(--text-strong)] transition-colors"
          >
            ギャラリー
          </Link>
        </nav>

        <Link
          href={from ? `/ja/${from}`.replace(/\/\/+/, "/") : "/ja/gallery"}
          className="inline-flex items-center gap-2 text-[var(--accent-text)] hover:underline transition-colors font-medium block mb-6"
        >
          ← ギャラリーに戻る
        </Link>

        <h1 className="display text-4xl mb-4">{item.metadata.title}</h1>
        <Tags tags={item.metadata.tags} className="mb-4" />
        <div className="flex justify-between items-center mt-2 mb-12 text-sm border-b border-[var(--border-subtle)] pb-6">
          <p className="text-sm text-[var(--text-muted)]">
            公開日: {formatDate(item.metadata.publishedAt)}
            {item.metadata.updatedAt && (
              <> · 更新日: {formatDate(item.metadata.updatedAt)}</>
            )}
          </p>
        </div>

        <article className="prose">
          <CustomMDX source={item.content} />
        </article>
      </section>

      {moreWorks.length ? (
        <section className="pt-16 bg-[var(--surface-card)] rounded-lg shadow-xs border border-[var(--border-subtle)] p-8 md:p-12 mt-8">
          <h2 className="text-2xl font-semibold tracking-tight text-[var(--text-strong)] mb-8">
            他の実績
          </h2>
          <div className="grid grid-cols-12 gap-y-8 md:gap-8">
            {moreWorks.map((work) => (
              <WritingCard key={work.slug} article={work} path="gallery" lang="ja" />
            ))}
          </div>
        </section>
      ) : null}

      <BackToTop />
    </div>
  )
}
