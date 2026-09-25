import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// Short project ID (frontmatter `project`) shown on project cards and pages.
// With `href` (post pages) it links to the project page.
export function ProjectBadge({
  project,
  href,
  className,
}: {
  project: string
  href?: string
  className?: string
}) {
  if (href) {
    return (
      <Link
        href={href}
        className={cn(
          "inline-block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]",
          className
        )}
      >
        <Badge tone="solid" title={`Project: ${project}`} className="hover:bg-[var(--gray-700)] transition-colors">
          {project}
        </Badge>
      </Link>
    )
  }

  return (
    <Badge tone="solid" title={`Project: ${project}`} className={className}>
      {project}
    </Badge>
  )
}
