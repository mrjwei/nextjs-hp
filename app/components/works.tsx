import Link from 'next/link'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { getWorks } from 'app/writings/utils'
import {ArtworkCard} from 'app/components/artwork-card'
import {kanit} from 'app/data/fonts'

export function Works({numWorks, hasSeeMore = true}: {numWorks?: number, hasSeeMore?: boolean}) {
  let allWorks = getWorks().sort((a, b) => {
    if (
      new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)
    ) {
      return -1
    }
    return 1
  })
  if (numWorks) {
    allWorks = allWorks.slice(0, numWorks)
  }

  return (
    <div>
      <div className="grid grid-cols-12 gap-6">
        {allWorks
          .map((work) => (
            <Link
              key={work.slug}
              className="col-span-12 sm:col-span-6 lg:col-span-4"
              href={`/artworks/${work.slug}`}
            >
              <ArtworkCard work={work} imgClassName="object-cover object-top" />
            </Link>
          ))}
      </div>
      {hasSeeMore && (
        <div className="flex justify-center mt-8">
          <Link href="/artworks" className="border-2 rounded border-neutral-600 p-2 flex items-center">
            <span className={`mr-2 ${kanit.className}`}>See more</span>
            <ArrowRightIcon className="w-5" />
          </Link>
        </div>
      )}
    </div>
  )
}
