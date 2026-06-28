import Link from "next/link"
import clsx from "clsx"

export const Item = ({
  label,
  href,
  shouldHighlight,
  length,
  shouldBeUppercase,
}: {
  label: string
  href: string
  shouldHighlight: boolean
  length: number
  shouldBeUppercase?: boolean
}) => {
  const formatTitleCase = (value: string) => {
    const trimmed = String(value ?? "").trim()
    if (!trimmed) return trimmed

    if (shouldBeUppercase) return trimmed.toUpperCase()

    const knownAcronyms = new Set([
      "ai",
      "api",
      "ci",
      "cd",
      "css",
      "dev",
      "html",
      "http",
      "https",
      "ios",
      "js",
      "ml",
      "mvp",
      "ui",
      "ux",
      "ts",
    ])

    return trimmed
      .replace(/[-_]+/g, " ")
      .split(/\s+/)
      .map((word) => {
        if (!word) return word
        if (/^[A-Z0-9]+$/.test(word)) return word

        const lower = word.toLowerCase()
        if (knownAcronyms.has(lower)) return lower.toUpperCase()

        return lower.charAt(0).toUpperCase() + lower.slice(1)
      })
      .join(" ")
  }

  const displayLabel = formatTitleCase(label)

  return (
    <Link
      className={clsx(
        "w-full flex justify-between items-center border border-neutral-200 md:border-transparent text-gray-800 px-1 py-0.5 hover:bg-gray-800 hover:text-white md:px-4 md:py-1.5 md:text-white md:hover:bg-gray-600 rounded-lg ease-in-out duration-300 focus:outline-none focus-visible:ring-neutral-900 focus-visible:ring-offset-2 focus-visible:ring-offset-white md:focus-visible:ring-white/70 md:focus-visible:ring-offset-neutral-900",
        {
          "bg-white md:bg-transparent": !shouldHighlight,
          "bg-gray-800 text-white md:bg-gray-600": shouldHighlight,
        }
      )}
      href={href}
    >
      <span className="block font-semibold">{displayLabel}</span>
      <span className="block md:bg-white md:text-gray-800 text-sm font-medium min-w-6 rounded-md text-center">
        {length}
      </span>
    </Link>
  )
}
