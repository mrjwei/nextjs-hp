import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// Short project ID (frontmatter `project`) shown on project cards and pages.
// Keeps the design-system badge but preserves the ID's own casing.
export function ProjectBadge({
  project,
  className,
}: {
  project: string
  className?: string
}) {
  return (
    <Badge
      tone="accent"
      title={`Project: ${project}`}
      className={cn("normal-case shadow-xs", className)}
    >
      {project}
    </Badge>
  )
}
