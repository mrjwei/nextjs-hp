import Link from "next/link"
import clsx from "clsx"

export const OutlinedButton = ({ link, children, className }: {link?: string, children: React.ReactNode, className?: any}) => {
  const baseClasses = "outline-btn relative border-2 border-neutral-800 hover:border-neutral-900 rounded-full px-6 py-2 inline-flex justify-center items-center z-0 font-medium text-neutral-900 transition-all duration-300 ease-in-out hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2"

  if (link) {
    return (
        <Link
          href={link}
          className={clsx(baseClasses, className)}
        >
          {children}
        </Link>
    )
  } else {
    return (
      <button
        type="button"
        className={clsx(baseClasses, className)}
        >
          {children}
        </button>
    )
  }
}
