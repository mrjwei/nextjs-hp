import Image from "next/image"
import { tags } from "app/data/tags"
import { Tag } from "app/components/tag"
import { formatDate } from "app/writings/utils"

export function ArticleCard({ article }) {
  return (
    <div className="h-full flex flex-col bg-white transition duration-300 ease-in-out shadow-md hover:shadow-xl rounded-lg border-t-neutral-600 border-t-8">
      <div className="h-36 flex justify-center">
        <Image
          className="w-auto h-full"
          src={`/${article.slug}/thumbnail.png`}
          alt={`thumbnail of article ${article.metadata.title}`}
          width={1109}
          height={635}
        />
      </div>
      <div className="px-4 pt-2 pb-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold mb-1">{article.metadata.title}</h3>
          <p className="text-neutral-600 text-sm mb-2">
            {article.metadata.summary.length > 100
              ? article.metadata.summary.slice(0, 100) + "..."
              : article.metadata.summary}
          </p>
          <div className="flex flex-wrap gap-1 mb-2">
            {article.metadata.tags?.filter(tag => Object.keys(tags).includes(tag)).map((tag) => (
              <Tag label={tag} color={tags[tag].color} />
            ))}
          </div>
        </div>
        <small className="text-neutral-600">
          {formatDate(article.metadata.publishedAt, false)}
        </small>
      </div>
    </div>
  )
}
