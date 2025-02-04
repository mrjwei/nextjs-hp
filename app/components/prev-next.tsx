import Link from "next/link"
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline"

export const PrevNext = ({ prevLink, nextLink }) => {
  return (
    <div className="flex justify-between mt-8">
      <Link
        href={prevLink}
        className="flex items-center border-2 rounded border-neutral-600 p-2"
      >
        <ArrowLeftIcon className="w-5 mr-2" />
        <span>Prev</span>
      </Link>
      <Link
        href={nextLink}
        className="flex items-center border-2 rounded border-neutral-600 p-2"
      >
        <span>Next</span>
        <ArrowRightIcon className="w-5 ml-2" />
      </Link>
    </div>
  )
}
