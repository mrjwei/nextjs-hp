import { getAllSortedWritings } from "app/utils"
import { WritingCard } from "app/components/article-card"

export function Writings({
  numWritings,
  className = "",
}: {
  numWritings?: number
  className?: string
}) {
  let writings = getAllSortedWritings()

  if (numWritings) {
    writings = writings.slice(0, numWritings)
  }

  return (
    <div className={className}>
      <div className="grid grid-cols-12 gap-y-8 md:gap-8">
        {writings.map((article) => (
          <WritingCard article={article} />
        ))}
      </div>
    </div>
  )
}
