import Image from "next/image"
import Link from "next/link"
import clsx from "clsx"
import { tags } from "app/data/tags"
import { Tag } from "app/components/tag"
import { formatDate } from "app/utils"
import { openSans } from "app/data/fonts"

export function ArtworkCard({ work, imgClassName = "" }) {
  return (
    <div className="col-span-12 md:col-span-6 h-full flex flex-col bg-white transition duration-300 ease-in-out shadow-md hover:shadow-xl rounded-lg">
      <Link key={work.slug} href={`/artworks/${work.slug}`}>
        <div className="h-48 flex justify-center">
          <Image
            className={clsx("rounded-t-lg", imgClassName)}
            src={`/${work.slug}/thumbnail.jpg`}
            alt={`thumbnail of work ${work.metadata.title}`}
            width={1109}
            height={635}
          />
        </div>
        <div className="p-8 pb-4 flex-1 flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-xl font-bold mb-1">{work.metadata.title}</h3>
            <p className="text-neutral-600 text-base mb-2">
              {work.metadata.summary.length > 100
                ? work.metadata.summary.slice(0, 100) + "..."
                : work.metadata.summary}
            </p>
            <div className="flex flex-wrap gap-1 mb-2">
              {work.metadata.tags
                ?.filter((tag) => Object.keys(tags).includes(tag))
                .map((tag) => <Tag label={tag} color={tags[tag].color} />)}
            </div>
          </div>
          <small className={`text-neutral-500 ${openSans.className}`}>
            Published at: {formatDate(work.metadata.publishedAt, false)}
          </small>
        </div>
      </Link>
    </div>
  )
}
