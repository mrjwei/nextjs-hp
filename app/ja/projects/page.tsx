import { ProjectCard } from "@/components/project-card"
import { WorkTrackFilter } from "@/components/work-track-filter.client"
import {
  getAllSortedWritings,
  getWorkTrackFacets,
  groupProjects,
} from "app/utils"
import { buildStandardMetadata } from "app/seo/metadata"
import { JaEmptyNotice } from "@/components/ja-empty-notice"

export const metadata = buildStandardMetadata({
  title: "プロジェクト",
  description:
    "選定したプロジェクト——実際の事業のために構築したアプライドAIシステムとプロダクトの仕事。",
  pathname: "/ja/projects",
  alternatePathname: "/projects",
  alternateLang: "en",
})

export const dynamic = "force-static"

export default async function ProjectsPage() {
  // One card per project; projects spanning several posts link to their
  // own page (/projects/[project]).
  const projects = groupProjects(getAllSortedWritings("ja"))
  const tracks = getWorkTrackFacets(projects)

  return (
    <div className="w-full max-w-[1120px] mx-auto px-6 md:px-8 py-24">
      <div className="mb-8">
        <span className="eyebrow">プロジェクト</span>
        <h1 className="mt-3 mb-2 text-3xl md:text-4xl font-semibold tracking-tight text-[var(--text-strong)]">
          プロジェクト
        </h1>
        <p className="text-lg text-[var(--text-muted)] mb-4">
          選定したプロジェクト——実際の事業のために構築したアプライドAIシステムとプロダクトの仕事。
        </p>
      </div>

      {projects.length === 0 ? (
        <JaEmptyNotice englishHref="/projects" englishLabel="英語版のプロジェクトを見る" />
      ) : (
        <>
          <WorkTrackFilter tracks={tracks} lang="ja" />
          <div className="grid grid-cols-12 gap-y-8 md:gap-8">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} lang="ja" />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
