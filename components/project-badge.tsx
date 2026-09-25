import { Badge } from "@/components/ui/badge"

// Short project ID (frontmatter `project`) shown on project cards and pages.
export function ProjectBadge({
  project,
  className,
}: {
  project: string
  className?: string
}) {
  return (
    <Badge tone="solid" title={`Project: ${project}`} className={className}>
      {project}
    </Badge>
  )
}
