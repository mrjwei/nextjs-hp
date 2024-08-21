import Link from 'next/link'
import { formatDate, getWorks } from 'app/blog/utils'

export function Works({numWorks}: {numWorks?: number}) {
  let allWorks = getWorks()
  if (numWorks) {
    allWorks = allWorks.slice(-numWorks)
  }

  return (
    <div>
      {allWorks
        .sort((a, b) => {
          if (
            new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)
          ) {
            return -1
          }
          return 1
        })
        .map((work) => (
          <Link
            key={work.slug}
            className="flex flex-col space-y-1 mb-4"
            href={`/works/${work.slug}`}
          >
            <div className="w-full flex flex-col md:flex-row space-x-0 md:space-x-2">
              <p className="text-neutral-600 dark:text-neutral-400 w-[100px] tabular-nums text-nowrap mr-4">
                {formatDate(work.metadata.publishedAt, false)}
              </p>
              <p className="text-neutral-900 dark:text-neutral-100 tracking-tight font-bold">
                {work.metadata.title}
              </p>
            </div>
          </Link>
        ))}
    </div>
  )
}
