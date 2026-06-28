import Link from "next/link"
import { ArrowRight, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export const PrevNext = ({ items, itemIndex, path, linkFor }) => {
  const oldIndex = itemIndex + 1
  const newIndex = itemIndex - 1

  const oldItem = items[oldIndex]
  const newItem = items[newIndex]

  const hrefFor = (item) => {
    if (!item) return ""
    if (typeof linkFor === "function") return linkFor(item)
    return `/${path}/${item.slug}`
  }

  const hasPrev = itemIndex !== items.length - 1
  const hasNext = itemIndex !== 0

  return (
    <div className="flex justify-between gap-4 md:gap-8">
      {/**
       * New writings come before old ones,
       * so swapping old & next links to reflect this ordering
       */}
      {hasPrev ? (
        <Button asChild variant="secondary">
          <Link href={hrefFor(oldItem)}>
            <ArrowLeft className="size-4" />
            <span>Prev</span>
          </Link>
        </Button>
      ) : (
        <Button variant="secondary" disabled>
          <ArrowLeft className="size-4" />
          <span>Prev</span>
        </Button>
      )}
      {hasNext ? (
        <Button asChild variant="secondary">
          <Link href={hrefFor(newItem)}>
            <span>Next</span>
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      ) : (
        <Button variant="secondary" disabled>
          <span>Next</span>
          <ArrowRight className="size-4" />
        </Button>
      )}
    </div>
  )
}
