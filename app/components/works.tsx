import Link from "next/link"
import { getAllSortedWorks } from "app/utils"
import { ArtworkCard } from "app/components/artwork-card"

export function Works({
  numWorks,
  priorityCount = 0,
  className = "",
}: {
  numWorks?: number
  priorityCount?: number
  className?: string
}) {
  let allWorks = getAllSortedWorks()
  if (numWorks) {
    allWorks = allWorks.slice(0, numWorks)
  }

  return (
    <div className={className}>
      <div className="grid grid-cols-12 gap-y-8 md:gap-8">
        {allWorks.map((work, index) => (
          <ArtworkCard
            key={work.slug}
            work={work}
            imgClassName="object-cover object-top"
            priority={index < priorityCount}
          />
        ))}
      </div>
    </div>
  )
}
