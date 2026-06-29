import clsx from "clsx"
import Link from "next/link"
import Image from "next/image"
import { Tags } from "@/components/tags"
import { formatDate } from "app/utils"

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
  const thumbnailSrc = article?.metadata?.image

  const writingCollection = path === "writings" ? article?.metadata?.series : null

  const href =
    path === "writings" && writingCollection
      ? `/writings/${writingCollection}/${article.slug}`
      : `/${path}/${article.slug}`

  return (
    <div
      {...wrapperProps}
      className={clsx(
        "col-span-12 md:col-span-6 h-full flex flex-col bg-[var(--surface-card)] transition-[box-shadow,border-color,transform] duration-200 ease-[var(--ease-out)] shadow-xs hover:shadow-lg hover:-translate-y-0.5 border border-[var(--border-subtle)] hover:border-[var(--border-default)] rounded-lg overflow-hidden group",
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
          <div className="relative w-full aspect-[16/9] overflow-hidden bg-[var(--surface-sunken)]">
            {thumbnailSrc ? (
              <Image
                src={thumbnailSrc}
                alt={
                  article?.metadata?.title
                    ? `${article.metadata.title} thumbnail`
                    : "Portfolio thumbnail"
                }
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover transition-transform duration-300 ease-[var(--ease-out)] group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center font-sans font-semibold text-2xl text-[var(--text-subtle)]">
                {article.metadata.title?.[0]}
              </div>
            )}
          </div>
        ) : null}
        <div className="p-6 pb-4 flex flex-col justify-between">
          <div>
            <div className="mb-4">
              <h3
                className={clsx(
                  "text-lg leading-normal font-semibold mb-2 text-[var(--text-strong)] transition-colors group-hover:text-[var(--accent-text)]",
                  {
                    "break-all": article.metadata.shouldBreakWord,
                  }
                )}
              >
                {article.metadata.title}
              </h3>
              <p className="text-[var(--text-muted)] text-base leading-6 mb-4">
                {article.metadata.summary.length > 100
                  ? article.metadata.summary.slice(0, 100) + "..."
                  : article.metadata.summary}
              </p>
            </div>
          </div>
          <small className="text-[var(--text-subtle)] text-sm">
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
