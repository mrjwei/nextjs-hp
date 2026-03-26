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
}: {
  article: any
  className?: string
  from?: string
  path?: string
}) {
  const isPortfolio = path === "portfolio"
  const thumbnailSrc = article?.metadata?.image || "/bg.jpg"

  return (
    <div
      className={clsx(
        "col-span-12 md:col-span-6 h-full flex flex-col bg-white transition duration-300 ease-in-out shadow-md hover:shadow-xl rounded-2xl",
        className
      )}
    >
      <Link
        key={article.slug}
        href={`/${path}/${article.slug}${from ? `?from=${from}` : ""}`}
        className="flex-1 flex flex-col"
      >
        {isPortfolio ? (
          <div className="relative w-full aspect-[16/9] overflow-hidden rounded-t-2xl bg-neutral-100">
            <Image
              src={thumbnailSrc}
              alt={article?.metadata?.title ? `${article.metadata.title} thumbnail` : "Portfolio thumbnail"}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        ) : null}
        <div className="p-6 pb-4 flex flex-col justify-between">
          <div>
            <div className="mb-4">
              <h3
                className={clsx("text-lg leading-normal font-bold mb-2", {
                  "break-all": article.metadata.shouldBreakWord,
                })}
              >
                {article.metadata.title}
              </h3>
              <p className="text-neutral-600 text-base leading-5 mb-4">
                {article.metadata.summary.length > 100
                  ? article.metadata.summary.slice(0, 100) + "..."
                  : article.metadata.summary}
              </p>
              <Tags tags={article.metadata.tags} />
            </div>
          </div>
          <small className={`text-neutral-500 ${openSans.className}`}>
            Published at: {formatDate(article.metadata.publishedAt, false)}
          </small>
        </div>
      </Link>
    </div>
  )
}
