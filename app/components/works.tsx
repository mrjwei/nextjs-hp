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
      <div className="grid grid-cols-12 gap-8">
        {allWorks.map((work) => (
          <Link
            key={work.slug}
            className="col-span-12 lg:col-span-6"
            href={`/artworks/${work.slug}`}
          >
            <ArtworkCard work={work} imgClassName="object-cover object-top" />
          </Link>
        ))}
      </div>
    </div>
  )
}
