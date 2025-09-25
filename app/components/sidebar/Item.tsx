import Link from "next/link"
import clsx from "clsx"

export const Item = ({
  label,
  href,
  shouldHighlight,
  length,
}: {
  label: string
  href: string
  shouldHighlight: boolean
  length: number
}) => {
  return (
    <Link
      className={clsx(
        "w-full flex justify-between items-center border-2 border-gray-800 text-gray-800 px-1 py-0.5 hover:bg-gray-800 hover:text-white md:px-4 md:py-2 md:text-white md:hover:bg-gray-600 rounded-lg ease-in-out duration-300",
        {
          "bg-white md:bg-transparent": !shouldHighlight,
          "bg-gray-800 text-white md:bg-gray-600": shouldHighlight,
        }
      )}
      href={href}
    >
      <span className="block font-semibold">{label}</span>
      <span className="block md:bg-white md:text-gray-800 text-sm font-medium min-w-6 rounded-md text-center">
        {length}
      </span>
    </Link>
  )
}
