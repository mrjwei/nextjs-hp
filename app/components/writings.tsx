import Link from "next/link"
import { getWritings } from "app/utils"
import { WritingCard } from "app/components/article-card"

export function Writings({
  numWritings,
  className = "",
}: {
  numWritings?: number
  className?: string
}) {
  let writings = getWritings().sort((a, b) => {
    if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
      return -1
    }
    return 1
  })

  if (numWritings) {
    writings = writings.slice(0, numWritings)
  }

  return (
    <div className={className}>
      <div className="grid grid-cols-12 gap-8">
        {writings.map((article) => (
          <Link
            key={article.slug}
            className="col-span-12 lg:col-span-6"
            href={`/writings/${article.slug}`}
          >
            <WritingCard article={article} />
          </Link>
        ))}
      </div>
    </div>
  )
}
