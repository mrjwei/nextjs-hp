import { notFound } from "next/navigation"
import { ProjectView } from "@/components/project-view"
import { getAllSortedWritings, groupProjects } from "app/utils"
import { buildStandardMetadata } from "app/seo/metadata"

export const dynamic = "force-static"
export const dynamicParams = false

function getProject(slug: string, lang: "en" | "ja" = "ja") {
  return groupProjects(getAllSortedWritings(lang)).find((p) => p.slug === slug)
}

export function generateStaticParams() {
  return groupProjects(getAllSortedWritings("ja")).map((p) => ({ project: p.slug }))
}

export function generateMetadata({ params }) {
  const project = getProject(params.project)
  if (!project) return

  const hasOtherLang = !!getProject(params.project, "en")
  return buildStandardMetadata({
    title: `${project.id} — プロジェクト`,
    description: project.lead.metadata.summary,
    pathname: `/ja/projects/${project.slug}`,
    image: project.lead.metadata.image,
    alternatePathname: hasOtherLang ? `/projects/${project.slug}` : undefined,
    alternateLang: hasOtherLang ? "en" : undefined,
  })
}

export default function ProjectPage({ params }) {
  const project = getProject(params.project)
  if (!project) notFound()

  return <ProjectView project={project} lang="ja" />
}
