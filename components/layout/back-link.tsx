import Link from "next/link"

export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="text-sm font-medium text-[var(--accent-text)] hover:underline transition-colors whitespace-nowrap"
    >
      {label}
    </Link>
  )
}
