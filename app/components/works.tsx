import Link from "next/link"
import { getWorks } from "app/utils"
import { ArtworkCard } from "app/components/artwork-card"

export function Works({
  numWorks,
  className = "",
}: {
  numWorks?: number
  className?: string
}) {
  let allWorks = getWorks().sort((a, b) => {
    if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
      return -1
    }
    return 1
  })
  if (numWorks) {
    allWorks = allWorks.slice(0, numWorks)
  }

  return (
    <div className={className}>
      <div className="grid grid-cols-12 gap-y-8 md:gap-8">
        {allWorks.map((work) => (
          <ArtworkCard work={work} imgClassName="object-cover object-top" />
        ))}
      </div>
    </div>
  )
}
