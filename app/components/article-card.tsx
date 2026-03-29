import clsx from "clsx"
import Link from "next/link"
import Image from "next/image"
import { Tags } from "app/components/tags"
import { formatDate } from "app/utils"
import { openSans } from "app/data/fonts"

export function WritingCard({
  article,
  className,
  from,
  path = "writings",
  selectedTags,
  wrapperProps,
}: {
  article: any
  className?: string
  from?: string
  path?: string
  selectedTags?: string[]
  wrapperProps?:
    | (React.HTMLAttributes<HTMLDivElement> & {
        [key: `data-${string}`]: string | undefined
      })
    | undefined
}) {
  const isPortfolio = path === "portfolio"
  const thumbnailSrc = article?.metadata?.image || "/bg.jpg"

  const writingCollection = path === "writings" ? article?.metadata?.series : null

  const href =
    path === "writings" && writingCollection
      ? `/writings/${writingCollection}/${article.slug}`
      : `/${path}/${article.slug}`

  return (
    <div
      {...wrapperProps}
      className={clsx(
        "col-span-12 md:col-span-6 h-full flex flex-col bg-white transition-all duration-300 ease-in-out shadow-sm hover:shadow-lg border border-neutral-200 hover:border-neutral-300 rounded-xl overflow-hidden group",
        className,
        wrapperProps?.className
      )}
    >
      <Link
        key={article.slug}
        href={`${href}${from ? `?from=${from}` : ""}`}
        className="flex-1 flex flex-col"
      >
        {isPortfolio ? (
          <div className="relative w-full aspect-[16/9] overflow-hidden bg-neutral-100">
            <Image
              src={thumbnailSrc}
              alt={
                article?.metadata?.title
                  ? `${article.metadata.title} thumbnail`
                  : "Portfolio thumbnail"
              }
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        ) : null}
        <div className="p-6 pb-4 flex flex-col justify-between">
          <div>
            <div className="mb-4">
              <h3
                className={clsx("text-lg leading-normal font-semibold mb-2 text-neutral-900 group-hover:text-blue-600 transition-colors", {
                  "break-all": article.metadata.shouldBreakWord,
                })}
              >
                {article.metadata.title}
              </h3>
              <p className="text-neutral-600 text-base leading-6 mb-4">
                {article.metadata.summary.length > 100
                  ? article.metadata.summary.slice(0, 100) + "..."
                  : article.metadata.summary}
              </p>
            </div>
          </div>
          <small className={`text-neutral-500 text-sm ${openSans.className}`}>
            Published: {formatDate(article.metadata.publishedAt, false)}
          </small>
        </div>
      </Link>

      <div className="px-6 pb-6">
        <Tags
          tags={article.metadata.tags}
          hrefForTag={
            path === "writings"
              ? (tag) => {
                  const current = Array.isArray(selectedTags)
                    ? selectedTags
                    : []

                  const next = current.includes(tag)
                    ? current.filter((t) => t !== tag)
                    : [...current, tag]

                  const qs = next.length
                    ? `?tags=${encodeURIComponent(next.join(","))}`
                    : ""

                  return `/writings${qs}`
                }
              : undefined
          }
        />
      </div>
    </div>
  )
}
