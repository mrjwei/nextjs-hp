import { TWriting } from "app/components/grid"
import { WritingCard } from "app/components/article-card"
import { TCategory } from "app/components/sidebar"

export function Grid({
  writings,
  category,
  numWritings,
  className = "",
}: {
  writings: TWriting[]
  category?: TCategory
  numWritings?: number
  className?: string
}) {
  if (category) {
    writings = writings.filter(w => w.metadata.tags.includes(category.value))
  }
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
