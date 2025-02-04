import { Tag } from "app/components/tag"
import { tags as tagsData } from "app/data/tags"
import clsx from "clsx"

export const Tags = ({ tags, className = "" }) => {
  return (
    <div className={clsx("flex flex-wrap gap-1 mb-2", className)}>
      {tags
        ?.filter((tag) => Object.keys(tagsData).includes(tag))
        .map((tag) => <Tag label={tag} color={tagsData[tag].color} />)}
    </div>
  )
}
