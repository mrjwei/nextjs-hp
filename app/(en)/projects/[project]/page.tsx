import { notFound } from "next/navigation"
import { ProjectView } from "@/components/project-view"
import { getAllSortedWritings, groupProjects } from "app/utils"
import { buildStandardMetadata } from "app/seo/metadata"

export const dynamic = "force-static"
export const dynamicParams = false

function getProject(slug: string, lang: "en" | "ja" = "en") {
  return groupProjects(getAllSortedWritings(lang)).find((p) => p.slug === slug)
}

export function generateStaticParams() {
  return groupProjects(getAllSortedWritings()).map((p) => ({ project: p.slug }))
}

export function generateMetadata({ params }) {
  const project = getProject(params.project)
  if (!project) return

  const hasOtherLang = !!getProject(params.project, "ja")
  return buildStandardMetadata({
    title: `${project.id} — Projects`,
    description: project.lead.metadata.summary,
    pathname: `/projects/${project.slug}`,
    image: project.lead.metadata.image,
    alternatePathname: hasOtherLang ? `/ja/projects/${project.slug}` : undefined,
    alternateLang: hasOtherLang ? "ja" : undefined,
  })
}

export default function ProjectPage({ params }) {
  const project = getProject(params.project)
  if (!project) notFound()

  return <ProjectView project={project} />
}
