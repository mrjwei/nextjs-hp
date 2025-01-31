import Link from "next/link"
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { getWritings } from "app/utils"
import {WritingCard} from 'app/components/article-card'
import {kanit} from 'app/data/fonts'

export function Writings({ numWritings, hasSeeMore = true }: { numWritings?: number, hasSeeMore?: boolean }) {
  let writings = getWritings().sort((a, b) => {
    if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
      return -1
    }
    return 1
  })

  if (numWritings) {
    writings = writings.slice(0, numWritings)
  }

  return (
    <div>
      <div className="grid grid-cols-12 gap-6">
        {writings.map((article) => (
          <Link
            key={article.slug}
            className="col-span-12 sm:col-span-6 lg:col-span-4"
            href={`/writings/${article.slug}`}
          >
            <WritingCard article={article} />
          </Link>
        ))}
      </div>
      {hasSeeMore && (
        <div className="flex justify-center mt-8">
          <Link href="/writings" className="border-2 rounded border-neutral-600 p-2 flex items-center">
            <span className={`mr-2 ${kanit.className}`}>See more</span>
            <ArrowRightIcon className="w-5" />
          </Link>
        </div>
      )}
    </div>
  )
}
