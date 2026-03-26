import { Tag } from "app/components/tag"
import tagsData from "app/data/tags.json"
import clsx from "clsx"

export const Tags = ({
  tags,
  className = "",
  hrefForTag,
  onCloseForTag,
}: {
  tags: string[] | undefined
  className?: string
  hrefForTag?: (tag: string) => string
  onCloseForTag?: (tag: string) => void
}) => {
  return (
    <div className={clsx("flex flex-wrap gap-1 mb-2", className)}>
      {tags
        ?.filter((tag) => Object.keys(tagsData).includes(tag))
        .map((tag) => (
          <Tag
            key={tag}
            label={tag}
            color={tagsData[tag].color}
            href={hrefForTag ? hrefForTag(tag) : undefined}
            onClose={onCloseForTag ? () => onCloseForTag(tag) : undefined}
          />
        ))}
    </div>
  )
}
