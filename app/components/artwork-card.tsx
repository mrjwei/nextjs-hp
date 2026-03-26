import Image from "next/image"
import Link from "next/link"
import clsx from "clsx"

export function ArtworkCard({
  work,
  imgClassName = "",
  priority = false,
}: {
  work: any
  imgClassName?: string
  priority?: boolean
}) {
  return (
    <div className="col-span-12 md:col-span-6 h-64 overflow-hidden relative">
      <Link href={`/artworks/${work.slug}`}>
        <Image
          className={clsx("h-full rounded-2xl object-cover", imgClassName)}
          src={`/${work.slug}/thumbnail.jpg`}
          alt={`thumbnail of work ${work.metadata.title}`}
          width={1109}
          height={635}
          sizes="(max-width: 768px) 100vw, 50vw"
          priority={priority}
        />
      </Link>
    </div>
  )
}
