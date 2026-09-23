"use client"

import { ArrowIcon } from "@/components/footer"
import { TrackedLink } from "@/components/tracked-link"

const className =
  "inline-flex items-center gap-1.5 transition-colors text-[var(--accent-text)] hover:underline mx-1"

function eventForHref(href: string): string | null {
  if (href.startsWith("mailto:")) return "contact_click"
  if (href.startsWith("/cv/")) return "cv_download"
  return null
}

export function ExtLink({ href, children }: { href: string; children: React.ReactNode }) {
  const eventName = eventForHref(href)

  if (!eventName) {
    return (
      <a className={className} rel="noopener noreferrer" target="_blank" href={href}>
        <ArrowIcon />
        <span>{children}</span>
      </a>
    )
  }

  return (
    <TrackedLink
      className={className}
      rel="noopener noreferrer"
      target="_blank"
      href={href}
      eventName={eventName}
    >
      <ArrowIcon />
      <span>{children}</span>
    </TrackedLink>
  )
}
