import { WorkCard } from "@/components/work-card"
import { WorkTrackFilter } from "@/components/work-track-filter.client"
import {
  getAllSortedWritings,
  getWorkTrackFacets,
  isProject,
  sortProjects,
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
  const work = sortProjects(
    getAllSortedWritings().filter((w) => isProject(w.metadata))
  )
  const tracks = getWorkTrackFacets(work)

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

      {work.length === 0 ? (
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
            {work.map((item) => (
              <WorkCard
                key={item.slug}
                work={item}
                wrapperProps={{ "data-work-track": item.metadata.track }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
