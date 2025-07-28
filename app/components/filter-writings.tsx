import { WritingCard } from "app/components/article-card"

export const FilterWritings = ({ writings, category }) => {
  if (category) {
    writings = writings.filter((w) => w.metadata.tags.includes(category))
  }
  return (
    <div>
      <div>
        <div className="grid grid-cols-12 gap-y-8 md:gap-8">
          {writings.map((article) => (
            <WritingCard article={article} />
          ))}
        </div>
      </div>
    </div>
  )
}
