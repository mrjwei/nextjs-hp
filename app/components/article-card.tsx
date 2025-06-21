import clsx from "clsx"
import Link from "next/link"
import { Tags } from "app/components/tags"
import { formatDate } from "app/utils"
import { openSans } from "app/data/fonts"

export function WritingCard({
  article,
  className,
}: {
  article: any
  className?: string
}) {
  return (
    <div
      className={clsx(
        "col-span-12 md:col-span-6 h-full flex flex-col bg-white transition duration-300 ease-in-out shadow-md hover:shadow-xl rounded-lg",
        className
      )}
    >
      <Link key={article.slug} href={`/writings/${article.slug}`}>
        <div className="p-8 pb-4 flex-1 flex flex-col justify-between">
          <div className="mb-4">
            <h3
              className={clsx("text-xl font-bold mb-1", {
                "break-all": article.metadata.shouldBreakWord,
              })}
            >
              {article.metadata.title}
            </h3>
            <p className="text-neutral-600 text-base mb-4">
              {article.metadata.summary.length > 100
                ? article.metadata.summary.slice(0, 100) + "..."
                : article.metadata.summary}
            </p>
            <Tags tags={article.metadata.tags} />
          </div>
          <small className={`text-neutral-500 ${openSans.className}`}>
            Published at: {formatDate(article.metadata.publishedAt, false)}
          </small>
        </div>
      </Link>
    </div>
  )
}
