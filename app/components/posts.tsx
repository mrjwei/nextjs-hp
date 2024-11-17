import Link from "next/link"
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { getBlogPosts } from "app/writings/utils"
import {ArticleCard} from 'app/components/article-card'

export function Articles({ numPosts, hasSeeMore = true }: { numPosts?: number, hasSeeMore?: boolean }) {
  let allBlogs = getBlogPosts().sort((a, b) => {
    if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
      return -1
    }
    return 1
  })
  if (numPosts) {
    allBlogs = allBlogs.slice(0, numPosts)
  }

  return (
    <div>
      <div className="grid grid-cols-12 gap-6">
        {allBlogs.map((post) => (
          <Link
            key={post.slug}
            className="col-span-12 sm:col-span-6 lg:col-span-4"
            href={`/writings/${post.slug}`}
          >
            <ArticleCard article={post} />
          </Link>
        ))}
      </div>
      {hasSeeMore && (
        <div className="flex justify-center mt-8">
          <Link href="/writings" className="border-2 rounded border-neutral-600 p-2 flex items-center">
            <span className="mr-2">See more</span>
            <ArrowRightIcon className="w-5" />
          </Link>
        </div>
      )}
    </div>
  )
}
