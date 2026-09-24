import { WorkCard } from "@/components/work-card"
import { WorkTrackFilter } from "@/components/work-track-filter.client"
import {
  getAllSortedWritings,
  getWorkTrackFacets,
  isProject,
  sortProjects,
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
  const work = sortProjects(
    getAllSortedWritings("ja").filter((w) => isProject(w.metadata))
  )
  const tracks = getWorkTrackFacets(work)

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

      {work.length === 0 ? (
        <JaEmptyNotice englishHref="/projects" englishLabel="英語版のプロジェクトを見る" />
      ) : (
        <>
          <WorkTrackFilter tracks={tracks} lang="ja" />
          <div className="grid grid-cols-12 gap-y-8 md:gap-8">
            {work.map((item) => (
              <WorkCard
                key={item.slug}
                work={item}
                lang="ja"
                wrapperProps={{ "data-work-track": item.metadata.track }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
