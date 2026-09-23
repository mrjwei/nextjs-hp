"use client"

import Link from "next/link"
import type { ComponentProps, MouseEvent } from "react"
import { event } from "app/analytics"

type TrackedLinkProps = ComponentProps<typeof Link> & {
  eventName: string
  eventParams?: Record<string, unknown>
}

export function TrackedLink({
  eventName,
  eventParams,
  onClick,
  ...props
}: TrackedLinkProps) {
  return (
    <Link
      {...props}
      onClick={(e: MouseEvent<HTMLAnchorElement>) => {
        event(eventName, eventParams)
        onClick?.(e)
      }}
    />
  )
}
