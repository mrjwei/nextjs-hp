import Link from "next/link"
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { getArticles } from "app/utils"
import {ArticleCard} from 'app/components/article-card'
import {kanit} from 'app/data/fonts'

export function Articles({ numArticles, hasSeeMore = true }: { numArticles?: number, hasSeeMore?: boolean }) {
  let articles = getArticles().sort((a, b) => {
    if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
      return -1
    }
    return 1
  })

  if (numArticles) {
    articles = articles.slice(0, numArticles)
  }

  return (
    <div>
      <div className="grid grid-cols-12 gap-6">
        {articles.map((article) => (
          <Link
            key={article.slug}
            className="col-span-12 sm:col-span-6 lg:col-span-4"
            href={`/articles/${article.slug}`}
          >
            <ArticleCard article={article} />
          </Link>
        ))}
      </div>
      {hasSeeMore && (
        <div className="flex justify-center mt-8">
          <Link href="/articles" className="border-2 rounded border-neutral-600 p-2 flex items-center">
            <span className={`mr-2 ${kanit.className}`}>See more</span>
            <ArrowRightIcon className="w-5" />
          </Link>
        </div>
      )}
    </div>
  )
}
