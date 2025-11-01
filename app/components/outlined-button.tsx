import Link from "next/link"
import clsx from "clsx"

export const OutlinedButton = ({ link, children, className }: {link?: string, children: React.ReactNode, className?: any}) => {
  if (link) {
    return (
        <Link
          href={link}
          className={clsx("outline-btn relative border-2 border-gray-800 rounded-full px-4 py-1 inline-flex justify-center items-center z-0", className)}
        >
          {children}
        </Link>
    )
  } else {
    return (
      <button
        type="button"
        className={clsx("outline-btn relative border-2 border-gray-800 rounded-full px-4 py-1 inline-flex justify-center items-center z-0", className)}
        >
          {children}
        </button>
    )
  }
}
