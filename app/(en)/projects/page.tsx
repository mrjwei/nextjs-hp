import { ProjectCard } from "@/components/project-card"
import { WorkTrackFilter } from "@/components/work-track-filter.client"
import {
  getAllSortedWritings,
  getWorkTrackFacets,
  groupProjects,
} from "app/utils"
import { buildStandardMetadata } from "app/seo/metadata"

export const metadata = buildStandardMetadata({
  title: "Projects",
  description:
    "Selected projects — applied AI systems and product work shipped for real businesses.",
  pathname: "/projects",
  alternatePathname: "/ja/projects",
  alternateLang: "ja",
})

export const dynamic = "force-static"

export default async function ProjectsPage() {
  // One card per project; projects spanning several posts link to their
  // own page (/projects/[project]).
  const projects = groupProjects(getAllSortedWritings())
  const tracks = getWorkTrackFacets(projects)

  return (
    <div className="w-full max-w-[1120px] mx-auto px-6 md:px-8 py-24">
      <div className="mb-8">
        <span className="eyebrow">Projects</span>
        <h1 className="mt-3 mb-2 text-3xl md:text-4xl font-semibold tracking-tight text-[var(--text-strong)]">
          Projects
        </h1>
        <p className="text-lg text-[var(--text-muted)] mb-4">
          Applied AI systems and product work shipped for real businesses.
          Each one is written up in full under Posts.
        </p>
      </div>

      {projects.length === 0 ? (
        <div className="bg-[var(--surface-card)] border border-[var(--border-subtle)] shadow-xs rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-2 text-[var(--text-strong)]">
            No projects yet
          </h2>
          <p className="text-[var(--text-muted)]">
            Give a post a <code>project</code> ID in its frontmatter to have it
            appear here.
          </p>
        </div>
      ) : (
        <>
          <WorkTrackFilter tracks={tracks} />
          <div className="grid grid-cols-12 gap-y-8 md:gap-8">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
