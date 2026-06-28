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
        "w-full flex justify-between items-center gap-2 border border-[var(--border-subtle)] px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-150 ease-[var(--ease-out)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]",
        shouldHighlight
          ? "bg-[var(--accent-subtle)] border-[var(--accent-border)] text-[var(--accent-text)]"
          : "bg-[var(--surface-card)] text-[var(--text-body)] hover:bg-[var(--surface-hover)] hover:border-[var(--border-default)]"
      )}
      href={href}
    >
      <span className="block">{displayLabel}</span>
      <span
        className={clsx(
          "block text-xs font-mono min-w-6 rounded-sm text-center px-1",
          shouldHighlight
            ? "text-[var(--accent-text)]"
            : "text-[var(--text-subtle)]"
        )}
      >
        {length}
      </span>
    </Link>
  )
}
